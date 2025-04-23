// Emoji enumerations for "Emoji Hole" game
const EmojiTypes = {
    // Game player emoji
    PLAYER: {
      emoji: "🕳️",
      name: "Black Hole",
      type: "player",
      baseSizeValue: 1
    },
    
    // Game entities organized by size groups
    MICROSCOPIC: {
      groupName: "Microscopic",
      minSizeToConsume: 1,
      emojis: [
        { emoji: "🦠", name: "Microbe", sizeValue: 0.5, points: 10 },
        { emoji: "✨", name: "Sparkles", sizeValue: 0.6, points: 12 },
        { emoji: "💧", name: "Water Drop", sizeValue: 0.7, points: 15 },
        { emoji: "🔬", name: "Microscope", sizeValue: 0.8, points: 18 },
        { emoji: "🧫", name: "Petri Dish", sizeValue: 0.9, points: 20 },
        { emoji: "🧬", name: "DNA", sizeValue: 1.0, points: 25 }
      ]
    },
    
    TINY_OBJECTS: {
      groupName: "Tiny Objects",
      minSizeToConsume: 1.5,
      emojis: [
        { emoji: "💉", name: "Syringe", sizeValue: 1.2, points: 30 },
        { emoji: "💊", name: "Pill", sizeValue: 1.3, points: 35 },
        { emoji: "🧷", name: "Safety Pin", sizeValue: 1.4, points: 40 },
        { emoji: "🔩", name: "Nut and Bolt", sizeValue: 1.5, points: 45 },
        { emoji: "🪙", name: "Coin", sizeValue: 1.6, points: 50 },
        { emoji: "💎", name: "Gem", sizeValue: 1.8, points: 55 },
        { emoji: "🧩", name: "Puzzle Piece", sizeValue: 2.0, points: 60 }
      ]
    },
    
    SMALL_FOOD: {
      groupName: "Small Food Items",
      minSizeToConsume: 2.5,
      emojis: [
        { emoji: "🍇", name: "Grapes", sizeValue: 2.2, points: 70 },
        { emoji: "🍓", name: "Strawberry", sizeValue: 2.4, points: 75 },
        { emoji: "🍒", name: "Cherries", sizeValue: 2.6, points: 80 },
        { emoji: "🌰", name: "Chestnut", sizeValue: 2.8, points: 85 },
        { emoji: "🥜", name: "Peanuts", sizeValue: 3.0, points: 90 },
        { emoji: "🧀", name: "Cheese Wedge", sizeValue: 3.2, points: 95 },
        { emoji: "🍪", name: "Cookie", sizeValue: 3.5, points: 100 }
      ]
    },
    
    MEDIUM_FOOD: {
      groupName: "Medium Food Items",
      minSizeToConsume: 4.0,
      emojis: [
        { emoji: "🍎", name: "Apple", sizeValue: 3.8, points: 120 },
        { emoji: "🍊", name: "Orange", sizeValue: 4.0, points: 130 },
        { emoji: "🥔", name: "Potato", sizeValue: 4.2, points: 140 },
        { emoji: "🥕", name: "Carrot", sizeValue: 4.4, points: 150 },
        { emoji: "🥚", name: "Egg", sizeValue: 4.6, points: 160 },
        { emoji: "🍩", name: "Donut", sizeValue: 4.8, points: 170 },
        { emoji: "🥐", name: "Croissant", sizeValue: 5.0, points: 180 }
      ]
    },
    
    LARGE_FOOD: {
      groupName: "Large Food Items",
      minSizeToConsume: 5.5,
      emojis: [
        { emoji: "🍕", name: "Pizza", sizeValue: 5.2, points: 200 },
        { emoji: "🍉", name: "Watermelon", sizeValue: 5.5, points: 220 },
        { emoji: "🥥", name: "Coconut", sizeValue: 5.8, points: 240 },
        { emoji: "🍞", name: "Bread", sizeValue: 6.0, points: 260 },
        { emoji: "🎂", name: "Cake", sizeValue: 6.3, points: 280 },
        { emoji: "🥖", name: "Baguette", sizeValue: 6.5, points: 300 }
      ]
    },
    
    SMALL_ANIMALS: {
      groupName: "Small Animals",
      minSizeToConsume: 7.0,
      emojis: [
        { emoji: "🐜", name: "Ant", sizeValue: 6.8, points: 350 },
        { emoji: "🦗", name: "Cricket", sizeValue: 7.0, points: 375 },
        { emoji: "🐁", name: "Mouse", sizeValue: 7.3, points: 400 },
        { emoji: "🐸", name: "Frog", sizeValue: 7.6, points: 425 },
        { emoji: "🦔", name: "Hedgehog", sizeValue: 7.9, points: 450 },
        { emoji: "🐇", name: "Rabbit", sizeValue: 8.2, points: 475 },
        { emoji: "🦊", name: "Fox", sizeValue: 8.5, points: 500 }
      ]
    },
    
    MEDIUM_ANIMALS: {
      groupName: "Medium Animals",
      minSizeToConsume: 9.0,
      emojis: [
        { emoji: "🐈", name: "Cat", sizeValue: 8.8, points: 550 },
        { emoji: "🐕", name: "Dog", sizeValue: 9.2, points: 600 },
        { emoji: "🐖", name: "Pig", sizeValue: 9.6, points: 650 },
        { emoji: "🐑", name: "Sheep", sizeValue: 10.0, points: 700 },
        { emoji: "🐒", name: "Monkey", sizeValue: 10.5, points: 750 },
        { emoji: "🦦", name: "Otter", sizeValue: 11.0, points: 800 }
      ]
    },
    
    LARGE_ANIMALS: {
      groupName: "Large Animals",
      minSizeToConsume: 12.0,
      emojis: [
        { emoji: "🐎", name: "Horse", sizeValue: 11.5, points: 900 },
        { emoji: "🦬", name: "Bison", sizeValue: 12.0, points: 1000 },
        { emoji: "🦒", name: "Giraffe", sizeValue: 12.5, points: 1100 },
        { emoji: "🐘", name: "Elephant", sizeValue: 13.0, points: 1200 },
        { emoji: "🦏", name: "Rhinoceros", sizeValue: 13.5, points: 1300 },
        { emoji: "🐋", name: "Whale", sizeValue: 14.0, points: 1400 },
        { emoji: "🦖", name: "T-Rex", sizeValue: 14.5, points: 1500 }
      ]
    },
    
    SMALL_OBJECTS: {
      groupName: "Small Objects & Furniture",
      minSizeToConsume: 15.0,
      emojis: [
        { emoji: "📱", name: "Mobile Phone", sizeValue: 14.8, points: 1600 },
        { emoji: "💻", name: "Laptop", sizeValue: 15.2, points: 1700 },
        { emoji: "🎸", name: "Guitar", sizeValue: 15.6, points: 1800 },
        { emoji: "🪑", name: "Chair", sizeValue: 16.0, points: 1900 },
        { emoji: "📦", name: "Package", sizeValue: 16.5, points: 2000 },
        { emoji: "🚽", name: "Toilet", sizeValue: 17.0, points: 2100 },
        { emoji: "🛒", name: "Shopping Cart", sizeValue: 17.5, points: 2200 }
      ]
    },
    
    VEHICLES: {
      groupName: "Vehicles",
      minSizeToConsume: 18.0,
      emojis: [
        { emoji: "🛵", name: "Scooter", sizeValue: 17.8, points: 2400 },
        { emoji: "🚗", name: "Car", sizeValue: 18.5, points: 2600 },
        { emoji: "🚌", name: "Bus", sizeValue: 19.2, points: 2800 },
        { emoji: "🚜", name: "Tractor", sizeValue: 20.0, points: 3000 },
        { emoji: "🚂", name: "Locomotive", sizeValue: 21.0, points: 3200 },
        { emoji: "🚢", name: "Ship", sizeValue: 22.0, points: 3400 },
        { emoji: "🛩️", name: "Small Airplane", sizeValue: 23.0, points: 3600 }
      ]
    },
    
    BUILDINGS: {
      groupName: "Buildings",
      minSizeToConsume: 24.0,
      emojis: [
        { emoji: "🏠", name: "House", sizeValue: 24.0, points: 4000 },
        { emoji: "🏫", name: "School", sizeValue: 25.0, points: 4500 },
        { emoji: "🏛️", name: "Classical Building", sizeValue: 26.0, points: 5000 },
        { emoji: "🏢", name: "Office Building", sizeValue: 27.0, points: 5500 },
        { emoji: "🏨", name: "Hotel", sizeValue: 28.0, points: 6000 },
        { emoji: "🏭", name: "Factory", sizeValue: 29.0, points: 6500 },
        { emoji: "🏰", name: "Castle", sizeValue: 30.0, points: 7000 }
      ]
    },
    
    LARGE_STRUCTURES: {
      groupName: "Large Structures",
      minSizeToConsume: 32.0,
      emojis: [
        { emoji: "🗼", name: "Tokyo Tower", sizeValue: 32.0, points: 8000 },
        { emoji: "🗽", name: "Statue of Liberty", sizeValue: 34.0, points: 9000 },
        { emoji: "🏟️", name: "Stadium", sizeValue: 36.0, points: 10000 },
        { emoji: "🌉", name: "Bridge", sizeValue: 38.0, points: 11000 },
        { emoji: "🏝️", name: "Desert Island", sizeValue: 40.0, points: 12000 },
        { emoji: "🌋", name: "Volcano", sizeValue: 42.0, points: 13000 },
        { emoji: "🗻", name: "Mount Fuji", sizeValue: 45.0, points: 15000 }
      ]
    },
    
    CELESTIAL: {
      groupName: "Celestial",
      minSizeToConsume: 50.0,
      emojis: [
        { emoji: "🌕", name: "Full Moon", sizeValue: 50.0, points: 20000 },
        { emoji: "🪐", name: "Saturn", sizeValue: 60.0, points: 30000 },
        { emoji: "🌎", name: "Earth", sizeValue: 70.0, points: 40000 },
        { emoji: "🌞", name: "Sun", sizeValue: 85.0, points: 50000 },
        { emoji: "🌌", name: "Milky Way", sizeValue: 100.0, points: 100000 }
      ]
    },
    
    // Special emojis that affect gameplay
    DANGEROUS: {
      groupName: "Dangerous Items",
      emojis: [
        { emoji: "💣", name: "Bomb", effect: "damage", damageValue: 2.0 },
        { emoji: "🧨", name: "Firecracker", effect: "damage", damageValue: 1.5 },
        { emoji: "🍍", name: "Exploding Pineapple", effect: "damage", damageValue: 3.0 },
        { emoji: "⚡", name: "Lightning Bolt", effect: "damage", damageValue: 2.5 },
        { emoji: "🔥", name: "Fire", effect: "damage", damageValue: 1.8 },
        { emoji: "☄️", name: "Comet", effect: "damage", damageValue: 4.0 }
      ]
    },
    
    POWERUPS: {
      groupName: "Power-Ups",
      emojis: [
        { emoji: "🌈", name: "Rainbow", effect: "consumeAll", duration: 5000 },
        { emoji: "🧲", name: "Magnet", effect: "increasePull", duration: 8000 },
        { emoji: "🛡️", name: "Shield", effect: "protection", duration: 10000 },
        { emoji: "⏱️", name: "Clock", effect: "slowTime", duration: 7000 },
        { emoji: "💫", name: "Dizzy", effect: "speedBoost", duration: 6000 },
        { emoji: "🌠", name: "Shooting Star", effect: "instantGrowth", growthValue: 5.0 }
      ]
    }
  };
  
  // Helper functions for game mechanics
  const EmojiUtils = {
    // Get all consumable emojis based on current player size
    getConsumableEmojis(playerSize) {
      const consumable = [];
      
      Object.values(EmojiTypes).forEach(group => {
        if (group.emojis && group.minSizeToConsume && playerSize >= group.minSizeToConsume) {
          group.emojis.forEach(emoji => {
            if (emoji.sizeValue && emoji.sizeValue <= playerSize) {
              consumable.push(emoji);
            }
          });
        }
      });
      
      return consumable;
    },
    
    // Get next size threshold the player needs to reach
    getNextSizeThreshold(currentPlayerSize) {
      let nextThreshold = null;
      let smallestDifference = Infinity;
      
      Object.values(EmojiTypes).forEach(group => {
        if (group.minSizeToConsume && group.minSizeToConsume > currentPlayerSize) {
          const difference = group.minSizeToConsume - currentPlayerSize;
          if (difference < smallestDifference) {
            smallestDifference = difference;
            nextThreshold = {
              size: group.minSizeToConsume,
              groupName: group.groupName
            };
          }
        }
      });
      
      return nextThreshold;
    },
    
    // Calculate growth after consuming an emoji
    calculateGrowth(playerSize, consumedEmoji) {
      // Base growth formula
      const baseGrowth = consumedEmoji.sizeValue * 0.05;
      
      // Smaller emojis relative to player size give less growth
      const sizeRatio = consumedEmoji.sizeValue / playerSize;
      const adjustedGrowth = baseGrowth * (0.5 + sizeRatio);
      
      return Math.min(adjustedGrowth, 1.0); // Cap growth per single emoji
    }
  };
  
  module.exports = { ...EmojiTypes, utils: EmojiUtils };