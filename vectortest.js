// Initialize Chroma client and collections
let chromaClient;
let gamesCollection;
let subscriptionsCollection;

// Sample data for games and subscriptions
const games = [
  {
    id: "game_1",
    title: "Marvel's Spider-Man 2",
    genre: ["Action", "Adventure"],
    tags: ["superhero", "open-world", "story-driven"],
    description:
      "Swing through New York as Spider-Man and Spider-Man Miles Morales",
    rating: "T",
    price: 69.99,
    platform: ["PS5"],
    multiplayer: false,
    coop: false,
  },
  {
    id: "game_2",
    title: "Assassin's Creed Mirage",
    genre: ["Action", "Adventure"],
    tags: ["stealth", "historical", "open-world"],
    description:
      "Return to the roots of the Assassin's Creed series in 9th century Baghdad",
    rating: "M",
    price: 49.99,
    platform: ["PS5", "PS4"],
    multiplayer: false,
    coop: false,
  },
  {
    id: "game_3",
    title: "It Takes Two",
    genre: ["Adventure", "Platformer"],
    tags: ["coop", "couples", "story-driven", "puzzle"],
    description:
      "A co-op adventure about a couple trying to save their relationship",
    rating: "T",
    price: 39.99,
    platform: ["PS5", "PS4"],
    multiplayer: true,
    coop: true,
  },
  {
    id: "game_4",
    title: "Batman: Arkham Knight",
    genre: ["Action", "Adventure"],
    tags: ["superhero", "open-world", "stealth"],
    description: "Be the Batman in this epic conclusion to the Arkham series",
    rating: "M",
    price: 19.99,
    platform: ["PS4"],
    multiplayer: false,
    coop: false,
  },
  {
    id: "game_5",
    title: "A Way Out",
    genre: ["Action", "Adventure"],
    tags: ["coop", "couples", "story-driven", "prison"],
    description: "A co-op only game about two prisoners escaping together",
    rating: "M",
    price: 29.99,
    platform: ["PS4"],
    multiplayer: true,
    coop: true,
  },
  {
    id: "game_6",
    title: "Overwatch 2",
    genre: ["Shooter", "Action"],
    tags: ["multiplayer", "competitive", "team-based"],
    description: "Team-based multiplayer shooter with heroes",
    rating: "T",
    price: 0,
    platform: ["PS5", "PS4"],
    multiplayer: true,
    coop: false,
  },
  {
    id: "game_7",
    title: "Uncharted 4: A Thief's End",
    genre: ["Action", "Adventure"],
    tags: ["treasure-hunting", "story-driven", "cinematic"],
    description: "Nathan Drake's final adventure in search of pirate treasure",
    rating: "T",
    price: 19.99,
    platform: ["PS4"],
    multiplayer: true,
    coop: false,
  },
  {
    id: "game_8",
    title: "Resident Evil 4",
    genre: ["Horror", "Action"],
    tags: ["survival-horror", "zombies", "third-person"],
    description: "Remake of the classic survival horror game",
    rating: "M",
    price: 59.99,
    platform: ["PS5", "PS4"],
    multiplayer: false,
    coop: false,
  },
  // Added more games under $30 for better testing
  {
    id: "game_9",
    title: "Dead Space (2008)",
    genre: ["Horror", "Action"],
    tags: ["survival-horror", "zombies", "third-person", "sci-fi"],
    description: "Classic survival horror in space with terrifying necromorphs",
    rating: "M",
    price: 14.99,
    platform: ["PS4"],
    multiplayer: false,
    coop: false,
  },
  {
    id: "game_10",
    title: "Until Dawn",
    genre: ["Horror", "Adventure"],
    tags: ["survival-horror", "story-driven", "choices-matter"],
    description: "Interactive horror drama where every choice matters",
    rating: "M",
    price: 19.99,
    platform: ["PS4"],
    multiplayer: false,
    coop: false,
  },
  {
    id: "game_11",
    title: "Outlast",
    genre: ["Horror"],
    tags: ["survival-horror", "first-person", "stealth"],
    description: "Terrifying first-person survival horror in an asylum",
    rating: "M",
    price: 24.99,
    platform: ["PS4"],
    multiplayer: false,
    coop: false,
  },
  {
    id: "game_12",
    title: "The Forest",
    genre: ["Horror", "Survival"],
    tags: ["survival-horror", "crafting", "coop", "open-world"],
    description: "Survive on a cannibal-infested island with optional co-op",
    rating: "M",
    price: 19.99,
    platform: ["PS4"],
    multiplayer: true,
    coop: true,
  },
];

