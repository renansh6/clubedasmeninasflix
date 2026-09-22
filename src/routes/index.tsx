import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import familyOld from "@/assets/opt/pf-desenhos.webp.asset.json";
import familyGibis from "@/assets/opt/pf-gibis.webp.asset.json";
import familyLivros from "@/assets/opt/pf-livros.webp.asset.json";
import { PosterCarousel } from "@/components/PosterCarousel";
import { TestimonialWhatsappCarousel } from "@/components/TestimonialWhatsappCarousel";
import { CARTOONS } from "@/data/cartoons";

const WHATSAPP_TESTIMONIALS = Array.from({ length: 7 }, (_, i) => ({
  src: `/depoimentos/whatsapp-${i + 1}.webp`,
  alt: `Print de conversa no WhatsApp com depoimento de uma cliente ${i + 1}`,
}));

// Ordem fixa dos primeiros cards de cada fileira do carrossel de 3 linhas
// (sempre os mesmos, na mesma ordem, já no primeiro carregamento da página).
const ROW_1_START_IDS = [
  "barbie",
  "winx",
  "princesas",
  "superpoderosas",
  "espias",
  "moranguinho",
  "polly",
  "kim",
];
const ROW_2_START_IDS = [
  "frozen",
  "ladybug",
  "hellokitty",
  "pony",
  "tinker",
  "sofia",
  "bluey",
  "gabby",
];
const ROW_3_START_IDS = [
  "monsterhigh",
  "bratz",
  "sailor",
  "sakura",
  "lilo",
  "everafter",
  "pucca",
  "witch",
];

const CARTOONS_BY_ID = new Map(CARTOONS.map((c) => [c.id, c]));
const STARTING_IDS = new Set([...ROW_1_START_IDS, ...ROW_2_START_IDS, ...ROW_3_START_IDS]);
// Desenhos restantes, na ordem original do catálogo, distribuídos em
// round-robin entre as 3 fileiras pra completar cada uma até o fim.
const REMAINING_CARTOONS = CARTOONS.filter((c) => !STARTING_IDS.has(c.id));

const CARTOONS_ROW_1 = [
  ...ROW_1_START_IDS.map((id) => CARTOONS_BY_ID.get(id)!),
  ...REMAINING_CARTOONS.filter((_, i) => i % 3 === 0),
];
const CARTOONS_ROW_2 = [
  ...ROW_2_START_IDS.map((id) => CARTOONS_BY_ID.get(id)!),
  ...REMAINING_CARTOONS.filter((_, i) => i % 3 === 1),
];
const CARTOONS_ROW_3 = [
  ...ROW_3_START_IDS.map((id) => CARTOONS_BY_ID.get(id)!),
  ...REMAINING_CARTOONS.filter((_, i) => i % 3 === 2),
];

const HERO_WEBP_640 = "/hero/banner-640.webp";
const HERO_WEBP_1240 = "/hero/banner-1240.webp";

const FAMILY_ITEMS = [
  { title: "Desenhos nostálgicos", img: familyOld.url, w: 200, h: 112 },
  { title: "Gibis digitais", img: familyGibis.url, w: 200, h: 125 },
  { title: "Livros digitais", img: familyLivros.url, w: 200, h: 275 },
];

let familyPreloaded = false;
function preloadFamily() {
  if (familyPreloaded || typeof window === "undefined") return;
  familyPreloaded = true;
  FAMILY_ITEMS.forEach((it) => {
    const img = new Image();
    img.decoding = "async";
    img.src = it.img;
  });
}




export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Maior Coleção de Desenhos para Meninas do Brasil" },
      {
        name: "description",
        content:
          "Assista aos desenhos mais amados, dublados em português e em alta qualidade. Acesso vitalício, pagamento único e atualizações sem mensalidade.",
      },
      { property: "og:title", content: "A Maior Coleção de Desenhos para Meninas do Brasil" },
      {
        property: "og:description",
        content:
          "Princesas, Barbie, Winx, Moranguinho, Três Espiãs Demais e muitos outros desenhos reunidos em um só lugar.",
      },

      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        type: "image/webp",
        href: HERO_WEBP_640,
        media: "(max-width: 700px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        type: "image/webp",
        href: HERO_WEBP_1240,
        media: "(min-width: 701px)",
        fetchPriority: "high",
      },
    ],
  }),

  component: Index,
});

