export async function browserFetch(input: RequestInfo, init?: RequestInit) {
  return window.fetch(input, init);
}
