import fetch from 'node-fetch';


export default class OpenbankImporter {

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
   */
  static async fetchTransactions(token, from, contract, product) {
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
        balance: json.movimientos ? json.movimientos[0].saldo.importe : 0.0,
        transactions: json.movimientos.map((t) => {
          const [emitter, concept] = t.conceptoTabla.trim().split(', CONCEPTO ');
          return ({
            receipt: t.recibo,
            categories: t.categorias.map((c) => {
              return ({
                online: c.online,
                category: c.category,
                subcategory: c.subcategory
              });
            }),
            description: concept,
            emitterName: emitter.replace('TRANSFERENCIA DE ', ''),
            valueDate: t.fechaValor,
            transactionDate: t.fechaOperacion,
            amount: t.importe.importe,
            currency: t.importe.divisa,
          });
        }),
        holder: json.titular.trim(),
      });
    } catch (err) {
      throw err;
    }
  }
}