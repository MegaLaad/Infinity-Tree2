addLayer("n", {
    name: "number", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    resource: "number", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},

    update() {
        tmp2 = decimalOne
        if (hasUpgrade('sf', 13)) tmp2 = new Decimal(10)

        exp = decimalOne
        if (hasUpgrade('sf', 43)) {
            if (hasChallenge('bl', 11)) exp = exp.times(2)
            if (hasChallenge('bl', 12)) exp = exp.times(2)
            if (hasChallenge('bl', 21)) exp = exp.times(2)
        }

        if (hasUpgrade('sf', 53)) exp = exp.times(10)
        if (((hasUpgrade('n', 11)) && (player.points < 1e309 || hasUpgrade('i', 21))) || hasMilestone('sf', 0)) player.points = player.points.times(new Decimal(1).add(Decimal.pow(getBuyableAmount('n', 12).add(2), new Decimal(0.1).times(getBuyableAmount('n', 11).add(1)))).pow(Decimal.min(player.i.points.add(1), new Decimal(100).times(upgradeEffect('m', 11)))).times(tmp2).pow(Decimal.min(player.v.points.times(10).add(1), 100)).pow(exp))
    },

    doReset(resettingLayer) {
        player.i.time = new Decimal(0);
		let keep = [];
        if (hasUpgrade('i', 11) && resettingLayer == 'i') keep.push("upgrades");
        if (hasUpgrade('i', 12) && resettingLayer == 'i') keep.push("buyables");
        if (hasMilestone('v', 0)) keep.push("upgrades");
        if (hasMilestone('v', 0)) keep.push("buyables");
		if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
	},

    tabFormat: [
        ["display-text",
            function() { return '<b>Number Upgrades</b>' },
            {"font-size": "32px", "color": "#00FF00"},
        ],
        ["display-text",
            function() { 
                if (!hasUpgrade('i', 21)) {
                    return '(At a certain amount of number, you won\'t be able to gain more number.)' 
                } else {
                    return '(You will still be able to gain more number after the original limit)'
                }},
        ], "blank",
        "upgrades", "blank",
        "buyables",
    ],

    upgrades: {
        11: {
            fullDisplay() {
                return "<b>Exponential Growth</b><br>Number grow exponentially when online.<br><br>Cost: 10 number"
            },
            canAfford() {
                return player.points >= 10
            },
            pay() {
                return player.points = player.points.div(10)
            },
        },
    },

    buyables: {
        11: {
            cost(x) { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id).times(Decimal.pow(10, getBuyableAmount(this.layer, this.id).add(1).pow(0.2)))).times(1e10) },
            title: "Speed Modifier",
            display() { return "Increase the Number growth speed.<br><br>Cost: "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" number<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id)))+"/10" },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: 10,
        },
        12: {
            cost(x) { return new Decimal(10).pow(getBuyableAmount(this.layer, this.id).times(Decimal.pow(10, getBuyableAmount(this.layer, this.id).add(1).pow(1.5)))).times(1e70) },
            title: "Modifier Squared",
            display() { return "Increase the Speed Modifier power.<br><br>Cost: "+format(this.cost(getBuyableAmount(this.layer, this.id)))+" number<br>Bought: "+Decimal.floor(format(getBuyableAmount(this.layer, this.id)))+"/3" },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.div(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: 3,
        },
    },
})
