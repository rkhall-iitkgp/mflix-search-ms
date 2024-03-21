const MyFeatureExtractionPipeline = require('./Pipeline.js')
const connectMlModel = async () => {
    try {
      await MyFeatureExtractionPipeline.getInstance();
      console.log("Successfully created instance of ML Model");
    } catch (err) {
      console.log(err.message);
    }
  };
  module.exports = connectMlModel;
