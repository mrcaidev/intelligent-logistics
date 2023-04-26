import { Button } from "components/form";
import { useGlobalState } from "contexts/global-state";

export function Ready() {
  const { dispatch } = useGlobalState();

  return (
    <div className="grid place-items-center h-full">
      <p className="text-gray-600">
        请
        <Button
          variant="link"
          onClick={() => dispatch({ type: "OPEN_SIDEBAR" })}
        >
          选择一种方案
        </Button>
        以开始
      </p>
    </div>
  );
}
