Header  =  {
  css:  {
    '.header':  {
      'background-color':  '#f0f0f0',
      'padding':  '20px',
      'text-align':  'center'
    },
    'h1': {
      'margin':  '0'
    }
  },
  html:  `<div  class="header">
            <h1>{{  name  }}</h1>
            <p>{{  description  }}</p>
            <button>Нажми  меня!</button>
          </div>`,
  js:  {
    var: {
      name:  'Саша  —  Веб-разработчик',
      description:  'Создаю  сайты,  которые  делают  мир  лучше!'
    },
    func: {
      handleClick: (e) => {
        if(e.target.tagName.toUpperCase() === 'BUTTON') {
          console.log('Клик по кнопке в Header!');
        }
      }
    },
    event: {
      click: 'handleClick' // Указываем название функции, а не используем this
    }
  }
}
