import test from 'ava';
import CompositeOR from 'rules/CompositeOR';

test('the "run" function is implemented', t => {
  const mockStore = {
    getState() {
      return {
        rules: {
          'developers-qa': {
            id: 'developers-qa',
            type: 'group',
            target_type: 'none',
            initialization_data: ['tim@example.com', 'killer@example.com']
          },
          'leadership': {
            id: 'leadership',
            type: 'group',
            target_type: 'none',
            initialization_data: ['nofel@example.com']
          }
        }
      }
    }
  }

  const alphaGroupRule = new CompositeOR('alpha-group', 'user_email', ['developers-qa', 'leadership'], mockStore)
  const singleGroupRule = new CompositeOR('alpha-group', 'user_email', ['developers-qa'], mockStore)

  t.is(false, alphaGroupRule.run())
  t.is(false, alphaGroupRule.run('bob@gmail.com'))
  t.is(true, alphaGroupRule.run('tim@example.com'))
  t.is(true, alphaGroupRule.run('killer@example.com'))
  t.is(true, alphaGroupRule.run('nofel@example.com'))

  t.is(true, singleGroupRule.run('tim@example.com'))
  t.is(false, singleGroupRule.run('nofel@example.com'))
});
