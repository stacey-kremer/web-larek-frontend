import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IItem } from '../../types';

const categories = new Map<string, string>([
    ['soft-skill', 'card__category_soft'],
    ['other', 'card__category_other'],
    ['hard-skill', 'card__category_hard'],
    ['additional', 'card__category_additional'],
    ['button', 'card__category_button'],
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

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set description(value: string | string[]) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set price(value: number | null) {
		const priceText = value === null ? 'Бесценно' : `${value} синапсов`;
        this.setText(this._price, priceText);
	}

	get price(): number {
		return Number(this._price.textContent) || null;
	}

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categories.get(value);
        
        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

	get category() {
		return this._category.textContent || '';
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
		this._index.textContent = value;
	}

	get index(): string {
		return this._index.textContent || '';
	}

	setDisabled() {
		if (this._button) {
            this._button.disabled = true;
        }
	}
}
