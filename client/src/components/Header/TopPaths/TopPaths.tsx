import React from "react";
import { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { PathContainer } from "./PathContainer";
import { RemoveScroll } from "react-remove-scroll";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import { AppContext } from "../../../App";
import { IoFootsteps } from "react-icons/io5";
import "../Header.scss";
import "./TopPaths.scss";
import "../Leaderboard/Leaderboard.scss";
import { ClipLoader } from "react-spinners";

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
  // Aggregated top paths data metrics
  const [totalPathsFound, changeTotalPathsFound] = useState(0);
  const [totalPlayers, changeTotalPlayers] = useState(0);
  const [lowestDegree, changeLowestDegree] = useState(0);
  const [highestDegree, changeHighestDegree] = useState(0);

  const handleCloseModal = () => {
    changeShowTopPathsModal(false);
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showTopPathsModal) toast.dismiss();
  }, [showTopPathsModal]);

  useEffect(() => {
    if (showTopPathsModal) {
      changePathsLoading(true);
      const source = axios.CancelToken.source();

      const nodeEnv = process.env.REACT_APP_NODE_ENV
        ? process.env.REACT_APP_NODE_ENV
        : "";

      const fetchData = async () => {
        await axios
          .get(
            nodeEnv && nodeEnv === "production"
              ? `${process.env.REACT_APP_PROD_SERVER}/api/top_paths`
              : "http://localhost:4000/api/top_paths"
          )
          .then((res) => res.data)
          .then((data) => {
            console.log(data);
            changePathsLoading(false);
            if (data.paths) changeTopPaths(data.paths);
            if (data.totalPathsFound)
              changeTotalPathsFound(data.totalPathsFound);
            if (data.totalPlayers) changeTotalPlayers(data.totalPlayers);
            if (data.lowestDegree) changeLowestDegree(data.lowestDegree);
            if (data.highestDegree) changeHighestDegree(data.highestDegree);
          })
          .catch((e) => {
            changePathsLoading(false);
            console.error(e);
          });
      };

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
          : "http://localhost:4000"
      );

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
          if (arg.totalPathsFound !== totalPathsFound)
            changeTotalPathsFound(arg.totalPathsFound);
          if (arg.totalPlayers !== totalPlayers)
            changeTotalPlayers(arg.totalPlayers);
          if (arg.lowestDegree !== lowestDegree)
            changeLowestDegree(arg.lowestDegree);
          if (arg.highestDegree !== highestDegree)
            changeHighestDegree(arg.highestDegree);
        }
      });

      return () => {
        socket.close();
      };
    }

    return () => {};
  }, [
    showTopPathsModal,
    topPaths,
    totalPathsFound,
    totalPlayers,
    lowestDegree,
    highestDegree,
  ]);

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
        <h2>TODAY'S TOP PATHS</h2>
        <span className="leaderboard_connection_header">
          <p>{objectiveCurrentDate}</p>
          <p>
            {firstActor.name} → {lastActor.name}
          </p>
        </span>
        <button className="close_modal_button" onClick={handleCloseModal}>
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <p className="top_paths_prompt">
          The top 10 most popular paths of the day will be shown here.
          <br />
          <br />
          Only players' first play-through of the day is counted towards a
          path's popularity.
          {totalPathsFound && totalPlayers && lowestDegree && highestDegree ? (
            <>
              <br />
              <br />
              <span className="top_paths_aggregated_data">
                A total of <b>{totalPlayers}</b> players have completed today's
                connection at least once.
                <br />
                <br />
                Players have been able to find <b>{totalPathsFound}</b>{" "}
                {totalPathsFound === 1 ? "unique path" : "unique paths"} today -
                the lowest degrees of separation found{" "}
                {lowestDegree === 1 ? "is" : "are"} <b>{lowestDegree}</b> and
                the highest is <b>{highestDegree}</b>.
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
            topPaths.map((el, i) => {
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
                    />
                  </React.Fragment>
                );
              } else {
                return <React.Fragment key={i} />;
              }
            })
          )}
        </div>
      </Modal>
    </RemoveScroll>
  );
};
