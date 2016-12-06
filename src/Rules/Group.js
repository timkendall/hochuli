import Rule from './Rule';
import TargetTypes from '../target-types';

export default class Group extends Rule {
  constructor(id, targetType, initializationData, store) {
    super();

    this.id = id
    this.targetType = targetType
    this.initializationData = initializationData
    this.store = store
  }

  title() {
    return 'Group';
  }

  description() {
    return `
      Group Rule
    
      The Group Rule is a provided Rule that expects to be given an Array as
      it's initialization data and when evaluated determines the toggle state
      based on the given target being included in the Array that was passed in
      during initialization. This allows you to define various groups. 
    `;
  }

  run(context) {
    return this.initializationData.indexOf(context) >= 0;
  }
  
}