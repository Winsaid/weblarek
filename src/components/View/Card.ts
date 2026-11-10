import { TCard } from '../../types';
import { categoryMap, CDN_URL, uiTexts } from '../../utils/constants';
import { ensureElement, formatPrice } from '../../utils/utils';
import { Component } from '../base/Component';

export abstract class Card<T extends TCard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
        this.imageElement = container.querySelector<HTMLImageElement>('.card__image');
        this.categoryElement = container.querySelector<HTMLElement>('.card__category');
    }

    set title(value: string) {
        this.titleElement.textContent = value;
        if (this.imageElement) {
            this.imageElement.alt = value;
        }
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? uiTexts.priceless : formatPrice(value);
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, `${CDN_URL}${value}`);
        }
    }

    set category(value: string) {
        if (!this.categoryElement) return;

        this.categoryElement.textContent = value;
        for (const [category, modifier] of Object.entries(categoryMap)) {
            this.categoryElement.classList.toggle(modifier, category === value);
        }
    }
}
