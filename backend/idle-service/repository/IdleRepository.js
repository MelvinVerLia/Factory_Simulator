const db = require("../db/index");
const getResource = () => {
  const response = db.query(
    "WITH calculated_resource as (SELECT FLOOR(EXTRACT(EPOCH FROM (NOW() - pf.last_collected)) / fc.processing_time) * fc.output_quantity * fc.efficiency AS resource_quantity, fc.output_resource, pf.player_id 	FROM player_factory pf 	JOIN factory_catalog fc ON pf.factory_id = fc.id 	WHERE pf.player_id = '02bed726-39f3-453a-88bc-2c9b5aa7161a' AND pf.factory_id = '733a4b90-3d9c-45d3-b01f-59a8c2e4926e' ) INSERT INTO player_resource (player_id, resource_id, quantity) SELECT  	cr.player_id,  	cr.output_resource,  	cr.resource_quantity FROM calculated_resource cr ON CONFLICT (player_id, resource_id)  DO UPDATE  SET quantity = player_resource.quantity + EXCLUDED.quantity; UPDATE player_factory  SET last_collected = NOW() WHERE player_id = '02bed726-39f3-453a-88bc-2c9b5aa7161a' AND factory_id = '733a4b90-3d9c-45d3-b01f-59a8c2e4926e'"
  );

  return response;
};

module.exports = {
  getResource,
};