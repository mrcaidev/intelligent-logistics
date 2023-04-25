import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Plus } from "react-feather";
import { EdgeCreatorForm } from "./edge-creator-form";

export function EdgeCreator() {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button colorScheme="gray" variant="dim" icon={Plus} onClick={open}>
        添加道路
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="添加道路">
        <EdgeCreatorForm onClose={close} />
      </Modal>
    </>
  );
}
