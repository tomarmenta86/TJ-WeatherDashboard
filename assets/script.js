var APIKey = "3a46126d10c5be5fb84a6f2f079282f0";
var numOfSearchedCities = 0;

//Add event listener on search button to search inputted city
function HandleCity () {
    const searchBtn = document.getElementById("searches");

    searchBtn.addEventListener("click", getApiResponse)
}

//Use user input of city name to complete api call and get basic city info 
//Error handling for no inputted city
//Update local storage
async function getApiResponse() {
    numOfSearchedCities += 1;
    var cityInput = document.getElementById('cityInput').value;
    const apiResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=3a46126d10c5be5fb84a6f2f079282f0`);
    const apiReturn = await apiResponse.json();

    localStorage.setItem(numOfSearchedCities, cityInput);

    if(apiReturn.cod == "400" || apiResponse.status == "400")
    {
        alert("No city inputted!");
        return;
    }

    HandleCityWeather(apiReturn[0].lat, apiReturn[0].lon, cityInput);
}

//Use stored city history to complete api call and get basic city info
//Update local storage
async function getApiResponseFromHistory(cityToSearch) {
    numOfSearchedCities += 1;

    const apiResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityToSearch}&limit=1&appid=3a46126d10c5be5fb84a6f2f079282f0`);
    const apiReturn = await apiResponse.json();

    localStorage.setItem(numOfSearchedCities, cityToSearch);

    HandleCityWeather(apiReturn[0].lat, apiReturn[0].lon, cityToSearch);
}

//Use basic city info from api call to get weather info and update future and current weather cards
async function HandleCityWeather( cityLat, cityLon, city) {
    const futureApiResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=3a46126d10c5be5fb84a6f2f079282f0&units=imperial`);
    const currentApiResponse = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=3a46126d10c5be5fb84a6f2f079282f0&units=imperial`);
    const futureApiReturn = await futureApiResponse.json();
    const currentApiReturn = await currentApiResponse.json();

    PrintCurrentCityWeather(city, currentApiReturn.main.temp, currentApiReturn.wind.speed, currentApiReturn.main.humidity, currentApiReturn.weather[0].main);

    var count = 0;

    for(let i = 0; i<futureApiReturn.list.length; i++)
    {
        var apiIndex = futureApiReturn.list[i];
        
        if(apiIndex.dt_txt.substring(11) == '21:00:00')
        {
            count += 1;
            PrintCityWeather(apiIndex.dt_txt, apiIndex.main.temp, apiIndex.wind.speed, apiIndex.main.humidity, apiIndex.weather[0].main, count);
        }
    }
}

//Update current weather card
function PrintCurrentCityWeather(city, temp, wind, humidity, weather)
{
    const currentDate = new Date();
    var printDate = `${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

    document.getElementById("currentDay").innerHTML = city + " (" + printDate + ")";
    document.getElementById("currentTemp").innerHTML = temp + "° F";
    document.getElementById("currentWind").innerHTML = wind + " MPH";
    document.getElementById("currentHumidity").innerHTML = humidity + " %";
    UpdateWeatherIcon(weather, 0)
}

//Update future weather cards
function PrintCityWeather(date, temp, wind, humidity, weather, weatherCard){
    var formattedDate = FormatTheDate(date);
    
    document.querySelector(`[id ^= futureDate${weatherCard}]`).innerHTML = formattedDate;
    document.querySelector(`[id ^= temp${weatherCard}]`).innerHTML = temp + "° F";
    document.querySelector(`[id ^= wind${weatherCard}]`).innerHTML = wind + " MPH";
    document.querySelector(`[id ^= humidity${weatherCard}]`).innerHTML = humidity + " %";
    UpdateWeatherIcon(weather, weatherCard)
}

//Format date for future weather cards
function FormatTheDate(date){
    var year = date.substring(0, 4);
    var month = date.substring(5,7);
    var day = date.substring(8,10)
    var formattedDate = month + "/" + day + "/" + year;

    return formattedDate;
}

//Update weather icons based on weather info from api call
function UpdateWeatherIcon(weather, weatherCard){
    
    if(weather == "Clear" && weatherCard != 0){
        //document.querySelector(`[id ^= weatherIcon${weatherCard}]`).appendChild(/*add icon*/)
    }
    else if(weather == "Clear" && weatherCard == 0){
        //document.getElementById("weatherIcon").appendChild(/*add icon*/)
    }

    if(weather == "Clouds" && weatherCard != 0){
        //document.querySelector(`[id ^= weatherIcon${weatherCard}]`).appendChild(/*add icon*/)
    }
    else if(weather == "Clouds" && weatherCard == 0){
        //document.getElementById("weatherIcon").appendChild(/*add icon*/)
    }

    if(weather == "Thunderstorm" && weatherCard != 0){
        //document.querySelector(`[id ^= weatherIcon${weatherCard}]`).appendChild(/*add icon*/)
    }
    else if(weather == "Thunderstorm" && weatherCard == 0){
        //document.getElementById("weatherIcon").appendChild(/*add icon*/)
    }

    if(weather == "Drizzle" && weatherCard != 0){
        //document.querySelector(`[id ^= weatherIcon${weatherCard}]`).appendChild(/*add icon*/)
    }
    else if(weather == "Drizzle" && weatherCard == 0){
        //document.getElementById("weatherIcon").appendChild(/*add icon*/)
    }

    if(weather == "Rain" && weatherCard != 0){
        //document.querySelector(`[id ^= weatherIcon${weatherCard}]`).appendChild(/*add icon*/)
    }
    else if(weather == "Rain" && weatherCard == 0){
        //document.getElementById("weatherIcon").appendChild(/*add icon*/)
    }

    if(weather == "Snow" && weatherCard != 0){
        //document.querySelector(`[id ^= weatherIcon${weatherCard}]`).appendChild(/*add icon*/)
    }
    else if(weather == "Snow" && weatherCard == 0){
        //document.getElementById("weatherIcon").appendChild(/*add icon*/)
    }
}

//Print searched city history to list of cities
function PrintCityHistory() {
    for(let i = 1; i<localStorage.length; i++)
    {
        var key = localStorage.key(i);
        var printText = localStorage.getItem(key);

        document.querySelector(`[id ^= search${i}]`).innerHTML = printText;
    }
}

//Clear local storage if function call is uncommented
function ClearLocalStorage(){
    localStorage.clear();
}

//Handle when a city from the history list is clicked and search it again
function HandleHistory(){
    const historyBtns = document.getElementsByClassName("button is-primary m-1");

    for(let i = 0; i<historyBtns.length; i++)
    {
        historyBtns[i].addEventListener("click", () => {
            if(historyBtns[i].innerHTML.substring(0,4) != "city")
            {
                getApiResponseFromHistory(historyBtns[i].innerHTML);
            }
        });
    }
}

//ClearLocalStorage();
HandleHistory();
HandleCity();
PrintCityHistory();