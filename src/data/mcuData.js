// ============================================================================
// THE SACRED TIMELINE — CANONICAL DATASET
// ----------------------------------------------------------------------------
// Every entry carries: id, title, type, year, phase, saga, group, chrono, synopsis.
//
//   type    'Movie' | 'Series' | 'Special' | 'Animated'
//   phase   1-6 for the Main MCU, null elsewhere
//   saga    key into SAGAS
//   chrono  in-universe viewing position within its group (1-based)
//   status  'released' | 'upcoming'
//
// Adding an entry here automatically feeds the timeline, browse grids, filters,
// search index and detail pages. Nothing else needs to change.
// ============================================================================

export const SAGAS = {
  infinity: { key: 'infinity', label: 'The Infinity Saga', short: 'Infinity' },
  multiverse: { key: 'multiverse', label: 'The Multiverse Saga', short: 'Multiverse' },
  mutant: { key: 'mutant', label: 'The Mutant Saga', short: 'X-Men' },
  defenders: { key: 'defenders', label: 'The Defenders Saga', short: 'Defenders' },
  sony: { key: 'sony', label: "Sony's Spider-Man Universe", short: 'Sony' },
  legacy: { key: 'legacy', label: 'Legacy Marvel', short: 'Legacy' },
};

export const TYPES = ['Movie', 'Series', 'Special', 'Animated'];

export const PHASES = [
  { id: 1, label: 'Phase One', saga: 'infinity', years: '2008 – 2012' },
  { id: 2, label: 'Phase Two', saga: 'infinity', years: '2013 – 2015' },
  { id: 3, label: 'Phase Three', saga: 'infinity', years: '2016 – 2019' },
  { id: 4, label: 'Phase Four', saga: 'multiverse', years: '2021 – 2022' },
  { id: 5, label: 'Phase Five', saga: 'multiverse', years: '2023 – 2025' },
  { id: 6, label: 'Phase Six', saga: 'multiverse', years: '2025 – 2027' },
];

