const {
  getAllFactories,
  buyFactorys,
  getPlayerById,
  getFactoryById,
  checkPlayerResource,
  addQueue,
} = require("../repository/FactoryRepository");

const selectAllFactories = async (req, res) => {
  try {
    const response = await getAllFactories();
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

const buyFactory = async (req, res) => {
  const player_id = "02bed726-39f3-453a-88bc-2c9b5aa7161a";
  const factory_id = "387b4ad2-fbfa-4b87-9177-7afdff8672ea";
  try {
    const player = await getPlayerById(player_id);
    const factory = await getFactoryById(factory_id);

    if (!player || !factory) return res.json("Factory or player not found");

    const wallet = parseFloat(player.wallet);

    const price = parseFloat(factory.price);

    if (wallet < price) return res.json("You Dont Have Enough Money!");

    const response = await buyFactorys(player_id, factory_id, price);

    res.json(response.rows).status(200);
  } catch (error) {
    res.json(error.message).status(500);
  }
};

const insertQueue = async (req, res) => {
  const player_id = "02bed726-39f3-453a-88bc-2c9b5aa7161a";
  const factory_id = "ab9f8e0a-792f-463e-9f1a-f911e21199ab";
  const resource_id = "24e38b05-1246-4dac-b34d-bf5164007e90";
  const quantity = 10;
  try {
    const response = await checkPlayerResource(player_id, factory_id);

    if (response[0].quantity < response[0].input_quantity)
      return res.json("You Dont Have Enough Resource!");

    addQueue(player_id, quantity, resource_id, factory_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  selectAllFactories,
  buyFactory,
  insertQueue,
};
