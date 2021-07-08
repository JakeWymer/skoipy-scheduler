require("dotenv").config();
require("./db/index");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("@koa/router");
const session = require("koa-session");
const authController = require("./controllers/auth");
const generatorController = require("./controllers/generators");
const middleware = require("./middleware");

const app = new Koa();
const router = new Router();
const PORT = 8001;

app.keys = ["some secret hurr"];
router.use(session(app));

app.use(bodyParser());
app.use(router.routes());

router.get("/spotify/auth/url", (ctx) => {
  ctx.body = authController.spotifyAuthUrl;
});
router.get("/spotify/callback", authController.spotifyCallback);
router.get(
  "/spotify/search",
  middleware.checkAuth,
  generatorController.handleSearch
);
router.get("/me", authController.getUser);
router.get("/logout", authController.logOut);

router.post(
  `/generators`,
  middleware.checkAuth,
  generatorController.createGenerator
);
router.get(
  `/generators`,
  middleware.checkAuth,
  generatorController.getUserGenerators
);
router.post(
  `/generators/:id/generate`,
  middleware.checkAuth,
  generatorController.generatePlaylist
);

app.listen(PORT);
console.log(`listening on port ${PORT}`);
