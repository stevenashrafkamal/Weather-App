const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const saveBtn = document.getElementById('saveBtn');
const resultDiv = document.getElementById('weatherResult');
const favList = document.getElementById('favList');

const displayCityName = document.getElementById('displayCityName');
const tempSpan = document.getElementById('temp');
const windSpan = document.getElementById('wind');
const descSpan = document.getElementById('desc');

let favoriteCities = JSON.parse(localStorage.getItem('myWeatherFavs')) || [];

renderFavorites();

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    getWeather(city);
});

saveBtn.addEventListener('click', addToFavorites);

function getWeather(city) {
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
    
    resultDiv.classList.remove('hidden');
    displayCityName.innerText = "Loading...";

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            const current = data.current_condition[0];
            
            displayCityName.innerText = city;
            tempSpan.innerText = `${current.temp_C} °C`;
            windSpan.innerText = `${current.windspeedKmph} km/h`;
            descSpan.innerText = current.weatherDesc[0].value;
            
            cityInput.value = city;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            displayCityName.innerText = "City not found or API Error";
        });
}

function addToFavorites() {
    const city = cityInput.value.trim();

    if (city && !favoriteCities.includes(city)) {
        favoriteCities.push(city);
        localStorage.setItem('myWeatherFavs', JSON.stringify(favoriteCities));
        renderFavorites();
    } else {
        alert("City is empty or already in favorites!");
    }
}

function renderFavorites() {
    favList.innerHTML = "";

    favoriteCities.forEach(city => {
        const btn = document.createElement('button');
        btn.innerText = city;
        btn.className = 'fav-btn';
        
        btn.addEventListener('click', () => {
            getWeather(city);
        });

        favList.appendChild(btn);
    });
}

const compareBtn = document.getElementById('compareBtn');
const comparisonResultDiv = document.getElementById('comparisonResult');

compareBtn.addEventListener('click', compareCities);

function compareCities() {
    const city1Input = document.getElementById('city1');
    const city2Input = document.getElementById('city2');
    
    const city1 = city1Input.value.trim();
    const city2 = city2Input.value.trim();

    if (!city1 || !city2) {
        alert("Please enter both city names.");
        return;
    }

    comparisonResultDiv.classList.remove('hidden');

    const url1 = `https://wttr.in/${encodeURIComponent(city1)}?format=j1`;
    const url2 = `https://wttr.in/${encodeURIComponent(city2)}?format=j1`;

    Promise.all([
        fetch(url1).then(res => res.json()),
        fetch(url2).then(res => res.json())
    ])
    .then(data => {
        const current1 = data[0].current_condition[0]; 
        const current2 = data[1].current_condition[0]; 

        document.getElementById('th-city1').innerText = city1;
        document.getElementById('th-city2').innerText = city2;

        document.getElementById('c1-temp').innerText = `${current1.temp_C} °C`;
        document.getElementById('c2-temp').innerText = `${current2.temp_C} °C`;

        document.getElementById('c1-wind').innerText = `${current1.windspeedKmph} km/h`;
        document.getElementById('c2-wind').innerText = `${current2.windspeedKmph} km/h`;

        document.getElementById('c1-desc').innerText = current1.weatherDesc[0].value;
        document.getElementById('c2-desc').innerText = current2.weatherDesc[0].value;

        highlightHotterCity(`${current1.temp_C} °C`, `${current2.temp_C} °C`);
    })
    .catch(error => {
        console.error(error);
        alert("Error fetching data. Please check city names.");
    });
}

function highlightHotterCity(temp1Str, temp2Str) {
    const t1 = parseInt(temp1Str);
    const t2 = parseInt(temp2Str);

    const el1 = document.getElementById('c1-temp');
    const el2 = document.getElementById('c2-temp');

    el1.style.color = "#333";
    el2.style.color = "#333";

    if (!isNaN(t1) && !isNaN(t2)) {
        if (t1 > t2) {
            el1.style.color = "#ef4444";
            el2.style.color = "#3b82f6";
        } else if (t2 > t1) {
            el2.style.color = "#ef4444";
            el1.style.color = "#3b82f6";
        }
    }
}