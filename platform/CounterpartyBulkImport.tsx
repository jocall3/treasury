import React from "react";
import { CellValueUnion } from "@flatfile/api/api";
import {
  useBulkCreateCounterpartiesMutation,
  useBulkValidateCounterpartiesMutation,
} from "../../generated/dashboard/graphqlSchema";
import { BulkResourceType } from "./FlatfileBulkUploadButton";
import BulkImportHeader from "./BulkImportHeader";
import { PageHeader } from "../../common/ui-components/PageHeader/PageHeader";
import {
  counterpartyBlueprint,
  counterpartyBlueprintFields,
} from "./bulk_imports/blueprints/counterpartyBlueprint";

function CounterpartyBulkImport(): JSX.Element {
  const [bulkCreateCounterparties] = useBulkCreateCounterpartiesMutation();
  const [bulkValidateCounterparties] = useBulkValidateCounterpartiesMutation();

  const submit = async (
    resultsData: Array<Record<string, CellValueUnion | null>>,
    flatfileSheetId: string,
    flatfileSpaceId: string
  ) => {
    const { data } = await bulkCreateCounterparties({
      variables: {
        input: {
          counterparties: resultsData,
          flatfileSheetId,
          flatfileSpaceId,
        },
      },
    });
    const { bulkImportId } = data?.bulkCreateCounterparties ?? {};
    if (bulkImportId) {
      return { success: true, bulkImportId };
    }
    return { success: false, bulkImportId: "" };
  };

  const validate = async (
    resultsData: Array<Record<string, CellValueUnion | null>>
  ) => {
    const response = await bulkValidateCounterparties({
      variables: {
        input: {
          counterparties: resultsData,
        },
      },
    });
    return response.data?.bulkValidateCounterparties?.recordErrors;
  };

  return (
    <PageHeader
      crumbs={[
        {
          name: "Counterparties",
          path: "/counterparties",
        },
      ]}
      title="Bulk Imports"
    >
      <BulkImportHeader
        bulkImportType="Counterparty"
        validate={validate}
        submit={submit}
        expectedFields={counterpartyBlueprintFields}
        blueprint={counterpartyBlueprint}
        resource={BulkResourceType.Counterparties}
      />
    </PageHeader>
  );
}

export default CounterpartyBulkImport;
