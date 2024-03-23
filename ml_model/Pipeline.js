class MyFeatureExtractionPipeline {
    static task = "feature-extraction";
    static model = "Xenova/all-mpnet-base-v2";
    static instance = null;
    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            console.log("creating new model instance");
            let { pipeline, env } = await import("@xenova/transformers");
            env.cacheDir = "../.cache";
            this.instance = pipeline(this.task, this.model, {
                progress_callback,
            });
        }
        return this.instance;
    }
}

module.exports = MyFeatureExtractionPipeline;
