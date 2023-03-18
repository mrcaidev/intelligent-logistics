import { Good } from "components/goods";
import { Sidebar } from "components/sidebar";

export const App = () => {
  return (
    <main className="h-screen bg-gray-900 text-gray-100">
      <div>Graph</div>
      <Sidebar>
        <Good
          id="1"
          name="牛肉"
          createdAt={new Date()}
          departureNodeId="1"
          destinationNodeId="2"
          isVip={true}
          strategyId="A"
        />
      </Sidebar>
    </main>
  );
};
