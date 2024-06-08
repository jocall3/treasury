import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ClipLoader } from "react-spinners";
import { cn } from "~/common/utilities/cn";
import trackEvent from "../../common/utilities/trackEvent";

interface ChiliPiperSchedulerProps {
  extraTrackInfo?: Record<string, string>;
  chiliPiperRouterName: string;
  bookingConfirmedCallback: (eventData: ChilipiperEvent) => Promise<void>;
  rescheduledCallback: (eventData: ChilipiperEvent) => Promise<void>;
  action: ChiliPiperScheduleAction;
  chiliPiperEventId?: string;
}

export interface ChilipiperEvent {
  action: string;
  args: {
    actionType: string;
    assigneeId: string;
    routeId: string;
    eventId: string;
    slot: {
      start: number;
      end: number;
    };
  };
}

export type ChiliPiperScheduleAction = "reschedule" | "schedule";

const CHILI_PIPER_TENANT_DOMAIN = "moderntreasury";
const CHILI_PIPER_API_HOST_FOR_HUBSPOT_CRM = "https://api.na.chilipiper.com";

type ChiliPiperJSONResponse = { url: string };

function ChilipiperScheduler({
  extraTrackInfo = {},
  chiliPiperRouterName,
  bookingConfirmedCallback,
  rescheduledCallback,
  action = "schedule",
  chiliPiperEventId,
}: ChiliPiperSchedulerProps) {
  const history = useHistory();
  const [chiliPiperIframeUrl, setChiliPiperIframeUrl] = useState("");

  useEffect(() => {
    const fetchChiliPiperCalendarUrl = async () => {
      const { userName, userEmail } = window.gon.ui;
      const chiliPiperResponse = await fetch(
        `${CHILI_PIPER_API_HOST_FOR_HUBSPOT_CRM}/marketing/${CHILI_PIPER_TENANT_DOMAIN}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            form: {
              firstname: userName?.split(" ")[0],
              lastname: userName?.split(" ")[1] || "",
              email: userEmail,
            },
            options: {
              router: chiliPiperRouterName,
              map: false,
            },
          }),
        }
      );

      const { url } =
        (await chiliPiperResponse.json()) as ChiliPiperJSONResponse;

      setChiliPiperIframeUrl(url);
    };

    const receiveMessage = (event: MessageEvent) => {
      const trackedChiliPiperEvents = [
        "booked",
        "booking-confirmed",
        "availability-loaded",
        "rescheduled",
        "prospect_cancel",
        "no-free-slots",
        "no-action-choice",
        "phone-selected",
        "meeting-selected",
      ];

      const eventData = event.data as ChilipiperEvent;
      if (
        event.origin === "https://moderntreasury.na.chilipiper.com" &&
        eventData.action
      ) {
        if (trackedChiliPiperEvents.includes(eventData.action)) {
          trackEvent(null, `chilipiper_${eventData.action}`, {
            ...extraTrackInfo,
            ...event,
          });
        }
        switch (eventData.action) {
          case "booking-confirmed":
            void bookingConfirmedCallback(eventData);
            break;
          case "rescheduled":
            void rescheduledCallback(eventData);
            break;
          case "close":
            history.goBack();
            break;
          default:
        }
      }
    };

    window.addEventListener("message", receiveMessage, false);

    switch (action) {
      case "schedule":
        void fetchChiliPiperCalendarUrl();
        break;
      case "reschedule":
        setChiliPiperIframeUrl(
          `https://moderntreasury.na.chilipiper.com/book/reschedule?rescheduleId=${
            chiliPiperEventId ?? ""
          }`
        );
        break;
      default:
    }

    return () => {
      window.removeEventListener("message", receiveMessage, false);
    };
  }, [
    chiliPiperRouterName,
    history,
    extraTrackInfo,
    bookingConfirmedCallback,
    rescheduledCallback,
    action,
    chiliPiperEventId,
  ]);

  return chiliPiperIframeUrl ? (
    <iframe
      title="Modern Treasury Booking Calendar"
      width="500px"
      height="800px"
      src={chiliPiperIframeUrl}
      className={cn("rounded", !chiliPiperEventId && "border")}
    />
  ) : (
    <div className="pb-8">
      <ClipLoader />
    </div>
  );
}
export default ChilipiperScheduler;
