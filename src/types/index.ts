export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

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

/* Данные покупателя в процессе оформления: способ оплаты может быть ещё не выбран. */
export type TBuyerData = Omit<IBuyer, 'payment'> & {
    payment: TPayment | null;
};

/* Ошибки валидации: ключ есть только у поля с ошибкой, значение — текст ошибки. */
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

/* Ответ сервера на запрос каталога товаров. */
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

/* Данные заказа, отправляемые на сервер. */
export interface IOrderRequest extends IBuyer {
    total: number;
    items: IProduct['id'][];
}

/* Ответ сервера, подтверждающий оформление заказа. */
export interface IOrderResponse {
    id: string;
    total: number;
}
