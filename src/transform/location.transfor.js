

const transformLocations = (region) => {
  return {
    id: region.id || region._id,
    name: region.name,
    code:  region.code,
    islandGroup: region.islandGroup,
  };
}

module.exports = {
  transformLocations
}