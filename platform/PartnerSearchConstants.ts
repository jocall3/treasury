export const QUESTION_TEXT_MAPPING: Record<string, string> = {
  directTransmissionEnabled:
    "Is your company able to programmatically move money " +
    "(Direct transmission via SFTP or API) with the banks you've added?",
  companyWebsite: "What is your company's website?",
  companyLocation: "Where is your company based?",
  companyType: "What is your company type?",
  industry: "Industry",
  companyRoleDescription:
    "Please describe your company and role in 2-3 sentences.",
  fundingRound: "Funding Round",
  moneyRaised: "Total funds raised",
  monthlyTransactionVolume: "Volume moved per month",
  monthlyTransactionCount: "Transactions per month",
  paymentsUseCase: "Which use case(s) best represents your needs?",
  bankingServices: "Which banking service do you plan on using?",
  flowOfFunds: "Please describe your flow of funds in 2-3 sentences.",
  activeComplianceProgram:
    "Does your company have an active compliance program in place?",
  complianceExistingDescription: "Briefly describe your compliance program.",
  targetGoLiveDate: "What's your target go-live date?",
  commentsAndQuestions:
    "Any comments or questions you'd like our team to be aware of or answer?",
  hasExistingBanks: "Do you have any existing banking relationships?",
};

export const ANSWER_OPTIONS_MAPPING: Record<
  string,
  Array<{ label: string; value: string }>
> = {
  directTransmissionEnabled: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Unsure", value: "unsure" },
  ],
  companyLocation: [
    { label: "US only", value: "us_only" },
    { label: "International", value: "international" },
    { label: "Both", value: "both" },
  ],
  companyType: [
    { label: "LLC", value: "llc" },
    { label: "Delaware C-Corp", value: "delaware_c_corp" },
    { label: "S-Corp", value: "s_corp" },
    { label: "Non-profit", value: "non_profit" },
    { label: "Sole proprietorship", value: "sole_proprietorship" },
    { label: "General partnership", value: "general_partnership" },
    { label: "Limited partnership", value: "limited_partnership" },
    { label: "Joint venture", value: "joint_venture" },
    { label: "Other", value: "other" },
  ],
  industry: [
    { label: "Marketplace", value: "marketplace" },
    { label: "Lending", value: "lending" },
    { label: "Investing", value: "investing" },
    { label: "Bill Pay", value: "bill_pay" },
    { label: "Insurance", value: "insurance" },
    { label: "Expense Management", value: "expense_management" },
    { label: "Payroll", value: "payroll" },
    { label: "Crypto", value: "crypto" },
    { label: "Real Estate Tech", value: "real_estate_tech" },
    { label: "SaaS", value: "software_as_a_service" },
    { label: "Fintech Infrastructure", value: "fintech_infrastructure" },
    { label: "Benefits", value: "benefits" },
    { label: "Payment Processing", value: "payment_processing" },
    { label: "Banking", value: "banking" },
    { label: "Fund Admin", value: "fund_admin" },
    { label: "AP AR Automation", value: "ap_ar_automation" },
  ],
  fundingRound: [
    { label: "Pre-Seed", value: "pre_seed" },
    { label: "Seed", value: "seed" },
    { label: "Series A", value: "series_a" },
    { label: "Series B", value: "series_b" },
    { label: "Series C", value: "series_c" },
    { label: "Series D and more", value: "series_d" },
    { label: "Public", value: "public" },
    { label: "Other", value: "other" },
  ],
  moneyRaised: [
    { label: "$0 - $500k", value: "0_500k" },
    { label: "$500k - $5m", value: "500k_5m" },
    { label: "$5m - $25m", value: "5m_25m" },
    { label: "$25m - $100m", value: "25m_100m" },
    { label: "$100m - $1bn", value: "100m_1b" },
    { label: "Over $1bn", value: "over_1b" },
    { label: "Not yet live", value: "not_live" },
  ],
  monthlyTransactionVolume: [
    { label: "$0 - $100k", value: "0_100k" },
    { label: "$100k - $1m", value: "100k_1m" },
    { label: "$1m - $10m", value: "1m_10m" },
    { label: "$10m - $100m", value: "10m_100m" },
    { label: "$100m - $1bn", value: "100m_1b" },
    { label: "Over $1bn", value: "over_1b" },
    { label: "Not yet live", value: "not_live" },
  ],
  monthlyTransactionCount: [
    { label: "0 - 100", value: "0_100" },
    { label: "100 - 1k", value: "100_1k" },
    { label: "1k - 10k", value: "1k_10k" },
    { label: "10k - 100k", value: "10k_100k" },
    { label: "Over 100k", value: "over_100k" },
    { label: "Not yet live", value: "not_live" },
  ],
  paymentsUseCase: [
    { label: "Automatic Payouts", value: "automatic_payouts" },
    { label: "Incoming Payments", value: "incoming_payments" },
    { label: "Cash Management", value: "cash_management" },
    { label: "Digital Wallets", value: "digital_wallets" },
    { label: "Direct Debits", value: "direct_debits" },
    { label: "Investing Operations", value: "investing_operations" },
    { label: "Loan Servicing", value: "loan_servicing" },
    { label: "Fiat On-ramp", value: "fiat_on_ramp" },
    { label: "Other", value: "other" },
  ],
  bankingServices: [
    { label: "ACH Debit", value: "ach_debit" },
    { label: "ACH Credit", value: "ach_credit" },
    { label: "Wire", value: "wire" },
    { label: "RTP", value: "rtp" },
    { label: "EFT", value: "eft" },
    { label: "Checks", value: "checks" },
    { label: "Lockbox", value: "lockbox" },
    { label: "Virtual Accounts", value: "virtual_accounts" },
    { label: "SWIFT Wires", value: "swift_wires" },
    { label: "FX", value: "fx" },
    { label: "Push To Card", value: "push_to_card" },
    { label: "Card Issuing", value: "card_issuing" },
    { label: "Other", value: "other" },
  ],
  activeComplianceProgram: [
    { label: "Yes, we have a compliance plan in place", value: "yes" },
    { label: "No, there isn't a compliance program currently", value: "no" },
    { label: "Unsure", value: "unsure" },
  ],
  hasExistingBanks: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};
