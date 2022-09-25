import BaseRepository from './base.repository';

export default class StockRepository extends BaseRepository {
  constructor() {
    super('stocktype');
  }
}
