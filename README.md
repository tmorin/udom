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

`udom` is a library exposing services though out simple JavaScript function:

- `addEventListener`
- `addDelegatedEventListener`
- `formToObject`

### addEventListener

Attach a handler to one or more events to the element.

```javascript
addEventListener(element, types, listener, options);
```

Where:
- `element` is the element where the event listeners will be added
- `types` is a list of event types separated by comas
- `listener` is the event listener
- `options` are the [regular event listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)

#### Example

```javascript
const removeEventListener = addEventListener(
    document.body,
    'submit,input,change',
    (evt) => {
        // now do something fun!
    }
);

// when needed remove the listener:
removeEventListener()
```

Where:

- `evt` is the original event coming from the underlying form's element
- `evt.target` is the element which dispatched the event, in this example could be an input, select, textarea ...
- `removeListener` is a function which will remove the event listener when called

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

### formToObject

Convert an [HTMLFormElement] or an [HTMLFormControlsCollection] or an [HTMLCollection] to a simple JavaScript object.

```javascript
const formAsObject = formToObject(formOrElements, providedFormAsObject);
// formAsObject === providedFormAsObject
```

Where:
- `formOrElements` is an [HTMLFormElement] or an [HTMLFormControlsCollection] or an [HTMLCollection]
- `providedFormAsObject` is optional, it is the object where the discovered fields will be added 
- `formAsObject` is the object containing the discovered fields, when `providedFormAsObject` is provided, `providedFormAsObject === formAsObject` 

The paths are get from the `name` property/attribute of the form's elements.
The values are get according to the elements.

The paths are based on the following syntax:
- a simple field: `aSimpleField`
- the first item of the array *array1*: `array1[0]`
- the field *field1* of the second item of the array *array2*: `array2[1].field1`

The list of handled HTML elements is:

- [HTMLInputElement]
- [HTMLSelectElement]
- [HTMLTextAreaElement]
- [HTMLButtonElement]

About [HTMLInputElement], by default the value is equal to the property `value`.
When the type is `range` or `number` the value is equal to the property `valueAsNumber`.
When the type is `checkbox` the value is equal to the property `checked`.

About [HTMLSelectElement], when the property/attribute `multiple` is `true`, the field will be an array of string.
When the property/attribute `multiple` is `false`, the field will be a string.
The values are took from the selected option(s), i.e. the property `selectedOptions`.

About [HTMLTextAreaElement] and [HTMLButtonElement], the value is equal to the property `value`.

### Example

The HTML form:
```html
<form id="aForm">
<input type="text" name="array[0].field1" value="value1" >
<input type="checkbox" name="array[0].field2" checked>
<input type="number" name="array[0].field3" value="10">
<select name="array[0].field4" multiple>
    <option>option1</option>
    <option selected>option2</option>
    <option selected>option3</option>
</select>
</form>
```

The conversion:
```javascript
const formAsObject = formToObject(document.getElementById('aForm'));
console.log(JSON.stringify(formAsObject, null, 4));
```

The console output:
```json
{
    "array": [{
        "field1": "value1",
        "field2": true,
        "field3": 10,
        "field4": ["option2", "option3"]
    }]
}
```

[HTMLFormElement]:https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
[HTMLFormControlsCollection]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
[HTMLCollection]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
[HTMLInputElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
[HTMLSelectElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement
[HTMLTextAreaElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
[HTMLButtonElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement
