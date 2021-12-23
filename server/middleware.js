const { User, ApikeyUser } = require("./models");
const { fetchTokens, GrantType, getUser, getUserByApiKey } = require("./controllers/auth");

const checkAuth = async (ctx, next) => {
  try {
    const userId = ctx.session.userId;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    const tokens = await fetchTokens(
      GrantType.REFRESH_TOKEN,
      user.refresh_token
    );

    ctx.state.user = user;
    ctx.state.user.accessToken = tokens.accessToken;

    if (!userId || !user) {
      throw new Error();
    }
  } catch (e) {
    console.log(e);
    ctx.response.status = 401;
    ctx.response.redirect(`/`);
  }

  await next();
};

const checkApiKey = async (ctx, next) => {
  const body = ctx.request.body;

  if (!body.apiKey) {
    ctx.response.status = 401;
    throw new Error("API key required");
  }

  const user = await getUserByApiKey(body.apiKey);

  if (!user) {
    ctx.response.status = 401;
    throw new Error("User not found");
  }

  const tokens = await fetchTokens(
    GrantType.REFRESH_TOKEN,
    user.refresh_token
  );

  ctx.state.user = user;
  ctx.state.user.accessToken = tokens.accessToken;

  await next();
}

module.exports = {
  checkAuth,
  checkApiKey,
};
