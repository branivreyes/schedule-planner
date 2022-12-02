let tabIdCounter = 1;
const tabPrefix = 'tab';

function getTabId() {
    return `${tabPrefix}-${tabIdCounter++}`;
}

export default class Tab {
    id: string;

    constructor(public name: string, public isEmpty: boolean = false) {
        this.id = getTabId();
    }
}