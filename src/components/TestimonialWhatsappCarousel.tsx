import { useEffect, useRef, useState } from "react";

export type WhatsappSlide = {
  src: string;
  alt: string;
};

type Props = {
  items: WhatsappSlide[];
  /** segundos entre cada avanço automático */
  intervalSeconds?: number;
};

/**
 * Carrossel de 1 print por vez (prints de WhatsApp), com autoplay, loop
 * infinito sem "salto" visível, arrasto por touch/mouse e dots. Usa o
 * truque clássico de clonar o primeiro/último slide nas pontas: ao chegar
 * no clone, troca a posição sem transição (imperceptível) e continua.
 */
export function TestimonialWhatsappCarousel({ items, intervalSeconds = 3.5 }: Props) {
  const n = items.length;
  const loop: WhatsappSlide[] = n > 1 ? [items[n - 1]!, ...items, items[0]!] : items;
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const index = useRef(n > 1 ? 1 : 0);
  const animating = useRef(false);
  const [dot, setDot] = useState(0);

  const applyTransform = (withTransition: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = withTransition ? "transform .45s ease" : "none";
    el.style.transform = `translate3d(${-index.current * 100}%,0,0)`;
  };

  useEffect(() => {
    // posiciona no slide real (índice 1, por causa do clone) sem transição
    applyTransform(false);
    setDot(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || n <= 1) return;

    const onEnd = () => {
      animating.current = false;
      if (index.current === loop.length - 1) {
        index.current = 1;
        applyTransform(false);
      } else if (index.current === 0) {
        index.current = n;
        applyTransform(false);
      }
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [n, loop.length]);

  const goTo = (dir: 1 | -1) => {
    if (n <= 1 || animating.current) return;
    animating.current = true;
    index.current += dir;
    applyTransform(true);
    const real = ((index.current - 1 + n) % n + n) % n;
    setDot(real);
  };

  // autoplay + pausa no hover (dá tempo de ler) + pausa durante arrasto
  useEffect(() => {
    if (n <= 1) return;
    let paused = false;
    let dragging = false;
    let startX = 0;
    let dragDx = 0;
    const el = wrapRef.current;
    if (!el) return;

    const timer = window.setInterval(() => {
      if (!paused && !dragging) goTo(1);
    }, intervalSeconds * 1000);

    const getX = (e: TouchEvent | MouseEvent) =>
      "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;

    const onDown = (e: TouchEvent | MouseEvent) => {
      dragging = true;
      startX = getX(e);
      dragDx = 0;
      const trackEl = trackRef.current;
      if (trackEl) trackEl.style.transition = "none";
    };
    const onMove = (e: TouchEvent | MouseEvent) => {
      if (!dragging) return;
      dragDx = getX(e) - startX;
      const trackEl = trackRef.current;
      const wrapW = wrapRef.current?.clientWidth || 1;
      if (trackEl) {
        const pct = (dragDx / wrapW) * 100;
        trackEl.style.transform = `translate3d(calc(${-index.current * 100}% + ${pct}%),0,0)`;
      }
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const wrapW = wrapRef.current?.clientWidth || 1;
      const threshold = wrapW * 0.18;
      if (dragDx <= -threshold) goTo(1);
      else if (dragDx >= threshold) goTo(-1);
      else applyTransform(true);
    };
    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp, { passive: true });
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      window.clearInterval(timer);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, intervalSeconds]);

  const goToDot = (i: number) => {
    if (animating.current || i === dot) return;
    animating.current = true;
    index.current = i + 1;
    applyTransform(true);
    setDot(i);
  };

  return (
    <div className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
      <div ref={wrapRef} className="relative cursor-grab select-none overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] active:cursor-grabbing">
        <div
          ref={trackRef}
          className="flex"
          style={{
            willChange: "transform",
            // Já nasce na posição certa (slide real, não o clone) pra não
            // piscar o clone antes do JS hidratar.
            transform: `translate3d(${-index.current * 100}%,0,0)`,
          }}
        >
          {loop.map((s, i) => (
            <img
              key={`${s.src}-${i}`}
              src={s.src}
              alt={s.alt}
              loading={i <= 2 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="h-auto w-full shrink-0 object-contain"
            />
          ))}
        </div>
      </div>

      {n > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => goToDot(i)}
              aria-label={`Ver depoimento ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === dot ? "w-5 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
