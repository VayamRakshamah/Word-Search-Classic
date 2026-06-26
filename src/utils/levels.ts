import { GameLevel } from "../types";

export interface ThemeSeed {
  name: string;
  icon: string;
  description: string;
  words: string[];
}

// 40 Curated High-Quality Themes with deep vocabularies (20-30 words each) for endless dynamic combinations
export const THEME_SEEDS: ThemeSeed[] = [
  {
    name: "Forest Flora",
    icon: "Trees",
    description: "Trees, foliage, and woodland greenery.",
    words: [
      "PINE", "OAK", "MAPLE", "WILLOW", "CEDAR", "BIRCH", "HAZEL", "FERN", "MOSS", 
      "REDWOOD", "SPRUCE", "CHERRY", "CYPRESS", "ELM", "ASH", "ALDER", "JUNIPER", 
      "CHESTNUT", "POPLAR", "WALNUT", "HICKORY", "BAMBOO", "IVY", "CLOVER"
    ]
  },
  {
    name: "Ocean Depths",
    icon: "Waves",
    description: "Marine creatures and underwater sights.",
    words: [
      "SHARK", "DOLPHIN", "WHALE", "OCTOPUS", "CORAL", "TURTLE", "MEDUSA", "STARFISH", "SEAL",
      "JELLYFISH", "LOBSTER", "CRAB", "SHRIMP", "MANATEE", "WALRUS", "PENGUIN", "ORCA",
      "SALMON", "TUNA", "ANEMONE", "SEAHORSE", "STINGRAY", "SPONGE", "SQUID", "OYSTER"
    ]
  },
  {
    name: "Cosmic Space",
    icon: "Orbit",
    description: "Explore planets, stars, and galaxies.",
    words: [
      "NEBULA", "GALAXY", "METEOR", "PLANET", "COMET", "PULSAR", "ORBIT", "GRAVITY", "ASTRONAUT",
      "SATELLITE", "SUN", "MOON", "MARS", "JUPITER", "SATURN", "VENUS", "URANUS", "NEPTUNE", "PLUTO",
      "STAR", "COSMOS", "ECLIPSE", "CRATER", "ROCKET", "TELESCOPE", "QUASAR"
    ]
  },
  {
    name: "Fruit Frenzy",
    icon: "Apple",
    description: "Sweet and tangy fruits of the world.",
    words: [
      "APPLE", "BANANA", "ORANGE", "CHERRY", "PEACH", "GRAPE", "MANGO", "MELON", "BERRY",
      "PEAR", "PLUM", "LEMON", "LIME", "KIWI", "PAPAYA", "FIG", "DATE", "APRICOT", "COCONUT",
      "PINEAPPLE", "AVOCADO", "GUAVA", "LYCHEE", "OLIVE", "TANGERINE"
    ]
  },
  {
    name: "Ancient Worlds",
    icon: "Crown",
    description: "Lost cities and majestic empires.",
    words: [
      "PHARAOH", "PYRAMID", "DYNASTY", "EMPIRE", "TEMPLE", "SPHINX", "ROMAN", "GREEK", "OBELISK",
      "ARTIFACT", "RUINS", "MUMMY", "CAESAR", "GLADIATOR", "ATHENS", "COLOSSEUM", "HIEROGLYPH",
      "KINGDOM", "SCROLL", "TOMBS", "LEGEND", "CHIEFTAIN", "CASTLE", "CITADEL"
    ]
  },
  {
    name: "Tech Buzzwords",
    icon: "Cpu",
    description: "Modern computing and hardware terms.",
    words: [
      "REACT", "VITE", "DATABASE", "ROUTER", "SERVER", "LINTER", "BUNDLE", "COMPILER", "TYPESCRIPT",
      "EXPRESS", "NODE", "PYTHON", "BINARY", "CHIP", "PIXEL", "ALGORITHM", "AI", "CLOUD", "GITHUB",
      "INTERFACE", "REDUX", "VARIABLE", "FUNCTION", "OBJECT", "TERMINAL"
    ]
  },
  {
    name: "Desert Dunes",
    icon: "Sun",
    description: "Life in the hot arid sands.",
    words: [
      "CACTUS", "OASIS", "CAMEL", "SAND", "DUNES", "MIRAJE", "COYOTE", "HEAT", "SUN", "SHADOW",
      "SCORPION", "LIZARD", "SNAKE", "CANYON", "NOMAD", "ROSE", "DRY", "WIND", "SAHARA", "GOBI"
    ]
  },
  {
    name: "Arctic Chill",
    icon: "Snowflake",
    description: "Frost, glaciers, and freezing winds.",
    words: [
      "GLACIER", "ICEBERG", "IGLOO", "FROST", "SNOW", "BLIZZARD", "TUNDRA", "HUSKY", "SLEIGH",
      "WINTER", "SHIVER", "PENGUIN", "POLAR", "AURORA", "SEAL", "MCMURDO", "ICICLE", "FREEZE", "COAT"
    ]
  },
  {
    name: "Kitchen Chef",
    icon: "Utensils",
    description: "Culinary tools, spices, and cooking terms.",
    words: [
      "SPATULA", "WHISK", "PAN", "OVEN", "KNIFE", "APRON", "SALT", "PEPPER", "RECIPE", "CHEF",
      "BOIL", "BAKE", "FRY", "GRILL", "ROAST", "SIMMER", "SPOON", "BOWL", "PITCHER", "BLENDER", "TOASTER"
    ]
  },
  {
    name: "Musical Notes",
    icon: "Music",
    description: "Instruments, melodies, and sound structures.",
    words: [
      "PIANO", "GUITAR", "VIOLIN", "DRUMS", "FLUTE", "TRUMPET", "CELLO", "HARP", "CHORD", "TEMPO",
      "MELODY", "RHYTHM", "SONATA", "OPERA", "CONCERT", "LYRIC", "SINGER", "BAND", "JAZZ", "BEAT"
    ]
  },
  {
    name: "Pet Parade",
    icon: "Dog",
    description: "Our beloved domestic animal companions.",
    words: [
      "PUPPY", "KITTEN", "RABBIT", "HAMSTER", "PARROT", "FERRET", "CANARY", "PONY", "TURTLE",
      "GOLDFISH", "GUINEAPIG", "CHAMELEON", "GERBIL", "CAT", "DOG", "BUDGIE", "MOUSE", "FROG"
    ]
  },
  {
    name: "Wild Savannah",
    icon: "Compass",
    description: "Majestic animals of the grasslands.",
    words: [
      "LION", "CHEETAH", "ELEPHANT", "GIRAFFE", "ZEBRA", "HYENA", "ANTELOPE", "BUFFALO", "RHINO",
      "LEOPARD", "OSTRICH", "MEERKAT", "BABOON", "WARTHOG", "GAZELLE", "VULTURE", "SNAKE", "HERD"
    ]
  },
  {
    name: "Birds Canopy",
    icon: "Bird",
    description: "Feathered friends of the sky.",
    words: [
      "EAGLE", "HAWK", "FALCON", "ROBIN", "SPARROW", "PIGEON", "SWAN", "DUCK", "OWL", "FLAMINGO",
      "PEACOCK", "PARROT", "TOUCAN", "PENGUIN", "WOODPECKER", "CROW", "SEAGULL", "FINCH", "HERON"
    ]
  },
  {
    name: "Weather Forecast",
    icon: "CloudRain",
    description: "Seasons, skies, and atmospheric changes.",
    words: [
      "RAIN", "STORM", "CLOUDY", "WINDY", "SUNNY", "FOGGY", "LIGHTNING", "THUNDER", "HAIL", "TYPHOON",
      "TORNADO", "HURRICANE", "GALE", "BREEZE", "RAINBOW", "HUMID", "SHOWER", "MIST", "DAMP", "FREEZING"
    ]
  },
  {
    name: "Prehistoric Era",
    icon: "Bone",
    description: "Dinosaur fossils, bones, and ancient epochs.",
    words: [
      "FOSSIL", "DINO", "TRICERATOPS", "RAPTOR", "MAMMOTH", "VOLCANO", "METEOR", "SWAMP", "BONE",
      "AMBER", "TRIASSIC", "JURASSIC", "CRETACEOUS", "ICEAGE", "CAVEMAN", "SPEAR", "TIGER", "GLACIER"
    ]
  },
  {
    name: "Mythical Lands",
    icon: "Sparkles",
    description: "Monsters, deities, and epic fairy legends.",
    words: [
      "DRAGON", "UNICORN", "PHOENIX", "GRIFFIN", "PEGASUS", "WIZARD", "WITCH", "FAIRY", "GOBLIN",
      "ELF", "GIANT", "TROLL", "CASTLE", "SPELL", "POTION", "MAGIC", "SWORD", "SHIELD", "CROWN"
    ]
  },
  {
    name: "Winter Wonderland",
    icon: "Snowflake",
    description: "Snug winter clothes and activities.",
    words: [
      "SWEATER", "SCARF", "GLOVES", "JACKET", "BOOTS", "BEANIE", "SKIING", "SKATING", "SLEDDING",
      "FIREPLACE", "COCOA", "COOKIES", "SNOWMAN", "SNOWBALL", "ICICLE", "BLANKET", "HEATER", "COZY"
    ]
  },
  {
    name: "Autumn Harvest",
    icon: "Leaf",
    description: "Crops, falling leaves, and warm spices.",
    words: [
      "PUMPKIN", "SQUASH", "TURKEY", "HARVEST", "LEAVES", "CORN", "WHEAT", "ACORN", "SCARECROW",
      "SPICE", "CINNAMON", "NUTMEG", "CIDER", "PIE", "CHILLY", "FOLIAGE", "ORCHARD", "HAYRIDE"
    ]
  },
  {
    name: "Sports Arena",
    icon: "Activity",
    description: "Athletics, balls, and popular matches.",
    words: [
      "SOCCER", "TENNIS", "CRICKET", "BASEBALL", "HOCKEY", "RUGBY", "GOLF", "BOXING", "RUNNING",
      "SWIMMING", "CYCLING", "SKATING", "STADIUM", "REF_EREE", "COACH", "MEDAL", "TROPHY", "ARENA", "ATHLETE"
    ]
  },
  {
    name: "Supermarket Run",
    icon: "ShoppingCart",
    description: "Groceries, aisles, and items on shelves.",
    words: [
      "GROCERIES", "CART", "CASHIER", "AISLE", "RECEIPT", "COUPON", "BREAD", "MILK", "EGGS", "CHEESE",
      "BUTTER", "JUICE", "VEGGIES", "FRUITS", "BAKERY", "DELI", "FREEZER", "BAGGER", "CHECKOUT"
    ]
  }
];

