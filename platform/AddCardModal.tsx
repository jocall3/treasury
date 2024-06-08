import React, { useState } from "react";
import requestApi from "../../common/utilities/requestApi";
import CardAcceptanceFields from "../../auth/components/sign_up/CardAcceptanceFields";
import { ConfirmModal } from "../../common/ui-components";
import { DispatchMessageFnType, useDispatchContext } from "../MessageProvider";
import Gon from "../../common/utilities/gon";

interface AddCardModalProps {
  isOpen: boolean;
  handleModalClose: () => void;
}

const submitCardDetails = (
  cardToken: string,
  expiry: string,
  dispatchSuccess: DispatchMessageFnType["dispatchSuccess"]
) => {
  requestApi("/settings/billing/update_card", null, "POST", {
    card_token: cardToken,
    expiry,
  })
    .res(() => {
      window.location.href = "/settings/billing";
      dispatchSuccess("Payment Details Updated");
    })
    .catch(() => {});
};

function AddCardModal({ isOpen, handleModalClose }: AddCardModalProps) {
  const { dispatchSuccess } = useDispatchContext();
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [cardToken, setCardToken] = useState("");
  const [expiry, setExpiry] = useState("");
  const handleCardTokenizationSuccess = (
    newCardToken: string,
    newCardExpiry: string
  ) => {
    setCardToken(newCardToken);
    setExpiry(newCardExpiry);
    setDisableSubmit(false);
  };

  const {
    ui: { cardconnectEnvironment },
  } = Gon.gon;

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Add a New Card"
      onRequestClose={handleModalClose}
      confirmText="Submit"
      onConfirm={() => submitCardDetails(cardToken, expiry, dispatchSuccess)}
      confirmDisabled={disableSubmit}
      cancelText="Cancel"
      setIsOpen={handleModalClose}
    >
      <form className="form-create">
        <div className="form-section">
          <CardAcceptanceFields
            isModal
            cardconnectEnvironment={cardconnectEnvironment}
            onCardTokenization={handleCardTokenizationSuccess}
          />
        </div>
      </form>
    </ConfirmModal>
  );
}

export default AddCardModal;
