# Noted

Noted is a modern publishing and newsletter platform that enables authors to create and distribute stories while allowing readers to discover content and subscribe to publications they care about.

The platform supports multiple content categories, including technology, entertainment, design, culture, economics, and wellness. Readers can subscribe using their email address and receive notifications when new stories are published.

The application is built with a Next.js frontend and a Rust/Axum backend, with PostgreSQL providing persistent data storage.

---

## Features

### Publishing

- Create and publish stories
- Edit and manage published content
- Organize stories by category
- Featured stories
- Recent publications
- Author attribution
- Story discovery and search

### Subscriptions

- Subscribe using an email address
- Manage newsletter subscriptions
- Receive notifications when new stories are published
- Subscriber management through the backend API

### Content

- Technology
- Entertainment
- Design
- Culture
- Economics
- Wellness
- Additional categories can be added as the platform grows

### Platform

- Responsive web interface
- RESTful backend API
- Persistent PostgreSQL storage
- Asynchronous backend operations
- Email notification integration
- Environment-based configuration

---

## Architecture

Noted follows a decoupled frontend/backend architecture.

```text
                         ┌─────────────────────┐
                         │      Readers        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Next.js App     │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                              REST / HTTP
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Rust / Axum      │
                         │      Backend        │
                         └──────┬───────┬──────┘
                                │       │
                     ┌──────────┘       └──────────┐
                     ▼                             ▼
             ┌───────────────┐             ┌───────────────┐
             │  PostgreSQL   │             │ Email Service │
             │   Database    │             │ Notifications │
             └───────────────┘             └───────────────┘
```
