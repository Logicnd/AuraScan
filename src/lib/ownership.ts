import { normalizeUsername } from './validators';

export function getOwnerUsername() {
  return normalizeUsername(process.env.APP_OWNER_USERNAME || 'owner');
}
