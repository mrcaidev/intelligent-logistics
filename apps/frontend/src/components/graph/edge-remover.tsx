import { Button } from "components/form";
import { useEdges } from "hooks/use-edges";
import { Trash2 } from "react-feather";
import useSWRMutation from "swr/mutation";
import { fetcher } from "utils/fetch";

async function removeEdge(url: string) {
  return fetcher<never>(url, {
    method: "DELETE",
  });
}

type Props = {
  id: string;
};

export function EdgeRemover({ id }: Props) {
  const { mutate } = useEdges();

  const { trigger, isMutating } = useSWRMutation("/edges/" + id, removeEdge);

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
      删除道路
    </Button>
  );
}
