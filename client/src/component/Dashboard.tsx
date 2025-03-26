import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PlayerFinder from "../../API/PlayerFinder";
import InventoryFinder from "../../API/InventoryFinder";

interface Factory {
  id: string;
  factory_name: string;
  output_resource: string;
  output_quantity: number;
}

interface Player {
  name: string;
  wallet: number;
}

export default function Dashboard() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [factories, setFactories] = useState<Factory[]>([]);

  const fetchPlayer = async () => {
    try {
      const playerRes = await PlayerFinder.get<Player[]>("/player");
      console.log("Player Data:", playerRes.data); // Debugging log

      setPlayer(playerRes.data[0]);
    } catch (error: any) {
      console.error("Failed to fetch player:", error.message);
    }
  };

  const fetchFactories = async () => {
    try {
      const factoryRes = await InventoryFinder.get<Factory[]>(
        "/player/factory"
      );
      console.log("Factory Data:", factoryRes.data); 

      setFactories(factoryRes.data);
    } catch (error: any) {
      console.error("Failed to fetch factories:", error.message);
    }
  };

  useEffect(() => {
    fetchPlayer();
    fetchFactories();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome{" "}
        <span className="text-green-600">{player?.name || "Unknown"}</span>
      </h1>

      {player ? (
        <Card>
          <CardContent className="p-4">
            <p className="text-lg">💰 Wallet: ${player.wallet}</p>
          </CardContent>
        </Card>
      ) : (
        <p>Loading player data...</p>
      )}

      <h2 className="text-xl font-bold mt-6">Your Factories</h2>

      {factories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {factories.map((factory) => (
            <Card key={factory.id}>
              <CardContent className="p-4">
                <p className="font-bold">{factory.factory_name}</p>
                <p>
                  Produces: {factory.output_quantity} {factory.output_resource}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No factories found.</p>
      )}
    </div>
  );
}
