# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс, который содержит карточку с товаром

```
interface IItem {
	id: string,
	title: string,
    description: string,
    price: number | null,
    category: string,
	image: string,
    index: string,
    buttonText: string;
    count: any;
}
```

Интерфейс, который определяет действия с товаром:

```
interface IItemActions {
	onClick: (event: MouseEvent) => void;
}
```

Интерфейс, в котором хранится модель данных корзины:

```
interface IShoppingCart {
    items: HTMLElement[];
    total: number;
}
```

Интерфейс, в котором хранится модель данных формы доставки

```
interface IDeliveryForm {
    payment: string,
    address: string,
}
```

Интерфейс, в котором хранится модель формы с контактными данными:

```
interface IContactForm {
    email: string,
    phone: string,
}
```

Интерфейс, который объединяет все данные заказа:

```
interface IOrder extends IDeliveryForm, IContactForm {
}
```

Интерфейс, в котором описывается состояние формы с данными (проверяется валидность, определяется состояние кнопки):

```
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

Интерфейс, который описывает оформленный заказ

```
interface IOrderComplete{
    id: string,
}
```

Интерфейс, в котором содержится модель данных c сообщением об успешно совершенном заказе:

```
interface ISuccess {
	image: string;
	title: string;
	description: string;
	total: number | null;
}
```

Интерфейс, который определяет действия при успешно совершенном заказе:

```
interface ISuccessActions {
	onClick: () => void;
}
```

Интерфейс, который описывает структуру модального окна:

```
interface IModal {
    content: HTMLElement;
}
```

Интерфейс, который определяет структуру страницы:

```
export interface IPage {
	catalog: HTMLElement[];
	counter: number;
	locked: boolean;
}
```

Интерфейс, в котором определяются методы для взаимодействия с сервером:

```
export interface IMarketApi {
	getItemList: () => Promise<IItem[]>;
	orderItem: (order: IOrder) => Promise<IOrderComplete>;
}
```

Интерфейс, который описывает актуальное состояние приложения:

```
export interface IAppState {
	catalog: IItem[];
	basket: IItem[];
	order: IOrder | null;
    preview: string | null;
    delivery: IDeliveryForm | null;
    contacts: IContactForm | null;
}
```

Интерфейс, который описывает данные изменения в форме доставки:

```
export interface DeliveryFormChangeData {
    valid: boolean;
    errors: string;
}
```

Тип, который позволяет гибко задавать ошибки для различных полей заказа:

```
export type TErrorForm = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVС:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- слой коммуникации, отвечает за взаимодействием с внешним Api, обрабатывает запросы от слоя данных и передает данные обратно в слой данных

### Базовый код

### Слой представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных

#### Класс Page

Класс, который управляет отображением различных элементов страницы и взаимодействием пользователя со страницей
В полях класса хранятся следующие данные:

- `catalog: HTMLElement` - отображение каталога товаров на странице
- `counter: HTMLElement` - отображение количества товаров в корзине
- `wrapper: HTMLElement` - элемент-обёртка страницы с тем контентом, который можно заблокировать(зафиксировать)
- `basket: HTMLElement` - элемент корзины с покупками

Основные методы, реализуемые классом:

- `set catalog(items: HTMLElement[])` - устанавливает элементы каталога на странице
- `set counter(value: number)` - устанавливает значение счётчика и отображает актуальное количество товаров в корзине
- `set locked(value: boolean)` - отвечает за заблокированное/разблокированное состояния страницы

#### Класс Component

Абстрактный класс, который представляет из себя базовый компонент пользовательского интерфейса
Предназначен для конкретизации и расширения посредством других компонентов интерфейса
Основные методы, реализуемые классом:

- `toggleClass` - добавляет или удаляет класс в зависимости от его текущего состояния
- `setText` - устанавливает текстовое содержимое компонента
- `setDisabled` - включает/выключает элемент
- `setHidden` - скрывает элемент
- `setVisible` - показывает элемент
- `setImage` - устанавливает изображение и его альтернативный текст
- `render` - обновляет данные компонента и возвращает элемент

#### Класс Modal

Класс, который управляет отображением модального окна и позволяет пользователю взаимодействовать с ним
Управляет содержимым модального окна и его состоянием
В полях класса хранятся следующие данные:

- `сloseModalButton: HTMLButtonElement` - кнопка для закрытия модального ока
- `content: HTMLElement` - содержимое модального окна

Основные методы, реализуемые классом:

- `set content(value: HTMLElement)` - устанавливает содержимое модального окна
- `open(): void` - отвечает за открытие модального окна
- `close(): void` - отвечает за закрытие модального окна
- `render(data: IModal): HTMLElement` - отображает модальное окно с указанными данными

#### Класс Form

Класс, который управляет элементами формы, обрабатывает события и взаимодействия с пользователем, уведомляет об изменениях в полях формы, управляет состоянием кнопки и отображением ошибок валидации
В полях класса хранятся следующие данные:

- `submit: HTMLButtonElement` - кнопка для отправки формы с данными
- `errors: HTMLElement` - элемент для отображения ошибок валидации форм

