import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Edit } from "react-feather";
import { UpdateNodeForm } from "./update-form";

type Props = {
  id: string;
};

export function UpdateNodeButton({ id }: Props) {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button icon={Edit} onClick={open}>
        修改节点
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="修改节点">
        <UpdateNodeForm id={id} onClose={close} />
      </Modal>
    </>
  );
}
