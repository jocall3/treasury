import React, { useState } from "react";
import { Formik, FormikProps } from "formik";
import AddressForm, {
  AddressFormValues,
  defaultAddress,
  formatAddress,
  isAddressEmpty,
} from "../../common/formik/FormikAddressForm";
import {
  Button,
  Checkbox,
  Heading,
  HorizontalRule,
  ConfirmModal,
  FieldGroup,
  Label,
  PopoverPanel,
  PopoverTrigger,
  Popover,
  Icon,
  ActionItem,
} from "../../common/ui-components";

interface AddressContainerProps {
  address: AddressFormValues;
  showAddressModal: () => void;
  deleteAddress: () => void;
  id: string;
}

function AddressContainer({
  address,
  showAddressModal,
  deleteAddress,
  id,
}: AddressContainerProps) {
  return (
    <>
      <div className="flex justify-between">
        {formatAddress(address)}
        <Popover>
          <PopoverTrigger
            className="border-none bg-white"
            buttonType="secondary"
            buttonHeight="small"
            hideFocusOutline
            id={id}
          >
            <Icon
              iconName="more_horizontal"
              color="currentColor"
              className="text-gray-600"
              size="s"
            />
          </PopoverTrigger>
          <PopoverPanel
            className="badge-action-dropdown reports-button-panel"
            anchorOrigin={{ horizontal: "right" }}
          >
            <ActionItem onClick={showAddressModal}>Edit</ActionItem>

            <ActionItem onClick={deleteAddress}>
              <div className="text-red-500">Delete</div>
            </ActionItem>
          </PopoverPanel>
        </Popover>
      </div>
      <div className="pb-2 pt-2">
        <HorizontalRule />
      </div>
    </>
  );
}

interface AddressFormSectionHeaderProps {
  addressType: AddressType;
  required: boolean;
  showAddButton: boolean;
  onAddClick: () => void;
  subheader?: string;
}

function AddressFormSectionHeader({
  addressType,
  required,
  showAddButton,
  onAddClick,
  subheader,
}: AddressFormSectionHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <div className="text-base">
              <Heading level="h2" size="m">
                {`${addressType} Address`}
              </Heading>
            </div>
            {!required && (
              <span className="pl-2 pt-1 text-xs font-normal text-gray-500">
                Optional
              </span>
            )}
          </div>
        </div>

        {showAddButton && (
          <Button onClick={onAddClick} buttonType="secondary">
            {`Add ${addressType} Address`}
          </Button>
        )}
      </div>
      <p className="font-base mt-2 text-xs text-gray-500">{subheader}</p>
    </div>
  );
}

type AddressType = "Billing" | "Party" | "Shipping" | "Sender";

interface SameAsOtherAddressProps {
  otherAddressType: AddressType;
  sameAsOtherAddress: boolean;
  onSameAsOtherAddressChange: (boolean: boolean) => void;
}

interface AddressFormSectionnProps {
  id: string;
  address: AddressFormValues;
  addressType: AddressType;
  onAddressChange: (address: AddressFormValues) => void;
  required?: boolean;
  sameAsOtherAddressProps?: SameAsOtherAddressProps;
  subheader?: string;
}

// Root for formik form state to re-use AddressForm component
const ADDRESS_FORM_ROOT_FIELD_NAME = "addressForm";
const FORM_ADDRESS_NAME = "address";

function AddressFormSection({
  id,
  address,
  addressType,
  subheader,
  onAddressChange,
  required = false,
  sameAsOtherAddressProps,
}: AddressFormSectionnProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const initialValues = {
    [ADDRESS_FORM_ROOT_FIELD_NAME]: {
      [FORM_ADDRESS_NAME]: address || defaultAddress,
    },
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(data) => onAddressChange(data.addressForm.address)}
    >
      {({
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        isValid,
      }: FormikProps<{
        [ADDRESS_FORM_ROOT_FIELD_NAME]: {
          [FORM_ADDRESS_NAME]: AddressFormValues;
        };
      }>) => (
        <>
          <div className="pb-8">
            <AddressFormSectionHeader
              addressType={addressType}
              required={required}
              subheader={subheader}
              showAddButton={
                isAddressEmpty(address) &&
                !sameAsOtherAddressProps?.sameAsOtherAddress
              }
              onAddClick={() => setShowAddressModal(true)}
            />

            <div className="pb-2 pt-2">
              <HorizontalRule />
            </div>

            {sameAsOtherAddressProps && (
              <FieldGroup direction="left-to-right" className="-mb-2">
                <Label>
                  {`Same as ${sameAsOtherAddressProps.otherAddressType} Address`}
                </Label>
                <Checkbox
                  checked={sameAsOtherAddressProps.sameAsOtherAddress}
                  onChange={sameAsOtherAddressProps.onSameAsOtherAddressChange}
                  name="isSameAsOtherAddress"
                />
              </FieldGroup>
            )}

            {!sameAsOtherAddressProps && isAddressEmpty(address) && (
              <div className="text-gray-500">None</div>
            )}

            {!isAddressEmpty(address) && (
              <>
                {sameAsOtherAddressProps &&
                  !sameAsOtherAddressProps.sameAsOtherAddress && (
                    <div className="pb-2 pt-4">
                      <HorizontalRule />
                    </div>
                  )}
                {!sameAsOtherAddressProps?.sameAsOtherAddress && (
                  <AddressContainer
                    address={address}
                    showAddressModal={() => setShowAddressModal(true)}
                    deleteAddress={() => {
                      void setFieldValue(
                        `${ADDRESS_FORM_ROOT_FIELD_NAME}.${FORM_ADDRESS_NAME}`,
                        { ...defaultAddress }
                      );
                      setTimeout(() => {
                        handleSubmit();
                      });
                    }}
                    id={`${id}Actions`}
                  />
                )}
              </>
            )}
          </div>
          <ConfirmModal
            title={`${addressType} Address`}
            isOpen={showAddressModal}
            confirmText="Save"
            setIsOpen={() => setShowAddressModal(false)}
            onConfirm={() => {
              handleSubmit();
              setShowAddressModal(false);
            }}
            confirmDisabled={!isValid}
          >
            <AddressForm
              fieldName={ADDRESS_FORM_ROOT_FIELD_NAME}
              addressName={FORM_ADDRESS_NAME}
              id={id}
              errors={errors}
              touched={touched}
            />
          </ConfirmModal>
        </>
      )}
    </Formik>
  );
}

export default AddressFormSection;
