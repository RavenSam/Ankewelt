export type Location = {
	id: string
	name: string
	type: string
	description: string
}

export const MOCK_LOCATIONS: Location[] = [
	{
		id: "loc-1",
		name: "Raven's Hollow",
		type: "Village",
		description: "A misty settlement nestled in the shadow of ancient oaks, where the crows never sleep.",
	},
	{
		id: "loc-2",
		name: "The Spire of Ashes",
		type: "Tower",
		description: "A crumbling obsidian tower where the last dragon kings held their final court.",
	},
	{
		id: "loc-3",
		name: "Verdant Expanse",
		type: "Forest",
		description: "An ancient woodland whose trees whisper secrets of the old world to those who listen.",
	},
	{
		id: "loc-4",
		name: "Sunken Meridia",
		type: "City",
		description: "A drowned metropolis whose glass spires still shimmer beneath the moonlit waves.",
	},
	{
		id: "loc-5",
		name: "The Iron Causeway",
		type: "Bridge",
		description: "A colossal stone bridge spanning the chasm between the Twin Kingdoms, guarded by oathbound sentinels.",
	},
	{
		id: "loc-6",
		name: "Thornwood Bastion",
		type: "Fortress",
		description: "An impenetrable keep surrounded by enchanted, ever-growing brambles that bloom only at midnight.",
	},
]
