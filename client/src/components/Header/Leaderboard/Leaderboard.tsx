import React, { useEffect, useState } from "react";
// import axios from "axios";
import { RemoveScroll } from "react-remove-scroll";
import Modal from "react-modal";
import Flag from "react-world-flags";
import { customModalStyles } from "../ArchiveModal/ArchivedModal";
import { AiOutlineClose } from "react-icons/ai";
import { Table } from "reactstrap";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { MdArrowBackIosNew } from "react-icons/md";
import Spotlight from "../../../assets/Spotlight.png";
import { LeaderNavigation } from "./LeaderNavigation";
import { toast } from "react-toastify";
import "./Leaderboard.scss";

export const Leaderboard = ({
  showLeaderboardModal,
  changeShowLeaderboardModal,
}: {
  showLeaderboardModal: boolean;
  changeShowLeaderboardModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [userCountryCode, changeUserCountryCode] = useState("");
  // const [userCountryName, changeUserCountryName] = useState("");
  const [collapseOpen, changeCollapseOpen] = useState(false);
  const [currentlyExpanded, changeCurrentlyExpanded] = useState(0);
  const [leaderboardPage, changeLeaderboardPage] = useState("");

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showLeaderboardModal) toast.dismiss();
  }, [showLeaderboardModal]);

  //   useEffect(() => {
  //     if (!userCountryCode) {
  //       const source = axios.CancelToken.source();

  //       const getData = async () => {
  //         const res = await axios.get(
  //           `https://geolocation-db.com/json/${process.env.REACT_APP_GEOLOCATION_KEY}`
  //         );
  //         if (res.data && res.data.country_code && res.data.country_name) {
  //           changeUserCountryCode(res.data.country_code);
  //           changeUserCountryName(res.data.country_name);
  //         } else {
  //           changeUserCountryCode("US");
  //           changeUserCountryName("United States");
  //         }
  //       };

  //       getData();

  //       return () => source.cancel();
  //     }
  //   }, [userCountryName, userCountryCode]);

  const handleCloseModal = () => {
    changeShowLeaderboardModal(false);
    changeLeaderboardPage("");
  };

  const collapseTriggerElement = (rank: number) => {
    return (
      <div
        className="collapse_trigger_element"
        onClick={() => changeCollapseOpen(!collapseOpen)}
      >
        <IoIosArrowDropdownCircle
          className={`collapse_caret ${collapseOpen ? "open" : ""} ${
            rank === currentlyExpanded ? "expanded" : ""
          }`}
          size={20}
        />
      </div>
    );
  };

  const tableData = [
    {
      rank: 1,
      user: "RandyTsunami",
      countryCode: "US",
      moves: 1,
      time: "12:01 AM",
      path: "Rebecca Ferguson ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya  ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya  ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya",
    },
    {
      rank: 2,
      user: "SomeoneElse",
      countryCode: "UKR",
      moves: 1,
      time: "12:02 AM",
      path: "Rebecca Ferguson ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya",
    },
    {
      rank: 3,
      user: "RandomGuy",
      countryCode: "RUS",
      moves: 1,
      time: "12:05 AM",
      path: "Rebecca Ferguson ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya",
    },
    {
      rank: 4,
      user: "TesterMcTest",
      countryCode: "LT",
      moves: 1,
      time: "12:05 AM",
      path: "",
    },
    {
      rank: 5,
      user: "OneMore",
      countryCode: "CA",
      moves: 1,
      time: "12:06 AM",
      path: "",
    },
    {
      rank: 6,
      user: "WhatsitToya",
      countryCode: "MX",
      moves: 1,
      time: "12:07 AM",
      path: "",
    },
    {
      rank: 7,
      user: "Not Me",
      countryCode: "IND",
      moves: 2,
      time: "12:08 AM",
      path: "",
    },
    {
      rank: 8,
      user: "Fake Name",
      countryCode: "CN",
      moves: 3,
      time: "12:08 AM",
      path: "",
    },
    {
      rank: 9,
      user: "Filler Noun",
      countryCode: "JP",
      moves: 3,
      time: "12:09 AM",
      path: "",
    },
    {
      rank: 10,
      user: "John Doe",
      countryCode: "FI",
      moves: 3,
      time: "12:15 AM",
      path: "Rebecca Ferguson ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya  ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya  ➡️ The Greatest Showman (2017) ➡️ Zendaya ➡️ The Greatest Showman (2017) ➡️ Zendaya",
    },
  ];

  return (
    <RemoveScroll enabled={showLeaderboardModal}>
      <Modal
        isOpen={showLeaderboardModal}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container leaderboard_modal"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <>
          <div className="leadboard_title_container">
            <img
              className="spotlight_image left"
              src={Spotlight}
              alt="Spotlight"
            />
            <h2 className="leaderboard_title">
              {leaderboardPage === "today" ? "TODAY'S" : ""} HOLLYWOODLE
              <br />
              LEADERBOARD
            </h2>
            <img className="spotlight_image" src={Spotlight} alt="Spotlight" />
          </div>
          <button
            className="close_modal_button archived_game"
            onClick={handleCloseModal}
          >
            <AiOutlineClose size={20} color="#fff" />
          </button>
          {leaderboardPage && (
            <button
              className="back_modal_button"
              onClick={() => changeLeaderboardPage("")}
            >
              <MdArrowBackIosNew size={20} color="#fff" />
            </button>
          )}
          <div className="leaderboard_container">
            {leaderboardPage === "" ? (
              <LeaderNavigation changeLeaderboardPage={changeLeaderboardPage} />
            ) : (
              <>
                <p className="leaderboard_disclaimer">
                  Click on any leaderboard user's row to view their full correct
                  actor connection path (although you won't be able to be
                  considered for that day's leaderboard if you do.)
                  <br />
                  <br />
                  Keep in mind that only your <b>first</b> daily game attempt
                  qualifies you for that day's leaderboard.
                </p>
                <Table className="main_leaderboard">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Country</th>
                      <th>Moves</th>
                      <th>Time (ET)</th>
                      <th>Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => {
                      return (
                        <React.Fragment key={index}>
                          <tr
                            onClick={() => {
                              if (row.rank === currentlyExpanded) {
                                changeCurrentlyExpanded(0);
                              } else {
                                changeCurrentlyExpanded(row.rank);
                              }
                            }}
                            className="table_row"
                          >
                            <th scope="row">{row.rank}</th>
                            <td>{row.user}</td>
                            <td>
                              <Flag code={row.countryCode} height="16" />
                            </td>
                            <td>{row.moves}</td>
                            <td>{row.time}</td>
                            <td>{collapseTriggerElement(row.rank)}</td>
                          </tr>
                          <tr>
                            <td colSpan={6} className="expanded_td_container">
                              <div
                                className={`table_path ${
                                  row.rank === currentlyExpanded
                                    ? "expanded"
                                    : ""
                                }`}
                              >
                                <h2>{row.user}'s Path</h2>
                                <p>{row.path}</p>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            )}
          </div>
        </>
      </Modal>
    </RemoveScroll>
  );
};
