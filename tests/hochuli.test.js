import test from 'ava'
import configureStore from 'redux-mock-store'
import Hochuli from 'hochuli'
import { mockFreshEndpoint } from './helpers/endpoints'

const mockStore = configureStore()
const exampleRulesDigest = require('../EXAMPLE-RULES.json')
const exampleTogglesDigest = require('../EXAMPLE-BUSINESS.json')

test('rules can be defined in the "rules" block', t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app'
  })

  const QAUserUUIDs = [
    '5c6dd8cf-c55b-427d-99d2-9d859273c00c',
    'ca050d9c-dce8-4b34-8612-19f510701685',
    '9b447de2-7d4c-463d-857a-44b19dcd8c13'
  ]

  Toggles.rules(function() {
    this.rule('on', null).bool(true);
    this.rule('off', null).bool(false);
    this.rule('qa-team', 'user_uuid').group(QAUserUUIDs)
  })

  Toggles.release(function() {
    this.feature('friend-referrals', 'allow user to refer friends').on('on');
    this.feature('track-referral-shares', 'track the number of times a user shares their referral code').on('off')
    this.feature('togls-control-panel', 'show a control panel for managing togls').on('qa-team')
  })

  t.is(true, Toggles.feature('friend-referrals').isOn())
  t.is(false, Toggles.feature('track-referral-shares').isOn())
  t.is(true, Toggles.feature('togls-control-panel').isOn('9b447de2-7d4c-463d-857a-44b19dcd8c13'))
  t.is(false, Toggles.feature('togls-control-panel').isOn('some-none-qa-user'))
  t.is(false, Toggles.feature('togls-control-panel').isOn())
})

test('features can be defined in the "release" block', t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app'
  })

  Toggles.release(function() {
    this.feature('friend-referrals', 'allow user to refer friends').on();
    this.feature('one-step-link-a-bank', 'allow users to link a bank in one step').off();
  });

  t.is(true, Toggles.feature('friend-referrals').isOn());
  t.is(false, Toggles.feature('one-step-link-a-bank').isOn());
});


test('features can be defined in the "business" block', t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app'
  })

  Toggles.business(function() {
    this.feature('friend-referrals', 'allow user to refer friends').on();
    this.feature('one-step-link-a-bank', 'allow users to link a bank in one step').off();
  });

  t.is(true, Toggles.feature('friend-referrals').isOn());
  t.is(false, Toggles.feature('one-step-link-a-bank').isOn());
});

test('non-existent features default to off', t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app'
  })

  t.is(false, Toggles.feature('my-undeclared-feature').isOn());
});

test('it can fetch rule definitions from a remote repository', async t => {
  t.plan(1)

  const Toggles = new Hochuli({
    applicationID: 'my-test-app',
    rulesDigestURL: 'https://example.com/rule-digest.json'
  })

  mockFreshEndpoint('https://example.com/', '/rule-digest.json', exampleRulesDigest)

  await Toggles._updateRulesFromRemote()

  t.pass()
});

test('it can fetch toggle definitions from a remote repository', async t => {
  t.plan(1)

  const Toggles = new Hochuli({
    applicationID: 'my-test-app',
    togglesDigestURL: 'https://example.com/toggle-digest.json'
  })

  mockFreshEndpoint('https://example.com/', '/toggle-digest.json', exampleTogglesDigest)

  await Toggles._updateFeaturesFromRemote()

  t.pass()
})

test('the state of features and rules can be retrieved with "getState"', t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app'
  })

  t.pass(Toggles.getState())
})

test('"sync" returns a Promise', t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app',
    rulesDigestURL: 'https://example.com/rule-digest.json',
    togglesDigestURL: 'https://example.com/toggle-digest.json'
  })

  mockFreshEndpoint('https://example.com/', '/rule-digest.json', exampleRulesDigest)
  mockFreshEndpoint('https://example.com/', '/toggle-digest.json', exampleTogglesDigest)

  const syncPromise = Toggles.sync()

  t.is(syncPromise.constructor.name, 'Promise')
})

test('"sync" saves etags and manifests to localStorage in the browser', async t => {
  const Toggles = new Hochuli({
    applicationID: 'my-test-app',
    rulesDigestURL: 'https://example.com/rule-digest.json',
    togglesDigestURL: 'https://example.com/toggle-digest.json',
    cachePrefix: 'test-',
    caching: true
  })
  const etag = 'abcd'

  mockFreshEndpoint('https://example.com/', '/rule-digest.json', exampleRulesDigest, etag)
  mockFreshEndpoint('https://example.com/', '/toggle-digest.json', exampleTogglesDigest, etag)

  await Toggles.sync()

  t.is(window.localStorage.getItem('test-rules-etag'), etag)
  t.is(window.localStorage.getItem('test-toggles-etag'), etag)
  t.deepEqual(JSON.parse(window.localStorage.getItem('test-rules-manifest')), exampleRulesDigest)
  t.deepEqual(JSON.parse(window.localStorage.getItem('test-toggles-manifest')), exampleTogglesDigest)

  t.pass()
})

test('_loadDigestsFromLocalStorage populates our internal store', async t => {
  const initialState = {}
  const mockManifest = { foo: 'bar' }
  const store = mockStore(initialState)

  window.localStorage.setItem('test-again-rules-etag', '1234abc')
  window.localStorage.setItem('test-again-rules-manifest', JSON.stringify(mockManifest))
  window.localStorage.setItem('test-again-toggles-etag', '5678xyz')
  window.localStorage.setItem('test-again-toggles-manifest', JSON.stringify(mockManifest))

  const Toggles = new Hochuli({
    applicationID: 'tester',
    rulesDigestURL: 'https://example.com/rule-digest.json',
    togglesDigestURL: 'https://example.com/toggle-digest.json',
    cachePrefix: 'test-again-',
    caching: true,
    store
  })
  const actions = store.getActions()

  t.deepEqual(actions[0],
    { type: 'RESTORE_RULES_CACHE', payload: { etag: '1234abc', manifest: mockManifest }}
  )
  t.deepEqual(actions[1],
    { type: 'RESTORE_TOGGLES_CACHE', payload: { etag: '5678xyz', manifest: mockManifest }}
  )
})
