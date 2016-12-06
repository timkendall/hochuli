import test from 'ava'
import createDigestCacher, { getFromLocalStorage, setInLocalStorage } from 'hochuli/digest-cacher'

test('a working manifestCacher can be created with "createDigestCacher()"', t => {
  const keyPrefx = 'referee-test'
  const manifestCacher = createDigestCacher(keyPrefx)
  const etag = '1929dkef01'
  const exampleTogglesManifest = [
    {
      feature_id: 'smart_deposit_balance_check',
      rule_id: 'developers_qa'
    },
    {
      feature_id: 'auto_eligible_by_offer_system',
      rule_id: 'on'
    }
  ]

  // Non-existent manifests should return null
  t.is(manifestCacher.getManifest('rules'), null)
  // We should get back deserialized objects (as localStorage only stores objects as strings)
  manifestCacher.setManifest('toggles', exampleTogglesManifest, etag)

  t.deepEqual(manifestCacher.getManifest('toggles').manifest, exampleTogglesManifest)
  t.deepEqual(manifestCacher.getManifest('toggles').etag, etag)
})

test('a value can be retrieved from LocalStorage', t => {
  const keyPrefix = 'referee-test'
  const obj = { foo: 'bar' }

  window.localStorage.setItem(`${keyPrefix}string`, 'hello world')
  window.localStorage.setItem(`${keyPrefix}object`, JSON.stringify(obj))

  t.is(getFromLocalStorage(keyPrefix, 'string'), 'hello world')
  t.deepEqual(getFromLocalStorage(keyPrefix, 'object'), obj)
})


test('a value can be set in LocalStorage', t => {
  const keyPrefix = 'referee-test'
  const obj = { foo: 'bar' }
  const etag ='1929dkef01'

  setInLocalStorage(keyPrefix, 'thing1', 'hello world', etag)
  setInLocalStorage(keyPrefix, 'thing2', obj, etag)

  t.is(window.localStorage.getItem(`${keyPrefix}thing1`), 'hello world')
  t.deepEqual(JSON.parse(window.localStorage.getItem(`${keyPrefix}thing2`)), obj)
})
