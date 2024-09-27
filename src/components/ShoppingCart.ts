import { IShoppingCart } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { AppState } from './AppState';

export class ShoppingCart extends Component<IShoppingCart> {
	protected _list: HTMLElement;
	protected _totalSum: HTMLElement;
	protected _buttonElement: HTMLButtonElement;
    private appState: AppState;

	constructor(container: HTMLElement, protected events: IEvents, appState: AppState) {
		super(container);
        this.appState = appState;

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._totalSum = this.container.querySelector('.basket__price');
		this._buttonElement = this.container.querySelector('.basket__button');

		this.items = [];
        this.setupEventListeners();
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
        this.updateTotalSum();
    }

    updateTotalSum() {
        const total = this.appState.getTotalSum(); // Получаем сумму, которая вычисляется через AppState
        this.setText(this._totalSum, `${total} синапсов`);
    }
}
