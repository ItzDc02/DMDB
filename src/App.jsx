import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import BackToTop from "./components/backToTop/BackToTop";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import Watchlist from "./pages/watchlist/Watchlist";
import PageNotFound from "./pages/404/PageNotFound";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url);

  useEffect(() => {
    const fetchApiConfig = () => {
      fetchDataFromApi("/configuration")
        .then((res) => {
          console.log(res);

          const url = {
            backdrop: res.images.secure_base_url + "original",
            poster: res.images.secure_base_url + "original",
            profile: res.images.secure_base_url + "original",
          };

          dispatch(getApiConfiguration(url));
        })
        .catch(() => {
          // Image URLs stay empty; pages still render with fallbacks.
        });
    };

    const genresCall = async () => {
      let promises = [];
      let endPoints = ["tv", "movie"];
      let allGenres = {};

      endPoints.forEach((url) => {
        promises.push(fetchDataFromApi(`/genre/${url}/list`));
      });

      try {
        const data = await Promise.all(promises);
        console.log(data);
        data.map(({ genres }) => {
          return genres.map((item) => (allGenres[item.id] = item));
        });

        dispatch(getGenres(allGenres));
      } catch {
        // Genres stay empty; genre labels are skipped.
      }
    };

    fetchApiConfig();
    genresCall();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <BackToTop />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
