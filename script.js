"use strict";

// ELEMENTS SELECTION
/////////////////////////////////////////////////////////////
// GENERAL
const searchForm = document.querySelector(".search-form");

// LOCATION
const locationErr = document.querySelector(".location-err");
const curLocation = document.querySelector(".location");

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
let curPosition;

// LOCATION
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude: lat, longitude: long } = position.coords;
    console.log(lat, long);
    curPosition = [lat, long];
  },
  (err) => {
    removeClass(locationErr, "hidden");
    curLocation.textContent = "----";

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
);
