import './scss/styles.scss';

import { AppState, CatalogChanged } from './components/common/AppState';
import { CardItem } from './components/common/Card';
import { ContactForm } from './components/common/ContactInfo';
import { DeliveryForm, paymentMethod } from './components/common/DeliveryInfo';
import { MarketApi } from './components/common/MarketAPI';
import { EventEmitter } from './components/base/Events';
import { Modal } from './components/common/Modal';
import { Page } from './components/common/Page';
import { ShoppingCart } from './components/common/ShoppingCart';
import { Success } from './components/common/Success';
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

	page.catalog = appState.catalog.map(renderCard);
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
			card.buttonText =
				appState.basket.indexOf(item) < 0
					? 'Добавить в корзину'
					: 'Удалить из корзины';
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			buttonText:
				appState.basket.indexOf(item) < 0
					? 'Добавить в корзину'
					: 'Удалить из корзины',
		}),
	});
});

// Проверка, связанная с добавлением/удалением товара из корзины
events.on('item:check', (item: IItem) => {
	appState.basket.indexOf(item) < 0
		? events.emit('item:add', item)
		: events.emit('item:delete', item);
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
	let total = 0;
	items.forEach((item) => {
		total = total + item.price;
	});
	basket.totalSum = total;
	appState.order.total = total;
});

// Обновление счетчика товаров в корзине
const updateCounter = () => {
	const itemCount = appState.basket.length;
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

	appState.order.items = appState.basket.map((item) => item.id);
};

events.on('order:open', openOrder);

// Обработка изменения способа оплаты
events.on('payment:changed', handlePaymentChange);

function handlePaymentChange(target: HTMLElement) {
	if (isButtonInactive(target)) {
		deliveryInf.switchButtons();
		updatePaymentMethod(target);
	}
}

function isButtonInactive(target: HTMLElement): boolean {
	return !target.classList.contains('button_alt-active');
}

function updatePaymentMethod(target: HTMLElement) {
	const paymentName = target.getAttribute('name');
	if (paymentName) {
		appState.order.payment = paymentMethod[paymentName];
	}
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
events.on('deliveryForm:changed', updateDeliveryInfo);

function updateDeliveryInfo(errors: Partial<IDeliveryForm>) {
    const { payment, address } = errors;

    deliveryInf.valid = !payment && !address;
    deliveryInf.errors = formatErrors({ payment, address });
}

function formatErrors(errors: Partial<IDeliveryForm>): string {
    return Object.values(errors)
        .filter(Boolean)
        .join('; ');
}

//Отправка данных о доставке и переход к заполнению контактных данных
events.on('order:submit', handleOrderSubmit);

function handleOrderSubmit() {
    renderContactInfo();
    updateOrderItems();
}

function renderContactInfo() {
    modal.render({
        content: сontactInf.render({
            email: '',
            phone: '',
            valid: false,
            errors: [],
        }),
    });
}

function updateOrderItems() {
    appState.order.items = appState.basket.map(item => item.id);
}

// Изменение полей формы контактов
events.on(/^contacts\..*:change/, handleContactChange);

function handleContactChange(data: { field: keyof IContactForm; value: string }) {
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
    return Object.values(errors)
        .filter(Boolean)
        .join('; ');
}

// Отправка данных на свервер и отрисовка окна успешной покупки
events.on('contacts:submit', handleContactsSubmit);

function handleContactsSubmit() {
    api.orderItem(appState.order)
        .then(handleOrderSuccess)
        .catch(handleOrderError);
}

function handleOrderSuccess(result: IOrderComplete) {
    appState.clearCart();
    const success = createSuccessModal(result.total);
    modal.render({
        content: success.render({}),
    });
}

function createSuccessModal(total: number) {
    const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close(),
    });
    success.total = total;
    return success;
}

function handleOrderError(error: Error) {
    console.error(error);
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
