import { Prisma } from '@prisma/client';
import BankRepository from '../repository/bank.repository';
import BankValidator from './validator/bank.validator';

export default class BankService {
  private bankRepository: BankRepository;
  private bankValidator: BankValidator;
  constructor() {
    this.bankRepository = new BankRepository();
    this.bankValidator = new BankValidator();
  }
  create = async (params: Prisma.BankCreateInput) => {
    await this.bankValidator.validateCreate(params.code);
    return this.bankRepository.create(params);
  };
  update = async (id: number, params: Prisma.BankUpdateInput) => {
    await this.bankValidator.validateUpdate(id, params);
    return this.bankRepository.update(id, params);
  };
  remove = async (id: number) => {
    await this.bankValidator.validateRemove(id);
    return this.bankRepository.delete(id);
  };
  list = async () => {
    let data = await this.bankRepository.findMany();
    return data;
  };
  detail = async (id: number) => {
    return this.bankRepository.findUnique({
      id: id
    });
  };
}
