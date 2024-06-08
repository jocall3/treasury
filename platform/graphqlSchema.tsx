import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type AccordionComponent = ComponentInterface & {
  __typename?: 'AccordionComponent';
  accordionTitle: Scalars['String'];
  allowToggle?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  message: Scalars['String'];
  reduceMotion?: Maybe<Scalars['Boolean']>;
};

export type BeneficialOwnersListLayout = {
  __typename?: 'BeneficialOwnersListLayout';
  deleteButton: ButtonComponent;
  deleteComponents: Array<Component>;
  editButton: ButtonComponent;
  listComponents: Array<Component>;
  newButton: ButtonComponent;
  newComponents: Array<Component>;
  primaryButton: ButtonComponent;
};

export type BlockTextComponent = ComponentInterface & {
  __typename?: 'BlockTextComponent';
  fontSize?: Maybe<FontSizeEnum>;
  id: Scalars['String'];
  noOfLines?: Maybe<Scalars['Int']>;
  subtitle?: Maybe<Scalars['String']>;
  textAlign?: Maybe<TextAlignEnum>;
  title?: Maybe<Scalars['String']>;
};

export type ButtonComponent = ComponentInterface & {
  __typename?: 'ButtonComponent';
  actionId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  title: Scalars['String'];
  variant?: Maybe<ButtonVariantEnum>;
};

export type ButtonLayout = {
  __typename?: 'ButtonLayout';
  body: Array<Component>;
  primaryButton: ButtonComponent;
};

export enum ButtonVariantEnum {
  Default = 'default',
  Destructive = 'destructive',
  Ghost = 'ghost'
}

export type CalendarComponent = ComponentInterface & {
  __typename?: 'CalendarComponent';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<ValidationSchema>>;
  value: Scalars['String'];
};

export type CheckboxComponent = ComponentInterface & {
  __typename?: 'CheckboxComponent';
  defaultChecked?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<ValidationSchema>>;
  value: Scalars['String'];
};

export type Component = AccordionComponent | BlockTextComponent | CalendarComponent | CheckboxComponent | CurrencyAmountComponent | FormTextFieldComponent | GraphicComponent | HorizontalRuleComponent | ListItemComponent | SelectFieldComponent | StatusTextComponent | TextInputComponent;

export type ComponentError = {
  __typename?: 'ComponentError';
  componentId: Scalars['String'];
  message: Scalars['String'];
};

export type ComponentInterface = {
  id: Scalars['String'];
};

export type CurrencyAmountComponent = ComponentInterface & {
  __typename?: 'CurrencyAmountComponent';
  amount: Scalars['String'];
  currency: CurrencyEnum;
  id: Scalars['String'];
};

