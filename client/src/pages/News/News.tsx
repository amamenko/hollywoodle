import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { NewsObj } from "../../interfaces/News.interfaces";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { Footer } from "../../components/Footer/Footer";
import { BackButton } from "../BackButton";
import axios from "axios";
import { NewsListPlaceholder } from "./NewsListPlaceholder";
import { NewsPreview } from "./NewsPreview";
import { loadImage } from "./loadImage";
import ReactPaginate from "react-paginate";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import "./News.scss";

export const News = () => {
  const { darkMode } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryPage = new URLSearchParams(window.location.search).get("page");
  const currentPage = useRef(0);
  const [pageCount, changePageCount] = useState(0);
  const [currentNews, changeCurrentNews] = useState<NewsObj[]>([]);
  const [dataLoaded, changeDataLoaded] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async (page?: number) => {
    const nodeEnv = process.env.REACT_APP_NODE_ENV
      ? process.env.REACT_APP_NODE_ENV
      : "";
    changeDataLoaded(false);
    await axios
      .get(
        nodeEnv && nodeEnv === "production"
          ? `${process.env.REACT_APP_PROD_SERVER}/api/news`
          : "http://localhost:4000/api/news",
        {
          params: {
            page: page ? (page > 0 ? page : 0) : 0,
          },
        }
      )
      .then((res) => res.data)
      .then((data) => {
        setTimeout(() => changeDataLoaded(true), 300);
        if (data.total) changePageCount(Math.ceil(data.total / itemsPerPage));
        if (data.news) changeCurrentNews(data.news);
        const allImages: string[] = data.news.map((el: NewsObj) =>
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

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (queryPage && Number(queryPage) > 0) {
      const finalPage = Number(queryPage) - 1;
      currentPage.current = finalPage;
      fetchData(finalPage);
    } else {
      navigate({ pathname: "/news", search: "?page=1" });
    }
    return () => source.cancel();
  }, [queryPage, navigate]);

  // Remove all displayed toasts on modal open
  useEffect(() => {
    if (location.pathname === "/news") toast.dismiss();
  }, [location]);

  const handlePageClick = (event: { [key: string]: number }) => {
    currentPage.current = event.selected;
    navigate({ pathname: "/news", search: `?page=${event.selected + 1}` });
  };

  return (
    <div className={`news_container ${darkMode ? "dark" : ""}`}>
      <h2 className={`news_title_header ${darkMode ? "dark" : ""}`}>
        <BackButton customNav="/" />
        HOLLYWOODLE NEWS
      </h2>
      <div className="news_prompt">
        <p>The latest breaking Hollywoodle news.</p>
      </div>
      {dataLoaded ? (
        <>
          <ul className="all_articles_container">
            {currentNews.map((article) => {
              return (
                <Fragment key={article._id}>
                  <NewsPreview
                    article={article}
                    page={currentPage.current + 1}
                  />
                </Fragment>
              );
            })}
          </ul>
          <div className="news_pagination_container">
            <ReactPaginate
              breakLabel="..."
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={pageCount}
              previousLabel={<BiChevronLeft />}
              nextLabel={<BiChevronRight />}
              renderOnZeroPageCount={() => null}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
              forcePage={currentPage.current}
            />
          </div>
        </>
      ) : (
        <NewsListPlaceholder />
      )}
      <Footer />
    </div>
  );
};
