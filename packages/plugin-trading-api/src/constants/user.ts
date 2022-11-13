import BaseConst from './base';

export class UserConst extends BaseConst {
  static REGISTER_NUMBER_PATTERN = RegExp(/[А-ЯӨҮЁа-яөүё]{2}[0-9]{8}/);
  static PASSWORD_POLICY = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  );
  static TYPE_ADMIN = 0;
  static TYPE_USER = 1;

  static GENDER_MALE = 'Male';
  static GENDER_FEMALE = 'Female';

  // static CUST_TYPE_ADMIN = 0;
  // static CUST_TYPE_USER = 1;

  static TYPE_ADULT_CUSTOMER = 1;
  static TYPE_FOREIGN_CUSTOMER = 2;
  static TYPE_ORGINIZATION_CUSTOMER = 3;
  static TYPE_CHILD_CUSTOMER = 4;

  static STATUS_CONFIRMED = 3;
  static STATUS_PENDING_PAYMENT = 4;
  static STATUS_PAID = 5;
  static STATUS_MCSD_PENDING = 6;
  static STATUS_MCSD_ERROR = 7;
}
export class UserFilesConst extends BaseConst {
  static STATUS_ORIGINAL = 3;

  static TYPE_NATIONAL_CARD_FRONT = 1;
  static TYPE_NATIONAL_CARD_BACK = 2;
  static TYPE_BIRTH_CERTIFICATE = 3;
  static TYPE_SIGNATURE = 4;
  static TYPE_PROFILE = 5;
  static TYPE_OTHER = 6;

  static getTypes = () => [
    UserFilesConst.TYPE_BIRTH_CERTIFICATE,
    UserFilesConst.TYPE_NATIONAL_CARD_FRONT,
    UserFilesConst.TYPE_NATIONAL_CARD_BACK,
    UserFilesConst.TYPE_SIGNATURE,
    UserFilesConst.TYPE_PROFILE,
    UserFilesConst.TYPE_OTHER
  ];
}
export class UserStepConst {
  static STEP_1 = 1;
  static STEP_2 = 2;
  static STEP_3 = 3;
  static STEP_4 = 4;
  static STEP_5 = 5;
}
