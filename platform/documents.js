import requestApi, {
  requestFormDataApi,
} from "../../common/utilities/requestApi";

function createDocument(data) {
  return new Promise((resolve) => {
    requestFormDataApi("/documents", null, data)
      .json(() => {
        resolve();
      })
      .catch((error) => {
        resolve({ ...data, error });
      });
  });
}

// Format of documents is an object like { id1: { id , document_type , file: { ...file } } }
export function createDocuments(documentableId, documentableType, documents) {
  const numDocuments = Object.keys(documents).length;

  if (numDocuments === 0) {
    return Promise.resolve();
  }

  const promises = Object.keys(documents).reduce((acc, docId) => {
    const document = documents[docId];
    return [
      ...acc,
      createDocument({
        file: document.file,
        documentable_id: documentableId,
        documentable_type: documentableType,
        document_type: document.document_type,
        id: document.id,
      }),
    ];
  }, []);

  return new Promise((resolve) => {
    Promise.all(promises).then((failures) => resolve(failures.filter(Boolean)));
  });
}

function deleteDocument(id) {
  return new Promise((resolve) => {
    requestApi(`/documents/${id}`, null, "DELETE", {}).json(() => {
      resolve();
    });
  });
}

export function deleteDocuments(ids) {
  const numDocuments = ids.length;
  if (numDocuments === 0) {
    return Promise.resolve();
  }

  const promises = ids.map((id) => deleteDocument(id));
  return Promise.all(promises);
}