const subscriptions = [
  {
    id: "sub_1",
    name: "PlayStation Plus Essential",
    price: 9.99,
    features: ["Monthly games", "Online multiplayer", "Exclusive discounts"],
    description: "Essential online gaming with monthly games",
    bestFor: ["online gaming", "multiplayer", "basic features"],
    platforms: ["PS5", "PS4"],
  },
  {
    id: "sub_2",
    name: "PlayStation Plus Extra",
    price: 14.99,
    features: [
      "Everything in Essential",
      "Game Catalog (400+ games)",
      "PlayStation Studios titles",
    ],
    description: "Access to hundreds of games plus online features",
    bestFor: ["game library", "single player", "variety"],
    platforms: ["PS5", "PS4"],
  },
  {
    id: "sub_3",
    name: "PlayStation Plus Premium",
    price: 17.99,
    features: [
      "Everything in Extra",
      "Classic games",
      "Game trials",
      "Cloud streaming",
    ],
    description:
      "Ultimate PlayStation experience with retro games and streaming",
    bestFor: ["retro gaming", "streaming", "complete experience"],
    platforms: ["PS5", "PS4"],
  },
];

// Function to get Chroma client
async function getChromaClient() {
  if (!chromaClient) {
    chromaClient = new ChromaClient({
      ssl: false,
      host: process.env.CHROMA_HOST || "localhost",
      port: process.env.CHROMA_PORT || 8000,
    });
  }
  return chromaClient;
}

// Function to generate embeddings using OpenAI (batch version)
async function generateEmbeddingsBatch(texts) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

// Initialize vector store and create collections
async function initialize() {
  chromaClient = await getChromaClient();

  // try {
  //   await chromaClient.deleteCollection({ name: "ps_games" });
  //   console.log("Deleted existing games collection");
  // } catch (error) {
  //   console.log("Games collection didn't exist, creating new one");
  // }

  // try {
  //   await chromaClient.deleteCollection({ name: "ps_subscriptions" });
  //   console.log("Deleted existing subscriptions collection");
  // } catch (error) {
  //   console.log("Subscriptions collection didn't exist, creating new one");
  // }

  gamesCollection = await chromaClient.getOrCreateCollection({
    name: "ps_games",
    metadata: { description: "PlayStation games collection" },
  });

  subscriptionsCollection = await chromaClient.getOrCreateCollection({
    name: "ps_subscriptions",
    metadata: { description: "PlayStation subscriptions collection" },
  });
}

// IMPROVED: More comprehensive search text generation with better weighting
function createOptimizedSearchText(game) {
  const highPriority = [game.title, ...game.genre, ...game.tags];
  const mediumPriority = [game.description];
  const lowPriority = [game.rating, game.platform.join(" ")];

  // Create weighted text with different repetition levels
  const weightedHigh = highPriority
    .map((term) => `${term} ${term} ${term}`)
    .join(" ");
  const weightedMedium = mediumPriority
    .map((term) => `${term} ${term}`)
    .join(" ");
  const weightedLow = lowPriority.join(" ");

  // Add price descriptors for better price-based matching
  const priceDescriptor =
    game.price === 0
      ? "free"
      : game.price < 20
      ? "cheap budget affordable"
      : game.price < 40
      ? "moderate mid-range"
      : "expensive premium";

  return `${weightedHigh} ${weightedMedium} ${weightedLow} ${priceDescriptor} price ${game.price}`;
}

