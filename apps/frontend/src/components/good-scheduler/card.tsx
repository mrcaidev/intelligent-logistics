import { useGraphs } from "hooks/use-graphs";
import {
  Calendar,
  ChevronRight,
  Map,
  MapPin,
  Package,
  User,
} from "react-feather";
import { Good } from "shared-types";
import { GoodRemover } from "./remover";
import { GoodUpdater } from "./updater";

type Props = {
  good: Good;
};

export function GoodCard({ good }: Props) {
  const { id, name, createdAt, source, target, graphId, isVip } = good;

  const { graphs } = useGraphs();

  const graphName = graphs?.find((graph) => graph.id === graphId)?.name;

  return (
    <details className="group rounded border border-gray-300 open:bg-gray-300">
      <summary className="flex items-center gap-3 relative px-4 py-3 rounded font-bold text-sm hover:bg-gray-300 transition-colors cursor-pointer">
        <Package size={16} />
        {name}
        <ChevronRight
          size={16}
          className="ml-auto group-open:rotate-90 transition-transform"
        />
        <div className="hidden group-hover:flex items-center gap-2 absolute right-10 top-0 bottom-0">
          <GoodUpdater good={good} />
          <GoodRemover id={id} />
        </div>
      </summary>
      <ul className="mx-2 py-1 border-t border-gray-400/40 text-xs">
        <li className="flex items-center gap-3 p-2">
          <Calendar size={16} />
          {new Date(createdAt).toLocaleString("zh")}
        </li>
        <li className="flex items-center gap-3 p-2">
          <MapPin size={16} />
          {source} - {target}
        </li>
        <li className="flex items-center gap-3 p-2">
          <Map size={16} />
          {graphName || "未知方案"}
        </li>
        {isVip && (
          <li className="flex items-center gap-3 p-2">
            <User size={16} />
            VIP 用户
          </li>
        )}
      </ul>
    </details>
  );
}
