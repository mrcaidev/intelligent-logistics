import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Plus } from "react-feather";
import { NodeCreatorForm } from "./node-creator-form";

export function NodeCreator() {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button colorScheme="gray" variant="dim" icon={Plus} onClick={open}>
        添加节点
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="添加节点">
        <NodeCreatorForm onClose={close} />
      </Modal>
    </>
  );
}
