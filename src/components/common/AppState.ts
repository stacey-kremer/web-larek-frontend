import { Model } from '../base/Model';
import {
	TErrorForm,
	IAppState,
	IItem,
	IOrder,
	IDeliveryForm,
	IContactForm,
} from '../../types';

export type CatalogChanged = {
	catalog: IItem[];
};

export class AppState extends Model<IAppState> {
	basket: IItem[] = [];
	catalog: IItem[] = [];
	formErrors: TErrorForm = {};
	preview: string | null = null;

	order: IOrder = {
		items: [],
		total: 0,
		address: '',
		payment: 'online',
		email: '',
		phone: '',
	};

	setItems(items: IItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { cards: this.catalog });
	}

	setPreview(item: IItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	updateCart(item: IItem, action: 'add' | 'remove') {
		if (action === 'add') {
			if (!this.basket.includes(item)) {
				this.basket.push(item);
			}
		} else {
			this.basket = this.basket.filter((elem) => elem !== item);
		}
		this.emitChanges('basket:changed', this.basket);
		this.emitChanges('count:changed', this.basket);
	}

	addItemToCart(item: IItem) {
		this.updateCart(item, 'add');
	}

	removeItemFromCart(item: IItem) {
		this.updateCart(item, 'remove');
	}

	clearCart() {
		this.basket = [];
		this.emitChanges('basket:changed', this.basket);
		this.emitChanges('count:changed', this.basket);
	}

	getTotalSum() {
		return this.basket.reduce((total, item) => {
			return total + (item.price || 0);
		}, 0);
	}

	setDeliveryField(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
		if (this.validateDeliveryForm()) {
			this.events.emit('delivery:changed', this.order);
		}
	}

	setContactField(field: keyof IContactForm, value: string) {
		this.order[field] = value;
		this.validateContactForm()
			? this.events.emit('ordersContacts:changed', this.order)
			: false;
	}

	validateDeliveryForm() {
		const error: typeof this.formErrors = {};
		const addressPattern = /^[а-яА-Яa-zA-Z0-9.,!?:;\-()'" ]+$/i;
		const paymentPattern = /^(cash|card)$/;

		if (!addressPattern.test(this.order.address) || !this.order.address) {
			error.address =
				'Укажите корректный адрес: вы можете использовать русские и английские буквы, цифры, знаки препинания и пробелы';
		}

		if (!paymentPattern.test(this.order.payment) && !this.order.payment) {
			error.payment = 'Укажите корректный способ оплаты';
		}

		this.formErrors = error;
		this.events.emit('deliveryForm:changed', this.formErrors);
		return Object.keys(error).length === 0;
	}

	validateContactForm() {
		const error: typeof this.formErrors = {};
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const phonePattern = /^([+]?[0-9\s-\(\)]{11,14})*$/i;

		if (!emailPattern.test(this.order.email) || !this.order.email) {
			error.email = 'Укажите корректный email в формате email@email.com';
		}

		if (!phonePattern.test(this.order.phone) || !this.order.phone) {
			error.phone = 'Укажите корректный номер телефона в формате +79ХХХХХХХХХ';
		}

		this.formErrors = error;
		this.events.emit('contactForm:changed', this.formErrors);
		return Object.keys(error).length === 0;
	}

	clearOrder() {
		Object.assign(this.order, {
			items: [],
			total: 0,
			address: '',
			payment: '',
			email: '',
			phone: '',
		});
	}
}
