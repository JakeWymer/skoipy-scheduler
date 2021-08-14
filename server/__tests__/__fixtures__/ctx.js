const createCtx = (body = null, user = null, params = {}) => {
  const ctx = {
    request: {},
    state: {},
    response: {},
    params,
  };
  if (body) {
    ctx.request.body = body;
  }
  if (user) {
    ctx.state.user = user;
  }
  return ctx;
};

module.exports = {
  createCtx,
};
