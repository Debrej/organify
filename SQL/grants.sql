REVOKE ALL PRIVILEGES ON `organify`.* FROM 'organify'@'localhost';
REVOKE ALL PRIVILEGES ON `organify`.* FROM 'auth_organify'@'localhost';

GRANT ALL PRIVILEGES ON `organify`.`ORGA` TO 'organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`SHIFT` TO 'organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`SHIFT_ORGA` TO 'organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`SHIFT_TASK` TO 'organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`SUBSHIFT` TO 'organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`TASK_ORGA` TO 'organify'@'localhost';
GRANT SELECT ON `organify`.`TOKEN` TO 'organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`TASK` TO 'organify'@'localhost';

GRANT ALL PRIVILEGES ON `organify`.`ORGA` TO 'auth_organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`PWD` TO 'auth_organify'@'localhost';
GRANT ALL PRIVILEGES ON `organify`.`TOKEN` TO 'auth_organify'@'localhost';