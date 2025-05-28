export default class ConfirmationModal {
    constructor(onConfirm) {
        this.isVisible = false;
        this.message = '';
        this.onConfirm = onConfirm;
        this.habitId = null;
    }

    show(habitId) {
        this.isVisible = true;
        this.message = 'Are you sure you want to delete this habit?';
        this.habitId = habitId;
        this.renderToDOM();
    }

    hide() {
        this.isVisible = false;
        this.message = '';
        this.habitId = null;
        this.renderToDOM();
    }

    handleConfirm = () => {
        if (this.onConfirm && this.habitId) {
            this.onConfirm(this.habitId);
        }
        this.hide();
    };

    handleCancel = () => {
        this.hide();
    };

    render() {
        if (!this.isVisible) return '';
        return `
            <div class="modal">
                <div class="modal-content">
                    <p>${this.message}</p>
                    <button id="confirm-yes">Yes</button>
                    <button id="confirm-no">No</button>
                </div>
            </div>
        `;
    }

    renderToDOM() {
        const modalContainer = document.getElementById('confirmation-modal');
        if (modalContainer) {
            modalContainer.innerHTML = this.render();
            if (this.isVisible) {
                document.getElementById('confirm-yes').onclick = this.handleConfirm;
                document.getElementById('confirm-no').onclick = this.handleCancel;
            }
        }
    }
}