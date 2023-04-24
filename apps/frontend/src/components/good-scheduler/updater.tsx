import { Button } from "components/form";
import { Modal } from "components/modal";
import { useBoolean } from "hooks/use-boolean";
import { Edit } from "react-feather";
import { Good } from "shared-types";
import { UpdateGoodForm } from "./update-form";

type Props = {
  good: Good;
};

export function GoodUpdater({ good }: Props) {
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
        <span className="sr-only">修改物品</span>
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="修改物品">
        <UpdateGoodForm good={good} onClose={close} />
      </Modal>
    </>
  );
}
