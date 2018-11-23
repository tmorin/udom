import {expect} from 'chai';
import {addDelegatedEventListener, formToObject} from '../src';

describe('formToObject', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should expose addDelegatedEventListener', () => {
        expect(addDelegatedEventListener).to.be.exist;
    });

    it('should expose formToObject', () => {
        expect(formToObject).to.be.exist;
    });

});
