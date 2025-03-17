// Код для слайдшоу (index.html)
const totalSlides = 10;
let currentSlide = 1;
let slideInterval;
const imageCache = {}; // Кэш для изображений

// Элементы для слайдшоу
const backgroundImage = document.getElementById("backgroundImage");
const mainImage = document.getElementById("mainImage");
const dots = document.querySelectorAll(".dot");
const prevSlideButton = document.getElementById("prevSlide");
const nextSlideButton = document.getElementById("nextSlide");

function changeSlide(slideNumber) {
  currentSlide = ((slideNumber - 1 + totalSlides) % totalSlides) + 1;

  // Используем кэш, чтобы избежать повторной загрузки изображений
  const backgroundImgSrc = `index/${currentSlide}-${getSlideName(
    currentSlide
  )}-background.png`;
  const mainImgSrc = `index/${currentSlide}-${getSlideName(currentSlide)}.png`;

  // Если изображения уже есть в кэше, используем их сразу
  if (imageCache[backgroundImgSrc] && imageCache[mainImgSrc]) {
    updateImages(imageCache[backgroundImgSrc], imageCache[mainImgSrc]);
  } else {
    const newBackgroundImage = new Image();
    const newMainImage = new Image();

    newBackgroundImage.src = backgroundImgSrc;
    newMainImage.src = mainImgSrc;

    // Ждем загрузки нового фонового изображения
    newBackgroundImage.onload = () => {
      imageCache[backgroundImgSrc] = newBackgroundImage.src; // Кэширование
      updateImages(newBackgroundImage.src, newMainImage.src);
    };
    // Ждем загрузки нового основного изображения
    newMainImage.onload = () => {
      imageCache[mainImgSrc] = newMainImage.src; // Кэширование
    };
  }

  updateDots();
}

// Функция плавного обновления изображений
function updateImages(newBackgroundSrc, newMainSrc) {
  // Убираем классы fade-in и fade-out с текущих изображений
  backgroundImage.classList.remove("fade-in", "fade-out");
  mainImage.classList.remove("fade-in", "fade-out");

  // Добавляем fade-out к текущим изображениям
  backgroundImage.classList.add("fade-out");
  mainImage.classList.add("fade-out");

  // Через 1000 мс изменяем изображения и добавляем fade-in
  setTimeout(() => {
    // Устанавливаем новый src для изображений
    backgroundImage.src = newBackgroundSrc;
    mainImage.src = newMainSrc;

    // Убираем fade-out и добавляем fade-in для плавного появления новых изображений
    backgroundImage.classList.remove("fade-out");
    backgroundImage.classList.add("fade-in");

    mainImage.classList.remove("fade-out");
    mainImage.classList.add("fade-in");
  }, 1000); // Время смены изображения должно совпадать с CSS переходом
}

// Функция для получения имени файла на основе номера слайда
function getSlideName(slideNumber) {
  const slideNames = [
    "sleigh",
    "faucet",
    "radio",
    "toaster",
    "vapeinflave",
    "prosthesis",
    "hikingpoles",
    "tub",
    "camera50",
    "gaportable",
  ];
  return slideNames[slideNumber - 1];
}

// Функция обновления индикаторов
function updateDots() {
  dots.forEach((dot, index) => {
    if (index === currentSlide - 1) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Автоматическая смена слайдов
function startSlideShow() {
  slideInterval = setInterval(() => {
    changeSlide(currentSlide + 1);
  }, 5000); // Интервал смены слайда 5 секунд
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

// Обработчики событий для слайдшоу
if (prevSlideButton && nextSlideButton && dots.length > 0) {
  prevSlideButton.addEventListener("click", () => {
    stopSlideShow();
    changeSlide(currentSlide - 1);
    startSlideShow();
  });

  nextSlideButton.addEventListener("click", () => {
    stopSlideShow();
    changeSlide(currentSlide + 1);
    startSlideShow();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopSlideShow();
      changeSlide(index + 1);
      startSlideShow();
    });
  });

  // Перезапуск слайдшоу при нажатии на лого
  const logo = document.querySelector(".logo img");
  if (logo) {
    logo.addEventListener("click", () => {
      stopSlideShow();
      changeSlide(1);
      startSlideShow();
    });
  }

  // Старт слайдшоу при загрузке страницы
  startSlideShow();

  // Обработчик событий для клавиатуры
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      stopSlideShow();
      changeSlide(currentSlide - 1);
      startSlideShow();
    } else if (event.key === "ArrowRight") {
      stopSlideShow();
      changeSlide(currentSlide + 1);
      startSlideShow();
    }
  });
}

