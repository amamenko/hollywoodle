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
import "../Header.scss";
import "./TopPaths.scss";
import "../Leaderboard/Leaderboard.scss";

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

export const TopPaths = ({
  showTopPathsModal,
  changeShowTopPathsModal,
}: {
  showTopPathsModal: boolean;
  changeShowTopPathsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { firstActor, lastActor, objectiveCurrentDate } =
    useContext(AppContext);

  const [pathCollapsed, changePathCollapsed] = useState<string>("");
  const [topPaths, changeTopPaths] = useState([
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
    {
      degrees: 0,
      count: 0,
      path: "",
    },
  ]);
  const handleCloseModal = () => {
    changeShowTopPathsModal(false);
  };

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (showTopPathsModal) toast.dismiss();
  }, [showTopPathsModal]);

  useEffect(() => {
    if (showTopPathsModal) {
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
            if (data) changeTopPaths(data);
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
          changeTopPaths(arg);
        }
      });

      return () => {
        socket.close();
        source.cancel();
      };
    }

    return () => {};
  }, [showTopPathsModal]);

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
        <div className="all_paths_container">
          {topPaths.every((el) => !el.path && !el.degrees && !el.count) ? (
            <div className="no_paths_played_container">
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
