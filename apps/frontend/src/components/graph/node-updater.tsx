import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Edit } from "react-feather";
import { NodeUpdaterForm } from "./node-updater-form";

type Props = {
  id: string;
};

export function NodeUpdater({ id }: Props) {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button colorScheme="teal" icon={Edit} onClick={open}>
        修改节点
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="修改节点">
        <NodeUpdaterForm id={id} onClose={close} />
      </Modal>
    </>
  );
}
