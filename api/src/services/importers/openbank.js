import fetch from 'node-fetch';


export default class OpenBankImporter {
  async login(accessId, accessPassword) {
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

  async fetchTransactions(token, from, contract, product) {
    console.log(token)
    try {
      let url = 'https://api.openbank.es/my-money/cuentas/movimientos';
      url += `?fechaDesde=${from}&numeroContrato=${contract}&producto=${product}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'openbankauthtoken': token,
        },
      });
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return ({
        balance: json.movimientos[0].saldo.importe,
        transactions: json.movimientos.map((t) => {
          return ({
            description: t.conceptoTabla,
            valueDate: t.fechaValor,
            transactionDate: t.fechaOperacion,
            amount: t.importe.importe,
          });
        }),
        holder: json.titular,
      });
    } catch (err) {
      throw err;
    }
  }
}

const instance = new OpenBankImporter();

const token = await instance.login('xxxx', 'xxx');
if (token) {
  console.log(await instance.fetchTransactions(token, '2019-01-14', 'xxxx', 'xxx'));
}