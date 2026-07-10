# ⚖️ KORNAI LegalTech CRM

[Russian version below](#-русская-версия)

A modern, fast, and sleek CRM system built for legal practices, designed to optimize routine workflows, manage incoming client leads, and automate notifications.

---

## 🚀 Navigation & Features

Below is a list of available tools and integrations, categorized by their main objectives.

*   **Dashboard Management** — A minimalist and clean interface to seamlessly track the number of new, in-progress, and closed client requests.
*   **Cloud Database Integration** — Data is stored securely in a Supabase PostgreSQL database with real-time sync capabilities.
*   **Instant Notifications Engine** — Receive immediate alerts when a new client is added directly to Telegram and via Email (SMTP).

---

## 🛠️ Tech Stack

Projects inside this repository leverage modern, lightweight open-source libraries:

*   **Frontend Environment:** React 19, Vite, Tailwind CSS 4, Framer Motion
*   **Backend & API:** Node.js, Express (TypeScript)
*   **Database & Auth:** `Supabase` (PostgreSQL)
*   **Networking & Notifications:** `nodemailer` (SMTP), Telegram Bot API

---

## ⚙️ System Requirements & Setup

To ensure proper functionality, make sure your machine has:

1. **Node.js 18+**
2. **Supabase Account** (Create a project and execute `supabase_schema.sql` in the SQL Editor).
3. **Environment Variables**: Configure `.env` using `.env.example` (add your Telegram Bot Token and SMTP credentials).

**Launch Commands:**
*   *Development:* `npm install` && `npm run dev`
*   *Production Build:* `npm run build` && `npm start`

---
---

# 🇷🇺 Русская версия

## CRM-система KORNAI LegalTech

Современная, быстрая и стильная CRM-система для юридической практики, позволяющая автоматизировать рутинные процессы, управлять входящими заявками клиентов и получать мгновенные уведомления.

---

## 🚀 Доступные инструменты и функции:

*   **Управление заявками (Дашборд)** — Минималистичный интерфейс для удобного отслеживания новых, находящихся в работе и закрытых заявок.
*   **Облачная база данных** — Безопасное хранение данных в PostgreSQL от Supabase.
*   **Мгновенные уведомления** — Автоматическая отправка оповещений о новых клиентах напрямую в Telegram и на Email (через SMTP).

---

## 🛠️ Стек технологий:

*   **Фронтенд:** React 19, Vite, Tailwind CSS 4, Framer Motion
*   **Бэкенд:** Node.js, Express (TypeScript)
*   **База данных:** `Supabase` (PostgreSQL)
*   **Уведомления:** `nodemailer` (SMTP), Telegram Bot API

---

## ⚙️ Требования и запуск:

Для корректной работы убедитесь, что у вас установлены:

1. **Node.js 18+**
2. **Supabase** (Создайте проект и выполните SQL-скрипт из `supabase_schema.sql`).
3. **Переменные окружения**: Настройте файл `.env` на основе `.env.example` (укажите токен Telegram-бота и SMTP-доступы).

**Команды для запуска:**
*   *Разработка:* `npm install` && `npm run dev`
*   *Продакшен:* `npm run build` && `npm start`

---
---

👨‍💻 **Developer:** Alexei Kornienko (Nothingtham)  
📬 **Reach me at:** [Telegram: @AlexeiKornienko](https://t.me/AlexeiKornienko)
