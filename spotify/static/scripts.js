const position_api_key = "a35c2664b0c01dcc7a0cbc1c0fada080";
const position_url = "http://api.positionstack.com/v1/";
const spotify_token_url = "https://accounts.spotify.com/api/token"
const owm_api_key = "ac082231e3244db2ef21147342c780dc";
var spotify_token = "";

// LOAD SCREEN ------------------------------------------------------------------------------------------------------------------------------------------------------

function loadscreen_on() {
    document.getElementById("loading_spinner").style.visibility = "visible";
    document.getElementById("blur").className = "z-20 blur-lg bg-white/30 min-h-screen min-w-screen max-h-screen max-w-screen";
}

function loadscreen_off() {
    document.getElementById("loading_spinner").style.visibility = "hidden";
    document.getElementById("blur").className = "";
}

function populate_playlist_containers() {
    document.getElementById("playlist1_frame").className = "m-2 h-3/6 rounded-lg overflow-hidden";
    document.getElementById("playlist1_button").style.visibility = "visible";
    document.getElementById("playlist2_frame").className = "m-2 h-3/6 rounded-lg overflow-hidden";
    document.getElementById("playlist2_button").style.visibility = "visible";
    document.getElementById("playlist3_frame").className = "m-2 h-3/6 rounded-lg overflow-hidden";
    document.getElementById("playlist3_button").style.visibility = "visible";
}

// API FUNCTIONS ----------------------------------------------------------------------------------------------------------------------------------------------------

async function auth() {
    spotify_api_response = await spotify_get_token();
    spotify_token = spotify_api_response.access_token;
}

async function spotify_get_token() {
    const client_id = "957c6c11fe3b42a78262972786c932ed"
    const client_secret = "4a6f76e64a174df7b78ede20d1852e87"

    const response = await fetch(
        spotify_token_url,
        {
            method: 'POST',
            headers: {
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials&client_id=" + client_id +"&client_secret=" + client_secret
        }
    );

    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        alert("Spotify API token request failed.");
    }
}

async function spotify_get_playlists(weather) {
    spotify_playlist_url = "https://api.spotify.com/v1/search?q=" + weather + "&type=playlist&limit=50&market=US"

    const response = await fetch(
        spotify_playlist_url,
        {
            method: 'GET',
            headers: {
                "Authorization":"Bearer  " + spotify_token
            }
        }
    );

    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        alert("Spotify API playlist request failed.");
        loadscreen_off();
    }
}

async function ps_get_location(lat,lon) {
    const param = lat + "," + lon;
    const url_reverse = position_url + "reverse?access_key=" + position_api_key + "&query=" + param +"&limit=1";

    const response = await fetch(
        url_reverse,
        {
            method: 'GET'
        }
    );

    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        alert("Location API call failed.");
        loadscreen_off();
    }
    
}

async function owm_get_weather(lat,lon) {
    const owm_url = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + owm_api_key

    const response = await fetch(
        owm_url,
        {
            method: 'GET'
        }
    );

    if (response.ok) {
        const data = await response.json();
        return data
    } else {
        alert("OpenWeatherMap API call failed.");
        loadscreen_off();
    }
}

// UI UPDATE FUNCTIONS-----------------------------------------------------------------------------------------------------------------------------------------------

async function set_weather(lat,lon) {
    const owm_api_response = await owm_get_weather(lat,lon);

    var temp_f = owm_api_response.current.temp;
    var temp_c = (temp_f - 32) * 5/9;
    var weather = owm_api_response.current.weather[0].main;
    var weather_desc = owm_api_response.current.weather[0].description;

    console.log(temp_f);
    console.log(temp_c);
    console.log(weather);
    console.log(weather_desc);

    const ui_temp_f = document.querySelector("#temp");
    const ui_weather_desc = document.querySelector("#weather_desc");
    const ui_animation = document.querySelector("#animation");

    ui_temp_f.textContent = Math.ceil(temp_f) + "°F / " + Math.ceil(temp_c) + "°C"
    ui_weather_desc.textContent = weather_desc.toUpperCase();

    switch(weather) {
        case "Clear":
            var today = new Date();
            var hh = today.getHours()
            if (hh > 18) {
                ui_animation.src = "static/src/images/clear-night.svg";
                ui_animation.alt = weather_desc;
            } else {
                ui_animation.src = "static/src/images/clear-day.svg";
                ui_animation.alt = weather_desc;
            }
            break;
        case "Clouds":
            ui_animation.src = "static/src/images/cloudy.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Smoke":
            ui_animation.src = "static/src/images/clear-day.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Mist":
            ui_animation.src = "static/src/images/mist_haze.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Dust":
            ui_animation.src = "static/src/images/dust.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Tornado":
            ui_animation.src = "static/src/images/tornado.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Haze":
            ui_animation.src = "static/src/images/mist_haze.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Snow":
            ui_animation.src = "static/src/images/snow.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Rain":
            ui_animation.src = "static/src/images/rain.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Drizzle":
            ui_animation.src = "static/src/images/drizzle.svg";
            ui_animation.alt = weather_desc;
            break;
        case "Thunderstorm":
            ui_animation.src = "static/src/images/thunderstorm.svg";
            ui_animation.alt = weather_desc;
            break;
        default: break;
    }

    set_playlists(weather);
}

