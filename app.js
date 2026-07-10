
const button = document.getElementById("Enter_button");
const city_input = document.getElementById("city_name");



async function getter() {
    

    let city = city_input.value.trim();

    

    const apiurl_city = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=3&language=en&format=json`;

    const raw_data_cor = await fetch(apiurl_city);

    const data_cor = await raw_data_cor.json();

     console.log(data_cor);
    
    let lan, lon;
    try{

     lan = data_cor.results[0].latitude;
     lon = data_cor.results[0].longitude;
    

    }

    catch(error){
        console.log("Please Enter a valid name");
    }

    console.log(lan,lon);

    const apiurl_weather = `https://api.open-meteo.com/v1/forecast?latitude=${lan}&longitude=${lon}&&hourly=rain&current=temperature_2m&timezone=auto`;


    const raw_data_wet = await fetch(apiurl_weather);
    const data_wet = await raw_data_wet.json();

    console.log(data_wet);

    document.getElementById("temperature").textContent = data_wet.current.temperature_2m; 



    

}

button.onclick = getter;

city_input.addEventListener("keydown",function(event){

    if(event.key == "Enter"){
        getter();
    }
});



function clicker(){

const search_item = document.querySelectorAll("#autocomplete li");

search_item.forEach(element => {
      console.log("merhaba");
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