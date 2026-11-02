import { DRAWER_ID } from "../lib/constants";
import './styles.css'; 
import { calculateGoniometerAngle, MATH } from "./mathUtils.js";
import { drawUnitCircle } from './drawCanvas.js';
import { copyToClipboard, changeFontSize, initializePoints, diffButtonAction, updateConstants, getCenter, getMousePos, scalePoints } from './helper.js';
import {AngleState} from './angleState.js'
import { DragAndMove } from "./DragAndMove";
import { Resize } from "./Resize";

export const APP_CONSTANTS = {
  WIDTH: 480,
  HEIGHT: 480,
  CANVAS_WIDTH: 420,
  CANVAS_HEIGHT: 420,
  CIRCLE_RADIUS: 200
}

let selectedPoint = null;
let points = null;

export function clearStyles(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`No element found with id "${id}"`);
    return null;
  }

  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  [...el.attributes].forEach(attr => {
    if (attr.name !== 'id') {
      el.removeAttribute(attr.name);
    }
  });

  return el;    
}

export function createElement() {
  const mainDiv = document.getElementById(DRAWER_ID);
  const container = document.createElement('div');
  const gonioMeter = document.createElement('div');
  const buttonCont = document.createElement('div');
  const copyButton = document.createElement('button');
  const resetButton = document.createElement('button');
  const closeButton = document.createElement('button');
  const convertDegButton = document.createElement('button');
  const diffButton = document.createElement('button');
  const rotateButton = document.createElement('button');
  const settingsButton = document.createElement('button');
  const dropdown = document.createElement('div');
  const canvas = document.createElement('canvas');
  const resizeHandle = document.createElement('div');
  const resizeIcon1 = document.createElement('i');
  const resizeIcon2 = document.createElement('i');
  const angleText = document.createElement('div');
  const acuteAng = document.createElement('p');
  const obtuseAng = document.createElement('p');

  container.classList.add('goniometer-container');
  gonioMeter.classList.add('goniometer-title');
  resizeIcon2.classList.add("icon", "icon-link");
  closeButton.classList.add("goniometer-button");
  settingsButton.classList.add("goniometer-button");
  angleText.classList.add('goniometer-angles');

  gonioMeter.id = "goniometer-handle";
  dropdown.id = "settings-dropdown";
  container.id = "goniometer-panel";
  copyButton.id = "copy-btn"
  resetButton.id = "reset-btn";
  closeButton.id = "close-btn";
  convertDegButton.id = "deg-btn";
  resizeHandle.id = "resize-btn";
  canvas.id = "goniometer-canvas";
  resizeIcon1.id = "resize-icon-1";
  diffButton.id = "diff-btn";
  rotateButton.id = "rotate-btn";
  settingsButton.id = "settings-btn";
  buttonCont.id = "btn-container";
  acuteAng.id = "acute-ang";
  obtuseAng.id = "obtuse-ang";

  diffButton.textContent = "SUBTRACT";
  resetButton.textContent = "RESET";
  rotateButton.textContent = "90°";
  acuteAng.textContent = "0.0";
  obtuseAng.textContent = "0.0";

  container.style.width = `${APP_CONSTANTS.WIDTH}px`;
  container.style.height = `${APP_CONSTANTS.HEIGHT}px`;
  canvas.width = `${APP_CONSTANTS.CANVAS_WIDTH}px`;
  canvas.height = `${APP_CONSTANTS.CANVAS_HEIGHT}px`;

  angleText.append(acuteAng, obtuseAng);
  dropdown.append(settingsButton, buttonCont);
  buttonCont.append(convertDegButton, copyButton, resetButton, diffButton, rotateButton);
  gonioMeter.append(dropdown, angleText, closeButton);
  resizeIcon1.append(resizeIcon2);
  resizeHandle.append(resizeIcon1);
  mainDiv.append(container);
  container.append(gonioMeter, canvas, resizeHandle);

  attachCanvasListeners(container, canvas, dropdown);
  attachButtonListeners(copyButton, resetButton, closeButton, convertDegButton, diffButton, rotateButton, settingsButton);
  activateDrag();
  activateResize();
}

