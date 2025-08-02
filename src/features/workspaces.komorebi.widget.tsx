import { createMemo, Index, Show } from "solid-js";
import { GroupItem } from "@components/group.component";
import { shellExec } from "zebar";
import { useProviders } from "@providers/index";

export function WorkspacesKomorebiWidget() {
  const providers = useProviders();
  const focusWrokspace = async (monitorIndex: number, index: number) => {
    await shellExec("komorebic", [
      "focus-monitor-workspace",
      monitorIndex.toString(),
      index.toString(),
    ]);
  };

  const currentMonitorWorkspace = createMemo(() => {
    return providers.komorebi?.currentMonitor.workspaces[
      providers.komorebi?.currentMonitor.focusedWorkspaceIndex
    ];
  });

  return (
    <GroupItem class="overflow-visible">
      <Index each={providers.komorebi?.currentMonitor.workspaces}>
        {(workspace) => (
          <Show
            when={
              workspace().tilingContainers.length > 0 ||
              workspace().floatingWindows.length > 0 ||
              workspace().maximizedWindow ||
              workspace().monocleContainer ||
              workspace() === currentMonitorWorkspace()
            }
          >
            <button
              class="transition-all h-[90%] rounded-[0.25rem] overflow-hidden hover:scale-105 hover:border-rose-pine-gold border-solid border-t-1 border-transparent inline-flex items-center justify-center"
              classList={{
                "text-rose-pine-gold font-bold":
                  workspace() === currentMonitorWorkspace(),
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
                when={workspace() === currentMonitorWorkspace()}
                fallback={workspace().name?.split(" ")[0]}
              >
                {workspace().name?.split(" ")?.[1] ?? workspace().name}
              </Show>
            </button>
          </Show>
        )}
      </Index>
    </GroupItem>
  );
}
