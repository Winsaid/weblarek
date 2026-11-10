import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}
