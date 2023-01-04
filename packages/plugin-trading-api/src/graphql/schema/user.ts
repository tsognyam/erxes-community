export const types = `
type TradingUser @key(fields:"id") {
    id:Int!
    uuid: String!
    identityType:String
    familyName:String
    lastName:String
    firstName:String
    birthday:Date
    registerNumber:String
    passportNumber:String
    education:JSON
    gender:String
    nation:JSON
    profession:String
    position:String
    companyName:String
    email:String
    phone:String
    workPhone:String
    handPhone:String
    externalId:Int
    status:Int
    custType:Int
    sourceCode:Int
    description:String
    isAdditional:Boolean
    UserBankAccounts:JSON
    UserAddress:JSON
    wallets:JSON
    UserContract:JSON
    UserMCSDAccount:JSON
    UserAdditionalInfo:JSON
    UserRelation:JSON
    Custfee:JSON
    createdUserId: Int
    updatedAt: Date
    updatedUserId: Int
    
}`;

const createParams = `
uuid:String!,
registerNumber:String!
passportNumber:String
educationId:Int
gender:String!
nationId:Int
profession:String!
position:String!
companyName:String
email:String!
phone:String!
workPhone:String
handPhone:String
custType:Int
type:Int
country:Int
city:Int
district:Int
subDistrict:String
address:String
`;
const createAdditional = `
userId:Int!
status:                 Int
  monthlyIncome:          String 
  employ:               String 
  hasBusiness:            Boolean
  companyName:            String
  companyType:            String
  yearlySales:            String
  politician:             Boolean 
  relation:               String 
  relationName:           String 
  salesAndBusinessIncome: String 
  contractIncome:         String 
  investmentIncome:       String 
  assetSoldIncome:        String 
  salaryIncome:           String 
  familyIncome:           String 
  familyCharityIncome:    String 
  otherIncome:            String 
  createdAt:              Date
  createdUserId:          Int
  updatedAt:              Date
  updatedUserId:          Int
`;
const updateParams = `
userId:Int!,
registerNumber:String
passportNumber:String
educationId:Int
gender:String
nationId:Int
profession:String
position:String
companyName:String
email:String
phone:String
workPhone:String
handPhone:String
custType:Int
`;
const inputParams = `
prefix:String
`;
const inputMutationParams = `
userId:String
bdcAccountId:String
`;
export const queries = `
tradingUser(${inputParams}):[TradingUser]
`;
export const mutations = `
tradingUserCooperate(${inputMutationParams}):JSON
`;
