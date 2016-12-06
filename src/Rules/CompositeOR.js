import Rule from './Rule'
import TargetTypes from '../target-types'
import { instantiateRuleInstance } from '../create-toggle'

export default class CompositeOR extends Rule {
  constructor(id, targetType, initializationData, store) {
    super();

    this.id = id;
    this.targetType = targetType
    this.initializationData = initializationData
    this.store = store
  }

  title() {
    return 'Composite OR';
  }

  description() {
    return `
      Use the composite OR rule for evaluating the given target against a collection
      of rules. This will short circuit at the first rule that evaluates to true. The
      rule data should be an array of rule IDs. The context data will be passed to each 
      rule when run.
    `
  }

  targetType() {
    return TargetTypes.None
  }

  run(context) {
    const rules = this.initializationData

    for (let ruleID of rules) {
      const ruleData = this.store.getState().rules[ruleID]
      const rule = instantiateRuleInstance(ruleData)

      if (rule.run(context)) return true
    }

    return false
  }
}