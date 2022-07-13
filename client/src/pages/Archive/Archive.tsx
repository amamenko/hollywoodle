import { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import {
  CgChevronLeftO,
  CgChevronDoubleLeftO,
  CgChevronRightO,
  CgChevronDoubleRightO,
} from "react-icons/cg";
import { AiFillStar } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import { parse } from "date-fns";
import { format } from "date-fns-tz";
import { ActorMovieContainer } from "../../components/ActorMovieContainer/ActorMovieContainer";
import { Button } from "reactstrap";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { AppContext } from "../../App";
import { Collapse } from "react-collapse";
import { ActorObj } from "../../interfaces/ActorObj.interface";
import { GameContext } from "../../pages/Main";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import { BackButton } from "../BackButton";
import { AutosuggestInput } from "../../components/AutosuggestInput/AutosuggestInput";
import { ArchiveSearchResult } from "../../interfaces/ArchiveSearchResult.interface";
import "./Archive.scss";
import "react-calendar/dist/Calendar.css";

export const Archive = () => {
  const {
    darkMode,
    firstActor,
    lastActor,
    currentlyPlayingDate,
    changeCurrentlyPlayingDate,
    currentArchivedActorsResults,
    changeCurrentArchivedActorsResults,
    changeGuesses,
    changeCurrentMoves,
    changeWin,
    changeEmojiGrid,
    objectiveCurrentDate,
    changeCurrentDegrees,
    changePathRankCount,
    changeAlreadyRewarded,
  } = useContext(AppContext);
  const { changeMostRecentMovie, changeMostRecentActor } =
    useContext(GameContext);
  const navigate = useNavigate();
  const formatDate = (someDate: Date) => {
    return format(someDate, "MM/dd/yyyy", {
      timeZone: "America/New_York",
    });
  };
  const [calendarLimit, changeCalendarLimit] = useState<Date | undefined>(
    undefined
  );
  const [value, onChange] = useState<Date | undefined>(undefined);
  const [resultsLoading, changeResultsLoading] = useState(false);
  const [currentArchiveDate, changeCurrentArchiveDate] = useState("");
  const [firstActorShown, changeFirstActorShown] =
    useState<ActorObj>(firstActor);
  const [lastActorShown, changeLastActorShown] = useState<ActorObj>(lastActor);
  const [pathOpened, changePathOpened] = useState(false);
  const [calendarMode, changeCalendarMode] = useState("calendar");

  // Archive search functionality
  const [searchedActorName, changeSearchedActorName] = useState("");
  const [searchResults, changeSearchResults] = useState<
    ArchiveSearchResult[] | undefined
  >(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (objectiveCurrentDate && !value) {
      const parsedDate = parse(objectiveCurrentDate, "MM/dd/yyyy", new Date());
      changeCalendarLimit(parsedDate);
      onChange(parsedDate);
      changeCurrentArchiveDate(formatDate(parsedDate));
      changePathOpened(false);
    }
  }, [objectiveCurrentDate, value]);

  const handlePlayButton = () => {
    if (currentArchiveDate !== currentlyPlayingDate) {
      changeCurrentlyPlayingDate(currentArchiveDate);
      changeGuesses([]);
      changeCurrentMoves(0);
      changeCurrentDegrees(0);
      changeWin(false);
      changeEmojiGrid([]);
      changePathOpened(false);
      changeMostRecentMovie({
        guess: "",
        type: "",
        year: "",
      });
      changeMostRecentActor({
        guess: "",
        type: "",
        year: "",
      });
      changePathRankCount({
        rank: "",
        count: "",
      });
      changeAlreadyRewarded(false);
      navigate("/", { replace: true });
    }
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    const matchingDateActorsArr = currentArchivedActorsResults.filter(
      (actor) => actor.date === currentArchiveDate
    );
    const source = axios.CancelToken.source();

    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    const fetchData = async () => {
      await axios
        .get(
          nodeEnv && nodeEnv === "production"
            ? `${process.env.REACT_APP_PROD_SERVER}/api/archive_actor`
            : "http://localhost:4000/api/archive_actor",
          {
            params: searchedActorName
              ? { name: searchedActorName }
              : { date: currentArchiveDate },
          }
        )
        .then((res) => res.data)
        .then((data) => {
          if (data && data.length > 0) {
            if (searchedActorName) {
              let allDates: string[] = data.map((el: ActorObj) => el.date);
              // Get only unique dates
              allDates = Array.from(new Set(allDates));
              const modifiedData = allDates.map((date: string) => {
                return {
                  name: searchedActorName,
                  date,
                  actors: data.filter((el: ActorObj) => el.date === date),
                };
              });
              changeSearchResults(modifiedData);
              changeSearchedActorName("");
            } else {
              changeCurrentArchivedActorsResults([
                ...currentArchivedActorsResults,
                ...data,
              ]);
              const firstType = data.find(
                (el: ActorObj) => el.type === "first"
              );
              const lastType = data.find((el: ActorObj) => el.type === "last");
              if (firstType && firstType.name) changeFirstActorShown(firstType);
              if (lastType && lastType.name) changeLastActorShown(lastType);
            }
          } else {
            if (searchedActorName) {
              changeSearchedActorName("");
              changeSearchResults([
                {
                  name: searchedActorName,
                  date: "",
                  actors: [],
                },
              ]);
            }
          }
          changeResultsLoading(false);
        })
        .catch((e) => {
          if (searchedActorName) changeSearchedActorName("");
          changeResultsLoading(false);
          console.error(e);
        });
    };

    if (
      (currentArchiveDate &&
        currentArchiveDate !== objectiveCurrentDate &&
        matchingDateActorsArr.length === 0) ||
      searchedActorName
    ) {
      changeResultsLoading(true);
      changePathOpened(false);
      fetchData();

      return () => source.cancel();
    } else {
      const firstType = matchingDateActorsArr.find(
        (el: ActorObj) => el.type === "first"
      );
      const lastType = matchingDateActorsArr.find(
        (el: ActorObj) => el.type === "last"
      );

      if (firstType && firstType.name) changeFirstActorShown(firstType);
      if (lastType && lastType.name) changeLastActorShown(lastType);
    }
  }, [
    searchedActorName,
    objectiveCurrentDate,
    currentArchiveDate,
    currentArchivedActorsResults,
    changeCurrentArchivedActorsResults,
  ]);

  const handleDateChange = (date: Date | undefined) => {
    onChange(date);
    if (pathOpened) changePathOpened(false);
  };

  return (
    <div className={`archive_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`archived_game_title ${darkMode ? "dark" : ""}`}>
        <BackButton />
        PLAY AN ARCHIVED GAME
      </h2>
      {/* <h2
        className={`archived_game_title selection_buttons ${
          darkMode ? "dark" : ""
        }`}
      >
        <span
          className={`archived_selection_button ${
            calendarMode === "calendar" ? "selected" : ""
          } who_button btn btn-secondary`}
          onClick={() => changeCalendarMode("calendar")}
        >
          CALENDAR
        </span>
        <span
          className={`archived_selection_button ${
            calendarMode === "search" ? "selected" : ""
          } who_button btn btn-secondary`}
          onClick={() => changeCalendarMode("search")}
        >
          SEARCH
        </span>
      </h2> */}
      <p className="archive_prompt">
        Select a past Hollywoodle game{" "}
        {calendarMode === "calendar"
          ? "by picking an available date from the calendar."
          : "by searching for a particular actor's name."}
        <br />
        <br />
        Available top paths are the lowest degree, most popular paths chosen by
        players on the day of that particular actor pairing.
      </p>
      {calendarMode === "calendar" ? (
        <>
          {objectiveCurrentDate && calendarLimit && value && (
            <Calendar
              onChange={handleDateChange}
              value={value}
              calendarType={"US"}
              defaultView={"month"}
              minDetail={"year"}
              defaultValue={calendarLimit}
              maxDate={calendarLimit}
              minDate={new Date(2022, 3, 1)}
              prevLabel={<CgChevronLeftO size={25} color="#fff" />}
              prev2Label={<CgChevronDoubleLeftO size={25} color="#fff" />}
              nextLabel={<CgChevronRightO size={25} color="#fff" />}
              next2Label={<CgChevronDoubleRightO size={25} color="#fff" />}
              tileContent={({ activeStartDate, date, view }) => {
                return calendarLimit &&
                  formatDate(date) === formatDate(calendarLimit) ? (
                  <AiFillStar size={25} className="current_date_star" />
                ) : null;
              }}
              onClickDay={(value) =>
                changeCurrentArchiveDate(formatDate(value))
              }
              showNeighboringMonth={false}
            />
          )}
          <div className="archive_results_container">
            <div className={`archive_date_container ${darkMode ? "dark" : ""}`}>
              <p>Selected Date:</p>
              <h3>{currentArchiveDate}</h3>
            </div>
            <div className="archive_date_actors_container">
              {resultsLoading ? (
                <div className="archive_loading_container">
                  <ClipLoader color="#fff" size={100} />
                </div>
              ) : firstActorShown && lastActorShown ? (
                <>
                  <div
                    className={`archive_individual_actor_container ${
                      darkMode ? "dark" : ""
                    }`}
                  >
                    <h2>Starting Actor</h2>
                    <ActorMovieContainer
                      name={firstActorShown.name}
                      image={firstActorShown.image}
                    />
                  </div>
                  <div
                    className={`archive_individual_actor_container ${
                      darkMode ? "dark" : ""
                    }`}
                  >
                    <BsArrowRight
                      className={`achive_actor_separator_arrow ${
                        darkMode ? "dark" : ""
                      }`}
                      size={30}
                    />
                  </div>
                  <div
                    className={`archive_individual_actor_container ${
                      darkMode ? "dark" : ""
                    }`}
                  >
                    <h2>Goal Actor</h2>
                    <ActorMovieContainer
                      name={lastActorShown.name}
                      image={lastActorShown.image}
                    />
                  </div>
                </>
              ) : (
                <p>No available results for that date!</p>
              )}
            </div>
            {!resultsLoading && (
              <div className="archived_buttons_container">
                <Button
                  onClick={handlePlayButton}
                  className={`guess_button archived_play_button ${
                    darkMode ? "dark" : ""
                  } ${
                    currentArchiveDate === currentlyPlayingDate
                      ? "disabled"
                      : ""
                  }`}
                >
                  PLAY
                </Button>
                {firstActorShown.most_popular_path?.degrees ||
                lastActorShown.most_popular_path?.degrees ? (
                  currentArchiveDate !== currentlyPlayingDate ? (
                    <>
                      <div className="top_path_button_container">
                        {
                          <p
                            className={`spoiler_warning ${
                              darkMode ? "dark" : ""
                            } ${pathOpened ? "open" : ""}`}
                          >
                            Spoilers ahead!
                          </p>
                        }
                        <Button
                          onClick={() => changePathOpened(!pathOpened)}
                          className={`who_button btn btn-secondary dark ${
                            currentArchiveDate === currentlyPlayingDate
                              ? "disabled"
                              : ""
                          }`}
                        >
                          {pathOpened ? "HIDE" : "REVEAL"} TOP PATH
                        </Button>
                      </div>
                      <Collapse
                        isOpened={pathOpened}
                        initialStyle={{ height: 0, overflow: "hidden" }}
                      >
                        <div
                          className={`archived_collapse collapse_container ${
                            darkMode ? "dark" : ""
                          }`}
                        >
                          {pathOpened ? (
                            <p className="collapsed_path_full_info">
                              <span>
                                {firstActorShown.most_popular_path?.degrees ||
                                  lastActorShown.most_popular_path
                                    ?.degrees}{" "}
                                {firstActorShown.most_popular_path?.degrees ===
                                  1 ||
                                lastActorShown.most_popular_path?.degrees === 1
                                  ? "degree"
                                  : "degrees"}{" "}
                                of separation:
                              </span>
                              <br /> <br />
                              {firstActorShown.most_popular_path?.path ||
                                lastActorShown.most_popular_path?.path}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </Collapse>
                    </>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <AutosuggestInput
            typeOfGuess="actor"
            archivedSearch={true}
            archiveCallback={(name: string) => {
              if (searchedActorName !== name) {
                changeSearchedActorName(name);
              }
            }}
          />
          {searchResults &&
          searchResults.length > 0 &&
          searchResults[0]?.date ? (
            <div className="archive_search_results_container">
              <p className="archive_search_results_found">
                <b>{searchResults.length}</b> result
                {searchResults.length === 1 ? "" : "s"} found for{" "}
                <b>{searchResults[0].name}</b>:
              </p>
              {searchResults.map((result, i) => {
                return (
                  <div className="archive_search_result" key={i}>
                    <p className="archive_search_date">
                      <span>Game Date</span>
                      <span>{result.date}</span>
                    </p>
                    <div className="archive_search_actors_container">
                      {result.actors.map((actor, i) => {
                        return (
                          <>
                            <div className="archive_search_actors_container">
                              <div
                                className={`archive_individual_actor_container ${
                                  darkMode ? "dark" : ""
                                }`}
                              >
                                {i === 0 ? (
                                  <h2>Starting Actor</h2>
                                ) : (
                                  <h2>Goal Actor</h2>
                                )}
                                <ActorMovieContainer
                                  name={actor.name}
                                  image={actor.image}
                                />
                              </div>
                            </div>
                            {i === 0 ? (
                              <div className="archive_search_actors_container">
                                <BsArrowRight
                                  className={`achive_actor_separator_arrow ${
                                    darkMode ? "dark" : ""
                                  }`}
                                  size={30}
                                />
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searchResults && Array.isArray(searchResults) ? (
            <div className="archive_search_results_container">
              <p className="archive_search_results_found">
                No results found for <b>{searchResults[0].name}</b>.
              </p>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};
