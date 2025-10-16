import { useProviders } from "@providers/index";
import { GroupItem } from "@components/group.component";
import {
  animate,
  AnimationPlaybackControlsWithThen,
  MotionValue,
} from "motion";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  EffectFunction,
  ParentProps,
  Show,
} from "solid-js";
import { useMotionValue } from "@/motion/hooks";
import {
  FaSolidBatteryFull,
  FaSolidBatteryThreeQuarters,
  FaSolidBatteryHalf,
  FaSolidBatteryQuarter,
  FaSolidBatteryEmpty,
  FaSolidMemory,
} from "solid-icons/fa";
import {
  WiDayCloudy,
  WiDayLightning,
  WiDayRain,
  WiDaySnow,
  WiDaySprinkle,
  WiDaySunny,
  WiNightAltCloudy,
  WiNightAltLightning,
  WiNightAltRain,
  WiNightAltSnow,
  WiNightAltSprinkle,
  WiNightClear,
} from "solid-icons/wi";
import { BsLightningCharge } from "solid-icons/bs";
import { RiDeviceCpuLine } from "solid-icons/ri";
import { Dynamic } from "solid-js/web";
import { WeatherStatus } from "zebar";

function batterIconsOpts(chargePercent: number) {
  if (chargePercent >= 80) return FaSolidBatteryFull;
  if (chargePercent >= 60) return FaSolidBatteryThreeQuarters;
  if (chargePercent >= 40) return FaSolidBatteryHalf;
  if (chargePercent >= 20) return FaSolidBatteryQuarter;
  return FaSolidBatteryEmpty;
}

function weatherIconsOpts(weatherStatus: WeatherStatus) {
  switch (weatherStatus) {
    case "clear_day":
      return WiDaySunny;
    case "clear_night":
      return WiNightClear;
    case "cloudy_day":
      return WiDayCloudy;
    case "cloudy_night":
      return WiNightAltCloudy;
    case "light_rain_day":
      return WiDaySprinkle;
    case "light_rain_night":
      return WiNightAltSprinkle;
    case "heavy_rain_day":
      return WiDayRain;
    case "heavy_rain_night":
      return WiNightAltRain;
    case "snow_day":
      return WiDaySnow;
    case "snow_night":
      return WiNightAltSnow;
    case "thunder_day":
      return WiDayLightning;
    case "thunder_night":
      return WiNightAltLightning;
  }
}

function getWeatherClass(temperature: number) {
  const prefix = "text-rose-pine-";
  let suffix = "";
  if (temperature >= 25) suffix = "love";
  else if (temperature >= 15) suffix = "gold";
  else if (temperature >= 5) suffix = "rose";
  else if (temperature >= -10) suffix = "iris";
  else if (temperature >= -20) suffix = "pine";
  else suffix = "foam";
  const className = prefix + suffix;
  return className;
}

function Metric(props: ParentProps) {
  return (
    <span class="flex items-center justify-center gap-1">{props.children}</span>
  );
}

function metricsAnimation(
  rawMotionValue: MotionValue<number>,
  metric: Accessor<number | undefined>,
): EffectFunction<
  AnimationPlaybackControlsWithThen | undefined,
  AnimationPlaybackControlsWithThen
> {
  return (prev) => {
    const control = animate(rawMotionValue, metric() || 0, {
      duration: 1,
      ease: "circOut",
      autoplay: Boolean(!prev || prev.state === "finished"),
    });

    if (prev && prev.state === "running") {
      prev?.then(() => {
        control.play();
      });
    }

    return control;
  };
}

export function MetricsWidget() {
  const providers = useProviders();
  const cpuUsage = useMotionValue(0);
  const memoryUsage = useMotionValue(0);
  const temperature = useMotionValue(0);
  const battery = useMotionValue(0);
  const [isCharging, setIsCharging] = createSignal(false);
  const [weatherStatus, setWeatherStatus] =
    createSignal<WeatherStatus>("clear_day");

  createEffect(() => {
    setIsCharging(providers.battery?.isCharging || false);
  });

  createEffect(() => {
    setWeatherStatus(providers.weather?.status || "clear_day");
  });

  createEffect(
    metricsAnimation(
      cpuUsage.raw,
      createMemo(() => {
        const usage = providers.cpu?.usage;
        return usage;
      }),
    ),
  );

  createEffect(
    metricsAnimation(
      memoryUsage.raw,
      createMemo(() => {
        const usage = providers.memory?.usage;
        return usage;
      }),
    ),
  );

  createEffect(
    metricsAnimation(
      temperature.raw,
      createMemo(() => {
        const usage = providers.weather?.celsiusTemp;
        return usage;
      }),
    ),
  );

  createEffect(
    metricsAnimation(
      battery.raw,
      createMemo(() => {
        const chargePercent = providers.battery?.chargePercent;
        return chargePercent;
      }),
    ),
  );

  return (
    <GroupItem class="justify-end">
      <Metric>
        <RiDeviceCpuLine class="w-4 h-4 text-rose-pine-rose" />
        {Math.round(cpuUsage.get()).toLocaleString(undefined, {})}%
      </Metric>
      <Metric>
        <FaSolidMemory class="w-4 h-4 text-rose-pine-pine" />
        {Math.round(memoryUsage.get()).toLocaleString(undefined, {})}%
      </Metric>
      <Metric>
        <Dynamic
          component={weatherIconsOpts(weatherStatus())}
          class={
            "w-5 h-5 transition-colors " + getWeatherClass(temperature.get())
          }
        />
        {Math.round(temperature.get()).toLocaleString(undefined, {})}°
      </Metric>
      <Metric>
        <Show when={isCharging()}>
          <BsLightningCharge />
        </Show>
        <Dynamic
          component={batterIconsOpts(battery.get())}
          class="w-5 h-5 transition-colors"
        />
        {Math.round(battery.get()).toLocaleString(undefined, {})}%
      </Metric>
    </GroupItem>
  );
}
