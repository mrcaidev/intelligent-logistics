import "@unocss/reset/tailwind.css";
import { Canvas, CanvasContainer } from "components/canvas";
import { GoodManager } from "components/good";
import { GraphManager } from "components/graph-manager";
import { Sidebar } from "components/sidebar";
import { TabPanel, Tabs } from "components/tabs";
import { GlobalStateProvider } from "contexts/global-state";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { fetcher } from "utils/fetch";
import "virtual:uno.css";

export function App() {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => toast.error(error.message),
      }}
    >
      <GlobalStateProvider>
        <CanvasContainer>
          <Canvas />
        </CanvasContainer>
        <Sidebar>
          <Tabs names={["方案", "物品"]}>
            <TabPanel name="方案">
              <GraphManager />
            </TabPanel>
            <TabPanel name="物品">
              <GoodManager />
            </TabPanel>
          </Tabs>
        </Sidebar>
      </GlobalStateProvider>
      <ToastContainer autoClose={3000} position="top-center" theme="colored" />
    </SWRConfig>
  );
}
