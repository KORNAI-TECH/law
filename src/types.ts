export type ClientStatus = 'Новый' | 'В работе' | 'Закрыт';

export interface Client {
  id: string;
  name: string;
  phone: string;
  status: ClientStatus;
  createdAt: string;
}
