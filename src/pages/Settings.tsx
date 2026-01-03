import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-settings';
import { Sun, Moon, Desktop } from '@phosphor-icons/react';

const DARK_MODE_OPTIONS = [
  { value: 'system', label: 'System', icon: Desktop },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const;

export function Settings() {
  const { settings, updateSettings } = useSettings();

  const efficiencyPercent = Math.round(settings.efficiency * 100);

  const handleEfficiencyChange = (values: number[]) => {
    updateSettings({ efficiency: values[0] / 100 });
  };

  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Charging Efficiency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Account for energy loss during charging. Typical home chargers are 85-95% efficient.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Efficiency</Label>
              <span className="text-lg font-semibold text-primary">{efficiencyPercent}%</span>
            </div>
            <Slider
              value={[efficiencyPercent]}
              onValueChange={handleEfficiencyChange}
              min={80}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>80%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {DARK_MODE_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={settings.darkMode === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ darkMode: option.value })}
                    className="flex-1"
                  >
                    <Icon className="mr-1.5 size-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            EV Charging Calculator helps you determine the optimal charging speed for your home
            charger based on your departure time and desired battery level.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Version 1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
}
