import {
  Calendar,
  ChevronRight,
  Map,
  MapPin,
  Package,
  User,
} from "react-feather";

type Props = {
  id: string;
  name: string;
  createdAt: Date;
  departureNodeId: string;
  destinationNodeId: string;
  isVip: boolean;
  strategyId: string;
};

export const Good = ({
  name,
  createdAt,
  departureNodeId,
  destinationNodeId,
  isVip,
  strategyId,
}: Props) => {
  return (
    <details className="group ring-1 ring-gray-700 open:bg-gray-700 rounded">
      <summary className="flex items-center gap-3 px-4 py-3 rounded font-bold text-sm hover:bg-gray-700 cursor-pointer">
        <Package size={16} />
        {name}
        <ChevronRight
          size={16}
          className="ml-auto group-open:rotate-90 transition-transform"
        />
      </summary>
      <ul className="pb-1 divide-y divide-gray-600">
        <li className="flex items-center gap-3 mx-2 px-2 py-2 text-xs">
          <Calendar size={16} />
          {createdAt.toLocaleString("zh")}
        </li>
        <li className="flex items-center gap-3 mx-2 px-2 py-2 text-xs">
          <MapPin size={16} />
          {departureNodeId} - {destinationNodeId}
        </li>
        <li className="flex items-center gap-3 mx-2 px-2 py-2 text-xs">
          <Map size={16} />
          {strategyId}
        </li>
        {isVip && (
          <li className="flex items-center gap-3 mx-2 px-2 py-2 text-xs">
            <User size={16} />
            VIP 用户
          </li>
        )}
      </ul>
    </details>
  );
};