export function showHideElement(elementId, showHide) {
  points = initializePoints();
  const el = document.getElementById(elementId);
  el.style.display = showHide ? 'block' : 'none';
}

window.addEventListener('mouseup', () => {
  selectedPoint = null;
});

function activateDrag() {
  const panel = document.querySelector("#goniometer-panel");
  const handle = document.querySelector("#goniometer-handle");

  if (panel && handle) {
    const drag = new DragAndMove(handle, panel);
    drag.activate();
  } 
}

function activateResize() {
  const panel = document.querySelector("#goniometer-panel");
  const handle = document.querySelector("#resize-btn");

  if (panel && handle) {
    const resize = new Resize(handle, panel);
    resize.activate();
  }
}

function attachButtonListeners(copyButton, resetButton, closeButton, convertDegButton, diffButton, rotateButton, settingsButton) {
  copyButton.addEventListener('click', (e) => {
    if (AngleState.angleDeg){
      var copyText = AngleState.format(AngleState.angleDeg);
      copyToClipboard(copyText);
    } 
  });

  resetButton.addEventListener('click', (e) => {
    reset();
  });

  closeButton.addEventListener('click', (e) => {
    showHideElement(DRAWER_ID, false);
  });

  convertDegButton.addEventListener('click', (e) => {
    AngleState.useDegrees = !AngleState.useDegrees;
    draw();
  });

  diffButton.addEventListener('click', (e) => {
    const [first, second] = points;
    diffButtonAction(e, first, second);
  });

  rotateButton.addEventListener('click', (e) => {
    AngleState.rotate90();
    points = initializePoints(); 
    draw();
  });

  settingsButton.addEventListener('click', (e) => {
    const cont = document.getElementById("btn-container");
    cont.classList.toggle('open');
  });

}

function attachCanvasListeners(container, canvas, dropdown) {

  canvas.addEventListener('mousedown', (e) => {
    if (!points) return;
    const pos = getMousePos(e, canvas);
    selectedPoint = points.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < p.radius);
    
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!selectedPoint ) return;
    const pos = getMousePos(e, canvas);
    selectedPoint.x = pos.x;
    selectedPoint.y = pos.y;
    draw();
  });

  const ro = new ResizeObserver(entries => {    
    const { width, height } = entries[0].contentRect;
   
    const prevWidth = canvas.width;
    const prevHeight = canvas.height;

    updateConstants(width, height);
    const newWidth = APP_CONSTANTS.CANVAS_WIDTH;
    const newHeight = APP_CONSTANTS.CANVAS_HEIGHT;

    if (newWidth == prevWidth || newHeight == prevHeight) return;

    canvas.width = newWidth;
    canvas.height = newHeight;
    changeFontSize();

    const prevSize = [prevWidth, prevHeight];
    const newSize = [newWidth, newHeight];

    for (var point of points) {
      scalePoints(point, newSize, prevSize);
    }

    draw(); 
  });
  ro.observe(container);

  document.addEventListener('click', (event) => {
    const cont = document.getElementById("btn-container");
    const btn = document.getElementById("settings-btn");
    if (!dropdown.contains(event.target) && !cont.contains(event.target) && !btn.contains(event.target)) {
      if (cont.classList.contains('open')) {
        cont.classList.remove('open');
      }
    }
});
}

function reset() {
  points = initializePoints(); 
  draw();
}

function draw() {
  if (!points) return;

  const stateBtn = document.getElementById('deg-btn');
  const acuteAng = document.getElementById('acute-ang');
  const obtuseAng = document.getElementById('obtuse-ang');
  const canvas = document.getElementById('goniometer-canvas');
  const ctx = canvas.getContext('2d');
  const center = getCenter();
  const [first, second] = points;

  AngleState.first = first;
  AngleState.second = second;
  AngleState.center = center;
  AngleState.angleDeg = calculateGoniometerAngle(center, first, second);

  stateBtn.textContent = AngleState.text();
  acuteAng.textContent = AngleState.format(AngleState.angleDeg);
  obtuseAng.textContent = AngleState.format(MATH.TWOPI - AngleState.angleDeg);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawUnitCircle(ctx);
}