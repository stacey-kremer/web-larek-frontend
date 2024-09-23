import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IContactForm } from '../../types';
import { Form } from './Form';

export class ContactForm extends Form<IContactForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			container
		);
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}
}
