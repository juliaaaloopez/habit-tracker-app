export default class Snackbar {
    show(message, onUndo) {
        let snackbar = document.createElement('div');
        snackbar.className = 'snackbar';
        snackbar.innerHTML = `
            <span>${message}</span>
            <button id="undo-snackbar-btn">Undo</button>
        `;
        document.body.appendChild(snackbar);

        const timeout = setTimeout(() => {
            snackbar.remove();
        }, 5000);

        document.getElementById('undo-snackbar-btn').onclick = () => {
            clearTimeout(timeout);
            snackbar.remove();
            if (onUndo) onUndo();
        };
    }
}