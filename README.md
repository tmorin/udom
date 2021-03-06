# udom

[![npm version](https://badge.fury.io/js/%40tmorin%2Fudom.svg)](https://badge.fury.io/js/%40tmorin%2Fudom)
[![Integration](https://github.com/tmorin/udom/workflows/Integration/badge.svg?branch=master)](https://github.com/tmorin/udom/actions?query=workflow%3AIntegration+branch%3Amaster)

> Set of utilities around the DOM.

## Installation

From npm or yarn or ... from npm what? 
```bash
npm install @tmorin/udom
```

Directly in the browser
```html
<script src="https://unpkg.com/@tmorin/udom/dist/udom.min.js"></script>
```

## Usage

`udom` is a library exposing simple services:

- `addEventListener`
- `addDelegatedEventListener`
- `formToObject`
-  messages with `UiMessagesListener` and `UiMessageDispatcher`

### formToObject

Convert an [HTMLFormElement] or an [HTMLFormControlsCollection] or an [HTMLCollection] to a simple JavaScript object.

```javascript
import {formToObject} from '@tmorin/udom';
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

- When the type is `range` or `number` the value is equal to the property `valueAsNumber`.
- When the type is `checkbox` the value is equal to the property `checked`.
- When the type is `date` the value is equal to the property `valueAsDate`.
- When the type is `time` the value is equal to the property `valueAsNumer`.

About [HTMLSelectElement], when the property/attribute `multiple` is `true`, the field will be an array of string.
When the property/attribute `multiple` is `false`, the field will be a string.
The values are took from the selected option(s), i.e. the property `selectedOptions`.

About [HTMLTextAreaElement] and [HTMLButtonElement], the value is equal to the property `value`.

#### Example

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
import {formToObject} from '@tmorin/udom';
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

### UI Messages

Register an handler.
```javascript
import {UiMessagesListener} from '@tmorin/udom';
UiMessagesListener.from(document.getElementById('aTarget'))
    .register('myApp/events/an-event', (message, event) => {
        console.log('message', message.urn, message.payload);
    })
    .start();
```

Dispatch a message.
```javascript
import {UiMessageDispatcher} from '@tmorin/udom';
UiMessageDispatcher.dispatch('myApp/events/an-event')
    .payload('a payload')
    .from(document.getElementById('anotherTarget'));
```
