import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';
import { Form } from '../components/common/Form';
import { IDeliveryForm } from '../types';

export class DeliveryForm extends Form<IDeliveryForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._addressInput = ensureElement<HTMLInputElement>(
			'.form__input[name=address]',
			container
		);
		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
		this.toggleClass(this._card, 'button_alt-active'); 

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this.toggleClass(this._cash, 'button_alt-active', true);
				this.toggleClass(this._card, 'button_alt-active', false);
				this.notifyFieldChange('payment', 'cash');
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this.toggleClass(this._card, 'button_alt-active', true);
				this.toggleClass(this._cash, 'button_alt-active', false);
				this.notifyFieldChange('payment', 'card');
			});
		}
	}

	set address(value: string) {
		this.setInputValue(this._addressInput, value);
	}

	resetPaymentButtons() {
	this.toggleClass(this._cash, 'button_alt-active', false);
    this.toggleClass(this._card, 'button_alt-active', false);
	}
}
