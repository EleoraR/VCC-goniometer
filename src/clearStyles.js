import { DRAWER_ID } from "../lib/constants";
import './styles.css'; 
import './mathUtils.js';
import { testCalc } from "./mathUtils.js";

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
    container.classList.add('goniometer-container');
    const gonioMeter = document.createElement('h1');
    const canvas = document.createElement('canvas');
    canvas.id = "goniometer-canvas";
    canvas.style.width = '400px';   
    canvas.style.height = '400px';
    canvas.width = 400;  
    canvas.height = 400; 
   
    gonioMeter.innerHTML = 'VCC GonioMeter';
    gonioMeter.classList.add('goniometer-title');
    const buttons = document.createElement('button');
    buttons.textContent = 'hello';
    buttons.classList.add('goniometer-button');

    

    buttons.addEventListener('click', async (e) => {
      const canvas = document.getElementById('goniometer-canvas');
      const ctx = canvas.getContext('2d');

      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";

      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2;

      drawUnitCircle(ctx, 100);

      const [first, second] = await testCalc();
      console.log('First:', first, 'Second:', second);

      drawDot(ctx, first.x, first.y);
      drawDot(ctx, second.x, second.y);
      drawLine(ctx, first.x, first.y, second.x, second.y, 'blue', 2)
      drawLine(ctx, first.x, first.y, centerX, centerY, 'blue', 2)
      drawLine(ctx, centerX, centerY, second.x, second.y, 'blue', 2)

      var angleDeg = calculateGoniometerAngle(centerX, centerY, first, second);
      drawAngleText(ctx, angleDeg, second.x - 10, second.y - 10);

    })
    mainDiv.append(container);
    container.append(gonioMeter);
    container.append(buttons);
    container.append(canvas);
}

export function calculateGoniometerAngle(centerX, centerY, firstPoint, secondPoint) {
  // Angle from center to first point
  const angle1 = Math.atan2(
    firstPoint.y - centerY, 
    firstPoint.x - centerX
  );
  
  // Angle from center to second point
  const angle2 = Math.atan2(
    secondPoint.y - centerY, 
    secondPoint.x - centerX
  );
  
  // Angle between the two lines
  let angleDeg = Math.abs((angle2 - angle1) * 180 / Math.PI);
  
  // Ensure it's between 0-180° (not 0-360°)
  if (angleDeg > 180) {
    angleDeg = 360 - angleDeg;
  }
  
  return angleDeg;
}

export function drawAngleText(ctx, angle, x, y, fontSize = 16, color = 'black') {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${angle.toFixed(1)}°`, x, y);
}

export function drawDot(ctx, x, y, color = 'black', radius = 5) {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
}

export function drawLine(ctx, x1, y1, x2, y2, color = 'black', lineWidth = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);    // Start point
  ctx.lineTo(x2, y2);    // End point
  ctx.stroke();          // Draw it
}

export function drawUnitCircle(ctx, radius = 200) {
  // Center of canvas
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  // Draw the circle
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw center point
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Optional: Draw axes through center
  ctx.strokeStyle = 'lightgray';
  ctx.lineWidth = 1;
  
  // Horizontal axis
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(ctx.canvas.width, centerY);
  ctx.stroke();

  // Vertical axis
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, ctx.canvas.height);
  ctx.stroke();
}

export function showHideElement(elementId, showHide) {
    const el = document.getElementById(elementId);
    el.style.display = showHide ? 'block' : 'none';
}