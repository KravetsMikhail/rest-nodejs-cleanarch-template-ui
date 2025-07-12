# rest-nodejs-cleanarch-template-ui

REST API server template on component-based pure architecture

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Project Description

The project is a frontend to the service's REST API template based on a pure architecture.

The project must be run jointly and after:

1. Server Template https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template

2. Authentication Server https://github.com/KravetsMikhail/rest-nodejs-cleanarch-template-auth

The project uses: [REACT](https://github.com/facebook/react ), [Refine](https://github.com/refinedev/refine ), [Vite](https://github.com/vitejs/vite ), [Keycloak](https://github.com/keycloak/keycloak )

## LAUNCH

### In the docker

We are taking the latest version

```bash
    sudo git pull
```

#### Launching docker

Linux

```bash
    sudo bash service_up.sh
```

Windows (in Git bash)

```bash
    bash service_up.sh
```

#### Stopping the docker

Linux

```bash
    sudo bash service_down.sh
```

Windows (in Git bash)

```bash
    bash service_down.sh
```

### Building a project

```bash
    npm run build
```

### Running debug

```bash
    npm run dev
```