import { Button } from "components/form";
import { useNodes } from "hooks/use-nodes";
import { Trash2 } from "react-feather";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

async function removeNode(url: string) {
  return fetcher<never>(url, {
    method: "DELETE",
  });
}

type Props = {
  id: string;
};

export function NodeRemover({ id }: Props) {
  const { mutate } = useNodes();

  const { trigger, isMutating } = useSWRMutation("/nodes/" + id, removeNode);

  const handleClick = async () => {
    await trigger();
    await mutate();
  };

  return (
    <Button
      colorScheme="red"
      icon={Trash2}
      isLoading={isMutating}
      onClick={handleClick}
    >
      删除节点
    </Button>
  );
}
