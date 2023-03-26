module.exports = {
    trading: {
        name: 'trading',
        description: 'Trading',
        actions: [
            {
                name: 'tradingAll',
                description: 'All',
                use: ['tradingOrderManagement', 'tradingStockManagement',
                    'tradingWithdrawManagement', 'tradingCustomerFeeManagement',
                    'tradingWalletManagement', 'tradingStatementShow'
                ]
            },
            {
                name: 'tradingOrderManagement',
                description: 'Manage orders',
                use: ['tradingOrderShow']
            },
            {
                name: 'tradingOrderShow',
                description: 'Show orders'
            },
            {
                name: 'tradingStockManagement',
                description: 'Manage stocks',
                use: ['tradingStockShow']
            },
            {
                name: 'tradingStockShow',
                description: 'Show stocks'
            },
            {
                name: 'tradingWithdrawManagement',
                description: 'Manage withdraws',
                use: ['tradingWithdrawShow']
            },
            {
                name: 'tradingWithdrawShow',
                description: 'Show withdraw'
            },
            {
                name: 'tradingCustomerFeeManagement',
                description: 'Manage customer fee',
                use: ['tradingCustomerFeeShow']
            },
            {
                name: 'tradingCustomerFeeShow',
                description: 'Show customer fee'
            },
            {
                name: 'tradingWalletManagement',
                description: 'Manage wallets',
                use: ['tradingWalletShow']
            },
            {
                name: 'tradingWalletShow',
                description: 'Show wallets'
            },
            {
                name: 'tradingStatementShow',
                description: "Show statements"
            },
        ]
    },
}