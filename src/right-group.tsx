import { ClassNameValue } from "tailwind-merge";
import { Group, GroupItem } from "./group.component";
import { useProviders } from "./providers";

export function RightGroup() {
  const providers = useProviders();

  return (
    <Group class="justify-self-end justify-end">
      <GroupItem>
        <i class="text-2xl text-rose-pine-rose"></i>
        {Math.round(providers.cpu?.usage || 0).toLocaleString(undefined, {})}%
        <i class="text-2xl text-rose-pine-pine"></i>
        {Math.round(providers.memory?.usage || 0).toLocaleString(undefined, {})}
        %
        <i
          class="text-2xl transition-colors"
          classList={{
            "text-rose-pine-foam":
              providers.weather?.celsiusTemp !== undefined &&
              providers.weather?.celsiusTemp <= -20,

            "text-rose-pine-pine":
              providers.weather?.celsiusTemp !== undefined &&
              providers.weather?.celsiusTemp <= -10,

            "text-rose-pine-iris":
              providers.weather?.celsiusTemp !== undefined &&
              providers.weather?.celsiusTemp <= 5,

            "text-rose-pine-rose":
              providers.weather?.celsiusTemp !== undefined &&
              providers.weather?.celsiusTemp <= 10,

            "text-rose-pine-gold":
              providers.weather?.celsiusTemp !== undefined &&
              providers.weather?.celsiusTemp <= 25,

            "text-rose-pine-love":
              providers.weather?.celsiusTemp !== undefined &&
              providers.weather?.celsiusTemp >= 25,
          }}
        >
          󰖙
        </i>
        {Math.round(providers.weather?.celsiusTemp ?? 0)}°
      </GroupItem>
      <GroupItem>{providers.keyboard?.layout.split("-")[0]}</GroupItem>
      <GroupItem>{providers.date?.formatted}</GroupItem>
    </Group>
  );
}
