import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);
    }

    set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
        }
    }

    set valid(value: boolean) {
        this._submitButton.disabled = !value;
    }

    abstract validate(): boolean;
    abstract clear(): void;

    render(data?: Partial<T>): HTMLElement {
        super.render(data);
        return this.container;
    }
}