// Function to populate the games collection with embeddings (batch version)
async function populateGames() {
  console.log("Populating games collection...");
  const count = await gamesCollection.count();
  if (count > 0) {
    console.log(`Games collection already has ${count} items`);
    return;
  }

  const documents = [];
  const metadatas = [];
  const ids = [];

  for (const game of games) {
    const searchText = createOptimizedSearchText(game);

    documents.push(searchText);
    metadatas.push({
      title: game.title,
      genre: game.genre.join(", "),
      tags: game.tags.join(", "),
      description: game.description,
      rating: game.rating,
      price: game.price,
      platform: game.platform.join(", "),
      multiplayer: game.multiplayer,
      coop: game.coop,
      type: "game",
    });
    ids.push(game.id);
  }

  const embeddings = await generateEmbeddingsBatch(documents);

  await gamesCollection.add({
    ids,
    documents,
    metadatas,
    embeddings,
  });

  console.log(`Added ${games.length} games to collection`);
}

// Function to populate the subscriptions collection with embeddings (batch version)
async function populateSubscriptions() {
  console.log("Populating subscriptions collection...");
  const count = await subscriptionsCollection.count();
  if (count > 0) {
    console.log(`Subscriptions collection already has ${count} items`);
    return;
  }

  const documents = [];
  const metadatas = [];
  const ids = [];

  for (const subscription of subscriptions) {
    const priceDescriptor =
      subscription.price <= 10
        ? "cheap affordable budget"
        : subscription.price <= 15
        ? "moderate mid-range"
        : "premium expensive";

    const searchText = `${subscription.name} ${subscription.features.join(
      " "
    )} ${subscription.bestFor.join(" ")} ${
      subscription.description
    } ${priceDescriptor} price ${subscription.price}`;

    documents.push(searchText);
    metadatas.push({
      name: subscription.name,
      price: subscription.price,
      features: subscription.features.join(", "),
      description: subscription.description,
      bestFor: subscription.bestFor.join(", "),
      platforms: subscription.platforms.join(", "),
      type: "subscription",
    });
    ids.push(subscription.id);
  }

  const embeddings = await generateEmbeddingsBatch(documents);

  await subscriptionsCollection.add({
    ids,
    documents,
    metadatas,
    embeddings,
  });

  console.log(`Added ${subscriptions.length} subscriptions to collection`);
}

// IMPROVED: Better structured query extraction with more specific prompts
async function getStructuredQueryFromChatGPT(queryText) {
  const chatGptResponse = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    temperature: 1,
    top_p: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `You are an expert at extracting structured data from gaming queries. Be precise and only include information that is explicitly mentioned or strongly implied. Pay special attention to price ranges, genres, and specific requirements.`,
      },
      {
        role: "user",
        content: `
          Extract structured JSON from this gaming query. Only include fields that are clearly specified or strongly implied:

          Query: "${queryText}"

          Available genres: Action, Adventure, Horror, Shooter, Platformer, RPG, Sports, Racing, Strategy, Simulation
          Available platforms: PS5, PS4, Xbox, PC, Nintendo Switch
          Available ratings: E (Everyone), T (Teen), M (Mature)
          Available tags: superhero, open-world, stealth, story-driven, coop, couples, zombies, historical, puzzle, competitive, team-based, treasure-hunting, cinematic, survival-horror, third-person, multiplayer

          Output ONLY JSON format:
          {
            "genres": ["Horror"] or [] (empty array if not mentioned),
            "platforms": ["PS5", "PS4"] or [] (empty array if not mentioned),
            "multiplayer": true/false/null (only if explicitly mentioned),
            "coop": true/false/null (only if explicitly mentioned),
            "price_range": { "min": 0, "max": 30 } or null (extract from phrases like "under $30", "less than $50", "free", "cheap"),
            "rating": ["T", "M"] or [] (empty array if not mentioned),
            "tags": ["survival-horror", "zombies"] or [] (empty array if not mentioned),
            "keywords": ["specific terms from query that aren't covered above"] or []
          }

          Important: 
          - Use empty arrays [] instead of [null] for unused fields
          - For price ranges, be very careful to extract the correct numbers
          - Set boolean values to null only if not mentioned at all
          - Don't guess or assume
          - Extract exact keywords that could help with matching
          - THE OUTPUT SHOULD ONLY INCLUDE JSON NOTHING ELSE
        `,
      },
    ],
  });

  const extractedData = chatGptResponse.choices[0].message.content;
  console.log("Extracted structured data:", extractedData);

  try {
    const parsed = JSON.parse(extractedData);

    // Clean up any null arrays that might have slipped through
    ["genres", "platforms", "rating", "tags", "keywords"].forEach((field) => {
      if (parsed[field] && Array.isArray(parsed[field])) {
        parsed[field] = parsed[field].filter((item) => item !== null);
      }
    });

    return parsed;
  } catch (error) {
    console.error("Error parsing structured data:", error);
    return null;
  }
}

