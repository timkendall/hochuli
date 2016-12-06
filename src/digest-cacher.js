import debug from './logger'

export default function createManifestCacher(localStoragePrefix) {
  // In Browser or "Browser-like" environment
  if (typeof window !== 'undefined') {
    return {
      getManifest(type) {
        const etag = getFromLocalStorage(localStoragePrefix, type + '-etag')
        const manifest = getFromLocalStorage(localStoragePrefix, type + '-manifest')

        if (etag == null || manifest == null) {
          return null
        }

        return { etag, manifest }
      },

      setManifest(type, manifest, etag) {
        setInLocalStorage(localStoragePrefix, type + '-etag', etag)
        setInLocalStorage(localStoragePrefix, type + '-manifest', manifest)
      }
    }
  }

  return {
    getManifest: () => debug('manifestCacher:getManifest does not yet work in non-browser environments'),
    setManifest: () => debug('manifestCacher:setManifest does not yet work in non-browser environments')
  }
}

export function getFromLocalStorage(keyPrefix, key) {
  const localStorageObject = window.localStorage.getItem(keyPrefix + key)

  if (!localStorageObject) {
    return null
  }

  try {
    return JSON.parse(localStorageObject)
  } catch(exc) {
    debug(`Exception thrown when trying to JSON.parse value at key "${keyPrefix+key}" from localStorage`, exc)
  }

  return localStorageObject
}

export function setInLocalStorage(keyPrefix, key, value) {
  let serializedValue = value

  if (typeof value === 'object') {
    serializedValue = JSON.stringify(value)
  }

  window.localStorage.setItem(keyPrefix + key, serializedValue)
}
