import xlsx from "xlsx";
import { writeFileSync } from "fs";
import sequelize from "#configs/database";
import Product from "#models/product";

// Read Excel file
const filePath = "./file.xlsx"; // replace with your path
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[2];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Extract unique categories
const uniqueMap = new Map();

const categories = {
  SLIDER: 40,
  RIDER: 41,
  ROCKER: 42,
  ESSENTIALS: 43,
  TOYS: 44,
  GYM: 45,
  "SOFT CUBE": 46,
  SHELF: 47,
  ORGANIZER: 48,
  "CLASSROOM ESSENTIALS": 49,
  TRAMPOLINE: 50,
  MAT: 51,
  "WALL TOYS": 52,
  "MUSICAL EQUIPMENT": 53,
  "KIDS PLAY TUNNEL": 54,
  FURNITURE: 55,
  MONTESSORI: 56,
};

console.log(true, data);

data.forEach((row) => {
  const category = row["name"];
  if (!uniqueMap.has(category)) {
    uniqueMap.set(category, {
      name: row["name"],
      code: row["itemCode"],
      productCategoryId: categories[row["categoryId"].toUpperCase()],
      baseQuantity: 10,
      rate: row["price"],
      type: "Finished",
    });
  }
});

const uniqueCategories = [...uniqueMap.values()];

sequelize.authenticate().then(async () => {
  await Product.bulkCreate(uniqueCategories);
});

// // Optional: write to JSON
// writeFileSync(
//   "unique_categories.json",
//   JSON.stringify(uniqueCategories, null, 2),
// );

console.log("✅ Unique categories:", uniqueCategories);
