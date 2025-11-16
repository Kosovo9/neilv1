/**
 * PROMPTS MAESTROS DE GENERACIÓN DE IMÁGENES NAVIDEÑAS (Nivel 1000x)
 * 150 Prompts ultra-realistas para la temporada navideña
 * Sistema basado en 15 escenarios base y 10 variaciones de sujeto
 */

import { CompletePrompt } from './men';

// Variaciones de Sujeto
const SUBJECT_VARIATIONS = {
  man: 'A handsome, well-dressed man in his 30s',
  woman: 'A beautiful, elegant woman in her 30s',
  couple_hm: 'A stylish man and woman (heterosexual couple)',
  couple_hh: 'Two stylish men (homosexual couple)',
  couple_mm: 'Two stylish women (homosexual couple)',
  child: 'A wide-eyed, joyful child (age 6-8)',
  cat: 'A fluffy, majestic Maine Coon cat',
  dog: 'A loyal, golden retriever dog',
  family: 'A multi-generational family of seven (parents, grandparents, children)',
  team: 'A diverse, professional team of twelve colleagues in business attire'
};

// Acciones/Emociones por tipo de sujeto
const ACTION_EMOTIONS = {
  man: 'looking thoughtfully at the fire, holding a glass of whiskey',
  woman: 'smiling warmly, sipping hot cocoa from a delicate mug',
  couple_hm: 'sharing a tender, intimate moment, laughing softly',
  couple_hh: 'embracing warmly, looking at each other with deep affection',
  couple_mm: 'holding hands, sharing a joyful, candid smile',
  child: 'looking up with pure wonder and excitement',
  cat: 'curled up contentedly, observing the scene with curious eyes',
  dog: 'resting its head gently on the subject\'s lap, looking devotedly',
  family: 'gathered closely, sharing a moment of genuine, heartfelt connection',
  team: 'celebrating a successful year, raising a toast with champagne flutes'
};

// ESCENARIOS PRINCIPALES (5)
const SCENARIO_1_HEARTHSIDE = (subject: string, action: string) => 
  `${subject} ${action}, relaxing by a magnificent, crackling stone fireplace, with a towering, perfectly decorated Christmas tree casting a warm glow in the background. The room is a luxurious, rustic-chic cabin interior. Lighting: Soft, warm golden hour light from the fire and tree lights, deep shadows, cinematic chiaroscuro. Style: Shot on a Leica SL2 with a Noctilux 50mm f/0.95 lens, hyper-detailed, Kodak Portra 400 film grain, volumetric lighting, 8K, directed by Roger Deakins.`;

const SCENARIO_2_SANTA_RIDE = (subject: string, action: string) => 
  `${subject} ${action}, inside a classic, ornate wooden sleigh, soaring high above a snow-covered European village at midnight. The sleigh is pulled by eight majestic reindeer, led by Rudolph. Lighting: Dramatic, cold moonlight and starlight, with a magical, warm glow emanating from the sleigh's lanterns. Style: Epic wide-angle shot, cinematic matte painting quality, hyper-realistic fur and leather textures, shot on an Arri Alexa 65 with a 24mm lens, high dynamic range, 16K, directed by Steven Spielberg.`;

const SCENARIO_3_SANTA_QUIET = (subject: string, action: string) => 
  `${subject} ${action}, interacting with a hyper-realistic, benevolent Santa Claus in a lavish, traditional living room. Santa is seated next to a small, antique Christmas tree and a roaring fireplace. Lighting: Soft, directional key light, warm fill light, rich mahogany and velvet textures. Style: Editorial portrait, shot on a Phase One XF with a 80mm lens, shallow depth of field, hyper-detailed fabric and skin texture, 8K, by Annie Leibovitz.`;

const SCENARIO_4_TIMES_SQUARE = (subject: string, action: string) => 
  `${subject} ${action}, standing amidst the vibrant, chaotic energy of Times Square, NYC, on Christmas Eve. Giant billboards display festive messages, and the street is wet from a light snow. Lighting: Extreme contrast between the intense, saturated neon light and the dark night sky, reflections on the wet asphalt, atmospheric snow. Style: Gritty, cinematic street photography, shot on a Sony A7R V with a 35mm lens, high saturation, cyberpunk-noir aesthetic, 8K, directed by Ridley Scott.`;

const SCENARIO_5_ROCKEFELLER = (subject: string, action: string) => 
  `${subject} ${action}, ice skating at the Rockefeller Center rink, with the massive, brightly lit Christmas tree towering in the background. Skaters are blurred with motion. Lighting: Crisp, cold winter light, warm, golden light from the tree and surrounding buildings, subtle steam from breath. Style: Dynamic, wide-angle shot, long exposure to capture motion blur, shot on a Canon EOS R5 with a 16-35mm lens, editorial travel photography, hyper-detailed, 8K, by Chris Burkard.`;

