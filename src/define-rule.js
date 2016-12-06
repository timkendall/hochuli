import { actionCreators } from './state'

export default (store) => (id, targetType) => {
  return {
    bool(initializationData) {
      const ruleData = {
        id,
        type: 'boolean',
        target_type: targetType,
        initialization_data: initializationData
      }

      store.dispatch(actionCreators.createRule(ruleData))
    },

    group(initializationData) {
      const ruleData = {
        id,
        type: 'group',
        target_type: targetType,
        initialization_data: initializationData
      }

      store.dispatch(actionCreators.createRule(ruleData))
    },

    compositeOr(initializationData) {
      const ruleData = {
        id,
        type: 'composite_or',
        target_type: targetType,
        initialization_data: initializationData
      }

      store.dispatch(actionCreators.createRule(ruleData))
    },

    percent(initializationData) {
      const ruleData = {
        id,
        type: 'crc32_percent',
        target_type: targetType,
        initialization_data: initializationData
      }

      store.dispatch(actionCreators.createRule(ruleData))
    }
  }
}
