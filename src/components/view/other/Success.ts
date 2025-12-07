import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface ISuccessActions {
    onClose: () => void;
}

export class Success extends Component<{ total: number }> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);

        if (actions?.onClose) {
            this._closeButton.addEventListener('click', actions.onClose);
        }
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }

    render(data?: Partial<{ total: number }>): HTMLElement {
        super.render(data);
        return this.container;
    }
}