// ----------------------------------------------------------------------------
// MAIN MCU — Earth-616 / Sacred Timeline
// ----------------------------------------------------------------------------
const mainMcu = [
  { id: 'iron-man', title: 'Iron Man', type: 'Movie', year: 2008, phase: 1, chrono: 3, synopsis: 'A captured weapons magnate builds an armored suit and rewrites his own legacy.' },
  { id: 'the-incredible-hulk', title: 'The Incredible Hulk', type: 'Movie', year: 2008, phase: 1, chrono: 5, synopsis: 'Bruce Banner runs from the military while hunting a cure for the rage inside him.' },
  { id: 'iron-man-2', title: 'Iron Man 2', type: 'Movie', year: 2010, phase: 1, chrono: 4, synopsis: 'The arc reactor is killing Stark just as a Russian physicist comes to collect a debt.' },
  { id: 'thor', title: 'Thor', type: 'Movie', year: 2011, phase: 1, chrono: 6, synopsis: 'An arrogant prince is stripped of his hammer and exiled to Earth to earn it back.' },
  { id: 'captain-america-the-first-avenger', title: 'Captain America: The First Avenger', type: 'Movie', year: 2011, phase: 1, chrono: 1, synopsis: 'A frail volunteer becomes the super-soldier who fights HYDRA in World War II.' },
  { id: 'the-avengers', title: 'The Avengers', type: 'Movie', year: 2012, phase: 1, chrono: 7, synopsis: 'Earth’s mightiest heroes assemble for the first time against Loki and the Chitauri.' },
  { id: 'iron-man-3', title: 'Iron Man 3', type: 'Movie', year: 2013, phase: 2, chrono: 8, synopsis: 'Post-New York panic attacks leave Stark with nothing but his own ingenuity.' },
  { id: 'thor-the-dark-world', title: 'Thor: The Dark World', type: 'Movie', year: 2013, phase: 2, chrono: 9, synopsis: 'The Aether awakens and Malekith moves to drown the Nine Realms in darkness.' },
  { id: 'captain-america-the-winter-soldier', title: 'Captain America: The Winter Soldier', type: 'Movie', year: 2014, phase: 2, chrono: 10, synopsis: 'S.H.I.E.L.D. is revealed to be hollowed out by HYDRA from the inside.' },
  { id: 'guardians-of-the-galaxy', title: 'Guardians of the Galaxy', type: 'Movie', year: 2014, phase: 2, chrono: 11, synopsis: 'A band of cosmic misfits fight over an Infinity Stone and accidentally become heroes.' },
  { id: 'guardians-of-the-galaxy-vol-2', title: 'Guardians of the Galaxy Vol. 2', type: 'Movie', year: 2017, phase: 2, chrono: 12, synopsis: 'Peter Quill meets his father and learns what family actually costs.' },
  { id: 'avengers-age-of-ultron', title: 'Avengers: Age of Ultron', type: 'Movie', year: 2015, phase: 2, chrono: 13, synopsis: 'A peacekeeping program wakes up, decides humanity is the problem, and lifts a city.' },
  { id: 'ant-man', title: 'Ant-Man', type: 'Movie', year: 2015, phase: 2, chrono: 14, synopsis: 'A thief inherits a shrinking suit and pulls off a heist at subatomic scale.' },
  { id: 'captain-america-civil-war', title: 'Captain America: Civil War', type: 'Movie', year: 2016, phase: 3, chrono: 15, synopsis: 'The Sokovia Accords split the Avengers down the middle over Bucky Barnes.' },
  { id: 'doctor-strange', title: 'Doctor Strange', type: 'Movie', year: 2016, phase: 3, chrono: 19, synopsis: 'A ruined surgeon finds the mystic arts and a way to bargain with time itself.' },
  { id: 'spider-man-homecoming', title: 'Spider-Man: Homecoming', type: 'Movie', year: 2017, phase: 3, chrono: 18, synopsis: 'Peter Parker wants to be an Avenger; Queens and the Vulture have other plans.' },
  { id: 'thor-ragnarok', title: 'Thor: Ragnarok', type: 'Movie', year: 2017, phase: 3, chrono: 20, synopsis: 'Asgard falls, Hela rises, and Thor discovers he was never the hammer.' },
  { id: 'black-panther', title: 'Black Panther', type: 'Movie', year: 2018, phase: 3, chrono: 17, synopsis: 'T’Challa takes the throne of Wakanda and is challenged by the cost of its secrecy.' },
  { id: 'avengers-infinity-war', title: 'Avengers: Infinity War', type: 'Movie', year: 2018, phase: 3, chrono: 22, synopsis: 'Thanos collects the Infinity Stones and wins. Half of all life disappears.' },
  { id: 'ant-man-and-the-wasp', title: 'Ant-Man and the Wasp', type: 'Movie', year: 2018, phase: 3, chrono: 21, synopsis: 'A rescue mission into the Quantum Realm for the long-lost Janet van Dyne.' },
  { id: 'captain-marvel', title: 'Captain Marvel', type: 'Movie', year: 2019, phase: 3, chrono: 2, synopsis: 'Vers reclaims the memory of Carol Danvers and ends a war she was lied into.' },
  { id: 'avengers-endgame', title: 'Avengers: Endgame', type: 'Movie', year: 2019, phase: 3, chrono: 23, synopsis: 'Five years after the Blip, the survivors gamble everything on a time heist.' },
  { id: 'spider-man-far-from-home', title: 'Spider-Man: Far From Home', type: 'Movie', year: 2019, phase: 3, chrono: 26, synopsis: 'Grieving Tony Stark, Peter is conned by a man selling a fake multiverse.' },
  { id: 'wandavision', title: 'WandaVision', type: 'Series', year: 2021, phase: 4, chrono: 27, synopsis: 'Grief rewrites a New Jersey town into a sitcom, one decade per episode.' },
  { id: 'the-falcon-and-the-winter-soldier', title: 'The Falcon and the Winter Soldier', type: 'Series', year: 2021, phase: 4, chrono: 28, synopsis: 'Sam and Bucky argue over who gets to carry a shield neither of them asked for.' },
  { id: 'loki-s1', title: 'Loki — Season 1', type: 'Series', year: 2021, phase: 4, chrono: 24, synopsis: 'A variant Loki is arrested by the TVA and shown the end of free will.' },
  { id: 'black-widow', title: 'Black Widow', type: 'Movie', year: 2021, phase: 4, chrono: 16, synopsis: 'Natasha returns to the family that raised her as a weapon to burn the Red Room down.' },
  { id: 'what-if-s1', title: 'What If…? — Season 1', type: 'Animated', year: 2021, phase: 4, chrono: 25, synopsis: 'The Watcher observes the branches the Sacred Timeline never took.' },
  { id: 'shang-chi', title: 'Shang-Chi and the Legend of the Ten Rings', type: 'Movie', year: 2021, phase: 4, chrono: 29, synopsis: 'A valet is pulled back into his father’s thousand-year-old criminal empire.' },
  { id: 'eternals', title: 'Eternals', type: 'Movie', year: 2021, phase: 4, chrono: 30, synopsis: 'Immortals who watched history happen finally decide to intervene in it.' },
  { id: 'spider-man-no-way-home', title: 'Spider-Man: No Way Home', type: 'Movie', year: 2021, phase: 4, chrono: 32, synopsis: 'A botched memory spell tears the multiverse open and lets old villains through.' },
  { id: 'hawkeye', title: 'Hawkeye', type: 'Series', year: 2021, phase: 4, chrono: 31, synopsis: 'Clint Barton just wants Christmas. Kate Bishop and the Tracksuit Mafia disagree.' },
  { id: 'moon-knight', title: 'Moon Knight', type: 'Series', year: 2022, phase: 4, chrono: 35, synopsis: 'A gift-shop clerk shares his body with a mercenary and an Egyptian god.' },
  { id: 'doctor-strange-multiverse-of-madness', title: 'Doctor Strange in the Multiverse of Madness', type: 'Movie', year: 2022, phase: 4, chrono: 33, synopsis: 'Strange protects a girl who can punch holes between universes from the Scarlet Witch.' },
  { id: 'ms-marvel', title: 'Ms. Marvel', type: 'Series', year: 2022, phase: 4, chrono: 34, synopsis: 'A Jersey City fangirl inherits a bangle and a partition-era family secret.' },
  { id: 'thor-love-and-thunder', title: 'Thor: Love and Thunder', type: 'Movie', year: 2022, phase: 4, chrono: 36, synopsis: 'Gorr the God Butcher hunts the pantheon while Jane wields Mjolnir.' },
  { id: 'she-hulk', title: 'She-Hulk: Attorney at Law', type: 'Series', year: 2022, phase: 4, chrono: 37, synopsis: 'Jennifer Walters gets her cousin’s blood, his problems, and a superhuman law practice.' },
  { id: 'werewolf-by-night', title: 'Werewolf by Night', type: 'Special', year: 2022, phase: 4, chrono: 38, synopsis: 'Monster hunters gather for a black-and-white blood ritual in the dark.' },
  { id: 'black-panther-wakanda-forever', title: 'Black Panther: Wakanda Forever', type: 'Movie', year: 2022, phase: 4, chrono: 39, synopsis: 'A grieving Wakanda faces Namor and the underwater nation of Talokan.' },
  { id: 'gotg-holiday-special', title: 'The Guardians of the Galaxy Holiday Special', type: 'Special', year: 2022, phase: 4, chrono: 40, synopsis: 'Drax and Mantis go to Earth to kidnap Kevin Bacon as a Christmas present.' },
  { id: 'ant-man-and-the-wasp-quantumania', title: 'Ant-Man and the Wasp: Quantumania', type: 'Movie', year: 2023, phase: 5, chrono: 41, synopsis: 'The Lang family is dragged into the Quantum Realm and meets Kang the Conqueror.' },
  { id: 'guardians-of-the-galaxy-vol-3', title: 'Guardians of the Galaxy Vol. 3', type: 'Movie', year: 2023, phase: 5, chrono: 42, synopsis: 'Rocket’s origin, the High Evolutionary, and the last ride of this team.' },
  { id: 'secret-invasion', title: 'Secret Invasion', type: 'Series', year: 2023, phase: 5, chrono: 43, synopsis: 'Nick Fury returns to Earth to stop a Skrull faction hiding in plain sight.' },
  { id: 'loki-s2', title: 'Loki — Season 2', type: 'Series', year: 2023, phase: 5, chrono: 44, synopsis: 'The temporal loom is failing and Loki must choose a throne no one wants.' },
  { id: 'the-marvels', title: 'The Marvels', type: 'Movie', year: 2023, phase: 5, chrono: 45, synopsis: 'Carol, Monica and Kamala swap places every time they use their powers.' },
  { id: 'echo', title: 'Echo', type: 'Series', year: 2024, phase: 5, chrono: 46, synopsis: 'Maya Lopez goes home to Oklahoma with Wilson Fisk close behind her.' },
  { id: 'x-men-97-s1', title: "X-Men '97 — Season 1", type: 'Animated', year: 2024, phase: 5, chrono: 47, synopsis: 'The animated team returns to a world that still hates and fears them.' },
  { id: 'deadpool-and-wolverine', title: 'Deadpool & Wolverine', type: 'Movie', year: 2024, phase: 5, chrono: 48, synopsis: 'The TVA drafts Wade Wilson, who drafts the worst Wolverine he can find.' },
  { id: 'agatha-all-along', title: 'Agatha All Along', type: 'Series', year: 2024, phase: 5, chrono: 49, synopsis: 'Agatha Harkness walks the Witches’ Road to get her power back.' },
  { id: 'daredevil-born-again-s1', title: 'Daredevil: Born Again — Season 1', type: 'Series', year: 2025, phase: 5, chrono: 50, synopsis: 'Matt Murdock hangs up the horns as Wilson Fisk runs for mayor of New York.' },
  { id: 'captain-america-brave-new-world', title: 'Captain America: Brave New World', type: 'Movie', year: 2025, phase: 5, chrono: 51, synopsis: 'Sam Wilson’s first mission as Captain America runs into President Ross.' },
  { id: 'thunderbolts', title: 'Thunderbolts*', type: 'Movie', year: 2025, phase: 5, chrono: 52, synopsis: 'A squad of expendable antiheroes is set up to be erased, and refuses.' },
  { id: 'the-fantastic-four-first-steps', title: 'The Fantastic Four: First Steps', type: 'Movie', year: 2025, phase: 6, chrono: 53, synopsis: 'A retro-futurist first family faces Galactus and the herald who precedes him.' },
  { id: 'ironheart', title: 'Ironheart', type: 'Series', year: 2025, phase: 6, chrono: 54, synopsis: 'Riri Williams builds the best suit since Stark and meets magic head on.' },
  { id: 'eyes-of-wakanda', title: 'Eyes of Wakanda', type: 'Animated', year: 2025, phase: 6, chrono: 55, synopsis: 'Wakandan War Dogs recover stolen vibranium artifacts across history.' },
  { id: 'x-men-97-s2', title: "X-Men '97 — Season 2", type: 'Animated', year: 2026, phase: 6, chrono: 56, status: 'upcoming', synopsis: 'The mutants continue after the timeline-shattering events of season one.' },
  { id: 'daredevil-born-again-s2', title: 'Daredevil: Born Again — Season 2', type: 'Series', year: 2026, phase: 6, chrono: 57, status: 'upcoming', synopsis: 'Hell’s Kitchen escalates as the Devil and the Kingpin stop pretending.' },
  { id: 'spider-man-brand-new-day', title: 'Spider-Man: Brand New Day', type: 'Movie', year: 2026, phase: 6, chrono: 58, status: 'upcoming', synopsis: 'A Peter Parker nobody remembers starts over from absolutely nothing.' },
  { id: 'avengers-doomsday', title: 'Avengers: Doomsday', type: 'Movie', year: 2026, phase: 6, chrono: 59, status: 'upcoming', synopsis: 'Heroes from three universes are set on a collision course with Doctor Doom.' },
  { id: 'avengers-secret-wars', title: 'Avengers: Secret Wars', type: 'Movie', year: 2027, phase: 6, chrono: 60, status: 'upcoming', synopsis: 'The end of the Multiverse Saga, and of the multiverse as it currently stands.' },
];

