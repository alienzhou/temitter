import { EventEmitter } from '../src/index';

type EventHandler = {
    test: (d: number) => void;
    greeter: (d: string) => void;
};

describe('instantiate', () => {
    it('should instantiate successfully', () => {
        expect(() => new EventEmitter()).not.toThrow();
    });
});

describe('on', () => {
    it('should call .on successfully', () => {
        expect(() => new EventEmitter().on('test', () => {})).not.toThrow();
    });

    it('should return the EventEmitter instance', () => {
        const ee = (new EventEmitter()).on('test', () => {});
        expect(ee).toBeInstanceOf(EventEmitter);
    });

    it('should listen on an event successfully', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);
        ee.emit('test', 302);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(302);
    });

    it('should not listen the event before attached', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.emit('test', 301);

        ee.on('test', spy);

        ee.emit('test', 302);
        ee.emit('test', 303);

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenNthCalledWith(1, 302);
        expect(spy).toHaveBeenNthCalledWith(2, 303);
    });

    it('should add more listeners when attach the same listener to the same event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);
        ee.on('test', spy);

        ee.emit('test', 303);

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should trigger all listeners of the event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        const spy2 = jest.fn().mockName('listener2');
        ee.on('test', spy);
        ee.on('test', spy2);

        ee.emit('test', 301);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
    });
});

describe('emit', () => {
    it('should call .emit successfully', () => {
        expect(() => new EventEmitter().emit('test', 302)).not.toThrow();
    });

    it('should return the EventEmitter instance', () => {
        const ee = (new EventEmitter()).emit('test');
        expect(ee).toBeInstanceOf(EventEmitter);
    });

    it('should return the EventEmitter instance', () => {
        expect(() => new EventEmitter().on('test', () => {})).not.toThrow();
    });

    it('should trigger the event multi times', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);

        ee.emit('test', 301);
        ee.emit('test', 302);
        ee.emit('test', 303);

        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 301);
        expect(spy).toHaveBeenNthCalledWith(2, 302);
        expect(spy).toHaveBeenNthCalledWith(3, 303);
    });

    it('should trigger the listener multi times by calling .emit multi times', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);

        ee.emit('test', 301);
        ee.emit('test', 302);
        ee.emit('test', 303);

        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 301);
        expect(spy).toHaveBeenNthCalledWith(2, 302);
        expect(spy).toHaveBeenNthCalledWith(3, 303);
    });

    it('should only trigger the listener of the specific event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        const spy2 = jest.fn().mockName('listener2');
        ee.on('test', spy);
        ee.on('greeter', spy2);

        ee.emit('test', 301);
        ee.emit('test', 302);
        ee.emit('test', 303);

        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy2).not.toHaveBeenCalled();
    });

    it('should trigger listeners in correct order of attaching', () => {
        const ee = new EventEmitter<EventHandler>();
        const ret: number[] = [];
        const listener1 = () => ret.push(1);
        const listener2 = () => ret.push(2);
        ee.on('test', listener1);
        ee.on('test', listener2);

        ee.emit('test', 302);

        expect(ret).toEqual([1, 2]);
    });

    it('should trigger listeners synchronously', async () => {
        const ee = new EventEmitter<EventHandler>();
        const ret: number[] = [];
        const listener = () => ret.push(1);
        ee.on('test', listener);

        const p = Promise.resolve().then(() => ret.push(2));

        ee.emit('test', 302);

        await p;
        expect(ret).toEqual([1, 2]);
    });
});

describe('off', () => {
    it('should call .off successfully', () => {
        expect(() => new EventEmitter().off('test')).not.toThrow();
    });

    it('should return the EventEmitter instance', () => {
        const ee = (new EventEmitter()).off('test');
        expect(ee).toBeInstanceOf(EventEmitter);
    });

    it('should not trigger a listener after removing', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);
        ee.off('test', spy);

        ee.emit('test', 302);
        expect(spy).not.toHaveBeenCalled()
    });

    it('should not trigger a listener after removing', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);
        ee.off('test', spy);

        ee.emit('test', 302);
        expect(spy).not.toHaveBeenCalled()
    });

    it('should only remove the listener of the specific event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        const spy2 = jest.fn().mockName('listener2');
        ee.on('test', spy);
        ee.on('greeter', spy2);
        ee.off('test', spy);

        ee.emit('test', 302);
        ee.emit('greeter', '302');
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should remove all listeners of the event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        const spy2 = jest.fn().mockName('listener2');
        ee.on('test', spy);
        ee.on('test', spy2);
        ee.off('test');

        ee.emit('test', 302);
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });

    it('should only remove all listeners of the specific event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        const spy2 = jest.fn().mockName('listener2');
        const spy3 = jest.fn().mockName('listener3');
        ee.on('test', spy);
        ee.on('test', spy2);
        ee.on('greeter', spy3);
        ee.off('test');

        ee.emit('test', 302);
        ee.emit('greeter', '302');
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('should only remove the last listener on the specific event', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);
        ee.on('test', spy);
        ee.on('test', spy);
        ee.off('test', spy);
        ee.emit('test', 302);
        expect(spy).toHaveBeenCalledTimes(2);

        const spy2 = jest.fn().mockName('listener');
        ee.on('greeter', spy2);
        ee.on('greeter', spy2);
        ee.off('greeter', spy2);
        ee.emit('greeter', '302');
        expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('should remove all listeners on the specific event when call the same times as attaching', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');

        ee.on('test', spy);
        ee.on('test', spy);
        ee.on('test', spy);

        ee.off('test', spy);
        ee.off('test', spy);
        ee.off('test', spy);

        ee.emit('test', 302);

        expect(spy).not.toBeCalled();
    });
});

