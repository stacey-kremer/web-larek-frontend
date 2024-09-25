import { IEvents } from '../base/Events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'.button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.notifyFieldChange(field, value);
		});
	}

	protected notifyFieldChange(field: keyof T, value: string): void {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	protected setInputValue(input: HTMLInputElement, value:string) {
		if(input) {
			input.value = value;
		}
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
