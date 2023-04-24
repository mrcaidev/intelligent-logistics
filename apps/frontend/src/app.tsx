import "@unocss/reset/tailwind.css";
import { GoodScheduler } from "components/good-scheduler";
import { Graph, GraphProvider } from "components/graph";
import { Sidebar } from "components/sidebar";
import { TabPanel, Tabs } from "components/tabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { fetcher } from "utils/fetch";
import "virtual:uno.css";

export function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <GraphProvider>
        <main className="relative h-screen">
          <Graph />
        </main>
        <Sidebar>
          <Tabs names={["物品", "方案"]}>
            <TabPanel name="物品">
              <GoodScheduler />
            </TabPanel>
            <TabPanel name="方案">Graphs</TabPanel>
          </Tabs>
        </Sidebar>
      </GraphProvider>
      <ToastContainer autoClose={3000} position="top-center" theme="colored" />
    </SWRConfig>
  );
}
