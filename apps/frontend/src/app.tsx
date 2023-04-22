import { GoodQueue } from "components/good";
import { Sidebar } from "components/sidebar";

export function App() {
  return (
    <main className="h-screen">
      <div>Graph</div>
      <Sidebar>
        <GoodQueue />
      </Sidebar>
    </main>
  );
}
