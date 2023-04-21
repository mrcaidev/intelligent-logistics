export type Good = {
  id: string;
  name: string;
  createdAt: number;
  source: string;
  target: string;
  isVip: boolean;
  graphId: string;
};

/**
 * Returns the good with the highest priority.
 */
export function getGoodWithHighestPriority(goods: Good[]) {
  let highestPriority = 0;
  let result: Good | undefined = undefined;

  for (const good of goods) {
    const priority = getPriority(good);
    if (priority > highestPriority) {
      highestPriority = priority;
      result = good;
    }
  }

  return result as Good;
}

/**
 * Returns the priority level of a good.
 *
 * The higher the priority, the sooner the good will be delivered.
 *
 * The priority level is by default
 * the elapsed time since the good's creation,
 * but VIP goods are assumed to be created earlier
 * (without modifying the actual created time),
 * to make sure that they are delivered first.
 */
function getPriority(good: Good) {
  const { createdAt, isVip } = good;
  const bias = isVip ? 1000 * 60 * 60 * 24 : 0;
  const now = new Date().getTime();
  return now - createdAt + bias;
}
