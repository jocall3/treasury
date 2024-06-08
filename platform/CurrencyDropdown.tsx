import React from "react";
import {
  ActionItem,
  Icon,
  Popover,
  PopoverPanel,
  PopoverTrigger,
} from "../../common/ui-components";
import trackEvent from "../../common/utilities/trackEvent";
import { ACCOUNT_ACTIONS } from "../../common/constants/analytics";

type CurrencyDropdownProps = {
  currencies: string[];
  selectedCurrency: string | null;
  setSelectedCurrency: (currency: string) => void;
  setGlobalDateFilterLabel?: () => void;
};

export default function CurrencyDropdown(props: CurrencyDropdownProps) {
  const {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    setGlobalDateFilterLabel,
  } = props;

  return currencies.length < 2 ? null : (
    <Popover>
      <PopoverTrigger buttonType="secondary">
        <Icon iconName="money_vs" size="s" />
        <div className="w-px border-l border-gray-200">&nbsp;</div>
        <div>{selectedCurrency ?? currencies[0]}</div>
        <Icon
          iconName="chevron_down"
          size="s"
          color="currentColor"
          className="text-gray-300"
        />
      </PopoverTrigger>
      <PopoverPanel anchorOrigin={{ horizontal: "right" }}>
        {(panelProps: { close: () => void }) => (
          <>
            {currencies.map((currency) => (
              <ActionItem
                key={currency}
                onClick={() => {
                  trackEvent(
                    null,
                    ACCOUNT_ACTIONS.CHANGED_GLOBAL_CURRENCY_FILTER,
                    {
                      path: window.location.pathname,
                    }
                  );
                  if (setGlobalDateFilterLabel) setGlobalDateFilterLabel();
                  setSelectedCurrency(currency);
                  panelProps.close();
                }}
              >
                <div id="payment-order">{currency}</div>
              </ActionItem>
            ))}
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}
