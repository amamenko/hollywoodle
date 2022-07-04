import { useContext, useEffect, useRef, useState } from "react";
import Reward, { RewardElement } from "react-rewards";
import { ClipLoader } from "react-spinners";
import { AppContext } from "../App";
import { ActorMovieContainer } from "../components/ActorMovieContainer/ActorMovieContainer";
import { AllGuesses } from "../components/AllGuesses/AllGuesses";
import { Footer } from "../components/Footer/Footer";
import { handleActorProp } from "../components/InteractiveResponse/handleActorProp";
import { handleMovieProp } from "../components/InteractiveResponse/handleMovieProp";
import { InteractiveResponse } from "../components/InteractiveResponse/InteractiveResponse";
import { IntroModal } from "../components/IntroModal/IntroModal";
import { Winner } from "../components/Winner/Winner";
import { format } from "date-fns-tz";
import { differenceInDays, parse } from "date-fns";
import { GameContext } from "./Main";

export const Game = () => {
  const {
    guesses,
    objectiveCurrentDate,
    currentHoliday,
    firstActor,
    lastActor,
    darkMode,
    fullTimezoneDate,
    showTopPathsModal,
    changeShowTopPathsModal,
    win,
  } = useContext(AppContext);
  const { mostRecentMovie, mostRecentActor } = useContext(GameContext);
  const [refreshingDataTime, changeRefreshingDataTime] = useState(false);
  const [showIntroModal, changeShowIntroModal] = useState(false);

  useEffect(() => {
    if (objectiveCurrentDate) {
      if (!localStorage.getItem("hollywoodle-statistics")) {
        changeShowIntroModal(true);
        localStorage.setItem(
          "hollywoodle-statistics",
          JSON.stringify({
            current_date: objectiveCurrentDate,
            last_played: "",
            current_streak: 0,
            max_streak: 0,
            avg_moves: [],
            played_today: false,
            leaderboard_viewed: "",
            leaderboard_eligible: false,
          })
        );
      } else {
        const storageStr = localStorage.getItem("hollywoodle-statistics");
        let storageObj: { [key: string]: number | number[] | string } = {};

        try {
          storageObj = JSON.parse(storageStr ? storageStr : "");
        } catch (e) {
          console.error(e);
        }
        let resetStreak = false;
        if (objectiveCurrentDate !== storageObj.current_date.toString()) {
          if (storageObj.last_played) {
            const parsedCurrentdDate = parse(
              objectiveCurrentDate,
              "MM/dd/yyyy",
              new Date()
            );
            const parsedLastPlayed = parse(
              storageObj.last_played.toString(),
              "MM/dd/yyyy",
              new Date()
            );

            const difference = differenceInDays(
              parsedCurrentdDate,
              parsedLastPlayed
            );
            if (difference >= 2) resetStreak = true;
          }
        }

        const hasUsername = storageObj.username
          ? storageObj.username.toString()
          : "";

        localStorage.setItem(
          "hollywoodle-statistics",
          JSON.stringify({
            ...storageObj,
            current_date: objectiveCurrentDate,
            current_streak: resetStreak ? 0 : storageObj.current_streak,
            played_today:
              storageObj.last_played.toString() === objectiveCurrentDate
                ? true
                : false,
            leaderboard_viewed: storageObj.leaderboard_viewed
              ? storageObj.leaderboard_viewed.toString() ===
                objectiveCurrentDate
                ? objectiveCurrentDate
                : ""
              : "",
            leaderboard_eligible: storageObj.played_today
              ? false
              : storageObj.leaderboard_viewed
              ? storageObj.leaderboard_viewed.toString() ===
                objectiveCurrentDate
                ? false
                : hasUsername
                ? true
                : false
              : hasUsername
              ? true
              : false,
          })
        );
      }
    }
  }, [objectiveCurrentDate]);

  // Server-side is refreshing actor data, show loading component
  useEffect(() => {
    const endDateArr = fullTimezoneDate.split(" ");
    const endTime = endDateArr[0];
    const endTimeArr = endTime.split(":");
    let hours: number | string = endTimeArr[0];
    const minutes = endTimeArr[1];
    const endTimeMorningNight = endDateArr[1];

    if (endTimeMorningNight === "PM") {
      if (hours !== "12") {
        hours = Number(hours) + 12;
      } else {
        if (Number(hours) <= 10) hours = `0${hours}`;
      }
    } else {
      if (hours === "12") {
        hours = "00";
      } else {
        if (Number(hours) <= 10) hours = `0${hours}`;
      }
    }

    const timesArr: string[] = [];
    for (let i = 0; i <= 10; i++) {
      timesArr.push(`${hours}${minutes}${i < 10 ? "0" + i : i}`);
    }
    const timeInterval = setInterval(() => {
      const currentHoursSeconds = format(new Date(), "HHmmss", {
        timeZone: "America/New_York",
      });

      if (timesArr.includes(currentHoursSeconds)) {
        changeRefreshingDataTime(true);
        if (showTopPathsModal) changeShowTopPathsModal(false);

        // Reload page and fetch new data
        if (currentHoursSeconds === `${hours}${minutes}10`) {
          window.location.reload();
        }
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [fullTimezoneDate, showTopPathsModal, changeShowTopPathsModal]);

  // For winning - confetti purposes
  const rewardEl = useRef<RewardElement>(null);
  return (
    <>
      <div className="left_ad_container">
        <div className="left_ad_inner_container">
          {/* EZOIC AD - LEFT SIDEBAR LOCATION  */}
          {/* Ezoic - sidebar_floating_1 - sidebar_floating_1  */}
          <div id="ezoic-pub-ad-placeholder-101"></div>
          {/* End Ezoic - sidebar_floating_1 - sidebar_floating_1  */}
        </div>
      </div>
      <div className="right_ad_container">
        <div className="right_ad_inner_container">
          {/* EZOIC AD - RIGHT SIDEBAR LOCATION  */}
          {/* <!-- Ezoic - sidebar - sidebar --> */}
          <div id="ezoic-pub-ad-placeholder-103"></div>
          {/* <!-- End Ezoic - sidebar - sidebar --> */}
        </div>
      </div>
      <Reward
        ref={rewardEl}
        type="emoji"
        config={{
          emoji:
            currentHoliday === "Memorial Day" ||
            currentHoliday === "Independence Day"
              ? ["🇺🇸", "🍿"]
              : ["🍿"],
          lifetime: 200,
          zIndex: 9999,
          elementSize: 75,
          spread: 1000,
          springAnimation: false,
        }}
      >
        <IntroModal
          showIntroModal={showIntroModal}
          changeShowIntroModal={changeShowIntroModal}
        />
        <div className={`app_container ${darkMode ? "dark" : ""}`}>
          <div className="main_container">
            {firstActor.name && lastActor.name && !refreshingDataTime ? (
              <>
                <div className="first_actor_container">
                  <ActorMovieContainer
                    image={firstActor.image}
                    name={firstActor.name}
                    knownFor={firstActor.most_popular_recent_movie}
                    gender={firstActor.gender}
                  />
                  {/* EZOIC AD - TOP MIDDLE SQUARE LOCATION  */}
                  {/* <!-- Ezoic - top_of_page - top_of_page --> */}
                  <div id="ezoic-pub-ad-placeholder-104"> </div>
                  {/* <!-- End Ezoic - top_of_page - top_of_page --> */}
                </div>
                <AllGuesses mostRecentMovie={mostRecentMovie} />
                {win ? (
                  <Winner ref={rewardEl} />
                ) : (
                  <div
                    className={`main_response_input_container ${
                      guesses.length === 0 ? "" : "with_guesses"
                    }`}
                  >
                    <InteractiveResponse
                      actor1={handleActorProp(
                        mostRecentMovie,
                        mostRecentActor,
                        firstActor
                      )}
                      actor2={lastActor.name}
                      movie={handleMovieProp(
                        mostRecentMovie,
                        mostRecentActor,
                        mostRecentMovie.guess.toString()
                      )}
                      year={handleMovieProp(
                        mostRecentMovie,
                        mostRecentActor,
                        mostRecentMovie.year.toString()
                      )}
                    />
                  </div>
                )}
                <div className="last_actor_container">
                  {/* EZOIC AD - BOTTOM MIDDLE SQUARE LOCATION  */}
                  {/* <!-- Ezoic - under_page_title - under_page_title --> */}
                  <div id="ezoic-pub-ad-placeholder-105"> </div>
                  {/* <!-- End Ezoic - under_page_title - under_page_title --> */}
                  <ActorMovieContainer
                    image={lastActor.image}
                    name={lastActor.name}
                    knownFor={lastActor.most_popular_recent_movie}
                    gender={lastActor.gender}
                    lastActor={true}
                  />
                </div>
                <Footer />
              </>
            ) : (
              <div className="main_spinner_container">
                <ClipLoader color={darkMode ? "#fff" : "#000"} size={100} />
                <p>Loading {refreshingDataTime ? "new" : ""} actors...</p>
              </div>
            )}
          </div>
        </div>
      </Reward>
    </>
  );
};
