import CalendarRepository from '../../repository/calendar.repository';
import BaseValidator from './base.validator';
class CalendarValidator extends BaseValidator {
  validateParams = params => {
    const { data } = this.validate(
      {
        year: this._joi.number().required(),
        month: this._joi.number().required(),
        day: this._joi.number().required(),
        fullDate: this._joi.date().required()
      },
      params
    );

    return { data };
  };

  validateUpdateParams = async params => {
    const { data } = this.validate(
      {
        id: this._joi.number().required(),
        year: this._joi.number().required(),
        month: this._joi.number().required(),
        day: this._joi.number().required(),
        date: this._joi.date().required()
      },
      params
    );

    return { data };
  };
}

export default CalendarValidator;
