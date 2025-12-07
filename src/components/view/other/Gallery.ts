import { Component } from '../../base/Component';

export class Gallery extends Component<HTMLElement> {
    constructor(container: HTMLElement) {
        super(container);
    }

    clear(): void {
        this.container.replaceChildren();
    }

    render(): HTMLElement {
        return this.container;
    }
}