module.exports = {
    ...require('geta-prettier-config'),
    importOrder: ['^@/(.*)$', '^@geta/(.*)$', '^[./]'],
    importOrderSeparation: true,
};
