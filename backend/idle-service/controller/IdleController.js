const {
  getResource,
  normalizeResource,
} = require("../repository/IdleRepository");

const insertResource = async (req, res) => {
  try {
    await getResource();
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
