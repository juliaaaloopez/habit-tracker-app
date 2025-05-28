import { loadHabits } from '../utils/localStorage.js';

export default class CalendarView {
    constructor(habits) {
        this.habits = habits;
    }

    getCompletedDays() {
        const completedDays = {};
        this.habits.forEach(habit => {
            if (Array.isArray(habit.completed)) {
                habit.completed.forEach(date => {
                    completedDays[date] = completedDays[date] ? completedDays[date] + 1 : 1;
                });
            }
        });
        return completedDays;
    }

    renderCalendar() {
        const completedDays = this.getCompletedDays();
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        let calendar = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(today.getFullYear(), today.getMonth(), day).toISOString().split('T')[0];
            const completed = completedDays[date] ? 'completed' : '';
            const count = completedDays[date] ? ` (${completedDays[date]})` : '';
            calendar += `<div class="calendar-day ${completed}">${day}${count}</div>`;
        }
        return calendar;
    }

    render() {
        return `
            <div class="calendar-view">
                <h2>Habit Progress Calendar</h2>
                <div class="calendar">
                    ${this.renderCalendar()}
                </div>
            </div>
        `;
    }
}