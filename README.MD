# Task Management System UI [[English version]](README-en.md)

Фронтенд UI на React движке [Refine](https://github.com/refinedev/refine) к шаблону [REST API серверу](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template) на чистой архитектуре

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Описание проекта

Проект представляет собой современный фронтенд для управления задачами с полным CRUD функционалом, аутентификацией через Keycloak и интеграцией с REST API сервером на чистой архитектуре.

### 🚀 Основные возможности

- **📊 Интерактивный дашборд** - статистика по задачам в реальном времени
- **📝 Управление задачами** - создание, редактирование, просмотр, удаление
- **🔍 Фильтрация по статусам** - удобная фильтрация задач
- **🔐 Аутентификация** - интеграция с Keycloak
- **📱 Responsive дизайн** - адаптивный интерфейс для всех устройств
- **✅ Валидация форм** - проверка корректности вводимых данных
- **🎨 Современный UI** - Material Design с темной/светлой темой

### 🏗️ Архитектура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── app-icon.tsx    # Иконка приложения
│   └── header/          # Заголовок приложения
├── contexts/            # React контексты
│   └── color-mode.tsx  # Управление темой
├── pages/               # Страницы приложения
│   ├── dashboard/       # Дашборд со статистикой
│   └── tasks/           # Управление задачами
│       ├── list.tsx    # Список задач с фильтрацией
│       ├── create.tsx  # Создание задачи
│       ├── edit.tsx    # Редактирование задачи
│       └── show.tsx    # Просмотр задачи
├── providers/           # Провайдеры данных
│   └── core-provider.ts # Data provider для API
├── types/              # TypeScript типы
│   └── task.ts         # Типы сущности Task
└── App.tsx             # Главный компонент приложения
```

## 🛠️ Технологический стек

- **Frontend Framework:** [React 18](https://reactjs.org/)
- **UI Framework:** [Refine](https://refinedev.dev/) + [Material-UI](https://mui.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Authentication:** [Keycloak](https://www.keycloak.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **State Management:** React Hooks + Refine Data Provider

## 📋 Функциональность

### 🏠 Дашборд

- **Общая статистика:** общее количество задач, выполненные, в работе, черновики/ошибки
- **Статистика по статусам:** распределение задач по всем статусам с цветовой индикацией
- **Последние задачи:** отображение последних 5 созданных задач
- **Адаптивный дизайн:** корректное отображение на всех устройствах

### 📋 Управление задачами

#### Поля задачи:
- **Name** (обязательное) - название задачи
- **Status** - статус (DRAFT, STARTED, INWORK, ONPAUSE, CANCELED, COMPLETED, ERROR)
- **Description** - подробное описание
- **Comment** - комментарии к задаче
- **Project ID** - ID проекта (только цифры, опционально)

#### Валидация:
- **Name** - обязательное поле
- **Project ID** - только числовые значения
- **Все поля** - корректная обработка пустых значений

#### Фильтрация:
- **Фильтр по статусу** - выпадающий список с возможностью выбора конкретного статуса
- **Мгновенная фильтрация** - фильтрация работает на стороне клиента

### 🔐 Аутентификация

- **Keycloak интеграция** - полная интеграция с Keycloak
- **Автоматический редирект** - перенаправление на страницу логина при необходимости
- **JWT токены** - автоматическое обновление и управление токенами
- **Пользовательский профиль** - отображение информации о пользователе

## 🚀 Установка и запуск

### Требования

- Node.js 18+
- npm или yarn
- Docker и Docker Compose (для опционального запуска)

### Установка зависимостей

```bash
npm install
```

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:1234/api/v1
VITE_KEYCLOAK_URL=http://localhost:8282
VITE_KEYCLOAK_REALM=rest-nodejs-cleanarch-template
VITE_KEYCLOAK_CLIENT_ID=rest-nodejs-cleanarch-template-ui
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для продакшена

```bash
npm run build
```

### Запуск продакшн версии

```bash
npm run serve
```

## 🐳 Docker

### Запуск с Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Остановка
docker-compose down
```

### Сборка Docker образа

```bash
docker build -t task-management-ui .
```

## 🔧 Конфигурация

### API интеграция

Приложение интегрируется с REST API по следующим эндпоинтам:

- `GET /api/v1/tasks` - получение списка задач
- `POST /api/v1/tasks` - создание задачи
- `GET /api/v1/tasks/:id` - получение задачи
- `PUT /api/v1/tasks/:id` - обновление задачи
- `DELETE /api/v1/tasks/:id` - удаление задачи

### Data Provider

Кастомный data provider обрабатывает:
- **Аутентификацию** - автоматическое добавление JWT токенов
- **Валидацию данных** - проверка и преобразование данных
- **Обработка ошибок** - корректная обработка ошибок API
- **Пагинация и сортировка** - поддержка серверной пагинации

## 🧪 Тестирование

### Запуск тестов

```bash
# Запуск unit тестов
npm test

# Запуск с покрытием
npm run test:coverage

# Запуск в watch режиме
npm run test:watch
```

## 📝 Разработка

### Структура компонент

Пример создания нового компонента:

```typescript
import React from 'react';
import { Box, Typography } from '@mui/material';

export const CustomComponent: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6">Custom Component</Typography>
    </Box>
  );
};
```

### Добавление новых страниц

1. Создайте компонент в `src/pages/`
2. Добавьте маршрут в `App.tsx`
3. Обновите ресурсы Refine при необходимости

### Стилизация

Проект использует Material-UI с кастомной темой:

```typescript
const theme = createTheme({
  palette: {
    mode: 'light', // или 'dark'
    primary: {
      main: '#1976d2',
    },
  },
});
```

## 🐛 Отладка

### Логирование

Включено логирование для:
- **API запросов** - все запросы к API
- **Аутентификации** - процесс логина и токены
- **Ошибок** - детальная информация об ошибках

### Инструменты разработчика

- **Refine Devtools** - встроенные инструменты отладки
- **React DevTools** - отладка React компонентов
- **Network Tab** - отладка сетевых запросов

## 📚 Дополнительная документация

- [Refine Documentation](https://refinedev.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Внесите изменения
4. Закоммитьте (`git commit -m 'Add some AmazingFeature'`)
5. Отправьте в репозиторий (`git push origin feature/AmazingFeature`)
6. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы, пожалуйста:

1. Проверьте [существующие issues](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template-ui/issues)
2. Создайте [новый issue](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template-ui/issues/new)
3. Свяжитесь с автором проекта

---

**Зависимости:**

Проект необходимо запускать совместно и после:

1. [Шаблон сервера](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template)
2. [Сервер аутентификации](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template-auth)
