/**
 * Generates a random ID, which is 10 characters long
 * and only contains lowercase letters and numbers.
 *
 * @returns Generated ID.
 */
export function generateRandomId() {
  return Math.random().toString(36).substring(2, 12);
}
