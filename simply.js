const components = {};
// Глобальный объект для хранения всех стилей
let globalStyles = '';

/**
 * Запуск приложения
 *
 * @param {string} appElementId Id корневого элемента
 * @param {string} mainComponentName Имя корневого компонента
 */
async function runSimply(appElementId, mainComponentName) {
  try {
    const mainComponent = await getComponentByName(mainComponentName);

    const appHtml = await renderComponent(mainComponent);

    const appElement = document.getElementById(appElementId);
    appElement.innerHTML = appHtml;
    addGlobalStyles();

    // 1.  Ждем загрузки всех компонентов
    await Promise.all(Object.values(components._loading));

    // 2. Перебираем только загруженные компоненты
    for (let componentName in components) {
      if (
        componentName !== '_loading' &&
        components.hasOwnProperty(componentName)
      ) {
        // Фильтруем служебные свойства
        await bindEvents(components[componentName]); // Передаем сам компонент
      }
    }
  } catch (error) {
    console.error('Ошибка при запуске приложения:', error);
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
    throw new Error('Компонент не имеет свойства html');
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

  // Обработка дочерних компонентов
  const componentRegex = /<([^>]+)\/>/g;
  const componentMatches = template.match(componentRegex);
  if (componentMatches) {
    for (let componentMatch of componentMatches) {
      let componentName = componentMatch.split(' ')[0].slice(1);
      let componentAttributes = getComponentAttributes(componentMatch);
      const childComponent = await getComponentByName(componentName); // Асинхронное получение дочернего компонента
      if (childComponent) {
        //  Создаем  новый  экземпляр  компонента
        let componentInstance = Object.assign({}, childComponent);
        componentInstance.js.var = Object.assign(
          {},
          componentInstance.js.var,
          componentAttributes
        );

        const childComponentHtml = await renderComponent(componentInstance);
        template = template.replace(componentMatch, childComponentHtml);
      } else {
        console.error(`Компонент ${componentName} не найден!`);
      }
    }
  }

  // Применяем стили компонента
  applyStyles(component);

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
  let attrMatches = componentMatch.match(
    /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g
  );

  if (attrMatches) {
    // Преобразуем атрибуты в объект
    attrMatches.forEach((attrMatch) => {
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
  if (!components._loading) {
    components._loading = {}; // Хранилище загружаемых компонентов
  }

  // Проверяем, загружен ли компонент
  if (components[componentName]) {
    return components[componentName];
  }

  // Если компонент уже загружается, возвращаем текущий промис
  if (components._loading[componentName]) {
    return components._loading[componentName];
  }

  const path = `${componentsPath}/${componentName}.js`;

  // Создаем новый промис для загрузки компонента и сохраняем его в _loading
  components._loading[componentName] = new Promise(async (resolve, reject) => {
    try {
      var module = await loadComponentModule(path);

      componentName = path.split('/').pop().split('.').shift(); // Извлекаем имя компонента

      components[componentName] = module.default;
      resolve(components[componentName]);
    } catch (error) {
      console.error(`Ошибка при загрузке компонента ${componentName}:`, error);
      reject(error); // Передаем ошибку в reject
      delete components._loading[componentName];
    }
  });

  return components._loading[componentName];
}

/**
 * Применение стилей компонента
 *
 * @param {object} component Объект компонента
 */
function applyStyles(component) {
  if (!component.css) return; // Проверка на наличие стилей

  if (!globalStyles.includes(component.css)) {
    globalStyles += component.css;
  }
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
 * Загружает модуль компонента
 *
 * @param {string} componentPath Путь до файла модуля
 */
async function loadComponentModule(componentPath) {
  try {
    let module = await import(componentPath);
    return module;
  } catch (error) {
    console.error(
      `Ошибка при динамическом импорте модуля ${componentPath}:`,
      error
    );
    throw error; // Передаем ошибку дальше
  }
}

/**
 * Привязка событий компонента
 *
 * @param {object} component Объект компонента
 */
async function bindEvents(component) {
  if (!component || !component.js || !component.js.event) return; // Дополнительная проверка

  // Привязываем каждый обработчик события с использованием делегирования
  for (let eventName in component.js.event) {
    var handlerArray = component.js.event[eventName];
    var elems = document.querySelectorAll(handlerArray[0]);
    var handler = component.js.func[handlerArray[1]];

    if (handler) {
      elems.forEach((elem) => {
        elem.addEventListener(eventName, (e) => {
          handler(e);
        });
      });
    } else {
      console.warn(
        `Обработчик события ${handlerArray[1]} не найден для события ${eventName}`
      );
    }
  }
}
