import { Form } from './Form';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

interface IOrderFormData {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons button'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        // Вешаем обработчики через EventEmitter
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPayment(button.name);
                events.emit('order.payment:change', { payment: button.name });
            });
        });

        this._addressInput.addEventListener('input', () => {
            events.emit('order.address:change', { address: this._addressInput.value });
        });

        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            events.emit('order:submit');
        });
    }
    
    selectPayment(payment: string): void {
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
    
    setErrors(errors: Partial<Record<keyof IOrderFormData, string>>): void {
        this.clearFieldErrors();
        this.errors = '';
        
        if (errors.payment) {
            const paymentField = this.container.querySelector('.order__field');
            if (paymentField) {
                let errorElement = paymentField.querySelector('.form__error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'form__error';
                    paymentField.appendChild(errorElement);
                }
                errorElement.textContent = errors.payment;
            }
        }
        
        if (errors.address) {
            this.showFieldError('address', errors.address);
        }
        
        const errorMessages = Object.values(errors).filter(Boolean);
        if (errorMessages.length > 0) {
            this.errors = errorMessages.join(', ');
        }
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        super.render(data);
        return this.container;
    }
}