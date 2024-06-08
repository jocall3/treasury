import { Flatfile } from "@flatfile/api";

export const accountACHSettingBlueprint: Pick<
  Flatfile.CreateWorkbookConfig,
  "name" | "labels" | "sheets" | "actions"
> = {
  name: "Bulk Import Account ACH Setting",
  labels: [],
  sheets: [
    {
      name: "Account ACH Settings",
      slug: "account_ach_settings",
      readonly: false,
      allowAdditionalFields: false,
      fields: [
        {
          label: "Internal Account ID",
          key: "internalAccountId",
          type: "string",
        },
        {
          label: "Immediate Origin",
          key: `immediateOrigin`,
          type: "string",
        },
        {
          label: `Immediate Origin Name`,
          key: "immediateOriginName",
          type: "string",
        },
        {
          label: `Immediate Destination`,
          key: `immediateDestination`,
          type: "string",
        },
        {
          label: `Immediate Destination Name`,
          key: `immediateDestinationName`,
          type: "string",
        },
        {
          label: `Direction`,
          key: `direction`,
          type: "string",
          description: "Leave blank for both 'credit' and 'debit'",
        },
        {
          label: `Connection Endpoint Label`,
          key: `connectionEndpointLabel`,
          type: "string",
        },
      ],
    },
  ],
  actions: [
    {
      operation: "submitActionFg",
      mode: "foreground",
      label: "Submit uploaded data",
      type: "string",
      description: "Submit this data to Modern Treasury",
      primary: true,
      constraints: [{ type: "hasData" }, { type: "hasAllValid" }],
    },
  ],
};

export const accountACHSettingBlueprintFields =
  accountACHSettingBlueprint.sheets?.[0].fields || [];
