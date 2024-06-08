import React from "react";
import {
  Decision__ScoreEnum,
  Verification,
  VerificationProviderEnum,
} from "../../../generated/dashboard/graphqlSchema";
import RiskLevelIndicator from "./RiskLevelIndicator";
import {
  IndexTable,
  KeyValueTableSkeletonLoader,
  KeyValueTable,
} from "../../../common/ui-components";

const KYB_WATCHLISTS_DATA_MAPPING = {
  organization: "Organization",
  title: "Title",
  agency: "Agency",
  status: "Status",
};

const KYC_WATCHLISTS_DATA_MAPPING = {
  sourceName: "Source Name",
  type: "Type",
  description: "Description",
};

const ENTITY_INFORMATION_DATA_MAPPING = {
  entityName: "Entity Name",
  matchScore: "Match Score",
  riskScore: "Risk Score",
  dobs: "Date of Birth(s)",
  countryCodes: "Country Codes",
};

interface KYBWatchlist {
  organization: string;
  title: string;
  agency: string;
  results: {
    entityName: string;
  }[];
}

interface KYBVerificationResult {
  other: OtherKYBVerificationResult;
}

interface OtherKYBVerificationResult {
  watchlist: {
    lists: KYBWatchlist[];
  };
}

const SOURCE_TYPES_MAPPING = {
  sanction: "Sanction",
  pep: "Politically Exposed Person",
  adverseMedia: "Adverse Media",
};

interface Source {
  sourceName: string;
  sourceUrl: string;
  description: string;
  type: string;
}

interface KYCWatchlist {
  entityName: string;
  matchScore: number;
  riskScore: number;
  countryCodes: string[];
  dobs: string[];
  sources: Source[];
}

interface KYCVerificationResult {
  aml: KYCWatchlist;
}

interface WatchlistsProps {
  verification: Verification | null;
}

const getKYBWatchlistsData = (verification: Verification) => {
  const verificationResult = JSON.parse(
    verification.result
  ) as KYBVerificationResult;
  const watchlists = verificationResult?.other?.watchlist?.lists || [];

  const rows = watchlists.map((watchlist) => {
    const hits = watchlist.results.length > 0;
    const riskLevel = hits
      ? Decision__ScoreEnum.VeryHigh
      : Decision__ScoreEnum.Low;
    const status = hits
      ? watchlist.results.map((result) => result.entityName).join(", ")
      : "No hits";

    const statusComponent = (
      <RiskLevelIndicator formatterOrText={status} riskLevel={riskLevel} />
    );

    return {
      organization: watchlist.organization,
      title: watchlist.title,
      agency: watchlist.agency,
      status: statusComponent,
    };
  });

  return rows;
};

const getKYCWatchlistsData = (verification: Verification) => {
  const verificationResult = JSON.parse(
    verification.result
  ) as KYCVerificationResult;

  const watchlist = verificationResult?.aml;
  const entityName = watchlist?.entityName;
  const matchScore = watchlist?.matchScore?.toString();
  const riskScore = watchlist?.riskScore?.toString();

  const sources = watchlist?.sources || [];
  const countryCodes = watchlist?.countryCodes?.join(", ");
  const dobs = watchlist?.dobs?.join(", ");

  const formattedSources = sources.map((source) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const formattedType = SOURCE_TYPES_MAPPING[source.type];

    const sourceNameUrl = <a href={source.sourceUrl}>{source.sourceName}</a>;

    return {
      sourceName: sourceNameUrl,
      description: source.description,
      type: formattedType as string,
    };
  });

  return {
    entityInformation: {
      entityName,
      matchScore,
      riskScore,
      countryCodes,
      dobs,
    },
    formattedSources,
  };
};

function Watchlists({ verification }: WatchlistsProps) {
  if (!verification || !verification.result) {
    return <KeyValueTableSkeletonLoader />;
  }

  const isKyb = verification.provider === VerificationProviderEnum.Middesk;

  const KYCWatchlistsData = getKYCWatchlistsData(verification);

  return (
    <div>
      {isKyb ? (
        <IndexTable
          data={getKYBWatchlistsData(verification)}
          dataMapping={KYB_WATCHLISTS_DATA_MAPPING}
          styleMapping={{
            status: "table-entry-wide",
          }}
        />
      ) : (
        <>
          <div className="kyc-key-value-table">
            <KeyValueTable
              data={KYCWatchlistsData.entityInformation}
              dataMapping={ENTITY_INFORMATION_DATA_MAPPING}
            />
          </div>
          <p className="mb-5 mt-10 text-base font-medium">Sources</p>
          <div className="kyc-index-table">
            <IndexTable
              data={KYCWatchlistsData.formattedSources}
              dataMapping={KYC_WATCHLISTS_DATA_MAPPING}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Watchlists;
