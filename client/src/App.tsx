import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
import "react-toastify/dist/ReactToastify.css";
import "./bootstrap.css";
import "./App.scss";
import { IntroModal } from "./components/IntroModal/IntroModal";

export interface ActorObj {
  name: string;
  image: string;
  id: number;
  most_popular_recent_movie?: { [key: string]: string | number };
  gender?: string;
}

interface GuessObj {
  [key: string]:
    | string
    | number
    | number[]
    | boolean
    | { [key: string]: string | number };
}

interface ContextProps {
  firstActor: ActorObj;
  lastActor: ActorObj;
  guesses: GuessObj[];
  changeGuesses: Dispatch<SetStateAction<GuessObj[]>>;
  currentMoves: number;
  changeCurrentMoves: React.Dispatch<React.SetStateAction<number>>;
  win: boolean;
  changeWin: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  changeDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  changeMostRecentActor: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >;
  changeMostRecentMovie: React.Dispatch<
    React.SetStateAction<{ [key: string]: any }>
  >;
  currentEmojiGrid: string[];
  changeEmojiGrid: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AppContext = createContext<ContextProps>({
  firstActor: {
    name: "",
    image: "",
    id: 0,
    most_popular_recent_movie: {},
    gender: "",
  },
  lastActor: {
    name: "",
    image: "",
    id: 0,
    most_popular_recent_movie: {},
    gender: "",
  },
  guesses: [{}],
  changeGuesses: () => [],
  currentMoves: 0,
  changeCurrentMoves: () => {},
  win: false,
  changeWin: () => {},
  darkMode: true,
  changeDarkMode: () => [],
  changeMostRecentActor: () => [],
  changeMostRecentMovie: () => [],
  currentEmojiGrid: [],
  changeEmojiGrid: () => [],
});

const App = () => {
  const [firstActor, changeFirstActor] = useState({
    name: "",
    image: "",
    id: 0,
    most_popular_recent_movie: {},
    gender: "",
  });
  const [lastActor, changeLastActor] = useState({
    name: "",
    image: "",
    id: 0,
    most_popular_recent_movie: {},
    gender: "",
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
  const [currentMoves, changeCurrentMoves] = useState<number>(0);
  const [win, changeWin] = useState(false);
  const [darkMode, changeDarkMode] = useState(true);
  const [refreshingDataTime, changeRefreshingDataTime] = useState(false);
  const [showIntroModal, changeShowIntroModal] = useState(false);
  const [currentEmojiGrid, changeEmojiGrid] = useState<string[]>([]);

  const rewardEl = useRef<RewardElement>(null);

  useEffect(() => {
    const currentDate = format(new Date(), "MM/dd/yyyy", {
      timeZone: "America/New_York",
    });

    if (!localStorage.getItem("hollywoodle-statistics")) {
      changeShowIntroModal(true);
      localStorage.setItem(
        "hollywoodle-statistics",
        JSON.stringify({
          current_date: currentDate,
          last_played: "",
          current_streak: 0,
          max_streak: 0,
          avg_moves: [],
          played_today: false,
        })
      );
    } else {
      const storageStr = localStorage.getItem("hollywoodle-statistics");
      let storageObj: { [key: string]: number | number[] } = {};

      try {
        storageObj = JSON.parse(storageStr ? storageStr : "");
      } catch (e) {
        console.error(e);
      }
      let resetStreak = false;
      if (currentDate !== storageObj.current_date.toString()) {
        if (storageObj.last_played) {
          const parsedCurrentdDate = parse(
            currentDate,
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

      localStorage.setItem(
        "hollywoodle-statistics",
        JSON.stringify({
          ...storageObj,
          current_date: currentDate,
          current_streak: resetStreak ? 0 : storageObj.current_streak,
          played_today:
            storageObj.last_played.toString() === currentDate ? true : false,
        })
      );
    }
  }, []);

  // Server-side is refreshing actor data, show loading component
  useEffect(() => {
    const timesArr: string[] = [];
    for (let i = 0; i <= 10; i++) {
      timesArr.push(`0000${i < 10 ? "0" + i : i}`);
    }
    const timeInterval = setInterval(() => {
      const currentHoursSeconds = format(new Date(), "HHmmss", {
        timeZone: "America/New_York",
      });
      if (timesArr.includes(currentHoursSeconds)) {
        changeRefreshingDataTime(true);

        // Reload page and fetch new data
        if (currentHoursSeconds === "000010") {
          window.location.reload();
        }
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

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
          ? process.env.REACT_APP_PROD_SERVER
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
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

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

  const handleActorProp = () => {
    if (mostRecentActor && mostRecentActor.guess) {
      if (
        !mostRecentMovie ||
        !mostRecentMovie.guess_number ||
        !mostRecentActor.incorrect
      ) {
        return mostRecentActor.guess.toString();
      } else {
        if (
          mostRecentActor.last_correct_actor &&
          typeof mostRecentActor.last_correct_actor === "object" &&
          !Array.isArray(mostRecentActor.last_correct_actor)
        ) {
          if (mostRecentActor.last_correct_actor.guess) {
            return mostRecentActor.last_correct_actor.guess.toString();
          } else {
            return firstActor.name;
          }
        } else {
          return firstActor.name;
        }
      }
    } else {
      return firstActor.name;
    }
  };

  const handleMovieProp = (result: string) => {
    if (mostRecentMovie && mostRecentMovie.guess) {
      if (
        !mostRecentActor ||
        !mostRecentActor.guess_number ||
        !mostRecentMovie.incorrect
      ) {
        return result;
      } else {
        if (
          mostRecentMovie.last_correct_movie &&
          typeof mostRecentMovie.last_correct_movie === "object" &&
          !Array.isArray(mostRecentMovie.last_correct_movie)
        ) {
          return mostRecentMovie.last_correct_movie.guess.toString();
        } else {
          return "";
        }
      }
    } else {
      return "";
    }
  };

  return (
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
      }}
    >
      <ToastContainer limit={1} />
      <Header />
      <Reward
        ref={rewardEl}
        type="emoji"
        config={{
          emoji: ["🍿"],
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
                      actor1={handleActorProp()}
                      actor2={lastActor.name}
                      movie={handleMovieProp(mostRecentMovie.guess.toString())}
                      year={handleMovieProp(mostRecentMovie.year.toString())}
                    />
                  </div>
                )}
                <div className="last_actor_container">
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
  );
};

export default App;
