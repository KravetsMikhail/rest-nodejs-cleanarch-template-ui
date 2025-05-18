# rest-nodejs-cleanarch-template-ui [[English version]](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template-ui/blob/main/README-en.md)

Фронтенд UI на React движке [Refine](https://github.com/refinedev/refine) к шаблону [REST API серверу](https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template) на чистой архитектуре

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Описание проекта

Проект представляет собой фронтенд к шаблону REST API сервиса на чистой архитектуре.

Проект необходимо запускать совместно и после:

1. Шаблон сервера https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template

2. Сервер аутентификации https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template-auth

В проекте применяются: [REACT](https://github.com/facebook/react), [Refine](https://github.com/refinedev/refine), [Vite](https://github.com/vitejs/vite), [Keycloak](https://github.com/keycloak/keycloak)

## ЗАПУСК

### В докере

Забираем последнюю версию

```bash
    sudo git pull
```

#### Запуск докера

Linux

```bash
    sudo bash service_up.sh
```

Windows (в Git bash)

```bash
    bash service_up.sh
```

#### Остановка докера

Linux

```bash
    sudo bash service_down.sh
```

Windows (в Git bash)

```bash
    bash service_down.sh
```

### Сборка проекта

```bash
    npm run build
```

### Запуск debug

```bash
    npm run dev
```