module.exports = {
    trading: {
        name: 'trading',
        description: 'Trading',
        actions: [
            {
                name: 'TradingAll',
                description: 'All',
                use: ['TradingBroker']
            },
            {
                name: 'TradingBroker',
                description: 'Broker'
            },
        ]
    },
}