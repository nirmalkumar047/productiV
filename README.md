# ⏱️ Timeloop — Daily Routine & Productivity Tracking Application

**Timeloop** is a complete, modern, production-ready web application for tracking daily routines, tasks, and productivity habits built with **React**, **Vite**, **Firebase Authentication**, **Firebase Firestore**, **React Router**, **Recharts**, and **Tailwind CSS**.

---

## 🌟 Key Features

- **🔐 Firebase Authentication**: Email/password registration, login, logout, password reset, and protected routes.
- **📊 Today's Overview Dashboard**: Current date, scheduled tasks, progress bar, completion percentage, total planned vs completed time, current streak counter, and daily productivity score (0-100).
- **📝 Task Management**: Chronological task schedule, categories (Study, Work, Exercise, Personal, Sleep, Food, Other), priorities (Low, Medium, High), status (Pending, In Progress, Completed, Skipped), duration auto-calculation, and search/filtering.
- **⏱️ Task Timer**: Interactive digital timer to track actual time spent on tasks and compare Planned vs Actual duration.
- **📅 Interactive Calendar**: Monthly, Weekly, and Daily views to navigate routines across dates, with visual indicators for completed days.
- **🔄 Routine Templates**: Create reusable morning/evening routines with itemized steps and convert them into scheduled daily tasks with 1-click.
- **📈 Productivity Analytics (Recharts)**: Daily completion bar chart, weekly productivity metrics, category time distribution donut chart, productivity trend line chart, and planned vs actual duration comparisons.
- **📄 Printable Reports**: Daily, Weekly, and Monthly productivity reports with export/print functionality.
- **👤 Profile & Settings**: Custom profile display name, avatar, timezone setting, dark/light mode toggle, and notification preferences.
- **🔒 Scalable Firestore Architecture**: Per-user data isolation (`users/{userId}/tasks`, `users/{userId}/routines`) with strict Firestore security rules.

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have Node.js (v18 or higher) and `npm` installed.

### 2. Installation

Clone or navigate to the project directory and install dependencies:

```bash
npm install
```

---

## 🔥 Firebase Setup Guide

Follow these steps to link your Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it (e.g., `timeloop-app`).
3. Follow the steps to initialize your project.

### Step 2: Enable Email/Password Authentication
1. In the Firebase Console sidebar, navigate to **Build** > **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable **Email/Password** and click **Save**.

### Step 3: Create Cloud Firestore Database
1. In the sidebar, navigate to **Build** > **Firestore Database**.
2. Click **Create Database**.
3. Select a location close to your users.
4. Start in **Production mode** (security rules will be updated in Step 5).

### Step 4: Configure Environment Variables
1. In your Firebase project settings (⚙️ > Project settings), scroll down to **Your apps** and select the **Web** platform (`</>`).
2. Register your app (e.g. `timeloop-web`).
3. Copy the `firebaseConfig` object credentials.
4. In your local project root directory, create a `.env` file (copied from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 5: Apply Firestore Security Rules
1. In the Firebase Console, go to **Firestore Database** > **Rules**.
2. Replace the rules with the contents of `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.role == 'admin' || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();

      match /tasks/{taskId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }

      match /routines/{routineId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }

      match /activity/{activityId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }

      match /statistics/{statId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
3. Click **Publish**.

---

## 💻 Local Development

Run the Vite development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 📦 Production Build

To build the project for production deployment:

```bash
npm run build
```

To preview the built bundle locally:

```bash
npm run preview
```

---

## 🌐 Deploying to Vercel

1. Push your code repository to GitHub/GitLab.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your Timeloop repository.
4. Under **Environment Variables**, add all your `VITE_FIREBASE_*` key-value pairs from your `.env` file.
5. Click **Deploy**.

Vercel will build and serve your application under a custom domain with SSL enabled.

---

## 🗂️ Project Structure

```
Timeloop/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header with logo, user avatar, theme toggle
│   │   ├── Sidebar.jsx         # Navigation drawer & streak counter
│   │   ├── TaskCard.jsx        # Individual task item card
│   │   ├── TaskFormModal.jsx   # Create/Edit task modal with duration auto-calc
│   │   ├── RoutineFormModal.jsx# Create/Edit routine template modal
│   │   ├── TimerModal.jsx      # Task execution timer & planned vs actual logger
│   │   ├── Calendar.jsx        # Month, Week, Day calendar views
│   │   ├── ProgressCard.jsx    # Today overview completion progress bar & score
│   │   ├── StatsCard.jsx       # Metric overview card
│   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   ├── ConfirmDialog.jsx   # Action confirmation modal
│   │   └── Toast.jsx           # Notification feedback toast
│   ├── context/
│   │   ├── AuthContext.jsx     # Firebase Auth state provider
│   │   └── ThemeContext.jsx    # Dark/Light mode theme state
│   ├── firebase/
│   │   ├── config.js           # Firebase app initialization
│   │   ├── auth.js             # Authentication service methods
│   │   └── firestore.js        # Firestore CRUD helper functions
│   ├── hooks/
│   │   ├── useAuth.js          # Custom hook for auth context
│   │   └── useTasks.js         # Custom hook for real-time Firestore tasks/routines
│   ├── pages/
│   │   ├── Dashboard.jsx       # Today's overview & chronological task schedule
│   │   ├── Tasks.jsx           # Search, filter, sort all tasks
│   │   ├── CalendarPage.jsx    # Routine calendar view page
│   │   ├── Routines.jsx        # Reusable routine templates
│   │   ├── Analytics.jsx       # Recharts analytics graphs & trends
│   │   ├── Reports.jsx         # Printable daily, weekly, monthly reports
│   │   ├── Profile.jsx         # User profile info & lifetime statistics
│   │   ├── Settings.jsx        # App theme & notification settings
│   │   ├── Login.jsx           # Authentication login page
│   │   ├── Register.jsx        # Authentication registration page
│   │   └── ForgotPassword.jsx  # Password reset page
│   ├── services/
│   │   ├── taskService.js
│   │   ├── routineService.js
│   │   ├── userService.js
│   │   └── analyticsService.js
│   ├── utils/
│   │   ├── dateUtils.js        # Duration calculations, formatting & streak math
│   │   └── analyticsUtils.js   # Recharts dataset transformations
│   ├── App.jsx                 # Main application routes & modals
│   ├── main.jsx                # React root renderer
│   └── index.css               # Tailwind CSS v4 styles & fonts
├── firestore.rules             # Firestore security rules
├── .env.example                # Template for environment variables
└── README.md
```

---

## 📄 License

MIT License. Designed with ❤️ for maximum productivity.
