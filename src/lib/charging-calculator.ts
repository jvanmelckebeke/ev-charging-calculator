import { getVehicleById, chargerConfig } from '@/config/vehicles';

export interface CalculationInput {
  vehicleId: string;
  currentPercent: number;
  targetPercent: number;
  departureTime: Date;
  efficiency: number;
}

export interface ChartDataPoint {
  time: string;
  percent: number;
  timestamp: number;
}

export interface CalculationResult {
  requiredSpeed: number;
  clampedSpeed: number;
  isAchievable: boolean;
  predictedPercent: number;
  chargingDuration: number;
  chartData: ChartDataPoint[];
  warning?: string;
  energyNeeded: number;
  effectiveEnergy: number;
}

export function calculateCharging(input: CalculationInput): CalculationResult | null {
  const vehicle = getVehicleById(input.vehicleId);
  if (!vehicle) {
    return null;
  }

  const { batteryCapacity } = vehicle;
  const { currentPercent, targetPercent, departureTime, efficiency } = input;
  const { minSpeed, maxSpeed } = chargerConfig;

  const now = new Date();
  const departureDate = new Date(departureTime);

  if (departureDate <= now) {
    departureDate.setDate(departureDate.getDate() + 1);
  }

  const hoursAvailable = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  const percentNeeded = targetPercent - currentPercent;
  const energyNeeded = (batteryCapacity * percentNeeded) / 100;

  // Energy required from grid = energy to battery / efficiency (accounts for charging loss)
  const effectiveEnergy = energyNeeded / efficiency;
  const requiredSpeed = effectiveEnergy / hoursAvailable;

  let clampedSpeed = requiredSpeed;
  let isAchievable = true;
  let predictedPercent = targetPercent;
  let warning: string | undefined;

  if (requiredSpeed > maxSpeed) {
    clampedSpeed = maxSpeed;
    isAchievable = false;

    // energyDelivered = maxSpeed * hours * efficiency (energy actually stored in battery)
    const energyDelivered = maxSpeed * hoursAvailable * efficiency;
    const percentGained = (energyDelivered / batteryCapacity) * 100;
    predictedPercent = Math.min(100, currentPercent + percentGained);

    warning = `Target not achievable. At ${maxSpeed} kW, you'll reach ${Math.round(predictedPercent)}% by departure.`;
  } else if (requiredSpeed < minSpeed) {
    clampedSpeed = minSpeed;
    warning = `You have plenty of time! Setting to minimum ${minSpeed} kW will still reach your target early.`;
  }

  const actualEnergyNeeded = energyNeeded / efficiency;
  const chargingDuration = actualEnergyNeeded / clampedSpeed;

  const chartData = generateChartData(
    now,
    departureDate,
    currentPercent,
    isAchievable ? targetPercent : predictedPercent,
    clampedSpeed,
    efficiency,
    batteryCapacity
  );

  return {
    requiredSpeed: Math.round(requiredSpeed * 100) / 100,
    clampedSpeed: Math.round(clampedSpeed * 100) / 100,
    isAchievable,
    predictedPercent: Math.round(predictedPercent),
    chargingDuration: Math.round(chargingDuration * 100) / 100,
    chartData,
    warning,
    energyNeeded: Math.round(energyNeeded * 100) / 100,
    effectiveEnergy: Math.round(effectiveEnergy * 100) / 100,
  };
}

function generateChartData(
  startTime: Date,
  endTime: Date,
  startPercent: number,
  endPercent: number,
  chargingSpeed: number,
  efficiency: number,
  batteryCapacity: number
): ChartDataPoint[] {
  const points: ChartDataPoint[] = [];
  const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  const energyPerHour = chargingSpeed * efficiency;
  const percentPerHour = (energyPerHour / batteryCapacity) * 100;

  const intervalMinutes = totalHours > 12 ? 60 : 30;
  const intervalHours = intervalMinutes / 60;
  const numPoints = Math.ceil(totalHours / intervalHours) + 1;

  for (let i = 0; i < numPoints; i++) {
    const hoursFromStart = i * intervalHours;
    const pointTime = new Date(startTime.getTime() + hoursFromStart * 60 * 60 * 1000);

    if (pointTime > endTime) {
      break;
    }

    const currentPercent = Math.min(endPercent, startPercent + percentPerHour * hoursFromStart);

    points.push({
      time: formatTime(pointTime),
      percent: Math.round(currentPercent * 10) / 10,
      timestamp: pointTime.getTime(),
    });
  }

  const lastPoint = points[points.length - 1];
  if (lastPoint && lastPoint.timestamp < endTime.getTime()) {
    points.push({
      time: formatTime(endTime),
      percent: Math.round(endPercent * 10) / 10,
      timestamp: endTime.getTime(),
    });
  }

  return points;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getDefaultDepartureTime(): string {
  const now = new Date();
  const departure = new Date();
  departure.setHours(8, 0, 0, 0);

  if (now.getHours() >= 8) {
    departure.setDate(departure.getDate() + 1);
  }

  return formatTimeForInput(departure);
}

function formatTimeForInput(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function parseTimeInput(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date();
  result.setHours(hours, minutes, 0, 0);

  if (result <= new Date()) {
    result.setDate(result.getDate() + 1);
  }

  return result;
}
