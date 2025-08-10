<!-- Project Banner -->
<p align="center">
  <img src="./assets/banner.png" alt="Future School — SaaS School Portal & Website" width="100%" style="max-width:1100px; border-radius:12px;" />
</p>

# 🎓 Future School — SaaS School Management & Website Platform

**Future School** is a modern **school SaaS platform** that combines a public-facing school website with a secure, fully functional school portal.  
It’s designed for **schools that want a stunning online presence** and **streamlined academic management**, all in one hybrid **web + app** solution.

Currently **in production** with **600+ active monthly users**.


<p align="center">
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#security">Security</a> ·
  <a href="#disclaimer">Disclaimer</a> ·
  <a href="#contact">Contact</a>
</p>


## 🚀 Features

### 🖥 Public Website
- **Customizable branding** — change colors, logos, banners, and content from the admin dashboard
- **Dynamic content management** for school details, events, and images
- Stunning, responsive UI optimized for both desktop and mobile

### 📚 School Portal
- **Teacher dashboard** — record term scores, exam scores, and academic behavior/performance
- **Student ID card generation** with unique identifiers for result access
- **Result printing** — student-specific results or a full **broadsheet** for a term
- **Behavior & performance tracking** — track academic and behavioral performance over time

### 🛠 Admin Capabilities
- Complete **school branding control** (colors, elements, images, text)
- **Hybrid web app** — works both in browsers and as an installable PWA
- Integrated analytics for user activity and performance tracking

### 🗄 Backend & Storage
- Secure **Supabase** backend for data management
- Fully responsive and mobile-first UI
- Role-based authentication (Admin / Teacher / Student)


## 📊 Tech Stack

**Frontend**
- React 18  
- React Router DOM  
- Styled Components  
- Tailwind CSS (optional / hybrid styling)
- Chart.js + React Chart.js 2
- Recharts  
- React Hook Form  
- React Icons  
- React Calendar  
- React Color  
- React Hot Toast

**Backend / Services**
- Supabase (Auth, Database, Storage)  
- TanStack React Query (Data fetching & caching)  
- JSON Server (Mock API for development)  

**Utilities**
- Auto Animate (UI animations)  
- React Spinners & Loading Indicators  
- React Sweet Progress



## 📦 Installation

1️⃣ Clone the Repository
```
git clone https://github.com/Dalu-Atu/future-school.git
cd future-school
```
2️⃣ Install Dependencies
```
npm install
```
3️⃣ Set Up Environment Variables
Create a .env file in the root with the following:
```
env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4️⃣ Start the Development Server
```
npm run dev
```
5️⃣ Build for Production
```
npm run build

📂 Project Structure
csharp
Copy
Edit
├── public/              # Static assets
├── assets/              # Images, banners
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Portal & website pages
│   ├── services/        # Supabase & API services
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Styled-components / global CSS
│   └── App.jsx          # Root app entry
├── .env.example         # Sample environment file
├── package.json
└── README.md
```
🔒 Security
Role-based access controls prevent unauthorized data access

All sensitive keys are stored in environment variables, not in the repo

Supabase handles authentication & secure storage

.env files are excluded from version control (.gitignore)

📈 Production Status
Live and serving 600+ active monthly users

Hosted on a secure production environment with automatic deployments

⚠ Disclaimer
This software is intended for authorized educational use only.
Do not expose sensitive school or student information in public repos or live demos.

📬 Contact
📧 Email: danieelatu@gmail.com
💼 LinkedIn: Daniel Atu

⭐ If you like this project, consider giving it a star on GitHub — it helps support further development.

