import { Fetcher } from 'swr';

export const fetcher: Fetcher = async (
  input: RequestInfo,
  init?: RequestInit
) => {
  const res = await fetch(input, init);
  return res.json();
};
