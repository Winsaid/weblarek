import { ISuccess } from '../../types';
import { uiTexts } from '../../utils/constants';
import { ensureElement, formatPrice } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<ISuccess> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => events.emit('success:close'));
    }

    set total(value: number) {
        this.descriptionElement.textContent = `${uiTexts.debited} ${formatPrice(value)}`;
    }
}
