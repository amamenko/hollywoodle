import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
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
import { AppContext } from "../../../App";
import { io } from "socket.io-client";
import "./Leaderboard.scss";

export const Leaderboard = ({
  showLeaderboardModal,
  changeShowLeaderboardModal,
}: {
  showLeaderboardModal: boolean;
  changeShowLeaderboardModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { firstActor, lastActor, objectiveCurrentDate } =
    useContext(AppContext);

  // const [userCountryCode, changeUserCountryCode] = useState("");
  // const [userCountryName, changeUserCountryName] = useState("");
  const [collapseOpen, changeCollapseOpen] = useState(false);
  const [currentlyExpanded, changeCurrentlyExpanded] = useState(0);
  const [leaderboardPage, changeLeaderboardPage] = useState("");
  const [tableData, changeTableData] = useState<
    { [key: string]: number | string }[]
  >([]);

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

  useEffect(() => {
    if (showLeaderboardModal && leaderboardPage === "today") {
      const source = axios.CancelToken.source();

      const nodeEnv = process.env.REACT_APP_NODE_ENV
        ? process.env.REACT_APP_NODE_ENV
        : "";

      const fetchData = async () => {
        await axios
          .get(
            nodeEnv && nodeEnv === "production"
              ? `${process.env.REACT_APP_PROD_SERVER}/api/leaderboard`
              : "http://localhost:4000/api/leaderboard"
          )
          .then((res) => res.data)
          .then((data) => {
            if (data && data[0] && data[0].leaderboard) {
              changeTableData(data[0].leaderboard);
            }
          })
          .catch((e) => {
            // changeResultsLoading(false);
            console.error(e);
          });
      };

      fetchData();

      const socket = io(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}`
          : "http://localhost:4000"
      );

      socket.on("connect", () => {
        console.log(socket.id);
      });

      socket.on("changeData", (arg) => {
        if (arg && Array.isArray(arg)) {
          changeTableData(arg);
        }
      });

      return () => {
        socket.close();
        source.cancel();
      };
    }

    return () => {};
  }, [showLeaderboardModal, leaderboardPage]);

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
              {leaderboardPage === "today" ? "TODAY'S" : "THE"} HOLLYWOODLE
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
                <span className="leaderboard_connection_header">
                  <p>{objectiveCurrentDate}</p>
                  <p>
                    {firstActor.name} → {lastActor.name}
                  </p>
                </span>
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
                      <th>Username</th>
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
                                changeCurrentlyExpanded(Number(row.rank));
                              }
                            }}
                            className="table_row"
                          >
                            <th scope="row">{row.rank}</th>
                            <td>{row.username}</td>
                            <td>
                              <Flag
                                code={row.countryCode.toString()}
                                height="16"
                              />
                            </td>
                            <td>{row.moves}</td>
                            <td>{row.time}</td>
                            <td>{collapseTriggerElement(Number(row.rank))}</td>
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
                                <h2>{`${row.username}'s Path`}</h2>
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
