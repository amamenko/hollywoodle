import { useContext, useEffect } from "react";
import { AppContext } from "../../../App";
import { NewsObj } from "../../../interfaces/News.interfaces";
import { GoTriangleLeft, GoTriangleUp } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { scroller, Element } from "react-scroll";

export const FullArticle = ({
  currentArticle,
}: {
  currentArticle: NewsObj;
}) => {
  const { darkMode } = useContext(AppContext);
  const navigate = useNavigate();
  const handleNavigateBack = () => navigate("/news");
  const handleScrollToTop = () => {
    scroller.scrollTo("top", {
      duration: 500,
      offset: -200,
      smooth: true,
      container: "article_container",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Element name="top" className="article_container">
      <h2 className="article_title">{currentArticle.title}</h2>
      <div className="article_details">
        <p className="article_date">{currentArticle.date}</p>
        <p className="details_divider">|</p>
        <p>{currentArticle.category}</p>
      </div>
      <div className="article_image_container">
        <img src={currentArticle.image} alt={currentArticle.title} />
      </div>
      <div className={`article_text_container ${darkMode ? "dark" : ""}`}>
        <span dangerouslySetInnerHTML={{ __html: currentArticle.text }} />
        <div className="article_bottom_container">
          <span
            className={`article_read_more_news ${darkMode ? "dark" : ""}`}
            onClick={handleNavigateBack}
          >
            <GoTriangleLeft size={25} /> More news
          </span>
          <span
            className={`article_back_to_top ${darkMode ? "dark" : ""}`}
            onClick={handleScrollToTop}
          >
            Back to top <GoTriangleUp size={25} />
          </span>
        </div>
      </div>
    </Element>
  );
};
