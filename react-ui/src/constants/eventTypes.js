import { CheckIcon, RefreshIcon, UserIcon, XIcon } from "@heroicons/react/solid";

export const eventTypes = {
  created: { icon: UserIcon, bgColorClass: "bg-gray-400" },
  action: { icon: RefreshIcon, bgColorClass: "bg-blue-500" },
  completed: { icon: CheckIcon, bgColorClass: "bg-green-500" },
  cancelled: { icon: XIcon, bgColorClass: "bg-red-500" },
};