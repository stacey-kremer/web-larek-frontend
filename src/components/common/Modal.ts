import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal>{
    protected _closeModalButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeModalButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this.container.addEventListener('click', this.close.bind(this));
        this._closeModalButton.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (evt) => evt.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
    }

    render(data: IModal): HTMLElement {
        super.render(data);
		this.open();
		return this.container;
    }
}