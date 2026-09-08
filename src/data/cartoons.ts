// Lista central dos desenhos do acervo (capas já otimizadas: máx. 264x352 WebP).
import barbie from "@/assets/opt/c-BARBIE.webp.asset.json";
import superpoderosas from "@/assets/opt/c-MENINASUPERPODEROSAS.webp.asset.json";
import frozen from "@/assets/opt/c-FROZEN.webp.asset.json";
import espias from "@/assets/opt/c-3ESPIAS.webp.asset.json";
import bratz from "@/assets/opt/c-BRATZ.webp.asset.json";
import dora from "@/assets/opt/c-DORA.webp.asset.json";
import everafter from "@/assets/opt/c-EVER.webp.asset.json";
import hellokitty from "@/assets/opt/c-HELLO_KITTY.webp.asset.json";
import kim from "@/assets/opt/c-KIM_POSSIBLE.webp.asset.json";
import lilo from "@/assets/opt/c-LILLO.webp.asset.json";
import ladybug from "@/assets/opt/c-MIRACOULUS.webp.asset.json";
import monsterhigh from "@/assets/opt/c-MONSTER.webp.asset.json";
import moranguinho from "@/assets/opt/c-MORANGUINHO.webp.asset.json";
import pony from "@/assets/opt/c-MYLITLEPONEY.webp.asset.json";
import peppa from "@/assets/opt/c-peppaPIG.webp.asset.json";
import polly from "@/assets/opt/c-POLLY.webp.asset.json";
import princesas from "@/assets/opt/c-PRINCESAS_DISNEY.webp.asset.json";
import pucca from "@/assets/opt/c-PUCCA.webp.asset.json";
import sailor from "@/assets/opt/c-SAILLORMOON.webp.asset.json";
import shera from "@/assets/opt/c-SHE-RA.webp.asset.json";
import winx from "@/assets/opt/c-WINX_CLUB.webp.asset.json";
import witch from "@/assets/opt/c-WITCH.webp.asset.json";
import monica from "@/assets/opt/c-monica.webp.asset.json";
import sakura from "@/assets/opt/c-sakura.webp.asset.json";
import ursinhos from "@/assets/opt/c-ursinhos.webp.asset.json";
import tinker from "@/assets/opt/c-tinker.webp.asset.json";
import sofia from "@/assets/opt/c-princesasopia.webp.asset.json";
import masha from "@/assets/opt/c-mash.webp.asset.json";
import bluey from "@/assets/opt/c-bluey.webp.asset.json";
import gabby from "@/assets/opt/c-casagaby.webp.asset.json";
import spirit from "@/assets/opt/c-spirit.webp.asset.json";
import dcgirls from "@/assets/opt/c-superhero.webp.asset.json";
import legofriends from "@/assets/opt/c-legofriends.webp.asset.json";
import rainbowhigh from "@/assets/opt/c-raibonw.webp.asset.json";
import lol from "@/assets/opt/c-lolsurprise.webp.asset.json";
import trolls from "@/assets/opt/c-trolls.webp.asset.json";
import lalaloopsy from "@/assets/opt/c-lalaposy.webp.asset.json";
import minnie from "@/assets/opt/c-minnie.webp.asset.json";
import galinha from "@/assets/opt/c-galinha.webp.asset.json";
import lolirock from "@/assets/opt/c-lolirock.webp.asset.json";
import padrinhos from "@/assets/opt/c-padrinhos.webp.asset.json";
import princesasapo from "@/assets/opt/c-princesasapo.webp.asset.json";
import alice from "@/assets/opt/c-alice.webp.asset.json";

export type Cartoon = {
  id: string;
  name: string;
  short?: string;
  grad: string;
  image?: string;
  /** dimensões reais do arquivo otimizado (evita layout shift) */
  w?: number;
  h?: number;
  top?: boolean;
};

