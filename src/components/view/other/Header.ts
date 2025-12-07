import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IHeaderActions {
    onBasketClick: () => void;
}

export class Header extends Component<HTMLElement> {
    protected _counter: HTMLElement;
    protected _basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IHeaderActions) {
        super(container);
        
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);

        if (actions?.onBasketClick) {
            this._basketButton.addEventListener('click', actions.onBasketClick);
        }
    }

    set counter(value: number) {
        if (this._counter) {
            this._counter.textContent = String(value);
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}