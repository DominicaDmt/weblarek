import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel extends EventEmitter {
    private _items: IProduct[] = [];
    private _previewItem: IProduct | null = null;
    
    setItems(items: IProduct[]): void {
        this._items = items;
        this.emit('products:changed', { items: this._items });
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | null {
        return this._items.find(item => item.id === id) || null;
    }

    setPreviewItem(item: IProduct): void {
        this._previewItem = item;
        this.emit('preview:changed', { item: this._previewItem });
    }

    getPreviewItem(): IProduct | null {
        return this._previewItem;
    }
}