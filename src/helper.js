import { APP_CONSTANTS } from "./clearStyles";
import { CONSTANTS } from "./drawCanvas";
import { calculateGoniometerAngle, distBetweenTwoPoints, MATH } from "./mathUtils";
import {AngleState} from './angleState.js'

let startAngle = null;
let endAngle = null;
let diff = null;

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard: " + text);
}

export function changeFontSize(width = APP_CONSTANTS.WIDTH, height = APP_CONSTANTS.HEIGHT) {
  const fontSize = Math.max(10, Math.round(Math.min(width, height) * 0.03));
  CONSTANTS.TEXT_FONT_SIZE = fontSize;
}

export function initializePoints() {
  const center = getCenter();
  const radius = APP_CONSTANTS.CIRCLE_RADIUS;
  const angle = Math.PI / 2 + AngleState.direction;

  return [
    {
      x: center.x + radius * Math.cos(angle),
      y: center.y - radius * Math.sin(angle),
      radius
    },
    {
      x: center.x + radius * Math.cos(angle + Math.PI),
      y: center.y - radius * Math.sin(angle + Math.PI),
      radius
    }
  ];

}

export function getCenter() {
  return {
    x: APP_CONSTANTS.CANVAS_WIDTH / 2,
    y: APP_CONSTANTS.CANVAS_HEIGHT / 2
  };
}

export function diffButtonAction(e, first, second) {
  const diffButton = e.target;
  const subtractCont = document.getElementById("subtract-cont");
  const angle1text = document.getElementById("sub-angle-1");
  const angle2text = document.getElementById("sub-angle-2");
  const angledifftext = document.getElementById("sub-angle-diff");
  const center = getCenter();
  if (startAngle && endAngle) {
    // copyToClipboard(diffButton.textContent); // temp
    diffButton.textContent = "ANGLE1";
    startAngle = null;
    endAngle = null;
    angle1text.textContent = "Angle1: 0.0°";
    angle2text.textContent = "Angle2: 0.0°";
    angledifftext.textContent = "Difference: 0.0°";
    return;
  }
  if (!startAngle) {
    subtractCont.classList.add('subtract');
    startAngle = calculateGoniometerAngle(center, first, second);
    diffButton.textContent = "ANGLE2";
    angle1text.textContent = `Angle1: ${AngleState.format(startAngle)}`;

  } else {
    endAngle = calculateGoniometerAngle(center, first, second);
    // let diff = (startAngle - endAngle) > 0 ? startAngle - endAngle : endAngle - startAngle;
    diff = startAngle - endAngle;
    diffButton.textContent = "RESET";
    angle2text.textContent = `Angle2: ${AngleState.format(endAngle)}`;
    angledifftext.textContent = `Difference: ${AngleState.format(diff)}`;
  }
}

export function resetAngleText() {
  const angle1text = document.getElementById("sub-angle-1");
  const angle2text = document.getElementById("sub-angle-2");
  const angledifftext = document.getElementById("sub-angle-diff");
  angle1text.textContent = `Angle1: ${AngleState.format(startAngle)}`;
  angle2text.textContent = `Angle2: ${AngleState.format(endAngle)}`;
  angledifftext.textContent = `Difference: ${AngleState.format(diff)}`;

}

export function updateConstants(width, height) {
  if (width == 0 || height == 0) return;
  APP_CONSTANTS.WIDTH = Math.round(width);
  APP_CONSTANTS.HEIGHT = Math.round(height);
  APP_CONSTANTS.CANVAS_WIDTH = APP_CONSTANTS.WIDTH - 60;
  APP_CONSTANTS.CANVAS_HEIGHT = APP_CONSTANTS.HEIGHT - 60;
  APP_CONSTANTS.CIRCLE_RADIUS = (APP_CONSTANTS.CANVAS_WIDTH /2) - 10;
}

export function getMousePos(e, canvas) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export function scalePoints(point, newSize, prevSize) { 
  const [prevWidth, prevHeight] = prevSize; 
  const [newWidth, newHeight] = newSize;
  const prevCenter = (prevWidth/2, prevHeight/2);

  if (!prevWidth || !prevHeight) return;

  const sx = newWidth / prevWidth;   
  const sy = newHeight / prevHeight;  

  let dx = (point.x - prevCenter.x) * sx;
  let dy = (point.y - prevCenter.y) * sx;

  const radius = APP_CONSTANTS.CIRCLE_RADIUS;
  const distance = Math.hypot(dx, dy);

  if (distance > radius) {
    const k = radius / distance;
    return {
      x: dx *= k,
      y: dy *= k
    };
  } else {
    return {
      x: point.x *= sx,
      y: point.y *= sy
    };
  }

}