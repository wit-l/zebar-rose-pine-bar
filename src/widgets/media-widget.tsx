import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
  Show,
} from "solid-js";
import { MediaSession } from "zebar";
import { Motion } from "solid-motionone";
import { Presence } from "solid-motionone";
import { useProviders } from "../providers";
import { GroupItem } from "../group.component";

const getSessionTitle = (session: MediaSession) => {
  if (session.artist) {
    return `${session.artist} - ${session.title}`;
  }

  return session.title ?? session.sessionId;
};

const SCROLL_SPEED = 50;

function calculateDistance(
  textRef: HTMLElement,
  containerRef: HTMLElement,
): number {
  const fontSize = textRef.computedStyleMap().get("font-size") as
    | CSSKeywordValue
    | undefined;
  const textWidth =
    textRef.getBoundingClientRect().width / 2 +
    (Number(fontSize?.value) ?? 0) / 1.1;
  const containerWidth = containerRef.getBoundingClientRect().width;
  const containersCount = textWidth / containerWidth;
  const distance = containersCount * containerWidth;

  return distance;
}

function calculateAnimation(
  textRef: HTMLElement,
  containerRef: HTMLElement,
): (string | number)[] {
  const moveTo = calculateDistance(textRef, containerRef);

  return [0, -moveTo];
}

function calculateDuration(
  textRef: HTMLElement,
  containerRef: HTMLElement,
): number {
  const travelDistance = calculateDistance(textRef, containerRef);
  const duration = travelDistance / SCROLL_SPEED;

  return duration;
}

function checkTextSize(
  textRef: HTMLElement,
  containerRef: HTMLElement,
): boolean {
  const textWidth = textRef.getBoundingClientRect().width;
  const containerWidth = containerRef.getBoundingClientRect().width;

  return textWidth > containerWidth;
}

export function MediaWidget() {
  const providers = useProviders();
  const [duration, setDuration] = createSignal(20);
  const [isMounted, setIsMounted] = createSignal(false);
  const [isTextBig, setIsTextBig] = createSignal(false);
  const title = createMemo(() => {
    if (!providers.media?.currentSession) {
      return "";
    }

    return getSessionTitle(providers.media?.currentSession);
  });

  let textRef: HTMLSpanElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  createEffect(
    on([title, isMounted], () => {
      if (!textRef || !providers.media?.currentSession || !containerRef) {
        setDuration(20);
        return;
      }

      let timeout: NodeJS.Timeout;

      if (isMounted()) {
        setDuration(calculateDuration(textRef, containerRef));
        setIsTextBig(checkTextSize(textRef, containerRef));
      } else {
        timeout = setTimeout(() => {
          setDuration(calculateDuration(textRef, containerRef));
          setIsTextBig(checkTextSize(textRef, containerRef));
        }, 500);
      }

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }),
  );

  onMount(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 500);
  });

  return (
    <Presence>
      <Show when={providers.media?.currentSession}>
        <GroupItem>
          <Motion.div
            class="whitespace-nowrap overflow-hidden text-left origin-left flex items-center gap-2"
            initial={{ fontSize: "0", opacity: 0, scale: 0 }}
            animate={{ fontSize: "inherit", opacity: 1, scale: 1 }}
            exit={{ fontSize: "0", opacity: 0, scale: 0 }}
            transition={{
              duration: 0.5,
              easing: [0.32, 0.72, 0, 1],
            }}
          >
            <Motion.button
              class="hover:text-rose-pine-gold text-2xl origin-left inline-flex items-center !leading-[1.5]"
              initial={{ fontSize: "0", opacity: 0, scale: 0 }}
              animate={{ fontSize: "1.5rem", opacity: 1, scale: 1 }}
              exit={{ fontSize: "0", opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, easing: [0.32, 0.72, 0, 1] }}
              onClick={() => {
                providers.media?.togglePlayPause({
                  sessionId: providers.media?.currentSession?.sessionId,
                });
              }}
            >
              {providers.media?.currentSession?.isPlaying ? "󰏥" : ""}
            </Motion.button>
            <Presence>
              <Show when={title() && duration()}>
                <div
                  ref={containerRef}
                  class="overflow-clip max-w-[200px] inline-flex justify-start items-center"
                  title={title()}
                >
                  <Motion.span
                    ref={textRef}
                    class="block w-fit"
                    initial={{
                      x: 0,
                    }}
                    animate={{
                      x: isTextBig()
                        ? textRef && containerRef
                          ? calculateAnimation(textRef, containerRef)
                          : ["30%", "-30%", "30%"]
                        : 0,
                    }}
                    exit={{ x: "-100%" }}
                    transition={{
                      duration: duration(),
                      repeat: Infinity,
                      easing: "linear",
                    }}
                  >
                    <Show when={isTextBig()} fallback={title()}>
                      {title()} | {title()}
                    </Show>
                  </Motion.span>
                </div>
              </Show>
            </Presence>
          </Motion.div>
        </GroupItem>
      </Show>
    </Presence>
  );
}
