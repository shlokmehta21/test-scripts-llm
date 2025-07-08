const { ChromaClient } = require("chromadb");
const OpenAI = require("openai");
const EXTENDED_PLAYSTATION_GAMES = [
  {
    id: 1,
    title: "Spider-Man: Miles Morales",
    genres: ["Action", "Adventure", "Superhero"],
    platforms: ["PS5", "PS4"],
    description:
      "Experience the rise of Miles Morales as he masters new powers to become his own Spider-Man in this epic superhero adventure.",
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2020,
    tags: [
      "superhero",
      "open-world",
      "web-slinging",
      "Marvel",
      "action",
      "story-driven",
    ],
  },
  {
    id: 2,
    title: "Marvel's Spider-Man Remastered",
    genres: ["Action", "Adventure", "Superhero"],
    platforms: ["PS5", "PS4"],
    description:
      "Swing through New York City as Peter Parker in this definitive Spider-Man experience with enhanced graphics and performance.",
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2018,
    tags: [
      "superhero",
      "open-world",
      "web-slinging",
      "Marvel",
      "action",
      "New York",
    ],
  },
  {
    id: 3,
    title: "The Last of Us Part II",
    genres: ["Action", "Adventure", "Survival Horror"],
    platforms: ["PS5", "PS4"],
    description:
      "A post-apocalyptic survival story following Ellie on a journey of revenge and redemption.",
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2020,
    tags: [
      "survival",
      "post-apocalyptic",
      "story-driven",
      "stealth",
      "zombies",
      "emotional",
    ],
  },
  {
    id: 4,
    title: "Ghost of Tsushima",
    genres: ["Action", "Adventure", "Stealth"],
    platforms: ["PS5", "PS4"],
    description:
      "Forge a new path as a legendary samurai in feudal Japan, fighting to liberate Tsushima Island.",
    developer: "Sucker Punch Productions",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2020,
    tags: [
      "samurai",
      "open-world",
      "stealth",
      "Japan",
      "historical",
      "sword-fighting",
    ],
  },
  {
    id: 5,
    title: "Ratchet & Clank: Rift Apart",
    genres: ["Action", "Adventure", "Platformer"],
    platforms: ["PS5"],
    description:
      "Blast your way through interdimensional adventure with incredible weapons and next-gen visuals.",
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    rating: "E10+",
    releaseYear: 2021,
    tags: [
      "platformer",
      "sci-fi",
      "weapons",
      "colorful",
      "family-friendly",
      "dimension-hopping",
    ],
  },
  {
    id: 6,
    title: "Horizon Zero Dawn",
    genres: ["Action", "Adventure", "RPG"],
    platforms: ["PS5", "PS4"],
    description:
      "Hunt robotic creatures in a beautiful post-apocalyptic world as Aloy uncovers the mysteries of the past.",
    developer: "Guerrilla Games",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2017,
    tags: [
      "robots",
      "bow-hunting",
      "open-world",
      "post-apocalyptic",
      "female-protagonist",
      "tribal",
    ],
  },
  {
    id: 7,
    title: "Horizon Forbidden West",
    genres: ["Action", "Adventure", "RPG"],
    platforms: ["PS5", "PS4"],
    description:
      "Continue Aloy's journey into the dangerous Forbidden West to find the source of a mysterious plague.",
    developer: "Guerrilla Games",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2022,
    tags: [
      "robots",
      "bow-hunting",
      "open-world",
      "underwater",
      "exploration",
      "machines",
    ],
  },
  {
    id: 8,
    title: "God of War (2018)",
    genres: ["Action", "Adventure", "Mythology"],
    platforms: ["PS5", "PS4"],
    description:
      "Kratos and his son Atreus embark on a journey through Norse mythology in this reimagined God of War.",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2018,
    tags: [
      "Norse-mythology",
      "father-son",
      "brutal-combat",
      "story-driven",
      "axe-combat",
      "emotional",
    ],
  },
  {
    id: 9,
    title: "God of War Ragnarök",
    genres: ["Action", "Adventure", "Mythology"],
    platforms: ["PS5", "PS4"],
    description:
      "Kratos and Atreus face the Norse apocalypse in this epic conclusion to the Norse saga.",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2022,
    tags: [
      "Norse-mythology",
      "Ragnarok",
      "father-son",
      "brutal-combat",
      "apocalypse",
      "Odin",
    ],
  },
  {
    id: 10,
    title: "Uncharted 4: A Thief's End",
    genres: ["Action", "Adventure"],
    platforms: ["PS5", "PS4"],
    description:
      "Nathan Drake's final adventure takes him around the globe in search of a legendary pirate treasure.",
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2016,
    tags: [
      "treasure-hunting",
      "climbing",
      "cinematic",
      "adventure",
      "pirates",
      "brotherhood",
    ],
  },
  {
    id: 11,
    title: "Uncharted: The Lost Legacy",
    genres: ["Action", "Adventure"],
    platforms: ["PS5", "PS4"],
    description:
      "Chloe Frazer and Nadine Ross team up to recover an ancient Indian artifact.",
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2017,
    tags: [
      "treasure-hunting",
      "female-protagonists",
      "India",
      "adventure",
      "teamwork",
      "ancient-artifacts",
    ],
  },
  {
    id: 12,
    title: "Bloodborne",
    genres: ["Action", "RPG", "Horror"],
    platforms: ["PS4"],
    description:
      "Hunt nightmarish creatures in the Gothic city of Yharnam in this challenging action RPG.",
    developer: "FromSoftware",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2015,
    tags: [
      "souls-like",
      "cosmic-horror",
      "Victorian-gothic",
      "challenging",
      "lovecraftian",
      "blood",
    ],
  },
  {
    id: 13,
    title: "Demon's Souls",
    genres: ["Action", "RPG", "Fantasy"],
    platforms: ["PS5"],
    description:
      "Experience the original souls-like game rebuilt from the ground up with stunning visuals.",
    developer: "Bluepoint Games",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2020,
    tags: [
      "souls-like",
      "challenging",
      "dark-fantasy",
      "remake",
      "medieval",
      "punishing",
    ],
  },
  {
    id: 14,
    title: "Returnal",
    genres: ["Action", "Roguelike", "Sci-Fi"],
    platforms: ["PS5"],
    description:
      "Break the cycle of death in this roguelike third-person shooter with psychological horror elements.",
    developer: "Housemarque",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2021,
    tags: [
      "roguelike",
      "time-loop",
      "alien-planet",
      "psychological",
      "bullet-hell",
      "sci-fi",
    ],
  },
  {
    id: 15,
    title: "Deathloop",
    genres: ["Action", "Stealth", "Sci-Fi"],
    platforms: ["PS5"],
    description:
      "Assassin trapped in a time loop must eliminate eight targets before the day resets.",
    developer: "Arkane Studios",
    publisher: "Bethesda Softworks",
    rating: "M",
    releaseYear: 2021,
    tags: [
      "time-loop",
      "assassination",
      "stealth",
      "1970s",
      "multiplayer",
      "innovative",
    ],
  },
  {
    id: 16,
    title: "Gran Turismo 7",
    genres: ["Racing", "Simulation"],
    platforms: ["PS5", "PS4"],
    description:
      "The ultimate driving simulator with hundreds of cars and legendary tracks.",
    developer: "Polyphony Digital",
    publisher: "Sony Interactive Entertainment",
    rating: "E",
    releaseYear: 2022,
    tags: ["racing", "simulation", "cars", "tracks", "realistic", "driving"],
  },
  {
    id: 17,
    title: "MLB The Show 23",
    genres: ["Sports", "Baseball"],
    platforms: ["PS5", "PS4"],
    description:
      "America's pastime comes to life with realistic gameplay and comprehensive baseball simulation.",
    developer: "San Diego Studio",
    publisher: "Sony Interactive Entertainment",
    rating: "E",
    releaseYear: 2023,
    tags: [
      "baseball",
      "sports",
      "simulation",
      "MLB",
      "realistic",
      "team-management",
    ],
  },
  {
    id: 18,
    title: "Sackboy: A Big Adventure",
    genres: ["Platformer", "Adventure"],
    platforms: ["PS5", "PS4"],
    description:
      "Sackboy embarks on a 3D platforming adventure with creative levels and cooperative gameplay.",
    developer: "Sucker Punch Productions",
    publisher: "Sony Interactive Entertainment",
    rating: "E",
    releaseYear: 2020,
    tags: [
      "platformer",
      "co-op",
      "family-friendly",
      "creative",
      "colorful",
      "music",
    ],
  },
  {
    id: 19,
    title: "Concrete Genie",
    genres: ["Adventure", "Puzzle"],
    platforms: ["PS4"],
    description:
      "Paint magical creatures to life and restore color to your polluted hometown.",
    developer: "PixelOpus",
    publisher: "Sony Interactive Entertainment",
    rating: "E10+",
    releaseYear: 2019,
    tags: [
      "artistic",
      "painting",
      "magic",
      "creativity",
      "healing",
      "bullying",
    ],
  },
  {
    id: 20,
    title: "Astro's Playroom",
    genres: ["Platformer", "Adventure"],
    platforms: ["PS5"],
    description:
      "Explore PlayStation history in this charming platformer that showcases the DualSense controller.",
    developer: "Team Asobi",
    publisher: "Sony Interactive Entertainment",
    rating: "E",
    releaseYear: 2020,
    tags: [
      "platformer",
      "PlayStation-history",
      "DualSense",
      "haptic-feedback",
      "nostalgia",
      "free",
    ],
  },
  {
    id: 21,
    title: "Days Gone",
    genres: ["Action", "Adventure", "Survival"],
    platforms: ["PS5", "PS4"],
    description:
      "Survive in a world overrun by zombie hordes while searching for hope and redemption.",
    developer: "Bend Studio",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2019,
    tags: [
      "zombies",
      "motorcycle",
      "open-world",
      "survival",
      "post-apocalyptic",
      "hordes",
    ],
  },
  {
    id: 22,
    title: "Death Stranding",
    genres: ["Action", "Adventure", "Sci-Fi"],
    platforms: ["PS5", "PS4"],
    description:
      "Reconnect fractured America in this unique delivery-based adventure from Hideo Kojima.",
    developer: "Kojima Productions",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2019,
    tags: [
      "delivery",
      "social-strand",
      "Kojima",
      "walking-simulator",
      "BTs",
      "connection",
    ],
  },
  {
    id: 23,
    title: "Nioh",
    genres: ["Action", "RPG", "Historical"],
    platforms: ["PS4"],
    description:
      "Master deadly combat in this challenging action RPG set in supernatural feudal Japan.",
    developer: "Team Ninja",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2017,
    tags: [
      "souls-like",
      "Japanese-mythology",
      "challenging",
      "samurai",
      "yokai",
      "historical",
    ],
  },
  {
    id: 24,
    title: "Nioh 2",
    genres: ["Action", "RPG", "Historical"],
    platforms: ["PS5", "PS4"],
    description:
      "Forge your own yokai destiny in this prequel to Nioh with enhanced combat and customization.",
    developer: "Team Ninja",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2020,
    tags: [
      "souls-like",
      "character-creation",
      "yokai",
      "co-op",
      "challenging",
      "supernatural",
    ],
  },
  {
    id: 25,
    title: "Persona 5 Royal",
    genres: ["JRPG", "Social Simulation"],
    platforms: ["PS5", "PS4"],
    description:
      "Live dual lives as a high school student and Phantom Thief in modern Tokyo.",
    developer: "Atlus",
    publisher: "Atlus",
    rating: "M",
    releaseYear: 2020,
    tags: [
      "JRPG",
      "social-links",
      "Tokyo",
      "phantom-thieves",
      "turn-based",
      "stylish",
    ],
  },
  {
    id: 26,
    title: "Final Fantasy VII Remake",
    genres: ["JRPG", "Action"],
    platforms: ["PS5", "PS4"],
    description:
      "Relive the classic JRPG with modern graphics and real-time combat in the city of Midgar.",
    developer: "Square Enix",
    publisher: "Square Enix",
    rating: "T",
    releaseYear: 2020,
    tags: [
      "JRPG",
      "Cloud-Strife",
      "Midgar",
      "remake",
      "real-time-combat",
      "Shinra",
    ],
  },
  {
    id: 27,
    title: "Final Fantasy XVI",
    genres: ["JRPG", "Action"],
    platforms: ["PS5"],
    description:
      "Experience a dark fantasy epic with political intrigue and massive Eikon battles.",
    developer: "Square Enix",
    publisher: "Square Enix",
    rating: "M",
    releaseYear: 2023,
    tags: ["JRPG", "dark-fantasy", "Eikons", "political", "mature", "medieval"],
  },
  {
    id: 28,
    title: "Resident Evil 4 Remake",
    genres: ["Survival Horror", "Action"],
    platforms: ["PS5", "PS4"],
    description:
      "Leon Kennedy's mission to rescue the President's daughter gets a stunning modern remake.",
    developer: "Capcom",
    publisher: "Capcom",
    rating: "M",
    releaseYear: 2023,
    tags: [
      "survival-horror",
      "Leon-Kennedy",
      "remake",
      "zombies",
      "action",
      "village",
    ],
  },
  {
    id: 29,
    title: "Resident Evil Village",
    genres: ["Survival Horror", "Action"],
    platforms: ["PS5", "PS4"],
    description:
      "Ethan Winters searches for his daughter in a mysterious European village filled with monsters.",
    developer: "Capcom",
    publisher: "Capcom",
    rating: "M",
    releaseYear: 2021,
    tags: [
      "survival-horror",
      "vampires",
      "village",
      "first-person",
      "Lady-Dimitrescu",
      "werewolves",
    ],
  },
  {
    id: 30,
    title: "Stellar Blade",
    genres: ["Action", "RPG", "Sci-Fi"],
    platforms: ["PS5"],
    description:
      "Stylish action RPG featuring EVE fighting to reclaim Earth from alien invaders.",
    developer: "Shift Up",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2024,
    tags: [
      "action-RPG",
      "female-protagonist",
      "post-apocalyptic",
      "aliens",
      "stylish",
      "combo-combat",
    ],
  },
  {
    id: 31,
    title: "Helldivers 2",
    genres: ["Action", "Shooter", "Co-op"],
    platforms: ["PS5"],
    description:
      "Spread managed democracy across the galaxy in this chaotic cooperative shooter.",
    developer: "Arrowhead Game Studios",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2024,
    tags: [
      "co-op",
      "satire",
      "friendly-fire",
      "democracy",
      "aliens",
      "top-down-shooter",
    ],
  },
  {
    id: 32,
    title: "The Last of Us Part I",
    genres: ["Action", "Adventure", "Survival"],
    platforms: ["PS5"],
    description:
      "The complete remake of the original Last of Us with enhanced visuals and gameplay.",
    developer: "Naughty Dog",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2022,
    tags: [
      "survival",
      "post-apocalyptic",
      "Joel",
      "Ellie",
      "remake",
      "emotional",
    ],
  },
  {
    id: 33,
    title: "Ghost of Tsushima Director's Cut",
    genres: ["Action", "Adventure"],
    platforms: ["PS5", "PS4"],
    description:
      "The complete samurai experience including the Iki Island expansion with new story content.",
    developer: "Sucker Punch Productions",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2021,
    tags: [
      "samurai",
      "expansion",
      "Iki-Island",
      "director's-cut",
      "Mongolia",
      "honor",
    ],
  },
  {
    id: 34,
    title: "Infamous Second Son",
    genres: ["Action", "Adventure", "Superhero"],
    platforms: ["PS4"],
    description:
      "Delsin Rowe discovers superhuman powers and must choose between heroism and infamy.",
    developer: "Sucker Punch Productions",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2014,
    tags: [
      "superhero",
      "moral-choices",
      "powers",
      "Seattle",
      "conduit",
      "open-world",
    ],
  },
  {
    id: 35,
    title: "Infamous First Light",
    genres: ["Action", "Adventure", "Superhero"],
    platforms: ["PS4"],
    description:
      "Play as Fetch and master neon powers in this standalone expansion to Second Son.",
    developer: "Sucker Punch Productions",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2014,
    tags: [
      "superhero",
      "neon-powers",
      "female-protagonist",
      "prequel",
      "Seattle",
      "powers",
    ],
  },
  {
    id: 36,
    title: "Gravity Rush 2",
    genres: ["Action", "Adventure", "Supernatural"],
    platforms: ["PS4"],
    description:
      "Manipulate gravity to soar through floating cities in this unique adventure.",
    developer: "Japan Studio",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2017,
    tags: [
      "gravity-manipulation",
      "floating-cities",
      "unique",
      "Kat",
      "supernatural",
      "flying",
    ],
  },
  {
    id: 37,
    title: "Shadow of the Colossus",
    genres: ["Action", "Adventure", "Puzzle"],
    platforms: ["PS4"],
    description:
      "Climb and defeat massive colossi in this haunting remake of the PS2 classic.",
    developer: "Bluepoint Games",
    publisher: "Sony Interactive Entertainment",
    rating: "T",
    releaseYear: 2018,
    tags: [
      "boss-battles",
      "colossi",
      "climbing",
      "remake",
      "atmospheric",
      "minimalist",
    ],
  },
  {
    id: 38,
    title: "Until Dawn",
    genres: ["Horror", "Interactive Drama"],
    platforms: ["PS4"],
    description:
      "Make life-or-death decisions in this interactive horror thriller where your choices matter.",
    developer: "Supermassive Games",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2015,
    tags: [
      "horror",
      "choices-matter",
      "interactive-drama",
      "teenagers",
      "wendigo",
      "butterfly-effect",
    ],
  },
  {
    id: 39,
    title: "Detroit: Become Human",
    genres: ["Interactive Drama", "Sci-Fi"],
    platforms: ["PS4"],
    description:
      "Experience the stories of three androids in a future Detroit where artificial beings seek freedom.",
    developer: "Quantic Dream",
    publisher: "Sony Interactive Entertainment",
    rating: "M",
    releaseYear: 2018,
    tags: [
      "androids",
      "choices-matter",
      "Detroit",
      "AI",
      "interactive-drama",
      "multiple-endings",
    ],
  },
  {
    id: 40,
    title: "Tearaway Unfolded",
    genres: ["Platformer", "Adventure"],
    platforms: ["PS4"],
    description:
      "Embark on a papercraft adventure where you help Iota or Atoi deliver an important message.",
    developer: "Media Molecule",
    publisher: "Sony Interactive Entertainment",
    rating: "E",
    releaseYear: 2015,
    tags: [
      "papercraft",
      "creative",
      "family-friendly",
      "platformer",
      "unique",
      "messenger",
    ],
  },
];

