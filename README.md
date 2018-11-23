# udom

> Set of utilities around the DOM.

## Installation

From npm or yarn or ... from npm what? 
```bash
npm install udom
```

Directly in the browser
```html
<script src="https://unpkg.com/udom/dist/udom.min.js"></script>

```

## Usage

`udom` is a library exposing its service thought out simple JavaScript function.

### addDelegatedEventListener

Attach a handler to one or more events for all elements that match the selector,
now or in the future, based on a specific root elements.
It's similar to the [jQuery delegate function](https://api.jquery.com/delegate/).

```javascript
addDelegatedEventListener(root, selector, types, listener, options);
```

Where:
- `root` is the element where the event listener will be added
- `selector` is the CSS selector used to resolve the delegated event target 
- `types` is a list of event types separated by comas
- `listener` is the event listener
- `options` are the [regular event listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)

#### Example

```javascript
const removeDelegatedEventListener = addDelegatedEventListener(
    document.body,
    'form',
    'input,change',
    (evt, selectedTarget) => {
        // now do something fun!
    }
);

// when needed remove the listener:
removeDelegatedEventListener()
```

Where:

- `evt` is the original event coming from the underlying form's element
- `evt.target` is the element which dispatched the event, in this example could be an input, select, textarea ...
- `selectedTarget` is the form resolved using the selector (i.e. `'form'`) from the root element (i.e. `document.body`)
- `removeListener` is a function which will remove the event listener when called
