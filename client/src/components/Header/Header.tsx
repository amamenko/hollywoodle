import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { ReactComponent as LogoWhite } from "../../assets/LogoWhite.svg";
import { HowToPlayModal } from "../HowToPlayModal/HowToPlayModal";
import { BiBarChartAlt2 } from "react-icons/bi";
import { GiBackwardTime } from "react-icons/gi";
// import { GrTrophy } from "react-icons/gr";
import { Statistics } from "./Statistics";
import { Support } from "./Support";
import { ArchivedModal } from "./ArchiveModal/ArchivedModal";
import { ContactModal } from "./ContactModal/ContactModal";
// import { Leaderboard } from "./Leaderboard/Leaderboard";
import { Burger } from "./Burger/Burger";
import { MovesPopover } from "./Popovers/MovesPopover";
import { DegreesPopover } from "./Popovers/DegreePopover";
import "./Header.scss";

export const Header = () => {
  const {
    currentMoves,
    darkMode,
    currentlyPlayingDate,
    objectiveCurrentDate,
    currentDegrees,
  } = useContext(AppContext);
  const [modalOpen, changeModalOpen] = useState(false);
  const [showSupportModal, changeShowSupportModal] = useState(false);
  const [showArchivedModal, changeShowArchivedModal] = useState(false);
  const [showContactModal, changeShowContactModal] = useState(false);
  // const [showLeaderboardModal, changeShowLeaderboardModal] = useState(false);
  const [archivedGame, changeArchivedGame] = useState(false);
  const [burgerMenuOpen, changeBurgerMenuOpen] = useState(false);
  const [degreesPopoverOpen, changeDegreesPopoverOpen] = useState(false);
  const [movesPopoverOpen, changeMovesPopoverOpen] = useState(false);

  const toggleDegreesPopover = () => {
    changeDegreesPopoverOpen(!degreesPopoverOpen);
  };

  const toggleMovesPopover = () => {
    changeMovesPopoverOpen(!movesPopoverOpen);
  };

  const closeModal = () => {
    changeModalOpen(false);
  };

  useEffect(() => {
    if (objectiveCurrentDate) {
      if (
        currentlyPlayingDate &&
        currentlyPlayingDate !== objectiveCurrentDate
      ) {
        changeArchivedGame(true);
      } else {
        if (archivedGame) changeArchivedGame(false);
      }
    }
  }, [archivedGame, currentlyPlayingDate, objectiveCurrentDate]);

  return (
    <div className={`header ${darkMode ? "dark" : ""}`}>
      <div className="inner_header_container">
        <Burger
          burgerMenuOpen={burgerMenuOpen}
          changeBurgerMenuOpen={changeBurgerMenuOpen}
          changeShowContactModal={changeShowContactModal}
          changeShowSupportModal={changeShowSupportModal}
        />
        <HowToPlayModal />
        <ContactModal
          showContactModal={showContactModal}
          changeShowContactModal={changeShowContactModal}
        />
        {/* <GrTrophy
          className="leaderboard_icon"
          size={20}
          onClick={() => changeShowLeaderboardModal(true)}
        />
        <Leaderboard
          showLeaderboardModal={showLeaderboardModal}
          changeShowLeaderboardModal={changeShowLeaderboardModal}
        /> */}
        <LogoWhite className="hollywoodle_logo" />
        <GiBackwardTime
          className="archive_icon"
          color={"#fff"}
          size={28}
          onClick={() => changeShowArchivedModal(true)}
        />
        <ArchivedModal
          showArchivedModal={showArchivedModal}
          changeShowArchivedModal={changeShowArchivedModal}
        />
        <Support
          showSupportModal={showSupportModal}
          changeShowSupportModal={changeShowSupportModal}
        />
        <BiBarChartAlt2
          className="header_graph_icon"
          color={"#fff"}
          size={25}
          onClick={() => changeModalOpen(true)}
        />
        <Statistics modalOpen={modalOpen} closeModal={closeModal} />
      </div>
      <div className={`points_container ${darkMode ? "dark" : ""}`}>
        {archivedGame && (
          <p className={`archived_denotation ${darkMode ? "dark" : ""}`}>
            Archived Game
          </p>
        )}
        <div className="points_inner_container">
          <div
            className={`points_type_container ${darkMode ? "dark" : ""}`}
            onClick={toggleDegreesPopover}
          >
            <DegreesPopover
              degreesPopoverOpen={degreesPopoverOpen}
              changeDegreesPopoverOpen={changeDegreesPopoverOpen}
            />
            <p>Degrees:</p>
            <p className="number_points_title">{currentDegrees}</p>
          </div>
          <div
            className={`points_type_container ${darkMode ? "dark" : ""}`}
            onClick={toggleMovesPopover}
          >
            <MovesPopover
              movesPopoverOpen={movesPopoverOpen}
              changeMovesPopoverOpen={changeMovesPopoverOpen}
            />
            <p>Moves:</p>
            <p className="number_points_title">{currentMoves}</p>
          </div>
        </div>
        {archivedGame && (
          <p className={`archived_denotation date ${darkMode ? "dark" : ""}`}>
            {currentlyPlayingDate}
          </p>
        )}
      </div>
    </div>
  );
};
