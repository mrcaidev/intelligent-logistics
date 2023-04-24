import { Option, Select } from "components/form";
import { useGraphs } from "hooks/use-graphs";
import { useGraph } from "./context";

export function GraphSelector() {
  const { data: graphs } = useGraphs();
  const { graphId, setGraphId } = useGraph();

  return (
    <Select
      label="物流方案"
      isLabelHidden
      value={graphId}
      onChange={(e) => setGraphId(e.target.value)}
      className="min-w-50"
    >
      {graphs?.map(({ id, name }) => (
        <Option key={id} value={id}>
          {name}
        </Option>
      ))}
    </Select>
  );
}
