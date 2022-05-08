import pickBy from 'lodash.pickby';
import { Container } from 'typedi';
import AES from 'crypto-js/aes.js';
import NordigenClient from 'nordigen-node';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';

export default class NordigenService {
  constructor() {
    this.sequelize = Container.get('sequelizeInstance');
    this.logger = Container.get('loggerInstance');
    this.getLink = this.getLink.bind(this);

  }

  async getLink(accessId, accessKeyEncrypted, institutionId) {
    const descryptedAccessKey = AES.decrypt(
      accessKeyEncrypted,
      config.aesPassphrase
    ).toString(CryptoJS.enc.Utf8);

    const client = new NordigenClient({
      secretId: accessId,
      secretKey: descryptedAccessKey
    });

    const tokenData = await client.generateToken();
    const init = await client.initSession({
      redirectUrl: "https://wheimo.davidinformatico.com",
      institutionId: institutionId,
      referenceId: uuidv4()
    });

    return {
      token: tokenData.access,
      link: init.link,
      requisitionId: init.id,
    };
  }

  async getAccounts(accessId, accessKeyEncrypted, token, requisitionId) {
    const descryptedAccessKey = AES.decrypt(
      accessKeyEncrypted,
      config.aesPassphrase
    ).toString(CryptoJS.enc.Utf8);

    const client = new NordigenClient({
      secretId: accessId,
      secretKey: descryptedAccessKey
    });

    client.token = token;

    const requisitionData = await client.requisition.getRequisitionById(requisitionId);
    return requisitionData;
  }

  async getAccountDetails(accessId, accessKeyEncrypted, token, nordigenAccountId, includeTransactions) {
    let transactions;
    const descryptedAccessKey = AES.decrypt(
      accessKeyEncrypted,
      config.aesPassphrase
    ).toString(CryptoJS.enc.Utf8);

    const client = new NordigenClient({
      secretId: accessId,
      secretKey: descryptedAccessKey
    });

    client.token = token;

    const account = client.account(nordigenAccountId);

    const metadata = await account.getMetadata();
    const balances = await account.getBalances();
    const details = await account.getDetails();

    if (includeTransactions) transactions = await account.getTransactions();

    return {
      metadata,
      balances,
      details,
      transactions
    }
  }
};
