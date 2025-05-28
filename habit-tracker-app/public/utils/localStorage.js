export function loadHabits() {
    const habits = localStorage.getItem('habits');
    return habits ? JSON.parse(habits) : [];
}

export function saveHabits(habits) {
    localStorage.setItem('habits', JSON.stringify(habits));
}