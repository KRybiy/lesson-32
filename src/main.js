const moviesListElement = document.querySelector("#movies-list");
const searchInput = document.querySelector("#search");
const searchCheckbox = document.querySelector("#checkbox");

let lastSearchQuery = null;
let isSearchTriggerEnabled = false;

const debounceTime = (() => {
  let timer = null;
  return (cb, ms) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(cb, ms);
  };
})();

const getData = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.Search) throw new Error("No data found");
      return data.Search;
    });

const addMovieToList = (movie) => {
  const item = document.createElement("div");
  item.classList.add("movie");

  const img = document.createElement("img");
  img.classList.add("movie__image");
  img.src = /^(http|https):\/\//i.test(movie.Poster)
    ? movie.Poster
    : "src/img/imagenotfound.jpg";
  img.alt = `${movie.Title} ${movie.Year}`;
  img.title = `${movie.Title} ${movie.Year}`;

  const movieDetails = document.createElement("div");
  movieDetails.classList.add("movie__details");

  const createDetail = (tag, className, text) => {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.textContent = text;
    return element;
  };

  movieDetails.append(
    createDetail("h2", "movie__title", movie.Title),
    createDetail("h3", "movie__year", movie.Year),
    createDetail("h3", "movie__type", movie.Type)
  );

  item.append(img, movieDetails);
  moviesListElement.prepend(item);
};

const clearMoviesList = () => {
  if (moviesListElement) moviesListElement.innerHTML = "";
};

const inputSearchHandler = (e) => {
  debounceTime(() => {
    const searchQuery = e.target.value.trim();

    if (
      !searchQuery ||
      searchQuery.length < 4 ||
      searchQuery === lastSearchQuery
    )
      return;
    if (!isSearchTriggerEnabled) clearMoviesList();

    getData(`https://www.omdbapi.com/?apikey=18b8609f&s=${searchQuery}`)
      .then((movies) => movies.forEach(addMovieToList))
      .catch((err) => console.error(err));

    lastSearchQuery = searchQuery;
  }, 1000);
};

searchInput.addEventListener("input", inputSearchHandler);
searchCheckbox.addEventListener(
  "change",
  (e) => (isSearchTriggerEnabled = e.target.checked)
);
