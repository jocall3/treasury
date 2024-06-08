import React, { ReactNode } from "react";
import ReactJson from "react-json-view";
import { get } from "lodash";
import invariant from "ts-invariant";
import { ActionItemProps } from "~/common/ui-components/ActionItem/ActionItem";
import { TagColors } from "~/common/ui-components/Tag/Tag";
import { Icons } from "~/common/ui-components/Icon/Icon";
import { cn } from "~/common/utilities/cn";
import {
  AssociationOption,
  AssociationListOption,
  DisplayColumn,
  DisplayColumnOptions__AssociatedEntityLabelFieldTypeEnum,
  useAuditableTextFieldLazyQuery,
  useAuditableJsonFieldLazyQuery,
  PaymentSubtypeEnum,
} from "../../generated/dashboard/graphqlSchema";
import { DisplayColumnTypeEnum } from "../../generated/dashboard/types/displayColumnTypeEnum";
import {
  ActionItem,
  Amount,
  CopyableText,
  Countdown,
  DateTime,
  Drawer,
  Icon,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
  Pill,
  Popover,
  PopoverPanel,
  PopoverTrigger,
  StatusIndicator,
  Tag,
} from "../../common/ui-components";
import { StatusIndicatorStatuses } from "../../common/ui-components/StatusIndicator/StatusIndicator";
import { getDrawerContent } from "../../common/utilities/getDrawerContent";
import {
  RESOURCES,
  ResourcesEnum,
} from "../../generated/dashboard/types/resources";
import AuditableTextField from "./auditable_fields/AuditableTextField";
import AuditableJsonField from "./auditable_fields/AuditableJsonField";
import { formatPaymentSubtype } from "../../common/utilities/formatPaymentSubtype";
import { createPolymorphicAssociation } from "../utilities/createPolymorphicAssociation";

type Action = {
  handler: () => void;
  label: string;
  type: ActionItemProps["type"];
};

type AdditionalSection = {
  header: string;
  content: React.ReactNode;
};

type RecordData = {
  id: string;
  [key: string]: unknown;
};

function auditableText(
  record: RecordData,
  fieldName: string,
  defaultTextField: string | null
) {
  return (
    <AuditableTextField
      graphqlQuery={useAuditableTextFieldLazyQuery}
      queryVariables={{
        id: record.id,

        resourceName: record.__typename as string,
        fieldName,
      }}
      defaultText={
        defaultTextField ? (record[defaultTextField] as string) : undefined
      }
      fieldName="auditableTextField"
    />
  );
}

function auditableJSON(record: RecordData, fieldName: string) {
  return (
    <AuditableJsonField
      graphqlQuery={useAuditableJsonFieldLazyQuery}
      queryVariables={{
        id: record.id,

        resourceName: record.__typename as string,
        fieldName,
      }}
      fieldName="auditableJsonField"
    />
  );
}

function associatedEntityLabel(
  record: RecordData,
  displayColumnId: string,
  displayTypeOptions: AssociationOption | AssociationListOption
) {
  if (
    displayTypeOptions.associatedEntityLabelFieldType ===
      DisplayColumnOptions__AssociatedEntityLabelFieldTypeEnum.Object ||
    displayTypeOptions.__typename === "AssociationListOption"
  ) {
    return get(record, [
      displayTypeOptions.associatedEntityLabelField,
    ]) as string;
  }

  return get(record, [
    displayColumnId,
    displayTypeOptions.associatedEntityLabelField,
  ]) as string;
}

function idColumn({ id, path }: RecordData) {
  const includeLink = path && path !== window.location.pathname;
  return (
    <CopyableText text={id}>
      {includeLink ? <a href={path as string}>{id}</a> : id}
    </CopyableText>
  );
}

function association(
  record: RecordData,
  displayColumnId: string,
  displayTypeOptions: AssociationOption | AssociationListOption
) {
  const isAssociationList =
    displayTypeOptions.__typename === "AssociationListOption";
  if (displayTypeOptions?.drawerEnabled) {
    return (
      <Drawer
        key={displayColumnId}
        trigger={
          <Pill className="associated-entity z-10" showTooltip>
            {associatedEntityLabel(record, displayColumnId, displayTypeOptions)}
          </Pill>
        }
        path={
          get(
            record,
            isAssociationList ? "path" : [displayColumnId, "path"]
          ) as string
        }
      >
        {getDrawerContent(
          get(
            record,
            isAssociationList ? "typename" : [displayColumnId, "typename"]
          ) as string,
          get(
            record,
            isAssociationList ? "id" : [displayColumnId, "id"]
          ) as string
        )}
      </Drawer>
    );
  }

  if (displayTypeOptions?.linkEnabled) {
    return (
      <a href={get(record, [displayColumnId, "path"]) as string}>
        {associatedEntityLabel(record, displayColumnId, displayTypeOptions)}
      </a>
    );
  }

  // Otherwise simply render the label of the association
  return displayTypeOptions
    ? associatedEntityLabel(record, displayColumnId, displayTypeOptions)
    : null;
}

