import debug from './logger'

export default function createCacherMiddleware(cacher) {
  // Simple middleware to perform caching side-effects on the following actions
  const middleware = store => next => action => {
    const { type, payload } = action

    try {
      if (type === 'REFRESH_RULES_CACHE') {
        const { etag, manifest } = payload
        cacher.setManifest('rules', manifest, etag)
      }

      if (type === 'REFRESH_TOGGLES_CACHE') {
        const { etag, manifest } = payload
        cacher.setManifest('toggles', manifest, etag)
      }
    } catch(exc) {
      debug('"setManifest" failed', exc)
    }

    return next(action)
  }

  return middleware
}
