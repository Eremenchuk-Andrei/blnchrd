document.addEventListener("DOMContentLoaded", function () {
   //drodown menu
   
  document.querySelectorAll(".block-header__btn-dropdown").forEach((item) => {
    item.addEventListener("click", function () {
      let btn = this;
      let dropdown = this.parentElement.querySelector(".block-header__dropdown-child");
      document.querySelectorAll(".block-header__btn-dropdown").forEach((el) => {
        if (el != btn) {
          el.classList.remove("arrow_active");
        }
      });

      document.querySelectorAll(".block-header__dropdown-child").forEach((el) => {
        if (el != dropdown) {
          el.classList.remove("dropdown_child_active");
        }
      });
      dropdown.classList.toggle("dropdown_child_active");
      btn.classList.toggle("arrow_active");
    });
  });

  document.addEventListener("click", function (e) {
    let target = e.target;
    if (!target.closest(".block-header__navigation-second-dropdown-list")) {
      document.querySelectorAll(".block-header__dropdown-child").forEach((el) => {
        el.classList.remove("dropdown_child_active");
      });
      document.querySelectorAll(".block-header__btn-dropdown").forEach((el) => {
        el.classList.remove("arrow_active");
      });
    }
  });

  document.querySelectorAll(".block-header__list-child").forEach((el) => {
    new SimpleBar(el, {
      autoHide: false,
      scrollbarMaxSize: 25,
    });
  });

  //sliders

  let slider = document.querySelector(".block-header__slider-hero");
  let mySwiper = new Swiper(slider, {
    //Optional parameters
    slidesPerView: 1,
    speed: 2000,
    autoplay: {
      delay: 2000,
    },

    effect: "fade",
    allowTouchMove: false,
  });

  // slider gallery 2 rows
  let slidergal = document.querySelector(".section-editions__slider-container");
  let swiper = new Swiper(slidergal, {
    a11y: {
      prevSlideMessage: "Предыдущий слайд",
      nextSlideMessage: "Следующий слайд",
    },
    slidesPerView: 3,
    spaceBetween: 50,
    formatFractionCurrent: 6,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },

    grid: {
      rows: 2,
    },

    navigation: {
      nextEl: ".section-editions__btn-slider-next",
      prevEl: ".section-editions__btn-slider-prev",
    },

    breakpoints: {
      320: {
        slidesPerView: 1,
        grid: {
          rows: 1,
        },
        spaceBetween: 0,
      },
      596: {
        slidesPerView: 2,
        grid: {
          rows: 2,
        },
        spaceBetween: 30,
      },
      1224: {
        slidesPerView: 3,
        grid: {
          rows: 2,
        },
        spaceBetween: 50,
      },
    },
  });

  ///modal window

  class Modal {
    constructor(options) {
      let defaultOptions = {
        isOpen: () => {},
        isClose: () => {},
      };
      this.options = Object.assign(defaultOptions, options);
      this.modal = document.querySelector(".modal");
      this.speed = 300;
      this.animation = false;
      this.isOpen = false;
      this.modalContainer = false;
      this.previousActiveElement = false;
      this.fixBlocks = document.querySelectorAll("fix_block");
      this.focusElements = ["a[href]", "input", "button", "select", "textarea", "[tabindex]"];
      this.events();
    }
    events() {
      if (this.modal) {
         document.addEventListener("click", function (e) {
            const clickedElement = e.target.closest(".section-editions__modal-open");
            if (clickedElement) {
              let target = clickedElement.dataset.path;
              let animation = clickedElement.dataset.animation;
              let speed = clickedElement.dataset.speed;
              this.animation = animation ? animation : "fade";
              this.speed = speed ? parseInt(speed) : 300;
              this.modalContainer = document.querySelector(`[data-target="${target}"]`);
              this.open();
              return;
            }

            if (e.target.closest(".modal-close")) {
              this.close();
              return;
            }
          }.bind(this)
        );

        window.addEventListener(
          "keydown",
          function (e) {
            if (e.keyCode == 27) {
              if (this.isOpen) {
                this.close();
              }
            }

            if (e.keyCode == 9 && this.isOpen) {
              this.focusCatch(e);
              return;
            }
          }.bind(this)
        );

        this.modal.addEventListener("click", function (e) {
            if (!e.target.classList.contains("modal__container") && !e.target.closest(".modal__container") && this.isOpen)
              if (this.isOpen) {
                this.close();
              }
          }.bind(this)
        );
      }
    }
    
    open() {
      this.previousActiveElement = document.activeElement;
      this.modal.style.setProperty("--transition-time", `${this.speed / 1000}s`);
      this.modal.classList.add("is-open");
      this.disableScroll();

      this.modalContainer.classList.add("modal-open");
      this.modalContainer.classList.add(this.animation);

      setTimeout(() => {
        this.modalContainer.classList.add("animate-open");
        this.options.isOpen(this);
        this.isOpen = true;
        this.focusTrap();
      }, this.speed);
    }

    close() {
      if (this.modalContainer) {
        this.modalContainer.classList.remove("animate-open");
        this.modalContainer.classList.remove(this.animation);
        this.modal.classList.remove("is-open");
        this.modalContainer.classList.remove("modal-open");

        this.enableScroll();
        this.options.isClose(this);
        this.isOpen = false;
        this.focusTrap();
      }
    }

    focusCatch(e) {
      const focusable = this.modalContainer.querySelectorAll(this.focusElements);
      const focusArray = Array.prototype.slice.call(focusable);
      const focusedIndex = focusArray.indexOf(document.activeElement);

      if (e.shiftKey && focusedIndex === 0) {
        focusArray[focusArray.length - 1].focus();
        e.preventDefault();
      }

      if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
        focusArray[0].focus();
        e.preventDefault();
      }
    }

    focusTrap() {
      const focusable = this.modalContainer.querySelectorAll(this.focusElements);
      if (this.isOpen) {
        if (focusable) focusable[0].focus();
      } else {
        this.previousActiveElement.focus();
      }
    }

    disableScroll() {
      let pagePosition = window.scrollY;
      this.lockPadding();
      document.body.classList.add("disable-scroll");
      document.body.dataset.position = pagePosition;
      document.body.style.top = -pagePosition + "px";
    }

    enableScroll() {
      let pagePosition = parseInt(document.body.dataset.position, 10);
      this.unLockPadding();
      document.body.style.top = "auto";
      document.body.classList.remove("disable-scroll");
      window.scroll({ top: pagePosition, left: 0 });
      document.body.removeAttribute("data-position");
    }

    lockPadding() {
      let paddingOffset = window.innerWidth - document.body.offsetWidth + "px";
      this.fixBlocks.forEach((el) => {
        el.style.paddingRight = paddingOffset;
      });
      document.body.style.paddingRight = paddingOffset;
    }

    unLockPadding() {
      this.fixBlocks.forEach((el) => {
        el.style.paddingRight = "0px";
      });
      document.body.style.paddingRight = "0px";
    }
  }

  const modal = new Modal({
    isOpen: () => {},

    isClose: () => {},
  });

  ///// slider book destroy mobile

  let editionsAuthor = document.querySelector(".section-publ__slider");
  let destroySlider;

  function offSlider() {
    if (window.innerWidth >= 596 && editionsAuthor.dataset.mobile == "false") {
      destroySlider = new Swiper(editionsAuthor, {
        a11y: {
          prevSlideMessage: "Предыдущий слайд",
          nextSlideMessage: "Следующий слайд",
        },
        slidesPerView: 3,
        spaceBetween: 50,
        navigation: {
          nextEl: ".section-publ__btn-next",
          prevEl: ".section-publ__btn-prev",
        },
        pagination: {
          el: ".editions-author-swiper-pagination",
          type: "fraction",
        },
        formatFractionCurrent: 3,
        breakpoints: {
          596: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1224: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        },
      });

      editionsAuthor.dataset.mobile = "true";
    }
    if (window.innerWidth < 596 && editionsAuthor.dataset.mobile == "true") {
      editionsAuthor.dataset.mobile = "false";
      if (editionsAuthor.classList.contains("swiper-initialized")) {
        destroySlider.destroy();
      }
    }
  }
  offSlider();
  window.addEventListener("resize", () => {
    offSlider();
  });

  let sliderProject = document.querySelector(".section-project__swiper");
  swiperProject = new Swiper(sliderProject, {
    slidesPerView: 3,
    spaceBetween: 50,
    formatFractionCurrent: 1,
    navigation: {
      nextEl: ".section-project__btn-slider-next",
      prevEl: ".section-project__btn-slider-prev",
    },

    a11y: {
      prevSlideMessage: "Предыдущий слайд",
      nextSlideMessage: "Следующий слайд",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 50,
      },
      // when window width is >= 480px
      768: {
        slidesPerView: 2,
        spaceBetween: 50,
      },
      // when window width is >= 640px
      1224: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  });

  //burger
  document.querySelector(".block-header__menu-burger").addEventListener("click", function () {
    document.querySelector(".block-header__navigation-logo").classList.toggle("is_active");
    document.querySelector(".block-header__menu-burger").classList.toggle("burger_active");
    document.querySelector(".block-header__link-login").classList.toggle("nav_enter_active");
    document.querySelector(".block-header__link-login").classList.toggle("focus-visible");
  });
  // form

  document.querySelector(".block-header__btn-search-nav").addEventListener("click", function () {
    document.querySelector(".form-search-first-nav").classList.add("form_active");
    document.querySelector(".form-search-first-nav").classList.add("form-search-first-nav-width");
    document.querySelector(".block-header__input-search").classList.add("input_search_width");
    this.classList.add("active");
    document.querySelector(".link-logo").classList.add("logo_none");
    document.querySelector(".block-header__menu-burger").classList.add("burger_off");
    document.querySelector(".block-header__btn-form-close-hidden").classList.add("btn_close_form_visible");
    document.querySelector(".block-header__wrap-form").classList.add("adaptive-form-wrap-width");

    document.querySelector(".btn_close_form_visible").addEventListener("click", function () {
      document.querySelector(".form-search-first-nav").classList.remove("form_active");
      document.querySelector(".block-header__btn-form-close-hidden").classList.remove("btn_close_form_visible");
      document.querySelector(".link-logo").classList.remove("logo_none");
      document.querySelector(".block-header__menu-burger").classList.remove("burger_off");
      document.querySelector(".block-header__wrap-form").classList.remove("adaptive-form-wrap-width");
      document.querySelector(".block-header__btn-search-nav").classList.remove("active");
    });
  });

  document.addEventListener("click", function (e) {
    let target = e.target;
    let form = document.querySelector(".form-search-first-nav");
    if (!target.closest(".block-header__wrap-form")) {
      form.classList.remove("form_active");
      form.querySelector(".first-nav-input").value = "";
      document.querySelector(".block-header__btn-search-nav").classList.remove("active");
      document.querySelector(".link-logo").classList.remove("logo_none");
      document.querySelector(".block-header__menu-burger").classList.remove("burger_off");
      document.querySelector(".block-header__btn-form-close-hidden").classList.remove("btn_close_form_visible");
      document.querySelector(".block-header__wrap-form").classList.remove("adaptive-form-wrap-width");
      document.querySelector(".form-search-first-nav").classList.remove("form-search-first-nav-width");
    }
  });

  //select
  const choices = new Choices("#filter", {
    itemSelectText: "",
    searchEnabled: false,
  });

  // catalog
  document.querySelectorAll(".catalog-btn").forEach((item) => {
    item.addEventListener("click", function (e) {
      let path = e.currentTarget.dataset.path;
      document.querySelectorAll(".section-catalog__tabs-accordion").forEach((el) => {
        el.classList.remove("catalog-tabs-accordion-active");
      });
      document.querySelectorAll(".catalog-btn").forEach((el) => {
        el.classList.remove("btn-catalog-active");
      });
      document.querySelector(`[data-target='${path}']`).classList.add("catalog-tabs-accordion-active");
      this.classList.add("btn-catalog-active");
    });
  });

  //accordion tab
  document.querySelectorAll(".section-catalog__tabs-accordion").forEach((item) => {
    let tabbtns = item.querySelectorAll(".section-catalog__tab-link-info");
    let articles = item.querySelectorAll(".section-catalog__tabs-left");
    tabbtns.forEach((el) => {
      el.addEventListener("click", function (e) {
        let path = e.currentTarget.dataset.path;
        let tabSection = item.querySelector(`[data-target='${path}']`);
        tabbtns.forEach((el) => {
          el.classList.remove("active__painter");
        });
        this.classList.add("active__painter");
        articles.forEach((el) => {
          el.classList.remove("catalog-active");
        });
        tabSection.classList.add("catalog-active");
        
      });
    });
  });

  // smooth scroll

  document.querySelectorAll('.container a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // section developments

  let devBtn = document.querySelector(".cards__btn-open-cards");
  let devSwiper = document.querySelector(".cards__swiper-mobile");
  let cardsItem = document.querySelectorAll(".cards__item-slider");

  devBtn.addEventListener("click", function () {
    cardsItem.forEach((cards) => {
      cards.style.display = "flex";
    });

    this.style.display = "none";
  });

  let adaptiveSlider;

  function mSlider() {
    if (window.innerWidth <= 596 && devSwiper.dataset.mobile == "false") {
      adaptiveSlider = new Swiper(devSwiper, {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: {
          el: ".cards__swiper-pagination",
          clickable: true,
        },
      });
      devSwiper.dataset.mobile = "true";
    }

    if (window.innerWidth > 596 && devSwiper.dataset.mobile == "true") {
      devSwiper.dataset.mobile = "false";
      if (devSwiper.classList.contains("swiper-initialized")) {
        adaptiveSlider.destroy();
      }
    }
  }

  mSlider();

  window.addEventListener("resize", () => {
    mSlider();
  });

  
  
  //tooltip
  tippy(".section-project__tooltip", {
    content: "Пример современных тенденций - современная методология разработки",
    trigger: "click",
    animation: "scale",
  });
  tippy(".section-project__tooltip-t", {
    content: "Приятно, граждане, наблюдать, как сделанные на базе аналитики выводы вызывают у вас эмоции",
    trigger: "click",
    animation: "scale",
  });
  tippy(".section-project__tooltip-w", {
    content: "В стремлении повысить качество",
    trigger: "click",
    animation: "scale",
  });

  // checkbox dropdown list

  let clickHeader = ".section-publ__header-dropdown";
  let adaptiveLabel = ".section-publ__label-check";
  let checkboxList = ".section-publ__list-chekbox";
  let labelListActive = "label_list_active";
  let labelActive = "label_checkbox_active";
  let animationCheck = "animation_check";
  let originInput = ".section-publ__input-check-hidden";

  function checkboxToggle(
    clickHeader,
    adaptiveLabel,
    checkboxList,
    labelsListActive,
    labelActive,
    animationCheck,
    originInput
  ) {
    let button = document.querySelector(clickHeader);
    let labels = document.querySelectorAll(adaptiveLabel);
    let listLabels = document.querySelector(checkboxList);
    button.addEventListener("click", toggleSpoiler);
    button.addEventListener("keyup", function (e) {
      if (e.code === "Enter") {
        toggleSpoiler();
      }
    });

    function toggleSpoiler() {
      if (!listLabels.classList.contains(labelsListActive) && !button.classList.contains("active_head_arrow")) {
        button.classList.add("active_head_arrow");
        listLabels.classList.add(labelsListActive);
        labels.forEach((item) => {
          animationItem(item, labelActive, animationCheck, "add");
        });
      } else {
        button.classList.remove("active_head_arrow");
        listLabels.classList.remove(labelsListActive);
        labels.forEach((item) => {
          if (item.querySelector(originInput).checked) {
            animationItem(item, labelActive, animationCheck, "add");
          } else {
            animationItem(item, labelActive, animationCheck, "remove");
          }
        });
      }
      labels.forEach((item) => {
        item.addEventListener("click", function () {
          if (!listLabels.classList.contains(labelsListActive)) {
            animationItem(this, labelActive, animationCheck, "remove");
          }
        });
      });
    }
    function animationItem(item, clickHeader, adaptiveLabel, el) {
      if (el === "add") {
        item.classList.add(clickHeader);
        setTimeout(function () {
          item.classList.add(adaptiveLabel);
        }, 100);
      } else {
        item.classList.remove(adaptiveLabel);
        setTimeout(function () {
          item.classList.remove(clickHeader);
        }, 300);
      }
    }
  }
  checkboxToggle(clickHeader, adaptiveLabel, checkboxList, labelListActive, labelActive, animationCheck, originInput);
});

