import { IBuyer, IBuyerValidationResult } from '../../types';

export class BuyerModel {
    private _payment: string = '';
    private _email: string = '';
    private _phone: string = '';
    private _address: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this._payment = data.payment;
        if (data.email !== undefined) this._email = data.email;
        if (data.phone !== undefined) this._phone = data.phone;
        if (data.address !== undefined) this._address = data.address;
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