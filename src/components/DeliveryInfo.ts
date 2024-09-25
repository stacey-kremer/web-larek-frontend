import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { Form } from '../components/common/Form';
import { IDeliveryForm } from '../types';
import { IItemActions } from './Card';

export const paymentMethod: { [key: string]: string } = {
	card: 'online',
	cash: 'cash',
};

export class DeliveryForm extends Form<IDeliveryForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _selectedPaymentMethod: string = paymentMethod.card;

	constructor(
		container: HTMLFormElement,
		events: IEvents,
		actions: IItemActions
	) {
		super(container, events);

		this._addressInput = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			container
		);

		this._card = ensureElement<HTMLButtonElement>('#card', this.container);
		this._cash = ensureElement<HTMLButtonElement>('#cash', this.container);

		this._card.classList.add('button_alt-active');

		if (actions.onClick) {
			[this._card, this._cash].forEach((element) =>
				element.addEventListener('mouseup', this.handlePaymentClick.bind(this))
			);
		}
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	handlePaymentClick(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;
		if (target === this._card) {
			this.selectPaymentMethod(paymentMethod.card);
		} else if (target === this._cash) {
			this.selectPaymentMethod(paymentMethod.cash);
		}
	}

	selectPaymentMethod(method: string) {
		this._selectedPaymentMethod = method;
		this.updatePaymentButtons();
		this.events.emit('payment:changed', { method });
	}

	updatePaymentButtons() {
		this._card.classList.toggle('button_alt-active', this._selectedPaymentMethod === paymentMethod.card);
		this._cash.classList.toggle('button_alt-active', this._selectedPaymentMethod === paymentMethod.cash);
	}
}