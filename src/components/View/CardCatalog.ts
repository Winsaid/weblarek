import { ICardActions, TCardCatalog } from '../../types';
import { Card } from './Card';

export class CardCatalog extends Card<TCardCatalog> {
    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.container.addEventListener('click', actions.onClick);
    }
}
