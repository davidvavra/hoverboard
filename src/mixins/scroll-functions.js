/* eslint-disable no-unused-vars */

/* @polymerMixin */
const ScrollFunctions = (subclass) => class extends subclass {
  /**
   * Scroll function
   * @param {Number} scrollTargetY - the target scrollY property of the window
   * @param {Number} time - time of animation
   * @param {String} easing - easing equation to use
   */
  scrollToY(scrollTargetY = 0, time = 0, easing = 'easeOutSine') {
    const scrollY = window.scrollY;
    let currentTime = 0;
    const animationTime = time / 1000;

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    const easingEquations = {
      easeOutSine: (pos) => Math.sin(pos * (Math.PI / 2)),
      easeInOutSine: (pos) => (-0.5 * (Math.cos(Math.PI * pos) - 1)),
      easeInOutQuint: (pos) => {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      },
    };

    // add animation loop
    function tick() {
      currentTime += 1 / 60;

      const p = currentTime / animationTime;
      const t = easingEquations[easing](p);

      if (p < 1) {
        window.requestAnimationFrame(tick);

        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      } else {
        window.scrollTo(0, scrollTargetY);
      }
    }

    // call it once to get started
    tick();
  }
};