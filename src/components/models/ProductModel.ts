import { IProduct } from '../../types';

export class ProductModel {
    private _items: IProduct[] = [];
    private _previewItem: IProduct | null = null;
    
    setItems(items:  IProduct[]): void {
        this._items = items;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItem(id: string): IProduct | null {
        return this._items.find(item => item.id === id) || null;
    }

    setPreviewItem(item: IProduct): void {
        this._previewItem = item;
    }

    getPreviewItem(): IProduct | null {
        return this._previewItem;
    }
}