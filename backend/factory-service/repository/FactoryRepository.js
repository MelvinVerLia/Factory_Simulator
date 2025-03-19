const db = require("../db/index");

const getAllFactories = async () => {
  const response = await db.query("SELECT * FROM factory_catalog");
  return response;
};

const buyFactorys = async (player_id, factory_id, price) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");

    //update wallet
    await client.query(
      "UPDATE player SET wallet = wallet - CAST($1 as NUMERIC) WHERE id = $2",
      [price, player_id]
    );

    const response = await client.query(
      "INSERT INTO player_factory(player_id, factory_id) VALUES($1, $2) RETURNING *",
      [player_id, factory_id]
    );
    await client.query("COMMIT");
    return response;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getPlayerById = async (player_id) => {
  const response = await db.query("SELECT * FROM player WHERE id = $1", [
    player_id,
  ]);
  return response.rows[0];
};

const getFactoryById = async (factory_id) => {
  const response = await db.query(
    "SELECT * FROM factory_catalog WHERE id = $1",
    [factory_id]
  );
  return response.rows[0];
};

module.exports = {
  getAllFactories,
  buyFactorys,
  getPlayerById,
  getFactoryById,
};
