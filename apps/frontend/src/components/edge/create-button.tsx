import { Button } from "components/form";
import { Modal } from "components/modal";
import { useGlobalState } from "contexts/global-state";
import { useBoolean } from "hooks/use-boolean";
import { Plus } from "react-feather";
import { CreateEdgeForm } from "./create-form";

export function CreateEdgeButton() {
  const { currentGraphId } = useGlobalState();
  const { value: isOpen, on: open, off: close } = useBoolean();

  if (!currentGraphId) {
    return null;
  }

  return (
    <>
      <Button colorScheme="gray" variant="dim" icon={Plus} onClick={open}>
        添加道路
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="添加道路">
        <CreateEdgeForm onClose={close} />
      </Modal>
    </>
  );
}
