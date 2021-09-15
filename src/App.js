import React, { useState, useEffect } from 'react';
import './App.css';
import cityArr from './citiyarr.js'
import cityId from './cityid.js'
import sun from './images/sun.svg';
import rain from './images/rain.svg';
import cloud from './images/cloud.svg';
import partlyCloudy from './images/partlyCloudy.svg';
import strom from './images/strom.svg';


function City(props) {
  return (
    <div className="city">
      <h3>{props.city}</h3>
      <span onClick={()=>props.setSelectCity(true)}>Сменить город</span>
      <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.489 0.838191L0.238948 11.6268L8.72799 13.2769L13.2146 20.7637L17.489 0.838191Z" fill="white" fillOpacity="0.4"/>
      </svg> 
      <span className="geo">Моё местоположение</span>
    </div>
  );
}

function SelectCity(props) {
  function autocompleteMatch(input) {
    if (input == '') {
      return [];
    }
    var reg = new RegExp(input)
    return cityArr.filter(function(term) {
      if (term.match(reg)) {
        return term;
      } 
    });
  }

  function showResults(val) {
    let res = document.getElementById("result");
    res.innerHTML = '';
    let list = '';
    let terms = autocompleteMatch(val);
    for (let i=0; i<terms.length; i++) {
      list += "<li onClick=" + "document.getElementById('cityInput').value=this.innerHTML;" + "document.getElementById('result').innerHTML=''  " + ">" + terms[i] + "</li>";
    }
    res.innerHTML = '<ul>' + list + '</ul>';
  
  }
  
  return (
    <div className="select-city">
      <input 
        autoComplete="off" 
        id="cityInput" 
        type="text" 
        onKeyUp={(e) => showResults(e.target.value)}
      />
      <button 
      onClick={
        ()=>{
          props.setCity(document.getElementById('cityInput').value)
          props.setSelectCity(false) 
          fetch('http://api.openweathermap.org/data/2.5/weather?id=' + cityId[document.getElementById('cityInput').value] + '&appid=7b9123e43545fc08731bc69b5f97d9f2&lang=ru')
            .then(response => response.json())
            .then(weather => {
              props.setWeather(weather)
            })
        }
      }>OK</button>
      <div id="result"></div>
    </div>
  );
}

function Temp(props) {
  return (
    <div className="temp">
      <span>&#176;</span>
      <button 
        onClick={() => props.celsiusOn()} 
        className={
          props.celsiusBoolean ? "tempbutton celsius active" : "tempbutton celsius"
        }>
        C
      </button> 
      <button 
        onClick={() => props.fahrenheitOn()} 
        className={
          props.fahrenheitBoolean ? "tempbutton fahrenheit active" : "tempbutton fahrenheit"
        }>
        F
      </button>
    </div>
  );

}

function MainWeather(props){
  let icon = '';
  switch(props.weather.weather[0].icon){
    case '01d': icon = sun 
    break
    case '01n': icon = sun 
    break
    case '02d': icon = partlyCloudy
    break
    case '02n': icon = partlyCloudy
    break
    case '03d': icon = cloud
    break
    case '03n': icon = cloud
    break
    case '04d': icon = cloud
    break
    case '04n': icon = cloud
    break
    case '09d': icon = rain
    break
    case '09n': icon = rain
    break
    case '10d': icon = rain
    break
    case '10n': icon = rain
    break
    case '11d': icon = strom
    break
    case '11n': icon = strom
    break
    default: icon = cloud
  }
  if (icon == rain || icon == strom || icon == cloud) {
    document.body.style.background = '#7290B9'
  } else {
    document.body.style.background = '#498CEC'
  }
  return (
    <div>
      <img src={icon} />
      <h2>
        {
        props.fahrenheitBoolean?
        ((props.weather.main.temp)/10).toFixed(0):
        (((props.weather.main.temp-32)*(5/9))/10).toFixed(0)
        }
      &#176;</h2> <br/>
      <span>{props.weather.weather[0].description}</span>
    </div>
  );
}

function WeatherDetail(props){
  let direction = ''
  if (props.weather.wind.deg = 360) {
    direction = 'cеверный'
  } else if (props.weather.wind.deg < 360) {
    direction = 'cеверо-западный'
  } else if (props.weather.wind.deg == 270) {
    direction = 'западный'
  } else if (props.weather.wind.deg < 270) {
    direction = 'юго-западный'
  } else if (props.weather.wind.deg == 180) {
    direction = 'южный'
  } else if (props.weather.wind.deg < 180) {
    direction = 'юго-восточный'
  } else if (props.weather.wind.deg == 90) {
    direction = 'восточный'
  } else if (props.weather.wind.deg < 90) {
    direction = 'северо-восточный'
  } else if (props.weather.wind.deg == 0) {
    direction = 'отсутствует'
  }
  return (
    <div className="weather-detail">
      <div>
        <p className="title">Ветер</p>
        <p className="desc">{props.weather.wind.speed} м/c, {direction} </p>
      </div>
      <div>
        <p className="title">Давление</p>
        <p className="desc">{props.weather.main.pressure} мм рт. ст.</p>
      </div>
      <div>
        <p className="title">Влажность</p>
        <p className="desc">{props.weather.main.humidity}%</p>
      </div>
      <div>
        <p className="title">Вероятность дождя</p>
        <p className="desc">{props.weather.clouds.all}%</p>
      </div>
    </div>
  );
}

function CityBlock(props){
  if(props.selectCity == true){
    return(
      <SelectCity 
        setWeather={props.setWeather}
        city={props.city} 
        setCity={props.setCity} 
        setSelectCity={props.setSelectCity} 
      />
    )
  } 
  return(
    <City 
      setSelectCity={props.setSelectCity} 
      city={props.city} 
      setCity={props.setCity} 
    />
  )
  
}

function App() {
  const [celsius, setCelsius] = useState(true);
  const [fahrenheit, setFahrenheit] = useState(false);
  function Celsius(){
    setCelsius(true)
    setFahrenheit(false)
  }
  function Fahrenheit(){
    setCelsius(false)
    setFahrenheit(true)
  }
  const [weather, setWeather] = useState( 
    {
      "weather": [
        {
          "main": "",
          "description": "",
          "icon": ""
        }
      ],
      "main": {
        "temp": '',
        "pressure": '',
        "humidity": '',
      },
      "wind": {
        "speed": '',
        "deg": ''
      },
      "clouds": {
        "all": ''
      }
    }
  )
  const [city, setCity] = useState('Москва') 
  const [selectCity, setSelectCity] = useState(false)
  useEffect(()=>{
    fetch('http://api.openweathermap.org/data/2.5/weather?id=' + cityId[city] + '&appid=7b9123e43545fc08731bc69b5f97d9f2&lang=ru')
      .then(response => response.json())
      .then(weather => {
        setWeather(weather)
      },)
  }, [])
  return (
    <div className='container'>
      <div className="block1">
        <CityBlock 
          setWeather ={setWeather}
          setSelectCity={setSelectCity} 
          selectCity={selectCity} 
          city={city} 
          setCity={setCity} 
        />
        <Temp 
          celsiusOn={Celsius} 
          fahrenheitOn={Fahrenheit} 
          celsiusBoolean={celsius} 
          fahrenheitBoolean={fahrenheit}
        />
      </div>
      <div className="block2">
        <MainWeather 
          celsiusBoolean={celsius} 
          fahrenheitBoolean={fahrenheit} 
          weather={weather} 
        />
      </div>
      <div className="block3">
        <WeatherDetail weather={weather} />
      </div>
    </div>
  );
}



export default App;
