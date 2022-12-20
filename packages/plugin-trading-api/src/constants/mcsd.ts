export class McsdConst {
  static BANK_CODE_MONGOLBANK = '01';
  static BANK_CODE_TDB = '04';
  static BANK_CODE_KHAN = '05';
  static BANK_CODE_GOLOMT = '15';
  static BANK_CODE_TEEVER = '19';
  static BANK_CODE_ARIG = '21';
  static BANK_CODE_CREDIT = '22';
  static BANK_CODE_ZOOS = '24';
  static BANK_CODE_ULAANBAATAR_KHOT = '26';
  static BANK_CODE_UNDESNII_KHORONGO_ORUULALT = '29';
  static BANK_CODE_CAPITRON = '30';
  static BANK_CODE_KHAS = '32';
  static BANK_CODE_CHINGIS_KHAN = '33';
  static BANK_CODE_TORIIN = '34';
  static BANK_CODE_KHOGJILIIN = '36';
  static BANK_CODE_BOGD = '38';
  static BANK_CODE_MOBI_FINANCE = '50';
  static BANK_CODE_ARD_CREDIT = '52';

  static BANK_NAME_MONGOLBANK = 'Төв Монголбанк';
  static BANK_NAME_TDB = 'Худалдаа хөгжлийн банк';
  static BANK_NAME_KHAN = 'ХААН банк';
  static BANK_NAME_GOLOMT = 'Голомт банк';
  static BANK_NAME_TEEVER = 'Тээвэр хөгжлийн банк';
  static BANK_NAME_ARIG = 'Ариг банк';
  static BANK_NAME_CREDIT = 'Кредит банк';
  static BANK_NAME_ZOOS = 'Зоос банк';
  static BANK_NAME_ULAANBAATAR_KHOT = 'Улаанбаатар хотын банк';
  static BANK_NAME_UNDESNII_KHORONGO_ORUULALT = 'Үндэсний хөрөнгө оруулалтын банк';
  static BANK_NAME_CAPITRON = 'Капитрон банк';
  static BANK_NAME_KHAS = 'Хас банк';
  static BANK_NAME_CHINGIS_KHAN = 'Чингис хаан банк';
  static BANK_NAME_TORIIN = 'Төрийн банк';
  static BANK_NAME_KHOGJILIIN = 'Хөгжлийн банк';
  static BANK_NAME_BOGD = 'Богд банк';
  static BANK_NAME_MOBI_FINANCE = 'МОБИФИНАНС ББСБ';
  static BANK_NAME_ARD_CREDIT = 'Ард Кредит ББСБ';

  static CUSTOMER_TYPE_CITIZEN = 0;
  static CUSTOMER_TYPE_AAN = 1;

  static RESPONSE_CODE_SUCCESS = '1';
  static RESPONSE_CODE_FAILED = '0';

  static getTypes = (code) => {
    let dict = {};
    dict[this.BANK_CODE_MONGOLBANK] = McsdConst.BANK_NAME_MONGOLBANK;
    dict[this.BANK_CODE_TDB] = McsdConst.BANK_NAME_TDB;
    dict[this.BANK_CODE_KHAN] = McsdConst.BANK_NAME_KHAN;
    dict[this.BANK_CODE_GOLOMT] = McsdConst.BANK_NAME_GOLOMT;
    dict[this.BANK_CODE_TEEVER] = McsdConst.BANK_NAME_TEEVER;
    dict[this.BANK_CODE_ARIG] = McsdConst.BANK_NAME_ARIG;
    dict[this.BANK_CODE_CREDIT] = McsdConst.BANK_NAME_CREDIT;
    dict[this.BANK_CODE_ZOOS] = McsdConst.BANK_NAME_ZOOS;
    dict[this.BANK_CODE_ULAANBAATAR_KHOT] = McsdConst.BANK_NAME_ULAANBAATAR_KHOT;
    dict[this.BANK_CODE_UNDESNII_KHORONGO_ORUULALT] = McsdConst.BANK_NAME_UNDESNII_KHORONGO_ORUULALT;
    dict[this.BANK_CODE_CAPITRON] = McsdConst.BANK_NAME_CAPITRON;
    dict[this.BANK_CODE_KHAS] = McsdConst.BANK_NAME_KHAS;
    dict[this.BANK_CODE_CHINGIS_KHAN] = McsdConst.BANK_NAME_CHINGIS_KHAN;
    dict[this.BANK_CODE_TORIIN] = McsdConst.BANK_NAME_TORIIN;
    dict[this.BANK_CODE_KHOGJILIIN] = McsdConst.BANK_NAME_KHOGJILIIN;
    dict[this.BANK_CODE_BOGD] = McsdConst.BANK_NAME_BOGD;
    dict[this.BANK_CODE_MOBI_FINANCE] = McsdConst.BANK_NAME_MOBI_FINANCE;
    dict[this.BANK_CODE_ARD_CREDIT] = McsdConst.BANK_NAME_ARD_CREDIT;

    return dict[code];
  };

  static bankGWGetTypes = (code) => {
    let dict = {};
    dict[this.BANK_CODE_TDB] = BankGWConst.TDBM;
    dict[this.BANK_CODE_KHAN] = BankGWConst.KH;
    dict[this.BANK_CODE_GOLOMT] = BankGWConst.GMT;
    dict[this.BANK_CODE_TEEVER] = BankGWConst.TRB;
    dict[this.BANK_CODE_ARIG] = BankGWConst.ARB;
    dict[this.BANK_CODE_CREDIT] = BankGWConst.CRB;
    dict[this.BANK_CODE_ULAANBAATAR_KHOT] = BankGWConst.UB;
    dict[this.BANK_CODE_UNDESNII_KHORONGO_ORUULALT] = BankGWConst.NI;
    dict[this.BANK_CODE_CAPITRON] = BankGWConst.CAPR;
    dict[this.BANK_CODE_KHAS] = BankGWConst.KHS;
    dict[this.BANK_CODE_TORIIN] = BankGWConst.TUR;
    dict[this.BANK_CODE_KHOGJILIIN] = BankGWConst.NDB;
    dict[this.BANK_CODE_BOGD] = BankGWConst.BGDB;
    dict[this.BANK_CODE_MOBI_FINANCE] = BankGWConst.MOBIF;
    dict[this.BANK_CODE_ARD_CREDIT] = BankGWConst.ARDF;

    return dict[code];
  };
}

class BankGWConst {
  static TDBM = "TDBM";
  static CAPL = "CAPL";
  static KH = "KH";
  static GMT = "GMT";
  static ARB = "ARB";
  static UB = "UB";
  static NI = "NI";
  static CAPR = "CAPR";
  static KHS = "KHS";
  static TUR = "TUR";
  static NDB = "NDB";
  static BGDB = "BGDB";
  static STF = "STF";
  static TRB = "TRB";
  static CRB = "CRB";
  static BGD = "BGD";
  static MOBIF = "MOBIF";
  static HiPAY = "HiPAY";
  static ARDF = "ARDF";
}
export class McsdAccountConst {
  static STATUS_PENDING = 0;
  static STATUS_CREATED = 1;
  static STATUS_ERROR = 2;
}
