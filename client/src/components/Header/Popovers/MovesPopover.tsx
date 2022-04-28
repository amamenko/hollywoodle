import { useContext } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Popover, ArrowContainer } from "react-tiny-popover";
import { AppContext } from "../../../App";

export const MovesPopover = ({
  movesPopoverOpen,
  changeMovesPopoverOpen,
}: {
  movesPopoverOpen: boolean;
  changeMovesPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { darkMode } = useContext(AppContext);
  return (
    <Popover
      isOpen={movesPopoverOpen}
      positions={["bottom", "left"]}
      padding={10}
      reposition={false}
      onClickOutside={() => changeMovesPopoverOpen(false)}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={darkMode ? "rgb(50, 50, 50)" : "#000"}
          arrowSize={10}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div
            className={`popover_content_container ${darkMode ? "dark" : ""}`}
          >
            <h2>Player moves</h2>
            <p>
              The sum of the player's interactions while completing a game. The{" "}
              <b>lower</b> the player's moves are, the better.{" "}
              <b className="correct">Correct</b>,{" "}
              <b className="incorrect">incorrect</b>, and{" "}
              <b className="partial">partial</b> guesses (movie and actor), as
              well as <b>hints</b>, all contribute to the total moves.
            </p>
          </div>
        </ArrowContainer>
      )}
    >
      <div className="popover_anchor_container right">
        <AiOutlineQuestionCircle size={15} />
      </div>
    </Popover>
  );
};
