import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ShopApi } from './components/Communication/ShopApi';
import { Buyer } from './components/Models/Buyer';
import { Cart } from './components/Models/Cart';
import { Products } from './components/Models/Products';
import { Basket } from './components/View/Basket';
import { CardBasket } from './components/View/CardBasket';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { ContactsForm } from './components/View/ContactsForm';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { Success } from './components/View/Success';
import { IBuyer, IOrderRequest, IProduct, TContactsForm, TOrderForm } from './types';
import { API_URL, CDN_URL, uiTexts } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const shopApi = new ShopApi(new Api(API_URL));

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const header = new Header(ensureElement('.header'), events);
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'));
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('card:toggle'),
});
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

function getPreviewButtonText(product: IProduct): string {
    if (product.price === null) return uiTexts.unavailable;
    return cartModel.hasItem(product.id) ? uiTexts.removeFromBasket : uiTexts.buy;
}

function joinErrors(...errors: (string | undefined)[]): string {
    return errors.filter(Boolean).join('; ');
}

function getOrderFormState(): TOrderForm {
    const { payment, address } = buyerModel.getData();
    const errors = buyerModel.validate();
    return {
        payment,
        address,
        valid: !errors.payment && !errors.address,
        errors: joinErrors(errors.payment, errors.address),
    };
}

function getContactsFormState(): TContactsForm {
    const { email, phone } = buyerModel.getData();
    const errors = buyerModel.validate();
    return {
        email,
        phone,
        valid: !errors.email && !errors.phone,
        errors: joinErrors(errors.email, errors.phone),
    };
}

function openModal(content: HTMLElement): void {
    modal.render({ content });
    modal.open();
}

/* События моделей данных */
events.on('catalog:changed', () => {
    const cards = productsModel.getItems().map((product) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', product),
        });
        return card.render({
            title: product.title,
            image: product.image,
            category: product.category,
            price: product.price,
        });
    });
    gallery.render({ catalog: cards });
});

events.on('product:selected', () => {
    const product = productsModel.getSelectedItem();
    if (!product) return;

    openModal(cardPreview.render({
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price,
        buttonText: getPreviewButtonText(product),
        buttonDisabled: product.price === null,
    }));
});

events.on('basket:changed', () => {
    const cards = cartModel.getItems().map((product, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', product),
        });
        return card.render({ title: product.title, price: product.price, index: index + 1 });
    });

    header.render({ counter: cartModel.getCount() });
    basket.render({
        items: cards,
        total: cartModel.getTotal(),
        buttonDisabled: cartModel.getCount() === 0,
    });
});

events.on('buyer:changed', () => {
    orderForm.render(getOrderFormState());
    contactsForm.render(getContactsFormState());
});

/* События представлений */
events.on<IProduct>('card:select', (product) => {
    productsModel.setSelectedItem(product);
});

events.on('card:toggle', () => {
    const product = productsModel.getSelectedItem();
    if (!product) return;

    if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product);
    } else {
        cartModel.addItem(product);
    }
    modal.close();
});

events.on('basket:open', () => {
    openModal(basket.render());
});

events.on<IProduct>('basket:remove', (product) => {
    cartModel.removeItem(product);
});

events.on('order:open', () => {
    openModal(orderForm.render());
});

events.on<Partial<IBuyer>>('form:change', (data) => {
    buyerModel.setData(data);
});

events.on('order:submit', () => {
    openModal(contactsForm.render());
});

events.on('contacts:submit', () => {
    const { payment, address, email, phone } = buyerModel.getData();
    if (!payment) return;

    const order: IOrderRequest = {
        payment,
        address,
        email,
        phone,
        total: cartModel.getTotal(),
        items: cartModel.getItems().map((product) => product.id),
    };

    shopApi
        .createOrder(order)
        .then((result) => {
            cartModel.clear();
            buyerModel.clear();
            openModal(success.render({ total: result.total }));
        })
        .catch((error) => {
            contactsForm.render({ errors: String(error) });
        });
});

events.on('success:close', () => {
    modal.close();
});

/* Стартовое состояние моделей и загрузка каталога с сервера */
cartModel.clear();
buyerModel.clear();

shopApi
    .getProducts()
    .then((response) => {
        productsModel.setItems(response.items.map((product) => ({
            ...product,
            image: `${CDN_URL}${product.image}`,
        })));
    })
    .catch((error) => {
        console.error('Не удалось загрузить каталог товаров', error);
    });
