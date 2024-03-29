const { Tier } = require("../models");

const populateTiers = async () => {
    const count = await Tier.countDocuments({});
    if (count != 0) return { status: false };
    else {
        const free = {
            tier: "FREE",
            name: "Free",
            price: 0,
            description: "Free tier with limited features",
            maxResolution: 480,
            partyWatch: false,
        };
        const tier3 = {
            tier: "TIER 3",
            name: "Basic",
            price: 10,
            description: "Basic tier with standard features",
            maxResolution: 480,
            partyWatch: false,
        };
        const tier2 = {
            tier: "TIER 2",
            name: "Standard",
            price: 20,
            description: "Standard tier with additional features",
            maxResolution: 720,
            partyWatch: true,
        };
        const tier1 = {
            tier: "TIER 1",
            name: "Premium",
            price: 30,
            description: "Premium tier with full features",
            maxResolution: 1080,
            partyWatch: true,
        };

        await Tier.create(free);
        await Tier.create(tier1);
        await Tier.create(tier2);
        await Tier.create(tier3);

        return { status: true };
    }
};

module.exports = populateTiers;
