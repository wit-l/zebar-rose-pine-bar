import { useProviders } from "@providers/index";
import { GroupItem } from "@components/group.component";
import { animate } from "motion";
import { createEffect } from "solid-js";
import { useMotionValue } from "@/motion/hooks";

export function MetricsWidget() {
  const providers = useProviders();
  const cpuUsage = useMotionValue(0);
  const memoryUsage = useMotionValue(0);
  const weather = useMotionValue(0);

  createEffect<ReturnType<typeof animate>>((prev) => {
    prev?.stop();
    const usage = providers.cpu?.usage;
    return animate(cpuUsage.raw, usage || 0, {
      duration: 1,
      ease: "circOut",
    });
  });

  createEffect<ReturnType<typeof animate>>((prev) => {
    prev?.stop();
    const usage = providers.memory?.usage;
    return animate(memoryUsage.raw, usage || 0, {
      duration: 1,
      ease: "circOut",
    });
  });

  createEffect<ReturnType<typeof animate>>((prev) => {
    prev?.stop();
    const celsiusTemp = providers.weather?.celsiusTemp;
    return animate(weather.raw, celsiusTemp || 0, {
      duration: 1,
      ease: "circOut",
    });
  });

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
