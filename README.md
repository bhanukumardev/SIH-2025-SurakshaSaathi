# Suraksha Sathi: Digital Disaster Management Platform

A comprehensive digital disaster preparedness education and response system for Indian schools and colleges. Suraksha Sathi empowers students, educators, and communities with interactive modules, gamified drills, real-time alerts, and localized safety tools—built for Smart India Hackathon 2025.

---

## 🌟 Features

### Core Functionality
- **Multi-Role Support:** Student, Teacher, Parent, and Institution Admin dashboards  
- **Interactive Disaster Modules:** Learn earthquake, flood, fire, cyclone, and heatwave safety using simulations and videos  
- **Virtual Emergency Drills:** Stepwise, region-aware instructions and scoring  
- **Real-Time Alerts:** Location-based push notifications for natural disasters (NDMA/IMD feeds)  
- **Gamified Quizzes & Leaderboards:** Engaging quizzes, drills, and achievement badges  
- **Emergency Directory:** Local & national contacts, SOS callout  
- **Admin Console:** Preparedness score tracking, drill/quiz stats, region management  

### Disaster Types Covered
Earthquakes, Floods, Cyclones, Fires, Heatwaves, Landslides (with easy extensibility for other disasters)

---

## 🏗️ Technical Features

- **Protected Auth:** Local login + optional Google OAuth 2.0  
- **API-First:** RESTful JSON endpoints for all modules, users, alerts, and scores  
- **Live Communication:** WebSocket/Server-Sent-Events for real-time alerts  
- **Region-Language Aware:** Dynamic translation and scenario tailoring (English, Hindi, other locales)  
- **Component & Page Testing:** Jest & React Testing Library  
- **Responsive Design:** Mobile-first with Tailwind & shadcn/ui  
- **DB Pluggable:** JSON storage for testing or SQLite for prod, easy migration to bigger DBs  

---

## 🚀 Architecture

### Frontend
- Framework: Next.js 14 (TypeScript, App Router)  
- Styling: Tailwind CSS + shadcn/ui  
- State Management: React Context, useReducer, SWR for remote data  
- Testing: Jest, RTL  
- Language/Region Files: JSON/TSX for modular, per-state/locale modules  

### Backend & Services
- Node.js API: RESTful Express endpoints and mock data server  
- Authentication: Password + Google OAuth via Passport.js & custom hooks  
- Real-Time: Server-Sent Events (SSE) and mock push for disaster alerts  
- Storage: JSON files (dev/demo) or SQLite (prod/future scale)  
- Security: Session tokens, API key for admin  

---

## 📚 Quick Start

### Prerequisites
- Node.js 18+  
- npm  
- Git  

### Installation
```bash
git clone https://github.com/bhanukumardev/SIH-2025-SurakshaSaathi.git
cd SIH-2025-SurakshaSaathi
npm install
```

Create a `.env` file:
```
PORT=3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
USE_SQLITE=0
```

### Running
```bash
npm run dev         # Run in dev mode on http://localhost:3000
npm run build
npm start           # For production build
```

### Access
- Frontend: http://localhost:3000  
- API: http://localhost:3000/api/  

---

## 📚 API Documentation

### Authentication
- **Register**  
  `POST /api/auth/register`  
  Payload: `{ "name": "Aditi Sharma", "email": "aditi@example.com", "password": "secure123", "role": "student" }`

- **Login**  
  `POST /api/auth/login`  
  Payload: `{ "email": "aditi@example.com", "password": "secure123", "role": "student" }`

- **Google OAuth**  
  `GET /api/auth/google`  
  `GET /api/auth/google/callback`

### Modules & Drills
- `GET /api/modules`  
- `GET /api/drills`  
- `POST /api/drills/:id/start`

### Alerts & Contacts
- `GET /api/alerts/stream`  
- `GET /api/contacts`

### Achievements & Leaderboard
- `GET /api/leaderboard`  
- `POST /api/quiz/grade`

### Admin Endpoints
- `GET /api/admin/metrics`  
- `GET /api/admin/runs`  
- `GET /api/reports/overall`  
- `POST /api/alerts` (admin-only)

