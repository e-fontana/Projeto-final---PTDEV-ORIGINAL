# Projeto Final - NestJS Application

This repository contains a NestJS application for the final project. Follow the instructions below to set up and run the project.

## Prerequisites

- Node.js (v20+ recommended)
- npm or yarn
- Docker (optional, for database)

## Installation

```bash
git clone https://github.com/e-fontana/Projeto-final---PTDEV.git projeto-final
cd projeto-final
yarn install
```

## Environment Variables

All environment variables required by the application are listed in `.env.template`. Follow these steps to configure your environment:

### Step-by-step: Setting up `.env`

1.  **Copy the template file:**

    ```bash
    cp .env.template .env
    ```

2.  **Open `.env` in your editor.**

3.  **Fill in each variable:**
    - `DATABASE_URL`: The full connection string for your database.
      - _Example for PostgreSQL:_ `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
    - `JWT_SECRET`: A long, random, and secret string used for signing JWT tokens.
    - `JWT_ISSUER`: This is not needed, but if you want you can change it.
    - `PORT`: The port on which the application server will listen (e.g., `3000`).
    - `MAIL_HOST`: The hostname of your SMTP server (e.g., `smtp.example.com`).
    - `MAIL_PORT`: The port for your SMTP server (e.g., `587`).
    - `MAIL_USER`: The username for SMTP authentication.
    - `MAIL_PASS`: The password for SMTP authentication.
    - `MAIL_FROM`: The default "from" email address for outgoing emails.

4. **Run prisma generate and migrate to your postgres database**
## Running prisma migrate

```bash
yarn prisma generate && yarn prisma migrate deploy
```

5.  **Save the file.**

## Running the Application

```bash
yarn run start:dev
```

## Testing

```bash
yarn run test
```

## Swagger

```bash
http://localhost:{PORT}/api
```