async function createVectorQueryFromStructuredData(
  structuredData,
  originalQuery
) {
  const queryParts = [];

  // Start with the original query - it contains the user's natural language intent
  queryParts.push(originalQuery);

  // Add genre context in natural language
  if (structuredData.genres && structuredData.genres.length > 0) {
    queryParts.push(`${structuredData.genres.join(" ")} video games`);
  }

  // Add specific tags/features
  if (structuredData.tags && structuredData.tags.length > 0) {
    queryParts.push(structuredData.tags.join(" "));
  }

  // Add price context with descriptive terms
  if (structuredData.price_range) {
    const maxPrice = structuredData.price_range.max;
    if (maxPrice <= 20) {
      queryParts.push("budget games cheap affordable low cost");
    } else if (maxPrice <= 40) {
      queryParts.push("reasonably priced mid-range games");
    } else if (maxPrice <= 60) {
      queryParts.push("standard priced games");
    }

    // Add free context if applicable
    if (structuredData.price_range.min === 0) {
      queryParts.push("free games");
    }
  }

  // Add multiplayer context
  if (structuredData.multiplayer === true) {
    queryParts.push("multiplayer online games");
  } else if (structuredData.multiplayer === false) {
    queryParts.push("single player games");
  }

  // Add coop context
  if (structuredData.coop === true) {
    queryParts.push("cooperative co-op games");
  }

  // Add platform context
  if (structuredData.platforms && structuredData.platforms.length > 0) {
    // Filter out null values
    const validPlatforms = structuredData.platforms.filter((p) => p !== null);
    if (validPlatforms.length > 0) {
      queryParts.push(`${validPlatforms.join(" ")} games`);
    }
  }

  // Add rating context
  if (structuredData.rating && structuredData.rating.length > 0) {
    const validRatings = structuredData.rating.filter((r) => r !== null);
    if (validRatings.length > 0) {
      queryParts.push(`${validRatings.join(" ")} rated games`);
    }
  }

  return queryParts.join(" ");
}

