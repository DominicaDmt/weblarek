import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';

interface IContactsFormData {
    email: string;
    phone: string;
}

interface IContactsFormActions {
    onInput: (field: keyof IContactsFormData, value: string) => void;
    onSubmit: (event: Event) => void;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, actions?: IContactsFormActions) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', () => {
            if (actions?.onInput) {
                actions.onInput('email', this._emailInput.value);
            }
        });

        this._phoneInput.addEventListener('input', () => {
            if (actions?.onInput) {
                actions.onInput('phone', this._phoneInput.value);
            }
        });

        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            if (actions?.onSubmit) {
                actions.onSubmit(event);
            }
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    validate(): boolean {
        const emailValid = this._emailInput.value.trim() !== '';
        const phoneValid = this._phoneInput.value.trim() !== '';
        return emailValid && phoneValid;
    }

    clear(): void {
        this._emailInput.value = '';
        this._phoneInput.value = '';
        this.errors = '';
        this.valid = false;
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        super.render(data);
        return this.container;
    }
}