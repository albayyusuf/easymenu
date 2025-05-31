# Easy Menu

A modern restaurant menu management system with AI-powered features.

## Features

- 🏢 Multi-tenant system for restaurants
- 🏪 Branch management
- 📱 QR code based menu access
- 🌐 Multi-language support
- 🤖 AI-powered menu assistant (Gemini)
- 💳 Payment integration (Stripe)
- 🎨 Modern UI with Angular 17 + SSR + Tailwind

## Tech Stack

### Backend
- NestJS 10
- Sequelize ORM
- Google Gemini AI
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- Angular 17
- Server-Side Rendering (SSR)
- Tailwind CSS
- TypeScript

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/easy-menu.git
cd easy-menu
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start development servers:
```bash
# Start backend
pnpm dev:backend

# Start frontend
pnpm dev:frontend
```

## Project Structure

```
easy-menu/
├─ backend/          # NestJS backend
├─ frontend/         # Angular frontend
├─ libs/            # Shared libraries
└─ scripts/         # Utility scripts
```

## License

MIT 