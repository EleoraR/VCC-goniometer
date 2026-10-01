import { DragAndMove } from "./DragAndMove";
import "./drag-and-move.css";

const panel = document.querySelector<HTMLElement>("#consult-panel");
const handle = document.querySelector<HTMLElement>("#consult-panel-handle");

if (panel && handle) {
  const drag = new DragAndMove(handle, panel);
  drag.activate();
}
