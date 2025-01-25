const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure files in src/features have a Hexa prefix',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    return {
      Program: () => {
        const filename = context.getFilename();
        const relativePath = path.relative(context.getCwd(), filename);

        // Check if the file is in src/features
        if (relativePath.startsWith('src/features')) {
          // Ensure it has the Hexa prefix
          const baseName = path.basename(filename);
          if (!baseName.startsWith('Hexa')) {
            context.report({
              loc: { line: 1, column: 0 },
              message: 'Files in src/features must have a "Hexa" prefix.',
            });
          }
        }
      },
    };
  },
};
