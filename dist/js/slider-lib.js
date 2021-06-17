const settings = {
  sliderContainer: '.slider',
  controlsContainer: '.slider-controls',
  startingSlide: 0,
  styles: {
    width: 300,
    height: 300,
    marginRight: 20,
    padding: '',
  },
}
const settingsDefault = {
  sliderContainer: '',
  controlsContainer: '',
  startingSlide: 0,
  styles: {
    width: 300,
    height: 300,
    marginRight: 0,
    padding: 0,
  },
}
document.addEventListener('DOMContentLoaded', () => {
  function setStylesToSlides(sliderContainer, styles) {
    const slides = getSlides(sliderContainer)
    Object.keys(styles).forEach((style) => {
      slides.forEach((slide, index) => {
        slide.dataset.index = index + 1
        slide.style[style] = styles[style]
      })
    })
  }
  function getSlides(sliderContainer) {
    return Array.from(sliderContainer.children)
  }

  function getNumberOfSlides(sliderContainer) {
    return getSlides(sliderContainer).length
  }

  function initSliderButtons(sliderContainer, buttons, styles) {
    buttons.forEach((btn, index) => {
      if (index < 1) {
        btn.dataset.direction = 'prev'
      } else {
        btn.dataset.direction = 'next'
      }
    })
    addListener(buttons, 'click', (e) => {
      moveSlide(sliderContainer, e.currentTarget.dataset.direction, styles)
    })
  }
  function getSliderWhitespace(sliderContainer, styles) {
    return (
      sliderContainer.offsetWidth -
      (styles.width + styles.marginRight) * getNumberOfSlides(sliderContainer)
    )
  }

  function addListener(elements, listener, cb) {
    if (typeof elements != 'object' && !Array.isArray(elements)) {
      throw new Error(
        'you cannot use ' + ` ${typeof elements}` + ' with addListener'
      )
    }
    if (Array.isArray(elements)) {
      elements.forEach((element) => {
        element.addEventListener(listener, cb)
      })
    } else {
      elements.addEventListener(listener, cb)
    }
  }
  function getSliderPosition(element) {
    return parseInt(window.getComputedStyle(element).transform.split([','])[4])
  }
  function moveSlide(sliderContainer, direction, styles) {
    const slidesCount = getNumberOfSlides(sliderContainer)
    const currentSlide = parseInt(sliderContainer.dataset.currentSlide)
    console.log(currentSlide)
    console.log(slidesCount)

    if (direction === 'prev') {
      if (+sliderContainer.dataset.currentSlide + 1 > slidesCount) {
        return
      }
      sliderContainer.dataset.currentSlide =
        +sliderContainer.dataset.currentSlide + 1
      sliderContainer.style.transform = `translate3d(${
        getSliderPosition(sliderContainer) - styles.width - styles.marginRight
      }px, 0px, 0px)`
    }
    if (direction === 'next') {
      if (+sliderContainer.dataset.currentSlide - 1 < 1) {
        return
      }
      sliderContainer.dataset.currentSlide -= 1
      sliderContainer.style.transform = `translate3d(${
        getSliderPosition(sliderContainer) + styles.width + styles.marginRight
      }px, 0px, 0px)`
    }
  }

  function calcSliderWidth(sliderContainer, options) {
    const { slideWidth, slideMargin } = options
    const slidesAmount = getSlides(sliderContainer).length
    return slideWidth * slidesAmount + slideMargin * slidesAmount
  }

  function initSlider(settings) {
    const sliderContainer = document.querySelector(settings.sliderContainer)
    sliderContainer.dataset.currentSlide = settings.startingSlide + 1
    const controlsContainer = document.querySelector(settings.controlsContainer)
    sliderContainer.classList.add('my-slider')
    setStylesToSlides(sliderContainer, settings.styles)

    initSliderButtons(
      sliderContainer,
      Array.from(controlsContainer.children),
      settings.styles
    )
  }
  initSlider(settings)
})
