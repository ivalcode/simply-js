// Файл: components/Modal.js
Modal  =  {
  css:  {
    '.modal':  {
      'display':  'none',
      'position':  'fixed',
      'z-index':  '1',
      'left':  '0',
      'top':  '0',
      'width':  '100%',
      'height':  '100%',
      'overflow':  'auto',
      'background-color':  'rgba(0,0,0,0.4)'
    },
    '.modal-content':  {
      'background-color':  '#fefefe',
      'margin':  '15%  auto',
      'padding':  '20px',
      'border':  '1px  solid  #888',
      'width':  '80%'
    },
    '.close':  {
      'color':  '#aaa',
      'float':  'right',
      'font-size':  '28px',
      'font-weight':  'bold',
      'cursor': 'pointer'
    },
    '.close:hover,  .close:focus': {
      'color':  'black',
      'text-decoration':  'none',
      'cursor':  'pointer'
    }
  },
  html: `<div class="modal">
          <div class="modal-content">
            <span class="close"  @click="closeModal">×</span>
            <h2>{{  var.title  }}</h2>
            <p>{{  var.description  }}</p>
            <img  src="{{  var.imageUrl  }}"  alt="{{  var.name  }}">
            <a  href="{{  var.githubLink  }}"  target="_blank">GitHub</a>
          </div>
          </div>`,
  js:  {
    var:  {
      title:  '',
      description:  '',
      imageUrl:  '',
      githubLink:  ''
    },
    func:  {
      closeModal:  () =>  {
        document.querySelector('.modal').style.display  =  'none';
      }
    }
  }
}
