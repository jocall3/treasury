import React from "react";
import { CellValueUnion } from "@flatfile/api/api";
import {
  useBulkCreateAccountAchSettingsMutation,
  useBulkValidateAccountAchSettingsMutation,
} from "~/generated/dashboard/graphqlSchema";
import FlatfileBulkUploadButton, {
  BulkResourceType,
} from "~/app/components/FlatfileBulkUploadButton";
import {
  accountACHSettingBlueprint,
  accountACHSettingBlueprintFields,
} from "./bulk_imports/blueprints/accountACHSettingBlueprint";

export const ACCOUNT_ACH_SETTING_CSV_HEADERS =
  accountACHSettingBlueprintFields.map((field) => field.key);

interface AccountCapabilityBulkUploadActionItemProps {
  connectionId: string;
}

function AccountCapabilityBulkUploadActionItem({
  connectionId,
}: AccountCapabilityBulkUploadActionItemProps) {
  const [bulkValidateAccountAchSettings] =
    useBulkValidateAccountAchSettingsMutation();
  const [bulkCreateAccountAchSettings] =
    useBulkCreateAccountAchSettingsMutation();

  const validate = async (
    resultsData: Array<Record<string, CellValueUnion | null>>
  ) => {
    const response = await bulkValidateAccountAchSettings({
      variables: {
        input: {
          connectionId,
          accountAchSettings: resultsData,
        },
      },
    });
    return response.data?.bulkValidateAccountAchSettings?.recordErrors;
  };

  const submit = async (
    resultsData: Array<Record<string, CellValueUnion | null>>,
    flatfileSheetId: string,
    flatfileSpaceId: string
  ) => {
    const { data } = await bulkCreateAccountAchSettings({
      variables: {
        input: {
          connectionId,
          flatfileSheetId,
          flatfileSpaceId,
          accountAchSettings: resultsData,
        },
      },
    });

    const { id } =
      data?.bulkCreateAccountAchSettings?.connectionBulkImport ?? {};
    if (id) {
      return {
        success: true,
        path: `/operations/connection_bulk_imports/${id}`,
      };
    }
    return { success: false, path: "/" };
  };

  return (
    <FlatfileBulkUploadButton
      resource={BulkResourceType.AccountACHSettings}
      blueprint={accountACHSettingBlueprint}
      expectedFields={accountACHSettingBlueprintFields}
      onValidate={validate}
      onSubmit={submit}
      launchFromActionsList
    />
  );
}

export default AccountCapabilityBulkUploadActionItem;
