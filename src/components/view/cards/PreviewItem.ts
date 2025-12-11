import { Card } from './Card'; 
import { IProduct } from '../../../types'; 
import { ensureElement } from '../../../utils/utils'; 
import { IEvents } from '../../base/Events';

export class PreviewItem extends Card<IProduct> { 
    protected _button: HTMLButtonElement; 

    constructor(container: HTMLElement, protected events: IEvents) { 
        super(container); 
        
        this._category = ensureElement<HTMLElement>('.card__category', container); 
        this._title = ensureElement<HTMLElement>('.card__title', container); 
        this._itemImage = ensureElement<HTMLImageElement>('.card__image', container); 
        this._price = ensureElement<HTMLElement>('.card__price', container); 
        this._description = ensureElement<HTMLElement>('.card__text', container); 
        this._button = ensureElement<HTMLButtonElement>('.card__button', container); 

        // Вешаем обработчик через EventEmitter
        this._button.addEventListener('click', () => {
            events.emit('product:toggle');
        });
    } 
    
    // Добавляем метод для изменения текста кнопки
    set buttonLabel(value: string) {
        this._button.textContent = value;
    }
    
    // Метод для изменения состояния кнопки
    set buttonAction(action: string) {
        // Можно добавить CSS классы для разных состояний
        if (action === 'remove') {
            this._button.classList.add('button_danger');
        } else {
            this._button.classList.remove('button_danger');
        }
    }

    render(data?: Partial<IProduct>): HTMLElement { 
        super.render(data); 
        return this.container; 
    } 
}