// ESCENARIOS ADICIONALES (10)
const SCENARIO_6_CHRISTMAS_MARKET = (subject: string, action: string) => 
  `${subject} ${action}, at a bustling, snow-covered traditional German Christmas Market (Christkindlmarkt). They are holding a steaming mug of Glühwein (mulled wine). Lighting: Warm, cozy tungsten light from the wooden stalls, soft snowfall, bokeh from distant string lights. Style: Cozy, warm aesthetic, shot on a Fujifilm GFX 100S with a 110mm lens, shallow depth of field, cinematic winter glow, 8K.`;

const SCENARIO_7_COOKIE_BAKING = (subject: string, action: string) => 
  `${subject} ${action}, in a brightly lit, rustic kitchen, surrounded by flour and festive chaos, decorating elaborate gingerbread cookies. Lighting: High-key, bright natural light from a window, warm overhead kitchen lights, focus on texture of icing and dough. Style: Bright, cheerful editorial food photography, shot on a Nikon Z9 with a 50mm macro lens, extreme detail, 8K.`;

const SCENARIO_8_CHRISTMAS_MORNING = (subject: string, action: string) => 
  `${subject} ${action}, waking up on Christmas morning, surrounded by wrapped gifts and a brightly lit tree. Lighting: Soft, early morning blue light mixing with the warm, colorful glow of the tree lights, subtle lens flare. Style: Intimate, candid portraiture, shot on a Canon 5D Mark IV with a 85mm lens, dreamy, nostalgic feel, 8K.`;

const SCENARIO_9_SILENT_FOREST = (subject: string, action: string) => 
  `${subject} ${action}, standing in a pristine, silent forest covered in fresh, heavy snow. They are wearing elegant, warm winter clothing. Lighting: Soft, diffused daylight on an overcast day, high contrast between the white snow and dark trees, cold color palette. Style: Epic landscape portrait, shot on a Hasselblad H6D-400c with a 40mm lens, ultra-sharp focus, Ansel Adams style composition, 16K.`;

const SCENARIO_10_GALA = (subject: string, action: string) => 
  `${subject} ${action}, at a sophisticated, black-tie Christmas gala. They are holding a champagne flute. Lighting: Dramatic, low-key lighting, glittering reflections from crystal and sequins, strong rim light on the subject. Style: High-fashion editorial, shot on a Phase One XF with a 100mm lens, Vogue aesthetic, 8K, by Mario Testino.`;

const SCENARIO_11_BOOK_NOOK = (subject: string, action: string) => 
  `${subject} ${action}, curled up in a large armchair next to a window, reading a book, with a thick, hand-knitted blanket and a mug of hot cocoa. The window shows a gentle snowfall. Lighting: Soft, warm lamplight (tungsten), subtle blue light from the window, focus on the texture of the blanket and steam. Style: Hygge aesthetic, intimate close-up, shot on a Sony A1 with a 135mm lens, extreme bokeh, 8K.`;

const SCENARIO_12_DECORATING_TREE = (subject: string, action: string) => 
  `${subject} ${action}, carefully placing a vintage ornament on a large, fully decorated Christmas tree. Lighting: Warm, colorful glow from the tree lights, soft overhead light, focus on the delicate detail of the ornament. Style: Nostalgic, vibrant color photography, shot on a Nikon D850 with a 50mm lens, cinematic depth, 8K.`;

const SCENARIO_13_GIFT_EXCHANGE = (subject: string, action: string) => 
  `${subject} ${action}, exchanging beautifully wrapped gifts, with a pile of presents nearby. Lighting: Bright, even lighting, focus on the genuine emotion and the texture of the wrapping paper and ribbons. Style: Clean, high-key commercial photography, shot on a Canon EOS R3 with a 70-200mm lens, 8K.`;

const SCENARIO_14_CHRISTMAS_EVE_DINNER = (subject: string, action: string) => 
  `${subject} ${action}, seated at a long, beautifully set dining table for Christmas Eve dinner. The table is adorned with candles, crystal, and a festive centerpiece. Lighting: Warm, low-level candlelight and chandelier light, dramatic shadows, focus on the food and the atmosphere. Style: Masterpiece still life/editorial, shot on a Phase One XF with a 120mm macro lens, Dutch Masters painting influence, 8K.`;

