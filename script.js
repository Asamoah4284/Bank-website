'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header')
const btnScrollTo = document.querySelector('.btn--scroll-to')
const nav = document.querySelector('.nav')
const section1 = document.querySelector('#section--1')
const tabs = document.querySelectorAll('.operations__tab')
const tabContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal)
)
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Button scrolling
btnScrollTo.addEventListener('click',function(e){
  // window.scroll({
  //   top: section1.offsetTop,
  //   behavior: "smooth"})
    // OR
    section1.scrollIntoView({behavior:"smooth"})
})

// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault()
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:"smooth"})
//   })
// })

// Add event listener to common parent element
// Determine what elemnet originated the event
document.querySelector('.nav__links').addEventListener('click', function(e){
  console.log(e.target);
  e.preventDefault()

  // Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior:"smooth"})
  }
})

// Tabbed component


tabContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab')

// Gaurd clause
  if(!clicked) return

  // Active Tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))
  clicked.classList.add('operations__tab--active')
 
  // Activate content Area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
})

// Manual fade animation
const handleMover = function(e,opacity){
  if(e.target.classList.contains('nav__link')){
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this
    })
    logo.style.opacity = opacity
  }
}
// Passing argument into handler
nav.addEventListener('mouseover',handleMover.bind(0.5))
nav.addEventListener('mouseout',handleMover.bind(1))

// Sticky Nav
// const initailCoords = section1.getBoundingClientRect()
// console.log(initailCoords);
// window.addEventListener('scroll',function(e){
// console.log(window.scrollY);

// if(window.scrollY > initailCoords.top){
//   nav.classList.add('sticky')
// }else{
//   nav.classList.remove('sticky')
// // Smooth scroll to top
// }
// })
// Sticky navigation:Intersection observer API

// const obsCallback = function(entries, observer){
// entries.forEach(entry => {
//   console.log(entry);
// })
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],

// }
// const obsever = new IntersectionObserver(obsCallback, obsOptions)
// obsever.observe(section1)
// observing the header
const navHeight = nav.getBoundingClientRect().height
console.log(navHeight);
const stickyNav = function(entries){
  const [entry] = entries
  if(!entry.isIntersecting)
  nav.classList.add('sticky')
else{
  nav.classList.remove('sticky')
}
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`
})
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section')
const revealSection = function(entries, observer){
const [entry] = entries
if(!entry.isIntersecting) return
entry.target.classList.remove('section--hidden')
observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(function(section){
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]')
const loading = function(entries,observer){
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // Replace the src with data-src
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img')

  })
  observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loading,{
  root:null,
  threshold: 0,
  rootMargin: '200px'
})
imgTargets.forEach(img => imgObserver.observe(img))

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// mobile-nav
const navi = document.querySelector('.menu')
navi.addEventListener('click', function(){
const head = document.querySelector('.header').classList.toggle('header-an')
})
// Dom traversing
// const h1 = document.querySelector('h1')

// Going downwards
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white'
// h1.lastElementChild.style.color = 'orangered'

// Going upwards
// console.log(h1.parentNode);
// h1.closest('.header').style.background = 'var(--color-primary);'

// creating and inserting element
// insertAdjacentHTML
// const message = document.createElement('div')
// message.classList.add('cookie-message')
// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it</button>'
// header.append(message)

// // Deleting a messgae
// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
//   message.remove()
// })

// Styles
// message.style.backgroundColor = '#37383d'

// document.documentElement.style.setProperty('--color-primary', 'orangered')

// // Attributes
// const logo = document.querySelector('.nav__logo')
// console.log(logo.alt);
// console.log(logo.src);

// impementing smooth scrolling


// event delegation
//  })
// h1.onmouseenter = function(e){
//   e.target.innerHTML='<span>Hello</span>'+ '<br/>'+ '<span>World!</span>';
//  }

// rgb(255,255,255)
// const randomInt = (min,max) => Math.floor(Math.random() * (max - min + 1) + min)

// const randomColor = () => `rgba(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)})`
// console.log(randomColor(0,255));

// document.querySelector('.nav__link').addEventListener('click',function(e){
// this.style.backgroundColor = randomColor()
// console.log('LINK',e.target);
// })
// document.querySelector('.nav__links').addEventListener('click',function(e){
// this.style.backgroundColor = randomColor()
// console.log('LINK',e.target);

// })
// document.querySelector('.nav').addEventListener('click',function(e){
// this.style.backgroundColor = randomColor()
// console.log('LINK',e.target);

// })
