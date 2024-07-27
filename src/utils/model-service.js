

class ModelService {

    constructor() {
      
    }

    async create(Model, data, options) {
        return await Model.create(data);
    }

    async save(ModelClassInstance, options) {
        return await ModelClassInstance.save();
    }
}