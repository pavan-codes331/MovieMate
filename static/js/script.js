const sendButton = document.getElementById("sendButton");
const userInput = document.getElementById("userInput");
const chatBox = document.querySelector(".chat-box");
const favoritesButton = document.getElementById("favoritesButton");
const surpriseButton = document.getElementById("surpriseButton");
const suggestionsBox = document.getElementById("suggestions");
const recentButton = document.getElementById("recentButton");
const filterButton = document.getElementById("filterButton");
const filterPanel = document.getElementById("filterPanel");
const languageFilter = document.getElementById("languageFilter");
const genreFilter = document.getElementById("genreFilter");
const ratingFilter = document.getElementById("ratingFilter");
const applyFilters = document.getElementById("applyFilters");
let currentSearch = "";
let currentPage = 1;
let currentMovieGrid = null;
function updateFavoritesCount(){

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesButton.innerHTML = `❤️ My Favorites (${favorites.length})`;

}
function getStars(rating){

    let fullStars = Math.round(rating / 2);

    return "⭐".repeat(fullStars) + "☆".repeat(5 - fullStars);

}
function displayMovies(movies, headingText) {

    chatBox.innerHTML = "";

    const heading = document.createElement("div");
    heading.classList.add("bot-message");
    heading.textContent = headingText;
    chatBox.appendChild(heading);

    if (movies.length === 0) {

        const noMovies = document.createElement("div");
        noMovies.classList.add("bot-message");
        noMovies.textContent = "😕 No movies match these filters.";

        chatBox.appendChild(noMovies);
        return;
    }

    const movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    movies.forEach(movie => {

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img src="${movie.poster}"
                 class="movie-poster"
                 alt="${movie.title}">

            <h3>🎬 ${movie.title}</h3>

            <p>🎭 Genre: ${movie.genre}</p>

           <p>🗓️ Year: ${movie.release_date ? movie.release_date.substring(0, 4) : "Unknown"}</p>

            <p class="rating">
                <span class="rating-stars">
                    ${getStars(movie.rating || 0)}
                </span>

                <span class="rating-number">
                    ${movie.rating ? movie.rating.toFixed(1) : "N/A"}/10
                </span>
            </p>

           <p>📝 ${movie.overview || "No description available."}</p>

            <div class="favorite-container">

                <button
                    class="favorite-btn"
                    data-title="${movie.title}"
                    style="background:${
                        favorites.includes(movie.title)
                        ? '#2ecc71'
                        : '#ff3b30'
                    };">

                    ${
                        favorites.includes(movie.title)
                        ? "❤️ Saved"
                        : "🤍 Favorite"
                    }

                </button>

            </div>

            <div class="movie-buttons">

                <a href="${movie.trailer}"
                   target="_blank"
                   class="trailer-btn">
                    ▶ Watch Trailer
                </a>

                <a href="${movie.watch}"
                   target="_blank"
                   class="watch-btn">
                    🎬 Watch Movie
                </a>

            </div>
        `;
      movieCard.addEventListener("click", (event) => {

    if (
        event.target.closest(".favorite-btn") ||
        event.target.closest(".trailer-btn") ||
        event.target.closest(".watch-btn")
    ) {
        return;
    }
    document.getElementById("modalPoster").src = movie.poster || "";
    document.getElementById("modalTitle").textContent = movie.title || "Unknown Title";

    document.getElementById("modalRating").textContent =
        `⭐ Rating: ${movie.rating ? movie.rating.toFixed(1) : "N/A"}/10`;

    document.getElementById("modalRelease").textContent =
        `📅 Release Date: ${movie.release_date || "Unknown"}`;

    document.getElementById("modalLanguage").textContent =
        `🌐 Language: ${movie.language || "Unknown"}`;

    document.getElementById("modalGenre").textContent =
        `🎭 Genre: ${movie.genre || "Unknown"}`;

    document.getElementById("modalOverview").textContent =
        movie.overview || "No description available.";

    document.getElementById("movieModal").style.display = "flex";
});

        movieGrid.appendChild(movieCard);
    });

    chatBox.appendChild(movieGrid);
    movieGrid.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
function saveRecentSearch(search){

    let recentSearches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];

    // Remove duplicate
    recentSearches = recentSearches.filter(item => item !== search);

    // Put newest search first
    recentSearches.unshift(search);

    // Keep only latest 5 searches
    recentSearches = recentSearches.slice(0, 5);

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(recentSearches)
    );
}

async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") {
        return;
    }
   saveRecentSearch(message);
    chatBox.innerHTML = "";
    // Show user's message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = message;

    chatBox.appendChild(userMessage);

    userInput.value = "";

    // Send the message to Python
    const loadingMessage = document.createElement("div");
loadingMessage.classList.add("bot-message");
loadingMessage.id = "loading-message";
loadingMessage.textContent = "🎬 MovieMate is searching...";
chatBox.appendChild(loadingMessage);
chatBox.scrollTop = chatBox.scrollHeight;

const response = await fetch("/recommend", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
  body: JSON.stringify({
    message: message,
    page: 1
})
});

const data = await response.json();

// Add this line
await new Promise(resolve => setTimeout(resolve, 2000));

document.getElementById("loading-message")?.remove();
if (data.found) {

    const movies = data.movies;

    // Create a grid for all movie cards
    const movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");

    // Add grid to chat box
    chatBox.appendChild(movieGrid);


    currentSearch = message;
currentPage = 1;
currentMovieGrid = movieGrid;

const loadMoreButton = document.createElement("button");
loadMoreButton.classList.add("load-more-btn");
loadMoreButton.textContent = "🎬 Load More";

loadMoreButton.addEventListener("click", () => {
    loadMoreMovies(loadMoreButton);
});

chatBox.appendChild(loadMoreButton);
    
    movies.forEach(movie => {

        // Create movie card
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img src="${movie.poster}" class="movie-poster" alt="${movie.title}">

            <h3>🎬 ${movie.title}</h3>

            <p>🎭 Genre: ${movie.genre}</p>

            <p>🗓️ Year: ${movie.release_date ? movie.release_date.substring(0, 4) : "Unknown"}</p>

           <p class="rating">
    <span class="rating-stars">${getStars(movie.rating)}</span>
    <span class="rating-number">${movie.rating}/10</span>
</p>
           <p>📝 ${movie.overview || "No description available."}</p>

            <div class="favorite-container">
    <button
    class="favorite-btn"
    data-title="${movie.title}"
    style="
    background:${favorites.includes(movie.title) ? '#2ecc71' : '#ff3b30'};
    ">
    ${favorites.includes(movie.title) ? "❤️ Saved" : "🤍 Favorite"}
</button>

</div>

<div class="movie-buttons">

                <a href="${movie.trailer}" target="_blank" class="trailer-btn">
                    ▶ Watch Trailer
                </a>

                <a href="${movie.watch}" target="_blank" class="watch-btn">
                    🎬 Watch Movie
                </a>

            </div>
        `;

        // Add each movie card INSIDE the grid
        movieGrid.appendChild(movieCard);

    });

    // Scroll to the beginning of the movie results
    movieGrid.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

} else {

    // Remove loading message if it is still present
    document.getElementById("loading-message")?.remove();

    const botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    botMessage.textContent = data.reply;

    chatBox.appendChild(botMessage);
}

