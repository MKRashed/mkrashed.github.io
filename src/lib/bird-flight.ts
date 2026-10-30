/** Keep the flight path relative to the perch, but enter/leave the actual viewport. */
export function createBirdFlight(bird: HTMLElement) {
  const anchor = bird.parentElement!;
  // Escape the scenery's overflow clip and stacking context. The empty anchor
  // stays on the branch; only the bird lives in the viewport's foreground layer.
  const layer = document.createElement('div');
  layer.dataset.birdLayer = '';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    overflow: 'hidden',
    visibility: 'hidden',
    opacity: '1',
    isolation: 'isolate',
    mixBlendMode: 'normal',
  });
  document.body.append(layer);
  layer.append(bird);
  let visible = false;
  const position = () => {
    const bounds = anchor.getBoundingClientRect();
    Object.assign(bird.style, {
      inset: 'auto',
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
    layer.style.visibility =
      visible &&
      !document.hidden &&
      bounds.bottom > 0 &&
      bounds.top < innerHeight
        ? 'visible'
        : 'hidden';
  };
  const setVisible = (value: boolean) => {
    visible = value;
    position();
  };
  window.addEventListener('scroll', position, { passive: true });
  window.addEventListener('resize', position);
  position();
  const sprite = new Image();
  sprite.src = bird.dataset.sprite!;
  const ready = sprite.decode().catch(() => {});
  let generation = 0;
  let animation: Animation | undefined;

  const stop = () => {
    generation++;
    animation?.cancel();
    bird.dataset.state = 'perched';
  };

  const start = async () => {
    stop();
    const current = generation;
    const active = () => current === generation;
    bird.dataset.state = 'away';
    await ready;
    if (!active()) return;

    const play = async (
      frames: Keyframe[],
      duration: number,
      easing = 'linear',
    ) => {
      if (!active()) return false;
      const previous = animation;
      animation = bird.animate(frames, { duration, easing, fill: 'forwards' });
      previous?.cancel();
      try {
        await animation.finished;
        return active();
      } catch {
        return false;
      }
    };
    const hold = (duration: number, opacity = 1) =>
      play(
        [
          { transform: 'translate(0,0)', opacity },
          { transform: 'translate(0,0)', opacity },
        ],
        duration,
      );

    while (active()) {
      position();
      const bounds = anchor.getBoundingClientRect();
      const entryX = innerWidth - bounds.left + bounds.width;
      const entryY = -Math.min(130, Math.max(55, bounds.top * 0.45));
      const exitX = -bounds.right - bounds.width;
      const exitY = -Math.min(150, Math.max(70, bounds.top * 0.55));
      const pose = (x: number, y: number, angle = 0) =>
        `translate(${x}px,${y}px) rotate(${angle}deg)`;

      // Facing left throughout: arrive from beyond the right edge and brake above the perch.
      bird.dataset.state = 'arriving';
      if (
        !(await play(
          [
            { transform: pose(entryX, entryY, -5), opacity: 1 },
            {
              transform: pose(entryX * 0.58, entryY * 0.78, -2),
              opacity: 1,
              offset: 0.35,
            },
            {
              transform: pose(entryX * 0.18, -32, 5),
              opacity: 1,
              offset: 0.72,
            },
            { transform: pose(0, -5, 3), opacity: 1 },
          ],
          1850,
          'cubic-bezier(.2,.25,.3,1)',
        ))
      )
        return;

      // Feet reach the branch as the wings fold; a small rebound settles the weight.
      bird.dataset.state = 'landing';
      if (
        !(await play(
          [
            { transform: pose(0, -5, 3), opacity: 1 },
            { transform: pose(0, 1, 0), opacity: 1, offset: 0.66 },
            { transform: pose(0, 0, 0), opacity: 1 },
          ],
          420,
          'ease-out',
        ))
      )
        return;

      bird.dataset.state = 'perched';
      if (!(await hold(1800))) return;
      // A brief lean around the toes, with no sliding or hopping along the branch.
      if (
        !(await play(
          [
            { transform: 'rotate(0)', opacity: 1 },
            { transform: 'rotate(-.8deg)', opacity: 1, offset: 0.45 },
            { transform: 'rotate(0)', opacity: 1 },
          ],
          650,
          'ease-in-out',
        ))
      )
        return;
      if (!(await hold(1700 + Math.random() * 900))) return;

      bird.dataset.state = 'taking-off';
      if (
        !(await play(
          [
            { transform: pose(0, 0), opacity: 1 },
            { transform: pose(0, 1, -3), opacity: 1, offset: 0.3 },
            { transform: pose(-18, -14, -8), opacity: 1 },
          ],
          240,
          'ease-in',
        ))
      )
        return;

      bird.dataset.state = 'departing';
      // No mid-air fade: the complete bird crosses the left edge before it is hidden.
      if (
        !(await play(
          [
            { transform: pose(-18, -14, -8), opacity: 1 },
            {
              transform: pose(exitX * 0.2, exitY * 0.65, -4),
              opacity: 1,
              offset: 0.3,
            },
            {
              transform: pose(exitX * 0.58, exitY - 10, 1),
              opacity: 1,
              offset: 0.64,
            },
            { transform: pose(exitX, exitY, -3), opacity: 1 },
          ],
          Math.min(3400, Math.max(1900, Math.abs(exitX) / 0.7)),
          'cubic-bezier(.4,0,.7,1)',
        ))
      )
        return;

      bird.dataset.state = 'away';
      if (!(await hold(750, 0))) return;
    }
  };

  const destroy = () => {
    stop();
    window.removeEventListener('scroll', position);
    window.removeEventListener('resize', position);
    // Vite can replace this controller while the bird is outside its original
    // subtree. Restore it before removing the layer so the next controller
    // gets exactly one bird, without an abandoned animation underneath.
    bird.style.removeProperty('inset');
    bird.style.removeProperty('left');
    bird.style.removeProperty('top');
    bird.style.removeProperty('width');
    bird.style.removeProperty('height');
    anchor.append(bird);
    layer.remove();
  };

  return { start, stop, setVisible, destroy };
}
