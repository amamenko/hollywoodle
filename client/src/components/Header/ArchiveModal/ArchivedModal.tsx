import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal";
import { CollapsibleArchive } from "./CollapsibleArchive";
import { eachDayOfInterval, subDays } from "date-fns";
import { format } from "date-fns-tz";
import ReactPaginate from "react-paginate";
import "./ArchivedModal.scss";
import "../Header.scss";

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

export const ArchivedModal = ({
  showArchivedModal,
  changeShowArchivedModal,
}: {
  showArchivedModal: boolean;
  changeShowArchivedModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pastTwoWeeksDates, changePastTwoWeeksDates] = useState<string[]>([]);
  const [currentDates, changeCurrentDates] = useState<string[]>([]);
  const [pageCount, changePageCount] = useState(0);
  const [dateOffset, changeDateOffset] = useState(0);

  // const allDates = ({ currentDates }) => {
  //   return (
  //     <>
  //       {currentDates &&
  //         currentDates.map((date, i) => (
  //           <CollapsibleArchive key={i} date={date} />
  //         ))}
  //     </>
  //   );
  // }

  const handleCloseModal = () => {
    changeShowArchivedModal(false);
  };

  useEffect(() => {
    const twoWeeksAgo = subDays(new Date(), 14);
    const result = eachDayOfInterval({
      start: twoWeeksAgo,
      end: new Date(),
    });

    const pastTwoWeeksArr = result.map((date) =>
      format(date, "MM/dd/yyyy", {
        timeZone: "America/New_York",
      })
    );
    changePastTwoWeeksDates(pastTwoWeeksArr.sort((a, b) => b.localeCompare(a)));
  }, []);

  useEffect(() => {
    const endOffset = dateOffset + 5;
    changeCurrentDates(pastTwoWeeksDates.slice(dateOffset, endOffset));
    changePageCount(Math.ceil(pastTwoWeeksDates.length / 5));
  }, [dateOffset, pastTwoWeeksDates]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 5) % pastTwoWeeksDates.length;
    changeDateOffset(newOffset);
  };
  return (
    <Modal
      isOpen={showArchivedModal}
      onRequestClose={handleCloseModal}
      contentLabel="Support Modal"
      className="modal_container"
      shouldFocusAfterRender={false}
      style={customModalStyles}
    >
      <h2 className="archived_game_title">PLAY AN ARCHIVED GAME</h2>
      <button
        className="close_modal_button archived_game"
        onClick={handleCloseModal}
      >
        <AiOutlineClose size={20} color="#fff" />
      </button>
      {pastTwoWeeksDates.map((date, i) => (
        <CollapsibleArchive key={i} date={date} />
      ))}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={0}
        previousLabel="< previous"
        // renderOnZeroPageCount={() => {}}
      />
    </Modal>
  );
};
