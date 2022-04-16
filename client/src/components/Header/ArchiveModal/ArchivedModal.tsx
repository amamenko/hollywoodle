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
import { ActorObj, AppContext } from "../../../App";
import { RemoveScroll } from "react-remove-scroll";
import { toast } from "react-toastify";
import "./ArchivedModal.scss";
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
    changeMostRecentMovie,
    changeMostRecentActor,
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

  useEffect(() => {
    if (objectiveCurrentDate && !value) {
      const parsedDate = parse(objectiveCurrentDate, "MM/dd/yyyy", new Date());
      changeCalendarLimit(parsedDate);
      onChange(parsedDate);
      changeCurrentArchiveDate(formatDate(parsedDate));
    }
  }, [objectiveCurrentDate, value]);

  const handleCloseModal = () => {
    changeShowArchivedModal(false);
  };

  const handlePlayButton = () => {
    if (currentArchiveDate !== currentlyPlayingDate) {
      changeCurrentlyPlayingDate(currentArchiveDate);
      changeShowArchivedModal(false);
      changeGuesses([]);
      changeCurrentMoves(0);
      changeWin(false);
      changeEmojiGrid([]);
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

  return (
    <RemoveScroll enabled={showArchivedModal}>
      <Modal
        isOpen={showArchivedModal}
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
        </p>
        {objectiveCurrentDate && calendarLimit && value && (
          <Calendar
            onChange={onChange}
            value={value}
            calendarType={"US"}
            defaultView={"month"}
            minDetail={"year"}
            activeStartDate={calendarLimit}
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
            <Button
              onClick={handlePlayButton}
              className={`guess_button archived_play_button dark ${
                currentArchiveDate === currentlyPlayingDate ? "disabled" : ""
              }`}
            >
              PLAY
            </Button>
          )}
        </div>
      </Modal>
    </RemoveScroll>
  );
};
