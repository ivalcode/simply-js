//  Файл:  components/HelloWorld.js
HelloWorld  =  {
  css:  {
    '.hello-world':  {
      'background-color':  'lightblue',
      'padding':  '10px',
      'border-radius':  '5px'
    }
  },
  html:  /*html*/ `<div  class="hello-world">
              <h1>{{  title  }}</h1>
              <p> {{  description  }}</p>
          </div>`,
  js:  {
    var:  {
      title:  'Привет,  мир!',
      description:  'Это  простой  компонент  HelloWorld!'
    }
  }
}
