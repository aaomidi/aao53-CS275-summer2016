CREATE TABLE IF NOT EXISTS `amir_cs275`.`l3_students` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `studentID`  INT UNSIGNED NOT NULL,
  `name_first` VARCHAR(32)  NOT NULL,
  `name_last`  VARCHAR(32)  NOT NULL,
  `age`        INT UNSIGNED NULL,
  `major`      VARCHAR(64)  NULL,
  `ts`         TIMESTAMP    NULL     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `studentID_UNIQUE` (`studentID` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE IF NOT EXISTS `amir_cs275`.`l3_grades` (
  `id`         INT                                        NOT NULL AUTO_INCREMENT,
  `studentID`  INT UNSIGNED                               NOT NULL,
  `courseName` VARCHAR(16)                                NOT NULL,
  `termTaken`  ENUM('fall', 'winter', 'spring', 'summer') NOT NULL,
  `grade`      ENUM('A', 'B', 'C', 'D', 'F')              NOT NULL,
  `ts`         TIMESTAMP                                  NULL     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `studentID_idx` (`studentID` ASC),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `studentID_link`
  FOREIGN KEY (`studentID`)
  REFERENCES `amir_cs275`.`l3_students` (`studentID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
