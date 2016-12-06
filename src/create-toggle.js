import Rules from './Rules/index'

const { Bool, Group } = Rules

export default function createTogl(feature, store) {
  return { 
    isOn(context) {
      if (!feature) return false

      // Find the rule associated with the feature
      const ruleData = store.getState().rules[feature.rule_id]
      const rule = instantiateRuleInstance(ruleData, store)

      /** 
        TODO: Compare target types

        if (feature.target_type !== rule.target_type) {
          console.error('TargetType mismatch')
          return false
        }
      */

      return rule.run(context)
    }
  }
}

export function instantiateRuleInstance(ruleData, store) {
  const { id, type, target_type, initialization_data } = ruleData

  if (type === 'boolean') {
    return new Bool(id, target_type, initialization_data, store)
  } else if (type === 'group') {
    return new Group(id, target_type, initialization_data, store)
  } else if (type === 'composite_or') {
    return new CompositeOR(id, target_type, initialization_data, store)
  } else if (type === 'crc32_percent') {
    return new CRC32Percent(id, target_type, initialization_data, store)
  } else {
    throw new Error(`Rule of type "${type}" is not currently implemented.`) 
  }
}