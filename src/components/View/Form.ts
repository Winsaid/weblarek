import { IBuyer, IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T extends IFormState> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    protected constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this.errorsElement = ensureElement('.form__errors', container);

        this.container.addEventListener('input', (event) => {
            const input = event.target as HTMLInputElement;
            events.emit<Partial<IBuyer>>('form:change', { [input.name]: input.value });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(`${this.container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}
