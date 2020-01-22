export interface MessageId {
    scope?: string
    name: string
}

export interface Message<T> extends MessageId {
    payload: T
}

export class UiMessage<T> extends CustomEvent<Message<T>> {
    constructor(message: Message<T>) {
        super('ui-message', {
            bubbles: true,
            cancelable: true,
            detail: message
        });
    }
}

export function dispatchMessage<T>(target: EventTarget, message: Message<T>) {
    target.dispatchEvent(new UiMessage(message));
}

export interface MessageHandler<T> {
    (message: Message<T>, event: UiMessage<T>): void
}

interface Hanlers {
    [kes: string]: MessageHandler<any>
}

export class MessagesListener {
    constructor(
        private target: EventTarget,
        private handlers: Hanlers = {}
    ) {
    }

    start(): MessagesListener {
        return this;
    }

    stop(): MessagesListener {
        return this;
    }

    register(messageId: MessageId, handler: MessageHandler<any>): MessagesListener {
        return this;
    }
}
