import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { ShopApi } from './components/api/ShopApi';
import { API_URL } from './utils/constants';

// Тестирование моделей данных
console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===');

const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// ТЕСТИРОВАНИЕ ProductModel
console.log('--- ProductModel тесты ---');
productsModel.setItems(apiProducts.items);
console.log('1. setItems/getItems - Массив товаров из каталога:', productsModel.getItems());

const testProductId = apiProducts.items[0].id;
const foundProduct = productsModel.getItem(testProductId);
console.log('2. getItem - Найден товар по ID:', foundProduct);

productsModel.setPreviewItem(apiProducts.items[1]);
console.log('3. setPreviewItem/getPreviewItem - Товар для предпросмотра:', productsModel.getPreviewItem());

// ТЕСТИРОВАНИЕ CartModel
console.log('--- CartModel тесты ---');
console.log('4. getItems - Корзина пустая:', cartModel.getItems());

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('5. addItem - После добавления 2 товаров:', cartModel.getItems());
console.log('6. getItemsCount - Количество товаров:', cartModel.getItemsCount());
console.log('7. getTotalAmount - Общая стоимость:', cartModel.getTotalAmount());
console.log('8. checkItemInCart - Проверка наличия товара:', cartModel.checkItemInCart(testProductId));

cartModel.removeItem(apiProducts.items[0]);
console.log('9. removeItem - После удаления одного товара:', cartModel.getItems());

cartModel.clearCart();
console.log('10. clearCart - После очистки корзины:', cartModel.getItems());

// ТЕСТИРОВАНИЕ BuyerModel
console.log('--- BuyerModel тесты ---');
console.log('11. getData - Данные по умолчанию:', buyerModel.getData());

buyerModel.setData({
    payment: 'card',
    email: 'test@example.com'
});
console.log('12. setData (частично) - После установки payment и email:', buyerModel.getData());

buyerModel.setData({
    phone: '+79999999999',
    address: 'Test Address'
});
console.log('13. setData (дозаполнение) - После установки phone и address:', buyerModel.getData());
console.log('14. validateData - Валидация заполненных данных:', buyerModel.validateData());

buyerModel.clearData();
console.log('15. clearData - После очистки данных:', buyerModel.getData());
console.log('16. validateData - Валидация пустых данных:', buyerModel.validateData());

// Тестирование работы с сервером
console.log('=== ТЕСТИРОВАНИЕ РАБОТЫ С СЕРВЕРОМ ===');

// Создаем экземпляры API классов с правильным URL из constants.ts
const baseApi = new Api(API_URL);
const shopApi = new ShopApi(baseApi);

console.log('17. ShopApi создан, методы доступны:');
console.log('   - getProductList:', typeof shopApi.getProductList);
console.log('   - submitOrder:', typeof shopApi.submitOrder);
console.log('   - API_URL:', API_URL);

// Выполняем запрос на сервер для получения каталога товаров
shopApi.getProductList()
    .then((products) => {
        console.log('18. getProductList - Полученные товары с сервера:', products);
        
        // Сохраняем полученный массив с товарами в модель данных
        productsModel.setItems(products);
        console.log('19. setItems - Каталог товаров сохранен в модель:', productsModel.getItems());
        
        // Дополнительная проверка методов с реальными данными
        if (products.length > 0) {
            const firstProduct = productsModel.getItem(products[0].id);
            console.log('20. getItem - Первый товар из реальных данных:', firstProduct);
        }
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров с сервера:', error);
        console.log('Используем тестовые данные');
        productsModel.setItems(apiProducts.items);
    });