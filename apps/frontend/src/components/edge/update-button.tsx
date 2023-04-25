import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Edit } from "react-feather";
import { UpdateEdgeForm } from "./update-form";

type Props = {
  id: string;
};

export function UpdateEdgeButton({ id }: Props) {
  const { value: isOpen, on: open, off: close } = useBoolean();

  return (
    <>
      <Button icon={Edit} onClick={open}>
        修改道路
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="修改道路">
        <UpdateEdgeForm id={id} onClose={close} />
      </Modal>
    </>
  );
}