export enum CurrencyEnum {
  Aed = 'AED',
  Afn = 'AFN',
  All = 'ALL',
  Amd = 'AMD',
  Ang = 'ANG',
  Aoa = 'AOA',
  Ars = 'ARS',
  Aud = 'AUD',
  Awg = 'AWG',
  Azn = 'AZN',
  Bam = 'BAM',
  Bbd = 'BBD',
  Bch = 'BCH',
  Bdt = 'BDT',
  Bgn = 'BGN',
  Bhd = 'BHD',
  Bif = 'BIF',
  Bmd = 'BMD',
  Bnd = 'BND',
  Bob = 'BOB',
  Brl = 'BRL',
  Bsd = 'BSD',
  Btc = 'BTC',
  Btn = 'BTN',
  Bwp = 'BWP',
  Byn = 'BYN',
  Byr = 'BYR',
  Bzd = 'BZD',
  Cad = 'CAD',
  Cdf = 'CDF',
  Chf = 'CHF',
  Clf = 'CLF',
  Clp = 'CLP',
  Cnh = 'CNH',
  Cny = 'CNY',
  Cop = 'COP',
  Crc = 'CRC',
  Cuc = 'CUC',
  Cup = 'CUP',
  Cve = 'CVE',
  Czk = 'CZK',
  Djf = 'DJF',
  Dkk = 'DKK',
  Dop = 'DOP',
  Dzd = 'DZD',
  Eek = 'EEK',
  Egp = 'EGP',
  Ern = 'ERN',
  Etb = 'ETB',
  Eur = 'EUR',
  Fjd = 'FJD',
  Fkp = 'FKP',
  Gbp = 'GBP',
  Gbx = 'GBX',
  Gel = 'GEL',
  Ggp = 'GGP',
  Ghs = 'GHS',
  Gip = 'GIP',
  Gmd = 'GMD',
  Gnf = 'GNF',
  Gtq = 'GTQ',
  Gyd = 'GYD',
  Hkd = 'HKD',
  Hnl = 'HNL',
  Hrk = 'HRK',
  Htg = 'HTG',
  Huf = 'HUF',
  Idr = 'IDR',
  Ils = 'ILS',
  Imp = 'IMP',
  Inr = 'INR',
  Iqd = 'IQD',
  Irr = 'IRR',
  Isk = 'ISK',
  Jep = 'JEP',
  Jmd = 'JMD',
  Jod = 'JOD',
  Jpy = 'JPY',
  Kes = 'KES',
  Kgs = 'KGS',
  Khr = 'KHR',
  Kmf = 'KMF',
  Kpw = 'KPW',
  Krw = 'KRW',
  Kwd = 'KWD',
  Kyd = 'KYD',
  Kzt = 'KZT',
  Lak = 'LAK',
  Lbp = 'LBP',
  Lkr = 'LKR',
  Lrd = 'LRD',
  Lsl = 'LSL',
  Ltl = 'LTL',
  Lvl = 'LVL',
  Lyd = 'LYD',
  Mad = 'MAD',
  Mdl = 'MDL',
  Mga = 'MGA',
  Mkd = 'MKD',
  Mmk = 'MMK',
  Mnt = 'MNT',
  Mop = 'MOP',
  Mro = 'MRO',
  Mru = 'MRU',
  Mtl = 'MTL',
  Mur = 'MUR',
  Mvr = 'MVR',
  Mwk = 'MWK',
  Mxn = 'MXN',
  Myr = 'MYR',
  Mzn = 'MZN',
  Nad = 'NAD',
  Ngn = 'NGN',
  Nio = 'NIO',
  Nok = 'NOK',
  Npr = 'NPR',
  Nzd = 'NZD',
  Omr = 'OMR',
  Pab = 'PAB',
  Pen = 'PEN',
  Pgk = 'PGK',
  Php = 'PHP',
  Pkr = 'PKR',
  Pln = 'PLN',
  Pyg = 'PYG',
  Qar = 'QAR',
  Ron = 'RON',
  Rsd = 'RSD',
  Rub = 'RUB',
  Rwf = 'RWF',
  Sar = 'SAR',
  Sbd = 'SBD',
  Scr = 'SCR',
  Sdg = 'SDG',
  Sek = 'SEK',
  Sgd = 'SGD',
  Shp = 'SHP',
  Skk = 'SKK',
  Sll = 'SLL',
  Sos = 'SOS',
  Srd = 'SRD',
  Ssp = 'SSP',
  Std = 'STD',
  Svc = 'SVC',
  Syp = 'SYP',
  Szl = 'SZL',
  Thb = 'THB',
  Tjs = 'TJS',
  Tmm = 'TMM',
  Tmt = 'TMT',
  Tnd = 'TND',
  Top = 'TOP',
  Try = 'TRY',
  Ttd = 'TTD',
  Twd = 'TWD',
  Tzs = 'TZS',
  Uah = 'UAH',
  Ugx = 'UGX',
  Usd = 'USD',
  Uyu = 'UYU',
  Uzs = 'UZS',
  Vef = 'VEF',
  Ves = 'VES',
  Vnd = 'VND',
  Vuv = 'VUV',
  Wst = 'WST',
  Xaf = 'XAF',
  Xag = 'XAG',
  Xau = 'XAU',
  Xba = 'XBA',
  Xbb = 'XBB',
  Xbc = 'XBC',
  Xbd = 'XBD',
  Xcd = 'XCD',
  Xdr = 'XDR',
  Xfu = 'XFU',
  Xof = 'XOF',
  Xpd = 'XPD',
  Xpf = 'XPF',
  Xpt = 'XPT',
  Xts = 'XTS',
  Yer = 'YER',
  Zar = 'ZAR',
  Zmk = 'ZMK',
  Zmw = 'ZMW',
  Zwd = 'ZWD',
  Zwl = 'ZWL',
  Zwn = 'ZWN',
  Zwr = 'ZWR'
}

