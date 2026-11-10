import { IBasket } from '../../types';
import { ensureElement, formatPrice } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.listElement = ensureElement('.basket__list', container);
        this.totalElement = ensureElement('.basket__price', container);
        this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.checkoutButton.addEventListener('click', () => events.emit('order:open'));
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
    }

    set total(value: number) {
        this.totalElement.textContent = formatPrice(value);
    }

    set buttonDisabled(value: boolean) {
        this.checkoutButton.disabled = value;
    }
}
