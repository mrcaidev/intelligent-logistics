import { Button } from "components/form";
import { useGoods } from "hooks/use-goods";
import { Loader } from "react-feather";
import { GoodCard } from "./card";

type Props = {
  openForm: () => void;
};

export function GoodList({ openForm }: Props) {
  const { goods, isLoading } = useGoods();

  if (isLoading) {
    return (
      <div className="grow grid place-items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!goods || goods.length === 0) {
    return (
      <div className="grow grid place-items-center">
        <p className="text-gray-600">
          还没有物品！要
          <Button variant="link" onClick={openForm}>
            添加一个
          </Button>
          吗？
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 grow p-4 mx-0.5 overflow-auto scrollbar scrollbar-rounded scrollbar-track-color-transparent scrollbar-thumb-color-gray-400">
      {goods.map((good) => (
        <li key={good.id}>
          <GoodCard good={good} />
        </li>
      ))}
    </ul>
  );
}