export type DateArgValidation = {
  __typename?: 'DateArgValidation';
  arg: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  type: ValidationTypeEnum;
};

export enum FontSizeEnum {
  Lg = 'lg',
  Md = 'md',
  Sm = 'sm',
  Xl = 'xl',
  Xs = 'xs'
}

export type FormTextFieldComponent = ComponentInterface & {
  __typename?: 'FormTextFieldComponent';
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type GraphicComponent = ComponentInterface & {
  __typename?: 'GraphicComponent';
  graphicName: GraphicNameEnum;
  id: Scalars['String'];
};

export enum GraphicNameEnum {
  Success = 'success'
}

export type Header = {
  __typename?: 'Header';
  status: HeaderStatusEnum;
  title: Scalars['String'];
};

export enum HeaderStatusEnum {
  EmailSent = 'email_sent',
  Error = 'error',
  Success = 'success'
}

export type HorizontalRuleComponent = ComponentInterface & {
  __typename?: 'HorizontalRuleComponent';
  id: Scalars['String'];
};

export enum IconNameEnum {
  Add = 'add',
  ArrowLargeForwardOutlined = 'arrow_large_forward_outlined',
  Flash = 'flash',
  InfoOutlined = 'info_outlined',
  Key = 'key',
  Museum = 'museum',
  Pen = 'pen',
  Star = 'star',
  User = 'user'
}

export type IntegerArgValidation = {
  __typename?: 'IntegerArgValidation';
  args: Array<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  type: ValidationTypeEnum;
};

export type ListItemComponent = ComponentInterface & {
  __typename?: 'ListItemComponent';
  bulletIconName: IconNameEnum;
  id: Scalars['String'];
  message: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  nextPane?: Maybe<NextPanePayload>;
  startWorkflow?: Maybe<StartWorkflowPayload>;
};


export type MutationNextPaneArgs = {
  input: NextPaneInput;
};


export type MutationStartWorkflowArgs = {
  input: StartWorkflowInput;
};

export type Navigation = {
  __typename?: 'Navigation';
  showBack: Scalars['Boolean'];
};

/** Autogenerated input type of NextPane */
export type NextPaneInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  nodeId: Scalars['String'];
  paneOutput: PaneOutput;
  selectedActionId: Scalars['String'];
  workflowSessionId: Scalars['ID'];
};

/** Autogenerated return type of NextPane. */
export type NextPanePayload = {
  __typename?: 'NextPanePayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<PaneOutputError>;
  nextPane?: Maybe<Pane>;
};

export type NoArgValidation = {
  __typename?: 'NoArgValidation';
  message?: Maybe<Scalars['String']>;
  type: ValidationTypeEnum;
};

export type Option = {
  __typename?: 'Option';
  icon?: Maybe<Scalars['String']>;
  label: Scalars['String'];
  value: Scalars['String'];
};

export type Pane = {
  __typename?: 'Pane';
  header?: Maybe<Header>;
  layout: PaneLayout;
  navigation: Navigation;
  nodeId: Scalars['String'];
  paneOutputType: Scalars['String'];
  showLogo: Scalars['Boolean'];
};

export type PaneLayout = BeneficialOwnersListLayout | ButtonLayout | PaymentMethodSelectLayout | PlainLayout;