// End of sendMessage()
}

async function loadMoreMovies(button) {

    currentPage++;

    button.disabled = true;
    button.textContent = "🎬 Loading...";

    try {

        const response = await fetch("/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: currentSearch,
                page: currentPage
            })
        });

        const data = await response.json();

        if (data.found && data.movies.length > 0) {

            data.movies.forEach(movie => {

                const favorites =
                    JSON.parse(localStorage.getItem("favorites")) || [];

                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");

                movieCard.innerHTML = `
                    <img src="${movie.poster}"
                         class="movie-poster"
                         alt="${movie.title}">

                    <h3>🎬 ${movie.title}</h3>

                    <p>🎭 Genre: ${movie.genre}</p>

                    <p>🗓️ Year:
                        ${movie.release_date
                            ? movie.release_date.substring(0, 4)
                            : "Unknown"}
                    </p>

                    <p class="rating">
                        <span class="rating-stars">
                            ${getStars(movie.rating || 0)}
                        </span>

                        <span class="rating-number">
                            ${movie.rating
                                ? movie.rating.toFixed(1)
                                : "N/A"}/10
                        </span>
                    </p>

                    <p>📝
                        ${movie.overview || "No description available."}
                    </p>

                    <div class="favorite-container">
                        <button
                            class="favorite-btn"
                            data-title="${movie.title}"
                            style="background:${
                                favorites.includes(movie.title)
                                ? '#2ecc71'
                                : '#ff3b30'
                            };">
                            ${
                                favorites.includes(movie.title)
                                ? "❤️ Saved"
                                : "🤍 Favorite"
                            }
                        </button>
                    </div>

                    <div class="movie-buttons">

                        <a href="${movie.trailer || '#'}"
                           target="_blank"
                           class="trailer-btn">
                            ▶ Watch Trailer
                        </a>

                        <a href="${movie.watch || '#'}"
                           target="_blank"
                           class="watch-btn">
                            🎬 Watch Movie
                        </a>

                    </div>
                `;

                currentMovieGrid.appendChild(movieCard);
            });

            button.disabled = false;
            button.textContent = "🎬 Load More";

        } else {

            button.textContent = "🎬 No More Movies";
            button.disabled = true;
        }

    } catch (error) {

        console.error(error);

        currentPage--;

        button.disabled = false;
        button.textContent = "🎬 Load More";

        alert("Sorry, something went wrong while loading more movies.");
    }
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
updateFavoritesCount();

