import { ICardActions, TCardCatalog } from '../../types';
import { CardWithImage } from './CardWithImage';

export class CardCatalog extends CardWithImage<TCardCatalog> {
    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.container.addEventListener('click', actions.onClick);
    }
}
