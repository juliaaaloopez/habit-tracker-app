# Habit Tracker App

A modern and interactive Java-based habit tracker that allows users to define, manage, and visualize their personal habits. The app includes essential habit-tracking features like daily completion, a compliance calendar, undo actions, toast notifications, motivational messages, dark mode, and a polished UI using TailwindCSS.

---

## 🧠 Prompts Used for the Habit Tracker App

This section documents all the prompts used to guide the development of the Habit Tracker Java app using Copilot and Firebase Studio’s App Prototyper.

### 🎯 Core Functionality

#### ➕ Add New Habits
- Create a feature in the main interface that allows users to define new personal habits.
- Include:
  - Input validation (prevent empty submissions).
  - Confirmation messages via toast.
  - Undo support via snackbar (5-second window).
  - Persistent storage using `localStorage` or backend.
- Store the `habits` array in `localStorage` and load it on app startup.

#### ✅ Mark Habits as Completed
- Display today’s habits with checkboxes for completion.
- On checkbox toggle:
  - Update habit status in state.
  - Show confirmation toast.
  - Allow undo via snackbar (5 seconds).
- Store daily habit completion status in `localStorage` or backend.

#### 📆 Compliance Calendar
- Build a `ComplianceCalendar` component that shows:
  - A month view with color-coded days based on completion.
  - Green = all done, red = missed.
- For each habit:
  - Calculate and visualize completion streaks.
  - Allow undo of visual updates via snackbar.
- Persist compliance data in `localStorage`, updating on habit check-ins.

#### 🗑️ Delete Habits
- Add a delete icon next to each habit.
- On click:
  - Show confirmation modal.
  - If confirmed, delete from state and show toast.
  - Support undo with snackbar (5 seconds).
- Persist updated habit list in `localStorage`.

---

### 🎨 UI/UX Design & Visual Enhancements

#### 🌈 Theme and Styling
- Use TailwindCSS or styled-components.
- Apply:
  - Consistent color palette (e.g., teal or indigo).
  - Soft gray backgrounds.
  - Rounded corners, soft shadows.
  - Sans-serif fonts.
- Make layout responsive for desktop and mobile using Tailwind’s grid/flex utilities.

#### 🧩 Component-Level UI Enhancements
- Apply TailwindCSS to all components:
  - `NewHabitForm`
  - `HabitList`
  - `ComplianceCalendar`
- Add icons using `react-icons`:
  - ➕ Add
  - 🗑️ Delete
  - ✅ Mark as done
- Include:
  - Hover/focus states with transitions.
  - Fade/slide animations for modals, toasts, and calendar updates (using Framer Motion or CSS transitions).
  - Skeleton loaders while data is loading.
  - Frosted glass-style cards with backdrop blur.

---

### 🌟 Advanced Engagement Features

#### 💡 Motivation & Feedback
- Add a motivational quote banner at the top of the main interface:
  - Randomly picked from a curated list.
  - Entrance animation for smooth reveal.
- Show emoji-based feedback for actions:
  - ✅ for done
  - 💪 for streak
  - 🗑️ for delete
- Trigger confetti animation when all habits are completed for the day:
  - Use `canvas-confetti` or `react-confetti`.

#### 🔁 Progress and Streaks
- Create a circular progress ring component:
  - Use SVG and Tailwind transitions.
  - Show today’s habit completion percentage.
- Add visual elements to emphasize ongoing streaks:
  - Badge or 🔥 flame icon (e.g., "🔥 5-day streak").
  - Use gradient backgrounds and animated count-up effects.
- Allow users to assign a **color tag** to each habit (e.g., health, study, work).
  - Display tags as colored labels in the habit list.

---

### 🌘 Theme Control

#### 🌞 Light/Dark Mode
- Add a toggle in the header to switch between light and dark modes.
- Use `dark:` classes from TailwindCSS.
- Persist the theme preference in `localStorage`.

---

### 🧠 Usability Features

- Add friendly **empty state** illustrations/messages when no habits exist.
- Add **hover tooltips** to calendar days:
  - Show which habits were completed/missed.

---

## 📸 Screenshots


![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
## 📚 Lessons Learned Using Copilot

### 1. Specificity Drives Results
Copilot works best with **precise prompts**. Ambiguous inputs like “improve UI” often led to irrelevant suggestions. A structured prompt like “Place calendar on the left and habit list on the right using a responsive grid layout” produced excellent layouts.

### 2. Iterative Refinement is Crucial
Building this app was **not a one-shot task**. We continuously prompted Copilot, reviewed output, and refined our queries. Each feature (e.g., snackbar undo or calendar updates) evolved through 3–5 iterations.

### 3. Strengths and Weaknesses of Copilot

**✅ Strengths:**
- Great at generating boilerplate code, UI layouts, form handling, and Tailwind integration.
- Efficient with common state update patterns and undo flows using timeouts/snackbars.

**⚠️ Limitations:**
- Lacked broader architectural insight (e.g., optimal component splitting or complex data syncing).
- Needed help managing advanced state flows or edge case error handling.

### 4. Debugging with Copilot
Providing **full error logs** helped Copilot resolve hydration issues, JSX typos, and module import errors quickly. Context-aware fixes were suggested more effectively when file names or function names were included in the prompt.

### 5. Code Review Remains Key
Copilot-generated code was always **reviewed for optimization and reliability**. While helpful, its suggestions required human oversight to ensure maintainability.

### 6. Structured File Naming Helps
Naming files correctly (`.tsx` for JSX code), structuring folders clearly (`components/`, `hooks/`, `styles/`) improved Copilot's context awareness and imports.

### 7. Rapid UI Prototyping
Copilot significantly **accelerated prototyping**. We quickly scaffolded entire components like `ComplianceCalendar`, `NewHabitForm`, and the SVG-based `ProgressRing`.

---

## 🚀 Final Thoughts

This project proved how Copilot can be a powerful coding partner when used intentionally. From scaffolding the UI to refining state logic and animations, Copilot helped us iterate faster, explore more ideas, and focus on polishing user experience.


