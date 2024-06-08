import { Field, Formik, FormikProps } from "formik";
import moment from "moment";
import React, { Ref } from "react";
import * as Yup from "yup";
import { FormikErrorMessage, FormikSelectField } from "../../../common/formik";
import FormikMultiSelectField from "../../../common/formik/FormikMultiSelectField";
import { Label } from "../../../common/ui-components";
import {
  DaysOfWeekEnum,
  EveryEnum,
  Schedule,
  ScheduleInput,
} from "../../../generated/dashboard/graphqlSchema";
import {
  DAY_OF_WEEK_OPTIONS,
  getOrdinalNumberOptions,
  getTimeOfDayOptions,
  TIME_ZONE_OPTIONS,
  SCHEDULING_FREQUENCY_OPTIONS,
  TimeOfDayIncrement,
} from "../../constants";

export const DEFAULT_VALUES: ScheduleFormValues = {
  frequency: EveryEnum.Week,
  daysOfWeek: [],
  daysOfMonth: 1,
  timeOfDay: 12,
  timeZone: moment.tz.guess(true),
};

const FREQUENCY_ERROR = "Please select a valid schedule frequency.";
const DAYS_OF_WEEK_ERROR = "Please select at least one day of the week.";
const DAYS_OF_MONTH_ERROR = "Please select a valid day.";
const TIME_OF_DAY_ERROR = "Please select a valid hour.";
const TIME_ZONE_ERROR = "Please select a valid time zone.";

const VALIDATION_SCHEMA = Yup.object({
  frequency: Yup.string().required(FREQUENCY_ERROR),
  daysOfWeek: Yup.array().when("frequency", {
    is: (frequency) => frequency === EveryEnum.Week,
    then: Yup.array().min(1, DAYS_OF_WEEK_ERROR).required(DAYS_OF_WEEK_ERROR),
  }),
  daysOfMonth: Yup.number().when("frequency", {
    is: (frequency) => (frequency && frequency === EveryEnum.Month) as boolean,
    then: Yup.number()
      .min(1, DAYS_OF_MONTH_ERROR)
      .max(31, DAYS_OF_MONTH_ERROR)
      .required(DAYS_OF_MONTH_ERROR),
  }),
  timeOfDay: Yup.number()
    .min(0, TIME_OF_DAY_ERROR)
    .max(23, TIME_OF_DAY_ERROR)
    .required(TIME_OF_DAY_ERROR),
  timeZone: Yup.string().required(TIME_ZONE_ERROR),
});

export type ScheduleFormValues = {
  frequency: EveryEnum;
  daysOfWeek: DaysOfWeekEnum[];
  daysOfMonth: number;
  timeOfDay: number;
  timeZone: string;
};

interface ScheduleFormProps {
  initialValues: ScheduleFormValues;
  formRef?: Ref<FormikProps<ScheduleFormValues>>;
}

export function scheduleFormValuesToInputType(
  formValues: ScheduleFormValues
): ScheduleInput {
  const { frequency, daysOfWeek, daysOfMonth, timeOfDay, timeZone } =
    formValues;

  const date = new Date();
  date.setUTCHours(Math.floor(timeOfDay), 60 * (timeOfDay % 1), 0);
  const scheduleInputValues: ScheduleInput = {
    every: frequency,
    timeZone,
    scheduledTime: date.toISOString(),
  };

  if (frequency === EveryEnum.Week) {
    scheduleInputValues.daysOfWeek = daysOfWeek;
  } else if (frequency === EveryEnum.Month) {
    scheduleInputValues.daysOfMonth = [daysOfMonth];
  }

  return scheduleInputValues;
}

export function scheduleInputTypeToFormValues(
  scheduleValues: Pick<
    Schedule,
    "daysOfMonth" | "daysOfWeek" | "every" | "timeZone" | "scheduledTime"
  >
): ScheduleFormValues {
  const { every, daysOfMonth, daysOfWeek, timeZone } = scheduleValues;

  const scheduleFormValues: ScheduleFormValues = {
    frequency: every,
    timeOfDay: scheduleValues.scheduledTime
      ? new Date(scheduleValues.scheduledTime).getUTCHours()
      : DEFAULT_VALUES.timeOfDay,
    daysOfMonth:
      every === EveryEnum.Month && daysOfMonth && daysOfMonth.length > 0
        ? daysOfMonth[0]
        : 1,
    daysOfWeek: every === EveryEnum.Week && daysOfWeek ? daysOfWeek : [],
    timeZone,
  };

  return scheduleFormValues;
}

function ScheduleForm({ initialValues, formRef }: ScheduleFormProps) {
  function sendOnOptions(frequency: EveryEnum) {
    switch (frequency) {
      case EveryEnum.Week:
        return DAY_OF_WEEK_OPTIONS;
      case EveryEnum.Month:
        return getOrdinalNumberOptions(31);
      default:
        return [];
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={VALIDATION_SCHEMA}
      onSubmit={() => undefined}
      innerRef={formRef}
    >
      {({ values }) => {
        const sendOnInput =
          values.frequency === EveryEnum.Week ? "daysOfWeek" : "daysOfMonth";

        return (
          <div>
            <div className="mb-4">
              <Label className="mb-1 text-sm font-medium">Frequency</Label>
              <Field
                name="frequency"
                component={FormikSelectField}
                options={SCHEDULING_FREQUENCY_OPTIONS}
              />
              <FormikErrorMessage name="frequency" />
            </div>
            {values?.frequency !== EveryEnum.Day && (
              <div className="mb-4">
                <Label className="mb-1 text-sm font-medium">Send on</Label>
                {values.frequency === EveryEnum.Month &&
                  values.daysOfMonth > 28 && (
                    <p className="mb-2 text-gray-500">
                      During months with fewer than {values.daysOfMonth} days,
                      this schedule will be triggered on the last day of the
                      month.
                    </p>
                  )}
                <Field
                  name={sendOnInput}
                  component={
                    sendOnInput === "daysOfWeek"
                      ? FormikMultiSelectField
                      : FormikSelectField
                  }
                  options={sendOnOptions(values.frequency)}
                  showOptionCheckbox={sendOnInput === "daysOfWeek"}
                  isClearable={false}
                />
                <FormikErrorMessage name={sendOnInput} />
              </div>
            )}
            <div className="flex">
              <div className="mr-2 w-1/3">
                <Label className="mb-1 text-sm font-medium">Hour</Label>
                <Field
                  name="timeOfDay"
                  component={FormikSelectField}
                  options={getTimeOfDayOptions(TimeOfDayIncrement.Hour)}
                />
                <FormikErrorMessage name="timeOfDay" />
              </div>
              <div className="ml-2 w-2/3">
                <Label className="mb-1 text-sm font-medium">Time zone</Label>
                <Field
                  name="timeZone"
                  component={FormikSelectField}
                  options={TIME_ZONE_OPTIONS}
                />
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default ScheduleForm;
