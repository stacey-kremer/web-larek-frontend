import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Form } from './Form';
import { IDeliveryForm } from '../../types';
import { IItemActions } from '../common/Card';

export const paymentMethod: { [key: string]: string } = {
    "card": "online",
    "cash": "cash",
}

export class DeliveryForm extends Form<IDeliveryForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents, actions: IItemActions) {
        super(container, events)

        this._addressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', container);
        this._card = ensureElement<HTMLButtonElement>('#card', this.container);
        this._cash = ensureElement<HTMLButtonElement>('#cash', this.container);
        
        this._card.classList.add('button_alt-active');

        if (actions.onClick) {
            [this._card, this._cash].forEach(element => 
                element.addEventListener('mouseup', actions.onClick)
            );
        }
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    switchButtons() {
        [this._card, this._cash].forEach(element => 
            element.classList.toggle('button_alt-active')
        );
    }
};
