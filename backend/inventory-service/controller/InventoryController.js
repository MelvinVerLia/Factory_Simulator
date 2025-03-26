const { sellResources, getPlayerFactory } = require("../repository/InventoryRepository");

const sellResource = async (req, res) => {
  const player_id = "02bed726-39f3-453a-88bc-2c9b5aa7161a";
  const resource_id = "24e38b05-1246-4dac-b34d-bf5164007e90";
  const quantity = 1;
  try {
    const response = await sellResources(player_id, resource_id, quantity);
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const selectPlayerFactory = async (req, res) => {
  const player_id = "02bed726-39f3-453a-88bc-2c9b5aa7161a";
  try {
    const response = await getPlayerFactory(player_id);
    console.log(response.rows);
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json(error.message);
  }
}

module.exports = {
  sellResource,
  selectPlayerFactory
};
