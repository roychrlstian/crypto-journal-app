# Crypto Portfolio & Trading Journal

A scalable multi-user crypto portfolio tracker and trading journal built with modern full-stack technologies.

## Overview

This project is designed to help traders:
- Track crypto portfolios
- Record trading history
- Analyze profits and losses
- Maintain a trading journal
- Monitor trading performance
- Improve decision-making through analytics

The application is built while following industry-standard backend architecture and scalable system design principles.

---

# Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend
- NestJS
- TypeScript
- Prisma ORM

## Database
- PostgreSQL

## APIs
- CoinGecko API

## Deployment
- Vercel (Frontend)
- Render / Railway (Backend)
- Neon PostgreSQL (Database)

---

# Project Goals

This project aims to:
- Learn TypeScript deeply
- Understand backend architecture
- Build scalable APIs
- Practice authentication and authorization
- Learn database relationships
- Implement real-world fintech logic
- Follow clean code principles
- Build a production-ready portfolio project

---

# Features

## Authentication
- User registration
- User login
- JWT authentication
- Protected routes

## Portfolio Management
- Multiple portfolios per user
- Portfolio tracking
- Asset allocation

## Trading Journal
- Record trades
- Trade notes
- Emotional analysis
- Mistake tracking
- Trading lessons

## Analytics
- Profit & Loss (PNL)
- Win rate
- Best trades
- Worst trades
- Trading performance metrics

## Future Features
- Real-time crypto prices
- WebSocket live updates
- AI trade analysis
- Risk management dashboard
- Mobile support

---

# Project Structure

```txt
crypto-journal/
├── frontend/
├── backend/
├── docs/
└── README.md
```

---

# Backend Architecture

The backend follows modular architecture principles.

```txt
backend/src/
├── auth/
├── users/
├── trades/
├── portfolio/
├── journal/
├── market/
├── common/
├── prisma/
└── main.ts
```

---

# Database Design

## Core Tables

### Users
- id
- email
- password
- created_at

### Portfolios
- id
- user_id
- name

### Trades
- id
- portfolio_id
- coin
- entry_price
- exit_price
- quantity
- trade_type
- notes
- created_at

### Journal Entries
- id
- trade_id
- emotion
- mistake
- lesson

---

# Development Roadmap

## Phase 1 — Foundation
- TypeScript fundamentals
- NestJS setup
- PostgreSQL setup
- Prisma setup
- Authentication system

## Phase 2 — Core Features
- Portfolio CRUD
- Trade CRUD
- Journal system
- Protected APIs

## Phase 3 — Analytics
- PNL calculations
- Win rate tracking
- Performance analytics
- Dashboard charts

## Phase 4 — Real-Time Features
- Live market prices
- WebSocket integration
- Real-time portfolio updates

## Phase 5 — Production Engineering
- Docker
- CI/CD
- Logging
- Rate limiting
- Security improvements

---

# Environment Variables

Example `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=
COINGECKO_API_URL=
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/crypto-journal-app.git
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

---

# Git Workflow

## Branch Naming

```txt
main
develop
feature/auth
feature/trades
feature/analytics
```

---

# Learning Objectives

Through this project, the developer will learn:
- TypeScript
- Backend development
- API architecture
- Authentication systems
- Database design
- Scalable application structure
- Production deployment
- Software engineering best practices

---

# Author

Built by Roy Christian Cruz

---

# License

This project is for educational and portfolio purposes.