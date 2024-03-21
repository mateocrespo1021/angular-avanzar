// Obtener referencias a los elementos del carrusel y botones de control
const carousel = document.querySelector('[data-carousel="static"]');
const carouselItems = carousel.querySelectorAll('[data-carousel-item]');
const prevButton = carousel.querySelector('[data-carousel-prev]');
const nextButton = carousel.querySelector('[data-carousel-next]');

// Índice del elemento actual en el carrusel
let currentIndex = 0;

// Función para mostrar el elemento actual y ocultar los demás
function showCurrentSlide() {
  carouselItems.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add('opacity-100', 'scale-100');
      item.classList.remove('opacity-0', 'scale-95');
    } else {
      item.classList.add('opacity-0', 'scale-95');
      item.classList.remove('opacity-100', 'scale-100');
    }
  });
}

// Función para avanzar al siguiente elemento
function goToNextSlide() {
  currentIndex = (currentIndex + 1) % carouselItems.length;
  showCurrentSlide();
}

// Función para retroceder al elemento anterior
function goToPreviousSlide() {
  currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
  showCurrentSlide();
}

// Asignar eventos de clic a los botones de control
prevButton.addEventListener('click', goToPreviousSlide);
nextButton.addEventListener('click', goToNextSlide);

// Mostrar el primer elemento al cargar la página
showCurrentSlide();

