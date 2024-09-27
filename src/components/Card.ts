import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IItem } from '../types';

const categories = new Map<string, string>([
    ['софт-скил', 'card__category_soft'],
    ['другое', 'card__category_other'],
    ['хард-скил', 'card__category_hard'],
    ['дополнительное', 'card__category_additional'],
    ['кнопка', 'card__category_button'],
]);

export interface IItemActions {
	onClick: (event: MouseEvent) => void;
}

export class CardItem extends Component<IItem> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IItemActions) {
		super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
		this._description = container.querySelector('.card__text');
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.button');
		this._index = container.querySelector('.basket__item-index');
		

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string | string[]) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		const priceText = value === null ? 'Бесценно' : `${value} синапсов`;
		this.setText(this._price, priceText);
		this.setButtonDisabled(value === null);
	}

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categories.get(value);
        
		this._category.className = 'card__category'; 
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

    set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

    set buttonText(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	set index(value: string) {
		this.setText(this._index, value);
	}

	setButtonDisabled(state: boolean) {
		if (this._button) {
			super.setDisabled(this._button, state); 
		}
	}
}
