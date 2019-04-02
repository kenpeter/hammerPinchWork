'use strict';

// img tag, with url
const imageUrl = 'https://cdn.shopify.com/s/files/1/0131/9514/9369/products/redpixie_1242x.progressive.jpg?v=1539581610';
// img stay in container
const imageContainer = document.querySelector('.imageContainer');
// select the hud has well
const hud = document.querySelector('#hud');

// Global var
// from 1 to 4
let minScale = 1;
let maxScale = 4;

// img w h
let imageWidth;
let imageHeight;

// container w h
let containerWidth;
let containerHeight;

// display x y scale
let displayImageX = 0;
let displayImageY = 0;
let displayImageScale = 1; // origin scale is 1

// global: display default
let displayDefaultWidth;
let displayDefaultHeight;

// range x, max, min
let rangeX = 0;
let rangeMaxX = 0;
let rangeMinX = 0;

// range y, max, min
let rangeY = 0;
let rangeMaxY = 0;
let rangeMinY = 0;

let displayImageRangeY = 0;

// display img x y scale
let displayImageCurrentX = 0;
let displayImageCurrentY = 0;
let displayImageCurrentScale = 1;


// resize .imageContainer
function resizeContainer() {
  // img container outer width
  containerWidth = imageContainer.offsetWidth;
  // img container outer height
  containerHeight = imageContainer.offsetHeight;

  // img outer width
  // img outer height
  if (displayDefaultWidth !== undefined && displayDefaultHeight !== undefined) {
    // img outer width
    displayDefaultWidth = displayImage.offsetWidth;
    // img outer height
    displayDefaultHeight = displayImage.offsetHeight;

    // update range
    updateRange();

    // display img curr x
    // img x, min_x, max_x
    displayImageCurrentX = clamp( displayImageX, rangeMinX, rangeMaxX );

    // display img curr y
    // img y, min_y, max_y
    displayImageCurrentY = clamp( displayImageY, rangeMinY, rangeMaxY );

    // update display img
    updateDisplayImage(
      // img x
      displayImageCurrentX,
      // img y
      displayImageCurrentY,
      // img scale
      displayImageCurrentScale );
  }
}

// init call, resize .imageContainer
resizeContainer();

// clamp
// val, min, max
function clamp(value, min, max) {
  // min: max(min vs val) VS max
  return Math.min(Math.max(min, value), max);
}

// compress scale
// new scale
function clampScale(newScale) {
  // clamp
  // new_scale
  // min
  // max
  return clamp(newScale, minScale, maxScale);
}

// when resize, resize container
window.addEventListener('resize', resizeContainer, true);

// create new img
const displayImage = new Image();


// the new image has url
displayImage.src = imageUrl;

// image onload, do something
displayImage.onload = function() {
  // get img width
  imageWidth = displayImage.width;
  // get img height
  imageHeight = displayImage.height;
  // img to img container
  imageContainer.appendChild(displayImage);

  // img has listener
  // mouse down
  // stop default
  // no option
  displayImage.addEventListener('mousedown', e => e.preventDefault(), false);

  // outer width
  displayDefaultWidth = displayImage.offsetWidth;
  // outer height
  displayDefaultHeight = displayImage.offsetHeight;

  // diff of img outer & img container outer
  rangeX = Math.max(0, displayDefaultWidth - containerWidth);

  rangeY = Math.max(0, displayDefaultHeight - containerHeight);
}

// img container wheel
imageContainer.addEventListener('wheel', e => {
  displayImageScale = displayImageCurrentScale = clampScale(displayImageScale + (e.wheelDelta / 800));
  updateRange();
  displayImageCurrentX = clamp(displayImageCurrentX, rangeMinX, rangeMaxX)
  displayImageCurrentY = clamp(displayImageCurrentY, rangeMinY, rangeMaxY)
	updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageScale);
}, false);

// update display img
function updateDisplayImage(x, y, scale) {
  const transform = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(0px) scale(' + scale + ',' + scale + ')';
  displayImage.style.transform = transform;
  displayImage.style.WebkitTransform = transform;
  displayImage.style.msTransform = transform;

  // NOTE we don't update it
  //updateHud();
}

// update range
function updateRange() {
  rangeX = Math.max(0, Math.round(displayDefaultWidth * displayImageCurrentScale) - containerWidth);
  rangeY = Math.max(0, Math.round(displayDefaultHeight * displayImageCurrentScale) - containerHeight);

  rangeMaxX = Math.round(rangeX / 2);
  rangeMinX = 0 - rangeMaxX;

  rangeMaxY = Math.round(rangeY / 2);
  rangeMinY = 0 - rangeMaxY;
}

/*
// no use: display window
function updateHud() {
  let hudText = `<pre>
<b>Current</b>
<b>Scale:</b>     ${displayImageCurrentScale.toFixed(4)}
<b>X:</b>         ${displayImageCurrentX}
<b>Y:</b>         ${displayImageCurrentY}

<b>Range</b>
<b>rangeX:</b>    ${rangeX}
<b>rangeMinX:</b> ${rangeMinX}
<b>rangeMaxX:</b> ${rangeMaxX}

<b>rangeY:</b>    ${rangeY}
<b>rangeMinY:</b> ${rangeMinY}
<b>rangeMaxY:</b> ${rangeMaxY}

<b>Updated</b>
<b>Scale:</b>     ${displayImageScale.toFixed(4)}
<b>X:</b>         ${displayImageX}
<b>Y:</b>         ${displayImageY}
</pre>`;
  hud.innerHTML = hudText;
}
*/

const hammertime = new Hammer(imageContainer);

hammertime.get('pinch').set({ enable: true });

hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

hammertime.on('pan', ev => {
  displayImageCurrentX = clamp(displayImageX + ev.deltaX, rangeMinX, rangeMaxX);
  displayImageCurrentY = clamp(displayImageY + ev.deltaY, rangeMinY, rangeMaxY);
	updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageScale);
});

// pinch or pinch move
// ev == evnet
hammertime.on('pinch pinchmove', ev => {
  // img curr scale
  // clampScale
  // event has scale
  // dynamic scale: displayImageScale
  displayImageCurrentScale = clampScale(ev.scale * displayImageScale);

  updateRange();

  displayImageCurrentX = clamp(displayImageX + ev.deltaX, rangeMinX, rangeMaxX);
  displayImageCurrentY = clamp(displayImageY + ev.deltaY, rangeMinY, rangeMaxY);

  updateDisplayImage(displayImageCurrentX, displayImageCurrentY, displayImageCurrentScale);
});

hammertime.on('panend pancancel pinchend pinchcancel', () => {
  displayImageScale = displayImageCurrentScale;
  displayImageX = displayImageCurrentX;
  displayImageY = displayImageCurrentY;
});


/*
hammertime.on('pinchend pinchcancel', () => {
  displayImageScale = displayImageCurrentScale;
  displayImageX = displayImageCurrentX;
  displayImageY = displayImageCurrentY;
});
*/