async function set_playlists(weather) {
    const spotify_playlist_api_response = await spotify_get_playlists(weather);
    
    rand1 = getRandomInt(20);
    rand2 = getRandomInt(20);
    rand2loop:
    while (rand2 == rand1) {
        if (rand2 != rand1) {
            break rand2loop;
        } else {
            rand2 = getRandomInt(20);
        }
    }
    rand3 = getRandomInt(20);
    rand3loop1:
    while (rand3 == rand1) {
        if (rand3 != rand1) {
            break rand3loop1;
        } else {
            rand3 = getRandomInt(20);
        }
    }
    rand3loop2:
    while (rand3 == rand2) {
        if (rand3 != rand2) {
            break rand3loop2;
        } else {
            rand3 = getRandomInt(20);
        }
    }

    const ui_playlist1_name = document.querySelector("#playlist1_name");
    const ui_playlist1_link = document.querySelector("#playlist1_link");
    const ui_playlist1_img = document.querySelector("#playlist1_img");

    const ui_playlist2_name = document.querySelector("#playlist2_name");
    const ui_playlist2_link = document.querySelector("#playlist2_link");
    const ui_playlist2_img = document.querySelector("#playlist2_img");

    const ui_playlist3_name = document.querySelector("#playlist3_name");
    const ui_playlist3_link = document.querySelector("#playlist3_link");
    const ui_playlist3_img = document.querySelector("#playlist3_img");

    playlist1 = spotify_playlist_api_response.playlists.items[rand1];
    playlist2 = spotify_playlist_api_response.playlists.items[rand2];
    playlist3 = spotify_playlist_api_response.playlists.items[rand3];

    console.log(playlist1);
    console.log(playlist2);
    console.log(playlist3);

    ui_playlist1_name.textContent = playlist1.name;
    ui_playlist1_link.href = playlist1.external_urls.spotify;
    ui_playlist1_img.src = playlist1.images[0].url;

    ui_playlist2_name.textContent = playlist2.name;
    ui_playlist2_link.href = playlist2.external_urls.spotify;
    ui_playlist2_img.src = playlist2.images[0].url;

    ui_playlist3_name.textContent = playlist3.name;
    ui_playlist3_link.href = playlist3.external_urls.spotify;
    ui_playlist3_img.src = playlist3.images[0].url;

    loadscreen_off();
    populate_playlist_containers();
}

function locate() {
    loadscreen_on();

    const map = document.querySelector("#map");
    const ui_weather_desc = document.querySelector("#weather_desc");
    const ui_location = document.querySelector("#city_state");

    async function success(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        console.log("STATUS: Successfully retrieved location.");
        const api_response = await ps_get_location(lat,lon);

        const location = api_response.data[0];
        const city = api_response.data[0].locality;
        const state = api_response.data[0].region_code;
        const zip = api_response.data[0].postal_code;
        const country = api_response.data[0].country;

        var output_loc = city + ", " + state;
        console.log(output_loc);
        ui_weather_desc.textContent = "Weather Placeholder";
        ui_location.textContent = output_loc;

        set_weather(lat,lon);
    }

    function error() {
        alert("STATUS: Unable to retrieve location.");
        console.log("STATUS: Unable to retrieve location.");
        loadscreen_off();
    }

    if (!navigator.geolocation) {
        alert("STATUS: Geolocation is not supported by your browser.");
        console.log("STATUS: Geolocation is not supported by your browser.");
        loadscreen_off();
    } else {
        console.log("STATUS: Locating...");
        navigator.geolocation.getCurrentPosition(success,error);
    }
}

// MISC FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------------------------

function get_date() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    const ui_date = document.querySelector("#date");
    ui_date.textContent = today;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}