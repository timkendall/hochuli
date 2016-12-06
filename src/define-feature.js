import { actionCreators } from './state'

export default (type, store) => (id, description, targetType) => {
  return {
    on(ruleID = 'on') {
      const featureData = {
        id,
        description,
        type,
        target_type: targetType,
        rule_id: ruleID
      }

      store.dispatch(actionCreators.createFeature(featureData))
    },

    off(ruleID = 'off') {
      const featureData = {
        id,
        description,
        type,
        target_type: targetType,
        rule_id: ruleID
      }

      store.dispatch(actionCreators.createFeature(featureData))
    }
  }
}
