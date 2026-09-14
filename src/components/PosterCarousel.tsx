import { useEffect, useRef, useState } from "react";
import type { Cartoon } from "@/data/cartoons";

type Props = {
  items: Cartoon[];
  /** pixels por segundo do movimento automático */
  speed?: number;
  size?: "sm" | "md";
  /** mostra a etiqueta "deslize para o lado" acima do carrossel */
  hint?: boolean;
  /** quantas capas carregam com prioridade normal já na abertura */
  eager?: number;
  /** só começa a baixar as capas quando a seção estiver perto da tela */
  deferUntilVisible?: boolean;
  /** quantas capas carregam no primeiro lote quando fica visível */
  initialBatch?: number;
};

function SwipeHint({ size }: { size?: "sm" | "md" }) {
  return (
    <div className={`flex justify-center ${size === "sm" ? "mb-1.5" : "mb-2"}`}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-[12px] font-semibold text-secondary-foreground">
        <span className="sm:hidden">Deslize para o lado e veja mais</span>
        <span className="hidden sm:inline">Arraste para o lado e veja mais</span>
        <span className="swipe-hint-icon inline-block text-[11px]">→</span>
      </span>
    </div>
  );
}

function fadeIn(img: HTMLImageElement | null) {
  if (img && img.complete) img.style.opacity = "1";
}

/**
 * Carrossel infinito baseado em transform (compatível com iOS Safari).
 * Evita scrollLeft + momentum scrolling, que trava/reseta no iOS.
 */
export function PosterCarousel({
  items,
  speed = 30,
  size = "md",
  hint = false,
  eager = 4,
  deferUntilVisible = false,
  initialBatch = 8,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const halfWidth = useRef(0);
  const paused = useRef(false);
  const [loadCount, setLoadCount] = useState(deferUntilVisible ? 0 : initialBatch);

  // dispara o carregamento quando a seção se aproxima da tela
  useEffect(() => {
    if (!deferUntilVisible) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoadCount(initialBatch);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoadCount((c) => Math.max(c, initialBatch));
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [deferUntilVisible, initialBatch]);

  // carrega as próximas capas progressivamente, antes de entrarem na tela
  useEffect(() => {
    if (loadCount === 0 || loadCount >= items.length) return;
    const t = window.setTimeout(() => setLoadCount((c) => Math.min(items.length, c + 4)), 700);
    return () => window.clearTimeout(t);
  }, [loadCount, items.length]);


  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    let last = 0;
    let resumeTimer = 0;

    const measure = () => {
      halfWidth.current = el.scrollWidth / 2;
    };
    measure();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);

    const normalize = () => {
      const half = halfWidth.current;
      if (half <= 0) return;
      while (offset.current <= -half) offset.current += half;
      while (offset.current > 0) offset.current -= half;
    };

    const step = (now: number) => {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused.current) {
        if (halfWidth.current <= 0) measure();
        offset.current -= speed * dt;
        normalize();
        el.style.transform = `translate3d(${offset.current}px,0,0)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // arrastar com o dedo / mouse (touch events funcionam no iOS antigo também)
    let dragging = false;
    let startX = 0;
    let startOffset = 0;

    const getX = (e: TouchEvent | MouseEvent) =>
      "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;

    const down = (e: TouchEvent | MouseEvent) => {
      dragging = true;
      paused.current = true;
      window.clearTimeout(resumeTimer);
      startX = getX(e);
      startOffset = offset.current;
    };
    const move = (e: TouchEvent | MouseEvent) => {
      if (!dragging) return;
      offset.current = startOffset + (getX(e) - startX);
      normalize();
      el.style.transform = `translate3d(${offset.current}px,0,0)`;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      resumeTimer = window.setTimeout(() => {
        paused.current = false;
        last = 0;
      }, 2000);
    };

    // desktop: pausa enquanto o mouse está sobre o carrossel
    const enter = () => {
      paused.current = true;
      window.clearTimeout(resumeTimer);
    };
    const leave = () => {
      if (dragging) return;
      resumeTimer = window.setTimeout(() => {
        paused.current = false;
        last = 0;
      }, 300);
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    el.addEventListener("touchstart", down, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", up, { passive: true });
    el.addEventListener("touchcancel", up, { passive: true });
    el.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    const onVisibility = () => {
      last = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resumeTimer);
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      el.removeEventListener("touchstart", down);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", up);
      el.removeEventListener("touchcancel", up);
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [speed, items.length]);

  // dimensões fixas do pôster mantendo proporção 3:4
  const dims = size === "sm" ? "w-[104px] h-[139px]" : "w-[132px] h-[176px]";
  const textSize = size === "sm" ? "text-[12px]" : "text-[13px]";
  const captionWidth = size === "sm" ? "w-[104px]" : "w-[132px]";
  const loop = [...items, ...items];

  return (
    <div ref={wrapRef}>
      {hint && <SwipeHint size={size} />}
      <div className="overflow-hidden pb-4 [-webkit-mask-image:linear-gradient(90deg,transparent,black_2%,black_88%,transparent_99.5%)] [mask-image:linear-gradient(90deg,transparent,black_2%,black_88%,transparent_99.5%)]">
        <div
          ref={trackRef}
          className="flex cursor-grab select-none gap-3 will-change-transform active:cursor-grabbing"
          style={{ touchAction: "pan-y", WebkitUserSelect: "none" }}
        >
          {loop.map((c, i) => {
            const base = i % items.length;
            const show = base < loadCount;
            const isEager = base < eager && !deferUntilVisible;
            return (
              <figure
                key={`${c.id}-${i}`}
                className="relative flex shrink-0 min-w-0 flex-col items-center gap-1.5"
              >
                <div
                  className={`relative shrink-0 overflow-hidden rounded-xl shadow-[0_6px_16px_-8px_oklch(0.6_0.245_348_/_0.6)] ${dims}`}
                  style={{ background: c.grad }}
                >
                  {c.image && show ? (
                    <img
                      ref={fadeIn}
                      src={c.image}
                      alt={`Capa de ${c.name}`}
                      width={c.w}
                      height={c.h}
                      loading={isEager ? "eager" : "lazy"}
                      fetchPriority={isEager ? "auto" : "low"}
                      decoding="async"
                      draggable={false}
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      style={{ opacity: 0, transition: "opacity .25s ease" }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <figcaption className="flex h-full w-full items-end p-2 text-left text-[11px] font-extrabold leading-tight text-white drop-shadow">
                      {!c.image ? c.name : ""}
                    </figcaption>
                  )}
                </div>
                <figcaption
                  className={`${textSize} ${captionWidth} min-h-[2.75em] px-1 text-center font-semibold leading-snug text-ink line-clamp-2`}
                >
                  {c.name}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );

}
