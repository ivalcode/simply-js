/**
 * Запуск приложения
 *
 * @param {string} appElementId
 * @param {string} mainComponentName
 */
async function runSimply(appElementId, mainComponentName) {
  try {
    const mainComponent = await getComponentByName(mainComponentName);

    const appHtml = await renderComponent(mainComponent);

    const appElement = document.getElementById(appElementId);
    appElement.innerHTML = appHtml;

    addGlobalStyles();
  } catch (error) {
    console.error("Ошибка при запуске приложения:", error);
  }
}

/**
 * Чтение компонента
 *
 * @param {object} component Объект компонента
 * @returns {string} Html- код компонента
 */
async function renderComponent(component) {
  if (!component || !component.html) {
    throw new Error("Компонент не имеет свойства html");
  }

  let template = component.html;

  // Замена переменных в шаблоне
  const varRegex = /{{(.*?)}}/g;
  let varMatches = template.match(varRegex);
  if (varMatches) {
    for (let varMatch of varMatches) {
      let varName = varMatch.slice(2, -2).trim();
      if (varName.includes('(')) {
        const funcName = varName.split('(')[0];
        template = template.replace(varMatch, component.js.func[funcName]());
      } else {
        template = template.replace(varMatch, component.js.var[varName]);
      }
    }
  }

  // Добавление уникального ID
  const componentId = 'simply-component-' + Math.random().toString(36).substring(2, 15);
  template = template.replace('<div', `<div id="${componentId}"`);

  // Обработка дочерних компонентов
  const componentRegex = /<([^>]+)\/>/g;
  const componentMatches = template.match(componentRegex);
  if (componentMatches) {
    for (let componentMatch of componentMatches) {
      let componentName = componentMatch.split(' ')[0].slice(1);
      let  componentAttributes  =  getComponentAttributes(componentMatch);
      const childComponent = await getComponentByName(componentName); // Асинхронное получение дочернего компонента
      if (childComponent) {
        //  Создаем  новый  экземпляр  компонента
        let  componentInstance  =  Object.assign({},  childComponent);
        componentInstance.js.var  =  Object.assign({},  componentInstance.js.var,  componentAttributes);

        const childComponentHtml = await renderComponent(componentInstance);
        template = template.replace(componentMatch, childComponentHtml);
      } else {
        console.error(`Компонент ${componentName} не найден!`);
      }
    }
  }

  // Применяем стили компонента
  applyStyles(component);

  // Привязываем обработчики событий
  bindEvents(component, componentId);

  return template;
}

/**
 * Получение параметров для компонента
 *
 * @param {string} componentMatch Строка для извленеия параметров
 * @returns {object} Объект параметров
 */
function getComponentAttributes(componentMatch) {
  let attributes = {};
  // Находим все атрибуты в строке тега
  let attrMatches = componentMatch.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);

  if (attrMatches) {
    // Преобразуем атрибуты в объект
    attrMatches.forEach(attrMatch => {
      let [attrName, attrValue] = attrMatch.split('=');
      attrName = attrName.trim();
      attrValue = attrValue.replace(/['"]/g, '').trim(); // Убираем кавычки
      attributes[attrName] = attrValue;
    });
  }
  return attributes;
}

/**
 * Получение компонента по его имени
 *
 * @param {string} componentName Имя компонента
 * @returns {object} Объект компонента
 */
async function getComponentByName(componentName) {
  const componentPath = 'components/' + componentName + '.js';

  try {
    await loadComponentModule(componentPath);
    if (window[componentName]) {
      return window[componentName];
    } else {
      throw new Error(`Компонент "${componentName}" не найден в модуле ${componentPath}`);
    }
  } catch (error) {
    console.error(`Ошибка при загрузке компонента ${componentName}:`, error);
    throw error;
  }
}

// Глобальный объект для хранения всех стилей
let globalStyles = '';

/**
 * Применение стилей компонента
 *
 * @param {object} component Объект компонента
 */
function applyStyles(component) {
  if (!component.css) return; // Проверка на наличие стилей
  let styles = component.css;

  // Генерация CSS-кода из объекта стилей
  let cssCode = '';
  for (let selector in styles) {
    cssCode += `${selector} { `;
    for (let property in styles[selector]) {
      cssCode += `${property}: ${styles[selector][property]}; `;
    }
    cssCode += `} `;
  }

  // Добавление стилей компонента в глобальный объект стилей
  globalStyles += cssCode;
}

/**
 * Добавление глобальных стилей на страницу
 */
function addGlobalStyles() {
  let styleTag = document.createElement('style');
  styleTag.innerHTML = globalStyles;
  document.head.appendChild(styleTag);
}

/**
 * Привязка событий компонента
 *
 * @param {object} component Объект компонента
 * @param {string} componentId Id-компонента
 */
function bindEvents(component, componentId) {
  if (!component.js.event) return; // Проверка на наличие событий

  // Привязываем каждый обработчик события с использованием делегирования
  for (let eventName in component.js.event) {
    const handlerName = component.js.event[eventName];
    const handler = component.js.func[handlerName];

    if (handler) {
      document.addEventListener(eventName, (e) => {
        // Проверка, что событие произошло в пределах нужного компонента
        if (e.target.closest(`#${componentId}`)) {
          handler.call(component.js, e); // Вызов обработчика с передачей контекста и события
        }
      });
    } else {
      console.warn(`Обработчик события ${handlerName} не найден для события ${eventName}`);
    }
  }
}

/**
 * Загружает модуль компонента
 *
 * @param {string} componentPath Путь до файла модуля
 */
function loadComponentModule(componentPath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', componentPath);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          let module = eval(xhr.responseText);
          resolve(module);
        } catch (err) {
          reject(new Error(`Ошибка в коде модуля: ${err.message}`));
        }
      } else {
        reject(new Error(xhr.statusText));
      }
    };

    xhr.onerror = () => reject(new Error('Ошибка загрузки файла!'));
    xhr.send();
  });
}
