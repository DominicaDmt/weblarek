import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IBasketActions {
    onCheckout: () => void;
}

export class Basket extends Component<HTMLElement> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container);
        
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (actions?.onCheckout) {
            this._button.addEventListener('click', actions.onCheckout);
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `${value} синапсов`;
        }
    }

    clear(): void {
        this._list.replaceChildren();
        this.total = 0;
    }

    render(): HTMLElement {
        return this.container;
    }
}