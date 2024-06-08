import React, { useEffect, useState } from "react";
import moment from "moment";
import { v4 } from "uuid";
import ChartView from "../../../common/ui-components/Charts/ChartView";
import { DateRangeFormValues } from "../../../common/ui-components/DateRangeSelectField/DateRangeSelectField";
import { useHistoricalCashFlowQuery } from "../../../generated/dashboard/graphqlSchema";
import DateSearch, { dateSearchMapper } from "../search/DateSearch";
import {
  HistoricalCashFlowBarChart,
  HistoricalCashFlowItem,
  HistoricalCashflowChartDataPoint,
} from "./HistoricalCashFlowBarChart";
import PlaceholderLineChart from "../PlaceholderLineChart";
import { ACCOUNT_DATE_RANGE_FILTER_OPTIONS } from "../../containers/reconciliation/utils";
import trackEvent from "../../../common/utilities/trackEvent";
import { ACCOUNT_ACTIONS } from "../../../common/constants/analytics";

interface HistoricalCashFlowChartProps {
  entityId?: string;
  entityType?: string;
  currency?: string;
  dateRange?: DateRangeFormValues;
  setGlobalDateFilterLabel?: () => void;
}

interface HistoricalCashFlowQueryFilter {
  entityId?: string;
  entityType?: string;
  currency: string;
  asOfDate: DateRangeFormValues;
}

export default function HistoricalCashFlowChart({
  entityId,
  entityType,
  currency = "USD",
  dateRange,
  setGlobalDateFilterLabel,
}: HistoricalCashFlowChartProps) {
  const [query, setQuery] = useState<HistoricalCashFlowQueryFilter>({
    asOfDate: dateRange || ACCOUNT_DATE_RANGE_FILTER_OPTIONS[1].dateRange,
    entityId,
    entityType,
    currency,
  });

  const { data, loading, refetch } = useHistoricalCashFlowQuery({
    variables: {
      ...query,
      asOfDate: dateSearchMapper(query.asOfDate),
      currency,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleRefetch = async (newQuery: HistoricalCashFlowQueryFilter) => {
    setQuery({
      ...newQuery,
      asOfDate: newQuery.asOfDate,
    });
    await refetch({
      ...newQuery,
      asOfDate: dateSearchMapper(newQuery.asOfDate),
    });
  };

  useEffect(() => {
    void handleRefetch({
      ...query,
      currency,
      ...(dateRange && { asOfDate: dateRange }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, dateRange]);

  const searchComponents = [
    {
      field: "asOfDate",
      query,
      options: ACCOUNT_DATE_RANGE_FILTER_OPTIONS,
      component: DateSearch,
      updateQuery: (input: Record<string, DateRangeFormValues>) => {
        trackEvent(null, ACCOUNT_ACTIONS.CHANGED_WIDGET_DATE_FILTER, {
          widget: "HistoricalCashFlowChart",
        });
        void handleRefetch({ ...query, asOfDate: input.asOfDate, currency });
      },
      setGlobalDateFilterLabel,
      // so cascading date filter label updates when date range changes
      key: v4(),
      autoWidth: true,
      showStartAndEndDateArrow: false,
    },
  ];

  const toChartData = (
    input: HistoricalCashFlowItem[]
  ): HistoricalCashflowChartDataPoint[] =>
    input.map((item: HistoricalCashFlowItem) => {
      const date = moment(item.asOfDate);
      return {
        ...item,
        currency,
        dateShortest: date.format("M/D"),
        dateShort: date.format("MMM D"),
        dateLong: date.format("ddd, MMM D"),
      };
    });
  return (
    <ChartView
      title="Cash Flow"
      searchComponents={searchComponents}
      className="bg-background-default"
      loading={loading}
      childrenContainerClassName="flex flex-grow items-center justify-center"
      hasChartOptions
    >
      {data && data.historicalCashFlow.length > 0 ? (
        <HistoricalCashFlowBarChart
          chartData={toChartData(data.historicalCashFlow)}
        />
      ) : (
        <PlaceholderLineChart content="There is no data in this date range. If you believe this is an error, please contact support." />
      )}
    </ChartView>
  );
}
