import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import moment from "moment-timezone";
import { cn } from "~/common/utilities/cn";
import CallScheduled from "./CallScheduled";
import ChilipiperScheduler, {
  ChilipiperEvent,
} from "../../partner_search/components/ChilipiperScheduler";
import {
  useChilipiperUserEventsQuery,
  useUpsertChilipiperEventMutation,
} from "../../generated/dashboard/graphqlSchema";

interface ScheduleACallContainerProps {
  routerName: string;
  extraTrackInfo?: Record<string, string>;
  sandboxLink?: string;
}

function CallScheduler({
  routerName,
  extraTrackInfo = {},
  sandboxLink,
}: ScheduleACallContainerProps) {
  const [reschedulerOpen, setReschedulerOpen] = useState<boolean>(false);
  const [upsertChilipiperEvent] = useUpsertChilipiperEventMutation();
  const { data, loading, error, refetch } = useChilipiperUserEventsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      routerName,
      reschedulable: true,
    },
  });

  const scheduledCalls =
    loading || !data || error
      ? []
      : data.chilipiperUserEvents.edges.map(({ node }) => node);
  const upcomingCall = scheduledCalls.length > 0 ? scheduledCalls[0] : null;

  const updateChilipiperEvent = async ({
    args: { slot, eventId },
  }: ChilipiperEvent) => {
    const upsertChilipiperEventMutationInput = {
      id: upcomingCall?.id,
      slotStart: moment(slot.start).toISOString(),
      slotEnd: moment(slot.end).toISOString(),
      eventId,
      routerName,
    };
    await upsertChilipiperEvent({
      variables: {
        input: {
          input: upsertChilipiperEventMutationInput,
        },
      },
    });
    await refetch();
    setReschedulerOpen(false);
  };

  return loading ? (
    <ClipLoader />
  ) : (
    <div
      className={cn(
        "flex flex-col items-center space-y-2",
        upcomingCall && "rounded border"
      )}
    >
      {upcomingCall && (
        <CallScheduled
          chilipiperEvent={upcomingCall}
          onRescheduleClick={() => setReschedulerOpen(!reschedulerOpen)}
          sandboxLink={sandboxLink}
        />
      )}
      {(!upcomingCall || reschedulerOpen) && (
        <ChilipiperScheduler
          chiliPiperRouterName={routerName}
          bookingConfirmedCallback={updateChilipiperEvent}
          action={upcomingCall ? "reschedule" : "schedule"}
          rescheduledCallback={updateChilipiperEvent}
          extraTrackInfo={extraTrackInfo}
          chiliPiperEventId={upcomingCall?.eventId}
        />
      )}
    </div>
  );
}

export default CallScheduler;
