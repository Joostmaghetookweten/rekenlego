import React, { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react';

import { Trophy, Heart, Flame, Star, Home, User, BookOpen, ChevronRight, Check, X, Sparkles, Award, Zap, Clock, Play } from 'lucide-react';

import confetti from 'canvas-confetti';



// Context voor app state

const AppContext = createContext();

// Small local loading fallback used for Suspense
function LoadingSpinner() {
  return (
    <div className="p-3 text-center" aria-hidden>
      Loading...
    </div>
  );
}

// Lazy load heavy components (use different variable names to avoid
// clashing with components already declared inside this file)
const LazyMiniGames = lazy(() => import('./components/MiniGames'));
const LazyProfileView = lazy(() => import('./components/ProfileView'));



const useApp = () => {

  const context = useContext(AppContext);

  if (!context) throw new Error('useApp must be used within AppProvider');

  return context;

};



// Database met oefeningen

const EXERCISES = {

  // OPTELLEN - Basis (30% verhalen, 70% gewone sommen)
  addition_basics: [
    // 1. Gewoon
    {
      question: "5 + 3",
      answer: 8,
      options: [6, 7, 8, 9],
      difficulty: 1
    },
    // 2. Gewoon
    {
      question: "12 + 7",
      answer: 19,
      options: [17, 18, 19, 20],
      difficulty: 1
    },
    // 3. VERHAAL 🐶
    {
      question: "8 + 6",
      story: "🐶 In het park spelen 8 honden. Er komen 6 honden bij. Hoeveel spelen er nu?",
      visual: "🐶",
      answer: 14,
      options: [12, 13, 14, 15],
      hint: "Tel alle honden bij elkaar",
      category: "dieren",
      difficulty: 1
    },
    // 4. Gewoon
    {
      question: "25 + 15",
      answer: 40,
      options: [35, 40, 45, 50],
      difficulty: 2
    },
    // 5. Gewoon
    {
      question: "33 + 27",
      answer: 60,
      options: [50, 55, 60, 65],
      difficulty: 2
    },
    // 6. Gewoon
    {
      question: "17 + 9",
      answer: 26,
      options: [24, 25, 26, 27],
      difficulty: 2
    },
    // 7. Gewoon
    {
      question: "41 + 23",
      answer: 64,
      options: [62, 63, 64, 65],
      difficulty: 2
    },
    // 8. Gewoon
    {
      question: "56 + 18",
      answer: 74,
      options: [72, 73, 74, 75],
      difficulty: 2
    },
    // 9. VERHAAL ⚽
    {
      question: "45 + 38",
      story: "⚽ Ajax heeft 45 punten, PSV heeft 38 punten. Hoeveel punten samen?",
      visual: "⚽",
      answer: 83,
      options: [81, 82, 83, 84],
      hint: "Tel beide puntenaantallen op",
      category: "sport",
      difficulty: 2
    },
    // 10. Gewoon
    {
      question: "67 + 29",
      answer: 96,
      options: [94, 95, 96, 97],
      difficulty: 2
    }
  ],

  // OPTELLEN - Gemiddeld
  addition_intermediate: [

    { question: "47 + 38", answer: 85, options: [83, 84, 85, 86] },

    { question: "56 + 29", answer: 85, options: [83, 84, 85, 87] },

    { question: "73 + 45", answer: 118, options: [116, 117, 118, 119] },

    { question: "89 + 34", answer: 123, options: [121, 122, 123, 124] },

    { question: "67 + 58", answer: 125, options: [123, 124, 125, 126] },

    { question: "92 + 47", answer: 139, options: [137, 138, 139, 140] },

    { question: "124 + 76", answer: 200, options: [198, 199, 200, 201] },

    { question: "156 + 89", answer: 245, options: [243, 244, 245, 246] },

  ],

  // OPTELLEN - Gevorderd
  addition_advanced: [

    { question: "234 + 567", answer: 801, options: [799, 800, 801, 802] },

    { question: "456 + 789", answer: 1245, options: [1243, 1244, 1245, 1246] },

    { question: "678 + 923", answer: 1601, options: [1599, 1600, 1601, 1602] },

    { question: "892 + 456", answer: 1348, options: [1346, 1347, 1348, 1349] },

    { question: "1234 + 567", answer: 1801, options: [1799, 1800, 1801, 1802] },

    { question: "2345 + 678", answer: 3023, options: [3021, 3022, 3023, 3024] },

  ],

  // OPTELLEN - Drie getallen
  addition_three_numbers: [

    { question: "5 + 3 + 4", answer: 12, options: [10, 11, 12, 13] },

    { question: "7 + 8 + 6", answer: 21, options: [19, 20, 21, 22] },

    { question: "12 + 15 + 8", answer: 35, options: [33, 34, 35, 36] },

    { question: "23 + 17 + 14", answer: 54, options: [52, 53, 54, 55] },

    { question: "34 + 28 + 19", answer: 81, options: [79, 80, 81, 82] },

    { question: "45 + 36 + 27", answer: 108, options: [106, 107, 108, 109] },

  ],

  // AFTREKKEN - Basis (30% verhalen, 70% gewone sommen)
  subtraction_basics: [
    // 1. Gewoon
    {
      question: "10 - 4",
      answer: 6,
      options: [4, 5, 6, 7],
      difficulty: 1
    },
    // 2. Gewoon
    {
      question: "15 - 8",
      answer: 7,
      options: [6, 7, 8, 9],
      difficulty: 1
    },
    // 3. VERHAAL 🍪
    {
      question: "20 - 12",
      story: "🍪 Emma heeft 20 koekjes. Ze eet er 12. Hoeveel blijven over?",
      visual: "🍪",
      answer: 8,
      options: [6, 7, 8, 9],
      hint: "Begin bij 20 en haal 12 weg",
      category: "eten",
      difficulty: 1
    },
    // 4. Gewoon
    {
      question: "30 - 12",
      answer: 18,
      options: [16, 17, 18, 19],
      difficulty: 2
    },
    // 5. Gewoon
    {
      question: "44 - 16",
      answer: 28,
      options: [26, 27, 28, 29],
      difficulty: 2
    },
    // 6. Gewoon
    {
      question: "53 - 27",
      answer: 26,
      options: [24, 25, 26, 27],
      difficulty: 2
    },
    // 7. Gewoon
    {
      question: "67 - 39",
      answer: 28,
      options: [26, 27, 28, 29],
      difficulty: 2
    },
    // 8. Gewoon
    {
      question: "75 - 48",
      answer: 27,
      options: [25, 26, 27, 28],
      difficulty: 2
    },
    // 9. VERHAAL 🚲
    {
      question: "82 - 47",
      story: "🚲 Er staan 82 fietsen bij school. 47 kinderen fietsen naar huis. Hoeveel blijven er?",
      visual: "🚲",
      answer: 35,
      options: [33, 34, 35, 36],
      hint: "Trek 47 af van 82",
      category: "school",
      difficulty: 2
    },
    // 10. Gewoon
    {
      question: "91 - 55",
      answer: 36,
      options: [34, 35, 36, 37],
      difficulty: 2
    }
  ],

  // AFTREKKEN - Gemiddeld
  subtraction_intermediate: [

    { question: "67 - 29", answer: 38, options: [36, 37, 38, 39] },

    { question: "84 - 47", answer: 37, options: [35, 36, 37, 38] },

    { question: "95 - 58", answer: 37, options: [35, 36, 37, 38] },

    { question: "123 - 67", answer: 56, options: [54, 55, 56, 57] },

    { question: "156 - 89", answer: 67, options: [65, 66, 67, 68] },

    { question: "178 - 94", answer: 84, options: [82, 83, 84, 85] },

    { question: "234 - 156", answer: 78, options: [76, 77, 78, 79] },

    { question: "267 - 189", answer: 78, options: [76, 77, 78, 79] },

  ],

  // AFTREKKEN - Gevorderd
  subtraction_advanced: [

    { question: "456 - 234", answer: 222, options: [220, 221, 222, 223] },

    { question: "789 - 456", answer: 333, options: [331, 332, 333, 334] },

    { question: "923 - 567", answer: 356, options: [354, 355, 356, 357] },

    { question: "1234 - 789", answer: 445, options: [443, 444, 445, 446] },

    { question: "1567 - 892", answer: 675, options: [673, 674, 675, 676] },

    { question: "2345 - 1567", answer: 778, options: [776, 777, 778, 779] },

  ],

  // VERMENIGVULDIGEN - Basis (30% verhalen, 70% gewone sommen)
  multiplication_basics: [
    // 1. Gewoon
    {
      question: "3 × 4",
      answer: 12,
      options: [10, 11, 12, 13],
      difficulty: 2
    },
    // 2. Gewoon
    {
      question: "6 × 7",
      answer: 42,
      options: [40, 41, 42, 43],
      difficulty: 3
    },
    // 3. VERHAAL 🍎
    {
      question: "5 × 8",
      story: "🍎 Elke doos heeft 5 appels. Je hebt 8 dozen. Hoeveel appels totaal?",
      visual: "🍎",
      answer: 40,
      options: [38, 39, 40, 41],
      hint: "8 dozen van 5 appels elk",
      category: "eten",
      difficulty: 3
    },
    // 4. Gewoon
    {
      question: "9 × 6",
      answer: 54,
      options: [52, 54, 56, 58],
      difficulty: 3
    },
    // 5. Gewoon
    {
      question: "7 × 8",
      answer: 56,
      options: [54, 55, 56, 57],
      difficulty: 3
    },
    // 6. Gewoon
    {
      question: "4 × 9",
      answer: 36,
      options: [34, 35, 36, 37],
      difficulty: 3
    },
    // 7. Gewoon
    {
      question: "8 × 6",
      answer: 48,
      options: [46, 47, 48, 49],
      difficulty: 3
    },
    // 8. Gewoon
    {
      question: "7 × 9",
      answer: 63,
      options: [61, 62, 63, 64],
      difficulty: 3
    },
    // 9. VERHAAL 🍕
    {
      question: "6 × 8",
      story: "🍕 Elke pizza heeft 6 punten. Je bestelt 8 pizza's. Hoeveel punten totaal?",
      visual: "🍕",
      answer: 48,
      options: [46, 47, 48, 49],
      hint: "8 pizza's × 6 punten elk",
      category: "eten",
      difficulty: 3
    },
    // 10. Gewoon
    {
      question: "9 × 9",
      answer: 81,
      options: [79, 80, 81, 82],
      difficulty: 3
    }
  ],

  // VERMENIGVULDIGEN - Gemiddeld
  multiplication_intermediate: [

    { question: "12 × 5", answer: 60, options: [58, 59, 60, 61] },

    { question: "15 × 6", answer: 90, options: [88, 89, 90, 91] },

    { question: "18 × 4", answer: 72, options: [70, 71, 72, 73] },

    { question: "23 × 3", answer: 69, options: [67, 68, 69, 70] },

    { question: "14 × 7", answer: 98, options: [96, 97, 98, 99] },

    { question: "16 × 8", answer: 128, options: [126, 127, 128, 129] },

    { question: "25 × 4", answer: 100, options: [98, 99, 100, 101] },

    { question: "19 × 5", answer: 95, options: [93, 94, 95, 96] },

  ],

  // VERMENIGVULDIGEN - Gevorderd
  multiplication_advanced: [

    { question: "34 × 6", answer: 204, options: [202, 203, 204, 205] },

    { question: "45 × 7", answer: 315, options: [313, 314, 315, 316] },

    { question: "56 × 8", answer: 448, options: [446, 447, 448, 449] },

    { question: "67 × 9", answer: 603, options: [601, 602, 603, 604] },

    { question: "78 × 12", answer: 936, options: [934, 935, 936, 937] },

    { question: "89 × 15", answer: 1335, options: [1333, 1334, 1335, 1336] },

  ],

  // VERMENIGVULDIGEN - Tafels van 10
  multiplication_tens: [

    { question: "10 × 5", answer: 50, options: [48, 49, 50, 51] },

    { question: "20 × 4", answer: 80, options: [78, 79, 80, 81] },

    { question: "30 × 6", answer: 180, options: [178, 179, 180, 181] },

    { question: "40 × 7", answer: 280, options: [278, 279, 280, 281] },

    { question: "50 × 8", answer: 400, options: [398, 399, 400, 401] },

    { question: "60 × 9", answer: 540, options: [538, 539, 540, 541] },

  ],

  // DELEN - Basis (30% verhalen, 70% gewone sommen)
  division_basics: [
    // 1. Gewoon
    {
      question: "12 ÷ 3",
      answer: 4,
      options: [2, 3, 4, 5],
      difficulty: 2
    },
    // 2. Gewoon
    {
      question: "20 ÷ 4",
      answer: 5,
      options: [4, 5, 6, 7],
      difficulty: 2
    },
    // 3. VERHAAL 🧁
    {
      question: "24 ÷ 6",
      story: "🧁 24 cupcakes verdelen over 6 vrienden. Hoeveel krijgt ieder?",
      visual: "🧁",
      answer: 4,
      options: [3, 4, 5, 6],
      hint: "Verdeel 24 in 6 gelijke delen",
      category: "eten",
      difficulty: 2
    },
    // 4. Gewoon
    {
      question: "35 ÷ 5",
      answer: 7,
      options: [6, 7, 8, 9],
      difficulty: 3
    },
    // 5. Gewoon
    {
      question: "48 ÷ 6",
      answer: 8,
      options: [7, 8, 9, 10],
      difficulty: 3
    },
    // 6. Gewoon
    {
      question: "56 ÷ 8",
      answer: 7,
      options: [6, 7, 8, 9],
      difficulty: 3
    },
    // 7. Gewoon
    {
      question: "63 ÷ 9",
      answer: 7,
      options: [6, 7, 8, 9],
      difficulty: 3
    },
    // 8. Gewoon
    {
      question: "72 ÷ 8",
      answer: 9,
      options: [7, 8, 9, 10],
      difficulty: 3
    },
    // 9. VERHAAL 🧱
    {
      question: "54 ÷ 6",
      story: "🧱 Je hebt 54 Lego stenen. Maak 6 gelijke stapels. Hoeveel per stapel?",
      visual: "🧱",
      answer: 9,
      options: [7, 8, 9, 10],
      hint: "Verdeel 54 over 6 stapels",
      category: "spelen",
      difficulty: 3
    },
    // 10. Gewoon
    {
      question: "81 ÷ 9",
      answer: 9,
      options: [7, 8, 9, 10],
      difficulty: 3
    }
  ],

  // DELEN - Gemiddeld
  division_intermediate: [

    { question: "72 ÷ 8", answer: 9, options: [8, 9, 10, 11] },

    { question: "84 ÷ 7", answer: 12, options: [11, 12, 13, 14] },

    { question: "96 ÷ 8", answer: 12, options: [11, 12, 13, 14] },

    { question: "108 ÷ 9", answer: 12, options: [11, 12, 13, 14] },

    { question: "120 ÷ 10", answer: 12, options: [11, 12, 13, 14] },

    { question: "144 ÷ 12", answer: 12, options: [11, 12, 13, 14] },

    { question: "156 ÷ 13", answer: 12, options: [11, 12, 13, 14] },

    { question: "168 ÷ 14", answer: 12, options: [11, 12, 13, 14] },

  ],

  // DELEN - Gevorderd
  division_advanced: [

    { question: "234 ÷ 6", answer: 39, options: [37, 38, 39, 40] },

    { question: "315 ÷ 7", answer: 45, options: [43, 44, 45, 46] },

    { question: "432 ÷ 8", answer: 54, options: [52, 53, 54, 55] },

    { question: "567 ÷ 9", answer: 63, options: [61, 62, 63, 64] },

    { question: "648 ÷ 12", answer: 54, options: [52, 53, 54, 55] },

    { question: "756 ÷ 14", answer: 54, options: [52, 53, 54, 55] },

  ],

  // GEMENGDE BEWERKINGEN
  mixed_operations: [

    { question: "5 + 3 × 2", answer: 11, options: [10, 11, 12, 13] }, // 5 + 6 = 11

    { question: "10 - 2 × 3", answer: 4, options: [3, 4, 5, 6] }, // 10 - 6 = 4

    { question: "12 ÷ 3 + 5", answer: 9, options: [7, 8, 9, 10] }, // 4 + 5 = 9

    { question: "20 - 12 ÷ 4", answer: 17, options: [15, 16, 17, 18] }, // 20 - 3 = 17

    { question: "6 × 3 - 8", answer: 10, options: [8, 9, 10, 11] }, // 18 - 8 = 10

    { question: "15 + 20 ÷ 5", answer: 19, options: [17, 18, 19, 20] }, // 15 + 4 = 19

  ],

};

// SHOP ITEMS DATABASE
const SHOP_ITEMS = {
  avatar: [
    // Head
    { id: 'item_red_cap', name: 'Rode Pet', category: 'avatar_head', price: 25, emoji: '🧢', rarity: 'common', unlockLevel: 1, preview: 'red_cap_preview' },
    { id: 'item_blue_glasses', name: 'Blauwe Bril', category: 'avatar_head', price: 30, emoji: '🕶️', rarity: 'common', unlockLevel: 1, preview: 'blue_glasses_preview' },
    { id: 'item_golden_crown', name: 'Gouden Kroon', category: 'avatar_head', price: 100, emoji: '👑', rarity: 'legendary', unlockLevel: 5, preview: 'golden_crown_preview' },
    { id: 'item_robot_helm', name: 'Robot Helm', category: 'avatar_head', price: 75, emoji: '🤖', rarity: 'epic', unlockLevel: 4, preview: 'robot_helm_preview' },
    { id: 'item_pirate_hat', name: 'Piratenhoed', category: 'avatar_head', price: 50, emoji: '🏴‍☠️', rarity: 'rare', unlockLevel: 2, preview: 'pirate_hat_preview' },
    { id: 'item_hero_mask', name: 'Superhelden Masker', category: 'avatar_head', price: 60, emoji: '🦸', rarity: 'rare', unlockLevel: 3, preview: 'hero_mask_preview' },

    // Body
    { id: 'item_red_cape', name: 'Rode Cape', category: 'avatar_body', price: 50, emoji: '🧥', rarity: 'rare', unlockLevel: 2, preview: 'red_cape_preview' },
    { id: 'item_green_sweater', name: 'Groene Trui', category: 'avatar_body', price: 40, emoji: '🧶', rarity: 'common', unlockLevel: 1, preview: 'green_sweater_preview' },
    { id: 'item_football_shirt', name: 'Voetbalshirt', category: 'avatar_body', price: 45, emoji: '⚽', rarity: 'common', unlockLevel: 1, preview: 'football_shirt_preview' },
    { id: 'item_knight_armor', name: 'Ridder Harnas', category: 'avatar_body', price: 80, emoji: '🛡️', rarity: 'epic', unlockLevel: 4, preview: 'knight_armor_preview' },
    { id: 'item_astronaut_suit', name: 'Astronautenpak', category: 'avatar_body', price: 90, emoji: '🚀', rarity: 'epic', unlockLevel: 5, preview: 'astronaut_suit_preview' },

    // Accessories
    { id: 'item_golden_badge', name: 'Gouden Badge', category: 'avatar_accessory', price: 35, emoji: '🔰', rarity: 'common', unlockLevel: 1, preview: 'golden_badge_preview' },
    { id: 'item_backpack', name: 'Rugzak', category: 'avatar_accessory', price: 30, emoji: '🎒', rarity: 'common', unlockLevel: 1, preview: 'backpack_preview' },
    { id: 'item_skateboard', name: 'Skateboard', category: 'avatar_accessory', price: 55, emoji: '🛹', rarity: 'rare', unlockLevel: 2, preview: 'skateboard_preview' },
  ],
  room: [
    // Meubels
    { id: 'item_desk', name: 'Bureau', category: 'room_furniture', price: 100, emoji: '🪑', rarity: 'rare', unlockLevel: 3, preview: 'desk_preview' },
    { id: 'item_chair', name: 'Stoel', category: 'room_furniture', price: 60, emoji: '🪑', rarity: 'common', unlockLevel: 1, preview: 'chair_preview' },
    { id: 'item_bed', name: 'Bed', category: 'room_furniture', price: 120, emoji: '🛏️', rarity: 'epic', unlockLevel: 4, preview: 'bed_preview' },
    { id: 'item_bookcase', name: 'Boekenkast', category: 'room_furniture', price: 80, emoji: '📚', rarity: 'rare', unlockLevel: 2, preview: 'bookcase_preview' },
    { id: 'item_clock', name: 'Klok', category: 'room_furniture', price: 40, emoji: '🕰️', rarity: 'common', unlockLevel: 1, preview: 'clock_preview' },

    // Decoratie
    { id: 'item_poster', name: 'Poster', category: 'room_decor', price: 25, emoji: '🖼️', rarity: 'common', unlockLevel: 1, preview: 'poster_preview' },
    { id: 'item_plant', name: 'Plant', category: 'room_decor', price: 30, emoji: '🪴', rarity: 'common', unlockLevel: 1, preview: 'plant_preview' },
    { id: 'item_lamp', name: 'Lamp', category: 'room_decor', price: 50, emoji: '💡', rarity: 'rare', unlockLevel: 2, preview: 'lamp_preview' },
    { id: 'item_rug', name: 'Tapijt', category: 'room_decor', price: 70, emoji: '🧶', rarity: 'rare', unlockLevel: 2, preview: 'rug_preview' },
    { id: 'item_window_view', name: 'Raam met Uitzicht', category: 'room_decor', price: 90, emoji: '🪟', rarity: 'epic', unlockLevel: 3, preview: 'window_view_preview' },

    // Speelgoed
    { id: 'item_lego_set', name: 'Lego Set (decoratief)', category: 'room_toy', price: 100, emoji: '🧱', rarity: 'epic', unlockLevel: 3, preview: 'lego_set_preview' },
    { id: 'item_teddy', name: 'Teddybeer', category: 'room_toy', price: 45, emoji: '🧸', rarity: 'common', unlockLevel: 1, preview: 'teddy_preview' },
    { id: 'item_football', name: 'Voetbal', category: 'room_toy', price: 35, emoji: '⚽', rarity: 'common', unlockLevel: 1, preview: 'football_preview' },
    { id: 'item_globe', name: 'Wereldbol', category: 'room_toy', price: 50, emoji: '🌍', rarity: 'rare', unlockLevel: 2, preview: 'globe_preview' },
  ],
  themes: [
    { id: 'theme_space_pack', name: 'Ruimte Kamer Pack', category: 'theme_pack', price: 300, emoji: '🌌', rarity: 'legendary', unlockLevel: 6, preview: 'theme_space_preview' },
    { id: 'theme_football_pack', name: 'Voetbal Kamer Pack', category: 'theme_pack', price: 280, emoji: '⚽', rarity: 'epic', unlockLevel: 5, preview: 'theme_football_preview' },
    { id: 'theme_princess_pack', name: 'Prinses Kamer Pack', category: 'theme_pack', price: 320, emoji: '👑', rarity: 'legendary', unlockLevel: 6, preview: 'theme_princess_preview' },
    { id: 'theme_hero_pack', name: 'Superhelden Pack', category: 'theme_pack', price: 290, emoji: '🦸', rarity: 'legendary', unlockLevel: 6, preview: 'theme_hero_preview' },
  ],
  powerups: [],
};




const LESSONS = [

  // OPTELLEN
  { id: 'addition_basics', name: 'Optellen Basis', icon: '➕', color: 'bg-green-500', xp: 50, category: 'addition', level: 'basic', requires: [] },

  { id: 'addition_intermediate', name: 'Optellen Gemiddeld', icon: '➕', color: 'bg-green-600', xp: 75, category: 'addition', level: 'intermediate', requires: ['addition_basics'] },

  { id: 'addition_advanced', name: 'Optellen Gevorderd', icon: '➕', color: 'bg-green-700', xp: 100, category: 'addition', level: 'advanced', requires: ['addition_intermediate'] },

  { id: 'addition_three_numbers', name: 'Drie Getallen Optellen', icon: '➕', color: 'bg-green-400', xp: 75, category: 'addition', level: 'special', requires: ['addition_basics'] },

  // AFTREKKEN
  { id: 'subtraction_basics', name: 'Aftrekken Basis', icon: '➖', color: 'bg-blue-500', xp: 50, category: 'subtraction', level: 'basic', requires: [] },

  { id: 'subtraction_intermediate', name: 'Aftrekken Gemiddeld', icon: '➖', color: 'bg-blue-600', xp: 75, category: 'subtraction', level: 'intermediate', requires: ['subtraction_basics'] },

  { id: 'subtraction_advanced', name: 'Aftrekken Gevorderd', icon: '➖', color: 'bg-blue-700', xp: 100, category: 'subtraction', level: 'advanced', requires: ['subtraction_intermediate'] },

  // VERMENIGVULDIGEN
  { id: 'multiplication_basics', name: 'Vermenigvuldigen Basis', icon: '✖️', color: 'bg-purple-500', xp: 75, category: 'multiplication', level: 'basic', requires: [] },

  { id: 'multiplication_intermediate', name: 'Vermenigvuldigen Gemiddeld', icon: '✖️', color: 'bg-purple-600', xp: 100, category: 'multiplication', level: 'intermediate', requires: ['multiplication_basics'] },

  { id: 'multiplication_advanced', name: 'Vermenigvuldigen Gevorderd', icon: '✖️', color: 'bg-purple-700', xp: 125, category: 'multiplication', level: 'advanced', requires: ['multiplication_intermediate'] },

  { id: 'multiplication_tens', name: 'Tafels van 10', icon: '✖️', color: 'bg-purple-400', xp: 75, category: 'multiplication', level: 'special', requires: ['multiplication_basics'] },

  // DELEN
  { id: 'division_basics', name: 'Delen Basis', icon: '➗', color: 'bg-orange-500', xp: 75, category: 'division', level: 'basic', requires: [] },

  { id: 'division_intermediate', name: 'Delen Gemiddeld', icon: '➗', color: 'bg-orange-600', xp: 100, category: 'division', level: 'intermediate', requires: ['division_basics'] },

  { id: 'division_advanced', name: 'Delen Gevorderd', icon: '➗', color: 'bg-orange-700', xp: 125, category: 'division', level: 'advanced', requires: ['division_intermediate'] },

  // GEMENGD
  { id: 'mixed_operations', name: 'Gemengde Bewerkingen', icon: '🔀', color: 'bg-indigo-500', xp: 150, category: 'mixed', level: 'advanced', requires: ['addition_basics', 'subtraction_basics', 'multiplication_basics', 'division_basics'] },

];

// Helper functie om te bepalen of een les vergrendeld is
const isLessonLocked = (lesson, completedLessons) => {
  if (lesson.requires.length === 0) return false;
  return !lesson.requires.every(req => completedLessons.includes(req));
};

// Leveling systeem
const getLevelFromXP = (totalXP) => {
  const xpPerLevel = 100;
  return Math.floor(totalXP / xpPerLevel) + 1;
};

const getXPForNextLevel = (totalXP) => {
  const xpPerLevel = 100;
  const currentLevel = getLevelFromXP(totalXP);
  const nextLevelThreshold = currentLevel * xpPerLevel;
  return Math.max(0, nextLevelThreshold - totalXP);
};

const getLevelProgress = (totalXP) => {
  const xpPerLevel = 100;
  const currentLevel = getLevelFromXP(totalXP);
  const levelStartXP = (currentLevel - 1) * xpPerLevel;
  const levelEndXP = currentLevel * xpPerLevel;
  const levelXP = totalXP - levelStartXP;
  return Math.min(100, (levelXP / xpPerLevel) * 100);
};

// ========== GROWTH MINDSET HELPER FUNCTIES ==========

// Vraag naar mindset type bij eerste use
const getMindsetSetupMessage = () => {
  return "Wat vind je van rekenen?";
};

const getMindsetOptions = () => {
  return [
    { emoji: '😰', label: 'Ik ben er niet goed in', value: 'fixed' },
    { emoji: '😐', label: 'Het gaat wel', value: 'neutral' },
    { emoji: '😊', label: 'Ik vind het leuk', value: 'growth' },
  ];
};

// Motivatie berichten voor correct antwoord (proces-gefocust)
const getCorrectFeedbackMessages = () => {
  return [
    "Je hebt goed nagedacht! 🧠",
    "Wat een slimme strategie! ⭐",
    "Je gaf niet op! 💪",
    "Je hebt je best gedaan! 🎯",
    "Schitterend werk! ✨",
    "Je bent aan het leren! 📈",
    "Die aanpak werkte! 🔑",
  ];
};

// Motivatie berichten voor fout antwoord (fouten = leren)
const getIncorrectFeedbackMessages = () => {
  return [
    "Fouten maken = leren! Probeer het opnieuw! 🧠",
    "Je hersenen worden sterker van fouten! 💪",
    "Dat was een moeilijke, goed geprobeerd! 📚",
    "Bijna! Je bent op de goede weg! 🚀",
    "Elke poging helpt! Probeer het nog eens! ⭐",
    "Dit is hoe je groeit! 🌱",
  ];
};

// Motivatie popup na X fouten
const getMotivationPopup = (mistakesInARow) => {
  if (mistakesInARow === 3) {
    return {
      title: "Wist je dat? 🤓",
      message: "Einstein maakte duizenden fouten voordat hij slim werd! Jij bent op de goede weg! 💪",
      emoji: "🧠"
    };
  }
  if (mistakesInARow === 5) {
    return {
      title: "Goed bezig! 🌟",
      message: "Fouten maken is SUPER belangrijk voor leren! Je hersenen groeien nu! 📈",
      emoji: "🚀"
    };
  }
  return null;
};

// Motivatie na streak van correct antwoorden
const getStreakMessage = (streakLength) => {
  if (streakLength === 5) {
    return "Niet omdat je slim bent, maar omdat je OEFENT! Keep going! 🔥";
  }
  if (streakLength === 10) {
    return "WOW! 10 op rij! Dit is hoe je een expert wordt! 🏆";
  }
  return null;
};

// Motivatie na les voltooien
const getLessonCompletionMessage = (mistakesMade) => {
  if (mistakesMade === 0) {
    return "Perfect! Je hebt geen fouten gemaakt - en dat betekent dat je erg goed hebt geoefend! 🎉";
  }
  if (mistakesMade <= 2) {
    return `Je hebt ${mistakesMade} dingen geleerd vandaag! Dat is super! Morgen gaat het nog beter! 📈`;
  }
  return `Je hebt ${mistakesMade} dingen geleerd vandaag! Meer fouten = meer groei! Goed bezig! 💪`;
};

// Visuele feedback voor fouten
const getErrorAnimationEmoji = () => {
  return ["😣", "🤔", "💭"][Math.floor(Math.random() * 3)];
};

// Adaptief moeilijkheidsgraad systeem
const getDifficultySettings = (userLevel, lessonCorrectRate = 0.5) => {
  // lessonCorrectRate: 0.0 (alles fout) tot 1.0 (alles goed)
  
  if (userLevel <= 2) {
    // Zeer basis niveau
    return {
      level: 'very_easy',
      label: 'Zeer Makkelijk',
      maxNumber: 10,
      operations: ['+'],
      optionRange: 2, // afstand tussen opties
      minOptions: 4,
    };
  } else if (userLevel <= 4) {
    // Basis niveau
    return {
      level: 'easy',
      label: 'Makkelijk',
      maxNumber: 15,
      operations: ['+', '-'],
      optionRange: lessonCorrectRate > 0.7 ? 3 : 2,
      minOptions: 4,
    };
  } else if (userLevel <= 6) {
    // Intermediate
    return {
      level: 'medium',
      label: 'Gemiddeld',
      maxNumber: 20,
      operations: ['+', '-', '×'],
      optionRange: lessonCorrectRate > 0.7 ? 4 : 3,
      minOptions: 4,
    };
  } else if (userLevel <= 8) {
    // Advanced
    return {
      level: 'hard',
      label: 'Moeilijk',
      maxNumber: 50,
      operations: ['+', '-', '×', '÷'],
      optionRange: lessonCorrectRate > 0.7 ? 5 : 4,
      minOptions: 4,
    };
  } else {
    // Expert
    return {
      level: 'very_hard',
      label: 'Expert',
      maxNumber: 100,
      operations: ['+', '-', '×', '÷'],
      optionRange: lessonCorrectRate > 0.7 ? 6 : 5,
      minOptions: 4,
    };
  }
};

// Dynamische oefening generator
const generateAdaptiveExercise = (difficultySettings, seed = Math.random()) => {
  const { maxNumber, operations, optionRange, minOptions } = difficultySettings;
  
  const op = operations[Math.floor(seed * operations.length)];
  const n1 = Math.floor(Math.random() * maxNumber) + 1;
  const n2 = Math.floor(Math.random() * (maxNumber / 2)) + 1;

  let answer, question;
  
  if (op === '+') {
    answer = n1 + n2;
    question = `${n1} + ${n2}`;
  } else if (op === '-') {
    answer = Math.abs(n1 - n2);
    question = `${Math.max(n1, n2)} - ${Math.min(n1, n2)}`;
  } else if (op === '×') {
    answer = n1 * n2;
    question = `${n1} × ${n2}`;
  } else if (op === '÷') {
    // Zorg voor deling zonder rest
    const dividend = n1 * n2;
    answer = n1;
    question = `${dividend} ÷ ${n2}`;
  }

  // Genereer opties
  let options = new Set([answer]);
  while (options.size < minOptions) {
    let wrong = answer + (Math.floor(Math.random() * (optionRange * 2 + 1)) - optionRange);
    if (wrong > 0 && wrong !== answer) {
      options.add(wrong);
    }
  }

  return {
    question,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  };
};

// Adaptieve oefening sessie generator
const generateAdaptiveSession = (userLevel, correctRate = 0.5, sessionLength = 8) => {
  const difficultySettings = getDifficultySettings(userLevel, correctRate);
  const exercises = [];
  
  for (let i = 0; i < sessionLength; i++) {
    exercises.push(generateAdaptiveExercise(difficultySettings));
  }
  
  return { exercises, difficulty: difficultySettings };
};

// LEGO WINKEL ITEMS DATABASE
const SHOP_ITEMS = {
  avatar: [
    { id: 'red_cap', name: 'Rode Pet', icon: '🧢', price: 25, category: 'avatar', description: 'Klassieke rode Lego pet', badge: null },
    { id: 'blue_glasses', name: 'Blauwe Bril', icon: '😎', price: 30, category: 'avatar', description: 'Coole blauwe bril', badge: null },
    { id: 'green_cape', name: 'Groene Cape', icon: '🦸', price: 50, category: 'avatar', description: 'Superheld cape', badge: null },
    { id: 'gold_crown', name: 'Gouden Kroon', icon: '👑', price: 100, category: 'avatar', description: 'Premium gouden kroon', badge: 'Premium' },
    { id: 'robot_helmet', name: 'Robot Helm', icon: '🤖', price: 75, category: 'avatar', description: 'Futuristische helm', badge: 'Populair' },
  ],
  powerups: [
    { id: 'extra_life', name: 'Extra Leven', icon: '❤️', price: 20, category: 'powerups', description: '+1 leven in lessen', uses: 1, badge: null },
    { id: 'double_xp', name: '2x XP Boost', icon: '⚡', price: 40, category: 'powerups', description: 'Dubbel XP voor 1 les', uses: 1, badge: 'Bestseller' },
    { id: 'hint_token', name: 'Hint Token', icon: '💡', price: 30, category: 'powerups', description: '3 hints in lessen', uses: 3, badge: null },
    { id: 'time_bonus', name: 'Tijd Bonus', icon: '⏰', price: 25, category: 'powerups', description: '+10 seconden per vraag', uses: 1, badge: null },
  ],
  themes: [
    { id: 'space_theme', name: 'Ruimte Thema', icon: '🚀', price: 150, category: 'themes', description: 'Kosmisch avontuur', badge: 'Nieuw!' },
    { id: 'castle_theme', name: 'Kasteel Thema', icon: '🏰', price: 150, category: 'themes', description: 'Middeleeuws avontuur', badge: null },
    { id: 'underwater_theme', name: 'Onderzee Thema', icon: '🌊', price: 150, category: 'themes', description: 'Onderwater verkenning', badge: 'Populair' },
  ],
};



// Helper functies voor localStorage
const STORAGE_KEY = 'rekenbuddy_user_data';
const LAST_ACTIVE_KEY = 'rekenbuddy_last_active';

// Achievements systeem - GROWTH MINDSET FOKUS
const ACHIEVEMENTS = {
  // Originele achievements
  first_lesson: { id: 'first_lesson', name: 'Eerste Stap', icon: '🎯', description: 'Voltooi je eerste les!', xp: 25, type: 'progress' },
  perfect_score: { id: 'perfect_score', name: 'Perfect!', icon: '⭐', description: 'Behaal 100% in een les', xp: 50, type: 'progress' },
  streak_3: { id: 'streak_3', name: 'Op Vuur!', icon: '🔥', description: '3 dagen op rij oefenen', xp: 75, type: 'persistence' },
  streak_7: { id: 'streak_7', name: 'Onstuitbaar!', icon: '💪', description: '7 dagen op rij oefenen', xp: 150, type: 'persistence' },
  xp_100: { id: 'xp_100', name: 'XP Verzamelaar', icon: '🌟', description: 'Verdien 100 XP', xp: 50, type: 'progress' },
  xp_500: { id: 'xp_500', name: 'XP Meester', icon: '🏆', description: 'Verdien 500 XP', xp: 100, type: 'progress' },
  all_basics: { id: 'all_basics', name: 'Basis Expert', icon: '📚', description: 'Voltooi alle basis lessen', xp: 200, type: 'progress' },
  daily_goal: { id: 'daily_goal', name: 'Dagelijks Kampioen', icon: '🎖️', description: 'Bereik je dagelijkse doel', xp: 50, type: 'persistence' },
  combo_5: { id: 'combo_5', name: 'Combo Meester', icon: '⚡', description: '5 juiste antwoorden achter elkaar', xp: 75, type: 'progress' },
  speed_demon: { id: 'speed_demon', name: 'Speed Demon', icon: '💨', description: 'Beantwoord 3 vragen in 5 seconden', xp: 60, type: 'progress' },
  legend: { id: 'legend', name: 'Legende', icon: '👑', description: 'Bereik niveau 10', xp: 200, type: 'progress' },
  unstoppable: { id: 'unstoppable', name: 'Onveranderlijk', icon: '🚀', description: 'Win 10 lessen zonder fouten', xp: 150, type: 'progress' },
  
  // GROWTH MINDSET ACHIEVEMENTS
  volhouder: { id: 'volhouder', name: 'Volhouder', icon: '💪', description: 'Maak 10 fouten en ga door!', xp: 80, type: 'grit' },
  hersenen_groeier: { id: 'hersenen_groeier', name: 'Hersenen Groeier', icon: '🧠', description: 'Maak 50 fouten totaal (je groeit!)', xp: 150, type: 'grit' },
  probeerder: { id: 'probeerder', name: 'Probeerder', icon: '🔄', description: 'Probeer dezelfde som 3x totdat je het goed hebt', xp: 60, type: 'persistence' },
  comeback_king: { id: 'comeback_king', name: 'Comeback King', icon: '🔥', description: 'Van 3 fouten naar 5 correct op rij!', xp: 100, type: 'resilience' },
  leermeester: { id: 'leermeester', name: 'Leer Meester', icon: '📈', description: 'Verzamel 100 Leer Punten (fouten + correcties)', xp: 120, type: 'grit' },
};

const getDefaultUser = () => ({
  name: 'Leerling',
  xp: 0, // Totaal XP (blijft behouden)
  dailyXp: 0, // XP vandaag verdiend (reset dagelijks)
  hearts: 5,
  streak: 0,
  completedLessons: [],
  dailyGoal: 50,
  achievements: [], // Nieuwe achievements
  lastAchievementCheck: null, // Voor variable rewards
  level: 1, // Nieuw: Niveau systeem
  currentCombo: 0, // Nieuw: Combo counter
  perfectLessons: 0, // Nieuw: Aantal perfecte lessen
  totalQuestionsAnswered: 0, // Nieuw: Totaal beantwoorde vragen
  fastestTime: null, // Nieuw: Snelste tijd voor les
  coins: 0, // Nieuw: Munten in winkel (1 munt = €0.10 symbolisch)
  // Nieuwe inventory structuur
  inventory: {
    avatar: [],
    room: [],
    themes: []
  },
  // Equipped avatar parts
  equippedAvatar: {
    head: null,
    body: null,
    accessory: null
  },
  // Room layout placement
  roomLayout: [],
  activeItems: { avatar: null, theme: null }, // Backwards-compatible active items
  
  // GROWTH MINDSET SYSTEEM
  learnPoints: 0, // Leer Punten: +1 per fout, +2 per correctie na fout
  dailyLearnPoints: 0, // Leer Punten vandaag (reset dagelijks)
  totalMistakes: 0, // Totaal aantal fouten (voor achievements)
  mistakesSession: 0, // Fouten in huidige sessie (voor motivation popups)
  mistakesInARow: 0, // Fouten achter elkaar (voor comeback tracking)
  correctAfterMistakes: 0, // Correct antwoorden na fouten
  sameQuestionAttempts: {}, // Track pogingen per vraag
  mindsetType: null, // 'fixed' of 'growth' (set bij eerste use)
  lastMotivationPopup: null, // Timestamp van laatste popup
});

const loadUserData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      
      // Check of het vandaag is (voor daily goal reset)
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      const today = new Date().toDateString();
      
      if (lastActive !== today) {
        // Reset daily goal als het een nieuwe dag is
        // Verwijder daily_goal achievement zodat het opnieuw verdiend kan worden
        const achievements = (parsed.achievements || []).filter(a => a !== 'daily_goal');
        return {
          ...parsed,
          xp: parsed.xp || 0, // Totaal XP blijft behouden
          dailyXp: 0, // Reset dagelijkse XP
          hearts: 5, // Reset hearts naar 5
          achievements: achievements, // Reset daily_goal achievement
          // Streak wordt alleen verhoogd als de gebruiker vandaag actief is
        };
      }
      
      // Zorg ervoor dat dailyXp bestaat (voor oude data)
      if (parsed.dailyXp === undefined) {
        parsed.dailyXp = 0;
      }
      
      // Migrate old flat inventory (array) to new structured inventory if needed
      if (Array.isArray(parsed.inventory)) {
        const avatar = parsed.inventory.filter(id => id.startsWith('item_') && id.includes('avatar'));
        // best-effort: separate by known prefixes/categories
        const room = parsed.inventory.filter(id => id.startsWith('item_') && (id.includes('desk') || id.includes('chair') || id.includes('poster') || id.includes('lego') || id.includes('bed') || id.includes('teddy') || id.includes('rug') || id.includes('plant')));
        const themes = parsed.inventory.filter(id => id.startsWith('theme_'));

        parsed.inventory = {
          avatar: avatar || [],
          room: room || [],
          themes: themes || []
        };
      }

      // Ensure equippedAvatar exists
      if (!parsed.equippedAvatar) {
        parsed.equippedAvatar = { head: null, body: null, accessory: null };
      }

      // Ensure roomLayout exists
      if (!Array.isArray(parsed.roomLayout)) parsed.roomLayout = [];

      return parsed;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return getDefaultUser();
};

