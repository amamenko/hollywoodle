import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { ReactComponent as LogoWhite } from "../../assets/LogoWhite.svg";
import { HowToPlayModal } from "../HowToPlayModal/HowToPlayModal";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";
import { GiBackwardTime } from "react-icons/gi";
import { BiHeart } from "react-icons/bi";
import { Statistics } from "./Statistics";
import { Support } from "./Support";
import { ArchivedModal } from "./ArchiveModal/ArchivedModal";
import { format } from "date-fns-tz";
import "./Header.scss";

export const Header = () => {
  const { currentMoves, darkMode, changeDarkMode, currentlyPlayingDate } =
    useContext(AppContext);
  const [modalOpen, changeModalOpen] = useState(false);
  const [showSupportModal, changeShowSupportModal] = useState(false);
  const [showArchivedModal, changeShowArchivedModal] = useState(false);
  const [archivedGame, changeArchivedGame] = useState(false);

  const toggleLightDarkMode = () => {
    changeDarkMode(!darkMode);
  };

  const closeModal = () => {
    changeModalOpen(false);
  };

  useEffect(() => {
    const currentDate = format(new Date(), "MM/dd/yyyy", {
      timeZone: "America/New_York",
    });

    if (currentlyPlayingDate && currentlyPlayingDate !== currentDate) {
      changeArchivedGame(true);
    } else {
      if (archivedGame) changeArchivedGame(false);
    }
  }, [archivedGame, currentlyPlayingDate]);

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
