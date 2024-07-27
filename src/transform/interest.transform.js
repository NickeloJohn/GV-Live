const { transformImageUrl } = require('../utils/transform');

const transformInterest = (interest) => {
  return {
    id: interest.id,
    name: interest.name,
    icon: transformImageUrl(interest.icon) || 'https://via.placeholder.com/150',
    createdAt: interest.createdAt,
    updatedAt: interest.updatedAt
  };
};

module.exports = {
  transformInterest
};