const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(LAST_ACTIVE_KEY, new Date().toDateString());
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

function AppProvider({ children }) {

  const [user, setUser] = useState(() => loadUserData());

  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('rekenbuddy_current_view');
      return saved || 'home';
    } catch {
      return 'home';
    }
  });

  const [currentLesson, setCurrentLesson] = useState(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null); // Nieuw: Game selector
  const [showAchievement, setShowAchievement] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(null); // Nieuw: Level-up notification

  // Sla user data op wanneer het verandert
  useEffect(() => {
    saveUserData(user);
  }, [user]);

  // Sla current view op wanneer het verandert
  useEffect(() => {
    try {
      localStorage.setItem('rekenbuddy_current_view', currentView);
    } catch (error) {
      console.error('Error saving current view:', error);
    }
  }, [currentView]);

  // Update streak wanneer de gebruiker terugkomt
  useEffect(() => {
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    const today = new Date().toDateString();
    
    if (lastActive !== today && lastActive) {
      // Check of het gisteren was (voor streak)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastActive === yesterdayString) {
        // Verhoog streak als gebruiker gisteren ook actief was
        setUser(prev => ({ ...prev, streak: prev.streak + 1 }));
      } else if (lastActive !== today) {
        // Reset streak als er een dag is overgeslagen
        setUser(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, []);

  const updateUser = (updates) => {

    setUser(prev => ({ ...prev, ...updates }));

  };

  const updateUserName = (newName) => {
    if (newName && newName.trim().length > 0) {
      setUser(prev => ({ ...prev, name: newName.trim() }));
      return true;
    }
    return false;
  };



  const startLesson = (lessonId) => {

    setCurrentLesson(lessonId);

    setCurrentView('lesson');

  };



  // Confetti functie voor variable rewards
  const triggerConfetti = (type = 'default') => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Check en unlock achievements
  const checkAchievements = (prevUser, updates, onNewAchievement) => {
    const newUser = { ...prevUser, ...updates };
    const newAchievements = [...(newUser.achievements || [])];
    const unlockedAchievements = []; // Track alle nieuwe achievements

    // First lesson achievement
    if (newUser.completedLessons.length === 1 && !newAchievements.includes('first_lesson')) {
      newAchievements.push('first_lesson');
      unlockedAchievements.push(ACHIEVEMENTS.first_lesson);
    }

    // Perfect score (checked in LessonView)
    
    // Streak achievements
    if (newUser.streak === 3 && !newAchievements.includes('streak_3')) {
      newAchievements.push('streak_3');
      unlockedAchievements.push(ACHIEVEMENTS.streak_3);
    }
    if (newUser.streak === 7 && !newAchievements.includes('streak_7')) {
      newAchievements.push('streak_7');
      unlockedAchievements.push(ACHIEVEMENTS.streak_7);
    }

    // XP achievements
    if (newUser.xp >= 100 && !newAchievements.includes('xp_100')) {
      newAchievements.push('xp_100');
      unlockedAchievements.push(ACHIEVEMENTS.xp_100);
    }
    if (newUser.xp >= 500 && !newAchievements.includes('xp_500')) {
      newAchievements.push('xp_500');
      unlockedAchievements.push(ACHIEVEMENTS.xp_500);
    }

    // All basics achievement
    const basicLessons = LESSONS.filter(l => l.level === 'basic');
    if (basicLessons.every(l => newUser.completedLessons.includes(l.id)) && 
        !newAchievements.includes('all_basics')) {
      newAchievements.push('all_basics');
      unlockedAchievements.push(ACHIEVEMENTS.all_basics);
    }

    // Daily goal achievement
    if (newUser.dailyXp >= newUser.dailyGoal && !newAchievements.includes('daily_goal')) {
      newAchievements.push('daily_goal');
      unlockedAchievements.push(ACHIEVEMENTS.daily_goal);
    }

    // Combo achievement
    if (newUser.currentCombo >= 5 && !newAchievements.includes('combo_5')) {
      newAchievements.push('combo_5');
      unlockedAchievements.push(ACHIEVEMENTS.combo_5);
    }

    // Legend achievement (niveau 10)
    if (getLevelFromXP(newUser.xp) >= 10 && !newAchievements.includes('legend')) {
      newAchievements.push('legend');
      unlockedAchievements.push(ACHIEVEMENTS.legend);
    }

    // Unstoppable achievement (10 perfecte lessen)
    if (newUser.perfectLessons >= 10 && !newAchievements.includes('unstoppable')) {
      newAchievements.push('unstoppable');
      unlockedAchievements.push(ACHIEVEMENTS.unstoppable);
    }

    // ======== GROWTH MINDSET ACHIEVEMENTS ========
    
    // Volhouder: 10 fouten gemaakt en doorgegaan
    if ((newUser.totalMistakes || 0) >= 10 && !newAchievements.includes('volhouder')) {
      newAchievements.push('volhouder');
      unlockedAchievements.push(ACHIEVEMENTS.volhouder);
    }

    // Hersenen Groeier: 50 fouten totaal
    if ((newUser.totalMistakes || 0) >= 50 && !newAchievements.includes('hersenen_groeier')) {
      newAchievements.push('hersenen_groeier');
      unlockedAchievements.push(ACHIEVEMENTS.hersenen_groeier);
    }

    // Leer Meester: 100 Leer Punten
    if ((newUser.learnPoints || 0) >= 100 && !newAchievements.includes('leermeester')) {
      newAchievements.push('leermeester');
      unlockedAchievements.push(ACHIEVEMENTS.leermeester);
    }

    // Bereken totale XP bonus voor alle nieuwe achievements
    const totalXpBonus = unlockedAchievements.reduce((sum, achievement) => sum + achievement.xp, 0);

    if (unlockedAchievements.length > 0) {
      // Variable reward: soms confetti, soms niet (70% kans)
      if (Math.random() > 0.3) {
        triggerConfetti();
      }
      
      // Show achievement notification voor de eerste achievement
      // (andere kunnen later getoond worden indien nodig)
      if (onNewAchievement && unlockedAchievements.length > 0) {
        setTimeout(() => {
          onNewAchievement(unlockedAchievements[0]);
          setTimeout(() => onNewAchievement(null), 4000);
        }, 500);
      }
      
      return {
        ...newUser,
        achievements: newAchievements,
        xp: newUser.xp + totalXpBonus, // Voeg XP toe voor alle achievements
        lastAchievementCheck: Date.now(),
      };
    }

    return { ...newUser, achievements: newAchievements };
  };

  const completeLesson = (xpEarned, perfectScore = false) => {

    setUser(prev => {
      const coinsEarned = Math.floor(xpEarned / 5); // 1 munt per 5 XP
      const updates = {
        xp: prev.xp + xpEarned, // Totaal XP
        dailyXp: (prev.dailyXp || 0) + xpEarned, // Dagelijkse XP
        coins: (prev.coins || 0) + coinsEarned, // Munten verdienen
        completedLessons: [...new Set([...prev.completedLessons, currentLesson])],
      };

      // Check perfect score achievement
      if (perfectScore && !prev.achievements?.includes('perfect_score')) {
        updates.achievements = [...(prev.achievements || []), 'perfect_score'];
        updates.xp = updates.xp + ACHIEVEMENTS.perfect_score.xp;
        triggerConfetti();
      }

      return checkAchievements(prev, updates, setShowAchievement);
    });

    // Toon optie voor mini-game na les (30% kans, of altijd bij perfect score)
    if (perfectScore || Math.random() > 0.7) {
      setShowMiniGame(true);
    } else {
      setCurrentView('home');
      setCurrentLesson(null);
    }

  };

  const startMiniGame = () => {
    // Selecteer random game
    const games = ['memory', 'speedmath', 'numberguess'];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setSelectedGame(randomGame);
    setShowMiniGame(true);
  };

  const finishMiniGame = (xpEarned = 0) => {
    if (xpEarned > 0) {
      setUser(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        dailyXp: (prev.dailyXp || 0) + xpEarned,
      }));
    }
    setShowMiniGame(false);
    setSelectedGame(null);
    setCurrentView('home');
    setCurrentLesson(null);
  };



  const loseHeart = () => {

    setUser(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));

  };

  const showLevelUpNotification = (level) => {
    setShowLevelUp(level);
    setTimeout(() => setShowLevelUp(null), 3000);
  };



  return (

    <AppContext.Provider value={{ 

      user, 

      updateUser, 

      currentView, 

      setCurrentView, 

      currentLesson,

      startLesson,

      completeLesson,

      loseHeart,

      triggerConfetti,

      showMiniGame,

      startMiniGame,

      finishMiniGame,

      updateUserName,

      showLevelUpNotification,

      selectedGame,

      setSelectedGame,

    }}>

      {children}
      
      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl border-4 border-white">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{showAchievement.icon}</div>
              <div>
                <div className="text-2xl font-bold mb-1">Achievement Unlocked!</div>
                <div className="text-lg">{showAchievement.name}</div>
                <div className="text-sm opacity-90">+{showAchievement.xp} XP</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level-Up Notification */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-fadeIn">
            <div className="bg-gradient-to-b from-purple-500 to-blue-600 text-white px-12 py-8 rounded-3xl shadow-2xl border-4 border-yellow-300 text-center">
              <div className="text-7xl mb-4">⭐</div>
              <div className="text-4xl font-black mb-2">LEVEL UP!</div>
              <div className="text-2xl font-bold mb-2">Niveau {showLevelUp}</div>
              <div className="text-lg opacity-90">Geweldig werk! 🎉</div>
            </div>
          </div>
        </div>
      )}

      {/* GROWTH MINDSET: Setup Modal bij eerste use */}
      {user.mindsetType === null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center animate-fadeIn">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">Hallo!</h2>
            <p className="text-lg text-gray-700 mb-8 font-semibold">{getMindsetSetupMessage()}</p>
            
            <div className="flex flex-col gap-3">
              {getMindsetOptions().map(option => (
                <button
                  key={option.value}
                  onClick={() => updateUser({ mindsetType: option.value })}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-gray-300 hover:bg-gray-100 hover:border-green-500 transition text-left"
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="flex-1 text-lg font-semibold text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
            
            {user.mindsetType && user.mindsetType === 'fixed' && (
              <p className="mt-6 text-green-600 font-bold">Dat betekent: je bent er NOG NIET goed in! Samen gaan we oefenen! 💪</p>
            )}
          </div>
        </div>
      )}

    </AppContext.Provider>

  );

}



