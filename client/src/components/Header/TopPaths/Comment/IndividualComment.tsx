import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import emoji from "react-easy-emoji";
import { formatDistance } from "date-fns";
import Flag from "react-world-flags";
import { getStorageObj } from "../../../../utils/getStorageObj";

export const IndividualComment = ({
  commentId,
  userId,
  comment,
  commentEmoji,
  background,
  countryCode,
  countryName,
  city,
  score,
  time,
}: {
  commentId: string;
  userId: string;
  comment: string;
  commentEmoji: string;
  background: string;
  countryCode: string;
  countryName: string;
  city: string;
  score: number;
  time: Date;
}) => {
  const timeAgo = formatDistance(new Date(time), new Date(), {
    addSuffix: true,
    includeSeconds: true,
  });
  const storageObj = getStorageObj();
  const writtenComments = storageObj.comments as unknown as string[];
  return (
    <div
      className={`individual_comment_container ${
        writtenComments.includes(commentId) ? "active" : ""
      }`}
    >
      <div className="individual_comment_top_details">
        <div className="individual_comment_icon_container">
          <p>{emoji(commentEmoji)}</p>
          <span className="individual_comment_icon" style={{ background }} />
        </div>
        <div className="individual_comment_text_container">
          <p className="individual_comment_text">{comment}</p>
        </div>
      </div>
      <div className="individual_comment_bottom_details">
        <div className="indvidual_comment_date_place">
          <p>{timeAgo}</p>
          <div className="individual_comment_place">
            <p>
              {countryCode && (
                <>
                  <Flag code={"US"} height="10" />
                  <span className="country_state_separator_line">|</span>
                </>
              )}
              {city}
            </p>
          </div>
        </div>
        <div className="comment_voting_buttons">
          <IoIosArrowDropup className="comment_voting_button" size={40} />
          <p>{score}</p>
          <IoIosArrowDropdown className="comment_voting_button" size={40} />
        </div>
      </div>
    </div>
  );
};
