import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
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
  guesses: { [key: string]: string | number | number[] | boolean }[];
  changeGuesses: Dispatch<
    SetStateAction<
      {
        [key: string]: string | number | number[] | boolean;
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
    { [key: string]: string | number | number[] | boolean }[]
  >([]);

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
          {guesses.map((el, index, arr) => {
            const currentGuess = el.guess.toString();
            const currentGuessType = el.type;
            const prevGuess = arr[index - 1]
              ? arr[index - 1].guess.toString()
              : firstActor.name;

            if (
              typeof el.guess === "string" &&
              typeof el.incorrect === "boolean"
            ) {
              return (
                <React.Fragment key={index}>
                  <InteractiveResponse
                    actor1={
                      currentGuessType === "actor" ? currentGuess : prevGuess
                    }
                    movie={
                      currentGuessType === "movie" ? currentGuess : prevGuess
                    }
                    incorrect={el.incorrect}
                    year={el.year.toString()}
                    points={30}
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
          })}
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
