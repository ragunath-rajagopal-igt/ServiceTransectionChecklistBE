// runSeeders.js
const fs = require('fs');
const path = require('path');
const indexSeeders = async () => {
  const seedersPath = path.join(__dirname);
  // Read all files in the seeders directory
  // const files = fs.readdirSync(seedersPath);
  const files = [
    'authSeeder.js',
    'locationCategorySeeder.js',
    'roleSeeder.js',
    'moduleSeeder.js',
    'moduleRolePermissionSeeder.js',
    'organizationSeeder.js',
    'statusSeeder.js',
    'fileUploadSeeder.js',
  ];
  for (const file of files) {
    if (file.endsWith('.js')) {
      // Dynamically import each seeder file
      const seeder = require(path.join(seedersPath, file));
      try {
        await seeder(); // Run the seeder function
      } catch (error) {
        return error;
      }
    }
  }
};

indexSeeders().then(() => {
  process.exit(0);
}).catch((error) => {
  process.exit(1);
});
