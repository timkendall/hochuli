import test from 'ava';
import Group from 'rules/Group';

test.todo('the "title" function is implemented');

test.todo('the "description" function is implemented');

test.todo('the "targetType" function is implemented');

test('the "run" function is implemented', t => {
  // A rule representing a group of users
  const developersQARule = new Group('developers-qa', 'user_uuid', [
    "5c6dd8cf-c55b-427d-99d2-9d859273c00c",
    "ca050d9c-dce8-4b34-8612-19f510701685",
    "9b447de2-7d4c-463d-857a-44b19dcd8c13",
    "4eeda208-64cf-483b-b824-4b6940384f25",
    "d9da022f-34a0-4519-b648-9b4690368f82",
    "35f23b76-60c3-4a2d-9d7e-9dc4f31cbacf",
    "4f08e334-266e-44eb-a452-7035f50cf1c4",
    "26039d10-b3a4-44ad-97dd-70e7aa74eda4",
    "3b5a3ce3-1303-4a80-8fc6-79a1a66932ba"
  ])

  t.is(true, developersQARule.run('5c6dd8cf-c55b-427d-99d2-9d859273c00c'))
  t.is(false, developersQARule.run('abcd'))
  t.is(false, developersQARule.run(''))
  t.is(false, developersQARule.run())
});
