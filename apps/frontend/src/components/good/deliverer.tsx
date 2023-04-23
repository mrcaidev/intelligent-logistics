import { Good } from "common";
import { Button } from "components/form";
import { useGraph } from "components/graph";
import { useGoods } from "hooks/use-goods";
import { useState } from "react";
import { Send } from "react-feather";
import { toast } from "react-toastify";
import { fetcher } from "utils/fetch";

export function GoodDeliverer() {
  const { mutate } = useGoods();
  const { setActiveIds } = useGraph();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const {
        good: { id },
        nodes,
        edges,
      } = await fetcher<{ good: Good; nodes: string[]; edges: string[] }>(
        "/goods/deliver",
        { method: "POST" }
      );
      mutate((goods) => goods?.filter((good) => good.id !== id));
      setActiveIds([...nodes, ...edges]);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button icon={Send} isLoading={isLoading} onClick={handleClick}>
      发货
    </Button>
  );
}
