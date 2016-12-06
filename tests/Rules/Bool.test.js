import test from 'ava';
import Bool from 'rules/Bool';

test.todo('the "title" function is implemented');

test.todo('the "description" function is implemented');

test.todo('the "targetType" function is implemented');

test('the "run" function is implemented', t => {
  const alwaysOn = new Bool('on', null, true) // rule that always evaluates to on

  t.is(true, alwaysOn.run()); // should always be true
});
