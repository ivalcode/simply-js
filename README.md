# Simply.js: Простой и легкий JavaScript компонентный микрофреймворк для создания динамических веб-интерфейсов

Simply.js предоставляет минималистичный подход к разработке фронтенда, фокусируясь на простоте и понятности. Он идеально подходит для небольших проектов, прототипирования или для тех, кто только начинает изучать JavaScript фреймворки.  Без сложных настроек и зависимостей вы сможете быстро создавать динамические компоненты и оживлять свои веб-страницы.

## Ключевые особенности:

* **Простота:** Минималистичный синтаксис и API. Легко изучить и использовать.
* **Компонентная архитектура:** Создавайте повторно используемые компоненты с HTML, CSS и JavaScript.
* **Обработка событий:**  Простое управление событиями вне компонента, через делигирование или ассинхронным добавлением слушателя в setInterval, когда элемент появится в DOM (см. примеры ниже).
* **Без зависимостей:**  Не требует дополнительных библиотек.


## Установка:

Просто скопируйте файл `simply.js` в ваш проект и подключите его к HTML-странице:

```html
<script src="simply.js"></script>
```

## Создание компонента:

Компоненты в Simply.js определяются как JavaScript объекты со следующей структурой:

**Важно: все компоненты должны иметь уникальные имена, даже если находятся в подпапках, потому что объекты всех компонентов являются глобальными!**

**Важно: каждый компонент создается в отдельном файле, одноименном самому компоненту!**

В vscode рекомендуется установить расширение **es6-string-html** и перед html и css строками ставить комментарий **/\*html\*/** и **/\*css\*/** для **сохранения подсветки синтаксиса**

```js
myComponent = { // при создании переменной-компонента нельзя использовать ключевые слова var, let, const, потому что все компоненты находятся в глобальной области видимости и являются свойствами объекта window
  html: /*html*/`
    <div class="my-component">
      <h1>{{title}}</h1>
      <p>{{description}}</p>
      <button>Click me</button>
    </div>
  `,
  css: /*css*/ `
    div {
      background-color: lightblue;
      padding: 20px;
    }

    h1 {
      color: navy;
    }
  `,
  js: { // все поля js-кода компонента (данные и методы) доступны глобально через myComponent
    var: { // объект данных компонента
      title: 'Привет, мир!',
      description: 'Это мой первый компонент Simply.js'
    },
    func: { // объект методов компонента
      handleClick: function(param) {
        console.log(param);
      }
    },
  }
};

// добавление события
document.addEventListener('click', (e) => {
  if(e.target === document.querySelector('.my-component')) { //делегируем событие компоненту
    myComponent.js.func.handleClick('Hello World!')
  }
})

// или

let timer = setInterval(() => {
  if(document.querySelector('.my-component')) { // если элемент уже в DOM
    document.querySelector('.my-component').addEventListener('click', () => { // добавляем обработку события
      myComponent.js.func.handleClick('Hello World!')
    })
    clearInterval(timer) // останавливаем таймер
  }
}, 100)
```

Все события нужно подключать вне объекта-компонента (как и любой произвольный js-код), но это нужно делать либо через делегирование событий из документа или корневого элемента в html-коде, либо асинхронно в setInterval с проверкой, что элемент появился в DOM, т.к. все компоненты подключаются ассинхронно

Все свойства объекта-компонента доступны глобально по его имени, как внутри компонента, так и снаружи: 

myComponent.js.var,

myComponent.js.func

и т.д. 

**Блок данных (var) используется только для хранения данных компонента и первоначальной передачи данных в шаблон, а изменение этих данных в последствии не меняет автоматически html-код, это нужно делать вручную через innerHTML**

## Подключение компонента:

Для запуска приложения и подключения компонента используйте функцию runSimply:

```js
// Глобальная переменная componentsPath должна быть установлена перед запуском приложения
const componentsPath = './components'; // Путь к папке с компонентами

// Указываем id элемента, куда будет вставлен компонент, и имя корневого компонента
runSimply('app', 'myComponent'); 
```

В вашем HTML должен быть элемент с указанным id:

```html
<div id="app"></div>
```

## Работа с дочерними компонентами:

Вы можете вставлять дочерние компоненты в строку html-кода родительского компонента, используя следующий синтаксис:

```html
<div class="my-component">
  <MyChildComponent someAttribute="someValue" anotherAttribute="anotherValue"/>
  <MyChildComponent2 "/>
  <sub_folder/OtherChildComponent />
</div>
```

Данные из атрибутов нужно передавать, если компонент их ожидает в своем html-коде в двойных фигурных скобках (смотри пример компонента) и вы не хотите использовать эти данные из значений свойства var объекта-компонента, либо если там данные не определены, иначе будет undefined.

**Тег компонента должен заканчиваться "/>", в стандартных тегах таких сочитаний символов быть не должно!**

Пример подключения дочернего компонента через sub_folder **<sub_folder/OtherChildComponent />** позволяет подключить компонент **OtherChildComponent** из подпапки **sub_folder** корневой папки компонентов (**вложенность подпапок м.б. любой!**)

## Запуск приложения:

1. Создайте HTML файл.
2. Подключите simply.js через тег <script>перед вашим js-кодом (в теге head).
3. Создайте компонент как JavaScript объект в папке для компонентов.
4. В вашем js-коде создайте глобальную переменную componentsPath с сохранением пути до корневой папки компонентов.
5. Вызовите runSimply(), передав id корневого элемента и имя корневого компонента.
6. Откройте HTML файл в браузере.

## Пример:

[Вы можете посмотреть работающий пример использования Simply.js здесь!](https://github.com/ivalcode/ege.git "Сайт ЕГЭ по информатике")

## Лицензия:

**MIT**