---

## 🧪 Testing

```bash
npm test                   # Unit + integration tests
npm run test:watch
npm test -- --coverage     # Coverage reports
```

- Unit: UI Components, Hooks  
- Integration: API Endpoints, End-to-End User Flow (Playwright supported)  

---

## 🚢 Deployment

### Database Configuration

The application uses a flexible database system:

- **Development**: Uses SQLite via `better-sqlite3` for local development  
- **Production/Serverless**: Automatically falls back to JSON file storage when SQLite is unavailable

This ensures the application works seamlessly in serverless environments like Vercel where native modules may not be available.

### Vercel Deployment

- Set `NODE_ENV=production` in `.env`  
- The build system automatically handles the SQLite fallback
- JSON storage is used for user data and alerts in serverless environments
- Plug-and-play with Vercel for static + API serverless deploy  
- Docker Ready (see Dockerfile)  

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 Development Guidelines

- All new components in TypeScript  
- Follow Prettier + ESLint (auto-run on commit)  
- Use conventional commits (feat:, fix:, docs:, etc.)  
- Feature branches for all new features/fixes (e.g., feature/chatbot-role)  
- Tests for new endpoints/components  

---

## 🤝 Contributing

- Fork the repo, create a feature branch  
- Code, test, and document your improvement  
- Ensure all tests pass, then create a pull request  

---

## 🏗️ Future Enhancements

- 🤖 Advanced Chatbot Integration: Expand the in-app AI disaster awareness chatbot with more interactive and personalized assistance.  
- 🗺️ Evacuation Route Mapping: Integrate real-time evacuation route planning and indoor navigation for campuses.  
- 📊 Data Analytics Dashboard: Provide deeper insights into drill performance, alert responses, and user engagement.  
- 🌍 Community Collaboration: Enable sharing of local disaster updates and resources among institutions.  
- 📱 Mobile App Development: Launch native mobile apps for offline access and push notifications.  

---

## 🌍 Social Impact

Suraksha Sathi aims to significantly enhance disaster preparedness awareness among youth and educational institutions across India. By providing accessible, engaging, and localized education, the platform helps reduce panic, improve response times, and foster a culture of resilience and safety. This contributes to safer campuses and empowered communities ready to face emergencies.

---

## 👥 Contributors

- **Bhanu Kumar Dev** (Team Leader & Backend APIs)
  - Led project management, system architecture, GitHub repo setup, and deployment.
  - Coordinated feature roadmap and integration of Next.js, TypeScript, and Vercel deployment.
  - Hands-on with core dashboard, routing, and overall system QA.

- **Aman Sinha** (Login/Register Developer & Frontend UI/UX)
  - Developed authentication, user session, and login/register flows.
  - Implemented Next.js API routes, protected pages, and role-based access logic.
  - Contributed on Tailwind CSS utility classes for the auth UI.

- **Kanishka** (Chatbot Integration , Gamification & Leaderboard)
  - Designed and coded in-app AI disaster chatbot using LLM/AI API.
  - Maintained chatbot state using React context/hooks.
  - Custom styled bot with Shadcn UI and handled accessibility.

- **Kumar Gaurav** (Video Editing, Content Explanation, Educational Content & Drills)
  - Produced and integrated learning videos.
  - Added multimedia support in Next.js, tested `<video>`/media components.
  - Helped with UI/UX review for simulation and drill modules.

- **Gaurav** (Documentation, PPT & Real-time Systems)
  - Drafted project documentation, README, and developer guides using MkDocs.
  - Created functional flowcharts and technical diagrams.
  - Maintained project slides, summarized API configurations, and usage docs.

- **Yuvakshi** (Presentation, Communication & Testing & DevOps)
  - Led team presentations and demo delivery.
  - Managed user feedback/testing sessions, coordinated Slack/Discord.
  - Validated region/language configurations and accessibility.

---

## 📞 Support

- Issues: GitHub Issues tab  
- Email: support@surakshasathi.edu.in  
- Documentation: project Wiki  

---

Building a disaster-resilient, prepared India—one school at a time.
