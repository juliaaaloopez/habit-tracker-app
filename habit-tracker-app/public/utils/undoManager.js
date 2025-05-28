class UndoManager {
    constructor() {
        this.actions = [];
        this.index = -1;
    }

    record(action) {
        // Remove any actions that are ahead of the current index
        this.actions = this.actions.slice(0, this.index + 1);
        this.actions.push(action);
        this.index++;
    }

    undo() {
        if (this.index < 0) return null;
        const action = this.actions[this.index];
        this.index--;
        return action;
    }

    redo() {
        if (this.index + 1 >= this.actions.length) return null;
        this.index++;
        return this.actions[this.index];
    }

    canUndo() {
        return this.index >= 0;
    }

    canRedo() {
        return this.index + 1 < this.actions.length;
    }
}

export default UndoManager;