import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import { ReactComponent as LogoWhite } from "./assets/LogoWhite.svg";
import { ActorMovieContainer } from "./components/ActorMovieContainer/ActorMovieContainer";
import { InteractiveResponse } from "./components/InteractiveResponse/InteractiveResponse";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./bootstrap.css";
import "./App.scss";
import { getMostRecent } from "./utils/getMostRecent";

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
      | { [key: string]: string };
  }[];
  changeGuesses: Dispatch<
    SetStateAction<
      {
        [key: string]:
          | string
          | number
          | number[]
          | boolean
          | { [key: string]: string };
      }[]
    >
  >;
}

export const AppContext = createContext<ContextProps>({
  firstActor: { name: "", image: "", id: 0 },
  lastActor: { name: "", image: "", id: 0 },
  guesses: [{}],
  changeGuesses: () => [],
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
        | { [key: string]: string };
    }[]
  >([]);

  console.log(guesses);

  useEffect(() => {
    changeFirstActor({
      name: "Benedict Cumberbatch",
      image:
        "https://www.themoviedb.org/t/p/w1280/fBEucxECxGLKVHBznO0qHtCGiMO.jpg",
      id: 71580,
    });

    changeLastActor({
      name: "John Goodman",
      image:
        "https://www.themoviedb.org/t/p/w1280/yyYqoyKHO7hE1zpgEV2XlqYWcNV.jpg",
      id: 1230,
    });
  }, []);

  const mostRecentMovie = getMostRecent(guesses, "movie");
  const mostRecentActor = getMostRecent(guesses, "actor");

  const renderGuesses = useCallback(() => {
    const allGuesses = guesses.slice().sort((a, b) => {
      return (
        (a ? Number(a.guess_number) : 0) - (b ? Number(b.guess_number) : 0)
      );
    });

    return allGuesses.map((el, index, arr) => {
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
          return default_val;
        }
      };

      console.log({
        currentGuessType,
        guess: el.guess,
        prev: el.prev_guess,
        chosen: determineChoice("actor", firstActor.name),
      });

      if (typeof el.guess === "string" && typeof el.incorrect === "boolean") {
        return (
          <React.Fragment key={index}>
            <InteractiveResponse
              actor1={determineChoice("actor", firstActor.name)}
              movie={determineChoice("movie", "")}
              incorrect={el.incorrect}
              year={el.year.toString()}
              points={el.incorrect ? 30 : 10}
            />
            <ActorMovieContainer
              image={el.image.toString()}
              name={el.guess}
              incorrect={el.incorrect}
            />
          </React.Fragment>
        );
      }
      return <></>;
    });
  }, [firstActor.name, guesses]);

  return (
    <AppContext.Provider
      value={{
        firstActor,
        lastActor,
        guesses,
        changeGuesses,
      }}
    >
      <ToastContainer limit={1} />
      <div className="header">
        <LogoWhite />
      </div>
      <div className="app_container">
        <div className="main_container">
          <ActorMovieContainer
            image={firstActor.image}
            name={firstActor.name}
          />
          {renderGuesses()}
          <InteractiveResponse
            actor1={
              mostRecentActor
                ? mostRecentActor.guess.toString()
                : firstActor.name
            }
            actor2={lastActor.name}
            movie={mostRecentMovie ? mostRecentMovie.guess.toString() : ""}
          />
          <ActorMovieContainer image={lastActor.image} name={lastActor.name} />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
