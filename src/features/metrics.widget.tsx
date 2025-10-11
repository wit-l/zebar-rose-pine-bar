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
} from "solid-js";
import { useMotionValue } from "@/motion/hooks";
import {
  FaSolidBatteryFull,
  FaSolidBatteryThreeQuarters,
  FaSolidBatteryHalf,
  FaSolidBatteryQuarter,
  FaSolidBatteryEmpty,
  FaSolidMemory,
  FaSolidSun,
} from "solid-icons/fa";
import { BsLightningCharge } from "solid-icons/bs";
import { RiDeviceCpuLine } from "solid-icons/ri";
import { Dynamic } from "solid-js/web";

const batterIconsOpts = (chargePercent: number) => {
  if (chargePercent >= 80) return FaSolidBatteryFull;
  if (chargePercent >= 60) return FaSolidBatteryThreeQuarters;
  if (chargePercent >= 40) return FaSolidBatteryHalf;
  if (chargePercent >= 20) return FaSolidBatteryQuarter;
  return FaSolidBatteryEmpty;
};

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
  const weather = useMotionValue(0);
  const battery = useMotionValue(0);
  const [isCharging, setIsCharging] = createSignal(false);

  createEffect(() => {
    setIsCharging(providers.battery?.isCharging || false);
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
      weather.raw,
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
        <FaSolidSun
          class="w-3.5 h-3.5 transition-colors"
          classList={{
            "text-rose-pine-foam": weather.get() <= -20,

            "text-rose-pine-pine": weather.get() <= -10,

            "text-rose-pine-iris": weather.get() <= 5,

            "text-rose-pine-rose": weather.get() <= 14,

            "text-rose-pine-gold": weather.get() <= 25,

            "text-rose-pine-love": weather.get() >= 25,
          }}
        />
        {Math.round(weather.get())}°
      </Metric>
      <Metric>
        {isCharging() && <BsLightningCharge />}
        <Dynamic
          component={batterIconsOpts(battery.get())}
          class="w-4 h-4 transition-colors"
        />
        {Math.round(battery.get())}%
      </Metric>
    </GroupItem>
  );
}
