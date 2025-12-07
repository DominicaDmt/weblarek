import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';

interface IOrderFormData {
    payment: string;
    address: string;
}

interface IOrderFormActions {
    onPaymentChange: (button: HTMLButtonElement) => void;
    onInput: (field: keyof IOrderFormData, value: string) => void;
    onSubmit: (event: Event) => void;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _selectedPayment: string = '';

    constructor(container: HTMLElement, actions?: IOrderFormActions) {
        super(container);
        
        this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons button'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPayment(button.name);
                if (actions?.onPaymentChange) {
                    actions.onPaymentChange(button);
                }
            });
        });

        this._addressInput.addEventListener('input', () => {
            if (actions?.onInput) {
                actions.onInput('address', this._addressInput.value);
            }
        });

        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            if (actions?.onSubmit) {
                actions.onSubmit(event);
            }
        });
    }

    selectPayment(payment: string): void {
        this._selectedPayment = payment;
        this._paymentButtons.forEach(button => {
            if (button.name === payment) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set payment(value: string) {
        this.selectPayment(value);
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    validate(): boolean {
        return this._selectedPayment !== '' && this._addressInput.value.trim() !== '';
    }

    clear(): void {
        this._selectedPayment = '';
        this._paymentButtons.forEach(button => button.classList.remove('button_alt-active'));
        this._addressInput.value = '';
        this.errors = '';
        this.valid = false;
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        super.render(data);
        return this.container;
    }
}