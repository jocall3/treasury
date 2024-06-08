import React, { useState } from "react";
import moment from "moment-timezone";
import colors from "../../common/styles/colors";
import {
  SelectField,
  DateRangeFormValues,
  BarChart,
  MTContainer,
} from "../../common/ui-components";
import abbreviateAmount from "../../common/utilities/abbreviateAmount";
import {
  BillingMetricNameEnum,
  TimeUnitEnum,
  useDailyBillingMetricsQuery,
} from "../../generated/dashboard/graphqlSchema";
import ChartView from "../../common/ui-components/Charts/ChartView";
import DateSearch, {
  dateSearchMapper,
  DATE_SEARCH_FILTER_OPTIONS,
} from "./search/DateSearch";

type Option = {
  value: BillingMetricNameEnum;
  label: string;
  unit: BillingMetricUnit;
};

enum BillingMetricUnit {
  Dollar = "dollar",
  Count = "count",
}

type QueryFilter = {
  dateRange: DateRangeFormValues;
  metricName: BillingMetricNameEnum;
};

const BILLING_METRICS: Array<Option> = [
  {
    label: "Reconciled Payment Volume",
    value: BillingMetricNameEnum.ReconciledPaymentVolume,
    unit: BillingMetricUnit.Dollar,
  },
  {
    label: "Reconciled Payment Count",
    value: BillingMetricNameEnum.ReconciledPaymentCount,
    unit: BillingMetricUnit.Count,
  },
  {
    label: "Reconciled Virtual Account Transaction Volume",
    value: BillingMetricNameEnum.ReconciledVirtualAccountTransactionVolume,
    unit: BillingMetricUnit.Dollar,
  },
  {
    label: "Reconciled Virtual Account Transaction Count",
    value: BillingMetricNameEnum.ReconciledVirtualAccountTransactionCount,
    unit: BillingMetricUnit.Count,
  },
  {
    label: "Lob Check Count",
    value: BillingMetricNameEnum.LobCheckCount,
    unit: BillingMetricUnit.Count,
  },
];

const DOWNLOAD_FILE_NAME_PREFIX = "Billing_Usage_Bar_Chart";
const FILTER_WIDTH = "w-48";
const MIN_HEIGHT = "min-h-[350px]";

const CHART_FORMAT = {
  fontSize: "11px",
  lineHeight: "22",
  color: colors.gray[700],
  fill: colors.gray[700],
};

const tickFormatter = (value: number, billingMetricUnit: BillingMetricUnit) =>
  billingMetricUnit === BillingMetricUnit.Dollar
    ? abbreviateAmount(value, "USD")
    : value;

function tooltipFormatter(value: number, billingMetricUnit: BillingMetricUnit) {
  if (billingMetricUnit === BillingMetricUnit.Dollar)
    return [
      Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value),
    ];
  return [value];
}

function BillingUsageBarChart() {
  const initialBillingMetric = BILLING_METRICS[0];
  const [selectedBillingMetric, setBillingMetric] =
    useState<Option>(initialBillingMetric);
  const [query, setQuery] = useState<QueryFilter>({
    dateRange: {
      inTheLast: { unit: TimeUnitEnum.Months, amount: "1" },
    },
    metricName: initialBillingMetric.value,
  });

  const { loading, data, error, refetch } = useDailyBillingMetricsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      dateRange: {
        inTheLast: { unit: TimeUnitEnum.Months, amount: 1 },
      },
      metricName: initialBillingMetric.value,
    },
  });

  const handleRefetch = async (newQuery: QueryFilter) => {
    await refetch({
      metricName: newQuery.metricName,
      dateRange: dateSearchMapper(newQuery.dateRange),
    });
    setQuery(newQuery);
  };

  const onOptionChange = async (newOption: Option) => {
    if (selectedBillingMetric.value !== newOption.value) {
      await handleRefetch({
        ...query,
        metricName: newOption.value,
      });
    }
    setBillingMetric(newOption);
  };

  const searchComponents = [
    {
      field: "dateRange",
      options: DATE_SEARCH_FILTER_OPTIONS,
      component: DateSearch,
      validateRange: true,
      isSearchable: false,
      placeholder: "Past Month",
      query,
      updateQuery: (input: Record<string, DateRangeFormValues>) =>
        handleRefetch({ ...query, dateRange: input.dateRange }),
    },
    {
      options: BILLING_METRICS,
      component: SelectField,
      selectValue: selectedBillingMetric.value,
      isSearchable: false,
      handleChange: (_, newOption: Option) => onOptionChange(newOption),
    },
  ];

  const dailyBillingMetrics: { name: string; metricValue: number }[] =
    loading || !data || error
      ? []
      : data.dailyBillingMetrics.map((billingMetric) => ({
          name: moment(billingMetric.date).format("M/D"),
          metricValue: billingMetric.metricValue,
        }));

  return (
    <MTContainer header="Billing Usage Chart" headerSize="l">
      <span className="text-xs text-gray-500">
        Show various billing metrics for a customer. It will list all metrics
        regardless of whether the customer is billed by the metric. This chart
        is currently only accessible by MT admins.
      </span>

      <ChartView
        title={`Billing Usage for ${selectedBillingMetric.label}`}
        loaderNumberOfBars={12}
        loading={loading}
        minHeightClass={MIN_HEIGHT}
        fileNamePrefix={DOWNLOAD_FILE_NAME_PREFIX}
        filterWidthClass={FILTER_WIDTH}
        searchComponents={searchComponents}
        hasChartOptions
      >
        <BarChart
          xAxisProps={{
            stroke: colors.gray[200],
            tickLine: {
              color: colors.gray[200],
            },
            tick: {
              ...CHART_FORMAT,
              fontSize: "10px",
            },
            tickSize: 12,
            tickMargin: 12,
            axisLine: false,
          }}
          yAxisProps={{
            stroke: colors.gray[200],
            tickLine: {
              color: colors.gray[200],
            },
            tickMargin: 10,
            axisLine: false,
            interval: "preserveEnd",
            tickFormatter: (value: number) =>
              tickFormatter(value, selectedBillingMetric.unit),
          }}
          excludeLegend
          tooltipProps={{
            cursor: false,
            contentStyle: {
              ...CHART_FORMAT,
            },
            itemStyle: {
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0",
            },

            formatter: (value: number) =>
              tooltipFormatter(value, selectedBillingMetric.unit),
            labelFormatter: (x: string) => moment(x).format("MMM Do"),
            labelStyle: {
              lineHeight: "22px",
              fontSize: "12px",
              padding: "0",
            },
          }}
          data={dailyBillingMetrics}
          lines={[
            {
              key: "metricValue",
              dataKey: "metricValue",
              stroke: colors.green[600],
              fill: colors.green[600],
              type: "linear",
            },
          ]}
        />
      </ChartView>
    </MTContainer>
  );
}

export default BillingUsageBarChart;
