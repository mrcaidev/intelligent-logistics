import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Edit } from "react-feather";
import { Graph } from "shared-types";
import { GraphUpdaterForm } from "./updater-form";

type Props = {
  graph: Graph;
};

export function GraphUpdater({ graph }: Props) {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button
        colorScheme="gray"
        variant="link"
        size="small"
        icon={Edit}
        onClick={open}
      >
        <span className="sr-only">修改方案</span>
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="修改方案">
        <GraphUpdaterForm graph={graph} onClose={close} />
      </Modal>
    </>
  );
}
