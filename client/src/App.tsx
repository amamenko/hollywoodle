import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import CacheBuster from "react-cache-buster";
import packageJSON from "../package.json";
import { ActorMovieContainer } from "./components/ActorMovieContainer/ActorMovieContainer";
import { InteractiveResponse } from "./components/InteractiveResponse/InteractiveResponse";
import { Winner } from "./components/Winner/Winner";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import Reward, { RewardElement } from "react-rewards";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { AllGuesses } from "./components/AllGuesses/AllGuesses";
import { format } from "date-fns-tz";
import { differenceInDays, parse } from "date-fns";
import { IntroModal } from "./components/IntroModal/IntroModal";
import { getMovieCast } from "./getMovieCast";
import { buildPath } from "./components/AutosuggestInput/buildPath";
import { handleUpdateTopPaths } from "./components/AutosuggestInput/handleUpdateTopPaths";
import { ContextProps } from "./interfaces/ContextProps.interface";
import { ActorObj } from "./interfaces/ActorObj.interface";
import { GuessObj } from "./interfaces/GuessObj.interface";
import { contextDefaults } from "./contextDefaults";
import { handleActorProp } from "./components/InteractiveResponse/handleActorProp";
import { handleMovieProp } from "./components/InteractiveResponse/handleMovieProp";
import "react-toastify/dist/ReactToastify.css";
import "./bootstrap.css";
import "./App.scss";

export const AppContext = createContext<ContextProps>(contextDefaults);

