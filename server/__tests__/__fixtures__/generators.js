const generatorSeeds = [
  {
    id: "4UXqAaa6dQYAk18Lv7PEgX",
    name: "Fall Out Boy",
    type: "artist",
    image: "https://i.scdn.co/image/ab676161000051741443b137c8941b9c73237a27",
  },
  {
    id: "5wQnmLuC1W7ATsArWACrgW",
    name: "Welcome to the Black Parade",
    type: "track",
    album: "The Black Parade",
    image: "https://i.scdn.co/image/ab67616d00001e0217f77fab7e8f18d5f9fee4a1",
    artist: "My Chemical Romance",
  },
];

const createGeneratorBody = {
  generatorName: "New Generator",
  generatorSeeds,
  generatorFrequency: "never",
  generatorDay: null,
  optInText: false,
  phoneNumber: null,
  overwriteExisting: false,
};

const getGenerators = [createGeneratorBody];

module.exports = {
  createGeneratorBody,
  getGenerators,
};
