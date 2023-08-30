"use strict";

// ELEMENTS SELECTION
/////////////////////////////////////////////////////////////
// GENERAL
const searchForm = document.querySelector(".search-form");
const enterSearch = document.querySelector(".input-search-icon");
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

// LOCATION

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

const render = function (data) {
  const { temp, feels_like } = data.main;
  const [{ description: desc, icon }] = data.weather;
  const { country: countryCode } = data.sys;

  place.textContent = data.name;
  country.textContent = countryCode;
  const html = `
      <img src="http://openweathermap.org/img/wn/${icon}.png
      " alt="weather icon" class="cur-image" />
      <p class="cur-weather">${
        temp > 100 ? Math.trunc(temp - 273) : Math.trunc(temp)
      }°C</p>
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

    newHtml += `
        <div class="future">
        <p class="day">${time}</p>
        <img src="http://openweathermap.org/img/wn/${icon}.png
        " alt="weather icon" class="image" />
        <p class="data">${
          temp > 100 ? Math.trunc(temp - 273) : Math.trunc(temp)
        }°C</p>
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

// MAIN APP IMPLEMENTATION

// TIME AND DATE
dateNTime();
setInterval(dateNTime, 1000);

///////////////////////////////////////////////////////
// WEATHER DATA

const key = "29dbb8ece1d7df04ec2416e7dc4e2d61";

const cur = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lon } = pos.coords;

    const resWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
    );
    const dataWeather = await resWeather.json();

    const future = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
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

// SEARCH
enterSearch.addEventListener("click", function () {
  if (searchForm.value) {
    const searchContent = searchForm.value.toLowerCase().trim();

    const geoCoding = async function () {
      try {
        const location = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${searchContent}&units=metric&APPID=${key}`
        );

        const res = await location.json();
        console.log(res);

        const { lat, lon } = res.coord;
        const future = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
        );

        const dataFuture = await future.json();
        const list = dataFuture.list;

        renderFuture(list);
        render(res);

        searchForm.value = "";
      } catch (err) {
        locationErr.textContent = err.message;
        removeClass(locationErr, "hidden");
        setTimeout(() => {
          locationErr.style.top = "10%";
        }, 800);

        setTimeout(() => {
          locationErr.style.top = "-10%";
        }, 5000);

        setTimeout(() => {
          addClass(locationErr, "hidden");
        }, 5500);
      }
    };
    geoCoding();
  }
});