const App = () => {
  const [firstActor, changeFirstActor] = useState<ActorObj>({
    name: "",
    image: "",
    id: 0,
    most_popular_recent_movie: {},
    gender: "",
    type: "",
    date: "",
  });
  const [lastActor, changeLastActor] = useState<ActorObj>({
    name: "",
    image: "",
    id: 0,
    most_popular_recent_movie: {},
    gender: "",
    type: "",
    date: "",
  });
  const [guesses, changeGuesses] = useState<GuessObj[]>([]);
  const [mostRecentMovie, changeMostRecentMovie] = useState<GuessObj>({
    guess: "",
    type: "",
    year: "",
  });
  const [mostRecentActor, changeMostRecentActor] = useState<GuessObj>({
    guess: "",
    type: "",
    year: "",
  });
  // Handle in-game selections and associated data fetching for movies
  const [currentSelection, changeCurrentSelection] = useState({
    id: 0,
    name: "",
    year: "",
    image: "",
  });
  // Current active movie's cast
  const [movieCast, changeMovieCast] = useState<number[]>([]);
  const [guessLoading, changeGuessLoading] = useState(false);
  const [currentMoves, changeCurrentMoves] = useState<number>(0);
  const [currentDegrees, changeCurrentDegrees] = useState<number>(0);
  const [currentEmojiGrid, changeEmojiGrid] = useState<string[]>([]);
  const [win, changeWin] = useState(false);

  // General app settings
  const [darkMode, changeDarkMode] = useState(true);
  const [refreshingDataTime, changeRefreshingDataTime] = useState(false);
  const [initialAppMounted, changeInitialAppMounted] = useState(false);
  const [currentHoliday, changeCurrentHoliday] = useState("");

  // Handle modal logic
  const [showTopPathsModal, changeShowTopPathsModal] = useState(false);
  const [showIntroModal, changeShowIntroModal] = useState(false);

  // For use in statistics/game logic
  const [fullTimezoneDate, changeFullTimezoneDate] = useState("");
  const [objectiveCurrentDate, changeObjectiveCurrentDate] = useState("");

  // For use in archived games
  const [currentArchivedActorsResults, changeCurrentArchivedActorsResults] =
    useState<ActorObj[]>([]);
  const [currentlyPlayingDate, changeCurrentlyPlayingDate] = useState("");

  // For winning - triggers fetch and async tasks to server
  const [updateWinData, changeUpdateWinData] = useState(false);
  const [pathRankCount, changePathRankCount] = useState({
    rank: "",
    count: "",
  });

  // For winning - confetti purposes
  const rewardEl = useRef<RewardElement>(null);

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

        // Reload page and fetch new data
        if (currentHoursSeconds === `${hours}${minutes}10`) {
          window.location.reload();
        }
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [fullTimezoneDate]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLightChange = useCallback(
    (event: MediaQueryListEvent) => {
      if (event.matches) {
        if (!darkMode) changeDarkMode(true);
      } else {
        if (darkMode) changeDarkMode(false);
      }
    },
    [darkMode]
  );

  // Look for color preference on app mount
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      changeDarkMode(true);
    } else {
      changeDarkMode(false);
    }
  }, []);

  // Watch for light preference changes
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleLightChange);
  }, [handleLightChange]);

  const getFirstAndLastActors = async () => {
    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    const actorObjects = await axios
      .get(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}/api/actor`
          : "http://localhost:4000/api/actor"
      )
      .then((res) => res.data)
      .then((data) => data)
      .catch((e) => console.error(e));
    return actorObjects;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentFirstAndLastActors = await getFirstAndLastActors();
        const currentFirst = currentFirstAndLastActors.find(
          (actor: { [key: string]: string | number }) => actor.type === "first"
        );
        changeFirstActor(currentFirst);
        const currentLast = currentFirstAndLastActors.find(
          (actor: { [key: string]: string | number }) => actor.type === "last"
        );
        changeLastActor(currentLast);
        changeCurrentArchivedActorsResults([currentFirst, currentLast]);
      } catch (e) {
        console.error(e);
      }
      changeInitialAppMounted(true);
    };

    const relevantDateActors = currentArchivedActorsResults.filter(
      (el: ActorObj) => el.date === currentlyPlayingDate
    );

    if (
      !initialAppMounted &&
      relevantDateActors.length < 2 &&
      currentlyPlayingDate
    ) {
      fetchData();
    } else {
      const foundFirst = relevantDateActors.find(
        (el: ActorObj) => el.type === "first"
      );
      const foundLast = relevantDateActors.find(
        (el: ActorObj) => el.type === "last"
      );

      if (foundFirst) {
        changeFirstActor(foundFirst);
      }

      if (foundLast) {
        changeLastActor(foundLast);
      }
    }
  }, [currentArchivedActorsResults, currentlyPlayingDate, initialAppMounted]);

  useEffect(() => {
    const sortedGuesses = guesses.sort((a, b) => {
      return (
        (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0)
      );
    });
    sortedGuesses.reverse();
    const currentRecentMovie = sortedGuesses.find(
      (el) => el.type && el.type.toString() === "movie"
    );
    if (currentRecentMovie && currentRecentMovie.id !== mostRecentMovie.id) {
      changeMostRecentMovie(currentRecentMovie);
    }
  }, [guesses, mostRecentMovie]);

  useEffect(() => {
    const sortedGuesses = guesses.sort((a, b) => {
      return (
        (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0)
      );
    });
    sortedGuesses.reverse();
    const currentRecentActor = sortedGuesses.find(
      (el) => el.type && el.type.toString() === "actor"
    );
    if (currentRecentActor && currentRecentActor.id !== mostRecentActor.id) {
      changeMostRecentActor(currentRecentActor);
    }
  }, [guesses, mostRecentActor]);

  const mostRecentGuess = guesses.sort((a, b) => {
    return (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0);
  })[guesses.length - 1];

  const typeOfGuess = !mostRecentGuess
    ? "movie"
    : mostRecentGuess.incorrect || mostRecentGuess.incorrect === "partial"
    ? mostRecentGuess.type === "actor"
      ? "actor"
      : "movie"
    : mostRecentGuess.type === "actor"
    ? "movie"
    : "actor";

  // useMemo prevents constant unmounting of component
  useMemo(() => {
    const source = axios.CancelToken.source();

    // Refetch cast list when current selection changes and the type of guess is a movie
    if (currentSelection && currentSelection.id && typeOfGuess === "movie") {
      changeGuessLoading(true);
      const fetchData = async () => {
        try {
          let results = await getMovieCast(currentSelection.id);
          if (results && results.length > 0) {
            changeMovieCast(results);
            changeGuessLoading(false);
          } else {
            // Try a second time just in case
            const secondTryResults = await getMovieCast(currentSelection.id);
            if (secondTryResults && secondTryResults.length > 0) {
              changeMovieCast(secondTryResults);
              changeGuessLoading(false);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };

      fetchData();
    }

    // Cancel token on unmount
    return () => source.cancel();
  }, [currentSelection, typeOfGuess]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (updateWinData && !pathRankCount.rank && !pathRankCount.count) {
      changeUpdateWinData(false);
      const fetchData = async () => {
        try {
          const finalPath = buildPath(firstActor, lastActor, guesses);

          let results = await handleUpdateTopPaths(finalPath, currentDegrees);
          if (results && results.data) {
            const resultData = results.data;
            if (resultData.rank.toString() && resultData.count.toString()) {
              changePathRankCount({
                rank: resultData.rank.toString(),
                count: resultData.count.toString(),
              });
            }
          }
        } catch (e) {
          console.error(e);
        }
      };

      fetchData();
    }

    // Cancel token on unmount
    return () => source.cancel();
  }, [
    currentDegrees,
    firstActor,
    guesses,
    lastActor,
    updateWinData,
    pathRankCount.rank,
    pathRankCount.count,
  ]);

  return (
    <CacheBuster
      currentVersion={packageJSON.version}
      isEnabled={
        !!process.env.REACT_APP_NODE_ENV &&
        process.env.REACT_APP_NODE_ENV === "production"
      }
      isVerboseMode={false}
    >
      <AppContext.Provider
        value={{
          firstActor,
          lastActor,
          guesses,
          changeGuesses,
          currentMoves,
          changeCurrentMoves,
          win,
          changeWin,
          darkMode,
          changeDarkMode,
          changeMostRecentActor,
          changeMostRecentMovie,
          currentEmojiGrid,
          changeEmojiGrid,
          currentlyPlayingDate,
          changeCurrentlyPlayingDate,
          currentArchivedActorsResults,
          changeCurrentArchivedActorsResults,
          fullTimezoneDate,
          changeFullTimezoneDate,
          objectiveCurrentDate,
          changeObjectiveCurrentDate,
          currentSelection,
          changeCurrentSelection,
          movieCast,
          changeMovieCast,
          currentDegrees,
          changeCurrentDegrees,
          guessLoading,
          changeGuessLoading,
          updateWinData,
          changeUpdateWinData,
          pathRankCount,
          changePathRankCount,
          showTopPathsModal,
          changeShowTopPathsModal,
          currentHoliday,
          changeCurrentHoliday,
        }}
      >
        <ToastContainer limit={1} />
        <Header />
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
      </AppContext.Provider>
    </CacheBuster>
  );
};

export default App;
