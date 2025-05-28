# Habit Tracker App

## Overview
The Habit Tracker App is a simple JavaScript application designed to help users track their personal habits. Users can add new habits, mark them as completed, view their progress in a calendar format, and delete habits. The app supports undo functionality for all actions and uses localStorage to persist data.

## Features
- Add new habits
- Mark habits as completed each day
- View habit progress in a calendar
- Delete habits with confirmation
- Undo actions
- Data persistence using localStorage

## Project Structure
```
habit-tracker-app
├── src
│   ├── index.js               # Entry point of the application
│   ├── components
│   │   ├── HabitList.js       # Manages the display of habits
│   │   ├── HabitForm.js       # Handles input for adding new habits
│   │   ├── CalendarView.js    # Displays progress in a calendar format
│   │   └── ConfirmationModal.js # Manages confirmation messages for actions
│   ├── utils
│   │   ├── localStorage.js     # Functions for interacting with localStorage
│   │   └── undoManager.js      # Manages undo functionality
│   └── styles
│       └── main.css           # CSS styles for the application
├── public
│   └── index.html             # Main HTML file serving the application
├── package.json                # Configuration file for npm
└── README.md                   # Documentation for the project
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd habit-tracker-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to view the app.
3. Use the Habit Form to add new habits.
4. Mark habits as completed daily and view your progress in the Calendar View.
5. Delete habits with confirmation prompts and utilize the undo feature for recent actions.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.