import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed food library
  const foods = await Promise.all([
    prisma.foodItem.upsert({
      where: { id: "food_chicken_breast" },
      update: {},
      create: {
        id: "food_chicken_breast",
        name: "Chicken Breast (grilled)",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        serving: "100g",
        tags: "protein,meat",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_greek_yogurt" },
      update: {},
      create: {
        id: "food_greek_yogurt",
        name: "Greek Yogurt (0% fat)",
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        serving: "1 cup (170g)",
        tags: "dairy,protein",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_protein_bar" },
      update: {},
      create: {
        id: "food_protein_bar",
        name: "Protein Bar",
        calories: 200,
        protein: 20,
        carbs: 22,
        fat: 7,
        serving: "1 bar (60g)",
        tags: "snack,protein",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_oats" },
      update: {},
      create: {
        id: "food_oats",
        name: "Rolled Oats (dry)",
        calories: 389,
        protein: 17,
        carbs: 66,
        fat: 7,
        serving: "100g",
        tags: "carbs,breakfast",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_eggs" },
      update: {},
      create: {
        id: "food_eggs",
        name: "Whole Eggs",
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fat: 11,
        serving: "2 large eggs",
        tags: "protein,breakfast",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_green_beans" },
      update: {},
      create: {
        id: "food_green_beans",
        name: "Green Beans (steamed)",
        calories: 31,
        protein: 1.8,
        carbs: 7,
        fat: 0.1,
        serving: "100g",
        tags: "vegetable",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_lean_steak" },
      update: {},
      create: {
        id: "food_lean_steak",
        name: "Lean Steak (sirloin)",
        calories: 207,
        protein: 36,
        carbs: 0,
        fat: 6.6,
        serving: "150g",
        tags: "protein,meat",
      },
    }),
    prisma.foodItem.upsert({
      where: { id: "food_whey_shake" },
      update: {},
      create: {
        id: "food_whey_shake",
        name: "Whey Protein Shake",
        calories: 130,
        protein: 25,
        carbs: 5,
        fat: 2,
        serving: "1 scoop (35g) + water",
        tags: "protein,supplement",
      },
    }),
  ]);

  console.log(`Seeded ${foods.length} food items.`);

  // Seed meal templates
  const breakfastTemplate = await prisma.mealTemplate.upsert({
    where: { id: "tmpl_standard_breakfast" },
    update: {},
    create: {
      id: "tmpl_standard_breakfast",
      name: "Standard Breakfast",
      description: "Oats + eggs + greek yogurt",
      items: {
        create: [
          {
            foodItemId: "food_oats",
            foodName: "Rolled Oats (dry)",
            quantity: "80g",
            calories: 311,
            protein: 13.6,
            carbs: 52.8,
            fat: 5.6,
            sortOrder: 0,
          },
          {
            foodItemId: "food_eggs",
            foodName: "Whole Eggs",
            quantity: "2 large eggs",
            calories: 155,
            protein: 13,
            carbs: 1.1,
            fat: 11,
            sortOrder: 1,
          },
          {
            foodItemId: "food_greek_yogurt",
            foodName: "Greek Yogurt (0% fat)",
            quantity: "1 cup",
            calories: 59,
            protein: 10,
            carbs: 3.6,
            fat: 0.4,
            sortOrder: 2,
          },
        ],
      },
    },
  });

  const dinnerTemplate = await prisma.mealTemplate.upsert({
    where: { id: "tmpl_lean_dinner" },
    update: {},
    create: {
      id: "tmpl_lean_dinner",
      name: "Lean Steak Dinner",
      description: "Lean steak + green beans",
      items: {
        create: [
          {
            foodItemId: "food_lean_steak",
            foodName: "Lean Steak (sirloin)",
            quantity: "150g",
            calories: 207,
            protein: 36,
            carbs: 0,
            fat: 6.6,
            sortOrder: 0,
          },
          {
            foodItemId: "food_green_beans",
            foodName: "Green Beans (steamed)",
            quantity: "150g",
            calories: 46,
            protein: 2.7,
            carbs: 10.5,
            fat: 0.15,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  const snackTemplate = await prisma.mealTemplate.upsert({
    where: { id: "tmpl_protein_snack" },
    update: {},
    create: {
      id: "tmpl_protein_snack",
      name: "Protein Snack",
      description: "2 greek yogurts + protein bar",
      items: {
        create: [
          {
            foodItemId: "food_greek_yogurt",
            foodName: "Greek Yogurt (0% fat)",
            quantity: "2 cups",
            calories: 118,
            protein: 20,
            carbs: 7.2,
            fat: 0.8,
            sortOrder: 0,
          },
          {
            foodItemId: "food_protein_bar",
            foodName: "Protein Bar",
            quantity: "1 bar",
            calories: 200,
            protein: 20,
            carbs: 22,
            fat: 7,
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log(`Seeded templates: ${breakfastTemplate.name}, ${dinnerTemplate.name}, ${snackTemplate.name}`);

  // Default user settings
  await prisma.userSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      caloriesTarget: 2200,
      proteinTarget: 180,
      carbsTarget: 220,
      fatTarget: 65,
    },
  });

  console.log("Seeded user settings.");
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
