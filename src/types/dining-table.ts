export interface DiningTable {
  id: string;
  name: string;
  seats: number;
  sortOrder: number;
}

export type DiningTableInput = Pick<DiningTable, 'name' | 'seats'>;
