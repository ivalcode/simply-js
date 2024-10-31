//  Файл:  components/ProjectItem.js
ProjectItem = {
  css: {
    '.project-item': {
      border: '1px  solid  #ccc',
      padding: '10px',
      'border-radius': '5px',
      'text-align': 'center',
      'margin-bottom': '10px',
    },
    img: {
      'max-width': '100%',
      height: 'auto',
      'border-radius': '5px',
    },
  },
  html: `<div class="project-item">
            <img src="{{ imageUrl }}" alt="{{ name }}">
            <h3>{{ name }}</h3>
            <p>{{ description }}</p>
            <Modal />
          </div>`,
  js: {
    var: {
      name: '',
      description: '',
      imageUrl: '',
      modalTitle: 'HGHGHG',
      modalDescription: '',
      modalImageUrl: '',
      modalGithubLink: '',
    },
    func: {
      openModal: () => {
        const modal = document.querySelector('.modal');

        modal.style.display = 'block';
        //  Наполняем  модальное  окно  данными
        console.log(ProjectItem.js.var.modalTitle);

        modal.querySelector('h2').textContent = ProjectItem.js.var.modalTitle;

        modal.querySelector('p').textContent = ProjectItem.js.var.modalDescription;
        modal.querySelector('img').src = ProjectItem.js.var.modalImageUrl;
        modal.querySelector('a').href = ProjectItem.js.var.modalGithubLink;
      },
    },
    event: {
      click: 'openModal',
    },
  },
};
