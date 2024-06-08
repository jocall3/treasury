import React from "react";
import { OrganizationUser } from "../../generated/dashboard/graphqlSchema";
import ApiKeySelect, { ALL_API_KEYS_ID } from "../containers/ApiKeySelect";
import UserGroupSelect from "./UserGroupSelect";

const USER = "User";
const API_KEY = "APIKey";

interface AuditActorSearchProps {
  updateQuery: (input: Query) => void;
  field: string;
  query: Query;
  actor: Record<string, string>;
  disabled?: boolean;
}

function AuditActorSearch({
  updateQuery,
  field,
  query,
  actor,
  disabled = false,
}: AuditActorSearchProps) {
  const labelField = (query.userGroupSelectedLabel ||
    query.user_group_selected_label) as string;
  const resetQuery = () =>
    updateQuery({
      [field]: undefined,
      actor_type: undefined,
      userGroupSelectedLabel: undefined,
    });

  const updateUserGroup = (value?: OrganizationUser) => {
    if (value?.user.id) {
      updateQuery({
        [field]: value.user.id,
        actor_type: USER,
        userGroupSelectedLabel: `${value.user.name ?? ""} (${
          value.user.email
        })`,
      });
    } else resetQuery();
  };

  const updateApiKey = (value: string) => {
    if (value !== ALL_API_KEYS_ID) {
      updateQuery({ [field]: value, actor_type: API_KEY });
    } else resetQuery();
  };

  const currentUserId = () => (actor.actorType === USER ? actor.actorId : null);
  const currentApiKeyId = () =>
    actor.actorType === API_KEY ? actor.actorId : null;

  const userId = currentUserId();
  const selectValue =
    userId && labelField
      ? { value: { user: { id: userId } }, label: labelField }
      : undefined;

  return (
    <>
      <ApiKeySelect
        overrideOnApiKeySelect={updateApiKey}
        overrideCurrentApiKeyId={currentApiKeyId()}
        hideLabel={false}
        disabled={disabled}
      />
      <UserGroupSelect
        onChange={updateUserGroup}
        selectValue={selectValue}
        label="User"
        disabled={disabled}
      />
    </>
  );
}

export default AuditActorSearch;
