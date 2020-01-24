/**
 * Attach a handler to one or more events to the element.
 *
 * @param element the element
 * @param types the types to listen
 * @param listener the listener
 * @param options the options
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
    element: EventTarget,
    types: K | string,
    listener: (this: EventTarget, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
): () => void {
    const typesAsArray = types.split(',').map(t => t.trim());
    typesAsArray.forEach(type => element.addEventListener(type, listener, options));
    return () => {
        typesAsArray.forEach(type => element.removeEventListener(type, listener, options));
    }
}
