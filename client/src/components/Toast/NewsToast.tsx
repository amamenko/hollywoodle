import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { handleSeenArticle } from "./handleSeenArticle";
import "./NewsToast.scss";

export const NewsToast = ({
  date,
  title,
  image,
  slug,
}: {
  date: string;
  title: string;
  image: string;
  slug: string;
}) => {
  const handleDismissToast = () => {
    handleSeenArticle();
    toast.dismiss();
  };
  return (
    <div className="news_toast_container">
      <h2 className="news_toast_header">HOLLYWOODLE NEWS</h2>
      <div className="news_toast_details_container">
        <div className="news_toast_image_container">
          <img src={image} alt={title} />
        </div>
        <div className="news_toast_details">
          <p className="news_toast_title">{title}</p>
          <p className="news_toast_date">{date}</p>
        </div>
      </div>
      <div className="news_toast_buttons_container">
        <div
          className="news_toast_button_container"
          onClick={handleSeenArticle}
        >
          <a href={`${document.location.origin}/news/${slug}`}>
            <Button className={`who_button news_toast_button`} id="who_button">
              READ
            </Button>
          </a>
        </div>
        <div className="news_toast_button_container">
          <Button
            className={`who_button news_toast_button dismiss_button`}
            id="who_button"
            onClick={handleDismissToast}
          >
            DISMISS
          </Button>
        </div>
      </div>
    </div>
  );
};
