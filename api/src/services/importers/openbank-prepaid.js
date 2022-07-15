import fetch from 'node-fetch';
import dayjs from 'dayjs';

export default class OpenbankPrepaidImporter {

  /**
   * @param {string} accessId - national document identity e.g.: 55667788Y
   * @param {string} accessPassword
   */
  static async login(accessId, accessPassword) {
    try {
      const res = await fetch('https://api.openbank.es/authenticationcomposite/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify ({
          document: accessId,
          documentType: 'N',
          password: accessPassword,
          force: true
        })
      });
      const json = await res.json();
      return json.tokenCredential;
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {string} token - obtain it from login method
   * @param {string} from - format AAAA-MM-DD
   * @param {string} contract - number DDDDDDD format
   * @param {string} product - number with format DDD
   * @param {string} pan - card number with format XXXX XXXX XXXX XXXX
   */
  static async fetchTransactions({ token, from, contract, product, pan }) {
    try {
      const detailsUrl = 'https://api.openbank.es/wallet/tarjeta-prepago';
      const transactionsUrl = 'https://api.openbank.es/my-cards/tarjetas/movimientos-categoria';
      const detailRes = await fetch(detailsUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'openbankauthtoken': token,

        },
        body: JSON.stringify({
          numTarjeta: pan,
          producto: product,
          numeroContrato: contract,
        })
      });
      const details = await detailRes.json();
      const transactionsRes = await fetch(transactionsUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'openbankauthtoken': token,

        },
        body: JSON.stringify({
          pan,
          producto: product,
          numeroContrato: contract,
          fechaDesde: from,
          fechaHasta: dayjs().format('YYYY-MM-DD')
        })
      });
      const json = await transactionsRes.json();
      if (json.error) {
        if (json.error === 'XX9511') {
          const notFound = new Error('no transactions found');
          notFound.name = 'not-found';
          throw new Error(notFound);
        }
        throw new Error(json.error);
      }

      return ({
        balance: details.datosTarjeta.saldoActualPrepago.importe,
        transactions: json.lista.movimientos.map((t) => {
          return ({
            categories: t.categorias.map((c) => {
              return ({
                online: c.online,
                category: c.category,
                subcategory: c.subcategory
              });
            }),
            description: 'Internet shopping',
            emitterName: t.impMovimiento.importe > 0
              ? t.txtCajero
              : undefined,
            receiverName: t.impMovimiento.importe < 0
              ? t.txtCajero
              : undefined,
            valueDate: t.fechaMovimiento,
            transactionDate: t.fechaOperacion,
            amount: t.impMovimiento.importe,
            currency: t.impMovimiento.divisa,
            balance: 0.0,
          });
        }),
        holder: details.datosTarjeta.nomTitular.trim(),
      });
    } catch (err) {
      throw err;
    }
  }
}