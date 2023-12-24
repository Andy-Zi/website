// @codekit-prepend "/vendor/hammer-2.0.8.js";

document.addEventListener('DOMContentLoaded', function() {
  var canScroll = true,
      scrollController = null;

  document.addEventListener('wheel', function(e) {
    var outerNav = document.querySelector('.outer-nav');
    if (!outerNav.classList.contains('is-vis')) {
      e.preventDefault();
      var delta = e.wheelDelta ? -e.wheelDelta : e.detail * 20;

  if (delta > 50 && canScroll) {
          canScroll = false;
          clearTimeout(scrollController);
          scrollController = setTimeout(function() {
            canScroll = true;
          }, 800);
          updateHelper(1);
        } else if (delta < -50 && canScroll) {
          canScroll = false;
          clearTimeout(scrollController);
          scrollController = setTimeout(function() {
            canScroll = true;
          }, 800);
          updateHelper(-1);
        }
      }
    },{passive: false});

  document.querySelectorAll('.side-nav li, .outer-nav li').forEach(function(item) {
    item.addEventListener('click', function() {
      if (!this.classList.contains('is-active')) {
        var parent = this.parentElement;
        var curActive = parent.querySelector('.is-active');
        var curPos = Array.prototype.indexOf.call(parent.children, curActive);
        var nextPos = Array.prototype.indexOf.call(parent.children, this);
        var lastItem = parent.children.length - 1;

        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    });
  });

  document.querySelectorAll('.cta').forEach(function(cta) {
    cta.addEventListener('click', function() {
      var sideNav = document.querySelector('.side-nav');
      var curActive = sideNav.querySelector('.is-active');
      var curPos = Array.prototype.indexOf.call(sideNav.children, curActive);
      var lastItem = sideNav.children.length - 1;

      updateNavs(lastItem);
      updateContent(curPos, lastItem, lastItem);
    });
  });

  // swipe support for touch devices
  var targetElement = document.getElementById('viewport'),
      mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on('swipeup swipedown', function(e) {

    updateHelper(e);

  });

  document.addEventListener('keyup', function(e) {
    var outerNav = document.querySelector('.outer-nav');
    if (!outerNav.classList.contains('is-vis')) {
      e.preventDefault();
      updateHelper(e);
    }
  });

  // determine scroll, swipe, and arrow key direction
  function updateHelper(param) {
    var sideNav = document.querySelector('.side-nav');
    var curActive = sideNav.querySelector('.is-active');
    var curPos = Array.prototype.indexOf.call(sideNav.children, curActive);
    var lastItem = sideNav.children.length - 1;
    var nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      } else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    } else if (param.type === "swipedown" || param.keyCode === 38 || param < 0) {
      if (curPos !== 0) {
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      } else {
        nextPos = lastItem;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
  }

  // sync side and outer navigations
  function updateNavs(nextPos) {
    document.querySelectorAll('.side-nav, .outer-nav').forEach(nav => {
      nav.querySelectorAll(':scope > *').forEach(child => {
        child.classList.remove('is-active');
      });
    });

    var sideNavChildren = document.querySelector('.side-nav').children;
    var outerNavChildren = document.querySelector('.outer-nav').children;

    if (sideNavChildren[nextPos]) {
      sideNavChildren[nextPos].classList.add('is-active');
    }
    if (outerNavChildren[nextPos]) {
      outerNavChildren[nextPos].classList.add('is-active');
    }
  }

  // update main content area
  function updateContent(curPos, nextPos, lastItem) {
    var mainContentChildren = document.querySelector('.main-content').children;
    Array.from(mainContentChildren).forEach(child => {
      child.classList.remove('section--is-active');
    });

    if (mainContentChildren[nextPos]) {
      mainContentChildren[nextPos].classList.add('section--is-active');
    }

    var sectionChildren = document.querySelectorAll('.main-content .section > *');
    sectionChildren.forEach(child => {
      child.classList.remove('section--next', 'section--prev');
    });

    if ((curPos === lastItem && nextPos === 0) || (curPos === 0 && nextPos === lastItem)) {
      // The original code here removes classes, but they are already removed above
    } else if (curPos < nextPos) {
      if (mainContentChildren[curPos]) {
        Array.from(mainContentChildren[curPos].children).forEach(child => {
          child.classList.add('section--next');
        });
      }
    } else {
      if (mainContentChildren[curPos]) {
        Array.from(mainContentChildren[curPos].children).forEach(child => {
          child.classList.add('section--prev');
        });
      }
    }

    var headerCta = document.querySelector('.header--cta');
    if (headerCta) {
      if (nextPos !== 0 && nextPos !== lastItem) {
        headerCta.classList.add('is-active');
      } else {
        headerCta.classList.remove('is-active');
      }
    }
  }

  function outerNav() {
    document.querySelectorAll('.header--nav-toggle').forEach(toggle => {
      toggle.addEventListener('click', function() {
        document.querySelectorAll('.perspective').forEach(p => p.classList.add('perspective--modalview'));
        setTimeout(function() {
          document.querySelectorAll('.perspective').forEach(p => p.classList.add('effect-rotate-left--animate'));
        }, 25);
        document.querySelectorAll('.outer-nav, .outer-nav li, .outer-nav--return').forEach(navItem => navItem.classList.add('is-vis'));
      });
    });

    document.querySelectorAll('.outer-nav--return, .outer-nav li').forEach(item => {
      item.addEventListener('click', function() {
        document.querySelectorAll('.perspective').forEach(p => p.classList.remove('effect-rotate-left--animate'));
        setTimeout(function() {
          document.querySelectorAll('.perspective').forEach(p => p.classList.remove('perspective--modalview'));
        }, 400);
        document.querySelectorAll('.outer-nav, .outer-nav li, .outer-nav--return').forEach(navItem => navItem.classList.remove('is-vis'));
      });
    });
  }

  function workSlider() {
    document.querySelectorAll('.slider--prev, .slider--next').forEach(button => {
      button.addEventListener('click', function() {
        var slider = document.querySelector('.slider');
        var sliderItems = slider.children;
        var totalWorks = sliderItems.length;
        
        var curLeft = slider.querySelector('.slider--item-left');
        var curCenter = slider.querySelector('.slider--item-center');
        var curRight = slider.querySelector('.slider--item-right');
        var curLeftPos = Array.prototype.indexOf.call(sliderItems, curLeft);
        var curCenterPos = Array.prototype.indexOf.call(sliderItems, curCenter);
        var curRightPos = Array.prototype.indexOf.call(sliderItems, curRight);

        slider.style.opacity = '0';

        setTimeout(function() {
          // Logic to update slider positions
          if (this.classList.contains('slider--next')) {
            updateSliderPositions('next', curLeftPos, curCenterPos, curRightPos, totalWorks, sliderItems);
          } else {
            updateSliderPositions('prev', curLeftPos, curCenterPos, curRightPos, totalWorks, sliderItems);
          }
          slider.style.opacity = '1';
        }.bind(this), 400);
      });
    });
  }

  function updateSliderPositions(direction, curLeftPos, curCenterPos, curRightPos, totalWorks, sliderItems) {
    function getNextIndex(currentIndex) {
      return currentIndex < totalWorks - 1 ? currentIndex + 1 : 0;
    }

    function getPreviousIndex(currentIndex) {
      return currentIndex > 0 ? currentIndex - 1 : totalWorks - 1;
    }

    if (direction === 'next') {
      sliderItems[curLeftPos].classList.remove('slider--item-left');
      sliderItems[curCenterPos].classList.remove('slider--item-center');
      sliderItems[curRightPos].classList.remove('slider--item-right');

      var nextLeftIndex = getNextIndex(curLeftPos);
      var nextCenterIndex = getNextIndex(curCenterPos);
      var nextRightIndex = getNextIndex(curRightPos);

      sliderItems[nextLeftIndex].classList.add('slider--item-left');
      sliderItems[nextCenterIndex].classList.add('slider--item-center');
      sliderItems[nextRightIndex].classList.add('slider--item-right');
    } else {  // direction === 'prev'
      sliderItems[curLeftPos].classList.remove('slider--item-left');
      sliderItems[curCenterPos].classList.remove('slider--item-center');
      sliderItems[curRightPos].classList.remove('slider--item-right');

      var prevLeftIndex = getPreviousIndex(curLeftPos);
      var prevCenterIndex = getPreviousIndex(curCenterPos);
      var prevRightIndex = getPreviousIndex(curRightPos);

      sliderItems[prevLeftIndex].classList.add('slider--item-left');
      sliderItems[prevCenterIndex].classList.add('slider--item-center');
      sliderItems[prevRightIndex].classList.add('slider--item-right');
    }
  }

  function transitionLabels() {
    document.querySelectorAll('.work-request--information input').forEach(input => {
      input.addEventListener('focusout', function() {
        var textVal = this.value;
        if (textVal === "") {
          this.classList.remove('has-value');
        } else {
          this.classList.add('has-value');
        }
        window.scrollTo(0, 0);
      });
    });
  }

  outerNav();
  workSlider();
  transitionLabels();


});
