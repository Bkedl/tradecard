-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 14, 2024 at 11:47 AM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tradecard`
--

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

CREATE TABLE `card` (
  `card_id` int(11) NOT NULL,
  `card_name` varchar(255) NOT NULL,
  `hit_points` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` text,
  `card_description` text,
  `card_type_id` int(11) DEFAULT NULL,
  `set_id` int(11) DEFAULT NULL,
  `series_id` int(11) DEFAULT NULL,
  `energy_type_id` int(11) DEFAULT NULL,
  `rarity_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `card`
--

INSERT INTO `card` (`card_id`, `card_name`, `hit_points`, `price`, `image_url`, `card_description`, `card_type_id`, `set_id`, `series_id`, `energy_type_id`, `rarity_id`) VALUES
(14, 'Phanpy', 80, '0.08', 'https://assets.tcgdex.net/en/sv/sv04.5/048/high.webp', 'Discover the adorable Phanpy Pokémon card from the esteemed Paldean Fates series! This charming card features Phanpy, the lovable Pokémon, beloved by trainers and collectors alike.', 1, 1, 1, 3, 1),
(15, 'Pineco', 70, '0.04', 'https://assets.tcgdex.net/en/sv/sv04.5/001/high.webp', 'Embark on a journey with the resilient Pineco Pokémon card from the prestigious Paldean Fates series! This captivating card features Pineco, renowned for its defensive prowess and unwavering determination.', 1, 1, 1, 4, 1),
(16, 'Toedscruel EX', 270, '0.37', 'https://assets.tcgdex.net/en/sv/sv04.5/005/high.webp', 'Unleash the power of Toedscruel EX with this exclusive Paldean Fates Special Edition Pokémon card! As a rare and formidable addition to any collection, this card showcases Toedscruel EX in all its majestic glory.', 1, 1, 1, 4, 4),
(17, 'Magmortar', 140, '0.05', 'https://assets.tcgdex.net/en/sv/sv04.5/010/high.webp', 'Ignite the flames of battle with the formidable Magmortar Paldean Fates Edition card! This captivating card showcases Magmortar, the powerful Fire-type Pokémon, known for its blazing prowess and fiery temperament.', 1, 1, 1, 9, 3),
(18, 'Lapras', 110, '0.03', 'https://assets.tcgdex.net/en/sv/sv04.5/016/high.webp', 'Embark on a journey across the tranquil waters with the majestic Lapras Paldean Fates Edition card! This captivating card features Lapras, the serene Water-type Pokémon, beloved for its gentle nature and graceful presence.', 1, 1, 1, 10, 1),
(19, 'Kirlia', 90, '0.02', 'https://assets.tcgdex.net/en/sv/sv04.5/028/high.webp', 'Enter the enchanting realm of Pokémon with the graceful Kirlia Paldean Fates Edition card! This captivating card features Kirlia, the elegant Psychic-type Pokémon, known for its graceful movements and mystical abilities.', 1, 1, 1, 8, 2),
(20, 'Charizard EX', 330, '3.85', 'https://assets.tcgdex.net/en/sv/sv04.5/054/high.webp', 'Unleash the fiery power of Charizard EX with this exclusive Paldean Fates Special Edition Pokémon card! As a rare and formidable addition to any collection, this card showcases Charizard EX in all its majestic glory.', 1, 1, 1, 2, 4),
(21, 'Chien-Pao EX', 220, '13.08', 'https://assets.tcgdex.net/en/sv/sv04.5/242/high.webp', 'Unleash the fury of Chien Pao EX with this exclusive Paldean Fates Special Edition Pokémon card! As a rare and formidable addition to any collection, this card showcases Chien Pao EX in all its majestic glory.', 1, 1, 1, 10, 6),
(22, 'Finizen', 50, '4.42', 'https://assets.tcgdex.net/en/sv/sv04.5/123/high.webp', 'Dive into the depths of the Paldean region with the majestic Finizen Pokémon card from the esteemed Paldean Fates series! This captivating card features Finizen, the Water-type Pokémon, revered for its elegance and mystical powers.', 1, 1, 1, 10, 5),
(23, 'Wigglytuff', 110, '2.42', 'https://assets.tcgdex.net/en/sv/sv04.5/147/high.webp', 'Enter the enchanting world of Pokémon with the delightful Wigglytuff Paldean Fates Edition card! This charming card showcases Wigglytuff, the beloved Fairy-type Pokémon, known for its cheerful demeanour and captivating presence.', 1, 1, 1, 8, 5),
(24, 'Scyther', 90, '0.03', 'https://assets.tcgdex.net/en/sv/sv05/001/high.webp', 'Embark on a journey through time and space with the swift and powerful Scyther Temporal Forces Edition Pokémon card! This captivating card features Scyther, the Pokémon, known for its lightning-fast strikes and razor-sharp wings.', 1, 2, 1, 4, 1),
(25, 'Torterra EX', 340, '0.38', 'https://assets.tcgdex.net/en/sv/sv05/012/high.webp', 'Unleash the primal power of Torterra EX with this exclusive Temporal Forces Edition Pokémon card! This captivating card features Torterra, the majestic Grass -type Pokémon, revered for its commanding presence and unrivalled strength.', 1, 2, 1, 4, 4),
(26, 'Iron Leaves EX', 220, '1.35', 'https://assets.tcgdex.net/en/sv/sv05/025/high.webp', 'Unleash the ferocious power of Iron Leaves EX with this exclusive Temporal Forces Edition Pokémon card! This captivating card features Iron Leaves, the formidable Grass-type Pokémon, renowned for its sturdy defenses and relentless determination.', 1, 2, 1, 4, 4),
(27, 'Victini', 80, '0.04', 'https://assets.tcgdex.net/en/sv/sv05/030/high.webp', 'In this mesmerizing illustration, Victini radiates with the power of temporal energies, its fiery mane blazing with an otherworldly glow. The artwork perfectly captures Victini\'s indomitable spirit and mystical aura, making it a cherished symbol of hope and fortune for trainers and collectors alike.', 1, 2, 1, 9, 1),
(28, 'Croconaw', 90, '0.05', 'https://assets.tcgdex.net/en/sv/sv05/040/high.webp', 'As a Water-type Pokémon, Croconaw possesses remarkable aquatic abilities and formidable Water-type moves, making it a formidable opponent in battles. Its indomitable nature and fierce determination make it a valuable asset in any Pokémon team, capable of overcoming even the toughest of challenges.', 1, 2, 1, 10, 1),
(29, 'Totodile', 70, '0.06', 'https://assets.tcgdex.net/en/sv/sv05/039/high.webp', 'Embark on an epic journey through time and space with the courageous Totodile Temporal Forces Edition Pokémon card! This captivating card features Totodile, the spirited Water-type Pokémon, known for its boundless energy and adventurous spirit.', 1, 2, 1, 10, 1),
(30, 'Yamper', 70, '0.04', 'https://assets.tcgdex.net/en/sv/sv05/058/high.webp', 'Embark on an electrifying journey through time and space with the adorable Yamper Temporal Forces Edition Pokémon card! This captivating card features Yamper, the energetic Lightning-type Pokémon, known for its loyal nature and playful demeanour.', 1, 2, 1, 5, 1),
(31, 'Latias', 110, '0.06', 'https://assets.tcgdex.net/en/sv/sv05/067/high.webp', 'In this mesmerizing illustration, Latias soars through the heavens amidst swirling temporal energies, its wings outstretched in a display of elegance and power. The artwork perfectly captures Latias\'s majestic beauty and ethereal grace, making it a cherished symbol of hope and protection for trainers and collectors alike.', 1, 2, 1, 8, 2),
(32, 'Flutter Mane', 90, '0.13', 'https://assets.tcgdex.net/en/sv/sv05/078/high.webp', 'In this mesmerizing illustration, Flutter Mane dances amidst shimmering temporal energies, its mane flowing like ribbons in the wind. The artwork perfectly captures Flutter Mane\'s ethereal beauty and serene demeanor, making it a favorite among trainers and collectors who are drawn to the mysteries of the cosmos.', 1, 2, 1, 8, 3),
(33, 'Golett', 90, '0.02', 'https://assets.tcgdex.net/en/sv/sv05/087/high.webp', 'Embark on a journey through the ages with the enigmatic Golett Temporal Forces Edition Pokémon card! This captivating card features Golett, shrouded in the mysteries of time and space.', 1, 2, 1, 3, 1),
(34, 'Rolycoly', 80, '0.04', 'https://assets.tcgdex.net/en/sv/sv05/093/high.webp', 'Venture into the realm of mystery with the steadfast Rolycoly Temporal Forces Edition Pokémon card! This captivating card features Rolycoly, the resilient fighting-type Pokémon, known for its unwavering determination and sturdy demeanour.', 1, 2, 1, 3, 1),
(35, 'Ekans', 60, '0.03', 'https://assets.tcgdex.net/en/sv/sv05/100/high.webp', 'Embark on a journey into the depths of darkness with the elusive Ekans Temporal Forces Edition Pokémon card! This captivating card features Ekans, known for its stealthy movements and venomous bite.', 1, 2, 1, 2, 1),
(36, 'Sableye', 70, '0.04', 'https://assets.tcgdex.net/en/sv/sv05/107/high.webp', 'In this captivating illustration, Sableye lurks in the shadows, its piercing eyes gleaming with an air of mystery and intrigue. The artwork perfectly captures Sableye\'s elusive presence and stealthy demeanor, making it a favorite among trainers and collectors drawn to the darker side of the Pokémon world.\r\n', 1, 2, 1, 2, 2),
(37, 'Gengar EX', 310, '0.93', 'https://assets.tcgdex.net/en/sv/sv05/104/high.webp', 'Dive into the realm of shadows with the menacing Gengar EX Temporal Forces Edition Pokémon card! This formidable card showcases Gengar, the sinister Ghost Pokémon, renowned for its mischievous nature and cunning tactics.', 1, 2, 1, 2, 4),
(38, 'Volcarona GX', 210, '1.25', 'https://assets.tcgdex.net/en/sm/sm12/35/high.webp', 'In this breathtaking illustration, Volcarona GX radiates with the intensity of a blazing inferno, its wings outstretched in a display of majestic grandeur. The artwork perfectly captures Volcarona GX\'s fiery presence and regal demeanor, making it a prized addition to any trainer\'s deck.', 1, 3, 2, 9, 7),
(39, 'Blastoise & Piplup GX', 150, '15.59', 'https://assets.tcgdex.net/en/sm/sm12/38/high.webp', 'In this mesmerizing illustration, Blastoise and Piplup GX stand tall amidst crashing waves, ready to defend their allies with unwavering resolve. The artwork perfectly captures their synergy and determination, making them an invaluable asset to any trainer\'s deck.', 1, 3, 2, 10, 7),
(40, 'Nosepass', 80, '0.07', 'https://assets.tcgdex.net/en/sm/sm12/106/high.webp', 'Enter the realm of cosmic wonders with the sturdy Nosepass Cosmic Eclipse Edition Pokémon card! This captivating card showcases Nosepass, the steadfast Pokémon, known for its unyielding determination and resilient nature.', 1, 3, 2, 3, 1),
(41, 'Flygon GX', 240, '1.14', 'https://assets.tcgdex.net/en/sm/sm12/110/high.webp', 'Embark on a journey through the sands of time with the majestic Flygon GX showcased in this stunning Cosmic Eclipse Edition Pokémon card! This captivating card features Flygon GX, the legendary Pokémon, revered for its mastery over the desert winds and its formidable strength.', 1, 3, 2, 3, 7),
(42, 'Alolan Meowth', 70, '0.14', 'https://assets.tcgdex.net/en/sm/sm12/128/high.webp', 'Experience the whimsical charm of Alolan Meowth with this delightful Cosmic Eclipse Edition Pokémon card! This captivating card showcases Alolan Meowth, the mischievous Dark-type Pokémon, known for its playful nature and distinctive appearance.', 1, 3, 2, 2, 1),
(43, 'Pawniard', 60, '0.06', 'https://assets.tcgdex.net/en/sm/sm12/134/high.webp', 'In this dynamic illustration, Pawniard stands ready for battle amidst swirling cosmic energies, its blades gleaming with a razor-sharp edge. The artwork perfectly captures Pawniard\'s fierce presence and unwavering resolve, making it a favorite among trainers and collectors alike.', 1, 3, 2, 2, 1),
(44, 'Alolan Sandshrew', 60, '0.12', 'https://assets.tcgdex.net/en/sm/sm12/137/high.webp', 'In this captivating illustration, Alolan Sandshrew stands strong amidst swirling cosmic energies, its icy armor glistening with an otherworldly glow. The artwork perfectly captures Alolan Sandshrew\'s stoic presence and unwavering resolve, making it a cherished companion to trainers and collectors alike.', 1, 3, 2, 6, 1),
(45, 'Probopass', 130, '0.05', 'https://assets.tcgdex.net/en/sm/sm12/141/high.webp', 'In this intriguing illustration, Probopass stands stoically amidst swirling cosmic energies, its magnetic nose pointed towards the celestial expanse. The artwork perfectly captures Probopass\'s commanding demeanor and unwavering resolve, making it a respected guardian in the world of Pokémon.', 1, 3, 2, 6, 2),
(46, 'Azurill', 60, '0.36', 'https://assets.tcgdex.net/en/sm/sm12/146/high.webp', 'Dive into a world of innocence and wonder with the adorable Azurill Cosmic Eclipse Edition Pokémon card! This captivating card features Azurill, the charming Fairy-type Pokémon, known for its playful antics and endearing demeanor.', 1, 3, 2, 11, 1),
(47, 'Cottonee', 40, '0.10', 'https://assets.tcgdex.net/en/sm/sm12/147/high.webp', 'Step into a world of enchantment with the whimsical Cottonee Cosmic Eclipse Edition Pokémon card! This captivating card features Cottonee, the delightful Fairy-type Pokémon, known for its fluffy appearance and gentle demeanor.', 1, 3, 2, 11, 1),
(48, 'Swirlix', 60, '0.10', 'https://assets.tcgdex.net/en/sm/sm12/153/high.webp', 'Enter a world of sweetness and delight with the adorable Swirlix Cosmic Eclipse Edition Pokémon card! This captivating card features Swirlix, the charming Fairy-type Pokémon, known for its fluffy appearance and love for all things sugary.', 1, 3, 2, 11, 1),
(49, 'Reshiram & Zekrom GX', 270, '14.23', 'https://assets.tcgdex.net/en/sm/sm12/157/high.webp', 'In this breathtaking illustration, Reshiram and Zekrom stand united amidst swirling cosmic energies, their combined strength radiating with an otherworldly glow. The artwork perfectly captures the harmony and synergy between these legendary Pokémon, making them a formidable force to be reckoned with.', 1, 3, 2, 7, 7),
(50, 'Drampa', 120, '0.23', 'https://assets.tcgdex.net/en/sm/sm12/159/high.webp', 'Enter the mystical realm of the cosmos with the serene Drampa Cosmic Eclipse Edition Pokémon card! This captivating card features Drampa, the wise Dragon Pokémon, known for its gentle nature and ancient wisdom.', 1, 3, 2, 7, 3),
(51, 'Jangmo-o', 70, '0.15', 'https://assets.tcgdex.net/en/sm/sm12/161/high.webp', 'Embark on a cosmic journey with the resilient Jangmo-o Cosmic Eclipse Edition Pokémon card! This captivating card features Jangmo-o, the steadfast Dragon-type Pokémon, known for its indomitable spirit and unyielding determination.', 1, 3, 2, 7, 1),
(52, 'Ultra Necrozma', 110, '1.62', 'https://assets.tcgdex.net/en/sm/sm12/164/high.webp', 'Prepare for a cosmic battle of epic proportions with the awe-inspiring Ultra Necrozma Cosmic Eclipse Edition Pokémon card! This captivating card features Ultra Necrozma, the legendary Dragon-type Pokémon, revered for its overwhelming power and ethereal presence.', 1, 3, 2, 7, 3),
(53, 'Metapod', 90, '0.07', 'https://assets.tcgdex.net/en/sm/sm115/2/high.webp', 'In this serene illustration, Metapod rests peacefully amidst a backdrop of lush foliage, its cocooned form exuding an aura of tranquility. The artwork perfectly captures Metapod\'s serene presence and unwavering patience, making it a cherished addition to any trainer\'s collection.', 1, 4, 2, 4, 1),
(54, 'Charmeleon', 100, '0.07', 'https://assets.tcgdex.net/en/sm/sm115/8/high.webp', 'Ignite the flames of passion with the fierce Charmeleon Hidden Fates Edition Pokémon card! This captivating card features Charmeleon, the fiery Flame Pokémon, renowned for its fiery spirit and untamed power.', 1, 4, 2, 9, 2),
(55, 'Psyduck', 60, '0.08', 'https://assets.tcgdex.net/en/sm/sm115/11/high.webp', 'Dive into the depths of mystery with the enigmatic Psyduck Hidden Fates Edition Pokémon card! This captivating card features Psyduck, the perplexing Water-type Pokémon, known for its befuddled expression and mysterious powers.', 1, 4, 2, 10, 1),
(56, 'Voltorb', 50, '0.05', 'https://assets.tcgdex.net/en/sm/sm115/21/high.webp', 'Electrify your collection with the dynamic Voltorb Hidden Fates Edition Pokémon card! This captivating card features Voltorb, the electrifying lightning-type Pokémon, known for its spherical shape and explosive energy.', 1, 4, 2, 5, 1),
(57, 'Koffing', 60, '0.05', 'https://assets.tcgdex.net/en/sm/sm115/28/high.webp', 'In this intriguing illustration, Koffing exudes an aura of mystery as it floats amidst swirling clouds of noxious gas. Its mischievous grin hints at its penchant for mischief and chaos, making it a captivating addition to any trainer\'s collection.', 1, 4, 2, 8, 1),
(58, 'Graveler', 100, '0.04', 'https://assets.tcgdex.net/en/sm/sm115/34/high.webp', 'In this dynamic illustration, Graveler stands tall amidst rocky terrain, its rugged exterior glistening with an aura of resilience. The artwork perfectly captures Graveler\'s imposing nature and indomitable spirit, making it a prized addition to any trainer\'s collection.', 1, 4, 2, 3, 1),
(59, 'Wigglytuff GX', 210, '1.12', 'https://assets.tcgdex.net/en/sm/sm115/42/high.webp', 'In this mesmerizing illustration, Wigglytuff GX exudes an aura of grace and charm, surrounded by a cascade of shimmering fairy dust. Its serene expression belies its hidden power, hinting at the might that lies within. The artwork perfectly captures Wigglytuff GX\'s captivating presence and formidable aura, making it a prized addition to any trainer\'s collection.\r\n', 1, 4, 2, 11, 7),
(60, 'Snorlax', 150, '0.19', 'https://assets.tcgdex.net/en/sm/sm115/50/high.webp', 'In this tranquil illustration, Snorlax rests peacefully amidst a lush forest, its massive form exuding an aura of calm and contentment. The artwork perfectly captures Snorlax\'s serene presence and unwavering strength, making it a cherished addition to any trainer\'s collection.\r\n', 1, 4, 2, 1, 3),
(61, 'Jessie & James', NULL, '14.23', 'https://assets.tcgdex.net/en/sm/sm115/68/high.webp', 'Join the mischievous duo on a daring adventure with the dynamic Jessie and James Hidden Fates Edition Trainer card! This captivating card features Team Rocket\'s infamous duo, Jessie and James, renowned for their cunning schemes and relentless pursuit of Pikachu.', 3, 4, 2, NULL, 6),
(62, 'Sabrinas Suggestion', NULL, '0.05', 'https://assets.tcgdex.net/en/sm/sm115/65/high.webp', 'Unlock the secrets of the mind with the enigmatic Sabrina\'s Suggestion Hidden Fates Edition Trainer card! This captivating card features Sabrina, the mysterious Gym Leader of Saffron City, renowned for her psychic prowess and uncanny intuition.', 3, 4, 2, NULL, 2),
(63, 'Pokémon Center Lady', NULL, '0.11', 'https://assets.tcgdex.net/en/sm/sm115/64/high.webp', 'In this heartwarming illustration, the Pokémon Center Lady extends a caring hand to a Pokémon in need, surrounded by the familiar sights of the Pokémon Center. The artwork exudes a sense of warmth and compassion, capturing the essence of the Pokémon Center Lady\'s nurturing spirit.', 3, 4, 2, NULL, 2),
(64, 'Glaceon GX', 200, '22.87', 'https://assets.tcgdex.net/en/sm/sma/SV55/high.webp', 'Unleash the icy fury of Glaceon GX with the mesmerizing Glaceon GX Hidden Fates Edition Pokémon card! This captivating card showcases Glaceon, the elegant Water-type Pokémon, revered for its icy grace and formidable power.', 1, 4, 2, 10, 5),
(65, 'Mt. Coronet', NULL, '9.15', 'https://assets.tcgdex.net/en/sm/sma/SV89/high.webp', 'Ascend to new heights of power and majesty with the awe-inspiring Mt. Coronet Hidden Fates Edition Trainer card! This captivating card pays homage to Mt. Coronet, a legendary mountain steeped in history and mystery within the Sinnoh region.', 3, 4, 2, NULL, 8),
(66, 'Brooklet Hill', NULL, '13.32', 'https://assets.tcgdex.net/en/sm/sma/SV88/high.webp', 'In this enchanting illustration, Brooklet Hill unfolds in all its glory, with lush greenery, cascading waterfalls, and serene ponds inviting trainers to explore its hidden wonders. The artwork perfectly captures the tranquility and natural splendor of Brooklet Hill, making it a cherished addition to any trainer\'s collection.', 3, 4, 2, NULL, 8),
(68, 'Ampharos EX', 170, '1.81', 'https://assets.tcgdex.net/en/xy/xy7/27/high.webp', 'Illuminate the battlefield with the electrifying power of Ampharos EX, the formidable Pokémon card from the \"Ancient Origins\" expansion set! As a majestic Lightning-type Pokémon, Ampharos EX radiates with power and elegance, commanding the forces of lightning with unparalleled grace.', 1, 5, 3, 5, 9),
(69, 'Malamar', 90, '0.08', 'https://assets.tcgdex.net/en/xy/xy7/46/high.webp', 'In this captivating illustration, Malamar is depicted with an aura of mystery and intensity, its hypnotic gaze piercing through the shadows. Its sinister presence and enigmatic demeanor symbolize the dark power that it wields with deadly precision.', 1, 5, 3, 2, 1),
(70, 'M Tyranitar EX', 240, '31.85', 'https://assets.tcgdex.net/en/xy/xy7/92/high.webp', 'In this captivating illustration, M Tyranitar EX looms over the landscape, its massive form radiating with primal energy and raw power. Its imposing presence and ferocious demeanor strike fear into the hearts of challengers, asserting its dominance as the alpha predator of the Pokémon world.\r\n', 1, 5, 3, 2, 9),
(71, 'Giratina EX', 170, '9.16', 'https://assets.tcgdex.net/en/xy/xy7/57/high.webp', 'Unleash the otherworldly power of Giratina EX with the formidable Pokémon card from the \"Ancient Origins\" expansion set! As a Legendary Pokémon of immense strength and enigmatic origins, Giratina EX commands the forces of the Distortion World with unrivaled might.', 1, 5, 3, 7, 9),
(72, 'Level Ball', NULL, '0.60', 'https://assets.tcgdex.net/en/xy/xy7/76/high.webp', 'In this captivating illustration, Level Ball is depicted as a gleaming sphere, pulsating with the promise of discovery and adventure. Its sleek design and dynamic aura symbolize the boundless potential and excitement of catching and training Pokémon.', 3, 5, 3, NULL, 2),
(73, 'Hex Maniac', NULL, '1.20', 'https://assets.tcgdex.net/en/xy/xy7/75/high.webp', 'Unleash the power of the arcane with the enigmatic Hex Maniac Pokémon card from the \"Ancient Origins\" expansion set! As a Trainer card, Hex Maniac offers trainers a potent tool for disrupting their opponents\' strategies and gaining a tactical advantage in battle.', 3, 5, 3, NULL, 2),
(74, 'Lucky Helmet', NULL, '0.18', 'https://assets.tcgdex.net/en/xy/xy7/77/high.webp', 'Fortify your Pokémon\'s defenses and turn the tides of battle with the invaluable Lucky Helmet Pokémon card from the \"Ancient Origins\" expansion set! As a Trainer card, Lucky Helmet offers trainers a strategic tool for enhancing their Pokémon\'s resilience and gaining a tactical advantage in battle.', 3, 5, 3, NULL, 2),
(75, 'Dangerous Energy', NULL, '0.16', 'https://assets.tcgdex.net/en/xy/xy7/82/high.webp', 'Unleash the power of darkness with the ominous Dangerous Energy Pokémon card from the \"Ancient Origins\" expansion set! As a special Energy card, Dangerous Energy offers trainers a unique way to enhance their Dark-type Pokémon\'s prowess in battle.', 2, 5, 3, 2, 2),
(76, 'Flash Energy', NULL, '0.19', 'https://assets.tcgdex.net/en/xy/xy7/83/high.webp', 'Illuminate your battles with the electrifying power of Flash Energy, the dazzling Pokémon card from the \"Ancient Origins\" expansion set! As a special Energy card, Flash Energy offers trainers a unique way to empower their Lightning-type Pokémon on the battlefield.', 2, 5, 3, 5, 2),
(77, 'Energy Retrieval', NULL, '19.37', 'https://assets.tcgdex.net/en/xy/xy7/99/high.webp', 'In this captivating illustration, Energy Retrieval is depicted as a glowing orb of energy, pulsating with vitality and potential. Its radiant glow and dynamic design symbolize the boundless energy waiting to be harnessed by skilled trainers to empower their Pokémon.', 3, 5, 3, NULL, 8),
(78, 'Trainers Mail', NULL, '9.22', 'https://assets.tcgdex.net/en/xy/xy7/100/high.webp', 'In this captivating illustration, Trainer\'s Mail is depicted as a sealed envelope, brimming with potential and secrets waiting to be revealed. Its simple yet powerful design symbolizes the essence of strategy and preparation inherent in the world of Pokémon.', 3, 5, 3, NULL, 8),
(79, 'M Rayquaza EX', 220, '146.00', 'https://assets.tcgdex.net/en/xy/xy7/98/high.webp', 'Soar to new heights of power and majesty with the legendary M Rayquaza EX Pokémon card from the \"Ancient Origins\" expansion set! As one of the most iconic and revered Pokémon, Mega Rayquaza EX radiates unparalleled strength and ferocity.', 1, 5, 3, 1, 8),
(80, 'Primal Groudon EX', 240, '83.02', 'https://assets.tcgdex.net/en/xy/xy7/97/high.webp', 'Unleash the raw power and primal fury of Primal Groudon EX with the awe-inspiring Pokémon card from the \"Ancient Origins\" expansion set! As one of the legendary Primal Pokémon, Primal Groudon EX embodies the unyielding strength of the earth itself, wielding the power of magma and molten rock.', 1, 5, 3, 3, 8),
(81, 'Primal Kyogre EX', 240, '68.09', 'https://assets.tcgdex.net/en/xy/xy7/96/high.webp', 'Dive into the depths of power and primal energy with the awe-inspiring Primal Kyogre EX Pokémon card from the \"Ancient Origins\" expansion set! As one of the legendary Primal Pokémon, Primal Kyogre EX commands the forces of the ocean with unparalleled might and majesty.', 1, 5, 3, 10, 8),
(82, 'Steven', NULL, '23.95', 'https://assets.tcgdex.net/en/xy/xy7/95/high.webp', 'Unveil the wisdom and strategic prowess of Steven with the mesmerizing Steven Pokémon card from the \"Ancient Origins\" expansion set! As one of the most revered trainers in the Pokémon world, Steven\'s presence on this card exudes a sense of authority and mastery.', 3, 5, 3, NULL, 8),
(83, 'Grass Energy', NULL, '0.45', 'https://assets.tcgdex.net/en/xy/xy1/132/high.webp', 'Harness the power of nature with the Grass Energy card from the XY expansion set! As a fundamental source of energy for Grass-type Pokémon, Grass Energy empowers trainers to channel the vitality and resilience of the natural world into their Pokémon battles.', 2, 6, 3, 4, 1),
(84, 'Fire Energy', NULL, '0.44', 'https://assets.tcgdex.net/en/xy/xy1/133/high.webp', 'Ignite your battles with the fiery passion of the Fire Energy card from the XY expansion set! As a powerful source of energy for Fire-type Pokémon, Fire Energy empowers trainers to harness the intensity and heat of flames and unleash the scorching power of their Pokémon in battle.', 2, 6, 3, 9, 1),
(85, 'Water Energy', NULL, '1.83', 'https://assets.tcgdex.net/en/xy/xy1/134/high.webp', 'Dive into the depths of the ocean and harness the power of water with the Water Energy card from the XY expansion set! As a vital source of energy for Water-type Pokémon, Water Energy empowers trainers to command the ebb and flow of the tides and unleash the aquatic might of their Pokémon in battle.', 2, 6, 3, 10, 1),
(86, 'Psychic Energy', NULL, '0.91', 'https://assets.tcgdex.net/en/xy/xy1/136/high.webp', 'Unlock the mysteries of the mind and tap into the power of psychic energy with the Psychic Energy card from the XY expansion set! As a mystical and enigmatic source of energy for Psychic-type Pokémon, Psychic Energy empowers trainers to harness the extraordinary abilities and psychic prowess of their Pokémon in battle.', 2, 6, 3, 8, 1),
(87, 'Lightning Energy', NULL, '0.40', 'https://assets.tcgdex.net/en/xy/xy1/135/high.webp', 'Electrify your battles with the Lightning Energy card from the XY expansion set! As a dynamic source of energy for Electric-type Pokémon, Lightning Energy empowers trainers to harness the raw power and speed of thunderstorms in their Pokémon battles.', 2, 6, 3, 5, 1),
(88, 'Fighting Energy', NULL, '0.33', 'https://assets.tcgdex.net/en/xy/xy1/137/high.webp', 'Unleash the power of determination and strength with the Fighting Energy card from the XY expansion set! As a formidable source of energy for Fighting-type Pokémon, Fighting Energy empowers trainers to channel the raw power and resilience of martial prowess in their Pokémon battles.', 2, 6, 3, 3, 1),
(89, 'Darkness Energy', NULL, '0.74', 'https://assets.tcgdex.net/en/xy/xy1/138/high.webp', 'Embrace the shadows and tap into the power of darkness with the Darkness Energy card from the XY expansion set! As a mysterious and formidable source of energy for Dark-type Pokémon, Darkness Energy empowers trainers to wield the cunning and stealth of the night in their Pokémon battles.', 2, 6, 3, 2, 1),
(90, 'Metal Energy', NULL, '0.55', 'https://assets.tcgdex.net/en/xy/xy1/139/high.webp', 'Fortify your Pokémon with the strength of steel using the Metal Energy card from the XY expansion set! As a resilient source of energy for Metal-type Pokémon, Metal Energy empowers trainers to reinforce their Pokémon\'s defenses and wield the might of steel in battle.', 2, 6, 3, 6, 1),
(91, 'Fairy Energy', NULL, '0.48', 'https://assets.tcgdex.net/en/xy/xy1/140/high.webp', 'Infuse your Pokémon with the power of whimsy and enchantment with the Fairy Energy card from the XY expansion set! As a vital source of energy for Fairy-type Pokémon, Fairy Energy empowers trainers to unleash the mystical abilities and ethereal beauty of their Fairy-type companions in battle.', 2, 6, 3, 11, 1),
(93, 'Ledyba', 60, '0.13', 'https://assets.tcgdex.net/en/xy/xy1/6/high.webp', 'In this delightful illustration, Ledyba is depicted against a backdrop of blue skies and fluffy clouds, its vibrant red and black wings catching the sunlight as it soars through the air. Its cheerful expression and endearing posture evoke a sense of joy and wonder, inviting trainers and collectors to embark on a journey alongside this lovable Pokémon.', 1, 6, 3, 4, 1),
(94, 'Illumise', 70, '0.23', 'https://assets.tcgdex.net/en/xy/xy1/9/high.webp', 'Illuminate your collection with Illumise, the radiant Firefly Pokémon from the XY expansion set! Known for its captivating bioluminescent display and graceful flight, Illumise is a symbol of beauty and wonder in the Pokémon world.', 1, 6, 3, 4, 2),
(95, 'Pansage', 60, '0.15', 'https://assets.tcgdex.net/en/xy/xy1/10/high.webp', 'Embark on a botanical adventure with Pansage, the playful Grass-type Pokémon from the XY expansion set! Pansage is known for its mischievous nature and its leafy green appearance, making it a beloved companion for trainers and collectors alike.', 1, 6, 3, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `card_type`
--

CREATE TABLE `card_type` (
  `card_type_id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `card_type`
