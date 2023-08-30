"use strict";

// ELEMENTS SELECTION
/////////////////////////////////////////////////////////////
// GENERAL
const searchForm = document.querySelector(".search-form");
const futureFore = document.querySelector(".future-forecast");

// LOCATION
const locationErr = document.querySelector(".location-err");
const curLocation = document.querySelector(".location");
const place = document.querySelector(".place");
const country = document.querySelector(".country");
const curFore = document.querySelector(".cur-forecast");
const curUnit = document.querySelector(".cur-weather");

// TIME AND DATE
const deskTime = document.querySelector(".hour");
const mobileTime = document.querySelector(".hour-mobile");
const date = document.querySelector(".time");

// NAVIGATIONS
const navContainer = document.querySelector("aside");
const desktopMenuBar = document.querySelector(".desk-menu-bar");
const mobileMenuBar = document.querySelector(".menu-bar");
const navSearch = document.querySelector(".desk-search");
const contactNavIcon = document.querySelector(".desk-contact");
const settingsNav = document.querySelector(".desk-settings");

// MODALS AND BACKDROP
const allModal = document.querySelectorAll(".modal");
const menuModal = document.querySelector(".menu-modal");
const backdrop = document.querySelector(".backdrop");

// NULLIFYING EVERYTHING
place.textContent = "--";
country.textContent = "--";
curUnit.textContent = "---";

/////////////////////////////////////////////////////////
// FUNCTIONS
const addClass = function (el, className) {
  el.classList.add(className);
};

const removeClass = function (el, className) {
  el.classList.remove(className);
};

const removeModal = function () {
  allModal.forEach((el) => {
    addClass(el, "hidden");
  });

  addClass(backdrop, "hidden");
};

const navigation = function (e) {
  const id = e.target.closest(".desk-nav");

  if (id && !id.classList.contains("true")) {
    const page = document.querySelector(`.${id.dataset.modal}`);

    removeModal();

    removeClass(page, "hidden");
    removeClass(backdrop, "hidden");
  }
};

const dateNTime = function () {
  const now = new Date();
  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  date.textContent = new Intl.DateTimeFormat(
    navigator.locale,
    dateOptions
  ).format(now);

  deskTime.textContent = new Intl.DateTimeFormat(
    navigator.locale,
    timeOptions
  ).format(now);

  mobileTime.textContent = new Intl.DateTimeFormat(
    navigator.locale,
    timeOptions
  ).format(now);
};

////////////////////////////////////////////////////////////////
// NAVIGATION IMPLEMENTATION
navContainer.addEventListener("click", function (e) {
  navigation(e);
});

mobileMenuBar.addEventListener("click", function () {
  removeClass(menuModal, "hidden");
  removeClass(backdrop, "hidden");
});

navSearch.addEventListener("click", function () {
  searchForm.focus();
});

backdrop.addEventListener("click", removeModal);

menuModal.addEventListener("click", function (e) {
  const id = e.target.closest(".menu-items");

  if (id) {
    const page = document.querySelector(`.${id.dataset.modal}`);

    removeModal();

    removeClass(page, "hidden");
    removeClass(backdrop, "hidden");
  }
});

// TIME AND DATE
dateNTime();
setInterval(dateNTime, 1000);

// LOCATION

// let [lat, long] = curPosition;

// const getCurWeather = function () {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude: lat, longitude: lon } = position.coords;
//       console.log(lat, lon);
//       fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=29dbb8ece1d7df04ec2416e7dc4e2d61`
//       )
//         .then(
//           (response) => {
//             response.json();
//           },
//           (err) => console.error(err)
//         )
//         .then((data) => {
//           //   const a = data;
//           console.log(data);
//         });
//     },
//     (err) => {
//       removeClass(locationErr, "hidden");
//       curLocation.textContent = "----";

//       setTimeout(() => {
//         locationErr.style.top = "10%";
//       }, 800);

//       setTimeout(() => {
//         locationErr.style.top = "-10%";
//       }, 5000);

//       setTimeout(() => {
//         addClass(locationErr, "hidden");
//       }, 5500);
//     }
//   );
// };

const locErr = function (err) {
  locationErr.textContent = err.message;
  removeClass(locationErr, "hidden");
  place.textContent = "--";
  country.textContent = "--";
  setTimeout(() => {
    locationErr.style.top = "10%";
  }, 800);

  setTimeout(() => {
    locationErr.style.top = "-10%";
  }, 5000);

  setTimeout(() => {
    addClass(locationErr, "hidden");
  }, 5500);
};

// getCurWeather();

const render = function (data) {
  const { temp, feels_like } = data.main;
  const [{ description: desc, icon }] = data.weather;
  const { country: countryCode } = data.sys;

  place.textContent = data.name;
  country.textContent = countryCode;
  const html = `
    <img src="http://openweathermap.org/img/wn/${icon}.png
    " alt="weather icon" class="cur-image" />
    <p class="cur-weather">${Math.trunc(temp - 273)}℃</p>
    <p class="dec">${desc}</p>
    `;

  curFore.innerHTML = "";
  curFore.insertAdjacentHTML("beforeend", html);
};

const renderFuture = function (list) {
  let newHtml = "";
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  for (let i = 1; i <= 4; i++) {
    //   console.log(list[i]);
    const data = list[i];
    const dt = new Date(data.dt_txt);
    const time = new Intl.DateTimeFormat(navigator.locale, timeOptions).format(
      dt
    );
    const { temp } = data.main;
    const [{ description: desc, icon }] = data.weather;

    console.log(dt);

    newHtml += `
      <div class="future">
      <p class="day">${time}</p>
      <img src="http://openweathermap.org/img/wn/${icon}.png
      " alt="weather icon" class="image" />
      <p class="data">${Math.trunc(temp - 273)}℃</p>
      <p class="futDesc">${desc}</p>
    </div>
      `;
  }

  futureFore.textContent = "";
  futureFore.insertAdjacentHTML("beforeend", newHtml);
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const cur = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lon } = pos.coords;

    const resWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=29dbb8ece1d7df04ec2416e7dc4e2d61`
    );
    const dataWeather = await resWeather.json();

    const future = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=29dbb8ece1d7df04ec2416e7dc4e2d61`
    );
    const dataFuture = await future.json();
    const list = dataFuture.list;

    renderFuture(list);
    render(dataWeather);
  } catch (err) {
    console.error(err.message);
    locErr(err);
  }
};

cur();
