import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { ReactComponent as LogoWhite } from "../../assets/LogoWhite.svg";
import { HowToPlayModal } from "../HowToPlayModal/HowToPlayModal";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";
import { GiBackwardTime } from "react-icons/gi";
import { BiHeart } from "react-icons/bi";
// import { GrTrophy } from "react-icons/gr";
import { Statistics } from "./Statistics";
import { Support } from "./Support";
import { ArchivedModal } from "./ArchiveModal/ArchivedModal";
// import { Leaderboard } from "./Leaderboard/Leaderboard";
import "./Header.scss";

export const Header = () => {
  const {
    currentMoves,
    darkMode,
    changeDarkMode,
    currentlyPlayingDate,
    objectiveCurrentDate,
  } = useContext(AppContext);
  const [modalOpen, changeModalOpen] = useState(false);
  const [showSupportModal, changeShowSupportModal] = useState(false);
  const [showArchivedModal, changeShowArchivedModal] = useState(false);
  // const [showLeaderboardModal, changeShowLeaderboardModal] = useState(false);
  const [archivedGame, changeArchivedGame] = useState(false);

  const toggleLightDarkMode = () => {
    changeDarkMode(!darkMode);
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
        <HowToPlayModal />
        <BiHeart
          className="support_icon"
          color={"#fff"}
          size={27}
          onClick={() => changeShowSupportModal(true)}
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
        {darkMode ? (
          <MdDarkMode
            className="light_dark_mode_icon"
            color={"#fff"}
            size={25}
            onClick={toggleLightDarkMode}
          />
        ) : (
          <MdOutlineDarkMode
            className="light_dark_mode_icon"
            color={"#fff"}
            size={25}
            onClick={toggleLightDarkMode}
          />
        )}
        <Statistics modalOpen={modalOpen} closeModal={closeModal} />
      </div>
      <div className={`points_container ${darkMode ? "dark" : ""}`}>
        {archivedGame && (
          <p className={`archived_denotation ${darkMode ? "dark" : ""}`}>
            Archived Game
          </p>
        )}
        Total Moves: {currentMoves}
        {archivedGame && (
          <p className={`archived_denotation date ${darkMode ? "dark" : ""}`}>
            {currentlyPlayingDate}
          </p>
        )}
      </div>
    </div>
  );
};
