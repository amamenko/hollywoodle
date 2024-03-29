import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import CacheBuster from "react-cache-buster";
import packageJSON from "../package.json";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { getMovieCast } from "./getMovieCast";
import { buildPath } from "./components/AutosuggestInput/buildPath";
import { handleUpdateTopPaths } from "./components/AutosuggestInput/handleUpdateTopPaths";
import { ContextProps } from "./interfaces/ContextProps.interface";
import { ActorObj } from "./interfaces/ActorObj.interface";
import { GuessObj } from "./interfaces/GuessObj.interface";
import { contextDefaults } from "./contextDefaults";
import { Main } from "./pages/Main";
import { NewsToast } from "./components/Toast/NewsToast";
import { handleSeenArticle } from "./components/Toast/handleSeenArticle";
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
  const [alreadyRewarded, changeAlreadyRewarded] = useState(false);

  // General app settings
  const [darkMode, changeDarkMode] = useState(true);
  const [initialAppMounted, changeInitialAppMounted] = useState(false);
  const [currentHoliday, changeCurrentHoliday] = useState("");
  const [browserWidth, changeBrowserWidth] = useState(
    Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    )
  );

  // Handle modal logic
  const [showTopPathsModal, changeShowTopPathsModal] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
      changeBrowserWidth(currentWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

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
        const { actors: currentFirstAndLastActors, article } =
          await getFirstAndLastActors();
        const storageStr = localStorage.getItem("hollywoodle-statistics");
        let storageObj: { [key: string]: number | number[] | string } = {};
        try {
          storageObj = JSON.parse(storageStr ? storageStr : "");
        } catch (e) {
          console.error(e);
        }
        if (article && !storageObj.seen_article) {
          toast(
            <NewsToast
              date={article.date}
              title={article.title}
              image={article.image}
              slug={article.slug}
              category={article.category}
            />,
            {
              theme: "dark",
              autoClose: 30000,
              hideProgressBar: true,
              position:
                browserWidth < 768
                  ? toast.POSITION.BOTTOM_CENTER
                  : toast.POSITION.TOP_RIGHT,
              onClose: () => handleSeenArticle(),
            }
          );
        }
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
  }, [
    currentArchivedActorsResults,
    currentlyPlayingDate,
    initialAppMounted,
    browserWidth,
  ]);

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
            } else {
              // Third time's the charm
              const thirdTryResults = await getMovieCast(currentSelection.id);
              if (thirdTryResults && thirdTryResults.length > 0) {
                changeMovieCast(thirdTryResults);
                changeGuessLoading(false);
              }
            }
          }
          setTimeout(() => {
            const inputEl = document.getElementById("autosuggest_input");
            if (inputEl) inputEl.focus();
          }, 500);
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
          alreadyRewarded,
          changeAlreadyRewarded,
          darkMode,
          changeDarkMode,
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
          changeFirstActor,
          changeLastActor,
        }}
      >
        <ToastContainer limit={1} />
        <Main />
      </AppContext.Provider>
    </CacheBuster>
  );
};

export default App;
