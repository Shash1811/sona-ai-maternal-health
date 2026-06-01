# 💻 Sona AI - React Frontend Client Application

This is the premium, mobile-first React Single Page Application (SPA) client interface for **Sona AI**. Built with speed, visual excellence, and interactive flow in mind, it provides a warm and supportive experience for mothers while serving a high-utility triage console for clinicians.

---

## 🎨 Design System & Aesthetics

Sona AI is designed to impress and comfort at first glance:
- **Tailored Typography:** Uses the clean, modern **Outfit** and **Inter** sans-serif font family.
- **Harmonious Color Palette:** Built upon soft, welcoming lavenders, deep indigo navies, and warm rose accents (`#4F46E5` indigo, `#DB2777` rose, `#312E81` deep navy) that look beautiful in both dark and light UI blocks.
- **Micro-Animations:** Fluid, interactive transitions using **Framer Motion** for chat cards, vitals loading screens, breathing circles, and dashboard triage lists.
- **Responsive Layout:** Decoupled, mobile-first design that fits perfectly on smartphones, tablets, and desktops.

---

## ⚙️ Core Modules & Pages

1. **Dashboard Triage & Health Tabs (`/` or `/dashboard`):**
   - **Vitals Monitor:** Real-time tracking of blood pressure, blood glucose, weight, and baby kick sessions.
   - **Symptom Matrix:** Interactive checkbox assessments mapping to obstetric indicators (like preeclampsia markers).
   - **Resource Library:** Vetted pediatric advice cards and localized obstetric emergency links.
2. **Specialized AI Chat Console (`/chat`):**
   - **Mode Selection:** Toggle between **Maternal Health Assistant** (deterministic, clinical, empathetic advice) and **Identity/Resume Coach** (creative professional skill translation).
   - **Grounding Interceptor:** Seamlessly transitions into a soothing layout with breathing circles if postpartum anxiety or panic states are flagged.
3. **Onboarding Questionnaire (`/questionnaire`):**
   - Comprehensive multi-part form evaluating baseline clinical history, psychological markers, and doctor assignment.
4. **Soothing Audio Room (`/relaxation` or `/music`):**
   - High-quality, local calming tracks loaded dynamically from `/music/...mp3` with soft visual wave players.
5. **Interactive Test Runner (`/test-cases`):**
   - Live automated simulator checking endpoints, vector data matches, and clinical prescription denial safety blocks.

---

## 🚀 Development & Build

### 1. Configure Environment Variables
Verify that the `frontend/.env` file points to the backend server endpoint:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Install Project Dependencies
Use `npm` to pull required modules:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

### 4. Compile Production Build
To test the production package compilation, run:
```bash
npm run build
```
Vite will compile and compress all assets (React components, TypeScript scripts, dynamic CSS) into highly optimized static blocks inside the `dist/` directory.

---

## 🤝 UI Technologies Used

- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion, Tailwind-animate
- **Testing:** Playwright, Vitest

---

**Developed with ❤️ for maternal health accessibility**
