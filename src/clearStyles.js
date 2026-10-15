import { DRAWER_ID } from "../lib/constants";
import './styles.css'; 
import {calculateGoniometerAngle, getMidPoint, getCenter, getMousePos} from './mathUtils.js';
import {drawUnitCircle, drawLine, drawDot, midPointArea, CONSTANTS} from './drawCanvas.js';
import {AngleState} from './angleState.js'
import { DragAndMove } from "./DragAndMove";
import { Resize } from "./Resize.js";

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

export const APP_CONSTANTS = {
  WIDTH: 480,
  HEIGHT: 480,
  CANVAS_WIDTH: 420,
  CANVAS_HEIGHT: 420,
  CIRCLE_RADIUS: 200
}

let selectedPoint = null;
let points = null;
let angleDeg = null;

window.addEventListener('mouseup', () => {
  selectedPoint = null;
});

export function createElement() {
  const mainDiv = document.getElementById(DRAWER_ID);
  const container = document.createElement('div');
  const gonioMeter = document.createElement('div');
  const dragHandle = document.createElement('div');
  
  const copyButton = document.createElement('button');
  const resetButton = document.createElement('button');
  const closeButton = document.createElement('button');
  const convertDegButton = document.createElement('button');
  const buttons = document.createElement('div');
  const canvas = document.createElement('canvas');

  const resizeHandle = document.createElement('div');
  const resizeIcon1 = document.createElement('i');
  const resizeIcon2 = document.createElement('i');
  resizeIcon1.id = "resize-icon-1";
  resizeIcon2.classList.add("icon", "icon-link");
  resizeIcon1.append(resizeIcon2);
  resizeHandle.append(resizeIcon1);

  container.classList.add('goniometer-container');
  gonioMeter.classList.add('goniometer-title');
  buttons.classList.add("goniometer-button");

  container.id = "goniometer-panel";
  dragHandle.id = "goniometer-handle";
  copyButton.id = "copy-btn"
  resetButton.id = "reset-btn";
  closeButton.id = "close-btn";
  convertDegButton.id = "deg-btn";
  resizeHandle.id = "resize-btn";
  canvas.id = "goniometer-canvas";

  convertDegButton.textContent = "degrees";

  container.style.width = `${APP_CONSTANTS.WIDTH}px`;
  container.style.height = `${APP_CONSTANTS.HEIGHT}px`;

  gonioMeter.append(buttons);
  buttons.append(dragHandle, convertDegButton, copyButton, resetButton, closeButton);
  mainDiv.append(container);
  container.append(gonioMeter, canvas, resizeHandle);

  points = initializePoints(canvas);
  attachCanvasListeners(container, canvas);
  attachButtonListeners(canvas, copyButton, resetButton, closeButton, convertDegButton, resizeHandle);
  activateDrag();
  activateResize();
}

function updateConstants(width, height) {
  if (width == 0 || height == 0) return;
  APP_CONSTANTS.WIDTH = Math.round(width);
  APP_CONSTANTS.HEIGHT = Math.round(height);
  APP_CONSTANTS.CANVAS_WIDTH = APP_CONSTANTS.WIDTH - 60;
  APP_CONSTANTS.CANVAS_HEIGHT = APP_CONSTANTS.HEIGHT - 60;
  APP_CONSTANTS.CIRCLE_RADIUS = (APP_CONSTANTS.CANVAS_WIDTH /2) - 10;
}

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

function attachButtonListeners(canvas, copyButton, resetButton, closeButton, convertDegButton) {
  copyButton.addEventListener('click', (e) => {
    if (angleDeg){
      var copyText = AngleState.format(angleDeg);
      copyToClipboard(copyText);
    } 
  });

  resetButton.addEventListener('click', (e) => {
    points = initializePoints(canvas);
    activate();
  });

  closeButton.addEventListener('click', (e) => {
    showHideElement(DRAWER_ID, false);
  });

  convertDegButton.addEventListener('click', (e) => {
    AngleState.useDegrees = !AngleState.useDegrees;
    activate();
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard: " + text);
}

function changeFontSize(width = APP_CONSTANTS.WIDTH, height = APP_CONSTANTS.HEIGHT) {
  const fontSize = Math.max(10, Math.round(Math.min(width, height) * 0.03));
  CONSTANTS.TEXT_FONT_SIZE = fontSize;
}

function attachCanvasListeners(container, canvas) {

  canvas.addEventListener('mousedown', (e) => {
    if (!points) return;
    const pos = getMousePos(e, canvas);
    selectedPoint = points.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < p.radius);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!selectedPoint ) return;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e, canvas);
    selectedPoint.x = pos.x;
    selectedPoint.y = pos.y;
    draw(ctx, canvas);
  });

  const ro = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    const prevWidth = canvas.width;
    const prevHeight = canvas.height;

    updateConstants(width, height);
    const newWidth = APP_CONSTANTS.CANVAS_WIDTH;
    const newHeight = APP_CONSTANTS.CANVAS_HEIGHT;

    if (newWidth === prevWidth && newHeight === prevHeight) return;

    canvas.width = newWidth;
    canvas.height = newHeight;
    changeFontSize();

    if (prevWidth && prevHeight) {
      const sx = newWidth / prevWidth;   
      const sy = newHeight / prevHeight;
      for (const p of points) {          
        p.x *= sx;
        p.y *= sy;
      }
    }

    activate(); 
  });
  ro.observe(container);
}

function activate() {

  const stateBtn = document.getElementById('deg-btn');
  stateBtn.textContent = AngleState.text();

  const canvas = document.getElementById('goniometer-canvas');
  const ctx = canvas.getContext('2d');
  const center = getCenter(canvas);

  drawUnitCircle(ctx, center);
  // points = initializePoints(canvas);
  draw(ctx, canvas);
}

function draw(ctx, canvas) {

  if (!points) return;

  const center = getCenter(canvas);
  const [first, second] = points;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawUnitCircle(ctx, center);

  angleDeg = calculateGoniometerAngle(center, first, second);
  midPointArea(ctx, center, getMidPoint(center, first), getMidPoint(center, second), angleDeg);
}

function initializePoints(canvas) {

  const center = getCenter(canvas);

  return [
    { x: center.x - APP_CONSTANTS.CIRCLE_RADIUS, y: center.y, radius: APP_CONSTANTS.CIRCLE_RADIUS },
    { x: center.x + APP_CONSTANTS.CIRCLE_RADIUS, y: center.y, radius: APP_CONSTANTS.CIRCLE_RADIUS }
  ];
}

export function showHideElement(elementId, showHide) {
    const el = document.getElementById(elementId);
    el.style.display = showHide ? 'block' : 'none';
}