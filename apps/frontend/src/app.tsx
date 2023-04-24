import "@unocss/reset/tailwind.css";
import { GoodScheduler } from "components/good-scheduler";
import {
  Graph,
  GraphCreator,
  GraphProvider,
  GraphSelector,
} from "components/graph";
import { Sidebar } from "components/sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SWRConfig } from "swr";
import { fetcher } from "utils/fetch";
import "virtual:uno.css";

export function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <GraphProvider>
        <main className="relative h-screen sm:pr-90">
          <div className="flex items-stretch gap-2 fixed left-6 top-6 z-10">
            <GraphSelector />
            <GraphCreator />
          </div>
          <Graph />
        </main>
        <Sidebar>
          <GoodScheduler />
        </Sidebar>
      </GraphProvider>
      <ToastContainer autoClose={3000} position="top-center" theme="colored" />
    </SWRConfig>
  );
}
