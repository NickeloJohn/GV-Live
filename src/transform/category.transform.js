

const transformCategoryInterest = (category) => {
  return {
    id: category._id,
    name: category.name,
    icon: category.icon || "https://placehold.it/100x100",
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  }
}

module.exports = {
  transformCategoryInterest
}