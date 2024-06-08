import React from "react";
import { CellValueUnion } from "@flatfile/api/api";
import {
  useBulkCreateAccountCapabilitiesMutation,
  useBulkValidateAccountCapabilitiesMutation,
} from "~/generated/dashboard/graphqlSchema";
import FlatfileBulkUploadButton, {
  BulkResourceType,
} from "~/app/components/FlatfileBulkUploadButton";
import {
  accountCapabilityBlueprint,
  accountCapabilityBlueprintFields,
} from "./bulk_imports/blueprints/accountCapabilityBlueprint";

export const ACCOUNT_CAPABILITY_CSV_HEADERS =
  accountCapabilityBlueprintFields.map((field) => field.key);

interface AccountCapabilityBulkUploadActionItemProps {
  connectionId: string;
}

function AccountCapabilityBulkUploadActionItem({
  connectionId,
}: AccountCapabilityBulkUploadActionItemProps) {
  const [bulkValidateAccountCapabilities] =
    useBulkValidateAccountCapabilitiesMutation();
  const [bulkCreateAccountCapabilities] =
    useBulkCreateAccountCapabilitiesMutation();

  const validate = async (
    resultsData: Array<Record<string, CellValueUnion | null>>
  ) => {
    const response = await bulkValidateAccountCapabilities({
      variables: {
        input: {
          connectionId,
          accountCapabilities: resultsData,
        },
      },
    });
    return response.data?.bulkValidateAccountCapabilities?.recordErrors;
  };

  const submit = async (
    resultsData: Array<Record<string, CellValueUnion | null>>,
    flatfileSheetId: string,
    flatfileSpaceId: string
  ) => {
    const { data } = await bulkCreateAccountCapabilities({
      variables: {
        input: {
          connectionId,
          flatfileSheetId,
          flatfileSpaceId,
          accountCapabilities: resultsData,
        },
      },
    });

    const { id } =
      data?.bulkCreateAccountCapabilities?.connectionBulkImport ?? {};
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
      resource={BulkResourceType.AccountCapabilities}
      blueprint={accountCapabilityBlueprint}
      expectedFields={accountCapabilityBlueprintFields}
      onValidate={validate}
      onSubmit={submit}
      launchFromActionsList
    />
  );
}

export default AccountCapabilityBulkUploadActionItem;
