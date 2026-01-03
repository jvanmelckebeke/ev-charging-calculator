import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Lightning, Warning, Clock, Battery } from '@phosphor-icons/react';

const TARGET_PRESETS = [
  { value: '80', label: '80%' },
  { value: '100', label: '100%' },
  { value: 'custom', label: 'Custom' },
];

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

  const handleCurrentPercentChange = (value: string) => {
    const num = parseInt(value) || 0;
    setCurrentPercent(Math.max(0, Math.min(100, num)));
  };

  const handleCustomTargetChange = (value: string) => {
    const num = parseInt(value) || 0;
    setCustomTarget(Math.max(0, Math.min(100, num)));
  };

  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Battery className="size-5" weight="fill" />
            Vehicle & Battery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger id="vehicle" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} ({v.batteryCapacity} kWh)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current">Current Battery Level</Label>
            <div className="flex items-center gap-2">
              <Input
                id="current"
                type="number"
                min={0}
                max={100}
                value={currentPercent}
                onChange={(e) => handleCurrentPercentChange(e.target.value)}
                className="w-24"
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-5" weight="fill" />
            Target & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Battery Level</Label>
            <div className="flex flex-wrap gap-2">
              {TARGET_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={targetPreset === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTargetPreset(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {targetPreset === 'custom' && (
              <div className="flex items-center gap-2 pt-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={customTarget}
                  onChange={(e) => handleCustomTargetChange(e.target.value)}
                  className="w-24"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="departure">Departure Time</Label>
            <Input
              id="departure"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>

      {currentPercent >= targetPercent && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Your battery is already at or above {targetPercent}%
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Card className={result.isAchievable ? 'border-primary/50' : 'border-destructive/50'}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightning className="size-5" weight="fill" />
                Recommended Charging Speed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {result.clampedSpeed} kW
                </div>
                {!result.isAchievable && (
                  <Badge variant="destructive" className="mt-2">
                    <Warning className="mr-1 size-3" />
                    Max speed required
                  </Badge>
                )}
              </div>

              {result.warning && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    result.isAchievable
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {result.warning}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Energy needed</div>
                  <div className="font-medium">{result.energyNeeded} kWh</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Charging time</div>
                  <div className="font-medium">
                    {result.chargingDuration.toFixed(1)} hours
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Final battery</div>
                  <div className="font-medium">{result.predictedPercent}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Efficiency</div>
                  <div className="font-medium">
                    {Math.round(settings.efficiency * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Charging Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ChargingChart
                data={result.chartData}
                targetPercent={targetPercent}
                isAchievable={result.isAchievable}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
