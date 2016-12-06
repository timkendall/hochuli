import TargetTypes from '../target-types';
import Errors from '../errors';

export default class Rule { 
  title() {
    throw Errors.NotImplemented;
  }

  description() {
    throw Errors.NotImplemented;
  }

  targetType() {
    return TargetTypes.NotSet;
  }

  run() {
    throw Errors.NotImplemented;
  }
}