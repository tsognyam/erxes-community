import ErrorException from './error-exception';

class ErrorCode {
  static Unauthenticated = 'Unauthenticated';
  static NotFound = 'NotFound';
  static MaximumAllowedGrade = 'MaximumAllowedGrade';
  static AsyncError = 'AsyncError';
  static UnknownError = 'UnknownError';
  static InvalidParam = 'Invalid Parameter';
  static InvalidWalletId = 'Invalid walletId';
  static WalletNotFoundException = {
    status: 1000,
    message: 'wallet not found'
  };

  static CurrencyNotFoundException = {
    status: 1001,
    message: 'Currency not found'
  };

  static TransactionOrderNotFoundException = {
    status: 1002,
    message: 'Transaction order not found'
  };

  static DuplicateUserException = {
    status: 1003,
    message: 'Duplicate user'
  };

  static WalletCurrencyException = {
    status: 1004,
    message: 'Invalid wallet. Currency didnt match'
  };

  static WalletBalanceException = {
    status: 1005,
    message: 'Balance not enough'
  };

  static StockWalletNotFoundException = {
    status: 1006,
    message: 'Stock not found'
  };

  static UserNotFoundException = {
    status: 1007,
    message: 'User not found'
  };

  static WalletDuplicateCurrencyException = {
    status: 1008,
    message: 'Wallet currency duplicated'
  };

  static WithdrawNotFoundException = {
    status: 1009,
    message: 'Withdraw request not found'
  };

  static InvalidUserAccountException = {
    status: 1010,
    message: 'Invalid user account '
  };

  static WithdrawAlreadyConfirmedException = {
    status: 1011,
    message: 'Withdraw already confirmed'
  };

  static InvalidParamException = {
    status: 1012,
    message: 'Invalid parameter'
  };

  static TransactionAlreadyConfirmedException = {
    status: 1013,
    message: 'Transaction already confirmed'
  };

  static RegisterNumberDuplicatedException = {
    status: 1014,
    message: 'Register number duplicated'
  };

  static SendConfirmCodeException = {
    status: 1015,
    message: 'Error while sending confirmation code'
  };

  static CityNotFoundException = {
    status: 1016,
    message: 'City not found'
  };

  static CountryNotFoundException = {
    status: 1017,
    message: 'Country not found'
  };

  static DistrictNotFoundException = {
    status: 1018,
    message: 'District not found'
  };

  static RegisterNumberMismatchException = {
    status: 1019,
    message: 'Register number mismatch'
  };

  static WalletStockBalanceException = {
    status: 1020,
    message: 'Stock balance not enough'
  };

  static InvalidParticipateAmountException = {
    status: 1021,
    message: 'Invalid participate amount'
  };

  static MustBeNumberException = {
    status: 1022,
    message: 'Must be number'
  };

  static SettlementNotFoundException = {
    status: 1023,
    message: 'Settlement Not Found'
  };

  static SettlementAlreadyExecutedException = {
    status: 1024,
    message: 'Settlement Already Executed'
  };

  static InvalidWalletException = {
    status: 1025,
    message: 'InvalidWalletException'
  };
  static NominalWalletNotFoundException = {
    status: 1026,
    message: 'Nominal currency wallet not found'
  };

  static UserBankNotFoundException = {
    status: 1027,
    message: 'User bank information not found'
  };
  static ExchangeNotFoundException = {
    status: 1100,
    message: 'Exchange not found'
  };
  static StockNotFoundException = {
    status: 1101,
    message: 'Stock not found'
  };
  static StockAlreadyException = {
    status: 1102,
    message: 'Stock already created'
  };
  static StockTypeNotFoundException = {
    status: 1103,
    message: 'Stocktype is invalid'
  };
  static CustFeeNotFoundException = {
    status: 1104,
    message: 'Custfee not found'
  };
  static CustFeeAlreadyException = {
    status: 1105,
    message: 'Custfee already created'
  };
  static OrderCannotCancelException = {
    status: 1106,
    message: 'Cannot cancel order'
  };
  static OrderNotFoundException = {
    status: 1107,
    message: 'Order not found'
  };
  static OrderTypeNotFoundException = {
    status: 1108,
    message: 'Ordertype is invalid'
  };
  static OrderCannotUpdateException = {
    status: 1109,
    message: 'Order cannot update'
  };
  static StockFavAlreadyException = {
    status: 1120,
    message: 'Stock already added to favourite list'
  };

