# MediCore — Healthcare Management System v3.0

Full-stack clinic management system with AI clinical decision support.

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18 + Vite + React Router + Zustand + TanStack Query |
| Backend  | Node.js + Express.js + JWT Auth + Rate Limiting |
| Database | MongoDB Atlas (Mongoose ODM) |
| AI       | Claude API (Anthropic) — claude-sonnet-4-20250514 |
| Storage  | Cloudinary (medical records / files) |
| SMS      | Twilio |
| Email    | Nodemailer / SendGrid |
| PDF      | PDFKit |

## Project Structure

```
medicore/
├── frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx         # Routes
│   │   ├── main.jsx        # Entry point
│   │   ├── components/     # Layout, Sidebar, shared UI
│   │   ├── pages/          # Dashboard, Patients, Doctors, Appointments,
│   │   │                   # Prescriptions, Consultation, AIAssistant,
│   │   │                   # Records, Billing, Search, Notifications, Settings
│   │   ├── hooks/          # useAuthStore (Zustand)
│   │   ├── services/       # api.js (Axios + interceptors)
│   │   └── utils/          # helpers, formatters
│   └── package.json
│
├── backend/                # Express REST API
│   ├── src/
│   │   ├── server.js       # App entry, middleware, routes
│   │   ├── config/
│   │   │   └── db.js       # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Patient.model.js
│   │   │   ├── Doctor.model.js
│   │   │   ├── Appointment.model.js
│   │   │   ├── Prescription.model.js
│   │   │   ├── Consultation.model.js
│   │   │   ├── MedicalRecord.model.js
│   │   │   ├── Billing.model.js
│   │   │   └── Notification.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── patient.routes.js
│   │   │   ├── doctor.routes.js
│   │   │   ├── appointment.routes.js
│   │   │   ├── prescription.routes.js
│   │   │   ├── consultation.routes.js
│   │   │   ├── record.routes.js       # Cloudinary upload
│   │   │   ├── billing.routes.js
│   │   │   ├── ai.routes.js           # Claude API
│   │   │   └── notification.routes.js
│   │   └── middleware/
│   │       └── auth.middleware.js     # JWT + RBAC
│   └── package.json
│
└── database/
    ├── schemas/
    │   └── index.js        # Full schema reference + ERD notes
    └── seeds/
        └── seed.js         # Full sample data seeder
```

## Quick Start

### 1. Clone & install

```bash
git clone <repo>

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2. Environment variables

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
JWT_SECRET=your_super_secret_32char_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE=+1...
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
cd database/seeds
node seed.js
```

### 4. Run

```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)
cd frontend && npm run dev
```

Open http://localhost:5173

### 5. Login

| Role          | Email                        | Password    |
|---------------|------------------------------|-------------|
| Admin         | admin@medicore.health        | Admin@1234  |
| Doctor        | mei.chen@medicore.health     | Doctor@1234 |
| Nurse         | aisha@medicore.health        | Nurse@1234  |
| Receptionist  | ram@medicore.health          | Recep@1234  |

## API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/patients           ?page &limit &status &search
POST   /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
GET    /api/patients/search    ?q=

GET    /api/doctors
POST   /api/doctors
GET    /api/doctors/:id/schedule

GET    /api/appointments       ?date &doctor &patient &status
POST   /api/appointments
PATCH  /api/appointments/:id/cancel
PATCH  /api/appointments/:id/reschedule

GET    /api/prescriptions      ?patient &status
POST   /api/prescriptions
GET    /api/prescriptions/:id/pdf

GET    /api/consultations      ?patient &doctor
POST   /api/consultations
POST   /api/consultations/:id/summarise

POST   /api/records/upload     (multipart/form-data)
GET    /api/records            ?patient &tag &type
DELETE /api/records/:id

GET    /api/billing            ?status &patient
POST   /api/billing
PATCH  /api/billing/:id/pay
GET    /api/billing/:id/invoice

POST   /api/ai/chat
POST   /api/ai/search
POST   /api/ai/summarise-consultation
POST   /api/ai/summarise-record

GET    /api/notifications
PATCH  /api/notifications/:id/dismiss
PATCH  /api/notifications/mark-all-read
```

## Deployment

| Service   | Platform           |
|-----------|--------------------|
| Frontend  | Vercel             |
| Backend   | Render / Railway   |
| Database  | MongoDB Atlas      |
| Files     | Cloudinary         |
| CI/CD     | GitHub Actions     |
