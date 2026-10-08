import { DRAWER_ID } from "../lib/constants";
import './styles.css'; 
import {calculateGoniometerAngle, getMidPoint, getCenter, getMousePos} from './mathUtils.js';
import {drawUnitCircle, drawLine, drawDot, midPointArea} from './drawCanvas.js';
import {AngleState} from './angleState.js'
import { DragAndMove } from "./DragAndMove";

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
  WIDTH: 420,
  HEIGHT: 500,
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
  const resizeHandle = document.createElement('div');
  const copyButton = document.createElement('button');
  const resetButton = document.createElement('button');
  const closeButton = document.createElement('button');
  const convertDegButton = document.createElement('button');
  const buttons = document.createElement('div');
  const canvas = document.createElement('canvas');

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

  convertDegButton.textContent = "°";

  container.style.width = `${APP_CONSTANTS.WIDTH}px`;
  container.style.height = `${APP_CONSTANTS.HEIGHT}px`;
  canvas.width = APP_CONSTANTS.WIDTH;
  canvas.height = APP_CONSTANTS.WIDTH;

  gonioMeter.append(buttons);
  buttons.append(dragHandle, convertDegButton, copyButton, resetButton, closeButton, resizeHandle);
  mainDiv.append(container);
  container.append(gonioMeter, canvas);

  activate();
  attachCanvasListeners(canvas);
  attachButtonListeners(copyButton, resetButton, closeButton, convertDegButton, resizeHandle);
  activateDrag();
}

function activateDrag() {
  const panel = document.querySelector("#goniometer-panel");
  const handle = document.querySelector("#goniometer-handle");

  if (panel && handle) {
    const drag = new DragAndMove(handle, panel);
    drag.activate();
  } 
}

function attachButtonListeners(copyButton, resetButton, closeButton, convertDegButton, resizeHandle) {
  copyButton.addEventListener('click', (e) => {
    if (angleDeg){
      var copyText = AngleState.format(angleDeg);
      copyToClipboard(copyText);
    } 
  });

  resetButton.addEventListener('click', (e) => {
    activate();
  });

  closeButton.addEventListener('click', (e) => {
    showHideElement(DRAWER_ID, false);
  });

  convertDegButton.addEventListener('click', (e) => {
    AngleState.useDegrees = !AngleState.useDegrees;
    activate();
  });

  resizeHandle.addEventListener('mousedown', (e) => {
    resize();
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard: " + text);
}

function attachCanvasListeners(canvas) {

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

}

function activate() {

  const stateBtn = document.getElementById('deg-btn');
  stateBtn.textContent = AngleState.text();

  const canvas = document.getElementById('goniometer-canvas');
  const ctx = canvas.getContext('2d');
  const center = getCenter(canvas);

  drawUnitCircle(ctx, center);
  points = initializePoints(canvas);
  draw(ctx, canvas);
}

function draw(ctx, canvas) {

  if (!points) return;

  const center = getCenter(canvas);
  const [first, second] = points;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawUnitCircle(ctx, center);

  points.forEach(point => {
    drawDot(ctx, point.x, point.y)
  });

  drawLine(ctx, first.x, first.y, center.x, center.y, []);
  drawLine(ctx, center.x, center.y, second.x, second.y, []);

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

function resize() {
  console.log("resizing");

}

export function showHideElement(elementId, showHide) {
    const el = document.getElementById(elementId);
    el.style.display = showHide ? 'block' : 'none';
}