const db = require("../db/index");

const sellResources = async (player_id, resource_id, quantity) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");

    const response = await client.query(
      "UPDATE player SET wallet = wallet + (rc.price * $3) FROM player_resource pr JOIN resource_catalog rc ON pr.resource_id = rc.id WHERE player.id = $1 AND pr.resource_id = $2 RETURNING wallet",
      [player_id, resource_id, quantity]
    );
    await client.query(
      "UPDATE resource_catalog rc SET total_sold = total_sold + $2, last_change = now() WHERE rc.id = $1",
      [resource_id, quantity]
    );
    await client.query(           
      "UPDATE player_resource SET quantity = quantity - $3 WHERE player_id = $1 AND resource_id = $2 AND quantity >= $3",
      [player_id, resource_id, quantity]
    );

    await client.query(
      "UPDATE resource_catalog  SET price = price * POWER(0.9, FLOOR(total_sold / 100)),      last_change = now(),     total_sold = total_sold % 100 WHERE total_sold >= 100;"
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

const getPlayerFactory = async (player_id) => {
  const response = await db.query(
    `SELECT fc.id, fc.name factory_name, rc.name output_resource, fc.output_quantity FROM player_factory pf
     JOIN factory_catalog fc ON fc.id = pf.factory_id
     JOIN resource_catalog rc ON rc.id = fc.output_resource
     WHERE player_id = $1`,
    [player_id]
  );
  return response;
};

module.exports = {
  sellResources,
  getPlayerFactory,
};
