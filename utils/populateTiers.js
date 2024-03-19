const { Tier } = require("../models");

const populateTiers = () => {
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

  Tier.create(free).then((result) => {
    console.log(result);
  });
  Tier.create(tier1).then((result) => {
    console.log(result);
  });
  Tier.create(tier2).then((result) => {
    console.log(result);
  });
  Tier.create(tier3).then((result) => {
    console.log(result);
  });
};

module.exports = populateTiers;
