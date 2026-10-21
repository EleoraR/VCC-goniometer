import { APP_CONSTANTS } from "./clearStyles";
import { CONSTANTS } from "./drawCanvas";
import { calculateGoniometerAngle, getCenter } from "./mathUtils";
import {AngleState} from './angleState.js'

let startAngle = null;
let endAngle = null;

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard: " + text);
}

export function changeFontSize(width = APP_CONSTANTS.WIDTH, height = APP_CONSTANTS.HEIGHT) {
  const fontSize = Math.max(10, Math.round(Math.min(width, height) * 0.03));
  CONSTANTS.TEXT_FONT_SIZE = fontSize;
}

export function initializePoints(canvas) {

  const center = getCenter(canvas);

  return [
    { x: center.x - APP_CONSTANTS.CIRCLE_RADIUS, y: center.y, radius: APP_CONSTANTS.CIRCLE_RADIUS },
    { x: center.x + APP_CONSTANTS.CIRCLE_RADIUS, y: center.y, radius: APP_CONSTANTS.CIRCLE_RADIUS }
  ];
}

export function diffButtonAction(e, center, first, second) {
  const diffButton = e.target;

  if (startAngle && endAngle) {
    copyToClipboard(diffButton.textContent);
    diffButton.textContent = "diff";
    startAngle = null;
    endAngle = null;
    return;
  }

  if (!startAngle) {
    startAngle = calculateGoniometerAngle(center, first, second);
    diffButton.textContent = "=";

  } else {

    endAngle = calculateGoniometerAngle(center, first, second);
    let diff = (startAngle - endAngle) > 0 ? startAngle - endAngle : endAngle - startAngle;
    diffButton.textContent = `${AngleState.format(diff)}`;
  }
}

export function updateConstants(width, height) {
  if (width == 0 || height == 0) return;
  APP_CONSTANTS.WIDTH = Math.round(width);
  APP_CONSTANTS.HEIGHT = Math.round(height);
  APP_CONSTANTS.CANVAS_WIDTH = APP_CONSTANTS.WIDTH - 60;
  APP_CONSTANTS.CANVAS_HEIGHT = APP_CONSTANTS.HEIGHT - 60;
  APP_CONSTANTS.CIRCLE_RADIUS = (APP_CONSTANTS.CANVAS_WIDTH /2) - 10;
}