const CHECKOUT = "https://checkout.lowify.com.br/checkout.php?product_id=trhsz2";
const CHECKOUT_VIP = "https://checkout.lowify.com.br/checkout.php?product_id=aZvoUl";

// Fallback: mantém os parâmetros da URL da LP (ex.: UTMs) no link do checkout
// caso o script de UTMs da UTMify ainda não tenha reescrito o href.
function withParams(url: string) {
  try {
    const search = window.location.search.replace(/^\?/, "");
    if (!search) return url;
    const target = new URL(url);
    new URLSearchParams(search).forEach((v, k) => {
      if (!target.searchParams.has(k)) target.searchParams.set(k, v);
    });
    return target.toString();
  } catch {
    return url;
  }
}

// Abre o checkout de forma determinística. A navegação padrão do <a> (mutar o
// href no onClick e deixar o browser navegar) falha de forma intermitente nos
// webviews do Instagram/Facebook e ao voltar do checkout pelo botão "voltar"
// (página restaurada do bfcache). Aqui prevenimos o default e navegamos na mão.
//
// IMPORTANTE: navegamos para o href ATUAL do link, não para a URL fixa. O
// utms/latest.js da UTMify reescreve o href com sck/xcod/subid/utm_* — é isso
// que o Lowify devolve no webhook para a UTMify casar a venda. Reconstruir a
// URL a partir da constante descartava esses parâmetros. withParams() só entra
// como fallback se o href ainda não estiver decorado.
//
// O clique ainda propaga até o listener da UTMify (pixel.js), que dispara o
// InitiateCheckout com um fetch assíncrono. Damos ~400ms antes de trocar a URL
// pra esse request (e o beacon do Meta Pixel) saírem antes da navegação.
function openCheckout(e: React.MouseEvent<HTMLAnchorElement>, url: string) {
  e.preventDefault();
  const liveHref = e.currentTarget?.href ?? "";
  const target = liveHref.includes("lowify.com.br") ? liveHref : withParams(url);
  window.setTimeout(() => window.location.assign(target), 400);
}







const ACCESS_BENEFITS = [
  { text: "Conteúdo em ", bold: "Full HD + 4K" },
  { text: "Tudo ", bold: "dublado em português" },
  { text: "Sem anúncios" },
  { text: "Encontre facilmente cada desenho e episódio" },
  { text: "Acesso imediato enviado diretamente pelo WhatsApp" },
  { text: "Acesso 100% ", bold: "vitalício e sem mensalidades" },
  { text: "Pagamento único, ", bold: "sem mensalidades" },
  { text: "Atualizações semanais do acervo sem custo adicional" },
  { text: "Suporte premium 24/7" },
  { text: "Assista pelo celular, tablet, computador ou Smart TV" },
];


const BUYERS = [
  "Amanda de São Paulo",
  "Juliana do Rio de Janeiro",
  "Patrícia de Belo Horizonte",
  "Camila de Curitiba",
  "Fernanda de Salvador",
  "Larissa de Recife",
  "Bruna de Porto Alegre",
];

function useLiveViewerCount(base = 441) {
  const [count, setCount] = useState(base);

  useEffect(() => {
    let current = base;
    const min = 380;
    const max = 520;

    const tick = () => {
      const change = Math.floor(Math.random() * 9) - 4; // -4 a +4
      current = Math.max(min, Math.min(max, current + change));
      setCount(current);
    };

    const interval = setInterval(tick, 900 + Math.random() * 700);
    return () => clearInterval(interval);
  }, [base]);

  return count;
}

