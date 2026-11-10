import { TCard } from '../../types';
import { uiTexts } from '../../utils/constants';
import { ensureElement, formatPrice } from '../../utils/utils';
import { Component } from '../base/Component';

export abstract class Card<T extends TCard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? uiTexts.priceless : formatPrice(value);
    }
}
