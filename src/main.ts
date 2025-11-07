import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { ShopApi } from './components/api/ShopApi';

// Тестирование моделей данных
console.log('=== Тестирование моделей данных ===');
const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога (тестовые данные):', productsModel.getItems());

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', cartModel.getItems());

buyerModel.setData({
    payment: 'card',
    email: 'test@example.com',
    phone: '+79999999999',
    address: 'Test Address'
});
console.log('Данные покупателя:', buyerModel.getData());

// Тестирование работы с сервером
console.log('=== Тестирование работы с сервером ===');

// Создаем экземпляры API классов
const baseApi = new Api('');
const shopApi = new ShopApi(baseApi);

// Выполняем запрос на сервер для получения каталога товаров
shopApi.getProductList()
    .then((products) => {
        console.log('Полученные товары с сервера:', products);
        
        // Сохраняем полученный массив с товарами в модель данных
        productsModel.setItems(products);
        console.log('Каталог товаров сохранен в модель:', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров с сервера:', error);
        console.log('Используем тестовые данные');
        productsModel.setItems(apiProducts.items);
    });