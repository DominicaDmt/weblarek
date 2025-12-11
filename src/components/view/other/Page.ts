import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/Events';

export class Page extends Component<HTMLElement> {
    protected _gallery: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._gallery = ensureElement<HTMLElement>('.gallery', container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);

        this._basketButton.addEventListener('click', () => {
            events.emit('page:basket-click');
        });
    }

    set counter(value: number) {
        if (this._counter) {
            this._counter.textContent = String(value);
        }
    }

    get galleryContainer(): HTMLElement {
        return this._gallery;
    }

    render(): HTMLElement {
        return this.container;
    }
}