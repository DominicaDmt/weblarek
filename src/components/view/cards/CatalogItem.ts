import { Card } from './Card';
import { IProduct } from '../../../types';
import { ensureElement } from '../../../utils/utils';

interface ICatalogItemActions {
    onClick: (event: MouseEvent) => void;
}

export class CatalogItem extends Card<IProduct> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICatalogItemActions) {
        super(container);
        
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._itemImage = ensureElement<HTMLImageElement>('.card__image', container); // используем _itemImage
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container as HTMLButtonElement;

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        super.render(data);
        return this.container;
    }
}