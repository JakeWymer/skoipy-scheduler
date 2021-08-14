const fetch = require("node-fetch");
const generatorController = require("../controllers/generators");
const { Generator, User } = require("../models");
const { createCtx } = require("./__fixtures__/ctx");
const { userPlaylistApiResponse } = require("./__fixtures__/fetch");
const {
  createGeneratorBody,
  getGenerators,
} = require("./__fixtures__/generators");
const { userFix } = require("./__fixtures__/users");

jest.mock("node-fetch");
jest.mock("../models");

beforeEach(() => {
  fetch.mockReset();
  Generator.mockReset();
});

describe("Creates Generators", () => {
  it("creates a new generator", async () => {
    Generator.findAll.mockResolvedValue(getGenerators);
    const createGeneratorCtx = createCtx(createGeneratorBody, userFix);
    const result = await generatorController.createGenerator(
      createGeneratorCtx
    );
    expect(result).toEqual({ generators: getGenerators, error: null });
  });

  it("handles error", async () => {
    Generator.findAll.mockResolvedValue(getGenerators);
    Generator.create.mockImplementation(() => {
      throw new Error();
    });
    const createGeneratorCtx = createCtx(createGeneratorBody, userFix);
    const result = await generatorController.createGenerator(
      createGeneratorCtx
    );
    expect(result).toEqual({
      generators: getGenerators,
      error: `Failed to create generator`,
    });
  });
});

describe("Fetch Generators", () => {
  it("gets generator by id", async () => {
    Generator.findOne.mockResolvedValue(createGeneratorBody);
    const getGeneratorCtx = createCtx((params = { id: 1 }));
    const result = await generatorController.getGeneratorById(getGeneratorCtx);
    expect(result).toEqual({ isError: false, generator: createGeneratorBody });
  });

  it("handles error", async () => {
    Generator.findOne.mockImplementation(() => {
      throw new Error();
    });
    const getGeneratorCtx = createCtx((params = { id: 1 }));
    const result = await generatorController.getGeneratorById(getGeneratorCtx);
    expect(result).toEqual({
      isError: true,
    });
  });
});

describe("Generates Playlists", () => {
  it("increments playlist number if not overwriting", async () => {
    fetch.mockResolvedValue(userPlaylistApiResponse);
    const result = await generatorController.getNextPlaylistName(
      `token`,
      "Wizzlers Big Playlist"
    );
    expect(result).toEqual("Wizzlers Big Playlist 2");
  });
});
