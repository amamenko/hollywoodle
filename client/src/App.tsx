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
import "react-toastify/dist/ReactToastify.css";
import "./bootstrap.css";
import "./App.scss";

interface ActorObj {
  name: string;
  image: string;
  id: number;
}

interface ContextProps {
  firstActor: ActorObj;
  lastActor: ActorObj;
  guesses: {
    [key: string]:
      | string
      | number
      | number[]
      | boolean
      | { [key: string]: string | number };
  }[];
  changeGuesses: Dispatch<
    SetStateAction<
      {
        [key: string]:
          | string
          | number
          | number[]
          | boolean
          | { [key: string]: string | number };
      }[]
    >
  >;
  currentPoints: number;
  changeCurrentPoints: React.Dispatch<React.SetStateAction<number>>;
  win: boolean;
  changeWin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<ContextProps>({
  firstActor: { name: "", image: "", id: 0 },
  lastActor: { name: "", image: "", id: 0 },
  guesses: [{}],
  changeGuesses: () => [],
  currentPoints: 0,
  changeCurrentPoints: () => {},
  win: false,
  changeWin: () => {},
});

const App = () => {
  const [firstActor, changeFirstActor] = useState({
    name: "",
    image: "",
    id: 0,
  });
  const [lastActor, changeLastActor] = useState({ name: "", image: "", id: 0 });
  const [guesses, changeGuesses] = useState<
    {
      [key: string]:
        | string
        | number
        | number[]
        | boolean
        | { [key: string]: string | number };
    }[]
  >([]);
  const [mostRecentMovie, changeMostRecentMovie] = useState<{
    [key: string]:
      | string
      | number
      | boolean
      | number[]
      | {
          [key: string]: string | number;
        };
  }>({ guess: "", type: "", year: "" });
  const [mostRecentActor, changeMostRecentActor] = useState<{
    [key: string]:
      | string
      | number
      | boolean
      | number[]
      | {
          [key: string]: string | number;
        };
  }>({ guess: "", type: "", year: "" });
  const [currentPoints, changeCurrentPoints] = useState<number>(0);
  const [win, changeWin] = useState(false);

  const rewardEl = useRef<RewardElement>(null);

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
      (el) => el.type.toString() === "movie"
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
      (el) => el.type.toString() === "actor"
    );
    if (currentRecentActor && currentRecentActor.id !== mostRecentActor.id) {
      changeMostRecentActor(currentRecentActor);
    }
  }, [guesses, mostRecentActor]);

  const renderGuesses = useCallback(() => {
    const allGuesses = guesses.slice().sort((a, b) => {
      return (
        (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0)
      );
    });

    return allGuesses.map((el, index) => {
      const currentGuessType = el.type;

      const determineChoice = (type: string, default_val: string): string => {
        if (currentGuessType === type) {
          return el.guess.toString();
        } else {
          if (
            el.prev_guess &&
            typeof el.prev_guess === "object" &&
            !Array.isArray(el.prev_guess) &&
            el.prev_guess.guess &&
            el.prev_guess.type === type
          ) {
            return el.prev_guess.guess.toString();
          }

          if (type === "actor") {
            if (
              el.last_correct_actor &&
              typeof el.last_correct_actor === "object" &&
              !Array.isArray(el.last_correct_actor) &&
              el.last_correct_actor.guess
            ) {
              return el.last_correct_actor.guess.toString();
            }
          } else {
            if (
              el.last_correct_movie &&
              typeof el.last_correct_movie === "object" &&
              !Array.isArray(el.last_correct_movie) &&
              el.last_correct_movie.guess
            ) {
              return el.last_correct_movie.guess.toString();
            }
          }
          return default_val;
        }
      };

      const determinedActor = determineChoice("actor", firstActor.name);
      const determinedMovie = determineChoice(
        "movie",
        mostRecentMovie ? mostRecentMovie.guess.toString() : ""
      );

      if (
        typeof el.guess === "string" &&
        (typeof el.incorrect === "boolean" || typeof el.incorrect === "string")
      ) {
        return (
          <React.Fragment key={index}>
            <ActorMovieContainer
              image={el.image.toString()}
              name={el.guess}
              incorrect={el.incorrect}
            />
            <InteractiveResponse
              actor1={determinedActor}
              movie={determinedMovie}
              incorrect={el.incorrect}
              year={determinedMovie ? mostRecentMovie.year.toString() : ""}
              points={el.incorrect === "partial" ? 20 : el.incorrect ? 30 : 10}
            />
          </React.Fragment>
        );
      }
      return <></>;
    });
  }, [firstActor.name, guesses, mostRecentMovie]);

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
          return mostRecentActor.last_correct_actor.guess.toString();
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
        currentPoints,
        changeCurrentPoints,
        win,
        changeWin,
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
        <div className="app_container">
          <div className="main_container">
            {firstActor.name && lastActor.name ? (
              <>
                <div className="first_actor_container">
                  <ActorMovieContainer
                    image={firstActor.image}
                    name={firstActor.name}
                  />
                </div>
                {renderGuesses()}
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
                  />
                </div>
              </>
            ) : (
              <div className="main_spinner_container">
                <ClipLoader color={"#000"} size={100} />
                <p>Loading actors...</p>
              </div>
            )}
          </div>
        </div>
      </Reward>
    </AppContext.Provider>
  );
};

export default App;
