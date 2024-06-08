import React from "react";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ReferenceLine,
  LabelList,
  LabelProps,
  TooltipProps,
} from "recharts";
import abbreviateAmount from "../../../common/utilities/abbreviateAmount";
import colors from "../../../common/styles/colors";
import { CustomLegend } from "../../containers/account_groups/historical_balances_chart/HistoricalBalanceChartForGroupsUtils";
import { XAxisProps } from "../../../common/styles/cash_management/charts";

export type HistoricalCashFlowItem = {
  asOfDate?: string | null | undefined;
  prettyDirectionalInflow?: number | null | undefined;
  prettyDirectionalOutflow?: number | null | undefined;
  inflow?: number;
  outflow?: number;
};

export type HistoricalCashflowChartDataPoint = HistoricalCashFlowItem & {
  currency: string;
  dateShort: string;
  dateShortest: string;
};

const renderCustomizedLabel = (props: LabelProps) => {
  const { x, y, width, height, value } = props;

  if (!x || !y || !width || !height || !value) {
    return null;
  }
  // Don't show the label if we're below a certain height (a % of the container)
  if (height < 20 && height > -20) {
    return null;
  }

  // Pad the distance away from the Y-axis reference line
  const fromAxis = value < 0 ? 5 : -5;

  // This heuristic seems to work okay for the font size:
  // 1/4 of the width of the bar, with a min of 5 and max of 12
  const fontSize = Math.min(Math.max(Math.round(width / 4.0), 5), 12);

  return (
    <g>
      <text
        x={x + width / 2}
        y={y + height + fromAxis}
        fill="#1F2222"
        textAnchor="middle"
        dominantBaseline={value < 0 ? "hanging" : "auto"}
        fontSize={fontSize}
      >
        {abbreviateAmount(value, "USD")}
      </text>
    </g>
  );
};

export function tooltipFormatter(
  value: string | number | Array<string | number>,
  currency: string
): string {
  if (typeof value === "string" || value instanceof Array) {
    return "N/A";
  }

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

interface CustomTooltipProps extends TooltipProps {
  categories: string[];
}

function CustomTooltip({ active, payload, categories }: CustomTooltipProps) {
  if (!active || !payload) return null;

  const data = payload[0].payload as HistoricalCashflowChartDataPoint;

  return (
    <div className="rounded-md border bg-white p-4 drop-shadow-md">
      <div className="flex flex-col gap-2">
        <div>
          {categories.map((category) => (
            <span className="flex flex-row gap-2 font-medium">
              {category}:
              <code>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: data.currency,
                }).format(data[`prettyDirectional${category}`] as bigint)}
              </code>
            </span>
          ))}
        </div>
        <code>{data.dateShort}</code>
      </div>
    </div>
  );
}

function getDateFormatKey(numTicks) {
  if (numTicks < 8) {
    return "dateLong";
  }

  if (numTicks === 8) {
    return "dateShort";
  }

  return "dateShortest";
}

export function HistoricalCashFlowBarChart({
  chartData,
}: {
  chartData: HistoricalCashflowChartDataPoint[];
}) {
  const currency = chartData[0]?.currency ?? "USD";

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} stackOffset="sign" height={300}>
        <XAxis
          dataKey={getDateFormatKey(chartData.length)}
          {...XAxisProps}
          interval={0}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "#FAFAF9" }}
          formatter={(value) => tooltipFormatter(value, currency)}
          content={<CustomTooltip categories={["Inflow", "Outflow"]} />}
        />
        <Legend
          verticalAlign="bottom"
          align="left"
          iconSize={14}
          content={<CustomLegend />}
        />
        <ReferenceLine y={0} stroke={colors.gray["100"]} />
        <Bar
          dataKey="prettyDirectionalInflow"
          name="Inflow"
          fill={colors.categorical["7"]}
          stackId="stack"
          isAnimationActive={false}
          radius={[2, 2, 0, 0]}
        >
          <LabelList
            dataKey="prettyDirectionalInflow"
            content={renderCustomizedLabel}
          />
        </Bar>
        <Bar
          dataKey="prettyDirectionalOutflow"
          name="Outflow"
          fill={colors.qualitative.neutral}
          stackId="stack"
          isAnimationActive={false}
          radius={[2, 2, 0, 0]}
        >
          <LabelList
            dataKey="prettyDirectionalOutflow"
            content={renderCustomizedLabel}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
