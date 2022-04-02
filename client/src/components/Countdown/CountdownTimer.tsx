import { endOfDay } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import Countdown from "react-countdown";

export const CountdownTimer = ({
  handleComplete,
}: {
  handleComplete?: () => void;
}) => {
  const date = new Date();
  const formattedETDate = formatInTimeZone(
    date,
    "America/New_York",
    "yyyy-MM-dd HH:mm:ssXXX"
  );
  const parsedDate = toDate(formattedETDate, { timeZone: "America/New_York" });

  return (
    <Countdown
      date={endOfDay(parsedDate)}
      autoStart={true}
      daysInHours={true}
      onComplete={handleComplete}
    />
  );
};
