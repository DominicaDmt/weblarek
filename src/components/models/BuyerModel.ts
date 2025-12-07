import { IBuyer, IBuyerValidationResult } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel extends EventEmitter {
    private _payment: string = '';
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    setData(data: Partial<IBuyer>): void {
        let changed = false;
        
        if (data.payment !== undefined && this._payment !== data.payment) {
            this._payment = data.payment;
            changed = true;
            this.emit('buyer:payment-changed', { payment: this._payment });
        }
        
        if (data.email !== undefined && this._email !== data.email) {
            this._email = data.email;
            changed = true;
            this.emit('buyer:email-changed', { email: this._email });
        }
        
        if (data.phone !== undefined && this._phone !== data.phone) {
            this._phone = data.phone;
            changed = true;
            this.emit('buyer:phone-changed', { phone: this._phone });
        }
        
        if (data.address !== undefined && this._address !== data.address) {
            this._address = data.address;
            changed = true;
            this.emit('buyer:address-changed', { address: this._address });
        }
        
        if (changed) {
            this.emit('buyer:changed', this.getData());
        }
    }

    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    clearData(): void {
        this._payment = '';
        this._email = '';
        this._phone = '';
        this._address = '';
        this.emit('buyer:cleared');
    }

    validateData(): IBuyerValidationResult {
        const errors: IBuyerValidationResult = {};

        if (!this._payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this._email) {
            errors.email = 'Укажите емэйл';
        }

        if (!this._phone) {
            errors.phone = 'Укажите телефон';
        }

        if (!this._address) {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }
}