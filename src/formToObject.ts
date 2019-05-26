function fillArray(array: any[], indexes: number[], value?: any) {
    const index = indexes.shift();
    if (indexes.length > 0) {
        if (typeof array[index] === 'undefined') {
            array[index] = [];
        }
        return fillArray(array[index], indexes, value);
    } else {
        if (typeof value !== 'undefined' && typeof array[index] !== 'object') {
            array[index] = value;
        }
        return array[index];
    }
}

function fillObject(result: { [k: string]: any }, path: string, value: any) {
    const parts = path.split('.');
    const part = parts.shift();
    const isTable = part.indexOf('[') > -1;
    if (isTable) {
        const field = part.substr(0, part.indexOf('['));
        const indexes = part.substr(part.indexOf('[') + 1)
            .split('[')
            .map(s => parseInt(s.replace(/[|]/g, '')));

        if (typeof result[field] === 'undefined') {
            result[field] = [];
        }

        if (parts.length > 0) {
            fillObject(
                fillArray(result[field], indexes, {}),
                parts.join('.'),
                value
            );
        } else {
            fillArray(result[field], indexes, value);
        }
    } else if (parts.length < 1) {
        result[part] = value;
    } else {
        if (!result.hasOwnProperty(part)) {
            result[part] = {};
        }
        fillObject(result[part], parts.join('.'), value);
    }
}

/**
 * Convert an HTMLFormElement or an HTMLFormControlsCollection or an HTMLCollection to a simple JavaScript object.
 * @param formOrElements an HTMLFormElement or an HTMLFormControlsCollection or an HTMLCollection
 * @param [formAsObject] it is the object where the discovered fields will be added
 * @return the object containing the paths and values extracted from the provided form or elements
 */
export function formToObject(
    formOrElements: HTMLFormElement | HTMLFormControlsCollection | HTMLCollection,
    formAsObject: { [k: string]: any } = {}
): { [k: string]: any } {
    if (formOrElements instanceof HTMLFormElement) {
        formOrElements = formOrElements.elements;
    }
    const fields = [];
    for (let i = 0; i < formOrElements.length; i++) {
        const element = formOrElements.item(i);
        if (element instanceof HTMLInputElement) {
            const input = element as HTMLInputElement;
            const path = input.name;
            const disabled = input.disabled;
            let value: any = input.value;
            if (input.type === 'checkbox') {
                value = input.checked;
            }
            if (input.type === 'number' || input.type === 'range') {
                value = input.valueAsNumber;
            }
            if (input.type === 'date') {
                value = input.valueAsDate;
            }
            if (input.type === 'time') {
                value = input.valueAsNumber;
            }
            if (path && !disabled) {
                fields.push({disabled, path, value});
            }
        } else if (element instanceof HTMLSelectElement) {
            const select = element as HTMLSelectElement;
            const disabled = select.disabled;
            const path = select.name;
            let value;
            if (select.multiple) {
                value = [];
                for (let i = 0; i < select.selectedOptions.length; i++) {
                    const option = select.selectedOptions.item(i);
                    value.push(option.value);
                }
            } else {
                value = select.selectedOptions.length ? select.selectedOptions.item(0).value : undefined;
            }
            if (path && !disabled) {
                fields.push({disabled, path, value});
            }
        } else if (element instanceof HTMLTextAreaElement) {
            const textArea = element as HTMLTextAreaElement;
            const path = textArea.name;
            const disabled = textArea.disabled;
            const value = textArea.value;
            if (path && !disabled) {
                fields.push({disabled, path, value});
            }
        } else if (element instanceof HTMLButtonElement) {
            const button = element as HTMLButtonElement;
            const path = button.name;
            const disabled = button.disabled;
            const value = button.value;
            if (path && !disabled) {
                fields.push({disabled, path, value});
            }
        }
    }

    fields.forEach(({path, value}) => fillObject(formAsObject, path, value));

    return formAsObject;
}
