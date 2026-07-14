import { PEXELS_API_KEY } from './config.js';


const button = document.getElementById("Enter_button");
const city_input = document.getElementById("city_name");

function emoji_decider(rain_per){
    let weather_emoji;
     if (rain_per === 0) {
            weather_emoji = "☀️";
        } else if (rain_per > 0 && rain_per <= 2.5) {
            weather_emoji = "🌦️";
        } else if (rain_per > 2.5 && rain_per <= 7.6) {
            weather_emoji = "🌧️";
        } else {
            weather_emoji = "⛈️";
        }

        return weather_emoji;
}

function city_lan_lon(city){
    
    return new Promise( (resolve,reject) => {
        const apiurl_city = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=3&language=en&format=json`;
        fetch(apiurl_city).then(response => {
            
            if(!response.ok) throw new Error("API error");
            return response.json();}
        ).then(data => resolve(data)
        ).catch(rec => {
            reject(rec);})
    })

   

}


function city_weather(lan,lon){
    return new Promise((resolve,reject) =>{

        const url =  `https://api.open-meteo.com/v1/forecast?latitude=${lan}&longitude=${lon}&hourly=temperature_2m,rain&current=temperature_2m,rain&timezone=auto&forecast_days=1`;
        fetch(url).then(response => {

            if(!response.ok) throw new Error("Api error");

            return response.json();
        }).then(data => resolve(data)).catch(err => reject(err));

    }
)
}


function city_img_search(city){

   return new Promise( (resolve,reject) => {
    const apiurl_city = `https://pixabay.com/api/?key=${PEXELS_API_KEY}&q=${encodeURIComponent(city)}+city&image_type=photo&orientation=horizontal&pretty=true`;
        fetch(apiurl_city).then(response => {
            
            if(!response.ok) throw new Error("API error");
            return response.json();}
        ).then(data => resolve(data)
        ).catch(rec => {
            reject(rec);})
    });
}


async function img_setter(city){

    const city_photo = await city_img_search(city);
    const city_img = document.createElement("img");
    console.log(city_photo);

    if (city_photo.hits && city_photo.hits.length > 0) {
        const imageUrl = city_photo.hits[0].largeImageURL;
        document.body.style.backgroundImage = `url(${imageUrl})`;
    }
}

async function getter() {
    

    let city = city_input.value.trim();

    

    const data_cor = await city_lan_lon(city);

     console.log(data_cor);
    
    let lan, lon;
    try{

     lan = data_cor.results[0].latitude;
     lon = data_cor.results[0].longitude;
    

    }

    catch(error){
        console.log("Please enter a valid city name.");
    }

    document.getElementById("city").textContent = data_cor.results[0].name;

    console.log(lan,lon);

    
    const data_wet = await city_weather(lan,lon);

    console.log(data_wet);

    document.getElementById("temperature").textContent = data_wet.current.temperature_2m;

    let current_rain =  data_wet.current.rain;
    let weather_emoji = emoji_decider(current_rain);


    document.getElementById("Weather_emo").textContent = weather_emoji;
    document.querySelector(".hourly_temp").innerHTML = "";
    document.querySelector(".hourly_temp_head").innerHTML = "";

    for (let hour = 0; hour <= 23; hour++) {
        const table_data = document.createElement("td");
        const table_header = document.createElement("th");
        table_header.textContent = (hour < 10 ? "0" + hour : hour) + ":00";
        table_data.textContent = data_wet.hourly.temperature_2m[hour] + "°C";

        document.querySelector(".hourly_temp_head").appendChild(table_header);
        document.querySelector(".hourly_temp").appendChild(table_data);
        
    }

    document.querySelector(".hourly_rain").innerHTML = "";
    document.querySelector(".hourly_rain_head").innerHTML = "";

    for (let hour = 0; hour <= 23; hour++) {
        
        const table_data = document.createElement("td");
        const table_header = document.createElement("th");
        table_header.textContent = (hour < 10 ? "0" + hour : hour) + ":00";
        let rain_per = data_wet.hourly.rain[hour];

        weather_emoji = emoji_decider(rain_per);

        table_data.textContent = weather_emoji;

        document.querySelector(".hourly_rain_head").appendChild(table_header);
        document.querySelector(".hourly_rain").appendChild(table_data);
    
    }   


    document.querySelector(".weather-container").style.display = "block";

    document.querySelectorAll(".table").forEach(table => {
        table.style.display = 'block';});


        img_setter(city);

        
}

button.addEventListener("click", getter);

city_input.addEventListener("keydown",function(event){

    if(event.key == "Enter"){
        getter();
    }
});



function clicker(){

const search_item = document.querySelectorAll("#autocomplete li");

search_item.forEach(element => {

    element.addEventListener("mousedown", e => {
        document.querySelector("#city_name").value = element.textContent.trim();
    });
});
}

city_input.addEventListener("input", async e =>{

    const val = city_input.value;

    const url_searc_ops = `https://geocoding-api.open-meteo.com/v1/search?name=${val}&count=5&language=en&format=json`
    const raw = await fetch(url_searc_ops);
    const fresh_data =  await raw.json();

    console.log(fresh_data);

    document.querySelector("#autocomplete").innerHTML = "";
    
    if(!fresh_data.results)
        return;

    const city_name_list = new Set();


    fresh_data.results.forEach(city=>{

        
        
        if(city_name_list.has(city.name)){
            return;
        }
          city_name_list.add(city.name);
        
      

        const list_element = document.createElement("li");
        list_element.textContent = city.name;

        document.querySelector("#autocomplete").appendChild(list_element);

    } )


    clicker();

});


