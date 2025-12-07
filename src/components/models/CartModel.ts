import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel extends EventEmitter {
    private _items: IProduct[] = [];

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this.emit('cart:changed', { 
            items: this._items,
            action: 'add',
            item: item 
        });
    }

    removeItem(item: IProduct): void {
        const index = this._items.findIndex(cartItem => cartItem.id === item.id);
        if (index !== -1) {
            this._items.splice(index, 1);
            this.emit('cart:changed', { 
                items: this._items,
                action: 'remove',
                item: item 
            });
        }
    }

    clearCart(): void {
        this._items = [];
        this.emit('cart:changed', { 
            items: this._items,
            action: 'clear'
        });
    }

    getTotalAmount(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemsCount(): number {
        return this._items.length;
    }
    
    checkItemInCart(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}