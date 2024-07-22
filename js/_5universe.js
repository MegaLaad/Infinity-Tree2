addLayer("u", {
    name: "universe", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#534FE7",
    branches: ['sf', 's', 'd', 'g'],
    requires: new Decimal(1e26),
    resource: "universe", // Name of prestige currency
    baseResource: "space",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.s.points },  // A function to return the current amount of baseResource.
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    getResetGain() {
        gain = Decimal.floor(Decimal.log10(player.s.points.add(10)).div(4).sub(5.5))
        if (!isNaN(gain) && gain.gte(1)) return gain
        else return decimalZero
    },
    getNextAt() {
        nextAt = Decimal.pow(10, getResetGain(this.layer).add(6.5).times(4))
        return nextAt
    },
    canReset() {
        return getResetGain(this.layer).gte(1)
    },
    prestigeButtonText() {
        if (!getResetGain(this.layer).gte(100)) return "Reset for +"+format(getResetGain(this.layer))+" universe<br><br>"+format(player.s.points)+" / "+format(getNextAt(this.layer))+" space"
        else return "Reset for +"+format(getResetGain(this.layer))+" universe"
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
 
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button", "blank",
                ["display-text",
                    function() { return 'You have '+format(player.s.points)+" space" }
                ], "blank",
                "milestones", "blank"
            ]
        },
    },

    hotkeys: [
        {key: "u", description: "U: Reset for universe", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})