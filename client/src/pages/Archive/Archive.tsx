import { Fragment, useContext, useEffect, useState } from "react";
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
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { AppContext } from "../../App";
import { ActorObj } from "../../interfaces/ActorObj.interface";
import { Footer } from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import { BackButton } from "../BackButton";
import { AutosuggestInput } from "../../components/AutosuggestInput/AutosuggestInput";
import { ArchiveSearchResult } from "../../interfaces/ArchiveSearchResult.interface";
import { ArchiveButtons } from "./Buttons/ArchiveButtons";
import "./Archive.scss";
import "react-calendar/dist/Calendar.css";

export const Archive = () => {
  const {
    darkMode,
    firstActor,
    lastActor,
    currentArchivedActorsResults,
    changeCurrentArchivedActorsResults,
    objectiveCurrentDate,
  } = useContext(AppContext);
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

  const selectCalendar = () => {
    changeCalendarMode("calendar");
    if (pathOpened) changePathOpened(false);
  };

  const selectSearch = () => {
    changeCalendarMode("search");
    if (pathOpened) changePathOpened(false);
  };

  return (
    <div className={`archive_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`archived_game_title ${darkMode ? "dark" : ""}`}>
        <BackButton />
        PLAY AN ARCHIVED GAME
      </h2>
      <h2
        className={`archived_game_title selection_buttons ${
          darkMode ? "dark" : ""
        }`}
      >
        <span
          className={`archived_selection_button ${
            calendarMode === "calendar" ? "selected" : ""
          } who_button btn btn-secondary`}
          onClick={selectCalendar}
        >
          CALENDAR
        </span>
        <span
          className={`archived_selection_button ${
            calendarMode === "search" ? "selected" : ""
          } who_button btn btn-secondary`}
          onClick={selectSearch}
        >
          SEARCH
        </span>
      </h2>
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
              <ArchiveButtons
                pathOpened={pathOpened}
                changePathOpened={changePathOpened}
                currentArchiveDate={currentArchiveDate}
                firstActorShown={firstActorShown}
                lastActorShown={lastActorShown}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className={`archive_search_input_container ${
              darkMode ? "dark" : ""
            }`}
          >
            <AutosuggestInput
              typeOfGuess="actor"
              archivedSearch={true}
              archiveCallback={(name: string) => {
                if (searchedActorName !== name) {
                  changeSearchedActorName(name);
                }
              }}
            />
          </div>
          {resultsLoading ? (
            <div className="archive_search_loading">
              <div className="archive_loading_container">
                <ClipLoader color="#fff" size={100} />
              </div>
            </div>
          ) : searchResults &&
            searchResults.length > 0 &&
            searchResults[0]?.date ? (
            <div className="archive_search_results_container">
              <p className="archive_search_results_found">
                <b>{searchResults.length}</b> game
                {searchResults.length === 1 ? "" : "s"} found containing{" "}
                <b>{searchResults[0].name}</b>:
              </p>
              {searchResults.map((result, i) => {
                return (
                  <Fragment key={i}>
                    <div className="archive_search_result" key={i}>
                      <div
                        className={`archive_search_date ${
                          darkMode ? "dark" : ""
                        }`}
                      >
                        <span className={"circle_and_numbers_container"}>
                          <span className="rank_circle">
                            <p>{i + 1}</p>
                          </span>
                        </span>
                        <span className="search_game_date_header">
                          Game Date
                        </span>
                        <span className="search_game_date">{result.date}</span>
                      </div>
                      <div className="archive_search_actors_container">
                        {result.actors
                          .sort((a: ActorObj, b: ActorObj) => {
                            return a.type === "first"
                              ? -1
                              : b.type === "first"
                              ? 1
                              : 0;
                          })
                          .map((actor, i) => {
                            return (
                              <Fragment key={i}>
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
                              </Fragment>
                            );
                          })}
                      </div>
                    </div>
                    {!resultsLoading && (
                      <ArchiveButtons
                        pathOpened={pathOpened}
                        changePathOpened={changePathOpened}
                        currentArchiveDate={result.date}
                        firstActorShown={result.actors[0]}
                        lastActorShown={result.actors[1]}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          ) : searchResults && Array.isArray(searchResults) ? (
            <div className="archive_search_results_container">
              <p className="archive_search_results_found">
                No games found containing <b>{searchResults[0].name}</b>.
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
