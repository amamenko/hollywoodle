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
import { ReactComponent as Spotlight } from "../../../assets/Spotlight.svg";
import { LeaderNavigation } from "./LeaderNavigation";
import { toast } from "react-toastify";
import { AppContext } from "../../../App";
import { io } from "socket.io-client";
import Scroll, { Element } from "react-scroll";
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

  const [collapseOpen, changeCollapseOpen] = useState(false);
  const [currentlyExpanded, changeCurrentlyExpanded] = useState(0);
  const [leaderboardPage, changeLeaderboardPage] = useState("");
  const [tableData, changeTableData] = useState<
    { [key: string]: number | string }[]
  >([
    {
      rank: 1,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 2,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 3,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 4,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 5,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 6,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 7,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 8,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 9,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
    {
      rank: 10,
      username: "",
      countryCode: "",
      degrees: 0,
      moves: 0,
      time: "",
      path: "",
    },
  ]);

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showLeaderboardModal) {
      toast.dismiss();
    }
  }, [showLeaderboardModal]);

  useEffect(() => {
    const scroll = Scroll.scroller;
    if (leaderboardPage === "today") {
      scroll.scrollTo("leaderboard_title_container", {
        containerId: "leaderboard_modal",
        offset: -500,
      });
    }
  }, [leaderboardPage]);

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
            if (data) changeTableData(data);
          })
          .catch((e) => {
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
          changeCurrentlyExpanded(0);
        }
      });

      return () => {
        socket.close();
        source.cancel();
      };
    }

    return () => {};
  }, [showLeaderboardModal, leaderboardPage]);

  const handleRowClick = (rank: number, path: string) => {
    if (rank === currentlyExpanded || !path) {
      if (currentlyExpanded !== 0) changeCurrentlyExpanded(0);
    } else {
      changeCurrentlyExpanded(Number(rank));

      const storageStr = localStorage.getItem("hollywoodle-statistics");
      let storageObj: { [key: string]: number | number[] } = {};

      try {
        storageObj = JSON.parse(storageStr ? storageStr : "");
      } catch (e) {
        console.error(e);
      }

      if (storageObj && !storageObj.leaderboard_viewed) {
        localStorage.setItem(
          "hollywoodle-statistics",
          JSON.stringify({
            ...storageObj,
            leaderboard_viewed: objectiveCurrentDate,
            leaderboard_eligible: false,
          })
        );
      }
    }
  };

  return (
    <RemoveScroll enabled={showLeaderboardModal}>
      <Modal
        isOpen={showLeaderboardModal}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container leaderboard_modal"
        id="leaderboard_modal"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <>
          <Element
            className="leadboard_title_container"
            name="leaderboard_title_container"
          >
            <Spotlight className="spotlight_image left" />
            <h2 className="leaderboard_title">
              {leaderboardPage === "today" ? "TODAY'S" : "THE"} HOLLYWOODLE
              <br />
              LEADERBOARD
            </h2>
            <Spotlight className="spotlight_image" />
          </Element>
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
                  actor connection path (although if you haven't yet played
                  today's game, you will no longer remain eligible for today's
                  leaderboard.)
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
                      <th>Degrees</th>
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
                            onClick={() =>
                              handleRowClick(
                                Number(row.rank),
                                row.path.toString()
                              )
                            }
                            className="table_row"
                          >
                            <th scope="row">{row.rank}</th>
                            <td>{row.username ? row.username : "-"}</td>
                            <td>
                              {row.countryCode ? (
                                <Flag
                                  code={row.countryCode.toString()}
                                  height="16"
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>{row.degrees ? row.degrees : "-"}</td>
                            <td>{row.moves ? row.moves : "-"}</td>
                            <td>{row.time ? row.time : "-"}</td>
                            <td>
                              {row.path
                                ? collapseTriggerElement(Number(row.rank))
                                : "-"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={7} className="expanded_td_container">
                              <div
                                className={`table_path ${
                                  row.rank === currentlyExpanded
                                    ? "expanded"
                                    : ""
                                }`}
                              >
                                <h3>{`${row.username}'s Path`}</h3>
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
