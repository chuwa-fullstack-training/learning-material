export type Category = 'health' | 'mindfulness' | 'productivity';

export interface Habit {
  id: string;
  name: string;
  category: Category;
  checkIns: string[]; // 'YYYY-MM-DD'
}
