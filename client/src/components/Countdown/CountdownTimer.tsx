import { parse, addDays, format } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { AppContext } from "../../App";

export const CountdownTimer = ({
  handleComplete,
}: {
  handleComplete?: () => void;
}) => {
  const [endDate, changeEndDate] = useState<string | Date>("");
  const [countdownHours, changeCountdownHours] = useState(0);
  const [countdownMinutes, changeCountdownMinutes] = useState(0);

  const {
    changeFullTimezoneDate,
    objectiveCurrentDate,
    changeObjectiveCurrentDate,
    changeCurrentlyPlayingDate,
  } = useContext(AppContext);

  useEffect(() => {
    const date = new Date();
    const stringDate = date.toString();
    const zoneRegex = /\((.*)\)/;
    const currentZone = stringDate.match(zoneRegex)?.pop();

    const gmtOffset = stringDate.split(" ").find((el) => el.includes("GMT"));
    const gmtSign =
      stringDate.split("").find((el) => el === "+" || el === "-") || "";
    let gmtNum: number | string =
      (Number(gmtOffset?.replace(/[^0-9]/g, "")) || 0) / 100;
    gmtNum = gmtNum.toString().replace(/\.3/, ".5");
    let constructedGMT = "GMT";
    if (gmtSign && gmtNum) constructedGMT = `GMT${gmtSign}${gmtNum}`;
    const fullCurrentZone = `${currentZone} (${constructedGMT})`;

    const currentDateTZ = formatInTimeZone(
      date,
      "America/New_York",
      "yyyy-MM-dd XXX"
    );
    const dateZoneArr = currentDateTZ.split(" ");
    const tomorrowDate = addDays(
      parse(dateZoneArr[0], "yyyy-MM-dd", new Date()),
      1
    );
    const formattedTomorrow = format(tomorrowDate, "yyyy-MM-dd");
    const finalEndDate = `${formattedTomorrow} 00:00:00${dateZoneArr[1]}`;

    const currentDateStr = formatInTimeZone(
      date,
      "America/New_York",
      "MM/dd/yyyy"
    );

    if (currentDateStr !== objectiveCurrentDate) {
      changeObjectiveCurrentDate(currentDateStr);
      changeCurrentlyPlayingDate(currentDateStr);
    }

    const lastIndex = finalEndDate.lastIndexOf("-");
    const trimmedEnd = finalEndDate.toString().substring(0, lastIndex);
    const trimmedEndArr = trimmedEnd.split(" ");
    const finalDateFormat = trimmedEndArr[0] + "T" + trimmedEndArr[1];

    if (trimmedEndArr.length > 0) {
      changeEndDate(toDate(finalDateFormat, { timeZone: "America/New_York" }));
    } else {
      const currentDate = new Date();
      changeEndDate(toDate(currentDate, { timeZone: "America/New_York" }));
    }

    const currentDateFull = format(new Date(), "HH:mm:ss");
    const hoursMinutesSecondsArr = currentDateFull.split(":");
    const newHours =
      Number(hoursMinutesSecondsArr[0]) + countdownHours > 24
        ? Number(hoursMinutesSecondsArr[0]) + countdownHours - 24
        : Number(hoursMinutesSecondsArr[0]) + countdownHours;
    const newMinutes =
      Number(hoursMinutesSecondsArr[1]) + countdownMinutes > 60
        ? Number(hoursMinutesSecondsArr[1]) + countdownMinutes - 60
        : Number(hoursMinutesSecondsArr[1]) + countdownMinutes;

    const endHour =
      newMinutes >= 30
        ? Number(newHours) + 1 === 24
          ? "00"
          : Number(newHours) + 1
        : Number(newHours) === 24
        ? "00"
        : Number(newHours);

    let newEndHour = endHour;

    if (endHour === "00") {
      newEndHour = "12";
    } else {
      if (Number(endHour) >= 25) {
        newEndHour = Number(endHour) - 24;
      } else {
        if (Number(endHour) > 12) {
          newEndHour = Number(endHour) - 12;
        }
      }
    }

    changeFullTimezoneDate(
      `${newEndHour}:${gmtNum.includes(".5") ? "30" : "00"} ${
        endHour >= 23 ? "AM" : endHour >= 12 ? "PM" : "AM"
      } ${fullCurrentZone}`
    );
  }, [
    countdownHours,
    countdownMinutes,
    changeFullTimezoneDate,
    changeObjectiveCurrentDate,
    objectiveCurrentDate,
    changeCurrentlyPlayingDate,
  ]);

  if (endDate) {
    return (
      <Countdown
        date={endDate}
        autoStart={true}
        daysInHours={true}
        onComplete={handleComplete}
        onStart={({ hours, minutes }) => {
          changeCountdownHours(hours);
          changeCountdownMinutes(minutes);
        }}
      />
    );
  } else {
    return <></>;
  }
};
