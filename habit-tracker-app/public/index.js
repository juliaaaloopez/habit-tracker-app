import HabitList from './components/HabitList.js';
import NewHabitForm from './components/NewHabitForm.js';
import ComplianceCalendar from './components/ComplianceCalendar.js';
import ConfirmationModal from './components/ConfirmationModal.js';
import Snackbar from './components/Snackbar.js';
import { loadHabits, saveHabits } from './utils/localStorage.js';
import UndoManager from './utils/undoManager.js';

function getCurrentWeek() {
    const today = new Date();
    const year = today.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return year + '-W' + String(Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)).padStart(2, '0');
}

class HabitTrackerApp {
    constructor() {
        this.habits = loadHabits();
        this.undoManager = new UndoManager();
        this.habitList = new HabitList(this.undoManager);
        this.newHabitForm = new NewHabitForm(this.addHabit.bind(this));
        this.complianceCalendar = new ComplianceCalendar(this.habits, this.undoCalendarUpdate?.bind(this));
        this.confirmationModal = new ConfirmationModal(this.handleConfirmation.bind(this));
        this.snackbar = new Snackbar();
        this.lastDeletedHabit = null;
        this.undoTimeout = null;
        this.habitToDelete = null;

        this.init();
    }

    init() {
        this.render();
    }

    render() {
        document.getElementById('app').innerHTML = `
            <div>
                <h1>Habit Tracker</h1>
                ${this.newHabitForm.render()}
                ${this.habitList.render(this.habits)}
                ${this.complianceCalendar.render()}
            </div>
        `;
        this.newHabitForm.attachEvents();
        this.attachHabitListEvents();
        this.confirmationModal.renderToDOM();
    }

    attachHabitListEvents() {
        // Delete button
        document.querySelectorAll('.delete-habit').forEach(btn => {
            btn.onclick = (e) => {
                const habitId = btn.dataset.habitId;
                this.habitToDelete = habitId;
                this.confirmationModal.show(habitId);
            };
        });

        // Completion checkbox
        document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
            checkbox.onchange = (e) => {
                const habitId = checkbox.dataset.habitId;
                const frequency = checkbox.dataset.frequency;
                if (checkbox.checked) {
                    this.markHabitAsCompleted(habitId, frequency);
                } else {
                    this.unmarkHabitAsCompleted(habitId, frequency);
                }
            };
        });
    }

    markHabitAsCompleted(habitId, frequency) {
        const today = new Date().toISOString().split('T')[0];
        const currentWeek = getCurrentWeek();
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        let key, alreadyCompleted;
        if (frequency === 'daily') {
            key = today;
            alreadyCompleted = habit.completed.includes(today);
        } else if (frequency === 'weekly') {
            key = currentWeek;
            alreadyCompleted = habit.completed.includes(currentWeek);
        }
        if (!alreadyCompleted) {
            this.lastCalendarUpdate = {
                habitId,
                key,
                prevCompleted: [...habit.completed]
            };
            habit.completed.push(key);
            this.saveHabits();
            this.render();
            this.showToast('Habit marked as completed!');
            this.snackbar.show('Completion saved! Undo?', () => this.undoCalendarUpdate(frequency));
            clearTimeout(this.undoTimeout);
            this.undoTimeout = setTimeout(() => {
                this.lastCalendarUpdate = null;
            }, 5000);
        }
    }

    unmarkHabitAsCompleted(habitId, frequency) {
        const today = new Date().toISOString().split('T')[0];
        const currentWeek = getCurrentWeek();
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        let key;
        if (frequency === 'daily') {
            key = today;
        } else if (frequency === 'weekly') {
            key = currentWeek;
        }
        if (habit.completed.includes(key)) {
            this.lastCalendarUpdate = {
                habitId,
                key,
                prevCompleted: [...habit.completed]
            };
            habit.completed = habit.completed.filter(date => date !== key);
            this.saveHabits();
            this.render();
            this.showToast('Completion undone.');
            this.snackbar.show('Completion undone! Undo?', () => this.undoCalendarUpdate(frequency));
            clearTimeout(this.undoTimeout);
            this.undoTimeout = setTimeout(() => {
                this.lastCalendarUpdate = null;
            }, 5000);
        }
    }

    undoCalendarUpdate(frequency) {
        if (this.lastCalendarUpdate) {
            const { habitId, prevCompleted } = this.lastCalendarUpdate;
            const habit = this.habits.find(h => h.id === habitId);
            if (habit) {
                habit.completed = prevCompleted;
                this.saveHabits();
                this.render();
                this.lastCalendarUpdate = null;
                this.showToast('Calendar update undone!');
            }
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    addHabit(habit) {
        this.habits.push(habit);
        this.saveHabits();
        this.render();
        this.snackbar.show('Habit added! Undo?', () => this.undoAddHabit());
        clearTimeout(this.undoTimeout);
        this.undoTimeout = setTimeout(() => {
            this.lastAddedHabit = null;
        }, 5000);
    }

    undoAddHabit() {
        if (this.lastAddedHabit) {
            this.habits = this.habits.filter(h => h.id !== this.lastAddedHabit.id);
            this.saveHabits();
            this.render();
            this.lastAddedHabit = null;
        }
    }

    handleConfirmation(habitId) {
        // Find and remove the habit
        const idx = this.habits.findIndex(h => h.id === habitId);
        if (idx !== -1) {
            this.lastDeletedHabit = { ...this.habits[idx] }; // Save for undo
            this.habits.splice(idx, 1);
            this.saveHabits();
            this.render();
            this.showToast('Habit deleted!');
            this.snackbar.show('Habit deleted! Undo?', () => this.undoDeleteHabit());
            clearTimeout(this.undoTimeout);
            this.undoTimeout = setTimeout(() => {
                this.lastDeletedHabit = null;
            }, 5000);
        }
        this.confirmationModal.hide();
    }

    undoDeleteHabit() {
        if (this.lastDeletedHabit) {
            this.habits.push(this.lastDeletedHabit);
            this.saveHabits();
            this.render();
            this.showToast('Habit restored!');
            this.lastDeletedHabit = null;
        }
    }

    saveHabits() {
        saveHabits(this.habits);
        this.undoManager.record(this.habits);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HabitTrackerApp();
});

// CSS styles
const style = document.createElement('style');
style.innerHTML = `
    .calendar-day {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: center;
        margin: 2px;
        min-width: 32px;
        min-height: 32px;
        display: inline-block;
        font-weight: bold;
    }
    .delete-habit {
        background: none;
        border: none;
        color: #dc3545;
        font-size: 1.2em;
        cursor: pointer;
        margin-left: 10px;
    }
    .delete-habit:hover {
        color: #a71d2a;
    }
`;
document.head.appendChild(style);