import { Tag } from './tag.model';

export type RuleType = 'description' | 'equality' | 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'isExpense' | 'isReceipt';

export interface Rule {
  id: number;
  name: string;
  type: RuleType;
  value: string;
  tags: Tag[];
}
