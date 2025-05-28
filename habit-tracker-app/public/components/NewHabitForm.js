export default class NewHabitForm {
    constructor(onAddHabit) {
        this.onAddHabit = onAddHabit;
    }

    render() {
        return `
            <form id="new-habit-form" autocomplete="off">
                <input type="text" id="habit-name" placeholder="Habit name" required />
                <select id="habit-frequency">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
                <button type="submit">Add Habit</button>
            </form>
        `;
    }

    attachEvents() {
        const form = document.getElementById('new-habit-form');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const name = document.getElementById('habit-name').value.trim();
                const frequency = document.getElementById('habit-frequency').value;
                if (!name) {
                    this.showToast('Habit name cannot be empty.', false);
                    return;
                }
                this.onAddHabit({ id: Date.now().toString(), name, frequency, completed: [] });
                form.reset();
            };
        }
    }

    showToast(message, success = true) {
        const toast = document.createElement('div');
        toast.className = `toast${success ? ' success' : ' error'}`;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}