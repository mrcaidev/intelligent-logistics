import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Edit } from "react-feather";
import { EdgeUpdaterForm } from "./edge-updater-form";

type Props = {
  id: string;
};

export function EdgeUpdater({ id }: Props) {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button colorScheme="teal" icon={Edit} onClick={open}>
        修改道路
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="修改道路">
        <EdgeUpdaterForm id={id} onClose={close} />
      </Modal>
    </>
  );
}
