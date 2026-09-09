export interface Workspace {
  id: string;
  name: string;
  tariffId: string;
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  currency: string;
}