/**
 * Computes the value from the graphql response based on the column display type.
 * Different values are rendered depending on the type defined on the display column
 */
function computeValue(
  displayColumn: DisplayColumn,
  record: RecordData,
  actions: Array<Action>
): React.ReactNode {
  if (record?.[displayColumn.id] == null) {
    return null;
  }
  let content: React.ReactNode = null;

  switch (displayColumn.type) {
    case DisplayColumnTypeEnum.DisplayColumnTypesAssociation:
      // Render a Drawer for associations if the option is enabled
      invariant(
        displayColumn.displayTypeOptions?.__typename === "AssociationOption"
      );
      content = association(
        record,
        displayColumn.id,
        displayColumn.displayTypeOptions
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesAssociationList:
      // Render a Drawer for associations if the option is enabled
      invariant(
        displayColumn.displayTypeOptions?.__typename === "AssociationListOption"
      );
      content = (get(record, [displayColumn.id]) as RecordData[]).map(
        (entity) =>
          association(
            entity,
            displayColumn.id,
            displayColumn.displayTypeOptions as AssociationListOption
          )
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesPolymorphicAssociation:
      invariant(
        displayColumn.displayTypeOptions?.__typename ===
          "PolymorphicAssociationOption"
      );
      content = createPolymorphicAssociation(
        record,
        displayColumn.displayTypeOptions.associationPrefix,
        displayColumn.id,
        displayColumn.displayTypeOptions.drawerEnabled ?? false,
        displayColumn.displayTypeOptions.stackedDrawerEnabled ?? false
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesAuditableText:
      invariant(
        displayColumn.displayTypeOptions?.__typename ===
          "AuditableTextOption" || displayColumn.displayTypeOptions == null
      );
      if (displayColumn.displayTypeOptions?.fieldAsDefaultText) {
        content = auditableText(
          record,
          displayColumn.displayTypeOptions.fullField as string,
          displayColumn.id
        );
      } else {
        content = auditableText(record, displayColumn.id, null);
      }
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesAuditableJSON:
      invariant(
        displayColumn.displayTypeOptions?.__typename === "AuditableJSONOption"
      );
      content = auditableJSON(
        record,
        displayColumn.displayTypeOptions.auditableFieldName
      );
      break;
    case DisplayColumnTypeEnum.SharedTypesScalarsDateTimeType:
      content = <DateTime timestamp={record[displayColumn.id] as string} />;
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesToggled:
      content = record[displayColumn.id] ? "Enabled" : "Disabled";
      break;
    case DisplayColumnTypeEnum.GraphQlTypesBoolean:
      content = record[displayColumn.id] ? "True" : "False";
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesStatusIndicator:
      invariant(
        displayColumn.displayTypeOptions?.__typename === "StatusIndicatorOption"
      );
      content = (
        <StatusIndicator
          currentStatus={
            displayColumn.displayTypeOptions?.statusIndicatorCurrentStatusField
              ? (record[
                  displayColumn.displayTypeOptions
                    .statusIndicatorCurrentStatusField
                ] as StatusIndicatorStatuses)
              : "incomplete"
          }
          statusDescriptor={
            displayColumn.displayTypeOptions?.statusIndicatorDescriptorField
              ? (record[
                  displayColumn.displayTypeOptions
                    .statusIndicatorDescriptorField
                ] as string)
              : ""
          }
          verbose
        />
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesCountdown:
      invariant(
        // eslint-disable-next-line no-underscore-dangle
        displayColumn.displayTypeOptions?.__typename === "CountdownOption"
      );
      content = (
        <Countdown
          type={
            (displayColumn.displayTypeOptions.countdownType as
              | "relative"
              | "timestamp") ?? "timestamp"
          }
          timestamp={record[displayColumn.id] as string}
        />
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesTag:
      invariant(displayColumn.displayTypeOptions?.__typename === "TagOption");
      content = (
        <Tag
          size="small"
          color={
            displayColumn.displayTypeOptions.tagColorField
              ? (record[
                  displayColumn.displayTypeOptions.tagColorField
                ] as TagColors)
              : undefined
          }
          icon={
            displayColumn.displayTypeOptions.tagIconField &&
            record[displayColumn.displayTypeOptions.tagIconField]
              ? {
                  iconName: record[
                    displayColumn.displayTypeOptions.tagIconField
                  ] as Icons,
                  size: "s",
                }
              : undefined
          }
        >
          {record[displayColumn.id] as string}
        </Tag>
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesTagList: {
      invariant(
        displayColumn.displayTypeOptions?.__typename === "TagListOption"
      );

      const colors = displayColumn.displayTypeOptions?.tagColorsField
        ? (record[
            displayColumn.displayTypeOptions?.tagColorsField
          ] as TagColors[])
        : undefined;

      const icons = displayColumn.displayTypeOptions?.tagIconsField
        ? (record[displayColumn.displayTypeOptions?.tagIconsField] as Icons[])
        : undefined;

      content = (
        <div className="flex flex-wrap gap-y-2">
          {((record[displayColumn.id] || []) as Array<string>).map(
            (element, idx) => (
              <Tag
                key={`tag-list-item-${element}-${idx}`}
                className="mr-2"
                size="small"
                color={colors && colors[idx]}
                icon={icons && { iconName: icons[idx] }}
              >
                {element}
              </Tag>
            )
          )}
        </div>
      );
      break;
    }
    case DisplayColumnTypeEnum.DisplayColumnTypesLink:
      invariant(displayColumn.displayTypeOptions?.__typename === "LinkOption");
      content = (
        <a
          target={displayColumn.displayTypeOptions.openNewTab ? "_blank" : ""}
          rel={
            displayColumn.displayTypeOptions.openNewTab
              ? "noopener noreferrer"
              : ""
          }
          href={record[displayColumn.id] as string}
        >
          {
            get(record, [
              displayColumn.displayTypeOptions.displayNameField,
            ]) as string
          }
        </a>
      );
      break;
    case DisplayColumnTypeEnum.GraphQlTypesInt:
      content = (record[displayColumn.id] as number).toString();
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesId:
    case DisplayColumnTypeEnum.GraphQlTypesId:
      content = idColumn(record);
      break;
    case DisplayColumnTypeEnum.TypesPaymentOrderPaymentSubtypeEnumType:
      content = formatPaymentSubtype(
        record[displayColumn.id] as PaymentSubtypeEnum
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesAmount:
      content = <Amount>{record[displayColumn.id] as string}</Amount>;
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesAmountDifference:
      invariant(
        displayColumn.displayTypeOptions?.__typename ===
          "AmountDifferenceOption"
      );
      content = (
        <Amount
          difference={
            get(record, [
              displayColumn.displayTypeOptions.amountDifference as string,
            ]) !== "0"
          }
        >
          {record[displayColumn.id] as string}
        </Amount>
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesJSON:
      invariant(displayColumn.displayTypeOptions?.__typename === "JSONOption");
      content = (
        <ReactJson
          src={
            record[displayColumn.id]
              ? (JSON.parse(record[displayColumn.id] as string) as Record<
                  string,
                  unknown
                >)
              : {}
          }
          name={null}
          displayObjectSize={false}
          displayDataTypes={false}
          collapsed={!!displayColumn.displayTypeOptions?.collapsed}
          sortKeys
        />
      );
      break;
    case DisplayColumnTypeEnum.SharedTypesScalarsJSONType:
      content = (
        <ReactJson
          src={
            record[displayColumn.id]
              ? (JSON.parse(record[displayColumn.id] as string) as Record<
                  string,
                  unknown
                >)
              : {}
          }
          name={null}
          displayObjectSize={false}
          displayDataTypes={false}
          sortKeys
        />
      );
      break;
    case DisplayColumnTypeEnum.DisplayColumnTypesOrderedList:
      content = (
        <ol>
          {(record[displayColumn.id] as Array<string>).map((element) => (
            <li className="mb-1 mt-1 overflow-hidden overflow-ellipsis break-words">
              {element}
            </li>
          ))}
        </ol>
      );
      break;
    default:
      if (displayColumn.viewOptions?.detailsTable?.copyable) {
        content = (
          <CopyableText text={record[displayColumn.id]}>
            {record[displayColumn.id] as string}
          </CopyableText>
        );
      } else {
        content = (
          <div className="break-words">
            {record[displayColumn.id] as string}
          </div>
        );
      }
      break;
  }
  return (
    <div className="flex gap-1">
      {content}
      <div id={`${displayColumn.id}_actions_toggle`}>
        {actions.length ? (
          <Popover>
            <PopoverTrigger buttonHeight="small" buttonType="link">
              <Icon iconName="more_horizontal" />
            </PopoverTrigger>
            <PopoverPanel
              anchorOrigin={{
                horizontal: "right",
              }}
            >
              {actions.map((action: Action) => (
                <ActionItem type={action.type} onClick={() => action.handler()}>
                  {action.label}
                </ActionItem>
              ))}
            </PopoverPanel>
          </Popover>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Converts the graphql response data into a object containing values for
 * all the display columns. This object will be fed directly into <KeyValueTable />
 */
function formatData(
  data: ResponseType,
  graphqlField: string,
  displayColumns: Array<DisplayColumn>,
  actions?: Record<string, Array<Action>>
) {
  return {
    ...displayColumns.reduce(
      (acc, displayColumn) => ({
        ...acc,
        [displayColumn.id]: computeValue(
          displayColumn,
          data[graphqlField],
          actions && actions[displayColumn.id] ? actions[displayColumn.id] : []
        ),
      }),
      {}
    ),
  };
}

type ResponseType = {
  displayColumns: Array<DisplayColumn>;
} & { [key: string]: RecordData };

interface DetailsTableProps {
  actions?: Record<string, Array<Action>>;
  /** When `true`, adds a card surface to the table. Defaults to `true`. */
  bordered?: boolean;
  customDataMapping?: Record<string, ReactNode>;
  constantQueryVariables?: Record<string, unknown>;
  expandable?: boolean;
  graphqlQuery: unknown;
  id: string;
  resource: ResourcesEnum;
  additionalSections?: Array<AdditionalSection>;
}

type QueryFunctionType = (queryArgs: Record<string, unknown>) => {
  data?: Record<string, unknown>;
  loading: boolean;
  error?: string;
  refetch: (args: Record<string, unknown>) => unknown;
};

function DetailsTable({
  actions,
  bordered = true,
  customDataMapping,
  constantQueryVariables = {},
  expandable = false,
  graphqlQuery,
  id,
  resource,
  additionalSections = [],
}: DetailsTableProps) {
  const { data, loading, error } = (graphqlQuery as QueryFunctionType)({
    variables: {
      id,
      ...constantQueryVariables,
    },
    fetchPolicy: "no-cache",
  });

  const graphqlField = RESOURCES[resource].graphql_fields?.details_table;
  invariant(
    graphqlField,
    `The resource you passed to <DetailsTable /> (${resource}) has no corresponding graphql field for this component. Did you forget to update resources.rb?`
  );
  const waitingForData = loading || !data || error;
  const displayColumns = waitingForData
    ? []
    : (data as ResponseType).displayColumns;

  const record = waitingForData
    ? []
    : formatData(data as ResponseType, graphqlField, displayColumns, actions);

  const defaultColumns = displayColumns.filter(
    (col) => col.viewOptions.detailsTable?.default
  );

  const primaryColumns = displayColumns.filter(
    (col) => col.viewOptions.detailsTable?.primaryColumn
  );

  const dataMapping =
    customDataMapping ||
    [
      // Place primary and default columns first.
      ...primaryColumns,
      ...defaultColumns,
      ...displayColumns.filter((col) => !col.viewOptions.detailsTable?.default),
    ].reduce<Record<string, string>>((acc, displayColumn) => {
      if (
        displayColumn.viewOptions.detailsTable?.hideIfNull &&
        !record[displayColumn.id]
      ) {
        return acc;
      }
      return { ...acc, [displayColumn.id]: displayColumn.label };
    }, {});

  return (
    <div id="payment-order-details-panel">
      {(loading || !record) && (
        <KeyValueTableSkeletonLoader
          altRowClassNames="detail-panel-row"
          altTableClassNames="detail-panel p-6"
        />
      )}
      {!loading && record && (
        <>
          <KeyValueTable
            data={record}
            dataMapping={dataMapping}
            primaryColumns={primaryColumns.map((col) => col.id)}
            expandable={expandable}
            // Default & primary columns are visible by design.
            minRowsWhenExpandable={defaultColumns.length}
            altRowClassNames="detail-panel-row"
            altTableClassNames={cn(
              "flex flex-col items-start gap-3 bg-white",
              bordered && "p-6 border-alpha-black-100 border rounded-md",
              additionalSections.length > 0 &&
                "!pb-0 !border-b-0 !rounded-b-none"
            )}
          />
          <div id="additional-sections">
            {additionalSections.map((additionalSection) => (
              <div
                className="detail-panel flex-wrap gap-3 !rounded-t-none !border-t-0 !px-6 !pb-6"
                key={additionalSection.header}
              >
                <div className="break-normal font-medium">
                  {additionalSection.header}
                </div>
                {additionalSection.content}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default DetailsTable;
