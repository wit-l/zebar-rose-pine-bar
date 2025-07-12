import * as zebar from "zebar";
import { createStore } from "solid-js/store";
import { onCleanup, onMount, useContext } from "solid-js";
import { createContext, ParentProps } from "solid-js";

export const providers = zebar.createProviderGroup({
  cpu: { type: "cpu" },
  memory: { type: "memory" },
  weather: { type: "weather" },
  date: { type: "date", formatting: "t" },
  komorebi: { type: "komorebi" },
  keyboard: { type: "keyboard" },
  media: { type: "media" },
  tray: { type: "systray" },
});

export type Providers = Partial<typeof providers.outputMap>;

export const ProvidersContext = createContext(providers.outputMap);

export function useProviders() {
  return useContext(ProvidersContext);
}

export function ProvidersProvider(props: ParentProps) {
  const [output, setOutput] = createStore(providers.outputMap);

  onMount(() => {
    providers.onOutput((outputMap) => setOutput(outputMap));
  });

  onCleanup(() => {
    providers.stopAll();
  });

  return (
    <ProvidersContext.Provider value={output}>
      {props.children}
    </ProvidersContext.Provider>
  );
}
