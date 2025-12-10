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

// Создание экземпляров вне класса
const productModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Инициализация API
const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);

// Инициализация представлений
const modal = new Modal(
    ensureElement<HTMLElement>('#modal-container'),
    { onClose: () => {} }
);

const gallery = new Gallery(
    ensureElement<HTMLElement>('.gallery')
);

const basket = new Basket(
    cloneTemplate<HTMLElement>('#basket'),
    { onCheckout: () => {} }
);

const header = new Header(
    ensureElement<HTMLElement>('.header'),
    { onBasketClick: () => {} }
);

// Preview создается один раз
let preview: PreviewItem | null = null;

const orderForm = new OrderForm(
    cloneTemplate<HTMLElement>('#order'),
    { 
        onPaymentChange: () => {},
        onInput: () => {},
        onSubmit: () => {}
    }
);

const contactsForm = new ContactsForm(
    cloneTemplate<HTMLElement>('#contacts'),
    { 
        onInput: () => {},
        onSubmit: () => {}
    }
);

const success = new Success(
    cloneTemplate<HTMLElement>('#success'),
    { onClose: () => modal.close() }
);

class AppPresenter {
    constructor() {
        console.log('=== Инициализация приложения Web-ларёк ===');
        
        // Подписка на события моделей
        productModel.on('products:changed', () => this.onProductsChanged());
        productModel.on('preview:changed', () => this.onPreviewChanged());
        cartModel.on('cart:changed', () => this.onCartChanged());
        buyerModel.on('buyer:changed', () => this.onBuyerChanged());
        
        // Начальная загрузка данных
        this.loadProducts();
        
        // Настройка обработчиков для статических элементов
        this.setupStaticHandlers();
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
    
    private setupStaticHandlers(): void {
        // Настройка обработчика для корзины в шапке
        const headerBasket = document.querySelector('.header__basket');
        if (headerBasket) {
            headerBasket.addEventListener('click', (event) => {
                event.preventDefault();
                this.onBasketOpen();
            });
        }
        
        // Настройка обработчика для кнопки закрытия модального окна
        const modalCloseBtn = document.querySelector('.modal__close');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                this.onModalClose();
            });
        }
    }
    
    private onProductsChanged(): void {
        console.log('onProductsChanged: обновление каталога');
        const products = productModel.getItems();
        console.log('Товаров для отображения:', products.length);
        gallery.clear();
    
        // Используем map
        const cardElements = products.map((product: IProduct) => {
            const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
            const card = new CatalogItem(
                cardElement,
                { onClick: () => this.onCatalogItemClick(product) }
            );
        
            const cardData = {
                ...product,
                image: `${CDN_URL}/${product.image}`
            };
        
            return card.render(cardData);
        });
        
        // Добавляем все карточки
        cardElements.forEach(cardElement => {
            gallery.render().append(cardElement);
        });
    }
    
    private onPreviewChanged(): void {
        console.log('onPreviewChanged: открытие предпросмотра');
        const product = productModel.getPreviewItem();
        if (product) {
            // Создаем PreviewItem только один раз
            if (!preview) {
                const previewElement = cloneTemplate<HTMLElement>('#card-preview');
                preview = new PreviewItem(
                    previewElement,
                    { onAddToCart: () => this.onAddToCart(product) }
                );
            }
            
            // Проверяем наличие товара в корзине
            const isInCart = cartModel.getItemIndex(product.id) !== -1;
            
            // Обновляем кнопку
            if (preview) {
                // Получаем DOM элемент preview
                const previewElement = preview.render();
                
                // Меняем текст кнопки
                const button = previewElement.querySelector('.button');
                if (button) {
                    button.textContent = isInCart ? 'Удалить' : 'Купить';
                }
                
                // Обновляем обработчик
                const buttonElement = previewElement.querySelector('.button');
                if (buttonElement) {
                    // Клонируем кнопку чтобы удалить старые обработчики
                    const newButton = buttonElement.cloneNode(true);
                    buttonElement.parentNode?.replaceChild(newButton, buttonElement);
                    
                    // Добавляем новый обработчик
                    (newButton as HTMLElement).addEventListener('click', () => {
                        if (isInCart) {
                            this.onRemoveFromCart(product);
                        } else {
                            this.onAddToCart(product);
                        }
                        modal.close();
                    });
                }
            }
        
            const previewData = {
                ...product,
                image: `${CDN_URL}/${product.image}`
            };
        
            const renderedPreview = preview!.render(previewData);
            modal.content = renderedPreview;
            modal.open();
        }
    }
    
    private onCartChanged(): void {
        console.log('onCartChanged: обновление корзины');
        const items = cartModel.getItems();
        const total = cartModel.getTotalAmount();
        const count = cartModel.getItemsCount();
        
        console.log(`Корзина: ${count} товаров на сумму ${total} синапсов`);
        
        // Обновляем корзину
        const basketElement = basket.render();
        basket.clear();
        basket.total = total;
        
        // Используем map для корзины
        const basketItems = items.map((item: IProduct, index: number) => {
            const basketItemElement = cloneTemplate<HTMLElement>('#card-basket');
            const basketItem = new BasketItem(
                basketItemElement,
                { onRemove: () => this.onRemoveFromCart(item) }
            );
            
            // Устанавливаем индекс
            (basketItem as any).index = index + 1;
            return basketItem.render(item);
        });
        
        // Добавляем все элементы корзины
        const listElement = basketElement.querySelector('.basket__list');
        if (listElement) {
            listElement.innerHTML = '';
            basketItems.forEach(item => {
                listElement.append(item);
            });
        }
        
        // Обновляем счетчик в шапке
        header.counter = count;
        
        // БЛОКИРУЕМ кнопку "Оформить" если корзина пуста
        const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;
        if (checkoutButton) {
            // Блокируем кнопку если корзина пуста
            checkoutButton.disabled = items.length === 0;
            
            // Настраиваем обработчик для кнопки "Оформить"
            // Удаляем старый обработчик
            const newButton = checkoutButton.cloneNode(true) as HTMLButtonElement;
            checkoutButton.parentNode?.replaceChild(newButton, checkoutButton);
            
            // Блокируем новую кнопку тоже
            newButton.disabled = items.length === 0;
            
            newButton.addEventListener('click', (event) => {
                event.preventDefault();
                // Дополнительная проверка на случай если кнопка все еще активна
                if (items.length === 0) {
                    console.log('Корзина пуста, оформление невозможно');
                    return;
                }
                this.onCheckout();
            });
        }
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
        
        // Устанавливаем ошибки только для соответствующих форм
        const orderErrors: string[] = [];
        if (validationResult.payment) orderErrors.push(validationResult.payment);
        if (validationResult.address) orderErrors.push(validationResult.address);
        orderForm.errors = orderErrors.join(', ');
        
        const contactsErrors: string[] = [];
        if (validationResult.email) contactsErrors.push(validationResult.email);
        if (validationResult.phone) contactsErrors.push(validationResult.phone);
        contactsForm.errors = contactsErrors.join(', ');
    }
    
    // Обработчики событий от представлений
    
    private onCatalogItemClick(product: IProduct): void {
        console.log('onCatalogItemClick:', product.title);
        productModel.setPreviewItem(product);
    }
    
    private onAddToCart(product: IProduct): void {
        console.log('onAddToCart:', product.title);
        cartModel.addItem(product);
    }
    
    private onRemoveFromCart(product: IProduct): void {
        console.log('onRemoveFromCart:', product.title);
        cartModel.removeItem(product);
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
        
        // Обновляем форму заказа с пустыми данными
        orderForm.payment = '';
        orderForm.address = '';
        orderForm.errors = '';
        orderForm.valid = false;
        
        const orderElement = orderForm.render();
        modal.content = orderElement;
        
        // Настройка обработчиков для формы заказа
        this.setupOrderFormHandlers(orderElement);
        
        modal.open();
    }
    
    private setupOrderFormHandlers(formElement: HTMLElement): void {
        // Кнопки оплаты
        const paymentButtons = formElement.querySelectorAll('.button_alt');
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Снимаем выделение со всех кнопок
                paymentButtons.forEach(btn => {
                    btn.classList.remove('button_alt-active');
                });
                // Выделяем нажатую кнопку
                button.classList.add('button_alt-active');
                
                this.onPaymentChange(button as HTMLButtonElement);
            });
        });
        
        // Поле адреса
        const addressInput = formElement.querySelector('input[name="address"]');
        if (addressInput) {
            addressInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                this.onOrderInput('address', target.value);
            });
        }
        
        // Кнопка "Далее"
        const orderSubmitButton = formElement.querySelector('button[type="submit"]');
        if (orderSubmitButton) {
            orderSubmitButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.onOrderSubmit(event);
            });
        }
    }
    
    private onPaymentChange(button: HTMLButtonElement): void {
        console.log('onPaymentChange:', button.name);
        buyerModel.setData({ payment: button.name });
    }
    
    private onOrderInput(field: string, value: string): void {
        console.log('onOrderInput:', field, '=', value);
        const data: {[key: string]: string} = {};
        data[field] = value;
        buyerModel.setData(data);
    }
    
    private onOrderSubmit(event: Event): void {
        event.preventDefault();
        console.log('onOrderSubmit: переход к форме контактов');
        
        // Проверяем валидность формы заказа
        const validationResult = buyerModel.validateData();
        const hasOrderErrors = !!(validationResult.payment || validationResult.address);
        
        if (hasOrderErrors) {
            console.log('Форма заказа невалидна');
            return;
        }
        
        // Очищаем поля контактов при переходе к форме
        contactsForm.email = '';
        contactsForm.phone = '';
        contactsForm.errors = '';
        contactsForm.valid = false;
        
        const contactsElement = contactsForm.render();
        modal.content = contactsElement;
        
        // Настройка обработчиков для формы контактов
        this.setupContactsFormHandlers(contactsElement);
    }
    
    private setupContactsFormHandlers(formElement: HTMLElement): void {
        // Поля email и phone
        const emailInput = formElement.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                this.onContactsInput('email', target.value);
            });
        }

        const phoneInput = formElement.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                this.onContactsInput('phone', target.value);
            });
        }
        
        // Кнопка "Оплатить"
        const contactsSubmitButton = formElement.querySelector('button[type="submit"]');
        if (contactsSubmitButton) {
            contactsSubmitButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.onContactsSubmit(event);
            });
        }
    }
    
    private onContactsInput(field: string, value: string): void {
        console.log('onContactsInput:', field, '=', value);
        const data: {[key: string]: string} = {};
        data[field] = value;
        buyerModel.setData(data);
    }
    
    private async onContactsSubmit(event: Event): Promise<void> {
        event.preventDefault();
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
    
    private onModalClose(): void {
        console.log('onModalClose: закрытие модального окна');
        modal.close();
    }
}

// Запуск приложения
console.log('Запуск приложения Web-ларёк');
new AppPresenter();