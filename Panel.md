# Reusable draggable panel

This folder contains the isolated, dependency-free drag behaviour used by the
Patient Consult Summary panel over the video-call screen. Copy this whole
folder into another TypeScript web app, or copy `DragAndMove.ts` alone if that
app already has its own styles.

## Files

| File | Purpose |
| --- | --- |
| `DragAndMove.ts` | The reusable drag controller. No project imports. |
| `drag-and-move.css` | Optional example styles for a floating, resizable panel. |
| `example.ts` | Minimal setup showing how the handle and panel connect. |

## Use in another app

Create the panel and a handle inside it. The panel needs `position: fixed` or
`absolute`, and it needs `left` and `top` values so it can move.

```ts
import { DragAndMove } from "./DragAndMove";
import "./drag-and-move.css";

const panel = document.querySelector<HTMLElement>("#consult-panel")!;
const handle = document.querySelector<HTMLElement>("#consult-panel-handle")!;

const drag = new DragAndMove(handle, panel);
drag.activate();

// In React, call drag.deactivate() from useEffect's cleanup function.
```

```html
<section id="consult-panel" class="draggable-panel">
  <header id="consult-panel-handle" class="draggable-panel__handle">
    Patient consult summary
  </header>
  <main class="draggable-panel__content">…</main>
</section>
```

It uses Pointer Events, so the same code supports mouse, touch, and pen input.
Controls inside the handle (buttons, links, form fields) remain clickable rather
than starting a drag. Call `deactivate()` when the panel is removed.

## Source in this repository

The running Video Call implementation is wired here:

- `lib/drawer.ts` creates the panel (`mainDrawer`) and its handle
  (`drawerTaskBar`), then connects them near the end of `styleMainDrawer`.
- `lib/DragAndMove.ts` is the current application-specific drag controller. It
  uses `DomCtx` so that it also works when the panel enters document
  Picture-in-Picture.
- `lib/css/drawer.css` supplies the drawer and taskbar styling.

This portable version intentionally does not import `DomCtx` or any Video Call
API. If using it in a secondary document such as Picture-in-Picture, pass that
document as the optional third constructor argument.
