const jwt = require('jsonwebtoken');
const fs = require('fs');
const UserRepository = require('../repository/user/user.repository');
const ActivityLogRepository = require('../repository/activityLog.repository');
const {
  NotVerifyTokenException,
  UserNotFoundException,
  NotFoundJWTPathException
} = require('../exception/error');
const dotenv = require('dotenv');
const { loggerAccess } = require('../middleware/logger');
const { createPublicKey } = require('crypto');
dotenv.config();
const activityLogRepo = ActivityLogRepository.get();
const repository = new UserRepository();
// const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const ALLOWED_ALGORITHM = ['RS256'];

exports.getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

const getPublicKey = () => {
  if (!fs.existsSync(PUBLIC_KEY_PATH)) {
    throw new NotFoundJWTPathException();
  }

  return fs.readFileSync(PUBLIC_KEY_PATH);
};

exports.verifyToken = token => {
  // const publicKey = getPublicKey();

  const publicKey = Buffer.from(PUBLIC_KEY, 'base64');
  let key = publicKey.toString('ascii');

  let verify = {};
  try {
    verify = jwt.verify(token, key, {
      algorithms: ALLOWED_ALGORITHM
    });
  } catch (error) {
    throw new NotVerifyTokenException();
  }

  return verify;
  // return { id: 1}
};

exports.authenticateToken = async (req, res, next) => {
  try {
    let token = req.body.token || req.headers['x-access-token'];
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
      token = bearerHeader.split(' ')[1];
    }
    req.user = await this.extractToken(token);
    next();
  } catch (err) {
    req.next(err);
  }
};

exports.extractTokenWS = async token => {
  if (!token) {
    return undefined;
  }

  let verify = {};
  try {
    verify = this.verifyToken(token);
  } catch (error) {
    return undefined;
  }

  const user = await repository.findByUuid(verify.userUuid);

  if (!user) {
    return undefined;
  }
  return user;
};
exports.extractToken = async token => {
  if (!token) {
    throw new NotVerifyTokenException();
  }

  let verify = {};
  try {
    verify = this.verifyToken(token);
  } catch (error) {
    throw new NotVerifyTokenException();
  }

  const user = await repository.findByUuid(verify.userUuid);

  if (!user) {
    throw new UserNotFoundException();
  }
  return user;
};

exports.activityLog = async (req, res, next) => {
  this.saveLog(req, '');
  next();
};
exports.saveLog = async (req, res) => {
  loggerAccess.info(req);
  loggerAccess.info({
    rawHeaders: req.rawHeaders,
    path: req.method + ' method path:' + req.originalUrl,
    body: req.body,
    resBody: JSON.stringify(res).substring(0, 1000)
  });

  let data = {
    userId: req.user.id,
    baseUrl: req.baseUrl,
    requestUrl: req.originalUrl,
    requestType: req.method,
    requestHeader: req.rawHeaders.toString(),
    requestBody: JSON.stringify(req.body).substring(0, 1000),
    responseBody: JSON.stringify(res).substring(0, 1000)
  };
  await activityLogRepo.create(data);
};
const getMethodChecker = (req, group) => {
  if (
    !Object.prototype.hasOwnProperty.call(req.params, 'userId') ||
    undefined === req.params.userId
  ) {
    return true;
  }

  if (
    Object.prototype.hasOwnProperty.call(req.params, 'userId') &&
    undefined !== group
  ) {
    return true;
  }
};

const postMethodChecker = (req, group) => {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'userId')) {
    return true;
  }

  if (
    Object.prototype.hasOwnProperty.call(req.body, 'userId') &&
    undefined !== group
  ) {
    return true;
  }
};

exports.checkIsAdmin = async (req, res, next) => {
  const group = req.user.UserGroup.find(
    group => 'GROUP_ADMIN' === group.Group.group
  );

  let result;
  switch (req.method) {
    case 'GET':
      result = getMethodChecker(req, group);
      break;
    case 'POST':
      result = postMethodChecker(req, group);
      break;
    case 'PUT':
      result = postMethodChecker(req, group);
      break;
    case 'DELETE':
      result = postMethodChecker(req, group);
      break;
  }

  if (result) return next();

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_VIEW')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkFeeRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_CUSTFEE')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkCustRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_CUST')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkSecuritiesRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_SECURITIES')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkTradeRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_TRADE')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkWalletRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_WALLET')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkSystemRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_SYSTEM')) {
    return next();
  }

  return res.status(401).send({
    status: 1,
    message: 'Access denied'
  });
};

exports.checkUser = async (req, res, next) => {
  if (!req.user.roles.includes('ROLE_ADMIN_VIEW')) {
    req.body.userId = req.user.id;
  }
  return next();
};

exports.checkParam = async (req, res, next) => {
  if (!req.user.roles.includes('ROLE_ADMIN_VIEW')) {
    req.params.userId = req.user.id;
  }
  return next();
};

exports.checkOrderRole = async (req, res, next) => {
  if (req.user.roles.includes('ROLE_ADMIN_VIEW')) {
    if (!req.user.roles.includes('ROLE_ADMIN_TRADE')) {
      return res.status(401).send({
        status: 1,
        message: 'Access denied'
      });
    }
  }

  return next();
};
