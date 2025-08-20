import { useProviders } from "@providers/index";
import { GroupItem } from "@components/group.component";
import {
  animate,
  AnimationPlaybackControlsWithThen,
  MotionValue,
} from "motion";
import { Accessor, createEffect, createMemo, EffectFunction } from "solid-js";
import { useMotionValue } from "@/motion/hooks";

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
      autoplay: Boolean(!prev),
    });

    if (prev) {
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

  return (
    <GroupItem>
      <i class="text-2xl text-rose-pine-rose"></i>
      {Math.round(cpuUsage.get()).toLocaleString(undefined, {})}%
      <i class="text-2xl text-rose-pine-pine"></i>
      {Math.round(memoryUsage.get()).toLocaleString(undefined, {})}%
      <i
        class="text-2xl transition-colors"
        classList={{
          "text-rose-pine-foam": weather.get() <= -20,

          "text-rose-pine-pine": weather.get() <= -10,

          "text-rose-pine-iris": weather.get() <= 5,

          "text-rose-pine-rose": weather.get() <= 10,

          "text-rose-pine-gold": weather.get() <= 25,

          "text-rose-pine-love": weather.get() >= 25,
        }}
      >
        󰖙
      </i>
      {Math.round(weather.get())}°
    </GroupItem>
  );
}