describe('once', () => {
    it('should call .once successfully', () => {
        expect(() => new EventEmitter().once('test', () => {})).not.toThrow();
    });

    it('should return the EventEmitter instance', () => {
        const ee = (new EventEmitter()).once('test', () => {});
        expect(ee).toBeInstanceOf(EventEmitter);
    });

    it('should be called only once', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.once('test', spy);
        ee.emit('test', 301);
        ee.emit('test', 302);
        ee.emit('test', 303);

        expect(spy).toBeCalledTimes(1);
    });

    it('should remove listeners by the sequence of attaching', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        ee.on('test', spy);
        ee.once('test', spy);
        ee.off('test', spy);
        ee.emit('test', 302);
        ee.emit('test', 302);
        expect(spy).toHaveBeenCalledTimes(2);

        const spy2 = jest.fn().mockName('listener2');
        ee.once('greeter', spy2);
        ee.on('greeter', spy2);
        ee.off('greeter', spy2);
        ee.emit('greeter', '302');
        ee.emit('greeter', '302');
        expect(spy2).toHaveBeenCalledTimes(1);
    });
});

describe('eventNames', () => {
    it('should return all event names', () => {
        const ee = new EventEmitter<EventHandler>();
        const listener = () => {};
        ee.on('test', listener);
        ee.on('greeter', listener);

        const eventNames = ee.eventNames;
        expect(eventNames).toHaveLength(2);
        expect(eventNames).toContain('test');
        expect(eventNames).toContain('greeter');
    });

    it('should return event names only with listeners', () => {
        const ee = new EventEmitter<EventHandler>();
        const listener = () => {};
        const listener2 = () => {};
        ee.on('test', listener);
        ee.on('test', listener2);
        ee.on('greeter', listener);
        ee.on('greeter', listener2);
        ee.off('test');

        expect(ee.eventNames).toEqual(['greeter']);
    });

    it('should return correct event names after removing some of listeners', () => {
        const ee = new EventEmitter<EventHandler>();
        const listener = () => {};
        const listener2 = () => {};
        ee.on('test', listener);
        ee.on('test', listener2);
        ee.on('greeter', listener);
        ee.on('greeter', listener2);
        ee.off('test', listener);

        const eventNames = ee.eventNames;
        expect(eventNames).toHaveLength(2);
        expect(eventNames).toContain('test');
        expect(eventNames).toContain('greeter');
    });
});

describe('offAll', () => {
    it('should call .offAll successfully', () => {
        expect(() => new EventEmitter().offAll()).not.toThrow();
    });

    it('should return the EventEmitter instance', () => {
        const ee = (new EventEmitter()).offAll();
        expect(ee).toBeInstanceOf(EventEmitter);
    });

    it('should remove all listeners', () => {
        const ee = new EventEmitter<EventHandler>();
        const spy = jest.fn().mockName('listener');
        const spy2 = jest.fn().mockName('listener2');
        ee.on('test', spy);
        ee.on('test', spy2);
        ee.on('greeter', spy);
        ee.on('greeter', spy2);

        ee.offAll();

        ee.emit('test', 302);
        ee.emit('greeter', '302');
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });

    it('should get none events after .offAll', () => {
        const ee = new EventEmitter<EventHandler>();
        ee.on('test', () => {});
        ee.on('test', () => {});
        ee.on('greeter', () => {});
        ee.on('greeter', () => {});

        expect(ee.eventNames).toHaveLength(2);
        ee.offAll();
        expect(ee.eventNames).toEqual([]);
    });
});