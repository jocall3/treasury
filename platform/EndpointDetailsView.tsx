import React from "react";
import moment from "moment";
import { EndpointDetailsViewQuery } from "../../generated/dashboard/graphqlSchema";
import {
  DateTime,
  KeyValueTable,
  KeyValueTableSkeletonLoader,
} from "../../common/ui-components";
import ContentDownloadButton from "./ContentDownloadButton";
import toShortId from "../../common/utilities/toShortId";

const MAPPING = {
  id: "ID",
  username: "Username",
  organizationName: "Organization Name",
  description: "Description",
  protocol: "Protocol",
  host: "Host",
  port: "Port",
  cleanAfterRead: "Clean After Read?",
  publicKey: "Public Key", // copyable, wrapped, codeblock
  clientCertificate: "Client Certificate",
  encryptionStrategy: "Encryption Strategy",
  decryptionStrategy: "Decryption Strategy",
  publicEncryptionKey: "Public Encryption Key",
  signingStrategy: "Signing Strategy",
  publicSigningKey: "Public Signing Key",
  signingCertificate: "Signing Certificate",
  createdAt: "Created At",
};

type Endpoint = EndpointDetailsViewQuery["endpoint"];

interface EndpointDetailsViewProps {
  endpoint?: Endpoint;
}

interface ToFilenameArgs {
  endpoint: Endpoint;
  descriptor: string;
  extension: string;
}
function toFilename({ endpoint, descriptor, extension }: ToFilenameArgs) {
  const orgName = endpoint.organizationName?.replace(/\s/g, "_") ?? "";
  const date = moment().format("YYYY-MM-DD");
  const shortId = toShortId(endpoint.id);
  const name = [orgName, shortId, date, descriptor]
    .filter((n) => !!n)
    .join("_");
  return `${name}.${extension}`;
}

function formatEndpoint(endpoint: Endpoint) {
  return {
    ...endpoint,
    publicKey: endpoint.publicKey && (
      <ContentDownloadButton
        filename={toFilename({ endpoint, descriptor: "rsa", extension: "pub" })}
        content={endpoint.publicKey}
      >
        Download SSH Key
      </ContentDownloadButton>
    ),
    signingCertificate: endpoint.signingCertificate && (
      <ContentDownloadButton
        filename={toFilename({
          endpoint,
          descriptor: "signing_cert",
          extension: "pem",
        })}
        content={endpoint.signingCertificate}
      >
        Download Signing Certificate
      </ContentDownloadButton>
    ),
    clientCertificate: endpoint.clientCertificate && (
      <ContentDownloadButton
        filename={toFilename({
          endpoint,
          descriptor: "client_cert",
          extension: "pem",
        })}
        content={endpoint.clientCertificate}
      >
        Download Client Certificate
      </ContentDownloadButton>
    ),
    publicSigningKey: endpoint.publicSigningKey && (
      <ContentDownloadButton
        filename={toFilename({ endpoint, descriptor: "pgp", extension: "pub" })}
        content={endpoint.publicSigningKey}
      >
        Download Public Signing Key
      </ContentDownloadButton>
    ),
    createdAt: <DateTime timestamp={endpoint.createdAt} />,
    cleanAfterRead: endpoint.cleanAfterRead ? "True" : "False",
  };
}

function EndpointDetailsView({ endpoint }: EndpointDetailsViewProps) {
  return endpoint ? (
    <>
      <KeyValueTable
        key={endpoint.id}
        data={formatEndpoint(endpoint) ?? []}
        dataMapping={MAPPING}
      />
      <div className="mt-4" />
    </>
  ) : (
    <KeyValueTableSkeletonLoader dataMapping={MAPPING} />
  );
}

export default EndpointDetailsView;
