import { ParentComponent } from "solid-js";
import { Motion } from "solid-motionone";
import { ClassNameValue, twMerge } from "tailwind-merge";

export type GroupProps = {
  class?: ClassNameValue;
  classList?: Record<string, boolean>;
  onClick?: () => void;
};

export const Group: ParentComponent<GroupProps> = (props) => {
  return (
    <Motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, easing: [0.32, 0.72, 0, 1] }}
      translate="yes"
      class={twMerge(
        "h-[32px] max-h-[32px] flex flex-row justify-center items-center gap-3 bg-rose-pine-base text-rose-pine-text border-rose-pine-highlight-high border-[2px] w-fit rounded-[1.5rem] border-solid py-0 px-[1.2rem]",
        "hover:border-rose-pine-gold transition-colors",
        props.class,
      )}
      classList={props.classList}
      onClick={props.onClick}
    >
      {props.children}
    </Motion.div>
  );
};

export const GroupItem: ParentComponent<GroupProps> = (props) => {
  return (
    <div
      class={twMerge(
        "transition-transform h-full inline-flex items-center gap-2 text-ellipsis overflow-hidden whitespace-nowrap",
        props.class,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};
