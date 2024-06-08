import React from "react";
import { useDispatch } from "react-redux";
import moment from "moment-timezone";
import { Button } from "../../common/ui-components";
import { toggleLiveMode } from "../actions";
import { ChilipiperEvent } from "../../generated/dashboard/graphqlSchema";

interface CallScheduledProps {
  chilipiperEvent: ChilipiperEvent;
  onRescheduleClick: () => void;
  sandboxLink?: string;
}

function CallScheduled({
  chilipiperEvent,
  onRescheduleClick,
  sandboxLink = "/",
}: CallScheduledProps) {
  const dispatch = useDispatch();

  const returnToSandbox = () => {
    dispatch(toggleLiveMode(sandboxLink, false));
  };

  const renderDateTime = (dateTime: string) => (
    <p className="text-black">
      {moment(dateTime).format("MMMM Do YYYY, h:mm a")}
    </p>
  );

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h3 className="text-xl">Call scheduled</h3>
      <p className="text-sm text-text-muted">
        We’re looking forward to meeting you at
      </p>
      <div className="flex">
        {renderDateTime(chilipiperEvent.slotStart)}
        &nbsp;to&nbsp;
        {renderDateTime(chilipiperEvent.slotEnd)}
      </div>
      <p className="mb-4 text-sm text-text-muted">
        Until then, you have full access to your sandbox environment.
      </p>
      {sandboxLink && (
        <div className="flex w-full flex-col space-y-4">
          <Button buttonType="primary" fullWidth onClick={returnToSandbox}>
            Return to Sandbox
          </Button>
          <Button buttonType="primary" fullWidth onClick={onRescheduleClick}>
            Reschedule Call
          </Button>
        </div>
      )}
    </div>
  );
}
export default CallScheduled;
