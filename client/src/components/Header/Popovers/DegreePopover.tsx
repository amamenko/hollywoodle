import { useContext } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { Popover, ArrowContainer } from "react-tiny-popover";
import { AppContext } from "../../../App";

export const DegreesPopover = ({
  degreesPopoverOpen,
  changeDegreesPopoverOpen,
}: {
  degreesPopoverOpen: boolean;
  changeDegreesPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { darkMode } = useContext(AppContext);
  return (
    <Popover
      isOpen={degreesPopoverOpen}
      positions={["bottom", "right"]}
      align={"start"}
      padding={10}
      reposition={false}
      onClickOutside={() => changeDegreesPopoverOpen(false)}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={darkMode ? "rgb(50, 50, 50)" : "#000"}
          arrowSize={14}
          className="popover-arrow-container"
          arrowClassName="popover-arrow"
        >
          <div
            className={`popover_content_container ${darkMode ? "dark" : ""}`}
          >
            <h2>Degrees of separation</h2>
            <p>
              The number of correctly guessed films that connect the two actors
              - correlates to the steps of the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon"
                target="_blank"
                rel="noopener noreferrer"
              >
                Six Degrees of Kevin Bacon.
              </a>
            </p>
          </div>
        </ArrowContainer>
      )}
    >
      <div className="popover_anchor_container">
        <AiFillQuestionCircle size={25} />
      </div>
    </Popover>
  );
};
