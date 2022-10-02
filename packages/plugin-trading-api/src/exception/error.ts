import ErrorException from './error-exception';
import ErrorCode from './error-code';

const exportList: any = [];
ErrorCode.getExceptionList().forEach(key => {
  exportList[key] = class extends ErrorException {
    constructor(message = undefined) {
      super(undefined, message, key);
    }
  };
});
module.exports = {
  exportList
};
