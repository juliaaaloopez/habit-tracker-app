function getCurrentWeek() {
    const today = new Date();
    const year = today.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return year + '-W' + String(Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)).padStart(2, '0');
}

export default class HabitList {
    constructor(undoManager) {
        this.undoManager = undoManager;
    }

    render(habits) {
        const today = new Date().toISOString().split('T')[0];
        const currentWeek = getCurrentWeek();
        if (!habits.length) {
            return `<div class="habit-list"><p>No habits yet.</p></div>`;
        }
        return `
            <div class="habit-list">
                <ul>
                    ${habits.map(habit => {
                        let checked = '';
                        let label = habit.name;
                        if (habit.frequency === 'daily') {
                            checked = habit.completed.includes(today) ? 'checked' : '';
                        } else if (habit.frequency === 'weekly') {
                            checked = habit.completed.includes(currentWeek) ? 'checked' : '';
                            label += ' (weekly)';
                        }
                        return `
                        <li>
                            <label>
                                <input type="checkbox" class="complete-checkbox" data-habit-id="${habit.id}" data-frequency="${habit.frequency}" ${checked}>
                                <span>${label}</span>
                            </label>
                            <button class="delete-habit" data-habit-id="${habit.id}" title="Delete habit">🗑️</button>
                        </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        `;
    }
}