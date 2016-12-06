import { setupStore, reducer, actionCreators } from './state'
import Errors from './errors'
import TargetTypes from './target-types'
import defineFeature from './define-feature'
import defineRule from './define-rule'
import createToggle from './create-toggle'
import { DEFAULT_RULES } from './default-rules'
import createDigestCacher from './digest-cacher'
import { createCachedDigestFetcher } from './digest-fetcher'
import createCacherMiddleware from './cacher-middleware'

export default class Hochuli {
  constructor(config = {}) {
    const {
      applicationID = '',
      togglesDigestURL = '',
      rulesDigestURL = '',
      cachePrefix = 'hochuli@1.0.0',
      caching = false,
      store
    } = config

    /** Note: For some reason assigning `TargetTypes.None` directly in
        the destructuring defaults syntax throws a ReferenceError for `TargetTypes`*/
    config.defaultFeatureTargetType = TargetTypes.None

    if (caching) {
      this._digestCacher = createDigestCacher(cachePrefix)
    } else {
      this._digestCacher = null
    }

    this._store = store || setupStore(reducer, createCacherMiddleware(this._digestCacher))
    this._digestFetcher = createCachedDigestFetcher(this._store, rulesDigestURL, togglesDigestURL)
    this.applicationID = applicationID
    this.defaultFeatureTargetType = config.defaultFeatureTargetType
    this.togglesDigestURL = togglesDigestURL
    this.rulesDigestURL = rulesDigestURL
    this.cachePrefix = cachePrefix

    if (caching) {
      this._loadDigestsFromLocalStorage()
    }
    
    this._initializeDefaultRules()
  }

  feature(key) {
    const feature = this._store.getState().features[key]
    // Note: Return a feature manager even if it's a null feature
    return createToggle(feature, this._store)
  }

  rules(block) {
    block.call({
      rule: defineRule(this._store)
    });
  }

  release(block) {
    block.call({
      feature: defineFeature('release', this._store)
    });
  }

  business(block) {
    block.call({
      feature: defineFeature('business', this._store)
    });
  }

  sync() {
    return this._updateRulesFromRemote().then(
      () => this._updateFeaturesFromRemote()
    )
  }

  getState() {
    return this._store.getState()
  }

  _initializeDefaultRules() {
    DEFAULT_RULES.forEach(rule => this._store.dispatch(actionCreators.createRule(rule)))
  }

  _loadDigestsFromLocalStorage() {
    const { restoreRulesCache, restoreTogglesCache } = actionCreators
    const cachedRules = this._digestCacher.getManifest('rules')
    const cachedToggles = this._digestCacher.getManifest('toggles')

    if (cachedRules) {
      this._store.dispatch(restoreRulesCache(cachedRules.etag, cachedRules.manifest))
    }

    if (cachedToggles) {
      this._store.dispatch(restoreTogglesCache(cachedToggles.etag, cachedToggles.manifest))
    }
  }

  _updateRulesFromRemote() {
    return this._digestFetcher.fetchRules().then(rules => {
      rules.forEach(rule => this._store.dispatch(actionCreators.createRule(rule)))
    })
  }

  _updateFeaturesFromRemote() {
    return this._digestFetcher.fetchToggles().then(toggles => {
      toggles.forEach(toggle => {
        this._store.dispatch(actionCreators.assignRuleToFeature(toggle.feature_id, toggle.rule_id))
      })
    })
  }
};