// ----------------------------------------------------------------------------
// X-MEN / FOX
// ----------------------------------------------------------------------------
const xmen = [
  { id: 'x-men-first-class', title: 'X-Men: First Class', type: 'Movie', year: 2011, chrono: 1, synopsis: 'Charles and Erik build a school and a rivalry during the Cuban Missile Crisis.' },
  { id: 'x-men-origins-wolverine', title: 'X-Men Origins: Wolverine', type: 'Movie', year: 2009, chrono: 2, synopsis: 'Logan’s Weapon X origin and the brother he could never outrun.' },
  { id: 'x-men-days-of-future-past', title: 'X-Men: Days of Future Past', type: 'Movie', year: 2014, chrono: 3, synopsis: 'Wolverine is sent back to 1973 to stop the Sentinel program from ever starting.' },
  { id: 'x-men-apocalypse', title: 'X-Men: Apocalypse', type: 'Movie', year: 2016, chrono: 4, synopsis: 'The first mutant wakes in 1983 and gathers Four Horsemen to remake the world.' },
  { id: 'x-men-dark-phoenix', title: 'X-Men: Dark Phoenix', type: 'Movie', year: 2019, chrono: 5, synopsis: 'A cosmic force bonds with Jean Grey and the team fractures around her.' },
  { id: 'x-men', title: 'X-Men', type: 'Movie', year: 2000, chrono: 6, synopsis: 'The film that started it all: Rogue, Wolverine, and Magneto’s machine.' },
  { id: 'x2-x-men-united', title: 'X2: X-Men United', type: 'Movie', year: 2003, chrono: 7, synopsis: 'Colonel Stryker raids the mansion and forces mutants into an alliance.' },
  { id: 'x-men-the-last-stand', title: 'X-Men: The Last Stand', type: 'Movie', year: 2006, chrono: 8, synopsis: 'A mutant cure divides the world and the Phoenix consumes Jean Grey.' },
  { id: 'the-wolverine', title: 'The Wolverine', type: 'Movie', year: 2013, chrono: 9, synopsis: 'Logan goes to Japan to lose his healing factor and find a reason to live.' },
  { id: 'the-new-mutants', title: 'The New Mutants', type: 'Movie', year: 2020, chrono: 10, synopsis: 'Five young mutants are held in a facility that feeds on their nightmares.' },
  { id: 'deadpool', title: 'Deadpool', type: 'Movie', year: 2016, chrono: 11, synopsis: 'Wade Wilson gets cancer, gets experimented on, and gets very talkative.' },
  { id: 'deadpool-2', title: 'Deadpool 2', type: 'Movie', year: 2018, chrono: 12, synopsis: 'X-Force assembles, mostly briefly, to protect a kid from a soldier out of time.' },
  { id: 'logan', title: 'Logan', type: 'Movie', year: 2017, chrono: 13, synopsis: '2029. The mutants are gone, Logan is dying, and a girl needs to reach the border.' },
];

