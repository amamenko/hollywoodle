import { useContext, useEffect, useState } from "react";
import { NewsObj } from "../../interfaces/News.interfaces";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import axios from "axios";
import ContentLoader from "react-content-loader";
import "./News.scss";

const NewsLoader = ({ darkMode }: { darkMode: boolean }) => (
  <ContentLoader
    speed={1}
    animate={true}
    viewBox="0 0 350 100"
    title="Loading news..."
    backgroundColor={darkMode ? "rgb(145, 146, 146)" : "rgb(215, 216, 217)"}
    foregroundColor={darkMode ? "rgb(115, 115, 115)" : "rgb(208, 208, 208)"}
  >
    <rect x="0.84" y="9.93" rx="5" ry="5" width="145.55" height="80.59" />
    <rect x="158.84" y="20.67" rx="0" ry="0" width="148.72" height="12.12" />
    <rect x="158.84" y="46.67" rx="0" ry="0" width="89" height="9" />
    <rect x="258.84" y="46.67" rx="0" ry="0" width="40" height="9" />
    <rect x="158.84" y="71.67" rx="0" ry="0" width="89" height="9" />
    <rect x="258.84" y="71.67" rx="0" ry="0" width="50" height="9" />
  </ContentLoader>
);

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
          changeDataLoaded(true);
          changeCurrentNews(data);
        })
        .catch((e) => {
          changeDataLoaded(true);
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
          {currentNews.map((el) => {
            return (
              <li className="individual_news_preview" key={el._id}>
                <Link
                  className="news_link"
                  to={`${location.pathname}/${el.slug}`}
                >
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
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="news_loader_container">
          <span>
            <NewsLoader darkMode={darkMode} />
          </span>
          <span>
            <NewsLoader darkMode={darkMode} />
          </span>
          <span>
            <NewsLoader darkMode={darkMode} />
          </span>
        </div>
      )}
      <Footer />
    </div>
  );
};
