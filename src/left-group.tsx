import { createMemo, Index, Match, Show, Switch } from "solid-js";
import { Group, GroupItem } from "./group.component";
import { shellExec } from "zebar";
import { MediaWidget } from "./widgets/media-widget";
import { useProviders } from "./providers";

export function LeftGroup() {
  const providers = useProviders();
  const layout = createMemo(
    () =>
      providers.komorebi?.currentMonitor.workspaces[
        providers.komorebi.currentMonitor.focusedWorkspaceIndex
      ]?.layout,
  );

  const focusWrokspace = async (monitorIndex: number, index: number) => {
    await shellExec("komorebic", [
      "focus-monitor-workspace",
      monitorIndex.toString(),
      index.toString(),
    ]);
  };

  return (
    <Group class="justify-self-start justify-start">
      <GroupItem class="overflow-visible">
        <Index each={providers.komorebi?.currentMonitor.workspaces}>
          {(workspace) => (
            <Show
              when={
                workspace().tilingContainers.length > 0 ||
                workspace().floatingWindows.length > 0 ||
                workspace().maximizedWindow ||
                workspace().monocleContainer ||
                workspace() ===
                  providers.komorebi?.currentMonitor.workspaces[
                    providers.komorebi?.currentMonitor.focusedWorkspaceIndex
                  ]
              }
            >
              <button
                class="transition-all h-[90%] rounded-[0.25rem] overflow-hidden hover:scale-105 hover:border-rose-pine-gold border-solid border-t-1 border-transparent inline-flex items-center justify-center"
                classList={{
                  "text-rose-pine-gold font-bold":
                    workspace() ===
                    providers.komorebi?.currentMonitor.workspaces[
                      providers.komorebi?.currentMonitor.focusedWorkspaceIndex
                    ],
                  "!text-[1.5rem] !mt-[1px] px-2":
                    workspace() !==
                    providers.komorebi?.currentMonitor.workspaces[
                      providers.komorebi?.currentMonitor.focusedWorkspaceIndex
                    ],
                }}
                onClick={() =>
                  focusWrokspace(
                    providers.komorebi?.allMonitors.indexOf(
                      providers.komorebi?.currentMonitor,
                    ) ?? 0,
                    providers.komorebi?.currentMonitor.workspaces.indexOf(
                      workspace(),
                    ) ?? 0,
                  )
                }
              >
                <Show
                  when={
                    workspace() ===
                    providers.komorebi?.currentMonitor.workspaces[
                      providers.komorebi?.currentMonitor.focusedWorkspaceIndex
                    ]
                  }
                  fallback={workspace().name?.split(" ")[0]}
                >
                  {workspace().name?.split(" ")?.[1] ?? workspace().name}
                </Show>
              </button>
            </Show>
          )}
        </Index>
      </GroupItem>

      <GroupItem class="font-bold overflow-hidden">
        <Switch fallback={layout()}>
          <Match when={layout() === "bsp"}>[\\]</Match>
          <Match when={layout() === "vertical_stack"}>[V]=</Match>
          <Match when={layout() === "horizontal_stack"}>[H]=</Match>
          <Match when={layout() === "ultrawide_vertical_stack"}>||=</Match>
          <Match when={layout() === "rows"}>[==]</Match>
          <Match when={layout() === "grid"}>[]</Match>
          <Match when={layout() === "custom"}>Custom</Match>
        </Switch>
      </GroupItem>
      <MediaWidget />
    </Group>
  );
}
