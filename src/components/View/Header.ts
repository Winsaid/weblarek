import { IHeader } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<IHeader> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement('.header__basket-counter', container);

        this.basketButton.addEventListener('click', () => events.emit('basket:open'));
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}
