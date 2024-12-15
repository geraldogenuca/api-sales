-- MySQL Workbench Synchronization
-- Generated: 2024-12-14 19:32
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Administrator

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER SCHEMA `api-sales`  DEFAULT COLLATE utf8_unicode_ci ;

ALTER TABLE `api-sales`.`users` 
COLLATE = utf8_unicode_ci ,
CHANGE COLUMN `user_name` `user_name` VARCHAR(150) NULL DEFAULT NULL ,
CHANGE COLUMN `user_email` `user_email` VARCHAR(50) NOT NULL ,
CHANGE COLUMN `user_cpf` `user_cpf` INT(15) NOT NULL ,
CHANGE COLUMN `user_password` `user_password` VARCHAR(150) NOT NULL ,
CHANGE COLUMN `user_phone` `user_phone` INT(13) NULL DEFAULT NULL ;

ALTER TABLE `api-sales`.`products` 
COLLATE = utf8_unicode_ci ,
CHANGE COLUMN `product_name` `product_name` VARCHAR(150) NOT NULL ,
CHANGE COLUMN `product_description` `product_description` VARCHAR(255) NULL DEFAULT NULL ,
CHANGE COLUMN `product_image` `product_image` VARCHAR(500) NULL DEFAULT NULL ;

CREATE TABLE IF NOT EXISTS `api-sales`.`orders` (
  `order_id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) NOT NULL,
  `order_quantity` INT(11) NOT NULL,
  `order_price` DOUBLE NOT NULL,
  PRIMARY KEY (`order_id`, `product_id`),
  INDEX `fk_orders_products1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_orders_products1`
    FOREIGN KEY (`product_id`)
    REFERENCES `api-sales`.`products` (`product_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