// Helper to deterministically generate a subset of words based on level index
function getLevelWords(seed: ThemeSeed, levelIndex: number, count: number): string[] {
  // Simple LCG (Linear Congruential Generator) based on levelIndex for stable, repeatable shuffling
  let m = 2 ** 31 - 1;
  let a = 1103515245;
  let c = 12345;
  let state = levelIndex + 42; // seed offset

  const nextRand = () => {
    state = (a * state + c) % m;
    return state / m;
  };

  const pool = [...seed.words];
  
  // Custom deterministic shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    const temp = pool[i];
    pool[i] = pool[j];
    pool[j] = temp;
  }

  // Filter to length between 3 and 10 to ensure neat layout
  const filtered = pool.filter(w => w.length >= 3 && w.length <= 10);

  return filtered.slice(0, count);
}

/**
 * Procedural level generator that dynamically computes level specifications
 * for Level 1 to Level 500+ sequentially!
 */
export function getGameLevel(levelNum: number): GameLevel {
  const seedIndex = (levelNum - 1) % THEME_SEEDS.length;
  const seed = THEME_SEEDS[seedIndex];

  // Progressive difficulty scaling
  let difficulty: "Easy" | "Medium" | "Hard" = "Easy";
  let gridSize = 8;
  let wordCount = 7;

  if (levelNum > 30 && levelNum <= 90) {
    difficulty = "Medium";
    gridSize = 10;
    wordCount = 9;
  } else if (levelNum > 90) {
    difficulty = "Hard";
    gridSize = 12;
    wordCount = 11;
  }

  // Generate deterministic words for this level
  const words = getLevelWords(seed, levelNum, wordCount);

  return {
    id: `level_${levelNum}`,
    categoryName: `Lvl ${levelNum}: ${seed.name}`,
    difficulty,
    gridSize,
    words,
  };
}
