import { DEFAULT_PAGINATION_LIMIT } from '../contracts';
import { Pagination } from '../types';

export const getPagination = (
  pageQuery: string,
  limitQuery: string,
): Pagination => {
  let limit = parseInt(limitQuery) || DEFAULT_PAGINATION_LIMIT;
  let page = parseInt(pageQuery);

  if (isNaN(limit) || limit === 0) limit = DEFAULT_PAGINATION_LIMIT;
  if (isNaN(page) || page === 0) page = 1;

  return { limit, page };
};
