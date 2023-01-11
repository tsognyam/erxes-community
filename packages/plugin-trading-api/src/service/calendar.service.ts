import CalendarRepository from '../repository/calendar.repository';
import CalendarValidator from './validator/calendar.validator';
export default class CalendarService {
  private calendarRepository: CalendarRepository;
  private calendarValidator: CalendarValidator;
  constructor() {
    this.calendarRepository = new CalendarRepository();
    this.calendarValidator = new CalendarValidator();
  }
  create = async (params: any) => {
    // await this.calendarValidator.validateCreate(params.code);
    return this.calendarRepository.create(params);
  };
  update = async (id: number, params: any) => {
    // await this.calendarValidator.validateUpdate(id, params);
    return this.calendarRepository.update(id, params);
  };
  remove = async (id: number) => {
    // await this.calendarValidator.validateRemove(id);
    return this.calendarRepository.delete(id);
  };
  list = async () => {
    let data = await this.calendarRepository.findMany();
    return data;
  };
  dateBetween = async params => {
    let where = {
      ...params
    };
    let result = await this.calendarRepository.findAll(where);
    return result;
  };
  isVday = async date => {
    //check vacation day
  };
}
