import React from "react";
import { useFlatfileSpaceAccessTokenQuery } from "~/generated/dashboard/graphqlSchema";
import { expectedPaymentBlueprintFields } from "./bulk_imports/blueprints/expectedPaymentBlueprint";
import FlatfileBulkUploadButton, {
  BulkResourceType,
} from "./FlatfileBulkUploadButton";

export interface BulkImportTransactionsButtonProps {
  spaceId: string;
}

function BulkImportTransactionsButton({
  spaceId,
}: BulkImportTransactionsButtonProps): JSX.Element {
  const result = useFlatfileSpaceAccessTokenQuery({
    variables: {
      spaceId,
    },
  });

  return (
    <FlatfileBulkUploadButton
      accessToken={result.data?.flatfileSpace}
      expectedFields={expectedPaymentBlueprintFields}
      spaceId={spaceId}
      resource={BulkResourceType.ExpectedPayments}
    />
  );
}
export default BulkImportTransactionsButton;
