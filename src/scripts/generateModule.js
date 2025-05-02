import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to capitalize the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Function to generate the controller file content
const generateControllerContent = (
  modelName,
) => `import ${modelName}Service from "#services/${modelName.toLowerCase()}.service.js";
import BaseController from "#controllers/base.js";

class ${modelName}Controller extends BaseController {
  static Service = ${modelName}Service;
}

export default ${modelName}Controller;
`;

// Function to generate the model file content
const generateModelContent = (
  modelName,
) => `import BaseModel from "#models/base.js";
import { DataTypes } from "sequelize";

class ${modelName} extends BaseModel {}

${modelName}.initialize({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    //WARN: Unique constraint missing
  },
  permissions: {
    type: DataTypes.JSON,
  },
});

export default ${modelName};
`;

// Function to generate the router file content
const generateRouterContent = (modelName) => `import express from "express";
import asyncHandler from "#utils/asyncHandler.js";
import ${modelName}Controller from "#controllers/${modelName.toLowerCase()}.controller.js";
import { authentication } from "#middlewares/authentication.js";

const router = express.Router();

// router.use(authentication);

router
  .route("/:id?")
  .get(asyncHandler(${modelName}Controller.get.bind(${modelName}Controller)))
  .post(asyncHandler(${modelName}Controller.create.bind(${modelName}Controller)))
  .put(asyncHandler(${modelName}Controller.update.bind(${modelName}Controller)))
  .delete(asyncHandler(${modelName}Controller.deleteDoc.bind(${modelName}Controller)));

export default router;
`;

// Function to generate the service file content
const generateServiceContent = (
  modelName,
) => `import ${modelName} from "#models/${modelName.toLowerCase()}.model.js";
import BaseService from "#services/base.js";

class ${modelName}Service extends BaseService {
  static Model = ${modelName};
}

export default ${modelName}Service;
`;

// Function to generate all files for a module
const generateFiles = async (modelName) => {
  try {
    // Define directory paths relative to src (script is in src/scripts)
    const srcDir = join(__dirname, "..");
    const controllersDir = join(srcDir, "controllers");
    const routersDir = join(srcDir, "routes");
    const servicesDir = join(srcDir, "services");
    const modelsDir = join(srcDir, "models");

    // Ensure directories exist
    await Promise.all([
      fs.mkdir(controllersDir, { recursive: true }),
      fs.mkdir(routersDir, { recursive: true }),
      fs.mkdir(servicesDir, { recursive: true }),
      fs.mkdir(modelsDir, { recursive: true }),
    ]);

    // Define file paths
    const controllerFile = join(
      controllersDir,
      `${modelName.toLowerCase()}.controller.js`,
    );
    const routerFile = join(routersDir, `${modelName.toLowerCase()}.route.js`);
    const serviceFile = join(
      servicesDir,
      `${modelName.toLowerCase()}.service.js`,
    );
    const modelFile = join(modelsDir, `${modelName.toLowerCase()}.model.js`);

    // Generate and write files
    await Promise.all([
      fs.writeFile(
        controllerFile,
        generateControllerContent(capitalize(modelName)),
      ),
      fs.writeFile(routerFile, generateRouterContent(capitalize(modelName))),
      fs.writeFile(serviceFile, generateServiceContent(capitalize(modelName))),
      fs.writeFile(modelFile, generateModelContent(capitalize(modelName))),
    ]);

    console.log(`Successfully generated files for ${modelName} model:`);
    console.log(`- ${controllerFile}`);
    console.log(`- ${routerFile}`);
    console.log(`- ${serviceFile}`);
    console.log(`- ${modelFile}`);
  } catch (error) {
    console.error("Error generating files:", error.message);
    console.error("Stack trace:", error.stack);
  }
};

// Function to delete all files for a module
const deleteFiles = async (modelName) => {
  try {
    // Define directory paths relative to src (script is in src/scripts)
    const srcDir = join(__dirname, "..");
    const controllersDir = join(srcDir, "controllers");
    const routersDir = join(srcDir, "routes");
    const servicesDir = join(srcDir, "services");
    const modelsDir = join(srcDir, "models");

    // Define file paths
    const controllerFile = join(
      controllersDir,
      `${modelName.toLowerCase()}.controller.js`,
    );
    const routerFile = join(routersDir, `${modelName.toLowerCase()}.route.js`);
    const serviceFile = join(
      servicesDir,
      `${modelName.toLowerCase()}.service.js`,
    );
    const modelFile = join(modelsDir, `${modelName.toLowerCase()}.model.js`);

    // List of files to delete
    const files = [
      { path: controllerFile, name: "Controller" },
      { path: routerFile, name: "Router" },
      { path: serviceFile, name: "Service" },
      { path: modelFile, name: "Model" },
    ];

    // Check and delete files if they exist
    let deletedCount = 0;
    const deletePromises = files.map(async ({ path, name }) => {
      try {
        await fs.access(path); // Check if file exists
        await fs.unlink(path); // Delete the file
        console.log(`Deleted ${name}: ${path}`);
        deletedCount++;
      } catch (error) {
        if (error.code === "ENOENT") {
          console.log(`File not found, skipping ${name}: ${path}`);
        } else {
          console.error(`Error deleting ${name} (${path}):`, error.message);
        }
      }
    });

    await Promise.all(deletePromises);

    if (deletedCount === 0) {
      console.log(`No files were found to delete for ${modelName} module.`);
    } else {
      console.log(
        `Successfully deleted ${deletedCount} file(s) for ${modelName} module.`,
      );
    }
  } catch (error) {
    console.error("Error during deletion process:", error.message);
    console.error("Stack trace:", error.stack);
  }
};

// Command line argument handling
const modelName = process.argv[2];
const isDelete = process.argv[3] === "--delete" || process.argv[3] === "-d";

if (!modelName) {
  console.error("Please provide a model name. Usage:");
  console.error("  Generate: node src/scripts/generateModule.js <ModelName>");
  console.error(
    "  Delete: node src/scripts/generateModule.js <ModelName> --delete",
  );
  process.exit(1);
}

if (process.argv[3] && !isDelete) {
  console.error(
    `Invalid argument: ${process.argv[3]}. Use --delete or -d to delete a module.`,
  );
  console.error("Usage:");
  console.error("  Generate: node src/scripts/generateModule.js <ModelName>");
  console.error(
    "  Delete: node src/scripts/generateModule.js <ModelName> --delete",
  );
  process.exit(1);
}

// Run the appropriate function based on arguments
if (isDelete) {
  deleteFiles(modelName);
} else {
  generateFiles(modelName);
}
