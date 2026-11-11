import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCaptcha } from '../captcha.js';

test('captcha expires, consumes incorrect answers and prevents replay', () => {
  let now = 1000;
  const captcha = createCaptcha({ now: () => now, answer: () => 'ABC234' });
  const valid = captcha.issue();
  assert.ok(valid.image.startsWith('data:image/png;base64,'));
  assert.equal(captcha.verify(valid.id, ' abc234 '), true);
  assert.equal(captcha.verify(valid.id, 'ABC234'), false);
  const incorrect = captcha.issue();
  assert.equal(captcha.verify(incorrect.id, 'ZZZZZZ'), false);
  assert.equal(captcha.verify(incorrect.id, 'ABC234'), false);
  const expired = captcha.issue();
  now += 300001;
  assert.equal(captcha.verify(expired.id, 'ABC234'), false);
  assert.equal(captcha.verify(undefined, undefined), false);
});
