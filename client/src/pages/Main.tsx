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
import { News } from "./News/News";
import { Article } from "./News/Article/Article";
// import { Battle } from "./Battle/Battle";
import { Helmet } from "react-helmet";
import { format } from "date-fns-tz";

export const GameContext = createContext<GameContextProps>(gameContextDefaults);

export const Main = () => {
  const {
    guesses,
    fullTimezoneDate,
    showTopPathsModal,
    changeShowTopPathsModal,
  } = useContext(AppContext);
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
  const [refreshingDataTime, changeRefreshingDataTime] = useState(false);

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

  return (
    <GameContext.Provider
      value={{
        mostRecentMovie,
        changeMostRecentMovie,
        mostRecentActor,
        changeMostRecentActor,
      }}
    >
      <Helmet>
        <title>Hollywoodle</title>
        <meta name="title" content="Hollywoodle" />
        <meta
          name="description"
          content="Six Degrees of Kevin Bacon meets Wordle. Connect the two actors with movies they've starred in or costars they've shared in as few moves as possible!"
        />
        {/* Open Graph / Facebook  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hollywoodle.vercel.app/" />
        <meta property="og:title" content="Hollywoodle" />
        <meta
          property="og:description"
          content="Six Degrees of Kevin Bacon meets Wordle. Connect the two actors with movies they've starred in or costars they've shared in as few moves as possible!"
        />
        <meta property="og:image" content="https://i.imgur.com/ML7OvjA.png" />
        {/* Twitter */}
        <meta
          property="twitter:url"
          content="https://hollywoodle.vercel.app/"
        />
        <meta property="twitter:title" content="Hollywoodle" />
        <meta
          property="twitter:description"
          content="Six Degrees of Kevin Bacon meets Wordle. Connect the two actors with movies they've starred in or costars they've shared in as few moves as possible!"
        />
        <meta
          property="twitter:image"
          content="https://i.imgur.com/ML7OvjA.png"
        />
      </Helmet>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<Game refreshingDataTime={refreshingDataTime} />}
          />
          <Route path="/paths" element={<AllPaths />} />
          <Route path="/archive" element={<Archive />} />
          {/* <Route path="/battle" element={<Battle />} /> */}
          <Route path="/news" element={<News />} />
          <Route path="/news/:topicId" element={<Article />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GameContext.Provider>
  );
};
