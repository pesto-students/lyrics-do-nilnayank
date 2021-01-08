let prevRequestUrl = "";
let nextRequestUrl = "";
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");

document.getElementById("search-btn").addEventListener("click", e => {
	e.preventDefault();
	const songName = document.getElementById("search-song").value;
	!!songName && getSongsAction(songName);
});

// function to get songs
const getSongsAction = async songName => {
	const response = await fetch(`https://api.lyrics.ovh/suggest/${songName}`);
	const songsResponse = await response.json();
	const emptyResultsSection = document.querySelector(".empty-results");
	!!emptyResultsSection && emptyResultsSection.remove();
	handleSongsResponse(songsResponse);
};

// function to handle songs response
const handleSongsResponse = songsResponse => {
	removeSongsAndPagination();
	const { data: songs, prev = "", next = "" } = songsResponse;
	const songResultCards = !!songs && songs.length > 0 && songs.map(song => getResultCard(song));
	document.body.innerHTML += `
		<div id="songs-results" class="container result-container">${songResultCards.join("")}</div>
	`;
	prevRequestUrl = prev;
	nextRequestUrl = next;
	handlePaginationButtons(prev, next);
};

// function to Return Result Card with dynamic data binding of song
const getResultCard = song => {
	return `
		<div id=${song.id} class="result-card">
			<div class="result-card__left">
				<span class="result-title">${!!song && !!song.artist && !!song.artist.name ? song.artist.name + " - " : ""}</span>
				<span class="result-name">${!!song && !!song.title ? song.title : ""}</span>
			</div>
			<div class="result-card__right">
				<button type="button" class="btn-primary result-btn" onclick="handleShowLyrics('${song.artist.name}', '${song.title}')">Show Lyrics</button>
			</div>
		</div>
	`;
};

// function to handle show lyrics
const handleShowLyrics = async (artist, title) => {
	const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
	const songsLyricsResponse = await response.json();
	let { lyrics = "" } = songsLyricsResponse;
	lyrics = lyrics.replace(/(\r\n|\r|\n)/g, '<br />');
	removeSongsAndPagination();
	const songLyricsSection = `
		<div class="container song-lyrics">
			<h2>${artist} - <span class="song-lyrics__title">${title}</span></h2>
			<p>${lyrics}</p>
		</div>
	`;
	document.body.innerHTML += songLyricsSection;
};

// function to remove songs results and pagination section
const removeSongsAndPagination = () => {
	removeSongsResults();
	removePagination();
};

// function to remove songs results
const removeSongsResults = () => {
	const songsResultsElement = document.getElementById("songs-results");
	!!songsResultsElement && songsResultsElement.remove();
};

// function to remove pagination section
const removePagination = () => {
	const paginationActionsElement = document.querySelector(".pagination-actions");
	!!paginationActionsElement && paginationActionsElement.remove();
};

const handlePaginationButtons = (prev, next) => {
	removePagination();
	// previous pagination button element
	const previousAction = `<input type="button" id="previous" class="btn-primary" value="Previous" onclick="handlePagination('prev')" />`;
	// next pagination button element
	const nextAction = `<input type="button" id="next" class="btn-primary" value="Next" onclick="handlePagination('next')" />`;
	// create pagination actions element
	const paginationActions = `<div class="container pagination-actions">
		${!!prev ? previousAction : ""}
		${!!next ? nextAction : ""}
	</div>`;
	document.body.innerHTML += paginationActions;
};

const handlePagination = async (btn = "prev") => {
	const response = await fetch(`https://cors-anywhere.herokuapp.com/${btn === "prev" ? prevRequestUrl : nextRequestUrl}`, {
		headers: {
			"X-Requested-With": "XMLHttpRequest",
		},
	});
	const songsResponse = await response.json();
	handleSongsResponse(songsResponse);
};