function LiveViewerBadge() {
  const count = useLiveViewerCount(441);
  return (
    <div className="mt-4 flex justify-center">
      <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-[13px] font-semibold text-muted-foreground shadow-[var(--shadow-card)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <b className="text-primary min-w-[2ch] tabular-nums">{count}</b> pessoas assistindo agora
      </div>
    </div>
  );
}

/**
 * Player da VSL: mostra a capa (poster) com botão de play em destaque;
 * começa parado, sem som automático. Ao tocar, dá play com áudio (gesto do
 * usuário — os navegadores permitem) e revela os controles nativos.
 */
function VslPlayer() {
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
    <div className="relative h-full w-full">
      <video
        ref={ref}
        src="/videos/vsl.mp4"
        poster="/videos/vsl-poster.webp"
        playsInline
        preload="metadata"
        controls={started}
        className="absolute inset-0 h-full w-full object-contain"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Assistir ao vídeo"
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

const FAQ = [
  {
    q: "Como funciona o acesso?",
    a: "Depois da compra você recebe o link e as instruções por e-mail e WhatsApp, e já pode entrar na biblioteca de desenhos.",
  },
  {
    q: "É pagamento único ou mensalidade?",
    a: "É pagamento único. Você paga uma vez e não tem mensalidade.",
  },
  {
    q: "Onde consigo assistir?",
    a: "Em dispositivos compatíveis: celular, tablet, computador e TVs que abrem navegador. Não precisa instalar nada complicado.",
  },
  {
    q: "O acesso é vitalício?",
    a: "É sim. Você paga uma única vez e continua com acesso para sempre, sem mensalidade.",
  },
  {
    q: "Tem atualizações?",
    a: "Sim. O acervo recebe novos títulos periodicamente, sem custo adicional para quem já comprou.",
  },
  {
    q: "O conteúdo está em português?",
    a: "Sim! Tudo é 100% em português — desenhos, além da plataforma inteira traduzida.",
  },
  {
    q: "Não recebi meu acesso",
    a: (
      <>
        <p>
          Calma, ele não se perdeu ❤️ O acesso é enviado <b className="text-ink">na hora da compra</b>,
          para o e-mail <b className="text-ink">e</b> para o número de celular que você digitou no
          momento do pagamento. Vamos conferir juntas:
        </p>
        <ol className="mt-3 flex flex-col gap-3">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              1
            </span>
            <span>
              Abra o <b className="text-ink">e-mail</b> que você usou na compra — não o seu
              principal, e sim o que foi digitado ali.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              2
            </span>
            <span>
              Olhe nas abas <b className="text-ink">Promoções</b>, <b className="text-ink">Social</b>{" "}
              e <b className="text-ink">Spam / Lixo eletrônico</b>. É muito comum ele cair numa
              dessas.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              3
            </span>
            <span>
              Confira o <b className="text-ink">WhatsApp do número</b> que você preencheu na compra —
              às vezes é um número antigo ou com um dígito trocado.
            </span>
          </li>
        </ol>
        <div className="mt-3 rounded-xl border border-[#f0c98a] bg-[#fff6e6] p-3 text-[13px] leading-5">
          <b className="text-[#a8681a]">Trocou um número ou uma letra sem querer?</b> Acontece muito,
          e tem conserto — a gente reenvia pra você em minutos. É só chamar aqui embaixo.
        </div>
      </>
    ),
  },
  {
    q: "Mudei de ideia. E agora?",
    a: (
      <>
        <p>
          Sem problema nenhum, de verdade. Você tem{" "}
          <b className="text-ink">7 dias de garantia incondicional</b>: se sentir que não valeu a
          pena, devolvemos <b className="text-ink">100% do valor</b>, sem perguntas e sem burocracia.
        </p>
        <p className="mt-3">
          Mas antes, me dá uma chance? 💗 Muita coisa que parece um problemão aqui é só um
          detalhezinho que a gente resolve em minutos. Me chama que eu cuido disso com você.
        </p>
      </>
    ),
  },
];

function Divider({ className = "my-8" }: { className?: string }) {
  return <hr className={`${className} border-0 border-t border-dashed border-border`} />;
}


function OfferCard({
  tag,
  scarcity,
  title,
  cta,
  note,
  onCta,
}: {
  tag: string;
  scarcity?: string;
  title: string;
  cta: string;
  note: React.ReactNode;
  onCta: (e: React.MouseEvent) => void;
}) {
  return (
    <section className="card-soft px-5 py-7 text-center sm:px-7">
      <div className="font-script text-4xl leading-none text-primary">{tag}</div>
      {scarcity && (
        <div className="mx-auto mt-3 inline-block rounded-full border border-[#f0c98a] bg-[#fff6e6] px-4 py-2 text-[12px] font-bold text-[#a8681a]">
          {scarcity}
        </div>
      )}
      <h3 className="mt-4 text-[17px] font-extrabold uppercase leading-snug text-ink">{title}</h3>

      <div className="mt-3 text-[14px] font-bold text-muted-foreground">
        ➡ De: <s className="text-primary/70">R$29,90</s>
      </div>
      <div className="text-[13px] font-semibold text-muted-foreground">Por apenas</div>
      <div className="text-6xl font-extrabold leading-none text-primary">
        <small className="align-super text-2xl font-bold">R$</small>9,90
      </div>

      <button
        type="button"
        onClick={onCta}
        onPointerEnter={preloadFamily}
        onFocus={preloadFamily}
        onTouchStart={preloadFamily}
        className="cta-btn mt-4"
      >
        {cta}
      </button>
      <div className="mt-3 text-[12px] font-semibold leading-relaxed text-muted-foreground">
        {note}
      </div>
    </section>
  );
}

function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Ao voltar do checkout pelo botão "voltar", a página costuma ser restaurada do
  // bfcache com o estado congelado (modal aberto, handlers "presos"). Forçamos um
  // reload nesse caso para a LP reiniciar limpa e os botões voltarem a funcionar.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      if (overlayRef.current) overlayRef.current.scrollTop = 0;
      if (modalRef.current) modalRef.current.scrollTop = 0;
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  // pré-carrega as miniaturas do pop-up só depois do conteúdo principal, em tempo ocioso
  useEffect(() => {
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    let idle = 0;
    let timer = 0;
    const start = () => {
      const ric = (window as unknown as {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      }).requestIdleCallback;
      if (ric) idle = ric(preloadFamily, { timeout: 4000 });
      else timer = window.setTimeout(preloadFamily, 2500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback;
      if (idle && cic) cic(idle);
    };
  }, []);


  useEffect(() => {
    let i = 0;
    const show = () => {
      setToast(BUYERS[i % BUYERS.length] ?? null);
      i++;
      window.setTimeout(() => setToast(null), 5000);
    };
    const first = window.setTimeout(show, 4000);
    const interval = window.setInterval(show, 14000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, []);

  const handleCta = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <main className="mx-auto w-full max-w-[620px] px-4 py-6">
      {/* HERO */}
      <section className="-mx-4 -mt-6">
        <picture>
          <source
            type="image/webp"
            srcSet={`${HERO_WEBP_640} 640w, ${HERO_WEBP_1240} 1240w`}
            sizes="(max-width: 600px) 100vw, 600px"
          />
          <img
            src={HERO_WEBP_640}
            alt="A maior coleção de desenhos para meninas do Brasil"
            width={1200}
            height={800}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              display: "block",
              margin: "0 auto",
              objectFit: "initial",
              borderRadius: "0 0 24px 24px",
              aspectRatio: "3 / 2",
            }}
          />
        </picture>


        <h1 className="mt-5 text-center text-[17px] font-semibold leading-relaxed text-ink">
          Agora você pode assistir aos{" "}
          <b className="text-primary">desenhos mais amados de todos os tempos</b>, dublados em
          português e em alta qualidade! 💖
        </h1>

        <p
          className="mt-3 whitespace-nowrap text-center font-extrabold text-primary"
          style={{ fontSize: "clamp(13px, 4vw, 20px)" }}
        >
          Mais de 500 desenhos para você maratonar!
        </p>

        <LiveViewerBadge />
      </section>

      <Divider />

      <div className="text-center">
        <p
          className="mb-3 whitespace-nowrap font-bold text-ink"
          style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(15px, 4.6vw, 22px)" }}
        >
          Veja como a plataforma funciona por dentro ✨
        </p>
        <div
          className="mx-auto w-[90%] max-w-[400px] overflow-hidden rounded-2xl"
          style={{ aspectRatio: "9 / 16" }}
        >
          <VslPlayer />
        </div>

        <button
          type="button"
          onClick={handleCta}
          onPointerEnter={preloadFamily}
          onFocus={preloadFamily}
          onTouchStart={preloadFamily}
          className="cta-btn mt-4"
        >
          QUERO MEU ACESSO AGORA POR R$9,90 💖
        </button>
      </div>

      <Divider />

      {/* CARROSSEL DOS DESENHOS */}
      <section>
        <h2 className="text-center text-[20px] font-extrabold text-ink">
          🎬 Olha tudo o que você vai encontrar no seu acesso
        </h2>
        <p className="mt-2 text-center text-[13.5px] font-medium text-muted-foreground">
          Arraste para o lado e veja tudo o que entra no seu acesso 💕
        </p>
        <div className="mt-5 space-y-3">
          <PosterCarousel
            items={CARTOONS_ROW_1}
            speed={48}
            direction="left"
            hint
            deferUntilVisible
            initialBatch={18}
          />
          <PosterCarousel
            items={CARTOONS_ROW_2}
            speed={48}
            direction="right"
            deferUntilVisible
            initialBatch={18}
          />
          <PosterCarousel
            items={CARTOONS_ROW_3}
            speed={48}
            direction="left"
            deferUntilVisible
            initialBatch={18}
          />
        </div>
      </section>


      <Divider />

      {/* O QUE RECEBE - CARDS GRANDES */}
      <h2 className="text-center text-[20px] font-extrabold text-ink">
        👑 Você recebe imediatamente tudo isso:
      </h2>
      <p className="mt-2 text-center text-[13.5px] font-medium text-muted-foreground">
        💌 Assim que o acesso for liberado, tudo isso é seu no WhatsApp:
      </p>

      <div className="mx-auto mt-5 w-full max-w-[460px] px-4 sm:px-0">
        <section className="card-soft flex w-full flex-col p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
              🔓
            </span>
            <h3 className="text-[16px] font-extrabold uppercase leading-snug text-ink">
              Seu acesso inclui
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {ACCESS_BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-[16px] text-primary">✓</span>
                <span className="text-[14px] leading-6 text-ink">
                  {b.text}
                  {b.bold && <b className="text-ink">{b.bold}</b>}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Divider className="my-5" />

      {/* DEPOIMENTOS */}
      <h2 className="text-center text-[20px] font-extrabold text-ink">
        💬 Acompanhe o feedback de quem já garantiu
      </h2>
      <div className="mt-5">
        <TestimonialWhatsappCarousel items={WHATSAPP_TESTIMONIALS} />
      </div>

      <Divider className="my-5" />

      {/* APARELHOS */}
      <div className="text-center">
        <p className="text-[13px] font-bold text-muted-foreground">Assista em qualquer aparelho</p>
        <div className="mt-3 flex justify-center gap-8">
          {[
            {
              label: "Celular",
              path: (
                <>
                  <rect x="6" y="2" width="12" height="20" rx="3" />
                  <line x1="10" y1="18.5" x2="14" y2="18.5" />
                </>
              ),
            },
            {
              label: "Notebook",
              path: (
                <>
                  <rect x="4" y="4" width="16" height="12" rx="1.5" />
                  <path d="M2 20h20" />
                  <path d="M9.5 20l.7-2h3.6l.7 2" />
                </>
              ),
            },
            {
              label: "Smart TV",
              path: (
                <>
                  <rect x="3" y="4" width="18" height="13" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </>
              ),
            },
          ].map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                {d.path}
              </svg>
              <span className="text-[12px] font-semibold text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mb-2 mt-8 text-center text-[14px] font-bold text-primary">
        Não perca essa nostalgia 💖
      </p>
      <OfferCard
        tag="Última chamada"
        title="Reviva a magia dos seus desenhos favoritos ainda hoje"
        cta="GARANTIR MEU ACESSO POR R$9,90 🎀"
        onCta={handleCta}
        note={<>🔒 Compra 100% segura · 💗 7 dias de garantia incondicional</>}
      />

      <Divider />

      {/* FAQ */}
      <section className="cv-auto">
        <div className="flex justify-center">
          <span className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-secondary-foreground">
            Dúvidas
          </span>
        </div>
        <h2 className="mt-3 text-center text-[22px] font-extrabold uppercase text-ink">
          Perguntas frequentes
        </h2>
        <div className="mt-5 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="card-soft group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-bold text-ink">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-2 text-[13px] leading-6 text-muted-foreground">{f.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-background px-5 pt-10 pb-7 text-center sm:px-8">
        <div className="mx-auto max-w-[720px]">
          <div className="flex items-baseline justify-center leading-none">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-ink">
              Clube das Meninas
            </span>
            <span className="text-[34px] font-extrabold uppercase tracking-tight text-primary">
              Flix
            </span>
          </div>

          <h3 className="mt-6 text-[20px] font-extrabold text-primary">
            7 Dias de garantia incondicional
          </h3>
          <p className="mx-auto mt-2 max-w-[380px] text-[13px] leading-5 text-muted-foreground">
            Caso decida que não valeu a pena, você pode pedir um reembolso em até 7 dias depois da
            compra e receber 100% do seu investimento de volta, sem perguntas ou burocracias.
          </p>

          <hr className="my-6 border-0 border-t border-dashed border-border" />

          <p className="text-[14px] font-medium text-ink">Tem alguma dúvida? A gente te ajuda ❤️</p>

          <a
            href="https://wa.me/5519994613334"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-[#fdeef6] px-5 py-2.5 text-[14px] font-bold text-primary"
          >
            <span aria-hidden="true">💬</span> Falar com a gente
          </a>

          <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
            <span>Termos de uso</span>
            <span aria-hidden="true">·</span>
            <span>Privacidade</span>
          </nav>

          <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
            © {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
        </div>
      </footer>


      {/* MODAL UPSELL */}
      {modalOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-2"
          style={{ WebkitOverflowScrolling: "touch" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="card-soft relative my-2 h-auto w-[calc(100vw-16px)] max-w-[400px] overflow-y-auto overscroll-contain border-2 border-primary p-3.5 text-center short:p-2.5"
            style={{
              maxHeight: "calc(100vh - 16px)",
              maxBlockSize: "calc(100dvh - 16px)",
              WebkitOverflowScrolling: "touch",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-3.5 -mt-3.5 h-0 pr-1 text-right short:-mx-2.5 short:-mt-2.5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="h-11 w-11 text-2xl leading-none text-muted-foreground"
              >
                ×
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eab543] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[#5c3c00]">
              🏠 Série exclusiva incluída
            </span>

            <h3 className="mt-3 text-[17px] font-extrabold leading-[1.3] text-ink short:mt-2.5 short:text-[15px]">
              Espera! Por só <span className="text-primary">R$10 a mais</span>, você leva também a
              série <span className="text-primary">Life in the Dreamhouse</span> 👇
            </h3>

            <p className="mt-2 text-[12.5px] leading-[1.35] text-muted-foreground">
              Você já vai levar <b className="text-ink">todos os desenhos</b>. Falta a série que as
              meninas mais pedem — e ela não entra na oferta de R$9,90.
            </p>

            <div className="relative mt-3.5 rounded-2xl border-2 border-[#f3b3d5] bg-[#fdeef6] p-3.5 pt-4.5 text-left">
              <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-card)]">
                Incluído
              </span>
              <div className="text-[13.5px] font-extrabold leading-snug text-primary">
                🏠 Barbie Life in the Dreamhouse
              </div>
              <p className="mt-1 text-[12px] leading-[1.35] text-muted-foreground">
                A série completa e dublada: Barbie, Ken, Skipper e Raquelle em episódios curtinhos,
                perfeitos pra maratonar.
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-[#f7d9e8] bg-card p-3.5 text-left">
              <ul className="flex flex-col gap-2.5">
                <li className="flex items-start gap-2.5 text-[12.5px] leading-[1.4] text-ink">
                  <span className="shrink-0 text-[15px]">🧩</span>
                  <span>
                    <b className="text-primary">Atividades</b> — caça-palavras, 7 erros e ligue os
                    pontos
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[12.5px] leading-[1.4] text-ink">
                  <span className="shrink-0 text-[15px]">📱</span>
                  <span>
                    <b className="text-primary">Papéis de parede</b> da Barbie pro celular
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[12.5px] leading-[1.4] text-ink">
                  <span className="shrink-0 text-[15px]">🎀</span>
                  <span>
                    <b className="text-primary">Carteirinha de Princesa</b> pra imprimir
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-3">
              <div className="text-[12.5px] font-semibold text-muted-foreground">
                De <s className="text-primary/70">R$29,90</s> por apenas +R$10
              </div>
              <div className="text-[26px] font-extrabold leading-none text-primary">
                <small className="align-super text-sm font-bold">R$</small>19,90
              </div>
            </div>

            <a
              href={CHECKOUT_VIP}
              onClick={(e) => openCheckout(e, CHECKOUT_VIP)}
              className="cta-btn mt-3 min-h-[48px] w-full whitespace-normal text-[14px]"
            >
              SIM! QUERO A SÉRIE + O KIT 🏠
              <span className="mt-0.5 block text-[12px] font-semibold normal-case opacity-90">
                Levar tudo por R$19,90 →
              </span>
            </a>
            <a
              href={CHECKOUT}
              onClick={(e) => openCheckout(e, CHECKOUT)}
              className="mt-4 flex w-full items-center justify-center px-2 text-center text-[13.5px] font-semibold text-muted-foreground underline"
            >
              Não, quero só assistir por R$9,90.
            </a>
          </div>
        </div>
      )}


      {/* TOAST DE PROVA SOCIAL */}
      {toast && (
        <div
          className="card-soft fixed bottom-4 left-4 z-40 flex max-w-[300px] items-center gap-3 p-3"
          style={{ animation: "toast-in .35s ease" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
            {toast.charAt(0)}
          </div>
          <div className="text-[12.5px] leading-5 text-ink">
            <b>{toast}</b> acabou de garantir o acesso 💖
          </div>
        </div>
      )}
    </main>
  );
}
