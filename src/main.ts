import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ShopApi } from './components/Communication/ShopApi';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { Products } from './components/Models/Products';
import { IBuyer } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();
const shopApi = new ShopApi(new Api(API_URL));

const [firstProduct, secondProduct, productWithoutPrice] = apiProducts.items;
const unknownProductId = 'unknown-id';
const testBuyer: IBuyer = {
    payment: 'card',
    email: 'buyer@example.com',
    phone: '+70000000000',
    address: 'Москва, ул. Тверская, 1',
};

/* Проверка модели каталога */
productsModel.setItems(apiProducts.items);
console.log('Каталог: массив товаров', productsModel.getItems());
console.log('Каталог: товар по существующему id', productsModel.getItem(firstProduct.id));
console.log('Каталог: товар по несуществующему id', productsModel.getItem(unknownProductId));
console.log('Каталог: выбранный товар до выбора', productsModel.getSelectedItem());
productsModel.setSelectedItem(secondProduct);
console.log('Каталог: выбранный товар после выбора', productsModel.getSelectedItem());

/* Проверка модели корзины */
console.log('Корзина: товары в новой корзине', cartModel.getItems());
cartModel.addItem(firstProduct);
cartModel.addItem(secondProduct);
cartModel.addItem(productWithoutPrice);
console.log('Корзина: товары после добавления трёх товаров', cartModel.getItems());
cartModel.addItem(firstProduct);
console.log('Корзина: количество после повторного добавления товара', cartModel.getCount());
console.log('Корзина: стоимость (товар без цены считается как 0)', cartModel.getTotal());
console.log('Корзина: первый товар в корзине?', cartModel.hasItem(firstProduct.id));
cartModel.removeItem(firstProduct);
console.log('Корзина: товары после удаления первого товара', cartModel.getItems());
console.log('Корзина: первый товар в корзине после удаления?', cartModel.hasItem(firstProduct.id));
console.log('Корзина: количество после удаления', cartModel.getCount());
console.log('Корзина: стоимость после удаления', cartModel.getTotal());
cartModel.clear();
console.log('Корзина: товары после очистки', cartModel.getItems());
console.log('Корзина: количество после очистки', cartModel.getCount());
console.log('Корзина: стоимость после очистки', cartModel.getTotal());

/* Проверка модели покупателя */
console.log('Покупатель: данные нового покупателя', buyerModel.getData());
console.log('Покупатель: ошибки пустых данных', buyerModel.validate());
buyerModel.setData({ address: testBuyer.address });
console.log('Покупатель: данные после сохранения только адреса', buyerModel.getData());
buyerModel.setData({ payment: testBuyer.payment });
console.log('Покупатель: адрес сохранился после выбора оплаты', buyerModel.getData());
console.log('Покупатель: ошибки после заполнения адреса и оплаты', buyerModel.validate());
buyerModel.setData({ email: testBuyer.email, phone: testBuyer.phone });
console.log('Покупатель: данные после заполнения всех полей', buyerModel.getData());
console.log('Покупатель: ошибки заполненных данных', buyerModel.validate());
buyerModel.clear();
console.log('Покупатель: данные после очистки', buyerModel.getData());

/* Получение каталога с сервера */
shopApi
    .getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Каталог с сервера: массив товаров', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Каталог с сервера: ошибка загрузки', error);
    });
