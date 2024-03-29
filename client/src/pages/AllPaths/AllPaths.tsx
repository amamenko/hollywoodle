import React, { useRef, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { IoFootsteps } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import ReactPaginate from "react-paginate";
import { AppContext } from "../../App";
import { PathContainer } from "../../components/Header/TopPaths/PathContainer";
import { BackButton } from "../BackButton";
import { Footer } from "../../components/Footer/Footer";
import { useLocation } from "react-router-dom";
import { Path } from "../../interfaces/Path.interface";
import ReconnectingWebSocket from "reconnecting-websocket";
import "./AllPaths.scss";

export const AllPaths = () => {
  const {
    darkMode,
    firstActor,
    lastActor,
    objectiveCurrentDate,
    changeShowTopPathsModal,
  } = useContext(AppContext);
  const socketRef: React.MutableRefObject<WebSocket | null> = useRef(null);
  const currentPage = useRef(0);
  const location = useLocation();
  const [pathsLoading, changePathsLoading] = useState(false);
  const [pathCollapsed, changePathCollapsed] = useState<string>("");
  const [topPaths, changeTopPaths] = useState<Path[]>([]);
  const [pageCount, changePageCount] = useState(0);
  // Aggregated top paths data metrics
  const [totalPathsFound, changeTotalPathsFound] = useState(0);
  const [totalPlayers, changeTotalPlayers] = useState(0);
  const [lowestDegree, changeLowestDegree] = useState(0);
  const [highestDegree, changeHighestDegree] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!socketRef.current) {
      const ws = new ReconnectingWebSocket(
        process.env.REACT_APP_NODE_ENV === "production"
          ? `wss://${process.env.REACT_APP_PROD_BASE_URL}`
          : "ws://localhost:4000",
        [],
        {
          WebSocket: WebSocket,
          maxRetries: 10,
        }
      );
      socketRef.current = ws as unknown as WebSocket;
      ws.onmessage = (event) => {
        if (event.data === "pageCheck") {
          ws.send(JSON.stringify(currentPage.current));
        } else {
          const json = JSON.parse(event.data);
          try {
            if ((json.event = "pathsUpdate")) {
              const updateData = json.data;
              if (
                updateData &&
                updateData.paths &&
                Array.isArray(updateData.paths)
              ) {
                const allCurrentPaths = topPaths.map(
                  (el) => `${el.path}${el.count}`
                );
                const argPaths = updateData.paths.map(
                  (el: { [key: string]: string | number }) =>
                    `${el.path}${el.count}`
                );

                const arrEqualityCheck = (arr1: string[], arr2: string[]) => {
                  return (
                    arr1.length === arr2.length &&
                    arr1.every((el, index) => el === arr2[index])
                  );
                };

                if (!arrEqualityCheck(allCurrentPaths, argPaths)) {
                  changeTopPaths(updateData.paths);
                }

                if (updateData.totalPathsFound) {
                  changeTotalPathsFound(updateData.totalPathsFound);
                  const currentPages = Math.ceil(
                    updateData.totalPathsFound / itemsPerPage
                  );
                  if (currentPages > pageCount) changePageCount(currentPages);
                }
                if (updateData.totalPlayers)
                  changeTotalPlayers(updateData.totalPlayers);
                if (updateData.lowestDegree)
                  changeLowestDegree(updateData.lowestDegree);
                if (updateData.highestDegree)
                  changeHighestDegree(updateData.highestDegree);
              }
            }
          } catch (err) {
            console.error(err);
          }
        }
      };
    }
  }, [pageCount, topPaths]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Toggle off show logic and disconnect socket on unmount
  useEffect(() => {
    return () => {
      changeShowTopPathsModal(false);
      if (socketRef.current) {
        try {
          socketRef.current?.close();
          socketRef.current = null;
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [changeShowTopPathsModal]);

  useEffect(() => {
    if (location.pathname === "/paths") {
      // Remove all displayed toasts on page open
      toast.dismiss();
    } else {
      // Clear states on page close
      changePathCollapsed("");
      changeTopPaths([]);
      changePageCount(0);
      currentPage.current = 0;
      changeTotalPathsFound(0);
      changeLowestDegree(0);
      changeHighestDegree(0);
    }
  }, [location.pathname]);

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
    if (location.pathname === "/paths") {
      changePathsLoading(true);
      const source = axios.CancelToken.source();

      fetchData();

      return () => {
        source.cancel();
      };
    }

    return () => {};
  }, [location.pathname]);

  const handlePageClick = (event: { [key: string]: number }) => {
    changePathCollapsed("");
    currentPage.current = event.selected;
    fetchData(event.selected);
  };

  return (
    <div className={`all_paths_page_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`top_paths_title ${darkMode ? "dark" : ""}`}>
        <BackButton />
        TODAY'S PATHS
        <div className="live_designation_container">
          <span className="live_designation" />
          <p>LIVE</p>
        </div>
      </h2>
      <span
        className={`leaderboard_connection_header ${darkMode ? "dark" : ""}`}
      >
        <p>{objectiveCurrentDate}</p>
        <p>
          {firstActor.name} → {lastActor.name}
        </p>
      </span>
      <p className="top_paths_prompt">
        All of today's actor connection paths will be shown here. The paths are
        sorted by popularity (descending) and then by degrees of separation
        (ascending.)
        <br />
        <br />
        Only players' first play-through of the day is counted towards a path's
        popularity.
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
              {lowestDegree === 1 ? "is" : "are"} <b>{lowestDegree}</b> and the
              highest {highestDegree === 1 ? "is" : "are"}{" "}
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
          <ClipLoader color={darkMode ? "#fff" : "#000"} size={150} />
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
                  <React.Fragment key={el._id}>
                    <PathContainer
                      id={el._id}
                      rank={i}
                      degrees={el.degrees}
                      count={el.count}
                      path={el.path}
                      emotes={el.emotes}
                      comments={el.comments}
                      pathCollapsed={pathCollapsed}
                      changePathCollapsed={changePathCollapsed}
                      currentPage={currentPage.current}
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
      <Footer />
    </div>
  );
};
