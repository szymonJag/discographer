"use strict";

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const API_URL = "https://api.spotify.com/v1";

const sectionArtist = document.querySelector(".artist__section");
const sectionArtistInfo = document.querySelector(".artist__info");
const inputArtist = document.getElementById("input__artist");
const buttonSearch = document.getElementById("button__search");
const buttonLogin = document.getElementById("login__spotify");

let token = "";

class App {
  constructor() {
    localStorage.clear();
    buttonLogin.addEventListener("click", this.#_buttonLogin.bind(this));
  }

  #_spotifyRedirectUrl = (e) => {
    e.preventDefault();
    const redirect_uri = "http://127.0.0.1:5500/index.html";
    const state = CLIENT_SECRET;
    const scope = "user-read-private user-read-email";

    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(CLIENT_ID);
    url += "&scope=" + encodeURIComponent(scope);
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url += "&state=" + encodeURIComponent(state);
    console.log(url);

    window.location.replace(url);
  };

  #_getAccessToken = async () => {
    this.#_spotifyRedirectUrl();
    const url = window.location.href;
    const accessToken = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
    token = accessToken;
    localStorage.setItem("accessToken", accessToken);
    window.location.replace("http://127.0.0.1:5500/index.html");
  };

  #_buttonLogin = () => {
    this.#_getAccessToken();
    buttonLogin.classList.add("hidden");
    sectionArtist.classList.remove("hidden");
  };
}

class APIController {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    buttonSearch.addEventListener("click", this._getArtistInfo.bind(this));
  }

  _getArtistInfo = () => {
    const artistName = inputArtist.value + "";

    const query = new URLSearchParams({
      type: "artist",
    });

    const requestURL = `${API_URL}/search?q=${artistName}&` + query;

    return fetch(requestURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const artist = data.artists?.items[0];
        console.log(artist);
        this.#_displayArtistData(artist);
      });
  };

  #_displayArtistData = (artist) => {
    const followers = artist.followers.total;
    const imgURL = artist.images[0].url;
    const name = artist.name;
    const genres = artist.genres.join(" ");
    const popularity = artist.popularity;

    const html = `
    <img
            src="${imgURL}"
            alt="${name}"
          />
          <div class="artist__info--text">
            <h1>${name}</h1>
            <h2>Music genres: <span>${genres}</span></h2>
            <h2>Popularity on spotify: <span>${popularity}</span></h2>
            <h2>Followers: <span></span>${followers}</h2>
          </div>
    `;

    sectionArtistInfo.insertAdjacentHTML("afterbegin", html);
  };
}

const app = new App();
const controller = new APIController(CLIENT_ID, CLIENT_SECRET);