////// form
var selector = document.querySelector("input[type='tel']");
var im = new Inputmask("+7 (999)-999-99-99");
im.mask(selector);

let validateForms = function (selector, rules, successModal, yaGoal) {
  new window.JustValidate(selector, {
    rules: rules,
    submitHandler: function (form) {
      let formData = new FormData(form);

      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("Отправлено");
          }
        }
      };
      xhr.open("POST", "mail.php", true);
      xhr.send(formData);
      form.reset();
    },
    messages: {
      name: {
        required: "Заполните поле",
        minLength: "Недостаточно символов",
        maxLength: "Недопустимый формат",
      },
  
      tel: {
        function: "Ошибка",
        required: "Заполните поле",
      },
    },
  });
};
validateForms(".form", {
  name: {
    //rule: 'customRegexp',
    //value: /^[a-z]+$/,
    //errorMassage: 'Имя должно содержать буквы',
    required: true,
    minLength: 2,
    maxLength: 40,
  },
  tel: {
    required: true,
    function: () => {
      const phone = selector.inputmask.unmaskedvalue();
      return Number(phone) && phone.length === 10;
    },
  },
 
});

ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.758468, 37.601088],
            zoom: 16
        }),

        myPlacemark1 = new ymaps.Placemark([55.758468, 37.601088], {
            balloonContent: 'Маленькая иконка'
        }, {
            iconLayout: 'default#image',
            //iconImageClipRect: [[0,0], [26, 47]],
            iconImageHref: 'img/blanchard/markermap.svg',
            iconImageSize: [15, 15],
            //iconImageOffset: [-15, -27],
        })

    myMap.geoObjects.add(myPlacemark1)
       
}

//ymaps.ready(init);
//function init() {
 // var myMap = new ymaps.Map("map", {
 //   center: [55.758468, 37.601088],
 //   zoom: 16,
 // });
 // var myPlacemark = new ymaps.Placemark(
 //   [55.758468, 37.601088],
 //   {},
 //   {
 //     iconLayout: "default#image",
 //     iconImageHref: "img/blanchard/markermap.svg",
 //     iconImageSize: [20, 20],
 //   }
 // );
 // myMap.geoObjects.add(myPlacemark);
  
//}

$(function () {
  $(".section-catalog__list-accordion").accordion({
    heightStyle: "content",
  });
});

