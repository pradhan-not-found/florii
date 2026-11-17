import { Redis } from "@upstash/redis";

export function analyticsRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token, retry: false }) : null;
}

export const analyticsKey = "florii:analytics";
export const retentionSeconds = 90 * 24 * 60 * 60;

// HyperLogLog keeps approximate unique counts without retaining raw browser IDs.
// One atomic script also deduplicates repeated delivery of the same page view.
export const recordVisit = `
if not redis.call('SET', KEYS[1], '1', 'EX', 300, 'NX') then return 0 end
redis.call('INCR', KEYS[2])
redis.call('PFADD', KEYS[3], ARGV[1])
redis.call('INCR', KEYS[4])
redis.call('PFADD', KEYS[5], ARGV[1])
redis.call('EXPIRE', KEYS[4], ARGV[2])
redis.call('EXPIRE', KEYS[5], ARGV[2])
return 1
`;