// ----------------------------------------------------------------------------
// DEFENDERS SAGA — Netflix
// ----------------------------------------------------------------------------
const defenders = [
  { id: 'daredevil-s1', title: 'Daredevil — Season 1', type: 'Series', year: 2015, chrono: 1, synopsis: 'A blind lawyer fights Wilson Fisk for the soul of Hell’s Kitchen.' },
  { id: 'jessica-jones-s1', title: 'Jessica Jones — Season 1', type: 'Series', year: 2015, chrono: 2, synopsis: 'A private investigator confronts the man who controlled her mind.' },
  { id: 'daredevil-s2', title: 'Daredevil — Season 2', type: 'Series', year: 2016, chrono: 3, synopsis: 'The Punisher and Elektra pull Matt in opposite directions.' },
  { id: 'luke-cage-s1', title: 'Luke Cage — Season 1', type: 'Series', year: 2016, chrono: 4, synopsis: 'An unbreakable man becomes Harlem’s reluctant protector.' },
  { id: 'iron-fist-s1', title: 'Iron Fist — Season 1', type: 'Series', year: 2017, chrono: 5, synopsis: 'Danny Rand returns from K’un-Lun to reclaim his name and fight the Hand.' },
  { id: 'the-defenders', title: 'The Defenders', type: 'Series', year: 2017, chrono: 6, synopsis: 'Four street-level heroes are forced into the same room by the Hand.' },
  { id: 'the-punisher-s1', title: 'The Punisher — Season 1', type: 'Series', year: 2017, chrono: 7, synopsis: 'Frank Castle unravels the conspiracy behind his family’s murder.' },
  { id: 'jessica-jones-s2', title: 'Jessica Jones — Season 2', type: 'Series', year: 2018, chrono: 8, synopsis: 'The experiment that made Jessica turns out to have made someone else too.' },
  { id: 'luke-cage-s2', title: 'Luke Cage — Season 2', type: 'Series', year: 2018, chrono: 9, synopsis: 'Bushmaster comes for Mariah Dillard and Harlem pays the price.' },
  { id: 'iron-fist-s2', title: 'Iron Fist — Season 2', type: 'Series', year: 2018, chrono: 10, synopsis: 'Davos takes the Fist and Danny has to decide what he is without it.' },
  { id: 'daredevil-s3', title: 'Daredevil — Season 3', type: 'Series', year: 2018, chrono: 11, synopsis: 'Fisk walks out of prison and Bullseye puts on the suit.' },
  { id: 'the-punisher-s2', title: 'The Punisher — Season 2', type: 'Series', year: 2019, chrono: 12, synopsis: 'Frank tries to stop being the Punisher, and Billy Russo won’t let him.' },
  { id: 'jessica-jones-s3', title: 'Jessica Jones — Season 3', type: 'Series', year: 2019, chrono: 13, synopsis: 'A meticulous serial killer and a fracture between Jessica and Trish.' },
];

