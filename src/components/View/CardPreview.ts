import { ICardActions, TCardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CardWithImage } from './CardWithImage';

export class CardPreview extends CardWithImage<TCardPreview> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', actions.onClick);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}
