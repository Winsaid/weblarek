import { TCardCatalog } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

export abstract class CardWithImage<T extends TCardCatalog> extends Card<T> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement('.card__category', container);
    }

    set title(value: string) {
        super.title = value;
        this.imageElement.alt = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const [category, modifier] of Object.entries(categoryMap)) {
            this.categoryElement.classList.toggle(modifier, category === value);
        }
    }
}