favoritesButton.addEventListener("click", showFavorites);

document.addEventListener("click", function(e){

    if(e.target.classList.contains("favorite-btn")){

        const movieTitle = e.target.dataset.title;

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        if(e.target.innerHTML.includes("Favorite")){

            e.target.innerHTML = "❤️ Saved";
            e.target.style.background = "#2ecc71";

            if(!favorites.includes(movieTitle)){
                favorites.push(movieTitle);
            }

        }else{

            e.target.innerHTML = "🤍 Favorite";
            e.target.style.background = "#ff3b30";

            favorites = favorites.filter(title => title !== movieTitle);

        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesCount();

    }

});
async function showFavorites(){

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    chatBox.innerHTML = "";

    if(favorites.length === 0){

        chatBox.innerHTML = `
            <div class="bot-message">
                ❤️ You haven't added any favorite movies yet.
            </div>
        `;

        return;
    }

    const response = await fetch("/movies");
    const data = await response.json();

    const favoriteMovies = data.movies.filter(movie =>
        favorites.includes(movie.title)
    );

    const heading = document.createElement("div");
    heading.classList.add("bot-message");

    heading.innerHTML = `
        <h2>❤️ My Favorite Movies</h2>
        <p>You have ${favoriteMovies.length} favorite movie(s).</p>
    `;

    chatBox.appendChild(heading);

    const movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");

    chatBox.appendChild(movieGrid);

    favoriteMovies.forEach(movie => {

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img
                src="${movie.poster}"
                class="movie-poster"
                alt="${movie.title}"
            >

            <h3>🎬 ${movie.title}</h3>

            <p>🎭 Genre: ${movie.genre}</p>

            <p>🗓️ Year: ${movie.year}</p>

            <p class="rating">
                <span class="rating-stars">
                    ${getStars(movie.rating)}
                </span>

                <span class="rating-number">
                    ${movie.rating}/10
                </span>
            </p>

            <p>📝 ${movie.description}</p>

            <div class="favorite-container">

                <button
                    class="favorite-btn"
                    data-title="${movie.title}"
                    style="background:#2ecc71;">
                    ❤️ Saved
                </button>

            </div>

            <div class="movie-buttons">

                <a
                    href="${movie.trailer}"
                    target="_blank"
                    class="trailer-btn">
                    ▶ Watch Trailer
                </a>

                <a
                    href="${movie.watch}"
                    target="_blank"
                    class="watch-btn">
                    🎬 Watch Movie
                </a>

            </div>
        `;

        movieGrid.appendChild(movieCard);

    });

}
async function surpriseMe(){

    const response = await fetch("/movies");
    const data = await response.json();

    const movies = data.movies;

    const randomIndex = Math.floor(Math.random() * movies.length);
    const movie = movies[randomIndex];

    chatBox.innerHTML = "";

    const message = document.createElement("div");
    message.classList.add("bot-message");
    message.innerHTML = "🎲 MovieMate picked this movie for you!";

    chatBox.appendChild(message);

    const movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    movieCard.innerHTML = `
        <img src="${movie.poster}" class="movie-poster" alt="${movie.title}">

        <h3>🎬 ${movie.title}</h3>

        <p>🎭 Genre: ${movie.genre}</p>

        <p>🗓️ Year: ${movie.year}</p>

        <p class="rating">
            <span class="rating-stars">${getStars(movie.rating)}</span>
            <span class="rating-number">${movie.rating}/10</span>
        </p>

        <p>📝 ${movie.description}</p>

        <div class="favorite-container">
            <button
                class="favorite-btn"
                data-title="${movie.title}"
                style="background:${favorites.includes(movie.title) ? '#2ecc71' : '#ff3b30'};">
                ${favorites.includes(movie.title) ? "❤️ Saved" : "🤍 Favorite"}
            </button>
        </div>

        <div class="movie-buttons">

            <a href="${movie.trailer}" target="_blank" class="trailer-btn">
                ▶ Watch Trailer
            </a>

            <a href="${movie.watch}" target="_blank" class="watch-btn">
                🎬 Watch Movie
            </a>

        </div>
    `;

    movieGrid.appendChild(movieCard);
    chatBox.appendChild(movieGrid);
}
surpriseButton.addEventListener("click", surpriseMe);
const searchSuggestions = [
    "Telugu Action",
    "Telugu Comedy",
    "Telugu Romance",
    "Telugu Thriller",
    "Telugu Horror",
    "Telugu Drama",

    "Hindi Action",
    "Hindi Comedy",
    "Hindi Romance",
    "Hindi Thriller",

    "Tamil Action",
    "Tamil Comedy",
    "Tamil Romance",
    "Tamil Thriller",

    "Malayalam Comedy",
    "Malayalam Thriller",
    "Malayalam Drama",

    "English Action",
    "English Comedy",
    "English Horror",
    "English Sci-Fi"
];
userInput.addEventListener("input", function(){

    const value = userInput.value.toLowerCase().trim();

    suggestionsBox.innerHTML = "";

    if(value === ""){
        suggestionsBox.style.display = "none";
        return;
    }

    const matches = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value)
    );

    if(matches.length === 0){
        suggestionsBox.style.display = "none";
        return;
    }

    matches.forEach(suggestion => {

        const item = document.createElement("div");

        item.classList.add("suggestion-item");
        item.textContent = suggestion;

        item.addEventListener("click", function(){

            userInput.value = suggestion;
            userInput.focus();
            suggestionsBox.style.display = "none";

        });

        suggestionsBox.appendChild(item);

    });

    suggestionsBox.style.display = "block";

});
function showRecentSearches(){

    const recentSearches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];

    chatBox.innerHTML = "";

    if(recentSearches.length === 0){

        chatBox.innerHTML = `
            <div class="bot-message">
                🕘 No recent searches yet.
            </div>
        `;

        return;
    }

    const heading = document.createElement("div");
    heading.classList.add("bot-message");

    heading.innerHTML = `
        <h2>🕘 Recent Searches</h2>
        <p>Click a search to use it again.</p>
    `;

    chatBox.appendChild(heading);

    recentSearches.forEach(search => {

        const item = document.createElement("button");

        item.classList.add("recent-search-item");
        item.textContent = `🔍 ${search}`;

        item.addEventListener("click", function(){

            userInput.value = search;

            sendMessage();

        });

        chatBox.appendChild(item);

    });

}
recentButton.addEventListener("click", showRecentSearches);
filterPanel.style.display = "none";

filterButton.addEventListener("click", function() {

    if (filterPanel.style.display === "none") {
        filterPanel.style.display = "flex";
    } else {
        filterPanel.style.display = "none";
    }

});
applyFilters.addEventListener("click", async function() {

    const language = languageFilter.value;
    const genre = genreFilter.value;
    const rating = Number(ratingFilter.value) || 0;

    const response = await fetch("/movies");
    const data = await response.json();

    const filteredMovies = data.movies.filter(movie => {

        const languageMatch =
    language === "" ||
    movie.language.toLowerCase() === language.toLowerCase();

        const genreMatch =
    genre === "" ||
    movie.genre.toLowerCase().includes(genre.toLowerCase());

        const ratingMatch =
            Number(movie.rating) >= rating;

        return languageMatch && genreMatch && ratingMatch;
    });

    displayMovies(
    filteredMovies,
    `🎛️ Found ${filteredMovies.length} movie(s) matching your filters`
);
});
// 🎬 Movie Details Modal Controls

const movieModal = document.getElementById("movieModal");
const closeMovieModal = document.getElementById("closeMovieModal");

closeMovieModal.addEventListener("click", () => {
    movieModal.style.display = "none";
});

// Close when clicking outside the popup
movieModal.addEventListener("click", (event) => {
    if (event.target === movieModal) {
        movieModal.style.display = "none";
    }
});
