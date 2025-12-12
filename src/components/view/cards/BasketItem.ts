import { Card } from './Card'; 
import { IProduct } from '../../../types'; 
import { ensureElement } from '../../../utils/utils'; 
import { IEvents } from '../../base/Events';

export class BasketItem extends Card<IProduct> { 
    protected _index: HTMLElement; 
    protected _deleteButton: HTMLButtonElement; 

    constructor(container: HTMLElement, protected events: IEvents, productId?: string) { 
        super(container); 
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', container); 
        this._title = ensureElement<HTMLElement>('.card__title', container); 
        this._price = ensureElement<HTMLElement>('.card__price', container); 
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container); 

        // Вешаем обработчик с передачей ID товара
        this._deleteButton.addEventListener('click', () => {
            events.emit('basket:remove', { id: productId });
        });
    } 

    set index(value: number) { 
        if (this._index) { 
            this._index.textContent = String(value); 
        } 
    }

    render(data?: Partial<IProduct>): HTMLElement { 
        super.render(data); 
        return this.container; 
    } 
}