import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { filter } from "./app/searchSlice";
import { useSearchFilmQuery } from "./app/apiSlice";
import { Link } from "react-router-dom";

const FilmSearch = () => {
  const dispatch = useDispatch();
  const searchCriteria = useSelector((state) => state.search.value);
  const { data } = useSearchFilmQuery(searchCriteria);

  const handleSearch = (e) => {
    e.preventDefault();
    // No need to dispatch the filter action on each character change
    // It will be handled automatically by the useSearchFilmQuery hook
  };

  // Function to handle the error if the image fails to load
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite fallback loop
    e.target.src = "https://www.netlify.com/v3/img/blog/the404.png"; // Replace with the URL of your fallback image
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSearch}>
          <div className="field has-addons">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Search films"
                value={searchCriteria}
                onChange={(e) => dispatch(filter(e.target.value))}
              />
            </div>
            <div className="control">
              <button className="button is-primary" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>

        <div className="row mt-3">
          {data?.results?.map((film) => (
            <div className="card" key={film.id}>
              <Link to={`/films/${film.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${film.poster_path}`}
                  alt={film.title}
                  className="card-img-top"
                  onError={handleImageError} // Handle image loading error
                />
                <h5 className="card-title">{film.title}</h5>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmSearch;