Основные методы, реализуемые классом:

- `notifyFieldChange(field: keyof T, value: string): void` - уведомляет об изменении значений в полях формы, эмитирует события с новым значением поля
- `setInputValue(input: HTMLInputElement, value:string)` - устанавливает значение для элемента ввода
- `set valid(value: boolean)` - устанавливает состояние кнопки отправки формы
- `set errors(value: string)` - устанавливает текст сообщения об ошибках валидации
- `render(state: Partial<T> & IFormState): HTMLFormElement` - обновляет элементы и возвращает контейнер формы

#### Класс CardItem

Этот класс - компонент пользовательского интерфейса, который отображает карточку товара (заголовок, описание товара, цену товара, категорию товара, изображение товара)\
В полях класса хранятся следующие данные:

- `title: HTMLElement` - заголовок карточки товара
- `description: HTMLElement` - описание товара
- `price: HTMLElement` - цена товара
- `category: HTMLElement` - категория товара
- `image: HTMLImageElement` - изображение товара
- `button: HTMLButtonElement` - кнопка добавления товара в корзину
- `index: HTMLElement` - индекс товара

Основные методы, реализуемые классом:

- `set id(value: string)` - устанавливает идентификатор карточки с товаром
- `set title(value: string)` - устанавливает текст заголовка карточки
- `set description(value: string | string[])` - устанавливает текст описания товара, принимает как одну строку, так и массив строк
- `set price(value: number | null)` - устанавливает цену товара
- `set category(value: string)` - устанавливает название категории товара
- `set image(value: string)` - устанавливает изображение товара
- `set buttonText(value: string)` - устанавливает, какой текст будет отображаться на кнопке
- `set index(value: string)` - устанавливает индекс товара
- `setDisabled()` - отключает кнопку и делает её неактивной

#### Класс ShoppingCart

Класс отвечает за отображение элементов корзины с покупками, а также отвечает за взаимодействие пользователя с корзиной\
Содержит методы для обновления содержимого корзины, управляет состоянием корзины\
В полях класса хранятся следующие данные:

- `list: HTMLElement` - элемент, который представляет список товаров в корзине
- `totalSum: HTMLElement` - элемент, который отображает общую сумму товаров, содержащихся в корзине
- `buttonElement: HTMLButtonElement` - кнопка для оформления заказа

Основные методы, реализуемые классом:

- `setupEventListeners(): void` - настравиает обработчики событий
- `createMessage(): HTMLParagraphElement` - создает элемент с сообщением о том, что корзина пуста
- `set items(items: HTMLElement[])` - обновляет содержимое и устанавливает список товаров в корзине
- `set totalSum(totalSum: number)` - устанавливает общую сумму покупок

#### Класс ContactForm

Класс, который является наследником класса Form и отвечает за отображение и управление элементами формы: поля для ввода электронной почты и номера телефона\
Позволяет устанавливать значения полей через сеттеры\
В полях класса хранятся следующие данные:

- `emailInput: HTMLInputElement` - элемент формы для ввода электронной почты
- `phoneInput: HTMLInputElement` - элемент формы для ввода номера телефона

Основные методы, реализуемые классом:

- `set phone(value: string)` - устанавливает значение поля ввода телефона
- `set email(value: string)` - устанавливает значение поля ввода электронной почты

#### Класс DeliveryForm

Класс, который является наследником класса Form и отвечает за отображение и управление элементами формы: поля для ввода адреса, куда нужно доставить товар, а также кнопками-переключателями для выбора способа оплаты\
В полях класса хранятся следующие данные:

- `card: HTMLButtonElement` - кнопка для выбора оплаты онлайн
- `cash: HTMLButtonElement` - кнопка для выбора оплаты при получении
- `addressInput: HTMLInputElement` - поле ввода для указания адреса доставки
- `selectedPaymentMethod: string ` - свойство, которое хранит в себе метод оплаты

Основные методы, реализуемые классом:

- `set address(value: string)` - устанавливает значение поля адреса доставки
- `handlePaymentClick(event: MouseEvent)` - обрабатывает клик по кнопке оплаты, выбирая соответствующий метод в зависимости от нажатой кнопки
- `selectPaymentMethod(method: string)` - устанавливает выбранный метод оплаты, обновляет кнопки оплаты
- `updatePaymentButtons()` - обновляет классы у кнопок оплаты

#### Класс Success

Класс, которй отвечает за отображение информации об успешном оформлении заказа и также отвечает за взаимодействие с пользователем\
В полях класса хранятся следующие данные:

- `total: HTMLElement` - элемент, отображающий сумму покупок, списанную с пользователя
- `close: HTMLButtonElement` - кнопка для закрытия сообщения об успешном заказе

Методы, реализуемые классом:

- `setTotal(value: number | null) ` - устанавливает содержимое сообщения, отображая сумму покупок

### Слой данных

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов\
Методы:

- `get` - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове
- `handleResponse` - берёт на себя роль обработчика запросов, которые возвращает сервер

#### Класс Model

