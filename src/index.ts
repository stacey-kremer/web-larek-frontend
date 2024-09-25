import './scss/styles.scss';

import { AppState, CatalogChanged, DeliveryFormChangeData } from './components/AppState';
import { CardItem } from './components/Card';
import { ContactForm } from './components/ContactInfo';
import { DeliveryForm, paymentMethod } from './components/DeliveryInfo';
import { MarketApi } from './components/MarketAPI';
import { EventEmitter } from './components/base/Events';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { ShoppingCart } from './components/ShoppingCart';
import { Success } from './components/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IItem, IContactForm, IDeliveryForm, IOrderComplete } from './types';

// Щаблоны
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const shoppingCartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardInShoppingCartTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализируем события и api
const events = new EventEmitter();
const api = new MarketApi(CDN_URL, API_URL);

// Другие инициализации
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new ShoppingCart(cloneTemplate(shoppingCartTemplate), events);
const appState = new AppState({}, events);
const page = new Page(document.body, events);
const сontactInf = new ContactForm(cloneTemplate(contactsTemplate), events);
const deliveryInf = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
	onClick: (event: Event) => {
		events.emit('payment:changed', event.target);
	},
});
const success =  new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close(),
});

// Изменение списка товаров и отрисовка карточек
events.on<CatalogChanged>('items:changed', () => {
	const renderCard = (item: IItem) => {
		const card = new CardItem(cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	};

	const catalog = appState.getCatalog();
	page.catalog = catalog.map(renderCard);
});

// Выбор карточки с товаром
const handleCardSelect = (item: IItem) => {
	appState.setPreview(item);
};

events.on('card:select', handleCardSelect);

//Обновление модалки с предпросмотром товара и отрисовка карточки в модалке
events.on('preview:changed', (item: IItem) => {
	const card = new CardItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', item);
			card.buttonText = appState.isItemInBasket(item)
				? 'Удалить из корзины'
				: 'Добавить в корзину';
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			buttonText: appState.isItemInBasket(item)
				? 'Удалить из корзины'
				: 'Добавить в корзину',
		}),
	});
});

// Проверка, связанная с добавлением/удалением товара из корзины
events.on('item:check', (item: IItem) => {
	if (appState.isItemInBasket(item)) {
		events.emit('item:delete', item);
		appState.removeItemFromCart(item);
	} else {
		events.emit('item:add', item);
		appState.addItemToCart(item);
	}
});

// Добавление товара в корзину
events.on('item:add', (item: IItem) => {
	appState.addItemToCart(item);
});

// Удаление товара из корзины
events.on('item:delete', (item: IItem) => {
	appState.removeItemFromCart(item);
});

// Обновление корзины
// Отрисовка списка товаров в корзине и подсчет суммы
events.on('basket:changed', (items: IItem[]) => {
	appState.basket = items;
	basket.items = items.map((item, count) => {
		const card = new CardItem(cloneTemplate(cardInShoppingCartTemplate), {
			onClick: () => {
				events.emit('item:delete', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			count: (count + 1).toString(),
		});
	});
	const total = appState.getTotalSum();
	basket.totalSum = total;
});

// Обновление счетчика товаров в корзине
const updateCounter = () => {
	const itemCount = appState.getBasketCount(); 
	page.counter = itemCount;
};

events.on('count:changed', updateCounter);

//Открытие модального окна с корзиной
const openBasketModal = () => {
	const basketContent = basket.render({});
	modal.render({
		content: basketContent,
	});
};

events.on('basket:open', openBasketModal);

// Открытие формы заказа
const openOrder = () => {
	const deliveryContent = deliveryInf.render({
		payment: '',
		address: '',
		valid: false,
		errors: [],
	});

	modal.render({
		content: deliveryContent,
	});

	const orderData = appState.prepareOrderData();
};

events.on('order:open', openOrder);

// Обработка изменения способа оплаты
events.on('payment:changed', handlePaymentChange);

function handlePaymentChange({ method }: { method: string }) {
    appState.setPaymentMethod(method); 
    deliveryInf.updatePaymentButtons();
}

// Изменение полей формы доставки
events.on(/^order\..*:change/, handleOrderChange);

function handleOrderChange(data: {
	field: keyof IDeliveryForm;
	value: string;
}) {
	const { field, value } = data;
	appState.setDeliveryField(field, value);
}

// Обработка информации, связанной с доставкой и оплатой
events.on('deliveryForm:changed', (data: DeliveryFormChangeData) => {
    deliveryInf.valid = data.valid; 
    deliveryInf.errors = data.errors; 
});



//Переход к заполнению контактных данных
events.on('order:submit', () => {
    modal.render({
        content: сontactInf.render({
            email: '',
            phone: '',
            errors: [],
            valid: false,
        }),
    });
});

// Изменение полей формы контактов
events.on(/^contacts\..*:change/, handleContactChange);

function handleContactChange(data: {
	field: keyof IContactForm;
	value: string;
}) {
	appState.setContactField(data.field, data.value);
}

// Обработка информации, связанная с контактами покупателя
events.on('contactForm:changed', handleContactFormChange);

function handleContactFormChange(errors: Partial<IContactForm>) {
	const { email, phone } = errors;
	сontactInf.valid = !email && !phone;
	сontactInf.errors = getErrorMessages({ email, phone });
}

function getErrorMessages(errors: Partial<IContactForm>): string {
	return Object.values(errors).filter(Boolean).join('; ');
}

// Отправка данных на свервер и отрисовка окна успешной покупки
events.on('contacts:submit', handleContactsSubmit);

function handleContactsSubmit() {
    const orderData = appState.prepareOrderData();
    api.orderItem(orderData)
        .then(handleOrderSuccess)
        .catch(handleOrderError);
}

function handleOrderSuccess(result: IOrderComplete) {
    appState.clearCart();
    const total = Number(result.total);
   
    success.setTotal(total); 
    modal.render({
        content: success.render({}),
    });
}

function handleOrderError(error: Error) {
    console.error('Order error:', error);
}

//Блокируем прокрутку при открытом модальном окне
events.on('modal:open', () => {
	page.locked = true;
});

//Разблокируем при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

//Получаем список товаров при загрузке приложения
api
	.getItemList()
	.then(appState.setItems.bind(appState))
	.catch((err) => {
		console.error(err);
	});