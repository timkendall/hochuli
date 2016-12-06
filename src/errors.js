export default {
  NotImplemented: new Error('Not implemented'),
  KeyExists: new Error('Key exists'),
  RuleNotFound: new Error('A rule with the specified key could not be found'),
  FeatureNotFound: (key) => new Error(`A feature with the key "${key}" is not defined`)
}