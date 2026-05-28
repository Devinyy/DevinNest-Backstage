const HTTP_URL_PREFIX = 'http://';
const HTTPS_URL_PREFIX = 'https://';

export const normalizeHttpUrlsToHttps = <T>(value: T): T => {
  if (typeof value === 'string') {
    return (value.startsWith(HTTP_URL_PREFIX)
      ? `${HTTPS_URL_PREFIX}${value.slice(HTTP_URL_PREFIX.length)}`
      : value) as T;
  }

  if (Array.isArray(value)) {
    return value.map(item => normalizeHttpUrlsToHttps(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeHttpUrlsToHttps(item)])
    ) as T;
  }

  return value;
};
