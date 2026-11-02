//repurposed drag and move class for resizing
export class Resize {
  private activePointerId: number | null = null;
  private lastX = 0;
  private lastY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private deltaX = 0;
  private deltaY = 0;
  
  private static MIN_WIDTH = 100;

  //adjustments for strip-only mode error
  private readonly handleElement: HTMLElement;
  private readonly resizeElement: HTMLElement;
  private readonly documentContext: Document = document;

  constructor(
    //adjustments for strip-only mode error
    handleElement: HTMLElement,
    resizeElement: HTMLElement,
    documentContext: Document = document,
  ) {

    //adjustments for strip-only mode error
    this.handleElement = handleElement;
    this.resizeElement = resizeElement;
    this.documentContext = documentContext;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
  }

  /** Start listening for mouse, touch, and pen drags. Safe to call once. */
  activate() {
    this.handleElement.style.cursor = "nwse-resize";
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

    const rect = this.resizeElement.getBoundingClientRect();
    this.startWidth = rect.width;
    this.startHeight = rect.height;

    const view = this.documentContext.defaultView ?? window;

    this.startWidth = parseInt(view.getComputedStyle(this.resizeElement).width, 10);
    this.startHeight = parseInt(view.getComputedStyle(this.resizeElement).height, 10);
  
    this.handleElement.setPointerCapture?.(event.pointerId);
    this.documentContext.addEventListener("pointermove", this.onPointerMove);
    this.documentContext.addEventListener("pointerup", this.onPointerUp);
    this.documentContext.addEventListener("pointercancel", this.onPointerUp);
  }

  private onPointerMove(event: PointerEvent) {
    if (event.pointerId !== this.activePointerId) return;

    this.deltaX = event.clientX - this.lastX;
    this.deltaY = event.clientY - this.lastY;

    const delta =
      Math.abs(this.deltaX) > Math.abs(this.deltaY) ? this.deltaX : this.deltaY;

    const size = Math.max(
      Resize.MIN_WIDTH, 
      this.startWidth + delta
    );
    
    this.resizeElement.style.width = `${size}px`;
    this.resizeElement.style.height = `${size}px`;

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
