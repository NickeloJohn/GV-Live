const Category = require("../models/Category");
const { defaultPaginate } = require("../utils/functions");


class CategoryService {

  async createCategory(payload) {
    const category = new Category(payload);
    return await category.save();
  }

  async getInterest(req) {
    const options = {
      ...defaultPaginate(req.query),
    }

    const filter = {
      type: 'interest'
    }

    const results = await Category.paginate(filter, options);
    return results;
  }
}

module.exports = new CategoryService();