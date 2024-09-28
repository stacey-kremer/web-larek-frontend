import { IShoppingCart } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class ShoppingCart extends Component<IShoppingCart> {
	protected _list: HTMLElement;
	protected _totalSum: HTMLElement;
	protected _buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._totalSum = this.container.querySelector('.basket__price');
		this._buttonElement = this.container.querySelector('.basket__button');

		this.items = [];
        this.setupEventListeners();

        this.events.on('total:changed', this.updateTotalSum.bind(this));
	}

    setupEventListeners(): void {
        this._buttonElement?.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    createMessage(): HTMLParagraphElement {
        return createElement<HTMLParagraphElement>('p', {
            textContent: 'Ваша корзина пуста',
        });
    }

	set items(items: HTMLElement[]) {
        this._list.replaceChildren(
            ...items.length ? items : [this.createMessage()]
        );
        this.setDisabled(this._buttonElement, items.length === 0);
    }

    updateTotalSum(total: number) {
        this.setText(this._totalSum, `${total} синапсов`);
    }
}
