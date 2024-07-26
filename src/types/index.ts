export interface ISupply {
	id: string;
	name: string;
    about: string;
    price: number | null;
    category: string;
	image: string;
}

export interface IOrder {
    email: string;
    phone: string;
    payment: string;
    address: string;
    supplies: string[];
    total: number | null;
}

export interface ICartModal {
    supplies: TCartSupply[];
    addSupply(supplies: TCartSupply): void;
    removeSupply(supplies: TCartSupply): void;
    getTotalPrice(): number | null;
    clearCart(): void;
}

export interface IOrderComplete{
    id: string;
    total: number | null;
}

export interface ISuppliesData {
    supplies: ISupply[];
    preview: string | null;
    getAllSupplies(supplies: ISupply[]): ISupply;
    getPreview(supplies: ISupply): ISupply;
}

export interface IOrderData {
    order: IOrder[];
    getUserContacts(): TOrderContactForm;
    getDeliveryDetails(): TOrderDeliveryForm;
    setUserContacts(contactsData: IOrder): void;
    setDeliveryDetails(deliveryData: IOrder): void;
}

export type TSupplyCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type TCartSupply = Pick<ISupply, 'id' | 'name' | 'price'>;

export type TPaymentMethod = Pick<IOrder, 'payment'>;
export type TOrderDeliveryForm = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactForm = Pick<IOrder, 'email' | 'phone'>;
export type TOrderCompleteForm = Pick<IOrder, 'total'>;

export type TErrorDeliveryForm = Partial<Record<keyof TOrderDeliveryForm, string>>;
export type TErrorContactForm = Partial<Record<keyof TOrderContactForm, string>>;