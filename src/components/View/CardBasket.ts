import { ICardActions, TCardBasket } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export class CardBasket extends Card<TCardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', actions.onClick);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
