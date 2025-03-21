const {
  getResource,
  normalizeResource,
} = require("../repository/IdleRepository");

const insertResource = async (req, res) => {
  const factory_id = "733a4b90-3d9c-45d3-b01f-59a8c2e4926e";
  const player_id = "02bed726-39f3-453a-88bc-2c9b5aa7161a";
  try {
    await getResource(player_id, factory_id);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

const resourceNormalize = async (req, res) => {
  try {
    await normalizeResource();
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
};

module.exports = {
  insertResource,
  resourceNormalize,
};