function applyStructuredFilters(results, structuredData) {
  if (!structuredData || !results.length) return results;

  console.log("Applying structured filters...");

  return results.filter((result) => {
    const metadata = result;
    let score = 0;
    let maxScore = 0;
    let passesRequiredFilters = true;

    // Price filter (STRICT - this is a hard requirement)
    if (structuredData.price_range) {
      const price = parseFloat(metadata.price);
      const minPrice = structuredData.price_range.min || 0;
      const maxPrice = structuredData.price_range.max || Infinity;

      console.log(
        `Checking price: ${metadata.title} costs ${price}, range: ${minPrice}-${maxPrice}`
      );

      if (price >= minPrice && price <= maxPrice) {
        score += 3;
        console.log(`✓ ${metadata.title} passes price filter`);
      } else {
        console.log(
          `✗ ${metadata.title} FAILS price filter - ${price} not in range ${minPrice}-${maxPrice}`
        );
        passesRequiredFilters = false;
      }
      maxScore += 3;
    }

    // FIXED: Strict tag filtering for specific searches
    if (structuredData.tags && structuredData.tags.length > 0) {
      const gameTags = metadata.tags.toLowerCase().split(", ");

      // Check for critical tags that should be mandatory
      const criticalTags = [
        "superhero",
        "horror",
        "survival-horror",
        "zombies",
      ];
      const hasCriticalTag = structuredData.tags.some((tag) =>
        criticalTags.includes(tag.toLowerCase())
      );

      if (hasCriticalTag) {
        // For critical tags, require exact match
        const hasRequiredTag = structuredData.tags.some((tag) =>
          gameTags.some((gameTag) => gameTag.includes(tag.toLowerCase()))
        );

        if (hasRequiredTag) {
          score += 4; // Higher score for matching critical tags
          console.log(`✓ ${metadata.title} passes CRITICAL tag filter`);
        } else {
          console.log(
            `✗ ${metadata.title} FAILS CRITICAL tag filter - missing required tag`
          );
          passesRequiredFilters = false;
        }
        maxScore += 4;
      } else {
        // For non-critical tags, use flexible scoring
        const matchingTags = structuredData.tags.filter((t) =>
          gameTags.some((gt) => gt.includes(t.toLowerCase()))
        );
        score += (matchingTags.length / structuredData.tags.length) * 2;
        maxScore += 2;
      }
    }

    // Genre filter (STRICT for specific genres)
    if (structuredData.genres && structuredData.genres.length > 0) {
      const gameGenres = metadata.genre.toLowerCase().split(", ");
      const hasMatchingGenre = structuredData.genres.some((g) =>
        gameGenres.some((gg) => gg.includes(g.toLowerCase()))
      );

      if (hasMatchingGenre) {
        score += 3;
        console.log(`✓ ${metadata.title} passes genre filter`);
      } else {
        console.log(`✗ ${metadata.title} FAILS genre filter`);
        // For specific genres like Horror, this should be strict
        const criticalGenres = ["horror"];
        if (
          structuredData.genres.some((g) =>
            criticalGenres.includes(g.toLowerCase())
          )
        ) {
          passesRequiredFilters = false;
        }
      }
      maxScore += 3;
    }

    // Platform filter (STRICT if specified)
    if (structuredData.platforms && structuredData.platforms.length > 0) {
      const gamePlatforms = metadata.platform.split(", ");
      const hasMatchingPlatform = structuredData.platforms.some((p) =>
        gamePlatforms.includes(p)
      );

      if (hasMatchingPlatform) {
        score += 2;
        console.log(`✓ ${metadata.title} passes platform filter`);
      } else {
        console.log(`✗ ${metadata.title} FAILS platform filter`);
        passesRequiredFilters = false;
      }
      maxScore += 2;
    }

    // Multiplayer filter (if specified, should match)
    if (structuredData.multiplayer !== null) {
      if (metadata.multiplayer === structuredData.multiplayer) {
        score += 1;
      } else {
        passesRequiredFilters = false;
      }
      maxScore += 1;
    }

    // Coop filter (if specified, should match)
    if (structuredData.coop !== null) {
      if (metadata.coop === structuredData.coop) {
        score += 1;
      } else {
        passesRequiredFilters = false;
      }
      maxScore += 1;
    }

    // Rating filter (flexible - bonus points)
    if (structuredData.rating && structuredData.rating.length > 0) {
      maxScore += 1;
      if (structuredData.rating.includes(metadata.rating)) {
        score += 1;
      }
    }

    // If doesn't pass required filters, exclude
    if (!passesRequiredFilters) {
      console.log(`✗ ${metadata.title} EXCLUDED - failed required filters`);
      return false;
    }

    // Add relevance score to metadata for sorting
    metadata.relevanceScore = maxScore > 0 ? score / maxScore : 0.5;

    return true;
  });
}

