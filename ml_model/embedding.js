const MyFeatureExtractionPipeline = require("./Pipeline");
async function getEmbedding(query) {
    const embeddingGenerator = await MyFeatureExtractionPipeline.getInstance();
    result = await embeddingGenerator(query, {
        pooling: "mean",
        normalize: true,
    });
    return result;
}
module.exports = getEmbedding;
