function getWeekString(date) {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return year + '-W' + String(Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)).padStart(2, '0');
}

export default class ComplianceCalendar {
    constructor(habits, onUndo) {
        this.habits = habits;
        this.onUndo = onUndo;
        this.lastUpdate = null;
    }

    // Calculate compliance for each day of the current month
    getComplianceData() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const compliance = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            const dateStr = dateObj.toISOString().split('T')[0];
            const weekStr = getWeekString(dateObj);
            let completedCount = 0;
            let total = 0;
            this.habits.forEach(habit => {
                if (habit.frequency === 'daily') {
                    total++;
                    if (habit.completed.includes(dateStr)) completedCount++;
                } else if (habit.frequency === 'weekly') {
                    total++;
                    if (habit.completed.includes(weekStr)) completedCount++;
                }
            });
            compliance[dateStr] = { completedCount, total };
        }
        return compliance;
    }

    // Map compliance to color
    getColor(completed, total) {
        if (total === 0) return '#eee';
        if (completed === total) return '#4caf50'; // green
        if (completed === 0) return '#f44336'; // red
        return '#ff9800'; // orange for partial
    }

    render() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const compliance = this.getComplianceData();

        let calendar = '';
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            const { completedCount, total } = compliance[dateStr];
            const color = this.getColor(completedCount, total);
            calendar += `
                <div class="calendar-day" 
                     style="background:${color};color:#fff;"
                     data-date="${dateStr}">
                    ${day}
                </div>
            `;
        }

        return `
            <div class="calendar-view">
                <h2>Compliance Calendar</h2>
                <div class="calendar">${calendar}</div>
            </div>
        `;
    }
}