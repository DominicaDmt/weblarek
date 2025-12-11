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
import { Page } from './components/view/other/Page'; 
import { Success } from './components/view/other/Success'; 
import { OrderForm } from './components/view/forms/OrderForm'; 
import { ContactsForm } from './components/view/forms/ContactsForm'; 
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants'; 
import { cloneTemplate, ensureElement } from './utils/utils'; 
import { IProduct } from './types'; 

// Создание EventEmitter
const events = new EventEmitter();

// Создание экземпляров моделей
const productModel = new ProductModel(); 
const cartModel = new CartModel(); 
const buyerModel = new BuyerModel(); 

// Инициализация API 
const baseApi = new Api(API_URL); 
const shopApi = new ShopApi(baseApi); 

// Инициализация представлений 
const modal = new Modal( 
    ensureElement<HTMLElement>('#modal-container'), 
    events
); 

const page = new Page(
    document.body,
    events  
);

const gallery = new Gallery(page.galleryContainer);

const basket = new Basket( 
    cloneTemplate<HTMLElement>('#basket'), 
    events
); 

const preview = new PreviewItem(
    cloneTemplate<HTMLElement>('#card-preview'),
    events
);

const orderForm = new OrderForm( 
    cloneTemplate<HTMLElement>('#order'), 
    events
); 

const contactsForm = new ContactsForm( 
    cloneTemplate<HTMLElement>('#contacts'), 
    events
); 

const success = new Success( 
    cloneTemplate<HTMLElement>('#success'), 
    events
); 

class AppPresenter { 
    constructor() { 
        console.log('=== Инициализация приложения Web-ларёк ==='); 
        
        // Подписка на события от представлений
        this.setupEventListeners();
        
        // Подписка на события моделей 
        productModel.on('products:changed', () => this.onProductsChanged()); 
        productModel.on('preview:changed', () => this.onPreviewChanged()); 
        cartModel.on('cart:changed', () => this.onCartChanged()); 
        buyerModel.on('buyer:changed', () => this.onBuyerChanged()); 
        
        // Начальная загрузка данных 
        this.loadProducts(); 
    } 
    
    private setupEventListeners(): void {
        // События от страницы
        events.on('page:basket-click', () => this.onBasketOpen());
        
        // События от модального окна
        events.on('modal:close', () => this.onModalClose());
        
        // События от каталога
        events.on('catalog:item-click', (data: { id: string }) => this.onCatalogItemClick(data.id));
        
        // События от превью
        events.on('product:toggle', () => this.onProductToggle());
        
        // События от корзины
        events.on('basket:checkout', () => this.onCheckout());
        events.on('basket:remove', (data: { id: string }) => {
            const product = productModel.getItem(data.id);
            if (product) {
                console.log('Удаление из корзины:', product.title); 
                cartModel.removeItem(product); 
            }
        });
        
        // События от формы заказа
        events.on('order.payment:change', (data: { payment: string }) => this.onPaymentChange(data.payment));
        events.on('order.address:change', (data: { address: string }) => this.onAddressChange(data.address));
        events.on('order:submit', () => this.onOrderSubmit());
        
        // События от формы контактов
        events.on('contacts.email:change', (data: { email: string }) => this.onEmailChange(data.email));
        events.on('contacts.phone:change', (data: { phone: string }) => this.onPhoneChange(data.phone));
        events.on('contacts:submit', () => this.onContactsSubmit());
        
        // События от успешного заказа
        events.on('success:close', () => this.onSuccessClose());
    }
     
    private async loadProducts(): Promise<void> { 
        try { 
            console.log('Попытка загрузки товаров с сервера'); 
            const products = await shopApi.getProductList(); 
            console.log('Товары успешно загружены с сервера:', products.length, 'шт.'); 
            productModel.setItems(products); 
        } catch (error) { 
            console.error('Не удалось загрузить товаров с сервера:', error); 
        } 
    } 
     
    private onProductsChanged(): void { 
        console.log('onProductsChanged: обновление каталога'); 
        const products = productModel.getItems(); 
        console.log('Товаров для отображения:', products.length); 
        
        // Используем map для создания карточек
        const cardElements = products.map((product: IProduct) => { 
            const cardElement = cloneTemplate<HTMLElement>('#card-catalog'); 
            const card = new CatalogItem( 
                cardElement, 
                events,
                product.id
            ); 
        
            const cardData = { 
                ...product, 
                image: `${CDN_URL}/${product.image}` 
            }; 
        
            return card.render(cardData); 
        }); 
        
        // Устанавливаем все карточки сразу
        gallery.items = cardElements;
    } 
     
    private onPreviewChanged(): void { 
        console.log('onPreviewChanged: открытие предпросмотра'); 
        const product = productModel.getPreviewItem(); 
        if (product) { 
            // Проверяем наличие товара в корзине 
            const isInCart = cartModel.getItemIndex(product.id) !== -1; 
             
            // Обновляем кнопку в превью
            preview.buttonLabel = isInCart ? 'Удалить' : 'Купить';
            preview.buttonAction = isInCart ? 'remove' : 'add';
            
            const previewData = { 
                ...product, 
                image: `${CDN_URL}/${product.image}` 
            }; 
        
            const renderedPreview = preview.render(previewData); 
            modal.content = renderedPreview; 
            modal.open(); 
        } 
    } 
    
    private onProductToggle(): void {
        const product = productModel.getPreviewItem();
        if (product) {
            const isInCart = cartModel.getItemIndex(product.id) !== -1;
            if (isInCart) {
                console.log('Удаление из корзины (из превью):', product.title);
                cartModel.removeItem(product);
            } else {
                console.log('Добавление в корзину (из превью):', product.title);
                cartModel.addItem(product);
            }
            modal.close();
        }
    }
     