const SCENARIO_15_CITY_STROLL = (subject: string, action: string) => 
  `${subject} ${action}, walking down a busy, snow-dusted city street lined with festive lights and wreaths. Lighting: Cold, blue ambient light, warm yellow light from shop windows, subtle motion blur in the background. Style: Dynamic street portrait, shot on a Leica M11 with a 50mm lens, candid, photojournalistic style, 8K.`;

// Función para generar todos los prompts
function generateChristmasPrompts(): CompletePrompt[] {
  const prompts: CompletePrompt[] = [];
  const scenarios = [
    { id: 'hearthside', name: 'Chimenea y Árbol Clásico', fn: SCENARIO_1_HEARTHSIDE },
    { id: 'santa_ride', name: 'Trineo de Santa en Vuelo', fn: SCENARIO_2_SANTA_RIDE },
    { id: 'santa_quiet', name: 'Santa en Sala Clásica', fn: SCENARIO_3_SANTA_QUIET },
    { id: 'times_square', name: 'Times Square en Nochebuena', fn: SCENARIO_4_TIMES_SQUARE },
    { id: 'rockefeller', name: 'Rockefeller Center', fn: SCENARIO_5_ROCKEFELLER },
    { id: 'christmas_market', name: 'Mercado Navideño Europeo', fn: SCENARIO_6_CHRISTMAS_MARKET },
    { id: 'cookie_baking', name: 'Hornear Galletas', fn: SCENARIO_7_COOKIE_BAKING },
    { id: 'christmas_morning', name: 'Despertar Matutino', fn: SCENARIO_8_CHRISTMAS_MORNING },
    { id: 'silent_forest', name: 'Paisaje Nevado', fn: SCENARIO_9_SILENT_FOREST },
    { id: 'gala', name: 'Fiesta de Gala', fn: SCENARIO_10_GALA },
    { id: 'book_nook', name: 'Lectura Acogedora', fn: SCENARIO_11_BOOK_NOOK },
    { id: 'decorating_tree', name: 'Decorando el Árbol', fn: SCENARIO_12_DECORATING_TREE },
    { id: 'gift_exchange', name: 'Intercambio de Regalos', fn: SCENARIO_13_GIFT_EXCHANGE },
    { id: 'christmas_eve_dinner', name: 'Cena de Nochebuena', fn: SCENARIO_14_CHRISTMAS_EVE_DINNER },
    { id: 'city_stroll', name: 'Retrato de Invierno Urbano', fn: SCENARIO_15_CITY_STROLL }
  ];

  const subjectKeys = Object.keys(SUBJECT_VARIATIONS) as Array<keyof typeof SUBJECT_VARIATIONS>;
  
  scenarios.forEach((scenario, scenarioIndex) => {
    subjectKeys.forEach((subjectKey, subjectIndex) => {
      const subject = SUBJECT_VARIATIONS[subjectKey];
      const action = ACTION_EMOTIONS[subjectKey];
      const prompt = scenario.fn(subject, action);
      
      prompts.push({
        id: `christmas_${scenario.id}_${subjectKey}`,
        uiLabel: `${scenario.name} - ${getSubjectLabel(subjectKey)}`,
        completePrompt: prompt,
        tags: ['christmas', 'holiday', 'winter', scenario.id, subjectKey],
        style: getStyleForScenario(scenarioIndex)
      });
    });
  });

  return prompts;
}

function getSubjectLabel(key: string): string {
  const labels: Record<string, string> = {
    man: 'Hombre',
    woman: 'Mujer',
    couple_hm: 'Pareja (H/M)',
    couple_hh: 'Pareja (H/H)',
    couple_mm: 'Pareja (M/M)',
    child: 'Niño/Niña',
    cat: 'Mascota (Gato)',
    dog: 'Mascota (Perro)',
    family: 'Familia',
    team: 'Equipo'
  };
  return labels[key] || key;
}

function getStyleForScenario(index: number): 'casual' | 'professional' | 'luxury' {
  if (index < 5) return 'luxury'; // Escenarios principales
  if (index < 10) return 'professional'; // Escenarios adicionales 1-5
  return 'casual'; // Escenarios adicionales 6-10
}

export const christmasPrompts: CompletePrompt[] = generateChristmasPrompts();

export function getChristmasPromptById(id: string): CompletePrompt | undefined {
  return christmasPrompts.find(p => p.id === id);
}

export function getChristmasPromptsBySubject(subject: string): CompletePrompt[] {
  return christmasPrompts.filter(p => p.tags.includes(subject));
}

export function getChristmasPromptsByScenario(scenario: string): CompletePrompt[] {
  return christmasPrompts.filter(p => p.tags.includes(scenario));
}

export function getRandomChristmasPrompt(): CompletePrompt {
  return christmasPrompts[Math.floor(Math.random() * christmasPrompts.length)];
}

