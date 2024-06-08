import React, { useState } from "react";
import { Button, ConfirmModal } from "../../common/ui-components";
import { useAdminDeleteOrganizationMutation } from "../../generated/dashboard/graphqlSchema";
import { useDispatchContext } from "../MessageProvider";

interface DeleteOrganizationButtonProps {
  organizationId: string;
  organizationName: string;
}

function DeleteOrganizationButton({
  organizationId,
  organizationName,
}: DeleteOrganizationButtonProps) {
  const { dispatchSuccess, dispatchError } = useDispatchContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [adminDeleteOrganizationMutation, { loading: isDeleting }] =
    useAdminDeleteOrganizationMutation();
  const handleDeleteOrganization = () => {
    adminDeleteOrganizationMutation({
      variables: { input: { organizationId } },
    })
      .then(({ data: res }) => {
        if (res?.adminDeleteOrganization?.errors.length) {
          dispatchError(res?.adminDeleteOrganization?.errors.toString());
        } else {
          window.location.href = "/admin/organizations";
          dispatchSuccess("Organization successfully deleted.");
        }
      })
      .catch((e: Error) => dispatchError(e.message))
      .finally(() => setIsModalOpen(false));
  };
  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={`Are you sure you want to delete ${
          organizationName ?? "this organization"
        }?`}
        confirmDisabled={isDeleting}
        onConfirm={handleDeleteOrganization}
        confirmType="delete"
      />
      <Button
        buttonType="destructive"
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
      >
        Delete {organizationName}
      </Button>
    </>
  );
}

export default DeleteOrganizationButton;
