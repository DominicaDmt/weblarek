import { Component } from '../../base/Component';  
import { ensureElement } from '../../../utils/utils';  
import { IEvents } from '../../base/Events'; 

export class Basket extends Component<HTMLElement> {  
    protected _list: HTMLElement;  
    protected _total: HTMLElement;  
    protected _button: HTMLButtonElement; 
    

    constructor(container: HTMLElement, protected events: IEvents) {  
        super(container);  
        
        this._list = ensureElement<HTMLElement>('.basket__list', container);  
        this._total = ensureElement<HTMLElement>('.basket__price', container);  
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);  

        // сразу делаем кнопку неактивной 
        this._button.disabled = true; 
        
        // обработчик через EventEmitter 
        this._button.addEventListener('click', () => {
            events.emit('basket:checkout'); 
        }); 
    }  
    
    // Исправленный setter для элементов 
    set items(elements: HTMLElement[]) {
        this._list.replaceChildren(...elements); 
        this._button.disabled = elements.length === 0; 
    }

    set total(value: number) {  
        if (this._total) {  
            this._total.textContent = `${value} синапсов`;  
        }  
    }  

    set valid(value: boolean) {
        this._button.disabled = !value;
    }

    clear(): void {  
        this._list.replaceChildren();  
        this.total = 0;
        this._button.disabled = true; 
    }  

    render(): HTMLElement {  
        return this.container;  
    }  
}