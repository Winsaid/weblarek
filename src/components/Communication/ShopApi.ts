import { IApi, IOrderRequest, IOrderResponse, IProductsResponse } from '../../types';
import { apiEndpoints } from '../../utils/constants';

export class ShopApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>(apiEndpoints.products);
    }

    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>(apiEndpoints.order, order);
    }
}
