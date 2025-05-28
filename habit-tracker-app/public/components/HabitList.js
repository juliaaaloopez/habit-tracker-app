export default class HabitList {
    constructor(undoManager) {
        this.undoManager = undoManager;
    }

    render(habits) {
        const today = new Date().toISOString().split('T')[0];
        if (!habits.length) {
            return `<div class="habit-list"><p>No habits yet.</p></div>`;
        }
        return `
            <div class="habit-list">
                <ul>
                    ${habits.map(habit => {
                        const checked = habit.completed.includes(today) ? 'checked' : '';
                        return `
                        <li>
                            <label>
                                <input type="checkbox" class="complete-checkbox" data-habit-id="${habit.id}" ${checked}>
                                <span>${habit.name}</span>
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