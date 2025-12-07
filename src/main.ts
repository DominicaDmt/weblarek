import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ShopApi } from './components/api/ShopApi';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { CatalogItem } from './components/view/cards/CatalogItem';
import { PreviewItem } from './components/view/cards/PreviewItem';
import { BasketItem } from './components/view/cards/BasketItem';
import { Modal } from './components/view/other/Modal';
import { Gallery } from './components/view/other/Gallery';
import { Basket } from './components/view/other/Basket';
import { Header } from './components/view/other/Header';
import { Success } from './components/view/other/Success';
import { OrderForm } from './components/view/forms/OrderForm';
import { ContactsForm } from './components/view/forms/ContactsForm';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types';
import { apiProducts } from './utils/data';

class AppPresenter {
    private productModel: ProductModel;
    private cartModel: CartModel;
    private buyerModel: BuyerModel;
    private shopApi: ShopApi;
    
    private modal: Modal;
    private gallery: Gallery;
    private basket: Basket;
    private header: Header;
    private orderForm: OrderForm;
    private contactsForm: ContactsForm;
    private success: Success;

    constructor() {
        console.log('=== Инициализация приложения Web-ларёк ===');
        console.log('API_URL:', API_URL);
        console.log('CDN_URL:', CDN_URL);
        
        
        // Инициализация моделей
        this.productModel = new ProductModel();
        this.cartModel = new CartModel();
        this.buyerModel = new BuyerModel();
        
        // Инициализация API
        const baseApi = new Api(API_URL);
        this.shopApi = new ShopApi(baseApi);
        console.log('ShopApi создан');
        
        // Инициализация представлений
        this.modal = new Modal(
            ensureElement<HTMLElement>('#modal-container'),
            { onClose: () => this.onModalClose() }
        );
        
        this.gallery = new Gallery(
            ensureElement<HTMLElement>('.gallery')
        );
        
        this.basket = new Basket(
            cloneTemplate<HTMLElement>('#basket'),
            { onCheckout: () => this.onCheckout() }
        );
        
        this.header = new Header(
            ensureElement<HTMLElement>('.header'),
            { onBasketClick: () => this.onBasketOpen() }
        );
        
        this.orderForm = new OrderForm(
            cloneTemplate<HTMLElement>('#order'),
            {
                onPaymentChange: (button) => this.onPaymentChange(button),
                onInput: (field, value) => this.onOrderInput(field, value),
                onSubmit: (event) => this.onOrderSubmit(event)
            }
        );
        
        this.contactsForm = new ContactsForm(
            cloneTemplate<HTMLElement>('#contacts'),
            {
                onInput: (field, value) => this.onContactsInput(field, value),
                onSubmit: (event) => this.onContactsSubmit(event)
            }
        );
        
        this.success = new Success(
            cloneTemplate<HTMLElement>('#success'),
            { onClose: () => this.onSuccessClose() }
        );
        
        // Подписка на события моделей
        this.productModel.on('products:changed', () => this.onProductsChanged());
        this.productModel.on('preview:changed', () => this.onPreviewChanged());
        this.cartModel.on('cart:changed', () => this.onCartChanged());
        this.buyerModel.on('buyer:changed', () => this.onBuyerChanged());
        
        // Начальная загрузка данных
        this.loadProducts();
    }
    
    // Загрузка товаров
    private async loadProducts(): Promise<void> {
        try {
            console.log('Попытка загрузки товаров с сервера:', API_URL + '/product/');
            const products = await this.shopApi.getProductList();
            console.log('Товары успешно загружены с сервера:', products.length, 'шт.');
            this.productModel.setItems(products);
        } catch (error) {
            console.warn('Не удалось загрузить товары с сервера. Используем тестовые данные.');
            console.warn('Ошибка:', error);
            
            // Используем тестовые данные для разработки
            console.log('Тестовые данные для отладки изображений:');
            apiProducts.items.forEach((product, index) => {
                const imageName = product.image.startsWith('/') ? product.image.substring(1) : product.image;
                const expectedUrl = `${CDN_URL}/${imageName}`;
                console.log(`Товар ${index + 1}: "${product.title}"`);
                console.log(`  Изображение: ${product.image}`);
                console.log(`  Ожидаемый URL: ${expectedUrl}`);
            });
            
            this.productModel.setItems(apiProducts.items);
        }
    }
    
    // Обработчики событий от моделей
    
    private onProductsChanged(): void {
        console.log('onProductsChanged: обновление каталога');
        const products = this.productModel.getItems();
        console.log('Товаров для отображения:', products.length);
        this.gallery.clear();
    
        products.forEach((product: IProduct) => {
            const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
            const card = new CatalogItem(
                cardElement,
                { onClick: () => this.onCatalogItemClick(product) }
            );
        
            const cardData = {
                ...product,
                image: `${CDN_URL}/${product.image}`
            };
        
            console.log('Рендер карточки:', {
                title: product.title,
                originalImage: product.image,
                finalImageUrl: cardData.image
            });
        
            const renderedCard = card.render(cardData);
            this.gallery.render().append(renderedCard);
        });
    }
    
    private onPreviewChanged(): void {
        console.log('onPreviewChanged: открытие предпросмотра');
        const product = this.productModel.getPreviewItem();
        if (product) {
            const previewElement = cloneTemplate<HTMLElement>('#card-preview');
            const preview = new PreviewItem(
            previewElement,
            { onAddToCart: () => this.onAddToCart(product) }
        );
        
        const previewData = {
            ...product,
            image: `${CDN_URL}/${product.image}`
        };
        
            const renderedPreview = preview.render(previewData);
            this.modal.content = renderedPreview;
            this.modal.open();
        }
    }
    
