import dayjs from 'dayjs';

const INITIAL_FILTER = {
  operationType: 'all',
  accountId: undefined,
  infLimit: '',
  supLimit: '',
  tags: [],
  tagIds: [],
  startDate: dayjs().subtract(3, 'month').toDate(),
  endDate: new Date(),
  search: undefined,
  accountIdKey: 'AccountId',
  isFav: false,
  hasAttachments: false,
};

const BANK_ID_NORDIGEN = 'nordigen';
const BANK_ID_OPBKPREPAID = 'opbkprepaid';

const constants = {
  INITIAL_FILTER,
  BANK_ID_NORDIGEN,
  BANK_ID_OPBKPREPAID
}

export default constants;