import { Container } from 'typedi';

export default ({
  sequelize, logger, UserService, AuthService, AccountService
}) => {
  Container.set('sequelizeInstance', sequelize);
  Container.set('loggerInstance', logger);

  // dependency order is important, services are dependant of sequelize and logger
  Container.set('userService', new UserService());
  Container.set('authService', new AuthService());
  Container.set('accountService', new AccountService());
}