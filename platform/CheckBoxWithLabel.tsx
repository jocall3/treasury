import React from "react";
import { Checkbox, Label } from "~/common/ui-components";

interface CheckBoxWithLabelProps {
  id: string;
  name: string;
  label: string;
  value: boolean;
  onToggle: () => void;
}

function CheckboxWithLabel({
  id,
  name,
  label,
  value,
  onToggle,
}: CheckBoxWithLabelProps) {
  return (
    <div className="flex items-center rounded-sm outline-none transition-colors hover:cursor-pointer hover:bg-gray-25 focus:outline-none">
      <div className="flex w-full justify-center px-2 py-1">
        <div className="flex flex-row gap-2">
          <Checkbox checked={value} onChange={onToggle} id={id} name={name} />
          <Label className="font-medium" id={id}>
            {label}
          </Label>
        </div>
      </div>
    </div>
  );
}

export default CheckboxWithLabel;