export type PaneOutput =
  { accountCollectionPaneOutput: Workflows__AccountCollectionPaneOutput; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput: Workflows__BankAccountCollectionPaneOutput; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput: Workflows__BeneficialOwnersCollectionPaneOutput; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput: Workflows__EmailCollectionPaneOutput; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput: Workflows__EmptyPaneOutput; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput: Workflows__IdentityDetailsCollectionPaneOutput; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput: Workflows__PaymentDetailCollectionPaneOutput; taxpayerIdentifierCollectionPaneOutput?: never; }
  |  { accountCollectionPaneOutput?: never; bankAccountCollectionPaneOutput?: never; beneficialOwnersCollectionPaneOutput?: never; emailCollectionPaneOutput?: never; emptyPaneOutput?: never; identityDetailsCollectionPaneOutput?: never; paymentDetailCollectionPaneOutput?: never; taxpayerIdentifierCollectionPaneOutput: Workflows__TaxpayerIdentifierCollectionPaneOutput; };

export type PaneOutputError = {
  __typename?: 'PaneOutputError';
  componentErrors?: Maybe<Array<ComponentError>>;
  generalErrors?: Maybe<Array<Scalars['String']>>;
  nodeId: Scalars['String'];
};

export type PaymentMethodOption = {
  __typename?: 'PaymentMethodOption';
  actionId: Scalars['String'];
  description: Scalars['String'];
  iconName: IconNameEnum;
  paymentType?: Maybe<PaymentTypeEnum>;
  title: Scalars['String'];
};

export type PaymentMethodSelectLayout = {
  __typename?: 'PaymentMethodSelectLayout';
  body: Array<Component>;
  paymentMethodOptions: Array<PaymentMethodOption>;
};

export enum PaymentTypeEnum {
  Ach = 'ach',
  AuBecs = 'au_becs',
  Bacs = 'bacs',
  Book = 'book',
  Card = 'card',
  Chats = 'chats',
  Check = 'check',
  CrossBorder = 'cross_border',
  DkNets = 'dk_nets',
  Eft = 'eft',
  HuIcs = 'hu_ics',
  Interac = 'interac',
  Masav = 'masav',
  MxCcen = 'mx_ccen',
  Neft = 'neft',
  Nics = 'nics',
  NzBecs = 'nz_becs',
  PlElixir = 'pl_elixir',
  Provxchange = 'provxchange',
  RoSent = 'ro_sent',
  Rtp = 'rtp',
  SeBankgirot = 'se_bankgirot',
  Sen = 'sen',
  Sepa = 'sepa',
  SgGiro = 'sg_giro',
  Sic = 'sic',
  Signet = 'signet',
  Sknbi = 'sknbi',
  Wire = 'wire',
  Zengin = 'zengin'
}

export type PlainLayout = {
  __typename?: 'PlainLayout';
  body: Array<Component>;
};

export type Query = {
  __typename?: 'Query';
  test?: Maybe<Test>;
};


export type QueryTestArgs = {
  id: Scalars['ID'];
};

export type SelectFieldComponent = ComponentInterface & {
  __typename?: 'SelectFieldComponent';
  disabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  options: Array<Option>;
  placeholder?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<ValidationSchema>>;
  value: Scalars['String'];
};

/** Autogenerated input type of StartWorkflow */
export type StartWorkflowInput = {
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: InputMaybe<Scalars['String']>;
  languagePreferences?: InputMaybe<Array<Scalars['String']>>;
};

/** Autogenerated return type of StartWorkflow. */
export type StartWorkflowPayload = {
  __typename?: 'StartWorkflowPayload';
  /** A unique identifier for the client performing the mutation. */
  clientMutationId?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Scalars['String']>>;
  response?: Maybe<StartWorkflowResponse>;
};

export type StartWorkflowResponse = {
  __typename?: 'StartWorkflowResponse';
  nextPane: Pane;
  workflowSessionId: Scalars['String'];
};

export type StatusTextComponent = ComponentInterface & {
  __typename?: 'StatusTextComponent';
  id: Scalars['String'];
  status: Scalars['String'];
  updatedAt: Scalars['Date'];
};

export type Test = {
  __typename?: 'Test';
  testField: Scalars['String'];
};

export enum TextAlignEnum {
  Center = 'center',
  Left = 'left',
  Right = 'right'
}

