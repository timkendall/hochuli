# Hochuli

[![Build Status](https://travis-ci.org/timkendall/hochuli.svg?branch=master)](https://travis-ci.org/timkendall/hochuli)

Hochuli is a module for managing toggleable features in your applications. It works around the concepts of **release** and **business** toggles. It's a good idea to familiarize yourself with these concepts [here](docs/best-practices.md). Named after the famed [Ed Hochuli](https://www.youtube.com/watch?v=lYq1zX1Gtoo).


## Installation

`npm install hochuli`

## Usage

Features are defined in two categories, **release** or **business**.

- [`new Hochuli(options)`](#class)
- [`rules()`](#rules)
- [`release()`](#release)
- [`buisness()`](#business)
- [`feature()`](#feature)
- [`sync()`](#sync)
- [`getState()`](#get-state)

```js
import Hochuli from 'hochuli'

// Create a Toggles instance
const Toggles = new Hochuli({
  applicationID: 'my-test-app'
})

// Some user id's that we'll use later
const QAUserUUIDs = [
  '5c6dd8cf-c55b-427d-99d2-9d859273c00c',
  'ca050d9c-dce8-4b34-8612-19f510701685',
  '9b447de2-7d4c-463d-857a-44b19dcd8c13'
]


// Define rules that can be assigned to features
Toggles.rules(function() {
  // A Group rule representing the QA team
  this.rule('qa-team', 'user_uuid').group(QAUserUUIDs)
})

// Define in-app features managed by developers
Toggles.release(function() {
  // This feature is given the 'on' Bool-type rule
  this.feature('friend-referrals', 'allow user to refer friends').on();
  // This feature evaluates to `true` given
  this.feature('one-step-link-a-bank', 'allow users to link a bank in one step', 'user_uuid').on('qa-team');
});

// Define external features managed by the buisness
Toggles.business(function() {
  // By default this feature is given the 'off' Bool-type rule
  this.feature('show-confetti', 'display a nice confetti animation').off();
});
```
<a name="class"></a>
### new Hochuli(options)

An instance of the `Hochuli` class is needed to start managing your togls.

#### options
- `applicationID` - A unique identifier representing your application
- `defaultFeatureTargetType` - The default Target Type associated with a feature if not provided
- `togglesDigestURL` - URL to an external Togle manifest ([see example](./EXAMPLE-BUSINESS.json))
- `rulesDigestURL` - URl to an external Rules manifest ([see example](./EXAMPLE-RULES.json))
- `cachePrefix` - Prefix for cache keys
- `caching` - Cache toggle and rule digests *(defaults to false)*

<a name="rules"></a>
### Hochuli.rules(block)

`rules()` provides a DSL for defining rules that can later be assigned to features. This function takes another function which exposes a `rule()` on it's `this` context. Notice that we can the call `bool` or `group` on `this.rule` to define what type of rule it is.

- `rule(id, targetType)`

Example:

```js
hochuli.rules(function() {
  this.rule('admin-group', 'user_uuid').group(adminUUIDs)
})
```

<a name="release"></a>
### Hochuli.release(block)

`release()` is used to define features as **release** togls. It exposes a `this.feature` function on the function that you pass it. *Note that a `targetType` is optional but you really should specify one.*

- `this.feature(id, description, targetType)`

Example:

```js
hochuli.release(function() {
  this.feature('my-sweet-feat', 'Do something awesome').on()
})
```

<a name="business"></a>
### Hochuli.business(block)

`business()` is used to define features as **business** togls. It again exposes a `this.feature` function that works exactly like above.

<a name="feature"></a>
### Hochuli.feature(id)

`feature()` returns a `Togl` instance that exposes a single `isOn` method. `isOn` takes optional context data that gets fed into the feature's rule's `run` method. This is the interface used for controlling features in your code.

- `isOn(context)`

Example:

```js
hochuli.feature('my-sweet-feat').isOn() // => false
hochuli.feature('super-secret-feature').isOn(anAdminUUID) // => true
```

<a name="sync"></a>
### Hochuli.sync()

`sync()` is used to refresh the in-memory store's business toggle and rules definitions. It returns a `Promise`. Sync will also result in rule and toggle manifests being persisted in `localStorage` (if available) along with their ETags. Subsequent `sync` calls will make special `GET` requests that include the cached manifest ETags.

<a name="get-state"></a>
### Hochuli.getState()

`getState()` returns the entire serialized representation of your app's features and rules. *Note that it doesn't return Toggles as these are simply runtime representations of a feature and corresponding rule.*


## Development

### Developing

- 1. `git clone git@github.com:timkendall/hochuli.git && cd hochuli`
- 2. `yarn install`
- 3. `npm run test:watch`

### Building

`npm run build`

### Publishing

`npm publish`

## License

MIT © [Tim Kendall](https://github.com/timkendall)