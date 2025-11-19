// src/utils/pager.js
// small helper to calculate offset/limit (not required but useful)
function pageParams(req, defaultLimit = 50, maxLimit = 500) {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(maxLimit, parseInt(req.query.limit || defaultLimit, 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

module.exports = { pageParams };
