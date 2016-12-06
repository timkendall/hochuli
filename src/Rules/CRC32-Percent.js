import Rule from './Rule'
import TargetTypes from '../target-types'
import crc32 from 'crc-32'

export default class Crc32Percent extends Rule {
  constructor(id, targetType, initializationData, store) {
    super();

    this.id = id;
    this.targetType = targetType
    this.initializationData = initializationData
    this.store = store
  }

  title() {
    return 'crc32 Percent';
  }

  description() {
    return `
      The crc32 Percent rule is a generic rule that enables being able to control
      toggles based on a percentage of things. It requires the thing id to be able
      to do this properly. It also requires a percentage as an integer between 0 and
      100 as the initialization data to describe the percentage. Note: This works
      the best when the thing ids are evenly and randomly distributed. An example of
      this is a uuid. Auto incrementing integer identifiers will work as well.
    `
  }

  targetType() {
    return TargetTypes.None
  }

  run(context) {
    const { featureID, thingID } = context
    const percentage = this.initializationData
    
    return this.percentageGroup(featureID, thingID) < percentage
  }

  percentageGroup(featureID, thingID) {
    return crc32.str(`${featureID}:${thingID}`) % 100
  }
}

