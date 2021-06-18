import {MessageHandler, UiMessage, UiMessageDispatcher, UiMessagesListener} from './index';
import {addEventListener} from '../event';
import {expect} from 'chai';
import {spy} from 'sinon';
import process from 'process';

global.process = process;

describe('messages', () => {
    let sandbox: HTMLDivElement;
    let target: HTMLDivElement;
    let span: HTMLSpanElement;
    beforeEach(() => {
        sandbox = document.createElement('div');
        target = sandbox.appendChild(document.createElement('div'));
        span = target.appendChild(document.createElement('span'));
    });
    it('should start and stop', function () {
        const uiMessagesListener = UiMessagesListener.from(target);
        uiMessagesListener.start();
        expect(uiMessagesListener.isStarted).to.be.true;
        uiMessagesListener.stop();
        expect(uiMessagesListener.isStarted).to.be.false;
    });
    it('should handle message', function (done) {
        const urn = 'action/message';
        const payload = 'a payload';
        const handler: MessageHandler<string> = (message) => {
            expect(message).to.have.property('urn', urn);
            expect(message).to.have.property('payload', payload);
            done()
        };
        UiMessagesListener.from(target).register(urn, handler).start();
        UiMessageDispatcher.dispatch(urn).payload(payload).from(span);
    });
    it('should not bubbles message', function (done) {
        const handler = spy();
        const urn = 'action/message';
        const payload = 'a payload';
        UiMessagesListener.from(target).register(urn, handler).start();
        addEventListener(span, UiMessage.EVENT_TYPE, (event) => {
            expect(event).to.have.property('bubbles', false);
            expect(handler.notCalled).to.be.true;
            done();
        });
        UiMessageDispatcher.dispatch(urn).payload(payload).bubbles(false).from(span);
    });
    it('should not handle a message twice', function (done) {
        const handler1 = spy();
        const handler2 = spy();
        const urn = 'action/message';
        const payload = 'a payload';
        UiMessagesListener.from(target).register(urn, handler1).start();
        UiMessagesListener.from(target).register(urn, handler2).start();
        addEventListener(sandbox, UiMessage.EVENT_TYPE, (event) => {
            expect(event).to.have.property('defaultPrevented', true);
            expect(handler1.calledOnce).to.be.true;
            expect(handler2.notCalled).to.be.true;
            done();
        });
        UiMessageDispatcher.dispatch(urn).payload(payload).cancellable(true).from(span);
    });
    it('should handle composed message', function (done) {
        const handler1 = spy();
        const urn = 'action/message';
        const payload = 'a payload';
        span.attachShadow({mode: 'open'});
        const i = span.shadowRoot.appendChild(document.createElement('i'));
        UiMessagesListener.from(target).register(urn, handler1).start();
        addEventListener(sandbox, UiMessage.EVENT_TYPE, (event) => {
            expect(event.composed).to.be.true;
            expect(handler1.calledOnce).to.be.true;
            done();
        });
        UiMessageDispatcher.dispatch(urn).payload(payload).from(i);
    });
    it('should not handle composed message', function (done) {
        const handler1 = spy();
        const urn = 'action/message';
        const payload = 'a payload';
        span.attachShadow({mode: 'open'});
        const i = span.shadowRoot.appendChild(document.createElement('i'));
        UiMessagesListener.from(span.shadowRoot).register(urn, handler1).start();
        addEventListener(span.shadowRoot, UiMessage.EVENT_TYPE, (event) => {
            expect(handler1.calledOnce).to.be.true;
            expect(event.composed).to.be.false;
            done();
        });
        UiMessageDispatcher.dispatch(urn).payload(payload).composed(false).from(i);
    });
});
