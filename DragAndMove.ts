/**
 * Makes `movingElement` draggable by its `handleElement`.
 *
 * Dependency-free portable version of the Video Call drawer behaviour.
 * The moved element must have `position: absolute`, `fixed`, or `relative`.
 */
export class DragAndMove {
  private activePointerId: number | null = null;
  private lastX = 0;
  private lastY = 0;

  constructor(
    private readonly handleElement: HTMLElement,
    private readonly movingElement: HTMLElement,
    private readonly documentContext: Document = document,
  ) {
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
  }

  /** Start listening for mouse, touch, and pen drags. Safe to call once. */
  activate() {
    this.handleElement.style.cursor = "move";
    this.handleElement.style.touchAction = "none";
    this.handleElement.addEventListener("pointerdown", this.onPointerDown);
  }

  /** Remove all listeners. Call this when the component is unmounted/destroyed. */
  deactivate() {
    this.handleElement.removeEventListener("pointerdown", this.onPointerDown);
    this.endDrag();
  }

  private onPointerDown(event: PointerEvent) {
    // Do not turn button/link clicks in the title bar into a drag.
    if ((event.target as Element).closest("button, a, input, select, textarea")) return;

    this.activePointerId = event.pointerId;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.handleElement.setPointerCapture?.(event.pointerId);
    this.documentContext.addEventListener("pointermove", this.onPointerMove);
    this.documentContext.addEventListener("pointerup", this.onPointerUp);
    this.documentContext.addEventListener("pointercancel", this.onPointerUp);
  }

  private onPointerMove(event: PointerEvent) {
    if (event.pointerId !== this.activePointerId) return;

    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    this.movingElement.style.left = `${this.movingElement.offsetLeft + dx}px`;
    this.movingElement.style.top = `${this.movingElement.offsetTop + dy}px`;
  }

  private onPointerUp(event: PointerEvent) {
    if (event.pointerId === this.activePointerId) this.endDrag();
  }

  private endDrag() {
    this.activePointerId = null;
    this.documentContext.removeEventListener("pointermove", this.onPointerMove);
    this.documentContext.removeEventListener("pointerup", this.onPointerUp);
    this.documentContext.removeEventListener("pointercancel", this.onPointerUp);
  }
}
