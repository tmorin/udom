import {expect} from 'chai';
import {addEventListener} from '../src/index';

describe('addEventListener', () => {
    it('should delegate event listeners', (done) => {
        const container = document.createElement('div');
        const ul = container.appendChild(document.createElement('ul'));
        ul.appendChild(document.createElement('li'));
        const li1 = ul.appendChild(document.createElement('li'));
        const li2 = ul.appendChild(document.createElement('li'));
        ul.appendChild(document.createElement('li'));
        let eventListened = 0;
        addEventListener(
            ul,
            'custom-event-li1,custom-event-li2',
            function (evt) {
                if (evt.type === 'custom-event-li1') {
                    eventListened++;
                    expect(this).to.be.eq(ul);
                    expect(evt.target).to.be.eq(li1);
                    expect(evt.currentTarget).to.be.eq(ul);
                }
                if (evt.type === 'custom-event-li2') {
                    eventListened++;
                    expect(this).to.be.eq(ul);
                    expect(evt.target).to.be.eq(li2);
                    expect(evt.currentTarget).to.be.eq(ul);
                }
                if (eventListened === 2) {
                    done();
                }
            }
        );
        li1.dispatchEvent(new CustomEvent('custom-event-li1', {
            bubbles: true
        }));
        li2.dispatchEvent(new CustomEvent('custom-event-li2', {
            bubbles: true
        }));
    });
    it('should remove delegate event listeners', (done) => {
        const container = document.createElement('div');
        const ul = container.appendChild(document.createElement('ul'));
        ul.appendChild(document.createElement('li'));
        const li1 = ul.appendChild(document.createElement('li'));
        ul.appendChild(document.createElement('li'));
        const remove = addEventListener(
            container,
            'custom-event-li1,custom-event-li2',
            () => done('should not be called')
        );
        remove();
        li1.dispatchEvent(new CustomEvent('custom-event-li1', {
            bubbles: true
        }));
        setTimeout(() => done(), 100);
    });
});
