import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface IModalActions {
    onClose: () => void;
}

export class Modal extends Component<HTMLElement> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, actions?: IModalActions) {
        super(container);
        
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', () => {
            this.close();
            if (actions?.onClose) {
                actions.onClose();
            }
        });

        container.addEventListener('click', (event: MouseEvent) => {
            if (event.target === container) {
                this.close();
                if (actions?.onClose) {
                    actions.onClose();
                }
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
    }

    render(): HTMLElement {
        return this.container;
    }
}