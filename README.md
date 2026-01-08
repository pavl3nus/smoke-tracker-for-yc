# Smoke Tracker - Дневник курильщика

**Веб-приложение для отслеживания и анализа привычки курения с целью снижения потребления**

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.9-green)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)
![Mantine UI](https://img.shields.io/badge/Mantine-8.3-purple)
![Docker](https://img.shields.io/badge/Docker-✓-blue)

## О проекте

SmokeTracker помогает пользователям контролировать привычку курения через:
- **Ведение дневника** курения с детализацией каждой ситуации
- **Анализ статистики** и выявление паттернов поведения
- **Постановку целей** по снижению потребления
- **Визуализацию экономии** и улучшения здоровья

- ## Функциональность 
### Для пользователя: 

✅ Добавление записей о курении с указанием причины и количества

✅ Просмотр истории с фильтрацией и сортировкой

✅ Анализ статистики по дням/неделям/месяцам

✅ Случайные советы для борьбы с желанием закурить

✅ Визуализация прогресса через графики и диаграммы

✅ Темная/светлая тема для комфортного использования

### Для разработчика: 

✅ Полный CRUD через REST API

✅ TypeScript для типобезопасности

✅ React Query для управления состоянием и кэширования

✅ Mantine UI для красивых и доступных компонентов

✅ Докеризация для простого развертывания

✅ Health checks для мониторинга

##  Архитектура
```bash
smoke-tracker/
├── frontend/ # React + TypeScript + Vite
│ ├── src/
│ │ ├── components/ # UI компоненты
│ │ ├── pages/ # Страницы приложения
│ │ ├── hooks/ # Кастомные хуки (React Query)
│ │ ├── utils/ # Утилиты и API клиент
│ │ └── types/ # TypeScript типы
│ └── Dockerfile # Контейнеризация фронтенда
│
├── backend/ # Node.js + Express
│ ├── src/
│ │ └── index.js # REST API сервер
│ ├── data.json # Хранение данных (файловая БД)
│ └── Dockerfile # Контейнеризация бэкенда
│
└── docker-compose.yml # Оркестрация контейнеров
```

## 🚀 Быстрый старт

### Вариант 1: Docker (рекомендуется)

#### Клонируйте репозиторий
```
git clone https://github.com/pavl3nus/smoke-tracker-for-yc.git
cd smoke-tracker
```

#### Запустите все сервисы
```
docker-compose up
```
### Вариант 2: Локальная разработка


#### Запуск бэкенда
```
cd backend
npm install
npm run dev # Сервер доступен на http://localhost:8000
```

#### Запуск фронтенда (в другом терминале)
```
cd frontend
npm install
npm run dev # Приложение доступно на http://localhost:5173
```
