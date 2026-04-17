# Keep Your History

Keep Your History helps organizations preserve personal life stories in printed books.  
This site presents the project and includes a request form for institutions to contact the team.

## What This Website Includes

- A public landing page explaining the project
- A request form for institutions
- Server-side email delivery for form submissions

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Fill `.env.local` with valid email credentials (see next section).

4. Start development server:

```bash
npm run dev
```

5. Open:

`http://localhost:3000`

## Environment Variables

Use the following values in `.env.local`:

- `REQUEST_TO_EMAIL`: inbox that receives form submissions
- `SMTP_HOST`: SMTP host (example: `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (example: `465`)
- `SMTP_SECURE`: `true` for SSL/TLS on port 465
- `SMTP_USER`: sender email account
- `SMTP_PASS`: SMTP password (for Gmail, use an App Password)
- `SMTP_FROM`: sender label shown in email (example: `KeepYourHistory <you@gmail.com>`)

## Form Submission

When a user submits the request form:

1. The site sends a `POST` request to `/api/request-book`
2. The server validates the payload
3. The server sends an email to `REQUEST_TO_EMAIL`

## Deploy

Deploy to Vercel using the repository root as the project root.

- Build command: `next build` (default)
- Output directory: leave empty for this project (do not use `dist`)
- Add all environment variables from `.env.local` to Vercel Project Settings

## License

This project is licensed under the MIT License.  
See [LICENSE](./LICENSE).