  static StockFavNotFoundException = {
    status: 1121,
    message: 'Stock not found on list'
  };

  static MITOrderNotFoundException = {
    status: 1122,
    message: 'Not receive yet status report from MIT'
  };

  static NotConnectedtoMITException = {
    status: 1123,
    message: 'Not connected to MIT'
  };

  static CannotOrderMarketException = {
    status: 1124,
    message: 'Cannot order market'
  };

  static UnconfirmedUserException = {
    status: 1201,
    message: 'Unconfirmed user'
  };

  static NotActiveUserException = {
    status: 1202,
    message: 'User is inactive or waiting confirmation'
  };

  static UserActivatedException = {
    status: 1203,
    message: 'User has already activated'
  };

  static ContractNotFoundException = {
    status: 1204,
    message: 'Contract not found'
  };

  static BankNotFoundException = {
    status: 1205,
    message: 'Bank not found'
  };

  static UserCreatedException = {
    status: 1206,
    message: 'User has already created'
  };

  static ImagePathNotFoundException = {
    status: 1207,
    message: 'Invalid image path'
  };

  static NotVerifyTokenException = {
    status: 1208,
    message: 'Cannot verify token'
  };

  static NotFoundJWTPathException = {
    status: 1209,
    message: 'Public JWT key path not found'
  };

  static ErrorANDException = {
    status: 1210,
    message: 'Error during AND service'
  };

  static IdReaderUrlNotFoundException = {
    status: 1211,
    message: 'Identification Reader service uri not found'
  };

  static IdentificationUrlNotFoundException = {
    status: 1212,
    message: 'Identification service uri not found'
  };

  static GroupNotFoundException = {
    status: 1213,
    message: 'Group not found'
  };

  static UnableToJoinGroupException = {
    status: 1214,
    message: 'Unable to join group'
  };

  static CannotRemoveException = {
    status: 1215,
    message: 'Cannot remove'
  };

  static NotFoundMCSDAccountException = {
    status: 1216,
    message: 'Not found MCSD account'
  };

  static FaceCompareUrlNotFoundException = {
    status: 1217,
    message: 'FaceCompareUrlNotFoundException'
  };

  static ANDIpoSystemLoginErrorException = {
    status: 1300,
    message: 'AND IPO system Username or password incorrect'
  };
  static IpoCannotUpdateException = {
    status: 1301,
    message: 'IPO cannot update'
  };
  static NotFoundIpoException = {
    status: 1302,
    message: 'Not found ipo order'
  };
  static QpayLoginErrorException = {
    status: 1400,
    message: 'Cannot login qpay'
  };
  static QpayInvoiceNotFoundException = {
    status: 1401,
    message: 'Qpay Invoice not found'
  };
  static QpayBaseUrlNotFoundException = {
    status: 1402,
    message: 'Qpay base url not found'
  };

  static DuplicateException = {
    status: 1403,
    message: 'Duplicate error'
  };

  static NotBondException = {
    status: 1404,
    message: 'That stock must be bond'
  };

  static NotQualifyDataException = {
    status: 1405,
    message:
      'Does not qualify data of stock, intrate startdate enddate notiftype'
  };

  static NotQualifyPriceException = {
    status: 1406,
    message: 'Not qualify bond price'
  };
  static NotRequireToUpdateException = {
    status: 1407,
    message: 'Not required to update'
  };
  static UserMCSDAccountNotFoundException = {
    status: 1408,
    message: 'Not found User MCSD Account'
  };
  static getExceptionList = () => {
    return Object.keys(ErrorCode).filter(
      value => value.substring(value.length - 9) == 'Exception'
    );
  };
  static getList = () => {
    let obj = this.getExceptionList();
    let description = '';
    obj.forEach(key => {
      description +=
        '\n\t|' +
        ErrorCode[key].status +
        '|' +
        ErrorCode[key].message +
        '|' +
        key;
    });
    return description;
  };
}
export const CustomException = (data: any) => {
  throw new ErrorException(data);
};
export { ErrorCode };
