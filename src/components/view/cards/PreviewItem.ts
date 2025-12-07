import { Card } from './Card';
import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';

interface IPreviewItemActions {
    onAddToCart: (event: MouseEvent) => void;
}

export class PreviewItem extends Card<IProduct> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IPreviewItemActions) {
        super(container);
        
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._itemImage = ensureElement<HTMLImageElement>('.card__image', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onAddToCart) {
            this._button.addEventListener('click', actions.onAddToCart);
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        super.render(data);
        return this.container;
    }
}