    private onCartChanged(): void { 
        console.log('onCartChanged: обновление корзины'); 
        const items = cartModel.getItems(); 
        const total = cartModel.getTotalAmount(); 
        const count = cartModel.getItemsCount(); 
        
        console.log(`Корзина: ${count} товаров на сумму ${total} синапсов`); 
        
        // Обновляем корзину 
        const basketItems = items.map((item: IProduct, index: number) => { 
            const basketItemElement = cloneTemplate<HTMLElement>('#card-basket'); 
            const basketItem = new BasketItem( 
                basketItemElement, 
                events,
                item.id
            ); 
            
            basketItem.index = index + 1; 
            return basketItem.render(item); 
        }); 
        
        // Устанавливаем элементы корзины
        basket.items = basketItems;
        basket.total = total;
        
        // Обновляем счетчик в шапке 
        page.counter = count; 
    } 
     
    private onBuyerChanged(): void { 
        console.log('onBuyerChanged: обновление данных покупателя'); 
        const data = buyerModel.getData(); 
        const validationResult = buyerModel.validateData(); 
        
        // Обновляем формы 
        orderForm.payment = data.payment; 
        orderForm.address = data.address; 
        contactsForm.email = data.email; 
        contactsForm.phone = data.phone; 
        
        // Проверяем валидность формы заказа (только оплата и адрес) 
        const isOrderValid = !validationResult.payment && !validationResult.address; 
        orderForm.valid = isOrderValid; 
        
        // Проверяем валидность формы контактов (только email и phone) 
        const isContactsValid = !validationResult.email && !validationResult.phone; 
        contactsForm.valid = isContactsValid; 
        
        // Устанавливаем ошибки 
        orderForm.setErrors({
            payment: validationResult.payment,
            address: validationResult.address
        });
        
        contactsForm.setErrors({
            email: validationResult.email,
            phone: validationResult.phone
        });
    } 
     
    // Обработчики событий от представлений 
     
    private onCatalogItemClick(productId: string): void { 
        const product = productModel.getItem(productId);
        if (product) {
            console.log('onCatalogItemClick:', product.title); 
            productModel.setPreviewItem(product); 
        }
    } 
     
    private onBasketOpen(): void { 
        console.log('onBasketOpen: открытие корзины'); 
        const basketElement = basket.render(); 
        modal.content = basketElement; 
        modal.open(); 
    } 
     
    private onCheckout(): void { 
        console.log('onCheckout: оформление заказа'); 
        
        // Дополнительная проверка на пустую корзину 
        const items = cartModel.getItems(); 
        if (items.length === 0) { 
            console.log('Корзина пуста, оформление невозможно'); 
            return; 
        } 
        
        // Очищаем данные покупателя перед началом оформления 
        buyerModel.clearData(); 
        
        const orderElement = orderForm.render(); 
        modal.content = orderElement; 
        modal.open(); 
    } 
     
    private onPaymentChange(payment: string): void { 
        console.log('onPaymentChange:', payment); 
        buyerModel.setData({ payment }); 
    } 
     
    private onAddressChange(address: string): void { 
        console.log('onAddressChange:', address); 
        buyerModel.setData({ address }); 
    } 
    
    private onEmailChange(email: string): void { 
        console.log('onEmailChange:', email); 
        buyerModel.setData({ email }); 
    } 
    
    private onPhoneChange(phone: string): void { 
        console.log('onPhoneChange:', phone); 
        buyerModel.setData({ phone }); 
    }
     
    private onOrderSubmit(): void { 
        console.log('onOrderSubmit: переход к форме контактов'); 
        
        // Проверяем валидность формы заказа 
        const validationResult = buyerModel.validateData(); 
        const hasOrderErrors = !!(validationResult.payment || validationResult.address); 
        
        if (hasOrderErrors) { 
            console.log('Форма заказа невалидна'); 
            return; 
        } 
        
        const contactsElement = contactsForm.render(); 
        modal.content = contactsElement; 
    } 
     
    private async onContactsSubmit(): Promise<void> { 
        console.log('onContactsSubmit: отправка заказа'); 
        
        const buyerData = buyerModel.getData(); 
        const cartItems = cartModel.getItems(); 
        const total = cartModel.getTotalAmount(); 
        
        // Проверяем валидность всей формы 
        const validationResult = buyerModel.validateData(); 
        const hasErrors = Object.keys(validationResult).length > 0; 
        
        if (hasErrors) { 
            console.log('Форма невалидна'); 
            return; 
        } 
        
        // Проверяем что корзина не пуста 
        if (cartItems.length === 0) { 
            console.log('Корзина пуста'); 
            contactsForm.errors = 'Корзина пуста'; 
            return; 
        } 
        
        try { 
            console.log('Отправка заказа'); 
            
            const result = await shopApi.submitOrder({ 
                ...buyerData, 
                total: total, 
                items: cartItems.map(item => item.id) 
            }); 
            
            console.log('Заказ успешно отправлен:', result); 
            
            // Очищаем корзину и данные покупателя 
            cartModel.clearCart(); 
            buyerModel.clearData(); 
            
            // Показываем успешное сообщение 
            success.total = total; 
            const successElement = success.render({ total }); 
            modal.content = successElement; 
            
        } catch (error) { 
            console.error('Ошибка оформления заказа:', error); 
            contactsForm.errors = 'Ошибка оформления заказа. Попробуйте еще раз.'; 
        } 
    } 
    
    private onSuccessClose(): void {
        modal.close();
    }
     
    private onModalClose(): void { 
        console.log('onModalClose: закрытие модального окна'); 
        modal.close(); 
    } 
} 

// Запуск приложения 
console.log('Запуск приложения Web-ларёк'); 
new AppPresenter();