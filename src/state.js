import debug from './logger'
import { createStore, applyMiddleware } from 'redux'
import clone from 'clone'

export const initialState = {
  cache: {
    rules: {
      etag: null,
      manifest: null
    },

    toggles: {
      etag: null,
      manifest: null
    }
  },

  features: {},
  rules: {}
}

export const actions = {
  CREATE_FEATURE: 'CREATE_FEATURE',
  ASSIGN_RULE_TO_FEATURE: 'ASSIGN_RULE_TO_FEATURE',
  CREATE_RULE: 'CREATE_RULE',
  REFRESH_RULES_CACHE: 'REFRESH_RULES_CACHE',
  REFRESH_TOGGLES_CACHE: 'REFRESH_TOGGLES_CACHE',
  RESTORE_RULES_CACHE: 'RESTORE_RULES_CACHE',
  RESTORE_TOGGLES_CACHE: 'RESTORE_TOGGLES_CACHE'
}

export const actionCreators = {
  createFeature(featureData) {
    return {
      type: actions.CREATE_FEATURE,
      payload: { featureData }
    }
  },

  assignRuleToFeature(featureID, ruleID) {
    return {
      type: actions.ASSIGN_RULE_TO_FEATURE,
      payload: { featureID, ruleID }
    }
  },

  createRule(ruleData) {
    return {
      type: actions.CREATE_RULE,
      payload: { ruleData }
    }
  },

  updateRulesCache(etag, manifest) {
    return {
      type: actions.REFRESH_RULES_CACHE,
      payload: { etag, manifest }
    }
  },

  updateTogglesCache(etag, manifest) {
    return {
      type: actions.REFRESH_TOGGLES_CACHE,
      payload: { etag, manifest }
    }
  },

  restoreRulesCache(etag, manifest) {
    return {
      type: actions.RESTORE_RULES_CACHE,
      payload: { etag, manifest }
    }
  },

  restoreTogglesCache(etag, manifest) {
    return {
      type: actions.RESTORE_TOGGLES_CACHE,
      payload: { etag, manifest }
    }
  }
}

export function reducer(state = initialState, action) {
  const { type, payload, meta, error } = action;

  if (type === actions.CREATE_FEATURE) {
    const stateClone = clone(state)
    const { featureData } = payload

    stateClone.features[featureData.id] = featureData

    return stateClone
  }

  if (type === actions.CREATE_RULE) {
    const stateClone = clone(state)
    const { ruleData } = payload

    stateClone.rules[ruleData.id] = ruleData

    return stateClone
  }

  if (type === actions.ASSIGN_RULE_TO_FEATURE) {
    const { featureID, ruleID } = payload

    const feature = state.features[featureID]
    const haveRule = !!state.rules[ruleID]

    /** Note: Only allow remote overrides for `business` toggles. We also
        need to have both the feature and rule available. */
    if (feature && feature.type === 'business' && haveRule) {
      const stateClone = clone(state)

      stateClone.features[featureID].rule_id = ruleID

      return stateClone
    } else {
      /** TODO Provide more useful reporting here and do so without logging in test environment
          console.warn('Could not update feature from togl.') */
      debug(`Did not assign rule "${ruleID}" to feature "${featureID}"`)
    }

    return state
  }

  if (type === actions.RESTORE_RULES_CACHE || type === actions.REFRESH_RULES_CACHE) {
    const stateClone = clone(state)

    stateClone.cache.rules.etag = payload.etag
    stateClone.cache.rules.manifest = payload.manifest

    return stateClone
  }

  if (type === actions.RESTORE_TOGGLES_CACHE || type === actions.REFRESH_TOGGLES_CACHE) {
    const stateClone = clone(state)

    stateClone.cache.toggles.etag = payload.etag
    stateClone.cache.toggles.manifest = payload.manifest

    return stateClone
  }

  return state
}

export function setupStore(reducer, middleware) {
  if (middleware) {
    return createStore(reducer, applyMiddleware(middleware))
  }
  
  return createStore(reducer)
}
