const { sellResources } = require("../repository/InventoryRepository");

const sellResource = async (req, res) => {
  const player_id = "02bed726-39f3-453a-88bc-2c9b5aa7161a";
  const resource_id = "24e38b05-1246-4dac-b34d-bf5164007e90";
  const quantity = 1;
  try {
    const response = await sellResources(player_id, resource_id, quantity);
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  sellResource,
};
