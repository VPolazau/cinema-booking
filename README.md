# Cinema booking

Приложение для просмотра фильмов и кинотеатров, выбора сеанса, бронирования мест и оплаты билетов. Данные берутся из REST API.

## Реализовано

- Авторизация и регистрация (валидация форм, хранение токена в localStorage)
- Просмотр фильмов и кинотеатров
- Детальная страница фильма/кинотеатра с ближайшими сеансами
- Выбор мест на сеансе (гостевой режим: только просмотр занятых мест)
- Бронирование и оплата билетов
- Страница "Мои билеты" (доступна только авторизованным, группировка: неоплаченные/будущие/прошедшие)

## Дополнительно

- Адаптивная верстка (mobile/tablet/desktop)
- UX-редиректы для неавторизованных пользователей (next-параметр)
- Единая обертка страниц (BasePage):
    - Лоадер
    - Обработка ошибок
    - Таймаут долгой загрузки
    - Кнопка прокрутки вверх на длинных страницах

## Технологии

- Next.js (App Router)
- React
- TypeScript
- Redux Toolkit + RTK Query
- React Hook Form + Yup
- MUI
- Jest + Testing Library

## Требования

- Node.js 18+ (рекомендуется 20+)
- npm

## Переменные окружения

Приложение использует переменную:

- `NEXT_PUBLIC_API_URL` - базовый URL API

Пример `.env`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3022
```

## Установка и запуск

### Backend

[![Backend repo](https://img.shields.io/badge/backend-frontend__technical__task-blue)](https://github.com/maxbit-solution/frontend_technical_task)

Скачать проект backend ⬆️️ из репозитория и запустить:

```bash
npm i
npm start
```

### Frontend (этот проект)
```bash
npm i --legacy-peer-deps
npm run dev
```

Открыть в браузере: http://localhost:3000

Скрипты
- npm run dev - запуск в режиме разработки
- npm run build - production build
- npm run start - запуск production build
- npm run lint - ESLint
- npm run test - unit tests
- npm run test:coverage - тесты с покрытием

Структура проекта
- src/app - роуты Next.js
- src/templates - UI-шаблоны страниц и компоненты фич
- src/store
- src/store/api - RTK Query (cinemaApi)
- src/store/slice - auth/common slices
- src/context - провайдеры (инициализация токена, media query)
- ui - переиспользуемые UI-компоненты (BasePage, Loader, Separator и т.д.)
- utils - утилиты, хуки, константы

Тесты
```bash
npm run test
npm run test:coverage
```

Проект покрыт unit-тестами (компоненты, хуки, утилиты).

Покрытие тестами 23 suites, 126 tests, coverage ~93% statements

### Автор:
Polоzov Victor