// ----------------------------------------------------------------------------
// SONY'S SPIDER-MAN UNIVERSE
// ----------------------------------------------------------------------------
const sony = [
  { id: 'spider-man-2002', title: 'Spider-Man', type: 'Movie', year: 2002, chrono: 1, synopsis: 'With great power comes the responsibility that defined a genre.' },
  { id: 'spider-man-2', title: 'Spider-Man 2', type: 'Movie', year: 2004, chrono: 2, synopsis: 'Doc Ock, a runaway train, and a Peter who wants to quit.' },
  { id: 'spider-man-3', title: 'Spider-Man 3', type: 'Movie', year: 2007, chrono: 3, synopsis: 'The symbiote, Sandman, and one very confident walk down the street.' },
  { id: 'the-amazing-spider-man', title: 'The Amazing Spider-Man', type: 'Movie', year: 2012, chrono: 4, synopsis: 'Peter investigates his parents’ disappearance and finds the Lizard.' },
  { id: 'the-amazing-spider-man-2', title: 'The Amazing Spider-Man 2', type: 'Movie', year: 2014, chrono: 5, synopsis: 'Electro, Harry Osborn, and the fall that Peter never stops falling.' },
  { id: 'venom', title: 'Venom', type: 'Movie', year: 2018, chrono: 6, synopsis: 'A disgraced journalist bonds with a symbiote that wants to eat people.' },
  { id: 'venom-let-there-be-carnage', title: 'Venom: Let There Be Carnage', type: 'Movie', year: 2021, chrono: 7, synopsis: 'Cletus Kasady gets a symbiote of his own and it is worse.' },
  { id: 'morbius', title: 'Morbius', type: 'Movie', year: 2022, chrono: 8, synopsis: 'A biochemist cures himself of a blood disease by becoming a vampire.' },
  { id: 'kraven-the-hunter', title: 'Kraven the Hunter', type: 'Movie', year: 2024, chrono: 9, synopsis: 'Sergei Kravinoff’s origin as the world’s most dangerous tracker.' },
  { id: 'madame-web', title: 'Madame Web', type: 'Movie', year: 2024, chrono: 10, synopsis: 'A paramedic starts seeing the future and three young women who need her.' },
];

