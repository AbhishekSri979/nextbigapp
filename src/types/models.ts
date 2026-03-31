export interface User {
  id: number | string;
  name: string;
  email?: string;
}

export interface Product {
  id: number | string;
  title: string;
  price?: number;
}
