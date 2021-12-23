require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("@koa/router");
const session = require("koa-session");
const serve = require("koa-static");
const fs = require("fs");
const authController = require("./controllers/auth");
const generatorController = require("./controllers/generators");
const middleware = require("./middleware");

const app = new Koa();
app.keys = [process.env.SESSION_KEYS];

const buildFolderPath = `${__dirname}/../build`;

if (process.env.NODE_ENV === `production`) {
  app.use(serve(buildFolderPath));
}

const router = new Router();
const PORT = 8001;

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
router.get(
  `/generators/:id`,
  middleware.checkAuth,
  generatorController.getGeneratorById
);
router.post(
  `/generators/:id/generate`,
  middleware.checkAuth,
  generatorController.generatePlaylist
);
router.put(
  `/generators/:id`,
  middleware.checkAuth,
  generatorController.editGenerator
);
router.delete(
  `/generators/:id`,
  middleware.checkAuth,
  generatorController.deleteGenerator
);

router.post(
  `/apikey/generate`,
  middleware.checkAuth,
  authController.generateApiKey
)

// Generate playlist via api key
router.post(
  `/api/generators/:id/generate`,
  middleware.checkApiKey,
  generatorController.generatePlaylist
)

app.use((ctx, next) => {
  ctx.type = "html";
  ctx.body = fs.readFileSync(`${buildFolderPath}/index.html`);
});

app.listen(PORT);
console.log(`listening on port ${PORT}`);
