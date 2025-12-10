import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel extends EventEmitter {
    private _items: IProduct[] = [];

    constructor() {
        super();
        this._items = []; // Инициализируем пустым массивом
    }

    addItem(item: IProduct): void {
        // Проверяем, есть ли уже такой товар в корзине
        if (this.getItemIndex(item.id) === -1) {
            this._items.push(item);
            this.emit('cart:changed');
        }
    }

    removeItem(item: IProduct): void {
        const index = this.getItemIndex(item.id);
        if (index !== -1) {
            this._items.splice(index, 1);
            this.emit('cart:changed');
        }
    }

    // Проверка наличия товара в корзине
    getItemIndex(id: string): number {
        return this._items.findIndex(item => item.id === id);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemsCount(): number {
        return this._items.length;
    }

    getTotalAmount(): number {
        return this._items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    clearCart(): void {
        this._items = [];
        this.emit('cart:changed');
    }
}