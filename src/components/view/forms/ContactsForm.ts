import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', () => {
            events.emit('contacts.email:change', { email: this._emailInput.value });
        });

        this._phoneInput.addEventListener('input', () => {
            events.emit('contacts.phone:change', { phone: this._phoneInput.value });
        });

        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    setErrors(errors: Partial<Record<keyof IContactsFormData, string>>): void {
        this.clearFieldErrors();
        this.errors = ''; 
        
        if (errors.email) {
            this.showFieldError('email', errors.email);
        }
        if (errors.phone) {
            this.showFieldError('phone', errors.phone);
        }
        
        const errorMessages = Object.values(errors).filter(Boolean);
        if (errorMessages.length > 0) {
            this.errors = errorMessages.join(', ');
        }
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        super.render(data);
        return this.container;
    }
}