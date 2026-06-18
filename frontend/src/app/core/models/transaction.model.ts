import { Tag } from './tag.model';
import { Attachment } from './attachment.model';

export interface Transaction {
  id: number;
  importId: string;
  emitterName: string;
  receiverName: string;
  description: string;
  comments: string;
  assCard: string;
  amount: number;
  currency: string;
  date: string;
  valueDate: string;
  balance: number;
  receipt: boolean;
  draft: boolean;
  favourite: boolean;
  accountId: number;
  tags: Tag[];
  attachments: Attachment[];
}

export interface TransactionFilters {
  accountId?: number;
  from?: string;
  to?: string;
  tags?: number[];
  search?: string;
  min?: number;
  max?: number;
  operationType?: 'expense' | 'income';
  isFav?: boolean;
  isDraft?: boolean;
  hasAttachments?: boolean;
  limit?: number;
  offset?: number;
  sort?: string;
}

export interface TransactionPage {
  data: Transaction[];
  total: number;
}

export interface TagExpense {
  tagId: number;
  tagName: string;
  amount: number;
}
