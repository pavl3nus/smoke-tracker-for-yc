# Smoke Tracker - Дневник курильщика 🚬→💪

**Веб-приложение для отслеживания и анализа привычки курения с целью снижения потребления**

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.9-green)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)
![Mantine UI](https://img.shields.io/badge/Mantine-8.3-purple)
![Docker](https://img.shields.io/badge/Docker-✓-blue)

## 📋 О проекте

SmokeTracker помогает пользователям контролировать привычку курения через:
- 📊 **Ведение дневника** курения с детализацией каждой ситуации
- 📈 **Анализ статистики** и выявление паттернов поведения
- 🎯 **Постановку целей** по снижению потребления
- 💰 **Визуализацию экономии** и улучшения здоровья

## 🏗️ Архитектура
```bash
smoke-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── data.json
│   └── Dockerfile
└── docker-compose.yml
```

📊 Функциональность
Для пользователя:
✅ Добавление записей о курении с указанием причины и количества

✅ Просмотр истории с фильтрацией и сортировкой

✅ Анализ статистики по дням/неделям/месяцам

✅ Случайные советы для борьбы с желанием закурить

✅ Визуализация прогресса через графики и диаграммы

✅ Темная/светлая тема для комфортного использования

Для разработчика:
✅ Полный CRUD через REST API

✅ TypeScript для типобезопасности

✅ React Query для управления состоянием и кэширования

✅ Mantine UI для красивых и доступных компонентов

✅ Докеризация для простого развертывания

✅ Health checks для мониторинга
