import test from 'ava'
import configureStore from 'redux-mock-store'
import { mockCachedEndpoint, mockFreshEndpoint } from './helpers/endpoints'
import { retrieveCachedDigest } from 'hochuli/digest-fetcher'

const mockStore = configureStore()

test('it responds with a cached manifest if the remote manifest HASNT changed', async t => {
  const rulesDigestURL = 'https://example.com/toggles-digest.json'
  // Mock endpoints that respond with '304 Not Modified'
  mockCachedEndpoint('https://example.com/', '/toggles-digest.json')

  const store = mockStore()
  const cachedManifest = [{ feature_id: 'sweetness', rule_id: 'on' }]
  const cacheMock = { cachedETag: '123', cachedManifest }

  const manifest = await retrieveCachedDigest(rulesDigestURL, cacheMock, store)

  t.deepEqual(manifest, cachedManifest)
})

test('it responds with a fresh manifest if the remote manifest HAS changed', async t => {
  const rulesDigestURL = 'https://example.com/toggles-digest.json'
  const cachedManifest = [{ feature_id: 'sweetness', rule_id: 'on' }]
  const cacheMock = { cachedETag: '123', cachedManifest }
  const freshManifest = [{ feature_id: 'sweetness', rule_id: 'off' }]
  const freshManifestETag = '12345678abc'
  // Mock endpoints that respond with '304 Not Modified'
  mockFreshEndpoint('https://example.com/', '/toggles-digest.json', freshManifest, freshManifestETag)

  const store = mockStore()
  const actionCreator = (etag, manifest) => {
    return {
      type: 'REFRESH_CACHE',
      payload: { ETag: etag, manifest }
    }
  }
  const manifest = await retrieveCachedDigest(rulesDigestURL, cacheMock, store, actionCreator)

  t.deepEqual(manifest, freshManifest)
  t.deepEqual(store.getActions(), [
    {
      type: 'REFRESH_CACHE',
      payload: { ETag: freshManifestETag, manifest: freshManifest }
    }
  ])
})
