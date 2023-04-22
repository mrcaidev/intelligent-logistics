import { useGoods } from "hooks/use-goods";
import { Loader } from "react-feather";
import { GoodCard } from "./card";

export function GoodList() {
  const { data, isLoading } = useGoods();

  if (isLoading) {
    return <Loader className="mx-auto animate-spin" />;
  }

  return (
    <ul className="space-y-2 px-4 mr-0.5 overflow-auto scrollbar scrollbar-rounded scrollbar-track-color-transparent scrollbar-thumb-color-gray-400">
      {data?.map((good) => (
        <li key={good.id}>
          <GoodCard {...good} />
        </li>
      ))}
    </ul>
  );
}
