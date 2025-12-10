import { ensureElement } from '../../../utils/utils';

interface IBasketActions {
    onCheckout?: () => void;
}

export class Basket {
    protected _container: HTMLElement;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        this._container = container;
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (actions?.onCheckout) {
            this._button.addEventListener('click', (event) => {
                event.preventDefault();
                // вызываем обработчик
                actions.onCheckout!();
            });
        }
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    setCheckoutDisabled(disabled: boolean): void {
        this._button.disabled = disabled;
    }

    clear(): void {
        this._list.innerHTML = '';
    }

    render(): HTMLElement {
        return this._container;
    }

    private setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }
}