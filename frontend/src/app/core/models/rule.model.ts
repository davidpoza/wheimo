import { Tag } from './tag.model';

export type RuleType = 'regex' | 'equality' | 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'isExpense' | 'isReceipt';

export interface Rule {
  id: number;
  name: string;
  type: RuleType;
  value: string;
  tags: Tag[];
}
