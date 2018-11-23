import {expect} from 'chai';

describe('formToObject', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should be ok', () => {
        expect(sandbox).to.exist;
    });

});
