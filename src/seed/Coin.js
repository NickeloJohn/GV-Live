const Coin = require("../models/Coin")


const addCoin = async () => {
    const data = {
        price_peso: 9,
        coins: 10
    }

    await Coin.findOneAndUpdate({ price_peso: data.price_peso }, data, {
        upsert: true,
        new: true
    });

    const datas = {
        price_peso: 20,
        coins: 18
    }
    await Coin.findOneAndUpdate({ price_peso: datas.price_peso }, datas, {
        upsert: true,
        new: true
    })
}

addCoin()