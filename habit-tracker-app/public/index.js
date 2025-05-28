import HabitList from './components/HabitList.js';
import NewHabitForm from './components/NewHabitForm.js';
import CalendarView from './components/CalendarView.js';
import ConfirmationModal from './components/ConfirmationModal.js';
import Snackbar from './components/Snackbar.js';
import { loadHabits, saveHabits } from './utils/localStorage.js';
import UndoManager from './utils/undoManager.js';

class HabitTrackerApp {
    constructor() {
        this.habits = loadHabits();
        this.undoManager = new UndoManager();
        this.habitList = new HabitList(this.habits, this.undoManager);
        this.newHabitForm = new NewHabitForm(this.addHabit.bind(this));
        this.calendarView = new CalendarView(this.habits);
        this.confirmationModal = new ConfirmationModal(this.handleConfirmation.bind(this));
        this.snackbar = new Snackbar();
        this.lastAddedHabit = null;
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
                ${this.habitList.render()}
                ${this.calendarView.render()}
            </div>
        `;
        this.newHabitForm.attachEvents();
        this.attachHabitListEvents();
        this.confirmationModal.renderToDOM(); // <-- Always update modal after render
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
        // Mark completed button
        document.querySelectorAll('.mark-completed').forEach(btn => {
            btn.onclick = (e) => {
                const habitId = btn.dataset.habitId;
                this.markHabitAsCompleted(habitId);
            };
        });
    }

    addHabit(habit) {
        this.habits.push(habit);
        this.lastAddedHabit = habit;
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

    markHabitAsCompleted(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (habit) {
            const today = new Date().toISOString().split('T')[0];
            if (!habit.completed.includes(today)) {
                habit.completed.push(today);
                this.saveHabits();
                this.render();
            }
        }
    }

    handleConfirmation(habitId) {
        this.habits = this.habits.filter(h => h.id !== habitId);
        this.saveHabits();
        this.render();
        this.confirmationModal.hide();
    }

    saveHabits() {
        saveHabits(this.habits);
        this.undoManager.record(this.habits);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HabitTrackerApp();
});