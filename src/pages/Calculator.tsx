import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vehicles } from '@/config/vehicles';
import {
  calculateCharging,
  getDefaultDepartureTime,
  parseTimeInput,
} from '@/lib/charging-calculator';
import { useSettings } from '@/hooks/use-settings';
import { ChargingChart } from '@/components/chart/ChargingChart';
import { Lightning, Warning, Clock, BatteryCharging, CarSimple } from '@phosphor-icons/react';
import { SiVolkswagen, SiKia } from 'react-icons/si';

const TARGET_OPTIONS = [
  { value: '80', label: '80%' },
  { value: '90', label: '90%' },
  { value: '100', label: '100%' },
  { value: 'custom', label: 'Custom' },
];

const VEHICLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'ev6': SiKia,
  'id-buzz': SiVolkswagen,
};

export function Calculator() {
  const { settings } = useSettings();
  const [vehicleId, setVehicleId] = useState(vehicles[0].id);
  const [currentPercent, setCurrentPercent] = useState(20);
  const [targetPreset, setTargetPreset] = useState('80');
  const [customTarget, setCustomTarget] = useState(90);
  const [departureTime, setDepartureTime] = useState(getDefaultDepartureTime);

  const targetPercent = targetPreset === 'custom' ? customTarget : parseInt(targetPreset);

  const result = useMemo(() => {
    if (currentPercent >= targetPercent) return null;

    return calculateCharging({
      vehicleId,
      currentPercent,
      targetPercent,
      departureTime: parseTimeInput(departureTime),
      efficiency: settings.efficiency,
    });
  }, [vehicleId, currentPercent, targetPercent, departureTime, settings.efficiency]);

  const handleCurrentPercentChange = (values: number[]) => {
    setCurrentPercent(values[0]);
  };



  return (
    <div className="space-y-8 pt-6 pb-8">
      <section className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <CarSimple className="size-4" weight="fill" />
          Vehicle
        </Label>
        <div className="flex gap-3">
          {vehicles.map((vehicle) => {
            const Icon = VEHICLE_ICONS[vehicle.id];
            const isSelected = vehicleId === vehicle.id;

            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => setVehicleId(vehicle.id)}
                className={`
                  group relative flex flex-1 flex-col items-center gap-2 rounded-xl p-4
                  transition-all duration-200 ease-out
                  ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                {Icon && (
                  <Icon
                    className={`size-8 transition-transform duration-200 ${
                      isSelected ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                )}
                <div className="text-center">
                  <div className={`text-sm font-semibold ${isSelected ? '' : 'text-foreground'}`}>
                    {vehicle.name}
                  </div>
                  <div className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {vehicle.batteryCapacity} kWh
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BatteryCharging className="size-4" weight="fill" />
            Current Battery Level
          </Label>
          <span className="text-2xl font-bold tabular-nums text-primary">
            {currentPercent}%
          </span>
        </div>
        <Slider
          value={[currentPercent]}
          onValueChange={handleCurrentPercentChange}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lightning className="size-4" weight="fill" />
          Target Battery Level
        </Label>
        <div className="flex items-center gap-3">
          <Select value={targetPreset} onValueChange={setTargetPreset}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TARGET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {targetPreset === 'custom' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Custom target</span>
              <span className="text-2xl font-bold tabular-nums text-primary">
                {customTarget}%
              </span>
            </div>
            <Slider
              value={[customTarget]}
              onValueChange={(values) => setCustomTarget(values[0])}
              min={50}
              max={100}
              step={1}
            />
            <div className="relative h-4 text-xs text-muted-foreground mx-2">
              <span className="absolute left-0 -translate-x-1/2">50%</span>
              <span className="absolute left-[60%] -translate-x-1/2 font-medium">80%</span>
              <span className="absolute left-[80%] -translate-x-1/2 font-medium">90%</span>
              <span className="absolute right-0 translate-x-1/2">100%</span>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <Label htmlFor="departure" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="size-4" weight="fill" />
          Departure Time
        </Label>
        <Input
          id="departure"
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="w-32"
        />
      </section>

      <div className="h-px bg-border" />

      {currentPercent >= targetPercent && (
        <section className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
          <p className="text-muted-foreground">
            Your battery is already at or above {targetPercent}%
          </p>
        </section>
      )}

      {result && (
        <section className="space-y-6">
          <div
            className={`rounded-xl p-6 ${
              result.isAchievable
                ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20'
                : 'bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border border-destructive/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <Lightning className="size-4" weight="fill" />
                  Recommended Speed
                </h3>
                <div className="text-5xl font-bold tracking-tight text-primary">
                  {result.clampedSpeed}
                  <span className="text-2xl font-medium text-muted-foreground ml-1">kW</span>
                </div>
              </div>
              {!result.isAchievable && (
                <Badge variant="destructive" className="shrink-0">
                  <Warning className="mr-1 size-3" />
                  Max speed required
                </Badge>
              )}
            </div>

            {result.warning && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  result.isAchievable
                    ? 'bg-muted/50 text-muted-foreground'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {result.warning}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground mb-1">Energy needed</div>
              <div className="text-xl font-semibold">{result.energyNeeded} kWh</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground mb-1">Charging time</div>
              <div className="text-xl font-semibold">{result.chargingDuration.toFixed(1)} hrs</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground mb-1">Final battery</div>
              <div className="text-xl font-semibold">{result.predictedPercent}%</div>
            </div>
            <div className="rounded-xl bg-muted/30 p-4">
              <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
              <div className="text-xl font-semibold">{Math.round(settings.efficiency * 100)}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Charging Progress</h3>
            <div className="rounded-xl bg-muted/20 p-4 border border-border/50">
              <ChargingChart
                data={result.chartData}
                targetPercent={targetPercent}
                isAchievable={result.isAchievable}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
