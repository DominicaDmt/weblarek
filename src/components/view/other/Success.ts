import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export class Success extends Component<{ total: number }> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);

        this._closeButton.addEventListener('click', () => {
            events.emit('success:close');
        });
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