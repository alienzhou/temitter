# temitter

> a **T**ype-safe & **T**iny Event **Emitter**

[![Build Status](https://app.travis-ci.com/alienzhou/temitter.svg?branch=main)](https://app.travis-ci.com/alienzhou/temitter)   [![NPM version](https://img.shields.io/npm/v/temitter.svg)](https://www.npmjs.com/package/temitter)  [![Coverage Status](https://coveralls.io/repos/github/alienzhou/temitter/badge.svg?branch=main)](https://coveralls.io/github/alienzhou/temitter?branch=main)   [![codebeat badge](https://codebeat.co/badges/cfd98455-1e33-4d87-b3a1-582780f5eda0)](https://codebeat.co/projects/github-com-alienzhou-temitter-main)   [![MIT License](https://img.shields.io/github/license/alienzhou/temitter)](https://opensource.org/licenses/mit-license.php)

## Features

- 🔐 Fully type safe for typescript
- 💕 Support both browsers and nodejs
- 🍃 Tiny size (~300 Byte after minified & gzip)
- 🔎 Synchronous nature

## Quick Start

```
npm i temitter
```

```typescript
import { EventEmitter } from 'temitter';
type MyEventHandler = {
    greeter: (s: string) => void;
};
const ee = new EventEmitter<MyEventHandler>();

ee.on('greeter', s => console.log(s));
ee.emit('greeter', 'hi');
```

## How to use

It has most the same APIs as other event emitter libraries:

- `.on`: add event listeners
- `.off`: remove event listeners
- `.emit`: emit an event with data

You can provide a specific type for `EventMap` to make fully type-safe:

```typescript
import { EventEmitter } from 'temitter';

type MyEventHandler = {
    greeter: (s: string) => void;
    // ...some other listeners
};

const ee = new EventEmitter<MyEventHandler>();

// then event name 'greeter' and its listener will have the correct type
ee.on('greeter', s => console.log(s));

// can only emit 'greeter' with a string
ee.emit('greeter', 'hi');

// ❌ ee.emit('greeter', 100);
// typescript compile error: should pass a string but got a number (100)
```

## APIs

### `.on(event, listener)`

Listen on an event.

It will return the same `EventEmitter` instance.

### `.off(event, listener?)`

Remove the listener of an event. If it's called without the listener parameter, it will remove all listeners of the given event.

It will return the same `EventEmitter` instance.

### `.emit(event, ...data)`

Emit the event with some data. `.emit` is a synchronous call.

It will return the same `EventEmitter` instance.

### `.once(event, listener)`

Listen on an event and promise to be called only once.

It will return the same `EventEmitter` instance.

### `.offAll()`

Remove all listeners of all events.

It will return the same `EventEmitter` instance.

### `.eventNames`

The `EventEmitter` instance contains a `.eventNames` property. You can use this property get all valid events. A valid event is a event that has at least one listener on itself.
