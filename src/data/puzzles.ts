import type { Level, Puzzle } from '../game/types';

type GroupSpec = [category: string, w1: string, w2: string, w3: string, w4: string];

/**
 * Builds a puzzle from four group specs, ordered from easiest (level 0)
 * to trickiest (level 3).
 */
function puzzle(id: string, ...groups: [GroupSpec, GroupSpec, GroupSpec, GroupSpec]): Puzzle {
  return {
    id,
    groups: groups.map(([category, ...words], level) => ({
      category,
      words,
      level: level as Level,
    })),
  };
}

/**
 * Hand-curated, original puzzles.
 *
 * Every puzzle has exactly one valid 4×4 partition. Some puzzles contain a
 * deliberate red herring — a word that *looks* like it fits a second group —
 * but in each case the other group already has four unambiguous members, so
 * the herring can only belong to one place.
 */
export const PUZZLES: Puzzle[] = [
  puzzle(
    'p001',
    ['Breakfast foods', 'PANCAKE', 'WAFFLE', 'OMELETTE', 'CEREAL'],
    ['Card games', 'POKER', 'BRIDGE', 'RUMMY', 'SNAP'],
    ['Things with keys', 'PIANO', 'LOCK', 'MAP', 'KEYBOARD'],
    ['___fly', 'BUTTER', 'DRAGON', 'FIRE', 'HORSE'],
  ),
  puzzle(
    'p002',
    ['Sea creatures', 'SHARK', 'WHALE', 'DOLPHIN', 'OCTOPUS'],
    ['Kitchen utensils', 'WHISK', 'LADLE', 'SPATULA', 'TONGS'],
    ['Chess pieces', 'ROOK', 'PAWN', 'BISHOP', 'KNIGHT'],
    ['Begins with a body part', 'HANDLE', 'EARNEST', 'LEGEND', 'SHINGLE'],
  ),
  puzzle(
    'p003',
    ['Colours of the rainbow', 'RED', 'INDIGO', 'YELLOW', 'VIOLET'],
    ['Wintry weather', 'THUNDER', 'DRIZZLE', 'SLEET', 'HAIL'],
    ['Coffee drinks', 'LATTE', 'MOCHA', 'ESPRESSO', 'CORTADO'],
    ['___ball', 'FOOT', 'BASKET', 'SNOW', 'MEAT'],
  ),
  puzzle(
    'p004',
    ['Musical instruments', 'VIOLIN', 'TRUMPET', 'FLUTE', 'TRIANGLE'],
    ['Shapes', 'CIRCLE', 'SQUARE', 'OVAL', 'HEXAGON'],
    ['Dog breeds', 'BOXER', 'POODLE', 'BEAGLE', 'PUG'],
    ['___ box', 'JUKE', 'SHOE', 'SOAP', 'LUNCH'],
  ),
  puzzle(
    'p005',
    ['Units of time', 'SECOND', 'MINUTE', 'HOUR', 'DECADE'],
    ['Gemstones', 'RUBY', 'EMERALD', 'SAPPHIRE', 'OPAL'],
    ['Programming languages', 'PYTHON', 'JAVA', 'RUST', 'SWIFT'],
    ['Things you can crack', 'CODE', 'EGG', 'JOKE', 'SMILE'],
  ),
  puzzle(
    'p006',
    ['Vegetables', 'CARROT', 'POTATO', 'CELERY', 'SPINACH'],
    ['Classical composers', 'MOZART', 'BACH', 'CHOPIN', 'HANDEL'],
    ['In the toolbox', 'HAMMER', 'WRENCH', 'CHISEL', 'PLIERS'],
    ['Sound like letters', 'BEE', 'SEA', 'TEA', 'EYE'],
  ),
  puzzle(
    'p007',
    ['Racket sports', 'TENNIS', 'SQUASH', 'BADMINTON', 'PADEL'],
    ['Pasta shapes', 'PENNE', 'FUSILLI', 'RIGATONI', 'ORZO'],
    ['Currencies', 'EURO', 'YEN', 'RUPEE', 'PESO'],
    ['___cake', 'CUP', 'PAN', 'CHEESE', 'CARROT'],
  ),
  puzzle(
    'p008',
    ['Bodies of water', 'LAKE', 'POND', 'RIVER', 'LAGOON'],
    ['Trees', 'OAK', 'MAPLE', 'BIRCH', 'WILLOW'],
    ['Ballroom & Latin dances', 'WALTZ', 'SALSA', 'TANGO', 'FOXTROT'],
    ['NATO phonetic alphabet', 'HOTEL', 'VICTOR', 'OSCAR', 'JULIET'],
  ),
  puzzle(
    'p009',
    ['Farm animals', 'COW', 'PIG', 'SHEEP', 'GOAT'],
    ['Breads', 'BAGEL', 'BAGUETTE', 'CIABATTA', 'BRIOCHE'],
    ['Planets', 'MERCURY', 'MARS', 'SATURN', 'NEPTUNE'],
    ['Things with shells', 'TACO', 'EGG', 'SNAIL', 'PEANUT'],
  ),
  puzzle(
    'p010',
    ['Clothing', 'SHIRT', 'JACKET', 'SCARF', 'SOCKS'],
    ['Desserts', 'TIRAMISU', 'BROWNIE', 'PUDDING', 'SUNDAE'],
    ['Mythical creatures', 'DRAGON', 'UNICORN', 'PHOENIX', 'GRIFFIN'],
    ['Things with teeth', 'COMB', 'SAW', 'ZIPPER', 'GEAR'],
  ),
  puzzle(
    'p011',
    ['Emotions', 'JOY', 'ANGER', 'FEAR', 'ENVY'],
    ['Metals', 'IRON', 'COPPER', 'ZINC', 'NICKEL'],
    ['Board games', 'CHESS', 'CHECKERS', 'BACKGAMMON', 'GO'],
    ['___ Age', 'STONE', 'ICE', 'SPACE', 'DARK'],
  ),
  puzzle(
    'p012',
    ['Insects', 'BEETLE', 'ANT', 'WASP', 'MOTH'],
    ['Hairstyles', 'BUN', 'BRAID', 'MOHAWK', 'PONYTAIL'],
    ['Palindromes', 'KAYAK', 'LEVEL', 'RADAR', 'BOB'],
    ['___fish', 'SWORD', 'CAT', 'STAR', 'JELLY'],
  ),
  puzzle(
    'p013',
    ['Furniture', 'SOFA', 'TABLE', 'DESK', 'WARDROBE'],
    ['Spices', 'CUMIN', 'PAPRIKA', 'NUTMEG', 'CINNAMON'],
    ['Bones', 'FEMUR', 'TIBIA', 'SKULL', 'RIB'],
    ['Things that get tossed', 'SALAD', 'COIN', 'PANCAKE', 'CABER'],
  ),
  puzzle(
    'p014',
    ['Birds', 'EAGLE', 'SPARROW', 'ROBIN', 'PARROT'],
    ['Fabrics', 'DENIM', 'SILK', 'VELVET', 'LINEN'],
    ['Golf terms', 'BIRDIE', 'BOGEY', 'PAR', 'CADDIE'],
    ['___print', 'FOOT', 'FINGER', 'BLUE', 'NEWS'],
  ),
  puzzle(
    'p015',
    ['In the bathroom', 'TOWEL', 'MIRROR', 'SINK', 'BATHTUB'],
    ['Cheeses', 'BRIE', 'CHEDDAR', 'GOUDA', 'FETA'],
    ['Knots', 'BOWLINE', 'REEF', 'HITCH', 'GRANNY'],
    ['Sun___', 'FLOWER', 'BURN', 'GLASSES', 'DIAL'],
  ),
  puzzle(
    'p016',
    ['Winter things', 'MITTENS', 'SLED', 'SNOWMAN', 'ICICLE'],
    ['Herbs', 'BASIL', 'THYME', 'OREGANO', 'ROSEMARY'],
    ['Car parts', 'ENGINE', 'BUMPER', 'CLUTCH', 'AXLE'],
    ['___ship', 'FRIEND', 'HARD', 'LEADER', 'CHAMPION'],
  ),
  puzzle(
    'p017',
    ['Ways to cook', 'BAKE', 'FRY', 'BOIL', 'ROAST'],
    ['Parts of a tree', 'ROOT', 'BARK', 'BRANCH', 'LEAF'],
    ['Dog noises', 'WOOF', 'YAP', 'GROWL', 'HOWL'],
    ['Snow___', 'BALL', 'MAN', 'FLAKE', 'BOARD'],
  ),
  puzzle(
    'p018',
    ['South American countries', 'BRAZIL', 'PERU', 'CHILE', 'ARGENTINA'],
    ['Nuts', 'ALMOND', 'CASHEW', 'PECAN', 'WALNUT'],
    ['Card suits', 'HEARTS', 'CLUBS', 'SPADES', 'DIAMONDS'],
    ['___bell', 'DOOR', 'BLUE', 'COW', 'DUMB'],
  ),
  puzzle(
    'p019',
    ['Marsupials', 'KANGAROO', 'KOALA', 'WOMBAT', 'OPOSSUM'],
    ['Hats', 'BERET', 'FEDORA', 'BEANIE', 'SOMBRERO'],
    ['Ice cream flavours', 'VANILLA', 'STRAWBERRY', 'PISTACHIO', 'MINT'],
    ['Add S in front for a new word', 'HOE', 'LOW', 'TAR', 'WORD'],
  ),
  puzzle(
    'p020',
    ['Office supplies', 'STAPLER', 'PAPERCLIP', 'SCISSORS', 'HIGHLIGHTER'],
    ['Constellations', 'ORION', 'PEGASUS', 'LEO', 'DRACO'],
    ['Pizza toppings', 'PEPPERONI', 'MUSHROOM', 'OLIVE', 'ANCHOVY'],
    ['Begins with a vehicle', 'CARPET', 'BUSTLE', 'VANISH', 'TRAMPOLINE'],
  ),
  puzzle(
    'p021',
    ['Kitchen appliances', 'TOASTER', 'BLENDER', 'MICROWAVE', 'FRIDGE'],
    ['Rivers', 'NILE', 'AMAZON', 'DANUBE', 'THAMES'],
    ['Footwear', 'SANDAL', 'LOAFER', 'SNEAKER', 'CLOG'],
    ['___drum', 'KETTLE', 'BASS', 'SNARE', 'EAR'],
  ),
  puzzle(
    'p022',
    ['Snakes', 'COBRA', 'VIPER', 'MAMBA', 'PYTHON'],
    ['Things to write with', 'PENCIL', 'CRAYON', 'MARKER', 'QUILL'],
    ['Programming languages', 'RUBY', 'JAVA', 'PERL', 'SWIFT'],
    ['Hidden numbers', 'OFTEN', 'WEIGHT', 'CANINE', 'PHONE'],
  ),
  puzzle(
    'p023',
    ['Music genres', 'JAZZ', 'BLUES', 'REGGAE', 'FOLK'],
    ['Pastries', 'CROISSANT', 'ECLAIR', 'DANISH', 'STRUDEL'],
    ['Rocks', 'GRANITE', 'MARBLE', 'SLATE', 'BASALT'],
    ['Things you can break', 'ICE', 'RECORD', 'NEWS', 'BREAD'],
  ),
  puzzle(
    'p024',
    ['Garden tools', 'RAKE', 'SHOVEL', 'HOE', 'TROWEL'],
    ['Flowers', 'TULIP', 'DAISY', 'ORCHID', 'LILY'],
    ['Gymnastics apparatus', 'BEAM', 'VAULT', 'RINGS', 'BARS'],
    ['___ cream', 'ICE', 'SOUR', 'SUN', 'WHIPPED'],
  ),
  puzzle(
    'p025',
    ['Public transport', 'TRAIN', 'BUS', 'FERRY', 'TAXI'],
    ['Woodwind instruments', 'OBOE', 'CLARINET', 'BASSOON', 'PICCOLO'],
    ['Geometry terms', 'RADIUS', 'ANGLE', 'VERTEX', 'CHORD'],
    ['Things with tails', 'COMET', 'KITE', 'COIN', 'FOX'],
  ),
  puzzle(
    'p026',
    ['Imperial lengths', 'INCH', 'FOOT', 'YARD', 'MILE'],
    ['Parts of a ship', 'HULL', 'MAST', 'DECK', 'KEEL'],
    ['Poker terms', 'FLUSH', 'BLUFF', 'RIVER', 'ANTE'],
    ['Hidden EAR', 'HEART', 'PEARL', 'SEARCH', 'BEARD'],
  ),
  puzzle(
    'p027',
    ['Sweets', 'LOLLIPOP', 'TOFFEE', 'FUDGE', 'NOUGAT'],
    ['Oceans', 'PACIFIC', 'ATLANTIC', 'INDIAN', 'ARCTIC'],
    ['Martial arts', 'KARATE', 'JUDO', 'AIKIDO', 'TAEKWONDO'],
    ['Things that get spun', 'WEB', 'YARN', 'TOP', 'PLATE'],
  ),
  puzzle(
    'p028',
    ['Computer accessories', 'MOUSE', 'MONITOR', 'SPEAKER', 'WEBCAM'],
    ['Rodents', 'RAT', 'HAMSTER', 'SQUIRREL', 'BEAVER'],
    ['Ballet terms', 'PLIE', 'PIROUETTE', 'ARABESQUE', 'JETE'],
    ['___line', 'HEAD', 'DEAD', 'PUNCH', 'SKY'],
  ),
  puzzle(
    'p029',
    ['Citrus fruits', 'LEMON', 'LIME', 'GRAPEFRUIT', 'TANGERINE'],
    ['Shades of green', 'OLIVE', 'JADE', 'SAGE', 'MINT'],
    ['Greek letters', 'ALPHA', 'DELTA', 'SIGMA', 'OMEGA'],
    ['___stone', 'MILE', 'CORNER', 'KIDNEY', 'HAIL'],
  ),
  puzzle(
    'p030',
    ['Jewellery', 'NECKLACE', 'BRACELET', 'EARRING', 'BROOCH'],
    ['Cereal grains', 'WHEAT', 'BARLEY', 'OATS', 'RYE'],
    ['Yoga poses', 'COBRA', 'LOTUS', 'TREE', 'WARRIOR'],
    ['Things you can cast', 'SPELL', 'VOTE', 'NET', 'SHADOW'],
  ),
  puzzle(
    'p031',
    ['Eating utensils', 'SPOON', 'KNIFE', 'CHOPSTICKS', 'SPORK'],
    ['In the desert', 'CACTUS', 'DUNE', 'OASIS', 'CAMEL'],
    ['Bicycle parts', 'PEDAL', 'CHAIN', 'SADDLE', 'SPOKE'],
    ['___lift', 'FACE', 'SKI', 'CHAIR', 'FORK'],
  ),
  puzzle(
    'p032',
    ['At the beach', 'SAND', 'SHELL', 'TOWEL', 'UMBRELLA'],
    ['Cat breeds', 'SIAMESE', 'PERSIAN', 'SPHYNX', 'BENGAL'],
    ['Languages', 'FRENCH', 'HINDI', 'SWAHILI', 'TAGALOG'],
    ['___ bag', 'TEA', 'BEAN', 'SLEEPING', 'PUNCHING'],
  ),
  puzzle(
    'p033',
    ['Bakery treats', 'MUFFIN', 'SCONE', 'DONUT', 'BAGEL'],
    ['Reptiles', 'GECKO', 'IGUANA', 'TORTOISE', 'CHAMELEON'],
    ['___board', 'SKATE', 'CUP', 'BILL', 'DASH'],
    ['Nonsense!', 'BALONEY', 'DRIVEL', 'HOGWASH', 'PIFFLE'],
  ),
  puzzle(
    'p034',
    ['Stone fruits', 'PEACH', 'PLUM', 'CHERRY', 'APRICOT'],
    ['Dinosaurs', 'RAPTOR', 'STEGOSAURUS', 'TRICERATOPS', 'BRONTOSAURUS'],
    ['Tennis terms', 'ACE', 'LOVE', 'DEUCE', 'LET'],
    ['Things with spines', 'BOOK', 'CACTUS', 'HEDGEHOG', 'PORCUPINE'],
  ),
  puzzle(
    'p035',
    ['Cleaning gear', 'MOP', 'BROOM', 'SPONGE', 'BUCKET'],
    ['Cloud types', 'CUMULUS', 'CIRRUS', 'STRATUS', 'NIMBUS'],
    ['Fish', 'TUNA', 'COD', 'HALIBUT', 'TROUT'],
    ['Shades of pink', 'SALMON', 'CORAL', 'ROSE', 'BLUSH'],
  ),
  puzzle(
    'p036',
    ['Rooms in a house', 'KITCHEN', 'BEDROOM', 'ATTIC', 'CELLAR'],
    ['Hiking gear', 'BOOTS', 'BACKPACK', 'COMPASS', 'CANTEEN'],
    ['Settlements', 'VILLAGE', 'TOWN', 'CITY', 'HAMLET'],
    ['Shakespeare characters', 'MACBETH', 'OTHELLO', 'PUCK', 'OPHELIA'],
  ),
  puzzle(
    'p037',
    ['In a pencil case', 'ERASER', 'SHARPENER', 'PEN', 'RULER'],
    ['Winter sports', 'SKIING', 'CURLING', 'LUGE', 'BOBSLEIGH'],
    ['Hair tools', 'COMB', 'BRUSH', 'STRAIGHTENER', 'CURLER'],
    ['___wood', 'HOLLY', 'DRIFT', 'FIRE', 'SANDAL'],
  ),
  puzzle(
    'p038',
    ['Two-wheelers', 'BICYCLE', 'SCOOTER', 'MOPED', 'MOTORBIKE'],
    ['Shellfish', 'SHRIMP', 'LOBSTER', 'CRAB', 'MUSSEL'],
    ['Muscles, informally', 'BICEP', 'TRICEP', 'QUAD', 'GLUTE'],
    ['Begins with a fish', 'CARPENTER', 'CODE', 'BASSOON', 'RAYON'],
  ),
  puzzle(
    'p039',
    ['Car body styles', 'SEDAN', 'COUPE', 'HATCHBACK', 'CONVERTIBLE'],
    ['Berries', 'BLUEBERRY', 'RASPBERRY', 'BLACKBERRY', 'CRANBERRY'],
    ['Shades of red', 'CRIMSON', 'SCARLET', 'MAROON', 'BURGUNDY'],
    ['Throw', 'TOSS', 'HURL', 'FLING', 'CHUCK'],
  ),
  puzzle(
    'p040',
    ['Snacks', 'POPCORN', 'PRETZEL', 'NACHOS', 'CHIPS'],
    ['Noble gases', 'ARGON', 'XENON', 'HELIUM', 'KRYPTON'],
    ['Dog commands', 'SIT', 'STAY', 'HEEL', 'FETCH'],
    ['___light', 'FLASH', 'SPOT', 'MOON', 'NEON'],
  ),
  puzzle(
    'p041',
    ['Party things', 'BALLOON', 'CAKE', 'CANDLE', 'CONFETTI'],
    ['Pirate things', 'PARROT', 'TREASURE', 'CANNON', 'PLANK'],
    ['Folklore creatures', 'TROLL', 'GOBLIN', 'ELF', 'OGRE'],
    ['Things you can walk', 'DOG', 'LINE', 'TALK', 'TIGHTROPE'],
  ),
  puzzle(
    'p042',
    ['European countries', 'NORWAY', 'POLAND', 'GREECE', 'ITALY'],
    ['Capital cities', 'CAIRO', 'LIMA', 'OSLO', 'NAIROBI'],
    ['Sea life', 'SQUID', 'STARFISH', 'URCHIN', 'CLAM'],
    ['Drop the first letter to get a word', 'SPAIN', 'OMAN', 'IRAN', 'CHAD'],
  ),
  puzzle(
    'p043',
    ['Sports equipment', 'RACKET', 'HELMET', 'PUCK', 'CLUB'],
    ['Nocturnal animals', 'OWL', 'BAT', 'BADGER', 'RACCOON'],
    ['Card-game terms', 'TRUMP', 'TRICK', 'SUIT', 'DEAL'],
    ['___house', 'GREEN', 'LIGHT', 'WARE', 'FIRE'],
  ),
  puzzle(
    'p044',
    ['Keyboard keys', 'SHIFT', 'ENTER', 'DELETE', 'SPACE'],
    ['Space objects', 'COMET', 'ASTEROID', 'NEBULA', 'QUASAR'],
    ['Exercises', 'SQUAT', 'LUNGE', 'PLANK', 'BURPEE'],
    ['Run away!', 'FLEE', 'BOLT', 'SCRAM', 'VAMOOSE'],
  ),
  puzzle(
    'p045',
    ['In the classroom', 'DESK', 'WHITEBOARD', 'CHALK', 'GLOBE'],
    ['Sauces', 'PESTO', 'SALSA', 'GRAVY', 'AIOLI'],
    ['Theatre words', 'STAGE', 'CURTAIN', 'WINGS', 'SCRIPT'],
    ['Anagrams of each other', 'POTS', 'TOPS', 'SPOT', 'POST'],
  ),
  puzzle(
    'p046',
    ['At a wedding', 'RING', 'VEIL', 'BOUQUET', 'CAKE'],
    ['Lettuces', 'ROMAINE', 'ICEBERG', 'COS', 'BIBB'],
    ['Punches', 'JAB', 'HOOK', 'UPPERCUT', 'CROSS'],
    ['Pole___', 'VAULT', 'STAR', 'DANCE', 'CAT'],
  ),
  puzzle(
    'p047',
    ['Ways to say hello', 'HOWDY', 'HIYA', 'GREETINGS', 'AHOY'],
    ['Shades of brown', 'BEIGE', 'TAN', 'TAUPE', 'CHESTNUT'],
    ['Ocean movements', 'WAVE', 'TIDE', 'CURRENT', 'SWELL'],
    ['Expressions of disgust', 'YUCK', 'EWW', 'BLECH', 'ICK'],
  ),
  puzzle(
    'p048',
    ['African animals', 'ZEBRA', 'GIRAFFE', 'HIPPO', 'RHINO'],
    ['Paint finishes', 'GLOSS', 'MATTE', 'SATIN', 'EGGSHELL'],
    ['Punctuation marks', 'COMMA', 'COLON', 'HYPHEN', 'PERIOD'],
    ['Things you can draw', 'BATH', 'CURTAINS', 'SWORD', 'CONCLUSION'],
  ),
  puzzle(
    'p049',
    ['Bedding', 'DUVET', 'SHEET', 'BLANKET', 'MATTRESS'],
    ['Japanese dishes', 'SUSHI', 'RAMEN', 'TEMPURA', 'MISO'],
    ['___case', 'PILLOW', 'BOOK', 'SUIT', 'BRIEF'],
    ['Figure-skating jumps', 'AXEL', 'LUTZ', 'SALCHOW', 'FLIP'],
  ),
  puzzle(
    'p050',
    ['Toys', 'DOLL', 'KITE', 'TEDDY', 'MARBLES'],
    ['In the solar system', 'SUN', 'COMET', 'PLANET', 'ASTEROID'],
    ['Units of weight', 'OUNCE', 'POUND', 'GRAM', 'TONNE'],
    ['Honey___', 'MOON', 'COMB', 'BEE', 'DEW'],
  ),
];

export function getPuzzle(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}

export function puzzleNumber(id: string): number {
  return PUZZLES.findIndex((p) => p.id === id) + 1;
}
