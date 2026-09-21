import { DRAWER_ID } from "../lib/constants";

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
    const gonioMeter = document.createElement('h1');
    gonioMeter.innerHTML = 'VCC GonioMeter';
    gonioMeter.style.position = 'fixed';
    gonioMeter.style.zIndex = '999';
    gonioMeter.style.top = '20%';
    gonioMeter.style.left = '45%';
    gonioMeter.style.backgroundColor = '#f2f2f2';
    gonioMeter.style.color = 'red';
    gonioMeter.style.padding = '1rem';
    const buttons = document.createElement('button');
    buttons.textContent = 'hello';
    buttons.addEventListener('click', (e) => {
      testButtons();
    })
    mainDiv.append(gonioMeter);
    mainDiv.appendChild(buttons);
}

export function testButtons() {
  console.log('button clicked'); 
}

export function showHideElement(elementId, showHide) {
    const el = document.getElementById(elementId);
    el.style.display = showHide ? 'block' : 'none';
}