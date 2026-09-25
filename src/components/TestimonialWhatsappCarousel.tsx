import { useEffect, useRef, useState } from "react";

export type WhatsappSlide = {
  src: string;
  alt: string;
  /** Poster do vídeo (obrigatório quando o slide é um vídeo). */
  poster?: string;
  type?: "image" | "video";
};

type Props = {
  items: WhatsappSlide[];
};

/**
 * Player do depoimento em vídeo: mesmo padrão da VSL — mostra a capa com
 * botão de play; começa parado e sem som, e ao tocar dá play com áudio.
 */
function TestimonialVideoSlide({ slide }: { slide: WhatsappSlide }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = false;
    setStarted(true);
    const p = video.play();
    if (p) p.catch(() => {});
  };

  return (
    <div className="relative aspect-[9/16] w-full shrink-0 bg-black">
      <video
        ref={ref}
        src={slide.src}
        poster={slide.poster}
        playsInline
        preload="metadata"
        controls={started}
        className="absolute inset-0 h-full w-full object-contain"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Assistir ao depoimento em vídeo"
          className="absolute inset-0 z-10 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-black/10 p-0"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-[var(--shadow-cta)]">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-primary-foreground">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * Carrossel de 1 print por vez (prints de WhatsApp), estático — o lead passa
 * os cards manualmente (arrasto por touch/mouse ou dots). Loop infinito sem
 * "salto" visível: usa o truque clássico de clonar o primeiro/último slide
 * nas pontas; ao chegar no clone, troca a posição sem transição
 * (imperceptível) e continua.
 */
export function TestimonialWhatsappCarousel({ items }: Props) {
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
    el.style.transition = withTransition ? "transform .6s ease" : "none";
    el.style.transform = `translate3d(${-index.current * 100}%,0,0)`;
  };

  // Reconduz index.current pro intervalo real [1, n] (fora dos clones nas
  // pontas). Cobre não só os clones (index 0 / loop.length-1), mas qualquer
  // valor fora disso: arrastos rápidos em sequência cancelam a transição
  // anterior em onDown antes do "transitionend" corrigir a posição, e cada
  // cancelamento permite goTo incrementar index.current de novo — sem essa
  // normalização ele soma indefinidamente e o track acaba mostrando um
  // trecho vazio, além do último slide (tela "sumindo").
  const normalizeIndex = () => {
    if (n <= 1) return;
    const real = (((index.current - 1) % n) + n) % n;
    index.current = real + 1;
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
      if (index.current >= loop.length - 1 || index.current <= 0) {
        normalizeIndex();
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

  // arrasto por touch/mouse (sem autoplay — o lead passa os cards manualmente)
  useEffect(() => {
    if (n <= 1) return;
    let dragging = false;
    let startX = 0;
    let dragDx = 0;
    const el = wrapRef.current;
    if (!el) return;

    const getX = (e: TouchEvent | MouseEvent) =>
      "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;

    const onDown = (e: TouchEvent | MouseEvent) => {
      dragging = true;
      // Se o arrasto começar bem no meio da troca automática de slide, a
      // transição em andamento fica "congelada" numa posição que não bate
      // com index.current. Cancela a transição e realinha pra posição
      // limpa antes de começar a arrastar, senão o carrossel pode ficar
      // travado entre dois prints depois do gesto.
      animating.current = false;
      normalizeIndex();
      applyTransform(false);
      startX = getX(e);
      dragDx = 0;
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

    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp, { passive: true });
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

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
          {loop.map((s, i) =>
            s.type === "video" ? (
              <TestimonialVideoSlide key={`${s.src}-${i}`} slide={s} />
            ) : (
              <img
                key={`${s.src}-${i}`}
                src={s.src}
                alt={s.alt}
                loading={i <= 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="h-auto w-full shrink-0 object-contain"
              />
            ),
          )}
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
