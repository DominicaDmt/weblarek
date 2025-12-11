import { Component } from '../../base/Component'; 
import { ensureElement } from '../../../utils/utils'; 
import { IEvents } from '../../base/Events';

export class Modal extends Component<HTMLElement> { 
    protected _closeButton: HTMLButtonElement; 
    protected _content: HTMLElement; 

    constructor(container: HTMLElement, protected events: IEvents) { 
        super(container); 
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container); 
        this._content = ensureElement<HTMLElement>('.modal__content', container); 

        this._closeButton.addEventListener('click', () => { 
            events.emit('modal:close');
        }); 

        container.addEventListener('click', (event: MouseEvent) => { 
            if (event.target === container) { 
                events.emit('modal:close');
            } 
        }); 
    } 

    set content(value: HTMLElement) { 
        this._content.replaceChildren(value); 
    } 

    open(): void { 
        this.container.classList.add('modal_active'); 
    } 

    close(): void { 
        this.container.classList.remove('modal_active'); 
        this._content.replaceChildren(); 
    } 

    render(): HTMLElement { 
        return this.container; 
    } 
}