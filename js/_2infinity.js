addLayer("i", {
    name: "infinity", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        time: new Decimal(0),
    }},
    color: "#FF00FF",
    branches: ['n'],
    requires: new Decimal(1.79e308),
    resource: "infinity", // Name of prestige currency
    baseResource: "number",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0003,
    effectDescription() { return "which are boosting number production by ^"+format(Decimal.min(player.i.points.add(1), new Decimal(100).times(upgradeEffect('m', 11))))+" / ^"+format(new Decimal(100).times(upgradeEffect('m', 11))) },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('i', 31)) mult = mult.times(upgradeEffect('i', 31))
        if (player.v.pointsTest >= 1) mult = mult.times(Decimal.min((Decimal.pow(10, Decimal.pow(1.1, player.v.points))).times(player.v.pointsTest).add(new Decimal(1).sub(player.v.pointsTest)), 100000))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    doReset(resettingLayer) {
        player.i.time = new Decimal(0);
        let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
	},

    hotkeys: [
        {key: "i", description: "I: Reset for infinities", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    update() {
        if (!hasUpgrade('i', 23)) player.i.time = new Decimal(0)
        if (player.i.points < 20000 && hasMilestone('v', 3)) player.i.points = new Decimal(20000)
        if (player.v.resetting = new Decimal(0)) {
            gain = Decimal.pow(1.1, Decimal.log10(player.i.points));
            if (getBuyableAmount('v', 11 > 0)) gain = Decimal.pow(new Decimal(1).times(getBuyableAmount(v, 11).pow(3).add(1)), Decimal.log10(player.i.points))
            if (hasUpgrade('i', 23)) player.i.time = player.i.time.add(gain)
        } else {
            gain = new Decimal(0);
        }
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button", "blank",
                ["display-text",
                    function() { return 'You have '+format(player.points)+" number" }
                ], "blank",
                ["toggle", ["i", "auto"]],
                ["display-text",
                    function() { return '(Buy the More Infinities upgrade to unlock the auto-buyer toggle above)' }
                ],
            ]
        },
        "Upgrades": {
            content: [
                "main-display",
                ["display-text",
                    function() { return '<b>Infinity Upgrades</b>' }, {"font-size": "32px", "color": "#FF00FF"}
                ], "blank",
                "upgrades", "blank",
                ["display-text",
                    function() { 
                        if (hasUpgrade('i', 21)) {
                            return "AFTER BUYING THE 'NO LIMITS' UPGRADE: Due to the exponential boost from infinities, turning off the auto-infinity and waiting longer until you infinity will give you much more infinity." 
                        } else {
                            return ""
                        }
                    }
                ],
            ],
        },
        "Time": {
            content: [
                "main-display",
                ["display-text",
                    function() { return 'Your infinities are generating '+format(player.i.time)+" time." }
                ], "blank",
                "buyables"
            ],
            unlocked() {return hasUpgrade('i', 23)}
        },
    },
    
    upgrades: {
        11: {
            title: "Base Resources",
            description: "Does not reset number upgrades on infinity.",
            cost: new Decimal(1),
        },
        12: {
            title: "Database",
            description: "Does not reset number buyables on infinity.",
            cost: new Decimal(4),
        },
        13: {
            title: "More Infinities",
            description: "Unlock auto-infinity",
            cost: new Decimal(10),
        },
        21: {
            title: "No Limits",
            description: "Remove the number limit.",
            cost: new Decimal(30),
        },
        22: {
            title: "Infinity Producer",
            description: "Gain 100% of the infinities you will get upon reset.",
            cost: new Decimal(10000),
        },
        23: {
            title: "Reduced Effort",
            description: "Unlock a new tab.",
            cost: new Decimal(1e40),
        },
        /**---Unlocked by Buyables---**/
        31: {
            title: "Infinity Machines I",
            description: "Increase infinity gain by machines and time.",
            cost: new Decimal(1e70),
            effect() { return format(Decimal.pow(player.m.points, Decimal.log2(player.i.time.div(100))).times(1e10)) },
            effectDisplay() { return this.effect()+'x' },
            unlocked() { return getBuyableAmount('i', 11) >= 1 || hasMilestone('v', 4) }
        },
        32: {
            title: "Infinity Machines II",
            description: "Increase machine gain by infinity and time.",
            cost: new Decimal(1e120),
            effect() { return format(Decimal.pow(Decimal.log2(Decimal.log10(player.i.points).div(50)), Decimal.log2(Decimal.log2(player.i.time)))) },
            effectDisplay() { return this.effect()+'x' },
            unlocked() { return getBuyableAmount('i', 11) >= 2  || hasMilestone('v', 4) }
        },
    },

    buyables: {
        11: {
            cost(x) { return new Decimal(10).pow(getBuyableAmount('i', 11).times(2.3).add(1)).times(1e4) },
            title: "Rocket Engines",
            display() { return "Unlock a new infinity upgrade.<br><br>Cost: "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" time<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id)))+"/2" },
            canAfford() { return player.i.time.gte(this.cost()) },
            buy() {
                player.i.time = player.i.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: 2,
        },
    },

    passiveGeneration() { return (hasUpgrade("i", 22))?1:0 },
    autoPrestige() { return (player.i.auto && hasUpgrade("i", 13)) },
    autoUpgrade() {return hasMilestone('v', 2)}
})