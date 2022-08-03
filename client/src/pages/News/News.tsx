import { useContext, useEffect, useState } from "react";
import { NewsObj } from "../../interfaces/News.interfaces";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import axios from "axios";
import "./News.scss";

export const News = () => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
  const [currentNews, changeCurrentNews] = useState<NewsObj[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (location.pathname === "/news") toast.dismiss();
  }, [location]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";

    const fetchData = async () => {
      await axios
        .get(
          nodeEnv && nodeEnv === "production"
            ? `${process.env.REACT_APP_PROD_SERVER}/api/news`
            : "http://localhost:4000/api/news"
        )
        .then((res) => res.data)
        .then((data) => {
          console.log({ data });
          changeCurrentNews(data);
        })
        .catch((e) => {
          console.error(e);
        });
    };

    fetchData();

    return () => source.cancel();
  }, []);

  return (
    <div className={`news_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`news_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton />
        HOLLYWOODLE NEWS
      </h2>
      <div className="news_prompt">
        <p>The latest breaking Hollywoodle news.</p>
      </div>
      <div className="all_articles_container">
        {currentNews.map((el) => {
          return (
            <article className="individual_news_preview" key={el._id}>
              <div className="individual_news_thumbnail_container">
                <img src={el.image} alt={el.title} />
              </div>
              <div className="individual_news_text_container">
                <h2>{el.title}</h2>
                <div className="individual_news_details">
                  <p className="news_category">{el.category}</p>
                  <p className="details_divider">|</p>
                  <p>{el.date}</p>
                </div>
                <p className="article_text_preview_container">
                  <span className="article_text_preview">{el.text}</span>
                  <span className="article_text_preview_read_more">
                    read more
                  </span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};
