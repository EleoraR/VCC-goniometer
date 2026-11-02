import {calculateMidPointAngles, getMidPoint, getSectorCenter, getPosFromAngle, MATH} from './mathUtils.js';
import {AngleState} from './angleState.js'
import { APP_CONSTANTS  } from './clearStyles.js';
import './styles.css'; 

export const CONSTANTS = {
  SLICES: 12,
  CIRCLE_COLOR: '#747474',
  DOT_RADIUS: 5,
  DRAG_RADIUS: 8,
  LINE_WIDTH: 2,
  TEXT_FONT_SIZE: 16,
  DEFAULT_COLOR: 'black',
  LINE_COLOR: '#1e4759',
  SECTOR_COLOR: '#009f964d'
}

let center = null;
let ctx = null;

export function drawDistText(dist, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.DEFAULT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${dist.toFixed(2)}`, x, y);
}

export function drawAngleText(angle, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.DEFAULT_COLOR) {
  ctx.font = angle == 0.0? `bold ${fontSize}px Arial` : `${fontSize}px Arial`;
  ctx.fillStyle = angle == 0.0? "#1e4759" : color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let labelAngle = AngleState.format(angle);
  ctx.fillText(`${labelAngle}`, x, y);
}

export function drawDot(p, radius = CONSTANTS.DOT_RADIUS, color = CONSTANTS.DEFAULT_COLOR) {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(p.x, p.y, radius, 0, MATH.TWOPI);
  ctx.fill();
}

export function drawLine(x1, y1, x2, y2, color = CONSTANTS.LINE_COLOR, lineWidth = CONSTANTS.LINE_WIDTH) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);    
  ctx.lineTo(x2, y2);    
  ctx.stroke();       
}

export function drawArc(x, y, radius, startAngle, endAngle, color, counterclockwise = false) {
  ctx.beginPath();
  ctx.moveTo(x, y);   
  ctx.arc(x,y,radius,startAngle,endAngle,counterclockwise);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#009f96';
  ctx.lineWidth = 5;
  ctx.stroke();    
}

export function midPointArea(midFirst, midSecond, angleDeg, radius = APP_CONSTANTS.CIRCLE_RADIUS, fillColor = CONSTANTS.SECTOR_COLOR) {
  const [startAngle, endAngle] = calculateMidPointAngles(center, midFirst, midSecond);
  
  drawArc(center.x,center.y,radius,startAngle,endAngle, fillColor);
  drawDot(center, 4, '#009f96');
  const sectorCenPt = getSectorCenter(center, startAngle, endAngle, radius);

  drawAngleText(angleDeg, sectorCenPt.x, sectorCenPt.y);
}

function drawCircleOutline(radius = APP_CONSTANTS.CIRCLE_RADIUS, color = '#747474') {
  ctx.strokeStyle = color;
  ctx.lineWidth = CONSTANTS.LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, MATH.TWOPI);
  ctx.stroke();
}

export function drawUnitCircle(ctxObj, color = CONSTANTS.CIRCLE_COLOR)  {
  center = AngleState.center;
  ctx = ctxObj;

  const first = AngleState.first;
  const second = AngleState.second;

  drawCircleOutline();
  drawDot(center, CONSTANTS.DOT_RADIUS, color);
  drawPizza();
  midPointArea(getMidPoint(center, first), getMidPoint(center, second), AngleState.angleDeg);
  drawPizzaLabels();

}

function drawPizza(radius = APP_CONSTANTS.CIRCLE_RADIUS, color = CONSTANTS.CIRCLE_COLOR, slices = CONSTANTS.SLICES) {

  for (let i = 0; i < slices; i++) {
   
    const angle = (i * MATH.TWOPI) / slices;
    drawLine(center.x, center.y, center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle), color, 1);    
  }
}

export function drawPizzaLabels(slices = CONSTANTS.SLICES) {
  const step = (MATH.TWOPI) / slices;

  for (let i = 0; i < slices; i++) {
    
    const angle = (i * MATH.TWOPI) / slices;
    
    const labelAngle = i * step - Math.PI / 2 + AngleState.direction;

    drawLabel(angle, labelAngle);
    
  }
}

function drawLabel(angle, labelAngle, radius = APP_CONSTANTS.CIRCLE_RADIUS) {

  const labelPoint = {
    x: center.x + radius * 0.85 * Math.cos(labelAngle),
    y: center.y + radius * 0.85 * Math.sin(labelAngle)
  }
    
  drawAngleText(angle, labelPoint.x, labelPoint.y);
}
