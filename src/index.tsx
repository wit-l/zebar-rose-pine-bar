/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { RightGroup } from "./right-group";
import { LeftGroup } from "./left-group";
import { CenterGroup } from "./center-group";
import { ProvidersProvider } from "./providers";
// import { createSnow, showSnow } from "pure-snow.js";
//
// createSnow();
// showSnow(true);

render(() => <App />, document.getElementById("root")!);

function App() {
  return (
    <ProvidersProvider>
      <div class="h-full grid grid-cols-3 px-[16px] items-end">
        <LeftGroup />
        <CenterGroup />
        <RightGroup />
      </div>
    </ProvidersProvider>
  );
}
