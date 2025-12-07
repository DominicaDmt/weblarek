import { Component } from '../../base/Component';
import { categoryMap } from '../../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected _category?: HTMLElement;
    protected _title?: HTMLElement;
    protected _itemImage?: HTMLImageElement; 
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (value === null) {
            if (this._price) {
                this._price.textContent = 'Бесценно';
            }
        } else {
            if (this._price) {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this._category.className = 'card__category';
                this._category.classList.add(modifier);
            }
        }
    }

    set image(src: string) {
        this.setImage(this._itemImage!, src);
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }
}