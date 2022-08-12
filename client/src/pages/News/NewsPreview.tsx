import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { NewsObj } from "../../interfaces/News.interfaces";

export const NewsPreview = ({ article }: { article: NewsObj }) => {
  const location = useLocation();
  const { darkMode } = useContext(AppContext);

  return (
    <li className="individual_news_preview">
      <Link className="news_link" to={`${location.pathname}/${article.slug}`}>
        <div
          className={`individual_news_thumbnail_container ${
            darkMode ? "dark" : ""
          }`}
        >
          <img src={article.image} alt={article.title} />
        </div>
        <div className="individual_news_text_container">
          <h2 className={`${darkMode ? "dark" : ""}`}>
            {article.title.toUpperCase()}
          </h2>
          <div className={`individual_news_details ${darkMode ? "dark" : ""}`}>
            <p className="news_category">{article.category}</p>
            <p className="details_divider">|</p>
            <p>{article.date}</p>
          </div>
          <p
            className={`article_text_preview_container ${
              darkMode ? "dark" : ""
            }`}
          >
            <span className="article_text_preview">
              {
                // Remove HTML tags from text
                article.text.replace(/(<([^>]+)>)/gim, "")
              }
            </span>
            <span className="article_text_preview_read_more">read more</span>
          </p>
        </div>
      </Link>
    </li>
  );
};
