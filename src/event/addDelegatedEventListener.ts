export interface DelegatedEventListener<K extends keyof HTMLElementEventMap> {
    /**
     * @param event the event
     * @param selectedTarget the target resolved from the selector
     */
    (this: HTMLElement, event: HTMLElementEventMap[K], selectedTarget: HTMLElement): any
}

/**
 * Attach a handler to one or more events for all elements that match the selector,
 * now or in the future, based on a specific root elements.
 *
 * @param root the element
 * @param selector the CSS selector
 * @param types the types to listen
 * @param listener the listener
 * @param options the options
 */
export function addDelegatedEventListener<K extends keyof HTMLElementEventMap>(
    root: HTMLElement,
    selector: string,
    types: K | string,
    listener: DelegatedEventListener<K>,
    options?: boolean | AddEventListenerOptions
): () => void {
    const wrapper = (evt: Event) => {
        const selectedTargets = Array.prototype.slice.apply(root.querySelectorAll(selector)) as Element[];
        for (let selectedTarget of selectedTargets) {
            if (selectedTarget.contains(evt.target as Node)) {
                listener.call(selectedTarget, evt, selectedTarget);
                return;
            }
        }
    };
    const typesAsArray = types.split(',').map(t => t.trim());
    typesAsArray.forEach(type => root.addEventListener(type, wrapper, options));
    return () => {
        typesAsArray.forEach(type => root.removeEventListener(type, wrapper, options));
    }
}
