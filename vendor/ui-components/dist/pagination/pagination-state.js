export function paginationInteger(value, name, minimum) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new RangeError(`${name} must be a safe integer >= ${minimum}`);
  }
  return value;
}
export function paginationState(requestedPage, pageSize, total) {
  paginationInteger(requestedPage, "page", 1);
  paginationInteger(pageSize, "pageSize", 1);
  paginationInteger(total, "total", 0);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount);
  return {
    page,
    pageSize,
    pageCount,
    total,
    offset: (page - 1) * pageSize
  };
}