    private onCartChanged(): void {
        console.log('onCartChanged: обновление корзины');
        const items = this.cartModel.getItems();
        const total = this.cartModel.getTotalAmount();
        const count = this.cartModel.getItemsCount();
        
        console.log(`Корзина: ${count} товаров на сумму ${total} синапсов`);
        
        // Обновляем корзину в модальном окне
        const basketElement = this.basket.render();
        this.basket.clear();
        this.basket.total = total;
        
        items.forEach((item: IProduct, index: number) => {
            const basketItemElement = cloneTemplate<HTMLElement>('#card-basket');
            const basketItem = new BasketItem(
                basketItemElement,
                { onRemove: () => this.onRemoveFromCart(item) }
            );
            
            basketItem.index = index + 1;
            const renderedItem = basketItem.render(item);
            
            const listElement = basketElement.querySelector('.basket__list');
            if (listElement) {
                listElement.append(renderedItem);
            }
        });
        
        // Обновляем счетчик в шапке
        this.header.counter = count;
        
        // Обновляем кнопку оформления заказа
        const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
        if (checkoutButton) {
            checkoutButton.disabled = items.length === 0;
        }
    }
    
    private onBuyerChanged(): void {
        console.log('onBuyerChanged: обновление данных покупателя');
        const data = this.buyerModel.getData();
        const validationResult = this.buyerModel.validateData();
        
        // Преобразуем объект ошибок в строку
        const errorsArray: string[] = [];
        if (validationResult.payment) errorsArray.push(validationResult.payment);
        if (validationResult.email) errorsArray.push(validationResult.email);
        if (validationResult.phone) errorsArray.push(validationResult.phone);
        if (validationResult.address) errorsArray.push(validationResult.address);
        
        const errorsString = errorsArray.join(', ');
        
        // Обновляем формы
        this.orderForm.payment = data.payment;
        this.orderForm.address = data.address;
        this.contactsForm.email = data.email;
        this.contactsForm.phone = data.phone;
        
        // Устанавливаем ошибки
        this.orderForm.errors = errorsString;
        this.contactsForm.errors = errorsString;
        
        // Валидируем формы
        this.orderForm.valid = this.orderForm.validate();
        this.contactsForm.valid = this.contactsForm.validate();
    }
    
    // Обработчики событий от представлений
    
    private onCatalogItemClick(product: IProduct): void {
        console.log('onCatalogItemClick:', product.title);
        this.productModel.setPreviewItem(product);
    }
    
    private onAddToCart(product: IProduct): void {
        console.log('onAddToCart:', product.title);
        this.cartModel.addItem(product);
        this.modal.close();
    }
    
    private onRemoveFromCart(product: IProduct): void {
        console.log('onRemoveFromCart:', product.title);
        this.cartModel.removeItem(product);
    }
    
    private onBasketOpen(): void {
        console.log('onBasketOpen: открытие корзины');
        const basketElement = this.basket.render();
        this.modal.content = basketElement;
        this.modal.open();
    }
    
    private onCheckout(): void {
        console.log('onCheckout: оформление заказа');
        const orderElement = this.orderForm.render();
        this.modal.content = orderElement;
        this.modal.open();
    }
    
    private onPaymentChange(button: HTMLButtonElement): void {
        console.log('onPaymentChange:', button.name);
        this.buyerModel.setData({ payment: button.name });
    }
    
    private onOrderInput(field: string, value: string): void {
        console.log('onOrderInput:', field, '=', value);
        const data: any = {};
        data[field] = value;
        this.buyerModel.setData(data);
    }
    
    private onOrderSubmit(event: Event): void {
        event.preventDefault();
        console.log('onOrderSubmit: переход к форме контактов');
        const contactsElement = this.contactsForm.render();
        this.modal.content = contactsElement;
    }
    
    private onContactsInput(field: string, value: string): void {
        console.log('onContactsInput:', field, '=', value);
        const data: any = {};
        data[field] = value;
        this.buyerModel.setData(data);
    }
    
    private async onContactsSubmit(event: Event): Promise<void> {
        event.preventDefault();
        console.log('onContactsSubmit: отправка заказа');
        
        const buyerData = this.buyerModel.getData();
        const cartItems = this.cartModel.getItems();
        const total = this.cartModel.getTotalAmount();
        
        try {
            console.log('Отправка заказа:', {
                ...buyerData,
                total: total,
                items: cartItems.map(item => item.id)
            });
            
            const result = await this.shopApi.submitOrder({
                ...buyerData,
                total: total,
                items: cartItems.map(item => item.id)
            });
            
            console.log('Заказ успешно отправлен:', result);
            
            // Очищаем корзину и данные покупателя
            this.cartModel.clearCart();
            this.buyerModel.clearData();
            
            // Показываем успешное сообщение
            this.success.total = total;
            const successElement = this.success.render({ total });
            this.modal.content = successElement;
            
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            this.contactsForm.errors = 'Ошибка оформления заказа. Попробуйте еще раз.';
        }
    }
    
    private onModalClose(): void {
        console.log('onModalClose: закрытие модального окна');
        this.modal.close();
    }
    
    private onSuccessClose(): void {
        console.log('onSuccessClose: закрытие окна успеха');
        this.modal.close();
    }
}

// Запуск приложения
console.log('Запуск приложения Web-ларёк');
new AppPresenter();