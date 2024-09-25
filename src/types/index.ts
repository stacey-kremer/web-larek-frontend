export interface IItem {
	id: string,
	title: string,
    description: string,
    price: number | null,
    category: string,
	image: string,
    index: string,
    buttonText: string;
    count: any;
}

export interface IShoppingCart {
    items: HTMLElement[];
    total: number;
}

export interface IDeliveryForm {
    payment: string,
    address: string,
}

export interface IContactForm {
    email: string,
    phone: string,
}

export interface IOrder extends IDeliveryForm, IContactForm {
}

export interface IOrderComplete{
	total(total: any): unknown;
    id: string,
}

export interface IAppState {
	catalog: IItem[];
	basket: IItem[];
	order: IOrder | null;
    preview: string | null;
    delivery: IDeliveryForm | null;
    contacts: IContactForm | null;
}

export type TErrorForm = Partial<Record<keyof IOrder, string>>;