const { Generator, User } = require("../models");
const { SCHEDULE_TYPES, SCHEDULE_DAYS } = require("../consts");
const { Op } = require("sequelize");
const { buildPlaylist } = require("../controllers/generators");
const { fetchTokens, GrantType } = require("../controllers/auth");
const logger = require("../logger");

const days = [
  SCHEDULE_DAYS.SUNDAY,
  SCHEDULE_DAYS.MONDAY,
  SCHEDULE_DAYS.TUESDAY,
  SCHEDULE_DAYS.WEDNESDAY,
  SCHEDULE_DAYS.THURSDAY,
  SCHEDULE_DAYS.FRIDAY,
  SCHEDULE_DAYS.SATURDAY,
];

(async () => {
  const today = new Date();
  const currentDay = days[today.getDay()];
  const currentMonthDay = today.getDate;
  let generators = await Generator.findAll({
    where: {
      [Op.not]: [{ schedule_frequency: SCHEDULE_TYPES.NEVER }],
    },
    include: [User],
  });

  generators = generators.filter((generator) => {
    let shouldGenerate;
    switch (generator.schedule_frequency) {
      case SCHEDULE_TYPES.DAILY:
        shouldGenerate = true;
        break;
      case SCHEDULE_TYPES.WEEKLY:
        shouldGenerate = generator.schedule_day === currentDay;
        break;
      case SCHEDULE_TYPES.BIWEEKLY:
        shouldGenerate = currentMonthDay === 1 || currentMonthDay === 15;
        break;
      case SCHEDULE_TYPES.MONTHLY:
        shouldGenerate = currentMonthDay === 1;
        break;
      default:
        shouldGenerate = false;
    }
    return shouldGenerate;
  });

  logger.success(
    `${generators.length} generators queued up for playlist creation.`
  );

  Promise.all(
    generators.map(async (generator) => {
      const user = generator.User;
      const tokens = await fetchTokens(
        GrantType.REFRESH_TOKEN,
        generator.User.refresh_token
      );
      user.accessToken = tokens.accessToken;
      logger.info(`Generating playlist ${generator.name} for user ${user.id}.`);
      await buildPlaylist(generator, user);
    })
  );
})();
