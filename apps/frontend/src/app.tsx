import { GoodCreator, GoodDeliverer, GoodList } from "components/good";
import { Sidebar } from "components/sidebar";
import { ToastContainer, toast } from "react-toastify";
import { SWRConfig } from "swr";
import { fetcher } from "utils/fetch";

export function App() {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => toast.error(error.message),
      }}
    >
      <main className="h-screen">
        <div>Graph</div>
      </main>
      <Sidebar>
        <GoodList />
        <div className="grid grid-cols-2 gap-3 px-4 mt-auto">
          <GoodCreator />
          <GoodDeliverer />
        </div>
      </Sidebar>
      <ToastContainer />
    </SWRConfig>
  );
}
