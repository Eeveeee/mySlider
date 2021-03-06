const settings = {
  sliderContainer: '.slider',
  controlsContainer: '.slider-controls',
  startingSlide: 0,
  autoWidth: true,
  slidesToShow: 2,
  styles: {
    width: 250,
    height: 200,
    marginRight: 50,
    transition: 0.2,
  },
}

const settingsDefault = {
  sliderContainer: '',
  controlsContainer: '',
  startingSlide: 0,
  autoWidth: false,
  slidesToShow: '',
  styles: {
    width: 300,
    height: 300,
    marginRight: 0,
    transition: 0.2,
  },
}

document.addEventListener('DOMContentLoaded', () => {
  if (!settings) {
    return
  }
  function setStylesToSlides(sliderContainer, styles) {
    const slides = getSlides(sliderContainer)

    Object.keys(styles).forEach((style) => {
      slides.forEach((slide, index) => {
        slide.dataset.index = index
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
      moveSlider(sliderContainer, e.currentTarget.dataset.direction, styles)
    })
  }
  function getSliderWhitespace(sliderContainer, styles) {
    return (
      sliderContainer.offsetWidth -
      (styles.width + styles.marginRight) * getNumberOfSlides(sliderContainer)
    )
  }
  function addListener(elements, listener, cb) {
    if (elements instanceof NodeList || Array.isArray(elements)) {
      elements.forEach((element) => {
        element.addEventListener(listener, cb)
      })
    } else if (elements instanceof HTMLElement) {
      elements.addEventListener(listener, cb)
    } else {
      throw new Error(`${elements} is not a NodeList or HTMLElement`)
    }
  }
  function getSliderPosition(sliderContainer, styles) {
    const currentSlide = sliderContainer.dataset.currentSlide
    return parseInt(styles.width * currentSlide)
  }

  function moveSliderPrev(options) {
    const {
      sliderContainer,
      sliderDataset,
      sliderPosition,
      currentSlide,
      styles,
    } = options
    sliderDataset.currentSlide = +sliderDataset.currentSlide + 1
    sliderContainer.style.transform = `translate3d(${
      sliderPosition +
      (styles.width - styles.marginRight * (Math.abs(currentSlide) - 1))
    }px, 0px, 0px)`
  }
  function moveSliderNext(options) {
    const {
      sliderContainer,
      sliderDataset,
      sliderPosition,
      currentSlide,
      styles,
    } = options
    sliderDataset.currentSlide = +sliderDataset.currentSlide - 1
    sliderContainer.style.transform = `translate3d(${
      sliderPosition -
      (styles.width + styles.marginRight * (Math.abs(currentSlide) + 1))
    }px, 0px, 0px)`
  }
  function moveSlider(sliderContainer, direction, styles) {
    const slidesCount = getNumberOfSlides(sliderContainer)
    const sliderDataset = sliderContainer.dataset
    const currentSlide = parseInt(sliderDataset.currentSlide)
    const sliderPosition = getSliderPosition(sliderContainer, styles)
    const slidingOptions = {
      sliderContainer,
      sliderDataset,
      sliderPosition,
      currentSlide,
      styles,
    }
    if (direction === 'prev') {
      if (+currentSlide + 1 > 0) {
        return
      }
      moveSliderPrev(slidingOptions)
    }
    if (direction === 'next') {
      if (Math.abs(currentSlide) + 1 > slidesCount - 1) {
        return
      }
      moveSliderNext(slidingOptions)
    }
    console.log(direction)
  }

  function calcSliderWidth(sliderContainer, options) {
    const { slideWidth, slideMargin } = options
    const slidesAmount = getSlides(sliderContainer).length
    return slideWidth * slidesAmount + slideMargin * slidesAmount
  }

  function setAutoWidth(settings, sliderContainer) {
    const styles = settings.styles
    const containerWidth = sliderContainer.offsetWidth
    const { slidesToShow } = settings
    let calculatedWidth = 0
    if (typeof settings.slidesToShow === 'number') {
      console.log(containerWidth / slidesToShow)
      console.log(slidesToShow * styles.marginRight)
      calculatedWidth =
        (containerWidth - (slidesToShow - 1) * styles.marginRight) /
        slidesToShow
      styles.width = calculatedWidth
      return
    }
    styles.width = styles.width = containerWidth
    console.log(calculatedWidth)
  }

  function initSlider(settings) {
    const sliderContainer = document.querySelector(settings.sliderContainer)
    sliderContainer.dataset.currentSlide = settings.startingSlide
    const controlsContainer = document.querySelector(settings.controlsContainer)
    sliderContainer.classList.add('my-slider')
    if (settings.autoWidth) {
      setAutoWidth(settings, sliderContainer)
    }
    setStylesToSlides(sliderContainer, settings.styles)
    initSliderButtons(
      sliderContainer,
      Array.from(controlsContainer.children),
      settings.styles
    )
  }
  initSlider(settings)
})
