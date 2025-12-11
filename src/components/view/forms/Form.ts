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


    protected showFieldError(fieldName: string, message: string): void {
        const field = this.container.querySelector(`[name="${fieldName}"]`);
        if (field) {
            const errorElement = field.closest('.order__field')?.querySelector('.form__error');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }

    protected clearFieldErrors(): void {
        const errorElements = this.container.querySelectorAll('.form__error');
        errorElements.forEach(el => {
            el.textContent = '';
        });
    }

    render(data?: Partial<T>): HTMLElement {
        super.render(data);
        return this.container;
    }
}