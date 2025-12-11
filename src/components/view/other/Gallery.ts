import { Component } from '../../base/Component'; 

export class Gallery extends Component<HTMLElement> { 
    constructor(container: HTMLElement) { 
        super(container); 
    } 

    clear(): void { 
        this.container.replaceChildren(); 
    } 
    
    // Добавление элементов
    set items(elements: HTMLElement[]) {
        this.clear();
        elements.forEach(element => {
            this.container.append(element);
        });
    }

    render(): HTMLElement { 
        return this.container; 
    } 
}