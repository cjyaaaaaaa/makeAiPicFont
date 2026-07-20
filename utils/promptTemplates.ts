export type TemplateTabId = string

export type TemplateCardCopy = {
	id: string
	title: string
	alt: string
	prompt?: string
}

export type TemplateTabCopy = {
	id: TemplateTabId
	label: string
	cards: TemplateCardCopy[]
}

export type TemplateCard = TemplateCardCopy & {
	image: string
	prompt: string
}

export type TemplateTab = TemplateTabCopy & {
	cards: TemplateCard[]
}

const photo = (id: string, width = 720) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`

export const TEMPLATE_IMAGE_MAP: Record<string, string> = {
	monoPortrait: photo('photo-1524504388940-b1c1722653e1'),
	groupPortrait: photo('photo-1524503033411-c9566986fc8f'),
	beautyCloseup: photo('photo-1522335789203-aabd1fc54bc9'),
	candidShot: photo('photo-1529156069898-49953e39b3ac'),
	streetStyle: photo('photo-1496747611176-843222e1e57c'),
	editorialCoat: photo('photo-1515886657613-9f3515b0c78f'),
	runwayFrame: photo('photo-1487412720507-e7ab37603c6f'),
	urbanLook: photo('photo-1524503033411-c9566986fc8f'),
	silkPortrait: photo('photo-1517841905240-472988babdf9'),
	studioPose: photo('photo-1508214751196-bcfd4ca60f91'),
	coastalDream: photo('photo-1500530855697-b586d89ba3ee'),
	cityTerrace: photo('photo-1500534314209-a25ddb2bd429'),
	desertLight: photo('photo-1500534314209-a25ddb2bd429'),
	forestPath: photo('photo-1518837695005-2083093ee35b'),
	blueDoor: photo('photo-1506973035872-a4ec16b8e8d9'),
	watchStill: photo('photo-1523170335258-f5ed11844a49'),
	minimalSpeaker: photo('photo-1523275335684-37898b6baf30'),
	cosmeticSet: photo('photo-1522335789203-aabd1fc54bc9'),
	drinkAd: photo('photo-1544145945-f90425340c7e'),
	deskObject: photo('photo-1518005020951-eccb494ad742'),
	poodleStyle: photo('photo-1518717758536-85ae29035b6d'),
	jellyfishLamp: photo('photo-1518005020951-eccb494ad742'),
	limeJewelry: photo('photo-1528825871115-3581a5387919'),
	flowerFace: photo('photo-1508214751196-bcfd4ca60f91'),
	neonGlass: photo('photo-1544145945-f90425340c7e'),
}

export const TEMPLATE_PROMPT_MAP: Record<string, string> = {
	streetStyle: 'A bold street style portrait with yellow sunglasses and red suspenders, urban fashion editorial, vibrant colors, shallow depth of field, high detail',
	monoPortrait: 'A cinematic black and white portrait through a car window, moody lighting, film grain, intimate composition',
	beautyCloseup: 'A beauty close-up portrait with colorful glitter makeup, iridescent highlights, studio lighting, macro detail',
	groupPortrait: 'A candid group portrait of three friends on a city sidewalk, natural daylight, documentary style',
	candidShot: 'Two friends laughing at an outdoor cafe table, warm afternoon light, lifestyle photography, candid moment',
	editorialCoat: 'High-fashion editorial portrait in an oversized coat, minimalist studio backdrop, Vogue-style lighting',
	runwayFrame: 'Runway-inspired fashion portrait with dramatic pose, sharp styling, clean background',
	urbanLook: 'Urban lookbook fashion shot on city streets, contemporary styling, dynamic composition',
	silkPortrait: 'Soft silk fabric fashion portrait, elegant movement, pastel tones, dreamy atmosphere',
	studioPose: 'Studio fashion pose with controlled lighting, polished commercial look, full-body framing',
	coastalDream: 'Dreamy coastal landscape at golden hour, soft waves, pastel sky, wide scenic composition',
	cityTerrace: 'City terrace skyline at sunset, cinematic atmosphere, warm urban glow',
	desertLight: 'Desert landscape bathed in warm sunlight, vast horizon, natural textures',
	forestPath: 'Misty forest path with dappled light, serene nature scenery, depth and atmosphere',
	blueDoor: 'Pastel wall with a blue door, Mediterranean aesthetic, clean architectural composition',
	watchStill: 'Luxury watch product still life on marble surface, soft reflections, premium advertising style',
	minimalSpeaker: 'Minimal wireless speaker product shot, clean studio background, modern industrial design',
	cosmeticSet: 'Cosmetic product flat lay with elegant packaging, soft shadows, beauty campaign style',
	drinkAd: 'Colorful drink campaign visual with condensation and vibrant props, commercial photography',
	deskObject: 'Desk object product photography with natural window light, lifestyle staging',
	poodleStyle: 'Whimsical stylish poodle portrait with pearl accessories, playful luxury aesthetic',
	jellyfishLamp: 'Surreal jellyfish lamp artwork in a dark room, glowing ambient light, artistic concept',
	limeJewelry: 'Jewelry arranged on fresh lime slices, bold color contrast, creative product art',
	flowerFace: 'Artistic portrait decorated with pressed flowers, ethereal beauty, soft focus',
	neonGlass: 'Neon-lit cocktail glass in a whimsical bar scene, vivid colors, night atmosphere',
}

export const FALLBACK_TEMPLATE_TABS: TemplateTabCopy[] = [
	{
		id: 'people',
		label: 'People',
		cards: [
			{ id: 'streetStyle', title: 'Street Style Portrait', alt: 'Street style portrait with yellow sunglasses' },
			{ id: 'monoPortrait', title: 'Monochrome Portrait', alt: 'Black and white portrait in a car' },
			{ id: 'beautyCloseup', title: 'Beauty Close-up', alt: 'Close-up glitter makeup portrait' },
			{ id: 'groupPortrait', title: 'Group Portrait', alt: 'Three people standing in a city street' },
			{ id: 'candidShot', title: 'Candid Shot', alt: 'Two friends laughing at a cafe table' },
		],
	},
	{
		id: 'fashion',
		label: 'Fashion',
		cards: [
			{ id: 'editorialCoat', title: 'Editorial Coat', alt: 'Editorial fashion coat portrait' },
			{ id: 'runwayFrame', title: 'Runway Frame', alt: 'Runway fashion detail' },
			{ id: 'urbanLook', title: 'Urban Lookbook', alt: 'Urban fashion lookbook' },
			{ id: 'silkPortrait', title: 'Silk Portrait', alt: 'Soft silk fashion portrait' },
			{ id: 'studioPose', title: 'Studio Pose', alt: 'Studio fashion pose' },
		],
	},
	{
		id: 'scenery',
		label: 'Scenery',
		cards: [
			{ id: 'coastalDream', title: 'Coastal Dream', alt: 'Coastal sunset landscape' },
			{ id: 'cityTerrace', title: 'City Terrace', alt: 'City terrace at sunset' },
			{ id: 'desertLight', title: 'Desert Light', alt: 'Desert landscape light' },
			{ id: 'forestPath', title: 'Forest Path', alt: 'Forest path scenery' },
			{ id: 'blueDoor', title: 'Pastel Door', alt: 'Pastel wall with blue door' },
		],
	},
	{
		id: 'product',
		label: 'Product',
		cards: [
			{ id: 'watchStill', title: 'Watch Still Life', alt: 'Watch product still life' },
			{ id: 'minimalSpeaker', title: 'Minimal Speaker', alt: 'Minimal speaker product' },
			{ id: 'cosmeticSet', title: 'Cosmetic Set', alt: 'Cosmetic product set' },
			{ id: 'drinkAd', title: 'Drink Campaign', alt: 'Cocktail product ad' },
			{ id: 'deskObject', title: 'Desk Object', alt: 'Desk product object' },
		],
	},
	{
		id: 'whimsical',
		label: 'Whimsical',
		cards: [
			{ id: 'poodleStyle', title: 'Pearl Poodle', alt: 'Stylish poodle portrait' },
			{ id: 'jellyfishLamp', title: 'Jellyfish Lamp', alt: 'Jellyfish lamp artwork' },
			{ id: 'limeJewelry', title: 'Citrus Jewel', alt: 'Jewelry on lime slices' },
			{ id: 'flowerFace', title: 'Pressed Flowers', alt: 'Portrait with flowers' },
			{ id: 'neonGlass', title: 'Neon Glass', alt: 'Neon cocktail glass' },
		],
	},
]

export const resolveTemplatePrompt = (card: TemplateCardCopy) => card.prompt || TEMPLATE_PROMPT_MAP[card.id] || card.title

export const hydrateTemplateTabs = (tabs: TemplateTabCopy[]): TemplateTab[] => tabs.map(tab => ({
	...tab,
	cards: tab.cards.map(card => ({
		...card,
		image: TEMPLATE_IMAGE_MAP[card.id] || TEMPLATE_IMAGE_MAP.streetStyle,
		prompt: resolveTemplatePrompt(card),
	})),
}))
