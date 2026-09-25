import { DRAWER_ID } from "../lib/constants";
import './styles.css'; 
import {calculateGoniometerAngle} from './mathUtils.js';
import {drawUnitCircle, drawLine, drawDot, drawAngleText} from './drawCanvas.js';

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

window.addEventListener('mouseup', () => {
  selectedPoint = null;
});

export function createElement() {
    const mainDiv = document.getElementById(DRAWER_ID);
    const container = document.createElement('div');
    container.classList.add('goniometer-container');

    const gonioMeter = document.createElement('div');
    const goniometerTitle = document.createElement('h1');
    const copyButton = document.createElement('button');
    
    goniometerTitle.innerHTML = 'VCC GonioMeter';
    gonioMeter.classList.add('goniometer-title');
    // copyButton.textContent = 'copy';
    copyButton.classList.add("goniometer-button");

    gonioMeter.append(goniometerTitle);
    gonioMeter.append(copyButton);

    const canvas = document.createElement('canvas');
    canvas.id = "goniometer-canvas";
    canvas.style.width = '400px';   
    canvas.style.height = '400px';
    canvas.width = 400;  
    canvas.height = 400; 

    
   
    mainDiv.append(container);
    container.append(gonioMeter);
    container.append(canvas);

    activate();
    attachCanvasList(canvas);
    attackButtonList(copyButton);
    
}

function attackButtonList(button) {
  button.addEventListener('click', (e) => {
    var copyText = `${angleDeg.toFixed(1)}°`;
    copyToClipboard(copyText);
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
  drawLine(ctx, first.x, first.y, second.x, second.y, 'blue', 2)
  drawLine(ctx, first.x, first.y, center.x, center.y, 'blue', 2)
  drawLine(ctx, center.x, center.y, second.x, second.y, 'blue', 2)

  angleDeg = calculateGoniometerAngle(center, first, second);
  drawAngleText(ctx, angleDeg, center.x - 10, center.y - 10);

}

function initializePoints(canvas) {

  const center = getCenter(canvas);

  return [
    { x: center.x - 100, y: center.y, radius: 100 },
    { x: center.x + 100, y: center.y, radius: 100 }
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