export const CARTOONS: Cartoon[] = [
  { id: "princesas", name: "Princesas Disney", short: "Ariel, Bela, Cinderela, Rapunzel, Jasmine, Aurora e Branca de Neve", grad: "linear-gradient(160deg,#F9A8D4,#7C3AED)", image: princesas.url, w: 198, h: 352, top: true },
  { id: "barbie", name: "Barbie", grad: "linear-gradient(160deg,#FF7BC0,#D6167E)", image: barbie.url, w: 235, h: 352, top: true },
  { id: "winx", name: "Winx Club", grad: "linear-gradient(160deg,#F65BAE,#8A46D6)", image: winx.url, w: 239, h: 352, top: true },
  { id: "superpoderosas", name: "As Meninas Superpoderosas", grad: "linear-gradient(160deg,#7FD4F5,#2563EB)", image: superpoderosas.url, w: 235, h: 352, top: true },
  { id: "frozen", name: "Frozen", grad: "linear-gradient(160deg,#A5E8FF,#3B82F6)", image: frozen.url, w: 198, h: 352, top: true },
  { id: "espias", name: "Três Espiãs Demais", grad: "linear-gradient(160deg,#FFB27A,#EF4444)", image: espias.url, w: 235, h: 352, top: true },
  { id: "pony", name: "My Little Pony", grad: "linear-gradient(160deg,#C4B5FD,#EC4899)", image: pony.url, w: 234, h: 352, top: true },
  { id: "moranguinho", name: "Moranguinho", grad: "linear-gradient(160deg,#FF9EBB,#E11D48)", image: moranguinho.url, w: 198, h: 352, top: true },
  { id: "sailor", name: "Sailor Moon", grad: "linear-gradient(160deg,#FDE68A,#9333EA)", image: sailor.url, w: 235, h: 352, top: true },
  { id: "ladybug", name: "Miraculous: Ladybug", grad: "linear-gradient(160deg,#FCA5A5,#B91C1C)", image: ladybug.url, w: 198, h: 352, top: true },
  { id: "hellokitty", name: "Hello Kitty", grad: "linear-gradient(160deg,#FFC2DA,#DB2777)", image: hellokitty.url, w: 198, h: 352 },
  { id: "polly", name: "Polly Pocket", grad: "linear-gradient(160deg,#FBCFE8,#A21CAF)", image: polly.url, w: 235, h: 352 },
  { id: "monsterhigh", name: "Monster High", grad: "linear-gradient(160deg,#D8B4FE,#4C1D95)", image: monsterhigh.url, w: 264, h: 352 },
  { id: "bratz", name: "Bratz", grad: "linear-gradient(160deg,#FDA4AF,#9D174D)", image: bratz.url, w: 249, h: 352 },
  { id: "kim", name: "Kim Possible", grad: "linear-gradient(160deg,#FDBA74,#C2410C)", image: kim.url, w: 234, h: 352 },
  { id: "everafter", name: "Ever After High", grad: "linear-gradient(160deg,#E9D5FF,#6D28D9)", image: everafter.url, w: 232, h: 352 },
  { id: "lilo", name: "Lilo & Stitch", grad: "linear-gradient(160deg,#A5E8FF,#0EA5E9)", image: lilo.url, w: 247, h: 352 },
  { id: "dora", name: "Dora, a Aventureira", grad: "linear-gradient(160deg,#BBF7D0,#15803D)", image: dora.url, w: 234, h: 352 },
  { id: "peppa", name: "Peppa Pig", grad: "linear-gradient(160deg,#FBCFE8,#DB2777)", image: peppa.url, w: 235, h: 352 },
  { id: "pucca", name: "Pucca", grad: "linear-gradient(160deg,#FCA5A5,#7F1D1D)", image: pucca.url, w: 264, h: 344 },
  { id: "shera", name: "She-Ra", grad: "linear-gradient(160deg,#FDE68A,#B45309)", image: shera.url, w: 263, h: 352 },
  { id: "witch", name: "W.I.T.C.H.", grad: "linear-gradient(160deg,#A7F3D0,#7C3AED)", image: witch.url, w: 226, h: 352 },
  { id: "monica", name: "Turma da Mônica", grad: "linear-gradient(160deg,#FCA5A5,#DC2626)", image: monica.url, w: 264, h: 264 },
  { id: "sakura", name: "Sakura Card Captors", grad: "linear-gradient(160deg,#FBCFE8,#DB2777)", image: sakura.url, w: 235, h: 352 },
  { id: "ursinhos", name: "Ursinhos Carinhosos", grad: "linear-gradient(160deg,#DDD6FE,#7C3AED)", image: ursinhos.url, w: 198, h: 352 },
  { id: "tinker", name: "Tinker Bell", grad: "linear-gradient(160deg,#BBF7D0,#15803D)", image: tinker.url, w: 198, h: 352 },
  { id: "sofia", name: "Princesinha Sofia", grad: "linear-gradient(160deg,#E9D5FF,#7E22CE)", image: sofia.url, w: 247, h: 352 },
  { id: "masha", name: "Masha e o Urso", grad: "linear-gradient(160deg,#F5D0FE,#A21CAF)", image: masha.url, w: 198, h: 352 },
  { id: "bluey", name: "Bluey", grad: "linear-gradient(160deg,#BAE6FD,#0284C7)", image: bluey.url, w: 255, h: 352 },
  { id: "gabby", name: "A Casa Mágica da Gabby", grad: "linear-gradient(160deg,#FBCFE8,#EC4899)", image: gabby.url, w: 232, h: 352 },
  { id: "spirit", name: "Spirit: Cavalgando Livre", grad: "linear-gradient(160deg,#FDE68A,#B45309)", image: spirit.url, w: 235, h: 352 },
  { id: "dcgirls", name: "DC Super Hero Girls", grad: "linear-gradient(160deg,#C4B5FD,#4338CA)", image: dcgirls.url, w: 239, h: 352 },
  { id: "legofriends", name: "LEGO Friends", grad: "linear-gradient(160deg,#FBCFE8,#7C3AED)", image: legofriends.url, w: 296, h: 352 },
  { id: "rainbowhigh", name: "Rainbow High", grad: "linear-gradient(160deg,#FDE68A,#DB2777)", image: rainbowhigh.url, w: 202, h: 352 },
  { id: "lol", name: "L.O.L. Surprise!", grad: "linear-gradient(160deg,#F5D0FE,#A21CAF)", image: lol.url, w: 198, h: 352 },
  { id: "trolls", name: "Trolls", grad: "linear-gradient(160deg,#BAE6FD,#EC4899)", image: trolls.url, w: 238, h: 352 },
  { id: "lalaloopsy", name: "Lalaloopsy", grad: "linear-gradient(160deg,#BFDBFE,#F472B6)", image: lalaloopsy.url, w: 198, h: 352 },
  { id: "minnie", name: "Minnie Toons", grad: "linear-gradient(160deg,#FBCFE8,#DB2777)", image: minnie.url, w: 235, h: 352 },
  { id: "galinha", name: "Galinha Pintadinha Mini", grad: "linear-gradient(160deg,#BAE6FD,#16A34A)", image: galinha.url, w: 235, h: 352 },
  { id: "lolirock", name: "LoliRock", grad: "linear-gradient(160deg,#F5D0FE,#7C3AED)", image: lolirock.url, w: 198, h: 352 },
  { id: "padrinhos", name: "Os Padrinhos Mágicos", grad: "linear-gradient(160deg,#DDD6FE,#6D28D9)", image: padrinhos.url, w: 198, h: 352 },
  { id: "princesasapo", name: "A Princesa e o Sapo", grad: "linear-gradient(160deg,#BBF7D0,#15803D)", image: princesasapo.url, w: 198, h: 352 },
  { id: "alice", name: "Alice no País das Maravilhas", grad: "linear-gradient(160deg,#BFDBFE,#2563EB)", image: alice.url, w: 198, h: 352 },
  { id: "juniper", name: "Juniper Lee", short: "A Vida e as Aventuras de Juniper Lee", grad: "linear-gradient(160deg,#F5D0FE,#7C3AED)", image: "/juniper-lee.webp", w: 235, h: 352 },
  { id: "patrulha", name: "Patrulha Canina", grad: "linear-gradient(160deg,#93C5FD,#DC2626)", image: "/toons/patrulha-canina.jpg", w: 263, h: 352 },
  { id: "totoro", name: "Meu Amigo Totoro", grad: "linear-gradient(160deg,#BBF7D0,#15803D)", image: "/toons/meu-amigo-totoro.jpg", w: 198, h: 352 },
  { id: "pooh", name: "Ursinho Pooh", grad: "linear-gradient(160deg,#FDE68A,#D97706)", image: "/toons/ursinho-pooh.jpg", w: 198, h: 352 },
  { id: "george", name: "George, o Curioso: Aventuras no Mar", grad: "linear-gradient(160deg,#FEF08A,#CA8A04)", image: "/toons/george-o-curioso-aventuras-no-mar.jpg", w: 282, h: 352 },
  { id: "toystory2", name: "Toy Story 2", grad: "linear-gradient(160deg,#BAE6FD,#2563EB)", image: "/toons/toy-story-2.jpg", w: 240, h: 352 },
  { id: "toystory3", name: "Toy Story 3", grad: "linear-gradient(160deg,#FCA5A5,#DC2626)", image: "/toons/toy-story-3.jpg", w: 235, h: 352 },
  { id: "toystory4", name: "Toy Story 4", grad: "linear-gradient(160deg,#DDD6FE,#7C3AED)", image: "/toons/toy-story-4.jpg", w: 234, h: 352 },
  { id: "toystoryesq", name: "Toy Story: Esquecidos pelo Tempo", grad: "linear-gradient(160deg,#FDBA74,#C2410C)", image: "/toons/toy-story-esquecidos-pelo-tempo.jpg", w: 252, h: 352 },
  { id: "toystoryrex", name: "Toy Story: Festassauro Rex", grad: "linear-gradient(160deg,#BBF7D0,#16A34A)", image: "/toons/toy-story-festassauro-rex.jpg", w: 249, h: 352 },
  { id: "toystorymundo", name: "Toy Story: Um Mundo de Aventuras", grad: "linear-gradient(160deg,#BAE6FD,#0284C7)", image: "/toons/toy-story-um-mundo-de-aventuras.jpg", w: 237, h: 352 },
];

export const TOP_CARTOONS = CARTOONS.filter((c) => c.top);