// Загрузка данных из work.json
fetch("work/work.json")
  .then((response) => response.json())
  .then((data) => {
    const gridContainer = document.querySelector(".grid-container");

    // Создаем плитки на основе данных
    data.forEach((project) => {
      const gridItem = document.createElement("a");
      gridItem.classList.add("grid-item");
      gridItem.href = `/work/${project.url}/${project.url}.html`;

      // Изображение project-X-cut
      const imgCut = document.createElement("img");
      imgCut.src = `work/tiles/${project.imageCut}`;
      imgCut.alt = project.title;
      imgCut.classList.add("cut");

      // Изображение project-X
      const imgFull = document.createElement("img");
      imgFull.src = `work/tiles/${project.image}`;
      imgFull.alt = project.title;
      imgFull.classList.add("full");

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");

      const title = document.createElement("h2");
      title.textContent = project.title;

      const subtitle = document.createElement("p");
      subtitle.textContent = project.subtitle;

      overlay.appendChild(title);
      overlay.appendChild(subtitle);

      gridItem.appendChild(imgCut);
      gridItem.appendChild(imgFull);
      gridItem.appendChild(overlay);

      gridContainer.appendChild(gridItem);
    });
  })
  .catch((error) => console.error("Ошибка загрузки данных:", error));

// Полоска прокрутки
const scrollIndicator = document.createElement("div");
scrollIndicator.classList.add("scroll-indicator");
document.body.appendChild(scrollIndicator);

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollY / height) * 100;
  scrollIndicator.style.width = `${scrollPercent}%`;
});

// Код для стрелки "наверх" (work.html)
const scrollToTopButton = document.getElementById("scrollToTop");

if (scrollToTopButton) {
  // Показываем/скрываем стрелку при прокрутке
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollToTopButton.classList.remove("hidden");
    } else {
      scrollToTopButton.classList.add("hidden");
    }
  });

  // Прокрутка вверх при клике
  scrollToTopButton.addEventListener("click", () => {
    scrollToTopButton.classList.add("hidden"); // Плавное исчезновение
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
} else {
  console.error("Элемент scrollToTop не найден!");
}

// Обработчик для правой кнопки мыши
document.addEventListener("contextmenu", function (e) {
  // Блокируем контекстное меню только для изображений
  if (e.target.tagName === "IMG") {
    e.preventDefault(); // Блокируем стандартное поведение (сохранение)
  }
});

// Блокировка контекстного меню для всех изображений на страницах проектов
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault(); // Блокируем стандартное поведение (сохранение)
    return false; // Дополнительная блокировка для старых браузеров
  }
});

// Блокировка перетаскивания изображений
document.querySelectorAll("img").forEach((img) => {
  img.setAttribute("draggable", "false");
  img.addEventListener("dragstart", function (e) {
    e.preventDefault(); // Блокируем перетаскивание
  });
});

// Блокировка выделения текста и изображений
document.addEventListener("selectstart", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault(); // Блокируем выделение
  }
});

