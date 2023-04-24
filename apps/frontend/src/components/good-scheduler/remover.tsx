import { Button } from "components/form";
import { useGoods } from "hooks/use-goods";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

async function removeGood(url: string) {
  return fetcher<never>(url, {
    method: "DELETE",
  });
}

type Props = {
  id: string;
};

export function GoodRemover({ id }: Props) {
  const { mutate } = useGoods();

  const { trigger, isMutating } = useSWRMutation("/goods/" + id, removeGood);

  const handleClickRemoving = async () => {
    try {
      await trigger();
      await mutate();
      toast.success("删除物品成功");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Button
      colorScheme="red"
      variant="link"
      size="small"
      icon={Trash2}
      isLoading={isMutating}
      onClick={handleClickRemoving}
    >
      <span className="sr-only">删除物品</span>
    </Button>
  );
}
