import dayjs from 'dayjs';

const initialFilter = {
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

const constants = {
  initialFilter
}

export default constants;