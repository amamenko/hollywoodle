import { Fragment, useContext, useEffect, useState } from "react";
import { NewsObj } from "../../interfaces/News.interfaces";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import axios from "axios";
import { NewsListPlaceholder } from "./NewsListPlaceholder";
import { NewsPreview } from "./NewsPreview";
import { loadImage } from "./loadImage";
import "./News.scss";

export const News = () => {
  const { darkMode } = useContext(AppContext);
  const location = useLocation();
  const [currentNews, changeCurrentNews] = useState<NewsObj[]>([]);
  const [dataLoaded, changeDataLoaded] = useState(false);

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
      changeDataLoaded(false);
      await axios
        .get(
          nodeEnv && nodeEnv === "production"
            ? `${process.env.REACT_APP_PROD_SERVER}/api/news`
            : "http://localhost:4000/api/news"
        )
        .then((res) => res.data)
        .then((data) => {
          setTimeout(() => changeDataLoaded(true), 300);
          changeCurrentNews(data);
          const allImages: string[] = data.map((el: NewsObj) =>
            el.image.toString()
          );
          Promise.allSettled(allImages.map((image) => loadImage(image)))
            .then(() => setTimeout(() => changeDataLoaded(true), 300))
            .catch((err) => console.error("Failed to load images", err));
        })
        .catch((e) => {
          setTimeout(() => changeDataLoaded(true), 300);
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
      {dataLoaded ? (
        <ul className="all_articles_container">
          {currentNews.map((article) => {
            return (
              <Fragment key={article._id}>
                <NewsPreview article={article} />
              </Fragment>
            );
          })}
        </ul>
      ) : (
        <NewsListPlaceholder />
      )}
      <Footer />
    </div>
  );
};