export type TextInputComponent = ComponentInterface & {
  __typename?: 'TextInputComponent';
  id: Scalars['String'];
  inputType?: Maybe<TextInputTypeEnum>;
  label?: Maybe<Scalars['String']>;
  validationSchemas?: Maybe<Array<ValidationSchema>>;
  value: Scalars['String'];
};

export enum TextInputTypeEnum {
  Date = 'date',
  Password = 'password',
  Tel = 'tel',
  Text = 'text'
}

export type ValidationSchema = DateArgValidation | IntegerArgValidation | NoArgValidation;

export enum ValidationTypeEnum {
  AbaChecksum = 'abaChecksum',
  AbaRoutingNumber = 'abaRoutingNumber',
  AccountNumber = 'accountNumber',
  Clabe = 'clabe',
  DateOfBirth = 'dateOfBirth',
  Email = 'email',
  ExactLength = 'exactLength',
  MaxLength = 'maxLength',
  MinDate = 'minDate',
  MinLength = 'minLength',
  OnlyDigits = 'onlyDigits',
  Required = 'required',
  SwiftCode = 'swiftCode',
  TaxpayerIdentifier = 'taxpayerIdentifier',
  Website = 'website',
  WithinRange = 'withinRange'
}

export type Workflows__AccountCollectionPaneOutput = {
  abaRoutingNumber?: InputMaybe<Scalars['String']>;
  accountType?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  clabe?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  domesticAccountNumber?: InputMaybe<Scalars['String']>;
  iban?: InputMaybe<Scalars['String']>;
  ibanOptional?: InputMaybe<Scalars['String']>;
  internationalAccountNumber?: InputMaybe<Scalars['String']>;
  internationalAccountNumberOptional?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  nameOnAccount?: InputMaybe<Scalars['String']>;
  partyType?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  swiftCode?: InputMaybe<Scalars['String']>;
};

export type Workflows__BankAccountCollectionPaneOutput = {
  abaRoutingNumber?: InputMaybe<Scalars['String']>;
  accountType?: InputMaybe<Scalars['String']>;
  domesticAccountNumber?: InputMaybe<Scalars['String']>;
};

export type Workflows__BeneficialOwner = {
  city?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  relationship?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  taxpayerIdentifier?: InputMaybe<Scalars['String']>;
};

export type Workflows__BeneficialOwnersCollectionPaneOutput = {
  beneficialOwners?: InputMaybe<Array<Workflows__BeneficialOwner>>;
};

export type Workflows__EmailCollectionPaneOutput = {
  email?: InputMaybe<Scalars['String']>;
};

export type Workflows__EmptyPaneOutput = {
  unused?: InputMaybe<Scalars['String']>;
};

