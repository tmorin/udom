/**
 * A message is composed of an URN and a payload.
 */
export interface Message<T> {
    /**
     * The URN of the message.
     * It can be used to scope message: `myApp/actions/an-action`, `myComponent/events/an-event`
     */
    urn: string
    /**
     * The payload of the message.
     */
    payload: T
}

/**
 * A message is bundled into an extended CustomEvent.
 */
export class UiMessage<T> extends CustomEvent<Message<T>> {
    static EVENT_TYPE = 'ui-message';

    constructor(options: EventInit & Message<T>) {
        const eventInitDict: CustomEventInit<Message<T>> = Object.assign({
            detail: {
                urn: options.urn,
                payload: options.payload
            }
        }, options);
        super(UiMessage.EVENT_TYPE, eventInitDict);
    }
}

/**
 * A message handler is used to apply side effects on dispatched message.
 */
export interface MessageHandler<T> {
    /**
     * The handler of a message.
     * @param message the message
     * @param event the event bundling the message
     */
    (message: Message<T>, event: UiMessage<T>): void
}

/**
 * Map of handlers.
 */
export interface MessageHandlers {
    [key: string]: MessageHandler<any>
}

/**
 * Utility class helping to build and dispatch a message.
 * By default dispatched messages:
 * - The message will bubbles up through the DOM.
 * - The message will propagate across the shadow DOM boundary into the standard DOM.
 * - The message can be handled several times.
 */
export class UiMessageDispatcher {
    constructor(
        private _urn: string,
        private _payload: any = undefined,
        private _bubbles: boolean = true,
        private _cancellable: boolean = false,
        private _composed: boolean = true
    ) {
    }

    /**
     * Build and return a dispatcher.
     * @param urn the urn of the message
     */
    static dispatch(urn: string): UiMessageDispatcher {
        return new UiMessageDispatcher(urn);
    }

    /**
     * @param payload the payload of the message
     */
    payload(payload: any) {
        this._payload = payload;
        return this;
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
     * @param value a Boolean indicating whether the event bubbles. The default is true.
     */
    bubbles(value = true) {
        this._bubbles = value;
        return this;
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
     * @param value a Boolean indicating whether the event can be cancelled. The default is false.
     */
    cancellable(value = true) {
        this._cancellable = value;
        return this;
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
     *
     * @param value A Boolean indicating whether the event will trigger listeners outside of a shadow root. The default is false.
     */
    composed(value = true) {
        this._composed = value;
        return this;
    }

    /**
     * Dispatch the message from the provided target.
     * @param target the target
     */
    from(target: EventTarget): void {
        target.dispatchEvent(new UiMessage({
            urn: this._urn,
            payload: this._payload,
            cancelable: this._cancellable,
            bubbles: this._bubbles,
            composed: this._composed
        }));
    }
}

/**
 * Utility class to listen to UiMessage events and invokes registered handlers.
 */
export class UiMessagesListener {
    constructor(
        private readonly target: EventTarget,
        private readonly handlers: MessageHandlers = {},
        private _listener: EventListenerOrEventListenerObject = undefined
    ) {
    }

    /**
     * true
     */
    get isStarted(): boolean {
        return !!this._listener;
    }

    /**
     * Build and create a listener from the provided target.
     * @param target the target
     */
    static from(target: EventTarget): UiMessagesListener {
        return new UiMessagesListener(target);
    }

    /**
     * Starts the listener.
     */
    start(): UiMessagesListener {
        if (!this.isStarted) {
            this._listener = (uiMessage: UiMessage<any>) => this.listener(uiMessage);
            this.target.addEventListener(UiMessage.EVENT_TYPE, this._listener);
        }
        return this;
    }

    /**
     * Stops the listener.
     */
    stop(): UiMessagesListener {
        if (this.isStarted) {
            this.target.removeEventListener(UiMessage.EVENT_TYPE, this._listener);
            this._listener = undefined;
        }
        return this;
    }

    /**
     * Register an handler.
     * @param urn the urn
     * @param handler the handler
     */
    register(urn: string, handler: MessageHandler<any>): UiMessagesListener {
        this.handlers[urn] = handler;
        return this;
    }

    private listener(uiMessage: UiMessage<any>): void {
        const urn = uiMessage.detail.urn;
        const handler = this.handlers[urn];
        if (handler) {
            if (uiMessage.cancelable && uiMessage.defaultPrevented) {
                // cancelable messages which are already processed should be skipped
                return;
            }
            try {
                handler(uiMessage.detail, uiMessage);
            } catch (e) {
                console.error(`the handler [${urn}] failed`, e);
            } finally {
                if (uiMessage.cancelable) {
                    uiMessage.preventDefault();
                }
            }
        }
    }
}
