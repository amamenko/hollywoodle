import { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
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
import { ActorMovieContainer } from "../../ActorMovieContainer/ActorMovieContainer";
import { Button } from "reactstrap";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { AppContext } from "../../../App";
import { RemoveScroll } from "react-remove-scroll";
import { toast } from "react-toastify";
import { Collapse } from "react-collapse";
import { ActorObj } from "../../../interfaces/ActorObj.interface";
import { GameContext } from "../../../pages/Main";
import "./ArchivedModal.scss";
import "../../HowToPlayModal/HowToPlayModal.scss";
import "../Header.scss";
import "react-calendar/dist/Calendar.css";

export const customModalStyles = {
  content: {
    top: "10%",
    left: "auto",
    right: "auto",
    margin: "0 auto",
    paddingBottom: "2rem",
    outline: "none",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(3px)",
    zIndex: 999999999,
    // Extra height to cover footer
    height: "105vh",
  },
};

export const ArchivedModal = ({
  showArchivedModal,
  changeShowArchivedModal,
}: {
  showArchivedModal: boolean;
  changeShowArchivedModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
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
  } = useContext(AppContext);
  const { changeMostRecentMovie, changeMostRecentActor } =
    useContext(GameContext);

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

  useEffect(() => {
    if (objectiveCurrentDate && !value) {
      const parsedDate = parse(objectiveCurrentDate, "MM/dd/yyyy", new Date());
      changeCalendarLimit(parsedDate);
      onChange(parsedDate);
      changeCurrentArchiveDate(formatDate(parsedDate));
      changePathOpened(false);
    }
  }, [objectiveCurrentDate, value]);

  const handleCloseModal = () => {
    changeShowArchivedModal(false);
    changePathOpened(false);
  };

  const handlePlayButton = () => {
    if (currentArchiveDate !== currentlyPlayingDate) {
      changeCurrentlyPlayingDate(currentArchiveDate);
      changeShowArchivedModal(false);
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
    }
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showArchivedModal) toast.dismiss();
  }, [showArchivedModal]);

  useEffect(() => {
    const matchingDateActorsArr = currentArchivedActorsResults.filter(
      (actor) => actor.date === currentArchiveDate
    );
    if (
      currentArchiveDate &&
      currentArchiveDate !== objectiveCurrentDate &&
      matchingDateActorsArr.length === 0
    ) {
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
              params: { date: currentArchiveDate },
            }
          )
          .then((res) => res.data)
          .then((data) => {
            if (data) {
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
            changeResultsLoading(false);
          })
          .catch((e) => {
            changeResultsLoading(false);
            console.error(e);
          });
      };

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
    <RemoveScroll
      // enabled={showArchivedModal}
      enabled={false}
    >
      <Modal
        // isOpen={showArchivedModal}
        isOpen={false}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container archived_modal"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2 className="archived_game_title">PLAY AN ARCHIVED GAME</h2>
        <button
          className="close_modal_button archived_game"
          onClick={handleCloseModal}
        >
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <p className="archive_prompt">
          Select a past Hollywoodle game by picking an available date from the
          calendar.
          <br />
          <br />
          Available top paths are the lowest degree, most popular paths chosen
          by players on the day of that particular actor pairing.
        </p>
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
            onClickDay={(value) => changeCurrentArchiveDate(formatDate(value))}
            showNeighboringMonth={false}
          />
        )}
        <div className="archive_results_container">
          <div className="archive_date_container">
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
                <div className="archive_individual_actor_container">
                  <h2>Starting Actor</h2>
                  <ActorMovieContainer
                    name={firstActorShown.name}
                    image={firstActorShown.image}
                  />
                </div>
                <div className="archive_individual_actor_container">
                  <BsArrowRight
                    className="achive_actor_separator_arrow"
                    color={"#fff"}
                    size={30}
                  />
                </div>
                <div className="archive_individual_actor_container">
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
                className={`guess_button archived_play_button dark ${
                  currentArchiveDate === currentlyPlayingDate ? "disabled" : ""
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
                            pathOpened ? "open" : ""
                          }`}
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
                      <div className="archived_collapse collapse_container dark">
                        {pathOpened ? (
                          <p className="collapsed_path_full_info">
                            <span>
                              {firstActorShown.most_popular_path?.degrees ||
                                lastActorShown.most_popular_path?.degrees}{" "}
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
      </Modal>
    </RemoveScroll>
  );
};
