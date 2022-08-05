import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { gameContextDefaults } from "../gameContextDefaults";
import { GameContextProps } from "../interfaces/GameContextProps.interface";
import { GuessObj } from "../interfaces/GuessObj.interface";
import { Game } from "./Game";
import { Header } from "../components/Header/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PrivacyPolicy } from "./Policies/PrivacyPolicy";
import { TermsAndConditions } from "./Policies/Terms";
import { Archive } from "./Archive/Archive";
import { Contact } from "./Contact/Contact";
import { AllPaths } from "./AllPaths/AllPaths";
// import { News } from "./News/News";
// import { Article } from "./News/Article";
// import { Battle } from "./Battle/Battle";

export const GameContext = createContext<GameContextProps>(gameContextDefaults);

export const Main = () => {
  const { guesses } = useContext(AppContext);
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

  return (
    <GameContext.Provider
      value={{
        mostRecentMovie,
        changeMostRecentMovie,
        mostRecentActor,
        changeMostRecentActor,
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/paths" element={<AllPaths />} />
          <Route path="/archive" element={<Archive />} />
          {/* <Route path="/battle" element={<Battle />} /> */}
          {/* <Route path="/news" element={<News />} />
          <Route path="/news/:topicId" element={<Article />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GameContext.Provider>
  );
};
