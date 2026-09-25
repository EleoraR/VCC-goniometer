const CONSTANTS = {
  CIRCLE_RADIUS: 200,
  DOT_RADIUS: 5,
  DRAG_RADIUS: 8,
  LINE_WIDTH: 2,
  TEXT_FONT_SIZE: 16,
  TEXT_COLOR: 'black',
  LINE_COLOR: 'blue'
}


export function drawDistText(ctx, dist, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.TEXT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${dist.toFixed(2)}`, x, y);
}

export function drawAngleText(ctx, angle, x, y, fontSize = CONSTANTS.TEXT_FONT_SIZE, color = CONSTANTS.TEXT_COLOR) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${angle.toFixed(1)}°`, x, y);
}

export function drawDot(ctx, x, y, color = CONSTANTS.TEXT_COLOR, radius = CONSTANTS.DOT_RADIUS) {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  
}

export function drawLine(ctx, x1, y1, x2, y2, color = CONSTANTS.TEXT_COLOR, lineWidth = CONSTANTS.LINE_WIDTH) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);    
  ctx.lineTo(x2, y2);    
  ctx.stroke();          
}

export function drawUnitCircle(ctx, center, radius = CONSTANTS.CIRCLE_RADIUS) {

  // Draw the circle
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw center point
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(center.x, center.y, 4, 0, Math.PI * 2);
  ctx.fill();

  // Optional: Draw axes through center
  ctx.strokeStyle = 'lightgray';
  ctx.lineWidth = 1;
  
  // Horizontal axis
  ctx.beginPath();
  ctx.moveTo(0, center.y);
  ctx.lineTo(ctx.canvas.width, center.y);
  ctx.stroke();

  // Vertical axis
  ctx.beginPath();
  ctx.moveTo(center.x, 0);
  ctx.lineTo(center.x, ctx.canvas.height);
  ctx.stroke();

  //labels
  // drawLabels(ctx, center);
}

function drawLabels(ctx, center) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(center.x, 15, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `16px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`0`, center.x, 5);
}