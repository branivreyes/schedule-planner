export function useResizeElementWidth<T extends HTMLElement>(
  target: T,
  handler: T,
  min: number,
  max: number
) {
  let mouseInitialPosition = 0;
  let targetInitialWidth = 0;

  function resize(event: MouseEvent) {
    event.preventDefault();

    const increase = event.x - mouseInitialPosition;

    const width = targetInitialWidth + increase;

    if (width < min || width > max) return;

    target.style.width = width + "px";
  }

  handler.addEventListener(
    "mousedown",
    (e) => {
      mouseInitialPosition = e.x;
      targetInitialWidth = parseInt(getComputedStyle(target).width!);
      document.addEventListener("mousemove", resize, false);
    },
    false
  );

  document.addEventListener(
    "mouseup",
    () => document.removeEventListener("mousemove", resize, false),
    false
  );
}
