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
            // Проверяем, не заблокирована ли кнопка
            if (!this._button.disabled) {
                events.emit('product:toggle');
            }
        });
    } 
    
    // Добавляем метод для изменения текста кнопки
    set buttonLabel(value: string) {
        this._button.textContent = value;
    }
    
    // Метод для изменения состояния кнопки
    set buttonAction(action: string) {
        if (action === 'remove') {
            this._button.classList.add('button_danger');
            this._button.classList.remove('button_primary');
        } else {
            this._button.classList.add('button_primary');
            this._button.classList.remove('button_danger');
        }
    }
    
    // Метод для блокировки кнопки
    set disabled(value: boolean) {
        this._button.disabled = value;
        if (value) {
            this._button.classList.add('card__button_disabled');
            this._button.classList.remove('button_primary', 'button_danger');
        }
    }

    render(data?: Partial<IProduct>): HTMLElement { 
        super.render(data);
        
        // Если цена null или 0, блокируем кнопку
        if (data?.price === null || data?.price === 0) {
            this.disabled = true;
            this.buttonLabel = 'Недоступно';
        }
        
        return this.container; 
    } 
}