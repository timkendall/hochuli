import test from 'ava'
import CRC32Percent from 'rules/CRC32-Percent'

test('the "run" function is implemented', t => {
  const fiftyFiftyRule = new CRC32Percent('fifty-fifty', null, 50, null)

  const user1UUID = '5c6dd8cf-c55b-427d-99d2-9d859273c00c'
  const user2UUID = '4eeda208-64cf-483b-b824-4b6940384f25'

  // Note: I randomly chose these ID's but the percent rule should be idempotent (notice how I run them twice)
  t.is(true, fiftyFiftyRule.run({ featureID: 'new-home-screen', thingID: user1UUID }))
  t.is(true, fiftyFiftyRule.run({ featureID: 'new-home-screen', thingID: user1UUID }))

  t.is(false, fiftyFiftyRule.run({ featureID: 'new-home-screen', thingID: user2UUID }))
  t.is(false, fiftyFiftyRule.run({ featureID: 'new-home-screen', thingID: user2UUID }))
});
