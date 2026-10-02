import { DRAWER_ID } from "../lib/constants";
import './styles.css'; 
import {calculateGoniometerAngle} from './mathUtils.js';
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

let selectedPoint = null;
let points = null;
let angleDeg = null;
// let lastPressed = null;

window.addEventListener('mouseup', () => {
  selectedPoint = null;
});

export function createElement() {
    const mainDiv = document.getElementById(DRAWER_ID);
    const container = document.createElement('div');
    container.classList.add('goniometer-container');
    container.id = "goniometer-panel";

    const gonioMeter = document.createElement('div');
    const dragHandle = document.createElement('div');
    const goniometerTitle = document.createElement('h1');
    const copyButton = document.createElement('button');
    const resetButton = document.createElement('button');
    const closeButton = document.createElement('button');
    const convertDegButton = document.createElement('button');
    const buttons = document.createElement('div');
    
    goniometerTitle.innerHTML = 'VCC GonioMeter';
    gonioMeter.classList.add('goniometer-title');

    dragHandle.id = "goniometer-handle";

    buttons.classList.add("goniometer-button");
    copyButton.id = "copy-btn"
    resetButton.id = "reset-btn";
    closeButton.id = "close-btn";
    convertDegButton.id = "deg-btn";
    convertDegButton.textContent = "Degrees";
  
    gonioMeter.append(dragHandle);
    gonioMeter.append(goniometerTitle);
    gonioMeter.append(buttons);
    buttons.append(convertDegButton);

    buttons.append(copyButton);
    buttons.append(resetButton);
    buttons.append(closeButton);

    const canvas = document.createElement('canvas');
    canvas.id = "goniometer-canvas";
    canvas.style.width = '420px';   
    canvas.style.height = '420px';
    canvas.width = 420;  
    canvas.height = 420; 
   
    mainDiv.append(container);
    container.append(gonioMeter);
    container.append(canvas);

    activate();
    attachCanvasList(canvas);
    attackButtonList(copyButton, resetButton, closeButton, convertDegButton);
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

function attackButtonList(copyButton, resetButton, closeButton, convertDegButton) {
  copyButton.addEventListener('click', (e) => {
    var copyText = `${AngleState.toDegrees(angleDeg).toFixed(1)}°`;
    copyToClipboard(copyText);
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
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard: " + text);
}

function attachCanvasList(canvas) {

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

export function activate() {

  const stateBtn = document.getElementById('deg-btn');

  if (AngleState.useDegrees) {
    stateBtn.textContent = "Degrees";
  } else {
    stateBtn.textContent = "Radians";
  }

  const canvas = document.getElementById('goniometer-canvas');
  const ctx = canvas.getContext('2d');

  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";

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

  drawDot(ctx, first.x, first.y);
  drawDot(ctx, second.x, second.y);

  drawLine(ctx, first.x, first.y, center.x, center.y);
  drawLine(ctx, center.x, center.y, second.x, second.y);

  const midPt1 = getMidPoint(center, first);
  const midPt2 = getMidPoint(center, second);

  angleDeg = calculateGoniometerAngle(center, first, second);

  midPointArea(ctx, center, midPt1, midPt2, angleDeg);

}

function getMidPoint(first, second) {
  return {
    x: (first.x + second.x)/2,
    y: (first.y + second.y)/2
  }
}

function initializePoints(canvas) {

  const center = getCenter(canvas);

  return [
    { x: center.x - 200, y: center.y, radius: 200 },
    { x: center.x + 200, y: center.y, radius: 200 }
  ];
}

function getCenter(canvas) {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2
  };
}

export function getMousePos(e, canvas) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function showHideElement(elementId, showHide) {
    const el = document.getElementById(elementId);
    el.style.display = showHide ? 'block' : 'none';
}