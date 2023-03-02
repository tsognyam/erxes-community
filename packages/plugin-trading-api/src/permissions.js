module.exports = {
    trading: {
        name: 'trading',
        description: 'Trading',
        actions: [
            {
                name: 'tradingAll',
                description: 'All',
                use: ['trading']
            },
            {
                name: 'tradingRole',
                description: 'Арилжаа хийх эрх',
            },
            {
                name: 'withdrawRole',
                description: "Мөнгө хүсэх эрх"
            },
            {
                name: 'customerManagementRole',
                description: 'Харилцагчийн мэдээлэл'
            },
            {
                name: 'securitiesManagement',
                description: ''
            }
        ]
    },
}