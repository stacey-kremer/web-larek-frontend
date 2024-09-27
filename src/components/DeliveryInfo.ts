import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { Form } from '../components/common/Form';
import { IDeliveryForm } from '../types';
import { IItemActions } from './Card';
import { AppState } from './AppState';

export const paymentMethod: { [key: string]: string } = {
	card: 'online',
	cash: 'cash',
};

export class DeliveryForm extends Form<IDeliveryForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

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
		this.setInputValue(this._addressInput, value);
	}

	handlePaymentClick(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;
		const method = target === this._card ? paymentMethod.card : paymentMethod.cash;
		this.events.emit('payment:changed', { method });
	}

	updatePaymentButtons(selectedMethod: string) {
		this.toggleClass(this._card, 'button_alt-active', selectedMethod === paymentMethod.card); 
		this.toggleClass(this._cash, 'button_alt-active', selectedMethod === paymentMethod.cash); 
	}

	updatePaymentButtonsFromState(appState: AppState) {
		const selectedMethod = appState.order.payment; 
		this.updatePaymentButtons(selectedMethod);
	}
}