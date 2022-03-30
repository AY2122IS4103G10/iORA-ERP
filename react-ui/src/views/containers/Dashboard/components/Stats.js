/* This example requires Tailwind CSS v2.0+ */
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import CountUp from "react-countup";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SharedStats({ stats }) {
  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200">
        {stats.map(
          ({
            name,
            stat,
            previousStat,
            prefix = "",
            suffix = "",
            decimals = 0,
            change,
            changeType,
          }) => (
            <div key={name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">{name}</dt>
              <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-cyan-600">
                  <CountUp
                    end={stat}
                    duration={1}
                    decimals={decimals}
                    prefix={prefix}
                    suffix={suffix}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    from{" "}
                    <CountUp
                      end={previousStat}
                      duration={1}
                      decimals={decimals}
                      prefix={prefix}
                      suffix={suffix}
                    />
                  </span>
                </div>

                <div
                  className={classNames(
                    changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800",
                    "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                  )}
                >
                  {changeType === "increase" ? (
                    <ArrowSmUpIcon
                      className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowSmDownIcon
                      className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  )}
                  <span className="sr-only">
                    {changeType === "increase" ? "Increased" : "Decreased"} by
                  </span>
                  <CountUp
                    start={0.0}
                    end={change}
                    duration={1}
                    decimals={2}
                    suffix="%"
                  />
                </div>
              </dd>
            </div>
          )
        )}
      </dl>
    </div>
  );
}
