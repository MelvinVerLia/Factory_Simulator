const { getResource } = require("../repository/IdleRepository");

const insertResource = async (req, res) => {
  try {
    const response = await getResource();
    res.json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  insertResource,
};
