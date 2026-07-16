import axiosClient from "./AxiosClient";

const responseCache = new Map();
const inFlightRequests = new Map();

export const getCached = async (url, config = {}, ttlMs = 5 * 60 * 1000) => {
  const paramsKey = config.params ? JSON.stringify(config.params) : "";
  const key = `${url}:${paramsKey}`;
  const cached = responseCache.get(key);

  if (cached && cached.expiresAt > Date.now()) return cached.response;
  if (inFlightRequests.has(key)) return inFlightRequests.get(key);

  const request = axiosClient
    .get(url, config)
    .then((response) => {
      responseCache.set(key, { response, expiresAt: Date.now() + ttlMs });
      return response;
    })
    .finally(() => inFlightRequests.delete(key));

  inFlightRequests.set(key, request);
  return request;
};

export const invalidateCached = (urlPrefix) => {
  for (const key of responseCache.keys()) {
    if (key.startsWith(urlPrefix)) responseCache.delete(key);
  }
};
