// Timeline domain models

export interface TimelineTag {
  id: string;
  label: string;   // en español
  icon: string;
  color: string;
  bg: string;
  border: string;
}

export interface TimelineEvent {
  id: string;
  yearLabel: string;   // string original para mostrar ("~250 a.C.", "382 – 405 d.C.", etc.)
  yearStart: number;   // año numérico parseado (negativo para a.C.)
  yearEnd: number | null; // null si es evento puntual
  title: string;
  tags: string[];      // array de tag IDs
  shortDesc: string;
  fullDesc: string;    // HTML sanitizado — se renderizará con innerHTML
  image: string;       // URL de imagen
  era: string;         // nombre de la era — preservado en datos
}
