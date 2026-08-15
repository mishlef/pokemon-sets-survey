// Each entry:
//   name    - display name shown on the card / used in CSV
//   sprite  - pokemondb.net sprite slug (from the "Home" row at
//             https://pokemondb.net/sprites/<species> — click a sprite image
//             there and copy the filename before ".png")
//   dexSlug - the pokemondb.net Pokedex page slug for the link-back
//             (usually just the base species name, even for regional/alt forms)
//   sets    - the list of common named sets. "Other" is added automatically
//             by the app — don't list it here.
const POKEMON_DATA = [
  { name: "Cresselia", sprite: "cresselia", dexSlug: "cresselia", sets: ["Scarf", "Non-Icy Wind Leftovers", "Icy Wind Leftovers", "Kee"] },
  { name: "Primarina", sprite: "primarina", dexSlug: "primarina", sets: ["Custap", "Sitrus", "Specs", "Pixie Plate", "Wacan", "Mental Herb"] },
  { name: "Celesteela", sprite: "celesteela", dexSlug: "celesteela", sets: ["Custap", "Mental Herb", "Occa", "Sitrus", "Band", "Specs"] },
  { name: "Dragapult", sprite: "dragapult", dexSlug: "dragapult", sets: ["Specs", "Wisp Sub Disable", "Band", "Curse", "Dragon Dance Weakness Policy"] },
  { name: "Garchomp", sprite: "garchomp", dexSlug: "garchomp", sets: ["Life Orb", "Scarf", "Band", "Custap", "Haban"] },
  { name: "Metagross", sprite: "metagross", dexSlug: "metagross", sets: ["Scarf", "Assault Vest", "Endure Weakness Policy", "Band", "Air Balloon", "Occa"] },
  { name: "Spectrier", sprite: "spectrier", dexSlug: "spectrier", sets: ["Life Orb", "Helmet", "Sitrus Taunt", "Disable", "Specs", "Weakness Policy"] },
  { name: "Tapu Fini", sprite: "tapu-fini", dexSlug: "tapu-fini", sets: ["Scarf", "Wiki", "Leftovers", "Weakness Policy", "Specs", "Sitrus"] },
  { name: "Darmanitan-Galar", sprite: "darmanitan-galarian-standard", dexSlug: "darmanitan", sets: ["Scarf", "Band", "Weakness Policy Zen", "Def Invested Choiced"] },
  { name: "Entei", sprite: "entei", dexSlug: "entei", sets: ["Pressure Stall", "Assault Vest", "Band"] },
  { name: "Ferrothorn", sprite: "ferrothorn", dexSlug: "ferrothorn", sets: ["Iron Defense + Body Press", "Band", "Custap"] },
  { name: "Landorus-Therian", sprite: "landorus-therian", dexSlug: "landorus", sets: ["Assault Vest", "Bulk Up", "Band", "SpDef Band", "Scarf"] },
  { name: "Porygon-Z", sprite: "porygon-z", dexSlug: "porygon-z", sets: ["Life Orb", "Specs", "Custap", "Scarf", "Helmet"] },
  { name: "Urshifu-Single-Strike", sprite: "urshifu-single-strike", dexSlug: "urshifu", sets: ["Band", "Taunt Life Orb", "Bulky Chople", "Fast Chople", "Assault Vest", "Liechi", "Scarf", "Custap"] },
  { name: "Volcarona", sprite: "volcarona", dexSlug: "volcarona", sets: ["Specs", "Mental Herb", "Life Orb", "Kee", "Custap"] },
  { name: "Zeraora", sprite: "zeraora", dexSlug: "zeraora", sets: ["Band", "Assault Vest", "Life Orb", "Weakness Policy"] },
  { name: "Aromatisse", sprite: "aromatisse", dexSlug: "aromatisse", sets: ["Def Helmet", "SpDef Helmet", "Wiki"] },
  { name: "Azumarill", sprite: "azumarill", dexSlug: "azumarill", sets: ["Assault Vest", "Life Orb", "Stall", "Band", "Belly Drum"] },
  { name: "Crustle", sprite: "crustle", dexSlug: "crustle", sets: ["Band", "Lum", "Mental Herb", "Custap"] },
  { name: "Sylveon", sprite: "sylveon", dexSlug: "sylveon", sets: ["Specs", "Mental Herb + Yawn", "Life Orb + Yawn", "Custap"] },
  { name: "Tapu Bulu", sprite: "tapu-bulu", dexSlug: "tapu-bulu", sets: ["Grassy Seed Wood Hammer + Leech Seed", "Grassy Seed Substitute + Disable", "Grassy Seed Dazzling Gleam", "Grassy Seed Bulk Up", "Hybrid of above moves"] },
  { name: "Tapu Koko", sprite: "tapu-koko", dexSlug: "tapu-koko", sets: ["Electric Seed Offense (2+ attacks)", "Electric Seed Stall (<=1 attacks)", "Physical/Mixed Life Orb Charge", "Electric Seed Thief", "Special Life Orb"] },
  { name: "Togekiss", sprite: "togekiss", dexSlug: "togekiss", sets: ["Resist Berry Counter", "Charm Kee", "Scarf Counter", "Fast Maranga", "Scarf", "Mental Herb", "Slow Maranga"] },
  { name: "Urshifu-Rapid-Strike", sprite: "urshifu-rapid-strike", dexSlug: "urshifu", sets: ["Life Orb", "Assault Vest", "Band", "Iron Defense + Body Press", "Wacan", "Endure Weakness Policy"] },
  { name: "Volcanion", sprite: "volcanion", dexSlug: "volcanion", sets: ["Sitrus", "Air Balloon", "Custap", "Scarf", "Specs", "Assault Vest"] },
  { name: "Zarude", sprite: "zarude", dexSlug: "zarude", sets: ["Weakness Policy Encore", "Band", "Weakness Policy Snarl", "Scarf", "Assault Vest"] },
  { name: "Zapdos", sprite: "zapdos", dexSlug: "zapdos", sets: ["Offensive Life Orb", "Pressure Stall", "Maranga", "Custap", "Specs", "Stall Life Orb"] },
  { name: "Kyurem", sprite: "kyurem", dexSlug: "kyurem", sets: ["Special Weakness Policy", "Roseli", "Chople", "Haban Noble Roar", "Specs", "Scarf", "Haban Offensive", "Assault Vest", "Physical Weakness Policy"] },
  { name: "Tyranitar", sprite: "tyranitar", dexSlug: "tyranitar", sets: ["Band", "Weakness Policy", "Chople", "Assault Vest", "Custap"] },
  { name: "Moltres-Galar", sprite: "moltres-galarian", dexSlug: "moltres", sets: ["Custap", "Sitrus", "Helmet"] },
  { name: "Regieleki", sprite: "regieleki", dexSlug: "regieleki", sets: ["Specs"] },
  { name: "Venusaur", sprite: "venusaur", dexSlug: "venusaur", sets: ["Leech Seed", "Custap"] },
  { name: "Landorus-Incarnate", sprite: "landorus-incarnate", dexSlug: "landorus", sets: ["Fast Life Orb", "Bulky Life Orb", "Specs", "Band", "Scarf"] },
  { name: "Naganadel", sprite: "naganadel", dexSlug: "naganadel", sets: ["Specs", "Life Orb"] },
  { name: "Aggron", sprite: "aggron", dexSlug: "aggron", sets: ["Band", "Scarf", "Custap"] },
  { name: "Rillaboom", sprite: "rillaboom", dexSlug: "rillaboom", sets: ["Life Orb", "Grassy Seed Offensive", "Leech Seed", "Assault Vest"] },
  { name: "Regidrago", sprite: "regidrago", dexSlug: "regidrago", sets: ["Custap", "Band", "Haban", "Assault Vest"] },
  { name: "Rhyperior", sprite: "rhyperior", dexSlug: "rhyperior", sets: ["Band", "Custap", "Assault Vest"] },
  { name: "Arcanine", sprite: "arcanine", dexSlug: "arcanine", sets: ["Band", "Scarf", "Life Orb", "Assault Vest", "Stall"] },
  { name: "Heatran", sprite: "heatran", dexSlug: "heatran", sets: ["Specs", "Scarf", "Iron Defense + Body Press", "Air Balloon Offensive", "Custap"] },
  { name: "Chansey", sprite: "chansey", dexSlug: "chansey", sets: ["Charm", "Toxic", "SpDef"] },
  { name: "Haxorus", sprite: "haxorus", dexSlug: "haxorus", sets: ["Scarf", "Band", "Roseli", "Life Orb", "Custap"] },
  { name: "Corviknight", sprite: "corviknight", dexSlug: "corviknight", sets: ["Iron Defense + Body Press", "Substitute Stall"] },
  { name: "Nihilego", sprite: "nihilego", dexSlug: "nihilego", sets: ["Power Herb", "Specs"] },
  { name: "Registeel", sprite: "registeel", dexSlug: "registeel", sets: ["Leftovers Body Press", "Leftovers Counter", "Air Balloon", "Assault Vest"] },
  { name: "Tapu Lele", sprite: "tapu-lele", dexSlug: "tapu-lele", sets: ["Psychic Seed", "Custap", "Specs", "Scarf", "Weakness Policy", "Skill Swap"] },
  { name: "Magnezone", sprite: "magnezone", dexSlug: "magnezone", sets: ["Specs", "Custap", "Weakness Policy"] },
];
