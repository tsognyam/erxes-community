import BankRepository from '../../repository/bank.repository';
import BaseValidator from './base.validator';

export default class BankValidator extends BaseValidator {
  private bankRepository: BankRepository = new BankRepository();
  check = async (bankCode: string) => {
    let bank = await this.bankRepository.findUnique({
      code: bankCode
    });
    if (bank == undefined) throw new Error('Bank not found');
    return bank;
  };
  validateCreate = async (code: string) => {
    let bank = await this.bankRepository.findUnique({
      code: code
    });
    if (bank) throw new Error('Bank code duplicated');
  };
  validateUpdate = async (params: any) => {
    let bank = await this.bankRepository.findUnique({
      code: params.bankCode,
      NOT: {
        id: params.id
      }
    });
    if (bank) throw new Error('Bank code duplicated');
    return bank;
  };
  validateRemove = async (id: number) => {
    let bank = await this.bankRepository.findUnique({
      id: id
    });
    if (bank == undefined) throw new Error('Bank not found');
  };
}
