import { TimelineEvent, TimelineTag } from '../models/timeline.models';
import { parseYearString } from '../utils/parse-year.util';

// ─────────────────────────────────────────────────────────────
// Tag definitions
// ─────────────────────────────────────────────────────────────
export const TIMELINE_TAGS: Record<string, TimelineTag> = {
  biblia: {
    id: 'biblia',
    label: 'Versiones de la Biblia',
    icon: '📖',
    color: '#b45309',
    bg: '#fef3c7',
    border: '#f59e0b',
  },
  doctrina: {
    id: 'doctrina',
    label: 'Teología y Doctrina',
    icon: '✝️',
    color: '#6d28d9',
    bg: '#ede9fe',
    border: '#8b5cf6',
  },
  historia: {
    id: 'historia',
    label: 'Historia y Cultura',
    icon: '🏛️',
    color: '#065f46',
    bg: '#d1fae5',
    border: '#10b981',
  },
  roma: {
    id: 'roma',
    label: 'Iglesia Católica Romana',
    icon: '⛪',
    color: '#9f1239',
    bg: '#ffe4e6',
    border: '#f43f5e',
  },
};

export const TAGS_LIST: TimelineTag[] = Object.values(TIMELINE_TAGS);

// ─────────────────────────────────────────────────────────────
// Eras and Events Data Source
// ─────────────────────────────────────────────────────────────

export interface EraData {
  name: string;
  bgImage: string;
  color: string;
  events: {
    year: string;
    title: string;
    tags: string[];
    shortDesc: string;
    fullDesc: string;
    image: string;
  }[];
}