// === Убираем "висячие" предлоги и артикли ===
// Функция для обработки "висячих" слов
function fixHangingWords() {
  const shortWords = [
    "a",
    "an",
    "the",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "and",
    "or",
    "but",
  ];
  const elements = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, li, td, th, div.text-block"
  );

  elements.forEach((element) => {
    let text = element.innerHTML;

    // Обрабатываем каждое короткое слово
    shortWords.forEach((word) => {
      // Регулярное выражение для поиска слов с пробелами вокруг или в конце строки
      const regex = new RegExp(
        `(\\s${word}\\s)|(\\s${word}[\\.,!?]?\\s)|(\\s${word}[\\.,!?]?$)`,
        "gi"
      );
      text = text.replace(regex, (match) => {
        // Заменяем пробелы на неразрывные пробелы
        return match.replace(/\s/g, "&nbsp;");
      });
    });

    // Обновляем HTML элемента
    element.innerHTML = text;
  });
}

// Вызов функции после загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  fixHangingWords();
});

// Вызов функции после динамической загрузки контента (например, через fetch)
function onContentLoaded() {
  fixHangingWords();
}

// Пример использования после загрузки данных через fetch
fetch("about/about.json")
  .then((response) => response.json())
  .then((data) => {
    // Загрузка и вставка контента
    const contentContainer = document.getElementById("projectContent");
    // ... (код для вставки контента)

    // Вызов функции после загрузки контента
    onContentLoaded();
  })
  .catch((error) => console.error("Ошибка загрузки данных:", error));

fetch("snow-sleigh/snow-sleigh.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка загрузки данных: " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    const contentContainer = document.getElementById("projectContent");

    // Добавляем заголовок
    const title = document.createElement("h1");
    title.textContent = data.title;
    contentContainer.appendChild(title);

    // Добавляем подзаголовок
    const subtitle = document.createElement("p");
    subtitle.textContent = data.subtitle;
    subtitle.classList.add("project-subtitle");
    contentContainer.appendChild(subtitle);

    // Добавляем контент (изображения, текст и видео)
    data.content.forEach((item) => {
      if (item.type === "text") {
        const textBlock = document.createElement("div");
        textBlock.classList.add("text-block");
        textBlock.innerHTML = item.value;
        contentContainer.appendChild(textBlock);
      } else if (item.type === "image") {
        const imageBlock = document.createElement("div");
        imageBlock.classList.add("image-block");
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = data.title;
        imageBlock.appendChild(img);
        contentContainer.appendChild(imageBlock);
      } else if (item.type === "video") {
        const videoBlock = document.createElement("div");
        videoBlock.classList.add("video-block");
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true; // Включить кнопки управления
        if (item.poster) {
          video.poster = item.poster; // Постер для видео
        }
        videoBlock.appendChild(video);
        contentContainer.appendChild(videoBlock);
      }
    });
  })
  .catch((error) => console.error("Ошибка загрузки данных:", error));

document.addEventListener("contextmenu", function (e) {
  if (
    e.target.tagName === "IMG" &&
    !e.target.classList.contains("allow-right-click")
  ) {
    e.preventDefault(); // Блокируем контекстное меню только для изображений без класса allow-right-click
  }
});

document.addEventListener("click", function (e) {
  if (
    e.target.tagName === "IMG" &&
    !e.target.closest(".header") && // Исключаем изображения внутри хедера
    !e.target.closest(".footer") && // Исключаем изображения внутри футера
    !e.target.classList.contains("arrow-left") && // Исключаем стрелку влево
    !e.target.classList.contains("arrow-right") && // Исключаем стрелку вправо
    !e.target.classList.contains("arrow-up") && // Исключаем стрелку вверх
    !e.target.closest(".background") && // Исключаем изображения на главной странице (фоновые)
    !e.target.closest(".pic") // Исключаем изображения на главной странице (основные)
  ) {
    const img = e.target;
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = "10000";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.cursor = "zoom-out";

    const fullSizeImg = document.createElement("img");
    fullSizeImg.src = img.src;
    fullSizeImg.style.maxWidth = "90%";
    fullSizeImg.style.maxHeight = "90%";
    fullSizeImg.style.objectFit = "contain";
    fullSizeImg.classList.add("allow-right-click"); // Разрешаем правый клик на увеличенном изображении

    overlay.appendChild(fullSizeImg);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function () {
      document.body.removeChild(overlay);
    });
  }
});
