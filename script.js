"use strict";

// ELEMENTS SELECTION
/////////////////////////////////////////////////////////////
// GENERAL
const body = document.querySelector("body");
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
const uiModal = document.querySelector(".ui");
const uiDesign = document.querySelector(".design");
const backdrop = document.querySelector(".backdrop");

// NULLIFYING EVERYTHING
place.textContent = "--";
country.textContent = "--";
curUnit.textContent = "---";

// CREATED VAR
const backgrounds = [
  "linear-gradient(50deg,hsla(205, 46%, 10%, 1) 0%,hsla(191, 28%, 23%, 1) 50%,hsla(207, 41%, 27%, 1) 100%)",
  "linear-gradient(50deg, hsla(347, 89%, 61%, 1) 0%, hsla(242, 42%, 40%, 1) 100%)",
  "linear-gradient(50deg, hsla(155, 23%, 71%, 1) 0%, hsla(302, 17%, 32%, 1) 100%)",
  "linear-gradient(50deg, hsla(10, 82%, 65%, 1) 0%, hsla(290, 79%, 13%, 1) 100%)",
  "linear-gradient(50deg,hsla(159, 35%, 45%, 1) 0%, hsla(176, 68%, 12%, 1) 100%)",
];

const classes = ["one", "two", "three", "four", "five"];
const key = "29dbb8ece1d7df04ec2416e7dc4e2d61";

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

const dateNTime = function (data) {
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
  ).format(data);

  deskTime.textContent = new Intl.DateTimeFormat(
    navigator.locale,
    timeOptions
  ).format(data);

  mobileTime.textContent = new Intl.DateTimeFormat(
    navigator.locale,
    timeOptions
  ).format(data);
};

// LOCATION
const showError = function () {
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
};
const locErr = function (err) {
  locationErr.textContent = "Something went wrong! Try again";
  removeClass(locationErr, "hidden");
  place.textContent = "--";
  country.textContent = "--";
  showError();
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
    const days = new Intl.DateTimeFormat(navigator.locale, {
      weekday: "long",
    }).format(dt);
    const { temp } = data.main;
    const [{ description: desc, icon }] = data.weather;

    newHtml += `
        <div class="future">
        <p class="weekday">${days}</p>
        <p class="day">${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png
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

// UI OPTION
const uiOptions = function () {
  let html = "";

  for (let i = 0; i < backgrounds.length; i++) {
    html += `<div class="ui-design ${classes[i]}" data-background="${backgrounds[i]}"></div>`;
  }

  uiDesign.insertAdjacentHTML("afterbegin", html);
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
dateNTime(new Date());

///////////////////////////////////////////////////////
// WEATHER DATA

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

        const { lat, lon } = res.coord;
        const future = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
        );

        const dataFuture = await future.json();
        const list = dataFuture.list;

        renderFuture(list);
        render(res);

        const reverse = await fetch(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=589OEVBSJXAP&format=json&by=position&lat=${lat}&lng=${lon}`
        );

        const revData = await reverse.json();
        const time = revData.formatted;
        dateNTime(new Date(time));

        searchForm.value = "";
      } catch (err) {
        locationErr.textContent = "Something went wrong! Location not found";
        console.error(err);
        showError();
      }
    };
    geoCoding();
  }
});

// UI DESIGNS

uiOptions();

uiDesign.addEventListener("click", function (e) {
  const id = e.target.closest(".ui-design");
  if (id) {
    body.style.background = `${id.dataset.background}`;
  }
});
