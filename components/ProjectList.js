//  Файл:  components/ProjectList.js
ProjectList = {
  css: {
    '.project-list': {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'justify-content': 'center',
      'padding': '20px'
    },
    '.project-item': {
      'width': '300px',
      'margin': '10px',
      'border': '1px solid #ccc',
      'padding': '10px',
      'border-radius': '5px',
      'text-align': 'center'
    }
  },
  html: /*html*/ `
        <div class="project-list">
          <ProjectItem name="Проект  1" description="Крутой  веб-сайт  на  HTML,  CSS  и  JS" imageUrl="https://via.placeholder.com/300x200" />
          <ProjectItem name="Проект  2" description="Мобильное  приложение  на  React  Native" imageUrl="https://via.placeholder.com/300x200" />
          <ProjectItem name="Проект  3" description="Игра  на  Unity" imageUrl="https://via.placeholder.com/300x200" />
        </div>`,
  js: {}
}
