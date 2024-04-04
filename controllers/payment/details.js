const { Tier } = require("../../models");

const getPaymentDetails = async(req, res) =>{

    try{
        const tiers = await Tier.find({});

        if(!tiers){
            return res.status(404).send("No payment details found");
        }

        return res.status(200).send(tiers);
    }
    catch(e){
        console.error(`Error while getting payment details: ${e.message}`);
        return res.status(500).send(e.message);
    }
}

module.exports = {getPaymentDetails};