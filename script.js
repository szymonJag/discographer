"use strict";

const CLIENT_ID = "eb470c85f08345729da4666565608458";
const CLIENT_SECRET = "fd946c869fa6411fb0511cfaa9b2f255";
const API_URL = "https://api.spotify.com/v1";

const sectionArtist = document.querySelector(".artist__section");
const inputArtist = document.getElementById("input__artist");
const buttonSearch = document.getElementById("button__search");
const buttonLogin = document.getElementById("login__spotify");

let token = "";

class App {
  constructor() {
    buttonLogin.addEventListener("click", this.#_buttonLogin.bind(this));
  }

  #_spotifyRedirectUrl = () => {
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
        const artist = data.artists?.items[0];
        console.log(artist);
      });
  };
}

const app = new App();
const controller = new APIController(CLIENT_ID, CLIENT_SECRET);
