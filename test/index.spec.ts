import {expect} from 'chai';
import {addDelegatedEventListener, addEventListener, formToObject} from '../src/index';

describe('formToObject', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should expose addEventListener', () => {
        expect(addEventListener).to.be.exist;
    });

    it('should expose addDelegatedEventListener', () => {
        expect(addDelegatedEventListener).to.be.exist;
    });

    it('should expose formToObject', () => {
        expect(formToObject).to.be.exist;
    });

});
