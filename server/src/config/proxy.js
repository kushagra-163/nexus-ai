// TRUST_PROXY is the number of reverse proxies in front of the app.
// Unset or 0 keeps it off, so a directly exposed server cannot be spoofed with X-Forwarded-For.
export const getTrustProxySetting = (value = process.env.TRUST_PROXY) => {
  if (value === undefined || value === null || String(value).trim() === '') return false;
  const hops = Number(value);
  if (!Number.isInteger(hops) || hops < 0) {
    throw new Error('TRUST_PROXY must be a non-negative integer (number of proxy hops).');
  }
  return hops === 0 ? false : hops;
};
