export interface IItem {
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
}

export interface IShoppingCart {
    items: TCartItem[];
    getSupplies(): TCartItem[];
    isEmpty(): boolean; 
    addItem(items: TCartItem): void;
    removeItem(items: TCartItem): void;
    getTotalPrice(): number | null;
    clearCart(): void;
}

export interface IOrderComplete{
    id: string;
    total: number | null;
}

export interface IItemsData {
    items: IItem[];
    preview: string | null;
    getAllItems: IItem;
    getPreview(items: IItem): IItem;
}

export interface IOrderData {
    order: IOrder[];
    getUserContacts(): TOrderContactForm;
    getDeliveryDetails(): TOrderDeliveryForm;
    setUserContacts(contactsData: IOrder): void;
    setDeliveryDetails(deliveryData: IOrder): void;
}

export type TItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
export type TCartItem = Pick<IItem, 'id' | 'name' | 'price'>;

export type TPaymentMethod = Pick<IOrder, 'payment'>;
export type TOrderDeliveryForm = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContactForm = Pick<IOrder, 'email' | 'phone'>;

export type TErrorDeliveryForm = Partial<Record<keyof TOrderDeliveryForm, string>>;
export type TErrorContactForm = Partial<Record<keyof TOrderContactForm, string>>;