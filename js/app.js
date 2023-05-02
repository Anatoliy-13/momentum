/*Часы и календарь */
const time = document.querySelector('.time');
const data = document.querySelector('.date');


/*Получаем текущее время */
function showTime(){
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    getTimeOfDay();
}
showTime();

/*Получаем текущую дату */
function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-US', options);
    data.textContent = currentDate;
}


/* Приветствие */
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');

/*Текст приветствия изменяется в зависимости от времени суток */

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    
    if (6 <= hours && hours< 12) {
        return 'morning';
    } else if (12 <= hours && hours < 18) {
        return 'afternoon';
    } else if (18 <= hours && hours < 24) {
        return'evening';
    } else {
        return 'night';
    };
};
getTimeOfDay();


const timeOfDay = getTimeOfDay();
const greetingText = `Good ${timeOfDay},`;
greeting.textContent = greetingText;
    
/*При перезагрузке страницы приложения имя пользователя сохраняется */
function setLocalStorage() {
    localStorage.setItem('name', name.value);
  }
  
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
  }
  
window.addEventListener('load', getLocalStorage);


/*Слайдер изображений */
const body = document.body;
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

   /*функцию getRandomNum(), возвращающую рандомное число от 1 до 20 включительно */
let min = 1;
let max = 20;
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// getRandomNum(min,max);

   /*Плавная смена фоновых изображений */
let getRandomNumber = getRandomNum(min, max).toString();
let bgNum = getRandomNumber.padStart(2,'0');
   
function setBg() {  
    const img = new Image();
    const url = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.src = url;
    // console.log(img.src);
    img.onload = () => {      
       body.style.backgroundImage = `url(${url})`;
    }; 
};
setBg();
  

/*Изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана */
function getSlideNext() {
    if(bgNum === 20) {
      return bgNum = 1;
    } else {
      bgNum++;
    };
    getRandomNumber = getRandomNum(min, max).toString();
    bgNum = getRandomNumber.padStart(2,"0");
    setBg(); 
}
  
function getSlidePrev() {
    if(bgNum === 1) {
      return 20;
    } else {
      bgNum--;
    };
    getRandomNumber = getRandomNum(min, max).toString();
    bgNum = getRandomNumber.padStart(2,"0");
    setBg();
}
  
slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);



/* Виджет погоды */

// https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=ru&appid=eb0b9df79371b07498ca3302de8b0a58&units=metric

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');


localStorage.getItem('.city') === null ? city.value = 'Minsk' : getCityFromLocalStorage();

async function getWeather() { 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=eb0b9df79371b07498ca3302de8b0a58&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data.weather[0].id, data.weather[0].description, data.main.temp);

    if (city.value === '' || res.status === 404) {
      weatherError.textContent = 'Input city! Incorrect city name!';
      city.placeholder = '[Enter the city]';
      temperature.textContent = '';
      weatherDescription.textContent = '';
      wind.textContent = '';
      humidity.textContent = '';
      }else {
      weatherError.textContent = '';
    }
     
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${data.wind.speed.toFixed(0)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
    setTimeout(getWeather, 3600000);
}

getWeather();
 
city.addEventListener('change', () => {
  getWeather();
});

  /*Виджет "цитата дня" */

const changeQuote = document.querySelector('.change-quote')
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");

async function getQuotes() {  
  const quotes = './data.json';
  const res = await fetch(quotes);
  const data = await res.json(); 
  // console.log(data);

  const quoteNum = getRandomNum(12, 0);
  quote.textContent = `"${data[quoteNum].text}"`;
  author.textContent = data[quoteNum].author;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);


/*Аудиоплеер */
import playList  from "./pl.js";

const play = document.querySelector('.play');
const playPrevAudio = document.querySelector('.play-prev');
const playNextAudio = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const containerAudio = document.querySelector('.custom-player-container');
let isPlay = false;
let playNum = 0;
const audio = new Audio();



        /*создание текстового списка воспроизведения */
audio.src = playList[playNum].src;

playList.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList[index].title;
    playListContainer.append(li);
});
        /*создание функции воспроизведения */
function playAudio() {
    if (!isPlay) {
        isPlay = true;
        play.classList.add('pause');
        audio.play();
    } else {
        play.classList.remove('pause');
        audio.pause();
        isPlay = false;
    }
    stylePlayList();
}

play.addEventListener('click', function () {
  if (!isPlay) {
      playAudio();
  } else {
      playAudio();
  }
});

function playNext() {
    if (playNum <= 2) {
        playNum = playNum + 1;
    } else if (playNum == 3) {
        playNum = 0;
    }
    isPlay = false;
    audio.src = playList[playNum].src;
    playAudio();
}

function playPrev() {
    if (playNum >= 1) {
        playNum = playNum - 1;
    } else if (playNum == 0) {
        playNum = 3;
    }
    isPlay = false;
    audio.src = playList[playNum].src;
    playAudio();
}

playNextAudio.addEventListener('click', playNext);
playPrevAudio.addEventListener('click', playPrev);
audio.addEventListener('ended', playNext);

function stylePlayList() {
  for (let i = 1; i < playList.length + 1; i++) {
      const playItem = document.querySelector(`li:nth-child(${i})`);
      playItem.classList.remove('item-active');
  }
  const playItemActive = document.querySelector(`li:nth-child(${playNum + 1})`);
  playItemActive.classList.add('item-active');
}
