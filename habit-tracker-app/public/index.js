import HabitList from './components/HabitList.js';
import NewHabitForm from './components/NewHabitForm.js';
import ComplianceCalendar from './components/ComplianceCalendar.js';
import ConfirmationModal from './components/ConfirmationModal.js';
import Snackbar from './components/Snackbar.js';
import { loadHabits, saveHabits } from './utils/localStorage.js';
import UndoManager from './utils/undoManager.js';

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
                if (checkbox.checked) {
                    this.markHabitAsCompleted(habitId);
                } else {
                    this.unmarkHabitAsCompleted(habitId);
                }
            };
        });
    }

    markHabitAsCompleted(habitId) {
        const today = new Date().toISOString().split('T')[0];
        const habit = this.habits.find(h => h.id === habitId);
        if (habit && !habit.completed.includes(today)) {
            // Save previous state for undo
            this.lastCalendarUpdate = {
                habitId,
                date: today,
                prevCompleted: [...habit.completed]
            };
            habit.completed.push(today);
            this.saveHabits();
            this.render();
            this.showToast('Habit marked as completed!');
            this.snackbar.show('Completion saved! Undo?', () => this.undoCalendarUpdate());
            clearTimeout(this.undoTimeout);
            this.undoTimeout = setTimeout(() => {
                this.lastCalendarUpdate = null;
            }, 5000);
        }
    }

    unmarkHabitAsCompleted(habitId) {
        const today = new Date().toISOString().split('T')[0];
        const habit = this.habits.find(h => h.id === habitId);
        if (habit && habit.completed.includes(today)) {
            this.lastCalendarUpdate = {
                habitId,
                date: today,
                prevCompleted: [...habit.completed]
            };
            habit.completed = habit.completed.filter(date => date !== today);
            this.saveHabits();
            this.render();
            this.showToast('Completion undone.');
            this.snackbar.show('Completion undone! Undo?', () => this.undoCalendarUpdate());
            clearTimeout(this.undoTimeout);
            this.undoTimeout = setTimeout(() => {
                this.lastCalendarUpdate = null;
            }, 5000);
        }
    }

    undoCalendarUpdate() {
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