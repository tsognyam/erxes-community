import BaseRepository from '../base.repository';

export default class UserBankAccountRepository extends BaseRepository {
  static instance: UserBankAccountRepository;

  static get() {
    if (this.instance == null) {
      this.instance = new UserBankAccountRepository();
    }

    return this.instance;
  }
  constructor() {
    super('userBankAccount');
  }
}
