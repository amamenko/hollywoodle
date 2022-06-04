import React from "react";
import { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { PathContainer } from "./PathContainer";
import { RemoveScroll } from "react-remove-scroll";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { AppContext } from "../../../App";
import { IoFootsteps } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import ReactPaginate from "react-paginate";
import "../Header.scss";
import "./TopPaths.scss";
import "../Leaderboard/Leaderboard.scss";
import "./pagination.scss";

export const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    paddingBottom: "2rem",
    outline: "none",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(3px)",
    zIndex: 999999999,
  },
};

export const TopPaths = () => {
  const {
    firstActor,
    lastActor,
    objectiveCurrentDate,
    showTopPathsModal,
    changeShowTopPathsModal,
  } = useContext(AppContext);

  const [pathsLoading, changePathsLoading] = useState(false);
  const [pathCollapsed, changePathCollapsed] = useState<string>("");
  const [topPaths, changeTopPaths] = useState<
    {
      degrees: number;
      count: number;
      path: string;
    }[]
  >([]);
  const [pageCount, changePageCount] = useState(0);
  const [currentPage, changeCurrentPage] = useState(0);
  // Aggregated top paths data metrics
  const [totalPathsFound, changeTotalPathsFound] = useState(0);
  const [totalPlayers, changeTotalPlayers] = useState(0);
  const [lowestDegree, changeLowestDegree] = useState(0);
  const [highestDegree, changeHighestDegree] = useState(0);
  const itemsPerPage = 10;

  const handleCloseModal = () => {
    changeShowTopPathsModal(false);
  };

  useEffect(() => {
    if (showTopPathsModal) {
      // Remove all displayed toasts on modal open
      toast.dismiss();
    } else {
      // Clear states on modal close
      changePathCollapsed("");
      changeTopPaths([]);
      changePageCount(0);
      changeCurrentPage(0);
      changeTotalPathsFound(0);
      changeLowestDegree(0);
      changeHighestDegree(0);
    }
  }, [showTopPathsModal]);

  const fetchData = async (page?: number) => {
    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    await axios
      .get(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}/api/top_paths`
          : "http://localhost:4000/api/top_paths",
        {
          params: {
            page: page || 0,
          },
        }
      )
      .then((res) => res.data)
      .then((data) => {
        changePathsLoading(false);
        if (data.paths) changeTopPaths(data.paths);
        if (data.totalPathsFound) {
          changeTotalPathsFound(data.totalPathsFound);
          changePageCount(Math.ceil(data.totalPathsFound / itemsPerPage));
        }
        if (data.totalPlayers) changeTotalPlayers(data.totalPlayers);
        if (data.lowestDegree) changeLowestDegree(data.lowestDegree);
        if (data.highestDegree) changeHighestDegree(data.highestDegree);
      })
      .catch((e) => {
        changePathsLoading(false);
        console.error(e);
      });
  };

  useEffect(() => {
    if (showTopPathsModal) {
      changePathsLoading(true);
      const source = axios.CancelToken.source();

      fetchData();

      return () => {
        source.cancel();
      };
    }

    return () => {};
  }, [showTopPathsModal]);

  useEffect(() => {
    if (showTopPathsModal) {
      const nodeEnv = process.env.REACT_APP_NODE_ENV
        ? process.env.REACT_APP_NODE_ENV
        : "";

      const socket = io(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}`
          : "http://localhost:4000",
        {
          transports: ["websocket"],
          upgrade: false,
        }
      );

      socket.on("pageCheck", (arg, callback) => {
        callback(currentPage);
      });

      socket.on("changeData", (arg) => {
        if (arg && arg.paths && Array.isArray(arg.paths)) {
          const allCurrentPaths = topPaths.map((el) => `${el.path}${el.count}`);
          const argPaths = arg.paths.map(
            (el: { [key: string]: string | number }) => `${el.path}${el.count}`
          );

          const arrEqualityCheck = (arr1: string[], arr2: string[]) => {
            return (
              arr1.length === arr2.length &&
              arr1.every((el, index) => el === arr2[index])
            );
          };

          if (!arrEqualityCheck(allCurrentPaths, argPaths))
            changeTopPaths(arg.paths);
          if (arg.totalPathsFound) changeTotalPathsFound(arg.totalPathsFound);
          if (arg.totalPlayers) changeTotalPlayers(arg.totalPlayers);
          if (arg.lowestDegree) changeLowestDegree(arg.lowestDegree);
          if (arg.highestDegree) changeHighestDegree(arg.highestDegree);
        }
      });

      socket.on("disconnect", () => {
        socket.removeAllListeners();
      });

      return () => {
        socket.removeAllListeners();
        socket.close();
      };
    }

    return () => {};
  }, [showTopPathsModal, topPaths, currentPage]);

  const handlePageClick = (event: { [key: string]: number }) => {
    changePathCollapsed("");
    changeCurrentPage(event.selected);
    fetchData(event.selected);
  };

  return (
    <RemoveScroll enabled={showTopPathsModal}>
      <Modal
        isOpen={showTopPathsModal}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2 className="top_paths_title">TODAY'S PATHS</h2>
        <span className="leaderboard_connection_header">
          <p>{objectiveCurrentDate}</p>
          <p>
            {firstActor.name} → {lastActor.name}
          </p>
        </span>
        <button className="close_modal_button" onClick={handleCloseModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <div className="live_designation_container">
          <span className="live_designation" />
          <p>LIVE</p>
        </div>
        <p className="top_paths_prompt">
          All of today's actor connection paths will be shown here. The paths
          are sorted by popularity (descending) and then by degrees of
          separation (ascending.)
          <br />
          <br />
          Only players' first play-through of the day is counted towards a
          path's popularity.
          {totalPathsFound && totalPlayers && lowestDegree && highestDegree ? (
            <>
              <br />
              <br />
              <span className="top_paths_aggregated_data">
                A total of <b>{totalPlayers}</b>{" "}
                {totalPlayers === 1 ? "player has" : "players have"} completed
                today's connection at least once.
                <br />
                <br />
                Players have been able to find <b>{totalPathsFound}</b>{" "}
                {totalPathsFound === 1 ? "unique path" : "unique paths"} today -
                the lowest degrees of separation found{" "}
                {lowestDegree === 1 ? "is" : "are"} <b>{lowestDegree}</b> and
                the highest {highestDegree === 1 ? "is" : "are"}{" "}
                <b>{highestDegree}</b>.
              </span>
            </>
          ) : (
            ""
          )}
          {!pathsLoading && topPaths.length > 0 && (
            <span className="spoilers">Spoilers ahead!</span>
          )}
        </p>
        <div className="all_paths_container">
          {pathsLoading ? (
            <ClipLoader color="#fff" size={150} />
          ) : topPaths.every((el) => !el.path && !el.degrees && !el.count) ? (
            <div className="no_paths_played_container">
              <IoFootsteps size={200} color={"rgb(80, 80, 80)"} />
              <p>No paths have been played yet today!</p>
              <p>Find today's connection and create the first one!</p>
            </div>
          ) : (
            <>
              {topPaths.map((el, i) => {
                if (el.degrees && el.count && el.path) {
                  return (
                    <React.Fragment key={i}>
                      <PathContainer
                        rank={i}
                        degrees={el.degrees}
                        count={el.count}
                        path={el.path}
                        pathCollapsed={pathCollapsed}
                        changePathCollapsed={changePathCollapsed}
                        currentPage={currentPage}
                      />
                    </React.Fragment>
                  );
                } else {
                  return <React.Fragment key={i} />;
                }
              })}
              <ReactPaginate
                breakLabel="..."
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                previousLabel={<BiChevronLeft />}
                nextLabel={<BiChevronRight />}
                renderOnZeroPageCount={() => null}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </>
          )}
        </div>
      </Modal>
    </RemoveScroll>
  );
};
