import { Api, ApiListResponse } from '../base/Api';
import { IOrder, IOrderComplete, IItem } from '../../types/index';

export interface IMarketApi {
	getItemList: () => Promise<IItem[]>;
	orderItem: (order: IOrder) => Promise<IOrderComplete>;
}

export class MarketApi extends Api implements IMarketApi {
	constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	getItemList(): Promise<IItem[]> {
		return this.get('/product').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderItem(order: IOrder): Promise<IOrderComplete> {
		return this.post('/order', order).then((data: IOrderComplete) => data);
	}
}
