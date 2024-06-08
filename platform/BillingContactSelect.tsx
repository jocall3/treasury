import React, { useState } from "react";
import Select from "react-select";
import { EMAIL_REGEX } from "../constants";
import { BillingUser, User } from "../../generated/dashboard/graphqlSchema";
import { useDispatchContext } from "../MessageProvider";

type BillingContactSelectProps = {
  onChange: (email: string) => void;
  users: Pick<User, "name" | "email">[];
  billingContacts: BillingUser[];
};

const noMatchingUser = (
  users: Pick<User, "name" | "email">[],
  inputValue: string
) =>
  inputValue &&
  users.every(
    ({ name }) => !(name ?? "").toLowerCase().includes(inputValue.toLowerCase())
  );

function BillingContactSelect({
  onChange,
  users = [],
  billingContacts = [],
}: BillingContactSelectProps) {
  const [inputValue, setInputValue] = useState("");

  const { dispatchError, dispatchClearMessage } = useDispatchContext();

  const billingEmails = billingContacts.map(({ email }) => email);

  const handleInputChange = (newValue: string) => {
    const cleanedValue = newValue.replace(/,/g, "");
    setInputValue(cleanedValue);
  };

  const handleChange = ({
    value: selectedEmail,
  }: {
    value: string;
    label: string;
  }) => {
    if (!EMAIL_REGEX.test(selectedEmail)) {
      dispatchError("Please select a user or enter a valid email");
      setTimeout(() => dispatchClearMessage, 3000);
      return;
    }
    onChange(selectedEmail);
  };

  let options = users
    .map(({ email, name }) => ({ value: email, label: name }))
    .filter(({ value }) => !billingEmails.includes(value));

  if (options.length === 0 || noMatchingUser(users, inputValue)) {
    options = [{ label: `+ Add ${inputValue}`, value: inputValue }];
  }
  return (
    <div className="w-72">
      <Select
        placeholder="Search users or add email..."
        onInputChange={handleInputChange}
        value={inputValue}
        options={options}
        onChange={(selectedOption: { value: string; label: string }) =>
          handleChange(selectedOption)
        }
      />
    </div>
  );
}

export default BillingContactSelect;
