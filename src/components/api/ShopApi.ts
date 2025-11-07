import { IApi, IProduct, IOrderData, IApiResponse } from '../../types';

export class ShopApi {
    private baseApi: IApi;

    constructor(baseApi: IApi) {
        this.baseApi = baseApi;
    }

    async getProductList(): Promise<IProduct[]> {
        const response = await this.baseApi.get<IApiResponse>('/product/');
        return response.items;
    }

    async submitOrder(orderData: IOrderData): Promise<object> {
        return await this.baseApi.post('/order/', orderData);
    }
}