import {expect} from 'chai';
import {formToObject} from '../src/index';

describe('formToObject', () => {

    let form: HTMLFormElement;

    beforeEach(() => {
        form = document.createElement('form') as HTMLFormElement;
    });

    it('should skip when no path', () => {
        form.innerHTML = `<input value="text" />`;
        const result = formToObject(form);
        expect(Object.keys(result)).to.have.lengthOf(0);
    });

    it('should extract form', () => {
        form.innerHTML = `<input name="text" value="text" />`;
        const result = formToObject(form);
        expect(result).to.have.nested.property('text', 'text');
    });

    it('should extract text', () => {
        form.innerHTML = `<input name="text" value="text" />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('text', 'text');
    });

    it('should extract empty text', () => {
        form.innerHTML = `<input name="text" />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('text', '');
    });

    it('should extract checked checkbox', () => {
        form.innerHTML = `<input name="checkbox" type="checkbox" checked />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('checkbox', true);
    });

    it('should extract unchecked checkbox', () => {
        form.innerHTML = `<input name="checkbox" type="checkbox" />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('checkbox', false);
    });

    it('should extract input radio ', () => {
        form.innerHTML = `
        <input name="radio" type="radio" value="radio1"/>
        <input name="radio" type="radio" value="radio2" checked />
        `;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('radio', 'radio2');
    });

    it('should extract number', () => {
        form.innerHTML = `<input name="number" type="number" value="10" />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('number', 10);
    });

    it('should extract range', () => {
        form.innerHTML = `<input name="range" type="range" value="10" />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('range', 10);
    });

    it('should extract date', () => {
        const input = form.appendChild(document.createElement('input')) as HTMLInputElement;
        input.name = 'date';
        input.type = 'date';
        input.value = '2018-01-01';
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('date', '2018-01-01');
    });

    it('should extract time', () => {
        form.innerHTML = `<input name="time" type="time" value="10:10" />`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('time', '10:10');
    });

    it('should extract textarea', () => {
        form.innerHTML = `<textarea name="textarea">textarea</textarea>`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('textarea', 'textarea');
    });

    it('should extract button', () => {
        form.innerHTML = `<button name="button" value="button"></button>`;
        const result = formToObject(form.elements);
        expect(result).to.have.nested.property('button', 'button');
    });

    it('should not extract disabled textarea', () => {
        form.innerHTML = `<textarea name="textarea" disabled>textarea</textarea>`;
        const result = formToObject(form.elements);
        expect(result).to.not.have.nested.property('textarea');
    });

    it('should not extract disabled input', () => {
        form.innerHTML = `<input name="input" value="input" disabled>`;
        const result = formToObject(form.elements);
        expect(result).to.not.have.nested.property('input');
    });

    it('should not extract disabled select', () => {
        form.innerHTML = form.innerHTML = `<select name="select" disabled><option>option1</option></select>`;
        const result = formToObject(form.elements);
        expect(result).to.not.have.nested.property('input');
    });

    context('when single select', () => {
        it('should extract unselected options', () => {
            form.innerHTML = `
            <select name="select">
                <option></option>
                <option>option1</option>
                <option>option2</option>
                <option>option3</option>
            </select>
            `;
            const result = formToObject(form.elements);
            expect(result).to.have.nested.property('select', '');
        });
        it('should extract selected option', () => {
            form.innerHTML = `
            <select name="select">
                <option></option>
                <option>option1</option>
                <option selected>option2</option>
                <option>option3</option>
            </select>
            `;
            const result = formToObject(form.elements);
            expect(result).to.have.nested.property('select', 'option2');
        });
    });

    context('when multiple select', () => {
        it('should extract unselected options', () => {
            form.innerHTML = `
            <select name="select" multiple>
                <option></option>
                <option>option1</option>
                <option>option2</option>
                <option>option3</option>
            </select>
            `;
            const result = formToObject(form.elements);
            expect(result.select).to.have.lengthOf(0);
        });
        it('should extract selected option', () => {
            form.innerHTML = `
            <select name="select" multiple>
                <option></option>
                <option>option1</option>
                <option selected>option2</option>
                <option selected>option3</option>
            </select>
            `;
            const result = formToObject(form.elements);
            expect(result.select).to.have.lengthOf(2);
            expect(result).to.nested.include({'select[0]': 'option2'});
            expect(result).to.nested.include({'select[1]': 'option3'});
        });
    });

    it('should extract array', () => {
        form.innerHTML = `<input name="array[2]" value="text" />`;
        const result = formToObject(form.elements);
        expect(result.array).to.have.lengthOf(3);
        expect(result).to.nested.include({'array[2]': 'text'});
    });

    it('should extract array of array', () => {
        form.innerHTML = `<input name="array[2][3]" value="text" />`;
        const result = formToObject(form.elements);
        expect(result.array).to.have.lengthOf(3);
        expect(result.array[2]).to.have.lengthOf(4);
        expect(result).to.nested.include({'array[2][3]': 'text'});
    });

    it('should extract complex objects', () => {
        form.innerHTML = `
        <input name="array[2].field1" value="value1" />
        <input name="array[2].field1" value="value1bis" />
        <input name="array[2].field2" checked type="checkbox" />
        <input name="array[2].field3" value="value3" />
        <input name="array[1].field1[0].field1" value="value4" />
        `;
        const result = formToObject(form.elements);
        expect(result.array).to.have.lengthOf(3);
        expect(result).to.nested.include({'array[2].field1': 'value1bis'});
        expect(result).to.nested.include({'array[2].field2': true});
        expect(result).to.nested.include({'array[2].field3': 'value3'});
        expect(result).to.nested.include({'array[1].field1[0].field1': 'value4'});
    });

    it('should override none object item in array', () => {
        form.innerHTML = `
        <input name="array[0]" value="value2" />
        <input name="array[0].field1" value="value1" />
        `;
        const result = formToObject(form.elements);
        expect(result).to.nested.include({'array[0].field1': 'value1'});
    });

});