// ----------------------------------------------------------------------------
// LEGACY MARVEL — pre-MCU adaptations
// ----------------------------------------------------------------------------
const legacy = [
  { id: 'blade', title: 'Blade', type: 'Movie', year: 1998, chrono: 1, synopsis: 'The daywalker who proved comic-book movies could be R-rated and cool.' },
  { id: 'blade-ii', title: 'Blade II', type: 'Movie', year: 2002, chrono: 2, synopsis: 'Blade allies with vampires against something that hunts them both.' },
  { id: 'blade-trinity', title: 'Blade: Trinity', type: 'Movie', year: 2004, chrono: 3, synopsis: 'Dracula returns and the Nightstalkers join the fight.' },
  { id: 'daredevil-2003', title: 'Daredevil', type: 'Movie', year: 2003, chrono: 4, synopsis: 'The first live-action Man Without Fear, plus a director’s cut worth finding.' },
  { id: 'elektra', title: 'Elektra', type: 'Movie', year: 2005, chrono: 5, synopsis: 'Resurrected and working as an assassin, Elektra takes one job too personally.' },
  { id: 'fantastic-four-2005', title: 'Fantastic Four', type: 'Movie', year: 2005, chrono: 6, synopsis: 'A cosmic storm turns four astronauts into a very public superhero family.' },
  { id: 'fantastic-four-rise-of-the-silver-surfer', title: 'Fantastic Four: Rise of the Silver Surfer', type: 'Movie', year: 2007, chrono: 7, synopsis: 'A silver herald arrives and the world learns what follows him.' },
  { id: 'fantastic-four-2015', title: 'Fantastic Four', type: 'Movie', year: 2015, chrono: 8, synopsis: 'A darker reboot built around interdimensional travel to Planet Zero.' },
];