export const TIMELINE_ERAS_DATA: EraData[] = [
  {
    name: "Iglesias Primitivas y Edad Media",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/The_Trail_of_Blood.jpg/1920px-The_Trail_of_Blood.jpg",
    color: "#8b5cf6",
    events: [

      {
        year: "~250 a.C.",
        title: "La Septuaginta (LXX)",
        tags: ['biblia', 'historia'],
        shortDesc: "Eruditos judíos en Alejandría traducen la Torá al griego, iniciando una colección que se convertiría en la traducción más influyente de la antigüedad.",
        fullDesc: `La <a href='https://es.wikipedia.org/wiki/Septuaginta' target='_blank' class='inline-link' data-preview='Traducción griega del AT'>Septuaginta</a>
          (abreviada <strong>LXX</strong>) es, en teoría, la traducción del Antiguo Testamento hebreo al griego koiné iniciada en Alejandría, Egipto.
          Según la tradición (plasmada en la pseudoepigráfica <em>Carta de Aristeas</em>), 72 eruditos judíos fueron convocados por Ptolomeo II y tradujeron la ley milagrosamente en 72 días.
          Sin embargo, historiadores y eruditos modernos consideran este relato un <strong>mito o leyenda fundacional</strong>. La realidad histórica apunta a que
          solamente la Torá (el Pentateuco) fue traducida en el siglo III a.C., y el resto del Antiguo Testamento fue traducido esporádicamente por distintos autores a lo largo de los siglos siguientes.<br><br>
          <strong>📜 Importancia y debate histórico:</strong>
          <ul class='modal-list'>
            <li><strong>¿La Biblia de la Iglesia Primitiva?:</strong> A menudo se afirma categóricamente que fue la Biblia de los apóstoles 
            porque muchas de sus citas del AT en griego coinciden con copias de la LXX. 
            Sin embargo, esto es históricamente debatido. Una fuerte postura de preservación textual argumenta que Jesús y los apóstoles leían y citaban directamente del texto hebreo original 
            (traduciéndolo libremente al griego por inspiración divina). Según este argumento histórico, fueron eruditos posteriores (como Orígenes en Antioquía/Alejandría) quienes habrían alterado 
            las copias griegas del Antiguo Testamento que sobrevivieron para forzarlas a coincidir retrospectivamente con el Nuevo Testamento.</li>
            <li><strong>Los libros Apócrifos:</strong> Se afirma que la LXX agregó libros adicionales (apócrifos) al canon. 
            Sin embargo, <em>no existe ninguna evidencia ni manuscrito judío precristiano</em> de la Septuaginta que contenga estos libros. 
            Las copias completas de la LXX que los incluyen (como los códices católico-ortodoxos <em>Vaticanus</em> y <em>Sinaiticus</em>) fueron manufacturadas en los siglos IV y V d.C. —
            Fuentes importantes, como F.F. Bruce in <em>The Canon of Scripture</em> o Edward F. Hills, señalan que fueron los eclesiásticos alejandrinos posteriores quienes aglomeraron estos libros junto al canon inspirado.</li>
            <li>Fue la base del Antiguo Testamento en las antiguas traducciones <strong>Vetus Latina</strong>.</li>
          </ul>
          Hoy en día, la LXX sigue siendo un objeto de enorme estudio crítico y es el texto oficial del Antiguo Testamento en la Iglesia Católica Apostólica Ortodoxa.`,
        image: "https://biteproject.com/wp-content/uploads/2025/03/LXX-Destacada-1024x576.webp"
      },
      {
        year: "~100 – 380 d.C.",
        title: "Las Vetus Latina",
        tags: ['biblia', 'roma'],
        shortDesc: "Las primeras traducciones fragmentarias de la Biblia al latín que fueron usadas por la iglesia que posteriormente sería llamada católico-romana occidental.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/f/fc/Codex_Vercellensis_-_Old_Latin_gospel_%28John_ch._16%2C_v._23-30%29_%28The_S.S._Teacher%27s_Edition-The_Holy_Bible_-_Plate_XXXII%29.jpg'
          class='modal-inline-img' alt='Codex Vercellensis - Evangelio en latín antiguo' title='Codex Vercellensis: Ejemplo de manuscrito de la Vetus Latina (Juan 16:23-30)'>
          Desde el siglo II en adelante, distintas comunidades del occidente romano produjeron traducciones independientes y fragmentarias de las Escrituras
          al latín, conocidas colectivamente como las <a href='https://es.wikipedia.org/wiki/Vetus_Latina' target='_blank' class='inline-link' data-preview='Antiguas traducciones latinas'>Vetus Latina</a>
          ('Antiguo Latín'). No fue una obra unificada ni coordinada — cada región traducía con los manuscritos griegos que tenía a la mano, sin acceso a una colección centralizada.
          Esta fue la razón principal de que los textos variaran: los traductores locales rara vez tenían todas las fuentes a la mano, sino porciones u copias aisladas de distintos manuscritos. 
          A eso se sumaban variaciones secundarias propias de la traducción: vocabulario teológico inconsistente y versículos con fraseos distintos según el dominio del griego de cada traductor.<br><br>
          Traducidas desde manuscritos griegos para el Nuevo Testamento y desde la <strong>Septuaginta</strong> para el Antiguo Testamento.
          Su falta de uniformidad fue precisamente la razón que usó el Papa Dámaso I para encargar a Jerónimo producir una versión latina oficial y estandarizada,
          que unificara a toda la Iglesia Católica occidental bajo un solo texto.`,
        image: "https://archesbookhouse.cdn.bibliopolis.com/pictures/402.jpg"
      },
      {
        year: "382 – 405 d.C.",
        title: "La Vulgata Latina de Jerónimo",
        tags: ['biblia', 'roma'],
        shortDesc: "Jerónimo de Estridón traduce la Biblia al latín por encargo del Papa Dámaso I, produciendo el texto oficial de la Iglesia Católica.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Amiatinus_Maiestas_Domini.jpg/960px-Amiatinus_Maiestas_Domini.jpg'
          class='modal-inline-img' alt='Maestà del Señor en el Codex Amiatinus' title='El Codex Amiatinus, una copia de la Vulgata'>
          Por encargo del Papa Dámaso I, <a href='https://es.wikipedia.org/wiki/Jer%C3%B3nimo_(santo)' target='_blank' class='inline-link' data-preview='Traductor de la obra'>Jerónimo de Estridón</a>
          produjo la <a href='https://es.wikipedia.org/wiki/Vulgata' target='_blank' class='inline-link' data-preview='Conoce más de la Vulgata Latina'>Vulgata Latina</a>,
          la traducción oficial de las Escrituras al latín para la Iglesia Católica occidental.<br><br>
          <strong>📚 Fuentes por sección:</strong>
          <ul class='modal-list'>
            <li><strong>Antiguo Testamento:</strong> Traducido directamente del 
            <a href='https://es.wikipedia.org/wiki/Texto_masor%C3%A9tico' target='_blank' class='inline-link' data-preview='El texto hebreo estándar'>Texto Masorético hebreo</a>.
              Jerónimo rechazó la <em>Septuaginta</em> griega por el principio de <em>Hebraica Veritas</em>: consideraba que solo el original hebreo
              era autoritativo, y que la Septuaginta era una traducción griega con imprecisiones — no el texto original.</li>
            <li><strong>Nuevo Testamento:</strong> Revisado desde las <strong>Vetus Latina</strong> (las antiguas traducciones latinas en circulación),
              cotejándolas con manuscritos griegos del siglo IV pertenecientes a la <strong>familia textual alejandrina</strong> — la misma tradición
              que quedó plasmada en códices como el <strong>Codex Vaticanus</strong> (resguardado en la Biblioteca Vaticana desde el siglo XV)
              y el <strong>Codex Sinaiticus</strong> (hallado en el monasterio católico-ortodoxo de Santa Catalina en el Sinaí), ambos manuscritos
              preservados y custodiados exclusivamente por instituciones católicas/ortodoxas. Hoy forman la base del
              <strong>Texto Crítico</strong>. No existía aún un Nuevo Testamento griego compilado y estandarizado.</li>
            <li><strong>Apócrifos:</strong> Jerónimo <em>rechazaba</em> los libros deuterocanónicos como no canónicos — los marcó como tales en sus propios prólogos,
              siguiendo el canon hebreo (y contrario a lo que admitió la LXX). Sin embargo, la tradición eclesial y su presencia en la Vetus Latina lo presionaron
              a incluirlos. Los tradujo en parte de mala gana y bajo insistencia de colegas obispos. La Vulgata terminó incluyendo: Tobías, Judit,
              1–2 Macabeos, Sabiduría, Eclesiástico y Baruc. Siglos después, el Concilio de Trento (1546) los declararía formalmente canónicos para la Iglesia Católica.</li>
          </ul>
          La Vulgata se afianzó como el texto oficial eclesiástico en occidente durante toda la Edad Media. La ilustración muestra el
          <a href='https://es.wikipedia.org/wiki/Codex_Amiatinus' target='_blank' class='inline-link' data-preview='Códice completo más antiguo'>Codex Amiatinus</a>
          (siglo VIII), que es básicamente la copia completa más antigua de la Vulgata que sobrevive hasta nuestros días.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/D%C3%BCrer-Hieronymus-im-Geh%C3%A4us.jpg/1280px-D%C3%BCrer-Hieronymus-im-Geh%C3%A4us.jpg"
      },
      {
        year: "1095 – 1291",
        title: "Las Cruzadas",
        tags: ['historia', 'roma'],
        shortDesc: "Las cruzadas fueron campañas militares y religiosas promovidas por la Iglesia latina para recuperar o defender Tierra Santa.",
        fullDesc: `La primera gran ola de las <a href='https://es.wikipedia.org/wiki/Cruzadas' target='_blank' class='inline-link' data-preview='Conoce más sobre las Cruzadas'>cruzadas</a>
          comenzó en 1095 con la llamada de Urbano II y se extendió a varias expediciones posteriores para recuperar o defender Tierra Santa.
          Estas campañas combinaron motivos religiosos, políticos y militares, y marcaron profundas tensiones entre cristianos, musulmanes y judíos.<br><br>
          <ul class='modal-list'>
            <li><strong>Primera Cruzada (1095–1099):</strong> Fue la más conocida y terminó con la toma de Jerusalén.</li>
            <li><strong>Expediciones posteriores (1147–1291):</strong> Incluyeron nuevos intentos militares y diplomáticos, aunque con menor éxito general.</li>
          </ul>`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SiegeofAntioch.jpeg/960px-SiegeofAntioch.jpeg"
      },
      {
        year: "1478 – 1834",
        title: "La Santa Inquisición",
        tags: ['historia', 'roma'],
        shortDesc: "La Inquisición fue un tribunal eclesial para investigar herejías y proteger la ortodoxia católica.",
        fullDesc: `La <a href='https://es.wikipedia.org/wiki/Santa_Inquisici%C3%B3n' target='_blank' class='inline-link' data-preview='Conoce más sobre la Inquisición'>Santa Inquisición</a>
          surgió como un tribunal eclesial destinado a investigar sospechas de herejía y preservar la ortodoxia en la Iglesia latina.<br><br>
          <ul class='modal-list'>
            <li><strong>Inquisición Medieval (1184):</strong> Fundada originalmente en el sur de Francia (Languedoc) por el Papa Lucio III para combatir a los cátaros y valdenses.</li>
            <li><strong>Inquisición Española (1478):</strong> Establecida por los Reyes Católicos mediante bula papal, se enfocó fuertemente en identificar falsos conversos (judíos y musulmanes que practicaban su fe en secreto) y posteriormente en censurar literatura protestante.</li>
            <li><strong>Inquisición Romana (1542):</strong> El Papa Pablo III estableció la Congregación del Santo Oficio en Roma con el objetivo principal de frenar el alarmante avance del Protestantismo en la península itálica.</li>
            <li><strong>Modo de acción:</strong> Operó a través de juicios sistemáticos, tortura eclesiástica, quema de libros prohibidos (<em>Index Librorum Prohibitorum</em>) y castigos públicos masivos conocidos como <strong>Autos de Fe</strong>.</li>
            <li><strong>Abolición (1834):</strong> Fue oficialmente abolida en España por un real decreto bajo el reinado de Isabel II, tras un largo periodo de declive de su poder.</li>
          </ul>`,
        image: "https://upload.wikimedia.org/wikipedia/commons/4/45/Pedro_Berruguete_Saint_Dominic_Presiding_over_an_Auto-da-fe_1495.jpg"
      }
    ]
  },
  {
    name: "Renacimiento y Pre-Reforma",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/View_of_Santa_Maria_del_Fiore_in_Florence.jpg/1280px-View_of_Santa_Maria_del_Fiore_in_Florence.jpg",
    color: "#f59e0b",
    events: [
      {
        year: "1454 / 1455",
        title: "La Imprenta y la Biblia de Gutenberg",
        tags: ['historia', 'biblia'],
        shortDesc: "Gutenberg cambia la historia al usar tipos móviles para imprimir exitosamente la Biblia de 42 líneas.",
        fullDesc: `En Maguncia, Johannes Gutenberg utiliza su imprenta de tipos móviles para imprimir el primer libro importante en Occidente a gran escala: la
          <a href='https://es.wikipedia.org/wiki/Biblia_de_Gutenberg' target='_blank' class='inline-link' data-preview='Primer libro impreso a gran escala'>Biblia de 42 líneas</a>
          (la versión Vulgata Latina). Este avance revolucionó la sociedad, facilitó la difusión de ideas y proveyó los cimientos tecnológicos vitales
          para el esparcimiento global de la Biblia y la inminente Reforma.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Gutenberg_Bible.jpg"
      },
      {
        year: "1516",
        title: "Erasmo compila el Textus Receptus",
        tags: ['biblia'],
        shortDesc: "Erasmo de Rotterdam publica el Novum Instrumentum omne, base de las traducciones bíblicas futuras.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/9/9b/Justinian555AD.png'
          class='modal-inline-img img-large' alt='Mapa del Imperio Bizantino bajo Justiniano' title='El Imperio Bizantino en su máxima extensión (555 d.C.)'>
          Desiderio Erasmo de Rotterdam compila y publica bajo el título de <em>Novum Instrumentum omne</em> la primera versión impresa del Nuevo Testamento griego,
          acompañada de una nueva traducción al latín. Se basó en manuscritos griegos de la tradición
          <strong>Texto Mayoritario</strong> o <strong>Texto Bizantino</strong> — así llamado porque fue el texto del Nuevo Testamento copiado, preservado y
          transmitido durante siglos a lo largo del <a href='https://es.wikipedia.org/wiki/Imperio_bizantino' target='_blank' class='inline-link' data-preview='El Imperio que preservó el texto griego'>Imperio Bizantino</a>,
          el heredero cristiano oriental del Imperio Romano. Al ser el texto que circuló en la mayor parte de las iglesias griegas durante más de mil años,
          representa la tradición de la <strong>gran mayoría</strong> de manuscritos conocidos del Nuevo Testamento.<br><br>
          Este texto griego (denominado posteriormente <a href='https://es.wikipedia.org/wiki/Textus_Receptus' target='_blank' class='inline-link' data-preview='Texto Recibido en latín'>Textus Receptus</a>)
          sirvió de base innegable para las traducciones bíblicas a las lenguas vernáculas durante la época de la Reforma.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Holbein-erasmus.jpg/1280px-Holbein-erasmus.jpg"
      }
    ]
  },
  {
    name: "La Reforma Protestante",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Europe_religions_1560.jpg",
    color: "#ef4444",
    events: [
      {
        year: "1517",
        title: "Martín Lutero y las 95 Tesis",
        tags: ['historia', 'doctrina', 'roma'],
        shortDesc: "Lutero clava sus tesis en Wittenberg, encendiendo la chispa de la Reforma Protestante.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/9/9a/Ferdinand_Pauwels_-_Luther_hammers_his_95_theses_to_the_door.jpg'
          class='modal-inline-img' alt='Lutero clavando sus Tesis' title='Lutero clavando las 95 tesis'>
          El 31 de octubre de 1517, el monje Martín Lutero clava sus <a href='https://es.wikipedia.org/wiki/Las_95_tesis' target='_blank' class='inline-link' data-preview='Documento clave de protesta'>95 tesis</a>
          en la puerta de la iglesia del palacio en Wittenberg, Alemania. Con ellas protestaba firmemente contra la venta de indulgencias por parte de la
          Iglesia Católica y los abusos clericales, encendiendo así la irreversible chispa de la Reforma Protestante y recuperando la doctrina de la justificación por la fe sola (Sola Fide).`,
        image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Martin_Luther_by_Cranach-restoration.jpg"
      },
      {
        year: "1536",
        title: "Calvino: La Doctrina Sistemática de la Reforma",
        tags: ['doctrina'],
        shortDesc: "Juan Calvino publica la 'Institución de la religión cristiana', sentando las bases sistemáticas de la fe reformada.",
        fullDesc: `En este año, Juan Calvino publica la primera edición de su obra fundamental: la
          <a href='https://es.wikipedia.org/wiki/Instituci%C3%B3n_de_la_religi%C3%B3n_cristiana' target='_blank' class='inline-link' data-preview='Magnum opus de Calvino'>Institución de la religión cristiana</a>.
          Esta obra monumental sistematizó de manera brillante la teología protestante esparcida, sentando el cuerpo doctrinal inquebrantable de la tradición reformada
          que históricamente originaría al famoso Calvinismo, basándose fuertemente en la Soberanía Absoluta de Dios y las Escrituras.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/John_Calvin_Museum_Catharijneconvent_RMCC_s84_cropped.png/1280px-John_Calvin_Museum_Catharijneconvent_RMCC_s84_cropped.png"
      },
      {
        year: "1545 – 1563",
        title: "Concilio de Trento",
        tags: ['doctrina', 'historia', 'roma'],
        shortDesc: "La Iglesia Católica consolida sus dogmas y emite duras condenas en respuesta a la Reforma.",
        fullDesc: `Un influyente concilio ecuménico de la Iglesia Católica que abarcó varias décadas. Durante el <a href='https://es.wikipedia.org/wiki/Concilio_de_Trento' target='_blank' class='inline-link' data-preview='Inicio de la Contrarreforma'>Concilio de Trento</a>
          se trazaron condenas rigurosas en forma de anatemas contra los líderes protestantes y su teología de la fe inicial (como Sola Gratia o Sola Scriptura),
          a la vez que redefinieron y consolidaron todos sus dogmas católicos opuestos.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Tridentinum.jpg/1280px-Tridentinum.jpg"
      },
      {
        year: "1551",
        title: "Stephanus y la Purificación del Texto",
        tags: ['biblia'],
        shortDesc: "Robert Estienne (Stephanus) edita y mejora el Textus Receptus, añadiendo también los versículos.",
        fullDesc: `El impresor y erudito francés Robert Estienne (conocido como Stephanus) publica impresionantes y definitivas ediciones del Nuevo Testamento Griego, dedicadas fielmente
          a la purificación y consolidación de lo que constituiría el <a href='https://es.wikipedia.org/wiki/Robert_Estienne' target='_blank' class='inline-link' data-preview='Erudito y Tipógrafo bíblico'>Textus Receptus</a>
          estándar (su famosa edición de 1550 u 'O Mirificam'). Posteriormente, in 1551, sería la primera persona en la historia en dividir este texto fundamental
          en versículos numerados. Su obra es el eslabón directo entre Erasmo y Teodoro Beza, consolidando así la línea de transmisión que culminaría en la KJV de 1611.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Portret_van_Robert_I_Estienne_Beroemde_hervormers_%28serietitel%29_Icones_virorum_nostra_patrumq._memoria_illustrium_%28serietitel%29%2C_RP-P-OB-55.218.jpg/1280px-Portret_van_Robert_I_Estienne_Beroemde_hervormers_%28serietitel%29_Icones_virorum_nostra_patrumq._memoria_illustrium_%28serietitel%29%2C_RP-P-OB-55.218.jpg"
      },
      {
        year: "1565 – 1598",
        title: "Beza y la cumbre del Textus Receptus",
        tags: ['biblia'],
        shortDesc: "Beza publica varias ediciones del Nuevo Testamento en griego, consolidando el texto de Erasmo y Stephanus conocido como Textus Receptus.",
        fullDesc: `El teólogo y reformador ginebrino <a href='https://es.wikipedia.org/wiki/Teodoro_Beza' target='_blank' class='inline-link' data-preview='Sucesor de Calvino en Ginebra'>Teodoro Beza</a> sucedió a Calvino
          y publicó nueve ediciones principales del Nuevo Testamento griego entre 1565 y 1598. Su trabajo continuó y refinó la obra anterior de Erasmo y Stephanus,
          ayudando a estandarizar y consolidar la lectura del texto bíblico que provenía de la gran mayoría de manuscritos bizantinos descubiertos hasta la fecha.<br><br>
          Estas ediciones de Beza representaron la forma final de lo que posteriormente llegó a conocerse históricamente como el
          <a href='https://es.wikipedia.org/wiki/Textus_Receptus' target='_blank' class='inline-link' data-preview='Conoce el origen del Texto Recibido'>Textus Receptus</a>
          o 'Texto Recibido' por la iglesia protestante. Su Nuevo Testamento griego, junto a sus rigurosas anotaciones y traducciones latinas, proveyó una base
          sólida y uniforme para los traductores de la Reforma en toda Europa.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Theodore_de_Beze.jpg"
      }
    ]
  },
  {
    name: "Ortodoxia Protestante",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Synodedordrecht.jpg",
    color: "#3b82f6",
    events: [
      {
        year: "1569",
        title: "Casiodoro de Reina: La Biblia del Oso",
        tags: ['biblia'],
        shortDesc: "Casiodoro de Reina traduce la primera Biblia completa al español, basándose firmemente en la cadena pura del Textus Receptus.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/3/32/Biblia_del_Oso.png' class='modal-inline-img' alt='Portada de la Biblia del Oso' title='El famoso logotipo del oso que procuraba evadir a la Inquisición'>
          Publicada durante su duro exilio en Basilea, Suiza. <a href="https://youtu.be/rrRswC3wZ3Y" target="_blank" class="inline-link" data-preview="Historia de la RV">
          Es la primera traducción de la Biblia completa directamente desde los idiomas originales al español </a>,
          elaborada meticulosamente por <a href='https://es.wikipedia.org/wiki/Casiodoro_de_Reina' target='_blank' class='inline-link' data-preview='Traductor principal'>Casiodoro de Reina</a>.
          Para el Nuevo Testamento se apoyó en el <strong>Textus Receptus (Erasmo → Stephanus)</strong> —la edición más depurada disponible en esos años—, y en el Texto Masorético para el Antiguo Testamento.
          De acuerdo a la 
          <a href="https://archive.org/details/BibliaDeCasiodoroDeReina1569/page/n981/mode/2up" target="_blank" class="inline-link" data-preview="Biblia del Oso escaneada">evidencia documental</a>, ésta incluyó los
          <strong>libros apócrifos</strong> integrados con naturalidad a lo largo del Antiguo Testamento 
          —sin separarlos ni marcarlos en un apéndice distinto, contrario a lo que aseguran otras publicaciones en la web—, imitando la estructura de la Vulgata Latina.
          Reina llegó al punto de incorporar textos tan marginales como <strong>3 Esdras</strong> y <strong>4 Esdras</strong> (conocido como Apocalipsis de Esdras), 
          libros rechazados definitivamente incluso por Roma en el Concilio de Trento.
          Esto revela que se regía más por un afán literario de volcar los manuscritos disponibles a su alcance, que por imponer un filtro teológico o confesional sobre el canon.
          Serían las revisiones protestantes de los siglos posteriores las que excluirían progresivamente este material, perfilando finalmente el canon cerrado evangélico estándar.
          Recibe el apodo de <a href='https://es.wikipedia.org/wiki/Biblia_del_oso' target='_blank' class='inline-link' data-preview='Conoce más sobre esta Biblia'>Biblia del Oso</a>
          por su histórico logotipo de portada utilizado para no revelar que era una Biblia y evitar ser quemada por la Inquisición.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Casiodoro_de_Reina.jpg"
      },
      {
        year: "1602",
        title: "Cipriano de Valera: La Biblia del Cántaro",
        tags: ['biblia'],
        shortDesc: "Cipriano de Valera revisa la traducción de Casiodoro, consolidando la influencia del Textus Receptus en el mundo hispano.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/5/5f/Portada_de_la_Biblia_del_C%C3%A1ntaro_que_se_conserva_en_la_Biblioteca_Nacional_de_Espa%C3%B1a.jpg'
          class='modal-inline-img' alt='Portada de la Biblia del Cántaro' title='Dos hombres, uno planta y otro riega'>
          <a href='https://es.wikipedia.org/wiki/Cipriano_de_Valera' target='_blank' class='inline-link' data-preview='Compañero reformador español'>Cipriano de Valera</a> publica en Ámsterdam
          la primera revisión exhaustiva a la <a href='https://es.wikipedia.org/wiki/Biblia_del_oso' target='_blank' class='inline-link' data-preview='Traducción original de Casiodoro'>Biblia del Oso</a>.
          Tras más de dos décadas de esfuerzo de revisión minuciosa, esta edición histórica de 1602 es la primera obra en ser llamada y constituida como la Biblia 'Reina-Valera'.
          Para sus ajustes en el Nuevo Testamento, dependió a plenitud en las estables ediciones del <strong>Textus Receptus (Erasmo → Stephanus)</strong>,
          pues las últimas revisiones de Teodoro Beza fueron muy contemporáneas a su arduo trabajo de veinte años.<br><br>
          Adoptó el apodo <a href='https://archive.org/details/BibliaDelCntaro1602/page/n467/mode/2up' target='_blank' class='inline-link' data-preview='Conoce más de su historia'>Del Cántaro</a>
          porque su famosa portada ilustra a dos hombres trabajando: uno plantando un árbol y otro regándolo con un cántaro de agua,
          en alusión directa a la doctrina impartida por Pablo en 1 Corintios 3:6.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Retrato_de_Cipriano_de_Valera_que_aparece_en_La_Biblia_del_Siglo_de_Oro_%289_x_13%29.jpg"
      },
      {
        year: "1610",
        title: "Artículos de los Remonstrantes",
        tags: ['doctrina'],
        shortDesc: "Los seguidores de Arminio expresan oficialmente sus desacuerdos y fuertes objeciones calvinistas.",
        fullDesc: `Los seguidores de Jacobo Arminio publicaron los <strong>Artículos de la Remonstrancia</strong>, oponiéndose a la ortodoxia calvinista con cinco puntos clave:<br>
          <ul class='modal-list'>
            <li><strong>1. Elección Condicional:</strong> Dios elige basándose en Su presciencia de la fe del hombre.</li>
            <li><strong>2. Expiación Ilimitada:</strong> Cristo murió por toda la humanidad (potencialmente).</li>
            <li><strong>3. Depravación Total:</strong> El hombre necesita la gracia preveniente para poder creer.</li>
            <li><strong>4. Gracia Resistible:</strong> La voluntad humana puede rechazar el llamado de Dios.</li>
            <li><strong>5. Seguridad Condicional:</strong> Posibilidad de caer de la gracia tras haber creído.</li>
          </ul>`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Jacobus_Arminius_02_IV_13_2_0026_01_0309_a_Seite_1_Bild_0001.jpg/1280px-Jacobus_Arminius_02_IV_13_2_0026_01_0309_a_Seite_1_Bild_0001.jpg"
      },
      {
        year: "1611",
        title: "King James Version (Versión Autorizada)",
        tags: ['biblia'],
        shortDesc: "Culmina la histórica traducción al inglés apoyada en las ediciones de Beza, siendo la obra cumbre del Textus Receptus en habla inglesa.",
        fullDesc: `Impulsada y autorizada por el mismísimo <strong>Rey Jacobo I</strong> de Inglaterra (razón por la cual tomó el título de <i>King James Version</i> o <i>Versión Autorizada</i>),
          esta monumental obra fue traducida exhaustivamente por 54 prominentes eruditos bíblicos. Este comité no innovó el texto original, sino que dependió
          firmemente en las versiones griegas recién maduradas por Teodoro Beza (1589, 1598) al final del siglo, asaltando la cumbre magistral de la cadena purificadora
          del <strong>Textus Receptus (Erasmo → Stephanus → Beza)</strong>.<br><br>
          Su solemne precisión consolidó y forjó la moderna lengua del inglés e instituyó a su vez a todo el mundo anglosajón firmemente sobre el texto griego
          mayoritario y bizantino, abriendo paso a los avivamientos de los grandes siglos post-reforma.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg/1280px-KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg"
      },
      {
        year: "1618–1619",
        title: "Sínodo de Dort y el TULIP",
        tags: ['doctrina'],
        shortDesc: "El Sínodo redacta los Cánones de Dort reafirmando las enseñanzas definitivas doctrinales de Juan Calvino.",
        fullDesc: `En respuesta a la Remonstrancia, el <a href='https://es.wikipedia.org/wiki/S%C3%ADnodo_de_Dort' target='_blank' class='inline-link' data-preview='Respuesta al arminianismo'>Sínodo de Dort</a>
          articuló los famosos cinco puntos del calvinismo (acróstico <strong>TULIP</strong>):<br>
          <ul class='modal-list'>
            <li><strong>T (Total Depravity):</strong> Depravación Total del hombre.</li>
            <li><strong>U (Unconditional Election):</strong> Elección Incondicional soberana de Dios.</li>
            <li><strong>L (Limited Atonement):</strong> Expiación Limitada (Particular).</li>
            <li><strong>I (Irresistible Grace):</strong> Gracia Irresistible en el llamado.</li>
            <li><strong>P (Perseverance of the Saints):</strong> Perseverancia y preservación de los santos.</li>
          </ul>`,
        image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Synodedordrecht.jpg"
      },
      {
        year: "1620",
        title: "Los Peregrinos llegan a América",
        tags: ['historia'],
        shortDesc: "Los separatistas puritanos atracan el navío Mayflower en tierra americana buscando libertad.",
        fullDesc: `Un gran grupo de separatistas puritanos, hastiados de la persecución y ahogo forzado de una corrupta Iglesia de Inglaterra, atracan valientemente sobre
          las inexploradas costas de Plymouth en Massachusetts a bordo del famoso navío histórico 'Mayflower'. Buscando libertad absoluta establecieron una colonia
          en el nuevo mundo fuertemente cimentada en ideales y enseñanzas pías, conocidos y elogiados hoy en la historia americana como los verdaderos
          <a href='https://es.wikipedia.org/wiki/Padres_peregrinos' target='_blank' class='inline-link' data-preview='Padres Peregrinos'>Pilgrims</a> o Madres/Padres Peregrinos americanos.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/George-Henry-Boughton-Pilgrims-Going-To-Church.jpg"
      }
    ]
  },
  {
    name: "Bautistas Primitivos y Revisiones Hispanas",
    bgImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg/1280px-KJV-King-James-Version-Bible-first-edition-title-page-1611.jpg",
    color: "#10b981",
    events: [
      {
        year: "1827",
        title: "Declaración de Kehukee",
        tags: ['doctrina', 'historia'],
        shortDesc: "La Asociación Bautista de Kehukee rechaza las misiones centralizadas, los seminarios y las sociedades bíblicas modernas, dando origen al movimiento Bautista Primitivo.",
        fullDesc: `La <a href='https://en.wikipedia.org/wiki/Kehukee_Primitive_Baptist_Church' target='_blank' class='inline-link' data-preview='Iglesia Primitiva Bautista de Kehukee'>Asociación Bautista de Kehukee</a>
          adoptó en octubre de 1827 la histórica <a href='https://baptiststudiesonline.com/wp-content/uploads/2007/02/the-kehukee-declaration.pdf' target='_blank' class='inline-link' data-preview='Texto original de la Declaración'>Declaración de Kehukee</a>
          en Halifax, Carolina del Norte. Cimentados en la doctrina calvinista de la soberanía absoluta de Dios, los bautistas primitivos rechazaron enfáticamente
          las misiones centralizadas, los seminarios y las sociedades bíblicas modernas por considerarlos innovaciones humanas contrarias a la Regla Reguladora de la iglesia.
          Esta declaración marcó el nacimiento formal del movimiento Bautista Primitivo en América. La iglesia de Kehukee aún existe y puede verse en su
          <a href='https://maps.app.goo.gl/KMk9AFqRkBHoyNoL8' target='_blank' class='inline-link' data-preview='Ver iglesia en Google Maps'>ubicación histórica original en Carolina del Norte</a>.`,
        image: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=fL4X7WbmKHZ4liXyya7lsw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=56.005978&pitch=0&thumbfov=100"
      },
      {
        year: "1865",
        title: "Reina-Valera 1865",
        tags: ['biblia'],
        shortDesc: "Revisión del Dr. Ángel H. de Mora para la American Bible Society; un panorama textual más complejo de lo que normalmente se piensa.",
        fullDesc: `<p>La <strong>Reina-Valera 1865</strong> (también conocida como <strong>SBA 1865</strong>) es la revisión realizada por el
          <strong>Dr. Ángel H. de Mora</strong> para la <a href='https://es.wikipedia.org/wiki/Sociedad_B%C3%ADblica_Americana' target='_blank' class='inline-link'>American Bible Society</a>.
          Introdujo numerosos cambios respecto a la edición de 1602 y, según varios investigadores, en algunos lugares siguió la
          <a href='https://es.wikipedia.org/wiki/Vulgata' target='_blank' class='inline-link'>Vulgata Latina</a> o traducciones tradicionales
          en vez del <a href='https://es.wikipedia.org/wiki/Textus_Receptus' target='_blank' class='inline-link'>Textus Receptus</a>.</p>

          <img src='https://assets.lulu.com/cover_thumbs/1/9/19zjk72j-ebook-shortedge-384.jpg'
          class='modal-inline-img' alt='Edición moderna de la RV 1865' title='Edición moderna de la Reina-Valera 1865'>

          <p><strong>📜 ¿Dos estados textuales?</strong></p>
          <p>Existen al menos dos estados textuales asociados a esta revisión, según autores dentro del movimiento de defensa del Textus Receptus:</p>
          <ul class='modal-list'>
            <li><strong>1865 original:</strong> La revisión tal como fue publicada inicialmente, con algunas lecturas procedentes de la Vulgata Latina.</li>
            <li><strong>1865 "revisada":</strong> Una edición posterior cuyo propósito, según descripciones halladas en proyectos de digitalización, fue eliminar las lecturas procedentes de la Vulgata y restaurar las del Textus Receptus, acercando la revisión al texto griego tradicional.</li>
          </ul>

          <p><strong>📖 Un panorama más complejo de lo que parece:</strong></p>
          <p>La introducción del texto digitalizado de la 1865 explica que el ejemplar escaneado representa una <strong>edición de 1884</strong>,
          y que hubo considerable trabajo editorial para distinguir revisiones diferentes de la época (1858, 1862 y 1865).
          Existen múltiples impresiones posteriores (1884, 1907, etc.) con correcciones tipográficas y editoriales, pero estas
          siguen identificándose como la revisión de 1865, no como una nueva revisión oficial.</p>

          <p><strong>⚠️ Nota crítica:</strong></p>
          <p>En cuanto a la afirmación de que existe una "1865 revisada" que elimina lecturas de la Vulgata para acercarse al
          Textus Receptus, <strong>no se ha encontrado documentación primaria que la respalde</strong>. No existe un prólogo, aviso editorial
          o registro histórico conocido que anuncie oficialmente una segunda revisión de la 1865 con ese objetivo.
          El término "revisada" parece describir una impresión corregida o una edición preparada por editores modernos,
          no una segunda revisión oficialmente publicada por la American Bible Society. Esta afirmación aparece repetida
          en algunos círculos defensores del Textus Receptus, pero carece de respaldo documental formal.</p>`,
        image: "https://static.wixstatic.com/media/a83ea6_a868bbd3c93b404b862e05c9c2e6c3d2~mv2.jpg/v1/fill/w_980,h_1307,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/a83ea6_a868bbd3c93b404b862e05c9c2e6c3d2~mv2.jpg"
      },
      {
        year: "1909",
        title: "Reina-Valera 1909 (La Antigua)",
        tags: ['biblia'],
        shortDesc: "Revisión histórica muy apreciada, criticada modernamente por permitir lecturas del Texto Crítico.",
        fullDesc: `Publicada por la Sociedad Bíblica Americana y la Británica, la <strong>RV 1909</strong> actualizó la ortografía. Sin embargo, incorporó sutilmente algunas influencias
          del <strong>Texto Crítico</strong> en su NT, apartándose del Textus Receptus puro. Esta mezcla motivó los futuros esfuerzos de purificación independiente.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Biblia_Reina-Valera_1909.jpg"
      },
      {
        year: "1947",
        title: "Descubrimiento de los Rollos del Mar Muerto",
        tags: ['biblia', 'historia'],
        shortDesc: "Una vasta colección de manuscritos bíblicos antiguos, copiados y preservados por una comunidad judía en el desierto, salen a la luz.",
        fullDesc: `<img src='https://upload.wikimedia.org/wikipedia/commons/1/15/Temple_Scroll.png'
          class='modal-inline-img' alt='Rollo del Templo' title='Fragmento del Rollo del Templo, uno de los manuscritos más largos'>
          Escritos, copiados y preservados entre el siglo III a.C. y el año 68 d.C., los <a href='https://es.wikipedia.org/wiki/Manuscritos_del_Mar_Muerto' target='_blank' class='inline-link' data-preview='Conoce más sobre los Rollos'>Rollos del Mar Muerto</a>
          son una extraordinaria colección de más de 900 manuscritos judíos antiguos. Fueron ocultados en vasijas de barro dentro de varias cuevas rocosas en 
          <strong>Qumrán</strong>, cerca de las áridas costas del Mar Muerto, presumiblemente para protegerlos del avance del ejército romano durante la Gran Revuelta Judía. 
          Su asombroso <strong>descubrimiento a partir de 1947</strong> por un joven pastor beduino sacudió el mundo de la erudición bíblica, constituyendo el mayor hallazgo arqueológico del siglo XX.<br><br>
          <img src='https://upload.wikimedia.org/wikipedia/commons/c/cb/Qumran.jpeg'
          class='modal-inline-img img-large' alt='Cuevas de Qumrán' title='Las cuevas de Qumrán, donde se ocultaron los rollos por casi dos milenios'>
          <strong>📜 ¿Qué se encontró en las cuevas?:</strong>
          <ul class='modal-list'>
            <li><strong>Manuscritos Bíblicos (40%):</strong> Copias de todos los libros del Antiguo Testamento hebreo (excepto Ester). Destaca el <strong>Gran Rollo de Isaías</strong>, el cual demostró una precisión asombrosa en la preservación del texto al ser comparado con el Texto Masorético medieval de mil años después.</li>
            <li><strong>Textos Sectarios (30%):</strong> Documentos exclusivos de la estricta comunidad judía que habitó la zona (probablemente esenios). Incluyen reglas de vida (<em>Regla de la Comunidad</em>), leyes y comentarios interpretativos (<em>Pesher Habacuc</em>), y el curioso <em>Rollo de Cobre</em> que lista tesoros escondidos.</li>
            <li><strong>Literatura Intertestamentaria (30%):</strong> Textos judíos apócrifos y pseudoepigráficos altamente valorados en el judaísmo del Segundo Templo, como copias del <em>Libro de Enoc</em> y el <em>Libro de los Jubileos</em>.</li>
            <li><strong>⚠️ Aclaración importante:</strong> En los Rollos del Mar Muerto <strong>no se encontró absolutamente ningún texto del Nuevo Testamento</strong> ni evangelios gnósticos. Frecuentemente se confunde Qumrán con el hallazgo de la <strong>Biblioteca de Nag Hammadi</strong> (Egipto, 1945), donde sí se descubrió el famoso <em>Evangelio de Tomás</em>. Qumrán fue una biblioteca estrictamente judía precristiana, mientras que Nag Hammadi fue un depósito gnóstico copto posterior.</li>
          </ul>`,
        image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Jericho_and_Dead_Sea_area_and_River_Jordan._Qumran%2C_caves_where_Dead_Sea_scrolls_were_found._Dead_Sea_in_distance_LOC_matpc.22897_%28cropped_and_level_adjusted%29.jpg"
      },
      {
        year: "1960",
        title: "Reina-Valera 1960",
        tags: ['biblia'],
        shortDesc: "Las Sociedades Bíblicas Unidas publican la revisión que se convertiría en la Biblia más amada en el mundo de habla hispana contemporáneo.",
        fullDesc: `<img src='https://m.media-amazon.com/images/S/aplus-media-library-service-media/df26a498-b71f-448b-abca-ea2d839a909c.__CR0,0,350,175_PT0_SX350_V1___.png' class='modal-inline-img' alt='Biblia RVR 1960' title='Reina-Valera 1960'>
          Coordinada por las <a href='https://es.wikipedia.org/wiki/Sociedades_B%C3%ADblicas_Unidas' target='_blank' class='inline-link' data-preview='Unión bíblica global'>Sociedades Bíblicas Unidas (SBU)</a>, esta histórica magna revisión actualizó la gramática
          y el lenguaje de la Biblia para los hispanohablantes modernos mientras conservaba impecablemente la majestad y el estilo rítmico de la antigua traducción.<br><br>
          Gozando de una impresionante aceptación inmediata, la <strong>Reina-Valera 1960</strong> se estandarizó en casi todas las denominaciones evangélicas, siendo
          memorizada por innumerables generaciones. Sin embargo, en términos de pureza manuscrita, el comité revisor tomó una decisión trascendental: no se limitaron
          exclusivamente al <strong>Textus Receptus</strong>. En su lugar, decidieron incorporar en el Nuevo Testamento diversas lecturas provenientes de los
          <strong>Textos Críticos</strong> (manuscritos alejandrinos de corte minoritario). Esta separación del fundamento original estricto de Casiodoro de Reina y Valera
          se convirtió en la razón principal por la que, décadas después, los firmes defensores del Texto Recibido iniciarían grandes proyectos de revisión
          para restaurar fielmente la línea tradicional.`,
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Biblia_Reina_Valera_1960.jpg"
      },
      {
        year: "2001 – 2008",
        title: "Reina Valera 1602 Purificada",
        tags: ['biblia'],
        shortDesc: "Revisión bautista completada en Monterrey que purifica el antiguo texto de 1602 hacia la línea pura.",
        fullDesc: `Realizada por la Iglesia Bautista Bíblica de la Gracia en Monterrey (bajo la guía del pastor Raúl Reyes), la
          <a href='https://valera1602.org/' target='_blank' class='inline-link' data-preview='Sitio Oficial 1602 Purificada'>Biblia 1602 Purificada</a>
          surgió como un proyecto solemne para restaurar las bases de la histórica <strong>Biblia de Cipriano de Valera (1602)</strong>. Su propósito primordial es
          purificar al español moderno de todas las incrustaciones críticas que contaminaron las biblias posteriores a 1865, apelando directamente a la autoridad del
          <strong>Textus Receptus</strong> griego y al Texto Masorético hebreo, verificando meticulosamente las lecturas a la par del referente inglés de la <strong>King James Bible (1611)</strong>.`,
        image: "https://static.wixstatic.com/media/804ef4_e1108eec0c9247f9bd18c77efe0bcc5d~mv2.png/v1/fill/w_310,h_353,al_c,lg_1,q_85,enc_avif,quality_auto/804ef4_e1108eec0c9247f9bd18c77efe0bcc5d~mv2.png"
      },
      {
        year: "2004 – 2010",
        title: "Reina Valera Gómez (RVG)",
        tags: ['biblia'],
        shortDesc: "El Dr. Humberto Gómez lidera un esfuerzo de traducción para ser el paralelo léxico unánime de la histórica King James Version, apoyándose fuertemente en ella.",
        fullDesc: `Coordinada y respaldada cooperativamente por varios ministerios conservadores e iglesias independientes, la
          <a href='https://reinavaleragomez.com/' target='_blank' class='inline-link' data-preview='Sitio Oficial RV Gómez'>RVG</a> fue un esfuerzo dirigido por el Dr. Humberto Gómez.
          Tomando como base y estructura la histórica RV 1909, el equipo de traductores tuvo como norte alinear majestuosamente cada pasaje en el Nuevo Testamento
          para ser la máxima correspondencia léxica y doctrinal paralela en español a la <strong>King James Version (KJV)</strong> inglesa, apoyándose fuertemente en ella.
          Para este noble propósito, la RVG garantizó su completa y exclusiva cimentación sobre el incondicional <strong>Textus Receptus</strong>.`,
        image: "https://static.wixstatic.com/media/11062b_e769f4593dac4a98834be659eaaca4fd~mv2.jpg/v1/fill/w_2403,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_e769f4593dac4a98834be659eaaca4fd~mv2.jpg"
      },
      {
        year: "2020+",
        title: "Reina Valera SBT",
        tags: ['biblia'],
        shortDesc: "La Sociedad Bíblica Trinitaria somete la antigua RV 1909 a una revisión magistral amparada en los puros textos originales.",
        fullDesc: `El proyecto histórico liderado por la <a href='https://sociedadbiblicatrinitaria.org/' target='_blank' class='inline-link' data-preview='Página Oficial SBT Hispana'>Sociedad Bíblica Trinitaria (SBT)</a>
          persigue entregar a la esfera hispanohablante una depurada Reina-Valera de altísima calidad tomando como texto primario estructural a la venerable
          <strong>Reina-Valera 1909</strong>. Enmendando todas las infiltraciones del Texto Crítico que dicha versión albergó por un siglo, este esfuerzo institucional
          asegura depender de forma leal y exclusiva del <strong>Textus Receptus</strong> histórico y del Texto Masorético tradicional hebreo; coronando un inmenso frente
          erudito con el fin de preservar intacta la equivalencia formal de las palabras originales.`,
        image: "https://sociedadbiblicatrinitaria.org/wp-content/uploads/2025/11/Store01-400x400.jpg"
      }
    ]
  }
];

export const TIMELINE_ERAS: Record<string, { color: string, bgImage: string }> = TIMELINE_ERAS_DATA.reduce((acc, era) => {
  acc[era.name] = { color: era.color, bgImage: era.bgImage };
  return acc;
}, {} as Record<string, { color: string, bgImage: string }>);

export const TIMELINE_EVENTS: TimelineEvent[] = TIMELINE_ERAS_DATA.flatMap((era) => {
  return era.events.map((raw, index) => {
    const parsed = parseYearString(raw.year);
    return {
      id: `event-${era.name.substring(0, 3).replace(/\s+/g, '')}-${index}-${parsed.start}`,
      yearLabel: raw.year,
      yearStart: parsed.start,
      yearEnd: parsed.end,
      title: raw.title,
      tags: raw.tags,
      shortDesc: raw.shortDesc,
      fullDesc: raw.fullDesc,
      image: raw.image,
      era: era.name,
    };
  });
}).sort((a, b) => a.yearStart - b.yearStart);
