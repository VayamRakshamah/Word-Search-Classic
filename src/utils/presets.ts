import { PresetCategory } from "../types";

export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: "forest_flora",
    name: "Forest Flora",
    icon: "Trees",
    description: "Discover beautiful trees, plants, and greenery.",
    difficulty: "Easy",
    words: ["PINE", "OAK", "MAPLE", "WILLOW", "CEDAR", "BIRCH", "HAZEL", "FERN", "MOSS"],
  },
  {
    id: "ocean_life",
    name: "Ocean Depths",
    icon: "Waves",
    description: "Search for sea creatures and marine marvels.",
    difficulty: "Medium",
    words: ["SHARK", "DOLPHIN", "WHALE", "OCTOPUS", "CORAL", "TURTLE", "MEDUSA", "STARFISH", "SEAL"],
  },
  {
    id: "cosmic_journey",
    name: "Cosmic Space",
    icon: "Orbit",
    description: "Astronomy, planets, and celestial systems.",
    difficulty: "Hard",
    words: ["NEBULA", "GALAXY", "METEOR", "PLANET", "COMET", "PULSAR", "ORBIT", "GRAVITY", "ASTRONAUT", "SATELLITE"],
  },
  {
    id: "fruity_frenzy",
    name: "Fruity Frenzy",
    icon: "Apple",
    description: "A fresh and delicious basket of orchard fruits.",
    difficulty: "Easy",
    words: ["APPLE", "BANANA", "ORANGE", "CHERRY", "PEACH", "GRAPE", "MANGO", "MELON", "BERRY"],
  },
  {
    id: "ancient_worlds",
    name: "Ancient Worlds",
    icon: "Crown",
    description: "Unearth lost ruins and historical civilizations.",
    difficulty: "Hard",
    words: ["PHARAOH", "PYRAMID", "DYNASTY", "EMPIRE", "TEMPLE", "SPHINX", "ROMAN", "GREEK", "OBELISK", "ARTIFACT"],
  },
  {
    id: "tech_terms",
    name: "Tech terms",
    icon: "Cpu",
    description: "Search for computer science and tech buzzwords.",
    difficulty: "Medium",
    words: ["REACT", "VITE", "DATABASE", "ROUTER", "SERVER", "LINTER", "BUNDLE", "COMPILER", "TYPESCRIPT", "EXPRESS"],
  }
];
