const { User } = require("./models");
const { fetchTokens, GrantType } = require("./controllers/auth");

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

module.exports = {
  checkAuth,
};
