import { useEffect, useState } from "react";
import axios from "axios";
import { RemoveScroll } from "react-remove-scroll";
import Modal from "react-modal";
import Flag from "react-world-flags";
import { customModalStyles } from "../ArchiveModal/ArchivedModal";
import { AiOutlineClose } from "react-icons/ai";
import Avatar from "react-avatar";
import { Image, Breathing } from "react-shimmer";
import "./Leaderboard.scss";

export const Leaderboard = ({
  showLeaderboardModal,
  changeShowLeaderboardModal,
}: {
  showLeaderboardModal: boolean;
  changeShowLeaderboardModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [userCountryCode, changeUserCountryCode] = useState("");
  const [userCountryName, changeUserCountryName] = useState("");

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
  };

  return (
    <RemoveScroll enabled={showLeaderboardModal}>
      <Modal
        isOpen={showLeaderboardModal}
        onRequestClose={handleCloseModal}
        contentLabel="Support Modal"
        className="modal_container archived_modal"
        shouldFocusAfterRender={false}
        style={customModalStyles}
      >
        <h2 className="archived_game_title">TODAY'S LEADERBOARD</h2>
        <button
          className="close_modal_button archived_game"
          onClick={handleCloseModal}
        >
          <AiOutlineClose size={20} color="#fff" />
        </button>
        <Breathing width={25} height={25} />
        <Avatar
          email="team@contentfulmail.com"
          round={true}
          alt="User Avatar"
        />
        <ul>
          <li>
            Randy Tsunami
            <Flag code={userCountryCode} height="16" />
          </li>
          <li>Someone Else</li>
          <li>Random Guy</li>
          <li>Tester McTester</li>
          <li>One More</li>
          <li>Whatsit Toya</li>
          <li>Not Me</li>
          <li>Fake Name</li>
          <li>Filler Noun</li>
          <li>John Doe</li>
        </ul>
      </Modal>
    </RemoveScroll>
  );
};
