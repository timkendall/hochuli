import axios from 'axios'
import { actionCreators } from './state'

export function createCachedDigestFetcher(store, rulesDigestURL, togglesDigestURL) {
  const fetchIfNotCached = (type, digestURL, actionCreator) => {
    const { etag: cachedETag, manifest: cachedManifest } = store.getState().cache[type]
    const cache = { cachedETag, cachedManifest }

    return retrieveCachedDigest(
      digestURL,
      cache,
      store,
      actionCreator
    )
  }

  return {
    fetchRules() {
      return fetchIfNotCached('rules', rulesDigestURL, actionCreators.updateRulesCache)
    },

    fetchToggles() {
      return fetchIfNotCached('toggles', togglesDigestURL, actionCreators.updateTogglesCache)
    }
  }
}

export async function retrieveCachedDigest(url, cache, store, createAction) {
  const { cachedETag, cachedManifest } = cache

  try {
    const response = await axios.get(url, {
      headers: { 'If-None-Match': cachedETag },
      validateStatus
    })

    // If we get a `304 Not Modified` return the cached manifest
    if (response.status == 304) {
      return cachedManifest
    }
    // Otherwise parse the payload and bust the cache
    const manifest = response.data
    const ETag = response.headers['ETag'] || response.headers['etag']


    store.dispatch(createAction(ETag, manifest))

    return manifest
  } catch(exc) {
    console.warn('Error updating cache. Using cached manifest.', exc)
    return cachedManifest
  }
}

export function validateStatus(status) {
  return status === 200 || status === 304
}
