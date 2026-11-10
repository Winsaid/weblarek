import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement('.modal__content', container);

        this.closeButton.addEventListener('click', () => events.emit('modal:close'));
        this.container.addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                events.emit('modal:close');
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
