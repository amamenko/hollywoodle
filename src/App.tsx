import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { ReactComponent as LogoWhite } from "./assets/LogoWhite.svg";
import { ActorMovieContainer } from "./components/ActorMovieContainer/ActorMovieContainer";
import { InteractiveResponse } from "./components/InteractiveResponse/InteractiveResponse";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./bootstrap.css";
import "./App.scss";

interface ContextProps {
  guesses: { [key: string]: string | boolean }[];
  changeGuesses: Dispatch<
    SetStateAction<
      {
        [key: string]: string | boolean;
      }[]
    >
  >;
}

export const AppContext = createContext<ContextProps>({
  guesses: [{}],
  changeGuesses: () => [],
});

const App = () => {
  const [guesses, changeGuesses] = useState<
    { [key: string]: string | boolean }[]
  >([]);

  const mostRecentMovie = guesses
    .reverse()
    .find((guess) => guess.type === "movie");

  return (
    <AppContext.Provider
      value={{
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
            image="https://www.themoviedb.org/t/p/w1280/fBEucxECxGLKVHBznO0qHtCGiMO.jpg"
            name="Benedict Cumberbatch"
          />
          {guesses.map((el, index) => {
            if (
              typeof el.guess === "string" &&
              typeof el.incorrect === "boolean"
            ) {
              return (
                <React.Fragment key={index}>
                  <InteractiveResponse
                    actor1="Benedict Cumberbatch"
                    movie={el.guess}
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
            actor1={"Benedict Cumberbatch"}
            actor2="John Goodman"
            movie={mostRecentMovie ? mostRecentMovie.guess.toString() : ""}
          />
          <ActorMovieContainer
            image="https://www.themoviedb.org/t/p/w1280/yyYqoyKHO7hE1zpgEV2XlqYWcNV.jpg"
            name="John Goodman"
          />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;
