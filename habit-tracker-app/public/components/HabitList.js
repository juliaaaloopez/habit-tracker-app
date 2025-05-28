export default class HabitList {
    constructor(habits, undoManager) {
        this.habits = habits;
        this.undoManager = undoManager;
    }

    render() {
        if (!this.habits.length) {
            return `<div class="habit-list"><p>No habits yet.</p></div>`;
        }
        return `
            <div class="habit-list">
                <ul>
                    ${this.habits.map(habit => `
                        <li>
                            <span>${habit.name}</span>
                            <button class="mark-completed" data-habit-id="${habit.id}">Mark Completed</button>
                            <button class="delete-habit" data-habit-id="${habit.id}">Delete</button>
                        </li>
                    `).join('')}
                </ul>
                <button id="undo-btn">Undo</button>
            </div>
        `;
    }
}