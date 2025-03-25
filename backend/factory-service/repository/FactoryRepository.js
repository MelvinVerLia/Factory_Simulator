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

const checkPlayerResource = async (player_id, factory_id) => {
  const response = await db.query(
    "SELECT pr.quantity, fc.input_quantity FROM player_resource pr JOIN player_factory pf ON pf.player_id = pr.player_id JOIN factory_catalog fc ON fc.id = pf.factory_id WHERE pr.player_id = $1 AND fc.id = $2 AND pr.resource_id = fc.input_resource",
    [player_id, factory_id]
  );
  return response.rows;
};

const addQueue = async (player_id, quantity, resource_id, factory_id) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");

    await client.query(
      "UPDATE player_resource  SET quantity = quantity - $1 WHERE  player_id = $2 AND  resource_id = $3",
      [quantity, player_id, resource_id]
    );

    await client.query(
      "UPDATE player_factory  SET queue_quantity = queue_quantity + $2 WHERE factory_id = $1",
      [factory_id, quantity]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

async function processFactories() {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    // Get all factories that need processing NOW
    const factoriesToProcess = await client.query(`
      SELECT pf.id, pf.player_id, pf.factory_id, pf.queue_quantity, 
      fc.processing_time, pf.last_collected, fc.output_resource, fc.output_quantity
      FROM player_factory pf
      JOIN factory_catalog fc ON fc.id = pf.factory_id
      WHERE fc.factory_type = 'processing' 
      AND pf.queue_quantity > 0
      AND (pf.last_collected + INTERVAL '1 second' * fc.processing_time) <= NOW();
    `);

    if (factoriesToProcess.rows.length === 0) {
      console.log("No factories ready.");
      return;
    }

    // Process all factories in a single transaction
    for (const factory of factoriesToProcess.rows) {
      await client.query(
        `
        UPDATE player_factory
        SET queue_quantity = queue_quantity - 1, last_collected = now()
        WHERE id = $1;
      `,
        [factory.id]
      );

      await client.query(
        `
        INSERT INTO player_resource (player_id, resource_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (player_id, resource_id)
        DO UPDATE SET quantity = player_resource.quantity + EXCLUDED.quantity;
      `,
        [factory.player_id, factory.output_resource, factory.output_quantity]
      );
    }

    await client.query("COMMIT");

    console.log(`Processed ${factoriesToProcess.rows.length} factories.`);

    // Schedule next processing
    scheduleNextProcessing();
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing factories:", error);
  } finally {
    client.release();
  }
}

async function scheduleNextProcessing() {
  const client = await db.connect();
  try {
    // Find the soonest processing time
    const result = await client.query(`
      SELECT MIN(pf.last_collected + INTERVAL '1 second' * fc.processing_time) AS next_time
      FROM player_factory pf
      JOIN factory_catalog fc ON fc.id = pf.factory_id
      WHERE fc.factory_type = 'processing' AND pf.queue_quantity > 0;
    `);

    if (!result.rows[0].next_time) {
      console.log("No factories need processing.");
      return;
    }

    const nextProcessTime = new Date(result.rows[0].next_time);
    const now = new Date();
    const delay = Math.max(0, nextProcessTime - now);

    console.log(`Next batch processing in ${delay / 1000} seconds`);

    setTimeout(() => processFactories(), delay);
  } catch (error) {
    console.error("Error scheduling processing:", error);
  } finally {
    client.release();
  }
}

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
  checkPlayerResource,
  addQueue,
  scheduleNextProcessing,
};
