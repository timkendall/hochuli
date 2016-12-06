import Rule from './Rule';
import TargetTypes from '../target-types';

export default class Bool extends Rule {
  constructor(id, targetType, initializationData, store) {
    super();

    this.id = id;
    this.targetType = targetType
    this.initializationData = initializationData
    this.store = store
  }

  title() {
    return 'Bool'
  }

  description() {
    return `
      The Boolean rule type is the base line rule for Hochuli. It allows you to
      flag a feature on/off by specifing a boolean value as the initialization
      data.
    `;
  }

  targetType() {
    return TargetTypes.None;
  }

  run(context) {
    return this.initializationData;
  }
}