--

INSERT INTO `card_type` (`card_type_id`, `type`) VALUES
(1, 'Pokémon'),
(2, 'Energy'),
(3, 'Trainer');

-- --------------------------------------------------------

--
-- Table structure for table `collection`
--

CREATE TABLE `collection` (
  `collection_id` int(11) NOT NULL,
  `collection_name` varchar(255) NOT NULL,
  `collection_description` text,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `collection`
--

INSERT INTO `collection` (`collection_id`, `collection_name`, `collection_description`, `user_id`) VALUES
(47, 'Shiny!', 'All Shiny Pokemon :)', 56),
(49, 'Current Collection', 'My current collection of all the cards I have!', 56),
(51, 'Basic Collection', 'Here are the cards I have in my base collection!', 44),
(54, 'Dream Collection!', 'Cards I want in my dream collection ', 44);

-- --------------------------------------------------------

--
-- Table structure for table `collection_card`
--

CREATE TABLE `collection_card` (
  `collection_card_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `collection_card`
--

INSERT INTO `collection_card` (`collection_card_id`, `collection_id`, `card_id`) VALUES
(104, 47, 22),
(105, 47, 23),
(106, 47, 38),
(107, 47, 21),
(108, 47, 38),
(109, 47, 49),
(110, 47, 70),
(111, 47, 77),
(113, 49, 27),
(114, 49, 34),
(115, 49, 31),
(116, 49, 49),
(117, 49, 46),
(118, 49, 39),
(119, 49, 47),
(120, 49, 38),
(121, 49, 71),
(122, 49, 61),
(123, 49, 63),
(124, 49, 62),
(125, 49, 61),
(126, 49, 62),
(142, 51, 14),
(143, 51, 15),
(144, 51, 17),
(145, 51, 16),
(146, 51, 18),
(147, 51, 19),
(148, 51, 20),
(149, 51, 21),
(150, 51, 22),
(151, 51, 23),
(152, 51, 24),
(153, 51, 25),
(154, 51, 26),
(155, 51, 27),
(165, 54, 82),
(166, 54, 78),
(167, 54, 77),
(168, 54, 74),
(169, 54, 79),
(170, 54, 70),
(186, 54, 22);

-- --------------------------------------------------------

--
-- Table structure for table `energy_type`
--

CREATE TABLE `energy_type` (
  `energy_type_id` int(11) NOT NULL,
  `energy` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `energy_type`
--

INSERT INTO `energy_type` (`energy_type_id`, `energy`) VALUES
(1, 'Colorless'),
(2, 'Darkness'),
(3, 'Fighting'),
(4, 'Grass'),
(5, 'Lightning'),
(6, 'Metal'),
(7, 'Dragon'),
(8, 'Psychic'),
(9, 'Fire'),
(10, 'Water'),
(11, 'Fairy');

-- --------------------------------------------------------

--
-- Table structure for table `rarity`
--

CREATE TABLE `rarity` (
  `rarity_id` int(11) NOT NULL,
  `rarity` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rarity`
--

INSERT INTO `rarity` (`rarity_id`, `rarity`) VALUES
(1, 'Common'),
(2, 'Uncommon'),
(3, 'Rare'),
(4, 'Double Rare'),
(5, 'Shiny Rare'),
(6, 'Hyper Rare'),
(7, 'Rare Holo GX'),
(8, 'Secret Rare'),
(9, 'Rare Holo EX');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int(11) NOT NULL,
  `collection_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rating_value` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`rating_id`, `collection_id`, `user_id`, `rating_value`) VALUES
(30, 47, 56, 5),
(31, 49, 56, 4),
(39, 54, 44, 2),
(40, 49, 44, 2),
(41, 47, 44, 3),
(42, 51, 44, 3);

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `series_id` int(11) NOT NULL,
  `series` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `series`
--

INSERT INTO `series` (`series_id`, `series`) VALUES
(1, 'Scarlet & Violet Series'),
(2, 'Sun & Moon Series'),
(3, 'XY Series');

-- --------------------------------------------------------

--
-- Table structure for table `set`
--

CREATE TABLE `set` (
  `set_id` int(11) NOT NULL,
  `set` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `set`
--

INSERT INTO `set` (`set_id`, `set`) VALUES
(1, 'Paldean Fates'),
(2, 'Temporal Forces'),
(3, 'Cosmic Eclipse'),
(4, 'Hidden Fates'),
(5, 'Ancient Origins'),
(6, 'XY');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `user_name`, `password`, `role`) VALUES
(44, 'admin@mail.com', 'admin_01', '$2b$10$GceDKN.p2dOAcwjsONBVX.LEwhyXpuZaX6cNconc5qVnhyRrJc8Ne', 'admin'),
(56, 'user@mail.com', 'User01', '$2b$10$m1EKOV0iCym5j5soOzZUf./MclTT/RRri2qSzoZtbIbD1/1svZr0i', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `wishlist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`wishlist_id`, `user_id`, `card_id`) VALUES
(70, 56, 83),
(71, 56, 38),
(72, 56, 23),
(73, 56, 49),
(74, 56, 77),
(75, 44, 23),
(77, 44, 49),
(78, 44, 70),
(80, 44, 39),
(81, 44, 71),
(82, 44, 61),
(85, 56, 63);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`card_id`),
  ADD KEY `card_card_type` (`card_type_id`),
  ADD KEY `card_set` (`set_id`),
  ADD KEY `card_series` (`series_id`),
  ADD KEY `card_energy_type` (`energy_type_id`),
  ADD KEY `card_rarity` (`rarity_id`);

--
-- Indexes for table `card_type`
--
ALTER TABLE `card_type`
  ADD PRIMARY KEY (`card_type_id`);

--
-- Indexes for table `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`collection_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `collection_card`
--
ALTER TABLE `collection_card`
  ADD PRIMARY KEY (`collection_card_id`),
  ADD KEY `collection_id` (`collection_id`),
  ADD KEY `card_id` (`card_id`);

--
-- Indexes for table `energy_type`
--
ALTER TABLE `energy_type`
  ADD PRIMARY KEY (`energy_type_id`);

--
-- Indexes for table `rarity`
--
ALTER TABLE `rarity`
  ADD PRIMARY KEY (`rarity_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD UNIQUE KEY `unique_rating_per_user_per_collection` (`collection_id`,`user_id`),
  ADD KEY `ratings_collection_2` (`user_id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD PRIMARY KEY (`series_id`);

--
-- Indexes for table `set`
--
ALTER TABLE `set`
  ADD PRIMARY KEY (`set_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD KEY `wishlist_user` (`user_id`),
  ADD KEY `wishlist_card` (`card_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `card`
--
ALTER TABLE `card`
  MODIFY `card_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `card_type`
--
ALTER TABLE `card_type`
  MODIFY `card_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `collection`
--
ALTER TABLE `collection`
  MODIFY `collection_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `collection_card`
--
ALTER TABLE `collection_card`
  MODIFY `collection_card_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT for table `energy_type`
--
ALTER TABLE `energy_type`
  MODIFY `energy_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `rarity`
--
ALTER TABLE `rarity`
  MODIFY `rarity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `series`
--
ALTER TABLE `series`
  MODIFY `series_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `set`
--
ALTER TABLE `set`
  MODIFY `set_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wishlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `card`
--
ALTER TABLE `card`
  ADD CONSTRAINT `card_card_type` FOREIGN KEY (`card_type_id`) REFERENCES `card_type` (`card_type_id`),
  ADD CONSTRAINT `card_energy_type` FOREIGN KEY (`energy_type_id`) REFERENCES `energy_type` (`energy_type_id`),
  ADD CONSTRAINT `card_rarity` FOREIGN KEY (`rarity_id`) REFERENCES `rarity` (`rarity_id`),
  ADD CONSTRAINT `card_series` FOREIGN KEY (`series_id`) REFERENCES `series` (`series_id`),
  ADD CONSTRAINT `card_set` FOREIGN KEY (`set_id`) REFERENCES `set` (`set_id`);

--
-- Constraints for table `collection`
--
ALTER TABLE `collection`
  ADD CONSTRAINT `collection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `collection_card`
--
ALTER TABLE `collection_card`
  ADD CONSTRAINT `collection_card_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`collection_id`),
  ADD CONSTRAINT `collection_card_ibfk_2` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_collection_1` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`collection_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_collection_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_card` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`),
  ADD CONSTRAINT `wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
