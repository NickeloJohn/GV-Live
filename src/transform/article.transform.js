const { getUserById } = require("../services/user.service");
const { transformImageUrl } = require("../utils/transform");
const { transformGetMe } = require("./user.transform");

const transformArticle = async (article) => {
    return {
        id: article?._id,
        author: article.author && transformGetMe(await getUserById(article.author)),
        title: article?.title,
        status: article?.status,
        hashTags: article?.hashTags,
        content: article?.content,
        shares: article?.shares,
        images: transformImageUrl(article?.images),
        banner: transformImageUrl(article?.banner),
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
    }
}

const transformArticles = async (articles) => {
    const transformedArticles = [];
    for (const article of articles) {
        const transformedArticle = await transformArticle(article);
        transformedArticles.push(transformedArticle);
    }
    return transformedArticles;
}

module.exports = {
    transformArticle,
    transformArticles
}