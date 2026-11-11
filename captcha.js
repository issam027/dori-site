import { randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { captchaImage } from './captcha-image.js';

// Answers stay on the server. A challenge expires after five minutes and every
// verification attempt consumes it, including incorrect answers.
export function createCaptcha({ now = Date.now, answer = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[randomInt(32)]).join('') } = {}) {
  const challenges = new Map();
  return {
    issue() {
      for (const [id, item] of challenges) if (item.expires <= now()) challenges.delete(id);
      if (challenges.size >= 2000) return null;
      const id = randomUUID(), text = answer();
      challenges.set(id, { text, expires: now() + 300000 });
      return { id, image: captchaImage(text) };
    },
    verify(id, response) {
      const item = challenges.get(id);
      challenges.delete(id);
      if (!item || item.expires <= now() || typeof response !== 'string') return false;
      const supplied = Buffer.from(response.trim().toUpperCase());
      const expected = Buffer.from(item.text);
      return supplied.length === expected.length && timingSafeEqual(supplied, expected);
    },
  };
}
