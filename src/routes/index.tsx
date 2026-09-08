import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroWebp640 from "@/assets/opt/banner-640.webp.asset.json";
import heroWebp1240 from "@/assets/opt/banner-1240.webp.asset.json";
import heroAvif640 from "@/assets/opt/banner-640.avif.asset.json";
import heroAvif1240 from "@/assets/opt/banner-1240.avif.asset.json";
import p1 from "@/assets/opt/p-b0f0984490591b39f5f716d9eeb7777a.webp.asset.json";
import p2 from "@/assets/opt/p-c89e421ad752787e42b5e438c94a1220.webp.asset.json";
import p3 from "@/assets/opt/p-e0dfbe3ead389b80337081bc741c9545.webp.asset.json";
import p4 from "@/assets/opt/p-6e0e8d735aecbad446150d34e955de3c.webp.asset.json";
import p5 from "@/assets/opt/p-94ab5b7ef6368f63ce05a34046de0a2b.webp.asset.json";
import p6 from "@/assets/opt/p-5388f1ba2629e6450df7bdea32f1545e.webp.asset.json";
import p7 from "@/assets/opt/p-a742f020551d38a4766a417861ae3255.webp.asset.json";
import familyOld from "@/assets/opt/pf-desenhos.webp.asset.json";
import familyGibis from "@/assets/opt/pf-gibis.webp.asset.json";
import familyLivros from "@/assets/opt/pf-livros.webp.asset.json";
import { PosterCarousel } from "@/components/PosterCarousel";
import { CARTOONS, TOP_CARTOONS } from "@/data/cartoons";

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
        type: "image/avif",
        href: heroAvif640.url,
        media: "(max-width: 700px)",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        as: "image",
        type: "image/avif",
        href: heroAvif1240.url,
        media: "(min-width: 701px)",
        fetchPriority: "high",
      },
    ],
  }),

  component: Index,
});

const CHECKOUT = "https://pay.lowify.com.br/checkout?product_id=trhsz2";
const CHECKOUT_VIP = "https://pay.lowify.com.br/checkout?product_id=aZvoUl";

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
  const target = liveHref.includes("pay.lowify.com.br") ? liveHref : withParams(url);
  window.setTimeout(() => window.location.assign(target), 400);
}







const COLLECTIONS = [
  {
    icon: "👑",
    title: "Princesas Disney",
    items: ["Ariel", "Bela", "Cinderela", "Rapunzel", "Jasmine", "Aurora", "Branca de Neve", "A Princesa e o Sapo"],
  },
  {
    icon: "💖",
    title: "Clássicos inesquecíveis",
    items: ["Barbie", "Polly Pocket", "Moranguinho", "Hello Kitty", "Lilo & Stitch", "Alice no País das Maravilhas"],
  },
  {
    icon: "✨",
    title: "Magia e fantasia",
    items: ["Winx Club", "W.I.T.C.H.", "Sailor Moon", "Ever After High", "LoliRock", "Os Padrinhos Mágicos", "A Vida e as Aventuras de Juniper Lee"],
  },
  {
    icon: "⚡",
    title: "Ação e aventura",
    items: ["Meninas Superpoderosas", "Kim Possible", "She-Ra", "Três Espiãs Demais"],
  },
  {
    icon: "🌟",
    title: "Grandes favoritas",
    items: ["Frozen", "Ladybug", "My Little Pony", "Monster High", "Bratz"],
  },
  {
    icon: "🌈",
    title: "Para as pequenas",
    items: [
      "Dora, a Aventureira",
      "Peppa Pig",
      "Pucca",
      "Princesinha Sofia",
      "Masha e o Urso",
      "Bluey",
      "A Casa Mágica da Gabby",
      "Ursinhos Carinhosos",
      "Minnie Toons",
      "Galinha Pintadinha Mini",
    ],
  },
  {
    icon: "🌸",
    title: "Clássicos e novidades",
    items: [
      "Turma da Mônica",
      "Sakura Card Captors",
      "Tinker Bell",
      "Spirit: Cavalgando Livre",
      "DC Super Hero Girls",
      "LEGO Friends",
      "Rainbow High",
      "L.O.L. Surprise!",
      "Trolls",
      "Lalaloopsy",
    ],
  },
];

