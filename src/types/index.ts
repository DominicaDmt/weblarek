export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TPayment = string;

export interface IBuyerValidationResult {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IApiResponse {
  total: number;
  items: IProduct[];
}

// Типы для событий
export type EventName = string | RegExp;

export interface ICatalogItemData {
  item: IProduct;
}

export interface IBasketItemData {
  item: IProduct;
  index?: number;
}

export interface IModalData {
  content: HTMLElement;
}

export interface IFormFieldData {
  field: string;
  value: string;
}

export interface IOrderSubmitData {
  payment: string;
  address: string;
}

export interface IContactsSubmitData {
  email: string;
  phone: string;
}

export interface ISuccessData {
  total: number;
}