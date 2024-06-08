import React from "react";
import {
  Heading,
  Modal,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalHeading,
  ModalTitle,
} from "../../common/ui-components";
import Gon from "../../common/utilities/gon";

interface CancelPlanModalProps {
  isOpen: boolean;
  handleModalClose: () => void;
}

function CancelPlanModal({ isOpen, handleModalClose }: CancelPlanModalProps) {
  const { organization } = Gon.gon;
  const organizationName = organization?.name ?? "";
  return (
    <Modal
      isOpen={isOpen}
      title="Cancel Subscription?"
      onRequestClose={handleModalClose}
    >
      <ModalContainer>
        <ModalHeader>
          <ModalHeading>
            <ModalTitle>
              <Heading level="h3" size="l">
                Cancel Subscription?
              </Heading>
            </ModalTitle>
          </ModalHeading>
        </ModalHeader>
        <ModalContent>
          Cancelling your subscription cannot be undone.
          <br />
          <br />
          - Cancelling your subscription will also result in loss of access to
          your live accounts, including API access.
          <br />
          - Any existing payments that were already sent to the bank will be
          processed by your bank.
          <br />
          - We recommend that you export your data before cancelling.
          <br />
          <br />
          Please{" "}
          <a
            href={`mailto:support@moderntreasury.com?subject=Plan Cancellation Request for ${organizationName}`}
          >
            contact Modern Treasury support (support@moderntreasury.com)
          </a>{" "}
          to cancel your account.
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}

export default CancelPlanModal;
