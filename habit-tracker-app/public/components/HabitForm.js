export default class HabitForm {
    constructor(onAddHabit) {
        this.onAddHabit = onAddHabit;
        this.habitName = '';
    }

    render() {
        return `
            <form id="habit-form">
                <input
                    type="text"
                    id="habit-input"
                    value="${this.habitName}"
                    placeholder="Enter a new habit"
                />
                <button type="submit">Add Habit</button>
            </form>
        `;
    }
}