class GameVectorDB {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
    });
    this.chromaClient = new ChromaClient({
      ssl: false,
      host: process.env.CHROMA_HOST || "localhost",
      port: process.env.CHROMA_PORT || 8000,
    });
    this.collection = null;
    this.collectionName = "games_collection";
    this.embeddingModel = "text-embedding-3-small";
  }

  /**
   * Initialize or get the ChromaDB collection
   */
  async initializeCollection() {
    try {
      // Try to get existing collection
      this.collection = await this.chromaClient.getCollection({
        name: this.collectionName,
      });
      console.log(
        `✅ Connected to existing collection: ${this.collectionName}`
      );
    } catch (error) {
      // Create new collection if it doesn't exist
      this.collection = await this.chromaClient.createCollection({
        name: this.collectionName,
        metadata: {
          description: "Game database with semantic search capabilities",
        },
      });
      console.log(`✅ Created new collection: ${this.collectionName}`);
    }
  }

  /**
   * Create a comprehensive text representation of a game for embedding
   */
  createTextForEmbedding(game) {
    const textParts = [
      `Title: ${game.title}`,
      `Genre: ${game.genres.join(", ")}`,
      `Platform: ${game.platforms.join(", ")}`,
      `Description: ${game.description}`,
      `Developer: ${game.developer}`,
      `Publisher: ${game.publisher}`,
      `Tags: ${game.tags.join(", ")}`,
      `Rating: ${game.rating}`,
    ];
    return textParts.join(" | ");
  }

  /**
   * Get embedding for a text using OpenAI API
   */
  async getEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error getting embedding:", error.message);
      return null;
    }
  }

  /**
   * Add games to the ChromaDB collection
   */
  async addGames(games) {
    if (!this.collection) {
      await this.initializeCollection();
    }

    console.log("Adding games to ChromaDB...");

    const documents = [];
    const embeddings = [];
    const metadatas = [];
    const ids = [];

    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      console.log(`Processing game ${i + 1}/${games.length}: ${game.title}`);

      // Create text representation
      const gameText = this.createTextForEmbedding(game);

      // Generate embedding
      const embedding = await this.getEmbedding(gameText);

      if (embedding) {
        documents.push(gameText);
        embeddings.push(embedding);
        metadatas.push({
          ...game,
          genres: JSON.stringify(game.genres),
          platforms: JSON.stringify(game.platforms),
          tags: JSON.stringify(game.tags),
        });
        ids.push(`game_${game.id}`);
      } else {
        console.log(`Failed to generate embedding for ${game.title}`);
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Add to ChromaDB
    if (documents.length > 0) {
      await this.collection.add({
        documents: documents,
        embeddings: embeddings,
        metadatas: metadatas,
        ids: ids,
      });
      console.log(
        `✅ Successfully added ${documents.length} games to ChromaDB`
      );
    }
  }

  /**
   * Search for games using natural language query
   */
  async search(query, nResults = 5) {
    if (!this.collection) {
      await this.initializeCollection();
    }

    console.log(`🔍 Searching for: "${query}"`);

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.getEmbedding(query);
      if (!queryEmbedding) {
        console.log("Failed to generate embedding for query");
        return [];
      }

      // Search in ChromaDB
      const results = await this.collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: nResults,
      });

      // Format results
      const formattedResults = [];
      if (results.ids && results.ids[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          const metadata = results.metadatas[0][i];
          const distance = results.distances[0][i];

          // Parse JSON strings back to arrays
          const game = {
            ...metadata,
            genres: JSON.parse(metadata.genres),
            platforms: JSON.parse(metadata.platforms),
            tags: JSON.parse(metadata.tags),
            similarityScore: 1 - distance, // Convert distance to similarity
            distance: distance,
          };

          formattedResults.push(game);
        }
      }

      return formattedResults;
    } catch (error) {
      console.error("Search error:", error.message);
      return [];
    }
  }

  /**
   * Get collection statistics
   */
  async getStats() {
    if (!this.collection) {
      await this.initializeCollection();
    }

    try {
      const count = await this.collection.count();
      return {
        totalGames: count,
        collectionName: this.collectionName,
      };
    } catch (error) {
      console.error("Error getting stats:", error.message);
      return { totalGames: 0, collectionName: this.collectionName };
    }
  }

  /**
   * Clear the collection (useful for testing)
   */
  async clearCollection() {
    if (!this.collection) {
      await this.initializeCollection();
    }

    try {
      await this.chromaClient.deleteCollection({
        name: this.collectionName,
      });
      console.log("🗑️ Collection cleared");
      this.collection = null;
    } catch (error) {
      console.error("Error clearing collection:", error.message);
    }
  }

  /**
   * Check if collection exists and has data
   */
  async hasData() {
    if (!this.collection) {
      try {
        await this.initializeCollection();
      } catch (error) {
        return false;
      }
    }

    const stats = await this.getStats();
    return stats.totalGames > 0;
  }
}

