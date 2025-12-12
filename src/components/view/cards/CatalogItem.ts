import { Card } from './Card'; 
import { IProduct } from '../../../types'; 
import { ensureElement } from '../../../utils/utils'; 
import { IEvents } from '../../base/Events';

export class CatalogItem extends Card<IProduct> { 
    constructor(container: HTMLElement, protected events: IEvents, productId?: string) { 
        super(container); 
        
        this._category = ensureElement<HTMLElement>('.card__category', container); 
        this._title = ensureElement<HTMLElement>('.card__title', container); 
        this._itemImage = ensureElement<HTMLImageElement>('.card__image', container);  
        this._price = ensureElement<HTMLElement>('.card__price', container); 
        
        this.container.addEventListener('click', () => {
            events.emit('catalog:item-click', { id: productId });
        });
    } 

    render(data?: Partial<IProduct>): HTMLElement { 
        super.render(data); 
        return this.container; 
    } 
}