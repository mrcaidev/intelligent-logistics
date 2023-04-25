import { Button } from "components/form";
import { useGraphs } from "hooks/use-graphs";
import { Loader } from "react-feather";
import { GraphCard } from "./card";

type Props = {
  openForm: () => void;
};

export function GraphList({ openForm }: Props) {
  const { graphs, isLoading } = useGraphs();

  if (isLoading) {
    return (
      <div className="grow grid place-items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!graphs || graphs.length === 0) {
    return (
      <div className="grow grid place-items-center">
        <p className="text-gray-600">
          还没有方案！要
          <Button variant="link" onClick={openForm}>
            添加一个
          </Button>
          吗？
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-1 grow p-4 mx-0.5 overflow-auto scrollbar scrollbar-rounded scrollbar-track-color-transparent scrollbar-thumb-color-gray-400">
      {graphs.map((graph) => (
        <li key={graph.id}>
          <GraphCard {...graph} />
        </li>
      ))}
    </ul>
  );
}
