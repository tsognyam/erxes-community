//running here...
export const types = `
type tradingCustFee @key(fields:"id") {
    id:Int!
    userId:String
    user:JSON
    stocktypeId:Int
    name:String
    name2:String
    descr:String
    value:Float
    sidetype:Int
    updateddate:Date
    updatedby:Int
    status:Int
   
}
type tradingCustFeeList {
    total:Int
    count:Int
    values:[tradingCustFee]
}
`;

const inputParams = `
stockcode:Int
userId:String
`;

const listParams = `
stockcode:Int
userId:String
stocktypeId:Int
`;

const updateParams = `
id:Int!
name:String
name2:String
stocktypeId:Int
userId:String
value:Float
`;
export const queries = `
tradingCustFeeByStock(${inputParams}):Float
tradingCustFeeGetList(${listParams}):tradingCustFeeList
`;
export const mutations = `
tradingCustFeeUpdate(${updateParams}):tradingCustFee
`;