export type Workflows__IdentityDetailsCollectionPaneOutput = {
  city?: InputMaybe<Scalars['String']>;
  companyName?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type Workflows__PaymentDetailCollectionPaneOutput = {
  abaRoutingNumber?: InputMaybe<Scalars['String']>;
  accountType?: InputMaybe<Scalars['String']>;
  domesticAccountNumber?: InputMaybe<Scalars['String']>;
  nameOnAccount?: InputMaybe<Scalars['String']>;
  partyType?: InputMaybe<Scalars['String']>;
  reuseNewPaymentMethod?: InputMaybe<Scalars['Boolean']>;
  selectedEffectiveDate?: InputMaybe<Scalars['String']>;
  selectedExternalAccount?: InputMaybe<Scalars['String']>;
};

export type Workflows__TaxpayerIdentifierCollectionPaneOutput = {
  taxpayerIdentifier?: InputMaybe<Scalars['String']>;
};

type Component_AccordionComponent_Fragment = { __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null };

type Component_BlockTextComponent_Fragment = { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null };

type Component_CalendarComponent_Fragment = { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null };

type Component_CheckboxComponent_Fragment = { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null };

type Component_CurrencyAmountComponent_Fragment = { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum };

type Component_FormTextFieldComponent_Fragment = { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string };

type Component_GraphicComponent_Fragment = { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum };

type Component_HorizontalRuleComponent_Fragment = { __typename: 'HorizontalRuleComponent', id: string };

type Component_ListItemComponent_Fragment = { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum };

type Component_SelectFieldComponent_Fragment = { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null };

type Component_StatusTextComponent_Fragment = { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any };

type Component_TextInputComponent_Fragment = { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null };

export type ComponentFragment = Component_AccordionComponent_Fragment | Component_BlockTextComponent_Fragment | Component_CalendarComponent_Fragment | Component_CheckboxComponent_Fragment | Component_CurrencyAmountComponent_Fragment | Component_FormTextFieldComponent_Fragment | Component_GraphicComponent_Fragment | Component_HorizontalRuleComponent_Fragment | Component_ListItemComponent_Fragment | Component_SelectFieldComponent_Fragment | Component_StatusTextComponent_Fragment | Component_TextInputComponent_Fragment;

export type PaneFragment = { __typename?: 'Pane', nodeId: string, paneOutputType: string, showLogo: boolean, navigation: { __typename?: 'Navigation', showBack: boolean }, header?: { __typename?: 'Header', status: HeaderStatusEnum, title: string } | null, layout: { __typename: 'BeneficialOwnersListLayout', listComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, newComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, deleteComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'ButtonComponent', id: string, title: string, actionId?: string | null }, newButton: { __typename?: 'ButtonComponent', id: string, title: string }, deleteButton: { __typename?: 'ButtonComponent', id: string, title: string, variant?: ButtonVariantEnum | null }, editButton: { __typename?: 'ButtonComponent', id: string, title: string } } | { __typename: 'ButtonLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'ButtonComponent', id: string, title: string, actionId?: string | null } } | { __typename: 'PaymentMethodSelectLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, paymentMethodOptions: Array<{ __typename?: 'PaymentMethodOption', title: string, iconName: IconNameEnum, paymentType?: PaymentTypeEnum | null, description: string, actionId: string }> } | { __typename: 'PlainLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }> } };

type ValidationSchema_DateArgValidation_Fragment = { __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null };

type ValidationSchema_IntegerArgValidation_Fragment = { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null };

type ValidationSchema_NoArgValidation_Fragment = { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null };

export type ValidationSchemaFragment = ValidationSchema_DateArgValidation_Fragment | ValidationSchema_IntegerArgValidation_Fragment | ValidationSchema_NoArgValidation_Fragment;

export type NextPaneMutationVariables = Exact<{
  input: NextPaneInput;
}>;


export type NextPaneMutation = { __typename?: 'Mutation', nextPane?: { __typename?: 'NextPanePayload', nextPane?: { __typename?: 'Pane', nodeId: string, paneOutputType: string, showLogo: boolean, navigation: { __typename?: 'Navigation', showBack: boolean }, header?: { __typename?: 'Header', status: HeaderStatusEnum, title: string } | null, layout: { __typename: 'BeneficialOwnersListLayout', listComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, newComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, deleteComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'ButtonComponent', id: string, title: string, actionId?: string | null }, newButton: { __typename?: 'ButtonComponent', id: string, title: string }, deleteButton: { __typename?: 'ButtonComponent', id: string, title: string, variant?: ButtonVariantEnum | null }, editButton: { __typename?: 'ButtonComponent', id: string, title: string } } | { __typename: 'ButtonLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'ButtonComponent', id: string, title: string, actionId?: string | null } } | { __typename: 'PaymentMethodSelectLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, paymentMethodOptions: Array<{ __typename?: 'PaymentMethodOption', title: string, iconName: IconNameEnum, paymentType?: PaymentTypeEnum | null, description: string, actionId: string }> } | { __typename: 'PlainLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }> } } | null, errors?: { __typename?: 'PaneOutputError', nodeId: string, generalErrors?: Array<string> | null, componentErrors?: Array<{ __typename?: 'ComponentError', componentId: string, message: string }> | null } | null } | null };

export type StartWorkflowMutationVariables = Exact<{
  input: StartWorkflowInput;
}>;


export type StartWorkflowMutation = { __typename?: 'Mutation', startWorkflow?: { __typename?: 'StartWorkflowPayload', errors?: Array<string> | null, response?: { __typename?: 'StartWorkflowResponse', workflowSessionId: string, nextPane: { __typename?: 'Pane', nodeId: string, paneOutputType: string, showLogo: boolean, navigation: { __typename?: 'Navigation', showBack: boolean }, header?: { __typename?: 'Header', status: HeaderStatusEnum, title: string } | null, layout: { __typename: 'BeneficialOwnersListLayout', listComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, newComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, deleteComponents: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'ButtonComponent', id: string, title: string, actionId?: string | null }, newButton: { __typename?: 'ButtonComponent', id: string, title: string }, deleteButton: { __typename?: 'ButtonComponent', id: string, title: string, variant?: ButtonVariantEnum | null }, editButton: { __typename?: 'ButtonComponent', id: string, title: string } } | { __typename: 'ButtonLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, primaryButton: { __typename?: 'ButtonComponent', id: string, title: string, actionId?: string | null } } | { __typename: 'PaymentMethodSelectLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }>, paymentMethodOptions: Array<{ __typename?: 'PaymentMethodOption', title: string, iconName: IconNameEnum, paymentType?: PaymentTypeEnum | null, description: string, actionId: string }> } | { __typename: 'PlainLayout', body: Array<{ __typename: 'AccordionComponent', id: string, accordionTitle: string, message: string, allowToggle?: boolean | null, reduceMotion?: boolean | null } | { __typename: 'BlockTextComponent', id: string, subtitle?: string | null, fontSize?: FontSizeEnum | null, noOfLines?: number | null, textAlign?: TextAlignEnum | null, nullableTitle?: string | null } | { __typename: 'CalendarComponent', id: string, label?: string | null, value: string, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CheckboxComponent', id: string, value: string, label?: string | null, defaultChecked?: boolean | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'CurrencyAmountComponent', id: string, amount: string, currency: CurrencyEnum } | { __typename: 'FormTextFieldComponent', id: string, label?: string | null, value: string } | { __typename: 'GraphicComponent', id: string, graphicName: GraphicNameEnum } | { __typename: 'HorizontalRuleComponent', id: string } | { __typename: 'ListItemComponent', id: string, title: string, message: string, bulletIconName: IconNameEnum } | { __typename: 'SelectFieldComponent', id: string, label?: string | null, placeholder?: string | null, disabled?: boolean | null, value: string, options: Array<{ __typename?: 'Option', label: string, value: string, icon?: string | null }>, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null } | { __typename: 'StatusTextComponent', id: string, status: string, updatedAt: any } | { __typename: 'TextInputComponent', id: string, value: string, label?: string | null, type?: TextInputTypeEnum | null, validationSchemas?: Array<{ __typename: 'DateArgValidation', type: ValidationTypeEnum, arg: string, message?: string | null } | { __typename: 'IntegerArgValidation', type: ValidationTypeEnum, args: Array<number>, message?: string | null } | { __typename: 'NoArgValidation', type: ValidationTypeEnum, message?: string | null }> | null }> } } } | null } | null };

export const ValidationSchemaFragmentDoc = gql`
    fragment validationSchema on ValidationSchema {
  __typename
  ... on NoArgValidation {
    type
    message
  }
  ... on IntegerArgValidation {
    type
    args
    message
  }
  ... on DateArgValidation {
    type
    arg
    message
  }
}
    `;
export const ComponentFragmentDoc = gql`
    fragment component on Component {
  __typename
  ... on TextInputComponent {
    id
    value
    label
    type: inputType
    validationSchemas {
      ...validationSchema
    }
  }
  ... on SelectFieldComponent {
    id
    label
    placeholder
    options {
      label
      value
      icon
    }
    disabled
    value
    validationSchemas {
      ...validationSchema
    }
  }
  ... on BlockTextComponent {
    id
    nullableTitle: title
    subtitle
    fontSize
    noOfLines
    textAlign
  }
  ... on CurrencyAmountComponent {
    id
    amount
    currency
  }
  ... on FormTextFieldComponent {
    id
    label
    value
  }
  ... on CheckboxComponent {
    id
    value
    label
    defaultChecked
    validationSchemas {
      ...validationSchema
    }
  }
  ... on AccordionComponent {
    id
    accordionTitle
    message
    allowToggle
    reduceMotion
  }
  ... on GraphicComponent {
    id
    graphicName
  }
  ... on ListItemComponent {
    id
    title
    message
    bulletIconName
  }
  ... on HorizontalRuleComponent {
    id
  }
  ... on StatusTextComponent {
    id
    status
    updatedAt
  }
  ... on CalendarComponent {
    id
    label
    value
    validationSchemas {
      ...validationSchema
    }
  }
}
    ${ValidationSchemaFragmentDoc}`;
export const PaneFragmentDoc = gql`
    fragment pane on Pane {
  nodeId
  paneOutputType
  navigation {
    showBack
  }
  header {
    status
    title
  }
  layout {
    __typename
    ... on ButtonLayout {
      body {
        ...component
      }
      primaryButton {
        id
        title
        actionId
      }
    }
    ... on PaymentMethodSelectLayout {
      body {
        ...component
      }
      paymentMethodOptions {
        title
        iconName
        paymentType
        description
        actionId
      }
    }
    ... on BeneficialOwnersListLayout {
      listComponents {
        ...component
      }
      newComponents {
        ...component
      }
      deleteComponents {
        ...component
      }
      primaryButton {
        id
        title
        actionId
      }
      newButton {
        id
        title
      }
      deleteButton {
        id
        title
        variant
      }
      editButton {
        id
        title
      }
    }
    ... on PlainLayout {
      body {
        ...component
      }
    }
  }
  showLogo
}
    ${ComponentFragmentDoc}`;
export const NextPaneDocument = gql`
    mutation NextPane($input: NextPaneInput!) {
  nextPane(input: $input) {
    nextPane {
      ...pane
    }
    errors {
      nodeId
      generalErrors
      componentErrors {
        componentId
        message
      }
    }
  }
}
    ${PaneFragmentDoc}`;
export type NextPaneMutationFn = Apollo.MutationFunction<NextPaneMutation, NextPaneMutationVariables>;

/**
 * __useNextPaneMutation__
 *
 * To run a mutation, you first call `useNextPaneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNextPaneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [nextPaneMutation, { data, loading, error }] = useNextPaneMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNextPaneMutation(baseOptions?: Apollo.MutationHookOptions<NextPaneMutation, NextPaneMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<NextPaneMutation, NextPaneMutationVariables>(NextPaneDocument, options);
      }
export type NextPaneMutationHookResult = ReturnType<typeof useNextPaneMutation>;
export type NextPaneMutationResult = Apollo.MutationResult<NextPaneMutation>;
export type NextPaneMutationOptions = Apollo.BaseMutationOptions<NextPaneMutation, NextPaneMutationVariables>;
export const StartWorkflowDocument = gql`
    mutation StartWorkflow($input: StartWorkflowInput!) {
  startWorkflow(input: $input) {
    response {
      nextPane {
        ...pane
      }
      workflowSessionId
    }
    errors
  }
}
    ${PaneFragmentDoc}`;
export type StartWorkflowMutationFn = Apollo.MutationFunction<StartWorkflowMutation, StartWorkflowMutationVariables>;

/**
 * __useStartWorkflowMutation__
 *
 * To run a mutation, you first call `useStartWorkflowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartWorkflowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startWorkflowMutation, { data, loading, error }] = useStartWorkflowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStartWorkflowMutation(baseOptions?: Apollo.MutationHookOptions<StartWorkflowMutation, StartWorkflowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartWorkflowMutation, StartWorkflowMutationVariables>(StartWorkflowDocument, options);
      }
export type StartWorkflowMutationHookResult = ReturnType<typeof useStartWorkflowMutation>;
export type StartWorkflowMutationResult = Apollo.MutationResult<StartWorkflowMutation>;
export type StartWorkflowMutationOptions = Apollo.BaseMutationOptions<StartWorkflowMutation, StartWorkflowMutationVariables>;