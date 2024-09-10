const userTab = document.querySelector("[userW]");
const searchTab = document.querySelector("[searchW]");
const userContainer = document.querySelector(".weather-container");

const grantAccess = document.querySelector(".grantLocation");
const searchForm = document.querySelector(".data-search");
const loadingScreen = document.querySelector(".loading-screen");
const userInfoContainer = document.querySelector(".user-info");

let currentTab = userTab;
const API_KEY = "161b5eddcf3e4124d0ab2efb47621891";
currentTab.classList.add("current-tab");
getfromSessionStorgae();




function switchTab(tab){
 if(tab==currentTab){
    return;
 }
 else{
    currentTab.classList.remove("current-tab")
    currentTab=tab;
    currentTab.classList.add("current-tab")
 }

 //user acitve tha to ab search wala active karo
if(!searchForm.classList.contains("active"))
    {
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");
    searchForm.classList.add("active");
}

//search active tha toh ab user active karo
else{
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    getfromSessionStorgae();
    
}
}

function getfromSessionStorgae(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates){
    const{lat, lon} = coordinates;
    //jaise hi access mil jaye api call krne niklo, aur access screen ko hide krke loading screen ko lao
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json(); 

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherinfo(data);
    }
   
    catch(err){

    }  
}

function renderWeatherinfo(weatherInfo){
    const cityName = document.querySelector(".cityName");
    const countryIcon = document.querySelector(".countryIcon1");
    const desc = document.querySelector(".weatherDesc");
    const weatherIcon = document.querySelector(".weatherImage");
    const temp = document.querySelector(".dataTemp");
    const humidity = document.querySelector(".windData");
    const windSpeed = document.querySelector(".humidData");
    const cloudiness = document.querySelector(".cloudData");


    //?. is used to get data from an object notation--first?.second?.third;
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather[0]?.description;  
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp + "°C";
    humidity.innerText = weatherInfo?.main?.humidity + "m/s";
    windSpeed.innerText = weatherInfo?.wind?.speed +"%";
    cloudiness.innerText = weatherInfo?.clouds?.all+ "%";

}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position){
    const userCoordinates = {
       lat : position.coords.latitude,
       lon : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
   
}

const grantAccessBtn= document.querySelector(".accessBtn");
grantAccessBtn.addEventListener("click", getLocation())


const searchInput = document.querySelector(".search");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName= searchInput.value;

    if(cityName=="")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("acitve");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("acitve");
  
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data= await response.json();
            loadingScreen.classList.remove("acitve");
            userInfoContainer.classList.add("active");
            renderWeatherinfo(data);
    }
    catch(err){

    }


    
}














userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});