async function queryWithEmbedding(queryText, limit = 5) {
  console.log(`\n=== Querying: "${queryText}" ===`);

  const structuredData = await getStructuredQueryFromChatGPT(queryText);
  if (!structuredData) {
    console.log("Could not parse the query properly.");
    return [];
  }

  console.log("Structured data:", JSON.stringify(structuredData, null, 2));

  const queryString = await createVectorQueryFromStructuredData(
    structuredData,
    queryText
  );
  console.log("Vector query string:", queryString);

  const queryEmbedding = await generateEmbeddingsBatch([queryString]);

  // Get more initial results for better filtering
  const gameResults = await gamesCollection.query({
    queryEmbeddings: queryEmbedding,
    nResults: Math.min(limit * 4, games.length),
  });

  // Combine results with metadata and distances
  const combinedResults = gameResults.metadatas[0].map((metadata, index) => ({
    ...metadata,
    distance: gameResults.distances[0][index],
  }));

  console.log("Raw vector search results:", combinedResults.length);

  // Apply structured filters
  const filteredResults = applyStructuredFilters(
    combinedResults,
    structuredData
  );
  console.log("After structured filtering:", filteredResults.length);

  // ADAPTIVE: Use different distance thresholds based on query type
  let DISTANCE_THRESHOLD = 1.2;

  // For specific queries (like superhero games), be more lenient with distance
  if (structuredData.genres && structuredData.genres.length > 0) {
    DISTANCE_THRESHOLD = 1.4;
  }

  // For specific tag searches, be more lenient
  if (structuredData.tags && structuredData.tags.length > 0) {
    DISTANCE_THRESHOLD = 1.5;
  }

  const qualityResults = filteredResults.filter(
    (result) => result.distance < DISTANCE_THRESHOLD
  );
  console.log(
    `After distance filtering (${DISTANCE_THRESHOLD}):`,
    qualityResults.length
  );

  // IMPROVED: Better fallback that maintains critical requirements
  let sortedResults;
  if (qualityResults.length === 0) {
    console.log("No results after filtering, using fallback strategy...");

    // Check if the query has critical requirements
    const hasCriticalTags =
      structuredData.tags &&
      structuredData.tags.some((tag) =>
        ["superhero", "horror", "survival-horror", "zombies"].includes(
          tag.toLowerCase()
        )
      );

    if (hasCriticalTags) {
      // For critical searches, don't compromise on the core requirement
      console.log("Query has critical requirements - not using fallback");
      sortedResults = [];
    } else {
      // Use more lenient distance threshold for non-critical searches
      const fallbackResults = combinedResults.filter(
        (result) => result.distance < 1.8
      );

      // Apply STRICT filters - especially price and platform
      const fallbackFiltered = fallbackResults.filter((result) => {
        let passes = true;

        // Price is ALWAYS a hard requirement
        if (structuredData.price_range) {
          const price = parseFloat(result.price);
          const minPrice = structuredData.price_range.min || 0;
          const maxPrice = structuredData.price_range.max || Infinity;

          if (!(price >= minPrice && price <= maxPrice)) {
            passes = false;
          }
        }

        // Platform is a hard requirement if specified
        if (structuredData.platforms && structuredData.platforms.length) {
          const gamePlatforms = result.platform.split(", ");
          const platformMatches = structuredData.platforms.some((p) =>
            gamePlatforms.includes(p)
          );

          if (!platformMatches) {
            passes = false;
          }
        }

        return passes;
      });

      sortedResults = fallbackFiltered.sort((a, b) => a.distance - b.distance);
    }
  } else {
    // Sort by combined score (relevance + vector similarity)
    sortedResults = qualityResults.sort((a, b) => {
      const scoreA =
        (a.relevanceScore || 0.5) * 0.6 +
        (1 - Math.min(a.distance, 2) / 2) * 0.4;
      const scoreB =
        (b.relevanceScore || 0.5) * 0.6 +
        (1 - Math.min(b.distance, 2) / 2) * 0.4;
      return scoreB - scoreA;
    });
  }

  // Return top results
  const finalResults = sortedResults.slice(0, limit);

  console.log("\n=== Final Results ===");
  if (finalResults.length === 0) {
    console.log("No games found matching your criteria.");

    // Provide helpful feedback
    if (structuredData.tags && structuredData.tags.includes("superhero")) {
      console.log("Looking for superhero games specifically...");

      // Show available superhero games regardless of other filters
      const superheroGames = combinedResults.filter((result) =>
        result.tags.toLowerCase().includes("superhero")
      );

      if (superheroGames.length > 0) {
        console.log("Available superhero games:");
        superheroGames.forEach((game, index) => {
          console.log(
            `${index + 1}. ${game.title} - $${game.price} (${game.platform})`
          );
        });
      }
    }
  } else {
    finalResults.forEach((result, index) => {
      const finalScore =
        (result.relevanceScore || 0.5) * 0.6 +
        (1 - Math.min(result.distance, 2) / 2) * 0.4;
      console.log(
        `${index + 1}. ${result.title} - $${
          result.price
        } (Distance: ${result.distance.toFixed(3)}, Relevance: ${(
          result.relevanceScore || 0
        ).toFixed(2)}, Final Score: ${finalScore.toFixed(3)}, Tags: ${
          result.tags
        })`
      );
    });
  }

  return finalResults;
}