// Setup instructions function
function printSetupInstructions() {
  console.log("🔧 SETUP INSTRUCTIONS");
  console.log("=".repeat(50));
  console.log("1. Install ChromaDB:");
  console.log("   pip install chromadb");
  console.log("");
  console.log("2. Start ChromaDB server:");
  console.log("   chroma run --host localhost --port 8000");
  console.log("");
  console.log("3. Install Node.js dependencies:");
  console.log("   npm install chromadb openai");
  console.log("");
  console.log("4. Set OpenAI API key:");
  console.log('   export OPENAI_API_KEY="your-key-here"');
  console.log("");
  console.log("5. Run this script:");
  console.log("   node game_vector_db.js");
  console.log("=".repeat(50));
}

// Demo function
async function runDemo() {
  console.log("🎮 GAME VECTOR DATABASE - CHROMADB VERSION");
  console.log("=".repeat(50));

  //   Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Please set your OPENAI_API_KEY environment variable");
    printSetupInstructions();
    return;
  }

  // Initialize database
  const db = new GameVectorDB("");

  try {
    // Check if we have data
    const hasData = await db.hasData();

    if (!hasData) {
      console.log("📚 No existing data found. Adding games...");
      await db.addGames(EXTENDED_PLAYSTATION_GAMES);
    } else {
      console.log("📚 Found existing data in ChromaDB");
    }

    // Show database stats
    const stats = await db.getStats();
    console.log(`\n📊 Database Stats:`);
    console.log(`- Games in collection: ${stats.totalGames}`);
    console.log(`- Collection name: ${stats.collectionName}`);

    // Demo searches
    console.log("\n" + "=".repeat(50));
    console.log("🔍 SEARCH DEMO");
    console.log("=".repeat(50));

    const searchQueries = [
      "superhero games for PS5",
      "challenging souls-like RPG games",
      "Japanese RPG with social elements",
      "horror games with choices and decisions",
      "post-apocalyptic survival with zombies",
      "samurai adventure in feudal Japan",
      "racing simulation games with realistic cars",
      "co-op action games for multiplayer",
      "Norse mythology adventure games",
      "female protagonist action adventures",
      "time loop and sci-fi mechanics",
      "treasure hunting adventure games",
      "open world exploration games",
      "platformer games with creative gameplay",
      "survival horror with first person view",
      "JRPG with turn based combat",
      "games with moral choices and consequences",
      "robot hunting in beautiful landscapes",
      "psychological horror with aliens",
      "remake of classic PlayStation games",
    ];

    for (const query of searchQueries) {
      console.log(`\n🔍 Search: "${query}"`);
      console.log("-".repeat(40));

      const results = await db.search(query, 3);

      results.forEach((game, index) => {
        console.log(
          `${index + 1}. ${game.title} (Score: ${game.similarityScore.toFixed(
            3
          )})`
        );
        console.log(`   📱 Platforms: ${game.platforms.join(", ")}`);
        console.log(`   🎯 Genres: ${game.genres.join(", ")}`);
        console.log(
          `   📝 Description: ${game.description.substring(0, 100)}...`
        );
        console.log("");
      });
    }

    console.log("✅ Demo completed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (
      error.message.includes("Connection refused") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("\n💡 It looks like ChromaDB is not running.");
      console.log("Please start ChromaDB server first:");
      console.log("   chroma run --host localhost --port 8000");
    }
  }
}

