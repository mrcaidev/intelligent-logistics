import { Button } from "components/form";
import { useGoods } from "hooks/use-goods";
import { useDelete } from "hooks/use-mutation";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";

type Props = {
  id: string;
};

export function RemoveGoodButton({ id }: Props) {
  const { mutate } = useGoods();

  const { trigger, isMutating } = useDelete("/goods/" + id);

  const handleClick = async () => {
    await trigger();
    await mutate();
    toast.success("删除物品成功");
  };

  return (
    <Button
      colorScheme="red"
      variant="link"
      size="small"
      icon={Trash2}
      isLoading={isMutating}
      onClick={handleClick}
    >
      <span className="sr-only">删除物品</span>
    </Button>
  );
}