Абстрактный класс, который является базовой моделью, помогает управлять данными и взаимодействовать с событиями
Класс служит основой для создания более сложных моделей\
Основные методы, реализуемые классом:

- `setData` - инициализация данных, обновление свойств модели
- `emitChanges` - эмитирует события, обеспечивает связь между моделью и слушателями событий

#### Класс AppState

Класс, который отвечает за управление состоянием приложения (сюда входит информация о корзине, каталоге с товарами и текущем заказе, который совершает пользователь)\
В полях класса хранятся следующие данные:

- `basket: IItem[] = []` - список товаров в корзине
- `catalog: IItem[] = []` - список товаров в каталоге
- `shoppingCart: IShoppingCart = { items: [], total: 0 }` - состояние корзины покупок, включает в себя массив покупок и общую сумму
- `formErrors: TErrorForm = {}` - ошибки валидации формы
- `preview: string | null = null` - выбранный товар для предварительного просмотра
- `order: IOrder = { address: '', payment: 'online', email: '',phone: ''}` - данные о текущем заказе

Так же класс предоставляет набор методов для взаимодействия с этими данными:

- `prepareOrderData(): IOrder & { items: string[], total: number }` - подготавливает данные заказа
- `setItems(items: IItem[])` - обновляет список товаров в каталоге
- `setPreview(item: IItem)` - устанавливает предварительный просмотр
- `updateCart(item: IItem, action: 'add' | 'remove')` - добавляет или удаляет товар из корзины, обновляет корзину после изменений
- `addItemToCart(item: IItem)` - добавляет указанный товар в корзину
- `removeItemFromCart(item: IItem)` - удаляет указанный товар из корзины
- `clearCart()` - удаляет все товары из корзины
- `getTotalSum()` - вычисляет общую стоимость товаров в корзине
- `setDeliveryField(field: keyof IDeliveryForm, value: string)` - устанавливает значение для поля доставки
- `setContactField(field: keyof IContactForm, value: string)` - устанавливает значение для поля контактов
- `setPaymentMethod(payment: string)` - устанавливает значение для поля `payment`
- `validateDeliveryForm()` - проверяет корректность заполненных данных в форме доставки
- `validateContactForm()` - проверяет корректность заполненных данных в форме контактов
- `setPaymentMethod(method: string)` - обновляет способ оплаты заказа
- `isItemInBasket(item: IItem): boolean` - проверяет наличие товара в корзине
- `getBasketCount(): number` - проверяет количество товаров в корзине
- `getCatalog()` - метод для получения каталога
- `updateDeliveryInfo()` - обновляет информацию о доставке 
- `handleDeliveryFormSubmit()` - обрабатывает отправленную форму доставки
- `formatErrors(errors: Partial<IDeliveryForm>): string` - форматирует ошибки из формы доставки
- `clearOrder()` - сбрасывает все данные заказа к первоначальным установкам

### Слой коммуникации

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс MarketApi

Класс. который отвечает за взаимодействие с Api. Обеспечивает обмен данными между сервером и пользователями\
Реализует функциональность для общения с внешним сервисом и получения необходимых данных\
Основные методы, реализуемые классом:

- `getItemList(): Promise<IItem[]>` - отправляет get-запрос к Api для получения списка товаров, возвращает промис, который преобразуется в массив с товарами
- `orderItem(order: IOrder): Promise<IOrderComplete>` - отправляет POST-запрос с данными заказа на сервер, возвращает промис, который оповещает о завершенном заказе

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных, организован с помощью слоя коммуникации и брокера событий. Взаимодействие осуществляется за счет событий, генерируемых брокером событий, и обработчиков этих событий\

В `index.ts` сначала создаются экземпляры всех необходимых классов, включая слой коммуникации, а затем настраивается обработка событий, позволяющая слою представления запрашивать и обновлять данные через слой коммуникации\

_Список всех событий, которые могут генерироваться в системе:_\
_События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)_

- `items:changed` - изменения в карточке товара при добавлении/удалении товара из корзины
- `preview:changed` - обновление модального окна с предпросмотром товара
- `basket:changed` - изменения данных в корзине
- `deliveryForm:changed` - обработка информации, связанной с доставкой и оплатой
- `contactForm:changed` - изменилось одно из полей формы контактных данных
- `payment:changed` - изменение способа оплаты
- `count:changed` - обновление счетчика товаров в корзине
- `contactForm:changed` - обработка информации, связанная с контактами покупателя

- `card:select` - выбор карточки с товаром
- `item:check` - проверка, связанная с добавлением/удалением товара из корзины
- `item:add` - добавление товара в корзину
- `item:delete` - удаление товара из корзины


- `order:open` - открытие формы заказа
- `basket:open` - открытие модального окна с корзиной
- `modal:open` - открытие модального окна и блок прокрутки
- `modal:close` - закрытие модального окна и разблокировка прокрутки

- `order:submit` - сохранение данных с адресом пользователя и способом оплаты и переход к заполнению контактными данными пользователя
- `contacts:submit` - отправка данных на свервер и отрисовка окна успешной покупки