export interface Vehicle {
  id: string;
  name: string;
  /** kWh */
  batteryCapacity: number;
}

export const vehicles: Vehicle[] = [
  {
    id: 'ev6',
    name: 'Kia EV6',
    batteryCapacity: 77,
  },
  {
    id: 'id-buzz',
    name: 'VW ID. Buzz',
    batteryCapacity: 79,
  },
];

export const chargerConfig = {
  /** kW */
  minSpeed: 1.4,
  /** kW */
  maxSpeed: 7.4,
} as const;

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}