// Interactive search function
async function interactiveSearch() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Please set your OPENAI_API_KEY environment variable");
    return;
  }

  const db = new GameVectorDB(apiKey);

  try {
    const hasData = await db.hasData();

    if (!hasData) {
      console.log("📚 No existing data found. Adding games...");
      await db.addGames(EXTENDED_PLAYSTATION_GAMES);
    }

    console.log("\n🎮 Interactive Game Search (ChromaDB)");
    console.log('Type your search queries (type "quit" to exit)');
    console.log("-".repeat(40));

    const askQuery = () => {
      rl.question("\n🔍 Enter your search: ", async (query) => {
        if (query.toLowerCase() === "quit") {
          rl.close();
          return;
        }

        if (query.trim()) {
          const results = await db.search(query, 3);

          console.log(`\nResults for "${query}":`);
          results.forEach((game, index) => {
            console.log(
              `${index + 1}. ${game.title} (${game.similarityScore.toFixed(3)})`
            );
            console.log(
              `   ${game.platforms.join(", ")} | ${game.genres.join(", ")}`
            );
          });
        }

        askQuery();
      });
    };

    askQuery();
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("Connection refused")) {
      console.log(
        "Please start ChromaDB server: chroma run --host localhost --port 8000"
      );
    }
    rl.close();
  }
}

// Run demo if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes("--setup")) {
    printSetupInstructions();
  } else if (args.includes("--interactive")) {
    interactiveSearch();
  } else {
    runDemo();
  }
}