// ----------------------------------------------------------------------------
// ASSEMBLY
// ----------------------------------------------------------------------------
const decorate = (list, group, saga) =>
  list.map((e, i) => ({
    status: 'released',
    phase: null,
    ...e,
    group,
    saga,
    release: i + 1,
  }));

export const watchOrderGroups = [
  { group: 'Main MCU', saga: 'infinity', blurb: 'The Sacred Timeline itself — Phases One through Six.', entries: decorate(mainMcu, 'Main MCU', 'infinity') },
  { group: 'X-Men / Fox', saga: 'mutant', blurb: 'Two decades of mutants, from Xavier’s school to Logan’s last stand.', entries: decorate(xmen, 'X-Men / Fox', 'mutant') },
  { group: 'Defenders', saga: 'defenders', blurb: 'Street-level New York, thirteen seasons deep.', entries: decorate(defenders, 'Defenders', 'defenders') },
  { group: 'Sony Spider-Man', saga: 'sony', blurb: 'Every wall-crawler and symbiote outside the MCU proper.', entries: decorate(sony, 'Sony Spider-Man', 'sony') },
  { group: 'Legacy Marvel', saga: 'legacy', blurb: 'Where it began, before anyone called it a universe.', entries: decorate(legacy, 'Legacy Marvel', 'legacy') },
];

/** Flat list of every entry in the archive. */
export const entries = watchOrderGroups.flatMap((g) => g.entries);

/** O(1) lookup by id. */
export const entryById = new Map(entries.map((e) => [e.id, e]));

export const getEntry = (id) => entryById.get(id) ?? null;

export const TOTAL_ENTRIES = entries.length;

/** Counts used by the stat strip on the home page. */
export const ARCHIVE_STATS = {
  total: entries.length,
  movies: entries.filter((e) => e.type === 'Movie').length,
  series: entries.filter((e) => e.type === 'Series').length,
  specials: entries.filter((e) => e.type === 'Special' || e.type === 'Animated').length,
  years: `${Math.min(...entries.map((e) => e.year))} – ${Math.max(...entries.map((e) => e.year))}`,
};