// Query subscriptions with similar improvements
async function querySubscriptions(queryText, limit = 3) {
  console.log(`\n=== Querying Subscriptions: "${queryText}" ===`);

  const structuredData = await getStructuredQueryFromChatGPT(queryText);
  if (!structuredData) {
    console.log("Could not parse the query properly.");
    return [];
  }

  const queryString = await createVectorQueryFromStructuredData(
    structuredData,
    queryText
  );
  const queryEmbedding = await generateEmbeddingsBatch([queryString]);

  const subscriptionResults = await subscriptionsCollection.query({
    queryEmbeddings: queryEmbedding,
    nResults: subscriptions.length,
  });

  const combinedResults = subscriptionResults.metadatas[0].map(
    (metadata, index) => ({
      ...metadata,
      distance: subscriptionResults.distances[0][index],
    })
  );

  // Apply price filtering for subscriptions
  let filteredResults = combinedResults;
  if (structuredData.price_range) {
    filteredResults = combinedResults.filter((result) => {
      const price = parseFloat(result.price);
      return (
        price >= (structuredData.price_range.min || 0) &&
        price <= (structuredData.price_range.max || Infinity)
      );
    });
  }

  const DISTANCE_THRESHOLD = 1.6; // More lenient for subscriptions
  const qualityResults = filteredResults.filter(
    (result) => result.distance < DISTANCE_THRESHOLD
  );

  const sortedResults = qualityResults.sort((a, b) => a.distance - b.distance);
  const finalResults = sortedResults.slice(0, limit);

  console.log("\n=== Final Subscription Results ===");
  finalResults.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.name} - $${
        result.price
      } (Distance: ${result.distance.toFixed(3)})`
    );
  });

  return finalResults;
}

// Initialize and populate the collections
async function initializeAndPopulate() {
  console.log("Initializing and populating collections...");
  await initialize();
  // await populateGames();
  // await populateSubscriptions();
  console.log("Initialization and population complete.");
}

// Test queries
const testQueries = [
  "I want to play games on my ps5 with superheroes in it please suggest something",
  "Superhero games on PS4 for my brother",
  "Looking for co-op games to play with my partner",
  "What are some good horror games under $30?",
  "Story-driven single player games",
  "Cheapest PlayStation Plus subscription for basic online gaming",
];

// Run this function to initialize the database and test queries
async function runTests() {
  await initializeAndPopulate();

  for (const query of testQueries) {
    const results = await queryWithEmbedding(query, 3);
    console.log(`\nQuery: "${query}"`);
    console.log(`Results: ${results.length} games found\n`);

    // Also test subscription queries for relevant queries
    if (
      query.toLowerCase().includes("subscription") ||
      query.toLowerCase().includes("plus")
    ) {
      await querySubscriptions(query, 2);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}
