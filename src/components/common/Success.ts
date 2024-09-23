import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
	image: string;
	title: string;
	description: string;
	total: number | null;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number | null) {
		this._total.textContent = value !== null 
        ?`Списано ${value} синапсов`
        : `Сумма не указана`;
	}
}