function CollectionsAccordion() {
  const [open, setOpen] = useState<string | null>("Princesas Disney");
  return (
    <div className="mt-4 grid grid-cols-1 gap-x-5 md:grid-cols-2">
      {COLLECTIONS.map((c) => {
        const isOpen = open === c.title;
        return (
          <div key={c.title} className="border-b border-[#f7d9e8] last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : c.title)}
              aria-expanded={isOpen}
              className="flex min-h-[54px] w-full items-center gap-3 py-2 text-left"
            >
              <span className="shrink-0 text-[16px]">{c.icon}</span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">
                {c.title}
              </span>
              <span className="shrink-0 rounded-full bg-[#fdeaf4] px-2.5 py-1 text-[12px] font-semibold text-primary">
                {c.items.length} títulos
              </span>
              <span
                className="shrink-0 text-[13px] text-primary transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                aria-hidden
              >
                ▾
              </span>
            </button>
            <div
              className="grid transition-all duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="pb-3 pr-1 text-[13px] leading-6 text-muted-foreground">
                  {c.items.join(" • ")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ACCESS_BENEFITS = [
  { text: "Conteúdo em ", bold: "Full HD 1080p + 4K" },
  { text: "Tudo ", bold: "dublado em português" },
  { text: "Interface simples e organizada" },
  { text: "Encontre facilmente cada desenho e episódio" },
  { text: "Acesso imediato enviado diretamente pelo WhatsApp" },
  { text: "Acesso 100% ", bold: "vitalício" },
  { text: "Pagamento único, ", bold: "sem mensalidades" },
  { text: "Atualizações futuras do acervo sem custo adicional" },
  { text: "Assista pelo celular, tablet, computador ou Smart TV" },
];


const REVIEWS = [
  {
    photo: p1.url,
    initials: "MS",
    name: "Mariana Santos",
    grad: "linear-gradient(135deg,#F65BAE,#D6167E)",
    txt: "Eu amei esse acervo! Cresci assistindo Princesas e Winx e agora posso rever tudo com a minha filha. Que nostalgia, tô apaixonada! 🥹💖",
  },
  {
    photo: p2.url,
    initials: "TS",
    name: "Tauany Silveira",
    grad: "linear-gradient(135deg,#B96CE0,#7E3FD6)",
    txt: "Tô me sentindo criança de novo kkkk maratonei Sailor Moon e Três Espiãs Demais no mesmo dia. Já mandei pra minha irmã!",
  },
  {
    photo: p3.url,
    initials: "JA",
    name: "Juliana Alves",
    grad: "linear-gradient(135deg,#F79BC4,#E0218A)",
    txt: "Gente, entrei ontem e fiquei até tarde vendo os filmes das Princesas e da Barbie. Não consegui parar! Qualidade perfeita e tudo dublado 😍✨",
  },
];

const COMMENTS = [
  {
    photo: p4.url,
    initials: "CM",
    grad: "linear-gradient(135deg,#F65BAE,#C21E77)",
    user: "carol_mendes22",
    txt: "Meninaaa, tava doida pra rever esses filmes com a minha filha e achei tudo aqui 🥰",
    time: "4 h",
  },
  {
    photo: p5.url,
    initials: "BL",
    grad: "linear-gradient(135deg,#C98CE8,#8A46D6)",
    user: "bruna.lima",
    txt: "Ficou muito bom! Fazia anos que eu procurava os filmes antigos dublados e não achava. Recomendo demais!",
    time: "2 h",
  },
  {
    photo: p6.url,
    initials: "AS",
    grad: "linear-gradient(135deg,#F79BC4,#E0218A)",
    user: "amanda_souza",
    txt: "Eu e a minha filha passamos a tarde assistindo Frozen, Ladybug e Moranguinho kkk nostalgia total 💕",
    time: "2 h",
  },
  {
    photo: p7.url,
    initials: "LD",
    grad: "linear-gradient(135deg,#FF9EBB,#D6167E)",
    user: "leticia_dias",
    txt: "Tô simplesmente apaixonada nesse acervo 💖 ficou perfeito",
    time: "2 h",
  },
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

// URL do vídeo da VSL (mp4/hls direto). Deixe vazio para exibir o placeholder.

function VslVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const video = ref.current;
    if (!video) return;
    // Inicia com som a partir do gesto do usuário (permitido pelos navegadores).
    video.muted = false;
    video.volume = 1;
    setStarted(true);
    const p = video.play();
    if (p) p.catch(() => {});
  };

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
      <video
        ref={ref}
        src="/vsl.mp4"
        playsInline
        preload="none"
        controls={started}
        poster="/vsl-cover.webp"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Dar play no vídeo"
          className="absolute inset-0 z-10 h-full w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <img
            src="/vsl-cover.webp"
            alt="Dê o play e conheça todos os desenhos"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </button>
      )}
    </div>
  );
}

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
];

function Divider() {
  return <hr className="my-8 border-0 border-t border-dashed border-border" />;
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

      {tag === "Oferta Exclusiva" && (
        <div className="mt-4">
          <div className="text-[12px] font-bold text-muted-foreground">
            Os 10 desenhos mais pedidos:
          </div>
          <div className="mt-3">
            <PosterCarousel items={TOP_CARTOONS} size="sm" speed={30} hint eager={4} initialBatch={8} />
          </div>
          <div className="mt-3 flex justify-center">
            <span className="rounded-full bg-primary px-3 py-1.5 text-[11.5px] font-bold text-primary-foreground">
              Diversos desenhos no acervo
            </span>
          </div>
        </div>
      )}



      <div className="mt-5 text-[14px] font-bold text-muted-foreground">
        ➡ De: <s className="text-primary/70">R$59,90</s>
      </div>
      <div className="text-[13px] font-semibold text-muted-foreground">Por apenas</div>
      <div className="text-6xl font-extrabold leading-none text-primary">
        <small className="align-super text-2xl font-bold">R$</small>6,90
      </div>

      <button
        type="button"
        onClick={onCta}
        onPointerEnter={preloadFamily}
        onFocus={preloadFamily}
        onTouchStart={preloadFamily}
        className="cta-btn mt-6"
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
            type="image/avif"
            srcSet={`${heroAvif640.url} 640w, ${heroAvif1240.url} 1240w`}
            sizes="(max-width: 600px) 100vw, 600px"
          />
          <source
            type="image/webp"
            srcSet={`${heroWebp640.url} 640w, ${heroWebp1240.url} 1240w`}
            sizes="(max-width: 600px) 100vw, 600px"
          />
          <img
            src={heroWebp640.url}
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

        <LiveViewerBadge />

        {/* VSL */}
        <div className="mx-auto mt-8 w-full max-w-[340px] overflow-hidden rounded-[20px] border-4 border-[#ff2bbd] bg-black shadow-[0_0_22px_rgba(255,43,189,0.55),0_0_8px_rgba(255,43,189,0.35)]">
          <VslVideo />
        </div>
      </section>

      <Divider />

      <OfferCard
        tag="Oferta Exclusiva"
        scarcity="🔥 Valor promocional de lançamento — por tempo limitado"
        title="Os desenhos mais amados, num lugar só"
        cta="QUERO MEU ACESSO POR R$6,90 💖"
        onCta={handleCta}
        note={
          <>
            🔒 Compra 100% segura · PIX na hora
            <br />
            💗 7 dias de garantia — risco zero
          </>
        }
      />
      <p className="mt-4 text-center text-[12.5px] font-medium text-muted-foreground">
        Esse é apenas um valor simbólico para nos ajudar a manter tudo no ar e com qualidade para
        você! 💖
      </p>

      <Divider />

      {/* CARROSSEL DOS DESENHOS */}
      <section>
        <h2 className="text-center text-[20px] font-extrabold text-ink">
          🎬 Nossos desenhos que estão te esperando
        </h2>
        <p className="mt-2 text-center text-[13.5px] font-medium text-muted-foreground">
          Arraste para o lado e veja tudo o que entra no seu acesso 💕
        </p>
        <div className="mt-5">
          <PosterCarousel items={CARTOONS} speed={30} hint deferUntilVisible initialBatch={6} />
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

      <div className="mx-auto mt-5 grid w-full max-w-[960px] grid-cols-1 items-stretch gap-5 md:grid-cols-2">
        {/* CARD 1 — ACERVO */}
        <section className="mx-4 flex flex-col rounded-[22px] border border-[#f7d9e8] bg-card p-5 shadow-[0_10px_30px_-12px_rgba(236,72,153,0.25)] sm:mx-0">
          <h3 className="text-center text-[18px] font-semibold leading-snug text-ink">
            🎬 Coleções completas
          </h3>
          <p className="mt-1 text-center text-[13px] font-medium text-muted-foreground">
            Filmes, séries e temporadas para todas as idades.
          </p>
          <div className="mt-3 flex justify-center">
            <span className="rounded-full bg-[#fdeaf4] px-3.5 py-1.5 text-[12.5px] font-semibold text-primary">
              Toque em uma categoria para ver os títulos
            </span>
          </div>

          <CollectionsAccordion />
        </section>

        {/* CARD 2 — ACESSO + BÔNUS */}
        <section className="card-soft flex w-full max-w-[460px] flex-col p-5 md:mx-0 md:w-full">
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

      <Divider />

      {/* DEPOIMENTOS */}
      <h2 className="text-center text-[20px] font-extrabold text-ink">
        💬 Acompanhe o feedback de quem já garantiu
      </h2>
      <p className="mt-2 text-center text-[13.5px] font-medium text-muted-foreground">
        Acompanhe o depoimento de algumas das milhares de fãs que já garantiram seu acesso ao nosso
        acervo 💕
      </p>

      <div className="mt-5 space-y-3">
        {REVIEWS.map((r) => (
          <div key={r.initials} className="card-soft p-4">
            <div className="flex items-center gap-3">
              <img
                src={r.photo}
                alt={r.name}
                loading="lazy"
                decoding="async"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full border-2 border-primary/40 object-cover object-center"
                style={{ background: r.grad, aspectRatio: "1 / 1" }}
              />

              <div>
                <div className="text-[14px] font-bold text-ink">{r.name}</div>
                <div className="text-[11.5px] text-muted-foreground">· Via Instagram</div>
              </div>
            </div>
            <div className="mt-2 text-[14px] tracking-widest text-[#f5b301]">★★★★★</div>
            <p className="mt-1.5 text-[14px] leading-6 text-ink">{r.txt}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {COMMENTS.map((c) => (
          <div key={c.user} className="flex gap-3">
            <img
              src={c.photo}
              alt={c.user}
              loading="lazy"
              decoding="async"
              width={44}
              height={44}
              className="mt-0.5 h-11 w-11 shrink-0 rounded-full border-2 border-primary/30 object-cover object-center"
              style={{ background: c.grad, aspectRatio: "1 / 1" }}
            />

            <div>
              <div className="text-[13.5px] leading-6 text-ink">
                <b>{c.user}</b> comentou: {c.txt}
              </div>
              <div className="mt-1 text-[11.5px] font-semibold text-muted-foreground">
                <span className="text-primary">♥</span> Responder · {c.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* HISTÓRIA */}
      <section className="card-soft p-5 text-center">
        <h3 className="text-[16px] font-extrabold leading-snug text-ink">
          Sabemos como é difícil encontrar os desenhos da nossa infância em alta qualidade e
          dublados na internet…
        </h3>
        <p className="mt-3 text-[14px] leading-6 text-muted-foreground">
          Por esse motivo nós criamos esse acervo. Reunimos os melhores desenhos para meninas
          completos — das Princesas Disney à Barbie, Winx, Frozen, Sailor Moon e muito mais — na
          melhor qualidade e dublados em português, pra você assistir sempre que quiser 💗
        </p>

      </section>

      <Divider />

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
        cta="GARANTIR MEU ACESSO POR R$6,90 🎀"
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
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-background px-5 pt-8 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-7">
        <div className="mx-auto max-w-[720px]">
          <p className="mx-auto max-w-[460px] text-[13px] leading-5 text-muted-foreground">
            O maior acervo de desenhos para meninas do Brasil. Conteúdo dublado, organizado e com acesso vitalício.
          </p>

          <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] font-bold text-ink">
            <span>Política de Privacidade</span>
            <span className="text-border" aria-hidden="true">|</span>
            <span>Termos de Uso</span>
            <span className="text-border" aria-hidden="true">|</span>
            <span>Contato</span>
          </nav>

          <div className="mx-auto mt-5 w-full max-w-[520px] border-t border-border" />

          <div className="mt-5 space-y-1 text-[12px] leading-5 text-muted-foreground">
            <p>© {new Date().getFullYear()}. Todos os direitos reservados.</p>
            <p>Todo o conteúdo é disponibilizado para uso pessoal dos assinantes.</p>
          </div>
        </div>
      </footer>


      {/* MODAL UPSELL */}
      {modalOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-2"
          style={{ WebkitOverflowScrolling: "touch" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="card-soft relative my-2 h-auto w-[calc(100vw-16px)] max-w-[400px] overflow-y-auto overscroll-contain p-3 text-center short:p-2.5"
            style={{
              maxHeight: "calc(100vh - 16px)",
              maxBlockSize: "calc(100dvh - 16px)",
              WebkitOverflowScrolling: "touch",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-3 -mt-3 h-0 pr-1 text-right">
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

            <h3 className="mt-3 text-[18px] font-extrabold leading-[1.28] text-ink short:text-[16px]">
              Espera! Por só <span className="text-primary">R$3 a mais</span>, você leva também a
              série <span className="text-primary">Life in the Dreamhouse</span> 👇
            </h3>

            <p className="mt-2 text-[12.5px] leading-[1.4] text-muted-foreground">
              Você já vai levar <b className="text-ink">todos os desenhos</b>. Falta a série que as
              meninas mais pedem — e ela não entra na oferta de R$ 6,90.
            </p>

            <div className="relative mt-4 rounded-2xl border-2 border-[#f3b3d5] bg-[#fdeef6] p-4 pt-5 text-left">
              <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-card)]">
                Incluído
              </span>
              <div className="text-[14.5px] font-extrabold leading-snug text-primary">
                🏠 Barbie Life in the Dreamhouse
              </div>
              <p className="mt-1.5 text-[12.5px] leading-5 text-muted-foreground">
                A série completa e dublada: Barbie, Ken, Skipper e Raquelle em episódios curtinhos,
                perfeitos pra maratonar.
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-[#f7d9e8] bg-card p-4 text-left">
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2.5 text-[12.5px] leading-5 text-ink">
                  <span className="shrink-0 text-[15px]">🎨</span>
                  <span>
                    <b className="text-primary">1000 Kits de Colorir</b> — todos desenhos para meninas
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[12.5px] leading-5 text-ink">
                  <span className="shrink-0 text-[15px]">🧩</span>
                  <span>
                    <b className="text-primary">Atividades</b> — caça-palavras, 7 erros e ligue os
                    pontos
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[12.5px] leading-5 text-ink">
                  <span className="shrink-0 text-[15px]">📱</span>
                  <span>
                    <b className="text-primary">Papéis de parede</b> da Barbie pro celular
                  </span>
                </li>
              </ul>
            </div>

            <a
              href={CHECKOUT_VIP}
              onClick={(e) => openCheckout(e, CHECKOUT_VIP)}
              className="cta-btn mt-2.5 min-h-[50px] w-full whitespace-normal text-[14px]"
            >
              SIM! QUERO A SÉRIE + O KIT 🏠
              <span className="mt-0.5 block text-[12px] font-semibold normal-case opacity-90">
                Levar tudo por R$9,90 →
              </span>
            </a>
            <a
              href={CHECKOUT}
              onClick={(e) => openCheckout(e, CHECKOUT)}
              className="mt-2 flex w-full items-center justify-center px-2 text-center text-[12px] font-semibold text-muted-foreground underline"
            >
              Não, quero só assistir por R$6,90.
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
