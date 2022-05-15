import fetch from 'node-fetch';
import { Container } from 'typedi';

export default class NordigenImporter {

  /**
   * @param {string} accessId - national document identity e.g.: 55667788Y
   * @param {string} accessPassword
   */
  static async login(accessId, accessPassword) {
    const nordigenService = Container.get('nordigenService');
    try {
      const data = await nordigenService.generateToken(accessId, accessPassword);
      return data.token;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {string} token - obtain it from login method
   * @param {string} from - format AAAA-MM-DD
   */
  static async fetchTransactions({ accessId, decryptedPassword, token, from, settings, currentBalance }) {
    const nordigenService = Container.get('nordigenService');
    const loggerInstance = Container.get('loggerInstance');

    const conceptSeparator = /,? CONCEPTO /;
    const hasReceiver = /(BIZUM|TRANSFERENCIA) ([A-Z]* )?A FAVOR DE/;
    const hasEmitter = /(BIZUM|TRANSFERENCIA) ([A-Z]* )?DE /;
    const withCard = /,? CON LA TARJETA : ([0-9X]{16})/;
    try {
      const json = await nordigenService.getAccountDetails({
        accessId,
        decryptedPassword,
        token,
        nordigenAccountId: settings?.nordigenAccountId,
        includeTransactions: true,
      });

      const transactions = json.transactions?.booked?.map((t) => {
        let concept = '';
        let emitter = '';
        let receiver = '';
        let assCard = '';
        if (hasReceiver.test(t.remittanceInformationUnstructured)) {
          [receiver, concept] = t.remittanceInformationUnstructured.trim().split(conceptSeparator);
        } else if (hasEmitter.test(t.remittanceInformationUnstructured)) {
          [emitter, concept] = t.remittanceInformationUnstructured.trim().split(conceptSeparator);
        } else if (withCard.test(t.remittanceInformationUnstructured)) {
          assCard = t.remittanceInformationUnstructured.match(withCard)[1];
          [concept] = t.remittanceInformationUnstructured.trim().split(withCard);
        } else {
          concept = t.remittanceInformationUnstructured.trim();
        }
        return ({
          receipt: t.recibo,
          description: concept,
          assCard,
          emitterName: emitter.replace(hasEmitter, ''),
          receiverName: receiver.replace(hasReceiver, ''),
          valueDate: t.valueDate,
          transactionDate: t.bookingDate,
          amount: parseFloat(t.transactionAmount.amount),
          currency: t.transactionAmount.currency,
          balance: 0.0,
        });
      });

      // calculate balances per transaction. Nordingen does not offer this for free
      // IMPORTANT: first we need to manually setup the balance of the account
      // at the moment of the first imported transaction
      for (let i = transactions?.length - 1; i >= 0; i--) {
        if (i === (transactions.length - 1)) {
          transactions[i].balance = currentBalance;
        } else {
          transactions[i].balance = transactions[i+1]?.balance + transactions[i].amount;
        }

      }

      return ({
        balance: transactions?.[0]?.balance ||  0.0,
        transactions,
      });
    } catch (err) {
      throw err;
    }
  }
}