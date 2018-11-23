import {expect} from 'chai';
import {addDelegatedEventListener} from '../src';

describe('formToObject', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should expose addDelegatedEventListener', () => {
        expect(addDelegatedEventListener).to.be.exist;
    });

});