function Header() {

  const { user } = useApp();

  

  return (

    <div className="bg-white border-b border-gray-200 px-4 py-3">

      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-6">

          <h1 className="text-2xl font-bold text-green-600">RekenDuo</h1>

          {/* Level Badge */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <span className="text-xl">⭐</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold opacity-90">Level</span>
              <span className="text-lg font-black">{getLevelFromXP(user.xp)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">

            <Flame className="w-5 h-5 text-orange-500" />

            <span className="font-bold text-orange-600">{user.streak}</span>

          </div>

          

          <div className="flex items-center gap-2">

            {[...Array(5)].map((_, i) => (

              <Heart 

                key={i} 

                className={`w-5 h-5 ${i < user.hearts ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}

              />

            ))}

          </div>

        </div>

        

        <div className="flex items-center gap-4">
          {/* Level Progress Bar */}
          <div className="hidden sm:flex flex-col gap-1 w-32">
            <div className="text-xs font-semibold text-gray-600">Naar Niveau {getLevelFromXP(user.xp) + 1}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-400 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${getLevelProgress(user.xp)}%` }}
              />
            </div>
          </div>
          
          {/* Coins Display */}
          <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full shadow-md">
            <span className="text-2xl">💰</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-amber-700">Munten</span>
              <span className="font-bold text-lg text-amber-800">{user.coins || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-full">

            <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />

            <span className="font-bold text-yellow-700">{user.xp} XP</span>

          </div>
        </div>

      </div>

    </div>

  );

}



function Navigation() {

  const { currentView, setCurrentView } = useApp();

  

  const navItems = [

    { id: 'home', icon: Home, label: 'Home' },

    { id: 'learn', icon: BookOpen, label: 'Leren' },

    { id: 'shop', icon: Sparkles, label: 'Winkel' },

    { id: 'profile', icon: User, label: 'Profiel' },

  ];

  

  return (

    <div className="bg-white border-t border-gray-200 px-4 py-2">

      <div className="max-w-6xl mx-auto flex justify-around">

        {navItems.map(item => (

          <button

            key={item.id}

            onClick={() => setCurrentView(item.id)}

            className={`flex flex-col items-center gap-1 px-8 py-3 rounded-xl transition min-h-[64px] min-w-[80px] ${

              currentView === item.id 

                ? 'text-green-600 bg-green-50 shadow-sm' 

                : 'text-gray-600 hover:bg-gray-50 active:scale-95'

            }`}

          >

            <item.icon className="w-7 h-7" />

            <span className="text-sm font-semibold">{item.label}</span>

          </button>

        ))}

      </div>

    </div>

  );

}

// Naam invoer component voor eerste gebruik
function NameInputView() {
  const { updateUserName } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Je naam moet minimaal 2 letters lang zijn!');
      return;
    }
    if (name.trim().length > 20) {
      setError('Je naam is te lang! Maximaal 20 letters.');
      return;
    }
    updateUserName(name.trim());
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welkom bij RekenDuo!</h2>
          <p className="text-gray-600">Laten we beginnen met je naam</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Wat is je naam?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Typ je naam hier..."
              className="w-full px-6 py-4 text-xl rounded-2xl border-4 border-gray-300 focus:border-green-500 focus:outline-none transition-all min-h-[64px]"
              autoFocus
              maxLength={20}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-5 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-green-700 transition-all min-h-[64px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95"
          >
            Start met Rekenen! 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

function HomeView() {

  const { user, startLesson, setCurrentView } = useApp();

  const dailyXp = user.dailyXp || 0;
  const progress = Math.min(100, (dailyXp / user.dailyGoal) * 100);

  // Dagelijkse challenges (gebaseerd op datum)
  const challenges = [
    { id: 1, name: 'Snelle Starter', description: 'Voltooi 1 les', progress: user.completedLessons.length, target: 1, icon: '⚡', xp: 25 },
    { id: 2, name: 'Combo Master', description: 'Behaal 5x combo', progress: Math.min(user.currentCombo || 0, 5), target: 5, icon: '🔥', xp: 50 },
    { id: 3, name: 'Perfect Streak', description: 'Win een perfecte les', progress: user.perfectLessons ? 1 : 0, target: 1, icon: '⭐', xp: 75 },
  ];

  // Haal eerste 3 oefeningen op voor "Snel Starten"
  const quickStartLessons = LESSONS.slice(0, 3).map(lesson => {
    const isCompleted = user.completedLessons.includes(lesson.id);
    const isLocked = lesson.id !== LESSONS[0].id && !user.completedLessons.includes(LESSONS[LESSONS.findIndex(l => l.id === lesson.id) - 1]?.id);
    return { ...lesson, isCompleted, isLocked };
  });

  return (

    <div className="flex-1 overflow-auto bg-gray-50 p-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {dailyXp === 0 
            ? `Hallo ${user.name}! Klaar om te leren en groeien? 🧠`
            : `Welkom terug, ${user.name}! Je bent aan het GROEIEN! 🌟`
          }
        </h2>

        {/* GROWTH MINDSET: Motivatie banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-md p-6 mb-6 border-2 border-purple-300">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🧠</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Weetje dat je hersenen groeien?</h3>
              <p className="mb-2">Elke poging, elke fout, elke oefening laat je slimmer worden!</p>
              <p className="text-sm opacity-90">Focus op LEREN, niet op WINNEN! 💪</p>
            </div>
          </div>
        </div>

        {/* SNEL STARTEN: Directe Les Cards */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            ⚡ Snel Starten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStartLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => {
                  startLesson(lesson.id);
                }}
                disabled={lesson.isLocked}
                className={`text-left p-4 rounded-xl border-2 transition transform active:scale-95 min-h-[140px] ${
                  lesson.isLocked
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                    : lesson.isCompleted
                    ? 'border-green-400 bg-green-50 hover:shadow-lg hover:border-green-600'
                    : 'border-blue-400 bg-blue-50 hover:shadow-lg hover:border-blue-600'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`${lesson.color} rounded-lg w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0`}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{lesson.name}</h4>
                    <p className="text-xs text-gray-600">{lesson.xp} XP</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {lesson.isCompleted ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Voltooid</span>
                    </>
                  ) : lesson.isLocked ? (
                    <>
                      <span className="text-gray-500">🔒 Vergrendeld</span>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600 font-semibold">▶️ Start nu!</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentView('learn')}
            className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 hover:bg-blue-50 rounded-lg transition"
          >
            Zie alle lessen →
          </button>
        </div>

        {/* Dagelijkse Challenges */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-md p-6 mb-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Vandaag's Challenges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenges.map((challenge) => {
              const completed = challenge.progress >= challenge.target;
              const progressPercent = Math.min(100, (challenge.progress / challenge.target) * 100);
              return (
                <div key={challenge.id} className={`bg-white rounded-xl p-4 border-2 transition ${completed ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-3xl mb-2">{challenge.icon}</div>
                      <h4 className="font-bold text-gray-800">{challenge.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{challenge.description}</p>
                    </div>
                    {completed && <span className="text-2xl">✅</span>}
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                    <div 
                      className={`h-full transition-all ${completed ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{challenge.progress} / {challenge.target}</span>
                    <span className={`font-bold ${completed ? 'text-green-600' : 'text-yellow-600'}`}>+{challenge.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <div className="flex items-center justify-between mb-3">

            <h3 className="text-lg font-semibold text-gray-700">Dagelijks Leer Doel</h3>

            <span className="text-sm font-medium text-gray-600">{dailyXp} / {user.dailyGoal} XP</span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm relative"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
              )}
            </div>
          </div>
          {progress >= 100 && (
            <div className="mt-2 text-center">
              <span className="text-green-600 font-bold text-sm flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                Dagelijks doel bereikt! Je groeide vandaag! 🎉
              </span>
            </div>
          )}

        </div>

        

        <div className="grid gap-4">

          <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl shadow-md p-6 text-white">

            <Trophy className="w-12 h-12 mb-3" />

            <h3 className="text-2xl font-bold mb-1">Oefenen = Groeien, {user.name}!</h3>

            <p className="text-green-50">
              {dailyXp === 0 
                ? `Begin vandaag met oefenen en kijk hoe je groeit! Elke poging telt! 🌱`
                : `Je oefent nu! Dat is wat je slim maakt. Nog ${Math.max(0, user.dailyGoal - dailyXp)} XP voor je groei-mijlpaal! 💪`
              }
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}



function LearnView() {

  const { startLesson, user } = useApp();

  

  return (

    <div className="flex-1 overflow-auto bg-gray-50 p-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Lessen</h2>

        

        <div className="space-y-4">

          {LESSONS.map((lesson, index) => {

            const isCompleted = user.completedLessons.includes(lesson.id);

            const isLocked = isLessonLocked(lesson, user.completedLessons);

            

            return (

              <div

                key={lesson.id}

                className={`bg-white rounded-2xl shadow-md overflow-hidden transition ${

                  isLocked ? 'opacity-50' : 'hover:shadow-lg'

                }`}

              >

                <div className="flex items-center p-6">

                  <div className={`${lesson.color} rounded-2xl w-16 h-16 flex items-center justify-center text-3xl mr-4`}>

                    {lesson.icon}

                  </div>

                  

                  <div className="flex-1">

                    <h3 className="text-xl font-bold text-gray-800 mb-1">{lesson.name}</h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600">

                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />

                      <span>{lesson.xp} XP</span>

                      {isCompleted && (

                        <>

                          <span className="mx-1">•</span>

                          <Check className="w-4 h-4 text-green-500" />

                          <span className="text-green-600 font-medium">Voltooid</span>

                        </>

                      )}

                    </div>

                  </div>

                  

                  <button

                    onClick={() => !isLocked && startLesson(lesson.id)}

                    disabled={isLocked}

                    className={`${lesson.color} text-white px-8 py-4 rounded-2xl font-bold text-lg transition min-h-[56px] min-w-[120px] ${

                      isLocked ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90 active:scale-95'

                    }`}

                  >

                    {isLocked ? '🔒 Vergrendeld' : isCompleted ? '🔄 Herhaal' : '▶️ Start'}

                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}



function LessonView() {

  const { currentLesson, completeLesson, loseHeart, user, setCurrentView, triggerConfetti, updateUser, showLevelUpNotification } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboBreak, setComboBreak] = useState(false);
  const [startTime] = useState(Date.now());
  const [adaptiveExercises, setAdaptiveExercises] = useState([]);
  const [difficultyLabel, setDifficultyLabel] = useState('');
  
  // GROWTH MINDSET STATE
  const [learnPoints, setLearnPoints] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [mistakesInARow, setMistakesInARow] = useState(0);
  const [correctAfterMistakes, setCorrectAfterMistakes] = useState(0);
  const [sameQuestionAttempts, setSameQuestionAttempts] = useState({});
  const [growthMindsetFeedback, setGrowthMindsetFeedback] = useState(null);
  const [streakMessage, setStreakMessage] = useState(null);
  const [motivationPopup, setMotivationPopup] = useState(null);

  // Random emoji voor gewone sommen
  const [mathEmoji] = useState(() => {
    const emojis = ['🧮', '🔢', '➕', '➖', '✖️', '➗', '🎯', '🎲', '💡', '🌟'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  });

  // State voor hint tonen
  const [showHint, setShowHint] = useState(false);

  // Category color function
  const getCategoryColor = (category) => {
    if (!category) return 'from-blue-100 to-blue-200';
    
    const colors = {
      eten: 'from-orange-100 to-red-100',
      spelen: 'from-purple-100 to-pink-100',
      dieren: 'from-green-100 to-emerald-100',
      sport: 'from-blue-100 to-cyan-100',
      school: 'from-indigo-100 to-purple-100',
      geld: 'from-yellow-100 to-orange-100',
      feest: 'from-pink-100 to-rose-100',
      natuur: 'from-lime-100 to-green-100'
    };
    return colors[category] || 'from-blue-100 to-purple-100';
  };

  // Tekst-naar-spraak voor verhalen
  const speakStory = () => {
    if ('speechSynthesis' in window && exercise.story) {
      // Stop eventuele eerdere spraak
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(exercise.story);
      utterance.lang = 'nl-NL';
      utterance.rate = 0.85; // Langzaam voor kinderen
      utterance.pitch = 1.1; // Iets hoger voor vriendelijkheid
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const lesson = LESSONS.find(l => l.id === currentLesson);
  
  // Genereer adaptieve oefeningen bij mount
  useEffect(() => {
    const userLevel = getLevelFromXP(user.xp);
    const { exercises, difficulty } = generateAdaptiveSession(userLevel, 0.5, 8);
    setAdaptiveExercises(exercises);
    setDifficultyLabel(difficulty.label);
  }, [currentLesson, user.xp]);

  const exercises = adaptiveExercises.length > 0 ? adaptiveExercises : EXERCISES[currentLesson] || [];

  const exercise = exercises[currentQuestion];

  // STORY PROBLEM DETECTION & VISUALIZATION
  // Detecteer of huidige oefening een verhaal heeft
  const hasStory = exercise?.story && exercise.story.length > 0;

  

  // Shuffle opties wanneer de vraag verandert
  useEffect(() => {
    if (exercise && exercise.options) {
      // Maak een kopie van de opties en shuffle ze
      const optionsCopy = [...exercise.options];
      // Fisher-Yates shuffle algoritme
      for (let i = optionsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
      }
      setShuffledOptions(optionsCopy);
    }
  }, [currentQuestion, exercise]);

  

  if (!exercise) return null;



  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === exercise.answer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    // GROWTH MINDSET: Track pogingen per vraag voor "Probeerder" achievement
    const questionKey = exercise.question;
    const previousAttempts = sameQuestionAttempts[questionKey] || 0;
    setSameQuestionAttempts(prev => ({
      ...prev,
      [questionKey]: previousAttempts + 1,
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
      
      // Combo verhoging
      setCombo(prev => prev + 1);
      setComboBreak(false);
      
      // GROWTH MINDSET: Leer Punten toevoegen (+2 als fout werd hersteld, +1 normaal)
      const learnPointsGain = mistakesInARow > 0 ? 2 : 1;
      setLearnPoints(prev => prev + learnPointsGain);
      
      // Reset mistakes in a row
      if (mistakesInARow > 0) {
        setMistakesInARow(0);
        setCorrectAfterMistakes(prev => prev + 1); // Track comebacks
      }
      
      // GROWTH MINDSET: Process praise feedback
      const feedbackMessage = getCorrectFeedbackMessages()[Math.floor(Math.random() * getCorrectFeedbackMessages().length)];
      setGrowthMindsetFeedback(feedbackMessage);
      
      // Variable reward: 30% kans op confetti bij correct antwoord
      if (Math.random() > 0.7) {
        triggerConfetti();
      }
      
      // Combo milestone effects (5, 10, 15+ combos)
      if ((combo + 1) % 5 === 0) {
        setTimeout(() => {
          triggerConfetti('combo');
          const streakMsg = getStreakMessage(combo + 1);
          if (streakMsg) setStreakMessage(streakMsg);
        }, 500);
      }

    } else {
      loseHeart();
      setCombo(0); // Combo reset bij fout
      setComboBreak(true); // Visueel feedback
      
      // GROWTH MINDSET: Track fouten
      setTotalMistakes(prev => prev + 1);
      setMistakesInARow(prev => prev + 1);
      setLearnPoints(prev => prev + 1); // +1 Leer Punt voor elke fout
      
      // GROWTH MINDSET: Error praise feedback
      const feedbackMessage = getIncorrectFeedbackMessages()[Math.floor(Math.random() * getIncorrectFeedbackMessages().length)];
      setGrowthMindsetFeedback(feedbackMessage);
      
      // GROWTH MINDSET: Motivatie popup na 3-5 fouten achter elkaar
      if (mistakesInARow === 2 || mistakesInARow === 4) {
        const popup = getMotivationPopup(mistakesInARow + 1);
        if (popup) {
          setMotivationPopup(popup);
          setTimeout(() => setMotivationPopup(null), 4000);
        }
      }
    }
  };



  const handleNext = () => {
    // Stop spraak als die nog bezig is
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (currentQuestion < exercises.length - 1) {

      setCurrentQuestion(prev => prev + 1);

      setSelectedAnswer(null);

      setFeedback(null);
      setShowHint(false);

    } else {

      const xpEarned = Math.round((score / exercises.length) * lesson.xp);
      const perfectScore = score === exercises.length;
      const lessonTime = (Date.now() - startTime) / 1000; // in seconden

      // Bonus XP voor combos
      const comboBonus = Math.floor(combo / 5) * 10; // 10 XP per 5 combo
      const totalXpEarned = xpEarned + comboBonus;

      // Update user statistics
      const oldLevel = getLevelFromXP(user.xp);
      const newLevel = getLevelFromXP(user.xp + totalXpEarned);
      const leveledUp = newLevel > oldLevel;

      // Update statistics with GROWTH MINDSET data
      updateUser({
        currentCombo: Math.max(user.currentCombo || 0, combo),
        perfectLessons: perfectScore ? (user.perfectLessons || 0) + 1 : user.perfectLessons || 0,
        totalQuestionsAnswered: (user.totalQuestionsAnswered || 0) + exercises.length,
        // GROWTH MINDSET tracking
        learnPoints: (user.learnPoints || 0) + learnPoints,
        dailyLearnPoints: (user.dailyLearnPoints || 0) + learnPoints,
        totalMistakes: (user.totalMistakes || 0) + totalMistakes,
        mistakesSession: totalMistakes, // Voor completion message
      });

      // Confetti bij perfect score
      if (perfectScore) {
        triggerConfetti();
      }

      // Level-up effect
      if (leveledUp) {
        setTimeout(() => {
          triggerConfetti('levelup');
          showLevelUpNotification(newLevel);
        }, 800);
      }

      completeLesson(totalXpEarned, perfectScore);

    }

  };



  const handleQuit = () => {

    setCurrentView('learn');

  };



  if (user.hearts === 0) {

    return (

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">

          <div className="text-6xl mb-4">😴</div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">Rust even uit, dan ben je sterker!</h2>

          <p className="text-gray-600 mb-6">Je hebt hard gewerkt! Je levens worden automatisch aangevuld. Kom straks terug om verder te gaan! 🚀</p>

          <button

            onClick={handleQuit}

            className="bg-green-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-green-600 min-h-[56px] min-w-[180px] transition active:scale-95"

          >

            ← Terug naar lessen

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="flex-1 flex flex-col bg-gray-50">

      <div className="bg-white border-b-4 border-blue-200 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuit}
              className="text-gray-600 hover:text-gray-800 font-black text-lg bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition"
            >
              ← Stop
            </button>
            
            {/* Type indicator */}
            <span className={`px-3 py-1 rounded-full text-sm font-bold hidden sm:inline ${
              hasStory 
                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
            }`}>
              {hasStory ? '📖 Verhaal' : '🧮 Som'}
            </span>
          </div>
          
          <div className="flex-1 mx-4 sm:mx-8 bg-gray-200 rounded-full h-4 sm:h-5 overflow-hidden border-2 border-gray-300 shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full transition-all duration-300 relative"
              style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
            >
              <Sparkles className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white animate-pulse" />
            </div>
          </div>
          
          <span className="text-base sm:text-xl font-black text-gray-700 bg-gray-100 px-3 sm:px-4 py-2 rounded-xl">
            {currentQuestion + 1} / {exercises.length}
          </span>

          <div className="flex items-center gap-4 min-w-[200px] justify-end">
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{score}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            {/* GROWTH MINDSET: Toon Leer Punten */}
            <div className="text-right bg-purple-100 px-2 py-1 rounded-lg">
              <div className="text-lg font-bold text-purple-700">🧠 {learnPoints}</div>
              <div className="text-xs text-gray-500">Leer</div>
            </div>
            {combo > 0 && (
              <div className={`text-right px-2 py-1 rounded-lg transition ${comboBreak ? 'bg-red-100' : combo >= 5 ? 'bg-yellow-100 animate-pulse' : 'bg-orange-100'}`}>
                <div className={`text-lg font-black ${comboBreak ? 'text-red-600' : combo >= 5 ? 'text-yellow-600' : 'text-orange-600'}`}>
                  {combo}🔥
                </div>
                <div className="text-xs text-gray-500">Combo</div>
              </div>
            )}
          </div>
        </div>
      </div>

      

      <div className="flex-1 flex flex-col justify-center p-4 overflow-hidden">

        <div className="max-w-2xl w-full mx-auto flex flex-col justify-center h-full">

          {/* VERHAAL WEERGAVE of NORMALE VRAAG */}
          <div className={`rounded-3xl shadow-2xl p-8 mb-6 border-4 transition-all ${
            hasStory 
              ? `bg-gradient-to-br ${getCategoryColor(exercise.category)} border-yellow-400` 
              : 'bg-white border-blue-200'
          }`}>
            {hasStory ? (
              // VERHAAL MODUS
              <div className="text-center">
                <div className="text-8xl mb-4 animate-fadeIn">
                  {exercise.visual}
                </div>
                
                <p className="text-xl md:text-2xl font-bold text-gray-800 mb-4 leading-relaxed max-w-2xl mx-auto px-2">
                  {exercise.story}
                </p>
                
                <div className="text-base text-gray-600 font-mono">
                  ({exercise.question})
                </div>

                {hasStory && (
                  <button
                    onClick={speakStory}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-105"
                    title="Lees verhaal voor"
                  >
                    🔊 Lees voor
                  </button>
                )}
              </div>
            ) : (
              // GEWONE SOM MODUS
              <div className="text-center">
                <div className="text-8xl mb-4 animate-fadeIn">
                  {mathEmoji}
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-800">
                  Wat is {exercise.question}?
                </h2>
              </div>
            )}
          </div>

          

          {/* Hint knop - alleen bij verhalen */}
          {hasStory && exercise.hint && !feedback && (
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-2xl font-bold transition-all shadow-lg hover:scale-105"
              >
                💡 {showHint ? 'Verberg hint' : 'Hint nodig?'}
              </button>
              
              {showHint && (
                <div className="mt-4 p-4 bg-yellow-50 border-4 border-yellow-300 rounded-2xl max-w-xl mx-auto animate-fadeIn">
                  <p className="text-lg font-bold text-yellow-900">
                    💡 {exercise.hint}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">

            {(shuffledOptions.length > 0 ? shuffledOptions : exercise.options).map((option, index) => (

              <button

                key={index}

                onClick={() => !feedback && handleAnswer(option)}

                disabled={feedback !== null}

                className={`min-h-[100px] p-6 rounded-2xl text-2xl font-bold transition-all border-4 active:scale-95 ${

                  feedback === null

                    ? 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 hover:shadow-lg'

                    : selectedAnswer === option

                    ? feedback === 'correct'

                      ? 'bg-green-200 border-green-600 text-green-800 shadow-lg scale-105'

                      : 'bg-yellow-100 border-yellow-400 text-yellow-700'

                    : option === exercise.answer

                    ? 'bg-green-200 border-green-600 text-green-800 shadow-lg'

                    : 'bg-white border-gray-200 opacity-40'

                }`}

              >

                {option}

              </button>

            ))}

          </div>

          {/* HINT KNOP - alleen zichtbaar als er een hint is en geen antwoord is gegeven */}
          {exercise.hint && !feedback && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => alert(`💡 Hint: ${exercise.hint}`)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-xl font-semibold transition border-2 border-blue-300 min-h-[48px]"
              >
                💡 Hint nodig?
              </button>
            </div>
          )}

          {feedback && (

            <div className="mt-4 flex justify-center">

              <button

                onClick={handleNext}

                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-green-700 transition-all min-h-[56px] min-w-[180px] shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"

              >

                {currentQuestion < exercises.length - 1 ? 'Volgende' : '🎉 Voltooien!'}

                <ChevronRight className="w-6 h-6" />

              </button>

            </div>

          )}

        </div>

      </div>

      
      {feedback && (
        <div className={`${
          feedback === 'correct' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-400 to-orange-500'
        } text-white px-6 py-3 text-center font-bold text-lg shadow-lg flex-shrink-0`}>
          {feedback === 'correct' ? (
            <div className="flex items-center justify-center gap-3">
              <Check className="w-8 h-8" />
              <span>{growthMindsetFeedback || `Fantastisch, ${user.name}! Je hebt het goed! 🎉`}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8" />
              <span>{growthMindsetFeedback || `Bijna! Het juiste antwoord is ${exercise.answer}. Probeer het opnieuw! 💪`}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Motivation Popup - Positioned above questions */}
      {motivationPopup && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
          <div className="bg-white rounded-3xl shadow-2xl p-6 text-center animate-fadeIn border-4 border-yellow-400">
            <div className="text-5xl mb-3">{motivationPopup.emoji}</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">{motivationPopup.title}</h3>
            <p className="text-base text-gray-700 leading-relaxed">{motivationPopup.message}</p>
            <div className="mt-4 text-xs text-gray-600">
              Je leert op dit moment! 🚀
            </div>
          </div>
        </div>
      )}
      
      {/* Streak Message */}
      {streakMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-fadeIn pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-lg border-4 border-white text-center">
            <p className="text-lg font-bold">{streakMessage}</p>
          </div>
        </div>
      )}

    </div>

  );

}



function ProfileView() {

  const { user, updateUserName } = useApp();

  

  return (

    <div className="flex-1 overflow-auto bg-gray-50 p-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Profiel</h2>

        

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <div className="flex items-center gap-4 mb-6">

            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl">

              👤

            </div>

            <div className="flex-1">

              <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>

              <p className="text-gray-600">Reken kampioen in training!</p>

            </div>
            
            <button
              onClick={() => {
                const newName = prompt(`Wat is je naam, ${user.name}?`, user.name);
                if (newName && newName.trim().length >= 2 && newName.trim().length <= 20) {
                  updateUserName(newName.trim());
                } else if (newName) {
                  alert('Je naam moet tussen de 2 en 20 letters lang zijn!');
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition min-h-[48px]"
              title="Naam wijzigen"
            >
              ✏️ Wijzig
            </button>

          </div>

          

          <div className="grid grid-cols-3 gap-4 mb-4">

            <div className="text-center p-4 bg-yellow-50 rounded-xl">

              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 mx-auto mb-2" />

              <div className="text-2xl font-bold text-gray-800">{user.xp}</div>

              <div className="text-sm text-gray-600">Totaal XP</div>

            </div>

            

            <div className="text-center p-4 bg-orange-50 rounded-xl">

              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />

              <div className="text-2xl font-bold text-gray-800">{user.streak}</div>

              <div className="text-sm text-gray-600">Dag Streak</div>

            </div>

            

            <div className="text-center p-4 bg-green-50 rounded-xl">

              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />

              <div className="text-2xl font-bold text-gray-800">{user.completedLessons.length}</div>

              <div className="text-sm text-gray-600">Voltooid</div>

            </div>

          </div>

          {/* Gamification Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-1">
                {getLevelFromXP(user.xp)}
              </div>
              <div className="text-xs font-semibold text-gray-600">Huidiging Niveau</div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-blue-500 h-full transition-all duration-500"
                  style={{ width: `${getLevelProgress(user.xp)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{getXPForNextLevel(user.xp)} XP te gaan</div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-4 border-2 border-pink-200">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600 mb-1">
                {user.perfectLessons || 0}
              </div>
              <div className="text-xs font-semibold text-gray-600">Perfect Lessen</div>
              <div className="mt-3 text-2xl">⭐</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600 mb-1">
                {user.currentCombo || 0}
              </div>
              <div className="text-xs font-semibold text-gray-600">Beste Combo</div>
              <div className="mt-3 text-2xl">🔥</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-1">
                {user.totalQuestionsAnswered || 0}
              </div>
              <div className="text-xs font-semibold text-gray-600">Vragen Beantwoord</div>
              <div className="mt-3 text-2xl">📊</div>
            </div>

            {/* GROWTH MINDSET: Leer Punten Statistieken */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                {user.learnPoints || 0}
              </div>
              <div className="text-xs font-semibold text-gray-600">Totaal Leer Punten</div>
              <div className="mt-3 text-2xl">🧠</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-1">
                {user.totalMistakes || 0}
              </div>
              <div className="text-xs font-semibold text-gray-600">Fouten (= Groei!)</div>
              <div className="mt-3 text-2xl">📈</div>
            </div>
          </div>

          {/* GROWTH MINDSET: Motivatie Card */}
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-6 mb-6">
            <h3 className="text-2xl font-black mb-3">💪 Groei Mindset Tips</h3>
            <ul className="space-y-2 text-sm font-semibold">
              <li>✅ Fouten = kansen om te leren</li>
              <li>✅ Je hersenen groeien van oefenen</li>
              <li>✅ Moeilijk = interessant moment!</li>
              <li>✅ Je TKN je best, dat is het belangrijkst</li>
            </ul>
          </div>

        </div>

        

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            Behaalde Achievements
          </h3>

          {user.achievements && user.achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.achievements.map(achievementId => {
                const achievement = ACHIEVEMENTS[achievementId];
                if (!achievement) return null;
                return (
                  <div
                    key={achievementId}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200 shadow-sm"
                  >
                    <div className="text-4xl mb-2 text-center">{achievement.icon}</div>
                    <div className="font-bold text-gray-800 text-center mb-1">{achievement.name}</div>
                    <div className="text-xs text-gray-600 text-center">{achievement.description}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-3">🏆</div>
              <p className="font-medium">Begin met lessen om achievements te verdienen!</p>
              <p className="text-sm mt-2">Elke achievement geeft je extra XP!</p>
            </div>
          )}

          {/* Show locked achievements */}
          {Object.keys(ACHIEVEMENTS).length > (user.achievements?.length || 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">Nog te behalen:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(ACHIEVEMENTS)
                  .filter(a => !user.achievements?.includes(a.id))
                  .map(achievement => (
                    <div
                      key={achievement.id}
                      className="bg-gray-100 rounded-lg p-3 border border-gray-200 opacity-60"
                    >
                      <div className="text-3xl mb-1 text-center filter grayscale">{achievement.icon}</div>
                      <div className="font-semibold text-gray-600 text-center text-sm">{achievement.name}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>

  );

}



export default function App() {

  return (

    <AppProvider>

      <div className="h-screen flex flex-col">

        <Header />

        {/* Example: lazy-load ProfileView so heavy profile UI doesn't load immediately */}
        <Suspense fallback={<LoadingSpinner />}>
          <LazyProfileView />
        </Suspense>

        <Main />

        <Navigation />

      </div>

    </AppProvider>

  );

}



// Speed Math Game Component
function SpeedMathGame() {
  const { finishMiniGame, triggerConfetti } = useApp();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isStarted && !gameOver) {
      generateProblem();
    }
  }, [isStarted]);

  useEffect(() => {
    if (isStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isStarted, timeLeft, gameOver]);

  const generateProblem = () => {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    const n1 = Math.floor(Math.random() * 12) + 1;
    const n2 = Math.floor(Math.random() * 12) + 1;

    let answer;
    if (op === '+') answer = n1 + n2;
    else if (op === '-') answer = Math.abs(n1 - n2);
    else answer = n1 * n2;

    setCurrentProblem({ n1, n2, op, answer });
    setInputValue('');
    setFeedback('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProblem) return;

    const userAnswer = parseInt(inputValue);
    if (userAnswer === currentProblem.answer) {
      setScore(prev => prev + 10);
      setFeedback('✅ Heel goed! Je gaat snel!');
      triggerConfetti();
      setTimeout(generateProblem, 500);
    } else {
      setFeedback(`Bijna! Het antwoord was ${currentProblem.answer}. Volgende!`);
      setTimeout(generateProblem, 1500);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setTimeLeft(30);
    setScore(0);
    setGameOver(false);
    setInputValue('');
  };

  const handleFinishGame = () => {
    const xpEarned = Math.floor(score / 2);
    finishMiniGame(xpEarned);
  };

  if (!isStarted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Speed Math!</h2>
          <p className="text-gray-600 mb-6">
            Los zoveel mogelijk sommen op in 30 seconden!<br />
            Elke correct antwoord geeft je 10 punten. 🎯<br />
            <span className="text-sm opacity-75">Fouten? Geen probleem - volgende!</span>
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all min-h-[64px] min-w-[200px] shadow-lg active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Spel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50 p-6 overflow-auto">
      <div className="max-w-md mx-auto w-full h-full flex flex-col justify-center">
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Goed bezig!</h2>
              <p className="text-gray-600 mb-4">Je hebt {Math.floor(score / 10)} vragen correct beantwoord!</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">Score: {score} punten</p>
              <p className="text-sm text-gray-600 mb-6">Je hebt geoefend! Dat is wat telt! 💪</p>
              <button
                onClick={handleFinishGame}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-blue-600 hover:to-cyan-600 transition-all min-h-[56px] min-w-[180px] shadow-lg active:scale-95"
              >
                Verder gaan
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{timeLeft}s</span>
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-600 fill-green-600" />
                <span className="text-2xl font-bold text-green-600">{score}</span>
              </div>
            </div>
          </div>

          {currentProblem && (
            <div>
              <div className="text-center mb-6">
                <p className="text-5xl font-black text-gray-800">
                  {currentProblem.n1} {currentProblem.op} {currentProblem.n2}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Antwoord..."
                  className="flex-1 px-4 py-3 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                >
                  ✓
                </button>
              </form>

              {feedback && (
                <div className={`text-center text-lg font-bold py-2 rounded-lg ${feedback.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Number Guess Game Component
function NumberGuessGame() {
  const { finishMiniGame, triggerConfetti } = useApp();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [secretNumber, setSecretNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (isStarted && !gameOver) {
      generateNewNumber();
    }
  }, [isStarted]);

  useEffect(() => {
    if (isStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isStarted, timeLeft, gameOver]);

  const generateNewNumber = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts(0);
    setHint('');
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!secretNumber) return;

    const userGuess = parseInt(guess);
    setAttempts(prev => prev + 1);

    if (userGuess === secretNumber) {
      const points = Math.max(50 - attempts * 5, 10);
      setScore(prev => prev + points);
      triggerConfetti();
      setHint(`✅ Heel slim! Je raadde het in ${attempts + 1} pogingen!`);
      setGuess('');
      setTimeout(generateNewNumber, 2000);
    } else if (userGuess < secretNumber) {
      setHint('📈 Het getal is hoger! Goed bezig!');
    } else {
      setHint('📉 Het getal is lager! Je bent dicht! 💪');
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setTimeLeft(45);
    setScore(0);
    setGameOver(false);
  };

  const handleFinishGame = () => {
    const xpEarned = Math.floor(score / 2);
    finishMiniGame(xpEarned);
  };

  if (!isStarted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎲</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Getal Raden!</h2>
          <p className="text-gray-600 mb-6">
            Raad het geheime getal tussen 1 en 100!<br />
            Hoe minder pogingen, hoe meer punten. 🎯<br />
            <span className="text-sm opacity-75">Foute gok? Je leert ervan! 🧠</span>
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all min-h-[64px] min-w-[200px] shadow-lg active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Spel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-green-50 to-emerald-50 p-6 overflow-auto">
      <div className="max-w-md mx-auto w-full h-full flex flex-col justify-center">
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
              <div className="text-6xl mb-4">⏱️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Pauze time!</h2>
              <p className="text-gray-600 mb-4">Je hebt {Math.floor(score / 10)} getallen geraden!</p>
              <p className="text-2xl font-bold text-green-600 mb-2">Score: {score} punten</p>
              <p className="text-sm text-gray-600 mb-6">Je hebt geoefend! Dat telt! 💪</p>
              <button
                onClick={handleFinishGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all min-h-[56px] min-w-[180px] shadow-lg active:scale-95"
              >
                Verder gaan
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{timeLeft}s</span>
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-600 fill-green-600" />
                <span className="text-2xl font-bold text-green-600">{score}</span>
              </div>
            </div>
          </div>

          {secretNumber && (
            <div>
              <div className="text-center mb-6">
                <p className="text-gray-600 font-semibold mb-2">Raad het getal (1-100)</p>
                <p className="text-4xl font-black text-gray-400">🎲</p>
              </div>

              <form onSubmit={handleGuess} className="flex gap-2 mb-4">
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Je getal..."
                  min="1"
                  max="100"
                  className="flex-1 px-4 py-3 text-xl border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                >
                  ✓
                </button>
              </form>

              {hint && (
                <div className={`text-center text-lg font-bold py-3 rounded-lg ${hint.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {hint}
                </div>
              )}

              {attempts > 0 && (
                <div className="text-center text-sm text-gray-600 mt-4">
                  Pogingen: {attempts}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Memory Game Component
function MemoryGame() {
  const { finishMiniGame, triggerConfetti } = useApp();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Genereer getallenparen voor memory
  useEffect(() => {
    if (isStarted && cards.length === 0) {
      const numbers = [];
      // Genereer 8 unieke getallen (1-20)
      while (numbers.length < 8) {
        const num = Math.floor(Math.random() * 20) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      // Maak paren (16 kaarten totaal)
      const pairs = [...numbers, ...numbers];
      // Shuffle
      const shuffled = pairs.sort(() => Math.random() - 0.5);
      setCards(shuffled.map((num, index) => ({ id: index, value: num, flipped: false })));
    }
  }, [isStarted, cards.length]);

  // Timer countdown
  useEffect(() => {
    if (isStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isStarted, timeLeft, gameOver]);

  // Check voor matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first]?.value === cards[second]?.value) {
        // Match gevonden!
        setMatchedPairs(prev => {
          const newPairs = [...prev, cards[first].value];
          // Check of alle paren gevonden zijn
          if (newPairs.length === 8) {
            setTimeout(() => {
              setGameOver(true);
            }, 500);
          }
          return newPairs;
        });
        setScore(prev => prev + 10);
        setFlippedCards([]);
      } else {
        // Geen match, flip terug na 1 seconde
        setTimeout(() => {
          setFlippedCards([]);
          setCards(prev => prev.map(card => ({ ...card, flipped: false })));
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const handleCardClick = (index) => {
    if (gameOver || flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(cards[index]?.value)) {
      return;
    }

    setFlippedCards(prev => [...prev, index]);
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, flipped: true } : card
    ));
  };

  const handleStart = () => {
    setIsStarted(true);
    setTimeLeft(30);
    setScore(0);
    setMatchedPairs([]);
    setFlippedCards([]);
    setGameOver(false);
    setCards([]);
  };

  const handleFinish = () => {
    const xpEarned = Math.floor(score / 2); // 1 XP per 2 punten
    if (matchedPairs.length === 8) {
      triggerConfetti();
    }
    finishMiniGame(xpEarned);
  };

  if (!isStarted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Memory Spel!</h2>
          <p className="text-gray-600 mb-6">
            Vind alle getallenparen in 30 seconden!<br />
            Elke match geeft je 10 punten. 🎯<br />
            <span className="text-sm opacity-75">Vergis je? Je traint je geheugen! 🧠</span>
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all min-h-[64px] min-w-[200px] shadow-lg active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            Start Spel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 p-3 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        {/* Header met timer en score */}
        <div className="bg-white rounded-xl shadow-lg p-3 mb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-lg font-bold text-red-600">{timeLeft}s</span>
                </div>
              </div>
              <div className="bg-green-100 px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-green-600 fill-green-600" />
                  <span className="text-lg font-bold text-green-600">{score}</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-600">
              {matchedPairs.length} / 8 paren
            </div>
          </div>
        </div>

        {/* Game over screen */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
              <div className="text-6xl mb-4">
                {matchedPairs.length === 8 ? '🎉' : '⏰'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {matchedPairs.length === 8 ? 'Geweldig!' : 'Tijd is op!'}
              </h2>
              <p className="text-gray-600 mb-4">
                Je hebt {matchedPairs.length} van 8 paren gevonden!
              </p>
              <p className="text-2xl font-bold text-green-600 mb-6">
                Score: {score} punten
              </p>
              <button
                onClick={handleFinish}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-green-600 hover:to-green-700 transition-all min-h-[56px] min-w-[180px] shadow-lg active:scale-95"
              >
                Verder gaan
              </button>
            </div>
          </div>
        )}

        {/* Memory grid */}
        <div className="grid grid-cols-4 gap-2 flex-1 overflow-hidden" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.value);
            const isClickable = !gameOver && flippedCards.length < 2 && !isFlipped;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={!isClickable}
                className={`rounded-xl text-2xl font-bold transition-all h-[70px] w-full ${
                  isFlipped
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                } ${isClickable ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}`}
              >
                {isFlipped ? card.value : '?'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Main() {

  const { currentView, currentLesson, showMiniGame, user, selectedGame, setSelectedGame } = useApp();

  

  // Toon naam invoer alleen bij eerste gebruik op home view
  // Als gebruiker al bezig is, laat de app normaal werken
  const shouldShowNameInput = user.name === 'Leerling' && 
                               currentView === 'home' && 
                               !currentLesson && 
                               !showMiniGame &&
                               user.xp === 0 && 
                               user.completedLessons.length === 0;
  
  if (shouldShowNameInput) {
    return <NameInputView />;
  }

  // Game selector scherm
  if (showMiniGame && !selectedGame) {
    return <GameSelector />;
  }

  if (showMiniGame && selectedGame === 'memory') return <MemoryGame />;
  if (showMiniGame && selectedGame === 'speedmath') return <SpeedMathGame />;
  if (showMiniGame && selectedGame === 'numberguess') return <NumberGuessGame />;

  if (currentLesson) return <LessonView />;

  if (currentView === 'home') return <HomeView />;

  if (currentView === 'learn') return <LearnView />;

  if (currentView === 'shop') return <ShopView />;

  if (currentView === 'profile') return <ProfileView />;

  

  return <HomeView />;

}

// LEGO WINKEL COMPONENT
function ShopView() {
  const { user, updateUser, triggerConfetti } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchaseModal, setPurchaseModal] = useState(null);
  const [purchaseConfirm, setPurchaseConfirm] = useState(null);

  const allItems = [
    ...SHOP_ITEMS.avatar,
    ...SHOP_ITEMS.room,
    ...SHOP_ITEMS.powerups,
    ...SHOP_ITEMS.themes,
  ];

  const filteredItems = (() => {
    if (selectedCategory === 'all') return allItems;
    if (selectedCategory === 'avatar') return allItems.filter(item => item.category && item.category.startsWith('avatar'));
    if (selectedCategory === 'room') return allItems.filter(item => item.category && item.category.startsWith('room'));
    if (selectedCategory === 'themes') return allItems.filter(item => item.category === 'theme_pack' || item.category === 'themes');
    return allItems.filter(item => item.category === selectedCategory);
  })();

  const handlePurchase = (item) => {
    if (user.coins >= item.price) {
      setPurchaseConfirm({ item, coinsLeft: user.coins - item.price });
    } else {
      alert(`Je hebt nog ${item.price - user.coins} munten nodig!`);
    }
  };

  const confirmPurchase = () => {
    if (!purchaseConfirm) return;
    
    const { item } = purchaseConfirm;
    // Determine which inventory bucket to add the item into
    const inv = user.inventory || { avatar: [], room: [], themes: [] };
    const newInv = { ...inv };

    if (item.category && item.category.startsWith('avatar')) {
      newInv.avatar = Array.from(new Set([...(newInv.avatar || []), item.id]));
    } else if (item.category && item.category.startsWith('room')) {
      newInv.room = Array.from(new Set([...(newInv.room || []), item.id]));
    } else if (item.category && item.category === 'theme_pack') {
      newInv.themes = Array.from(new Set([...(newInv.themes || []), item.id]));
    } else {
      // fallback: put in avatar by default
      newInv.avatar = Array.from(new Set([...(newInv.avatar || []), item.id]));
    }

    updateUser({
      coins: Math.max(0, user.coins - item.price),
      inventory: newInv,
    });

    triggerConfetti();
    setPurchaseConfirm(null);
    alert(`🎉 Gefeliciteerd! Je hebt ${item.name} gekocht!`);
    console.log('Updated inventory:', newInv);
  };

  const isItemOwned = (itemId) => (user.inventory || []).includes(itemId);

  // Updated check across structured inventory
  const isItemOwnedStructured = (itemId) => {
    const inv = user.inventory || { avatar: [], room: [], themes: [] };
    return (inv.avatar || []).includes(itemId) || (inv.room || []).includes(itemId) || (inv.themes || []).includes(itemId);
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-gray-800 mb-2">🏪 Lego Winkel</h2>
          <p className="text-gray-600 text-lg">Verzamel munten en shop coole items!</p>
        </div>

        {/* Munten & Spaar doel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="text-6xl">💰</div>
              <div>
                <p className="text-sm opacity-90">Jouw Munten</p>
                <p className="text-4xl font-black">{user.coins || 0}</p>
              </div>
            </div>
          </div>

          {/* Spaar doel */}
          {user.coins < 100 && (
            <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-2">🎯 Spaar voor Gouden Kroon</p>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 bg-white bg-opacity-30 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all"
                    style={{ width: `${Math.min(100, (user.coins / 100) * 100)}%` }}
                  />
                </div>
                <span className="font-bold">{100 - user.coins} te gaan!</span>
              </div>
              <p className="text-xs opacity-90">
                Nog {Math.ceil((100 - user.coins) / 5)} lessen doen! 📚
              </p>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'all', label: 'Alles', icon: '🛍️' },
            { id: 'avatar', label: 'Avatar', icon: '👤' },
            { id: 'powerups', label: 'Power-ups', icon: '⚡' },
            { id: 'themes', label: 'Thema\'s', icon: '🎨' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const owned = isItemOwnedStructured(item.id);
            const displayIcon = item.icon || item.emoji || item.preview || '🎁';
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl ${
                  owned ? 'border-4 border-green-500' : 'border-4 border-gray-200'
                }`}
              >
                {/* Badges */}
                <div className="relative h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <div className="text-7xl">{displayIcon}</div>
                  
                  {item.badge && (
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full font-bold text-white text-xs ${
                      item.badge === 'Premium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      item.badge === 'Populair' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}>
                      {item.badge}
                    </div>
                  )}

                  {owned && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      ✅ Bezeten
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  {item.uses && (
                    <p className="text-xs text-gray-500 mb-3">📊 {item.uses}x gebruik</p>
                  )}

                  {/* Prijs & Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-black text-amber-600">
                      💰 {item.price}
                    </div>
                    
                    {owned ? (
                      <button className="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold text-lg cursor-not-allowed opacity-70">
                        ✅ Bezeten
                      </button>
                    ) : user.coins >= item.price ? (
                      <button
                        onClick={() => handlePurchase(item)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl font-bold text-lg transform transition-all active:scale-95 shadow-lg"
                      >
                        KOOP
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-6 py-3 rounded-2xl font-bold text-lg cursor-not-allowed"
                        title={`Nog ${item.price - user.coins} munten nodig`}
                      >
                        Spaar
                      </button>
                    )}
                  </div>

                  {/* Spaar indicator */}
                  {!owned && user.coins < item.price && (
                    <p className="text-xs text-orange-600 font-semibold mt-3">
                      📊 Nog {item.price - user.coins} munten! ({Math.ceil((item.price - user.coins) / 5)} lessen)
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {purchaseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center transform animate-fadeIn">
            <div className="text-6xl mb-4">{purchaseConfirm.item.icon}</div>
            <h3 className="text-3xl font-black text-gray-800 mb-3">{purchaseConfirm.item.name}</h3>
            
            <div className="bg-amber-100 rounded-2xl p-4 mb-6">
              <p className="text-gray-700 font-semibold mb-2">Weet je zeker dat je dit wilt kopen?</p>
              <p className="text-2xl font-black text-amber-700 mb-2">💰 {purchaseConfirm.item.price} munten</p>
              <p className="text-sm text-gray-600">
                Je hebt dan nog <span className="font-bold text-amber-700">{purchaseConfirm.coinsLeft}</span> munten over
              </p>
            </div>

            <p className="text-xs text-red-600 mb-6 font-semibold">
              ⚠️ Je kunt dit niet ongedaan maken!
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setPurchaseConfirm(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                Annuleer
              </button>
              <button
                onClick={confirmPurchase}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transform transition-all active:scale-95 shadow-lg"
              >
                🎉 Koop!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Game Selector Component
function GameSelector() {
  const { finishMiniGame, setSelectedGame } = useApp();

  const games = [
    {
      id: 'memory',
      name: 'Memory Spel',
      icon: '🧠',
      color: 'from-purple-500 to-pink-500',
      description: 'Vind alle getallenparen in 30 seconden!',
      emoji: '🎮',
    },
    {
      id: 'speedmath',
      name: 'Speed Math',
      icon: '⚡',
      color: 'from-blue-500 to-cyan-500',
      description: 'Los zoveel mogelijk sommen op in 30 seconden!',
      emoji: '🔢',
    },
    {
      id: 'numberguess',
      name: 'Getal Raden',
      icon: '🎲',
      color: 'from-green-500 to-emerald-500',
      description: 'Raad het geheime getal tussen 1 en 100!',
      emoji: '🎯',
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Kies een Spel!</h2>
          <p className="text-gray-600">Welk spel wil je spelen?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`bg-gradient-to-br ${game.color} rounded-2xl shadow-lg p-6 text-white hover:shadow-xl hover:scale-105 transition-all active:scale-95 transform`}
            >
              <div className="text-5xl mb-3 text-center">{game.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
              <p className="text-sm opacity-90 mb-4">{game.description}</p>
              <div className="text-3xl text-center">{game.emoji}</div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => finishMiniGame()}
            className="text-gray-600 hover:text-gray-800 underline font-semibold"
          >
            Skip games en ga terug naar home
          </button>
        </div>
      </div>
    </div>
  );
}

