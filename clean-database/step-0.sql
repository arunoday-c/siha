CREATE DATABASE  IF NOT EXISTS `algaeh_clean_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `algaeh_clean_db`;
-- MySQL dump 10.13  Distrib 8.0.20, for macos10.15 (x86_64)
--
-- Host: 124.40.244.150    Database: algaeh_clean_db
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `algaeh_d_api_auth`
--

DROP TABLE IF EXISTS `algaeh_d_api_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_api_auth` (
  `algaeh_d_api_auth_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `created_date` date DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_date` date DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_api_auth_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_component`
--

DROP TABLE IF EXISTS `algaeh_d_app_component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_component` (
  `algaeh_d_app_component_id` int NOT NULL AUTO_INCREMENT,
  `screen_id` int NOT NULL,
  `component_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `component_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_app_component_id`),
  UNIQUE KEY `component_code_UNIQUE` (`component_code`),
  KEY `algaeh_d_app_component_fk1_idx` (`created_by`),
  KEY `algaeh_d_app_component_fk2_idx` (`updated_by`),
  KEY `algaeh_d_app_component_fk3_idx` (`screen_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_component_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_component_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_component_fk3` FOREIGN KEY (`screen_id`) REFERENCES `algaeh_d_app_screens` (`algaeh_app_screens_id`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_config`
--

DROP TABLE IF EXISTS `algaeh_d_app_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_config` (
  `algaeh_d_app_config_id` int NOT NULL,
  `param_category` varchar(250) DEFAULT NULL,
  `param_name` varchar(250) NOT NULL,
  `param_value` varchar(500) NOT NULL,
  `episode_id` int DEFAULT NULL,
  `encounter_id` int DEFAULT NULL,
  `param_sequence` int DEFAULT NULL,
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` varchar(45) NOT NULL DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_app_config_id`),
  KEY `algaeh_d_app_config_idx1` (`param_name`),
  KEY `algaeh_d_app_config_idx2` (`param_value`),
  KEY `algaeh_d_app_config_idx3` (`param_sequence`),
  KEY `algaeh_d_app_config_idx4` (`effective_start_date`),
  KEY `algaeh_d_app_config_idx5` (`effective_end_date`),
  KEY `algaeh_d_app_config_idx6` (`record_status`),
  KEY `algaeh_d_app_config_fk2_idx` (`updated_by`),
  KEY `algaeh_d_app_config_fk1` (`created_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_config_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_config_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_expiry`
--

DROP TABLE IF EXISTS `algaeh_d_app_expiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_expiry` (
  `algaeh_d_app_expiry_id` int NOT NULL AUTO_INCREMENT,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `app_status` enum('A','I') DEFAULT 'A' COMMENT 'A-Active\nI-Inactive',
  PRIMARY KEY (`algaeh_d_app_expiry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_group`
--

DROP TABLE IF EXISTS `algaeh_d_app_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_group` (
  `algaeh_d_app_group_id` int NOT NULL AUTO_INCREMENT,
  `app_group_code` varchar(50) NOT NULL,
  `app_group_name` varchar(250) NOT NULL,
  `app_group_desc` varchar(45) DEFAULT NULL,
  `group_type` enum('SU','L','R','N','P','AD','FD','C','PH','F','I','CEO','D','O') DEFAULT 'O' COMMENT 'SU=Super User,L=Laboratory,R=Radiology,N=Nursing,P=Providers,AD=Admin,FD=Front Desk,C=Cashier,PH=Pharmacy,F=Finance,I=Inventory,CEO=CEO,D=Directors,O=OTHERS',
  `app_group_status` enum('A','I') NOT NULL DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_app_group_id`),
  UNIQUE KEY `app_group_code_UNIQUE` (`app_group_code`),
  UNIQUE KEY `app_group_name_UNIQUE` (`app_group_name`),
  KEY `algaeh_d_app_group_fk1_idx` (`created_by`),
  KEY `algaeh_d_app_group_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_group_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_group_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_module`
--

DROP TABLE IF EXISTS `algaeh_d_app_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_module` (
  `algaeh_d_module_id` int NOT NULL AUTO_INCREMENT,
  `module_code` varchar(45) NOT NULL,
  `module_name` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `licence_key` mediumtext,
  `access_by` enum('SU','OU') NOT NULL DEFAULT 'OU' COMMENT 'SU=SUPER USER (ALGAEH)\\\\nOU=OTHER USERS (ADMIN AND GENERAL USERS)',
  `icons` varchar(45) DEFAULT NULL,
  `other_language` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `display_order` tinyint unsigned DEFAULT NULL,
  `module_plan` enum('S','G','P') DEFAULT 'S' COMMENT 'S-Silver, G-Gold, P-Platinum',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'A=ACTIVE\\\\\\\\nI=INACTIVE',
  PRIMARY KEY (`algaeh_d_module_id`),
  UNIQUE KEY `module_name_UNIQUE` (`module_name`),
  UNIQUE KEY `algaeh_d_module_id_UNIQUE` (`algaeh_d_module_id`),
  UNIQUE KEY `module_code_UNIQUE` (`module_code`),
  KEY `hims_d_module_fk1_idx` (`created_by`),
  KEY `hims_d_module_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_d_module_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_module_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_password`
--

DROP TABLE IF EXISTS `algaeh_d_app_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_password` (
  `algaeh_d_app_password_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `password` varchar(250) NOT NULL COMMENT 'MD5 encrypted password',
  `security_question` varchar(500) DEFAULT NULL,
  `security_answer` varchar(500) DEFAULT NULL,
  `password_change_date` date DEFAULT NULL,
  `password_expiry_date` date DEFAULT NULL,
  `change_password` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT 'Should the user change the password upon first login/on rest',
  `default_pwd` enum('Y','N') DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_app_password_id`),
  UNIQUE KEY `userid_UNIQUE` (`userid`),
  KEY `index2` (`userid`),
  KEY `index3` (`record_status`),
  KEY `algaeh_d_app_password_fk2_idx` (`created_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_password_fk1` FOREIGN KEY (`userid`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_password_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_password_fk3` FOREIGN KEY (`userid`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_roles`
--

DROP TABLE IF EXISTS `algaeh_d_app_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_roles` (
  `app_d_app_roles_id` int NOT NULL AUTO_INCREMENT,
  `app_group_id` int NOT NULL,
  `role_code` varchar(45) NOT NULL,
  `role_name` varchar(50) DEFAULT NULL,
  `role_discreption` varchar(500) DEFAULT NULL,
  `role_type` enum('SU','AD','GN') NOT NULL DEFAULT 'GN' COMMENT 'SU=SUPER USER (ALGAEH),\nAD=ADMIN (HOSPITAL ADMIN),\nGN=GENERAL USER (DOCTOR,NURSE,etc)',
  `default_land_screen_id` int DEFAULT NULL,
  `loan_authorize_privilege` enum('N','1','2','3','4','5','6') DEFAULT 'N' COMMENT '1= LEVEL-1 (low priority),\n2= LEVEL-2 (medium priority)\n3= LEVEL-3 (high priority)\nN=NONE',
  `leave_authorize_privilege` enum('N','1','2','3','4','5','6') DEFAULT 'N' COMMENT '1= LEVEL-1 (low priority),\n2= LEVEL-2 (medium priority)\n3= LEVEL-3 (high priority)\nN=NONE',
  `edit_monthly_attendance` enum('Y','N') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  `finance_authorize_privilege` enum('N','1','2') DEFAULT 'N',
  PRIMARY KEY (`app_d_app_roles_id`),
  UNIQUE KEY `role_code_UNIQUE` (`role_code`),
  KEY `index2` (`app_d_app_roles_id`),
  KEY `app_d_app_roles_fk1_idx` (`created_by`),
  KEY `app_d_app_roles_fk2_idx` (`updated_by`),
  KEY `app_d_app_roles_fk3_idx` (`app_group_id`),
  KEY `record_status_index` (`record_status`),
  KEY `app_d_app_roles_fk4_idx` (`default_land_screen_id`),
  CONSTRAINT `app_d_app_roles_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `app_d_app_roles_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `app_d_app_roles_fk3` FOREIGN KEY (`app_group_id`) REFERENCES `algaeh_d_app_group` (`algaeh_d_app_group_id`),
  CONSTRAINT `app_d_app_roles_fk4` FOREIGN KEY (`default_land_screen_id`) REFERENCES `algaeh_d_app_screens` (`algaeh_app_screens_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_screens`
--

DROP TABLE IF EXISTS `algaeh_d_app_screens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_screens` (
  `algaeh_app_screens_id` int NOT NULL AUTO_INCREMENT,
  `screen_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `screen_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `page_to_redirect` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `redirect_url` varchar(250) DEFAULT NULL,
  `child_pages` varchar(100) DEFAULT NULL,
  `module_id` int NOT NULL,
  `other_language` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT '\\n\\n\\n',
  PRIMARY KEY (`algaeh_app_screens_id`),
  UNIQUE KEY `screen_code_UNIQUE` (`screen_code`),
  KEY `algaeh_d_app_screens_fk1_idx` (`module_id`),
  KEY `algaeh_d_app_screens_fk3_idx` (`created_by`),
  KEY `algaeh_d_app_screens_fk4_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_screens_fk2` FOREIGN KEY (`module_id`) REFERENCES `algaeh_d_app_module` (`algaeh_d_module_id`),
  CONSTRAINT `algaeh_d_app_screens_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_screens_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_scrn_elements`
--

DROP TABLE IF EXISTS `algaeh_d_app_scrn_elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_scrn_elements` (
  `algaeh_d_app_scrn_elements_id` int NOT NULL AUTO_INCREMENT,
  `screen_element_code` varchar(45) DEFAULT NULL,
  `screen_element_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `component_id` int DEFAULT NULL,
  `extra_props` varchar(100) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `props_type` enum('D','S') DEFAULT NULL COMMENT 'Props Type\nD= Decision Making Like Yes/No\nS= Staging Like Levels',
  PRIMARY KEY (`algaeh_d_app_scrn_elements_id`),
  UNIQUE KEY `screen_element_name_UNIQUE` (`screen_element_name`),
  UNIQUE KEY `screen_element_code_UNIQUE` (`screen_element_code`),
  KEY `algaeh_d_app_scrn_elements_fk1_idx` (`updated_by`),
  KEY `algaeh_d_app_scrn_elements_fk2_idx` (`created_by`),
  KEY `algaeh_d_app_scrn_elements_fk3_idx` (`component_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_scrn_elements_fk1` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_scrn_elements_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_d_app_scrn_elements_fk3` FOREIGN KEY (`component_id`) REFERENCES `algaeh_d_app_component` (`algaeh_d_app_component_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_app_user`
--

DROP TABLE IF EXISTS `algaeh_d_app_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_app_user` (
  `algaeh_d_app_user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT 'Login username - search in employee table for available employee ',
  `user_display_name` varchar(250) DEFAULT NULL COMMENT 'Display name when a user logs in',
  `employee_id` int NOT NULL,
  `locked` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT 'Y- User is locked, N- Not locked',
  `login_attempts` int NOT NULL DEFAULT '0' COMMENT 'lock the user for max failed attempts configured in config params',
  `login_attempt_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `password_expiry_rule` enum('Y','N') NOT NULL DEFAULT 'Y' COMMENT 'Should password expiry rules be applied- Y/N',
  `user_status` enum('A','I') NOT NULL DEFAULT 'A' COMMENT 'Is user active/inactive',
  `user_type` enum('SU','AD','D','N','C','O','L','HR','PM') NOT NULL DEFAULT 'O' COMMENT 'SU=SUPER USER, AD=ADMIN, D=DOCTOR, N=NURSE, C=CASHIER, L=LAB TECHNICIAN ,O=OTHERS,HR=HR, PM-Payroll Manager',
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01' COMMENT 'user should be allowed to login from this date',
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31' COMMENT 'User should be allowed to login till this date',
  `login_from` varchar(45) DEFAULT NULL COMMENT 'Login From',
  `attempt_info` longtext,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_app_user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `index3` (`record_status`),
  KEY `index4` (`locked`),
  KEY `algaeh_d_app_user_fk1_idx` (`created_by`),
  KEY `algaeh_d_app_user_fk1_idx1` (`updated_by`),
  KEY `algaeh_d_app_user_fk1_idx2` (`employee_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_d_app_user_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_dashboard`
--

DROP TABLE IF EXISTS `algaeh_d_dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_dashboard` (
  `algaeh_d_dashboard_id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(45) NOT NULL,
  `dashboard_name` varchar(45) DEFAULT NULL,
  `path` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`algaeh_d_dashboard_id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_dashboard_component`
--

DROP TABLE IF EXISTS `algaeh_d_dashboard_component`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_dashboard_component` (
  `algaeh_d_dashboard_component_id` int NOT NULL AUTO_INCREMENT,
  `component_code` varchar(45) NOT NULL,
  `component_name` varchar(75) DEFAULT NULL,
  `widget_type` enum('GRID','INFO_BAR','COLUMN_CHART','BAR_CHART','AREA_CHART','LINE_CHART','PIE_CHART','DONUT_CHART','TIMELINE','GAUGE','TABLE') DEFAULT NULL COMMENT 'GRID,INFO_BAR,COLUMN_CHART,BAR_CHART,AREA_CHART,LINE_CHART,PIE_CHART,DONUT_CHART,TIMELINE,GAUGE,TABLE',
  PRIMARY KEY (`algaeh_d_dashboard_component_id`),
  UNIQUE KEY `component_code_UNIQUE` (`component_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_formulas`
--

DROP TABLE IF EXISTS `algaeh_d_formulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_formulas` (
  `algaeh_d_formulas_id` int NOT NULL COMMENT 'ID',
  `formula_for` varchar(20) DEFAULT NULL COMMENT 'Formula For',
  `formula` varchar(900) DEFAULT NULL COMMENT 'Formula',
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`algaeh_d_formulas_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_d_reports`
--

DROP TABLE IF EXISTS `algaeh_d_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_d_reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `report_type` varchar(45) DEFAULT NULL,
  `report_name` varchar(45) DEFAULT NULL,
  `report_name_for_header` varchar(250) DEFAULT NULL,
  `report_query` text,
  `data_manupulation` longtext,
  `report_input_series` varchar(200) DEFAULT NULL,
  `report_header_file_name` varchar(50) DEFAULT NULL,
  `report_footer_file_name` varchar(50) DEFAULT NULL,
  `uniq_identity_to_report` varchar(45) DEFAULT NULL COMMENT 'Identifier to get report name with identifier',
  `report_props` varchar(250) DEFAULT NULL,
  `status` enum('A','I') DEFAULT 'A',
  `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `update_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_component_role_privilage_mapping`
--

DROP TABLE IF EXISTS `algaeh_m_component_role_privilage_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_component_role_privilage_mapping` (
  `algaeh_m_component_role_privilage_mapping_id` int NOT NULL AUTO_INCREMENT,
  `component_id` int NOT NULL,
  `role_id` int NOT NULL,
  `view_privilege` enum('Y','N') NOT NULL DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`algaeh_m_component_role_privilage_mapping_id`),
  KEY `algaeh_m_component_role_privilage_mapping_fk1_idx` (`component_id`),
  KEY `algaeh_m_component_role_privilage_mapping_fk2_idx` (`role_id`),
  KEY `algaeh_m_component_role_privilage_mapping_fk3_idx` (`created_by`),
  KEY `algaeh_m_component_role_privilage_mapping_fk4_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_m_component_role_privilage_mapping_fk1` FOREIGN KEY (`component_id`) REFERENCES `algaeh_d_app_component` (`algaeh_d_app_component_id`),
  CONSTRAINT `algaeh_m_component_role_privilage_mapping_fk2` FOREIGN KEY (`role_id`) REFERENCES `algaeh_d_app_roles` (`app_d_app_roles_id`),
  CONSTRAINT `algaeh_m_component_role_privilage_mapping_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_component_role_privilage_mapping_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_component_screen_privilage_mapping`
--

DROP TABLE IF EXISTS `algaeh_m_component_screen_privilage_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_component_screen_privilage_mapping` (
  `algaeh_m_component_screen_privilage_mapping_id` int NOT NULL AUTO_INCREMENT,
  `component_id` int DEFAULT NULL,
  `algaeh_m_screen_role_privilage_mapping_id` int DEFAULT NULL,
  `view_privilege` enum('D','H') DEFAULT 'H' COMMENT 'View Privilege\nD: Disabled\nH: Hide',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`algaeh_m_component_screen_privilage_mapping_id`),
  UNIQUE KEY `index4` (`component_id`,`algaeh_m_screen_role_privilage_mapping_id`),
  KEY `algaeh_m_component_screen_privilage_mapping_idx` (`component_id`),
  KEY `algaeh_m_component_screen_privilage_mapping_fk2_idx` (`algaeh_m_screen_role_privilage_mapping_id`),
  CONSTRAINT `algaeh_m_component_screen_privilage_mapping_fk1` FOREIGN KEY (`component_id`) REFERENCES `algaeh_d_app_component` (`algaeh_d_app_component_id`),
  CONSTRAINT `algaeh_m_component_screen_privilage_mapping_fk2` FOREIGN KEY (`algaeh_m_screen_role_privilage_mapping_id`) REFERENCES `algaeh_m_screen_role_privilage_mapping` (`algaeh_m_screen_role_privilage_mapping_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_dashboard_component_map`
--

DROP TABLE IF EXISTS `algaeh_m_dashboard_component_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_dashboard_component_map` (
  `algaeh_m_dashboard_component_map_id` int NOT NULL AUTO_INCREMENT,
  `dashboard_id` int NOT NULL,
  `component_id` int NOT NULL,
  PRIMARY KEY (`algaeh_m_dashboard_component_map_id`),
  KEY `algaeh_m_dashboard_component_map_fk1_idx` (`dashboard_id`),
  KEY `algaeh_m_dashboard_component_map_fk2_idx` (`component_id`),
  CONSTRAINT `algaeh_m_dashboard_component_map_fk1` FOREIGN KEY (`dashboard_id`) REFERENCES `algaeh_d_dashboard` (`algaeh_d_dashboard_id`),
  CONSTRAINT `algaeh_m_dashboard_component_map_fk2` FOREIGN KEY (`component_id`) REFERENCES `algaeh_d_dashboard_component` (`algaeh_d_dashboard_component_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_module_role_privilage_mapping`
--

DROP TABLE IF EXISTS `algaeh_m_module_role_privilage_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_module_role_privilage_mapping` (
  `algaeh_m_module_role_privilage_mapping_id` int NOT NULL AUTO_INCREMENT,
  `module_id` int NOT NULL,
  `role_id` int NOT NULL,
  `privilege_description` varchar(45) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`algaeh_m_module_role_privilage_mapping_id`),
  UNIQUE KEY `unique_role_and_module` (`module_id`,`role_id`),
  UNIQUE KEY `index8` (`module_id`,`role_id`),
  KEY `algaeh_m_module_role_privilage_mapping_fk1_idx` (`module_id`),
  KEY `algaeh_m_module_role_privilage_mapping_fk2_idx` (`role_id`),
  KEY `algaeh_m_module_role_privilage_mapping_fk3_idx` (`created_by`),
  KEY `algaeh_m_module_role_privilage_mapping_fk4_idx` (`updated_by`) /*!80000 INVISIBLE */,
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_m_module_role_privilage_mapping_fk1` FOREIGN KEY (`module_id`) REFERENCES `algaeh_d_app_module` (`algaeh_d_module_id`),
  CONSTRAINT `algaeh_m_module_role_privilage_mapping_fk2` FOREIGN KEY (`role_id`) REFERENCES `algaeh_d_app_roles` (`app_d_app_roles_id`),
  CONSTRAINT `algaeh_m_module_role_privilage_mapping_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_module_role_privilage_mapping_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_role_user_mappings`
--

DROP TABLE IF EXISTS `algaeh_m_role_user_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_role_user_mappings` (
  `algaeh_m_role_user_mappings_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL COMMENT 'Role ID ',
  `land_screen_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`algaeh_m_role_user_mappings_id`),
  KEY `algaeh_m_role_user_mappings_fk1_idx` (`created_by`),
  KEY `algaeh_m_role_user_mappings_fk2_idx` (`updated_by`),
  KEY `algaeh_m_role_user_mappings_fk3_idx` (`user_id`),
  KEY `algaeh_m_role_user_mappings_fk6_idx` (`role_id`),
  KEY `record_status_index` (`record_status`),
  KEY `algaeh_m_role_user_mappings_fk7_idx` (`land_screen_id`),
  CONSTRAINT `algaeh_m_role_user_mappings_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_role_user_mappings_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_role_user_mappings_fk3` FOREIGN KEY (`user_id`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_role_user_mappings_fk6` FOREIGN KEY (`role_id`) REFERENCES `algaeh_d_app_roles` (`app_d_app_roles_id`),
  CONSTRAINT `algaeh_m_role_user_mappings_fk7` FOREIGN KEY (`land_screen_id`) REFERENCES `algaeh_d_app_screens` (`algaeh_app_screens_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_screen_role_privilage_mapping`
--

DROP TABLE IF EXISTS `algaeh_m_screen_role_privilage_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_screen_role_privilage_mapping` (
  `algaeh_m_screen_role_privilage_mapping_id` int NOT NULL AUTO_INCREMENT,
  `module_role_map_id` int DEFAULT NULL,
  `screen_id` int NOT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`algaeh_m_screen_role_privilage_mapping_id`),
  UNIQUE KEY `index7` (`module_role_map_id`,`screen_id`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk3_idx` (`created_by`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk5_idx` (`updated_by`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk7_idx` (`module_role_map_id`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk12_idx` (`screen_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `algaeh_m_screen_role_privilage_mapping_fk12` FOREIGN KEY (`screen_id`) REFERENCES `algaeh_d_app_screens` (`algaeh_app_screens_id`),
  CONSTRAINT `algaeh_m_screen_role_privilage_mapping_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_screen_role_privilage_mapping_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_screen_role_privilage_mapping_fk7` FOREIGN KEY (`module_role_map_id`) REFERENCES `algaeh_m_module_role_privilage_mapping` (`algaeh_m_module_role_privilage_mapping_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=738 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `algaeh_m_scrn_elmnt_role_privilage_mapping`
--

DROP TABLE IF EXISTS `algaeh_m_scrn_elmnt_role_privilage_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `algaeh_m_scrn_elmnt_role_privilage_mapping` (
  `algaeh_m_scrn_elmnt_role_privilage_mapping_id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `element_id` int DEFAULT NULL,
  `screen_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`algaeh_m_scrn_elmnt_role_privilage_mapping_id`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk2_idx` (`created_by`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk3_idx` (`updated_by`),
  KEY `algaeh_m_screen_role_privilage_mapping_fk6_idx` (`element_id`),
  KEY `algaeh_m_scrn_elmnt_role_privilage_mapping_fk9_idx` (`role_id`),
  KEY `record_status_index` (`record_status`),
  KEY `algaeh_m_scrn_elmnt_role_privilage_mapping_fk5_idx` (`screen_id`),
  CONSTRAINT `algaeh_m_scrn_elmnt_role_privilage_mapping_` FOREIGN KEY (`role_id`) REFERENCES `algaeh_d_app_roles` (`app_d_app_roles_id`),
  CONSTRAINT `algaeh_m_scrn_elmnt_role_privilage_mapping_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_scrn_elmnt_role_privilage_mapping_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `algaeh_m_scrn_elmnt_role_privilage_mapping_fk5` FOREIGN KEY (`screen_id`) REFERENCES `algaeh_d_app_screens` (`algaeh_app_screens_id`),
  CONSTRAINT `algaeh_m_scrn_elmnt_role_privilage_mapping_fk8` FOREIGN KEY (`element_id`) REFERENCES `algaeh_d_app_scrn_elements` (`algaeh_d_app_scrn_elements_id`),
  CONSTRAINT `algaeh_m_scrn_elmnt_role_privilage_mapping_fk9` FOREIGN KEY (`role_id`) REFERENCES `algaeh_m_component_role_privilage_mapping` (`algaeh_m_component_role_privilage_mapping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_account_child`
--

DROP TABLE IF EXISTS `finance_account_child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_account_child` (
  `finance_account_child_id` int NOT NULL AUTO_INCREMENT,
  `ledger_code` varchar(25) DEFAULT NULL,
  `child_name` varchar(75) NOT NULL,
  `arabic_child_name` varchar(75) DEFAULT NULL,
  `head_id` int NOT NULL,
  `created_from` enum('S','U') DEFAULT 'U' COMMENT 'S=SYSTEM,U=USER',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finance_account_child_id`),
  UNIQUE KEY `ledger_code_UNIQUE` (`ledger_code`),
  KEY `finance_account_child_fk1_idx` (`head_id`),
  CONSTRAINT `finance_account_child_fk1` FOREIGN KEY (`head_id`) REFERENCES `finance_account_head` (`finance_account_head_id`)
) ENGINE=InnoDB AUTO_INCREMENT=640 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_account_head`
--

DROP TABLE IF EXISTS `finance_account_head`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_account_head` (
  `finance_account_head_id` int NOT NULL AUTO_INCREMENT,
  `account_code` varchar(45) DEFAULT NULL,
  `account_name` varchar(75) NOT NULL,
  `arabic_account_name` varchar(75) DEFAULT NULL,
  `account_parent` varchar(45) DEFAULT NULL,
  `group_type` enum('P','C') DEFAULT 'C' COMMENT 'P=PARENT,\nC=CHILD',
  `account_level` tinyint unsigned DEFAULT NULL,
  `created_from` enum('S','U') DEFAULT 'U' COMMENT 'S=SYSTEM,U=USER',
  `account_type` enum('B','C','PL','N') DEFAULT 'N' COMMENT 'N=NONE,\nC=CASH,\nPL=PROFIT&LOSS,\nB=BANK',
  `sort_order` tinyint DEFAULT NULL,
  `parent_acc_id` int unsigned DEFAULT NULL,
  `hierarchy_path` varchar(45) DEFAULT NULL,
  `root_id` tinyint NOT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `group_code` varchar(45) DEFAULT NULL,
  `group_parent` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`finance_account_head_id`),
  UNIQUE KEY `account_code_UNIQUE` (`account_code`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_accounts_maping`
--

DROP TABLE IF EXISTS `finance_accounts_maping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_accounts_maping` (
  `finance_accounts_maping_id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(25) DEFAULT NULL COMMENT 'OP_CON=OP CONTROLACCOUNT,\nOP_DEP=OP DEPOSITE ACCOUNT,\nOP_REC=OP RECIEVABLE ACCOUNT,\nCH_IN_HA=CASH IN HAND,\nOP_WF=OP WRITE OFF,\nOP_CS=OP CREDIT SETTLEMENT,\nOP_CONSULT_TAX=OP CONSULTATION TAX,\nOP_LAB_TAX=OP LABORATORY TAX,\nOP_RAD_TAX=OP RADIOLOGY TAX, \nOP_INS_CONSULT_TAX=OP INSURANCE CONSULTATION TAX,\nOP_INS_LAB_TAX=OP INSURANCE LABORATORY TAX,\nOP_INS_RAD_TAX=OP INSURANCE RADIOLOGY TAX, \n',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `description` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`finance_accounts_maping_id`),
  UNIQUE KEY `account_UNIQUE` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_d_prepayment_type`
--

DROP TABLE IF EXISTS `finance_d_prepayment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_d_prepayment_type` (
  `finance_d_prepayment_type_id` int NOT NULL AUTO_INCREMENT,
  `prepayment_desc` varchar(60) NOT NULL,
  `prepayment_duration` tinyint unsigned DEFAULT NULL,
  `prepayment_head_id` int DEFAULT NULL,
  `prepayment_child_id` int DEFAULT NULL,
  `expense_head_id` int DEFAULT NULL,
  `expense_child_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE\\\\nI = INACTIVE',
  PRIMARY KEY (`finance_d_prepayment_type_id`),
  UNIQUE KEY `prepayment_desc_UNIQUE` (`prepayment_desc`),
  KEY `finance_d_prepayment_type_fk1_idx` (`created_by`),
  KEY `finance_d_prepayment_type_fk2_idx` (`updated_by`),
  CONSTRAINT `finance_d_prepayment_type_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `finance_d_prepayment_type_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_day_end_header`
--

DROP TABLE IF EXISTS `finance_day_end_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_day_end_header` (
  `finance_day_end_header_id` int unsigned NOT NULL AUTO_INCREMENT,
  `transaction_date` date NOT NULL,
  `amount` decimal(15,4) DEFAULT NULL,
  `voucher_type` enum('journal','contra','receipt','payment','sales','purchase','credit_note','debit_note') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note,',
  `document_number` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `document_id` int DEFAULT NULL,
  `invoice_no` varchar(45) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `cancel_transaction` enum('Y','N') DEFAULT 'N',
  `from_screen` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `ref_no` varchar(45) DEFAULT NULL,
  `cheque_date` date DEFAULT NULL,
  `cheque_amount` decimal(15,4) DEFAULT NULL,
  `narration` varchar(400) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `entered_by` int DEFAULT NULL,
  `entered_date` datetime DEFAULT NULL,
  `posted` enum('Y','N') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  PRIMARY KEY (`finance_day_end_header_id`),
  UNIQUE KEY `document_number_UNIQUE` (`document_number`),
  KEY `Index_Payment_date` (`transaction_date`)
) ENGINE=InnoDB AUTO_INCREMENT=818 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_day_end_sub_detail`
--

DROP TABLE IF EXISTS `finance_day_end_sub_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_day_end_sub_detail` (
  `finance_day_end_sub_detail_id` int NOT NULL AUTO_INCREMENT,
  `day_end_header_id` int NOT NULL,
  `month` tinyint unsigned DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `payment_date` date NOT NULL,
  `head_id` int NOT NULL,
  `child_id` int unsigned NOT NULL,
  `debit_amount` decimal(15,4) DEFAULT NULL,
  `payment_type` enum('DR','CR') NOT NULL COMMENT 'DR=DEBIT,CR=CREDIT',
  `credit_amount` decimal(15,4) DEFAULT NULL,
  `hospital_id` int unsigned DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  PRIMARY KEY (`finance_day_end_sub_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3706 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_f_prepayment_detail`
--

DROP TABLE IF EXISTS `finance_f_prepayment_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_f_prepayment_detail` (
  `finance_f_prepayment_detail_id` int NOT NULL AUTO_INCREMENT,
  `prepayment_request_id` int NOT NULL,
  `amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `year` smallint unsigned NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL DEFAULT '1' COMMENT '1 = JAN\\\\n2 =FEB\\\\n3 = MAR\\\\n4 = APR\\\\n5 = MAY\\\\n6 = JUNE\\\\n7 =JULY\\\\n8 = AUG\\\\n9 = SEPT\\\\n10 = OCT\\\\n11= NOV\\\\n12= DEC',
  `processed` enum('N','Y') NOT NULL DEFAULT 'N',
  `project_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`finance_f_prepayment_detail_id`),
  KEY `fk_finance_f_prepayment_detail_1_idx` (`prepayment_request_id`),
  CONSTRAINT `fk_finance_f_prepayment_detail_1` FOREIGN KEY (`prepayment_request_id`) REFERENCES `finance_f_prepayment_request` (`finance_f_prepayment_request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_f_prepayment_request`
--

DROP TABLE IF EXISTS `finance_f_prepayment_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_f_prepayment_request` (
  `finance_f_prepayment_request_id` int NOT NULL AUTO_INCREMENT,
  `prepayment_type_id` int NOT NULL,
  `request_code` varchar(45) NOT NULL,
  `employee_id` int DEFAULT NULL,
  `start_period` varchar(15) DEFAULT NULL,
  `end_period` varchar(15) DEFAULT NULL,
  `prepayment_amount` decimal(10,3) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `request_status` enum('P','R','A') DEFAULT 'P' COMMENT 'P = PENDING,R=REJECTED, A = APPROVED',
  `revert_reason` varchar(250) DEFAULT NULL,
  `reverted_by` int DEFAULT NULL,
  `reverted_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `reverted_amt` decimal(10,3) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `approved_by` int DEFAULT NULL,
  `approved_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finance_f_prepayment_request_id`),
  KEY `finance_f_prepayment_request_fk1_idx` (`created_by`),
  KEY `finance_f_prepayment_request_fk2_idx` (`approved_by`),
  KEY `finance_f_prepayment_request_fk3_idx` (`hospital_id`),
  KEY `finance_f_prepayment_request_fk4_idx` (`prepayment_type_id`),
  KEY `finance_f_prepayment_request_fk5_idx` (`employee_id`),
  CONSTRAINT `finance_f_prepayment_request_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `finance_f_prepayment_request_fk2` FOREIGN KEY (`approved_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `finance_f_prepayment_request_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `finance_f_prepayment_request_fk4` FOREIGN KEY (`prepayment_type_id`) REFERENCES `finance_d_prepayment_type` (`finance_d_prepayment_type_id`),
  CONSTRAINT `finance_f_prepayment_request_fk5` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_numgen`
--

DROP TABLE IF EXISTS `finance_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_numgen` (
  `finance_numgen_id` int NOT NULL,
  `numgen_code` varchar(15) NOT NULL,
  `module_desc` varchar(50) NOT NULL,
  `prefix` varchar(10) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` tinyint NOT NULL,
  `postfix` varchar(20) NOT NULL COMMENT 'Number',
  `length` tinyint unsigned NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` tinyint unsigned NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(3) DEFAULT NULL,
  `postfix_start` varchar(15) NOT NULL,
  `postfix_end` varchar(15) NOT NULL,
  `current_num` varchar(25) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(25) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`finance_numgen_id`),
  UNIQUE KEY `numgen_code_UNIQUE` (`numgen_code`),
  KEY `index2` (`numgen_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_options`
--

DROP TABLE IF EXISTS `finance_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_options` (
  `finance_options_id` int NOT NULL,
  `cost_center_required` enum('Y','N') DEFAULT 'N',
  `default_cost_center` int DEFAULT NULL COMMENT '//head office cost center id',
  `cost_center_group_type` enum('B','P','SD') DEFAULT 'B',
  `cost_center_type` enum('B','P','SD') NOT NULL DEFAULT 'B' COMMENT 'B=Branch\nSD=SUB-DEPARTMENT WISE,\nP=PROJECT WISE',
  `third_party_payroll` enum('Y','N') NOT NULL DEFAULT 'N',
  `start_month` tinyint unsigned NOT NULL,
  `start_date` tinyint unsigned NOT NULL,
  `end_month` tinyint unsigned NOT NULL,
  `end_date` tinyint unsigned NOT NULL,
  `auth_level` enum('N','1','2') NOT NULL DEFAULT 'N',
  `auth1_limit` enum('Y','N') DEFAULT 'N',
  `auth1_limit_amount` decimal(10,2) DEFAULT '0.00',
  `default_cost_center_id` int DEFAULT NULL,
  `default_branch_id` int DEFAULT NULL,
  `grni_required` enum('Y','N') DEFAULT 'N',
  PRIMARY KEY (`finance_options_id`),
  KEY `finance_options_fk1_idx` (`default_cost_center`),
  CONSTRAINT `finance_options_fk1` FOREIGN KEY (`default_cost_center`) REFERENCES `finance_cost_center` (`finance_cost_center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_voucher_details`
--

DROP TABLE IF EXISTS `finance_voucher_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_voucher_details` (
  `finance_voucher_id` int NOT NULL AUTO_INCREMENT,
  `voucher_header_id` int DEFAULT NULL,
  `payment_date` date NOT NULL,
  `month` tinyint unsigned DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `head_id` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `child_id` int unsigned NOT NULL,
  `debit_amount` decimal(15,4) NOT NULL,
  `payment_type` enum('DR','CR') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'DR=DEBIT,CR=CREDIT',
  `credit_amount` decimal(15,4) NOT NULL,
  `hospital_id` int unsigned DEFAULT NULL,
  `pl_entry` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'N',
  `is_opening_bal` enum('Y','N') CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT 'N',
  `is_new_entry` enum('Y','N') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'N',
  `project_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `doctor_id` int unsigned DEFAULT NULL,
  `is_deleted` enum('Y','N') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'N',
  `entered_by` int DEFAULT NULL,
  `entered_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `auth1` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'N',
  `auth1_by` int DEFAULT NULL,
  `auth1_date` datetime DEFAULT NULL,
  `auth2` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `auth2_by` int DEFAULT NULL,
  `auth2_date` datetime DEFAULT NULL,
  `auth_status` enum('A','P','R') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'P' COMMENT 'A=AUTHORIZED,\nP=PENDING,\nR=REJECTED',
  `rejected_by` int DEFAULT NULL,
  `rejected_date` datetime DEFAULT NULL,
  `rejected_reason` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`finance_voucher_id`),
  KEY `Index_Payment_date` (`payment_date`) USING BTREE,
  KEY `Index_Head_id` (`head_id`) USING BTREE,
  KEY `Index_Child_id` (`child_id`) USING BTREE,
  KEY `Index_Office_id` (`hospital_id`) USING BTREE,
  KEY `Index_Del_status` (`is_deleted`),
  KEY `finance_voucher_details_fk1_idx` (`voucher_header_id`),
  CONSTRAINT `finance_voucher_details_fk1` FOREIGN KEY (`voucher_header_id`) REFERENCES `finance_voucher_header` (`finance_voucher_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=415 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_voucher_header`
--

DROP TABLE IF EXISTS `finance_voucher_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_voucher_header` (
  `finance_voucher_header_id` int NOT NULL AUTO_INCREMENT,
  `voucher_type` enum('journal','contra','receipt','payment','sales','purchase','credit_note','debit_note') DEFAULT NULL COMMENT 'journal,contra,receipt,payment,sales,purchase,credit_note,debit_note,',
  `voucher_no` varchar(45) NOT NULL,
  `day_end_header_id` int DEFAULT NULL,
  `amount` decimal(15,4) DEFAULT '0.0000',
  `payment_mode` enum('CASH','CHEQUE','RTGS','NEFT','IMPS','N') NOT NULL DEFAULT 'N',
  `ref_no` varchar(45) DEFAULT NULL,
  `cheque_date` date DEFAULT NULL,
  `cheque_amount` decimal(15,4) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `month` tinyint unsigned DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `narration` varchar(400) DEFAULT NULL,
  `from_screen` varchar(45) NOT NULL,
  `posted_from` enum('V','D') DEFAULT NULL COMMENT 'V=JOURNAL VOUCHER,D=DAYEND',
  `due_date` date DEFAULT NULL,
  `settlement_status` enum('S','C','P') NOT NULL DEFAULT 'P' COMMENT 'S=SETTLED,C=CANCELLED,P=PENDING',
  `settled_amount` decimal(15,4) DEFAULT '0.0000',
  `invoice_no` varchar(45) DEFAULT NULL,
  `invoice_ref_no` varchar(45) DEFAULT NULL,
  `receipt_type` enum('S','M') DEFAULT 'S' COMMENT 'S=Single \\n M=Multiple',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`finance_voucher_header_id`),
  UNIQUE KEY `voucher_no_UNIQUE` (`voucher_no`),
  UNIQUE KEY `invoice_no_UNIQUE` (`invoice_no`),
  KEY `index3` (`narration`),
  KEY `index4` (`due_date`),
  KEY `index5` (`invoice_no`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_voucher_sub_header`
--

DROP TABLE IF EXISTS `finance_voucher_sub_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_voucher_sub_header` (
  `finance_voucher_sub_header_id` int NOT NULL AUTO_INCREMENT,
  `finance_voucher_header_id` int DEFAULT NULL,
  `invoice_ref_no` varchar(45) DEFAULT NULL,
  `amount` decimal(15,4) DEFAULT NULL,
  PRIMARY KEY (`finance_voucher_sub_header_id`),
  KEY `finance_voucher_sub_header_fk1_idx` (`finance_voucher_header_id`),
  CONSTRAINT `finance_voucher_sub_header_fk1` FOREIGN KEY (`finance_voucher_header_id`) REFERENCES `finance_voucher_header` (`finance_voucher_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `finance_year_closing`
--

DROP TABLE IF EXISTS `finance_year_closing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_year_closing` (
  `finance_year_closing_id` int NOT NULL AUTO_INCREMENT,
  `financial_year` varchar(4) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_profit` decimal(15,4) DEFAULT '0.0000',
  `total_tax` decimal(15,4) DEFAULT '0.0000',
  `closed` enum('Y','N') DEFAULT 'N',
  `closed_by` int DEFAULT NULL,
  `closed_date` date DEFAULT NULL,
  PRIMARY KEY (`finance_year_closing_id`),
  UNIQUE KEY `financial_year_UNIQUE` (`financial_year`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_activity`
--

DROP TABLE IF EXISTS `hims_d_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_activity` (
  `hims_d_activity_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_activity_id`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_agency`
--

DROP TABLE IF EXISTS `hims_d_agency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_agency` (
  `hims_d_agency_id` int NOT NULL AUTO_INCREMENT,
  `agency_name` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_agency_id`),
  KEY `hims_d_agency_fk1_idx` (`created_by`),
  KEY `hims_d_agency_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_d_agency_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_agency_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_allergy`
--

DROP TABLE IF EXISTS `hims_d_allergy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_allergy` (
  `hims_d_allergy_id` int NOT NULL AUTO_INCREMENT,
  `allergy_type` enum('F','A','AI','C','D') DEFAULT NULL COMMENT 'F=FOOD\\nA=Airborne\\nAI=Animal & Insect\\nC= Chemical & others \\n D=Drugs',
  `allergy_name` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\nI=inactive',
  PRIMARY KEY (`hims_d_allergy_id`),
  KEY `hims_d_allergy_fk1_idx` (`created_by`),
  KEY `hims_d_allergy_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_allergy_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_allergy_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_annual_leave_components`
--

DROP TABLE IF EXISTS `hims_d_annual_leave_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_annual_leave_components` (
  `hims_d_annual_leave_components_id` int NOT NULL AUTO_INCREMENT,
  `leave_id` int DEFAULT NULL,
  `earnings_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_annual_leave_components_id`),
  KEY `hims_d_annual_leave_components_fk1_idx` (`created_by`),
  KEY `hims_d_annual_leave_components_fk2_idx` (`updated_by`),
  KEY `hims_d_annual_leave_components_fk3_idx` (`leave_id`),
  KEY `hims_d_annual_leave_components_fk4_idx` (`earnings_id`),
  CONSTRAINT `hims_d_annual_leave_components_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_annual_leave_components_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_annual_leave_components_fk3` FOREIGN KEY (`leave_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_d_annual_leave_components_fk4` FOREIGN KEY (`earnings_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_antibiotic`
--

DROP TABLE IF EXISTS `hims_d_antibiotic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_antibiotic` (
  `hims_d_antibiotic_id` int NOT NULL AUTO_INCREMENT,
  `antibiotic_code` varchar(15) DEFAULT NULL,
  `antibiotic_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `antibiotic_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_antibiotic_id`),
  KEY `hims_d_antibiotic_fk1_idx` (`created_by`),
  KEY `hims_d_antibiotic_fk1_idx1` (`updated_by`),
  CONSTRAINT `hims_d_antibiotic_fk11` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_antibiotic_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_appointment_clinic`
--

DROP TABLE IF EXISTS `hims_d_appointment_clinic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_appointment_clinic` (
  `hims_d_appointment_clinic_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_appointment_clinic_id`),
  KEY `hims_d_appointment_clinic_fk1_idx` (`created_by`),
  KEY `hims_d_appointment_clinic_fk2_idx` (`updated_by`),
  KEY `hims_d_appointment_clinic_fk3_idx` (`room_id`),
  KEY `hims_d_appointment_clinic_fk4_idx` (`sub_department_id`),
  KEY `hims_d_appointment_clinic_fk5_idx` (`provider_id`),
  KEY `hims_d_appointment_clinic_fk7_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_appointment_clinic_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_clinic_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_clinic_fk3` FOREIGN KEY (`room_id`) REFERENCES `hims_d_appointment_room` (`hims_d_appointment_room_id`),
  CONSTRAINT `hims_d_appointment_clinic_fk4` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_d_appointment_clinic_fk5` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_appointment_clinic_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_appointment_room`
--

DROP TABLE IF EXISTS `hims_d_appointment_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_appointment_room` (
  `hims_d_appointment_room_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `room_active` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Y',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_appointment_room_id`),
  KEY `hims_d_appointment_room_fk1_idx` (`created_by`),
  KEY `hims_d_appointment_room_fk2_idx` (`updated_by`),
  KEY `hims_d_appointment_room_fk4_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_appointment_room_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_room_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_room_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_appointment_schedule_detail`
--

DROP TABLE IF EXISTS `hims_d_appointment_schedule_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_appointment_schedule_detail` (
  `hims_d_appointment_schedule_detail_id` int NOT NULL AUTO_INCREMENT,
  `appointment_schedule_header_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `clinic_id` int DEFAULT NULL,
  `schedule_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `slot` enum('5','10','15','20','25','30','35','40','45','50','55','60') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  `modified` enum('L','M','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'L=leave\nM=modified\nN=none',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_appointment_schedule_detail_id`),
  KEY `hims_d_appointment_schedule_detail_fk1_idx` (`appointment_schedule_header_id`),
  KEY `hims_d_appointment_schedule_detail_fk2_idx` (`provider_id`),
  KEY `hims_d_appointment_schedule_detail_fk4_idx` (`clinic_id`),
  KEY `hims_d_appointment_schedule_detail_fk5_idx` (`created_by`),
  KEY `hims_d_appointment_schedule_detail_fk6_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_appointment_schedule_detail_fk1` FOREIGN KEY (`appointment_schedule_header_id`) REFERENCES `hims_d_appointment_schedule_header` (`hims_d_appointment_schedule_header_id`),
  CONSTRAINT `hims_d_appointment_schedule_detail_fk2` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_appointment_schedule_detail_fk4` FOREIGN KEY (`clinic_id`) REFERENCES `hims_d_appointment_clinic` (`hims_d_appointment_clinic_id`),
  CONSTRAINT `hims_d_appointment_schedule_detail_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_schedule_detail_fk6` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=785 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_appointment_schedule_header`
--

DROP TABLE IF EXISTS `hims_d_appointment_schedule_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_appointment_schedule_header` (
  `hims_d_appointment_schedule_header_id` int NOT NULL AUTO_INCREMENT,
  `sub_dept_id` int DEFAULT NULL,
  `schedule_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=Active\nI=inative',
  `schedule_description` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `month` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `from_work_hr` time DEFAULT NULL,
  `to_work_hr` time DEFAULT NULL,
  `work_break1` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `from_break_hr1` time DEFAULT NULL,
  `to_break_hr1` time DEFAULT NULL,
  `work_break2` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `from_break_hr2` time DEFAULT NULL,
  `to_break_hr2` time DEFAULT NULL,
  `monday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tuesday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `wednesday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `thursday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `friday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `saturday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sunday` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=Active\nI=inative',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_appointment_schedule_header_id`),
  UNIQUE KEY `schedule_description_UNIQUE` (`schedule_description`),
  KEY `hims_d_schedule_header_fk1_idx` (`created_by`),
  KEY `hims_d_schedule_header_fk2_idx` (`updated_by`),
  KEY `hims_d_appointment_schedule_header_fk3_idx` (`sub_dept_id`),
  KEY `hims_d_appointment_schedule_header_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_appointment_schedule_header` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_appointment_schedule_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_schedule_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_schedule_header_fk3` FOREIGN KEY (`sub_dept_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_appointment_schedule_modify`
--

DROP TABLE IF EXISTS `hims_d_appointment_schedule_modify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_appointment_schedule_modify` (
  `hims_d_appointment_schedule_modify_id` int NOT NULL AUTO_INCREMENT,
  `appointment_schedule_detail_id` int DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `slot` enum('5','10','15','20','25','30','35','40','45','50','55','60') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `from_work_hr` time DEFAULT NULL,
  `to_work_hr` time DEFAULT NULL,
  `work_break1` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `from_break_hr1` time DEFAULT NULL,
  `to_break_hr1` time DEFAULT NULL,
  `work_break2` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `from_break_hr2` time DEFAULT NULL,
  `to_break_hr2` time DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_appointment_schedule_modify_id`),
  KEY `hims_d_appointment_schedule_leave_fk4_idx` (`created_by`),
  KEY `hims_d_appointment_schedule_leave_fk5_idx` (`updated_by`),
  KEY `hims_d_appointment_schedule_modify_fk3_idx` (`appointment_schedule_detail_id`),
  KEY `hims_d_appointment_schedule_modify_fk4_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_appointment_schedule_modify_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_schedule_modify_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_schedule_modify_fk3` FOREIGN KEY (`appointment_schedule_detail_id`) REFERENCES `hims_d_appointment_schedule_detail` (`hims_d_appointment_schedule_detail_id`),
  CONSTRAINT `hims_d_appointment_schedule_modify_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='leave details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_appointment_status`
--

DROP TABLE IF EXISTS `hims_d_appointment_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_appointment_status` (
  `hims_d_appointment_status_id` int NOT NULL AUTO_INCREMENT,
  `color_code` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `default_status` enum('Y','N','C','RS','CAN','CF','NS','SP') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=YES\\nN=NO\\nC=CREATE VISIT\\nRS=RESCHEDULE,CAN=CANCEL,CF=CONFIRM,NS=NO SHOW,SP=SEND_TO_PROVIDER',
  `validation_req` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `steps` smallint unsigned DEFAULT NULL,
  `authorized` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_d_appointment_status_id`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  UNIQUE KEY `color_code_UNIQUE` (`color_code`),
  KEY `hims_d_appointment_status_fk1_idx` (`created_by`),
  KEY `hims_d_appointment_status_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_appointment_status_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_appointment_status_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_authorization_setup`
--

DROP TABLE IF EXISTS `hims_d_authorization_setup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_authorization_setup` (
  `hims_d_authorization_setup_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_level1` int DEFAULT NULL,
  `leave_level2` int DEFAULT NULL,
  `leave_level3` int DEFAULT NULL,
  `loan_level1` int DEFAULT NULL,
  `loan_level2` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_authorization_setup_id`),
  UNIQUE KEY `employee_id_UNIQUE` (`employee_id`),
  KEY `hims_d_authorization_setup_fk1_idx` (`employee_id`),
  KEY `hims_d_authorization_setup_fk2_idx` (`leave_level1`),
  KEY `hims_d_authorization_setup_fk3_idx` (`leave_level2`),
  KEY `hims_d_authorization_setup_fk_idx` (`leave_level3`),
  KEY `hims_d_authorization_setup_fk5_idx` (`loan_level1`),
  KEY `hims_d_authorization_setup_fk6_idx` (`loan_level2`),
  KEY `hims_d_authorization_setup_fk7_idx` (`created_by`),
  KEY `hims_d_authorization_setup_fk8_idx` (`updated_by`),
  CONSTRAINT `hims_d_authorization_setup_fk2` FOREIGN KEY (`leave_level1`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_authorization_setup_fk3` FOREIGN KEY (`leave_level2`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_authorization_setup_fk4` FOREIGN KEY (`leave_level3`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_authorization_setup_fk5` FOREIGN KEY (`loan_level1`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_authorization_setup_fk6` FOREIGN KEY (`loan_level2`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_authorization_setup_fk7` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_authorization_setup_fk8` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_bank`
--

DROP TABLE IF EXISTS `hims_d_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_bank` (
  `hims_d_bank_id` int NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(90) DEFAULT NULL,
  `bank_code` varchar(15) NOT NULL,
  `bank_short_name` varchar(10) DEFAULT NULL,
  `address1` varchar(45) DEFAULT NULL,
  `contact_person` varchar(45) DEFAULT NULL,
  `contact_number` varchar(17) DEFAULT NULL,
  `active_status` enum('A','I') DEFAULT 'A',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_bank_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_bank_card`
--

DROP TABLE IF EXISTS `hims_d_bank_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_bank_card` (
  `hims_d_bank_card_id` int NOT NULL AUTO_INCREMENT,
  `card_name` varchar(45) DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_bank_card_id`),
  UNIQUE KEY `card_name_UNIQUE` (`card_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_billing_type`
--

DROP TABLE IF EXISTS `hims_d_billing_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_billing_type` (
  `hims_d_billing_type_id` int NOT NULL AUTO_INCREMENT,
  `billing_type_code` varchar(45) NOT NULL,
  `billing_type` varchar(100) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_billing_type_id`),
  KEY `hims_d_billing_type_fk1_idx` (`created_by`),
  KEY `hims_d_billing_type_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_billing_type_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_billing_type_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_chronic_conditions`
--

DROP TABLE IF EXISTS `hims_d_chronic_conditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_chronic_conditions` (
  `hims_d_chronic_conditions_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\nI=inactive',
  PRIMARY KEY (`hims_d_chronic_conditions_id`),
  KEY `hims_d_chronic_conditions_fk1_idx` (`created_by`),
  KEY `hims_d_chronic_conditions_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_chronic_conditions_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_chronic_conditions_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_city`
--

DROP TABLE IF EXISTS `hims_d_city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_city` (
  `hims_d_city_id` int NOT NULL AUTO_INCREMENT,
  `city_code` varchar(50) NOT NULL,
  `city_name` varchar(250) NOT NULL,
  `city_arabic_name` varchar(250) DEFAULT NULL,
  `state_id` int NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(45) DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(45) DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_city_id`),
  UNIQUE KEY `index2` (`city_code`,`city_name`,`state_id`,`record_status`),
  KEY `index3` (`record_status`),
  KEY `hims_d_city_fk1_idx` (`state_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_city_fk1` FOREIGN KEY (`state_id`) REFERENCES `hims_d_state` (`hims_d_state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2233469 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_company_account`
--

DROP TABLE IF EXISTS `hims_d_company_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_company_account` (
  `hims_d_company_account_id` int NOT NULL AUTO_INCREMENT,
  `employer_cr_no` varchar(45) DEFAULT NULL,
  `payer_cr_no` varchar(45) DEFAULT NULL,
  `bank_id` int DEFAULT NULL,
  `bank_short_name` varchar(10) DEFAULT NULL,
  `account_number` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_company_account_id`),
  KEY `hims_d_company_account_fk1_idx` (`bank_id`),
  KEY `hims_d_company_account_fk2_idx` (`created_by`),
  KEY `hims_d_company_account_fk_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_company_account_fk1` FOREIGN KEY (`bank_id`) REFERENCES `hims_d_bank` (`hims_d_bank_id`),
  CONSTRAINT `hims_d_company_account_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_company_account_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_counter`
--

DROP TABLE IF EXISTS `hims_d_counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_counter` (
  `hims_d_counter_id` int NOT NULL AUTO_INCREMENT,
  `counter_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `counter_description` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_name` varchar(90) DEFAULT NULL,
  `counter_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_counter_id`),
  UNIQUE KEY `counter_code_UNIQUE` (`counter_code`),
  KEY `hims_d_counter_fk1_idx` (`created_by`),
  KEY `hims_d_counter_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_counter_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_counter_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_country`
--

DROP TABLE IF EXISTS `hims_d_country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_country` (
  `hims_d_country_id` int NOT NULL AUTO_INCREMENT,
  `country_code` varchar(50) NOT NULL,
  `country_name` varchar(250) NOT NULL,
  `arabic_country_name` varchar(250) DEFAULT NULL,
  `status` enum('A','I') NOT NULL DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_country_id`),
  UNIQUE KEY `country_code_UNIQUE` (`country_code`,`country_name`,`record_status`),
  KEY `index4` (`record_status`),
  KEY `hims_d_country_fk1_idx` (`created_by`),
  KEY `hims_d_country_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_country_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_country_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_cpt_code`
--

DROP TABLE IF EXISTS `hims_d_cpt_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_cpt_code` (
  `hims_d_cpt_code_id` int NOT NULL AUTO_INCREMENT,
  `cpt_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cpt_desc` char(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `long_cpt_desc` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `prefLabel` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cpt_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE\nI = INACTIVE',
  PRIMARY KEY (`hims_d_cpt_code_id`),
  UNIQUE KEY `cpt_code_UNIQUE` (`cpt_code`),
  KEY `hims_f_patient_diagnosis_fk1_idx` (`cpt_code`),
  KEY `hims_f_patient_diagnosis_fk2_idx` (`created_by`),
  KEY `hims_f_patient_diagnosis_fk2_idx1` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_cpt_code_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_cpt_code_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37428 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_currency`
--

DROP TABLE IF EXISTS `hims_d_currency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_currency` (
  `hims_d_currency_id` int NOT NULL AUTO_INCREMENT,
  `currency_code` varchar(15) NOT NULL,
  `currency_description` varchar(60) NOT NULL,
  `currency_symbol` varchar(15) NOT NULL,
  `decimal_places` enum('0','1','2','3') DEFAULT NULL,
  `symbol_position` enum('BWS','BS','AWS','AS') DEFAULT NULL COMMENT 'BWS = BEFORE  WITHOUT SPACE\\\\nBS = BEFORE  WITH SPACE\\\\nAWS = AFTER WITHOUT SPACE\\\\nAS = AFTER WITH  SPACE',
  `thousand_separator` enum('','.',',') DEFAULT NULL COMMENT ''' ''= SPACE\\\\n. = PERIOD\\\\n, =COMMA',
  `decimal_separator` enum(',','.') DEFAULT NULL COMMENT '. = DOT\\n, =COMMA',
  `negative_separator` enum('TR','LD') DEFAULT NULL COMMENT 'TR = TRAILING\nLD = LEADING',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_currency_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_customer`
--

DROP TABLE IF EXISTS `hims_d_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_customer` (
  `hims_d_customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_code` varchar(15) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_status` enum('A','I') DEFAULT 'A',
  `business_registration_no` varchar(25) DEFAULT NULL,
  `email_id_1` varchar(60) DEFAULT NULL,
  `email_id_2` varchar(45) DEFAULT NULL,
  `website` varchar(75) DEFAULT NULL,
  `contact_number` varchar(45) DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT NULL COMMENT '''0'' = 0 days\n ’15’ = 15 days\n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `payment_mode` enum('CS','CH','BT','DC','CC') DEFAULT NULL COMMENT 'CS = CASH\\nCH = CHEQUE\\nBT = BANK TRANSFER\\nDC = DEBIT CARD\\nCC = CREDIT CARD',
  `bank_name` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `purchase_inch_name` varchar(45) DEFAULT NULL,
  `purchase_inch_number` varchar(45) DEFAULT NULL,
  `purchase_inch_emailid` varchar(45) DEFAULT NULL,
  `project_inch_name` varchar(45) DEFAULT NULL,
  `project_inch_number` varchar(45) DEFAULT NULL,
  `project_inch_emailid` varchar(45) DEFAULT NULL,
  `finance_inch_name` varchar(45) DEFAULT NULL,
  `finance_inch_number` varchar(45) DEFAULT NULL,
  `finance_inch_emailid` varchar(45) DEFAULT NULL,
  `contact_person` varchar(45) DEFAULT NULL,
  `vat_number` varchar(45) DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `arabic_customer_name` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE \\nI = INACTIVE',
  PRIMARY KEY (`hims_d_customer_id`),
  KEY `hims_d_customer_fk1_idx` (`country_id`),
  KEY `hims_d_customer_fk2_idx` (`state_id`),
  KEY `hims_d_customer_fk3_idx` (`city_id`),
  KEY `hims_d_customer_fk4_idx` (`created_by`),
  KEY `hims_d_customer_fk5_idx` (`updated_by`),
  KEY `hims_d_customer_fk6_idx` (`head_id`),
  KEY `hims_d_customer_fk7_idx` (`child_id`),
  CONSTRAINT `hims_d_customer_fk1` FOREIGN KEY (`country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`),
  CONSTRAINT `hims_d_customer_fk2` FOREIGN KEY (`state_id`) REFERENCES `hims_d_state` (`hims_d_state_id`),
  CONSTRAINT `hims_d_customer_fk3` FOREIGN KEY (`city_id`) REFERENCES `hims_d_city` (`hims_d_city_id`),
  CONSTRAINT `hims_d_customer_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_customer_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_department`
--

DROP TABLE IF EXISTS `hims_d_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_department` (
  `hims_d_department_id` int NOT NULL AUTO_INCREMENT,
  `department_code` varchar(45) NOT NULL,
  `department_name` varchar(150) NOT NULL,
  `arabic_department_name` varchar(150) DEFAULT NULL,
  `department_desc` varchar(300) DEFAULT NULL,
  `department_type` enum('CLINICAL','NON-CLINICAL') NOT NULL,
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date DEFAULT '9999-12-31',
  `department_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_department_id`),
  UNIQUE KEY `department_code_UNIQUE` (`department_code`),
  UNIQUE KEY `department_name_UNIQUE` (`department_name`),
  UNIQUE KEY `index2` (`department_code`,`department_name`,`effective_start_date`,`effective_end_date`,`department_status`,`record_status`),
  KEY `index3` (`department_type`),
  KEY `index4` (`effective_start_date`),
  KEY `index5` (`effective_end_date`),
  KEY `index6` (`department_status`),
  KEY `index7` (`record_status`),
  KEY `hims_d_department_fk2_idx` (`created_by`),
  KEY `hims_d_department_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_department_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_department_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_designation`
--

DROP TABLE IF EXISTS `hims_d_designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_designation` (
  `hims_d_designation_id` int NOT NULL AUTO_INCREMENT,
  `designation_code` varchar(45) DEFAULT NULL,
  `designation` varchar(250) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_designation_id`),
  KEY `hims_d_designation_fk1_idx` (`created_by`),
  KEY `hims_d_designation_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_designation_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_designation_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_diet_master`
--

DROP TABLE IF EXISTS `hims_d_diet_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_diet_master` (
  `hims_d_diet_master_id` int NOT NULL AUTO_INCREMENT,
  `hims_d_diet_description` varchar(90) DEFAULT NULL,
  `hims_d_diet_note` varchar(200) DEFAULT NULL,
  `diet_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A= ACTIVE \nI = INACTIVE',
  PRIMARY KEY (`hims_d_diet_master_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_document_type`
--

DROP TABLE IF EXISTS `hims_d_document_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_document_type` (
  `hims_d_document_type_id` int NOT NULL AUTO_INCREMENT,
  `document_type` enum('C','E') DEFAULT 'C' COMMENT 'C = COMPANY\nE = EMPLOYEE',
  `document_description` varchar(150) NOT NULL,
  `arabic_name` varchar(150) DEFAULT NULL,
  `document_type_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_document_type_id`),
  UNIQUE KEY `document_description_UNIQUE` (`document_description`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_earning_deduction`
--

DROP TABLE IF EXISTS `hims_d_earning_deduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_earning_deduction` (
  `hims_d_earning_deduction_id` int NOT NULL AUTO_INCREMENT,
  `earning_deduction_code` varchar(45) NOT NULL,
  `earning_deduction_description` varchar(90) DEFAULT NULL,
  `short_desc` varchar(25) DEFAULT NULL,
  `component_category` enum('A','E','D','C') DEFAULT 'E' COMMENT 'A = ADVANCE, E= EARNINGS, D = DEDUCTION , C = EMPLOYER CONTRIBUTION',
  `calculation_method` enum('FO','FI') DEFAULT 'FI' COMMENT 'FO = FORMULA\nFI = FIXED',
  `formula` varchar(250) DEFAULT NULL,
  `component_frequency` enum('M','Y','Q','H') DEFAULT 'M' COMMENT 'M = MONTHLY\nY = YEARLY\nQ = QUATERLY\nH = HOURLY\n',
  `calculation_type` enum('F','V') DEFAULT 'F' COMMENT 'F= FIXED\nV = VARIABLE',
  `component_type` enum('N','B','EEP','ERP','LS','LE','EOS','FS','LOP','NP','AR','AD','OV') DEFAULT 'N' COMMENT 'N = NONE\\\\\\\\nB = BONUS\\\\\\\\nEEP = EMPLOYEE PF\\\\\\\\nERP = EMPLOYER PF\\\\\\\\nLS = LEAVE SALARY\\\\\\\\nLE= LEAVE ENCASHMENT\\\\\\\\nEOS = END OF SERVICE\\\\\\\\nFS = FINAL SETTLEMENT\\\\\\\\nLOP = LOP DEDUCTION\\\\\\\\nNP =NOTICE PERIOD\\\\\\\\nAR = AIRFARE\\\\\\\\nAD= ADVANCE DEDUCTION\\\\\\\\nOV= Overtime',
  `shortage_deduction_applicable` enum('N','Y') DEFAULT 'N',
  `overtime_applicable` enum('N','Y') DEFAULT 'N',
  `min_limit_applicable` enum('N','Y') DEFAULT 'N',
  `min_limit_amount` decimal(10,3) DEFAULT NULL,
  `limit_applicable` enum('N','Y') DEFAULT 'N',
  `limit_amount` decimal(10,3) DEFAULT NULL,
  `process_limit_required` enum('N','Y') DEFAULT 'N',
  `process_limit_days` smallint DEFAULT NULL,
  `miscellaneous_component` enum('N','Y') DEFAULT 'N',
  `general_ledger` varchar(45) DEFAULT NULL,
  `liability_account` varchar(45) DEFAULT NULL,
  `allow_round_off` enum('N','Y') DEFAULT NULL,
  `round_off_type` enum('FL','CL','RD') DEFAULT 'RD' COMMENT 'FL = FLOOR\nCL = CIELING\nRD = ROUND\n',
  `round_off_amount` decimal(10,3) DEFAULT NULL,
  `annual_salary_comp` enum('N','Y') DEFAULT 'N',
  `specific_nationality` enum('N','Y') DEFAULT 'N',
  `nationality_id` int DEFAULT NULL,
  `print_report` enum('N','Y') DEFAULT 'N',
  `print_order_by` int DEFAULT '0',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `li_head_id` int DEFAULT NULL,
  `li_child_id` int DEFAULT NULL,
  `direct_head_id` int DEFAULT NULL,
  `direct_child_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE\nI = INACTIVE',
  PRIMARY KEY (`hims_d_earning_deduction_id`),
  UNIQUE KEY `earning_deduction_code_UNIQUE` (`earning_deduction_code`),
  KEY `hims_d_earning_deduction_fk1_idx` (`created_by`),
  KEY `hims_d_earning_deduction_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_earning_deduction_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_earning_deduction_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee`
--

DROP TABLE IF EXISTS `hims_d_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee` (
  `hims_d_employee_id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `title_id` int DEFAULT NULL,
  `biometric_id` varchar(45) DEFAULT NULL,
  `full_name` varchar(750) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_name` varchar(750) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employee_designation_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `sex` enum('MALE','FEMALE','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `religion_id` int DEFAULT NULL,
  `marital_status` enum('S','M','D','W') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'S' COMMENT 'S=SINGLE,M=MARRIED,D=DIVORSED,W=WIDOW',
  `date_of_birth` date DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `date_of_resignation` date DEFAULT NULL,
  `reliving_date` date DEFAULT NULL,
  `notice_period` smallint DEFAULT NULL,
  `exit_date` date DEFAULT NULL,
  `employe_exit_type` enum('R','T','E') DEFAULT NULL COMMENT 'R = RESIGNED\\\\nT= TERMINATED\\nE = RETIREMENT',
  `appointment_type` enum('A','D','R') DEFAULT 'A' COMMENT 'A = AGENCY\nD = DIRECT\nR = REFERAL',
  `employee_type` enum('PE','CO','PB','LC','VC') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'PE' COMMENT 'PE=PERMANENT,CO=CONTRACT,PB=PROBATION,LC=LOCUM,\nVC=VISITING CONSULTANT',
  `present_address` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `present_address2` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `present_pincode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `present_city_id` int DEFAULT NULL,
  `present_state_id` int DEFAULT NULL,
  `present_country_id` int DEFAULT NULL,
  `permanent_address` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `permanent_address2` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `permanent_pincode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `permanent_city_id` int DEFAULT NULL,
  `permanent_state_id` int DEFAULT NULL,
  `permanent_country_id` int DEFAULT NULL,
  `primary_contact_no` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_contact_no` varchar(17) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `work_email` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nationality` int DEFAULT NULL,
  `emergency_contact_person` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `emergency_contact_no` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `blood_group` enum('O+','O-','A+','A-','B+','B-','AB+','AB-') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isdoctor` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `license_number` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employee_status` enum('A','I','R','T','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A= ACTIVE\\\\nI = INACTIVE\\\\nR = RESIGNED\\\\nT= TERMINATED\\\\nE = RETIREMENT',
  `inactive_date` date DEFAULT NULL,
  `exclude_machine_data` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `company_bank_id` int DEFAULT NULL,
  `employee_bank_id` int DEFAULT NULL,
  `employee_bank_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employee_bank_ifsc_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `employee_account_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mode_of_payment` enum('CA','CH','TRF','WPS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'CA' COMMENT 'CA = CASH\nCH = CHEQUE\nTRF = TRANSFER\nWPS = WAGES AND PROCTECTION SYSTEM',
  `accomodation_provided` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `late_coming_rule` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `leave_salary_process` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `pf_applicable` enum('N','Y') DEFAULT 'N',
  `airfare_process` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `entitled_daily_ot` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `suspend_salary` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `last_salary_process_date` date DEFAULT NULL,
  `gratuity_applicable` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `contract_type` enum('U','L') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'U' COMMENT 'U = Unlimited , L = Limited',
  `employee_group_id` int DEFAULT NULL,
  `weekoff_from` enum('STD','SHF') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'STD' COMMENT 'STD= STANDARD WEEKOFF\\nSHF= SHIFT ROSTER',
  `overtime_group_id` int DEFAULT NULL,
  `reporting_to_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `gross_salary` decimal(10,3) DEFAULT NULL,
  `yearly_gross_salary` decimal(10,3) DEFAULT NULL,
  `total_earnings` decimal(10,3) DEFAULT NULL,
  `total_deductions` decimal(10,3) DEFAULT NULL,
  `total_contributions` decimal(10,3) DEFAULT NULL,
  `net_salary` decimal(10,3) DEFAULT NULL,
  `cost_to_company` decimal(10,3) DEFAULT NULL,
  `settled` enum('N','Y') DEFAULT 'N',
  `final_settled_id` int DEFAULT NULL,
  `effective_start_date` date DEFAULT '1900-01-01',
  `effective_end_date` date DEFAULT '9999-12-31',
  `services_id` int DEFAULT NULL,
  `employee_category` enum('A','P') DEFAULT NULL COMMENT 'A= “Admin”, “P” = “Project”',
  `gratuity_encash` decimal(10,3) DEFAULT '0.000',
  `identity_type_id` int DEFAULT NULL,
  `identity_no` varchar(50) DEFAULT NULL,
  `eos_id` int DEFAULT NULL,
  `agency_id` int DEFAULT NULL,
  `service_dis_percentage` decimal(10,3) DEFAULT '0.000',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_employee_id`),
  UNIQUE KEY `employee_code_uq` (`employee_code`),
  KEY `hims_d_employee_fk1_idx` (`present_city_id`),
  KEY `hims_d_employee_fk2_idx` (`present_state_id`),
  KEY `hims_d_employee_fk3_idx` (`present_country_id`),
  KEY `hims_d_employee_fk4_idx` (`created_by`),
  KEY `hims_d_employee_fk5_idx` (`updated_by`),
  KEY `hims_d_employee_fk6_idx` (`employee_designation_id`),
  KEY `hims_d_employee_fk9_idx` (`title_id`),
  KEY `hims_d_employee_fk10_idx` (`religion_id`),
  KEY `hims_d_employee_fk11_idx` (`permanent_country_id`),
  KEY `hims_d_employee_fk12_idx` (`permanent_state_id`),
  KEY `hims_d_employee_fk13_idx` (`permanent_city_id`),
  KEY `hims_d_employee_fk15_idx` (`sub_department_id`),
  KEY `hims_d_employee_fk16_idx` (`employee_group_id`),
  KEY `hims_d_employee_fk10_idx1` (`user_id`),
  KEY `hims_d_employee_fk17_idx` (`final_settled_id`),
  KEY `hims_d_employee_fk18_idx` (`company_bank_id`),
  KEY `hims_d_employee_fk24_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_d_employee_fk30_idx` (`overtime_group_id`),
  KEY `hims_d_employee_fk19_idx` (`services_id`),
  KEY `sub_department_id_fk27_idx` (`identity_type_id`),
  KEY `hims_d_employee_fk31_idx` (`eos_id`),
  KEY `hims_d_employee_fk32_idx` (`agency_id`),
  CONSTRAINT `hims_d_employee_fk1` FOREIGN KEY (`present_city_id`) REFERENCES `hims_d_city` (`hims_d_city_id`),
  CONSTRAINT `hims_d_employee_fk11` FOREIGN KEY (`permanent_country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`),
  CONSTRAINT `hims_d_employee_fk12` FOREIGN KEY (`permanent_state_id`) REFERENCES `hims_d_state` (`hims_d_state_id`),
  CONSTRAINT `hims_d_employee_fk13` FOREIGN KEY (`permanent_city_id`) REFERENCES `hims_d_city` (`hims_d_city_id`),
  CONSTRAINT `hims_d_employee_fk16` FOREIGN KEY (`employee_group_id`) REFERENCES `hims_d_employee_group` (`hims_d_employee_group_id`),
  CONSTRAINT `hims_d_employee_fk17` FOREIGN KEY (`final_settled_id`) REFERENCES `hims_f_final_settlement_header` (`hims_f_final_settlement_header_id`),
  CONSTRAINT `hims_d_employee_fk18` FOREIGN KEY (`company_bank_id`) REFERENCES `hims_d_bank` (`hims_d_bank_id`),
  CONSTRAINT `hims_d_employee_fk19` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_d_employee_fk2` FOREIGN KEY (`present_state_id`) REFERENCES `hims_d_state` (`hims_d_state_id`),
  CONSTRAINT `hims_d_employee_fk21` FOREIGN KEY (`religion_id`) REFERENCES `hims_d_religion` (`hims_d_religion_id`),
  CONSTRAINT `hims_d_employee_fk24` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_employee_fk3` FOREIGN KEY (`present_country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`),
  CONSTRAINT `hims_d_employee_fk30` FOREIGN KEY (`overtime_group_id`) REFERENCES `hims_d_overtime_group` (`hims_d_overtime_group_id`),
  CONSTRAINT `hims_d_employee_fk31` FOREIGN KEY (`eos_id`) REFERENCES `hims_d_end_of_service_reasons` (`eos_reson_id`),
  CONSTRAINT `hims_d_employee_fk32` FOREIGN KEY (`agency_id`) REFERENCES `hims_d_agency` (`hims_d_agency_id`),
  CONSTRAINT `hims_d_employee_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_fk6` FOREIGN KEY (`employee_designation_id`) REFERENCES `hims_d_designation` (`hims_d_designation_id`),
  CONSTRAINT `hims_d_employee_fk9` FOREIGN KEY (`title_id`) REFERENCES `hims_d_title` (`his_d_title_id`),
  CONSTRAINT `sub_department_id_fk26` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_category`
--

DROP TABLE IF EXISTS `hims_d_employee_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_category` (
  `hims_employee_category_id` int NOT NULL AUTO_INCREMENT,
  `employee_category_code` varchar(45) NOT NULL,
  `employee_category_name` varchar(250) NOT NULL,
  `arabic_name` varchar(100) DEFAULT NULL,
  `employee_category_desc` varchar(500) DEFAULT NULL,
  `employee_category_status` enum('A','I') NOT NULL DEFAULT 'A',
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date DEFAULT '9999-12-31',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(45) DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(45) DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_employee_category_id`),
  UNIQUE KEY `index2` (`employee_category_code`,`employee_category_name`,`employee_category_status`,`effective_start_date`,`effective_end_date`,`record_status`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_contributions`
--

DROP TABLE IF EXISTS `hims_d_employee_contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_contributions` (
  `hims_d_employee_contributions_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `contributions_id` int NOT NULL,
  `short_desc` varchar(25) DEFAULT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  `formula` varchar(250) DEFAULT NULL,
  `allocate` enum('N','Y') DEFAULT 'N',
  `calculation_method` enum('N','FI','FO') DEFAULT 'N' COMMENT 'N = NONE\\nFI = FIXED\\nFO = FORMULA',
  `calculation_type` enum('V','F') DEFAULT 'V',
  `revision_type` enum('N','C','R') DEFAULT 'N' COMMENT 'N = NONE\\nC = CUTOFF\\nR = REVISED',
  `revision_date` date DEFAULT NULL,
  `revised_amount` decimal(10,3) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_employee_contributions_id`),
  KEY `hims_d_employee_contributions_fk1_idx` (`employee_id`),
  KEY `hims_d_employee_contributions_fk2_idx` (`contributions_id`),
  KEY `hims_d_employee_contributions_fk4_idx` (`hospital_id`),
  CONSTRAINT `hims_d_employee_contributions_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_contributions_fk2` FOREIGN KEY (`contributions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_employee_contributions_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_deductions`
--

DROP TABLE IF EXISTS `hims_d_employee_deductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_deductions` (
  `hims_d_employee_deductions_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `deductions_id` int NOT NULL,
  `short_desc` varchar(25) DEFAULT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  `formula` varchar(250) DEFAULT NULL,
  `allocate` enum('N','Y') DEFAULT 'N',
  `calculation_method` enum('N','FI','FO') DEFAULT 'N' COMMENT 'N = NONE\\nFI = FIXED\\nFO = FORMULA',
  `calculation_type` enum('V','F') DEFAULT 'V' COMMENT 'V = VARIABLE,\nF = FIXED',
  `revision_type` enum('N','C','R') DEFAULT 'N' COMMENT 'N = NONE\\nC = CUTOFF\\nR = REVISED',
  `revision_date` date DEFAULT NULL,
  `revised_amount` decimal(10,3) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_employee_deductions_id`),
  KEY `hims_d_employee_deductions_fk1_idx` (`employee_id`),
  KEY `hims_d_employee_deductions_fk2_idx` (`deductions_id`),
  KEY `hims_d_employee_deductions_fk5_idx` (`hospital_id`),
  CONSTRAINT `hims_d_employee_deductions_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_deductions_fk2` FOREIGN KEY (`deductions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_employee_deductions_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_dependents`
--

DROP TABLE IF EXISTS `hims_d_employee_dependents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_dependents` (
  `hims_d_employee_dependents_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `dependent_type` enum('SP','FT','MT','GU','SO','DG','ME') NOT NULL DEFAULT 'SP' COMMENT 'SP = SPOUSE\\\\nFT = FATHER\\\\nMT = MOTHER\\\\nGU = GAURDIAN\\\\nSO =SON\\\\nDG = DAUGHTER\\nME=SELF',
  `dependent_name` varchar(100) DEFAULT NULL,
  `dependent_identity_type` int DEFAULT NULL,
  `dependent_identity_no` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_employee_dependents_id`),
  KEY `hims_d_employee_dependents_fk1_idx` (`created_by`),
  KEY `hims_d_employee_dependents_fk2_idx` (`updated_by`),
  KEY `hims_d_employee_dependents_fk3_idx` (`employee_id`),
  KEY `hims_d_employee_dependents_fk4_idx` (`dependent_identity_type`),
  KEY `hims_d_employee_dependents_fk8_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_employee_dependents_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_dependents_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_dependents_fk3` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_dependents_fk4` FOREIGN KEY (`dependent_identity_type`) REFERENCES `hims_d_identity_document` (`hims_d_identity_document_id`),
  CONSTRAINT `hims_d_employee_dependents_fk8` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_earnings`
--

DROP TABLE IF EXISTS `hims_d_employee_earnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_earnings` (
  `hims_d_employee_earnings_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `earnings_id` int NOT NULL,
  `short_desc` varchar(25) DEFAULT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  `formula` varchar(250) DEFAULT NULL,
  `allocate` enum('N','Y') DEFAULT 'N',
  `calculation_method` enum('N','FI','FO') DEFAULT 'N' COMMENT 'N = NONE\nFI = FIXED\nFO = FORMULA',
  `calculation_type` enum('V','F') DEFAULT 'V' COMMENT 'V = VARAIBLE\nF = FIXED\n',
  `revision_type` enum('N','C','R') DEFAULT 'N' COMMENT 'N = NONE\nC = CUTOFF\nR = REVISED',
  `revision_date` date DEFAULT NULL,
  `revised_amount` decimal(10,3) DEFAULT NULL,
  `applicable_annual_leave` enum('N','Y') DEFAULT 'N',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_employee_earnings_id`),
  KEY `hims_d_employee_earnings_fk1_idx` (`employee_id`),
  KEY `hims_d_employee_earnings_fk2_idx` (`earnings_id`),
  KEY `hims_d_employee_earnings_fk4_idx` (`hospital_id`),
  CONSTRAINT `hims_d_employee_earnings_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_earnings_fk2` FOREIGN KEY (`earnings_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_employee_earnings_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_education`
--

DROP TABLE IF EXISTS `hims_d_employee_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_education` (
  `hims_d_employee_education_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `qualification` varchar(90) DEFAULT NULL,
  `qualitfication_type` enum('FT','PT') DEFAULT NULL COMMENT 'FT = FULL TIME , PT = PART TIME',
  `year` smallint DEFAULT NULL,
  `university` varchar(90) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_employee_education_id`),
  KEY `hims_d_employee_education_fk1_idx` (`created_by`),
  KEY `hims_d_employee_education_fk2_idx` (`updated_by`),
  KEY `hims_d_employee_education_fk3_idx` (`employee_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_employee_education_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_education_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_education_fk3` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_experience`
--

DROP TABLE IF EXISTS `hims_d_employee_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_experience` (
  `hims_d_employee_experience_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `previous_company_name` varchar(60) DEFAULT NULL,
  `designation` varchar(60) DEFAULT NULL,
  `experience_years` tinyint DEFAULT NULL,
  `experience_months` tinyint DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_employee_experience_id`),
  KEY `hims_d_employee_experience_FK1_idx` (`employee_id`),
  KEY `hims_d_employee_experience_fk2_idx` (`created_by`),
  KEY `hims_d_employee_experience_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_employee_experience_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_experience_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_experience_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_group`
--

DROP TABLE IF EXISTS `hims_d_employee_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_group` (
  `hims_d_employee_group_id` int NOT NULL AUTO_INCREMENT,
  `group_code` varchar(45) DEFAULT NULL,
  `group_description` varchar(60) DEFAULT NULL,
  `monthly_accrual_days` decimal(5,2) DEFAULT NULL,
  `airfare_eligibility` enum('6','12','18','24') DEFAULT '12',
  `airfare_amount` decimal(10,3) DEFAULT NULL,
  `ramzan_timing` enum('Y','N') DEFAULT 'N',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_employee_group_id`),
  UNIQUE KEY `group_code_UNIQUE` (`group_code`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_identification`
--

DROP TABLE IF EXISTS `hims_d_employee_identification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_identification` (
  `hims_d_employee_identification_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `identity_documents_id` int DEFAULT NULL,
  `identity_number` varchar(45) DEFAULT NULL,
  `valid_upto` date DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `alert_required` enum('N','Y') DEFAULT 'N',
  `alert_date` date DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_employee_identification_id`),
  KEY `hims_d_employee_identification_FK1_idx` (`created_by`),
  KEY `hims_d_employee_identification_fk2_idx` (`updated_by`),
  KEY `hims_d_employee_identification_fk3_idx` (`employee_id`),
  KEY `hims_d_employee_identification_fk4_idx` (`identity_documents_id`),
  KEY `hims_d_employee_identification_fk7_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_employee_identification_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_identification_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_identification_fk3` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_identification_fk4` FOREIGN KEY (`identity_documents_id`) REFERENCES `hims_d_identity_document` (`hims_d_identity_document_id`),
  CONSTRAINT `hims_d_employee_identification_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_employee_speciality`
--

DROP TABLE IF EXISTS `hims_d_employee_speciality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_employee_speciality` (
  `hims_d_employee_speciality_id` int NOT NULL AUTO_INCREMENT,
  `sub_department_id` int DEFAULT NULL,
  `speciality_code` varchar(50) NOT NULL,
  `speciality_name` varchar(250) NOT NULL,
  `arabic_name` varchar(100) DEFAULT NULL,
  `speciality_desc` varchar(500) DEFAULT NULL,
  `speciality_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_employee_speciality_id`),
  KEY `hims_d_employee_speciality_fk1_idx` (`sub_department_id`),
  KEY `hims_d_employee_speciality_fk2_idx` (`created_by`),
  KEY `hims_d_employee_speciality_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_employee_speciality_fk1` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_d_employee_speciality_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_speciality_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_end_of_service_options`
--

DROP TABLE IF EXISTS `hims_d_end_of_service_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_end_of_service_options` (
  `hims_d_end_of_service_options_id` int NOT NULL AUTO_INCREMENT,
  `end_of_service_component1` int DEFAULT NULL,
  `end_of_service_component2` int DEFAULT NULL,
  `end_of_service_component3` int DEFAULT NULL,
  `end_of_service_component4` int DEFAULT NULL,
  `from_service_range1` smallint DEFAULT NULL,
  `from_service_range2` smallint DEFAULT NULL,
  `from_service_range3` smallint DEFAULT NULL,
  `from_service_range4` smallint DEFAULT NULL,
  `from_service_range5` smallint DEFAULT NULL,
  `eligible_days1` decimal(5,2) DEFAULT NULL,
  `eligible_days2` decimal(5,2) DEFAULT NULL,
  `eligible_days3` decimal(5,2) DEFAULT NULL,
  `eligible_days4` decimal(5,2) DEFAULT NULL,
  `eligible_days5` decimal(5,2) DEFAULT NULL,
  `benifit_day1` decimal(5,2) DEFAULT NULL,
  `benifit_day2` decimal(6,5) DEFAULT NULL,
  `benifit_day3` decimal(6,5) DEFAULT NULL,
  `benifit_day4` decimal(6,5) DEFAULT NULL,
  `benifit_day5` decimal(6,5) DEFAULT NULL,
  `end_of_service_component_t1` int DEFAULT NULL,
  `end_of_service_component_t2` int DEFAULT NULL,
  `end_of_service_component_t3` int DEFAULT NULL,
  `end_of_service_component_t4` int DEFAULT NULL,
  `from_service_range_t1` smallint DEFAULT NULL,
  `from_service_range_t2` smallint DEFAULT NULL,
  `from_service_range_t3` smallint DEFAULT NULL,
  `from_service_range_t4` smallint DEFAULT NULL,
  `from_service_range_t5` smallint DEFAULT NULL,
  `eligible_days_t1` decimal(5,2) DEFAULT NULL,
  `eligible_days_t2` decimal(5,2) DEFAULT NULL,
  `eligible_days_t3` decimal(5,2) DEFAULT NULL,
  `eligible_days_t4` decimal(5,2) DEFAULT NULL,
  `eligible_days_t5` decimal(5,2) DEFAULT NULL,
  `end_of_service_calculation` enum('AN','FI') DEFAULT 'AN' COMMENT 'AN = ANNUALIZED\\nFI = FIXED',
  `end_of_service_days` smallint unsigned DEFAULT '0',
  `end_of_service_type` enum('S','H') DEFAULT 'S' COMMENT 'S =SLAB \nH = HIERARCHICAL',
  `gratuity_in_final_settle` enum('N','Y') DEFAULT 'N',
  `terminate_salary` enum('ACT','FUL') DEFAULT 'ACT' COMMENT 'act =actual,FUL = FULL',
  `end_of_service_payment` enum('EOS','YEA') DEFAULT NULL COMMENT 'EOS = END OF SERVICE \nYEA = YEARLY',
  `end_of_service_years` enum('ACT','LIM') DEFAULT NULL COMMENT 'ACT = ACTUALS\\nLIM = LIMITED',
  `limited_years` decimal(4,2) DEFAULT NULL,
  `round_off_nearest_year` enum('Y','N') DEFAULT NULL,
  `pending_salary_with_final` enum('Y','N') DEFAULT NULL,
  `gratuity_provision` enum('0','1','2') DEFAULT '0' COMMENT '0 - None, 1 - Salary Level, 2 - Yearly',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`hims_d_end_of_service_options_id`),
  KEY `hims_d_end_of_service_options_fk1_idx` (`end_of_service_component1`),
  KEY `hims_d_end_of_service_options_fk2_idx` (`end_of_service_component2`),
  KEY `hims_d_end_of_service_options_fk3_idx` (`end_of_service_component3`),
  KEY `hims_d_end_of_service_options_fk4_idx` (`end_of_service_component4`),
  CONSTRAINT `hims_d_end_of_service_options_fk1` FOREIGN KEY (`end_of_service_component1`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_end_of_service_options_fk2` FOREIGN KEY (`end_of_service_component2`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_end_of_service_options_fk3` FOREIGN KEY (`end_of_service_component3`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_end_of_service_options_fk4` FOREIGN KEY (`end_of_service_component4`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_end_of_service_reasons`
--

DROP TABLE IF EXISTS `hims_d_end_of_service_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_end_of_service_reasons` (
  `eos_reson_id` int NOT NULL AUTO_INCREMENT,
  `eos_reason_name` varchar(180) DEFAULT NULL,
  `eos_reason_other_lan` varchar(180) DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`eos_reson_id`),
  KEY `hims_d_end_of_service_reasons_fk1_idx` (`created_by`),
  KEY `hims_d_end_of_service_reasons_fk2_idx` (`update_by`),
  KEY `hims_d_end_of_service_reasons_fk3_idx` (`country_id`),
  CONSTRAINT `hims_d_end_of_service_reasons_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_end_of_service_reasons_fk2` FOREIGN KEY (`update_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_end_of_service_reasons_fk3` FOREIGN KEY (`country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_equipment`
--

DROP TABLE IF EXISTS `hims_d_equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_equipment` (
  `hims_d_equipment_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) DEFAULT NULL,
  `bits_per_sec` int DEFAULT NULL,
  `data_bits` int DEFAULT NULL,
  `parity` enum('E','O','N','M','S') DEFAULT NULL COMMENT 'E=EVEN\nO=ODD\nN=none\nM=mark\nS=space\n',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_d_equipment_id`),
  KEY `hims_d_equipment_fk1_idx` (`created_by`),
  KEY `hims_d_equipment_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_equipment_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_equipment_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_equipment_detail`
--

DROP TABLE IF EXISTS `hims_d_equipment_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_equipment_detail` (
  `hims_d_equipment_detail_id` int NOT NULL,
  `hims_d_equipment_id` int DEFAULT NULL,
  `machine_analyte_code` varchar(20) NOT NULL,
  `lab_analytes_id` int NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `update_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_equipment_detail_id`),
  KEY `hims_d_equipment_detail_fk1_idx` (`hims_d_equipment_id`),
  KEY `hims_d_equipment_detail_fk2_idx` (`lab_analytes_id`),
  KEY `hims_d_equipment_detail_fk3_idx` (`created_by`),
  KEY `hims_d_equipment_detail_fk4_idx` (`update_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_equipment_detail_fk1` FOREIGN KEY (`hims_d_equipment_id`) REFERENCES `hims_d_equipment` (`hims_d_equipment_id`),
  CONSTRAINT `hims_d_equipment_detail_fk2` FOREIGN KEY (`lab_analytes_id`) REFERENCES `hims_d_lab_analytes` (`hims_d_lab_analytes_id`),
  CONSTRAINT `hims_d_equipment_detail_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_equipment_detail_fk4` FOREIGN KEY (`update_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_favourite_orders_detail`
--

DROP TABLE IF EXISTS `hims_d_favourite_orders_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_favourite_orders_detail` (
  `hims_d_favourite_orders_detail_id` int NOT NULL AUTO_INCREMENT,
  `favourite_orders_header_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL COMMENT 'A= ACTIVE \\\\nI = INACTIVE',
  PRIMARY KEY (`hims_d_favourite_orders_detail_id`),
  KEY `hims_d_favourite_orders_detail_fk1_idx` (`favourite_orders_header_id`),
  KEY `hims_d_favourite_orders_detail_fk13_idx` (`services_id`),
  KEY `hims_d_favourite_orders_detail_fk12_idx` (`service_type_id`),
  CONSTRAINT `hims_d_favourite_orders_detail_fk1` FOREIGN KEY (`favourite_orders_header_id`) REFERENCES `hims_d_favourite_orders_header` (`hims_d_favourite_orders_header_id`),
  CONSTRAINT `hims_d_favourite_orders_detail_fk2` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_d_favourite_orders_detail_fk3` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_favourite_orders_header`
--

DROP TABLE IF EXISTS `hims_d_favourite_orders_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_favourite_orders_header` (
  `hims_d_favourite_orders_header_id` int NOT NULL AUTO_INCREMENT,
  `favourite_description` varchar(45) DEFAULT NULL,
  `favourite_status` enum('A','I') DEFAULT 'A' COMMENT 'A= ACTIVE \\\\\\\\nI = INACTIVE',
  `doctor_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_favourite_orders_header_id`),
  KEY `hims_d_favourite_orders_header_fk1_idx` (`doctor_id`),
  KEY `hims_d_favourite_orders_header_fk2_idx` (`created_by`),
  KEY `hims_d_favourite_orders_header_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_d_favourite_orders_header_fk1` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_favourite_orders_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_favourite_orders_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_favourite_services`
--

DROP TABLE IF EXISTS `hims_d_favourite_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_favourite_services` (
  `hims_d_favourite_services_id` int NOT NULL AUTO_INCREMENT,
  `service_type_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL COMMENT 'A= ACTIVE \\\\\\\\nI = INACTIVE',
  `doctor_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hims_d_favourite_services_id`),
  KEY `hims_d_favourite_services_fk1_idx` (`service_type_id`),
  KEY `hims_d_favourite_services_fk2_idx` (`services_id`),
  KEY `hims_d_favourite_services_fk3_idx` (`created_by`),
  KEY `hims_d_favourite_services_fk4_idx` (`updated_by`),
  KEY `hims_d_favourite_services_fk5_idx` (`doctor_id`),
  CONSTRAINT `hims_d_favourite_services_fk1` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_d_favourite_services_fk2` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_d_favourite_services_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_favourite_services_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_favourite_services_fk5` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_group_comment`
--

DROP TABLE IF EXISTS `hims_d_group_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_group_comment` (
  `hims_d_group_comment_id` int NOT NULL AUTO_INCREMENT,
  `micro_group_id` int DEFAULT NULL,
  `commnet_name` varchar(45) DEFAULT NULL,
  `commet` varchar(3000) DEFAULT NULL,
  `comment_status` enum('A','I') DEFAULT 'A' COMMENT 'A- Active, I- Inactive',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hims_d_group_comment_id`),
  KEY `hims_d_group_comment_fk1_idx` (`micro_group_id`),
  KEY `hims_d_group_comment_fk2_idx` (`created_by`),
  KEY `hims_d_group_comment_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_d_group_comment_fk1` FOREIGN KEY (`micro_group_id`) REFERENCES `hims_d_micro_group` (`hims_d_micro_group_id`),
  CONSTRAINT `hims_d_group_comment_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_group_comment_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_holiday`
--

DROP TABLE IF EXISTS `hims_d_holiday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_holiday` (
  `hims_d_holiday_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int DEFAULT NULL,
  `holiday_date` date NOT NULL,
  `holiday_description` varchar(100) DEFAULT NULL,
  `weekoff` enum('N','Y') DEFAULT 'N',
  `holiday` enum('N','Y') DEFAULT 'N',
  `holiday_type` enum('RE','RS') DEFAULT 'RE' COMMENT 'RE = REGULAR\nRS=RESTRICTED',
  `religion_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_holiday_id`),
  KEY `hims_d_holiday_fk1_idx` (`created_by`),
  KEY `hims_d_holiday_fk2_idx` (`updated_by`),
  KEY `hims_d_holiday_fk3_idx` (`hospital_id`),
  KEY `hims_d_holiday_fk4_idx` (`religion_id`),
  KEY `index6` (`holiday_date`) /*!80000 INVISIBLE */,
  KEY `index7` (`record_status`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_holiday_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_holiday_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_holiday_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_holiday_fk4` FOREIGN KEY (`religion_id`) REFERENCES `hims_d_religion` (`hims_d_religion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_hospital`
--

DROP TABLE IF EXISTS `hims_d_hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_hospital` (
  `hims_d_hospital_id` int NOT NULL AUTO_INCREMENT,
  `hospital_code` varchar(50) NOT NULL,
  `product_type` enum('HIMS_ERP','HRMS','FINANCE_ERP','HRMS_ERP=HR','HIMS_CLINICAL','ONLY_LAB','ONLY_PHARMACY') DEFAULT 'HIMS_ERP' COMMENT 'HIMS_ERP=Complete Product(with FINANCE,HRMS,PHARMACY,INVENTRORY),\nHRMS=ONLY HR and PAYROLL, \nHRMS_ERP=HR , PAYROLL and FINANCE\n\nFINANCE_ERP=(Finance,HR&PROL,Inventory,Pharmacy),\nHIMS_CLINICAL=(NO Finanace & HR&PROL), \nONLY_LAB=ONLY_LAB,\nONLY_PHARMACY=ONLY_PHARMACY\n',
  `local_vat_applicable` enum('Y','N') DEFAULT NULL COMMENT 'Y=yes\nN=no',
  `default_nationality` int DEFAULT NULL,
  `default_country` int DEFAULT NULL,
  `default_currency` int DEFAULT NULL,
  `default_slot` enum('5','10','15','20','25','30','35','40','45','50','55','60') DEFAULT '5',
  `default_patient_type` int DEFAULT NULL,
  `standard_from_time` time DEFAULT NULL,
  `standard_to_time` time DEFAULT NULL,
  `hospital_name` varchar(250) NOT NULL,
  `arabic_hospital_name` varchar(250) DEFAULT NULL,
  `hospital_address` varchar(500) DEFAULT NULL,
  `sender_id` varchar(15) DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `organization_id` int NOT NULL,
  `effective_start_date` date DEFAULT '1900-01-01',
  `effective_end_date` date DEFAULT '9999-12-31',
  `hosital_status` enum('A','I') DEFAULT 'A',
  `lab_location_code` varchar(50) DEFAULT NULL COMMENT 'Lab Location Code',
  `algaeh_api_auth_id` int DEFAULT NULL,
  `requied_emp_id` enum('N','Y') DEFAULT 'N',
  `unique_id_for_appointmt` enum('PID','MOB') NOT NULL DEFAULT 'MOB' COMMENT 'PID=PATIENT ID,MOB=MOBILE NUMBER',
  `mrn_num_sep_cop_client` enum('N','Y') DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_hospital_id`),
  UNIQUE KEY `index2` (`hospital_code`,`hospital_name`,`city_id`,`effective_start_date`,`effective_end_date`,`hosital_status`,`record_status`),
  KEY `index3` (`hosital_status`),
  KEY `index4` (`effective_start_date`),
  KEY `index5` (`effective_end_date`),
  KEY `index6` (`record_status`),
  KEY `hims_d_hospital_fk1_idx` (`city_id`),
  KEY `hims_d_hospital_fk2_idx` (`organization_id`),
  KEY `hims_d_hospital_fk3_idx` (`default_nationality`),
  KEY `hims_d_hospital_fk4_idx` (`default_country`),
  KEY `hims_d_hospital_fk5_idx` (`default_currency`),
  KEY `hims_d_hospital_fk6_idx` (`algaeh_api_auth_id`),
  KEY `hims_d_hospital_fk7_idx` (`default_patient_type`),
  KEY `hims_d_hospital_fk8_idx` (`created_by`),
  KEY `hims_d_hospital_fk9_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_hospital_fk2` FOREIGN KEY (`organization_id`) REFERENCES `hims_d_organization` (`hims_d_organization_id`),
  CONSTRAINT `hims_d_hospital_fk3` FOREIGN KEY (`default_nationality`) REFERENCES `hims_d_nationality` (`hims_d_nationality_id`),
  CONSTRAINT `hims_d_hospital_fk4` FOREIGN KEY (`default_country`) REFERENCES `hims_d_country` (`hims_d_country_id`),
  CONSTRAINT `hims_d_hospital_fk5` FOREIGN KEY (`default_currency`) REFERENCES `hims_d_currency` (`hims_d_currency_id`),
  CONSTRAINT `hims_d_hospital_fk6` FOREIGN KEY (`algaeh_api_auth_id`) REFERENCES `algaeh_d_api_auth` (`algaeh_d_api_auth_id`),
  CONSTRAINT `hims_d_hospital_fk7` FOREIGN KEY (`default_patient_type`) REFERENCES `hims_d_patient_type` (`hims_d_patient_type_id`),
  CONSTRAINT `hims_d_hospital_fk8` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_hospital_fk9` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_hpi_details`
--

DROP TABLE IF EXISTS `hims_d_hpi_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_hpi_details` (
  `hims_d_hpi_details_id` int NOT NULL AUTO_INCREMENT,
  `hpi_header_id` int NOT NULL,
  `element_description` varchar(250) DEFAULT NULL,
  `element_type` enum('L','Q','M','C','A','T') DEFAULT 'L' COMMENT 'L = LOCATION,\nQ = QUALITY,\nM= MODIFYING FACTORS,\nC= CONTEXT,\nA = ASSOCIATED SYMPTONS,\nT= TIMINIGS',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A= ACTIVE\nI =INACTIVE',
  PRIMARY KEY (`hims_d_hpi_details_id`),
  KEY `hims_d_hpi_details_fk1_idx` (`hpi_header_id`),
  KEY `hims_d_hpi_details_fk2_idx` (`created_by`),
  KEY `hims_d_hpi_details_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_hpi_details_fk1` FOREIGN KEY (`hpi_header_id`) REFERENCES `hims_d_hpi_header` (`hims_d_hpi_header_id`),
  CONSTRAINT `hims_d_hpi_details_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_hpi_details_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_hpi_header`
--

DROP TABLE IF EXISTS `hims_d_hpi_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_hpi_header` (
  `hims_d_hpi_header_id` int NOT NULL AUTO_INCREMENT,
  `hpi_description` varchar(150) NOT NULL,
  `sub_department_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_hpi_header_id`),
  KEY `hims_d_hpi_header_fk1_idx` (`sub_department_id`),
  KEY `hims_d_hpi_header_fk1_idx1` (`created_by`),
  KEY `hims_d_hpi_header_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_hpi_header_fk1` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_d_hpi_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_hpi_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_hrms_options`
--

DROP TABLE IF EXISTS `hims_d_hrms_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_hrms_options` (
  `hims_d_hrms_options_id` int NOT NULL AUTO_INCREMENT,
  `attendance_starts` enum('FE','PM') DEFAULT 'FE' COMMENT 'FE=FIRST OF EVERY MONTH,\nPM=PREVOIUS MONTH',
  `at_st_date` tinyint unsigned DEFAULT NULL,
  `at_end_date` tinyint unsigned DEFAULT NULL,
  `salary_process_date` smallint unsigned DEFAULT NULL,
  `salary_pay_before_end_date` enum('N','Y') DEFAULT 'N',
  `payroll_payment_date` smallint DEFAULT NULL,
  `salary_calendar` enum('P','F') DEFAULT 'P' COMMENT 'P = PERIODICAL\nF = FIXED',
  `salary_calendar_fixed_days` tinyint DEFAULT NULL,
  `attendance_type` enum('M','D','DM','DMP') DEFAULT 'M' COMMENT 'M = MONTHLY\\nD = DAILY\\nDM=DAILY MANUAL\\n DMP= DAILY MANUAL WITH PROJECT ROSTER',
  `fetch_punch_data_reporting` enum('N','Y') DEFAULT 'N',
  `leave_level` enum('1','2','3','4','5') DEFAULT '1',
  `loan_level` enum('1','2','3') DEFAULT '1',
  `leave_encash_level` enum('1','2') DEFAULT '1',
  `review_auth_level` enum('1','2','3') DEFAULT '1',
  `yearly_working_days` smallint DEFAULT NULL,
  `advance_deduction` enum('CM','NM') DEFAULT 'CM' COMMENT 'CM = CURRENT MONTH\\\\nNM = NEXT MONTH',
  `overtime_type` enum('M','D') DEFAULT 'M' COMMENT 'M = Monthly\nD = Daily',
  `overtime_payment` enum('N','C','E','B') DEFAULT 'N' COMMENT 'N = NONE\nC = COMP OFF\nE = ENCASH\nB = BOTH',
  `overtime_calculation` enum('N','D','H') DEFAULT 'N' COMMENT 'N = NONE\nD = DAILY\nH = HOURLY',
  `overtime_hourly_calculation` enum('T','O') DEFAULT 'T' COMMENT 'T= TOTAL HOURS (INTIME- OUTTIME)\\nO=OUT TIME HOURS',
  `standard_intime` time DEFAULT NULL,
  `standard_outime` time DEFAULT NULL,
  `standard_working_hours` decimal(4,2) DEFAULT NULL,
  `standard_break_hours` decimal(4,2) DEFAULT NULL,
  `biometric_database` enum('MSACCESS','ORACLE','MYSQL','SQL') DEFAULT NULL,
  `biometric_server_name` varchar(45) DEFAULT NULL,
  `biometric_port_no` int DEFAULT NULL,
  `biometric_database_name` varchar(45) DEFAULT NULL,
  `biometric_database_login` varchar(45) DEFAULT NULL,
  `biometric_database_password` varchar(45) DEFAULT NULL,
  `biometric_swipe_id` enum('N','S') DEFAULT 'N' COMMENT 'N = NUMERIC\nS = STRING',
  `formula_component_calc_type` enum('EMP','SAL') DEFAULT NULL COMMENT 'EMP = EMPLOYEE \\\\nSAL = SALARY',
  `annual_leave_process_separately` enum('N','Y') DEFAULT 'N',
  `airfare_factor` enum('PB','FI') DEFAULT 'PB' COMMENT 'PB =PERCENTAGE BASIC\nFI = FIXED',
  `basic_earning_component` int DEFAULT NULL,
  `airfare_percentage` decimal(4,2) DEFAULT NULL,
  `manual_timesheet_entry` enum('D','P') DEFAULT 'D',
  `authorization_plan` enum('R','A') DEFAULT 'R' COMMENT 'R- Role Wise, A- Authorisation Setup',
  `annual_leave_calculation` enum('A','M') DEFAULT 'A' COMMENT 'A- Annual, M-Monthly',
  `ot_calculation` enum('P','F','A') DEFAULT 'P' COMMENT 'P- Periodical, F- Fixed, A- Annual',
  `external_finance` enum('N','Y') DEFAULT 'N',
  `ramzan_timing_req` enum('Y','N') DEFAULT 'N',
  `ramzan_start_date` date DEFAULT NULL,
  `ramzan_end_date` date DEFAULT NULL,
  `ramzan_working_hr_per_day` decimal(4,2) DEFAULT '0.00',
  `ramzan_eligible_category` enum('ALL','MUSLIMS') DEFAULT 'MUSLIMS',
  `leave_salary_payment_days` enum('P','F') DEFAULT 'P' COMMENT 'P = PERIODICAL\\nF = FIXED',
  `is_pjc` enum('N','Y') DEFAULT 'N',
  `airfair_booking` enum('C','T') DEFAULT 'C' COMMENT 'C- Cash, T- Ticket',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_hrms_options_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_icd`
--

DROP TABLE IF EXISTS `hims_d_icd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_icd` (
  `hims_d_icd_id` int NOT NULL AUTO_INCREMENT,
  `icd_code` varchar(20) DEFAULT NULL,
  `icd_description` varchar(250) DEFAULT NULL,
  `long_icd_description` varchar(350) DEFAULT NULL,
  `icd_level` enum('L1','L2','L3') DEFAULT 'L1' COMMENT 'L1=level 1\nL2=level 2\nL3=level 3',
  `icd_type` enum('E','P') DEFAULT 'E' COMMENT 'E=examination\nP=procedure',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_icd_id`),
  UNIQUE KEY `icd_code_UNIQUE` (`icd_code`),
  KEY `hims_d_icd_fk2_idx` (`updated_by`),
  KEY `hims_d_icd_fk1_idx` (`created_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_icd_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_icd_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69827 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_identity_document`
--

DROP TABLE IF EXISTS `hims_d_identity_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_identity_document` (
  `hims_d_identity_document_id` int NOT NULL AUTO_INCREMENT,
  `identity_document_code` varchar(45) NOT NULL,
  `identity_document_name` varchar(250) DEFAULT NULL,
  `arabic_identity_document_name` varchar(250) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  `identity_status` enum('A','I') DEFAULT 'A',
  `nationality_id` int DEFAULT NULL,
  `masked_identity` varchar(20) DEFAULT NULL,
  `notify_expiry` enum('Y','N') DEFAULT NULL,
  `notify_before` int DEFAULT NULL,
  `employees_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_identity_document_id`),
  UNIQUE KEY `index2` (`identity_document_code`),
  KEY `index3` (`identity_document_name`),
  KEY `hims_d_identity_document_fk1_idx` (`created_by`),
  KEY `hims_d_identity_document_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  KEY `nationality_id` (`nationality_id`),
  KEY `hims_d_identity_document_fk_3_idx` (`employees_id`),
  CONSTRAINT `hims_d_identity_document_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_identity_document_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_identity_document_ibfk_1` FOREIGN KEY (`nationality_id`) REFERENCES `hims_d_nationality` (`hims_d_nationality_id`),
  CONSTRAINT `hims_d_identity_document_ibfk_2` FOREIGN KEY (`nationality_id`) REFERENCES `hims_d_nationality` (`hims_d_nationality_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_insurance_card_class`
--

DROP TABLE IF EXISTS `hims_d_insurance_card_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_insurance_card_class` (
  `hims_d_insurance_card_class_id` int NOT NULL AUTO_INCREMENT,
  `card_class_name` varchar(50) DEFAULT NULL,
  `arabic_card_class_name` varchar(50) DEFAULT NULL,
  `card_status` enum('A','I') DEFAULT 'A',
  `created_date` date DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_date` date DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_insurance_card_class_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_insurance_network`
--

DROP TABLE IF EXISTS `hims_d_insurance_network`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_insurance_network` (
  `hims_d_insurance_network_id` int NOT NULL AUTO_INCREMENT,
  `network_type` varchar(75) NOT NULL,
  `arabic_network_type` varchar(75) DEFAULT NULL,
  `insurance_provider_id` int NOT NULL,
  `insurance_sub_id` int NOT NULL,
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `sub_insurance_status` enum('A','I') NOT NULL DEFAULT 'A',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_insurance_network_id`),
  KEY `hims_d_insurance_network_fk1` (`insurance_provider_id`),
  KEY `hims_d_insurance_network_fk2` (`insurance_sub_id`),
  KEY `hims_d_insurance_network_fk3` (`created_by`),
  KEY `hims_d_insurance_network_fk4` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_insurance_network_fk1` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_d_insurance_network_fk2` FOREIGN KEY (`insurance_sub_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_d_insurance_network_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_insurance_network_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_insurance_network_office`
--

DROP TABLE IF EXISTS `hims_d_insurance_network_office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_insurance_network_office` (
  `hims_d_insurance_network_office_id` int NOT NULL AUTO_INCREMENT,
  `network_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `deductible` varchar(45) DEFAULT NULL,
  `deductable_type` varchar(45) DEFAULT NULL,
  `min_value` decimal(10,2) DEFAULT NULL,
  `max_value` decimal(10,2) DEFAULT NULL,
  `copay_consultation` tinyint DEFAULT NULL,
  `deductible_lab` tinyint DEFAULT NULL,
  `for_alllab` decimal(10,2) DEFAULT NULL,
  `copay_percent` tinyint DEFAULT NULL,
  `deductible_rad` tinyint DEFAULT NULL,
  `for_allrad` decimal(10,2) DEFAULT NULL,
  `copay_percent_rad` tinyint DEFAULT NULL,
  `copay_percent_trt` tinyint DEFAULT NULL,
  `copay_percent_dental` tinyint DEFAULT NULL,
  `copay_medicine` tinyint DEFAULT NULL,
  `insur_network_limit` decimal(10,2) DEFAULT NULL,
  `deductible_trt` tinyint DEFAULT NULL,
  `deductible_dental` tinyint DEFAULT NULL,
  `deductible_medicine` tinyint DEFAULT NULL,
  `lab_min` decimal(10,2) DEFAULT NULL,
  `lab_max` decimal(10,2) DEFAULT NULL,
  `rad_min` decimal(10,2) DEFAULT NULL,
  `rad_max` decimal(10,2) DEFAULT NULL,
  `trt_max` decimal(10,2) DEFAULT NULL,
  `trt_min` decimal(10,2) DEFAULT NULL,
  `dental_min` decimal(10,2) DEFAULT NULL,
  `dental_max` decimal(10,2) DEFAULT NULL,
  `medicine_min` decimal(10,2) DEFAULT NULL,
  `medicine_max` decimal(10,2) DEFAULT NULL,
  `invoice_max_liability` decimal(10,2) DEFAULT NULL,
  `for_alltrt` decimal(10,2) DEFAULT NULL,
  `for_alldental` decimal(10,2) DEFAULT NULL,
  `for_allmedicine` decimal(10,2) DEFAULT NULL,
  `invoice_max_deduct` decimal(10,2) NOT NULL,
  `price_from` enum('S','P') NOT NULL DEFAULT 'S' COMMENT 'S = COMPANY LEVEL SERVICE PRICE\nP = POLICY LEVEL SERVICE PRICE ',
  `employer` varchar(1000) DEFAULT NULL,
  `policy_number` varchar(100) DEFAULT NULL,
  `follow_up` varchar(11) DEFAULT NULL,
  `preapp_limit` decimal(10,2) DEFAULT NULL,
  `deductible_ip` decimal(10,2) DEFAULT NULL,
  `copay_ip` decimal(10,2) DEFAULT NULL,
  `ip_min` decimal(10,2) DEFAULT NULL,
  `ip_max` decimal(10,2) DEFAULT NULL,
  `for_allip` decimal(10,2) DEFAULT NULL,
  `consult_limit` decimal(10,2) DEFAULT NULL,
  `preapp_limit_from` enum('NET','GROSS') NOT NULL DEFAULT 'GROSS',
  `copay_maternity` decimal(10,2) DEFAULT NULL,
  `maternity_min` decimal(10,2) DEFAULT NULL,
  `maternity_max` decimal(10,2) DEFAULT NULL,
  `copay_optical` decimal(10,2) DEFAULT NULL,
  `optical_min` decimal(10,2) DEFAULT NULL,
  `optical_max` decimal(10,2) DEFAULT NULL,
  `copay_diagnostic` decimal(10,2) DEFAULT NULL,
  `diagnostic_min` decimal(10,2) DEFAULT NULL,
  `diagnostic_max` decimal(10,2) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_insurance_network_office_id`),
  KEY `hims_d_insurance_network_office_fk1` (`network_id`),
  KEY `hims_d_insurance_network_office_fk2` (`hospital_id`),
  KEY `hims_d_insurance_network_office_fk3` (`created_by`),
  KEY `hims_d_insurance_network_office_fk4` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_insurance_network_office_fk1` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_d_insurance_network_office_fk2` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_insurance_network_office_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_insurance_network_office_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_insurance_provider`
--

DROP TABLE IF EXISTS `hims_d_insurance_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_insurance_provider` (
  `hims_d_insurance_provider_id` int NOT NULL AUTO_INCREMENT,
  `insurance_provider_code` varchar(45) DEFAULT NULL,
  `insurance_provider_name` varchar(245) DEFAULT NULL,
  `arabic_provider_name` varchar(45) DEFAULT NULL,
  `deductible_proc` varchar(45) DEFAULT NULL,
  `deductible_lab` varchar(45) DEFAULT NULL,
  `co_payment` varchar(45) DEFAULT NULL,
  `insurance_type` enum('I','T','C') NOT NULL DEFAULT 'I' COMMENT 'I = INSURANCE COMPANY\nT = TPA\nC = CORPORATE CLIENT',
  `package_claim` enum('P','S') NOT NULL DEFAULT 'P' COMMENT 'P =PACKAGE CLAIM\nS =SERVICE CLAIM',
  `hospital_id` int DEFAULT NULL,
  `credit_period` varchar(15) DEFAULT NULL,
  `insurance_limit` varchar(45) DEFAULT NULL,
  `payment_type` varchar(45) DEFAULT NULL,
  `insurance_remarks` varchar(405) DEFAULT NULL,
  `cpt_mandate` enum('N','Y') NOT NULL DEFAULT 'N' COMMENT 'N = NO\nY = YES',
  `child_id` varchar(15) DEFAULT NULL,
  `currency` varchar(5) DEFAULT NULL,
  `preapp_valid_days` tinyint DEFAULT NULL,
  `claim_submit_days` tinyint DEFAULT NULL,
  `lab_result_check` enum('N','Y') NOT NULL DEFAULT 'N',
  `resubmit_all` enum('N','Y') NOT NULL DEFAULT 'N' COMMENT 'N= NO\nY= YES',
  `company_service_price_type` enum('G','N') DEFAULT 'G' COMMENT 'G = GROSS _AMOUNT \nN = NET AMOUNT',
  `ins_rej_per` varchar(45) DEFAULT NULL,
  `payer_id` varchar(45) DEFAULT NULL,
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `prefix` varchar(45) DEFAULT NULL COMMENT '''should be alpha-numeric''',
  `running_num` varchar(200) DEFAULT NULL COMMENT 'Number',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A =ACTIVE\nI = INACTIVE',
  PRIMARY KEY (`hims_d_insurance_provider_id`),
  KEY `hims_d_insurance_provider_fk1_idx` (`hospital_id`),
  KEY `hims_d_insurance_provider_fk2_idx` (`created_by`),
  KEY `hims_d_insurance_provider_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_insurance_sub`
--

DROP TABLE IF EXISTS `hims_d_insurance_sub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_insurance_sub` (
  `hims_d_insurance_sub_id` int NOT NULL AUTO_INCREMENT,
  `insurance_sub_code` varchar(45) DEFAULT NULL,
  `insurance_sub_name` varchar(255) DEFAULT NULL,
  `arabic_sub_name` varchar(45) DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `card_format` varchar(145) DEFAULT NULL,
  `transaction_number` varchar(45) DEFAULT NULL,
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_insurance_sub_id`),
  KEY `hims_d_insurance_sub_id_fk1` (`insurance_provider_id`),
  KEY `hims_d_insurance_provider_fk2` (`created_by`),
  KEY `hims_d_insurance_provider_fk3` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_insurance_provider_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_insurance_provider_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_insurance_sub_id_fk1` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inv_location_reorder`
--

DROP TABLE IF EXISTS `hims_d_inv_location_reorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inv_location_reorder` (
  `hims_d_inv_location_reorder_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `reorder_qty` mediumint DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_inv_location_reorder_id`),
  KEY `hims_d_inv_location_reorder_fk1_idx` (`item_id`),
  KEY `hims_d_inv_location_reorder_fk2_idx` (`created_by`),
  KEY `hims_d_inv_location_reorder_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_d_inv_location_reorder_fk1` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_d_inv_location_reorder_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_inv_location_reorder_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_item_group`
--

DROP TABLE IF EXISTS `hims_d_inventory_item_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_item_group` (
  `hims_d_inventory_item_group_id` int NOT NULL AUTO_INCREMENT,
  `group_description` varchar(90) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `group_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_inventory_item_group_id`),
  KEY `hims_d_inventory_item_group_fk1_idx` (`category_id`),
  KEY `hims_d_inventory_item_group_fk2_idx` (`created_by`),
  KEY `hims_d_inventory_item_group_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_inventory_item_group_fk1` FOREIGN KEY (`category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_d_inventory_item_group_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_inventory_item_group_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=340 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_item_master`
--

DROP TABLE IF EXISTS `hims_d_inventory_item_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_item_master` (
  `hims_d_inventory_item_master_id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `item_description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `item_type` enum('STK','NSK','AST','OITM') DEFAULT NULL COMMENT 'STK = STOCK ITEM,\\\\\\\\nNSK = NON STOCK ITEM,\\\\\\\\nAST = ASSET ITEM, \\n OITM = Optometric Items',
  `structure_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `item_uom_id` int DEFAULT NULL,
  `purchase_uom_id` int DEFAULT NULL,
  `sales_uom_id` int DEFAULT NULL,
  `stocking_uom_id` int DEFAULT NULL,
  `item_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `exp_date_required` enum('Y','N') DEFAULT 'N',
  `service_id` int DEFAULT NULL,
  `addl_information` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `decimals` enum('0','1','2','3','4','5','6') DEFAULT NULL,
  `purchase_cost` decimal(20,3) DEFAULT NULL,
  `markup_percent` decimal(10,3) DEFAULT NULL,
  `sales_price` decimal(20,3) DEFAULT NULL,
  `sfda_code` varchar(45) DEFAULT NULL,
  `reorder_qty` mediumint DEFAULT NULL,
  `waited_avg_cost` decimal(15,6) DEFAULT '0.000000',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_inventory_item_master_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=2418 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_item_pricelist`
--

DROP TABLE IF EXISTS `hims_d_inventory_item_pricelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_item_pricelist` (
  `hims_d_inventory_item_pricelist_id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `description` varchar(90) DEFAULT NULL,
  `decimals` enum('0','1','2','3','4','5','6') DEFAULT NULL,
  `pricelist_status` enum('A','I') DEFAULT NULL,
  `purchase_cost` decimal(10,6) DEFAULT NULL,
  `markup_percent` decimal(10,6) DEFAULT NULL,
  `sales_price` decimal(10,6) DEFAULT NULL,
  `purchase_uom_id` int DEFAULT NULL,
  `sales_uom_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT NULL,
  PRIMARY KEY (`hims_d_inventory_item_pricelist_id`),
  KEY `hims_d_inventory_item_pricelist_fk1_idx` (`created_by`),
  KEY `hims_d_inveinventoryntory_item_pricelist_fk2_idx` (`updated_by`),
  KEY `hims_d_inventory_item_pricelist_fk3_idx` (`item_id`),
  KEY `hims_d_inventory_item_pricelist_fk4_idx` (`purchase_uom_id`),
  KEY `hims_d__item_pricelist_fk5_idx` (`sales_uom_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_inventory_item_pricelist_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_inventory_item_pricelist_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_inventory_item_pricelist_fk3` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_d_inventory_item_pricelist_fk4` FOREIGN KEY (`purchase_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_d_inventory_item_pricelist_fk5` FOREIGN KEY (`sales_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_location`
--

DROP TABLE IF EXISTS `hims_d_inventory_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_location` (
  `hims_d_inventory_location_id` int NOT NULL AUTO_INCREMENT,
  `location_description` varchar(45) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `location_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'A',
  `location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'MS' COMMENT 'WH = Warehouse\\\\\\\\\\\\\\\\nMS = MAIN STORE\\\\\\\\\\\\\\\\nSS = SUB STORE',
  `hospital_id` int DEFAULT NULL,
  `allow_pos` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'N' COMMENT 'N = NO \\nY = YES',
  `git_location` enum('N','Y') DEFAULT 'N',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_inventory_location_id`),
  KEY `hims_d_inventory_location_fk1_idx` (`hospital_id`),
  KEY `hims_d_inventory_location_fk2_idx` (`created_by`),
  KEY `hims_d_inventory_location_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_inventory_location_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_inventory_location_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_inventory_location_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_options`
--

DROP TABLE IF EXISTS `hims_d_inventory_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_options` (
  `hims_d_inventory_options_id` int NOT NULL AUTO_INCREMENT,
  `requisition_auth_level` enum('1','2') DEFAULT '1' COMMENT '1-Level 1, 2 - Level 2',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_inventory_options_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_tem_category`
--

DROP TABLE IF EXISTS `hims_d_inventory_tem_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_tem_category` (
  `hims_d_inventory_tem_category_id` int NOT NULL AUTO_INCREMENT,
  `category_desc` varchar(90) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `category_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_inventory_tem_category_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_inventory_uom`
--

DROP TABLE IF EXISTS `hims_d_inventory_uom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_inventory_uom` (
  `hims_d_inventory_uom_id` int NOT NULL AUTO_INCREMENT,
  `uom_description` varchar(100) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `uom_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_inventory_uom_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_investigation_test`
--

DROP TABLE IF EXISTS `hims_d_investigation_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_investigation_test` (
  `hims_d_investigation_test_id` int NOT NULL AUTO_INCREMENT,
  `test_code` varchar(45) DEFAULT NULL,
  `short_description` varchar(25) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `investigation_type` enum('L','R') DEFAULT NULL COMMENT 'L =LAB\nR = RAD',
  `lab_section_id` int DEFAULT NULL,
  `send_out_test` enum('Y','N') DEFAULT 'N',
  `available_in_house` enum('Y','N') DEFAULT 'N',
  `restrict_order` enum('Y','N') DEFAULT 'N',
  `restrict_by` enum('0','1') DEFAULT NULL COMMENT '0=user_id\n1=department_id',
  `external_facility_required` enum('Y','N') DEFAULT 'N',
  `facility_description` varchar(100) DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `priority` enum('R','S') DEFAULT NULL COMMENT 'R=ROUTINE\nS=STAT',
  `cpt_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `film_category` enum('NA','FM','LF','PS') DEFAULT 'NA' COMMENT 'NA-Not Applicable,\nFM-Film,\nLF-Laser Film,\nPS-Packs',
  `screening_test` enum('N','Y') DEFAULT 'N' COMMENT 'N-No,\nY-Yes',
  `film_used` enum('N','Y') DEFAULT 'N' COMMENT 'N-No,\nY-Yes',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_investigation_test_id`),
  KEY `hims_d_investigation_test_fk1_idx` (`lab_section_id`),
  KEY `hims_d_investigation_test_fk2_idx` (`created_by`),
  KEY `hims_d_investigation_test_fk3_idx` (`updated_by`),
  KEY `hims_d_investigation_test_fk4_idx` (`category_id`),
  KEY `hims_d_investigation_test_fk6_idx` (`services_id`),
  KEY `hims_d_investigation_test_7_idx` (`cpt_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_investigation_test_7` FOREIGN KEY (`cpt_id`) REFERENCES `hims_d_cpt_code` (`hims_d_cpt_code_id`),
  CONSTRAINT `hims_d_investigation_test_fk1` FOREIGN KEY (`lab_section_id`) REFERENCES `hims_d_lab_section` (`hims_d_lab_section_id`),
  CONSTRAINT `hims_d_investigation_test_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_investigation_test_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_investigation_test_fk6` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_d_investigation_test_fk9` FOREIGN KEY (`category_id`) REFERENCES `hims_d_test_category` (`hims_d_test_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_investigation_test_comments`
--

DROP TABLE IF EXISTS `hims_d_investigation_test_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_investigation_test_comments` (
  `hims_d_investigation_test_comments_id` int NOT NULL AUTO_INCREMENT,
  `investigation_test_id` int DEFAULT NULL,
  `commnet_name` varchar(45) DEFAULT NULL,
  `commet` varchar(3000) DEFAULT NULL,
  `comment_status` enum('A','I') DEFAULT 'A' COMMENT 'A- Active, I- Inactive',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hims_d_investigation_test_comments_id`),
  KEY `hims_d_investigation_test_comments_fk1_idx` (`investigation_test_id`),
  CONSTRAINT `hims_d_investigation_test_comments_fk1` FOREIGN KEY (`investigation_test_id`) REFERENCES `hims_d_investigation_test` (`hims_d_investigation_test_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_item_category`
--

DROP TABLE IF EXISTS `hims_d_item_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_item_category` (
  `hims_d_item_category_id` int NOT NULL AUTO_INCREMENT,
  `category_desc` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `category_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_item_category_id`),
  KEY `hims_d_item_category_fk1_idx` (`created_by`),
  KEY `hims_d_item_category_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_item_form`
--

DROP TABLE IF EXISTS `hims_d_item_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_item_form` (
  `hims_d_item_form_id` int NOT NULL AUTO_INCREMENT,
  `form_description` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `item_form_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_item_form_id`),
  KEY `hims_d_item_form_fk1_idx` (`created_by`),
  KEY `hims_d_item_form_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_item_form_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_item_form_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_item_generic`
--

DROP TABLE IF EXISTS `hims_d_item_generic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_item_generic` (
  `hims_d_item_generic_id` int NOT NULL AUTO_INCREMENT,
  `generic_name` varchar(300) DEFAULT NULL,
  `item_generic_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_item_generic_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_item_group`
--

DROP TABLE IF EXISTS `hims_d_item_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_item_group` (
  `hims_d_item_group_id` int NOT NULL AUTO_INCREMENT,
  `group_description` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `group_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_item_group_id`),
  KEY `hims_d_item_group_fk1_idx` (`created_by`),
  KEY `hims_d_item_group_fk2_idx` (`updated_by`),
  KEY `fgh_idx` (`category_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_item_group_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_item_group_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_item_master`
--

DROP TABLE IF EXISTS `hims_d_item_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_item_master` (
  `hims_d_item_master_id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `item_description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `structure_id` int DEFAULT NULL,
  `generic_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `form_id` int DEFAULT NULL,
  `storage_id` int DEFAULT NULL,
  `item_uom_id` int DEFAULT NULL,
  `purchase_uom_id` int DEFAULT NULL,
  `sales_uom_id` int DEFAULT NULL,
  `stocking_uom_id` int DEFAULT NULL,
  `item_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `exp_date_required` enum('Y','N') DEFAULT 'N',
  `service_id` int DEFAULT NULL,
  `addl_information` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `decimals` enum('0','1','2','3','4','5','6') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `purchase_cost` decimal(20,3) DEFAULT NULL,
  `markup_percent` decimal(10,3) DEFAULT NULL,
  `sales_price` decimal(20,3) DEFAULT NULL,
  `reorder_qty` mediumint DEFAULT NULL,
  `sfda_code` varchar(45) DEFAULT NULL,
  `waited_avg_cost` decimal(15,6) DEFAULT '0.000000',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_item_master_id`),
  KEY `hims_d_item_master_fk1_idx` (`category_id`),
  KEY `hims_d_item_master_fk2_idx` (`generic_id`),
  KEY `hims_d_item_master_fk3_idx` (`group_id`),
  KEY `hims_d_item_master_fk5_idx` (`created_by`),
  KEY `hims_d_item_master_fk6_idx` (`updated_by`),
  KEY `hims_d_item_master_fk6_idx1` (`item_uom_id`),
  KEY `hims_d_item_master_fk7_idx` (`purchase_uom_id`),
  KEY `hims_d_item_master_fk8_idx` (`sales_uom_id`),
  KEY `hims_d_item_master_fk9_idx` (`stocking_uom_id`),
  KEY `hims_d_item_master_fk10_idx` (`form_id`),
  KEY `hims_d_item_master_fk11_idx` (`storage_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_item_master_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_item_master_fk10` FOREIGN KEY (`form_id`) REFERENCES `hims_d_item_form` (`hims_d_item_form_id`),
  CONSTRAINT `hims_d_item_master_fk11` FOREIGN KEY (`storage_id`) REFERENCES `hims_d_item_storage` (`hims_d_item_storage_id`),
  CONSTRAINT `hims_d_item_master_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_item_master_fk3` FOREIGN KEY (`generic_id`) REFERENCES `hims_d_item_generic` (`hims_d_item_generic_id`),
  CONSTRAINT `hims_d_item_master_fk4` FOREIGN KEY (`group_id`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_d_item_master_fk5` FOREIGN KEY (`category_id`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_d_item_master_fk6` FOREIGN KEY (`item_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_d_item_master_fk7` FOREIGN KEY (`purchase_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_d_item_master_fk8` FOREIGN KEY (`sales_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_d_item_master_fk9` FOREIGN KEY (`stocking_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=520 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_item_storage`
--

DROP TABLE IF EXISTS `hims_d_item_storage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_item_storage` (
  `hims_d_item_storage_id` int NOT NULL AUTO_INCREMENT,
  `storage_description` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `storage_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_item_storage_id`),
  KEY `hims_d_item_storage_fk1_idx` (`created_by`),
  KEY `hims_d_item_storage_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_lab_analytes`
--

DROP TABLE IF EXISTS `hims_d_lab_analytes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_lab_analytes` (
  `hims_d_lab_analytes_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(150) NOT NULL,
  `analyte_type` enum('QU','QN','T') DEFAULT NULL COMMENT 'QU=QUALITY\\nQN=QUANTITY\\nT=TEXT',
  `result_unit` varchar(20) DEFAULT NULL,
  `analyte_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_lab_analytes_id`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  KEY `hims_d_lab_analytes_fk1_idx` (`created_by`),
  KEY `hims_d_lab_analytes_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_lab_analytes_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_lab_analytes_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=896 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_lab_analytes_range`
--

DROP TABLE IF EXISTS `hims_d_lab_analytes_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_lab_analytes_range` (
  `hims_d_lab_analytes_range_id` int NOT NULL AUTO_INCREMENT,
  `analyte_id` int DEFAULT NULL,
  `gender` enum('MALE','FEMALE','BOTH') DEFAULT NULL COMMENT 'MALE=MALE,FEMALE=FEMALE,OTHER=OTHER,CHILD',
  `age_type` enum('D','M','Y') DEFAULT 'Y' COMMENT 'D=Days\\\\\\\\\\\\\\\\nM=Months\\\\\\\\\\\\\\\\nY=Year',
  `from_age` smallint unsigned DEFAULT '0',
  `to_age` smallint unsigned DEFAULT '0',
  `critical_low` decimal(10,3) DEFAULT NULL,
  `critical_high` decimal(10,3) DEFAULT NULL,
  `normal_low` decimal(10,3) DEFAULT NULL,
  `normal_high` decimal(10,3) DEFAULT NULL,
  `normal_qualitative_value` varchar(25) DEFAULT NULL,
  `text_value` varchar(90) DEFAULT NULL,
  `from_oprator` varchar(5) DEFAULT NULL,
  `to_operator` varchar(5) DEFAULT NULL,
  `low_operator` varchar(5) DEFAULT NULL,
  `high_operator` varchar(5) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_lab_analytes_range_id`),
  KEY `hims_d_lab_analytes_range_fk1_idx` (`analyte_id`),
  CONSTRAINT `hims_d_lab_analytes_range_fk1` FOREIGN KEY (`analyte_id`) REFERENCES `hims_d_lab_analytes` (`hims_d_lab_analytes_id`)
) ENGINE=InnoDB AUTO_INCREMENT=601 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_lab_container`
--

DROP TABLE IF EXISTS `hims_d_lab_container`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_lab_container` (
  `hims_d_lab_container_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(50) NOT NULL,
  `container_status` enum('A','I') NOT NULL DEFAULT 'A',
  `container_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_d_lab_container_id`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  KEY `hims_d_lab_container_fk1_idx` (`created_by`),
  KEY `hims_d_lab_container_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_lab_container_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_lab_container_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_lab_section`
--

DROP TABLE IF EXISTS `hims_d_lab_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_lab_section` (
  `hims_d_lab_section_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `section_status` enum('A','I') NOT NULL DEFAULT 'A' COMMENT 'A-Active\nI-Inactive',
  `test_section` enum('M','C','HI','HE','O') DEFAULT 'O' COMMENT 'M- Microbiology,\\\\nC- Cytology,\\\\nHI- Histopathology,\\\\nHE- Hematology,\\\\nO- Others\\\\n',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_lab_section_id`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  KEY `hims_d_lab_section_fk1_idx` (`created_by`),
  KEY `hims_d_lab_section_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_lab_section_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_lab_section_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_lab_specimen`
--

DROP TABLE IF EXISTS `hims_d_lab_specimen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_lab_specimen` (
  `hims_d_lab_specimen_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `storage_type` enum('N','F','R') DEFAULT 'N' COMMENT 'N=normal\nF=frozen\nR=refrigerate',
  `specimen_status` enum('A','I') DEFAULT 'A',
  `urine_specimen` enum('N','Y') DEFAULT 'N',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_lab_specimen_id`),
  UNIQUE KEY `description_UNIQUE` (`description`),
  KEY `hims_d_lab_specimen_fk1_idx` (`created_by`),
  KEY `hims_d_lab_specimen_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_lab_specimen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_lab_specimen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_leave`
--

DROP TABLE IF EXISTS `hims_d_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_leave` (
  `hims_d_leave_id` int NOT NULL AUTO_INCREMENT,
  `leave_code` varchar(22) DEFAULT NULL,
  `leave_description` varchar(90) DEFAULT NULL,
  `leave_category` enum('O','A','M') DEFAULT 'O' COMMENT 'O =OTHER\\\\\\\\nA = ANNUAL\\\\\\\\nM = MATERNITY\\\\n',
  `include_weekoff` enum('N','Y') DEFAULT NULL,
  `include_holiday` enum('N','Y') DEFAULT NULL,
  `leave_mode` enum('REG','LOP','COM') DEFAULT 'REG' COMMENT 'REG = REGULAR\nLOP = LOSS OF PAY\nCOM = COMP OFF',
  `avail_if_no_balance` enum('N','Y') DEFAULT 'N',
  `leave_status` enum('A','I') DEFAULT 'A',
  `leave_accrual` enum('Y','M') DEFAULT 'Y' COMMENT 'Y =YEARLY\nM= MONTHLY',
  `leave_encash` enum('N','Y') DEFAULT 'N',
  `leave_type` enum('P','U') DEFAULT 'P' COMMENT 'P= PAID\\nU = UNPAID',
  `encashment_percentage` decimal(5,2) DEFAULT '0.00',
  `leave_carry_forward` enum('N','Y') DEFAULT 'N',
  `carry_forward_percentage` decimal(5,2) DEFAULT '0.00',
  `religion_required` enum('N','Y') DEFAULT 'N',
  `religion_id` int DEFAULT NULL,
  `holiday_reimbursement` enum('N','Y') DEFAULT 'N',
  `exit_permit_required` enum('N','Y') DEFAULT 'N',
  `proportionate_leave` enum('N','Y') DEFAULT 'N',
  `document_mandatory` enum('N','Y') DEFAULT 'N',
  `calculation_type` enum('NO','CO','SL') DEFAULT 'NO' COMMENT 'NO= NONE\\\\\\\\\\\\\\\\nCO = COMPONENT\\\\\\\\\\\\\\\\nSL = SLAB',
  `reset_leave` enum('1','2','3') NOT NULL DEFAULT '1' COMMENT 'reset leave after specified number of years',
  `created_by` int DEFAULT NULL,
  `encash_calc_method` enum('A','F') DEFAULT 'F',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_leave_id`),
  KEY `hims_d_leave_fk1_idx` (`created_by`),
  KEY `hims_d_leave_fk2_idx` (`updated_by`),
  KEY `hims_d_leave_fk3_idx` (`religion_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_leave_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_leave_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_leave_fk3` FOREIGN KEY (`religion_id`) REFERENCES `hims_d_religion` (`hims_d_religion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_leave_detail`
--

DROP TABLE IF EXISTS `hims_d_leave_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_leave_detail` (
  `hims_d_leave_detail_id` int NOT NULL AUTO_INCREMENT,
  `leave_header_id` int DEFAULT NULL,
  `employee_type` enum('PE','CO','PB','LC','VC') DEFAULT NULL COMMENT 'PE=PERMANENT,CO=CONTRACT,PB=PROBATION,LC=LOCUM,\\nVC=VISITING CONSULTANT',
  `gender` enum('MALE','FEMALE','BOTH') DEFAULT NULL,
  `eligible_days` decimal(5,2) DEFAULT NULL,
  `min_service_required` enum('N','Y') DEFAULT 'N',
  `service_years` decimal(5,2) DEFAULT NULL,
  `once_life_term` enum('N','Y') DEFAULT 'N',
  `allow_probation` enum('N','Y') DEFAULT 'N',
  `max_number_days` decimal(5,2) DEFAULT NULL,
  `mandatory_utilize_days` decimal(5,2) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_leave_detail_id`),
  UNIQUE KEY `leave_emptype_gender_unique` (`leave_header_id`,`employee_type`,`gender`),
  KEY `hims_d_leave_detail_idx` (`leave_header_id`),
  KEY `hims_d_leave_detail_fk2_idx` (`created_by`),
  KEY `hims_d_leave_detail_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_d_leave_detail_fk1` FOREIGN KEY (`leave_header_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_d_leave_detail_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_leave_detail_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_leave_encashment`
--

DROP TABLE IF EXISTS `hims_d_leave_encashment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_leave_encashment` (
  `hims_d_leave_encashment_id` int NOT NULL AUTO_INCREMENT,
  `leave_header_id` int DEFAULT NULL,
  `earnings_id` int DEFAULT NULL,
  `percent` decimal(5,2) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_leave_encashment_id`),
  KEY `hims_d_leave_encashment_fk1_idx` (`leave_header_id`),
  KEY `hims_d_leave_encashment_fk2_idx` (`earnings_id`),
  KEY `hims_d_leave_encashment_fk3_idx` (`created_by`),
  KEY `hims_d_leave_encashment_fk4_idx` (`updated_by`),
  CONSTRAINT `hims_d_leave_encashment_fk1` FOREIGN KEY (`leave_header_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_d_leave_encashment_fk2` FOREIGN KEY (`earnings_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_d_leave_encashment_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_leave_encashment_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_leave_rule`
--

DROP TABLE IF EXISTS `hims_d_leave_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_leave_rule` (
  `hims_d_leave_rule_id` int NOT NULL AUTO_INCREMENT,
  `leave_header_id` int DEFAULT NULL,
  `calculation_type` enum('CO','SL') DEFAULT 'CO' COMMENT 'CO = COMPONENT\\nSL = SLAB',
  `earning_id` int DEFAULT NULL,
  `paytype` enum('NO','FD','HD','UN','QD','TQ') DEFAULT NULL COMMENT 'NO = NONE\\nFD = FULL DAY(1)\\nHD = HALF DAY(1/2)\\nUN= UNPAID\\nQD = QUARTER DAY(1/4)\\nTQ = THREE QUARTER DAY (3/4)',
  `from_value` smallint DEFAULT NULL,
  `to_value` smallint DEFAULT NULL,
  `value_type` enum('OV','RA') DEFAULT NULL COMMENT 'OV = OVER (OVER THIS VALUE)\nRA = RANGE(BETWEEN THE FROM AND TO)',
  `total_days` smallint DEFAULT NULL,
  PRIMARY KEY (`hims_d_leave_rule_id`),
  KEY `hims_d_leave_rule_fk1_idx` (`leave_header_id`),
  KEY `hims_d_leave_rule_fk2_idx` (`earning_id`),
  CONSTRAINT `hims_d_leave_rule_fk1` FOREIGN KEY (`leave_header_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_d_leave_rule_fk2` FOREIGN KEY (`earning_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_lis_configuration`
--

DROP TABLE IF EXISTS `hims_d_lis_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_lis_configuration` (
  `hims_d_lis_configuration_id` int NOT NULL AUTO_INCREMENT,
  `machine_name` varchar(60) DEFAULT NULL,
  `communication_type` enum('0','1','2') DEFAULT '0' COMMENT '0 - Unidirectional\\n1 - Bidirectional\\n2 - Not Supported',
  `hl7_supported` enum('0','1') DEFAULT '0' COMMENT '0-No\\n1-Yes',
  `check_sum` enum('0','1') DEFAULT '0' COMMENT '0-No\\n1-Yes',
  `connection_type` enum('0','1') DEFAULT NULL COMMENT '0-Serial Port Mode\n1-TCP Mode',
  `stat_flag` varchar(60) DEFAULT NULL,
  `rotine_flag` varchar(60) DEFAULT NULL,
  `result_extension` varchar(60) DEFAULT NULL,
  `order_mode` enum('0','1','2') DEFAULT '0' COMMENT '0-Query Mode\\n1-Download Mode\\n2-File Mode',
  `file_upload` varchar(60) DEFAULT NULL,
  `com_port_name` varchar(60) DEFAULT NULL,
  `brud_rate` varchar(60) DEFAULT NULL,
  `ser_result_part_loc` varchar(60) DEFAULT NULL,
  `host_ip_address` varchar(60) DEFAULT NULL,
  `port_no` varchar(60) DEFAULT NULL,
  `tcp_result_part_loc` varchar(60) DEFAULT NULL,
  `driver_name` varchar(60) DEFAULT NULL,
  `description` varchar(60) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  PRIMARY KEY (`hims_d_lis_configuration_id`),
  KEY `hims_d_lis_configuration_fk1_idx` (`hospital_id`),
  KEY `hims_d_lis_configuration_fk2_idx` (`created_by`),
  KEY `hims_d_lis_configuration_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_d_lis_configuration_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_lis_configuration_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_lis_configuration_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_loan`
--

DROP TABLE IF EXISTS `hims_d_loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_loan` (
  `hims_d_loan_id` int NOT NULL AUTO_INCREMENT,
  `loan_code` varchar(45) DEFAULT NULL,
  `loan_description` varchar(100) DEFAULT NULL,
  `loan_account` varchar(45) DEFAULT NULL,
  `loan_limit_type` enum('L','B','G') DEFAULT 'L' COMMENT 'L = LOAN LIMIT\\nB = BASIC\\nG =GRATUITY',
  `loan_maximum_amount` decimal(10,2) DEFAULT NULL,
  `loan_status` enum('A','I') DEFAULT 'A',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_loan_id`),
  KEY `hims_d_loan_fk1_idx` (`created_by`),
  KEY `hims_d_loan_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_loan_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_loan_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_location`
--

DROP TABLE IF EXISTS `hims_d_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_location` (
  `hims_d_location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(50) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_d_location_id`),
  UNIQUE KEY `location_name_UNIQUE` (`location_name`),
  KEY `hims_d_location_fk1_idx` (`created_by`),
  KEY `hims_d_location_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_location_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_location_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_micro_group`
--

DROP TABLE IF EXISTS `hims_d_micro_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_micro_group` (
  `hims_d_micro_group_id` int NOT NULL AUTO_INCREMENT,
  `group_code` varchar(15) DEFAULT NULL,
  `group_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_group_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `group_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `group_type` enum('F','NF') DEFAULT 'F' COMMENT 'F- Fascideous, \nNF- Non-Fascideous',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_micro_group_id`),
  KEY `hims_d_micro_group_fk1_idx` (`created_by`),
  KEY `hims_d_micro_group_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_d_micro_group_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_micro_group_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_nationality`
--

DROP TABLE IF EXISTS `hims_d_nationality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_nationality` (
  `hims_d_nationality_id` int NOT NULL AUTO_INCREMENT,
  `nationality_code` varchar(45) NOT NULL,
  `nationality` varchar(150) NOT NULL,
  `arabic_nationality` varchar(150) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_nationality_id`),
  UNIQUE KEY `nationality_UNIQUE` (`nationality`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_options`
--

DROP TABLE IF EXISTS `hims_d_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_options` (
  `hims_d_options_id` int unsigned NOT NULL,
  `episode_id` int unsigned DEFAULT '1',
  `encounter_id` int unsigned DEFAULT '1',
  `episode_duration` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_options_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_organization`
--

DROP TABLE IF EXISTS `hims_d_organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_organization` (
  `hims_d_organization_id` int NOT NULL AUTO_INCREMENT,
  `product_type` enum('HIMS_ERP','HRMS','FINANCE_ERP','HRMS_ERP=HR','HIMS_CLINICAL','ONLY_LAB','ONLY_PHARMACY','NO_FINANCE') DEFAULT 'HIMS_ERP' COMMENT 'HIMS_ERP=Complete Product(with FINANCE,HRMS,PHARMACY,INVENTRORY),\\nHRMS=ONLY HR and PAYROLL, \\nHRMS_ERP=HR , PAYROLL and FINANCE\\n\\nFINANCE_ERP=(Finance,HR&PROL,Inventory,Pharmacy),\\nHIMS_CLINICAL=(NO Finance & HR&PROL), \\nONLY_LAB=ONLY_LAB,\\nONLY_PHARMACY=ONLY_PHARMACY,\\nNO_FINANCE=(Complete Product without Finance)',
  `organization_code` varchar(50) NOT NULL,
  `organization_name` varchar(250) NOT NULL,
  `business_registration_number` varchar(50) NOT NULL,
  `legal_name` varchar(250) NOT NULL,
  `fiscal_period` enum('12','13') NOT NULL,
  `fiscal_quarters` enum('1','2','3','4') NOT NULL,
  `tax_number` varchar(50) NOT NULL,
  `country_id` int NOT NULL,
  `state_id` int DEFAULT NULL,
  `city_id` int NOT NULL,
  `address1` varchar(250) DEFAULT NULL,
  `address2` varchar(250) DEFAULT NULL,
  `phone1` varchar(45) NOT NULL,
  `phone2` varchar(45) DEFAULT NULL,
  `fax` varchar(45) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `org_status` enum('A','I') NOT NULL DEFAULT 'A',
  `effective_start_date` date DEFAULT '1900-01-01',
  `other_lang_short` varchar(3) DEFAULT NULL,
  `other_lang` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `default_pay_type` enum('CH','CD') DEFAULT 'CH' COMMENT 'CH - Cash , CD - Card',
  `hims_d_head_of_organization_id` int DEFAULT NULL,
  `head_of_organisation_name` varchar(750) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` varchar(45) DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_organization_id`),
  UNIQUE KEY `index2` (`organization_code`,`organization_name`,`country_id`),
  KEY `hims_d_organization_fk1_idx` (`country_id`),
  KEY `hims_d_organization_fk2_idx` (`state_id`),
  KEY `hims_d_organization_fk3_idx` (`city_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_organization_fk1` FOREIGN KEY (`country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`),
  CONSTRAINT `hims_d_organization_fk2` FOREIGN KEY (`state_id`) REFERENCES `hims_d_state` (`hims_d_state_id`),
  CONSTRAINT `hims_d_organization_fk3` FOREIGN KEY (`city_id`) REFERENCES `hims_d_city` (`hims_d_city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_overtime_group`
--

DROP TABLE IF EXISTS `hims_d_overtime_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_overtime_group` (
  `hims_d_overtime_group_id` int NOT NULL AUTO_INCREMENT,
  `overtime_group_code` varchar(45) NOT NULL,
  `overtime_group_description` varchar(90) DEFAULT NULL,
  `working_day_hour` decimal(3,2) DEFAULT NULL,
  `weekoff_day_hour` decimal(3,2) DEFAULT NULL,
  `holiday_hour` decimal(3,2) DEFAULT NULL,
  `working_day_rate` decimal(10,3) DEFAULT NULL,
  `weekoff_day_rate` decimal(10,3) DEFAULT NULL,
  `holiday_rate` decimal(10,3) DEFAULT NULL,
  `payment_type` enum('RT','PC') DEFAULT NULL COMMENT 'RT = rate per hour\nPC = percentage of components',
  `overtime_group_status` enum('A','I') DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_overtime_group_id`),
  UNIQUE KEY `overtime_group_code_UNIQUE` (`overtime_group_code`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_package_detail`
--

DROP TABLE IF EXISTS `hims_d_package_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_package_detail` (
  `hims_d_package_detail_id` int NOT NULL AUTO_INCREMENT,
  `package_header_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `service_amount` decimal(10,3) DEFAULT NULL,
  `qty` tinyint DEFAULT NULL,
  `tot_service_amount` decimal(10,3) DEFAULT NULL,
  `appropriate_amount` decimal(10,3) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_package_detail_id`),
  KEY `hims_f_package_detail_fk1_idx` (`created_by`),
  KEY `hims_f_package_detail_fk2_idx` (`updated_by`),
  KEY `hims_f_package_detail_fk3_idx` (`service_id`),
  KEY `hims_f_package_detail_fk4_idx` (`service_type_id`),
  KEY `hims_f_package_detail_fk5_idx` (`package_header_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_package_detail_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_package_detail_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_package_detail_fk3` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_package_detail_fk4` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_f_package_detail_fk5` FOREIGN KEY (`package_header_id`) REFERENCES `hims_d_package_header` (`hims_d_package_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_package_header`
--

DROP TABLE IF EXISTS `hims_d_package_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_package_header` (
  `hims_d_package_header_id` int NOT NULL AUTO_INCREMENT,
  `package_code` varchar(45) DEFAULT NULL,
  `package_name` varchar(45) DEFAULT NULL,
  `package_amount` decimal(10,3) DEFAULT NULL,
  `total_service_amount` decimal(10,3) DEFAULT NULL,
  `profit_loss` enum('P','L') DEFAULT 'P' COMMENT 'P=PROFIT,\nL=LOSS',
  `pl_amount` decimal(10,3) DEFAULT '0.000',
  `package_service_id` int DEFAULT NULL,
  `package_type` enum('S','D') DEFAULT NULL COMMENT 'S-Static /n D- Dynamic',
  `expiry_days` smallint DEFAULT NULL,
  `advance_type` enum('P','A') DEFAULT NULL COMMENT 'P-Percentage \\n A-Amount',
  `advance_amount` decimal(10,3) DEFAULT NULL,
  `advance_percentage` decimal(10,2) DEFAULT NULL,
  `package_visit_type` enum('S','M') DEFAULT NULL COMMENT 'S-Single /n M- Multi',
  `package_status` enum('A','I') DEFAULT 'A',
  `approved` enum('N','Y') DEFAULT 'N',
  `approved_by` int DEFAULT NULL,
  `approved_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `validated_date` date DEFAULT NULL,
  `cancellation_policy` enum('AC','AP') DEFAULT 'AC' COMMENT 'AC- Actual Amount, AP- Appropriate Amount',
  `cancellation_type` enum('P','A') DEFAULT 'P',
  `cancellation_per` decimal(10,3) DEFAULT '0.000',
  `cancellation_amount` decimal(10,3) DEFAULT '0.000',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_package_header_id`),
  KEY `hims_f_package_header_fk1_idx` (`created_by`),
  KEY `hims_f_package_header_fk2_idx` (`updated_by`),
  KEY `hims_f_package_header_fk3_idx` (`package_service_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_package_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_package_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_package_header_fk3` FOREIGN KEY (`package_service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_patient_type`
--

DROP TABLE IF EXISTS `hims_d_patient_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_patient_type` (
  `hims_d_patient_type_id` int NOT NULL AUTO_INCREMENT,
  `patient_type_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `patitent_type_desc` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_patitent_type_desc` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `patient_status` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_patient_type_id`),
  UNIQUE KEY `patient_type_code_UNIQUE` (`patient_type_code`),
  KEY `hims_d_patient_type_idx1` (`patient_type_code`),
  KEY `hims_d_patient_type_idx2` (`patitent_type_desc`),
  KEY `hims_d_patient_type_idx3` (`record_status`),
  KEY `hims_d_patient_type_fk1_idx` (`created_by`),
  KEY `hims_d_patient_type_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_patient_type_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_patient_type_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_phar_location_reorder`
--

DROP TABLE IF EXISTS `hims_d_phar_location_reorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_phar_location_reorder` (
  `hims_d_phar_location_reorder_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `reorder_qty` mediumint DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_phar_location_reorder_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_pharmacy_item_pricelist`
--

DROP TABLE IF EXISTS `hims_d_pharmacy_item_pricelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_pharmacy_item_pricelist` (
  `hims_d_pharmacy_item_pricelist_id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `description` varchar(90) DEFAULT NULL,
  `decimals` enum('0','1','2','3','4','5','6') DEFAULT NULL,
  `pricelist_status` enum('A','I') DEFAULT NULL,
  `purchase_cost` decimal(10,6) DEFAULT NULL,
  `markup_percent` decimal(10,6) DEFAULT NULL,
  `sales_price` decimal(10,6) DEFAULT NULL,
  `purchase_uom_id` int DEFAULT NULL,
  `sales_uom_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT NULL,
  PRIMARY KEY (`hims_d_pharmacy_item_pricelist_id`),
  KEY `hims_d_pharmacy_item_pricelist_fk1_idx` (`created_by`),
  KEY `hims_d_pharmacy_item_pricelist_fk2_idx` (`updated_by`),
  KEY `hims_d_pharmacy_item_pricelist_fk3_idx` (`item_id`),
  KEY `hims_d_pharmacy_item_pricelist_fk4_idx` (`purchase_uom_id`),
  KEY `hims_d_pharmacy_item_pricelist_fk5_idx` (`sales_uom_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_pharmacy_item_pricelist_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_pharmacy_item_pricelist_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_pharmacy_item_pricelist_fk3` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_d_pharmacy_item_pricelist_fk4` FOREIGN KEY (`purchase_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_d_pharmacy_item_pricelist_fk5` FOREIGN KEY (`sales_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_pharmacy_location`
--

DROP TABLE IF EXISTS `hims_d_pharmacy_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_pharmacy_location` (
  `hims_d_pharmacy_location_id` int NOT NULL AUTO_INCREMENT,
  `location_description` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `location_type` enum('WH','MS','SS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'MS' COMMENT 'WH=Warehouse \\n MS = MAIN STORE \\n SS = SUB STORE',
  `allow_pos` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'N = NO \nY = YES',
  `git_location` enum('N','Y') DEFAULT 'N',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_pharmacy_location_id`),
  KEY `hims_d_item_location_fk1_idx` (`created_by`),
  KEY `hims_d_item_location_fk2_idx` (`updated_by`),
  KEY `hims_d_pharmacy_location_fk1_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_pharmacy_location_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_pharmacy_location_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_pharmacy_location_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_pharmacy_notification_expiry`
--

DROP TABLE IF EXISTS `hims_d_pharmacy_notification_expiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_pharmacy_notification_expiry` (
  `hims_d_pharmacy_notification_expiry_id` int NOT NULL AUTO_INCREMENT,
  `loaction_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_pharmacy_notification_expiry_id`),
  KEY `hims_d_pharmacy_notification_expiry_fk2_idx` (`item_id`),
  KEY `hims_d_pharmacy_notification_expiry_fk1_idx` (`loaction_id`),
  CONSTRAINT `hims_d_pharmacy_notification_expiry_fk1` FOREIGN KEY (`loaction_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_d_pharmacy_notification_expiry_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_pharmacy_options`
--

DROP TABLE IF EXISTS `hims_d_pharmacy_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_pharmacy_options` (
  `hims_d_pharmacy_options_id` int NOT NULL AUTO_INCREMENT,
  `notification_before` tinyint DEFAULT NULL,
  `notification_type` enum('D','M','Y') DEFAULT 'D' COMMENT 'D-Days, M-Months, Y-Years',
  `requisition_auth_level` enum('1','2') DEFAULT '1',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_pharmacy_options_id`),
  KEY `hims_d_pharmacy_options_fk1_idx` (`created_by`),
  KEY `hims_d_pharmacy_options_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_d_pharmacy_options_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_pharmacy_options_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_pharmacy_uom`
--

DROP TABLE IF EXISTS `hims_d_pharmacy_uom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_pharmacy_uom` (
  `hims_d_pharmacy_uom_id` int NOT NULL AUTO_INCREMENT,
  `uom_description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `uom_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_pharmacy_uom_id`),
  KEY `hims_d_pharmacy_uom_fk1_idx` (`created_by`),
  KEY `hims_d_pharmacy_uom_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_physical_examination_details`
--

DROP TABLE IF EXISTS `hims_d_physical_examination_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_physical_examination_details` (
  `hims_d_physical_examination_details_id` int NOT NULL AUTO_INCREMENT,
  `physical_examination_header_id` int DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `mandatory` enum('Y','N') DEFAULT 'N' COMMENT 'Y=YES\nN=NO',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_d_physical_examination_details_id`),
  KEY `hims_d_physical_examination_details_fk2_idx` (`created_by`),
  KEY `hims_d_physical_examination_details_fk3_idx` (`updated_by`),
  KEY `hims_d_physical_examination_details_fk4_idx` (`physical_examination_header_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_physical_examination_details_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_physical_examination_details_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_physical_examination_details_fk4` FOREIGN KEY (`physical_examination_header_id`) REFERENCES `hims_d_physical_examination_header` (`hims_d_physical_examination_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_physical_examination_header`
--

DROP TABLE IF EXISTS `hims_d_physical_examination_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_physical_examination_header` (
  `hims_d_physical_examination_header_id` int NOT NULL AUTO_INCREMENT,
  `examination_type` enum('G','S') DEFAULT 'G' COMMENT 'G=genaeral\n S=specific',
  `description` varchar(100) DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `assesment_type` enum('NS','A','O','P','NB') DEFAULT 'NS' COMMENT ' NS=Not selected\n A=Adult\n O=ob&gyane\n P=pediatric\n NB=newBorn\n',
  `mandatory` enum('Y','N') DEFAULT 'N' COMMENT 'Y=yes\nN=no',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\nI=inactive',
  PRIMARY KEY (`hims_d_physical_examination_header_id`),
  KEY `hims_d_physical_examination_header_fk1_idx` (`sub_department_id`),
  KEY `hims_d_physical_examination_header_fk2_idx` (`created_by`),
  KEY `hims_d_physical_examination_header_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_physical_examination_header_fk1` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_d_physical_examination_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_physical_examination_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_physical_examination_subdetails`
--

DROP TABLE IF EXISTS `hims_d_physical_examination_subdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_physical_examination_subdetails` (
  `hims_d_physical_examination_subdetails_id` int NOT NULL AUTO_INCREMENT,
  `physical_examination_details_id` int DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `mandatory` enum('Y','N') DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_physical_examination_subdetails_id`),
  KEY `hims_d_physical_examination_subdetails_fk2_idx` (`created_by`),
  KEY `hims_d_physical_examination_subdetails_fk3_idx` (`updated_by`),
  KEY `hims_d_physical_examination_subdetails_fk5_idx` (`physical_examination_details_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_physical_examination_subdetails_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_physical_examination_subdetails_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_physical_examination_subdetails_fk5` FOREIGN KEY (`physical_examination_details_id`) REFERENCES `hims_d_physical_examination_details` (`hims_d_physical_examination_details_id`)
) ENGINE=InnoDB AUTO_INCREMENT=377 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_procedure`
--

DROP TABLE IF EXISTS `hims_d_procedure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_procedure` (
  `hims_d_procedure_id` int NOT NULL AUTO_INCREMENT,
  `procedure_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `procedure_desc` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `procedure_desc_arabic` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `procedure_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `service_id` int DEFAULT NULL,
  `procedure_type` enum('DN','GN') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'GN' COMMENT 'DN=DENTAL\\nGN=GENERAL',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_procedure_id`),
  UNIQUE KEY `procedure_desc_UNIQUE` (`procedure_desc`),
  UNIQUE KEY `procedure_code_UNIQUE` (`procedure_code`),
  KEY `hims_d_procedure_fk1_idx` (`created_by`),
  KEY `hims_d_procedure_fk2_idx` (`updated_by`),
  KEY `hims_d_procedure_fk4_idx` (`service_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_procedure_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_procedure_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_procedure_fk4` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_procedure_detail`
--

DROP TABLE IF EXISTS `hims_d_procedure_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_procedure_detail` (
  `hims_d_procedure_detail_id` int NOT NULL AUTO_INCREMENT,
  `procedure_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `qty` decimal(10,3) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_procedure_detail_id`),
  KEY `hims_d_procedure_detail_fk1_idx` (`service_id`),
  KEY `hims_d_procedure_detail_fk2_idx` (`item_id`),
  KEY `hims_d_procedure_detail_fk3_idx` (`procedure_header_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_procedure_detail_fk1` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_d_procedure_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_d_procedure_detail_fk3` FOREIGN KEY (`procedure_header_id`) REFERENCES `hims_d_procedure` (`hims_d_procedure_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_procedure_group`
--

DROP TABLE IF EXISTS `hims_d_procedure_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_procedure_group` (
  `hims_d_procedure_group_id` int NOT NULL AUTO_INCREMENT,
  `procedure_group_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `procedure_group_description` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_procedure_group_description` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `procedure_group_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_procedure_group_id`),
  UNIQUE KEY `procedure_group_code_UNIQUE` (`procedure_group_code`),
  UNIQUE KEY `procedure_group_description_UNIQUE` (`procedure_group_description`),
  KEY `hims_d_procedure_group_fk1_idx` (`created_by`),
  KEY `hims_d_procedure_group_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_procedure_group_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_procedure_group_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_procurement_options`
--

DROP TABLE IF EXISTS `hims_d_procurement_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_procurement_options` (
  `hims_d_procurement_options_id` int NOT NULL AUTO_INCREMENT,
  `po_auth_level` enum('1','2') DEFAULT '1' COMMENT '1-Level 1, 2 - Level 2',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_procurement_options_id`),
  KEY `hims_d_procurement_options_fk1_idx` (`created_by`),
  KEY `hims_d_procurement_options_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_d_procurement_options_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_procurement_options_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_project`
--

DROP TABLE IF EXISTS `hims_d_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_project` (
  `hims_d_project_id` int NOT NULL AUTO_INCREMENT,
  `project_code` varchar(15) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `abbreviation` varchar(8) DEFAULT NULL,
  `project_desc` varchar(100) DEFAULT NULL,
  `project_desc_arabic` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `pjoject_status` enum('A','I') DEFAULT 'A',
  `inactive_date` date DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE\\nI = INACTIVE',
  PRIMARY KEY (`hims_d_project_id`),
  KEY `hims_d_project_fk1_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_project_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_rad_template_detail`
--

DROP TABLE IF EXISTS `hims_d_rad_template_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_rad_template_detail` (
  `hims_d_rad_template_detail_id` int NOT NULL AUTO_INCREMENT,
  `test_id` int DEFAULT NULL,
  `template_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `template_html` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `template_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE \\nI = INACTIVE',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE\nI = INACTIVE',
  PRIMARY KEY (`hims_d_rad_template_detail_id`),
  UNIQUE KEY `test_id_template_name` (`test_id`,`template_name`),
  KEY `hims_d_rad_template_detail_id_idx` (`test_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_rad_template_detail_id` FOREIGN KEY (`test_id`) REFERENCES `hims_d_investigation_test` (`hims_d_investigation_test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_religion`
--

DROP TABLE IF EXISTS `hims_d_religion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_religion` (
  `hims_d_religion_id` int NOT NULL AUTO_INCREMENT,
  `religion_code` varchar(45) NOT NULL,
  `religion_name` varchar(250) NOT NULL,
  `arabic_religion_name` varchar(300) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_religion_id`),
  KEY `index2` (`religion_code`),
  KEY `hims_d_religion_fk1_idx` (`created_by`),
  KEY `hims_d_religion_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_religion_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_religion_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_review_of_system_details`
--

DROP TABLE IF EXISTS `hims_d_review_of_system_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_review_of_system_details` (
  `hims_d_review_of_system_details_id` int NOT NULL AUTO_INCREMENT,
  `review_of_system_heder_id` int DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_review_of_system_details_id`),
  KEY `hims_d_review_of_system_details_fk2_idx` (`created_by`),
  KEY `hims_d_review_of_system_details_fk5_idx` (`updated_by`),
  KEY `hims_d_review_of_system_details_fk2` (`review_of_system_heder_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_review_of_system_details_fk2` FOREIGN KEY (`review_of_system_heder_id`) REFERENCES `hims_d_review_of_system_header` (`hims_d_review_of_system_header_id`),
  CONSTRAINT `hims_d_review_of_system_details_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_review_of_system_details_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_review_of_system_header`
--

DROP TABLE IF EXISTS `hims_d_review_of_system_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_review_of_system_header` (
  `hims_d_review_of_system_header_id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_d_review_of_system_header_id`),
  KEY `hims_d_review_of_system_header_fk1_idx` (`created_by`),
  KEY `hims_d_review_of_system_header_fk5_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_review_of_system_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_review_of_system_header_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_sales_options`
--

DROP TABLE IF EXISTS `hims_d_sales_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_sales_options` (
  `hims_d_sales_options_id` int NOT NULL AUTO_INCREMENT,
  `sales_order_auth_level` enum('1','2') DEFAULT '1' COMMENT '1-Level 1, 2 - Level 2',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `services_required` enum('N','Y') DEFAULT 'N',
  PRIMARY KEY (`hims_d_sales_options_id`),
  KEY `hims_d_sales_options_fk1_idx` (`created_by`),
  KEY `hims_d_sales_options_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_d_sales_options_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_sales_options_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_service_type`
--

DROP TABLE IF EXISTS `hims_d_service_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_service_type` (
  `hims_d_service_type_id` int NOT NULL,
  `service_type_code` varchar(45) NOT NULL,
  `service_type` varchar(250) NOT NULL,
  `service_type_desc` varchar(500) DEFAULT NULL,
  `arabic_service_type` varchar(300) DEFAULT NULL,
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date DEFAULT '9999-12-31',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_service_type_id`),
  KEY `hims_d_service_type_fk1_idx` (`created_by`),
  KEY `hims_d_service_type_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_service_type_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_service_type_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_services`
--

DROP TABLE IF EXISTS `hims_d_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_services` (
  `hims_d_services_id` int NOT NULL AUTO_INCREMENT,
  `service_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cpt_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `service_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `arabic_service_name` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `service_desc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `procedure_type` enum('DN','GN') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'GN' COMMENT 'DN=DENTAL\nGN=GENERAL',
  `standard_fee` decimal(10,2) DEFAULT '0.00',
  `followup_free_fee` decimal(10,2) DEFAULT '0.00',
  `followup_paid_fee` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(10,2) DEFAULT '0.00',
  `vat_applicable` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=yes\nN=no',
  `vat_percent` decimal(5,2) DEFAULT '0.00',
  `service_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `effective_start_date` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1900-01-01',
  `effectice_end_date` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '9999-12-31',
  `physiotherapy_service` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE\\nI = INACTIVE',
  PRIMARY KEY (`hims_d_services_id`),
  KEY `hims_d_services_idx1` (`service_code`),
  KEY `hims_d_services_idx2` (`service_name`),
  KEY `hims_d_services_idx3` (`effective_start_date`),
  KEY `hims_d_services_idx4` (`effectice_end_date`),
  KEY `hims_d_services_idx5` (`record_status`),
  KEY `hims_d_services_fk1_idx` (`created_by`),
  KEY `hims_d_services_fk2_idx` (`updated_by`),
  KEY `hims_d_services_fk3_idx` (`sub_department_id`),
  KEY `hims_d_services_fk5_idx` (`hospital_id`),
  KEY `hims_d_services_fk6_idx` (`service_type_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_services_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_services_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_services_fk4` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_d_services_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_services_fk6` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4557 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_services_insurance`
--

DROP TABLE IF EXISTS `hims_d_services_insurance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_services_insurance` (
  `hims_d_services_insurance_id` int NOT NULL AUTO_INCREMENT,
  `insurance_id` int NOT NULL,
  `services_id` int NOT NULL,
  `service_code` varchar(45) DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `cpt_code` varchar(45) DEFAULT NULL,
  `service_name` varchar(200) NOT NULL,
  `insurance_service_name` varchar(200) NOT NULL,
  `hospital_id` int DEFAULT NULL,
  `pre_approval` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO \nY = YES',
  `covered` enum('Y','N') NOT NULL DEFAULT 'Y',
  `deductable_status` enum('N','Y') DEFAULT 'N',
  `deductable_amt` decimal(10,2) DEFAULT '0.00',
  `copay_status` enum('N','Y') DEFAULT 'N',
  `copay_amt` decimal(10,2) DEFAULT '0.00',
  `gross_amt` decimal(10,2) DEFAULT '0.00',
  `corporate_discount_percent` decimal(10,2) DEFAULT '0.00',
  `corporate_discount_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `net_amount` decimal(10,2) DEFAULT '0.00',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_services_insurance_id`),
  UNIQUE KEY `index11` (`insurance_id`,`services_id`,`hospital_id`),
  KEY `hims_d_services_insurance_idx1` (`service_code`),
  KEY `hims_d_services_insurance_idx2` (`service_name`),
  KEY `hims_d_services_insurance_idx5` (`record_status`),
  KEY `hims_d_services_insurance_fk1_idx` (`created_by`),
  KEY `hims_d_services_insurance_fk2_idx` (`updated_by`),
  KEY `hims_d_services_insurance_fk5_idx` (`hospital_id`),
  KEY `hims_d_services_insurance_fk6_idx` (`services_id`),
  KEY `hims_d_services_insurance_fk7_idx` (`insurance_id`),
  KEY `hims_d_services_insurance_fk8_idx` (`service_type_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_services_insurance_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_services_insurance_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_services_insurance_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_services_insurance_fk6` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_d_services_insurance_fk7` FOREIGN KEY (`insurance_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_d_services_insurance_fk8` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1562 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_services_insurance_network`
--

DROP TABLE IF EXISTS `hims_d_services_insurance_network`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_services_insurance_network` (
  `hims_d_services_insurance_network_id` int NOT NULL AUTO_INCREMENT,
  `insurance_id` int NOT NULL,
  `network_id` int NOT NULL,
  `services_id` int NOT NULL,
  `service_code` varchar(45) DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `cpt_code` varchar(45) DEFAULT NULL,
  `service_name` varchar(200) NOT NULL,
  `insurance_service_name` varchar(200) NOT NULL,
  `hospital_id` int DEFAULT NULL,
  `pre_approval` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO \nY = YES',
  `covered` enum('Y','N') NOT NULL DEFAULT 'Y',
  `deductable_status` enum('N','Y') DEFAULT 'N',
  `deductable_amt` decimal(10,2) DEFAULT '0.00',
  `copay_status` enum('N','Y') DEFAULT 'N',
  `copay_amt` decimal(10,2) DEFAULT '0.00',
  `gross_amt` decimal(10,2) DEFAULT '0.00',
  `corporate_discount_percent` decimal(10,2) DEFAULT '0.00',
  `corporate_discount_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `net_amount` decimal(10,2) DEFAULT '0.00',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_services_insurance_network_id`),
  KEY `hims_d_services_insurance_network_idx1` (`service_code`),
  KEY `hims_d_services_insurance_network_idx2` (`service_name`),
  KEY `hims_d_services_insurance_network_idx5` (`record_status`),
  KEY `hims_d_services_insurance_network_fk1_idx` (`created_by`),
  KEY `hims_d_services_insurance_network_fk2_idx` (`updated_by`),
  KEY `hims_d_services_insurance_network_fk5_idx` (`hospital_id`),
  KEY `hims_d_services_insurance_network_fk6_idx` (`services_id`),
  KEY `hims_d_services_insurance_network_fk7_idx` (`network_id`),
  KEY `hims_d_services_insurance_network_fk8_idx` (`insurance_id`),
  KEY `hims_d_services_insurance_network_fk9_idx` (`service_type_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_services_insurance_network_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_services_insurance_network_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_services_insurance_network_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_d_services_insurance_network_fk6` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_d_services_insurance_network_fk7` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_d_services_insurance_network_fk8` FOREIGN KEY (`insurance_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_d_services_insurance_network_fk9` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_sfda`
--

DROP TABLE IF EXISTS `hims_d_sfda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_sfda` (
  `hims_d_sfda_id` int NOT NULL AUTO_INCREMENT,
  `registration_number` varchar(45) DEFAULT NULL,
  `item_name` varchar(450) DEFAULT NULL,
  `focus_and_unity` varchar(450) DEFAULT NULL,
  `pharmaceutical_form` varchar(450) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  `size_unit` varchar(45) DEFAULT NULL,
  `package_size` varchar(45) DEFAULT NULL,
  `agent` varchar(450) DEFAULT NULL,
  `Price` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'A' COMMENT 'A=ACTIVE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nI=INACTIVE',
  PRIMARY KEY (`hims_d_sfda_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=8971 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_shift`
--

DROP TABLE IF EXISTS `hims_d_shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_shift` (
  `hims_d_shift_id` int NOT NULL AUTO_INCREMENT,
  `shift_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shift_description` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_name` varchar(90) DEFAULT NULL,
  `shift_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `in_time1` time DEFAULT NULL,
  `out_time1` time DEFAULT NULL,
  `in_time2` time DEFAULT NULL,
  `out_time2` time DEFAULT NULL,
  `break` enum('Y','N') DEFAULT 'N',
  `break_start` time DEFAULT NULL,
  `break_end` time DEFAULT NULL,
  `shift_abbreviation` varchar(6) DEFAULT NULL,
  `shift_end_day` enum('SD','ND') NOT NULL DEFAULT 'SD' COMMENT 'SD = Same Date\\\\\\\\nND = Next Date',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_shift_id`),
  UNIQUE KEY `shift_code_UNIQUE` (`shift_code`),
  UNIQUE KEY `shift_description_UNIQUE` (`shift_description`),
  KEY `hims_d_shift_fk1_idx` (`created_by`),
  KEY `hims_d_shift_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_shift_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_shift_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_speciality_wise_diagrams`
--

DROP TABLE IF EXISTS `hims_d_speciality_wise_diagrams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_speciality_wise_diagrams` (
  `diagram_id` int NOT NULL AUTO_INCREMENT,
  `image_desc` varchar(45) DEFAULT NULL,
  `image_link` varchar(200) DEFAULT NULL,
  `hims_d_employee_speciality_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`diagram_id`),
  KEY `hims_d_speciality_wise_diagrams_fk1_idx` (`created_by`),
  KEY `hims_d_speciality_wise_diagrams_fk2_idx` (`update_by`),
  KEY `hims_d_speciality_wise_diagrams_fk3_idx` (`hims_d_employee_speciality_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_speciality_wise_diagrams_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_speciality_wise_diagrams_fk2` FOREIGN KEY (`update_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_speciality_wise_diagrams_fk3` FOREIGN KEY (`hims_d_employee_speciality_id`) REFERENCES `hims_d_employee_speciality` (`hims_d_employee_speciality_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_state`
--

DROP TABLE IF EXISTS `hims_d_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_state` (
  `hims_d_state_id` int NOT NULL AUTO_INCREMENT,
  `state_code` varchar(50) NOT NULL,
  `state_name` varchar(250) NOT NULL,
  `arabic_state_name` varchar(300) DEFAULT NULL,
  `country_id` int NOT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` varchar(45) DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_state_id`),
  UNIQUE KEY `hims_d_state_idx1` (`state_code`,`state_name`,`country_id`,`record_status`),
  KEY `hims_d_state_idx2` (`record_status`),
  KEY `hims_d_state_fk1` (`country_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_state_fk1` FOREIGN KEY (`country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3895 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_sub_activity`
--

DROP TABLE IF EXISTS `hims_d_sub_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_sub_activity` (
  `hims_d_sub_activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_sub_activity_id`),
  KEY `hims_d_sub_activity_fk1_idx` (`activity_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_sub_activity_fk1` FOREIGN KEY (`activity_id`) REFERENCES `hims_d_activity` (`hims_d_activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_sub_department`
--

DROP TABLE IF EXISTS `hims_d_sub_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_sub_department` (
  `hims_d_sub_department_id` int NOT NULL AUTO_INCREMENT,
  `sub_department_code` varchar(45) NOT NULL,
  `sub_department_name` varchar(150) NOT NULL,
  `arabic_sub_department_name` varchar(150) DEFAULT NULL,
  `sub_department_desc` varchar(300) DEFAULT NULL,
  `department_id` int NOT NULL,
  `effective_start_date` datetime NOT NULL DEFAULT '1900-01-01 00:00:00',
  `effective_end_date` datetime DEFAULT '9999-12-31 00:00:00',
  `sub_department_status` enum('A','I') NOT NULL DEFAULT 'A',
  `department_type` enum('D','E','O','N','PH','I') DEFAULT 'N' COMMENT 'D=DENTAL\\\\nE=EMEMERGENCY\\\\nO=OPTHOMOLOGY\\\\nN=NONE\\nPH=PHARMACY\\n I=INVENTORY',
  `inventory_location_id` int DEFAULT NULL,
  `chart_type` enum('N','D','O','S') DEFAULT 'N' COMMENT 'N=None\\nD=Dentel\\nO=Optometry\\nS=Sales',
  `vitals_mandatory` enum('Y','N') DEFAULT 'N' COMMENT 'Vitals Mandatory\nY=Yes,N=No',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_sub_department_id`),
  UNIQUE KEY `sub_department_name_UNIQUE` (`sub_department_name`),
  UNIQUE KEY `sub_department_code_UNIQUE` (`sub_department_code`),
  UNIQUE KEY `index2` (`sub_department_code`,`sub_department_name`,`department_id`,`effective_end_date`,`sub_department_status`,`record_status`,`effective_start_date`),
  KEY `index3` (`sub_department_status`),
  KEY `hims_d_sub_department_idx` (`department_id`),
  KEY `hims_d_sub_department_fk2_idx` (`created_by`),
  KEY `hims_d_sub_department_fk3_idx` (`updated_by`),
  KEY `hims_d_sub_department_fk4_idx` (`inventory_location_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_d_sub_department_fk5_idx` (`department_id`),
  CONSTRAINT `hims_d_sub_department_fk1` FOREIGN KEY (`department_id`) REFERENCES `hims_d_department` (`hims_d_department_id`),
  CONSTRAINT `hims_d_sub_department_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_sub_department_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_sub_department_fk4` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_d_sub_department_fk5` FOREIGN KEY (`department_id`) REFERENCES `hims_d_department` (`hims_d_department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_test_category`
--

DROP TABLE IF EXISTS `hims_d_test_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_test_category` (
  `hims_d_test_category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `investigation_type` enum('R','L') DEFAULT NULL,
  `category_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `test_section` enum('M','C','HI','HE','O') DEFAULT 'O' COMMENT 'M- Microbiology,\\\\\\\\nC- Cytology,\\\\\\\\nHI- Histopathology,\\\\\\\\nHE- Hematology,\\\\\\\\nO- Others\\\\\\\\n',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_d_test_category_id`),
  KEY `hims_d_test_category_fk1_idx` (`created_by`),
  KEY `hims_d_test_category_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_test_category_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_test_category_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_title`
--

DROP TABLE IF EXISTS `hims_d_title`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_title` (
  `his_d_title_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `arabic_title` varchar(300) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`his_d_title_id`),
  UNIQUE KEY `index2` (`title`),
  KEY `his_d_title_fk1_idx` (`created_by`),
  KEY `his_d_title_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `his_d_title_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `his_d_title_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_vendor`
--

DROP TABLE IF EXISTS `hims_d_vendor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_vendor` (
  `hims_d_vendor_id` int NOT NULL AUTO_INCREMENT,
  `vendor_code` varchar(15) DEFAULT NULL,
  `vendor_name` varchar(100) DEFAULT NULL,
  `vendor_status` enum('A','I') DEFAULT 'A',
  `business_registration_no` varchar(25) DEFAULT NULL,
  `email_id_1` varchar(45) DEFAULT NULL,
  `email_id_2` varchar(45) DEFAULT NULL,
  `website` varchar(75) DEFAULT NULL,
  `contact_number` varchar(45) DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT NULL COMMENT '''0'' = 0 days\\\\n ’15’ = 15 days \n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `payment_mode` enum('CS','CH','BT','DC','CC') DEFAULT NULL COMMENT 'CS = CASH\nCH = CHEQUE\nBT = BANK TRANSFER\nDC = DEBIT CARD\nCC = CREDIT CARD',
  `vat_applicable` enum('N','Y') DEFAULT NULL COMMENT 'N = NO \nY = YES',
  `vat_percentage` decimal(10,3) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(45) DEFAULT NULL,
  `vat_number` varchar(45) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE \nI = INACTIVE',
  PRIMARY KEY (`hims_d_vendor_id`),
  KEY `hims_d_vendor_fk1_idx` (`created_by`),
  KEY `hims_d_vendor_fk2_idx` (`updated_by`),
  KEY `hims_d_vendor_fk3_idx` (`country_id`),
  KEY `hims_d_vendor_fk4_idx` (`state_id`),
  KEY `hims_d_vendor_fk5_idx` (`city_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_vendor_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_vendor_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_vendor_fk3` FOREIGN KEY (`country_id`) REFERENCES `hims_d_country` (`hims_d_country_id`),
  CONSTRAINT `hims_d_vendor_fk4` FOREIGN KEY (`state_id`) REFERENCES `hims_d_state` (`hims_d_state_id`),
  CONSTRAINT `hims_d_vendor_fk5` FOREIGN KEY (`city_id`) REFERENCES `hims_d_city` (`hims_d_city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_visa_type`
--

DROP TABLE IF EXISTS `hims_d_visa_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_visa_type` (
  `hims_d_visa_type_id` int NOT NULL AUTO_INCREMENT,
  `visa_type_code` varchar(45) DEFAULT NULL,
  `visa_type` varchar(50) DEFAULT NULL,
  `visa_desc` varchar(50) DEFAULT NULL,
  `arabic_visa_type` varchar(300) DEFAULT NULL,
  `visa_status` enum('A','I') DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_visa_type_id`),
  UNIQUE KEY `visa_type_code_UNIQUE` (`visa_type_code`),
  KEY `hims_d_visa_type_fk1_idx` (`created_by`),
  KEY `hims_d_visa_type_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_visa_type_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_visa_type_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_visit_type`
--

DROP TABLE IF EXISTS `hims_d_visit_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_visit_type` (
  `hims_d_visit_type_id` int NOT NULL AUTO_INCREMENT,
  `visit_type_code` varchar(45) NOT NULL,
  `visit_type_desc` varchar(100) DEFAULT NULL,
  `arabic_visit_type_desc` varchar(300) DEFAULT NULL,
  `visit_status` enum('A','I') NOT NULL DEFAULT 'A',
  `consultation` enum('N','Y') NOT NULL DEFAULT 'N' COMMENT 'N-No\nY-Yes',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_d_visit_type_id`),
  UNIQUE KEY `index2` (`visit_type_code`),
  KEY `hims_d_visit_type_fk1_idx` (`created_by`),
  KEY `hims_d_visit_type_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_visit_type_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_visit_type_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_vitals_details`
--

DROP TABLE IF EXISTS `hims_d_vitals_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_vitals_details` (
  `hims_d_vitals_details_id` int NOT NULL AUTO_INCREMENT,
  `vitals_header_id` int DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `min_age` smallint DEFAULT NULL,
  `max_age` smallint DEFAULT NULL,
  `min_value` decimal(5,2) DEFAULT NULL,
  `normal_value` decimal(5,2) DEFAULT NULL,
  `max_value` decimal(5,2) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'A' COMMENT 'ENUM(''''A'''', ''''I'''',''''O'''')',
  PRIMARY KEY (`hims_d_vitals_details_id`),
  KEY `hims_d_vitals_details_fk2_idx` (`created_by`),
  KEY `hims_d_vitals_details_fk4_idx` (`updated_by`),
  KEY `hims_d_vitals_details_fk5_idx` (`vitals_header_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_vitals_details_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_vitals_details_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_vitals_details_fk5` FOREIGN KEY (`vitals_header_id`) REFERENCES `hims_d_vitals_header` (`hims_d_vitals_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_d_vitals_header`
--

DROP TABLE IF EXISTS `hims_d_vitals_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_d_vitals_header` (
  `hims_d_vitals_header_id` int NOT NULL,
  `vitals_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `vital_short_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Short Name',
  `sequence_order` int DEFAULT NULL,
  `uom` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `general` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y = Yes\\\\nN = No',
  `display` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Y',
  `mandatory` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Mandatory',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A' COMMENT 'ENUM(''A'', ''I'',''O'')',
  PRIMARY KEY (`hims_d_vitals_header_id`),
  KEY `hims_d_vitals_header_fk1_idx` (`created_by`),
  KEY `hims_d_vitals_header_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_vitals_header` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_vitals_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_absent`
--

DROP TABLE IF EXISTS `hims_f_absent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_absent` (
  `hims_f_absent_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `absent_date` date NOT NULL,
  `from_session` enum('FD','FH','SH') DEFAULT 'FD',
  `to_session` enum('FD','FH','SH') DEFAULT 'FD',
  `absent_reason` varchar(150) DEFAULT NULL,
  `absent_duration` decimal(4,1) DEFAULT '0.0',
  `status` enum('NFD','PEN','CTL','CPR') DEFAULT 'NFD' COMMENT 'NFD=notified,PEN=pending,CTL=convert to leave,CPR=convert to present',
  `cancel` enum('N','Y') DEFAULT 'N',
  `cancel_reason` varchar(150) DEFAULT NULL,
  `cancel_by` int DEFAULT NULL,
  `cancel_date` date DEFAULT NULL,
  `processed` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_absent_id`),
  UNIQUE KEY `employee_absent_date` (`employee_id`,`absent_date`),
  KEY `hims_f_absent_fk1_idx` (`cancel_by`),
  KEY `hims_f_absent_fk2_idx` (`created_by`),
  KEY `hims_f_absent_fk3_idx` (`updated_by`),
  KEY `hims_f_absent_fk4_idx` (`employee_id`),
  KEY `index6` (`record_status`) /*!80000 INVISIBLE */,
  KEY `index7` (`absent_date`),
  KEY `index8` (`cancel`),
  KEY `hims_f_absent_fk5_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_absent_fk1` FOREIGN KEY (`cancel_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_absent_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_absent_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_absent_fk4` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_absent_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_advance_history`
--

DROP TABLE IF EXISTS `hims_f_advance_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_advance_history` (
  `hims_f_advance_history_id` int NOT NULL,
  `hims_f_patient_id` int NOT NULL,
  `hims_f_patient_advance_id` int NOT NULL,
  `transaction_type` enum('A','R','C') DEFAULT 'A' COMMENT 'A= ADVANCE\nR = REFUND\nC= CANCEL',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_advance_history_id`),
  KEY `hims_f_advance_history_fk1_idx` (`created_by`),
  KEY `hims_f_advance_history_fk2_idx` (`hims_f_patient_id`),
  KEY `hims_f_advance_history_fk3_idx` (`hims_f_patient_advance_id`),
  CONSTRAINT `hims_f_advance_history_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_advance_history_fk2` FOREIGN KEY (`hims_f_patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_advance_history_fk3` FOREIGN KEY (`hims_f_patient_advance_id`) REFERENCES `hims_f_patient_advance` (`hims_f_patient_advance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_app_numgen`
--

DROP TABLE IF EXISTS `hims_f_app_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_app_numgen` (
  `hims_f_app_numgen_id` int NOT NULL AUTO_INCREMENT,
  `numgen_code` varchar(45) NOT NULL,
  `module_desc` varchar(250) NOT NULL,
  `prefix` varchar(45) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` varchar(45) NOT NULL,
  `postfix` varchar(200) NOT NULL COMMENT 'Number',
  `length` int NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` int NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(45) DEFAULT NULL,
  `postfix_start` varchar(200) NOT NULL,
  `postfix_end` varchar(200) NOT NULL,
  `current_num` varchar(500) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(500) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_app_numgen_id`),
  UNIQUE KEY `numgen_code_UNIQUE` (`numgen_code`),
  KEY `hims_f_app_numgen_idx1` (`numgen_code`),
  KEY `hims_f_app_numgen_idx2` (`module_desc`),
  KEY `hims_f_app_numgen_idx3` (`prefix`),
  KEY `hims_f_app_numgen_idx4` (`postfix`),
  KEY `hims_f_app_numgen_idx5` (`length`),
  KEY `hims_f_app_numgen_idx6` (`increment_by`),
  KEY `hims_f_app_numgen_idx7` (`current_num`),
  KEY `hims_f_app_numgen_idx8` (`pervious_num`),
  KEY `hims_f_app_numgen_idx9` (`record_status`),
  KEY `hims_f_app_numgen_fk1_idx` (`created_by`),
  KEY `hims_f_app_numgen_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_app_numgen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_app_numgen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_attendance_monthly`
--

DROP TABLE IF EXISTS `hims_f_attendance_monthly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_attendance_monthly` (
  `hims_f_attendance_monthly_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `year` smallint unsigned NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL DEFAULT '1' COMMENT '1 = JAN\\n2 =FEB\\n3 = MAR\\n4 = APR\\n5 = MAY\\n6 = JUNE\\n7 =JULY\\n8 = AUG\\n9 = SEPT\\n10 = OCT\\n11= NOV\\n12= DEC',
  `hospital_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `total_days` decimal(5,2) DEFAULT NULL,
  `present_days` decimal(5,2) DEFAULT NULL,
  `display_present_days` decimal(5,2) DEFAULT '0.00',
  `absent_days` decimal(5,2) DEFAULT NULL,
  `total_work_days` decimal(5,2) DEFAULT NULL,
  `total_weekoff_days` decimal(5,2) DEFAULT NULL,
  `total_holidays` decimal(5,2) DEFAULT NULL,
  `total_leave` decimal(5,2) DEFAULT NULL,
  `paid_leave` decimal(5,2) DEFAULT NULL,
  `unpaid_leave` decimal(5,2) DEFAULT NULL,
  `total_paid_days` decimal(5,2) DEFAULT NULL,
  `total_hours` decimal(5,2) DEFAULT NULL,
  `total_working_hours` decimal(5,2) DEFAULT NULL,
  `shortage_hours` decimal(5,2) DEFAULT NULL,
  `ot_work_hours` decimal(5,2) DEFAULT NULL,
  `ot_weekoff_hours` decimal(5,2) DEFAULT NULL,
  `ot_holiday_hours` decimal(5,2) DEFAULT NULL,
  `pending_unpaid_leave` decimal(5,2) DEFAULT NULL,
  `leave_processed` enum('N','Y') DEFAULT NULL,
  `leave_open_balance` decimal(5,2) DEFAULT NULL,
  `leave_close_balance` decimal(5,2) DEFAULT NULL,
  `comp_off_days` decimal(5,2) DEFAULT NULL,
  `comp_off_hours` decimal(5,2) DEFAULT NULL,
  `prev_month_shortage_hr` decimal(5,2) DEFAULT NULL,
  `prev_month_ot_hr` decimal(5,2) DEFAULT NULL,
  `prev_month_week_off_ot` decimal(5,2) DEFAULT '0.00',
  `prev_month_holiday_ot` decimal(5,2) DEFAULT '0.00',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_attendance_monthly_id`),
  UNIQUE KEY `unique_index` (`employee_id`,`year`,`month`),
  KEY `hims_f_attendance_monthly_fk1_idx` (`employee_id`),
  KEY `hims_f_attendance_monthly_fk2_idx` (`sub_department_id`),
  KEY `hims_f_attendance_monthly_fk3_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_attendance_monthly_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_attendance_monthly_fk2` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_f_attendance_monthly_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=464 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_attendance_regularize`
--

DROP TABLE IF EXISTS `hims_f_attendance_regularize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_attendance_regularize` (
  `hims_f_attendance_regularize_id` int NOT NULL AUTO_INCREMENT,
  `regularization_code` varchar(45) DEFAULT NULL,
  `employee_id` int NOT NULL,
  `attendance_date` date DEFAULT NULL,
  `regularize_status` enum('PEN','APR','REJ','NFD') DEFAULT 'NFD' COMMENT 'PEN = PENDING\\\\\\\\nAPR = APPROVED\\\\\\\\nREJ =REJECTED, NFD=notify',
  `login_date` date DEFAULT NULL,
  `logout_date` date DEFAULT NULL,
  `punch_in_time` time DEFAULT NULL,
  `punch_out_time` time DEFAULT NULL,
  `regularize_in_time` time DEFAULT NULL,
  `regularize_out_time` time DEFAULT NULL,
  `regularization_reason` varchar(200) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_attendance_regularize_id`),
  UNIQUE KEY `hims_f_attendance_regularize_uq1` (`employee_id`,`attendance_date`),
  KEY `hims_f_attendance_regularize_fk1_idx` (`employee_id`),
  KEY `hims_f_attendance_regularize_fk2_idx` (`created_by`),
  KEY `hims_f_attendance_regularize_fk3_idx` (`updated_by`),
  KEY `hims_f_attendance_regularize_fk4_idx` (`hospital_id`),
  CONSTRAINT `hims_f_attendance_regularize_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_attendance_regularize_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_attendance_regularize_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_attendance_regularize_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_authorization_setup`
--

DROP TABLE IF EXISTS `hims_f_authorization_setup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_authorization_setup` (
  `hims_f_authorization_setup_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_level_1` int DEFAULT NULL,
  `leave_level_2` int DEFAULT NULL,
  `leave_level_3` int DEFAULT NULL,
  `leave_level_4` int DEFAULT NULL,
  `leave_level_5` int DEFAULT NULL,
  `loan_level_1` int DEFAULT NULL,
  `loan_level_2` int DEFAULT NULL,
  `loan_level_3` int DEFAULT NULL,
  `performance_level_1` int DEFAULT NULL,
  `performance_level_2` int DEFAULT NULL,
  `performance_level_3` int DEFAULT NULL,
  `salary_level_1` int DEFAULT NULL,
  `salary_level_2` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_authorization_setup_id`),
  UNIQUE KEY `employee_id_UNIQUE` (`employee_id`),
  KEY `hims_f_authorization_setup_fk1_idx` (`employee_id`),
  KEY `hims_f_authorization_setup_fk2_idx` (`leave_level_1`),
  KEY `hims_f_authorization_setup_fk3_idx` (`leave_level_2`),
  KEY `hims_f_authorization_setup_fk4_idx` (`leave_level_3`),
  KEY `hims_f_authorization_setup_fk5_idx` (`leave_level_4`),
  KEY `hims_f_authorization_setup_fk6_idx` (`leave_level_5`),
  KEY `hims_f_authorization_setup_fk7_idx` (`loan_level_1`),
  KEY `hims_f_authorization_setup_fk8_idx` (`loan_level_2`),
  KEY `hims_f_authorization_setup_fk9_idx` (`loan_level_3`),
  KEY `hims_f_authorization_setup_fk10_idx` (`performance_level_1`),
  KEY `hims_f_authorization_setup_fk11_idx` (`performance_level_2`),
  KEY `hims_f_authorization_setup_fk12_idx` (`performance_level_3`),
  KEY `hims_f_authorization_setup_fk13_idx` (`salary_level_1`),
  KEY `hims_f_authorization_setup_fk14_idx` (`salary_level_2`),
  CONSTRAINT `hims_f_authorization_setup_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_authorization_setup_fk10` FOREIGN KEY (`performance_level_1`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk11` FOREIGN KEY (`performance_level_2`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk12` FOREIGN KEY (`performance_level_3`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk13` FOREIGN KEY (`salary_level_1`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk14` FOREIGN KEY (`salary_level_2`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk2` FOREIGN KEY (`leave_level_1`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk3` FOREIGN KEY (`leave_level_2`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk4` FOREIGN KEY (`leave_level_3`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk5` FOREIGN KEY (`leave_level_4`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk6` FOREIGN KEY (`leave_level_5`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk7` FOREIGN KEY (`loan_level_1`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk8` FOREIGN KEY (`loan_level_2`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_authorization_setup_fk9` FOREIGN KEY (`loan_level_3`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_bill_cancel_details`
--

DROP TABLE IF EXISTS `hims_f_bill_cancel_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_bill_cancel_details` (
  `hims_f_bill_cancel_details_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_bill_cancel_header_id` int DEFAULT NULL,
  `service_type_id` int NOT NULL,
  `services_id` int NOT NULL,
  `quantity` decimal(10,0) DEFAULT '0',
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `insurance_yesno` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `gross_amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `discount_amout` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(10,3) DEFAULT '0.000',
  `net_amout` decimal(10,3) DEFAULT '0.000',
  `copay_percentage` decimal(10,3) DEFAULT '0.000',
  `copay_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_inclusive` enum('Y','N') DEFAULT 'N',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `patient_resp` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `comapany_resp` decimal(10,3) DEFAULT '0.000',
  `company_payble` decimal(10,3) DEFAULT '0.000',
  `sec_company` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `sec_deductable_percentage` decimal(10,3) DEFAULT '0.000',
  `sec_deductable_amount` decimal(10,3) DEFAULT '0.000',
  `sec_company_res` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_paybale` decimal(10,3) DEFAULT '0.000',
  `sec_copay_percntage` decimal(10,3) DEFAULT '0.000',
  `sec_copay_amount` decimal(10,3) DEFAULT '0.000',
  `pre_approval` enum('N','Y') DEFAULT 'N' COMMENT 'N-NO\nY-YES',
  `commission_given` enum('Y','N') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_bill_cancel_details_id`),
  KEY `hims_f_bill_cancel_details_fk1_idx` (`hims_f_bill_cancel_header_id`),
  KEY `hims_f_bill_cancel_details_fk3_idx` (`created_by`),
  KEY `hims_f_bill_cancel_details_fk4_idx` (`updated_by`),
  KEY `hims_f_bill_cancel_details_fk5_idx` (`services_id`),
  KEY `hims_f_bill_cancel_details_fk6_idx` (`service_type_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_bill_cancel_details_fk1` FOREIGN KEY (`hims_f_bill_cancel_header_id`) REFERENCES `hims_f_bill_cancel_header` (`hims_f_bill_cancel_header_id`),
  CONSTRAINT `hims_f_bill_cancel_details_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_bill_cancel_details_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_bill_cancel_details_fk5` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_bill_cancel_details_fk6` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci KEY_BLOCK_SIZE=4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_bill_cancel_header`
--

DROP TABLE IF EXISTS `hims_f_bill_cancel_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_bill_cancel_header` (
  `hims_f_bill_cancel_header_id` int NOT NULL AUTO_INCREMENT,
  `bill_cancel_number` varchar(22) NOT NULL,
  `patient_id` int NOT NULL,
  `visit_id` int NOT NULL,
  `from_bill_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `incharge_or_provider` int DEFAULT NULL,
  `bill_cancel_date` datetime DEFAULT NULL,
  `advance_amount` decimal(10,3) DEFAULT '0.000',
  `advance_adjust` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `sub_total_amount` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `net_total` decimal(10,3) DEFAULT '0.000',
  `billing_status` varchar(45) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_amount` decimal(10,3) DEFAULT '0.000',
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `sec_deductable_amount` decimal(10,2) DEFAULT NULL,
  `gross_total` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_amount` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_percentage` decimal(5,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `patient_res` decimal(10,3) DEFAULT '0.000',
  `company_res` decimal(10,3) DEFAULT '0.000',
  `sec_company_res` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `company_payable` decimal(10,3) DEFAULT '0.000',
  `sec_company_payable` decimal(10,3) DEFAULT '0.000',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `net_tax` decimal(10,3) DEFAULT '0.000',
  `credit_amount` decimal(10,3) DEFAULT '0.000',
  `payable_amount` decimal(10,3) DEFAULT '0.000',
  `balance_due` decimal(10,3) DEFAULT '0.000',
  `receipt_header_id` int DEFAULT NULL,
  `cancel_remarks` varchar(200) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_bill_cancel_header_id`),
  KEY `hims_f_bill_cancel_header_fk1_idx` (`patient_id`),
  KEY `hims_f_bill_cancel_header_idx` (`incharge_or_provider`),
  KEY `hims_f_bill_cancel_header_fk6_idx` (`created_by`),
  KEY `hims_f_bill_cancel_header_fk7_idx` (`updated_by`),
  KEY `hims_f_bill_cancel_header_fk2_idx` (`visit_id`),
  KEY `hims_f_bill_cancel_header_fk8_idx` (`receipt_header_id`),
  KEY `hims_f_bill_cancel_header_fk9_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_bill_cancel_header_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_bill_cancel_header_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_bill_cancel_header_fk4` FOREIGN KEY (`incharge_or_provider`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_bill_cancel_header_fk6` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_bill_cancel_header_fk7` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_bill_cancel_header_fk8` FOREIGN KEY (`receipt_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_bill_cancel_header_fk9` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_billing_details`
--

DROP TABLE IF EXISTS `hims_f_billing_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_billing_details` (
  `hims_f_billing_details_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_billing_header_id` int DEFAULT NULL,
  `service_type_id` int NOT NULL,
  `services_id` int NOT NULL,
  `quantity` decimal(10,0) DEFAULT '0',
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `insurance_yesno` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `gross_amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `discount_amout` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(10,3) DEFAULT '0.000',
  `net_amout` decimal(10,3) DEFAULT '0.000',
  `copay_percentage` decimal(10,3) DEFAULT '0.000',
  `copay_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_inclusive` enum('Y','N') DEFAULT 'N',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `patient_resp` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `comapany_resp` decimal(10,3) DEFAULT '0.000',
  `company_payble` decimal(10,3) DEFAULT '0.000',
  `sec_company` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `sec_deductable_percentage` decimal(10,3) DEFAULT '0.000',
  `sec_deductable_amount` decimal(10,3) DEFAULT '0.000',
  `sec_company_res` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_paybale` decimal(10,3) DEFAULT '0.000',
  `sec_copay_percntage` decimal(10,3) DEFAULT '0.000',
  `sec_copay_amount` decimal(10,3) DEFAULT '0.000',
  `s_patient_tax` decimal(10,3) DEFAULT '0.000',
  `pre_approval` enum('N','Y') DEFAULT 'N' COMMENT 'N-NO\nY-YES',
  `commission_given` enum('Y','N') DEFAULT 'N',
  `teeth_number` tinyint DEFAULT NULL,
  `cancel_yes_no` enum('Y','N') DEFAULT 'N',
  `cancel_by` int DEFAULT NULL,
  `ordered_services_id` int DEFAULT NULL,
  `ordered_inventory_id` int DEFAULT NULL,
  `ordered_package_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_billing_details_id`),
  KEY `hims_f_billing_details_fk1_idx` (`hims_f_billing_header_id`),
  KEY `hims_f_billing_details_fk3_idx` (`created_by`),
  KEY `hims_f_billing_details_fk4_idx` (`updated_by`),
  KEY `hims_f_billng_details_fk5_idx` (`services_id`),
  KEY `hims_f_billing_details_fk6_idx` (`service_type_id`),
  KEY `hims_f_billng_details_fk6_idx` (`ordered_services_id`),
  KEY `hims_f_billng_details_fk7_idx` (`ordered_inventory_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_billng_details_fk8_idx` (`ordered_package_id`),
  CONSTRAINT `hims_f_billing_details_fk1` FOREIGN KEY (`hims_f_billing_header_id`) REFERENCES `hims_f_billing_header` (`hims_f_billing_header_id`),
  CONSTRAINT `hims_f_billing_details_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_billing_details_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_billing_details_fk6` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_f_billng_details_fk5` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_billng_details_fk6` FOREIGN KEY (`ordered_services_id`) REFERENCES `hims_f_ordered_services` (`hims_f_ordered_services_id`),
  CONSTRAINT `hims_f_billng_details_fk7` FOREIGN KEY (`ordered_inventory_id`) REFERENCES `hims_f_ordered_inventory` (`hims_f_ordered_inventory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci KEY_BLOCK_SIZE=4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_billing_header`
--

DROP TABLE IF EXISTS `hims_f_billing_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_billing_header` (
  `hims_f_billing_header_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `visit_id` int DEFAULT NULL,
  `bill_number` varchar(22) NOT NULL,
  `incharge_or_provider` int DEFAULT NULL,
  `bill_date` datetime DEFAULT NULL,
  `advance_amount` decimal(10,3) DEFAULT '0.000',
  `advance_adjust` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `sub_total_amount` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `net_total` decimal(10,3) DEFAULT '0.000',
  `billing_status` varchar(45) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_amount` decimal(10,3) DEFAULT '0.000',
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `sec_deductable_amount` decimal(10,2) DEFAULT NULL,
  `gross_total` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_amount` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_percentage` decimal(10,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `patient_res` decimal(10,3) DEFAULT '0.000',
  `company_res` decimal(10,3) DEFAULT '0.000',
  `sec_company_res` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `company_payable` decimal(10,3) DEFAULT '0.000',
  `sec_company_payable` decimal(10,3) DEFAULT '0.000',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `net_tax` decimal(10,3) DEFAULT '0.000',
  `credit_amount` decimal(10,3) DEFAULT '0.000',
  `receiveable_amount` decimal(10,3) DEFAULT '0.000',
  `balance_credit` decimal(10,3) DEFAULT '0.000',
  `balance_due` decimal(10,3) DEFAULT '0.000',
  `s_patient_tax` decimal(10,3) DEFAULT '0.000',
  `receipt_header_id` int DEFAULT NULL,
  `cancel_remarks` varchar(200) DEFAULT NULL,
  `cancelled` enum('Y','N','P') DEFAULT 'N' COMMENT 'Y=Yes \\n N=No \\n P=Partial Cancel',
  `cancel_by` int DEFAULT NULL,
  `invoice_generated` enum('Y','N') NOT NULL DEFAULT 'N',
  `bill_comments` varchar(200) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_billing_header_id`),
  KEY `hims_f_billing_header_fk1_idx` (`patient_id`),
  KEY `hims_f_billing_header_idx` (`incharge_or_provider`),
  KEY `hims_f_billing_header_fk6_idx` (`created_by`),
  KEY `hims_f_billing_header_fk7_idx` (`updated_by`),
  KEY `hims_f_billing_header_fk2_idx` (`visit_id`),
  KEY `hims_f_billing_header_fk8_idx` (`receipt_header_id`),
  KEY `hims_f_billing_header_fk9_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_billing_header_bill_number` (`bill_number`),
  KEY `hims_f_billing_header_created_date` (`created_date`),
  CONSTRAINT `hims_f_billing_header_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_billing_header_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_billing_header_fk4` FOREIGN KEY (`incharge_or_provider`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_billing_header_fk6` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_billing_header_fk7` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_billing_header_fk8` FOREIGN KEY (`receipt_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_billing_header_fk9` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=183 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_cash_handover_detail`
--

DROP TABLE IF EXISTS `hims_f_cash_handover_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_cash_handover_detail` (
  `hims_f_cash_handover_detail_id` int NOT NULL AUTO_INCREMENT,
  `cash_handover_header_id` int DEFAULT NULL,
  `casher_id` int DEFAULT NULL,
  `shift_status` enum('O','C','A') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'O= open,\nC= close\nA = authorize\n',
  `open_date` datetime DEFAULT NULL,
  `close_date` datetime DEFAULT NULL,
  `close_by` int DEFAULT NULL,
  `expected_cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `actual_cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `difference_cash` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cash_status` enum('T','S','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'EN=Cash Status, \nAR= حالة النقدية\\n\nT= TALLIED,\\n\nS= SHORTAGE,\\n\nE= EXCESS',
  `expected_card` decimal(10,3) NOT NULL DEFAULT '0.000',
  `actual_card` decimal(10,3) NOT NULL DEFAULT '0.000',
  `difference_card` decimal(10,3) NOT NULL DEFAULT '0.000',
  `card_status` enum('T','S','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'EN=Credit Status, AR= حالة الائتمان\\nT= TALLIED,\\nS= SHORTAGE,\\nE= EXCESS',
  `expected_cheque` decimal(10,3) NOT NULL DEFAULT '0.000',
  `actual_cheque` decimal(10,3) NOT NULL DEFAULT '0.000',
  `difference_cheque` decimal(10,3) NOT NULL DEFAULT '0.000',
  `cheque_status` enum('T','S','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'EN=Cheque Status, AR= تحقق من الحالة\nT= TALLIED,\nS= SHORTAGE,\nE= EXCESS',
  `remarks` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `no_of_cheques` smallint DEFAULT '0',
  `collected_cash` decimal(10,3) DEFAULT '0.000',
  `refunded_cash` decimal(10,3) DEFAULT '0.000',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int NOT NULL,
  PRIMARY KEY (`hims_f_cash_handover_detail_id`),
  KEY `hims_f_cash_handover_detail_fk1_idx` (`cash_handover_header_id`),
  KEY `hims_f_cash_handover_detail_fk2_idx` (`created_by`),
  KEY `hims_f_cash_handover_detail_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_cash_handover_detail_fk1` FOREIGN KEY (`cash_handover_header_id`) REFERENCES `hims_f_cash_handover_header` (`hims_f_cash_handover_header_id`),
  CONSTRAINT `hims_f_cash_handover_detail_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_cash_handover_detail_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_cash_handover_header`
--

DROP TABLE IF EXISTS `hims_f_cash_handover_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_cash_handover_header` (
  `hims_f_cash_handover_header_id` int NOT NULL AUTO_INCREMENT,
  `shift_id` int DEFAULT NULL,
  `daily_handover_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int NOT NULL,
  PRIMARY KEY (`hims_f_cash_handover_header_id`),
  UNIQUE KEY `index5` (`shift_id`,`daily_handover_date`,`hospital_id`),
  KEY `hims_f_cash_handover_header_fk1_idx` (`shift_id`),
  KEY `hims_f_cash_handover_header_fk2_idx` (`created_by`),
  KEY `hims_f_cash_handover_header_fk2_idx1` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_cash_handover_header_fk1` FOREIGN KEY (`shift_id`) REFERENCES `hims_d_shift` (`hims_d_shift_id`),
  CONSTRAINT `hims_f_cash_handover_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_cash_handover_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_contract_management`
--

DROP TABLE IF EXISTS `hims_f_contract_management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_contract_management` (
  `hims_f_contract_management_id` int NOT NULL AUTO_INCREMENT,
  `contract_number` varchar(45) DEFAULT NULL,
  `contract_date` datetime DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `contract_code` varchar(45) DEFAULT NULL,
  `quotation_ref_numb` varchar(45) DEFAULT NULL,
  `terms_conditions` longtext,
  `incharge_employee_id` int DEFAULT NULL,
  `notification_days1` smallint DEFAULT NULL,
  `notification_days2` smallint DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_contract_management_id`),
  KEY `hims_f_contract_management_fk1_idx` (`customer_id`),
  KEY `hims_f_contract_management_fk2_idx` (`created_by`),
  KEY `hims_f_contract_management_fk3_idx` (`updated_by`),
  KEY `hims_f_contract_management_fk4_idx` (`hospital_id`),
  KEY `hims_f_contract_management_fk5_idx` (`incharge_employee_id`),
  CONSTRAINT `hims_f_contract_management_fk1` FOREIGN KEY (`customer_id`) REFERENCES `hims_d_customer` (`hims_d_customer_id`),
  CONSTRAINT `hims_f_contract_management_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_contract_management_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_contract_management_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_contract_management_fk5` FOREIGN KEY (`incharge_employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_contract_management_services`
--

DROP TABLE IF EXISTS `hims_f_contract_management_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_contract_management_services` (
  `hims_f_contract_management_services_id` int NOT NULL AUTO_INCREMENT,
  `contract_management_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `service_frequency` enum('M','W','D','H','PT','PP') DEFAULT 'M' COMMENT 'M-Monthly, W-Weekly, D-Daily, H-Hourly, PT- Per Trip, PP- Per Person',
  `service_price` decimal(10,3) DEFAULT '0.000',
  `comments` varchar(150) DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hims_f_contract_management_services_id`),
  KEY `hims_f_contract_management_services_fk1_idx` (`contract_management_id`),
  KEY `hims_f_contract_management_services_fk2_idx` (`services_id`),
  CONSTRAINT `hims_f_contract_management_services_fk1` FOREIGN KEY (`contract_management_id`) REFERENCES `hims_f_contract_management` (`hims_f_contract_management_id`),
  CONSTRAINT `hims_f_contract_management_services_fk2` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_credit_detail`
--

DROP TABLE IF EXISTS `hims_f_credit_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_credit_detail` (
  `hims_f_credit_detail_id` int NOT NULL AUTO_INCREMENT,
  `credit_header_id` int NOT NULL,
  `bill_header_id` int NOT NULL,
  `include` enum('N','Y') DEFAULT 'N',
  `bill_date` date DEFAULT NULL,
  `credit_amount` decimal(10,3) DEFAULT NULL,
  `receipt_amount` decimal(10,3) DEFAULT NULL,
  `balance_amount` decimal(10,3) DEFAULT NULL,
  `previous_balance` decimal(10,3) DEFAULT NULL,
  `bill_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_credit_detail_id`),
  KEY `hims_f_credit_detail_fk1_idx` (`credit_header_id`),
  KEY `hims_f_credit_detail_fk2_idx` (`bill_header_id`),
  CONSTRAINT `hims_f_credit_detail_fk1` FOREIGN KEY (`credit_header_id`) REFERENCES `hims_f_credit_header` (`hims_f_credit_header_id`),
  CONSTRAINT `hims_f_credit_detail_fk2` FOREIGN KEY (`bill_header_id`) REFERENCES `hims_f_billing_header` (`hims_f_billing_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_credit_header`
--

DROP TABLE IF EXISTS `hims_f_credit_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_credit_header` (
  `hims_f_credit_header_id` int NOT NULL AUTO_INCREMENT,
  `credit_number` varchar(22) NOT NULL,
  `credit_date` datetime DEFAULT NULL,
  `patient_id` int NOT NULL,
  `reciept_amount` decimal(10,3) DEFAULT NULL,
  `write_off_amount` decimal(10,3) DEFAULT NULL,
  `recievable_amount` decimal(10,3) DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  `reciept_header_id` int DEFAULT NULL,
  `transaction_type` enum('Z','R','P') DEFAULT 'Z' COMMENT 'Z = ZERO CREDIT,\nR = RECIEPT,\nP =PAYMENT',
  `write_off_account` varchar(45) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_credit_header_id`),
  KEY `hims_f_credit_header_fk1_idx` (`posted_by`),
  KEY `hims_f_credit_header_fk2_idx` (`created_by`),
  KEY `hims_f_credit_header_fk3_idx` (`patient_id`),
  KEY `hims_f_credit_header_fk4_idx` (`reciept_header_id`),
  KEY `hims_f_credit_header_fk5_idx` (`hospital_id`),
  CONSTRAINT `hims_f_credit_header_fk1` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_credit_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_credit_header_fk3` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_credit_header_fk4` FOREIGN KEY (`reciept_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_credit_header_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_daily_attendance`
--

DROP TABLE IF EXISTS `hims_f_daily_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_daily_attendance` (
  `hims_f_daily_attendance_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `sub_department_id` int NOT NULL,
  `year` smallint NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL,
  `attendance_date` date NOT NULL,
  `total_days` decimal(1,0) DEFAULT '1',
  `present_days` decimal(3,2) DEFAULT '0.00',
  `display_present_days` decimal(3,2) DEFAULT '0.00',
  `absent_days` decimal(3,2) DEFAULT '0.00',
  `total_work_days` decimal(3,2) DEFAULT '0.00',
  `weekoff_days` decimal(3,2) DEFAULT '0.00',
  `holidays` decimal(3,2) DEFAULT '0.00',
  `paid_leave` decimal(3,2) DEFAULT '0.00',
  `unpaid_leave` decimal(3,2) DEFAULT '0.00',
  `pending_unpaid_leave` decimal(5,2) DEFAULT '0.00',
  `anual_leave` decimal(3,2) DEFAULT '0.00',
  `hours` smallint DEFAULT '0',
  `minutes` smallint DEFAULT '0',
  `total_hours` decimal(5,2) DEFAULT '0.00',
  `working_hours` decimal(5,2) DEFAULT '0.00',
  `shortage_hours` smallint DEFAULT '0',
  `shortage_minutes` smallint DEFAULT '0',
  `ot_work_hours` smallint DEFAULT '0',
  `ot_minutes` smallint DEFAULT '0',
  `ot_weekoff_hours` smallint DEFAULT '0',
  `ot_weekoff_minutes` smallint DEFAULT '0',
  `ot_holiday_hours` smallint DEFAULT '0',
  `ot_holiday_minutes` smallint DEFAULT '0',
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_daily_attendance_id`),
  UNIQUE KEY `emp_attendan` (`employee_id`,`hospital_id`,`attendance_date`),
  KEY `hims_f_daily_attendance_fk1_idx` (`employee_id`),
  KEY `hims_f_daily_attendance_fk2_idx` (`hospital_id`),
  CONSTRAINT `hims_f_daily_attendance_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_daily_attendance_fk2` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14167 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_daily_time_sheet`
--

DROP TABLE IF EXISTS `hims_f_daily_time_sheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_daily_time_sheet` (
  `hims_f_daily_time_sheet_id` int NOT NULL AUTO_INCREMENT COMMENT 'Daily Time Sheet Id',
  `employee_id` int DEFAULT NULL COMMENT 'Employee Id',
  `sub_department_id` int DEFAULT NULL,
  `biometric_id` varchar(45) DEFAULT NULL COMMENT 'Biometric Id',
  `attendance_date` date DEFAULT NULL COMMENT 'Attendance Date',
  `in_time` time DEFAULT NULL COMMENT 'In Time',
  `out_date` date DEFAULT NULL COMMENT 'Out Date',
  `out_time` time DEFAULT NULL COMMENT 'Out Time',
  `year` smallint DEFAULT NULL COMMENT 'Year',
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT '1' COMMENT 'Month',
  `status` enum('PR','AB','LV','EX','HO','WO','PL','UL','HPL','HUL','EXT') DEFAULT 'PR' COMMENT 'Status;\\nPR = PRESENT\\\\nAB = ABSENT\\\\nLV = LEAVE\\\\nEX= EXCEPTION\\\\nHO=HOLIDAY\\\\nWO=WEEK OFF\\\\nPL=PAID LEAVE\\\\nUL=UNPAID LEAVE\\\\nUL=UNPAID LEAVE,HPL=HALF_DAY_PAID_LEAVE,HUL=HALF_DAY_UNPAID_LEAVE\nEXT=AFTER DATE OF EXIT',
  `is_anual_leave` enum('Y','N') DEFAULT 'N' COMMENT 'the field indicates whether to consider (overtime or shortage) for a particular date',
  `posted` enum('N','Y') DEFAULT 'N' COMMENT 'Posted;\nN=NO\\nY=YES',
  `hours` smallint DEFAULT NULL COMMENT 'Hours',
  `minutes` smallint DEFAULT NULL COMMENT 'Minutes',
  `actual_hours` smallint DEFAULT '0' COMMENT 'Actual Hours',
  `actual_minutes` smallint DEFAULT '0' COMMENT 'Actual Minutes',
  `worked_hours` decimal(4,2) DEFAULT NULL COMMENT 'Wroking Hours',
  `consider_ot_shrtg` enum('Y','N') DEFAULT 'Y' COMMENT 'the field indicates whether to consider (overtime or shortage) for a particular date',
  `expected_out_date` date DEFAULT NULL COMMENT 'Expected Out Date',
  `expected_out_time` time DEFAULT NULL COMMENT 'Expected Out Time',
  `project_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\nI=inactive',
  PRIMARY KEY (`hims_f_daily_time_sheet_id`),
  UNIQUE KEY `biometric_id_and date` (`attendance_date`,`employee_id`),
  KEY `hims_f_daily_time_sheet_fk1_idx` (`employee_id`),
  KEY `hims_f_daily_time_sheet_fk2_idx` (`sub_department_id`),
  KEY `hims_f_daily_time_sheet_fk3_idx` (`hospital_id`),
  KEY `hims_f_daily_time_sheet_fk4_idx` (`project_id`),
  KEY `index7` (`attendance_date`),
  CONSTRAINT `hims_f_daily_time_sheet_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_daily_time_sheet_fk2` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_f_daily_time_sheet_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_daily_time_sheet_fk4` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dayend_detail`
--

DROP TABLE IF EXISTS `hims_f_dayend_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dayend_detail` (
  `hims_f_dayend_detail_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_dayend_header_id` int DEFAULT NULL,
  `transtype` enum('0','1','2','3','4','5','20','21','22','23','24','25','26','27','28','29','30','31','40','41','42','43','44','45','46','47','48','51','52','53','54') DEFAULT '0' COMMENT '0 =ALL\\n1 =OP BILL\\n2 =OP ADVANCE\\n3 =OP REFUND\\n4 =OP CANCEL\\n5 =OP CREDIT\\n20 =PH RECIEPT\\n21 =PH INVOICE\\n22 =PH PURCHASE RETURN\\n23 =PH CREDIT NOTE\\n24 =PH DEBIT NOTE\\n25 =PH POS\\n26 =PH SALES RETURN\\n27 =PH TRANSFER\\n28 =PH ADJUSTMENT\\n29 =PH SHIPMENT \\n30 =PH CREDIT SETTLEMENT\\n31 =PH CONSUMPTION\\n40 =INV RECIEPT\\n41 =INV INVOICE\\n42 =INV PURCHASE RETURN\\n43 =INV CREDIT NOTE\\n44 =INV DEBIT NOTE\\n45 =INV TRANSFER\\n46 =INV ADJUSTMENT\\n47 =INV SHIPMENT\\n48 =INV CONSUMPTION\\n51 =INS INVOICE\\n52 = INS RECIEPTS\\n53 =INS ADJUSTMENT\\n54 =INS RESUBMISSION\\n ',
  `document_number` varchar(45) DEFAULT NULL,
  `document_date` date DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `transaction_amount` decimal(10,3) DEFAULT NULL,
  `receipt_amount` decimal(10,3) DEFAULT NULL,
  `batchno` int DEFAULT NULL,
  `select` enum('N','Y') DEFAULT 'N',
  `gl_batch_created` enum('N','Y') DEFAULT NULL,
  `from_document_no` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`hims_f_dayend_detail_id`),
  KEY `hims_f_dayend_detail_fk1_idx` (`hims_f_dayend_header_id`),
  CONSTRAINT `hims_f_dayend_detail_fk1` FOREIGN KEY (`hims_f_dayend_header_id`) REFERENCES `hims_f_dayend_header` (`hims_f_dayend_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dayend_header`
--

DROP TABLE IF EXISTS `hims_f_dayend_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dayend_header` (
  `hims_f_dayend_header_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `post_all` enum('N','Y') DEFAULT 'N',
  `modules_list` enum('OP','PH','IN','IS') DEFAULT NULL COMMENT 'OP = OP BILL,\nPH = PHARMACY,\nIN = INVENTORY,\nIS = INSURANCE,\nIP= IP BILL,\n',
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `from_docno` varchar(45) DEFAULT NULL,
  `to_docno` varchar(45) DEFAULT NULL,
  `dayendno` int DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT NULL,
  `no_of_record_processed` int DEFAULT NULL,
  `no_of_errors` int DEFAULT NULL,
  `function` enum('PRV','POST') DEFAULT NULL COMMENT 'PRV = PREVIEW\nPOST = POST\n',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_dayend_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dcaf_header`
--

DROP TABLE IF EXISTS `hims_f_dcaf_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dcaf_header` (
  `hims_f_dcaf_header_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `visit_id` int NOT NULL,
  `visit_date` date NOT NULL,
  `patient_marital_status` varchar(15) DEFAULT NULL,
  `provider_name` varchar(750) DEFAULT NULL,
  `new_visit_patient` enum('Y','N') DEFAULT 'N',
  `sub_department_name` varchar(150) DEFAULT NULL,
  `patient_code` varchar(45) DEFAULT NULL,
  `patient_full_name` varchar(180) DEFAULT NULL,
  `patient_duration_of_illness` decimal(10,2) DEFAULT NULL COMMENT 'Days',
  `patient_chief_comp_main_symptoms` text,
  `patient_significant_signs` text,
  `patient_diagnosys` text,
  `primary` text,
  `secondary` text,
  `patient_other_conditions` text,
  `regular_dental_trt` enum('Y','N') DEFAULT 'N',
  `dental_cleaning` enum('Y','N') DEFAULT 'N',
  `RTA` enum('Y','N') DEFAULT 'N',
  `work_related` enum('Y','N') DEFAULT 'N',
  `others` text,
  `how` text,
  `when` text,
  `where` text,
  `patient_gender` varchar(45) DEFAULT 'Male',
  `age_in_years` int DEFAULT NULL,
  `insuarance_class` varchar(45) DEFAULT NULL,
  `insurance_holder` varchar(750) DEFAULT NULL,
  `eligible_reference_number` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_dcaf_header_id`),
  KEY `hims_f_dcaf_header_fk1_idx` (`patient_id`),
  KEY `hims_f_dcaf_header_fk2_idx` (`visit_id`),
  CONSTRAINT `hims_f_dcaf_header_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_dcaf_header_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dcaf_insurance_details`
--

DROP TABLE IF EXISTS `hims_f_dcaf_insurance_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dcaf_insurance_details` (
  `hims_f_dcaf_details_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_dcaf_header_id` int DEFAULT NULL,
  `primary_policy_num` varchar(100) DEFAULT NULL,
  `primary_effective_start_date` date DEFAULT NULL,
  `primary_effective_end_date` date DEFAULT NULL,
  `primary_card_number` varchar(20) DEFAULT NULL,
  `primary_insurance_provider_id` int DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_policy_num` varchar(100) DEFAULT NULL,
  `secondary_card_number` varchar(20) DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `primary_insurance_company_name` varchar(255) DEFAULT NULL,
  `secondary_insurance_company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `primary_tpa_insurance_company_name` varchar(245) DEFAULT NULL,
  `secondary_tpa_insurance_company_name` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`hims_f_dcaf_details_id`),
  KEY `hims_f_dcaf_insurance_details_fk1_idx` (`primary_insurance_provider_id`),
  KEY `hims_f_dcaf_insurance_details_fk2_idx` (`secondary_insurance_provider_id`),
  KEY `hims_f_dcaf_insurance_details_fk3_idx` (`hims_f_dcaf_header_id`),
  CONSTRAINT `hims_f_dcaf_insurance_details_fk1` FOREIGN KEY (`primary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_dcaf_insurance_details_fk2` FOREIGN KEY (`secondary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_dcaf_insurance_details_fk3` FOREIGN KEY (`hims_f_dcaf_header_id`) REFERENCES `hims_f_dcaf_header` (`hims_f_dcaf_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dcaf_medication`
--

DROP TABLE IF EXISTS `hims_f_dcaf_medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dcaf_medication` (
  `hims_f_dcaf_medication_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_dcaf_header_id` int DEFAULT NULL,
  `generic_name` varchar(120) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`hims_f_dcaf_medication_id`),
  KEY `hims_f_dcaf_medication_fk1_idx` (`hims_f_dcaf_header_id`),
  CONSTRAINT `hims_f_dcaf_medication_fk1` FOREIGN KEY (`hims_f_dcaf_header_id`) REFERENCES `hims_f_dcaf_header` (`hims_f_dcaf_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dcaf_services`
--

DROP TABLE IF EXISTS `hims_f_dcaf_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dcaf_services` (
  `hims_f_dcaf_services_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_dcaf_header_id` int DEFAULT NULL,
  `service_code` varchar(20) DEFAULT NULL,
  `service_name` varchar(200) DEFAULT NULL,
  `teeth_number` tinyint DEFAULT NULL,
  `service_net_amout` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`hims_f_dcaf_services_id`),
  KEY `hims_f_dcaf_services_fk1_idx` (`hims_f_dcaf_header_id`),
  CONSTRAINT `hims_f_dcaf_services_fk1` FOREIGN KEY (`hims_f_dcaf_header_id`) REFERENCES `hims_f_dcaf_header` (`hims_f_dcaf_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dental_form`
--

DROP TABLE IF EXISTS `hims_f_dental_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dental_form` (
  `hims_f_dental_form_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `provider_id` int NOT NULL,
  `visit_id` int DEFAULT NULL,
  `episode` int DEFAULT NULL,
  `approved` enum('Y','N') DEFAULT 'N',
  `work_status` enum('WIP','PEN','COM') DEFAULT 'PEN' COMMENT 'WIP=WORK IN PROGRESS,PEN=PENDING,COM=COMPLETED',
  `due_date` date DEFAULT NULL,
  `bruxzir_anterior` enum('Y','N') DEFAULT 'N',
  `ips_e_max` enum('Y','N') DEFAULT 'N',
  `lava` enum('Y','N') DEFAULT 'N',
  `lumineers` enum('Y','N') DEFAULT 'N',
  `zirconia_e_max_layered` enum('Y','N') DEFAULT 'N',
  `bruxzir` enum('Y','N') DEFAULT 'N',
  `nobel` enum('Y','N') DEFAULT 'N',
  `white_high_nobel` enum('Y','N') DEFAULT 'N',
  `non_precious` enum('Y','N') DEFAULT 'N',
  `pmma` enum('Y','N') DEFAULT 'N',
  `titanium` enum('Y','N') DEFAULT 'N',
  `zirconia_w_ti_base` enum('Y','N') DEFAULT 'N',
  `biomet_3i_encode` enum('Y','N') DEFAULT 'N',
  `screw_retained` enum('Y','N') DEFAULT 'N',
  `flexi` enum('Y','N') DEFAULT 'N',
  `analog` enum('Y','N') DEFAULT 'N',
  `models` enum('Y','N') DEFAULT 'N',
  `implant_parts` enum('Y','N') DEFAULT 'N',
  `impression` enum('Y','N') DEFAULT 'N',
  `bite` enum('Y','N') DEFAULT 'N',
  `shade_tab` enum('Y','N') DEFAULT 'N',
  `others` enum('Y','N') DEFAULT 'N',
  `photos` enum('Y','N') DEFAULT 'N',
  `bags` enum('Y','N') DEFAULT 'N',
  `rx_forms` enum('Y','N') DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'A' COMMENT 'A=ACTIVE\\\\\\\\nI=INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_dental_form_id`),
  KEY `hims_f_dental_form_fk1_idx` (`provider_id`),
  KEY `hims_f_dental_form_fk2_idx` (`patient_id`),
  KEY `hims_f_dental_form_fk3_idx` (`updated_by`),
  KEY `hims_f_dental_form_fk4_idx` (`created_by`),
  KEY `hims_f_dental_form_fk5_idx` (`visit_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_dental_form_fk1` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_dental_form_fk2` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_dental_form_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_dental_form_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_dental_form_fk5` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_dental_treatment`
--

DROP TABLE IF EXISTS `hims_f_dental_treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_dental_treatment` (
  `hims_f_dental_treatment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `episode_id` int NOT NULL,
  `treatment_plan_id` int NOT NULL,
  `service_id` int DEFAULT NULL,
  `teeth_number` tinyint NOT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `distal` enum('N','Y') DEFAULT 'N',
  `incisal` enum('N','Y') DEFAULT 'N',
  `occlusal` enum('N','Y') DEFAULT 'N',
  `mesial` enum('N','Y') DEFAULT 'N',
  `buccal` enum('N','Y') DEFAULT 'N',
  `labial` enum('N','Y') DEFAULT 'N',
  `cervical` enum('N','Y') DEFAULT 'N',
  `palatal` enum('N','Y') DEFAULT 'N',
  `lingual` enum('N','Y') DEFAULT 'N',
  `discount_percent` decimal(5,2) DEFAULT '0.00',
  `billed` enum('N','Y','SB') NOT NULL DEFAULT 'N' COMMENT 'N=NO\nY=YES\nSB=SENT TO BILL',
  `treatment_status` enum('PL','WIP','CP') NOT NULL DEFAULT 'PL' COMMENT 'PL= PLANNED,\\\\nWIP =WORK IN PROGRESS,\\\\nCP = COMPLETED',
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_dental_treatment_id`),
  KEY `hims_f_dental_treatment_fk1_idx` (`created_by`),
  KEY `hims_f_dental_treatment_fk2_idx` (`service_id`),
  KEY `hims_f_dental_treatment_fk3_idx` (`patient_id`),
  KEY `hims_f_dental_treatment_fk4_idx` (`treatment_plan_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_dental_treatment_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_dental_treatment_fk2` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_dental_treatment_fk3` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_dental_treatment_fk4` FOREIGN KEY (`treatment_plan_id`) REFERENCES `hims_f_treatment_plan` (`hims_f_treatment_plan_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_doctor_comission_detail`
--

DROP TABLE IF EXISTS `hims_f_doctor_comission_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_doctor_comission_detail` (
  `hims_f_doctor_comission_detail_id` int NOT NULL AUTO_INCREMENT,
  `doctor_comission_header_id` int DEFAULT NULL,
  `bill_number` varchar(22) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `servtype_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `quantity` decimal(10,0) DEFAULT NULL,
  `unitcost` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `patient_share` decimal(10,3) DEFAULT NULL,
  `company_share` decimal(10,3) DEFAULT NULL,
  `net_amount` decimal(10,3) DEFAULT NULL,
  `op_cash_comission_type` enum('PER','AMT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `op_cash_comission_percentage` decimal(5,3) DEFAULT NULL,
  `op_cash_comission_amount` decimal(10,3) DEFAULT NULL,
  `op_cash_comission` decimal(10,3) DEFAULT NULL,
  `ip_cash_comission_type` enum('PER','AMT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ip_cash_comission_percentage` decimal(5,3) DEFAULT NULL,
  `ip_cash_comission_amount` decimal(10,3) DEFAULT NULL,
  `ip_cash_comission` decimal(10,3) DEFAULT NULL,
  `op_crd_comission_type` enum('PER','AMT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `op_crd_comission_percentage` decimal(5,3) DEFAULT NULL,
  `op_crd_comission_amount` decimal(10,3) DEFAULT NULL,
  `op_crd_comission` decimal(10,3) DEFAULT NULL,
  `ip_crd_comission_type` enum('PER','AMT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ip_crd_comission_percentage` decimal(5,3) DEFAULT NULL,
  `ip_crd_comission_amount` decimal(10,3) DEFAULT NULL,
  `ip_crd_comission` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_doctor_comission_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_doctor_comission_header`
--

DROP TABLE IF EXISTS `hims_f_doctor_comission_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_doctor_comission_header` (
  `hims_f_doctor_comission_header_id` int NOT NULL AUTO_INCREMENT,
  `comission_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `case_type` enum('OP','IP') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'OP = OUT PATIENT\nIP = IN PATIENT',
  `from_billcode_id` int DEFAULT NULL,
  `to_billcode_id` int DEFAULT NULL,
  `selected_service_type` enum('AS','SS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'AS = ALL SERVICE TYPE\nSS = SELECTED SERVICE TYPE',
  `op_commision` decimal(10,3) DEFAULT NULL,
  `ip_comission` decimal(10,3) DEFAULT NULL,
  `op_credit_comission` decimal(10,3) DEFAULT NULL,
  `ip_credit_comission` decimal(10,3) DEFAULT NULL,
  `net_turn_over` decimal(10,3) DEFAULT NULL,
  `gross_comission` decimal(10,3) DEFAULT NULL,
  `adjust_amount` decimal(10,3) DEFAULT NULL,
  `net_comission` decimal(10,3) DEFAULT NULL,
  `tax_percentage` decimal(10,3) DEFAULT NULL,
  `tax_amount` decimal(10,3) DEFAULT NULL,
  `comission_payable` decimal(10,3) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_doctor_comission_header_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_advance`
--

DROP TABLE IF EXISTS `hims_f_employee_advance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_advance` (
  `hims_f_employee_advance_id` int NOT NULL AUTO_INCREMENT,
  `advance_number` varchar(22) NOT NULL,
  `employee_id` int NOT NULL,
  `advance_amount` decimal(10,3) unsigned NOT NULL,
  `advance_reason` varchar(150) DEFAULT NULL,
  `deducting_month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `deducting_year` smallint DEFAULT NULL,
  `advance_status` enum('APR','REJ','PAI') DEFAULT 'APR' COMMENT 'APR = Approve,\nREJ = Reject,\nPAI = Paid',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_employee_advance_id`),
  KEY `hims_f_employee_advance_fk1_idx` (`created_by`),
  KEY `hims_f_employee_advance_fk2_idx` (`updated_by`),
  KEY `hims_f_employee_advance_fk3_idx` (`employee_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_employee_advance_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_advance_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_advance_fk3` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_annual_leave`
--

DROP TABLE IF EXISTS `hims_f_employee_annual_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_annual_leave` (
  `hims_f_employee_annual_leave_id` int NOT NULL AUTO_INCREMENT,
  `leave_application_id` int NOT NULL,
  `employee_id` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `month` int DEFAULT NULL,
  `cancelled` enum('Y','N') DEFAULT 'N',
  `hospital_id` int DEFAULT NULL,
  `from_normal_salary` enum('N','Y') DEFAULT 'N',
  PRIMARY KEY (`hims_f_employee_annual_leave_id`),
  KEY `hims_f_employee_annual_leave_fk1_idx` (`leave_application_id`) /*!80000 INVISIBLE */,
  KEY `index3` (`employee_id`) /*!80000 INVISIBLE */,
  KEY `index4` (`year`),
  KEY `index5` (`month`),
  CONSTRAINT `hims_f_employee_annual_leave_fk1` FOREIGN KEY (`leave_application_id`) REFERENCES `hims_f_leave_application` (`hims_f_leave_application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_documents`
--

DROP TABLE IF EXISTS `hims_f_employee_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_documents` (
  `hims_f_employee_documents_id` int NOT NULL AUTO_INCREMENT,
  `document_type` enum('C','E') DEFAULT 'E' COMMENT 'C=COMPANY\nE=EMPLOYEE',
  `document_type_name` varchar(45) DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `document_id` int DEFAULT NULL,
  `document_name` varchar(100) DEFAULT NULL,
  `dependent_id` int DEFAULT NULL,
  `download_uniq_id` varchar(45) DEFAULT NULL,
  `create_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_employee_documents_id`),
  KEY `hims_f_employee_documents_fk1_idx` (`employee_id`),
  KEY `hims_f_employee_documents_fk2_idx` (`document_id`),
  KEY `hims_f_employee_documents_fk3_idx` (`dependent_id`),
  KEY `hims_f_employee_documents_fk4_idx` (`create_by`),
  KEY `hims_f_employee_documents_fk5_idx` (`update_by`),
  KEY `hims_f_employee_documents_fk6_idx` (`hospital_id`),
  CONSTRAINT `hims_f_employee_documents_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_employee_documents_fk2` FOREIGN KEY (`document_id`) REFERENCES `hims_d_document_type` (`hims_d_document_type_id`),
  CONSTRAINT `hims_f_employee_documents_fk3` FOREIGN KEY (`dependent_id`) REFERENCES `hims_d_employee_dependents` (`hims_d_employee_dependents_id`),
  CONSTRAINT `hims_f_employee_documents_fk4` FOREIGN KEY (`create_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_documents_fk5` FOREIGN KEY (`update_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_documents_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_leave_salary_detail`
--

DROP TABLE IF EXISTS `hims_f_employee_leave_salary_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_leave_salary_detail` (
  `hims_f_employee_leave_salary_detail_id` int NOT NULL AUTO_INCREMENT,
  `employee_leave_salary_header_id` int NOT NULL,
  `leave_days` decimal(10,2) DEFAULT NULL,
  `leave_salary_amount` decimal(15,2) DEFAULT NULL,
  `airticket_amount` decimal(15,2) DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT '1' COMMENT '1 = JAN\\\\n2 =FEB\\\\n3 = MAR\\\\n4 = APR\\\\n5 = MAY\\\\n6 = JUNE\\\\n7 =JULY\\\\n8 = AUG\\\\n9 = SEPT\\\\n10 = OCT\\\\n11= NOV\\\\n12= DEC',
  `year` smallint unsigned NOT NULL,
  PRIMARY KEY (`hims_f_employee_leave_salary_detail_id`),
  UNIQUE KEY `hims_f_employee_leave_salary_detail_uq1` (`employee_leave_salary_header_id`,`month`,`year`),
  KEY `hims_f_employee_leave_salary_detail_fk1_idx` (`employee_leave_salary_header_id`),
  CONSTRAINT `hims_f_employee_leave_salary_detail_fk1` FOREIGN KEY (`employee_leave_salary_header_id`) REFERENCES `hims_f_employee_leave_salary_header` (`hims_f_employee_leave_salary_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_leave_salary_header`
--

DROP TABLE IF EXISTS `hims_f_employee_leave_salary_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_leave_salary_header` (
  `hims_f_employee_leave_salary_header_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `year` smallint DEFAULT NULL,
  `leave_days` decimal(10,2) DEFAULT NULL,
  `leave_salary_amount` decimal(15,2) DEFAULT NULL,
  `airticket_amount` decimal(15,2) DEFAULT NULL,
  `balance_leave_days` decimal(10,2) DEFAULT NULL,
  `balance_leave_salary_amount` decimal(15,2) DEFAULT NULL,
  `balance_airticket_amount` decimal(15,2) DEFAULT NULL,
  `airfare_months` smallint DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `utilized_leave_days` decimal(10,2) DEFAULT '0.00',
  `utilized_leave_salary_amount` decimal(10,2) DEFAULT '0.00',
  `utilized_airticket_amount` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`hims_f_employee_leave_salary_header_id`),
  UNIQUE KEY `employee_id_UNIQUE` (`employee_id`),
  CONSTRAINT `hims_f_employee_leave_salary_header_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_monthly_leave`
--

DROP TABLE IF EXISTS `hims_f_employee_monthly_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_monthly_leave` (
  `hims_f_employee_monthly_leave_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `leave_id` int DEFAULT NULL,
  `total_eligible` decimal(5,2) DEFAULT '0.00',
  `availed_till_date` decimal(5,2) DEFAULT '0.00',
  `close_balance` decimal(5,2) DEFAULT '0.00',
  `january` decimal(5,2) DEFAULT '0.00',
  `february` decimal(5,2) DEFAULT '0.00',
  `march` decimal(5,2) DEFAULT '0.00',
  `april` decimal(5,2) DEFAULT '0.00',
  `may` decimal(5,2) DEFAULT '0.00',
  `june` decimal(5,2) DEFAULT '0.00',
  `july` decimal(5,2) DEFAULT '0.00',
  `august` decimal(5,2) DEFAULT '0.00',
  `september` decimal(5,2) DEFAULT '0.00',
  `october` decimal(5,2) DEFAULT '0.00',
  `november` decimal(5,2) DEFAULT '0.00',
  `december` decimal(5,2) DEFAULT '0.00',
  `processed` enum('N','Y') DEFAULT 'N',
  `actual_closing_balance` decimal(5,2) DEFAULT '0.00',
  `accumulated_leaves` decimal(5,2) DEFAULT '0.00',
  `projected_applied_leaves` decimal(5,2) DEFAULT '0.00',
  `carry_forward_done` enum('N','Y') DEFAULT 'N',
  `carry_forward_leave` decimal(5,2) DEFAULT NULL,
  `encashment_leave` decimal(5,2) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_employee_monthly_leave_id`),
  UNIQUE KEY `unique_leave` (`employee_id`,`year`,`leave_id`),
  KEY `hims_f_employee_monthly_leave_fk1_idx` (`leave_id`),
  KEY `hims_f_employee_monthly_leave_fk6_idx` (`hospital_id`),
  CONSTRAINT `hims_f_employee_monthly_leave_fk1` FOREIGN KEY (`leave_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_f_employee_monthly_leave_fk3` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_employee_monthly_leave_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3088 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_payments`
--

DROP TABLE IF EXISTS `hims_f_employee_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_payments` (
  `hims_f_employee_payments_id` int NOT NULL AUTO_INCREMENT,
  `payment_application_code` varchar(45) NOT NULL,
  `employee_id` int NOT NULL,
  `employee_advance_id` int DEFAULT NULL,
  `employee_loan_id` int DEFAULT NULL,
  `employee_leave_encash_id` int DEFAULT NULL,
  `employee_end_of_service_id` int DEFAULT NULL,
  `employee_final_settlement_id` int DEFAULT NULL,
  `employee_leave_settlement_id` int DEFAULT NULL,
  `payment_type` enum('AD','LN','EN','GR','FS','LS') DEFAULT NULL COMMENT 'AD = ADVANCE\nLN =LOAN\nEN = ENCASHMENT\nGR = GRATUITY\nFS = FINAL SETTLEMENT\nLS = LEAVE SETTLEMENT',
  `payment_date` date DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `earnings_id` int DEFAULT NULL,
  `deduction_month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL COMMENT '1 = JAN\\\\n2 =FEB\\\\n3 = MAR\\\\n4 = APR\\\\n5 = MAY\\\\n6 = JUNE\\\\n7 =JULY\\\\n8 = AUG\\\\n9 = SEPT\\\\n10 = OCT\\\\n11= NOV\\\\n12= DEC',
  `year` smallint DEFAULT NULL,
  `deducted` enum('N','Y') DEFAULT 'N',
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `cancel` enum('N','Y') DEFAULT 'N',
  `cancel_by` int DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  `payment_amount` decimal(10,3) DEFAULT NULL,
  `round_off_amount` decimal(10,3) DEFAULT NULL,
  `before_round_off_amount` decimal(10,3) DEFAULT NULL,
  `leave_salary_amount` decimal(10,3) DEFAULT NULL,
  `airfare_amount` decimal(10,3) DEFAULT NULL,
  `net_salary_amount` decimal(10,3) DEFAULT NULL,
  `payment_mode` enum('CS','CH') DEFAULT 'CS' COMMENT 'CS = CASH , CH = CHEQUE',
  `cheque_number` varchar(45) DEFAULT NULL,
  `bank_id` int DEFAULT NULL,
  `head_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_employee_payments_id`),
  KEY `hims_f_employee_payments_fk1_idx` (`created_by`),
  KEY `hims_f_employee_payments_fk2_idx` (`updated_by`),
  KEY `hims_f_employee_payments_fk3_idx` (`posted_by`),
  KEY `hims_f_employee_payments_fk4_idx` (`cancel_by`),
  KEY `hims_f_employee_payments_fk5_idx` (`employee_id`),
  KEY `hims_f_employee_payments_fk6_idx` (`employee_advance_id`),
  KEY `hims_f_employee_payments_fk7_idx` (`employee_loan_id`),
  KEY `hims_f_employee_payments_fk8_idx` (`employee_leave_encash_id`),
  KEY `hims_f_employee_payments_fk9_idx` (`employee_end_of_service_id`),
  KEY `hims_f_employee_payments_fk10_idx` (`bank_id`),
  CONSTRAINT `hims_f_employee_payments_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_payments_fk10` FOREIGN KEY (`bank_id`) REFERENCES `hims_d_bank` (`hims_d_bank_id`),
  CONSTRAINT `hims_f_employee_payments_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_payments_fk3` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_payments_fk4` FOREIGN KEY (`cancel_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_payments_fk5` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_employee_payments_fk6` FOREIGN KEY (`employee_advance_id`) REFERENCES `hims_f_employee_advance` (`hims_f_employee_advance_id`),
  CONSTRAINT `hims_f_employee_payments_fk7` FOREIGN KEY (`employee_loan_id`) REFERENCES `hims_f_loan_application` (`hims_f_loan_application_id`),
  CONSTRAINT `hims_f_employee_payments_fk8` FOREIGN KEY (`employee_leave_encash_id`) REFERENCES `hims_f_leave_encash_header` (`hims_f_leave_encash_header_id`),
  CONSTRAINT `hims_f_employee_payments_fk9` FOREIGN KEY (`employee_end_of_service_id`) REFERENCES `hims_f_end_of_service` (`hims_f_end_of_service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_reciepts`
--

DROP TABLE IF EXISTS `hims_f_employee_reciepts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_reciepts` (
  `hims_f_employee_reciepts_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `reciepts_type` enum('LO','FS') DEFAULT 'LO' COMMENT 'LO = LOAN , FS  = FINAL SETTLEMENT',
  `recievable_amount` decimal(10,3) DEFAULT '0.000',
  `write_off_amount` decimal(10,3) DEFAULT '0.000',
  `loan_application_id` int DEFAULT NULL,
  `final_settlement_id` int DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `balance_amount` decimal(10,3) DEFAULT '0.000',
  `reciepts_mode` enum('CS','CH') DEFAULT 'CS' COMMENT 'CS = CASH\n CH = CHEQUE',
  `cheque_number` varchar(45) DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N' COMMENT 'Y = YES , N = NO',
  `posted_by` int DEFAULT NULL,
  `posted_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_employee_reciepts_id`),
  KEY `hims_f_employee_reciepts_fk1_idx` (`posted_by`),
  KEY `hims_f_employee_reciepts_fk2_idx` (`created_by`),
  KEY `hims_f_employee_reciepts_fk3_idx` (`updated_by`),
  KEY `hims_f_employee_reciepts_fk4_idx` (`employee_id`),
  KEY `hims_f_employee_reciepts_fk5_idx` (`loan_application_id`),
  KEY `hims_f_employee_reciepts_fk7_idx` (`hospital_id`),
  CONSTRAINT `hims_f_employee_reciepts_fk1` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_reciepts_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_reciepts_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_reciepts_fk4` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_employee_reciepts_fk5` FOREIGN KEY (`loan_application_id`) REFERENCES `hims_f_loan_application` (`hims_f_loan_application_id`),
  CONSTRAINT `hims_f_employee_reciepts_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_employee_yearly_leave`
--

DROP TABLE IF EXISTS `hims_f_employee_yearly_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_employee_yearly_leave` (
  `hims_f_employee_yearly_leave_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_employee_yearly_leave_id`),
  UNIQUE KEY `UNIQUE_YEARLY_EMPOYEE_LEAVE` (`employee_id`,`year`),
  KEY `hims_f_employee_yearly_leave_fk1_idx` (`created_by`) /*!80000 INVISIBLE */,
  KEY `hims_f_employee_yearly_leave_fk2_idx` (`updated_by`) /*!80000 INVISIBLE */,
  KEY `index5` (`year`),
  KEY `index6` (`employee_id`),
  KEY `hims_f_employee_yearly_leave_fk6_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_employee_yearly_leave_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_yearly_leave_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_employee_yearly_leave_fk3` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_employee_yearly_leave_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=403 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_encounter_review`
--

DROP TABLE IF EXISTS `hims_f_encounter_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_encounter_review` (
  `hims_f_encounter_review_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `review_header_id` int DEFAULT NULL,
  `review_details_id` int DEFAULT NULL,
  `comment` varchar(250) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\nI=inactive',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_encounter_review_id`),
  KEY `hims_f_encounter_review_fk2_idx` (`review_header_id`),
  KEY `hims_f_encounter_review_fk3_idx` (`review_details_id`),
  KEY `hims_f_encounter_review_fk4_idx` (`created_by`),
  KEY `hims_f_encounter_review_fk5_idx` (`updated_by`),
  KEY `hims_f_encounter_review_fk6_idx` (`patient_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_encounter_review_fk2` FOREIGN KEY (`review_header_id`) REFERENCES `hims_d_review_of_system_header` (`hims_d_review_of_system_header_id`),
  CONSTRAINT `hims_f_encounter_review_fk3` FOREIGN KEY (`review_details_id`) REFERENCES `hims_d_review_of_system_details` (`hims_d_review_of_system_details_id`),
  CONSTRAINT `hims_f_encounter_review_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_encounter_review_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_encounter_review_fk6` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_end_of_service`
--

DROP TABLE IF EXISTS `hims_f_end_of_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_end_of_service` (
  `hims_f_end_of_service_id` int NOT NULL AUTO_INCREMENT,
  `end_of_service_number` varchar(22) NOT NULL,
  `employee_id` int NOT NULL,
  `transaction_date` date DEFAULT NULL,
  `exit_type` enum('T','R','E') DEFAULT NULL COMMENT 'T = TERMINATE\\nR = RESIGNED\\nE  =RETIREMENT',
  `join_date` date DEFAULT NULL,
  `exit_date` date DEFAULT NULL,
  `service_years` decimal(6,4) DEFAULT NULL,
  `payable_days` decimal(6,3) DEFAULT NULL,
  `previous_gratuity_amount` decimal(10,3) DEFAULT NULL,
  `total_gratutity_amount` decimal(10,3) DEFAULT NULL,
  `calculated_gratutity_amount` decimal(10,3) DEFAULT NULL,
  `payable_amount` decimal(10,3) DEFAULT NULL,
  `settled` enum('N','Y') DEFAULT 'N',
  `gratuity_status` enum('PRO','PAI','FOR','PEN','PEF') DEFAULT NULL COMMENT 'PRO = PROCESSED\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nPAI = PAID\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nFOR = FORFIET\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nPEN=PENDING\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nPEF=PENDINGFORFIET',
  `remarks` varchar(150) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_end_of_service_id`),
  UNIQUE KEY `end_of_service_number_UNIQUE` (`end_of_service_number`),
  KEY `hims_f_end_of_service_fk1_idx` (`employee_id`),
  KEY `hims_f_end_of_service_fk2_idx` (`created_by`),
  KEY `hims_f_end_of_service_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_f_end_of_service_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_end_of_service_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_end_of_service_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_episode_chief_complaint`
--

DROP TABLE IF EXISTS `hims_f_episode_chief_complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_episode_chief_complaint` (
  `hims_f_episode_chief_complaint_id` int NOT NULL AUTO_INCREMENT,
  `episode_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `chief_complaint_id` int DEFAULT NULL,
  `icd_code_id` int DEFAULT NULL,
  `onset_date` datetime DEFAULT NULL,
  `interval` enum('W','D','M','Y','H') DEFAULT NULL COMMENT 'H=hours\nD=days\nW=weeks\nM=months\nY=years\n',
  `duration` int DEFAULT NULL,
  `severity` enum('MI','MO','SE') DEFAULT 'MI' COMMENT 'MI=MILD\nMO=MODERATE\nSE=SEVERE',
  `score` tinyint DEFAULT NULL,
  `pain` enum('NH','HLB','HLM','HEM','HWL','HW') DEFAULT 'NH' COMMENT 'NH = NO HURTS,\nHLB= HURTS LITTLE BIT,\nHLM=HURTS LITTLE MORE,\nHEM = HURTS EVEN MORE,\nHWL= HURTS WHOLE LOT,\nHW= HURTS WORST.',
  `complaint_type` enum('CHRONIC','CONGENTIAL','RTA','WORKRELATED','VACCINATION','CHECKUP','PSYCHIATRIC','INFERTILITY','PREGNANCY') DEFAULT NULL,
  `chronic` enum('Y','N') DEFAULT 'N',
  `complaint_inactive` enum('Y','N') DEFAULT 'N',
  `complaint_inactive_date` date DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `lmp_days` tinyint DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A' COMMENT 'A=active\nI=Inactive',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_episode_chief_complaint_id`),
  KEY `hims_f_episode_cheif_complaint_fk1_idx` (`created_by`),
  KEY `hims_f_episode_cheif_complaint_fk2_idx` (`updated_by`),
  KEY `hims_f_episode_cheif_complaint_fk3_idx` (`chief_complaint_id`,`patient_id`),
  KEY `hims_f_episode_chief_complaint_fk5_idx` (`patient_id`),
  KEY `hims_f_episode_chief_complaint_fk6_idx` (`icd_code_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_episode_cheif_complaint_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_episode_cheif_complaint_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_episode_chief_complaint_fk4` FOREIGN KEY (`chief_complaint_id`) REFERENCES `hims_d_hpi_header` (`hims_d_hpi_header_id`),
  CONSTRAINT `hims_f_episode_chief_complaint_fk5` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_episode_chief_complaint_fk6` FOREIGN KEY (`icd_code_id`) REFERENCES `hims_d_icd` (`hims_d_icd_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_episode_examination`
--

DROP TABLE IF EXISTS `hims_f_episode_examination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_episode_examination` (
  `hims_f_episode_examination_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `exam_header_id` int DEFAULT NULL,
  `exam_details_id` int DEFAULT NULL,
  `exam_subdetails_id` int DEFAULT NULL,
  `comments` varchar(200) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_episode_examination_id`),
  KEY `hims_f_episode_examination_fk1_idx` (`patient_id`),
  KEY `hims_f_episode_examination_fk2_idx` (`created_by`),
  KEY `hims_f_episode_examination_fk3_idx` (`updated_by`),
  KEY `hims_f_episode_examination_fk7_idx` (`exam_header_id`),
  KEY `hims_f_episode_examination_fk8_idx` (`exam_details_id`),
  KEY `hims_f_episode_examination_fk9_idx` (`exam_subdetails_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_episode_examination_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_episode_examination_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_episode_examination_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_episode_examination_fk7` FOREIGN KEY (`exam_header_id`) REFERENCES `hims_d_physical_examination_header` (`hims_d_physical_examination_header_id`),
  CONSTRAINT `hims_f_episode_examination_fk8` FOREIGN KEY (`exam_details_id`) REFERENCES `hims_d_physical_examination_details` (`hims_d_physical_examination_details_id`),
  CONSTRAINT `hims_f_episode_examination_fk9` FOREIGN KEY (`exam_subdetails_id`) REFERENCES `hims_d_physical_examination_subdetails` (`hims_d_physical_examination_subdetails_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_episode_hpi`
--

DROP TABLE IF EXISTS `hims_f_episode_hpi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_episode_hpi` (
  `hims_f_episode_hpi_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `hpi_header_id` int DEFAULT NULL,
  `hpi_detail_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\nI=Inactive',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_episode_hpi_id`),
  KEY `hims_f_episode_hpi_fk1_idx` (`created_by`),
  KEY `hims_f_episode_hpi_fk2_idx` (`updated_by`),
  KEY `hims_f_episode_hpi_fk3_idx` (`hpi_header_id`),
  KEY `hims_f_episode_hpi_fk4_idx` (`hpi_detail_id`),
  KEY `hims_f_episode_hpi_fk5_idx` (`patient_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_episode_hpi_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_episode_hpi_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_episode_hpi_fk3` FOREIGN KEY (`hpi_header_id`) REFERENCES `hims_d_hpi_header` (`hims_d_hpi_header_id`),
  CONSTRAINT `hims_f_episode_hpi_fk4` FOREIGN KEY (`hpi_detail_id`) REFERENCES `hims_d_hpi_details` (`hims_d_hpi_details_id`),
  CONSTRAINT `hims_f_episode_hpi_fk5` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_examination_diagram_header`
--

DROP TABLE IF EXISTS `hims_f_examination_diagram_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_examination_diagram_header` (
  `hims_f_examination_diagram_header_id` int NOT NULL AUTO_INCREMENT,
  `diagram_desc` varchar(45) NOT NULL,
  `diagram_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `header_datetime` datetime DEFAULT NULL,
  `hims_d_sub_department_id` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `last_update` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_examination_diagram_header_id`),
  UNIQUE KEY `unique_diagram_keys` (`diagram_id`,`patient_id`,`provider_id`,`header_datetime`,`hims_d_sub_department_id`),
  KEY `hims_f_examination_diagram_header_fk1_idx` (`provider_id`),
  KEY `hims_f_examination_diagram_header_fk2_idx` (`patient_id`),
  KEY `hims_f_examination_diagram_header_fk3_idx` (`diagram_id`),
  KEY `hims_f_examination_diagram_header_fk4_idx` (`hims_d_sub_department_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_examination_diagram_header_fk1` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_examination_diagram_header_fk2` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_examination_diagram_header_fk3` FOREIGN KEY (`diagram_id`) REFERENCES `hims_d_speciality_wise_diagrams` (`diagram_id`),
  CONSTRAINT `hims_f_examination_diagram_header_fk4` FOREIGN KEY (`hims_d_sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_examination_diagrams_detail`
--

DROP TABLE IF EXISTS `hims_f_examination_diagrams_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_examination_diagrams_detail` (
  `examination_diagrams_id` int NOT NULL AUTO_INCREMENT,
  `visit_id` int DEFAULT NULL,
  `hims_f_examination_diagram_header_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `encounter_id` int DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `create_by` int DEFAULT NULL,
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`examination_diagrams_id`),
  KEY `hims_f_examination_diagrams_fk1_idx` (`create_by`),
  KEY `hims_f_examination_diagrams_fk2_idx` (`update_by`),
  KEY `hims_f_examination_diagrams_fk4_idx` (`visit_id`),
  KEY `hims_f_examination_diagrams_fk3_idx` (`hims_f_examination_diagram_header_id`),
  CONSTRAINT `hims_f_examination_diagrams_fk1` FOREIGN KEY (`create_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_examination_diagrams_fk2` FOREIGN KEY (`update_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_examination_diagrams_fk3` FOREIGN KEY (`hims_f_examination_diagram_header_id`) REFERENCES `hims_f_examination_diagram_header` (`hims_f_examination_diagram_header_id`),
  CONSTRAINT `hims_f_examination_diagrams_fk4` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_final_settle_deductions_detail`
--

DROP TABLE IF EXISTS `hims_f_final_settle_deductions_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_final_settle_deductions_detail` (
  `hims_f_final_settle_deductions_detail_id` int NOT NULL AUTO_INCREMENT,
  `final_settlement_header_id` int NOT NULL,
  `deductions_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_final_settle_deductions_detail_id`),
  KEY `hims_f_final_settle_deductions_detail_fk1_idx` (`final_settlement_header_id`),
  KEY `hims_f_final_settle_deductions_detail_fk2_idx` (`deductions_id`),
  CONSTRAINT `hims_f_final_settle_deductions_detail_fk1` FOREIGN KEY (`final_settlement_header_id`) REFERENCES `hims_f_final_settlement_header` (`hims_f_final_settlement_header_id`),
  CONSTRAINT `hims_f_final_settle_deductions_detail_fk2` FOREIGN KEY (`deductions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_final_settle_earnings_detail`
--

DROP TABLE IF EXISTS `hims_f_final_settle_earnings_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_final_settle_earnings_detail` (
  `hims_f_final_settle_earnings_detail_id` int NOT NULL AUTO_INCREMENT,
  `final_settlement_header` int NOT NULL,
  `earnings_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_final_settle_earnings_detail_id`),
  KEY `hims_f_final_settle_earnings_detail_fk1_idx` (`final_settlement_header`),
  KEY `hims_f_final_settle_earnings_detail_fk2_idx` (`earnings_id`),
  CONSTRAINT `hims_f_final_settle_earnings_detail_fk1` FOREIGN KEY (`final_settlement_header`) REFERENCES `hims_f_final_settlement_header` (`hims_f_final_settlement_header_id`),
  CONSTRAINT `hims_f_final_settle_earnings_detail_fk2` FOREIGN KEY (`earnings_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_final_settle_loan_details`
--

DROP TABLE IF EXISTS `hims_f_final_settle_loan_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_final_settle_loan_details` (
  `hims_f_final_settle_loan_details_id` int NOT NULL AUTO_INCREMENT,
  `final_settlement_header_id` int NOT NULL,
  `loan_application_id` int DEFAULT NULL,
  `balance_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_final_settle_loan_details_id`),
  KEY `hims_f_final_settle_loan_details_fk1_idx` (`final_settlement_header_id`),
  KEY `hims_f_final_settle_loan_details_fk2_idx` (`loan_application_id`),
  CONSTRAINT `hims_f_final_settle_loan_details_fk1` FOREIGN KEY (`final_settlement_header_id`) REFERENCES `hims_f_final_settlement_header` (`hims_f_final_settlement_header_id`),
  CONSTRAINT `hims_f_final_settle_loan_details_fk2` FOREIGN KEY (`loan_application_id`) REFERENCES `hims_f_loan_application` (`hims_f_loan_application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_final_settlement_header`
--

DROP TABLE IF EXISTS `hims_f_final_settlement_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_final_settlement_header` (
  `hims_f_final_settlement_header_id` int NOT NULL AUTO_INCREMENT,
  `final_settlement_number` varchar(22) NOT NULL,
  `employee_id` int NOT NULL,
  `settled_date` date DEFAULT NULL,
  `final_settlement_status` enum('PEN','AUT','SET') DEFAULT 'PEN' COMMENT 'PEN = PENDING\nAUT = AUTHORIZE\nSET = SETTLED',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `total_earnings` decimal(10,3) DEFAULT NULL,
  `total_deductions` decimal(10,3) DEFAULT NULL,
  `total_loans` decimal(10,3) DEFAULT NULL,
  `salary_id` int DEFAULT NULL,
  `total_salary` decimal(10,3) DEFAULT NULL,
  `end_of_service_id` int DEFAULT NULL,
  `total_eos` decimal(10,3) DEFAULT NULL,
  `leave_encashment_id` int DEFAULT NULL,
  `total_leave_encash` decimal(10,3) DEFAULT NULL,
  `employee_status` enum('R','T','E') DEFAULT NULL COMMENT 'R=RESIGNED\\nT= TERMINATED\\nE= RETIRED',
  `forfiet` enum('N','Y') DEFAULT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancelled_by` int DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_final_settlement_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_glass_prescription`
--

DROP TABLE IF EXISTS `hims_f_glass_prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_glass_prescription` (
  `hims_f_glass_prescription_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `prescription_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `pgp_power_right_odsph` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_right_odcyl` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_right_odaxis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `pgp_power_right_odadd` enum('+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_right_ossph` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_right_oscyl` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_right_osaxis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `pgp_power_right_osadd` enum('+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_left_odsph` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_left_odcyl` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_left_odaxis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `pgp_power_left_odadd` enum('+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_left_ossph` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_left_oscyl` enum('-30.00','-29.75','-29.50','-29.25','-29.00','-28.75','-28.50','-28.25','-28.00','-27.75','-27.50','-27.25','-27.00','-26.75','-26.50','-26.25','-26.00','-25.75','-25.50','-25.25','-25.00','-24.75','-24.50','-24.25','-24.00','-23.75','-23.50','-23.25','-23.00','-22.75','-22.50','-22.25','-22.00','-21.75','-21.50','-21.25','-21.00','-20.75','-20.50','-20.25','-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `pgp_power_left_osaxis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `pgp_power_left_osadd` enum('+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00','+20.25','+20.50','+20.75','+21.00','+21.25','+21.50','+21.75','+22.00','+22.25','+22.50','+22.75','+23.00','+23.25','+23.50','+23.75','+24.00','+24.25','+24.50','+24.75','+25.00','+25.25','+25.50','+25.75','+26.00','+26.25','+26.50','+26.75','+27.00','+28.25','+28.50','+28.75','+29.00','+29.25','+29.50','+29.75','+30.00') DEFAULT NULL,
  `cva_specs` enum('S','D') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'S- Specs, C- Contact Lense',
  `cva_dv_right` varchar(25) DEFAULT NULL,
  `cva_dv_left` varchar(25) DEFAULT NULL,
  `cva_nv_right` varchar(25) DEFAULT NULL,
  `cva_nv_left` varchar(25) DEFAULT NULL,
  `auto_ref_right_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `auto_ref_right_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `auto_ref_right_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `auto_ref_left_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `auto_ref_left_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `auto_ref_left_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `bcva_dv_right_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_dv_right_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_dv_right_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `bcva_dv_right_vision` enum('6/6','6/6p','6/9','6/9p','6/12','6/12p','6/18','6/18p','6/24','6/24p','6/36','6/36p','6/60','6/75','6/95','6/120','20/20','20/25','20/30','20/40','20/50','20/60','20/80','20/100','20/125','20/160','20/180','20/200','20/220','20/240','20/260','20/280','20/300','20/320','20/340','20/360','20/380','20/400','CF@3m','CF@2m','CF@1m','CF@1/2m','CFCF','HM+','PL+','No PL','PR Temp','PR Nas','PR Sup','PR Inf') DEFAULT NULL,
  `bcva_nv_right_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_nv_right_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_nv_right_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `bcva_nv_right_vision` enum('N5','N6','N7','N8','N10','N12','N15','N18','N20','N24','N36','N60') DEFAULT NULL,
  `bcva_dv_left_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_dv_left_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_dv_left_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `bcva_dv_left_vision` enum('6/6','6/6p','6/9','6/9p','6/12','6/12p','6/18','6/18p','6/24','6/24p','6/36','6/36p','6/60','6/75','6/95','6/120','20/20','20/25','20/30','20/40','20/50','20/60','20/80','20/100','20/125','20/160','20/180','20/200','20/220','20/240','20/260','20/280','20/300','20/320','20/340','20/360','20/380','20/400','CF@3m','CF@2m','CF@1m','CF@1/2m','CFCF','HM+','PL+','No PL','PR Temp','PR Nas','PR Sup','PR Inf') DEFAULT NULL,
  `bcva_nv_left_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_nv_left_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `bcva_nv_left_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `bcva_nv_left_vision` enum('N5','N6','N7','N8','N10','N12','N15','N18','N20','N24','N36','N60') DEFAULT NULL,
  `k1_right` decimal(6,2) DEFAULT NULL,
  `k2_right` decimal(6,2) DEFAULT NULL,
  `axis_right` decimal(6,2) DEFAULT NULL,
  `k1_left` decimal(6,2) DEFAULT NULL,
  `k2_left` decimal(6,2) DEFAULT NULL,
  `axis_left` decimal(6,2) DEFAULT NULL,
  `bcva_dv_right_prism` varchar(25) DEFAULT NULL,
  `bcva_dv_right_bc` varchar(25) DEFAULT NULL,
  `bcva_dv_right_dia` varchar(25) DEFAULT NULL,
  `bcva_nv_right_prism` varchar(25) DEFAULT NULL,
  `bcva_nv_right_bc` varchar(25) DEFAULT NULL,
  `bcva_nv_right_dia` varchar(25) DEFAULT NULL,
  `bcva_dv_left_prism` varchar(25) DEFAULT NULL,
  `bcva_dv_left_bc` varchar(25) DEFAULT NULL,
  `bcva_dv_left_dia` varchar(25) DEFAULT NULL,
  `bcva_nv_left_prism` varchar(25) DEFAULT NULL,
  `bcva_nv_left_bc` varchar(25) DEFAULT NULL,
  `bcva_nv_left_dia` varchar(25) DEFAULT NULL,
  `pachy_right` varchar(25) DEFAULT NULL,
  `pachy_left` varchar(25) DEFAULT NULL,
  `w_wcs_right` varchar(25) DEFAULT NULL,
  `w_wcs_left` varchar(25) DEFAULT NULL,
  `ac_depth_right` varchar(25) DEFAULT NULL,
  `ac_depth_left` varchar(25) DEFAULT NULL,
  `ipd_right` varchar(25) DEFAULT NULL,
  `ipd_left` varchar(25) DEFAULT NULL,
  `color_vision_wnl_right` varchar(25) DEFAULT NULL,
  `color_vision_wnl_left` varchar(25) DEFAULT NULL,
  `confrontation_fields_full_right` varchar(25) DEFAULT NULL,
  `confrontation_fields_full_left` varchar(25) DEFAULT NULL,
  `pupils_errl_right` varchar(25) DEFAULT NULL,
  `pupils_errl_left` varchar(25) DEFAULT NULL,
  `cover_test_ortho_right` varchar(25) DEFAULT NULL,
  `cover_test_ortho_left` varchar(25) DEFAULT NULL,
  `covergence` varchar(25) DEFAULT NULL,
  `safe_fesa` varchar(25) DEFAULT NULL,
  `multi_coated` enum('Y','N') DEFAULT NULL,
  `varilux` enum('Y','N') DEFAULT NULL,
  `light` enum('Y','N') DEFAULT NULL,
  `aspheric` enum('Y','N') DEFAULT NULL,
  `bifocal` enum('Y','N') DEFAULT NULL,
  `medium` enum('Y','N') DEFAULT NULL,
  `lenticular` enum('Y','N') DEFAULT NULL,
  `single_vision` enum('Y','N') DEFAULT NULL,
  `dark` enum('Y','N') DEFAULT NULL,
  `safety_thickness` enum('Y','N') DEFAULT NULL,
  `anti_reflecting_coating` enum('Y','N') DEFAULT NULL,
  `photosensitive` enum('Y','N') DEFAULT NULL,
  `high_index` enum('Y','N') DEFAULT NULL,
  `colored` enum('Y','N') DEFAULT NULL,
  `anti_scratch` enum('Y','N') DEFAULT NULL,
  `cl_type` enum('P','D') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'P=PERMANENT,D=DISPOSABLE',
  `remarks` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`hims_f_glass_prescription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_gratuity_provision`
--

DROP TABLE IF EXISTS `hims_f_gratuity_provision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_gratuity_provision` (
  `hims_f_gratuity_provision_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT '1',
  `gratuity_amount` decimal(10,3) DEFAULT NULL,
  `acc_gratuity` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_gratuity_provision_id`),
  UNIQUE KEY `unique_employe_month_year` (`employee_id`,`year`,`month`),
  KEY `hims_f_gratuity_provision_fk1_idx` (`employee_id`),
  CONSTRAINT `hims_f_gratuity_provision_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_hrpayroll_numgen`
--

DROP TABLE IF EXISTS `hims_f_hrpayroll_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_hrpayroll_numgen` (
  `hims_f_hrpayroll_numgen_id` int NOT NULL AUTO_INCREMENT,
  `numgen_code` varchar(45) NOT NULL,
  `module_desc` varchar(250) NOT NULL,
  `prefix` varchar(45) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` varchar(45) NOT NULL,
  `postfix` varchar(200) NOT NULL COMMENT 'Number',
  `length` int NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` int NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(45) DEFAULT NULL,
  `postfix_start` varchar(200) NOT NULL,
  `postfix_end` varchar(200) NOT NULL,
  `current_num` varchar(500) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(500) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_hrpayroll_numgen_id`),
  KEY `hims_f_hrpayroll_numgen_fk1_idx` (`created_by`),
  KEY `hims_f_hrpayroll_numgen_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_f_hrpayroll_numgen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_hrpayroll_numgen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_insurance_statement`
--

DROP TABLE IF EXISTS `hims_f_insurance_statement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_insurance_statement` (
  `hims_f_insurance_statement_id` int NOT NULL AUTO_INCREMENT,
  `insurance_statement_number` varchar(45) DEFAULT NULL,
  `total_gross_amount` decimal(20,3) DEFAULT NULL,
  `total_company_responsibility` decimal(20,3) DEFAULT NULL,
  `total_company_vat` decimal(20,3) DEFAULT NULL,
  `total_company_payable` decimal(20,3) DEFAULT NULL,
  `total_remittance_amount` decimal(20,3) DEFAULT NULL,
  `total_balance_amount` decimal(20,3) DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `sub_insurance_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `insurance_status` enum('P','A','C','S') DEFAULT NULL COMMENT 'P = PENDING\\\\nA = APPROVED\\\\nC = CLOSED\\\\nS = SETTLED',
  PRIMARY KEY (`hims_f_insurance_statement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_consumption_detail`
--

DROP TABLE IF EXISTS `hims_f_inventory_consumption_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_consumption_detail` (
  `hims_f_inventory_consumption_detail_id` int NOT NULL AUTO_INCREMENT,
  `inventory_consumption_header_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'SS',
  `item_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `grn_no` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `unit_cost` decimal(10,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_consumption_detail_id`),
  KEY `hims_f_inventory_consumption_detail_fk1_idx` (`inventory_consumption_header_id`),
  KEY `hims_f_inventory_consumption_detail_fk2_idx` (`item_id`),
  KEY `hims_f_inventory_consumption_detail_fk3_idx` (`item_category_id`),
  KEY `hims_f_inventory_consumption_detail_fk4_idx` (`item_group_id`),
  KEY `hims_f_inventory_consumption_detail_fk5_idx` (`uom_id`),
  KEY `hims_f_inventory_consumption_detail_fk6_idx` (`location_id`),
  CONSTRAINT `hims_f_inventory_consumption_detail_fk1` FOREIGN KEY (`inventory_consumption_header_id`) REFERENCES `hims_f_inventory_consumption_header` (`hims_f_inventory_consumption_header_id`),
  CONSTRAINT `hims_f_inventory_consumption_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_inventory_consumption_detail_fk3` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_inventory_consumption_detail_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_inventory_consumption_detail_fk5` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_inventory_consumption_detail_fk6` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_consumption_header`
--

DROP TABLE IF EXISTS `hims_f_inventory_consumption_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_consumption_header` (
  `hims_f_inventory_consumption_header_id` int NOT NULL AUTO_INCREMENT,
  `consumption_number` varchar(20) DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'SS',
  `location_id` int DEFAULT NULL,
  `consumption_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `year` varchar(4) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT '''1''=JAN\\n''2''=FEB\\n''3''=MAR\\n''4'',=APR\\n''5'',=MAY\\n''6'',=JUN\\n''7'',=JUL\\n''8'',=AUG\\n''9'',=SEP\\n''10'',=OCT\\n''11'',=NOV\\n''12''=DEC',
  `provider_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_consumption_header_id`),
  KEY `hims_f_inventory_consumption_header_fk1_idx` (`location_id`),
  KEY `hims_f_inventory_consumption_header_fk2_idx` (`created_by`),
  KEY `hims_f_inventory_consumption_header_fk3_idx` (`updated_by`),
  KEY `hims_f_inventory_consumption_header_fk5_idx` (`hospital_id`),
  KEY `hims_f_inventory_consumption_header_fk6_idx` (`provider_id`),
  CONSTRAINT `hims_f_inventory_consumption_header_fk1` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_inventory_consumption_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_consumption_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_consumption_header_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_inventory_consumption_header_fk6` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_material_detail`
--

DROP TABLE IF EXISTS `hims_f_inventory_material_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_material_detail` (
  `hims_f_inventory_material_detail_id` int NOT NULL AUTO_INCREMENT,
  `inventory_header_id` int DEFAULT NULL,
  `completed` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `from_qtyhand` decimal(10,3) DEFAULT NULL,
  `to_qtyhand` decimal(10,3) DEFAULT NULL,
  `quantity_required` decimal(10,3) DEFAULT NULL,
  `quantity_authorized` decimal(10,3) DEFAULT NULL,
  `item_uom` int DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `po_created_date` datetime DEFAULT NULL,
  `po_created` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `po_created_quantity` decimal(10,3) DEFAULT NULL,
  `po_outstanding_quantity` decimal(10,3) DEFAULT NULL,
  `po_completed` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  PRIMARY KEY (`hims_f_inventory_material_detail_id`),
  KEY `hims_f_inventory_material_detail_fk1_idx` (`inventory_header_id`),
  KEY `hims_f_inventory_material_detail_fk2_idx` (`item_id`),
  KEY `hims_f_inventory_material_detail_fk3_idx` (`item_category_id`),
  KEY `hims_f_inventory_material_detail_fk4_idx` (`item_group_id`),
  CONSTRAINT `hims_f_inventory_material_detail_fk1` FOREIGN KEY (`inventory_header_id`) REFERENCES `hims_f_inventory_material_header` (`hims_f_inventory_material_header_id`),
  CONSTRAINT `hims_f_inventory_material_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_inventory_material_detail_fk3` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_inventory_material_detail_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_material_header`
--

DROP TABLE IF EXISTS `hims_f_inventory_material_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_material_header` (
  `hims_f_inventory_material_header_id` int NOT NULL AUTO_INCREMENT,
  `material_requisition_number` varchar(20) DEFAULT NULL,
  `from_location_type` enum('WH','MS','SS') DEFAULT 'SS',
  `from_location_id` int DEFAULT NULL,
  `requistion_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiration_date` date DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `requested_by` int DEFAULT NULL,
  `on_hold` enum('N','Y') DEFAULT 'N',
  `to_location_type` enum('WH','MS','SS') DEFAULT 'WH',
  `to_location_id` int DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `is_completed` enum('N','Y') DEFAULT 'N',
  `completed_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `completed_lines` smallint DEFAULT NULL,
  `requested_lines` smallint DEFAULT NULL,
  `purchase_created_lines` smallint DEFAULT NULL,
  `status` enum('PEN','APR') DEFAULT 'PEN' COMMENT 'PEN = PENDING APPROVAL\nAPR = APPROVED',
  `requistion_type` enum('MR','PR') DEFAULT 'MR' COMMENT 'MR = MATERIAL REQUISITION\nPR = PURCHASE REQUISTION',
  `no_of_transfers` smallint DEFAULT NULL,
  `no_of_po` smallint DEFAULT NULL,
  `authorize1` enum('N','Y') DEFAULT NULL,
  `authorize1_date` datetime DEFAULT NULL,
  `authorize1_by` int DEFAULT NULL,
  `authorie2` enum('N','Y') DEFAULT NULL,
  `authorize2_date` datetime DEFAULT NULL,
  `authorize2_by` int DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT NULL,
  `cancelled_by` int DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_material_header_id`),
  UNIQUE KEY `material_requisition_number_UNIQUE` (`material_requisition_number`),
  KEY `hims_f_inventory_material_header_fk1_idx` (`requested_by`),
  KEY `hims_f_inventory_material_header_fk2_idx` (`authorize1_by`),
  KEY `hims_f_inventory_material_header_fk3_idx` (`authorize2_by`),
  KEY `hims_f_inventory_material_header_fk4_idx` (`cancelled_by`),
  KEY `hims_f_inventory_material_header_fk5_idx` (`from_location_id`),
  KEY `hims_f_inventory_material_header_fk6_idx` (`to_location_id`),
  CONSTRAINT `hims_f_inventory_material_header_fk1` FOREIGN KEY (`requested_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_material_header_fk2` FOREIGN KEY (`authorize1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_material_header_fk3` FOREIGN KEY (`authorize2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_material_header_fk4` FOREIGN KEY (`cancelled_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_material_header_fk5` FOREIGN KEY (`from_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_inventory_material_header_fk6` FOREIGN KEY (`to_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_numgen`
--

DROP TABLE IF EXISTS `hims_f_inventory_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_numgen` (
  `hims_f_inventory_numgen_id` int NOT NULL AUTO_INCREMENT,
  `numgen_code` varchar(45) NOT NULL,
  `module_desc` varchar(250) NOT NULL,
  `prefix` varchar(45) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` varchar(45) NOT NULL,
  `postfix` varchar(200) NOT NULL COMMENT 'Number',
  `length` int NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` int NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(45) DEFAULT NULL,
  `postfix_start` varchar(200) NOT NULL,
  `postfix_end` varchar(200) NOT NULL,
  `current_num` varchar(500) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(500) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_inventory_numgen_id`),
  UNIQUE KEY `numgen_code_UNIQUE` (`numgen_code`),
  KEY `hims_f_inventory_numgen_fk1_idx` (`created_by`),
  KEY `hims_f_inventory_numgen_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_f_inventory_numgen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_numgen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_stock_adjust_detail`
--

DROP TABLE IF EXISTS `hims_f_inventory_stock_adjust_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_stock_adjust_detail` (
  `hims_f_inventory_stock_adjust_detail_id` int NOT NULL AUTO_INCREMENT,
  `inventory_stock_adjust_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `adjustment_type` enum('IQ','DQ','IA','DA','BI','BD') DEFAULT NULL COMMENT 'IQ - Increase Quantity, \\nDQ - Decrease Quantity, \\nIA - Increase Amount, \\nDA - Decrease Amount, \\nBI - Both Increase, \\nBD - Both Decrease, \\n',
  `sales_uom` int DEFAULT NULL,
  `expirydate` date DEFAULT NULL,
  `quantity` decimal(10,4) DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_stock_adjust_detail_id`),
  KEY `hims_f_inventory_stock_adjust_detail_fk1_idx` (`inventory_stock_adjust_header_id`),
  KEY `hims_f_inventory_stock_adjust_detail_fk2_idx` (`item_id`),
  KEY `hims_f_inventory_stock_adjust_detail_fk3_idx` (`item_category_id`),
  KEY `hims_f_inventory_stock_adjust_detail_fk4_idx` (`item_group_id`),
  KEY `hims_f_inventory_stock_adjust_detail_fk5_idx` (`uom_id`),
  KEY `hims_f_inventory_stock_adjust_detail_fk6_idx` (`created_by`),
  KEY `hims_f_inventory_stock_adjust_detail_fk7_idx` (`updated_by`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk1` FOREIGN KEY (`inventory_stock_adjust_header_id`) REFERENCES `hims_f_inventory_stock_adjust_header` (`hims_f_inventory_stock_adjust_header_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk3` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk5` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk6` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_detail_fk7` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_stock_adjust_header`
--

DROP TABLE IF EXISTS `hims_f_inventory_stock_adjust_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_stock_adjust_header` (
  `hims_f_inventory_stock_adjust_header_id` int NOT NULL AUTO_INCREMENT,
  `adjustment_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `adjustment_date` date DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1' COMMENT '1= april\\\\n12=march\\\\n\\\\nfinancial year',
  `location_id` int DEFAULT NULL,
  `location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE \\\\\\\\\\\\\\\\nSS = SUB STORE \\\\\\\\\\\\\\\\nWH = Warehouse\\\\\\\\\\\\\\\\n',
  `comments` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `posted` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_stock_adjust_header_id`),
  KEY `hims_f_inventory_stock_adjust_header_fk1_idx` (`location_id`),
  KEY `hims_f_inventory_stock_adjust_header_fk2_idx` (`created_by`),
  KEY `hims_f_inventory_stock_adjust_header_fk3_idx` (`updated_by`),
  KEY `hims_f_inventory_stock_adjust_header_fk4_idx` (`hospital_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_header_fk1` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_stock_adjust_header_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_stock_detail`
--

DROP TABLE IF EXISTS `hims_f_inventory_stock_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_stock_detail` (
  `hims_f_inventory_stock_detail_id` int NOT NULL AUTO_INCREMENT,
  `inventory_stock_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `location_type` enum('WH','MS','SS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'MS' COMMENT 'MS =MAIN STORE\\nSS = SUB STORE',
  `location_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `grn_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantity` decimal(10,4) DEFAULT NULL,
  `conversion_fact` decimal(10,6) DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `comment` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_f_inventory_stock_detail_id`),
  KEY `hims_f_inventory_stock_detail_fk1_idx` (`created_by`),
  KEY `hims_f_inventory_stock_detail_fk2_idx` (`updated_by`),
  KEY `hims_f_inventory_stock_detail_fk3_idx` (`inventory_stock_header_id`),
  KEY `hims_f_inventory_stock_detail_fk4_idx` (`location_id`),
  KEY `hims_f_inventory_stock_detail_fk7_idx` (`uom_id`),
  KEY `hims_f_inventory_stock_detail_fk8_idx` (`sales_uom`),
  KEY `hims_f_inventory_stock_detail_fk5_idx` (`item_category_id`),
  KEY `hims_f_inventory_stock_detail_fk6_idx` (`item_group_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk3` FOREIGN KEY (`inventory_stock_header_id`) REFERENCES `hims_f_inventory_stock_header` (`hims_f_inventory_stock_header_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk4` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk5` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk6` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk7` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_inventory_stock_detail_fk8` FOREIGN KEY (`sales_uom`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_stock_header`
--

DROP TABLE IF EXISTS `hims_f_inventory_stock_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_stock_header` (
  `hims_f_inventory_stock_header_id` int NOT NULL AUTO_INCREMENT,
  `document_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `docdate` date DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1' COMMENT '1= april\n12=march\n\nfinancial year',
  `description` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `posted` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_stock_header_id`),
  KEY `hims_f_inventory_stock_header_fk1_idx` (`created_by`),
  KEY `hims_f_inventory_stock_header_fk2_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_inventory_stock_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_inventory_stock_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_trans_history`
--

DROP TABLE IF EXISTS `hims_f_inventory_trans_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_trans_history` (
  `hims_f_inventory_trans_history_id` int NOT NULL AUTO_INCREMENT,
  `transaction_type` enum('MR','MRA1','MRA2','MRA3','PO','POA1','POA2','POA3','DN','DNA','REC','INV','PR','CN','DBN','AD','ST','CS','POS','SRT','INT','OP','ACK','SDN') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MR'',=MATERIAL REQUISITION\\\\n''MRA1'',= MATERIAL REQUISITION AUTHORIZATION1\\\\n''MRA2'',= MATERIAL REQUISITION AUTHORIZATION2\\\\n''MRA3'',= MATERIAL REQUISITION AUTHORIZATION3\\\\n''PO'',=PURCHASE ORDER\\\\n''POA1'',= PURCHASE ORDER AUTHORIZATION1\\\\n''POA2'',= PURCHASE ORDER AUTHORIZATION2\\\\n''POA3'',= PURCHASE ORDER AUTHORIZATION3\\\\n''DN'',= DELIVERY NOTE \\\\n''DNA'',=DELIVERY NOTE AUTHORIZATION\\\\n''REC'',=RECIEPTS\\\\n''INV'',= INOVICES\\\\n''PR'',= PURCHASE RETURN\\\\n''CN'',= CREDIT NOTE\\\\n''DBN'',=DEBIT NOTE\\\\n''AD'',= ADJUSTMENT\\\\n''ST'',=STOCK TRANSFER\\\\n''CS'',=CONSUMPTION\\\\n''POS''=POINT OF SALE\\\\n''SRT'',=SALES RETURN\\\\n''INT'',= INITIAL STOCK\\\\n''OP'' = OPBILL\\\\n’ACK’,= TRANSFER ACKNOWLEDGE'' \\\\n ’SDN’ = SALES DISPATCH NOTE',
  `transaction_id` int DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `from_location_id` int DEFAULT NULL,
  `from_location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE \\nSS = SUB STORE \\nWH = Warehouse\\n',
  `year` int DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `to_location_id` int DEFAULT NULL,
  `to_location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE \\\\nSS = SUB STORE \\\\nWH = Warehouse\\\\n',
  `description` varchar(60) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_code_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `required_batchno` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `transaction_qty` decimal(10,4) DEFAULT NULL,
  `transaction_uom` int DEFAULT NULL,
  `transaction_cost` decimal(20,6) DEFAULT NULL,
  `transaction_total` decimal(20,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(20,3) DEFAULT NULL,
  `landing_cost` decimal(10,3) DEFAULT NULL,
  `average_cost` decimal(20,6) DEFAULT NULL,
  `operation` enum('+','-') DEFAULT NULL,
  `item_delete` enum('N','Y','M') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'N = NO\nY =YES DELETED\nM = MODIFIED',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_trans_history_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_transfer_batches`
--

DROP TABLE IF EXISTS `hims_f_inventory_transfer_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_transfer_batches` (
  `hims_f_inventory_transfer_batches_id` int NOT NULL AUTO_INCREMENT,
  `transfer_detail_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `batchno` varchar(30) DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `grnno` varchar(20) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity_requested` decimal(10,3) DEFAULT NULL,
  `quantity_authorized` decimal(10,3) DEFAULT NULL,
  `uom_requested_id` int DEFAULT NULL,
  `quantity_transfer` decimal(10,3) DEFAULT NULL,
  `uom_transferred_id` int DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `uom_recieved_id` int DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `ack_quantity` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`hims_f_inventory_transfer_batches_id`),
  KEY `hims_f_inventory_transfer_batches_fk1_idx` (`transfer_detail_id`),
  KEY `hims_f_inventory_transfer_batches_fk2_idx` (`item_id`),
  KEY `hims_f_inventory_transfer_batches_fk3_idx` (`item_category_id`),
  KEY `hims_f_inventory_transfer_batches_fk4_idx` (`item_group_id`),
  KEY `hims_f_inventory_transfer_batches_fk5_idx` (`uom_requested_id`),
  KEY `hims_f_inventory_transfer_batches_fk6_idx` (`uom_recieved_id`),
  CONSTRAINT `hims_f_inventory_transfer_batches_fk1` FOREIGN KEY (`transfer_detail_id`) REFERENCES `hims_f_inventory_transfer_detail` (`hims_f_inventory_transfer_detail_id`),
  CONSTRAINT `hims_f_inventory_transfer_batches_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_inventory_transfer_batches_fk3` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_inventory_transfer_batches_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_inventory_transfer_batches_fk5` FOREIGN KEY (`uom_requested_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_inventory_transfer_batches_fk6` FOREIGN KEY (`uom_recieved_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=413 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_transfer_detail`
--

DROP TABLE IF EXISTS `hims_f_inventory_transfer_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_transfer_detail` (
  `hims_f_inventory_transfer_detail_id` int NOT NULL AUTO_INCREMENT,
  `transfer_header_id` int DEFAULT NULL,
  `from_qtyhand` decimal(10,3) DEFAULT NULL,
  `to_qtyhand` decimal(10,3) DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT 'N',
  `completed_date` datetime DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `batchno` varchar(30) DEFAULT NULL,
  `grnno` varchar(20) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity_requested` decimal(10,3) DEFAULT NULL,
  `quantity_authorized` decimal(10,3) DEFAULT NULL,
  `uom_requested_id` int DEFAULT NULL,
  `quantity_transferred` decimal(10,3) DEFAULT NULL,
  `uom_transferred_id` int DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `uom_recieved_id` int DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `unit_cost` decimal(20,3) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `material_requisition_header_id` int DEFAULT NULL,
  `material_requisition_detail_id` int DEFAULT NULL,
  `transfer_to_date` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_transfer_detail_id`),
  KEY `hims_f_inventory_transfer_detail_fk1_idx` (`transfer_header_id`),
  KEY `hims_f_inventory_transfer_detail_fk2_idx` (`material_requisition_header_id`),
  KEY `hims_f_inventory_transfer_detail_fk3_idx` (`material_requisition_detail_id`),
  CONSTRAINT `hims_f_inventory_transfer_detail_fk1` FOREIGN KEY (`transfer_header_id`) REFERENCES `hims_f_inventory_transfer_header` (`hims_f_inventory_transfer_header_id`),
  CONSTRAINT `hims_f_inventory_transfer_detail_fk2` FOREIGN KEY (`material_requisition_header_id`) REFERENCES `hims_f_inventory_material_header` (`hims_f_inventory_material_header_id`),
  CONSTRAINT `hims_f_inventory_transfer_detail_fk3` FOREIGN KEY (`material_requisition_detail_id`) REFERENCES `hims_f_inventory_material_detail` (`hims_f_inventory_material_detail_id`),
  CONSTRAINT `hims_f_inventory_transfer_detail_fk4` FOREIGN KEY (`material_requisition_header_id`) REFERENCES `hims_f_inventory_material_header` (`hims_f_inventory_material_header_id`),
  CONSTRAINT `hims_f_inventory_transfer_detail_fk5` FOREIGN KEY (`material_requisition_detail_id`) REFERENCES `hims_f_inventory_material_detail` (`hims_f_inventory_material_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=403 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_inventory_transfer_header`
--

DROP TABLE IF EXISTS `hims_f_inventory_transfer_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_inventory_transfer_header` (
  `hims_f_inventory_transfer_header_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_inventory_material_header_id` int DEFAULT NULL,
  `transfer_number` varchar(45) DEFAULT NULL,
  `from_location_type` enum('WH','MS','SS') DEFAULT 'SS',
  `from_location_id` int DEFAULT NULL,
  `transfer_date` datetime DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `material_requisition_number` varchar(20) DEFAULT NULL,
  `to_location_type` enum('WH','MS','SS') DEFAULT 'MS',
  `to_location_id` int DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT 'N',
  `completed_date` datetime DEFAULT NULL,
  `completed_lines` smallint DEFAULT NULL,
  `transfer_quantity` decimal(10,3) DEFAULT NULL,
  `requested_quantity` decimal(10,3) DEFAULT NULL,
  `recieved_quantity` decimal(10,3) DEFAULT NULL,
  `outstanding_quantity` decimal(10,3) DEFAULT NULL,
  `direct_transfer` enum('N','Y') DEFAULT 'N',
  `ack_done` enum('N','Y') DEFAULT 'N',
  `ack_date` datetime DEFAULT NULL,
  `ack_by` int DEFAULT NULL,
  `return_type` enum('N','Y') DEFAULT 'N',
  `cancelled` enum('N','Y') DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `cancelled_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_inventory_transfer_header_id`),
  KEY `hims_f_inventory_transfer_header_fk1_idx` (`material_requisition_number`),
  KEY `hims_f_inventory_transfer_header_fk2_idx` (`hims_f_inventory_material_header_id`),
  KEY `hims_f_inventory_transfer_header_fk3_idx` (`ack_by`),
  CONSTRAINT `hims_f_inventory_transfer_header_fk1` FOREIGN KEY (`material_requisition_number`) REFERENCES `hims_f_inventory_material_header` (`material_requisition_number`),
  CONSTRAINT `hims_f_inventory_transfer_header_fk2` FOREIGN KEY (`hims_f_inventory_material_header_id`) REFERENCES `hims_f_inventory_material_header` (`hims_f_inventory_material_header_id`),
  CONSTRAINT `hims_f_inventory_transfer_header_fk3` FOREIGN KEY (`ack_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_invoice_details`
--

DROP TABLE IF EXISTS `hims_f_invoice_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_invoice_details` (
  `hims_f_invoice_details_id` int NOT NULL AUTO_INCREMENT,
  `invoice_header_id` int NOT NULL,
  `trans_from` enum('OP','POS') DEFAULT NULL COMMENT 'OP-OP Billing \\n POS- Point of Sale',
  `bill_header_id` int DEFAULT NULL,
  `bill_detail_id` int DEFAULT NULL,
  `pos_header_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `cpt_code` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,3) DEFAULT '0.000',
  `gross_amount` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `patient_resp` decimal(10,3) DEFAULT '0.000',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `company_resp` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `company_payable` decimal(10,3) DEFAULT '0.000',
  `sec_company_resp` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_payable` decimal(10,3) DEFAULT '0.000',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_f_invoice_details_id`),
  KEY `hims_f_invoice_details_fk1_idx` (`invoice_header_id`),
  KEY `hims_f_invoice_details_fk2_idx` (`bill_header_id`),
  KEY `hims_f_invoice_details_fk3_idx` (`bill_detail_id`),
  KEY `hims_f_invoice_details_fk4_idx` (`service_id`),
  KEY `hims_f_invoice_details_fk6_idx` (`created_by`),
  KEY `hims_f_invoice_details_fk8_idx` (`updated_by`),
  KEY `hims_f_invoice_details_fk9_idx` (`pos_header_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_invoice_details_fk1` FOREIGN KEY (`invoice_header_id`) REFERENCES `hims_f_invoice_header` (`hims_f_invoice_header_id`),
  CONSTRAINT `hims_f_invoice_details_fk2` FOREIGN KEY (`bill_header_id`) REFERENCES `hims_f_billing_header` (`hims_f_billing_header_id`),
  CONSTRAINT `hims_f_invoice_details_fk3` FOREIGN KEY (`bill_detail_id`) REFERENCES `hims_f_billing_details` (`hims_f_billing_details_id`),
  CONSTRAINT `hims_f_invoice_details_fk4` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_invoice_details_fk6` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_invoice_details_fk8` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_invoice_details_fk9` FOREIGN KEY (`pos_header_id`) REFERENCES `hims_f_pharmacy_pos_header` (`hims_f_pharmacy_pos_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_invoice_header`
--

DROP TABLE IF EXISTS `hims_f_invoice_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_invoice_header` (
  `hims_f_invoice_header_id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(45) NOT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `invoice_type` enum('P','S') DEFAULT 'P' COMMENT 'P-Primary Insurance, S- Secondary Insurance',
  `patient_id` int NOT NULL,
  `visit_id` int NOT NULL,
  `policy_number` varchar(100) DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `sub_insurance_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `network_office_id` int DEFAULT NULL,
  `card_number` varchar(20) DEFAULT NULL,
  `gross_amount` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `patient_resp` decimal(10,3) DEFAULT '0.000',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `company_resp` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `company_payable` decimal(10,3) DEFAULT '0.000',
  `sec_company_resp` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_payable` decimal(10,3) DEFAULT '0.000',
  `submission_date` date DEFAULT NULL,
  `submission_ammount` decimal(10,3) DEFAULT '0.000',
  `remittance_date` date DEFAULT NULL,
  `remittance_ammount` decimal(10,3) DEFAULT '0.000',
  `denial_ammount` decimal(10,3) DEFAULT '0.000',
  `claim_validated` enum('V','E','X','P') DEFAULT 'P' COMMENT 'V = VALIDATED , E = ERROR , X = XML GENERATED , P = PENDING',
  `card_holder_name` varchar(150) DEFAULT NULL,
  `card_holder_age` tinyint DEFAULT NULL,
  `card_holder_gender` enum('MALE','FEMALE') DEFAULT NULL,
  `card_class` int DEFAULT NULL,
  `insurance_statement_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_invoice_header_id`),
  KEY `hims_f_invoice_header_fk1_idx` (`patient_id`),
  KEY `hims_f_invoice_header_fk2_idx` (`visit_id`),
  KEY `hims_f_invoice_header_fk3_idx` (`card_class`),
  CONSTRAINT `hims_f_invoice_header_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_invoice_header_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_invoice_header_fk3` FOREIGN KEY (`card_class`) REFERENCES `hims_d_insurance_card_class` (`hims_d_insurance_card_class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_invoice_icd`
--

DROP TABLE IF EXISTS `hims_f_invoice_icd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_invoice_icd` (
  `hims_f_invoice_icd_id` int NOT NULL AUTO_INCREMENT,
  `invoice_header_id` int NOT NULL,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `daignosis_id` int NOT NULL,
  `diagnosis_type` enum('P','S') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'P= PRIMARY\\nS = SECONDARY',
  `final_daignosis` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'N' COMMENT 'N = NO\\nY = YES\\n',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=active\\nI=Inactive',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_invoice_icd_id`),
  KEY `hims_f_invoice_icd_fk1_idx` (`created_by`),
  KEY `hims_f_invoice_icd_fk2_idx` (`updated_by`),
  KEY `hims_f_invoice_icd_fk3_idx` (`invoice_header_id`),
  KEY `hims_f_invoice_icd_fk4_idx` (`daignosis_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_invoice_icd_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_invoice_icd_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_invoice_icd_fk3` FOREIGN KEY (`invoice_header_id`) REFERENCES `hims_f_invoice_header` (`hims_f_invoice_header_id`),
  CONSTRAINT `hims_f_invoice_icd_fk4` FOREIGN KEY (`daignosis_id`) REFERENCES `hims_d_icd` (`hims_d_icd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_lab_order`
--

DROP TABLE IF EXISTS `hims_f_lab_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_lab_order` (
  `hims_f_lab_order_id` int NOT NULL AUTO_INCREMENT,
  `ordered_services_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `status` enum('O','CL','CN','CF','V') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'O' COMMENT 'O=Test Ordered\n CL=Sample Collected\n CN=Test Cancelled\n CF=Result Confirmed \n V= Result Validated',
  `billed` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=YES\n N=NO',
  `cancelled` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=YES\n N=NO',
  `ordered_date` datetime DEFAULT NULL,
  `test_type` enum('S','R') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'R' COMMENT 'S=Stat\nR=Routine',
  `lab_id_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `run_type` enum('N','1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'N = NONE\n1 = RUN 1 \n2 = RUN 2\n3 = RUN 3',
  `entered_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `entered_by` int DEFAULT NULL,
  `confirmed_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `confirmed_by` int DEFAULT NULL,
  `validated_date` datetime DEFAULT NULL,
  `validated_by` int DEFAULT NULL,
  `comments` varchar(3000) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=Active\nI=Inactive',
  `tat` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'TURN ARROUND TIME',
  `hospital_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `organism_type` enum('F','NF') DEFAULT NULL,
  `bacteria_name` varchar(45) DEFAULT NULL,
  `bacteria_type` enum('G','NG') DEFAULT 'NG' COMMENT 'G- Growth, NG- No Growth',
  `critical_status` enum('Y','N') DEFAULT 'N',
  PRIMARY KEY (`hims_f_lab_order_id`),
  UNIQUE KEY `ordered_services_id_UNIQUE` (`ordered_services_id`),
  KEY `hims_f_lab_order_fk1_idx` (`patient_id`),
  KEY `hims_f_lab_order_fk2_idx` (`visit_id`),
  KEY `hims_f_lab_order_fk3_idx` (`provider_id`),
  KEY `hims_f_lab_order_fk4_idx` (`service_id`),
  KEY `hims_f_lab_order_fk5_idx` (`created_by`),
  KEY `hims_f_lab_order_fk6_idx` (`updated_by`),
  KEY `hims_f_lab_order_fk7_idx` (`ordered_services_id`),
  KEY `hims_f_lab_order_fk8_idx` (`confirmed_by`),
  KEY `hims_f_lab_order_fk9_idx` (`entered_by`),
  KEY `hims_f_lab_order_fk10_idx` (`validated_by`),
  KEY `hims_f_lab_order_fk15_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_lab_order_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_lab_order_fk10` FOREIGN KEY (`validated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_order_fk15` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_lab_order_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_lab_order_fk3` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_lab_order_fk4` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_lab_order_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_order_fk6` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_order_fk7` FOREIGN KEY (`ordered_services_id`) REFERENCES `hims_f_ordered_services` (`hims_f_ordered_services_id`),
  CONSTRAINT `hims_f_lab_order_fk8` FOREIGN KEY (`confirmed_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_order_fk9` FOREIGN KEY (`entered_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_lab_sample`
--

DROP TABLE IF EXISTS `hims_f_lab_sample`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_lab_sample` (
  `hims_d_lab_sample_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `sample_id` int DEFAULT NULL,
  `status` enum('N','A','R') DEFAULT 'N' COMMENT 'N=Not Done \n A=Accepted\n  R=Rejected',
  `collected` enum('Y','N') DEFAULT 'N',
  `collected_by` int DEFAULT NULL,
  `collected_date` datetime DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_lab_sample_id`),
  UNIQUE KEY `unique_sample_order` (`order_id`,`sample_id`),
  KEY `hims_d_lab_sample_fk1_idx` (`order_id`),
  KEY `hims_d_lab_sample_fk2_idx` (`created_by`),
  KEY `hims_d_lab_sample_fk2_idx1` (`updated_by`),
  KEY `hims_f_lab_sample_fk2_idx` (`collected_by`),
  KEY `hims_f_lab_sample_fk5_idx` (`sample_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_lab_sample_fk1` FOREIGN KEY (`order_id`) REFERENCES `hims_f_lab_order` (`hims_f_lab_order_id`),
  CONSTRAINT `hims_f_lab_sample_fk2` FOREIGN KEY (`collected_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_sample_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_sample_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_lab_sample_fk5` FOREIGN KEY (`sample_id`) REFERENCES `hims_d_lab_specimen` (`hims_d_lab_specimen_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_application`
--

DROP TABLE IF EXISTS `hims_f_leave_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_application` (
  `hims_f_leave_application_id` int NOT NULL AUTO_INCREMENT,
  `leave_application_code` varchar(45) NOT NULL,
  `employee_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `application_date` datetime DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `leave_id` int NOT NULL,
  `leave_type` enum('P','U') DEFAULT 'P' COMMENT 'P=PAID LEAVE,U=UN PAID LEAVE',
  `from_leave_session` enum('FD','FH','SH') NOT NULL DEFAULT 'FD' COMMENT 'FD = FULL DAY , FH = FIRST HALF , SH = SECOND HALF',
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `to_leave_session` enum('FD','FH','SH') NOT NULL DEFAULT 'FD' COMMENT 'FD = FULL DAY , FH = FIRST HALF , SH = SECOND HALF',
  `total_applied_days` decimal(5,2) DEFAULT '0.00',
  `total_approved_days` decimal(5,2) DEFAULT '0.00',
  `leave_from` enum('SS','AB') DEFAULT 'SS' COMMENT 'SS=from self service,AB=from absent',
  `absent_id` int DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_date` date DEFAULT NULL,
  `authorized1` enum('N','Y') DEFAULT 'N',
  `authorized1_date` date DEFAULT NULL,
  `authorized1_by` int DEFAULT NULL,
  `authorized1_comment` varchar(100) DEFAULT NULL,
  `authorized2` enum('N','Y') DEFAULT 'N',
  `authorized2_date` date DEFAULT NULL,
  `authorized2_by` int DEFAULT NULL,
  `authorized2_comment` varchar(100) DEFAULT NULL,
  `authorized3` enum('N','Y') DEFAULT 'N',
  `authorized3_by` int DEFAULT NULL,
  `authorized3_date` date DEFAULT NULL,
  `authorized3_comment` varchar(100) DEFAULT NULL,
  `processed` enum('N','Y') DEFAULT 'N',
  `cancelled_by` int DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `cancelled_remarks` varchar(100) DEFAULT NULL,
  `status` enum('PEN','APR','REJ','CAN') DEFAULT 'PEN' COMMENT 'PEN=PENDING,APR=APPROVED,REJ=REJECTED,CAN = CANCELLED',
  `replace_employee_id` int DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `document_attached` varchar(100) DEFAULT NULL,
  `exit_permit_required` enum('N','Y') DEFAULT 'N',
  `exit_permit_done` enum('N','Y') DEFAULT NULL,
  `exit_permit_date` date DEFAULT NULL,
  `exit_permit_comments` varchar(100) DEFAULT NULL,
  `return_authorized1` enum('N','Y') DEFAULT NULL,
  `return_authorized1_by` int DEFAULT NULL,
  `return_authorized1_date` date DEFAULT NULL,
  `return_authorized2` enum('N','Y') DEFAULT NULL,
  `return_authorized2_by` int DEFAULT NULL,
  `return_authorized2_date` date DEFAULT NULL,
  `leave` enum('PL','UP') DEFAULT 'PL' COMMENT 'PL=PLANNED LEAVE,UP=UNPLANNED LEAVE',
  `weekoff_included` enum('N','Y') DEFAULT 'N',
  `holiday_included` enum('N','Y') DEFAULT 'N',
  `weekoff_days` decimal(5,2) DEFAULT NULL,
  `holidays` decimal(5,2) DEFAULT NULL,
  `is_projected_leave` enum('N','Y') DEFAULT 'N',
  `is_across_year_leave` enum('N','Y') DEFAULT 'N',
  `from_year_applied_days` decimal(5,2) unsigned DEFAULT NULL,
  `to_year_applied_days` decimal(5,2) unsigned DEFAULT NULL,
  `actual_to_date` date DEFAULT NULL,
  `early_rejoin` enum('N','Y') DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_f_leave_application_id`),
  KEY `hims_f_leave_applicaiton_fk1_idx` (`approved_by`),
  KEY `hims_f_leave_applicaiton_fk2_idx` (`authorized1_by`),
  KEY `hims_f_leave_applicaiton_fk3_idx` (`authorized2_by`),
  KEY `hims_f_leave_applicaiton_fk4_idx` (`authorized3_by`),
  KEY `hims_f_leave_applicaiton_fk5_idx` (`cancelled_by`),
  KEY `hims_f_leave_applicaiton_fk6_idx` (`return_authorized1_by`),
  KEY `hims_f_leave_applicaiton_fk7_idx` (`return_authorized2_by`),
  KEY `hims_f_leave_applicaiton_fk8_idx` (`employee_id`),
  KEY `hims_f_leave_applicaiton_fk9_idx` (`replace_employee_id`),
  KEY `hims_f_leave_applicaiton_fk10_idx` (`leave_id`),
  KEY `index12` (`from_date`) /*!80000 INVISIBLE */,
  KEY `index13` (`to_date`),
  KEY `index14` (`record_status`),
  KEY `index15` (`status`),
  KEY `hims_f_leave_application_fk10_idx` (`absent_id`),
  KEY `hims_f_leave_application_fk11_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_leave_applicaiton_fk1` FOREIGN KEY (`approved_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk10` FOREIGN KEY (`leave_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk2` FOREIGN KEY (`authorized1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk3` FOREIGN KEY (`authorized2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk4` FOREIGN KEY (`authorized3_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk5` FOREIGN KEY (`cancelled_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk6` FOREIGN KEY (`return_authorized1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk7` FOREIGN KEY (`return_authorized2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk8` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_leave_applicaiton_fk9` FOREIGN KEY (`replace_employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_leave_application_fk10` FOREIGN KEY (`absent_id`) REFERENCES `hims_f_absent` (`hims_f_absent_id`),
  CONSTRAINT `hims_f_leave_application_fk11` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_encash_detail`
--

DROP TABLE IF EXISTS `hims_f_leave_encash_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_encash_detail` (
  `hims_f_leave_encash_detail_id` int NOT NULL AUTO_INCREMENT,
  `leave_encash_header_id` int NOT NULL,
  `leave_id` int NOT NULL,
  `close_balance` decimal(5,2) DEFAULT '0.00',
  `leave_days` decimal(5,2) unsigned DEFAULT NULL,
  `leave_amount` decimal(10,3) DEFAULT NULL,
  `airfare_amount` decimal(10,3) DEFAULT NULL,
  `airfare_months` smallint unsigned DEFAULT NULL,
  `total_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_leave_encash_detail_id`),
  KEY `hims_f_leave_encash_detail_fk1_idx` (`leave_id`),
  KEY `hims_f_leave_encash_detail_fk2_idx` (`leave_encash_header_id`),
  CONSTRAINT `hims_f_leave_encash_detail_fk1` FOREIGN KEY (`leave_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_f_leave_encash_detail_fk2` FOREIGN KEY (`leave_encash_header_id`) REFERENCES `hims_f_leave_encash_header` (`hims_f_leave_encash_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_encash_header`
--

DROP TABLE IF EXISTS `hims_f_leave_encash_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_encash_header` (
  `hims_f_leave_encash_header_id` int NOT NULL AUTO_INCREMENT,
  `encashment_number` varchar(22) NOT NULL,
  `employee_id` int NOT NULL,
  `encashment_date` date DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `leave_id` int NOT NULL,
  `close_balance` decimal(5,2) DEFAULT '0.00',
  `leave_days` decimal(5,2) unsigned DEFAULT NULL,
  `leave_amount` decimal(10,3) DEFAULT NULL,
  `airfare_amount` decimal(10,3) DEFAULT NULL,
  `airfare_months` smallint unsigned DEFAULT NULL,
  `authorized1` enum('PEN','APR','REJ') DEFAULT 'PEN',
  `authorized1_by` int DEFAULT NULL,
  `authorized1_date` datetime DEFAULT NULL,
  `authorized2` enum('PEN','APR','REJ') DEFAULT 'PEN',
  `authorized2_by` int DEFAULT NULL,
  `authorized2_date` datetime DEFAULT NULL,
  `authorized` enum('PEN','APR','REJ','PRO','SET','CAN') DEFAULT 'PEN' COMMENT 'PEN = PENDING\\nAPR = APPROVED\\nREJ = REJECTED\\nPRO = PROCESSED\\nSET = SETTLED\\nCAN = CANCELLED',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_by` int DEFAULT NULL,
  `posted_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_leave_encash_header_id`),
  UNIQUE KEY `encashment_number_UNIQUE` (`encashment_number`),
  KEY `hims_f_leave_encash_header_fk1_idx` (`leave_id`),
  KEY `hims_f_leave_encash_header_fk2_idx` (`employee_id`),
  KEY `hims_f_leave_encash_header_fk3_idx` (`authorized1_by`),
  KEY `hims_f_leave_encash_header_fk4_idx` (`authorized2_by`),
  KEY `hims_f_leave_encash_header_fk5_idx` (`posted_by`),
  KEY `hims_f_leave_encash_header_fk6_idx` (`hospital_id`),
  CONSTRAINT `hims_f_leave_encash_header_fk1` FOREIGN KEY (`leave_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_f_leave_encash_header_fk2` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_leave_encash_header_fk3` FOREIGN KEY (`authorized1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_encash_header_fk4` FOREIGN KEY (`authorized2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_encash_header_fk5` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_encash_header_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_salary_accrual_detail`
--

DROP TABLE IF EXISTS `hims_f_leave_salary_accrual_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_salary_accrual_detail` (
  `hims_f_leave_salary_accrual_detail_id` int NOT NULL AUTO_INCREMENT,
  `leave_salary_header_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `year` smallint DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT '1',
  `leave_days` decimal(5,2) DEFAULT NULL,
  `leave_salary` decimal(15,3) DEFAULT NULL,
  `airfare_amount` decimal(15,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_leave_salary_accrual_detail_id`),
  KEY `hims_f_leave_salary_accrual_detail_fk1_idx` (`leave_salary_header_id`),
  KEY `hims_f_leave_salary_accrual_detail_fk2_idx` (`employee_id`),
  CONSTRAINT `hims_f_leave_salary_accrual_detail_fk1` FOREIGN KEY (`leave_salary_header_id`) REFERENCES `hims_f_leave_salary_accrual_header` (`hims_f_leave_salary_accrual_header_id`),
  CONSTRAINT `hims_f_leave_salary_accrual_detail_fk2` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_salary_accrual_header`
--

DROP TABLE IF EXISTS `hims_f_leave_salary_accrual_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_salary_accrual_header` (
  `hims_f_leave_salary_accrual_header_id` int NOT NULL AUTO_INCREMENT,
  `leave_salary_number` varchar(22) DEFAULT NULL,
  `year` smallint unsigned DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT '1',
  `total_leave_salary` decimal(15,3) DEFAULT NULL,
  `total_airfare_amount` decimal(15,3) DEFAULT NULL,
  `leave_salary_date` date DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_leave_salary_accrual_header_id`),
  KEY `hims_f_leave_salary_accrual_header_fk1_idx` (`posted_by`),
  KEY `hims_f_leave_salary_accrual_header_fk2_idx` (`created_by`),
  KEY `hims_f_leave_salary_accrual_header_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_f_leave_salary_accrual_header_fk1` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`) ON UPDATE SET NULL,
  CONSTRAINT `hims_f_leave_salary_accrual_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_salary_accrual_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_salary_detail`
--

DROP TABLE IF EXISTS `hims_f_leave_salary_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_salary_detail` (
  `hims_f_leave_salary_detail_id` int NOT NULL AUTO_INCREMENT,
  `leave_salary_header_id` int NOT NULL,
  `year` smallint DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `leave_start_date` date DEFAULT NULL,
  `leave_end_date` date DEFAULT NULL,
  `leave_application_id` int DEFAULT NULL,
  `leave_period` decimal(5,2) DEFAULT NULL,
  `leave_category` enum('A','M') DEFAULT 'A' COMMENT 'A = ANNUAL\\\\\\\\\\\\\\\\nM = MATERNITY\\\\\\\\n',
  `salary_header_id` int DEFAULT NULL,
  `gross_amount` decimal(10,3) DEFAULT NULL,
  `net_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_leave_salary_detail_id`),
  KEY `hims_f_leave_salary_detail_fk1_idx` (`leave_salary_header_id`),
  KEY `hims_f_leave_salary_detail_fk2_idx` (`leave_application_id`),
  KEY `hims_f_leave_salary_detail_fk3_idx` (`salary_header_id`),
  CONSTRAINT `hims_f_leave_salary_detail_fk1` FOREIGN KEY (`leave_salary_header_id`) REFERENCES `hims_f_leave_salary_header` (`hims_f_leave_salary_header_id`),
  CONSTRAINT `hims_f_leave_salary_detail_fk2` FOREIGN KEY (`leave_application_id`) REFERENCES `hims_f_leave_application` (`hims_f_leave_application_id`),
  CONSTRAINT `hims_f_leave_salary_detail_fk3` FOREIGN KEY (`salary_header_id`) REFERENCES `hims_f_salary` (`hims_f_salary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_leave_salary_header`
--

DROP TABLE IF EXISTS `hims_f_leave_salary_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_leave_salary_header` (
  `hims_f_leave_salary_header_id` int NOT NULL AUTO_INCREMENT,
  `leave_salary_number` varchar(22) NOT NULL,
  `leave_salary_date` date DEFAULT NULL,
  `employee_id` int NOT NULL,
  `year` smallint DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `leave_start_date` date DEFAULT NULL,
  `leave_end_date` date DEFAULT NULL,
  `salary_amount` decimal(10,3) DEFAULT NULL,
  `leave_amount` decimal(10,3) DEFAULT NULL,
  `airfare_amount` decimal(10,3) DEFAULT NULL,
  `total_amount` decimal(10,3) DEFAULT NULL,
  `leave_period` decimal(5,2) DEFAULT NULL,
  `status` enum('PEN','PRO','CAN') DEFAULT 'PEN' COMMENT 'PEN = pending\\nPRO = processed\\nCAN = cancelled',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  `airfare_months` smallint DEFAULT NULL,
  PRIMARY KEY (`hims_f_leave_salary_header_id`),
  UNIQUE KEY `leave_salary_number_UNIQUE` (`leave_salary_number`),
  KEY `hims_f_leave_salary_header_fk1_idx` (`created_by`),
  KEY `hims_f_leave_salary_header_fk2_idx` (`employee_id`),
  CONSTRAINT `hims_f_leave_salary_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_leave_salary_header_fk2` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_loan_application`
--

DROP TABLE IF EXISTS `hims_f_loan_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_loan_application` (
  `hims_f_loan_application_id` int NOT NULL AUTO_INCREMENT,
  `loan_application_number` varchar(45) NOT NULL,
  `employee_id` int NOT NULL,
  `loan_id` int NOT NULL,
  `application_reason` varchar(150) DEFAULT NULL,
  `loan_application_date` datetime NOT NULL,
  `loan_authorized` enum('PEN','APR','REJ','IS') DEFAULT 'PEN' COMMENT 'PEN = Pending , APR = Approved , REJ = Rejected,IS=ISSUED',
  `authorized_date` date DEFAULT NULL,
  `authorized_by` int DEFAULT NULL,
  `loan_closed` enum('N','Y') DEFAULT 'N' COMMENT 'Y= YES , N = NO ',
  `loan_amount` decimal(10,3) DEFAULT '0.000',
  `approved_amount` decimal(10,3) DEFAULT '0.000',
  `start_month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `start_year` smallint NOT NULL,
  `loan_tenure` smallint DEFAULT NULL COMMENT 'No. of EMIs.',
  `pending_tenure` smallint DEFAULT NULL,
  `installment_amount` decimal(10,3) DEFAULT '0.000',
  `pending_loan` decimal(10,3) DEFAULT '0.000',
  `loan_skip_months` smallint unsigned DEFAULT '0',
  `loan_dispatch_from` enum('EMP','SAL') DEFAULT 'EMP' COMMENT 'EMP = EMPLOYEE PAYMENTS\nSAL = EMPLOYEE SALARY',
  `authorized1_by` int DEFAULT NULL,
  `authorized1_date` date DEFAULT NULL,
  `authorized1` enum('P','R','A') DEFAULT 'P' COMMENT 'P=PENDING,A=APROVED,R=REJECTED',
  `authorized2_by` int DEFAULT NULL,
  `authorized2_date` date DEFAULT NULL,
  `authorized2` enum('P','R','A') DEFAULT 'P' COMMENT 'P=PENDING,A=APROVED,R=REJECTED',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_loan_application_id`),
  UNIQUE KEY `loan_application_number_UNIQUE` (`loan_application_number`),
  KEY `hims_f_loan_application_fk1_idx` (`employee_id`),
  KEY `hims_f_loan_application_fk2_idx` (`loan_id`),
  KEY `hims_f_loan_application_fk3_idx` (`authorized_by`),
  KEY `hims_f_loan_application_fk4_idx` (`authorized1_by`),
  KEY `hims_f_loan_application_fk5_idx` (`authorized2_by`),
  KEY `hims_f_loan_application_fk7_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_loan_application_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_loan_application_fk2` FOREIGN KEY (`loan_id`) REFERENCES `hims_d_loan` (`hims_d_loan_id`),
  CONSTRAINT `hims_f_loan_application_fk3` FOREIGN KEY (`authorized_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_loan_application_fk4` FOREIGN KEY (`authorized1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_loan_application_fk5` FOREIGN KEY (`authorized2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_loan_application_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_medication_approval`
--

DROP TABLE IF EXISTS `hims_f_medication_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_medication_approval` (
  `hims_f_medication_approval_id` int NOT NULL AUTO_INCREMENT,
  `prescription_detail_id` int DEFAULT NULL,
  `pharmacy_pos_detail_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `patient_name` varchar(150) DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `sub_insurance_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `insurance_network_office_id` int DEFAULT NULL,
  `drug_code` varchar(45) DEFAULT NULL,
  `requested_date` date DEFAULT NULL,
  `requested_by` int DEFAULT NULL,
  `requested_mode` enum('O','E','T','F') DEFAULT 'O' COMMENT 'O = ONLINE\\nE = EMAIL\\nT = TELEPHONE\\nF=FAX',
  `requested_quantity` tinyint DEFAULT NULL,
  `submission_type` enum('S','RS','C','CS','CRS') DEFAULT NULL COMMENT 'S=SUBMIT\\nRS=RESUBMIT\\nC=CANCEL\\nCS=CANCEL and SUBMIT\\nCRS=CANCEL and RESUBMIT',
  `insurance_service_name` varchar(45) DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `refer_no` varchar(45) DEFAULT NULL,
  `gross_amt` decimal(10,3) NOT NULL DEFAULT '0.000',
  `net_amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `patient_share` decimal(10,3) DEFAULT NULL,
  `company_share` decimal(10,3) DEFAULT NULL,
  `approved_qty` tinyint DEFAULT NULL,
  `approved_amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `approved_no` varchar(45) DEFAULT NULL,
  `apprv_remarks` varchar(200) DEFAULT NULL,
  `apprv_date` datetime DEFAULT NULL,
  `rejected_reason` varchar(200) DEFAULT NULL,
  `apprv_status` enum('NR','AW','AP','RJ') NOT NULL DEFAULT 'NR' COMMENT 'NR = NOT REQUESTED \\nAW=AWAITING APPROVAL\\nAP = APPROVED\\nRJ = REJECTED',
  `valid_upto` date DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `billing_updated` enum('N','Y') DEFAULT 'N',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_medication_approval_id`),
  KEY `hims_f_medication_approval_fk1_idx` (`prescription_detail_id`),
  KEY `hims_f_medication_approval_fk2_idx` (`patient_id`),
  KEY `hims_f_medication_approval_fk2_idx1` (`visit_id`),
  KEY `hims_f_medication_approval_fk4_idx` (`item_id`),
  KEY `hims_f_medication_approval_fk5_idx` (`service_id`),
  KEY `hims_f_medication_approval_fk6_idx` (`insurance_provider_id`),
  KEY `hims_f_medication_approval_fk7_idx` (`requested_by`),
  KEY `hims_f_medication_approval_fk8_idx` (`created_by`),
  KEY `hims_f_medication_approval_fk_idx` (`updated_by`),
  KEY `hims_f_medication_approval_fk10_idx` (`doctor_id`),
  KEY `hims_f_medication_approval_fk11_idx` (`insurance_network_office_id`),
  KEY `hims_f_medication_approval_fk12_idx` (`network_id`),
  KEY `hims_f_medication_approval_fk14_idx` (`sub_insurance_id`),
  KEY `hims_f_medication_approval_fk9_idx` (`pharmacy_pos_detail_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_medication_approval_fk1` FOREIGN KEY (`prescription_detail_id`) REFERENCES `hims_f_prescription_detail` (`hims_f_prescription_detail_id`),
  CONSTRAINT `hims_f_medication_approval_fk10` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_medication_approval_fk11` FOREIGN KEY (`insurance_network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`),
  CONSTRAINT `hims_f_medication_approval_fk12` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_medication_approval_fk14` FOREIGN KEY (`sub_insurance_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_medication_approval_fk2` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_medication_approval_fk3` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_medication_approval_fk4` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_medication_approval_fk5` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_medication_approval_fk6` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_medication_approval_fk7` FOREIGN KEY (`requested_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_medication_approval_fk8` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_medication_approval_fk9` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_micro_result`
--

DROP TABLE IF EXISTS `hims_f_micro_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_micro_result` (
  `hims_f_micro_result_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `antibiotic_id` int DEFAULT NULL,
  `susceptible` enum('N','Y') DEFAULT 'N',
  `intermediate` enum('N','Y') DEFAULT 'N',
  `resistant` enum('N','Y') DEFAULT 'N',
  PRIMARY KEY (`hims_f_micro_result_id`),
  KEY `hims_f_micro_result_fk1_idx` (`order_id`),
  KEY `hims_f_micro_result_fk2_idx` (`antibiotic_id`),
  CONSTRAINT `hims_f_micro_result_fk1` FOREIGN KEY (`order_id`) REFERENCES `hims_f_lab_order` (`hims_f_lab_order_id`),
  CONSTRAINT `hims_f_micro_result_fk2` FOREIGN KEY (`antibiotic_id`) REFERENCES `hims_d_antibiotic` (`hims_d_antibiotic_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_miscellaneous_earning_deduction`
--

DROP TABLE IF EXISTS `hims_f_miscellaneous_earning_deduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_miscellaneous_earning_deduction` (
  `hims_f_miscellaneous_earning_deduction_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `earning_deductions_id` int NOT NULL,
  `year` smallint NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL DEFAULT '1',
  `amount` decimal(10,3) DEFAULT NULL,
  `processed` enum('N','Y') DEFAULT 'N',
  `category` enum('E','D','B') DEFAULT 'E' COMMENT 'E =EARNINGS\\\\nD =DEDUCTIONS\nB= Bonus',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_miscellaneous_earning_deduction_id`),
  UNIQUE KEY `unique_earning_deduction` (`employee_id`,`earning_deductions_id`,`year`,`month`),
  KEY `hims_f_miscellaneous_earning_deduction_fk1_idx` (`employee_id`),
  KEY `hims_f_miscellaneous_earning_deduction_fk2_idx` (`earning_deductions_id`),
  KEY `hims_f_miscellaneous_earning_deduction_fk3_idx` (`created_by`),
  KEY `hims_f_miscellaneous_earning_deduction_fk4_idx` (`updated_by`),
  CONSTRAINT `hims_f_miscellaneous_earning_deduction_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_miscellaneous_earning_deduction_fk2` FOREIGN KEY (`earning_deductions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`),
  CONSTRAINT `hims_f_miscellaneous_earning_deduction_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_miscellaneous_earning_deduction_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_nurse_episode_chief_complaint`
--

DROP TABLE IF EXISTS `hims_f_nurse_episode_chief_complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_nurse_episode_chief_complaint` (
  `hims_f_nurse_episode_chief_complaint_id` int NOT NULL AUTO_INCREMENT,
  `episode_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `chief_complaint_id` int DEFAULT NULL,
  `onset_date` datetime DEFAULT NULL,
  `interval` enum('W','D','M','Y','H') DEFAULT NULL COMMENT 'H=hours\\nD=days\\nW=weeks\\nM=months\\nY=years\\n',
  `duration` int DEFAULT NULL,
  `severity` enum('MI','MO','SE') DEFAULT 'MI' COMMENT 'MI=MILD\\nMO=MODERATE\\nSE=SEVERE',
  `score` tinyint DEFAULT NULL,
  `pain` enum('NH','HLB','HLM','HEM','HWL','HW') DEFAULT 'NH' COMMENT 'NH = NO HURTS,\\nHLB= HURTS LITTLE BIT,\\nHLM=HURTS LITTLE MORE,\\nHEM = HURTS EVEN MORE,\\nHWL= HURTS WHOLE LOT,\\nHW= HURTS WORST.',
  `comment` varchar(200) DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A' COMMENT 'A=active\\nI=Inactive',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_nurse_episode_chief_complaint_id`),
  KEY `hims_f_nurse_episode_chief_complaint_fk1_idx` (`created_by`),
  KEY `hims_f_nurse_episode_chief_complaint_fk2_idx` (`updated_by`),
  KEY `hims_f_nurse_episode_chief_complaint_fk3_idx` (`patient_id`),
  KEY `hims_f_nurse_episode_chief_complaint_fk4_idx` (`chief_complaint_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_nurse_episode_chief_complaint_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_nurse_episode_chief_complaint_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_nurse_episode_chief_complaint_fk3` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_nurse_episode_chief_complaint_fk4` FOREIGN KEY (`chief_complaint_id`) REFERENCES `hims_d_hpi_header` (`hims_d_hpi_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ocaf_header`
--

DROP TABLE IF EXISTS `hims_f_ocaf_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ocaf_header` (
  `hims_f_ocaf_header_id` int NOT NULL AUTO_INCREMENT,
  `visit_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_date` date NOT NULL,
  `sub_department_name` varchar(150) DEFAULT NULL,
  `provider_name` varchar(750) DEFAULT NULL,
  `new_visit_patient` enum('Y','N') DEFAULT 'N',
  `patient_full_name` varchar(180) DEFAULT NULL,
  `patient_code` varchar(45) DEFAULT NULL,
  `patient_gender` varchar(45) DEFAULT 'Male',
  `age_in_years` int DEFAULT NULL,
  `patient_marital_status` varchar(15) DEFAULT NULL,
  `dv_right_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `dv_right_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `dv_right_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `dv_right_prism` varchar(25) DEFAULT NULL,
  `dv_right_vision` enum('6/6','6/6p','6/9','6/9p','6/12','6/12p','6/18','6/18p','6/24','6/24p','6/36','6/36p','6/60','6/75','6/95','6/120','20/20','20/25','20/30','20/40','20/50','20/60','20/80','20/100','20/125','20/160','20/180','20/200','20/220','20/240','20/260','20/280','20/300','20/320','20/340','20/360','20/380','20/400','CF@3m','CF@2m','CF@1m','CF@1/2m','CFCF','HM+','PL+','No PL','PR Temp','PR Nas','PR Sup','PR Inf') DEFAULT NULL,
  `nv_right_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `nv_right_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `nv_right_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `nv_right_prism` varchar(25) DEFAULT NULL,
  `nv_right_vision` enum('N5','N6','N7','N8','N10','N12','N15','N18','N20','N24','N36','N60') DEFAULT NULL,
  `dv_left_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `dv_left_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `dv_left_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `dv_left_prism` varchar(25) DEFAULT NULL,
  `dv_left_vision` enum('6/6','6/6p','6/9','6/9p','6/12','6/12p','6/18','6/18p','6/24','6/24p','6/36','6/36p','6/60','6/75','6/95','6/120','20/20','20/25','20/30','20/40','20/50','20/60','20/80','20/100','20/125','20/160','20/180','20/200','20/220','20/240','20/260','20/280','20/300','20/320','20/340','20/360','20/380','20/400','CF@3m','CF@2m','CF@1m','CF@1/2m','CFCF','HM+','PL+','No PL','PR Temp','PR Nas','PR Sup','PR Inf') DEFAULT NULL,
  `nv_left_sch` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `nv_left_cyl` enum('-20.00','-19.75','-19.50','-19.25','-19.00','-18.75','-18.50','-18.25','-18.00','-17.75','-17.50','-17.25','-17.00','-16.75','-16.50','-16.25','-16.00','-15.75','-15.50','-15.25','-15.00','-14.75','-14.50','-14.25','-14.00','-13.75','-13.50','-13.25','-13.00','-12.75','-12.50','-12.25','-12.00','-11.75','-11.50','-11.25','-11.00','-10.75','-10.50','-10.25','-10.00','-9.75','-9.50','-9.25','-9.00','-8.75','-8.50','-8.25','-8.00','-7.75','-7.50','-7.25','-7.00','-6.75','-6.50','-6.25','-6.00','-5.75','-5.50','-5.25','-5.00','-4.75','-4.50','-4.25','-4.00','-3.75','-3.50','-3.25','-3.00','-2.75','-2.50','-2.25','-2.00','-1.75','-1.50','-1.25','-1.00','-0.75','-0.50','-0.25','0.00','+0.25','+0.50','+0.75','+1.00','+1.25','+1.50','+1.75','+2.00','+2.25','+2.50','+2.75','+3.00','+3.25','+3.50','+3.75','+4.00','+4.25','+4.50','+4.75','+5.00','+5.25','+5.50','+5.75','+6.00','+6.25','+6.50','+6.75','+7.00','+7.25','+7.50','+7.75','+8.00','+8.25','+8.50','+8.75','+9.00','+9.25','+9.50','+9.75','+10.00','+10.25','+10.50','+10.75','+11.00','+11.25','+11.50','+11.75','+12.00','+12.25','+12.50','+12.75','+13.00','+13.25','+13.50','+13.75','+14.00','+14.25','+14.50','+14.75','+15.00','+15.25','+15.50','+15.75','+16.00','+16.25','+16.50','+16.75','+17.00','+18.25','+18.50','+18.75','+19.00','+19.25','+19.50','+19.75','+20.00') DEFAULT NULL,
  `nv_left_axis` enum('-','5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100','105','110','115','120','125','130','135','140','145','150','155','160','165','170','175','180') DEFAULT NULL,
  `nv_left_prism` varchar(25) DEFAULT NULL,
  `nv_left_vision` enum('N5','N6','N7','N8','N10','N12','N15','N18','N20','N24','N36','N60') DEFAULT NULL,
  `resgular_lense_type` enum('GL','PL','N') DEFAULT NULL COMMENT 'GL=GLASS,PL=PLASTIC,N=NONE',
  `multi_coated` enum('Y','N') DEFAULT NULL,
  `varilux` enum('Y','N') DEFAULT NULL,
  `light` enum('Y','N') DEFAULT NULL,
  `aspheric` enum('Y','N') DEFAULT NULL,
  `bifocal` enum('Y','N') DEFAULT NULL,
  `medium` enum('Y','N') DEFAULT NULL,
  `lenticular` enum('Y','N') DEFAULT NULL,
  `single_vision` enum('Y','N') DEFAULT NULL,
  `dark` enum('Y','N') DEFAULT NULL,
  `safety_thickness` enum('Y','N') DEFAULT NULL,
  `anti_reflecting_coating` enum('Y','N') DEFAULT NULL,
  `photosensitive` enum('Y','N') DEFAULT NULL,
  `high_index` enum('Y','N') DEFAULT NULL,
  `colored` enum('Y','N') DEFAULT NULL,
  `anti_scratch` enum('Y','N') DEFAULT NULL,
  `contact_lense_type` enum('P','D') DEFAULT NULL COMMENT 'P=PERMANENT,D=DISPOSABLE',
  `frames` enum('Y','N') DEFAULT NULL,
  `no_pairs` tinyint DEFAULT NULL,
  `estimated_cost` decimal(10,3) DEFAULT NULL,
  `lense_cost` decimal(10,3) DEFAULT NULL,
  `frame_cost` decimal(10,3) DEFAULT NULL,
  `eye_pd1` decimal(10,2) DEFAULT NULL,
  `eye_pd2` decimal(10,2) DEFAULT NULL,
  `right_bifocal_add` decimal(10,2) DEFAULT NULL,
  `left_bifocal_add` decimal(10,2) DEFAULT NULL,
  `vertical_add` decimal(10,2) DEFAULT NULL,
  `eligible_reference_number` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_ocaf_header_id`),
  KEY `hims_f_ocaf_header_fk1_idx` (`patient_id`),
  KEY `hims_f_ocaf_header_fk2_idx` (`visit_id`),
  CONSTRAINT `hims_f_ocaf_header_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_ocaf_header_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ocaf_insurance_details`
--

DROP TABLE IF EXISTS `hims_f_ocaf_insurance_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ocaf_insurance_details` (
  `hims_f_ocaf_insurance_details_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_ocaf_header_id` int DEFAULT NULL,
  `primary_policy_num` varchar(100) DEFAULT NULL,
  `primary_effective_start_date` date DEFAULT NULL,
  `primary_effective_end_date` date DEFAULT NULL,
  `primary_card_number` varchar(20) DEFAULT NULL,
  `primary_insurance_provider_id` int DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_policy_num` varchar(100) DEFAULT NULL,
  `secondary_card_number` varchar(20) DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `primary_insurance_company_name` varchar(255) DEFAULT NULL,
  `secondary_insurance_company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `primary_tpa_insurance_company_name` varchar(245) DEFAULT NULL,
  `secondary_tpa_insurance_company_name` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`hims_f_ocaf_insurance_details_id`),
  KEY `hims_f_ocaf_insurance_details_fk1_idx` (`hims_f_ocaf_header_id`),
  CONSTRAINT `hims_f_ocaf_insurance_details_fk1` FOREIGN KEY (`hims_f_ocaf_header_id`) REFERENCES `hims_f_ocaf_header` (`hims_f_ocaf_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_optometry_pos_detail`
--

DROP TABLE IF EXISTS `hims_f_optometry_pos_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_optometry_pos_detail` (
  `hims_f_optometry_pos_detail_id` int NOT NULL AUTO_INCREMENT,
  `optometry_pos_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `item_category` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `grn_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `insurance_yesno` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tax_inclusive` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(10,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_extended_cost` decimal(10,3) DEFAULT NULL,
  `copay_percent` decimal(5,3) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT NULL,
  `patient_responsibility` decimal(10,3) DEFAULT NULL,
  `patient_tax` decimal(10,3) DEFAULT NULL,
  `patient_payable` decimal(10,3) DEFAULT NULL,
  `company_responsibility` decimal(10,3) DEFAULT NULL,
  `company_tax` decimal(10,3) DEFAULT NULL,
  `company_payable` decimal(10,3) DEFAULT NULL,
  `sec_copay_percent` decimal(5,3) DEFAULT NULL,
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `sec_company_tax` decimal(10,3) DEFAULT NULL,
  `sec_company_payable` decimal(10,3) DEFAULT NULL,
  `return_quantity` decimal(5,2) DEFAULT NULL,
  `return_done` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `return_extended_cost` decimal(10,3) DEFAULT NULL,
  `return_discount_amt` decimal(10,3) DEFAULT NULL,
  `return_net_extended_cost` decimal(10,3) DEFAULT NULL,
  `return_pat_responsibility` decimal(10,3) DEFAULT NULL,
  `return_company_responsibility` decimal(10,3) DEFAULT NULL,
  `return_sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_f_optometry_pos_detail_id`),
  KEY `hims_f_optometry_pos_detail_fk1_idx` (`item_id`),
  KEY `hims_f_optometry_pos_detail_fk2_idx` (`service_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_optometry_pos_detail_fk1` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_optometry_pos_detail_fk2` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_optometry_pos_header`
--

DROP TABLE IF EXISTS `hims_f_optometry_pos_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_optometry_pos_header` (
  `hims_f_optometry_pos_header_id` int NOT NULL AUTO_INCREMENT,
  `pos_number` varchar(22) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `pos_customer_type` enum('OP','OT','IP') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'OP = OUT PATIENT\nIP = IN PATIENT \nOT = OTHERS',
  `patient_id` int DEFAULT NULL,
  `patient_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mobile_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `referal_doctor` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `ip_id` int DEFAULT NULL,
  `pos_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `year` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '''1''=JAN\n''2''=FEB\n''3''=MAR\n''4'',=APR\n''5'',=MAY\n''6'',=JUN\n''7'',=JUL\n''8'',=AUG\n''9'',=SEP\n''10'',=OCT\n''11'',=NOV\n''12''=DEC',
  `location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'MS = MAIN STORE\nSS= SUB STORE\n',
  `sub_total` decimal(10,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT NULL,
  `patient_responsibility` decimal(10,3) DEFAULT NULL,
  `patient_tax` decimal(10,3) DEFAULT NULL,
  `patient_payable` decimal(10,3) DEFAULT NULL,
  `company_responsibility` decimal(10,3) DEFAULT NULL,
  `company_tax` decimal(10,3) DEFAULT NULL,
  `company_payable` decimal(10,3) DEFAULT NULL,
  `comments` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `sec_company_tax` decimal(10,3) DEFAULT NULL,
  `sec_company_payable` decimal(10,3) DEFAULT NULL,
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `net_tax` decimal(10,3) DEFAULT '0.000',
  `gross_total` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_amount` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_percentage` decimal(5,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `credit_amount` decimal(10,3) DEFAULT '0.000',
  `balance_credit` decimal(10,3) DEFAULT NULL,
  `receiveable_amount` decimal(10,3) DEFAULT '0.000',
  `posted` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `card_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `effective_start_date` date DEFAULT NULL,
  `effective_end_date` date DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `sub_insurance_provider_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `network_type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `network_office_id` int DEFAULT NULL,
  `policy_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_card_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_network_id` int DEFAULT NULL,
  `secondary_network_type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_sub_insurance_provider_id` int DEFAULT NULL,
  `secondary_network_office_id` int DEFAULT NULL,
  `receipt_header_id` int DEFAULT NULL,
  `invoice_generated` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_optometry_pos_header_id`),
  KEY `hims_f_optometry_pos_header_fk1_idx` (`insurance_provider_id`),
  KEY `hims_f_optometry_pos_header_fk2_idx` (`sub_insurance_provider_id`),
  KEY `hims_f_optometry_pos_header_fk3_idx` (`network_id`),
  KEY `hims_f_optometry_pos_header_fk4_idx` (`network_office_id`),
  KEY `hims_f_optometry_pos_header_fk5_idx` (`secondary_insurance_provider_id`),
  KEY `hims_f_optometry_pos_header_fk6_idx` (`secondary_sub_insurance_provider_id`),
  KEY `hims_f_optometry_pos_header_fk7_idx` (`secondary_network_id`),
  KEY `hims_f_optometry_pos_header_fk8_idx` (`secondary_network_office_id`),
  KEY `hims_f_optometry_pos_header_fk9_idx` (`patient_id`),
  KEY `hims_f_optometry_pos_header_fk10_idx` (`visit_id`),
  KEY `hims_f_optometry_pos_header_fk11_idx` (`created_by`),
  KEY `hims_f_optometry_pos_header_fk12_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_optometry_pos_header_fk1` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk10` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk11` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk12` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk2` FOREIGN KEY (`sub_insurance_provider_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk3` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk4` FOREIGN KEY (`network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk5` FOREIGN KEY (`secondary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk6` FOREIGN KEY (`secondary_sub_insurance_provider_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk7` FOREIGN KEY (`secondary_network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk8` FOREIGN KEY (`secondary_network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`),
  CONSTRAINT `hims_f_optometry_pos_header_fk9` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ord_analytes`
--

DROP TABLE IF EXISTS `hims_f_ord_analytes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ord_analytes` (
  `hims_f_ord_analytes_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `analyte_id` int DEFAULT NULL,
  `analyte_type` enum('QU','QN','T') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'QU' COMMENT 'QU=QUALITY,\n\nQN=QUANTITY,\n\nT=TEXT',
  `result_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `result` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `text` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `run1` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `run2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `run3` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `critical_low` decimal(10,3) DEFAULT NULL,
  `critical_high` decimal(10,3) DEFAULT NULL,
  `normal_low` decimal(10,3) DEFAULT NULL,
  `normal_high` decimal(10,3) DEFAULT NULL,
  `status` enum('E','C','V','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'E=Entered  \n C=Confirmed \nV=Validated\n N=Not Entered',
  `entered_by` int DEFAULT NULL,
  `entered_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `confirm_by` int DEFAULT NULL,
  `confirmed_date` datetime DEFAULT NULL,
  `validate_by` int DEFAULT NULL,
  `validated_date` datetime DEFAULT NULL,
  `amended` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `amended_by` int DEFAULT NULL,
  `amended_date` datetime DEFAULT NULL,
  `critical` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `critical_type` enum('N','CL','CH','L','H') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'N= NONE\nCL = CRITICAL LOW\nCH = CRITICAL HIGH\nL =LOW\nH = HIGH',
  `normal_qualitative_value` varchar(25) DEFAULT NULL,
  `text_value` varchar(90) DEFAULT NULL,
  `remarks` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_ord_analytes_id`),
  UNIQUE KEY `unique_order_analyte` (`order_id`,`analyte_id`),
  KEY `hims_d_lab_analytes_fk2_idx` (`created_by`),
  KEY `hims_d_lab_analytes_fk3_idx` (`updated_by`),
  KEY `hims_f_ord_analytes_fk1_idx` (`order_id`),
  KEY `hims_f_ord_analyte_fk4_idx` (`analyte_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_ord_analyte_fk4` FOREIGN KEY (`analyte_id`) REFERENCES `hims_d_lab_analytes` (`hims_d_lab_analytes_id`),
  CONSTRAINT `hims_f_ord_analytes_fk1` FOREIGN KEY (`order_id`) REFERENCES `hims_f_lab_order` (`hims_f_lab_order_id`),
  CONSTRAINT `hims_f_ord_analytes_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_ord_analytes_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ordered_inventory`
--

DROP TABLE IF EXISTS `hims_f_ordered_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ordered_inventory` (
  `hims_f_ordered_inventory_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `inventory_item_id` int DEFAULT NULL,
  `inventory_location_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `pharmacy_item_id` int DEFAULT NULL,
  `pharmacy_location_id` int DEFAULT NULL,
  `Pharmacy_uom_id` int DEFAULT NULL,
  `service_type_id` int NOT NULL,
  `services_id` int NOT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expirydt` date DEFAULT NULL,
  `grnno` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `insurance_yesno` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT 'Y = YES\\nN = NO',
  `insurance_provider_id` int DEFAULT NULL,
  `insurance_sub_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `insurance_network_office_id` int DEFAULT NULL,
  `policy_number` varchar(45) DEFAULT NULL,
  `pre_approval` enum('N','Y') NOT NULL DEFAULT 'N' COMMENT 'N-NO\\nY-YES',
  `apprv_status` enum('NR','RE','AP','RJ') NOT NULL DEFAULT 'NR' COMMENT 'NR = NOT REQUESTED\\nRE = REQUESTED\\nAP = APPROVED\\nRJ = REJECTED',
  `billed` enum('Y','N') DEFAULT 'N' COMMENT 'Y=YES\\\\\\\\nN=NO',
  `quantity` decimal(10,0) DEFAULT '0',
  `unit_cost` decimal(10,2) DEFAULT '0.00',
  `gross_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amout` decimal(10,2) DEFAULT '0.00',
  `discount_percentage` decimal(10,2) DEFAULT '0.00',
  `net_amout` decimal(10,2) DEFAULT '0.00',
  `copay_percentage` decimal(10,2) DEFAULT '0.00',
  `copay_amount` decimal(10,2) DEFAULT '0.00',
  `deductable_amount` decimal(10,2) DEFAULT '0.00',
  `deductable_percentage` decimal(10,2) DEFAULT '0.00',
  `tax_inclusive` enum('Y','N') DEFAULT 'N',
  `patient_tax` decimal(10,2) DEFAULT '0.00',
  `company_tax` decimal(10,2) DEFAULT '0.00',
  `total_tax` decimal(10,2) DEFAULT '0.00',
  `patient_resp` decimal(10,2) DEFAULT '0.00',
  `patient_payable` decimal(10,2) DEFAULT '0.00',
  `comapany_resp` decimal(10,2) DEFAULT '0.00',
  `company_payble` decimal(10,2) DEFAULT '0.00',
  `sec_company` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\\nN = NO',
  `sec_deductable_percentage` decimal(10,2) DEFAULT '0.00',
  `sec_deductable_amount` decimal(10,2) DEFAULT '0.00',
  `sec_company_res` decimal(10,2) DEFAULT '0.00',
  `sec_company_tax` decimal(10,2) DEFAULT '0.00',
  `sec_company_paybale` decimal(10,2) DEFAULT '0.00',
  `sec_copay_percntage` decimal(10,2) DEFAULT '0.00',
  `sec_copay_amount` decimal(10,2) DEFAULT '0.00',
  `item_notchargable` enum('N','Y') DEFAULT 'N',
  `trans_package_detail_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_ordered_inventory_id`),
  KEY `hims_f_ordered_inventory_fk1_idx` (`patient_id`),
  KEY `hims_f_ordered_inventory_fk2_idx` (`visit_id`),
  KEY `hims_f_ordered_inventory_fk3_idx` (`doctor_id`),
  KEY `hims_f_ordered_inventory_fk4_idx` (`inventory_item_id`),
  KEY `hims_f_ordered_inventory_fk5_idx` (`inventory_location_id`),
  KEY `hims_f_ordered_inventory_fk6_idx` (`pharmacy_item_id`),
  KEY `hims_f_ordered_inventory_fk7_idx` (`pharmacy_location_id`),
  KEY `hims_f_ordered_inventory_fk8_idx` (`service_type_id`),
  KEY `hims_f_ordered_inventory_fk9_idx` (`services_id`),
  KEY `hims_f_ordered_inventory_fk10_idx` (`inventory_uom_id`),
  KEY `hims_f_ordered_inventory_fk11_idx` (`Pharmacy_uom_id`),
  KEY `hims_f_ordered_inventory_fk12_idx` (`insurance_provider_id`),
  KEY `hims_f_ordered_inventory_fk13_idx` (`insurance_sub_id`),
  KEY `hims_f_ordered_inventory_fk14_idx` (`network_id`),
  KEY `hims_f_ordered_inventory_fk15_idx` (`insurance_network_office_id`),
  KEY `hims_f_ordered_inventory_fk16_idx` (`created_by`),
  KEY `hims_f_ordered_inventory_fk17_idx` (`updated_by`),
  KEY `hims_f_ordered_inventory_fk19_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_ordered_inventory_fk20_idx` (`trans_package_detail_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk10` FOREIGN KEY (`inventory_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk11` FOREIGN KEY (`Pharmacy_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk12` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk13` FOREIGN KEY (`insurance_sub_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk14` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk15` FOREIGN KEY (`insurance_network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk16` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk17` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk19` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk3` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk4` FOREIGN KEY (`inventory_item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk5` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk6` FOREIGN KEY (`pharmacy_item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk7` FOREIGN KEY (`pharmacy_location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk8` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_f_ordered_inventory_fk9` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ordered_services`
--

DROP TABLE IF EXISTS `hims_f_ordered_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ordered_services` (
  `hims_f_ordered_services_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `service_type_id` int NOT NULL,
  `services_id` int NOT NULL,
  `test_type` enum('S','R') DEFAULT 'R' COMMENT 'S=Stat\nR=Routine',
  `insurance_yesno` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `insurance_provider_id` int DEFAULT NULL,
  `insurance_sub_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `insurance_network_office_id` int DEFAULT NULL,
  `policy_number` varchar(45) DEFAULT NULL,
  `pre_approval` enum('N','Y') NOT NULL DEFAULT 'N' COMMENT 'N-NO\nY-YES',
  `apprv_status` enum('NR','RE','AP','RJ') NOT NULL DEFAULT 'NR' COMMENT 'NR = NOT REQUESTED\nRE = REQUESTED\nAP = APPROVED\nRJ = REJECTED',
  `billed` enum('Y','N') DEFAULT 'N' COMMENT 'Y=YES\\\\nN=NO',
  `quantity` decimal(10,0) DEFAULT '0',
  `unit_cost` decimal(10,2) DEFAULT '0.00',
  `gross_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount_amout` decimal(10,2) DEFAULT '0.00',
  `discount_percentage` decimal(10,2) DEFAULT '0.00',
  `net_amout` decimal(10,2) DEFAULT '0.00',
  `copay_percentage` decimal(10,2) DEFAULT '0.00',
  `copay_amount` decimal(10,2) DEFAULT '0.00',
  `deductable_amount` decimal(10,2) DEFAULT '0.00',
  `deductable_percentage` decimal(10,2) DEFAULT '0.00',
  `tax_inclusive` enum('Y','N') DEFAULT 'N',
  `patient_tax` decimal(10,2) DEFAULT '0.00',
  `company_tax` decimal(10,2) DEFAULT '0.00',
  `total_tax` decimal(10,2) DEFAULT '0.00',
  `patient_resp` decimal(10,2) DEFAULT '0.00',
  `patient_payable` decimal(10,2) DEFAULT '0.00',
  `comapany_resp` decimal(10,2) DEFAULT '0.00',
  `company_payble` decimal(10,2) DEFAULT '0.00',
  `sec_company` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\nN = NO',
  `sec_deductable_percentage` decimal(10,2) DEFAULT '0.00',
  `sec_deductable_amount` decimal(10,2) DEFAULT '0.00',
  `sec_company_res` decimal(10,2) DEFAULT '0.00',
  `sec_company_tax` decimal(10,2) DEFAULT '0.00',
  `sec_company_paybale` decimal(10,2) DEFAULT '0.00',
  `sec_copay_percntage` decimal(10,2) DEFAULT '0.00',
  `sec_copay_amount` decimal(10,2) DEFAULT '0.00',
  `teeth_number` tinyint DEFAULT NULL,
  `trans_package_detail_id` int DEFAULT NULL,
  `d_treatment_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_ordered_services_id`),
  KEY `hims_f_ordered_services_fk1_idx` (`patient_id`),
  KEY `hims_f_ordered_services_fk2_idx` (`visit_id`),
  KEY `hims_f_ordered_services_fk3_idx` (`doctor_id`),
  KEY `hims_f_ordered_services_fk5_idx` (`services_id`),
  KEY `hims_f_ordered_services_fk6_idx` (`insurance_provider_id`),
  KEY `hims_f_ordered_services_fk7_idx` (`insurance_sub_id`),
  KEY `hims_f_ordered_services_fk8_idx` (`network_id`),
  KEY `hims_f_ordered_services_fk9_idx` (`created_by`),
  KEY `hims_f_ordered_services_fk10_idx` (`updated_by`),
  KEY `hims_f_ordered_services_fk10_idx1` (`insurance_network_office_id`),
  KEY `hims_f_ordered_services_fk11_idx` (`service_type_id`),
  KEY `hims_f_ordered_services_fk10_idx2` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_ordered_services_fk12_idx` (`trans_package_detail_id`),
  KEY `hims_f_ordered_services_fk13_idx` (`d_treatment_id`),
  CONSTRAINT `hims_f_ordered_services_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_ordered_services_fk10` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_ordered_services_fk11` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_f_ordered_services_fk12` FOREIGN KEY (`trans_package_detail_id`) REFERENCES `hims_f_package_detail` (`hims_f_package_detail_id`),
  CONSTRAINT `hims_f_ordered_services_fk13` FOREIGN KEY (`d_treatment_id`) REFERENCES `hims_f_dental_treatment` (`hims_f_dental_treatment_id`),
  CONSTRAINT `hims_f_ordered_services_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_ordered_services_fk3` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_ordered_services_fk5` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_ordered_services_fk6` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_ordered_services_fk7` FOREIGN KEY (`insurance_sub_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_ordered_services_fk8` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_ordered_services_fk9` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_overtime_detail`
--

DROP TABLE IF EXISTS `hims_f_overtime_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_overtime_detail` (
  `hims_f_overtime_detail_id` int NOT NULL AUTO_INCREMENT,
  `overtime_header_id` int DEFAULT NULL,
  `overtime_date` date DEFAULT NULL,
  `from_time` time DEFAULT NULL,
  `to_time` time DEFAULT NULL,
  `overtime_hours` decimal(4,2) DEFAULT NULL,
  `ot_hours` decimal(4,2) DEFAULT NULL,
  `weekoff_ot_hours` decimal(4,2) DEFAULT NULL,
  `holiday_ot_hours` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`hims_f_overtime_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_overtime_header`
--

DROP TABLE IF EXISTS `hims_f_overtime_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_overtime_header` (
  `hims_f_overtime_header_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `year` smallint NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL COMMENT '1 = JAN\\\\n2 =FEB\\\\n3 = MAR\\\\n4 = APR\\\\n5 = MAY\\\\n6 = JUNE\\\\n7 =JULY\\\\n8 = AUG\\\\n9 = SEPT\\\\n10 = OCT\\\\n11= NOV\\\\n12= DEC',
  `overtime_type` enum('M','D') DEFAULT 'M' COMMENT 'M = MONTHLY\nD = DAILY\n',
  `total_ot_hours` decimal(5,2) DEFAULT NULL COMMENT 'ot_hours+ weekof_ot_hours + holiday_ot_hours',
  `ot_hours` decimal(5,2) DEFAULT NULL,
  `weekof_ot_hours` decimal(5,2) DEFAULT NULL,
  `holiday_ot_hours` decimal(5,2) DEFAULT NULL,
  `status` enum('PE','AP','RJ','PR') DEFAULT NULL COMMENT 'PE = PENDING\nAP = APPROVED\nRJ  = REJECTED\nPR = PROCESSED',
  `overtime_payment_type` enum('N','C','E','B') DEFAULT NULL COMMENT 'N = NONE\\nC = COMP OFF\\nE = ENCASH\\nB = BOTH',
  `leave_id` int DEFAULT NULL COMMENT 'N = NONE\\nC = COMP OFF\\nE = ENCASH\\nB = BOTH',
  `comp_off_leaves` decimal(2,2) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `approved_date` datetime DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_overtime_header_id`),
  KEY `hims_f_overtime_header_fk1_idx` (`employee_id`),
  KEY `hims_f_overtime_header_fk2_idx` (`leave_id`),
  KEY `hims_f_overtime_header_fk3_idx` (`created_by`),
  KEY `hims_f_overtime_header_fk4_idx` (`approved_by`),
  KEY `hims_f_overtime_header_fk8_idx` (`hospital_id`),
  CONSTRAINT `hims_f_overtime_header_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_overtime_header_fk2` FOREIGN KEY (`leave_id`) REFERENCES `hims_d_leave` (`hims_d_leave_id`),
  CONSTRAINT `hims_f_overtime_header_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_overtime_header_fk4` FOREIGN KEY (`approved_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_overtime_header_fk8` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_package_detail`
--

DROP TABLE IF EXISTS `hims_f_package_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_package_detail` (
  `hims_f_package_detail_id` int NOT NULL AUTO_INCREMENT,
  `package_header_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `service_amount` decimal(10,3) DEFAULT '0.000',
  `qty` tinyint DEFAULT '0',
  `tot_service_amount` decimal(10,3) DEFAULT '0.000',
  `appropriate_amount` decimal(10,3) DEFAULT '0.000',
  `utilized_qty` tinyint DEFAULT '0',
  `available_qty` tinyint DEFAULT '0',
  `utilized_date` datetime DEFAULT NULL,
  `utilized_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_package_detail_id`),
  KEY `hims_f_package_detail_fk1_idx` (`package_header_id`),
  KEY `hims_f_package_detail_fk2_idx` (`service_type_id`),
  KEY `hims_f_package_detail_fk3_idx` (`service_id`),
  KEY `hims_f_package_detail_fk14_idx` (`utilized_by`),
  CONSTRAINT `hims_f_package_detail_fk11` FOREIGN KEY (`package_header_id`) REFERENCES `hims_f_package_header` (`hims_f_package_header_id`),
  CONSTRAINT `hims_f_package_detail_fk12` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_f_package_detail_fk13` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_package_detail_fk14` FOREIGN KEY (`utilized_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_package_header`
--

DROP TABLE IF EXISTS `hims_f_package_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_package_header` (
  `hims_f_package_header_id` int NOT NULL AUTO_INCREMENT,
  `package_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `service_type_id` int NOT NULL,
  `services_id` int NOT NULL,
  `insurance_yesno` enum('Y','N') NOT NULL DEFAULT 'N' COMMENT 'Y = YES\\nN = NO',
  `insurance_provider_id` int DEFAULT NULL,
  `insurance_sub_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `insurance_network_office_id` int DEFAULT NULL,
  `policy_number` varchar(45) DEFAULT NULL,
  `pre_approval` enum('N','Y') NOT NULL DEFAULT 'N' COMMENT 'N-NO\\nY-YES',
  `apprv_status` enum('NR','RE','AP','RJ') NOT NULL DEFAULT 'NR' COMMENT 'NR = NOT REQUESTED\\nRE = REQUESTED\\nAP = APPROVED\\nRJ = REJECTED',
  `billed` enum('Y','N') DEFAULT 'N' COMMENT 'Y=YES\\\\\\\\nN=NO',
  `quantity` tinyint DEFAULT '0',
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `gross_amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `discount_amout` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(10,3) DEFAULT '0.000',
  `net_amout` decimal(10,3) DEFAULT '0.000',
  `copay_percentage` decimal(10,3) DEFAULT '0.000',
  `copay_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_amount` decimal(10,3) DEFAULT '0.000',
  `deductable_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_inclusive` enum('Y','N') DEFAULT 'N',
  `patient_tax` decimal(10,3) DEFAULT '0.000',
  `company_tax` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `patient_resp` decimal(10,3) DEFAULT '0.000',
  `patient_payable` decimal(10,3) DEFAULT '0.000',
  `comapany_resp` decimal(10,3) DEFAULT '0.000',
  `company_payble` decimal(10,3) DEFAULT '0.000',
  `sec_company` enum('Y','N') DEFAULT 'N' COMMENT 'Y = YES\\nN = NO',
  `sec_deductable_percentage` decimal(10,3) DEFAULT '0.000',
  `sec_deductable_amount` decimal(10,3) DEFAULT '0.000',
  `sec_company_res` decimal(10,3) DEFAULT '0.000',
  `sec_company_tax` decimal(10,3) DEFAULT '0.000',
  `sec_company_paybale` decimal(10,3) DEFAULT '0.000',
  `sec_copay_percntage` decimal(10,3) DEFAULT '0.000',
  `sec_copay_amount` decimal(10,3) DEFAULT '0.000',
  `advance_amount` decimal(10,3) DEFAULT '0.000',
  `balance_amount` decimal(10,3) DEFAULT '0.000',
  `actual_amount` decimal(10,3) DEFAULT '0.000',
  `actual_utilize_amount` decimal(10,3) DEFAULT '0.000',
  `utilize_amount` decimal(10,3) DEFAULT '0.000',
  `closed` enum('N','Y') DEFAULT 'N',
  `closed_type` enum('N','C','D','R') DEFAULT 'N' COMMENT 'N-None,C-Closed,D-Done, R-Refund',
  `closed_remarks` varchar(200) DEFAULT NULL,
  `package_type` enum('S','D') DEFAULT NULL COMMENT 'S-Static /n D- Dynamic',
  `package_visit_type` enum('S','M') DEFAULT NULL COMMENT 'S-Single /n M- Multi',
  `pack_expiry_date` date DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_package_header_id`),
  KEY `hims_f_package_header_fk1_idx` (`patient_id`),
  KEY `hims_f_package_header_fk2_idx` (`visit_id`),
  KEY `hims_f_package_header_fk_idx` (`doctor_id`),
  KEY `hims_f_package_header_fk5_idx` (`services_id`),
  KEY `hims_f_package_header_fk6_idx` (`insurance_provider_id`),
  KEY `hims_f_package_header_fk7_idx` (`insurance_sub_id`),
  KEY `hims_f_package_header_fk8_idx` (`network_id`),
  KEY `hims_f_package_header_fk9_idx` (`created_by`),
  KEY `hims_f_package_header_fk10_idx` (`updated_by`),
  KEY `hims_f_package_header_fk4_idx` (`service_type_id`),
  KEY `hims_d_insurance_network_office_idx` (`insurance_network_office_id`),
  KEY `hims_f_package_header_fk11_idx` (`package_id`),
  CONSTRAINT `hims_f_package_header_fk101` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_package_header_fk11` FOREIGN KEY (`package_id`) REFERENCES `hims_d_package_header` (`hims_d_package_header_id`),
  CONSTRAINT `hims_f_package_header_fk111` FOREIGN KEY (`insurance_network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`),
  CONSTRAINT `hims_f_package_header_fk13` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_package_header_fk21` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_package_header_fk31` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_package_header_fk41` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_f_package_header_fk51` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_package_header_fk61` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_package_header_fk71` FOREIGN KEY (`insurance_sub_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_package_header_fk81` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_package_header_fk91` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient`
--

DROP TABLE IF EXISTS `hims_f_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient` (
  `hims_d_patient_id` int NOT NULL AUTO_INCREMENT,
  `patient_code` varchar(45) NOT NULL,
  `registration_date` date NOT NULL,
  `title_id` int NOT NULL,
  `first_name` varchar(60) DEFAULT NULL,
  `middle_name` varchar(60) DEFAULT NULL,
  `last_name` varchar(60) DEFAULT NULL,
  `full_name` varchar(180) NOT NULL,
  `arabic_name` varchar(180) DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `religion_id` int DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `age` int DEFAULT NULL,
  `marital_status` varchar(15) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `secondary_contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_number` varchar(20) DEFAULT NULL,
  `relationship_with_patient` varchar(60) DEFAULT NULL,
  `visa_type_id` int DEFAULT NULL,
  `city_id` int DEFAULT NULL,
  `state_id` int DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `nationality_id` int DEFAULT NULL,
  `postal_code` varchar(15) DEFAULT NULL,
  `primary_identity_id` int DEFAULT NULL,
  `primary_id_no` varchar(50) DEFAULT NULL,
  `secondary_identity_id` int DEFAULT NULL,
  `secondary_id_no` varchar(50) DEFAULT NULL,
  `photo_file` varchar(1000) DEFAULT NULL,
  `primary_id_file` varchar(1000) DEFAULT NULL,
  `secondary_id_file` varchar(1000) DEFAULT NULL,
  `advance_amount` decimal(20,3) unsigned DEFAULT NULL,
  `consent` enum('OI','OU') DEFAULT 'OU' COMMENT 'OU=OPT OUT\\nOI= OPT IN',
  `patient_type` int DEFAULT NULL,
  `vat_applicable` enum('Y','N') DEFAULT NULL COMMENT 'Y=yes\nN=no',
  `employee_id` varchar(45) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_patient_id`),
  UNIQUE KEY `patient_code_UNIQUE` (`patient_code`),
  KEY `hims_d_patient_fk1_idx` (`title_id`),
  KEY `hims_d_patient_fk3_idx` (`updated_by`),
  KEY `hims_f_patient_fk2_idx` (`created_by`),
  KEY `hims_f_patient_fk5_idx` (`primary_identity_id`),
  KEY `hims_f_patient_fk6_idx` (`secondary_identity_id`),
  KEY `hims_f_patient_fk7_idx` (`visa_type_id`),
  KEY `hims_f_patient_fk8_idx` (`religion_id`),
  KEY `hims_f_patient_fk3_idx` (`nationality_id`),
  KEY `hims_f_patient_fk9_idx` (`patient_type`),
  KEY `hims_f_patient_fk10_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_patient_full_name` (`full_name`),
  KEY `hims_f_patient_arabic_name` (`arabic_name`),
  KEY `hims_f_patient_contact_number` (`contact_number`),
  KEY `hims_f_patient_employee_id` (`employee_id`) /*!80000 INVISIBLE */,
  KEY `hims_registration_index` (`registration_date` DESC),
  CONSTRAINT `hims_f_patient_fk1` FOREIGN KEY (`title_id`) REFERENCES `hims_d_title` (`his_d_title_id`),
  CONSTRAINT `hims_f_patient_fk10` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_patient_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_fk3` FOREIGN KEY (`nationality_id`) REFERENCES `hims_d_nationality` (`hims_d_nationality_id`),
  CONSTRAINT `hims_f_patient_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_fk5` FOREIGN KEY (`primary_identity_id`) REFERENCES `hims_d_identity_document` (`hims_d_identity_document_id`),
  CONSTRAINT `hims_f_patient_fk6` FOREIGN KEY (`secondary_identity_id`) REFERENCES `hims_d_identity_document` (`hims_d_identity_document_id`),
  CONSTRAINT `hims_f_patient_fk7` FOREIGN KEY (`visa_type_id`) REFERENCES `hims_d_visa_type` (`hims_d_visa_type_id`),
  CONSTRAINT `hims_f_patient_fk8` FOREIGN KEY (`religion_id`) REFERENCES `hims_d_religion` (`hims_d_religion_id`),
  CONSTRAINT `hims_f_patient_fk9` FOREIGN KEY (`patient_type`) REFERENCES `hims_d_patient_type` (`hims_d_patient_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_advance`
--

DROP TABLE IF EXISTS `hims_f_patient_advance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_advance` (
  `hims_f_patient_advance_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_patient_id` int DEFAULT NULL,
  `hims_f_receipt_header_id` int DEFAULT NULL,
  `transaction_type` enum('AD','RF','CA') DEFAULT 'AD' COMMENT 'AD= ADVANCE\nRF= REFUND\nCA=CANCEL',
  `advance_amount` decimal(10,2) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE\nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_advance_id`),
  KEY `hims_f_advance_fk1_idx` (`created_by`),
  KEY `hims_f_advance_fk3_idx` (`hims_f_patient_id`),
  KEY `hims_f_advance_fk4_idx` (`hims_f_receipt_header_id`),
  KEY `hims_f_advance_fk2_idx` (`updated_by`),
  KEY `hims_f_patient_advance_fk5_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_advance_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_advance_fk3` FOREIGN KEY (`hims_f_patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_advance_fk4` FOREIGN KEY (`hims_f_receipt_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_patient_advance_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='		';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_allergy`
--

DROP TABLE IF EXISTS `hims_f_patient_allergy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_allergy` (
  `hims_f_patient_allergy_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `allergy_id` int DEFAULT NULL,
  `onset` enum('C','P','T','A','O') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '\nC=CHILDHOOD\nP=PRETERMS\nT=TEENS\nA=ADULTHOOD\nO=ONSET DATE(custom date)',
  `onset_date` date DEFAULT NULL,
  `severity` enum('MI','MO','SE') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'MI=MILD\nMO=MODERATE\nSE=SEVERE',
  `comment` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `allergy_inactive` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=yes\nN=no',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE\nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_allergy_id`),
  KEY `hims_f_patient_allergy_fk1_idx` (`allergy_id`),
  KEY `hims_f_patient_allergy_fk2_idx` (`created_by`),
  KEY `hims_f_patient_allergy_fk3_idx` (`updated_by`),
  KEY `hims_f_patient_allergy_fk2_idx1` (`patient_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_allergy_fk1` FOREIGN KEY (`allergy_id`) REFERENCES `hims_d_allergy` (`hims_d_allergy_id`),
  CONSTRAINT `hims_f_patient_allergy_fk2` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_allergy_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_allergy_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_appointment`
--

DROP TABLE IF EXISTS `hims_f_patient_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_appointment` (
  `hims_f_patient_appointment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `patient_code` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `title_id` int DEFAULT NULL,
  `number_of_slot` int DEFAULT NULL,
  `appointment_date` date DEFAULT NULL,
  `appointment_from_time` time DEFAULT NULL,
  `appointment_to_time` time DEFAULT NULL,
  `appointment_status_id` int DEFAULT NULL,
  `patient_name` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `arabic_name` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int DEFAULT NULL,
  `contact_number` bigint unsigned DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `send_to_provider` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `gender` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `confirmed` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `confirmed_by` int DEFAULT NULL,
  `comfirmed_date` datetime DEFAULT NULL,
  `cancelled` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `cancelled_by` int DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `cancel_reason` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `appointment_remarks` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `visit_created` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `is_stand_by` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_appointment_id`),
  KEY `hims_f_patient_appointment_fk1_idx` (`provider_id`),
  KEY `hims_f_patient_appointment_fk2_idx` (`patient_id`),
  KEY `hims_f_patient_appointment_fk3_idx` (`sub_department_id`),
  KEY `hims_f_patient_appointment_fk4_idx` (`created_by`),
  KEY `hims_f_patient_appointment_fk5_idx` (`updated_by`),
  KEY `hims_f_patient_appointment_fk6_idx` (`appointment_status_id`),
  KEY `hims_f_patient_appointment_fk8_idx` (`title_id`),
  KEY `hims_f_patient_appointment_fk11_idx` (`hospital_id`),
  KEY `hims_f_patient_appointment_fk9_idx` (`cancelled_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_appointment_fk1` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_patient_appointment_fk11` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_patient_appointment_fk2` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_appointment_fk3` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_f_patient_appointment_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_appointment_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_appointment_fk6` FOREIGN KEY (`appointment_status_id`) REFERENCES `hims_d_appointment_status` (`hims_d_appointment_status_id`),
  CONSTRAINT `hims_f_patient_appointment_fk8` FOREIGN KEY (`title_id`) REFERENCES `hims_d_title` (`his_d_title_id`),
  CONSTRAINT `hims_f_patient_appointment_fk9` FOREIGN KEY (`cancelled_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_diagnosis`
--

DROP TABLE IF EXISTS `hims_f_patient_diagnosis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_diagnosis` (
  `hims_f_patient_diagnosis_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `daignosis_id` int DEFAULT NULL,
  `diagnosis_type` enum('P','S') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'P= PRIMARY\nS = SECONDARY',
  `final_daignosis` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'N = NO\nY = YES\n',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A = ACTIVE \nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_diagnosis_id`),
  KEY `hims_f_patient_diagnosis_fk1_idx` (`created_by`),
  KEY `hims_f_patient_diagnosis_fk2_idx` (`updated_by`),
  KEY `hims_f_patient_diagnosis_fk3_idx` (`patient_id`),
  KEY `hims_f_patient_diagnosis_fk3_idx1` (`daignosis_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_diagnosis_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_diagnosis_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_diagnosis_fk3` FOREIGN KEY (`daignosis_id`) REFERENCES `hims_d_icd` (`hims_d_icd_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_diet`
--

DROP TABLE IF EXISTS `hims_f_patient_diet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_diet` (
  `hims_f_patient_diet_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `diet_id` int DEFAULT NULL,
  `comments` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `till_date` datetime DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_diet_id`),
  KEY `hims_f_patient_diet_fk1_idx` (`patient_id`),
  KEY `hims_f_patient_diet_fk2_idx` (`created_by`),
  KEY `hims_f_patient_diet_fk3_idx` (`updated_by`),
  KEY `hims_f_patient_diet_fk4_idx` (`diet_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_encounter`
--

DROP TABLE IF EXISTS `hims_f_patient_encounter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_encounter` (
  `hims_f_patient_encounter_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `source` enum('O','I') DEFAULT 'O' COMMENT 'O = OUT PATIENT\nI = IN PATIENT',
  `status` enum('V','W','C','CA','CO') DEFAULT 'V' COMMENT 'V = VISIT CREATED\nW = Work in progress\nC = CLOSE\nCA = CANCELLED\nCO = COMPLETED',
  `episode_id` int DEFAULT NULL,
  `encounter_id` int DEFAULT NULL,
  `checked_in` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO\nY = YES',
  `other_signs` varchar(300) DEFAULT NULL,
  `significant_signs` varchar(300) DEFAULT NULL,
  `nurse_examine` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO\nY =YES',
  `age` int(3) unsigned zerofill DEFAULT NULL,
  `payment_type` enum('S','I') DEFAULT 'S' COMMENT 'S = SELF\nI = INSURANCE',
  `queue_no` int DEFAULT NULL,
  `examination_notes` mediumtext,
  `assesment_notes` mediumtext,
  `hpi_notes` mediumtext,
  `review_notes` mediumtext,
  `nurse_notes` mediumtext,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancelled_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cancelled_by` int DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_encounter_id`),
  KEY `hims_f_patient_encounter_fk1_idx` (`patient_id`),
  KEY `hims_f_patient_encounter_fk2_idx` (`provider_id`),
  KEY `hims_f_patient_encounter_fk3_idx` (`visit_id`),
  KEY `hims_f_patient_encounter_fk4_idx` (`updated_by`),
  KEY `hims_f_patient_encounter_fk7_idx` (`created_by`),
  KEY `hims_f_patient_encounter_fk8_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_encounter_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_encounter_fk2` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_patient_encounter_fk3` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_patient_encounter_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_encounter_fk7` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_encounter_fk8` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_followup`
--

DROP TABLE IF EXISTS `hims_f_patient_followup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_followup` (
  `him_f_patient_followup_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `followup_type` enum('OP','IP') DEFAULT 'OP' COMMENT 'OP = OUT PATIENT\nIP = IN PATIENT',
  `followup_date` date NOT NULL,
  `reason` text,
  `sub_department_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`him_f_patient_followup_id`),
  KEY `index3` (`followup_date`),
  KEY `him_f_patient_followup_fk1_idx` (`patient_id`),
  KEY `him_f_patient_followup_fk2_idx` (`doctor_id`),
  KEY `record_status_index` (`record_status`),
  KEY `him_f_patient_followup_fk3_idx` (`sub_department_id`),
  CONSTRAINT `him_f_patient_followup_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `him_f_patient_followup_fk2` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `him_f_patient_followup_fk3` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_history`
--

DROP TABLE IF EXISTS `hims_f_patient_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_history` (
  `hims_f_patient_history_id` int NOT NULL AUTO_INCREMENT,
  `history_type` enum('SOH','MEH','SGH','FMH','BRH') DEFAULT NULL COMMENT 'SOH = SOCIAL HISTORY,\nMEH = MEDICAL HISTORY,\nSGH= SURGICAL HISTORY,\nFMH= FAMILY HISTORY,\nBRH = ''BIRTH HISTORY''',
  `provider_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `remarks` text,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_history_id`),
  KEY `hims_f_patient_history_fk1_idx` (`patient_id`),
  KEY `hims_f_patient_history_fk2_idx` (`provider_id`),
  KEY `hims_f_patient_history_fk3_idx` (`created_by`),
  KEY `hims_f_patient_history_fk4_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_history_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_history_fk2` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_patient_history_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_history_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_pakage_advance`
--

DROP TABLE IF EXISTS `hims_f_patient_pakage_advance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_pakage_advance` (
  `hims_f_patient_pakage_advance_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_patient_id` int DEFAULT NULL,
  `hims_f_receipt_header_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `transaction_type` enum('AD','RF','CA') DEFAULT 'AD' COMMENT 'AD= ADVANCE\\nRF= REFUND\\nCA=CANCEL',
  `advance_amount` decimal(10,2) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `update_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE\\nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_pakage_advance_id`),
  KEY `hims_f_patient_pakage_advance_fk1_idx` (`hims_f_patient_id`),
  KEY `hims_f_patient_pakage_advance_fk2_idx` (`hims_f_receipt_header_id`),
  KEY `hims_f_patient_pakage_advance_fk4_idx` (`hospital_id`),
  KEY `hims_f_patient_pakage_advance_fk5_idx` (`created_by`),
  KEY `hims_f_patient_pakage_advance_fk6_idx` (`updated_by`),
  KEY `hims_f_patient_pakage_advance_fk3_idx` (`package_id`),
  CONSTRAINT `hims_f_patient_pakage_advance_fk1` FOREIGN KEY (`hims_f_patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_pakage_advance_fk2` FOREIGN KEY (`hims_f_receipt_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_patient_pakage_advance_fk3` FOREIGN KEY (`package_id`) REFERENCES `hims_f_package_header` (`hims_f_package_header_id`),
  CONSTRAINT `hims_f_patient_pakage_advance_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_patient_pakage_advance_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_pakage_advance_fk6` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_referral`
--

DROP TABLE IF EXISTS `hims_f_patient_referral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_referral` (
  `hims_f_patient_referral_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `referral_type` enum('I','E') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'I = INTERNAL\nE = EXTERNAL',
  `sub_department_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `hospital_name` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `external_doc_name` varchar(45) DEFAULT NULL,
  `reason` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'A = ACTIVE\nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_referral_id`),
  KEY `hims_f_patient_referral_fk1_idx` (`created_by`),
  KEY `hims_f_patient_referral_fk2_idx` (`updated_by`),
  KEY `hims_f_patient_referral_fk3_idx` (`patient_id`),
  KEY `hims_f_patient_referral_fk4_idx` (`doctor_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_sick_leave`
--

DROP TABLE IF EXISTS `hims_f_patient_sick_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_sick_leave` (
  `hims_f_patient_sick_leave_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `no_of_days` tinyint DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_sick_leave_id`),
  KEY `hims_f_patient_sick_leave_fk1_idx` (`patient_id`),
  KEY `hims_f_patient_sick_leave_fk2_idx` (`visit_id`),
  CONSTRAINT `hims_f_patient_sick_leave_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_sick_leave_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_visit`
--

DROP TABLE IF EXISTS `hims_f_patient_visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_visit` (
  `hims_f_patient_visit_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `visit_code` varchar(45) DEFAULT NULL,
  `visit_type` int NOT NULL,
  `age_in_years` int DEFAULT NULL,
  `age_in_months` int DEFAULT NULL,
  `age_in_days` int DEFAULT NULL,
  `visit_date` datetime NOT NULL,
  `visit_expiery_date` date DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `doctor_id` int NOT NULL,
  `maternity_patient` enum('Y','N') NOT NULL DEFAULT 'N',
  `is_mlc` enum('Y','N') NOT NULL DEFAULT 'N',
  `mlc_accident_reg_no` varchar(250) DEFAULT NULL COMMENT 'Applicable only for mlc',
  `mlc_police_station` varchar(250) DEFAULT NULL COMMENT 'Applicable only for mlc',
  `mlc_wound_certified_date` date DEFAULT NULL,
  `existing_plan` enum('N','Y') DEFAULT 'N',
  `treatment_plan_id` int DEFAULT NULL,
  `insured` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO\nY = YES',
  `sec_insured` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO\nY = YES',
  `appointment_patient` enum('N','Y') DEFAULT 'N' COMMENT 'N = NO\nY = YES',
  `new_visit_patient` enum('N','Y','P') DEFAULT 'N' COMMENT 'N = NO\\nY = YES \\ n P = PACKAGE VISIT',
  `appointment_id` int DEFAULT NULL COMMENT 'ToDo link with appointment table.',
  `no_free_visit` smallint DEFAULT '0',
  `invoice_generated` enum('Y','N') NOT NULL DEFAULT 'N',
  `visit_status` enum('O','C','CN') NOT NULL DEFAULT 'O' COMMENT 'O-Open, C-Closed, CN-Cancelled',
  `eligible` enum('N','Y') DEFAULT 'N',
  `eligible_reference_number` varchar(45) DEFAULT NULL,
  `ins_services_amount` decimal(10,3) DEFAULT '0.000',
  `approval_limit_yesno` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_patient_visit_id`),
  KEY `hims_f_patient_visit_fk1_idx` (`patient_id`),
  KEY `hims_f_patient_visit_fk2_idx` (`visit_type`),
  KEY `hims_f_patient_visit_fk3_idx` (`department_id`),
  KEY `hims_f_patient_visit_fk4_idx` (`sub_department_id`),
  KEY `hims_f_patient_visit_fk5_idx` (`doctor_id`),
  KEY `index7` (`visit_date`),
  KEY `hims_f_patient_visit_fk6_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_patient_visit_visit_code` (`visit_code`),
  KEY `hims_f_patient_visit_visit_date` (`visit_date`),
  CONSTRAINT `hims_f_patient_visit_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_visit_fk2` FOREIGN KEY (`visit_type`) REFERENCES `hims_d_visit_type` (`hims_d_visit_type_id`),
  CONSTRAINT `hims_f_patient_visit_fk3` FOREIGN KEY (`department_id`) REFERENCES `hims_d_department` (`hims_d_department_id`),
  CONSTRAINT `hims_f_patient_visit_fk4` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_f_patient_visit_fk5` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_patient_visit_fk8` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_visit_message`
--

DROP TABLE IF EXISTS `hims_f_patient_visit_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_visit_message` (
  `hims_f_patient_visit_message_id` int NOT NULL AUTO_INCREMENT,
  `patient_visit_id` int DEFAULT NULL,
  `patient_message` varchar(1000) DEFAULT NULL,
  `is_critical_message` enum('N','Y') DEFAULT 'N',
  `message_active_till` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_visit_message_id`),
  KEY `hims_f_patient_visit_message_fk1_idx` (`patient_visit_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_visit_message_fk1` FOREIGN KEY (`patient_visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_vitals`
--

DROP TABLE IF EXISTS `hims_f_patient_vitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_vitals` (
  `hims_f_patient_vitals_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL COMMENT '\nvital_value_Two\nformula_value',
  `visit_date` datetime DEFAULT NULL,
  `visit_time` time DEFAULT NULL,
  `case_type` enum('OP','IP') DEFAULT NULL,
  `vital_id` int DEFAULT NULL,
  `vital_value` decimal(10,2) DEFAULT NULL,
  `vital_value_one` varchar(45) DEFAULT NULL,
  `vital_value_two` varchar(45) DEFAULT NULL,
  `formula_value` varchar(10) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_Date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_patient_vitals_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=273 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_patient_vitals_old`
--

DROP TABLE IF EXISTS `hims_f_patient_vitals_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_patient_vitals_old` (
  `hims_f_patient_vitals_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `visit_time` time DEFAULT NULL,
  `case_type` enum('OP','IP') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'OP = OUT PATIENT\nIP = IN PATIENT',
  `height` decimal(5,2) DEFAULT NULL,
  `height_uom` enum('CM','M') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'CM',
  `weight` decimal(5,2) DEFAULT NULL,
  `weight_uom` enum('KG','lbs') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'KG',
  `bmi` decimal(5,2) DEFAULT NULL,
  `oxysat` decimal(5,2) DEFAULT NULL,
  `temperature_from` enum('O','R','A','T') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'O' COMMENT '0 = ORAL,\nR = RECTAL,\nA=AXILLARY\nT= TYMPHANIC\n',
  `temperature_farenhiet` decimal(5,2) DEFAULT NULL,
  `temperature_celsisus` decimal(5,2) DEFAULT NULL,
  `systolic` decimal(5,2) DEFAULT NULL,
  `diastolic` decimal(5,2) DEFAULT NULL,
  `systolic_stand` decimal(5,2) DEFAULT NULL,
  `diastolic_stand` decimal(5,2) DEFAULT NULL,
  `systolic_supine` decimal(5,2) DEFAULT NULL,
  `diastolic_supine` decimal(5,2) DEFAULT NULL,
  `glucose_fbs` decimal(5,2) DEFAULT NULL,
  `glucose_rbs` decimal(5,2) DEFAULT NULL,
  `glucose_pbs` decimal(5,2) DEFAULT NULL,
  `head_circumference` decimal(5,2) DEFAULT NULL,
  `bsa` decimal(5,2) DEFAULT NULL,
  `heart_rate` decimal(5,2) DEFAULT NULL,
  `respiratory_rate` decimal(5,2) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_f_patient_vitals_id`),
  KEY `hims_f_patient_vitals_fk1_idx` (`patient_id`),
  KEY `hims_f_patient_vitals_fk2_idx` (`visit_id`),
  KEY `hims_f_patient_vitals_fk3_idx` (`created_by`),
  KEY `hims_f_patient_vitals_fk4_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_patient_vitals_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_patient_vitals_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_patient_vitals_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_patient_vitals_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pending_leave`
--

DROP TABLE IF EXISTS `hims_f_pending_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pending_leave` (
  `hims_f_pending_leave_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `year` smallint DEFAULT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `leave_application_id` int NOT NULL,
  `adjusted` enum('N','Y') DEFAULT 'N',
  `adjusted_year` smallint unsigned DEFAULT NULL,
  `adjusted_month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `updaid_leave_duration` decimal(4,1) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pending_leave_id`),
  KEY `hims_f_pending_leave_fk1_idx` (`leave_application_id`),
  KEY `hims_f_pending_leave_fk2_idx` (`employee_id`),
  KEY `index4` (`year`),
  KEY `index5` (`month`),
  CONSTRAINT `hims_f_pending_leave_fk1` FOREIGN KEY (`leave_application_id`) REFERENCES `hims_f_leave_application` (`hims_f_leave_application_id`),
  CONSTRAINT `hims_f_pending_leave_fk2` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharamcy_material_header`
--

DROP TABLE IF EXISTS `hims_f_pharamcy_material_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharamcy_material_header` (
  `hims_f_pharamcy_material_header_id` int NOT NULL AUTO_INCREMENT,
  `material_requisition_number` varchar(20) DEFAULT NULL,
  `from_location_type` enum('WH','MS','SS') DEFAULT 'SS',
  `from_location_id` int DEFAULT NULL,
  `requistion_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiration_date` date DEFAULT NULL,
  `required_date` date DEFAULT NULL,
  `requested_by` int DEFAULT NULL,
  `on_hold` enum('N','Y') DEFAULT 'N',
  `to_location_type` enum('WH','MS','SS') DEFAULT 'WH',
  `to_location_id` int DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `is_completed` enum('N','Y') DEFAULT 'N',
  `completed_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `completed_lines` smallint DEFAULT NULL,
  `requested_lines` smallint DEFAULT NULL,
  `purchase_created_lines` smallint DEFAULT NULL,
  `status` enum('PEN','APR') DEFAULT 'PEN' COMMENT 'PEN = PENDING APPROVAL\nAPR = APPROVED',
  `requistion_type` enum('MR','PR') DEFAULT 'MR' COMMENT 'MR = MATERIAL REQUISITION\nPR = PURCHASE REQUISTION',
  `no_of_transfers` smallint DEFAULT NULL,
  `no_of_po` smallint DEFAULT NULL,
  `authorize1` enum('N','Y') DEFAULT NULL,
  `authorize1_date` datetime DEFAULT NULL,
  `authorize1_by` int DEFAULT NULL,
  `authorie2` enum('N','Y') DEFAULT NULL,
  `authorize2_date` datetime DEFAULT NULL,
  `authorize2_by` int DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT NULL,
  `cancelled_by` int DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharamcy_material_header_id`),
  UNIQUE KEY `material_requisition_number_UNIQUE` (`material_requisition_number`),
  KEY `hims_f_pharamcy_material_header_fk1_idx` (`requested_by`),
  KEY `hims_f_pharamcy_material_header_fk2_idx` (`authorize1_by`),
  KEY `hims_f_pharamcy_material_header_fk3_idx` (`authorize2_by`),
  KEY `hims_f_pharamcy_material_header_fk4_idx` (`cancelled_by`),
  CONSTRAINT `hims_f_pharamcy_material_header_fk1` FOREIGN KEY (`requested_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharamcy_material_header_fk2` FOREIGN KEY (`authorize1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharamcy_material_header_fk3` FOREIGN KEY (`authorize2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharamcy_material_header_fk4` FOREIGN KEY (`cancelled_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_consumption_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_consumption_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_consumption_detail` (
  `hims_f_pharmacy_consumption_detail_id` int NOT NULL AUTO_INCREMENT,
  `pharmacy_consumption_header_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'SS',
  `item_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `grn_no` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `unit_cost` decimal(10,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_consumption_detail_id`),
  KEY `hims_f_pharmacy_consumption_detail_fk1_idx` (`pharmacy_consumption_header_id`),
  KEY `hims_f_pharmacy_consumption_detail_fk2_idx` (`location_id`),
  KEY `hims_f_pharmacy_consumption_detail_fk3_idx` (`item_id`),
  KEY `hims_f_pharmacy_consumption_detail_fk4_idx` (`item_category_id`),
  KEY `hims_f_pharmacy_consumption_detail_fk5_idx` (`item_group_id`),
  KEY `hims_f_pharmacy_consumption_detail_fk6_idx` (`uom_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_detail_fk1` FOREIGN KEY (`pharmacy_consumption_header_id`) REFERENCES `hims_f_pharmacy_consumption_header` (`hims_f_pharmacy_consumption_header_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_detail_fk2` FOREIGN KEY (`location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_detail_fk3` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_detail_fk4` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_detail_fk5` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_detail_fk6` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_consumption_header`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_consumption_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_consumption_header` (
  `hims_f_pharmacy_consumption_header_id` int NOT NULL AUTO_INCREMENT,
  `consumption_number` varchar(20) DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'SS',
  `doctor_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `consumption_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `year` varchar(4) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT '''1''=JAN\\\\n''2''=FEB\\\\n''3''=MAR\\\\n''4'',=APR\\\\n''5'',=MAY\\\\n''6'',=JUN\\\\n''7'',=JUL\\\\n''8'',=AUG\\\\n''9'',=SEP\\\\n''10'',=OCT\\\\n''11'',=NOV\\\\n''12''=DEC',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_consumption_header_id`),
  KEY `hims_f_pharmacy_consumption_header_fk1_idx` (`location_id`),
  KEY `hims_f_pharmacy_consumption_header_fk2_idx` (`created_by`),
  KEY `hims_f_pharmacy_consumption_header_fk3_idx` (`updated_by`),
  KEY `hims_f_pharmacy_consumption_header_id_idx` (`hospital_id`),
  KEY `hims_f_pharmacy_consumption_header_fk5_idx` (`doctor_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_header_fk1` FOREIGN KEY (`location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_header_fk5` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_pharmacy_consumption_header_id` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_material_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_material_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_material_detail` (
  `hims_f_pharmacy_material_detail_id` int NOT NULL AUTO_INCREMENT,
  `pharmacy_header_id` int DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT 'N',
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `from_qtyhand` decimal(10,3) DEFAULT NULL,
  `to_qtyhand` decimal(10,3) DEFAULT NULL,
  `quantity_required` decimal(10,3) DEFAULT NULL,
  `quantity_authorized` decimal(10,3) DEFAULT NULL,
  `item_uom` int DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `po_created_date` datetime DEFAULT NULL,
  `po_created` enum('N','Y') DEFAULT 'N',
  `po_created_quantity` decimal(10,3) DEFAULT NULL,
  `po_outstanding_quantity` decimal(10,3) DEFAULT NULL,
  `po_completed` enum('N','Y') DEFAULT 'N',
  PRIMARY KEY (`hims_f_pharmacy_material_detail_id`),
  KEY `hims_f_pharmacy_material_detail_fk1_idx` (`pharmacy_header_id`),
  KEY `hims_f_pharmacy_material_detail_fk2_idx` (`item_id`),
  CONSTRAINT `hims_f_pharmacy_material_detail_fk1` FOREIGN KEY (`pharmacy_header_id`) REFERENCES `hims_f_pharamcy_material_header` (`hims_f_pharamcy_material_header_id`),
  CONSTRAINT `hims_f_pharmacy_material_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_numgen`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_numgen` (
  `hims_f_pharmacy_numgen_id` int NOT NULL AUTO_INCREMENT,
  `numgen_code` varchar(45) NOT NULL,
  `module_desc` varchar(250) NOT NULL,
  `prefix` varchar(45) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` varchar(45) NOT NULL,
  `postfix` varchar(200) NOT NULL COMMENT 'Number',
  `length` int NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` int NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(45) DEFAULT NULL,
  `postfix_start` varchar(200) NOT NULL,
  `postfix_end` varchar(200) NOT NULL,
  `current_num` varchar(500) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(500) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_pharmacy_numgen_id`),
  KEY `hims_f_pharmacy_numgen_fk1_idx` (`created_by`),
  KEY `hims_f_pharmacy_numgen_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_f_pharmacy_numgen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_numgen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_pos_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_pos_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_pos_detail` (
  `hims_f_pharmacy_pos_detail_id` int NOT NULL AUTO_INCREMENT,
  `pharmacy_pos_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `item_category` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `grn_no` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `insurance_yesno` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tax_inclusive` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(10,3) DEFAULT NULL,
  `discount_percentage` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_extended_cost` decimal(10,3) DEFAULT NULL,
  `copay_percent` decimal(5,3) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT NULL,
  `patient_responsibility` decimal(10,3) DEFAULT NULL,
  `patient_tax` decimal(10,3) DEFAULT NULL,
  `patient_payable` decimal(10,3) DEFAULT NULL,
  `company_responsibility` decimal(10,3) DEFAULT NULL,
  `company_tax` decimal(10,3) DEFAULT NULL,
  `company_payable` decimal(10,3) DEFAULT NULL,
  `sec_copay_percent` decimal(5,3) DEFAULT NULL,
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `sec_company_tax` decimal(10,3) DEFAULT NULL,
  `sec_company_payable` decimal(10,3) DEFAULT NULL,
  `return_quantity` decimal(5,2) DEFAULT NULL,
  `return_done` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `return_extended_cost` decimal(10,3) DEFAULT NULL,
  `return_discount_amt` decimal(10,3) DEFAULT NULL,
  `return_net_extended_cost` decimal(10,3) DEFAULT NULL,
  `return_pat_responsibility` decimal(10,3) DEFAULT NULL,
  `return_company_responsibility` decimal(10,3) DEFAULT NULL,
  `return_sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `s_patient_tax` decimal(10,3) DEFAULT '0.000',
  `insured` enum('N','Y') DEFAULT 'N',
  `pre_approval` enum('N','Y') DEFAULT 'N',
  `prescribed_qty` decimal(10,3) DEFAULT NULL,
  `prescription_detail_id` int DEFAULT NULL,
  `average_cost` decimal(20,6) DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_f_pharmacy_pos_detail_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_pos_header`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_pos_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_pos_header` (
  `hims_f_pharmacy_pos_header_id` int NOT NULL AUTO_INCREMENT,
  `pos_number` varchar(22) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cancelled` enum('Y','N') DEFAULT 'N' COMMENT 'Y=YES,\nN=NO',
  `pos_customer_type` enum('OP','OT','IP') DEFAULT 'OT' COMMENT 'OP = OUT PATIENT\\nIP = IN PATIENT \\nOT = Outside Customer',
  `patient_id` int DEFAULT NULL,
  `patient_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mobile_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `referal_doctor` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `ip_id` int DEFAULT NULL,
  `pos_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `year` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '''1''=JAN\n''2''=FEB\n''3''=MAR\n''4'',=APR\n''5'',=MAY\n''6'',=JUN\n''7'',=JUL\n''8'',=AUG\n''9'',=SEP\n''10'',=OCT\n''11'',=NOV\n''12''=DEC',
  `location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'MS = MAIN STORE\nSS= SUB STORE\n',
  `insurance_yesno` enum('N','Y') DEFAULT 'N',
  `sub_total` decimal(10,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT NULL,
  `patient_responsibility` decimal(10,3) DEFAULT NULL,
  `patient_tax` decimal(10,3) DEFAULT NULL,
  `patient_payable` decimal(10,3) DEFAULT NULL,
  `company_responsibility` decimal(10,3) DEFAULT NULL,
  `company_tax` decimal(10,3) DEFAULT NULL,
  `company_payable` decimal(10,3) DEFAULT NULL,
  `comments` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `sec_company_tax` decimal(10,3) DEFAULT NULL,
  `sec_company_payable` decimal(10,3) DEFAULT NULL,
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `net_tax` decimal(10,3) DEFAULT '0.000',
  `gross_total` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_amount` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_percentage` decimal(10,3) DEFAULT '0.000',
  `advance_amount` decimal(10,3) DEFAULT '0.000',
  `advance_adjust` decimal(10,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `credit_amount` decimal(10,3) DEFAULT '0.000',
  `balance_credit` decimal(10,3) DEFAULT NULL,
  `receiveable_amount` decimal(10,3) DEFAULT '0.000',
  `s_patient_tax` decimal(10,3) DEFAULT '0.000',
  `posted` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `card_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `effective_start_date` date DEFAULT NULL,
  `effective_end_date` date DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `sub_insurance_provider_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `network_type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `network_office_id` int DEFAULT NULL,
  `policy_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_card_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_network_id` int DEFAULT NULL,
  `secondary_network_type` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `secondary_sub_insurance_provider_id` int DEFAULT NULL,
  `secondary_network_office_id` int DEFAULT NULL,
  `receipt_header_id` int DEFAULT NULL,
  `invoice_generated` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `nationality_id` int DEFAULT NULL,
  `return_done` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_pos_header_id`),
  KEY `hims_f_pharmacy_pos_header_fk1_idx` (`insurance_provider_id`),
  KEY `hims_f_pharmacy_pos_header_fk2_idx` (`secondary_insurance_provider_id`),
  KEY `hims_f_pharmacy_pos_header_fk3_idx` (`network_id`),
  KEY `hims_f_pharmacy_pos_header_fk4_idx` (`secondary_network_id`),
  KEY `hims_f_pharmacy_pos_header_fk5_idx` (`sub_insurance_provider_id`),
  KEY `hims_f_pharmacy_pos_header_fk6_idx` (`secondary_sub_insurance_provider_id`),
  KEY `hims_f_pharmacy_pos_header_fk8_idx` (`network_office_id`),
  KEY `hims_f_pharmacy_pos_header_fk9_idx` (`secondary_network_office_id`),
  KEY `hims_f_pharmacy_pos_header_fk10_idx` (`receipt_header_id`),
  KEY `hims_f_pharmacy_pos_header_fk10_idx1` (`nationality_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk1` FOREIGN KEY (`insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk10` FOREIGN KEY (`receipt_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk11` FOREIGN KEY (`nationality_id`) REFERENCES `hims_d_nationality` (`hims_d_nationality_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk2` FOREIGN KEY (`secondary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk3` FOREIGN KEY (`network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk4` FOREIGN KEY (`secondary_network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk5` FOREIGN KEY (`sub_insurance_provider_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk6` FOREIGN KEY (`secondary_sub_insurance_provider_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk8` FOREIGN KEY (`network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`),
  CONSTRAINT `hims_f_pharmacy_pos_header_fk9` FOREIGN KEY (`secondary_network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_sales_return_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_sales_return_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_sales_return_detail` (
  `hims_f_pharmacy_sales_return_detail_id` int NOT NULL AUTO_INCREMENT,
  `sales_return_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `item_category` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `grn_no` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `return_quantity` decimal(10,3) DEFAULT NULL,
  `insurance_yesno` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `tax_inclusive` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(10,3) DEFAULT NULL,
  `discount_percent` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_extended_cost` decimal(10,3) DEFAULT NULL,
  `copay_percent` decimal(5,3) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT NULL,
  `patient_responsibility` decimal(10,3) DEFAULT NULL,
  `patient_tax` decimal(10,3) DEFAULT NULL,
  `patient_payable` decimal(10,3) DEFAULT NULL,
  `company_responsibility` decimal(10,3) DEFAULT NULL,
  `company_tax` decimal(10,3) DEFAULT NULL,
  `company_payable` decimal(10,3) DEFAULT NULL,
  `sec_copay_percent` decimal(5,3) DEFAULT NULL,
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `sec_company_tax` decimal(10,3) DEFAULT NULL,
  `sec_company_payable` decimal(10,3) DEFAULT NULL,
  `return_done` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'N',
  `return_extended_cost` decimal(10,3) DEFAULT NULL,
  `return_discount_amt` decimal(10,3) DEFAULT NULL,
  `return_net_extended_cost` decimal(10,3) DEFAULT NULL,
  `return_pat_responsibility` decimal(10,3) DEFAULT NULL,
  `return_company_responsibility` decimal(10,3) DEFAULT NULL,
  `return_sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `return_patient_tax` decimal(10,3) DEFAULT NULL,
  `return_company_tax` decimal(10,3) DEFAULT NULL,
  `return_sec_company_tax` decimal(10,3) DEFAULT NULL,
  `return_patient_payable` decimal(10,3) DEFAULT NULL,
  `return_company_payable` decimal(10,3) DEFAULT NULL,
  `return_sec_company_payable` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_sales_return_detail_id`),
  KEY `hims_f_pharmacy_sales_return_detail_fk1_idx` (`sales_return_header_id`),
  KEY `hims_f_pharmacy_sales_return_detail_fk2_idx` (`item_id`),
  CONSTRAINT `hims_f_pharmacy_sales_return_detail_fk1` FOREIGN KEY (`sales_return_header_id`) REFERENCES `hims_f_pharmcy_sales_return_header` (`hims_f_pharmcy_sales_return_header_id`),
  CONSTRAINT `hims_f_pharmacy_sales_return_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_stock_adjust_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_stock_adjust_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_stock_adjust_detail` (
  `hims_f_pharmacy_stock_adjust_detail_id` int NOT NULL AUTO_INCREMENT,
  `pharmacy_stock_adjust_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `adjustment_type` enum('IQ','DQ','IA','DA','BI','BD') DEFAULT NULL COMMENT 'IQ - Increase Quantity, \nDQ - Decrease Quantity, \nIA - Increase Amount, \nDA - Decrease Amount, \nBI - Both Increase, \nBD - Both Decrease, \n',
  `sales_uom` int DEFAULT NULL,
  `expirydate` date DEFAULT NULL,
  `quantity` decimal(10,4) DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_stock_adjust_detail_id`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk1_idx` (`pharmacy_stock_adjust_header_id`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk2_idx` (`item_id`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk3_idx` (`item_category_id`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk4_idx` (`item_group_id`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk_idx` (`uom_id`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk6_idx` (`created_by`),
  KEY `hims_f_pharmacy_stock_adjust_detail_fk7_idx` (`updated_by`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk1` FOREIGN KEY (`pharmacy_stock_adjust_header_id`) REFERENCES `hims_f_pharmacy_stock_adjust_header` (`hims_f_pharmacy_stock_adjust_header_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk3` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk5` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk6` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_detail_fk7` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_stock_adjust_header`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_stock_adjust_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_stock_adjust_header` (
  `hims_f_pharmacy_stock_adjust_header_id` int NOT NULL AUTO_INCREMENT,
  `adjustment_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `adjustment_date` date DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1' COMMENT '1= april\\n12=march\\n\\nfinancial year',
  `location_id` int DEFAULT NULL,
  `location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE \\\\\\\\nSS = SUB STORE \\\\\\\\nWH = Warehouse\\\\\\\\n',
  `comments` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `posted` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_stock_adjust_header_id`),
  KEY `hims_f_pharmacy_stock_adjust_header_fk1_idx` (`created_by`),
  KEY `hims_f_pharmacy_stock_adjust_header_fk2_idx` (`updated_by`),
  KEY `hims_f_pharmacy_stock_adjust_header_fk3_idx` (`hospital_id`),
  KEY `hims_f_pharmacy_stock_adjust_header_fk4_idx` (`location_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_header_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_pharmacy_stock_adjust_header_fk4` FOREIGN KEY (`location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_stock_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_stock_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_stock_detail` (
  `hims_f_pharmacy_stock_detail_id` int NOT NULL AUTO_INCREMENT,
  `pharmacy_stock_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `location_type` enum('WH','MS','SS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'MS' COMMENT 'MS =MAIN STORE\\nSS = SUB STORE',
  `location_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `grn_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantity` decimal(10,4) DEFAULT NULL,
  `conversion_fact` decimal(20,6) DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `comment` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_f_pharmacy_stock_detail_id`),
  KEY `hims_f_pharmacy_stock_detail_fk1_idx` (`created_by`),
  KEY `hims_f_pharmacy_stock_detail_fk2_idx` (`updated_by`),
  KEY `hims_f_pharmacy_stock_detail_fk3_idx` (`pharmacy_stock_header_id`),
  KEY `hims_f_pharmacy_stock_detail_fk4_idx` (`location_id`),
  KEY `hims_f_pharmacy_stock_detail_fk4_idx1` (`item_category_id`),
  KEY `hims_f_pharmacy_stock_detail_fk6_idx` (`item_group_id`),
  KEY `hims_f_pharmacy_stock_detail_fk7_idx` (`uom_id`),
  KEY `hims_f_pharmacy_stock_detail_fk8_idx` (`sales_uom`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk3` FOREIGN KEY (`pharmacy_stock_header_id`) REFERENCES `hims_f_pharmacy_stock_header` (`hims_f_pharmacy_stock_header_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk4` FOREIGN KEY (`location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk5` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk6` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk7` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_pharmacy_stock_detail_fk8` FOREIGN KEY (`sales_uom`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_stock_header`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_stock_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_stock_header` (
  `hims_f_pharmacy_stock_header_id` int NOT NULL AUTO_INCREMENT,
  `document_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `docdate` date DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1' COMMENT '1= april\n12=march\n\nfinancial year',
  `description` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `posted` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_stock_header_id`),
  KEY `hims_f_pharmacy_stock_header_fk1_idx` (`created_by`),
  KEY `hims_f_pharmacy_stock_header_fk2_idx` (`updated_by`),
  KEY `hims_f_pharmacy_stock_header_fk2_idx1` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_pharmacy_stock_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pharmacy_stock_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_trans_history`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_trans_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_trans_history` (
  `hims_f_pharmacy_trans_history_id` int NOT NULL AUTO_INCREMENT,
  `transaction_type` enum('MR','MRA1','MRA2','MRA3','PO','POA1','POA2','POA3','DN','DNA','REC','INV','PR','CN','DBN','AD','ST','CS','POS','SRT','INT','OP','ACK') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MR'',=MATERIAL REQUISITION\\n''MRA1'',= MATERIAL REQUISITION AUTHORIZATION1\\n''MRA2'',= MATERIAL REQUISITION AUTHORIZATION2\\n''MRA3'',= MATERIAL REQUISITION AUTHORIZATION3\\n''PO'',=PURCHASE ORDER\\n''POA1'',= PURCHASE ORDER AUTHORIZATION1\\n''POA2'',= PURCHASE ORDER AUTHORIZATION2\\n''POA3'',= PURCHASE ORDER AUTHORIZATION3\\n''DN'',= DELIVERY NOTE \\n''DNA'',=DELIVERY NOTE AUTHORIZATION\\n''REC'',=RECIEPTS\\n''INV'',= INOVICES\\n''PR'',= PURCHASE RETURN\\n''CN'',= CREDIT NOTE\\n''DBN'',=DEBIT NOTE\\n''AD'',= ADJUSTMENT\\n''ST'',=STOCK TRANSFER\\n''CS'',=CONSUMPTION\\n''POS''=POINT OF SALE\\n''SRT'',=SALES RETURN\\n''INT'',= INITIAL STOCK\\n''OP'' = OPBILL\\n’ACK’,= TRANSFER ACKNOWLEDGE',
  `transaction_id` int DEFAULT NULL,
  `transaction_date` date DEFAULT NULL,
  `from_location_id` int DEFAULT NULL,
  `from_location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE \\\\nSS = SUB STORE \\\\nWH = Warehouse\\\\n',
  `year` int DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `to_location_id` int DEFAULT NULL,
  `to_location_type` enum('WH','MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE \\\\nSS = SUB STORE \\\\nWH = Warehouse\\\\n',
  `description` varchar(60) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_code_id` int DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `required_batchno` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `transaction_qty` decimal(10,3) DEFAULT NULL,
  `transaction_uom` int DEFAULT NULL,
  `transaction_cost` decimal(20,3) DEFAULT NULL,
  `transaction_total` decimal(20,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(20,3) DEFAULT NULL,
  `landing_cost` decimal(10,3) DEFAULT NULL,
  `average_cost` decimal(20,6) DEFAULT NULL,
  `vat_amount` decimal(10,3) DEFAULT '0.000',
  `operation` enum('+','-') DEFAULT NULL,
  `item_delete` enum('N','Y','M') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'N = NO\nY =YES DELETED\nM = MODIFIED',
  `created_by` int unsigned DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_trans_history_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_transfer_batches`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_transfer_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_transfer_batches` (
  `hims_f_pharmacy_transfer_batches_id` int NOT NULL AUTO_INCREMENT,
  `transfer_detail_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `batchno` varchar(30) DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `grnno` varchar(20) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity_requested` decimal(10,3) DEFAULT NULL,
  `quantity_authorized` decimal(10,3) DEFAULT NULL,
  `uom_requested_id` int DEFAULT NULL,
  `quantity_transfer` decimal(10,3) DEFAULT NULL,
  `uom_transferred_id` int DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `uom_recieved_id` int DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `ack_quantity` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`hims_f_pharmacy_transfer_batches_id`),
  KEY `hims_f_pharmacy_transfer_batches_fk1_idx` (`transfer_detail_id`),
  KEY `hims_f_pharmacy_transfer_batches_fk2_idx` (`item_id`),
  KEY `hims_f_pharmacy_transfer_batches_fk3_idx` (`item_category_id`),
  KEY `hims_f_pharmacy_transfer_batches_fk4_idx` (`item_group_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_batches_fk1` FOREIGN KEY (`transfer_detail_id`) REFERENCES `hims_f_pharmacy_transfer_detail` (`hims_f_pharmacy_transfer_detail_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_batches_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_batches_fk3` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_batches_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_transfer_detail`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_transfer_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_transfer_detail` (
  `hims_f_pharmacy_transfer_detail_id` int NOT NULL AUTO_INCREMENT,
  `transfer_header_id` int DEFAULT NULL,
  `from_qtyhand` decimal(10,3) DEFAULT NULL,
  `to_qtyhand` decimal(10,3) DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT 'N',
  `completed_date` datetime DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `batchno` varchar(30) DEFAULT NULL,
  `grnno` varchar(20) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `quantity_requested` decimal(10,3) DEFAULT NULL,
  `quantity_authorized` decimal(10,3) DEFAULT NULL,
  `uom_requested_id` int DEFAULT NULL,
  `quantity_transferred` decimal(10,3) DEFAULT NULL,
  `uom_transferred_id` int DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `uom_recieved_id` int DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `unit_cost` decimal(20,3) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `material_requisition_header_id` int DEFAULT NULL,
  `material_requisition_detail_id` int DEFAULT NULL,
  `transfer_to_date` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_transfer_detail_id`),
  KEY `hims_f_pharmacy_transfer_detail_fk1_idx` (`transfer_header_id`),
  KEY `hims_f_pharmacy_transfer_detail_fk2_idx` (`material_requisition_header_id`),
  KEY `hims_f_pharmacy_transfer_detail_fk3_idx` (`material_requisition_detail_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_detail_fk1` FOREIGN KEY (`transfer_header_id`) REFERENCES `hims_f_pharmacy_transfer_header` (`hims_f_pharmacy_transfer_header_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_detail_fk2` FOREIGN KEY (`material_requisition_header_id`) REFERENCES `hims_f_pharamcy_material_header` (`hims_f_pharamcy_material_header_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_detail_fk3` FOREIGN KEY (`material_requisition_detail_id`) REFERENCES `hims_f_pharmacy_material_detail` (`hims_f_pharmacy_material_detail_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_detail_fk4` FOREIGN KEY (`material_requisition_header_id`) REFERENCES `hims_f_pharamcy_material_header` (`hims_f_pharamcy_material_header_id`),
  CONSTRAINT `hims_f_pharmacy_transfer_detail_fk5` FOREIGN KEY (`material_requisition_detail_id`) REFERENCES `hims_f_pharmacy_material_detail` (`hims_f_pharmacy_material_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmacy_transfer_header`
--

DROP TABLE IF EXISTS `hims_f_pharmacy_transfer_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmacy_transfer_header` (
  `hims_f_pharmacy_transfer_header_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_pharamcy_material_header_id` int DEFAULT NULL,
  `transfer_number` varchar(45) DEFAULT NULL,
  `from_location_type` enum('WH','MS','SS') DEFAULT 'SS',
  `from_location_id` int DEFAULT NULL,
  `transfer_date` datetime DEFAULT NULL,
  `year` smallint DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT NULL,
  `material_requisition_number` varchar(20) DEFAULT NULL,
  `to_location_type` enum('WH','MS','SS') DEFAULT 'MS',
  `to_location_id` int DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT 'N',
  `completed_date` datetime DEFAULT NULL,
  `completed_lines` smallint DEFAULT NULL,
  `transfer_quantity` decimal(10,3) DEFAULT NULL,
  `requested_quantity` decimal(10,3) DEFAULT NULL,
  `recieved_quantity` decimal(10,3) DEFAULT NULL,
  `outstanding_quantity` decimal(10,3) DEFAULT NULL,
  `direct_transfer` enum('N','Y') DEFAULT 'N',
  `ack_done` enum('N','Y') DEFAULT 'N',
  `ack_date` datetime DEFAULT NULL,
  `ack_by` int DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT NULL,
  `return_type` enum('N','Y') DEFAULT 'N',
  `cancelled_date` datetime DEFAULT NULL,
  `cancelled_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmacy_transfer_header_id`),
  KEY `hims_f_pharmacy_transfer_header_fk1_idx` (`material_requisition_number`),
  KEY `hims_f_pharmacy_transfer_header_fk2_idx` (`hims_f_pharamcy_material_header_id`),
  KEY `hims_f_pharmacy_transfer_header_fk3_idx` (`ack_by`),
  CONSTRAINT `hims_f_pharmacy_transfer_header_fk1` FOREIGN KEY (`material_requisition_number`) REFERENCES `hims_f_pharamcy_material_header` (`material_requisition_number`),
  CONSTRAINT `hims_f_pharmacy_transfer_header_fk2` FOREIGN KEY (`hims_f_pharamcy_material_header_id`) REFERENCES `hims_f_pharamcy_material_header` (`hims_f_pharamcy_material_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pharmcy_sales_return_header`
--

DROP TABLE IF EXISTS `hims_f_pharmcy_sales_return_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pharmcy_sales_return_header` (
  `hims_f_pharmcy_sales_return_header_id` int NOT NULL AUTO_INCREMENT,
  `sales_return_number` varchar(45) DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `ip_id` int DEFAULT NULL,
  `from_pos_id` int DEFAULT NULL,
  `sales_return_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `year` varchar(4) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT '''''1''''=JAN\\n''''2''''=FEB\\n''''3''''=MAR\\n''''4'''',=APR\\n''''5'''',=MAY\\n''''6'''',=JUN\\n''''7'''',=JUL\\n''''8'''',=AUG\\n''''9'''',=SEP\\n''''10'''',=OCT\\n''''11'''',=NOV\\n''''12''''=DEC',
  `location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE\\nSS= SUB STORE\\n',
  `sub_total` decimal(10,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `copay_amount` decimal(10,3) DEFAULT NULL,
  `patient_responsibility` decimal(10,3) DEFAULT NULL,
  `patient_tax` decimal(10,3) DEFAULT NULL,
  `patient_payable` decimal(10,3) DEFAULT NULL,
  `company_responsibility` decimal(10,3) DEFAULT NULL,
  `company_tax` decimal(10,3) DEFAULT NULL,
  `company_payable` decimal(10,3) DEFAULT NULL,
  `comments` varchar(150) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `sec_company_responsibility` decimal(10,3) DEFAULT NULL,
  `sec_company_tax` decimal(10,3) DEFAULT NULL,
  `sec_company_payable` decimal(10,3) DEFAULT NULL,
  `sec_copay_amount` decimal(10,3) DEFAULT NULL,
  `net_tax` decimal(10,3) DEFAULT '0.000',
  `gross_total` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_amount` decimal(10,3) DEFAULT '0.000',
  `sheet_discount_percentage` decimal(5,3) DEFAULT '0.000',
  `net_amount` decimal(10,3) DEFAULT '0.000',
  `credit_amount` decimal(10,3) DEFAULT '0.000',
  `payable_amount` decimal(10,3) DEFAULT '0.000',
  `posted` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'N',
  `card_number` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `effective_start_date` date DEFAULT NULL,
  `effective_end_date` date DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `sub_insurance_provider_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `network_type` varchar(75) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `network_office_id` int DEFAULT NULL,
  `policy_number` varchar(45) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `secondary_card_number` varchar(45) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_network_id` int DEFAULT NULL,
  `secondary_network_type` varchar(75) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `secondary_sub_insurance_provider_id` int DEFAULT NULL,
  `secondary_network_office_id` int DEFAULT NULL,
  `eclaim_result` varchar(45) DEFAULT NULL,
  `eclaim_message` varchar(150) DEFAULT NULL,
  `eclaim_status` enum('EN','AP','RE') DEFAULT 'EN' COMMENT 'EN = ENTERED\nAP = APPROVED\nRE= REJECTED',
  `reciept_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pharmcy_sales_return_header_id`),
  UNIQUE KEY `sales_return_number_UNIQUE` (`sales_return_number`),
  KEY `hims_f_pharmcy_sales_return_header_fk1_idx` (`from_pos_id`),
  KEY `hims_f_pharmcy_sales_return_header_fk2_idx` (`patient_id`),
  KEY `hims_f_pharmcy_sales_return_header_fk3_idx` (`reciept_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_pharmcy_sales_return_header_fk1` FOREIGN KEY (`from_pos_id`) REFERENCES `hims_f_pharmacy_pos_header` (`hims_f_pharmacy_pos_header_id`),
  CONSTRAINT `hims_f_pharmcy_sales_return_header_fk2` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_pharmcy_sales_return_header_fk3` FOREIGN KEY (`reciept_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_physiotherapy_detail`
--

DROP TABLE IF EXISTS `hims_f_physiotherapy_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_physiotherapy_detail` (
  `hims_f_physiotherapy_detail_id` int NOT NULL AUTO_INCREMENT,
  `physiotherapy_header_id` int DEFAULT NULL,
  `session_status` enum('P','I','C') DEFAULT NULL COMMENT 'P-Pending, I-In-Progress, C-Completed',
  `session_date` date DEFAULT NULL,
  `session_time` time DEFAULT NULL,
  `physiotherapy_type` enum('U','T','S','H','I','O') DEFAULT NULL COMMENT 'U-Ultrasounds, T-Tens,  S- Short Waves, H- Hot packs, I-Ice packs, O-Others',
  `others_specify` varchar(45) DEFAULT NULL,
  `treatment_remarks` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`hims_f_physiotherapy_detail_id`),
  KEY `hims_f_physiotherapy_detail_fk1_idx` (`physiotherapy_header_id`),
  CONSTRAINT `hims_f_physiotherapy_detail_fk1` FOREIGN KEY (`physiotherapy_header_id`) REFERENCES `hims_f_physiotherapy_header` (`hims_f_physiotherapy_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_physiotherapy_header`
--

DROP TABLE IF EXISTS `hims_f_physiotherapy_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_physiotherapy_header` (
  `hims_f_physiotherapy_header_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `referred_doctor_id` int DEFAULT NULL,
  `ordered_services_id` int DEFAULT NULL,
  `billed` enum('N','Y') DEFAULT 'N' COMMENT 'N=NO, Y=YES\n',
  `physioth_doctor_id` int DEFAULT NULL,
  `ordered_date` datetime DEFAULT NULL,
  `physioth_diagnosis` varchar(60) DEFAULT NULL,
  `no_of_session` tinyint DEFAULT NULL,
  `physiotherapy_status` enum('A','C') DEFAULT 'A' COMMENT 'A- Active, C- Completed',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_physiotherapy_header_id`),
  KEY `hims_f_physiotherapy_header_fk1_idx` (`hospital_id`),
  CONSTRAINT `hims_f_physiotherapy_header_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pos_credit_detail`
--

DROP TABLE IF EXISTS `hims_f_pos_credit_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pos_credit_detail` (
  `hims_f_pos_credit_detail_id` int NOT NULL AUTO_INCREMENT,
  `pos_credit_header_id` int NOT NULL,
  `pos_header_id` int NOT NULL,
  `include` enum('N','Y') DEFAULT 'N',
  `bill_date` date DEFAULT NULL,
  `credit_amount` decimal(10,3) DEFAULT NULL,
  `receipt_amount` decimal(10,3) DEFAULT NULL,
  `balance_amount` decimal(10,3) DEFAULT NULL,
  `previous_balance` decimal(10,3) DEFAULT NULL,
  `bill_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_pos_credit_detail_id`),
  KEY `hims_f_pos_credit_detail_fk1_idx` (`pos_credit_header_id`),
  KEY `hims_f_pos_credit_detail_fk2_idx` (`pos_header_id`),
  CONSTRAINT `hims_f_pos_credit_detail_fk1` FOREIGN KEY (`pos_credit_header_id`) REFERENCES `hims_f_pos_credit_header` (`hims_f_pos_credit_header_id`),
  CONSTRAINT `hims_f_pos_credit_detail_fk2` FOREIGN KEY (`pos_header_id`) REFERENCES `hims_f_pharmacy_pos_header` (`hims_f_pharmacy_pos_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_pos_credit_header`
--

DROP TABLE IF EXISTS `hims_f_pos_credit_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_pos_credit_header` (
  `hims_f_pos_credit_header_id` int NOT NULL AUTO_INCREMENT,
  `pos_credit_number` varchar(22) NOT NULL,
  `pos_credit_date` datetime DEFAULT NULL,
  `patient_id` int NOT NULL,
  `reciept_amount` decimal(10,3) DEFAULT NULL,
  `write_off_amount` decimal(10,3) DEFAULT NULL,
  `recievable_amount` decimal(10,3) DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  `reciept_header_id` int DEFAULT NULL,
  `transaction_type` enum('Z','R','P') DEFAULT 'Z' COMMENT 'Z = ZERO CREDIT,\nR = RECIEPT,\nP =PAYMENT',
  `write_off_account` varchar(45) DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_pos_credit_header_id`),
  KEY `hims_f_pos_credit_header_fk1_idx` (`posted_by`),
  KEY `hims_f_pos_credit_header_fk2_idx` (`created_by`),
  KEY `hims_f_pos_credit_header_fk3_idx` (`patient_id`),
  KEY `hims_f_pos_credit_header_fk4_idx` (`reciept_header_id`),
  CONSTRAINT `hims_f_pos_credit_header_fk1` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pos_credit_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_pos_credit_header_fk3` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_pos_credit_header_fk4` FOREIGN KEY (`reciept_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_prescription`
--

DROP TABLE IF EXISTS `hims_f_prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_prescription` (
  `hims_f_prescription_id` int NOT NULL AUTO_INCREMENT,
  `visit_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `encounter_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `prescription_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `prescription_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'A',
  `cancelled` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'N = NO\nY = YES',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_prescription_id`),
  KEY `hims_f_prescription_fk1_idx` (`created_by`),
  KEY `hims_f_prescription_fk2_idx` (`updated_by`),
  KEY `hims_f_prescription_fk3_idx` (`patient_id`),
  KEY `hims_f_prescription_fk4_idx` (`provider_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_prescription_fk5_idx` (`visit_id`),
  CONSTRAINT `hims_f_prescription_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_prescription_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_prescription_fk3` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_prescription_fk4` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_prescription_fk5` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_prescription_detail`
--

DROP TABLE IF EXISTS `hims_f_prescription_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_prescription_detail` (
  `hims_f_prescription_detail_id` int NOT NULL AUTO_INCREMENT,
  `prescription_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `generic_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `dosage` varchar(10) DEFAULT NULL,
  `frequency` enum('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0' COMMENT '0 = 1-0-1\\n1 = 1-0-0\\n2 = 0-0-1\\n3 = 0-1-0\\n4 = 1-1-0\\n5 = 0-1-1\\n6 = 1-1-1\\n7 = Once only\\n8 = Once daily (q24h)\\n9 = Twice daily (Bid)\\n10 = Three times daily (tid)\\n11 = Five times daily\\n12 = Every two hours (q2h)\\n13 = Every three hours (q3h) \\n14 = Every four hours (q4h)\\n15 = Every six hours (q6h)\\n16 = Every eight hours (q8h)\\n17 = Every twelve hours (q12h\\n18 = Four times daily (qid)\\n19 = Other (According To Physician)',
  `no_of_days` int DEFAULT NULL,
  `dispense` decimal(5,3) DEFAULT NULL,
  `frequency_type` enum('PD','PH','PW','PM','AD','2W','2M','3M','4M','6M') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'PD' COMMENT 'PD = PER DAY\\nPH = PER HOUR\\nPW = PER WEEK\\nPM = PER MONTH\\nAD = ALTERNATE DAY\\n2W = EVERY 2 WEEKS\\n2M = EVERY 2 MONTH\\n3M = EVERY 3 MONTH\\n4M = EVERY 4 MONTH\\n6M = EVERY 6 MONTH\\n',
  `frequency_time` enum('BM','AM','WF','EM','BB','AB') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'BM' COMMENT 'BM = BEFORE MEAL\\nAM = AFTER MEAL\\nWF = WITH FOOD\\nEM = EARLY MORNING\\nBB =BEFORE BED TIME\\nAB =AT BED TIME',
  `frequency_route` enum('BL','EL','IL','IF','IM','IT','IR','NL','OP','OR','OE','RL','ST','SL','TL','TD') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'OR' COMMENT 'BL = Buccal\\\\nEL = Enteral\\\\nIL = Inhalation\\\\nIF = Infusion\\\\nIM = Intramuscular Inj\\\\nIT = Intrathecal Inj\\\\nR = Intravenous Inj\\\\nNL = Nasal\\\\nOP = Ophthalmic\\\\nOR = Oral\\\\nOE = Otic (ear)\\\\nRL = Rectal\\\\nST = Subcutaneous\\\\nSL = Sublingual\\\\nTL = Topical\\\\nTD = Transdermal',
  `med_units` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `service_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `item_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `instructions` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `insured` enum('N','Y') DEFAULT 'N',
  `pre_approval` enum('N','Y') DEFAULT 'N',
  `apprv_status` enum('NR','RE','AP','RJ') NOT NULL DEFAULT 'NR' COMMENT 'NR = NOT REQUESTED\\nRE = REQUESTED\\nAP = APPROVED\\nRJ = REJECTED',
  `approved_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_prescription_detail_id`),
  KEY `hims_f_prescription_detail_fk1_idx` (`prescription_id`),
  KEY `hims_f_prescription_detail_fk2_idx` (`uom_id`),
  KEY `hims_f_prescription_detail_fk3_idx` (`item_id`),
  KEY `hims_f_prescription_detail_fk4_idx` (`generic_id`),
  KEY `hims_f_prescription_detail_fk5_idx` (`item_category_id`),
  CONSTRAINT `hims_f_prescription_detail_fk1` FOREIGN KEY (`prescription_id`) REFERENCES `hims_f_prescription` (`hims_f_prescription_id`),
  CONSTRAINT `hims_f_prescription_detail_fk2` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_prescription_detail_fk3` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_prescription_detail_fk4` FOREIGN KEY (`generic_id`) REFERENCES `hims_d_item_generic` (`hims_d_item_generic_id`),
  CONSTRAINT `hims_f_prescription_detail_fk5` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procedure_items`
--

DROP TABLE IF EXISTS `hims_f_procedure_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procedure_items` (
  `hims_f_procedure_items_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `procedure_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'SS',
  `item_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expirydt` date DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `grn_no` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `unit_cost` decimal(10,6) DEFAULT NULL,
  `quantity` decimal(5,2) DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(10,6) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procedure_items_id`),
  KEY `hims_f_procedure_items_fk1_idx` (`procedure_id`),
  KEY `hims_f_procedure_items_fk2_idx` (`location_id`),
  KEY `hims_f_procedure_items_fk3_idx` (`item_id`),
  KEY `hims_f_procedure_items_fk4_idx` (`item_category_id`),
  KEY `hims_f_procedure_items_fk5_idx` (`item_group_id`),
  KEY `hims_f_procedure_items_fk7_idx` (`created_by`),
  KEY `hims_f_procedure_items_fk8_idx` (`updated_by`),
  KEY `hims_f_procedure_items_fk6_idx` (`uom_id`),
  KEY `hims_f_procedure_items_fk9_idx` (`patient_id`),
  KEY `hims_f_procedure_items_fk11_idx` (`hospital_id`),
  CONSTRAINT `hims_f_procedure_items_fk1` FOREIGN KEY (`procedure_id`) REFERENCES `hims_d_procedure` (`hims_d_procedure_id`),
  CONSTRAINT `hims_f_procedure_items_fk11` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_procedure_items_fk2` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_procedure_items_fk3` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_procedure_items_fk4` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_procedure_items_fk5` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_procedure_items_fk6` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_procedure_items_fk7` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procedure_items_fk8` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procedure_items_fk9` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_dn_batches`
--

DROP TABLE IF EXISTS `hims_f_procurement_dn_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_dn_batches` (
  `hims_f_procurement_dn_batches_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_procurement_dn_detail_id` int DEFAULT NULL,
  `phar_item_category` int DEFAULT NULL,
  `phar_item_group` int DEFAULT NULL,
  `phar_item_id` int DEFAULT NULL,
  `inv_item_category_id` int DEFAULT NULL,
  `inv_item_group_id` int DEFAULT NULL,
  `inv_item_id` int DEFAULT NULL,
  `barcode` varchar(30) DEFAULT NULL,
  `po_quantity` decimal(20,3) DEFAULT NULL,
  `dn_quantity` decimal(20,3) DEFAULT NULL,
  `authorize_quantity` decimal(20,3) DEFAULT NULL,
  `rejected_quantity` decimal(20,3) DEFAULT NULL,
  `pharmacy_uom_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  `discount_percentage` decimal(10,6) DEFAULT NULL,
  `discount_amount` decimal(20,3) DEFAULT NULL,
  `net_extended_cost` decimal(20,3) DEFAULT NULL,
  `vendor_item_no` varchar(30) DEFAULT NULL,
  `manufacturer_item_code` varchar(30) DEFAULT NULL,
  `quantity_recieved_todate` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `tax_inclusive` enum('N','Y') DEFAULT 'N',
  `tax_amount` decimal(10,3) DEFAULT NULL,
  `total_amount` decimal(10,3) DEFAULT NULL,
  `mrp_price` decimal(10,3) DEFAULT NULL,
  `calculate_tax_on` enum('PUR','MRP') DEFAULT NULL COMMENT 'PUR = PURCHASE COST\\\\nMRP = MRP ',
  `tax_percentage` decimal(10,3) DEFAULT NULL,
  `tax_discount` enum('BFR','AFR') DEFAULT NULL COMMENT 'BFR = BEFORE\\\\nAFR = AFTER',
  `item_type` enum('STK','NSK','AST') DEFAULT NULL COMMENT 'STK = STOCK ITEM,\\\\nNSK = NON STOCK ITEM,\\\\nAST = ASSET ITEM',
  `batchno_expiry_required` enum('N','Y') DEFAULT 'N',
  `batchno` varchar(45) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `purchase_order_header_id` int DEFAULT NULL,
  `purchase_order_detail_id` int DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `free_qty` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_dn_batches_id`)
) ENGINE=InnoDB AUTO_INCREMENT=856 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_dn_detail`
--

DROP TABLE IF EXISTS `hims_f_procurement_dn_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_dn_detail` (
  `hims_f_procurement_dn_detail_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_procurement_dn_header_id` int DEFAULT NULL,
  `phar_item_category` int DEFAULT NULL,
  `phar_item_group` int DEFAULT NULL,
  `phar_item_id` int DEFAULT NULL,
  `inv_item_category_id` int DEFAULT NULL,
  `inv_item_group_id` int DEFAULT NULL,
  `inv_item_id` int DEFAULT NULL,
  `barcode` varchar(30) DEFAULT NULL,
  `po_quantity` decimal(20,3) DEFAULT NULL,
  `dn_quantity` decimal(20,3) DEFAULT NULL,
  `authorize_quantity` decimal(20,3) DEFAULT NULL,
  `rejected_quantity` decimal(20,3) DEFAULT NULL,
  `pharmacy_uom_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  `discount_percentage` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(20,3) DEFAULT NULL,
  `net_extended_cost` decimal(20,3) DEFAULT NULL,
  `vendor_item_no` varchar(30) DEFAULT NULL,
  `manufacturer_item_code` varchar(30) DEFAULT NULL,
  `quantity_recieved_todate` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `tax_inclusive` enum('N','Y') DEFAULT 'N',
  `tax_amount` decimal(10,3) DEFAULT NULL,
  `total_amount` decimal(10,3) DEFAULT NULL,
  `mrp_price` decimal(10,3) DEFAULT NULL,
  `calculate_tax_on` enum('PUR','MRP') DEFAULT NULL COMMENT 'PUR = PURCHASE COST\\nMRP = MRP ',
  `tax_percentage` decimal(10,3) DEFAULT NULL,
  `tax_discount` enum('BFR','AFR') DEFAULT NULL COMMENT 'BFR = BEFORE\\nAFR = AFTER',
  `item_type` enum('STK','NSK','AST') DEFAULT NULL COMMENT 'STK = STOCK ITEM,\\nNSK = NON STOCK ITEM,\\nAST = ASSET ITEM',
  `batchno_expiry_required` enum('N','Y') DEFAULT 'N',
  `batchno` varchar(45) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `purchase_order_header_id` int DEFAULT NULL,
  `purchase_order_detail_id` int DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `sales_price` decimal(10,3) DEFAULT NULL,
  `free_qty` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_dn_detail_id`),
  KEY `hims_f_procurement_dn_detail_fk1_idx` (`hims_f_procurement_dn_header_id`),
  KEY `hims_f_procurement_dn_detail_fk2_idx` (`phar_item_group`),
  KEY `hims_f_procurement_dn_detail_fk3_idx` (`phar_item_category`),
  KEY `hims_f_procurement_dn_detail_fk4_idx` (`phar_item_id`),
  KEY `hims_f_procurement_dn_detail_fk5_idx` (`inv_item_id`),
  KEY `hims_f_procurement_dn_detail_fk6_idx` (`inv_item_category_id`),
  KEY `hims_f_procurement_dn_detail_fk7_idx` (`inv_item_group_id`),
  KEY `hims_f_procurement_dn_detail_fk8_idx` (`inventory_uom_id`),
  KEY `hims_f_procurement_dn_detail_fk9_idx` (`pharmacy_uom_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk1` FOREIGN KEY (`hims_f_procurement_dn_header_id`) REFERENCES `hims_f_procurement_dn_header` (`hims_f_procurement_dn_header_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk2` FOREIGN KEY (`phar_item_group`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk3` FOREIGN KEY (`phar_item_category`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk4` FOREIGN KEY (`phar_item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk5` FOREIGN KEY (`inv_item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk6` FOREIGN KEY (`inv_item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk7` FOREIGN KEY (`inv_item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk8` FOREIGN KEY (`inventory_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_procurement_dn_detail_fk9` FOREIGN KEY (`pharmacy_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=832 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_dn_header`
--

DROP TABLE IF EXISTS `hims_f_procurement_dn_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_dn_header` (
  `hims_f_procurement_dn_header_id` int NOT NULL AUTO_INCREMENT,
  `delivery_note_number` varchar(45) DEFAULT NULL,
  `dn_date` datetime DEFAULT NULL,
  `dn_type` enum('A','F') DEFAULT 'A' COMMENT 'A = ACTIVE \nF =FUTURE',
  `dn_from` enum('PHR','INV') DEFAULT 'INV' COMMENT 'PHR = PHARMACY\nINV = INVENTORY',
  `pharmcy_location_id` int DEFAULT NULL,
  `inventory_location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'MS',
  `vendor_id` int DEFAULT NULL,
  `purchase_order_id` int DEFAULT NULL,
  `from_multiple_purchase_orders` enum('N','Y') DEFAULT 'N',
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT NULL COMMENT '''0'' = 0 days\\n ’15’ = 15 days \\n ''30'' = 30 days \\n ’45’ = 45 days \\n ''60'' = 60 days \\n ''90'' = 90 days\\n ''120''= 120 days\\n ''180''= 180 days \\n ''365''= 365 days',
  `comment` text,
  `sub_total` decimal(10,3) DEFAULT NULL,
  `detail_discount` decimal(10,3) DEFAULT NULL,
  `extended_total` decimal(20,3) DEFAULT NULL,
  `sheet_level_discount_percent` decimal(20,3) DEFAULT NULL,
  `sheet_level_discount_amount` decimal(20,3) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `net_total` decimal(20,3) DEFAULT NULL,
  `total_tax` decimal(20,3) DEFAULT NULL,
  `net_payable` decimal(20,3) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `is_completed` enum('N','Y') DEFAULT 'N',
  `completed_date` date DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancel_by` int DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  `authorize1` enum('N','Y') DEFAULT 'N',
  `authorize_by_1` int DEFAULT NULL,
  `authorize_by_date` datetime DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_dn_header_id`),
  UNIQUE KEY `purchase_number_UNIQUE` (`delivery_note_number`),
  KEY `hims_f_procurement_dn_header_fk1_idx` (`created_by`),
  KEY `hims_f_procurement_dn_header_fk2_idx` (`updated_by`),
  KEY `hims_f_procurement_dn_header_fk3_idx` (`cancel_by`),
  KEY `hims_f_procurement_dn_header_fk4_idx` (`authorize_by_1`),
  KEY `hims_f_procurement_dn_header_fk4_idx1` (`pharmcy_location_id`),
  KEY `hims_f_procurement_dn_header_fk6_idx` (`inventory_location_id`),
  KEY `hims_f_procurement_dn_header_fk7_idx` (`purchase_order_id`),
  KEY `hims_f_procurement_dn_header_fk7_idx1` (`vendor_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk3` FOREIGN KEY (`cancel_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk4` FOREIGN KEY (`authorize_by_1`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk5` FOREIGN KEY (`pharmcy_location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk6` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_procurement_dn_header_fk7` FOREIGN KEY (`purchase_order_id`) REFERENCES `hims_f_procurement_po_header` (`hims_f_procurement_po_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_grn_detail`
--

DROP TABLE IF EXISTS `hims_f_procurement_grn_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_grn_detail` (
  `hims_f_procurement_grn_detail_id` int NOT NULL AUTO_INCREMENT,
  `grn_header_id` int DEFAULT NULL,
  `dn_header_id` int DEFAULT NULL,
  `extended_cost` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_extended_cost` decimal(10,3) DEFAULT NULL,
  `tax_inclusive` enum('N','Y') DEFAULT NULL,
  `tax_percentage` decimal(10,3) DEFAULT NULL,
  `tax_amount` decimal(10,3) DEFAULT NULL,
  `total_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_grn_detail_id`),
  KEY `hims_f_procurement_grn_detail_fk1_idx` (`grn_header_id`),
  CONSTRAINT `hims_f_procurement_grn_detail_fk1` FOREIGN KEY (`grn_header_id`) REFERENCES `hims_f_procurement_grn_header` (`hims_f_procurement_grn_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_grn_header`
--

DROP TABLE IF EXISTS `hims_f_procurement_grn_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_grn_header` (
  `hims_f_procurement_grn_header_id` int NOT NULL AUTO_INCREMENT,
  `grn_number` varchar(45) DEFAULT NULL,
  `grn_for` enum('PHR','INV') DEFAULT 'INV' COMMENT 'PHR = PHARMACY\\\\nINV = INVENTORY',
  `vendor_id` int DEFAULT NULL,
  `grn_date` datetime DEFAULT NULL,
  `year` varchar(4) DEFAULT NULL,
  `period` enum('1','2','3','4','5','6','7','8','9','10','11','12') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT '''''1''''=JAN\\n''''2''''=FEB\\n''''3''''=MAR\\n''''4'''',=APR\\n''''5'''',=MAY\\n''''6'''',=JUN\\n''''7'''',=JUL\\n''''8'''',=AUG\\n''''9'''',=SEP\\n''''10'''',=OCT\\n''''11'''',=NOV\\n''''12''''=DEC',
  `pharmcy_location_id` int DEFAULT NULL,
  `inventory_location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL COMMENT 'MS = MAIN STORE\\nSS= SUB STORE\\n',
  `po_id` int DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT '0' COMMENT '''0'' = 0 days\n ’15’ = 15 days \n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `comment` text,
  `description` varchar(150) DEFAULT NULL,
  `sub_total` decimal(10,3) DEFAULT NULL,
  `detail_discount` decimal(10,3) DEFAULT NULL,
  `extended_total` decimal(10,3) DEFAULT NULL,
  `sheet_level_discount_percent` decimal(10,3) DEFAULT NULL,
  `sheet_level_discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `total_tax` decimal(10,3) DEFAULT NULL,
  `net_payable` decimal(10,3) DEFAULT NULL,
  `additional_cost` decimal(10,3) DEFAULT NULL,
  `reciept_total` decimal(10,3) DEFAULT NULL,
  `return_done` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `posted` enum('N','Y') DEFAULT 'N',
  `posted_by` int DEFAULT NULL,
  `posted_date` datetime DEFAULT NULL,
  `inovice_number` varchar(45) DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `invoice_posted` enum('N','Y') DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_grn_header_id`),
  KEY `hims_f_procurement_grn_header_id_idx` (`posted_by`),
  KEY `hims_f_procurement_grn_header_fk2_idx` (`updated_by`),
  KEY `hims_f_procurement_grn_header_fk3_idx` (`created_by`),
  KEY `hims_f_procurement_grn_header_fk4_idx` (`vendor_id`),
  KEY `hims_f_procurement_grn_header_fk6_idx` (`po_id`),
  KEY `hims_f_procurement_grn_header_fk7_idx` (`inventory_location_id`),
  KEY `hims_f_procurement_grn_header_fk8_idx` (`pharmcy_location_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk1` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk4` FOREIGN KEY (`vendor_id`) REFERENCES `hims_d_vendor` (`hims_d_vendor_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk6` FOREIGN KEY (`po_id`) REFERENCES `hims_f_procurement_po_header` (`hims_f_procurement_po_header_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk7` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_procurement_grn_header_fk8` FOREIGN KEY (`pharmcy_location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_numgen`
--

DROP TABLE IF EXISTS `hims_f_procurement_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_numgen` (
  `hims_f_procurement_numgen_id` int NOT NULL AUTO_INCREMENT,
  `numgen_code` varchar(45) NOT NULL,
  `module_desc` varchar(250) NOT NULL,
  `prefix` varchar(45) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` varchar(45) NOT NULL,
  `postfix` varchar(200) NOT NULL COMMENT 'Number',
  `length` int NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` int NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(45) DEFAULT NULL,
  `postfix_start` varchar(200) NOT NULL,
  `postfix_end` varchar(200) NOT NULL,
  `current_num` varchar(500) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(500) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_procurement_numgen_id`),
  KEY `hims_f_procurement_numgen_fk1_idx` (`created_by`),
  KEY `hims_f_procurement_numgen_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_f_procurement_numgen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_numgen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_po_detail`
--

DROP TABLE IF EXISTS `hims_f_procurement_po_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_po_detail` (
  `hims_f_procurement_po_detail_id` int NOT NULL AUTO_INCREMENT,
  `procurement_header_id` int DEFAULT NULL,
  `phar_item_category` int DEFAULT NULL,
  `phar_item_group` int DEFAULT NULL,
  `phar_item_id` int DEFAULT NULL,
  `inv_item_category_id` int DEFAULT NULL,
  `inv_item_group_id` int DEFAULT NULL,
  `inv_item_id` int DEFAULT NULL,
  `barcode` varchar(30) DEFAULT NULL,
  `order_quantity` decimal(10,3) DEFAULT NULL,
  `foc_quantity` decimal(10,3) DEFAULT NULL,
  `total_quantity` decimal(10,3) DEFAULT NULL,
  `pharmacy_uom_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `unit_price` decimal(20,6) DEFAULT NULL,
  `extended_price` decimal(20,3) DEFAULT NULL,
  `sub_discount_percentage` decimal(10,6) DEFAULT NULL,
  `sub_discount_amount` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  `unit_cost` decimal(20,6) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(20,3) DEFAULT NULL,
  `net_extended_cost` decimal(20,3) DEFAULT NULL,
  `expected_arrival_date` date DEFAULT NULL,
  `vendor_item_no` varchar(30) DEFAULT NULL,
  `manufacturer_item_code` varchar(30) DEFAULT NULL,
  `completed` enum('N','Y') DEFAULT 'N',
  `completed_date` date DEFAULT NULL,
  `quantity_recieved` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `pharmacy_requisition_id` int DEFAULT NULL,
  `inventory_requisition_id` int DEFAULT NULL,
  `authorize_quantity` decimal(10,3) DEFAULT NULL,
  `rejected_quantity` decimal(10,3) DEFAULT NULL,
  `tax_percentage` decimal(10,3) DEFAULT NULL,
  `tax_amount` decimal(10,3) DEFAULT NULL,
  `total_amount` decimal(20,3) DEFAULT NULL,
  `mrp_price` decimal(10,3) DEFAULT NULL,
  `calculate_tax_on` enum('PUR','MRP') DEFAULT NULL COMMENT 'PUR = PURCHASE COST\nMRP = MRP ',
  `tax_discount` enum('BFR','AFR') DEFAULT NULL COMMENT 'BFR = BEFORE\nAFR = AFTER',
  `item_type` enum('STK','NSK','AST') DEFAULT NULL COMMENT 'STK = STOCK ITEM,\nNSK = NON STOCK ITEM,\nAST = ASSET ITEM',
  PRIMARY KEY (`hims_f_procurement_po_detail_id`),
  KEY `hims_f_procurement_po_detail_fk1_idx` (`inv_item_group_id`),
  KEY `hims_f_procurement_po_detail_fk2_idx` (`inv_item_category_id`),
  KEY `hims_f_procurement_po_detail_fk3_idx` (`inv_item_id`),
  KEY `hims_f_procurement_po_detail_fk4_idx` (`phar_item_group`),
  KEY `hims_f_procurement_po_detail_fk5_idx` (`phar_item_category`),
  KEY `hims_f_procurement_po_detail_fk6_idx` (`phar_item_id`),
  KEY `hims_f_procurement_po_detail_fk7_idx` (`inventory_uom_id`),
  KEY `hims_f_procurement_po_detail_fk8_idx` (`pharmacy_uom_id`),
  KEY `hims_f_procurement_po_detail_fk9_idx` (`pharmacy_requisition_id`),
  KEY `hims_f_procurement_po_detail_fk10_idx` (`inventory_requisition_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk1` FOREIGN KEY (`inv_item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk10` FOREIGN KEY (`inventory_requisition_id`) REFERENCES `hims_f_inventory_material_detail` (`hims_f_inventory_material_detail_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk2` FOREIGN KEY (`inv_item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk3` FOREIGN KEY (`inv_item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk4` FOREIGN KEY (`phar_item_group`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk5` FOREIGN KEY (`phar_item_category`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk6` FOREIGN KEY (`phar_item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk7` FOREIGN KEY (`inventory_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk8` FOREIGN KEY (`pharmacy_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_procurement_po_detail_fk9` FOREIGN KEY (`pharmacy_requisition_id`) REFERENCES `hims_f_pharmacy_material_detail` (`hims_f_pharmacy_material_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1414 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_po_header`
--

DROP TABLE IF EXISTS `hims_f_procurement_po_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_po_header` (
  `hims_f_procurement_po_header_id` int NOT NULL AUTO_INCREMENT,
  `purchase_number` varchar(45) DEFAULT NULL,
  `po_date` datetime DEFAULT NULL,
  `po_type` enum('D','MR','PR','VQ') DEFAULT 'D' COMMENT 'D = Direct \\n MR = Material Requisition \\n PR= Purchase Requisition \\n VQ = Vendor Quotation ',
  `po_from` enum('PHR','INV') DEFAULT 'INV' COMMENT 'PHR = PHARMACY\nINV = INVENTORY',
  `pharmcy_location_id` int DEFAULT NULL,
  `inventory_location_id` int DEFAULT NULL,
  `location_type` enum('MS','SS') DEFAULT 'MS',
  `vendor_id` int DEFAULT NULL,
  `expected_date` date DEFAULT NULL,
  `on_hold` enum('N','Y') DEFAULT 'N',
  `phar_requisition_id` int DEFAULT NULL,
  `inv_requisition_id` int DEFAULT NULL,
  `vendor_quotation_header_id` int DEFAULT NULL,
  `from_multiple_requisition` enum('N','Y') DEFAULT 'N',
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT '0' COMMENT '''0'' = 0 days\n ’15’ = 15 days \n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `comment` text,
  `sub_total` decimal(20,3) DEFAULT NULL,
  `detail_discount` decimal(10,3) DEFAULT NULL,
  `extended_total` decimal(20,3) DEFAULT NULL,
  `sheet_level_discount_percent` decimal(10,3) DEFAULT NULL,
  `sheet_level_discount_amount` decimal(10,3) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `net_total` decimal(20,3) DEFAULT NULL,
  `total_tax` decimal(10,3) DEFAULT NULL,
  `net_payable` decimal(20,3) DEFAULT NULL,
  `is_completed` enum('N','Y') DEFAULT 'N',
  `completed_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `is_posted` enum('N','Y') DEFAULT 'N',
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancel_by` int DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  `authorize1` enum('N','Y') DEFAULT 'N',
  `authorize_by_1` int DEFAULT NULL,
  `authorize_by_date` datetime DEFAULT NULL,
  `authorize2` enum('N','Y') DEFAULT 'N',
  `authorize2_by` int DEFAULT NULL,
  `authorize2_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_po_header_id`),
  UNIQUE KEY `purchase_number_UNIQUE` (`purchase_number`),
  KEY `hims_f_procurement_po_header_fk1_idx` (`created_by`),
  KEY `hims_f_procurement_po_header_fk2_idx` (`updated_by`),
  KEY `hims_f_procurement_po_header_fk3_idx` (`cancel_by`),
  KEY `hims_f_procurement_po_header_fk4_idx` (`authorize_by_1`),
  KEY `hims_f_procurement_po_header_fk4_idx1` (`pharmcy_location_id`),
  KEY `hims_f_procurement_po_header_fk6_idx` (`inventory_location_id`),
  KEY `hims_f_procurement_po_header_fk7_idx` (`inv_requisition_id`),
  KEY `hims_f_procurement_po_header_fk8_idx` (`phar_requisition_id`),
  KEY `hims_f_procurement_po_header_fk9_idx` (`vendor_id`),
  KEY `hims_f_procurement_po_header_fk10_idx` (`vendor_quotation_header_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk10` FOREIGN KEY (`vendor_quotation_header_id`) REFERENCES `hims_f_procurement_vendor_quotation_header` (`hims_f_procurement_vendor_quotation_header_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk3` FOREIGN KEY (`cancel_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk4` FOREIGN KEY (`authorize_by_1`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk6` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk7` FOREIGN KEY (`inv_requisition_id`) REFERENCES `hims_f_inventory_material_header` (`hims_f_inventory_material_header_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk8` FOREIGN KEY (`phar_requisition_id`) REFERENCES `hims_f_pharamcy_material_header` (`hims_f_pharamcy_material_header_id`),
  CONSTRAINT `hims_f_procurement_po_header_fk9` FOREIGN KEY (`vendor_id`) REFERENCES `hims_d_vendor` (`hims_d_vendor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_po_return_detail`
--

DROP TABLE IF EXISTS `hims_f_procurement_po_return_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_po_return_detail` (
  `hims_f_procurement_po_return_detail_id` int NOT NULL AUTO_INCREMENT,
  `po_return_header_id` int DEFAULT NULL,
  `phar_item_category` int DEFAULT NULL,
  `pharmacy_uom_id` int DEFAULT NULL,
  `phar_item_group` int DEFAULT NULL,
  `phar_item_id` int DEFAULT NULL,
  `inv_item_category_id` int DEFAULT NULL,
  `inv_item_group_id` int DEFAULT NULL,
  `inv_item_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `dn_quantity` decimal(20,3) DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `unit_cost` decimal(10,6) DEFAULT NULL,
  `return_qty` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(20,6) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(20,3) DEFAULT NULL,
  `net_extended_cost` decimal(20,3) DEFAULT NULL,
  `tax_amount` decimal(20,3) DEFAULT NULL,
  `total_amount` decimal(20,3) DEFAULT NULL,
  `batchno` varchar(45) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `dn_header_id` int DEFAULT NULL,
  `dn_detail_id` int DEFAULT NULL,
  `vendor_batchno` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_po_return_detail_id`),
  KEY `hims_f_procurement_po_return_detail_fk3_idx` (`phar_item_group`),
  KEY `hims_f_procurement_po_return_detail_fk4_idx` (`pharmacy_uom_id`),
  KEY `hims_f_procurement_po_return_detail_fk5_idx` (`phar_item_id`),
  KEY `hims_f_procurement_po_return_detail_fk1_idx` (`po_return_header_id`),
  KEY `hims_f_procurement_po_return_detail_fk6_idx` (`inv_item_category_id`),
  KEY `hims_f_procurement_po_return_detail_fk7_idx` (`inv_item_group_id`),
  KEY `hims_f_procurement_po_return_detail_fk8_idx` (`inv_item_id`),
  KEY `hims_f_procurement_po_return_detail_fk9_idx` (`inventory_uom_id`),
  KEY `hims_f_procurement_po_return_detail_fk10_idx` (`dn_header_id`),
  KEY `hims_f_procurement_po_return_detail_fk11_idx` (`dn_detail_id`),
  KEY `hims_f_procurement_po_return_detail_fk12_idx` (`phar_item_category`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk1` FOREIGN KEY (`po_return_header_id`) REFERENCES `hims_f_procurement_po_return_header` (`hims_f_procurement_return_po_header_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk10` FOREIGN KEY (`dn_header_id`) REFERENCES `hims_f_procurement_dn_header` (`hims_f_procurement_dn_header_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk11` FOREIGN KEY (`dn_detail_id`) REFERENCES `hims_f_procurement_dn_detail` (`hims_f_procurement_dn_detail_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk12` FOREIGN KEY (`phar_item_category`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk3` FOREIGN KEY (`phar_item_group`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk4` FOREIGN KEY (`pharmacy_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk5` FOREIGN KEY (`phar_item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk6` FOREIGN KEY (`inv_item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk7` FOREIGN KEY (`inv_item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk8` FOREIGN KEY (`inv_item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_procurement_po_return_detail_fk9` FOREIGN KEY (`inventory_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_po_return_header`
--

DROP TABLE IF EXISTS `hims_f_procurement_po_return_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_po_return_header` (
  `hims_f_procurement_return_po_header_id` int NOT NULL AUTO_INCREMENT,
  `grn_header_id` int DEFAULT NULL,
  `purchase_return_number` varchar(45) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `return_date` datetime DEFAULT NULL,
  `po_return_from` enum('PHR','INV') DEFAULT 'INV' COMMENT 'PHR = PHARMACY\\nINV = INVENTORY',
  `pharmcy_location_id` int DEFAULT NULL,
  `inventory_location_id` int DEFAULT NULL,
  `location_type` enum('WH','MS','SS') DEFAULT 'MS',
  `vendor_id` int DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT '0' COMMENT '''0'' = 0 days\n ’15’ = 15 days \n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `comment` text,
  `sub_total` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_total` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `receipt_net_total` decimal(10,3) DEFAULT '0.000',
  `receipt_net_payable` decimal(10,3) DEFAULT '0.000',
  `return_total` decimal(10,3) DEFAULT '0.000',
  `is_posted` enum('N','Y') DEFAULT 'N',
  `posted_by` int DEFAULT NULL,
  `posted_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancel_by` int DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_return_po_header_id`),
  KEY `hims_f_procurement_po_return_header_fk1_idx` (`pharmcy_location_id`),
  KEY `hims_f_procurement_po_return_header_fk2_idx` (`inventory_location_id`),
  KEY `hims_f_procurement_po_return_header_fk3_idx` (`vendor_id`),
  KEY `hims_f_procurement_po_return_header_fk4_idx` (`posted_by`),
  KEY `hims_f_procurement_po_return_header_fk5_idx` (`created_by`),
  KEY `hims_f_procurement_po_return_header_fk6_idx` (`cancel_by`),
  KEY `hims_f_procurement_po_return_header_fk7_idx` (`hospital_id`),
  KEY `hims_f_procurement_po_return_header_fk8_idx` (`grn_header_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk1` FOREIGN KEY (`pharmcy_location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk2` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk3` FOREIGN KEY (`vendor_id`) REFERENCES `hims_d_vendor` (`hims_d_vendor_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk4` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk6` FOREIGN KEY (`cancel_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_procurement_po_return_header_fk8` FOREIGN KEY (`grn_header_id`) REFERENCES `hims_f_procurement_grn_header` (`hims_f_procurement_grn_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_purchase_request`
--

DROP TABLE IF EXISTS `hims_f_procurement_purchase_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_purchase_request` (
  `hims_f_procurement_purchase_request_id` int NOT NULL AUTO_INCREMENT,
  `item_id` varchar(45) DEFAULT NULL,
  `request_from` enum('P','I') DEFAULT NULL COMMENT 'P- From Pharmacy, I - From Inventory',
  `request_to` int DEFAULT NULL,
  `request_location` int DEFAULT NULL,
  `request_qty` decimal(10,3) DEFAULT NULL,
  `requested_date` date DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_purchase_request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_req_quotation_detail`
--

DROP TABLE IF EXISTS `hims_f_procurement_req_quotation_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_req_quotation_detail` (
  `hims_f_procurement_req_quotation_detail_id` int NOT NULL AUTO_INCREMENT,
  `req_quotation_header_id` int DEFAULT NULL,
  `phar_item_category` int DEFAULT NULL,
  `phar_item_group` int DEFAULT NULL,
  `phar_item_id` int DEFAULT NULL,
  `inv_item_category_id` int DEFAULT NULL,
  `inv_item_group_id` int DEFAULT NULL,
  `inv_item_id` int DEFAULT NULL,
  `pharmacy_uom_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `quantity` decimal(10,3) DEFAULT NULL,
  `itm_notes` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_req_quotation_detail_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk1_idx` (`req_quotation_header_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk2_idx` (`phar_item_category`),
  KEY `hims_f_procurement_req_quotation_detail_fk3_idx` (`phar_item_group`),
  KEY `hims_f_procurement_req_quotation_detail_fk4_idx` (`phar_item_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk5_idx` (`inv_item_category_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk6_idx` (`inv_item_group_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk7_idx` (`inv_item_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk8_idx` (`pharmacy_uom_id`),
  KEY `hims_f_procurement_req_quotation_detail_fk9_idx` (`inventory_uom_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk1` FOREIGN KEY (`req_quotation_header_id`) REFERENCES `hims_f_procurement_req_quotation_header` (`hims_f_procurement_req_quotation_header_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk2` FOREIGN KEY (`phar_item_category`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk3` FOREIGN KEY (`phar_item_group`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk4` FOREIGN KEY (`phar_item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk5` FOREIGN KEY (`inv_item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk6` FOREIGN KEY (`inv_item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk7` FOREIGN KEY (`inv_item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk8` FOREIGN KEY (`pharmacy_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_detail_fk9` FOREIGN KEY (`inventory_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_req_quotation_header`
--

DROP TABLE IF EXISTS `hims_f_procurement_req_quotation_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_req_quotation_header` (
  `hims_f_procurement_req_quotation_header_id` int NOT NULL AUTO_INCREMENT,
  `quotation_number` varchar(45) DEFAULT NULL,
  `quotation_date` datetime DEFAULT NULL,
  `quotation_for` enum('PHR','INV') DEFAULT 'INV' COMMENT 'PHR = PHARMACY\\\\nINV = INVENTORY',
  `expected_date` date DEFAULT NULL,
  `phar_requisition_id` int DEFAULT NULL,
  `inv_requisition_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_req_quotation_header_id`),
  KEY `hims_f_procurement_req_quotation_header_fk1_idx` (`created_by`),
  KEY `hims_f_procurement_req_quotation_header_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_f_procurement_req_quotation_header_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_req_quotation_header_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_vendor_quotation_detail`
--

DROP TABLE IF EXISTS `hims_f_procurement_vendor_quotation_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_vendor_quotation_detail` (
  `hims_f_procurement_vendor_quotation_detail_id` int NOT NULL AUTO_INCREMENT,
  `vendor_quotation_header_id` int DEFAULT NULL,
  `phar_item_category` int DEFAULT NULL,
  `phar_item_group` int DEFAULT NULL,
  `phar_item_id` int DEFAULT NULL,
  `pharmacy_uom_id` int DEFAULT NULL,
  `inv_item_category_id` int DEFAULT NULL,
  `inv_item_group_id` int DEFAULT NULL,
  `inv_item_id` int DEFAULT NULL,
  `inventory_uom_id` int DEFAULT NULL,
  `quantity` decimal(10,3) DEFAULT NULL,
  `unit_price` decimal(10,3) DEFAULT NULL,
  `extended_price` decimal(10,3) DEFAULT NULL,
  `discount_percentage` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_extended_cost` decimal(20,3) DEFAULT NULL,
  `tax_percentage` decimal(10,3) DEFAULT NULL,
  `tax_amount` decimal(10,3) DEFAULT NULL,
  `total_amount` decimal(20,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_vendor_quotation_detail_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk1_idx` (`vendor_quotation_header_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk2_idx` (`phar_item_category`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk3_idx` (`phar_item_group`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk4_idx` (`phar_item_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk5_idx` (`pharmacy_uom_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk6_idx` (`inv_item_category_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk7_idx` (`inv_item_group_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk8_idx` (`inv_item_id`),
  KEY `hims_f_procurement_vendor_quotation_detail_fk_idx` (`inventory_uom_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk1` FOREIGN KEY (`vendor_quotation_header_id`) REFERENCES `hims_f_procurement_vendor_quotation_header` (`hims_f_procurement_vendor_quotation_header_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk2` FOREIGN KEY (`phar_item_category`) REFERENCES `hims_d_item_category` (`hims_d_item_category_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk3` FOREIGN KEY (`phar_item_group`) REFERENCES `hims_d_item_group` (`hims_d_item_group_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk4` FOREIGN KEY (`phar_item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk5` FOREIGN KEY (`pharmacy_uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk6` FOREIGN KEY (`inv_item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk7` FOREIGN KEY (`inv_item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk8` FOREIGN KEY (`inv_item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_detail_fk9` FOREIGN KEY (`inventory_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_procurement_vendor_quotation_header`
--

DROP TABLE IF EXISTS `hims_f_procurement_vendor_quotation_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_procurement_vendor_quotation_header` (
  `hims_f_procurement_vendor_quotation_header_id` int NOT NULL AUTO_INCREMENT,
  `vendor_quotation_number` varchar(45) DEFAULT NULL,
  `req_quotation_header_id` int DEFAULT NULL,
  `vendor_quotation_date` datetime DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `quotation_for` enum('PHR','INV') DEFAULT 'INV' COMMENT 'PHR = PHARMACY\\\\\\\\nINV = INVENTORY',
  `expected_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_procurement_vendor_quotation_header_id`),
  KEY `hims_f_procurement_vendor_quotation_header_fk1_idx` (`req_quotation_header_id`),
  KEY `hims_f_procurement_vendor_quotation_header_fk2_idx` (`vendor_id`),
  KEY `hims_f_procurement_vendor_quotation_header_fk3_idx` (`created_by`),
  KEY `hims_f_procurement_vendor_quotation_header_fk4_idx` (`updated_by`),
  KEY `hims_f_procurement_vendor_quotation_header_fk5_idx` (`hospital_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_header_fk1` FOREIGN KEY (`req_quotation_header_id`) REFERENCES `hims_f_procurement_req_quotation_header` (`hims_f_procurement_req_quotation_header_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_header_fk2` FOREIGN KEY (`vendor_id`) REFERENCES `hims_d_vendor` (`hims_d_vendor_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_header_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_header_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_procurement_vendor_quotation_header_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_project_roster`
--

DROP TABLE IF EXISTS `hims_f_project_roster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_project_roster` (
  `hims_f_project_roster_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `attendance_date` date DEFAULT NULL,
  `project_id` int NOT NULL,
  `hims_f_leave_application_id` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_project_roster_id`),
  UNIQUE KEY `employee_date` (`employee_id`,`attendance_date`),
  KEY `hims_f_project_roster_fk1_idx` (`project_id`),
  KEY `dd_idx` (`employee_id`),
  KEY `hims_f_project_roster_fk3_idx` (`hospital_id`),
  CONSTRAINT `hims_f_project_roster_fk1` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`),
  CONSTRAINT `hims_f_project_roster_fk2` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_project_roster_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=149488 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_project_wise_deductions`
--

DROP TABLE IF EXISTS `hims_f_project_wise_deductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_project_wise_deductions` (
  `hims_f_project_wise_deductions_id` int NOT NULL,
  `project_wise_payroll_id` int DEFAULT NULL,
  `deductions_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_project_wise_deductions_id`),
  UNIQUE KEY `hims_f_project_wise_deductions_uq1` (`project_wise_payroll_id`,`deductions_id`),
  KEY `hims_f_project_wise_deductions_fk1_idx` (`project_wise_payroll_id`),
  KEY `hims_f_project_wise_deductions_fk2_idx` (`deductions_id`),
  CONSTRAINT `hims_f_project_wise_deductions_fk1` FOREIGN KEY (`project_wise_payroll_id`) REFERENCES `hims_f_project_wise_payroll` (`hims_f_project_wise_payroll_id`),
  CONSTRAINT `hims_f_project_wise_deductions_fk2` FOREIGN KEY (`deductions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_project_wise_earnings`
--

DROP TABLE IF EXISTS `hims_f_project_wise_earnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_project_wise_earnings` (
  `hims_f_project_wise_earnings_id` int NOT NULL AUTO_INCREMENT,
  `project_wise_payroll_id` int DEFAULT NULL,
  `earnings_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`hims_f_project_wise_earnings_id`),
  UNIQUE KEY `hims_f_project_wise_earnings_uq1` (`project_wise_payroll_id`,`earnings_id`),
  KEY `hims_f_project_wise_earnings_fk1_idx` (`project_wise_payroll_id`),
  KEY `hims_f_project_wise_earnings_fk2_idx` (`earnings_id`),
  CONSTRAINT `hims_f_project_wise_earnings_fk1` FOREIGN KEY (`project_wise_payroll_id`) REFERENCES `hims_f_project_wise_payroll` (`hims_f_project_wise_payroll_id`),
  CONSTRAINT `hims_f_project_wise_earnings_fk2` FOREIGN KEY (`earnings_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_project_wise_payroll`
--

DROP TABLE IF EXISTS `hims_f_project_wise_payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_project_wise_payroll` (
  `hims_f_project_wise_payroll_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `project_id` int NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') NOT NULL DEFAULT '1' COMMENT '1 = JAN\\n2 =FEB\\n3 = MAR\\n4 = APR\\n5 = MAY\\n6 = JUNE\\n7 =JULY\\n8 = AUG\\n9 = SEPT\\n10 = OCT\\n11= NOV\\n12= DEC',
  `year` smallint unsigned NOT NULL,
  `basic_hours` smallint DEFAULT '0',
  `basic_minutes` smallint DEFAULT '0',
  `ot_hours` smallint DEFAULT '0',
  `ot_minutes` smallint DEFAULT '0',
  `wot_hours` smallint DEFAULT '0',
  `wot_minutes` smallint DEFAULT '0',
  `hot_hours` smallint DEFAULT '0',
  `hot_minutes` smallint DEFAULT '0',
  `worked_hours` smallint DEFAULT '0',
  `worked_minutes` smallint DEFAULT '0',
  `basic_cost` decimal(10,3) DEFAULT '0.000',
  `ot_cost` decimal(10,3) DEFAULT '0.000',
  `wot_cost` decimal(10,3) DEFAULT '0.000',
  `hot_cost` decimal(10,3) DEFAULT '0.000',
  `cost` decimal(10,3) DEFAULT '0.000',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_project_wise_payroll_id`),
  UNIQUE KEY `unik_key` (`employee_id`,`project_id`,`month`,`year`),
  KEY `hims_f_project_wise_payroll_idx` (`project_id`),
  CONSTRAINT `hims_f_project_wise_payroll_fk1` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=466 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_rad_order`
--

DROP TABLE IF EXISTS `hims_f_rad_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_rad_order` (
  `hims_f_rad_order_id` int NOT NULL AUTO_INCREMENT,
  `ordered_services_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `status` enum('O','S','UP','CN','RC','RA') DEFAULT 'O' COMMENT 'O=Ordered\nS=Scheduled\nUP=Under Process\nCN=Cancelled\nRC= Result  Confirmed \nRA= Result Avaiable',
  `billed` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=YES\n N=NO',
  `cancelled` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N' COMMENT 'Y=YES\n N=NO',
  `ordered_date` datetime DEFAULT NULL,
  `ordered_by` int DEFAULT NULL,
  `test_type` enum('S','R') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'R' COMMENT 'S=Stat\nR=Routine',
  `template_id` int DEFAULT NULL,
  `scheduled_date_time` datetime DEFAULT NULL,
  `scheduled_by` int DEFAULT NULL,
  `arrived_date` datetime DEFAULT NULL,
  `arrived` enum('Y','N') DEFAULT 'N',
  `validate_by` int DEFAULT NULL,
  `validate_date_time` datetime DEFAULT NULL,
  `attended_by` int DEFAULT NULL,
  `attended_date_time` datetime DEFAULT NULL,
  `exam_start_date_time` datetime DEFAULT NULL,
  `exam_end_date_time` datetime DEFAULT NULL,
  `exam_status` enum('AW','ST','CN','CO') DEFAULT 'AW' COMMENT 'AW = Awaiting To Start\nST = Start\nCN = Canceled\nCO = Completed',
  `report_type` enum('NS','PR','FL','AD') DEFAULT 'NS' COMMENT 'NS = Not Selected\nPR = Preliminary\nFL = Final\nAD = Addended',
  `technician_id` int DEFAULT NULL,
  `result_html` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `comments` varchar(250) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_rad_order_id`),
  KEY `hims_f_rad_order_fk1_idx` (`patient_id`),
  KEY `hims_f_rad_order_fk2_idx` (`visit_id`),
  KEY `hims_f_rad_order_fk3_idx` (`provider_id`),
  KEY `hims_f_rad_order_fk4_idx` (`service_id`),
  KEY `hims_f_rad_order_fk5_idx` (`created_by`),
  KEY `hims_f_rad_order_fk6_idx` (`updated_by`),
  KEY `hims_f_rad_order_fk7_idx` (`ordered_by`),
  KEY `hims_f_rad_order_fk8_idx` (`scheduled_by`),
  KEY `hims_f_rad_order_fk9_idx` (`validate_by`),
  KEY `hims_f_rad_order_fk10_idx` (`attended_by`),
  KEY `hims_f_rad_order_fk10_idx1` (`technician_id`),
  KEY `hims_f_rad_order_fk10_idx2` (`ordered_services_id`),
  CONSTRAINT `hims_f_rad_order_fk1` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_rad_order_fk10` FOREIGN KEY (`attended_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_rad_order_fk11` FOREIGN KEY (`ordered_services_id`) REFERENCES `hims_f_ordered_services` (`hims_f_ordered_services_id`),
  CONSTRAINT `hims_f_rad_order_fk2` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_f_rad_order_fk3` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_rad_order_fk4` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_rad_order_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_rad_order_fk6` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_rad_order_fk7` FOREIGN KEY (`ordered_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_rad_order_fk8` FOREIGN KEY (`scheduled_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_rad_order_fk9` FOREIGN KEY (`validate_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_receipt_details`
--

DROP TABLE IF EXISTS `hims_f_receipt_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_receipt_details` (
  `hims_f_receipt_details_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_receipt_header_id` int DEFAULT NULL,
  `card_check_number` varchar(100) DEFAULT NULL,
  `bank_card_id` int DEFAULT NULL COMMENT 'M=MASTER\\nV=VISA\\nMA=MADA',
  `expiry_date` datetime DEFAULT NULL,
  `pay_type` enum('CA','CD','CH') DEFAULT NULL COMMENT 'CA=CASH\nCD=CARD\nCH=CHEQUE',
  `amount` decimal(10,2) DEFAULT '0.00',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_receipt_details_id`),
  KEY `hims_f_receipt_details_fk1_idx` (`hims_f_receipt_header_id`),
  KEY `hims_f_receipt_details_fk2_idx` (`created_by`),
  KEY `hims_f_receipt_details_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_receipt_details_fk4_idx_idx` (`bank_card_id`),
  CONSTRAINT `hims_f_receipt_details_fk1_idx` FOREIGN KEY (`hims_f_receipt_header_id`) REFERENCES `hims_f_receipt_header` (`hims_f_receipt_header_id`),
  CONSTRAINT `hims_f_receipt_details_fk2_idx` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_receipt_details_fk3_idx` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_receipt_header`
--

DROP TABLE IF EXISTS `hims_f_receipt_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_receipt_header` (
  `hims_f_receipt_header_id` int NOT NULL AUTO_INCREMENT,
  `receipt_number` varchar(100) NOT NULL,
  `receipt_date` datetime DEFAULT NULL,
  `billing_header_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `counter_id` int DEFAULT NULL COMMENT 'Foreign key from counter master',
  `shift_id` int DEFAULT NULL COMMENT 'Foreign key from shift master.',
  `pay_type` enum('R','P') NOT NULL DEFAULT 'R' COMMENT 'R = Receipt\\nP = Payment',
  `cash_handover_detail_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_receipt_header_id`),
  KEY `hims_f_receipt_header_fk1_idx` (`billing_header_id`),
  KEY `hims_f_receipt_header_fk2_idx` (`created_by`),
  KEY `hims_f_receipt_header_fk3_idx` (`updated_by`),
  KEY `hims_f_receipt_header_fk4_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_f_receipt_header_fk5_idx` (`cash_handover_detail_id`),
  CONSTRAINT `hims_f_receipt_header_fk1` FOREIGN KEY (`billing_header_id`) REFERENCES `hims_f_billing_header` (`hims_f_billing_header_id`),
  CONSTRAINT `hims_f_receipt_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_receipt_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_receipt_header_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_receipt_header_fk5` FOREIGN KEY (`cash_handover_detail_id`) REFERENCES `hims_f_cash_handover_detail` (`hims_f_cash_handover_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_salary`
--

DROP TABLE IF EXISTS `hims_f_salary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_salary` (
  `hims_f_salary_id` int NOT NULL AUTO_INCREMENT,
  `salary_number` varchar(45) NOT NULL,
  `month` enum('1','2','3','4','5','6','7','8','9','10','11','12') DEFAULT '1' COMMENT '1 = JAN\\n2 =FEB\\n3 = MAR\\n4 = APR\\n5 = MAY\\n6 = JUNE\\n7 =JULY\\n8 = AUG\\n9 = SEPT\\n10 = OCT\\n11= NOV\\n12= DEC',
  `year` smallint unsigned NOT NULL,
  `employee_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  `salary_date` date DEFAULT NULL,
  `per_day_sal` decimal(10,3) DEFAULT '0.000',
  `total_days` varchar(45) DEFAULT NULL,
  `present_days` decimal(5,2) DEFAULT '0.00',
  `display_present_days` decimal(5,2) DEFAULT '0.00',
  `absent_days` decimal(5,2) DEFAULT '0.00',
  `total_work_days` decimal(5,2) DEFAULT '0.00',
  `total_weekoff_days` decimal(5,2) DEFAULT '0.00',
  `total_holidays` decimal(5,2) DEFAULT '0.00',
  `total_leave` decimal(5,2) DEFAULT '0.00',
  `paid_leave` decimal(5,2) DEFAULT '0.00',
  `unpaid_leave` decimal(5,2) DEFAULT '0.00',
  `total_paid_days` decimal(5,2) DEFAULT '0.00',
  `total_hours` decimal(5,2) DEFAULT '0.00',
  `total_working_hours` decimal(5,2) DEFAULT '0.00',
  `shortage_hours` decimal(5,2) DEFAULT '0.00',
  `ot_work_hours` decimal(5,2) DEFAULT '0.00',
  `ot_weekoff_hours` decimal(5,2) DEFAULT '0.00',
  `ot_holiday_hours` decimal(5,2) DEFAULT '0.00',
  `pending_unpaid_leave` decimal(5,2) DEFAULT '0.00',
  `loan_payable_amount` decimal(10,3) DEFAULT '0.000' COMMENT 'this loan payable is for paying any loan request along with salary',
  `loan_due_amount` decimal(10,3) DEFAULT '0.000',
  `advance_due` decimal(10,3) DEFAULT '0.000',
  `gross_salary` decimal(10,3) DEFAULT '0.000',
  `total_earnings` decimal(10,3) DEFAULT '0.000',
  `total_deductions` decimal(10,3) DEFAULT '0.000',
  `total_contributions` decimal(10,3) DEFAULT '0.000',
  `net_salary` decimal(10,3) DEFAULT '0.000',
  `before_roundoff_amount` decimal(10,3) DEFAULT '0.000',
  `roundoff_amount` decimal(10,3) DEFAULT NULL,
  `salary_settled` enum('N','Y') DEFAULT 'N',
  `final_settlement_id` int DEFAULT NULL,
  `salary_type` enum('NS','LS','FS') DEFAULT 'NS',
  `negative_salary_id` int DEFAULT NULL,
  `negative_salary_month` varchar(45) DEFAULT NULL,
  `negative_salary_year` smallint unsigned DEFAULT NULL,
  `negative_salary_amount` decimal(10,3) DEFAULT '0.000',
  `negative_salary_balance` decimal(10,3) DEFAULT NULL,
  `salary_processed` enum('N','Y') DEFAULT 'N',
  `salary_processed_date` date DEFAULT NULL,
  `salary_processed_by` int DEFAULT NULL,
  `salary_paid` enum('N','Y') DEFAULT 'N',
  `salary_paid_date` date DEFAULT NULL,
  `salary_paid_by` int DEFAULT NULL,
  `authorized1_by` int DEFAULT NULL,
  `authorized1_date` datetime DEFAULT NULL,
  `authorized1` enum('N','Y') DEFAULT NULL,
  `authorized2_by` int DEFAULT NULL,
  `authorized2_date` datetime DEFAULT NULL,
  `authorized2` enum('N','Y') DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  `leave_salary_accrual_amount` decimal(15,2) DEFAULT NULL,
  `leave_salary_days` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`hims_f_salary_id`),
  UNIQUE KEY `unique_month_year_emp` (`month`,`year`,`employee_id`,`salary_type`)
) ENGINE=InnoDB AUTO_INCREMENT=770 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_salary_contributions`
--

DROP TABLE IF EXISTS `hims_f_salary_contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_salary_contributions` (
  `hims_f_salary_contributions_id` int NOT NULL AUTO_INCREMENT,
  `salary_header_id` int NOT NULL,
  `contributions_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_salary_contributions_id`),
  UNIQUE KEY `hims_f_salary_contributions_combination` (`salary_header_id`,`contributions_id`),
  KEY `hims_f_salary_contributions_fk1_idx` (`salary_header_id`),
  KEY `hims_f_salary_contributions_fk2_idx` (`contributions_id`),
  CONSTRAINT `hims_f_salary_contributions_fk1` FOREIGN KEY (`salary_header_id`) REFERENCES `hims_f_salary` (`hims_f_salary_id`),
  CONSTRAINT `hims_f_salary_contributions_fk2` FOREIGN KEY (`contributions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_salary_deductions`
--

DROP TABLE IF EXISTS `hims_f_salary_deductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_salary_deductions` (
  `hims_f_salary_deductions_id` int NOT NULL AUTO_INCREMENT,
  `salary_header_id` int NOT NULL,
  `deductions_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  `per_day_salary` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_salary_deductions_id`),
  UNIQUE KEY `hims_f_salary_deductions_combination_keys` (`salary_header_id`,`deductions_id`),
  KEY `hims_f_salary_deductions_fk1_idx` (`salary_header_id`),
  KEY `hims_f_salary_deductions_fk2_idx` (`deductions_id`),
  CONSTRAINT `hims_f_salary_deductions_fk1` FOREIGN KEY (`salary_header_id`) REFERENCES `hims_f_salary` (`hims_f_salary_id`),
  CONSTRAINT `hims_f_salary_deductions_fk2` FOREIGN KEY (`deductions_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_salary_earnings`
--

DROP TABLE IF EXISTS `hims_f_salary_earnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_salary_earnings` (
  `hims_f_salary_earnings_id` int NOT NULL AUTO_INCREMENT,
  `salary_header_id` int NOT NULL,
  `earnings_id` int NOT NULL,
  `amount` decimal(10,3) DEFAULT NULL,
  `per_day_salary` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_salary_earnings_id`),
  UNIQUE KEY `hims_f_salary_earnings_combination_keys` (`salary_header_id`,`earnings_id`),
  KEY `hims_f_salary_earnings_fk1_idx` (`salary_header_id`),
  KEY `hims_f_salary_earnings_fk2_idx` (`earnings_id`),
  CONSTRAINT `hims_f_salary_earnings_fk1` FOREIGN KEY (`salary_header_id`) REFERENCES `hims_f_salary` (`hims_f_salary_id`),
  CONSTRAINT `hims_f_salary_earnings_fk2` FOREIGN KEY (`earnings_id`) REFERENCES `hims_d_earning_deduction` (`hims_d_earning_deduction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2502 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_salary_loans`
--

DROP TABLE IF EXISTS `hims_f_salary_loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_salary_loans` (
  `hims_f_salary_loans_id` int NOT NULL AUTO_INCREMENT,
  `salary_header_id` int NOT NULL,
  `loan_application_id` int NOT NULL,
  `loan_due_amount` decimal(10,3) DEFAULT NULL,
  `balance_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_salary_loans_id`),
  UNIQUE KEY `hims_f_salary_loans_combination` (`salary_header_id`,`loan_application_id`),
  KEY `hims_f_salary_loans_fk1_idx` (`salary_header_id`),
  CONSTRAINT `hims_f_salary_loans_fk1` FOREIGN KEY (`salary_header_id`) REFERENCES `hims_f_salary` (`hims_f_salary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_dispatch_note_batches`
--

DROP TABLE IF EXISTS `hims_f_sales_dispatch_note_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_dispatch_note_batches` (
  `hims_f_sales_dispatch_note_batches_id` int NOT NULL AUTO_INCREMENT,
  `sales_dispatch_note_detail_id` int DEFAULT NULL,
  `sales_order_items_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `batchno` varchar(30) DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `ordered_quantity` decimal(10,3) DEFAULT '0.000',
  `dispatch_quantity` decimal(10,3) DEFAULT '0.000',
  `sales_price` decimal(10,3) DEFAULT '0.000',
  `unit_cost` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT '0.000',
  `average_cost` decimal(20,6) DEFAULT '0.000000',
  PRIMARY KEY (`hims_f_sales_dispatch_note_batches_id`),
  KEY `hims_f_sales_dispatch_note_batches_fk1_idx` (`sales_dispatch_note_detail_id`),
  KEY `hims_f_sales_dispatch_note_batches_fk2_idx` (`item_category_id`),
  KEY `hims_f_sales_dispatch_note_batches_fk3_idx` (`item_group_id`),
  KEY `hims_f_sales_dispatch_note_batches_fk4_idx` (`item_id`),
  KEY `hims_f_sales_dispatch_note_batches_fk5_idx` (`uom_id`),
  KEY `hims_f_sales_dispatch_note_batches_fk6_idx` (`sales_uom`),
  KEY `hims_f_sales_dispatch_note_batches_fk7_idx` (`sales_order_items_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk1` FOREIGN KEY (`sales_dispatch_note_detail_id`) REFERENCES `hims_f_sales_dispatch_note_detail` (`hims_f_sales_dispatch_note_detail_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk2` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk3` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk4` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk5` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk6` FOREIGN KEY (`sales_uom`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_batches_fk7` FOREIGN KEY (`sales_order_items_id`) REFERENCES `hims_f_sales_order_items` (`hims_f_sales_order_items_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1246 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_dispatch_note_detail`
--

DROP TABLE IF EXISTS `hims_f_sales_dispatch_note_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_dispatch_note_detail` (
  `hims_f_sales_dispatch_note_detail_id` int NOT NULL AUTO_INCREMENT,
  `dispatch_note_header_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `dispatched_quantity` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT NULL,
  `delivered_to_date` decimal(10,3) DEFAULT NULL,
  `ordered_quantity` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_dispatch_note_detail_id`),
  KEY `hims_f_sales_dispatch_note_detail_fk1_idx` (`dispatch_note_header_id`),
  KEY `hims_f_sales_dispatch_note_detail_fk2_idx` (`item_id`),
  KEY `hims_f_sales_dispatch_note_detail_fk3_idx` (`uom_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_detail_fk1` FOREIGN KEY (`dispatch_note_header_id`) REFERENCES `hims_f_sales_dispatch_note_header` (`hims_f_dispatch_note_header_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_detail_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_detail_fk3` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_dispatch_note_header`
--

DROP TABLE IF EXISTS `hims_f_sales_dispatch_note_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_dispatch_note_header` (
  `hims_f_dispatch_note_header_id` int NOT NULL AUTO_INCREMENT,
  `dispatch_note_number` varchar(45) DEFAULT NULL,
  `dispatch_note_date` datetime DEFAULT NULL,
  `sales_order_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `sub_total` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `total_tax` decimal(10,3) DEFAULT NULL,
  `net_payable` decimal(10,3) DEFAULT NULL,
  `narration` varchar(200) DEFAULT NULL,
  `invoice_generated` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_dispatch_note_header_id`),
  KEY `hims_f_sales_dispatch_note_header_fk1_idx` (`sales_order_id`),
  KEY `hims_f_sales_dispatch_note_header_fk2_idx` (`customer_id`),
  KEY `hims_f_sales_dispatch_note_header_fk3_idx` (`project_id`),
  KEY `hims_f_sales_dispatch_note_header_fk4_idx` (`created_by`),
  KEY `hims_f_sales_dispatch_note_header_fk5_idx` (`updated_by`),
  KEY `hims_f_sales_dispatch_note_header_fk6_idx` (`hospital_id`),
  KEY `hims_f_sales_dispatch_note_header_fk7_idx` (`location_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk1` FOREIGN KEY (`sales_order_id`) REFERENCES `hims_f_sales_order` (`hims_f_sales_order_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk2` FOREIGN KEY (`customer_id`) REFERENCES `hims_d_customer` (`hims_d_customer_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk3` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_sales_dispatch_note_header_fk7` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_invoice_detail`
--

DROP TABLE IF EXISTS `hims_f_sales_invoice_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_invoice_detail` (
  `hims_f_sales_invoice_detail_id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_header_id` int DEFAULT NULL,
  `dispatch_note_header_id` int DEFAULT NULL,
  `sub_total` decimal(10,3) DEFAULT '0.000',
  `net_total` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `net_payable` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`hims_f_sales_invoice_detail_id`),
  KEY `hims_f_sales_invoice_detail_fk1_idx` (`sales_invoice_header_id`),
  KEY `hims_f_sales_invoice_detail_fk2_idx` (`dispatch_note_header_id`),
  CONSTRAINT `hims_f_sales_invoice_detail_fk1` FOREIGN KEY (`sales_invoice_header_id`) REFERENCES `hims_f_sales_invoice_header` (`hims_f_sales_invoice_header_id`),
  CONSTRAINT `hims_f_sales_invoice_detail_fk2` FOREIGN KEY (`dispatch_note_header_id`) REFERENCES `hims_f_sales_dispatch_note_header` (`hims_f_dispatch_note_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_invoice_header`
--

DROP TABLE IF EXISTS `hims_f_sales_invoice_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_invoice_header` (
  `hims_f_sales_invoice_header_id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(45) DEFAULT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `sales_invoice_mode` enum('I','S') DEFAULT 'S' COMMENT 'I = Items \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n S = Services',
  `sales_order_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT NULL COMMENT '''0'' = 0 days \\n ’15’ = 15 days\\n ''30'' = 30 days \\n ’45’ = 45 days \\n ''60'' = 60 days \\n ''90'' = 90 days\\n ''120''= 120 days\\n ''180''= 180 days \\n ''365''= 365 days',
  `project_id` int DEFAULT NULL,
  `is_posted` enum('N','Y') DEFAULT 'N',
  `posted_date` datetime DEFAULT NULL,
  `posted_by` int DEFAULT NULL,
  `sub_total` decimal(10,3) DEFAULT '0.000',
  `net_total` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `total_tax` decimal(10,3) DEFAULT '0.000',
  `net_payable` decimal(10,3) DEFAULT '0.000',
  `return_done` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_invoice_header_id`),
  KEY `hims_f_sales_invoice_header_fk1_idx` (`sales_order_id`),
  KEY `hims_f_sales_invoice_header_fk2_idx` (`customer_id`),
  KEY `hims_f_sales_invoice_header_fk3_idx` (`project_id`),
  KEY `hims_f_sales_invoice_header_fk4_idx` (`created_by`),
  KEY `hims_f_sales_invoice_header_fk5_idx` (`updated_by`),
  KEY `hims_f_sales_invoice_header_fk6_idx` (`hospital_id`),
  KEY `hims_f_sales_invoice_header_fk7_idx` (`posted_by`),
  KEY `hims_f_sales_invoice_header_fk8_idx` (`location_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk1` FOREIGN KEY (`sales_order_id`) REFERENCES `hims_f_sales_order` (`hims_f_sales_order_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk2` FOREIGN KEY (`customer_id`) REFERENCES `hims_d_customer` (`hims_d_customer_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk3` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk7` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_invoice_header_fk8` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_invoice_services`
--

DROP TABLE IF EXISTS `hims_f_sales_invoice_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_invoice_services` (
  `hims_f_sales_invoice_services_id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_header_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT '0.000',
  `service_frequency` enum('M','W','D','H','PT','PP') DEFAULT 'M' COMMENT 'M-Monthly,\\\\\\\\nW-Weekly,\\\\\\\\nD-Daily,\\\\\\\\nH-Hourly, PT- Per Trip, PP- Per Person',
  PRIMARY KEY (`hims_f_sales_invoice_services_id`),
  KEY `hims_f_sales_invoice_services_fk1_idx` (`sales_invoice_header_id`),
  KEY `hims_f_sales_invoice_services_fk2_idx` (`services_id`),
  CONSTRAINT `hims_f_sales_invoice_services_fk1` FOREIGN KEY (`sales_invoice_header_id`) REFERENCES `hims_f_sales_invoice_header` (`hims_f_sales_invoice_header_id`),
  CONSTRAINT `hims_f_sales_invoice_services_fk2` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_numgen`
--

DROP TABLE IF EXISTS `hims_f_sales_numgen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_numgen` (
  `hims_f_sales_numgen_id` int NOT NULL AUTO_INCREMENT,
  `numgen_code` varchar(45) NOT NULL,
  `module_desc` varchar(250) NOT NULL,
  `prefix` varchar(45) NOT NULL COMMENT '''should be alpha-numeric''',
  `intermediate_series` varchar(45) NOT NULL,
  `postfix` varchar(200) NOT NULL COMMENT 'Number',
  `length` int NOT NULL COMMENT 'Total length postfix+prefix',
  `increment_by` int NOT NULL DEFAULT '1',
  `numgen_seperator` varchar(45) DEFAULT NULL,
  `postfix_start` varchar(200) NOT NULL,
  `postfix_end` varchar(200) NOT NULL,
  `current_num` varchar(500) DEFAULT NULL COMMENT 'concat of prefix & postfix',
  `pervious_num` varchar(500) DEFAULT NULL COMMENT 'Concat of prefix and post before updating current_num',
  `preceding_zeros_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `intermediate_series_req` enum('Y','N') NOT NULL DEFAULT 'Y',
  `reset_slno_on_year_change` enum('Y','N') NOT NULL DEFAULT 'Y',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_sales_numgen_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_order`
--

DROP TABLE IF EXISTS `hims_f_sales_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_order` (
  `hims_f_sales_order_id` int NOT NULL AUTO_INCREMENT,
  `sales_order_number` varchar(45) DEFAULT NULL,
  `sales_order_date` datetime DEFAULT NULL,
  `sales_order_mode` enum('I','S') DEFAULT 'S' COMMENT 'I = Items \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n S = Services',
  `sales_quotation_id` int DEFAULT NULL,
  `reference_number` varchar(45) DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `sales_man` varchar(20) DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT NULL COMMENT '''0'' = 0 days\n ’15’ = 15 days\n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `sub_total` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `total_tax` decimal(10,3) DEFAULT NULL,
  `net_payable` decimal(10,3) DEFAULT NULL,
  `narration` varchar(200) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `customer_po_no` varchar(45) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `sales_person_id` int DEFAULT NULL,
  `is_completed` enum('N','Y') DEFAULT 'N',
  `completed_by` int DEFAULT NULL,
  `completed_date` datetime DEFAULT NULL,
  `authorize1` enum('N','Y') DEFAULT 'N',
  `authorize1_by` int DEFAULT NULL,
  `authorize1_by_date` datetime DEFAULT NULL,
  `authorize2` enum('N','Y') DEFAULT 'N',
  `authorize2_by` int DEFAULT NULL,
  `authorize2_date` datetime DEFAULT NULL,
  `closed` enum('N','Y') DEFAULT 'N',
  `closed_by` int DEFAULT NULL,
  `closed_date` datetime DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancelled_by` int DEFAULT NULL,
  `cancelled_date` datetime DEFAULT NULL,
  `invoice_generated` enum('N','Y') DEFAULT 'N',
  `invoice_gen_by` int DEFAULT NULL,
  `invoice_gen_date` datetime DEFAULT NULL,
  `contract_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_order_id`),
  KEY `hims_f_sales_order_fk1_idx` (`customer_id`),
  KEY `hims_f_sales_order_fk2_idx` (`project_id`),
  KEY `hims_f_sales_order_fk3_idx` (`created_by`),
  KEY `hims_f_sales_order_fk5_idx` (`hospital_id`),
  KEY `hims_f_sales_order_fk6_idx` (`sales_quotation_id`),
  KEY `hims_f_sales_order_fk4` (`updated_by`),
  KEY `hims_f_sales_order_fk7_idx` (`completed_by`),
  KEY `hims_f_sales_order_fk8_idx` (`authorize1_by`),
  KEY `hims_f_sales_order_fk9_idx` (`authorize2_by`),
  KEY `hims_f_sales_order_fk10_idx` (`closed_by`),
  KEY `hims_f_sales_order_fk11_idx` (`sales_person_id`),
  KEY `hims_f_sales_order_fk12_idx` (`cancelled_by`),
  KEY `hims_f_sales_order_fk13_idx` (`invoice_gen_by`),
  CONSTRAINT `hims_f_sales_order_fk1` FOREIGN KEY (`customer_id`) REFERENCES `hims_d_customer` (`hims_d_customer_id`),
  CONSTRAINT `hims_f_sales_order_fk10` FOREIGN KEY (`closed_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk11` FOREIGN KEY (`sales_person_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_sales_order_fk12` FOREIGN KEY (`cancelled_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk13` FOREIGN KEY (`invoice_gen_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk2` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`),
  CONSTRAINT `hims_f_sales_order_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk5` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_sales_order_fk6` FOREIGN KEY (`sales_quotation_id`) REFERENCES `hims_f_sales_quotation` (`hims_f_sales_quotation_id`),
  CONSTRAINT `hims_f_sales_order_fk7` FOREIGN KEY (`completed_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk8` FOREIGN KEY (`authorize1_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_order_fk9` FOREIGN KEY (`authorize2_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_order_items`
--

DROP TABLE IF EXISTS `hims_f_sales_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_order_items` (
  `hims_f_sales_order_items_id` int NOT NULL AUTO_INCREMENT,
  `sales_order_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `quantity_outstanding` decimal(10,3) DEFAULT '0.000',
  PRIMARY KEY (`hims_f_sales_order_items_id`),
  KEY `hims_f_sales_order_items_fk1_idx` (`sales_order_id`),
  KEY `hims_f_sales_order_items_fk2_idx` (`item_id`),
  KEY `hims_f_sales_order_items_fk3_idx` (`uom_id`),
  CONSTRAINT `hims_f_sales_order_items_fk1` FOREIGN KEY (`sales_order_id`) REFERENCES `hims_f_sales_order` (`hims_f_sales_order_id`),
  CONSTRAINT `hims_f_sales_order_items_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_sales_order_items_fk3` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1291 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_order_services`
--

DROP TABLE IF EXISTS `hims_f_sales_order_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_order_services` (
  `hims_f_sales_order_services_id` int NOT NULL AUTO_INCREMENT,
  `sales_order_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `service_frequency` enum('M','W','D','H','PT','PP') DEFAULT 'M' COMMENT 'M-Monthly,\\\\nW-Weekly,\\\\nD-Daily,\\\\nH-Hourly, PT- Per Trip, PP- Per Person',
  `comments` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_order_services_id`),
  KEY `hims_f_sales_order_services_fk1_idx` (`sales_order_id`),
  KEY `hims_f_sales_order_services_fk2_idx` (`services_id`),
  CONSTRAINT `hims_f_sales_order_services_fk1` FOREIGN KEY (`sales_order_id`) REFERENCES `hims_f_sales_order` (`hims_f_sales_order_id`),
  CONSTRAINT `hims_f_sales_order_services_fk2` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_quotation`
--

DROP TABLE IF EXISTS `hims_f_sales_quotation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_quotation` (
  `hims_f_sales_quotation_id` int NOT NULL AUTO_INCREMENT,
  `sales_quotation_number` varchar(45) DEFAULT NULL,
  `sales_quotation_date` datetime DEFAULT NULL,
  `sales_quotation_mode` enum('I','S') DEFAULT 'S' COMMENT 'I = Items \\\\\\\\\\\\\\\\n S = Services',
  `reference_number` varchar(45) DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `quote_validity` date DEFAULT NULL,
  `sales_man` varchar(20) DEFAULT NULL,
  `payment_terms` enum('0','15','30','45','60','90','120','180','365') DEFAULT NULL COMMENT '''0'' = 0 days\n ’15’ = 15 days\n ''30'' = 30 days \n ’45’ = 45 days \n ''60'' = 60 days \n ''90'' = 90 days\n ''120''= 120 days\n ''180''= 180 days \n ''365''= 365 days',
  `service_terms` varchar(80) DEFAULT NULL,
  `other_terms` varchar(45) DEFAULT NULL,
  `sub_total` decimal(10,3) DEFAULT NULL,
  `discount_amount` decimal(10,3) DEFAULT NULL,
  `net_total` decimal(10,3) DEFAULT NULL,
  `total_tax` decimal(10,3) DEFAULT NULL,
  `total_item_amount` decimal(10,3) DEFAULT '0.000',
  `total_service_amount` decimal(10,3) DEFAULT '0.000',
  `net_payable` decimal(10,3) DEFAULT NULL,
  `narration` varchar(200) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `no_of_days_followup` smallint DEFAULT NULL,
  `terms_conditions` mediumtext,
  `comments` varchar(250) DEFAULT NULL,
  `cancel_comments` varchar(250) DEFAULT NULL,
  `sales_person_id` int DEFAULT NULL,
  `qotation_status` enum('G','O','C','CL') DEFAULT 'G' COMMENT 'G- Generated,\\nO- Order Created,\\nC- Closed, \\n CL-Canceled',
  `quote_items_status` enum('N','G','O','C') DEFAULT 'N' COMMENT 'N- None, G- Generated,\\\\nO- Order Created,\\\\nC- Closed',
  `quote_services_status` enum('N','G','O','C') DEFAULT 'N' COMMENT 'N- None, G- Generated,\\\\nO- Order Created,\\\\nC- Closed',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_quotation_id`),
  KEY `hims_f_sales_quotation_fk1_idx` (`customer_id`),
  KEY `hims_f_sales_quotation_fk2_idx` (`created_by`),
  KEY `hims_f_sales_quotation_fk3_idx` (`updated_by`),
  KEY `hims_f_sales_quotation_fk4_idx` (`hospital_id`),
  KEY `hims_f_sales_quotation_fk5_idx` (`sales_person_id`),
  CONSTRAINT `hims_f_sales_quotation_fk1` FOREIGN KEY (`customer_id`) REFERENCES `hims_d_customer` (`hims_d_customer_id`),
  CONSTRAINT `hims_f_sales_quotation_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_quotation_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_quotation_fk4` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_sales_quotation_fk5` FOREIGN KEY (`sales_person_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=249 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_quotation_items`
--

DROP TABLE IF EXISTS `hims_f_sales_quotation_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_quotation_items` (
  `hims_f_sales_quotation_items_id` int NOT NULL AUTO_INCREMENT,
  `sales_quotation_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_quotation_items_id`),
  KEY `hims_f_sales_quotation_items_fk1_idx` (`sales_quotation_id`),
  KEY `hims_f_sales_quotation_items_fk2_idx` (`item_id`),
  KEY `hims_f_sales_quotation_items_fk3_idx` (`uom_id`),
  CONSTRAINT `hims_f_sales_quotation_items_fk1` FOREIGN KEY (`sales_quotation_id`) REFERENCES `hims_f_sales_quotation` (`hims_f_sales_quotation_id`),
  CONSTRAINT `hims_f_sales_quotation_items_fk2` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_sales_quotation_items_fk3` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2474 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_quotation_services`
--

DROP TABLE IF EXISTS `hims_f_sales_quotation_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_quotation_services` (
  `hims_f_sales_quotation_services_id` int NOT NULL AUTO_INCREMENT,
  `sales_quotation_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT '0.000',
  `quantity` decimal(10,2) DEFAULT '0.00',
  `extended_cost` decimal(10,3) DEFAULT '0.000',
  `discount_percentage` decimal(5,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_extended_cost` decimal(10,3) DEFAULT '0.000',
  `tax_percentage` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `total_amount` decimal(10,3) DEFAULT NULL,
  `service_frequency` enum('M','W','D','H','PT','PP') DEFAULT 'M' COMMENT 'M-Monthly,\\nW-Weekly,\\nD-Daily,\\nH-Hourly, PT- Per Trip, PP- Per Person',
  `comments` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_quotation_services_id`),
  KEY `hims_f_sales_quotation_services_fk1_idx` (`sales_quotation_id`),
  KEY `hims_f_sales_quotation_services_fk2_idx` (`services_id`),
  CONSTRAINT `hims_f_sales_quotation_services_fk1` FOREIGN KEY (`sales_quotation_id`) REFERENCES `hims_f_sales_quotation` (`hims_f_sales_quotation_id`),
  CONSTRAINT `hims_f_sales_quotation_services_fk2` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_return_detail`
--

DROP TABLE IF EXISTS `hims_f_sales_return_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_return_detail` (
  `hims_f_sales_return_detail_id` int NOT NULL AUTO_INCREMENT,
  `sales_return_header_id` int DEFAULT NULL,
  `item_category_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `item_group_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `dispatch_quantity` decimal(20,3) DEFAULT NULL,
  `unit_cost` decimal(10,3) DEFAULT NULL,
  `return_qty` decimal(10,3) DEFAULT NULL,
  `extended_cost` decimal(20,3) DEFAULT NULL,
  `discount_percentage` decimal(5,3) DEFAULT NULL,
  `discount_amount` decimal(20,3) DEFAULT NULL,
  `net_extended_cost` decimal(20,3) DEFAULT NULL,
  `tax_percentage` decimal(5,3) DEFAULT '0.000',
  `tax_amount` decimal(20,3) DEFAULT NULL,
  `total_amount` decimal(20,3) DEFAULT NULL,
  `batchno` varchar(45) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `dispatch_note_header_id` int DEFAULT NULL,
  `sales_uom_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_return_detail_id`),
  KEY `hims_f_sales_return_detail_fk1_idx` (`sales_return_header_id`),
  KEY `hims_f_sales_return_detail_fk2_idx` (`item_category_id`),
  KEY `hims_f_sales_return_detail_fk3_idx` (`uom_id`),
  KEY `hims_f_sales_return_detail_fk4_idx` (`item_group_id`),
  KEY `hims_f_sales_return_detail_fk5_idx` (`item_id`),
  KEY `hims_f_sales_return_detail_fk6_idx` (`dispatch_note_header_id`),
  KEY `hims_f_sales_return_detail_fk7_idx` (`sales_uom_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk1` FOREIGN KEY (`sales_return_header_id`) REFERENCES `hims_f_sales_return_header` (`hims_f_sales_return_header_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk2` FOREIGN KEY (`item_category_id`) REFERENCES `hims_d_inventory_tem_category` (`hims_d_inventory_tem_category_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk3` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk4` FOREIGN KEY (`item_group_id`) REFERENCES `hims_d_inventory_item_group` (`hims_d_inventory_item_group_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk5` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk6` FOREIGN KEY (`dispatch_note_header_id`) REFERENCES `hims_f_sales_dispatch_note_header` (`hims_f_dispatch_note_header_id`),
  CONSTRAINT `hims_f_sales_return_detail_fk7` FOREIGN KEY (`sales_uom_id`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_sales_return_header`
--

DROP TABLE IF EXISTS `hims_f_sales_return_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_sales_return_header` (
  `hims_f_sales_return_header_id` int NOT NULL AUTO_INCREMENT,
  `sales_invoice_header_id` int DEFAULT NULL,
  `sales_return_number` varchar(45) DEFAULT NULL,
  `return_date` datetime DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `comment` text,
  `invoice_net_payable` decimal(10,3) DEFAULT '0.000',
  `sub_total` decimal(10,3) DEFAULT '0.000',
  `discount_amount` decimal(10,3) DEFAULT '0.000',
  `net_total` decimal(10,3) DEFAULT '0.000',
  `tax_amount` decimal(10,3) DEFAULT '0.000',
  `return_total` decimal(10,3) DEFAULT '0.000',
  `is_posted` enum('N','Y') DEFAULT 'N',
  `posted_by` int DEFAULT NULL,
  `posted_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `cancelled` enum('N','Y') DEFAULT 'N',
  `cancel_by` int DEFAULT NULL,
  `cancel_date` datetime DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_sales_return_header_id`),
  KEY `hims_f_sales_return_header_fk1_idx` (`sales_invoice_header_id`),
  KEY `hims_f_sales_return_header_fk2_idx` (`location_id`),
  KEY `hims_f_sales_return_header_fk3_idx` (`customer_id`),
  KEY `hims_f_sales_return_header_fk4_idx` (`project_id`),
  KEY `hims_f_sales_return_header_fk5_idx` (`posted_by`),
  KEY `hims_f_sales_return_header_fk6_idx` (`created_by`),
  KEY `hims_f_sales_return_header_fk7_idx` (`cancel_by`),
  KEY `hims_f_sales_return_header_fk8_idx` (`hospital_id`),
  CONSTRAINT `hims_f_sales_return_header_fk1` FOREIGN KEY (`sales_invoice_header_id`) REFERENCES `hims_f_sales_invoice_header` (`hims_f_sales_invoice_header_id`),
  CONSTRAINT `hims_f_sales_return_header_fk2` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_f_sales_return_header_fk3` FOREIGN KEY (`customer_id`) REFERENCES `hims_d_customer` (`hims_d_customer_id`),
  CONSTRAINT `hims_f_sales_return_header_fk4` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`),
  CONSTRAINT `hims_f_sales_return_header_fk5` FOREIGN KEY (`posted_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_return_header_fk6` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_return_header_fk7` FOREIGN KEY (`cancel_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_sales_return_header_fk8` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_service_approval`
--

DROP TABLE IF EXISTS `hims_f_service_approval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_service_approval` (
  `hims_f_service_approval_id` int NOT NULL AUTO_INCREMENT,
  `ordered_services_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `insurance_provider_id` int DEFAULT NULL,
  `network_id` int DEFAULT NULL,
  `insurance_network_office_id` int DEFAULT NULL,
  `icd_code` int DEFAULT NULL,
  `requested_date` date DEFAULT NULL,
  `requested_by` int DEFAULT NULL,
  `requested_mode` enum('O','E','T','F') DEFAULT 'O' COMMENT 'O = ONLINE\nE = EMAIL\nT = TELEPHONE\nF=FAX',
  `requested_quantity` int DEFAULT NULL,
  `submission_type` enum('S','RS','C','CS','CRS') DEFAULT NULL COMMENT 'S=SUBMIT\nRS=RESUBMIT\nC=CANCEL\nCS=CANCEL and SUBMIT\nCRS=CANCEL and RESUBMIT',
  `insurance_service_name` varchar(45) DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `refer_no` varchar(45) DEFAULT NULL,
  `gross_amt` decimal(10,3) NOT NULL DEFAULT '0.000',
  `net_amount` decimal(10,3) NOT NULL DEFAULT '0.000',
  `patient_share` decimal(10,3) DEFAULT NULL,
  `company_share` decimal(10,3) DEFAULT NULL,
  `approved_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `approved_no` varchar(45) DEFAULT NULL,
  `apprv_remarks` varchar(200) DEFAULT NULL,
  `apprv_date` datetime DEFAULT NULL,
  `rejected_reason` varchar(200) DEFAULT NULL,
  `apprv_status` enum('NR','AW','AP','RJ') NOT NULL DEFAULT 'NR' COMMENT 'NR = NOT REQUESTED \nAW=AWAITING APPROVAL\nAP = APPROVED\nRJ = REJECTED',
  `valid_upto` date DEFAULT NULL,
  `billing_updated` enum('N','Y') DEFAULT 'N',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_service_approval_id`),
  KEY `hims_f_service_approval_fk1_idx` (`doctor_id`),
  KEY `hims_f_service_approval_fk1_idx1` (`service_id`),
  KEY `hims_f_service_approval_fk4_idx` (`requested_by`),
  KEY `hims_f_service_approval_fk5_idx` (`created_by`),
  KEY `hims_f_service_approval_fk6_idx` (`updated_by`),
  KEY `hims_f_service_approval_fk8_idx` (`insurance_provider_id`),
  KEY `hims_f_service_approval_fk9_idx` (`insurance_network_office_id`),
  KEY `hims_f_service_approval_fk10_idx` (`ordered_services_id`),
  KEY `hims_f_service_approval_fk10_idx1` (`network_id`),
  KEY `hims_f_service_approval_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_service_approval` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_f_service_approval_fk1` FOREIGN KEY (`doctor_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_service_approval_fk10` FOREIGN KEY (`ordered_services_id`) REFERENCES `hims_f_ordered_services` (`hims_f_ordered_services_id`),
  CONSTRAINT `hims_f_service_approval_fk4` FOREIGN KEY (`requested_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_service_approval_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_service_approval_fk6` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_service_approval_fk7` FOREIGN KEY (`service_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_f_service_approval_fk9` FOREIGN KEY (`insurance_network_office_id`) REFERENCES `hims_d_insurance_network_office` (`hims_d_insurance_network_office_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_shift_roster`
--

DROP TABLE IF EXISTS `hims_f_shift_roster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_shift_roster` (
  `hims_f_shift_roster_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `sub_department_id` int DEFAULT NULL,
  `shift_date` date NOT NULL,
  `shift_id` int DEFAULT NULL,
  `shift_end_date` date DEFAULT NULL,
  `shift_start_time` time DEFAULT NULL,
  `shift_end_time` time DEFAULT NULL,
  `shift_time` decimal(4,2) DEFAULT NULL,
  `weekoff` enum('Y','N') DEFAULT 'N',
  `holiday` enum('Y','N') DEFAULT 'N',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_shift_roster_id`),
  UNIQUE KEY `employee_n_date` (`employee_id`,`shift_date`),
  KEY `hims_f_shift_roster_fk1_idx` (`employee_id`),
  KEY `hims_f_shift_roster_fk2_idx` (`shift_id`),
  KEY `index4` (`shift_date`),
  KEY `index5` (`shift_end_date`),
  KEY `index6` (`shift_start_time`),
  KEY `hims_f_shift_roster_fk3_idx` (`hospital_id`),
  CONSTRAINT `hims_f_shift_roster_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_f_shift_roster_fk2` FOREIGN KEY (`shift_id`) REFERENCES `hims_d_shift` (`hims_d_shift_id`),
  CONSTRAINT `hims_f_shift_roster_fk3` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_terms_condition`
--

DROP TABLE IF EXISTS `hims_f_terms_condition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_terms_condition` (
  `hims_f_terms_condition_id` int NOT NULL AUTO_INCREMENT,
  `short_name` varchar(45) DEFAULT NULL,
  `terms_cond_description` varchar(250) DEFAULT NULL,
  `terms_cond_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_f_terms_condition_id`),
  KEY `hims_f_terms_condition_fk1_idx` (`created_by`),
  KEY `hims_f_terms_condition_fk2_idx` (`updated_by`),
  CONSTRAINT `hims_f_terms_condition_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_terms_condition_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_treatment_plan`
--

DROP TABLE IF EXISTS `hims_f_treatment_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_treatment_plan` (
  `hims_f_treatment_plan_id` int NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(150) DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `visit_id` int DEFAULT NULL,
  `remarks` varchar(250) DEFAULT NULL,
  `approve_status` enum('N','Y','C') DEFAULT 'N' COMMENT 'Y=YES\nN=NO\nC=CANCEL\n',
  `plan_status` enum('O','C') DEFAULT 'O' COMMENT 'O = OPEN, C =CLOSED',
  `consult_date` date DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_treatment_plan_id`),
  KEY `hims_f_treatment_plan_fk1_idx` (`created_by`),
  KEY `hims_f_treatment_plan_fk2_idx` (`updated_by`),
  KEY `hims_f_treatment_plan_fk3_idx` (`patient_id`),
  KEY `hims_f_treatment_plan_fk4_idx` (`visit_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_f_treatment_plan_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_treatment_plan_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_f_treatment_plan_fk3` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_treatment_plan_fk4` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ucaf_header`
--

DROP TABLE IF EXISTS `hims_f_ucaf_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ucaf_header` (
  `hims_f_ucaf_header_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `visit_id` int NOT NULL,
  `visit_date` date NOT NULL,
  `provider_name` varchar(750) DEFAULT NULL,
  `new_visit_patient` enum('Y','N') DEFAULT 'N',
  `appointment_patient` enum('Y','N') DEFAULT 'N',
  `sub_department_name` varchar(150) DEFAULT NULL,
  `patient_code` varchar(45) DEFAULT NULL,
  `patient_marital_status` varchar(15) DEFAULT NULL,
  `patient_full_name` varchar(180) DEFAULT NULL,
  `case_type` enum('OP','IP') DEFAULT 'OP',
  `patient_emergency_case` enum('L1,L2,L3') DEFAULT NULL COMMENT 'L1=Level 1\nL2=Level 2\nL3=Level 3',
  `patient_bp_sys` decimal(10,2) DEFAULT NULL,
  `patient_bp_dia` decimal(10,2) DEFAULT NULL,
  `patient_pulse` decimal(10,2) DEFAULT NULL,
  `patient_temp` decimal(10,2) DEFAULT NULL COMMENT 'In degree Centi.',
  `patient_weight` decimal(10,2) DEFAULT NULL COMMENT 'weight in KG',
  `patient_height` decimal(10,2) DEFAULT NULL COMMENT 'Height in CM',
  `patient_respiratory_rate` decimal(10,2) DEFAULT NULL,
  `patient_duration_of_illness` decimal(10,2) DEFAULT NULL COMMENT 'Days',
  `patient_chief_comp_main_symptoms` text,
  `patient_significant_signs` text,
  `patient_other_conditions` text,
  `patient_diagnosys` text,
  `patient_principal_code_1` varchar(45) DEFAULT NULL,
  `patient_principal_code_2` varchar(45) DEFAULT NULL,
  `patient_principal_code_3` varchar(45) DEFAULT NULL,
  `patient_principal_code_4` varchar(45) DEFAULT NULL,
  `patient_complaint_type` enum('CHRONIC','CONGENTIAL','RTA','WORKRELATED','VACCINATION','CHECKUP','PSYCHIATRIC','INFERTILITY','PREGNANCY') DEFAULT NULL COMMENT '''CHRONIC'', ''CONGENTIAL'', ''RTA'', ''WORKRELATED'', ''VACCINATION'', ''CHECKUP'', ''PSYCHIATRIC'', ''INFERTILITY'', ''PREGNANCY''',
  `patient_indicated_LMP` tinyint DEFAULT '0',
  `patient_gender` varchar(45) DEFAULT 'Male',
  `age_in_years` int DEFAULT NULL,
  `insuarance_class` varchar(45) DEFAULT NULL,
  `insurance_holder` varchar(750) DEFAULT NULL,
  `patient_cmfi` enum('Y','N') DEFAULT 'N',
  `patient_refill` enum('Y','N') DEFAULT 'N',
  `patient_walkin` enum('Y','N') DEFAULT 'N',
  `patient_referal` enum('Y','N') DEFAULT 'N',
  `insurance_company_use_only_approved` enum('Y','N') DEFAULT 'N',
  `insurance_company_use_only_not_approved` enum('Y','N') DEFAULT 'N',
  `insurance_company_use_only_approval_no` varchar(80) DEFAULT NULL,
  `insurance_company_use_only_approval_validity_days` decimal(10,1) DEFAULT NULL,
  `insurance_company_use_only_comments` varchar(250) DEFAULT NULL,
  `insurance_company_use_only_approved_by` varchar(80) DEFAULT NULL,
  `insurance_company_use_only_approved_date` date DEFAULT NULL,
  `name_relation_guardian` varchar(80) DEFAULT NULL,
  `physican_capture_date` date DEFAULT NULL,
  `relation_guardian_date` date DEFAULT NULL,
  `patient_cmfi_comments` varchar(250) DEFAULT NULL,
  `patient_estimated_length_of_stay` decimal(10,2) DEFAULT NULL,
  `patient_expected_date_of_addmission` date DEFAULT NULL,
  `eligible_reference_number` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_f_ucaf_header_id`),
  KEY `hims_f_ucaf_header_hims_f_patient_fk_idx` (`patient_id`),
  KEY `hims_f_ucaf_header_hims_f_patient_visit_fk_idx` (`visit_id`),
  CONSTRAINT `hims_f_ucaf_header_hims_f_patient_fk` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_f_ucaf_header_hims_f_patient_visit_fk` FOREIGN KEY (`visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ucaf_insurance_details`
--

DROP TABLE IF EXISTS `hims_f_ucaf_insurance_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ucaf_insurance_details` (
  `hims_f_ucaf_details_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_ucaf_header_id` int DEFAULT NULL,
  `primary_policy_num` varchar(100) DEFAULT NULL,
  `primary_effective_start_date` date DEFAULT NULL,
  `primary_effective_end_date` date DEFAULT NULL,
  `primary_card_number` varchar(20) DEFAULT NULL,
  `primary_insurance_provider_id` int DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_policy_num` varchar(100) DEFAULT NULL,
  `secondary_card_number` varchar(20) DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `primary_insurance_company_name` varchar(255) DEFAULT NULL,
  `secondary_insurance_company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `primary_tpa_insurance_company_name` varchar(245) DEFAULT NULL,
  `secondary_tpa_insurance_company_name` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`hims_f_ucaf_details_id`),
  KEY `hims_f_ucaf_insurance_details_hims_d_insurance_provider_fk_idx` (`primary_insurance_provider_id`),
  KEY `hims_f_ucaf_insurance_details_hims_d_insurance_provider_fk1_idx` (`secondary_insurance_provider_id`),
  KEY `hims_f_ucaf_insurance_details_hims_f_ucaf_header_idx` (`hims_f_ucaf_header_id`),
  CONSTRAINT `hims_f_ucaf_insurance_details_hims_d_insurance_provider_fk` FOREIGN KEY (`primary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_ucaf_insurance_details_hims_d_insurance_provider_fk1` FOREIGN KEY (`secondary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_f_ucaf_insurance_details_hims_f_ucaf_header` FOREIGN KEY (`hims_f_ucaf_header_id`) REFERENCES `hims_f_ucaf_header` (`hims_f_ucaf_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ucaf_medication`
--

DROP TABLE IF EXISTS `hims_f_ucaf_medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ucaf_medication` (
  `hims_f_ucaf_medication_id` int NOT NULL AUTO_INCREMENT,
  `hims_f_ucaf_header_id` int DEFAULT NULL,
  `generic_name` varchar(120) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`hims_f_ucaf_medication_id`),
  KEY `hims_f_ucaf_medication_fk_idx` (`hims_f_ucaf_header_id`),
  CONSTRAINT `hims_f_ucaf_medication_fk` FOREIGN KEY (`hims_f_ucaf_header_id`) REFERENCES `hims_f_ucaf_header` (`hims_f_ucaf_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_f_ucaf_services`
--

DROP TABLE IF EXISTS `hims_f_ucaf_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_f_ucaf_services` (
  `hims_f_ucaf_services_id` int NOT NULL AUTO_INCREMENT,
  `service_type` varchar(100) DEFAULT NULL,
  `hims_f_ucaf_header_id` int DEFAULT NULL,
  `service_code` varchar(20) DEFAULT NULL,
  `service_name` varchar(200) DEFAULT NULL,
  `service_quantity` decimal(10,2) DEFAULT NULL,
  `service_net_amout` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`hims_f_ucaf_services_id`),
  KEY `hims_f_ucaf_services_fk_idx` (`hims_f_ucaf_header_id`),
  CONSTRAINT `hims_f_ucaf_services_fk` FOREIGN KEY (`hims_f_ucaf_header_id`) REFERENCES `hims_f_ucaf_header` (`hims_f_ucaf_header_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_branch_dept_map`
--

DROP TABLE IF EXISTS `hims_m_branch_dept_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_branch_dept_map` (
  `hims_m_branch_dept_map_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int DEFAULT NULL,
  `sub_department_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_branch_dept_map_id`),
  UNIQUE KEY `index4` (`hospital_id`,`sub_department_id`),
  KEY `hims_m_branch_dept_map_fk2_idx` (`hospital_id`),
  KEY `hims_m_branch_dept_map_fk1_idx` (`sub_department_id`),
  CONSTRAINT `hims_m_branch_dept_map_fk1` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_m_branch_dept_map_fk2` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_cashier_shift`
--

DROP TABLE IF EXISTS `hims_m_cashier_shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_cashier_shift` (
  `hims_m_cashier_shift_id` int NOT NULL AUTO_INCREMENT,
  `cashier_id` int DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_cashier_shift_id`),
  KEY `hims_m_cashier_shift_fk1_idx` (`cashier_id`),
  KEY `hims_m_cashier_shift_fk2_idx` (`created_by`),
  KEY `hims_m_cashier_shift_fk3_idx` (`updated_by`),
  KEY `hims_m_cashier_shift_fk4_idx` (`shift_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_cashier_shift_fk1` FOREIGN KEY (`cashier_id`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_cashier_shift_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_cashier_shift_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_cashier_shift_fk4` FOREIGN KEY (`shift_id`) REFERENCES `hims_d_shift` (`hims_d_shift_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_category_speciality_mappings`
--

DROP TABLE IF EXISTS `hims_m_category_speciality_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_category_speciality_mappings` (
  `hims_m_category_speciality_mappings_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `speciality_id` int NOT NULL,
  `description` varchar(60) DEFAULT NULL,
  `category_speciality_status` enum('A','I') NOT NULL DEFAULT 'A',
  `effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_m_category_speciality_mappings_id`),
  KEY `hims_m_category_speciality_mappings_fk1_idx` (`category_id`),
  KEY `hims_m_category_speciality_mappings_fk2_idx` (`speciality_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_category_speciality_mappings_fk1` FOREIGN KEY (`category_id`) REFERENCES `hims_d_employee_category` (`hims_employee_category_id`),
  CONSTRAINT `hims_m_category_speciality_mappings_fk2` FOREIGN KEY (`speciality_id`) REFERENCES `hims_d_employee_speciality` (`hims_d_employee_speciality_id`),
  CONSTRAINT `hims_m_category_speciality_mappings_fk4` FOREIGN KEY (`category_id`) REFERENCES `hims_d_employee_category` (`hims_employee_category_id`),
  CONSTRAINT `hims_m_category_speciality_mappings_fk5` FOREIGN KEY (`speciality_id`) REFERENCES `hims_d_employee_speciality` (`hims_d_employee_speciality_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_department_vital_mapping`
--

DROP TABLE IF EXISTS `hims_m_department_vital_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_department_vital_mapping` (
  `hims_m_department_vital_mapping_id` int NOT NULL AUTO_INCREMENT,
  `department_id` int DEFAULT NULL,
  `vital_header_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_department_vital_mapping_id`),
  KEY `hims_m_department_vital_mapping_fk1_idx` (`department_id`),
  KEY `hims_m_department_vital_mapping_fk3_idx` (`updated_by`),
  KEY `hims_m_department_vital_mapping_fk5_idx` (`created_by`),
  KEY `hims_m_department_vital_mapping_idx` (`vital_header_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_department_vital_mapping` FOREIGN KEY (`vital_header_id`) REFERENCES `hims_d_vitals_header` (`hims_d_vitals_header_id`),
  CONSTRAINT `hims_m_department_vital_mapping_fk1` FOREIGN KEY (`department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_m_department_vital_mapping_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_department_vital_mapping_fk5` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_division_project`
--

DROP TABLE IF EXISTS `hims_m_division_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_division_project` (
  `hims_m_division_project_id` int NOT NULL AUTO_INCREMENT,
  `division_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `d_p_status` enum('A','I') DEFAULT 'A',
  `inactive_date` date DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_division_project_id`),
  KEY `hims_m_division_project_fk1_idx` (`division_id`),
  KEY `hims_m_division_project_fk2_idx` (`project_id`),
  KEY `hims_m_division_project_fk3_idx` (`created_by`),
  KEY `hims_m_division_project_fk4_idx` (`updated_by`),
  CONSTRAINT `hims_m_division_project_fk1` FOREIGN KEY (`division_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_m_division_project_fk2` FOREIGN KEY (`project_id`) REFERENCES `hims_d_project` (`hims_d_project_id`),
  CONSTRAINT `hims_m_division_project_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_division_project_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_doctor_service_commission`
--

DROP TABLE IF EXISTS `hims_m_doctor_service_commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_doctor_service_commission` (
  `hims_m_doctor_service_commission_id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int DEFAULT NULL,
  `services_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `op_cash_commission_percent` decimal(5,3) DEFAULT NULL,
  `op_credit_commission_percent` decimal(5,3) DEFAULT NULL,
  `ip_cash_commission_percent` decimal(5,3) DEFAULT NULL,
  `ip_credit_commission_percent` decimal(5,3) DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'ENUM(''A'', ''I'')',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_doctor_service_commission_id`,`created_by`),
  KEY `hims_m_doctor_service_commission_fk1_idx` (`created_by`),
  KEY `hims_m_doctor_service_commission_fk2_idx` (`updated_by`),
  KEY `hims_m_doctor_service_commission_fk3_idx` (`provider_id`),
  KEY `hims_m_doctor_service_commission_fk4_idx` (`services_id`),
  KEY `hims_m_doctor_service_commission_fk7_idx` (`service_type_id`),
  KEY `hims_m_doctor_service_commission_fk7_idx1` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_doctor_service_commission_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_doctor_service_commission_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_doctor_service_commission_fk3` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_m_doctor_service_commission_fk4` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`),
  CONSTRAINT `hims_m_doctor_service_commission_fk7` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_doctor_service_type_commission`
--

DROP TABLE IF EXISTS `hims_m_doctor_service_type_commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_doctor_service_type_commission` (
  `hims_m_doctor_service_type_commission_id` int NOT NULL AUTO_INCREMENT,
  `provider_id` int DEFAULT NULL,
  `service_type_id` int DEFAULT NULL,
  `op_cash_comission_percent` decimal(5,3) DEFAULT NULL,
  `op_credit_comission_percent` decimal(5,3) DEFAULT NULL,
  `ip_cash_commission_percent` decimal(5,3) DEFAULT NULL,
  `ip_credit_commission_percent` decimal(5,3) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'ENUM(''A'', ''I'')',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_doctor_service_type_commission_id`),
  KEY `hims_m_doctor_service_type_commission_fk1_idx` (`created_by`),
  KEY `hims_m_doctor_service_type_commission_fk2_idx` (`updated_by`),
  KEY `hims_m_doctor_service_type_commission_fk3_idx` (`provider_id`),
  KEY `hims_m_doctor_service_type_commission_fk5_idx` (`service_type_id`),
  KEY `hims_m_doctor_service_type_commission_fk8_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_doctor_service_type_commission_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_doctor_service_type_commission_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_doctor_service_type_commission_fk3` FOREIGN KEY (`provider_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_m_doctor_service_type_commission_fk5` FOREIGN KEY (`service_type_id`) REFERENCES `hims_d_service_type` (`hims_d_service_type_id`),
  CONSTRAINT `hims_m_doctor_service_type_commission_fk8` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_employee_department_mappings`
--

DROP TABLE IF EXISTS `hims_m_employee_department_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_employee_department_mappings` (
  `hims_d_employee_department_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `services_id` int DEFAULT NULL,
  `sub_department_id` int NOT NULL,
  `category_speciality_id` int NOT NULL,
  `user_id` int unsigned DEFAULT NULL COMMENT 'User to link with employee and department',
  `employee_designation_id` int DEFAULT NULL,
  `reporting_to_id` int DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `dep_status` enum('A','I') DEFAULT 'A',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_d_employee_department_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  KEY `hims_d_employee_department_mappings_fk1_idx` (`employee_id`),
  KEY `hims_d_employee_department_mappings_fk2_idx` (`sub_department_id`),
  KEY `hims_d_employee_department_mappings_fk4_idx` (`created_by`),
  KEY `hims_d_employee_department_mappings_fk5_idx` (`updated_by`),
  KEY `hims_d_employee_department_mappings_fk6_idx` (`category_speciality_id`),
  KEY `hims_m_employee_department_mappings_idx` (`user_id`),
  KEY `hims_m_employee_department_mappings_fk9_idx` (`services_id`),
  KEY `hims_m_employee_department_mappings_fk10_idx` (`employee_designation_id`),
  KEY `hims_m_employee_department_mappings_fk11_idx` (`reporting_to_id`),
  KEY `hims_m_employee_department_mappings_fk15_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_d_employee_department_mappings_fk1` FOREIGN KEY (`employee_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_d_employee_department_mappings_fk2` FOREIGN KEY (`sub_department_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_d_employee_department_mappings_fk4` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_d_employee_department_mappings_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_employee_department_mappings_fk10` FOREIGN KEY (`employee_designation_id`) REFERENCES `hims_d_designation` (`hims_d_designation_id`),
  CONSTRAINT `hims_m_employee_department_mappings_fk11` FOREIGN KEY (`reporting_to_id`) REFERENCES `hims_d_employee` (`hims_d_employee_id`),
  CONSTRAINT `hims_m_employee_department_mappings_fk15` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_m_employee_department_mappings_fk6` FOREIGN KEY (`category_speciality_id`) REFERENCES `hims_m_category_speciality_mappings` (`hims_m_category_speciality_mappings_id`),
  CONSTRAINT `hims_m_employee_department_mappings_fk9` FOREIGN KEY (`services_id`) REFERENCES `hims_d_services` (`hims_d_services_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_equipment_analyte_mapping`
--

DROP TABLE IF EXISTS `hims_m_equipment_analyte_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_equipment_analyte_mapping` (
  `hims_m_equipment_analyte_mapping_id` int NOT NULL AUTO_INCREMENT,
  `machine_analyte_id` int DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `lab_analytes_id` int DEFAULT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A=ACTIVE\nI=INACTIVE',
  PRIMARY KEY (`hims_m_equipment_analyte_mapping_id`),
  KEY `hims_m_equipment_analyte_mapping_fk1_idx` (`lab_analytes_id`),
  KEY `hims_m_equipment_analyte_mapping_fk2_idx` (`created_by`),
  KEY `hims_m_equipment_analyte_mapping_fk3_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_equipment_analyte_mapping_fk1` FOREIGN KEY (`lab_analytes_id`) REFERENCES `hims_d_lab_analytes` (`hims_d_lab_analytes_id`),
  CONSTRAINT `hims_m_equipment_analyte_mapping_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_equipment_analyte_mapping_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_group_antibiotic`
--

DROP TABLE IF EXISTS `hims_m_group_antibiotic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_group_antibiotic` (
  `hims_m_group_antibiotic_id` int NOT NULL AUTO_INCREMENT,
  `micro_group_id` int DEFAULT NULL,
  `antibiotic_id` int DEFAULT NULL,
  `map_status` enum('A','I') DEFAULT 'A' COMMENT 'A- Active, I- Inactive',
  `group_types` enum('A','B','C','U') DEFAULT NULL COMMENT 'A-Group A, B-Group B, C-Group C, U-Group U',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A' COMMENT 'A- Active, I- Inactive',
  PRIMARY KEY (`hims_m_group_antibiotic_id`),
  KEY `hims_m_group_antibiotic_fk1_idx` (`micro_group_id`),
  KEY `hims_m_group_antibiotic_fk2_idx` (`antibiotic_id`),
  KEY `hims_m_group_antibiotic_fk3_idx` (`created_by`),
  KEY `hims_m_group_antibiotic_fk4_idx` (`updated_by`),
  CONSTRAINT `hims_m_group_antibiotic_fk1` FOREIGN KEY (`micro_group_id`) REFERENCES `hims_d_micro_group` (`hims_d_micro_group_id`),
  CONSTRAINT `hims_m_group_antibiotic_fk2` FOREIGN KEY (`antibiotic_id`) REFERENCES `hims_d_antibiotic` (`hims_d_antibiotic_id`),
  CONSTRAINT `hims_m_group_antibiotic_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_group_antibiotic_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_hospital_container_mapping`
--

DROP TABLE IF EXISTS `hims_m_hospital_container_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_hospital_container_mapping` (
  `hims_m_hospital_container_mapping_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int DEFAULT NULL,
  `container_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `number` int unsigned DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_m_hospital_container_mapping_id`),
  KEY `hims_m_hospital_container_mapping_fk1_idx` (`hospital_id`),
  KEY `hims_m_hospital_container_mapping_fk2_idx` (`container_id`),
  KEY `hims_m_hospital_container_mapping_fk3_idx` (`created_by`),
  KEY `hims_m_hospital_container_mapping_fk4_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_hospital_container_mapping_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_m_hospital_container_mapping_fk2` FOREIGN KEY (`container_id`) REFERENCES `hims_d_lab_container` (`hims_d_lab_container_id`),
  CONSTRAINT `hims_m_hospital_container_mapping_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_hospital_container_mapping_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_hospital_department_mapping`
--

DROP TABLE IF EXISTS `hims_m_hospital_department_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_hospital_department_mapping` (
  `hims_m_hospital_department_mapping_id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int DEFAULT NULL,
  `sub_dept_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_m_hospital_department_mapping_id`),
  KEY `hims_m_hospital_department_mapping_fk1_idx` (`hospital_id`),
  KEY `hims_m_hospital_department_mapping_fk2_idx` (`sub_dept_id`),
  KEY `hims_m_hospital_department_mapping_fk3_idx` (`created_by`),
  KEY `hims_m_hospital_department_mapping_fk5_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_hospital_department_mapping_fk1` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`),
  CONSTRAINT `hims_m_hospital_department_mapping_fk2` FOREIGN KEY (`sub_dept_id`) REFERENCES `hims_d_sub_department` (`hims_d_sub_department_id`),
  CONSTRAINT `hims_m_hospital_department_mapping_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_hospital_department_mapping_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_inventory_item_location`
--

DROP TABLE IF EXISTS `hims_m_inventory_item_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_inventory_item_location` (
  `hims_m_inventory_item_location_id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `inventory_location_id` int DEFAULT NULL,
  `item_location_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expirydt` date DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `qtypo` decimal(10,3) DEFAULT NULL,
  `cost_uom` int DEFAULT NULL,
  `avgcost` decimal(20,6) DEFAULT NULL,
  `last_purchase_cost` decimal(10,3) DEFAULT NULL,
  `item_type` enum('I','P') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'P' COMMENT 'I=INVENTORY\\nP=PHARMACY',
  `grn_id` int DEFAULT NULL,
  `grnno` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `sale_price` decimal(10,3) DEFAULT NULL,
  `mrp_price` decimal(10,3) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `git_qty` smallint DEFAULT '0',
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A' COMMENT 'A = ACTIVE,\\nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_inventory_item_location_id`),
  KEY `hims_m_inventory_item_location_fk1_idx` (`item_id`),
  KEY `hims_m_inventory_item_location_fk2_idx` (`inventory_location_id`),
  KEY `hims_m_inventory_item_location_fk3_idx` (`created_by`),
  KEY `hims_m_inventory_item_location_fk4_idx` (`updated_by`),
  KEY `hims_m_inventory_item_location_fk5_idx` (`cost_uom`),
  KEY `hims_m_inventory_item_location_fk6_idx` (`sales_uom`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_m_inventory_item_location_fk7_idx` (`hospital_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk1` FOREIGN KEY (`item_id`) REFERENCES `hims_d_inventory_item_master` (`hims_d_inventory_item_master_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk2` FOREIGN KEY (`inventory_location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk5` FOREIGN KEY (`cost_uom`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk6` FOREIGN KEY (`sales_uom`) REFERENCES `hims_d_inventory_uom` (`hims_d_inventory_uom_id`),
  CONSTRAINT `hims_m_inventory_item_location_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2988 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_inventory_item_uom`
--

DROP TABLE IF EXISTS `hims_m_inventory_item_uom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_inventory_item_uom` (
  `hims_m_inventory_item_uom_id` int NOT NULL AUTO_INCREMENT,
  `item_master_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `stocking_uom` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Y',
  `conversion_factor` decimal(10,6) DEFAULT NULL,
  `uom_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_inventory_item_uom_id`),
  KEY `record_status_index` (`record_status`)
) ENGINE=InnoDB AUTO_INCREMENT=2513 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_inventory_location_permission`
--

DROP TABLE IF EXISTS `hims_m_inventory_location_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_inventory_location_permission` (
  `hims_m_inventory_location_permission_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `allow` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_inventory_location_permission_id`),
  KEY `hims_m_inventory_location_permission_fk1_idx` (`user_id`),
  KEY `hims_m_inventory_location_permission_fk2_idx` (`location_id`),
  KEY `hims_m_inventory_location_permission_fk3_idx` (`created_by`),
  KEY `hims_m_inventory_location_permission_fk4_idx` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_inventory_location_permission_fk1` FOREIGN KEY (`user_id`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_inventory_location_permission_fk2` FOREIGN KEY (`location_id`) REFERENCES `hims_d_inventory_location` (`hims_d_inventory_location_id`),
  CONSTRAINT `hims_m_inventory_location_permission_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_inventory_location_permission_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_item_location`
--

DROP TABLE IF EXISTS `hims_m_item_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_item_location` (
  `hims_m_item_location_id` int NOT NULL AUTO_INCREMENT,
  `item_id` int DEFAULT NULL,
  `pharmacy_location_id` int DEFAULT NULL,
  `item_location_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A',
  `batchno` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `expirydt` date DEFAULT NULL,
  `barcode` varchar(30) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `qtyhand` decimal(10,3) DEFAULT NULL,
  `qtypo` decimal(10,3) DEFAULT NULL,
  `cost_uom` int DEFAULT NULL,
  `avgcost` decimal(20,6) DEFAULT NULL,
  `last_purchase_cost` decimal(10,3) DEFAULT NULL,
  `item_type` enum('I','P') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'P' COMMENT 'I=INVENTORY\nP=PHARMACY',
  `grn_id` int DEFAULT NULL,
  `grnno` varchar(20) CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT NULL,
  `sale_price` decimal(10,3) DEFAULT NULL,
  `mrp_price` decimal(10,3) DEFAULT NULL,
  `sales_uom` int DEFAULT NULL,
  `git_qty` smallint DEFAULT '0',
  `vendor_batchno` varchar(45) DEFAULT NULL,
  `notification_insert` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') CHARACTER SET utf8 COLLATE utf8_latvian_ci DEFAULT 'A' COMMENT 'A = ACTIVE,\nI = INACTIVE',
  `hospital_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_item_location_id`),
  KEY `hims_m_item_location_fk1_idx` (`created_by`),
  KEY `hims_m_item_location_fk2_idx` (`updated_by`),
  KEY `hims_m_item_location_fk3_idx` (`item_id`),
  KEY `hims_m_item_location_fk4_idx` (`pharmacy_location_id`),
  KEY `hims_m_item_location_fk5_idx` (`cost_uom`),
  KEY `hims_m_item_location_fk6_idx` (`sales_uom`),
  KEY `record_status_index` (`record_status`),
  KEY `hims_m_item_location_fk7_idx` (`hospital_id`),
  CONSTRAINT `hims_m_item_location_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_item_location_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_item_location_fk3` FOREIGN KEY (`item_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_m_item_location_fk4` FOREIGN KEY (`pharmacy_location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`),
  CONSTRAINT `hims_m_item_location_fk5` FOREIGN KEY (`cost_uom`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_m_item_location_fk6` FOREIGN KEY (`sales_uom`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_m_item_location_fk7` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_item_uom`
--

DROP TABLE IF EXISTS `hims_m_item_uom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_item_uom` (
  `hims_m_item_uom_id` int NOT NULL AUTO_INCREMENT,
  `item_master_id` int DEFAULT NULL,
  `uom_id` int DEFAULT NULL,
  `stocking_uom` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Y',
  `conversion_factor` decimal(10,6) DEFAULT NULL,
  `uom_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_item_uom_id`),
  KEY `hims_m_item_uom_fk1_idx` (`created_by`),
  KEY `hims_m_item_uom_fk2_idx` (`updated_by`),
  KEY `hims_m_item_uom_fk1_idx1` (`item_master_id`),
  KEY `hims_m_item_uom_fk2_idx1` (`uom_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_item_uom_fk1` FOREIGN KEY (`item_master_id`) REFERENCES `hims_d_item_master` (`hims_d_item_master_id`),
  CONSTRAINT `hims_m_item_uom_fk2` FOREIGN KEY (`uom_id`) REFERENCES `hims_d_pharmacy_uom` (`hims_d_pharmacy_uom_id`),
  CONSTRAINT `hims_m_item_uom_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_item_uom_fk4` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='		';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_lab_analyte`
--

DROP TABLE IF EXISTS `hims_m_lab_analyte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_lab_analyte` (
  `hims_m_lab_analyte_id` int NOT NULL AUTO_INCREMENT,
  `test_id` int DEFAULT NULL,
  `analyte_id` int DEFAULT NULL,
  `analyte_type` enum('QU','QN','T') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'QU=QUALITY\nQN=QUANTITY\nT=TEXT',
  `result_unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL COMMENT 'MALE=MALE,FEMALE=FEMALE,OTHER=OTHER',
  `age_type` enum('D','M','Y') DEFAULT 'Y' COMMENT 'D=Days\\n M=Months\\n Y=Year',
  `from_age` smallint unsigned DEFAULT '0',
  `to_age` smallint unsigned DEFAULT '0',
  `critical_low` decimal(10,3) DEFAULT NULL,
  `critical_high` decimal(10,3) DEFAULT NULL,
  `normal_low` decimal(10,3) DEFAULT NULL,
  `normal_high` decimal(10,3) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_lab_analyte_id`),
  KEY `hims_m_lab_analyte_idx` (`created_by`),
  KEY `hims_m_lab_analyte_fk2_idx` (`updated_by`),
  KEY `hims_m_lab_analyte_fk3_idx` (`test_id`),
  KEY `hims_m_lab_analyte_fk4_idx` (`analyte_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_lab_analyte_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_lab_analyte_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_lab_analyte_fk3` FOREIGN KEY (`test_id`) REFERENCES `hims_d_investigation_test` (`hims_d_investigation_test_id`),
  CONSTRAINT `hims_m_lab_analyte_fk4` FOREIGN KEY (`analyte_id`) REFERENCES `hims_d_lab_analytes` (`hims_d_lab_analytes_id`)
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_lab_specimen`
--

DROP TABLE IF EXISTS `hims_m_lab_specimen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_lab_specimen` (
  `hims_m_lab_specimen_id` int NOT NULL AUTO_INCREMENT,
  `test_id` int NOT NULL,
  `specimen_id` int NOT NULL,
  `container_id` int DEFAULT NULL,
  `container_code` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A' COMMENT 'A = ACTIVE \nI = INACTIVE',
  PRIMARY KEY (`hims_m_lab_specimen_id`),
  KEY `hims_m_lab_specimen_fk1_idx` (`created_by`),
  KEY `hims_m_lab_specimen_fk2_idx` (`updated_by`),
  KEY `hims_m_lab_specimen_fk3_idx` (`test_id`),
  KEY `hims_m_lab_specimen_fk4_idx` (`specimen_id`),
  KEY `hims_m_lab_specimen_fk5_idx` (`container_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_lab_specimen_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_lab_specimen_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_lab_specimen_fk3` FOREIGN KEY (`test_id`) REFERENCES `hims_d_investigation_test` (`hims_d_investigation_test_id`),
  CONSTRAINT `hims_m_lab_specimen_fk4` FOREIGN KEY (`specimen_id`) REFERENCES `hims_d_lab_specimen` (`hims_d_lab_specimen_id`),
  CONSTRAINT `hims_m_lab_specimen_fk5` FOREIGN KEY (`container_id`) REFERENCES `hims_d_lab_container` (`hims_d_lab_container_id`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_location_permission`
--

DROP TABLE IF EXISTS `hims_m_location_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_location_permission` (
  `hims_m_location_permission_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `allow` enum('N','Y') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'N',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `record_status` enum('A','I') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'A',
  PRIMARY KEY (`hims_m_location_permission_id`),
  KEY `hims_m_location_permission_fk1_idx` (`user_id`),
  KEY `hims_m_location_permission_fk2_idx` (`location_id`),
  KEY `hims_m_location_permission_fk4_idx` (`created_by`),
  KEY `hims_m_location_permission_fk2_idx1` (`updated_by`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_location_permission_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_location_permission_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_location_permission_fk4` FOREIGN KEY (`user_id`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_location_permission_fk5` FOREIGN KEY (`location_id`) REFERENCES `hims_d_pharmacy_location` (`hims_d_pharmacy_location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_machine_analytes_detail`
--

DROP TABLE IF EXISTS `hims_m_machine_analytes_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_machine_analytes_detail` (
  `hims_m_machine_analytes_detail_id` int NOT NULL AUTO_INCREMENT,
  `machine_analytes_header_id` int DEFAULT NULL,
  `machine_analyte_code` varchar(45) DEFAULT NULL,
  `machine_analyte_name` varchar(45) DEFAULT NULL,
  `analyte_id` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_machine_analytes_detail_id`),
  KEY `hims_m_machine_analytes_detail_fk2_idx` (`analyte_id`),
  KEY `hims_m_machine_analytes_detail_fk1_idx` (`machine_analytes_header_id`),
  CONSTRAINT `hims_m_machine_analytes_detail_fk1` FOREIGN KEY (`machine_analytes_header_id`) REFERENCES `hims_m_machine_analytes_header` (`hims_m_machine_analytes_header_id`),
  CONSTRAINT `hims_m_machine_analytes_detail_fk2` FOREIGN KEY (`analyte_id`) REFERENCES `hims_d_lab_analytes` (`hims_d_lab_analytes_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_machine_analytes_header`
--

DROP TABLE IF EXISTS `hims_m_machine_analytes_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_machine_analytes_header` (
  `hims_m_machine_analytes_header_id` int NOT NULL AUTO_INCREMENT,
  `machine_id` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`hims_m_machine_analytes_header_id`),
  KEY `hims_m_machine_analytes_fk1_idx` (`machine_id`),
  KEY `hims_m_machine_analytes_fk2_idx` (`created_by`),
  KEY `hims_m_machine_analytes_fk3_idx` (`updated_by`),
  CONSTRAINT `hims_m_machine_analytes_header_fk1` FOREIGN KEY (`machine_id`) REFERENCES `hims_d_lis_configuration` (`hims_d_lis_configuration_id`),
  CONSTRAINT `hims_m_machine_analytes_header_fk2` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_machine_analytes_header_fk3` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_patient_insurance_mapping`
--

DROP TABLE IF EXISTS `hims_m_patient_insurance_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_patient_insurance_mapping` (
  `hims_f_patient_insurance_mapping_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `patient_visit_id` int DEFAULT NULL,
  `card_holder_name` varchar(150) DEFAULT NULL,
  `card_holder_age` tinyint DEFAULT NULL,
  `card_holder_gender` enum('MALE','FEMALE') DEFAULT NULL,
  `card_class` int DEFAULT NULL,
  `primary_insurance_provider_id` int NOT NULL,
  `primary_sub_id` int DEFAULT NULL,
  `primary_network_id` int DEFAULT NULL,
  `primary_inc_card_path` varchar(2000) DEFAULT NULL,
  `primary_policy_num` varchar(100) NOT NULL,
  `primary_effective_start_date` date NOT NULL DEFAULT '1900-01-01',
  `primary_effective_end_date` date NOT NULL DEFAULT '9999-12-31',
  `primary_card_number` varchar(20) DEFAULT NULL,
  `secondary_insurance_provider_id` int DEFAULT NULL,
  `secondary_sub_id` int DEFAULT NULL,
  `secondary_network_id` int DEFAULT NULL,
  `secondary_effective_start_date` date DEFAULT NULL,
  `secondary_effective_end_date` date DEFAULT NULL,
  `secondary_inc_card_path` varchar(2000) DEFAULT NULL,
  `secondary_policy_num` varchar(100) DEFAULT NULL,
  `secondary_card_number` varchar(20) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') NOT NULL DEFAULT 'A',
  PRIMARY KEY (`hims_f_patient_insurance_mapping_id`),
  KEY `hims_f_patient_insurance_mapping_idx1` (`patient_visit_id`),
  KEY `hims_f_patient_insurance_mapping_idx2` (`primary_insurance_provider_id`),
  KEY `hims_f_patient_insurance_mapping_idx3` (`primary_effective_start_date`),
  KEY `hims_f_patient_insurance_mapping_idx4` (`primary_effective_end_date`),
  KEY `hims_f_patient_insurance_mapping_idx5` (`record_status`),
  KEY `hims_m_patient_insurance_mapping_fk3_idx` (`created_by`),
  KEY `hims_m_patient_insurance_mapping_fk5_idx` (`secondary_insurance_provider_id`),
  KEY `hims_m_patient_insurance_mapping_fk5_idx1` (`updated_by`),
  KEY `hims_m_patient_insurance_mapping_fk6_idx` (`patient_id`),
  KEY `hims_m_patient_insurance_mapping_fk9_idx` (`primary_sub_id`),
  KEY `hims_m_patient_insurance_mapping_fk10_idx` (`secondary_sub_id`),
  KEY `hims_m_patient_insurance_mapping_fk10_idx1` (`primary_network_id`),
  KEY `hims_m_patient_insurance_mapping_fk11_idx` (`secondary_network_id`),
  KEY `hims_m_patient_insurance_mapping_fk10_idx2` (`card_class`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk1` FOREIGN KEY (`patient_visit_id`) REFERENCES `hims_f_patient_visit` (`hims_f_patient_visit_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk10` FOREIGN KEY (`secondary_sub_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk11` FOREIGN KEY (`secondary_network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk12` FOREIGN KEY (`primary_network_id`) REFERENCES `hims_d_insurance_network` (`hims_d_insurance_network_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk13` FOREIGN KEY (`card_class`) REFERENCES `hims_d_insurance_card_class` (`hims_d_insurance_card_class_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk3` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk5` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk6` FOREIGN KEY (`patient_id`) REFERENCES `hims_f_patient` (`hims_d_patient_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk7` FOREIGN KEY (`primary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk8` FOREIGN KEY (`secondary_insurance_provider_id`) REFERENCES `hims_d_insurance_provider` (`hims_d_insurance_provider_id`),
  CONSTRAINT `hims_m_patient_insurance_mapping_fk9` FOREIGN KEY (`primary_sub_id`) REFERENCES `hims_d_insurance_sub` (`hims_d_insurance_sub_id`)
) ENGINE=InnoDB AUTO_INCREMENT=194532 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hims_m_user_employee`
--

DROP TABLE IF EXISTS `hims_m_user_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hims_m_user_employee` (
  `hims_m_user_employee_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `hospital_id` int DEFAULT NULL,
  `login_user` enum('N','Y') DEFAULT 'N',
  `created_by` int DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `record_status` enum('A','I') DEFAULT 'A',
  PRIMARY KEY (`hims_m_user_employee_id`),
  KEY `hims_m_user_employee_fk1_idx` (`created_by`),
  KEY `hims_m_user_employee_fk2_idx` (`updated_by`),
  KEY `hims_m_user_employee_fk3_idx` (`employee_id`),
  KEY `hims_m_user_employee_fk4_idx` (`user_id`),
  KEY `hims_m_user_employee_fk6_idx` (`hospital_id`),
  KEY `record_status_index` (`record_status`),
  CONSTRAINT `hims_m_user_employee_fk1` FOREIGN KEY (`created_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_user_employee_fk2` FOREIGN KEY (`updated_by`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_user_employee_fk4` FOREIGN KEY (`user_id`) REFERENCES `algaeh_d_app_user` (`algaeh_d_app_user_id`),
  CONSTRAINT `hims_m_user_employee_fk6` FOREIGN KEY (`hospital_id`) REFERENCES `hims_d_hospital` (`hims_d_hospital_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `screen_element_scren_module_mapping`
--

DROP TABLE IF EXISTS `screen_element_scren_module_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `screen_element_scren_module_mapping` (
  `screen_element_scren_module_mapping_id` int NOT NULL AUTO_INCREMENT COMMENT 'Screen element module Id',
  `algaeh_d_app_scrn_elements_id` int DEFAULT NULL COMMENT 'Sceen element id ',
  `role_id` int DEFAULT NULL COMMENT 'Privilege mapping id',
  `view_type` enum('D','H') DEFAULT NULL COMMENT 'View Type\nD:Disabled\nH:Hide',
  `extra_props` varchar(100) DEFAULT NULL COMMENT 'Extra Props of the field',
  PRIMARY KEY (`screen_element_scren_module_mapping_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'algaeh_clean_db'
--

--
-- Dumping routines for database 'algaeh_clean_db'
--
/*!50003 DROP FUNCTION IF EXISTS `CAP_FIRST` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE  FUNCTION `CAP_FIRST`(input VARCHAR(255)) RETURNS varchar(255) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
DECLARE len INT;
	DECLARE i INT;

	SET len   = CHAR_LENGTH(input);
	SET input = LOWER(input);
	SET i = 0;

	WHILE (i < len) DO
		IF (MID(input,i,1) = ' ' OR i = 0) THEN
			IF (i < len) THEN
				SET input = CONCAT(
					LEFT(input,i),
					UPPER(MID(input,i + 1,1)),
					RIGHT(input,len - i - 1)
				);
			END IF;
		END IF;
		SET i = i + 1;
	END WHILE;

	RETURN input;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `algaeh_proc_inv_item_location` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE  PROCEDURE `algaeh_proc_inv_item_location`(xmlData TEXT)
BEGIN
 DECLARE exit handler for sqlexception
  BEGIN
   -- RESIGNAL SET MESSAGE_TEXT = 'An Error';
	RESIGNAL SET MYSQL_ERRNO = 5;
    -- ERROR
  ROLLBACK;
	-- select 'Error in Inventory Item Location' as 'Error';
END;
 START TRANSACTION;
  set @nrows =0;
  set @rownum = 1;
  set @counter=0;
  set @nrows = extractvalue(xmlData, 'count(//hims_m_inventory_item_location)');
  set @uom =0;
  set @convertionFactor=0;
  set @qtyHand=0;
  set @operation='';
  set @avgcost=0;  
 while @rownum <= @nrows do
set @uom =0;
set @average_cost=ExtractValue(xmlData,'//child::*[$@rownum]/average_cost');  

 select count(*) into @counter from hims_m_inventory_item_location where item_id = 
ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')
and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
and record_status='A';
 

 
-- Expiry date and Batch no exists
 IF (@counter>0) THEN

-- Check HIMS_D_ITEM_MASTER -- Start
	select stocking_uom_id into @uom from hims_d_inventory_item_master where hims_d_inventory_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');


	if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
	then
		select conversion_factor into @convertionFactor from hims_m_inventory_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
		uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') ;
		set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	else
	   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	end if;
-- END Check hims_d_inventory_item_master -- END

--   Update Records

	IF ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type') ='AD'
		then
        IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
            UPDATE hims_m_inventory_item_location set qtyhand =qtyhand+@qtyHand, sale_price =sale_price+ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
		then			                        
            UPDATE hims_m_inventory_item_location set qtyhand =qtyhand-@qtyHand, sale_price =sale_price-ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')
			and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		-- End Expiry date and Batch no exists
			 
		END IF;
    ELSE

		IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
			UPDATE hims_m_inventory_item_location set qtyhand =qtyhand+@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
			then
			

			UPDATE hims_m_inventory_item_location set qtyhand =qtyhand-@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			inventory_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id')
			and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
			and record_status='A';
		-- End Expiry date and Batch no exists
		END IF;
	END IF;
    
    ELSE
    
    select stocking_uom_id into @uom from hims_d_inventory_item_master where hims_d_inventory_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');


	if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
	then
		select conversion_factor into @convertionFactor from hims_m_inventory_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
		uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') ;
		set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
        set @avgcost = ROUND(ExtractValue(xmlData,'//child::*[$@rownum]/avgcost')/@convertionFactor, 3);        
	else
	   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
       set @avgcost =ExtractValue(xmlData,'//child::*[$@rownum]/avgcost');
	end if;
    set @average_cost = @avgcost;
    
     set @expirydt= null;
	 if(ExtractValue(xmlData,'//child::*[$@rownum]/expirydt')<>'~')
	 then
	   set @expirydt = ExtractValue(xmlData,'//child::*[$@rownum]/expirydt');
	 end if;

		-- insert record 
		insert into hims_m_inventory_item_location(item_id,inventory_location_id,batchno,expirydt,
		barcode,qtyhand,qtypo,cost_uom,avgcost,last_purchase_cost,
		grn_id,grnno,sale_price,sales_uom,mrp_price,vendor_batchno,hospital_id,created_by,updated_by) values(ExtractValue(xmlData,'//child::*[$@rownum]/item_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/inventory_location_id'),ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
		@expirydt,ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
		@qtyHand,ExtractValue(xmlData,'//child::*[$@rownum]/qtypo'),
		ExtractValue(xmlData,'//child::*[$@rownum]/cost_uom'),@avgcost,
		ExtractValue(xmlData,'//child::*[$@rownum]/last_purchase_cost'),ExtractValue(xmlData,'//child::*[$@rownum]/grn_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/grnno'),ExtractValue(xmlData,'//child::*[$@rownum]/sale_price'),
		ExtractValue(xmlData,'//child::*[$@rownum]/sales_uom'),ExtractValue(xmlData,'//child::*[$@rownum]/mrp_price'),
        ExtractValue(xmlData,'//child::*[$@rownum]/vendor_batchno'),ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
		-- end insert recor
END IF;

-- IF ExtractValue(xmlData,'//child::*[$@rownum]/flag') ='1'
-- then
-- 	set @rownum = @rownum + 1;
    -- select @rownum as rownum;
-- ELSE
 set @toLocationId= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id')!='~')
 then
   set @toLocationId = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id');
 end if;
 set @to_location_type= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type')!='~')
 then
   set @to_location_type = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type');
 end if;
 
 set @expiry_date= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date')<>'~')
 then
   set @expiry_date = ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date');
 end if;

 
  insert into hims_f_inventory_trans_history(transaction_type, transaction_id, transaction_date, from_location_id, 
 from_location_type, `year`, period, to_location_id, to_location_type, description, item_category_id, item_group_id, 
 item_code_id, barcode, required_batchno, batchno, expiry_date, transaction_qty, transaction_uom, transaction_cost, 
 transaction_total, discount_percentage, discount_amount, net_total, landing_cost, average_cost, operation, hospital_id,
 created_by, updated_by)
 values(ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_date'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/year'),
     ExtractValue(xmlData,'//child::*[$@rownum]/period'),
     @toLocationId,
     @to_location_type,
     ExtractValue(xmlData,'//child::*[$@rownum]/description'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_category_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_group_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_code_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
     ExtractValue(xmlData,'//child::*[$@rownum]/required_batchno'),
     ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
     @expiry_date,
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_qty'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_cost'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_percentage'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_amount'),
     ExtractValue(xmlData,'//child::*[$@rownum]/net_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/landing_cost'),
     @average_cost,
     ExtractValue(xmlData,'//child::*[$@rownum]/operation'),
     ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),
     ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
     
 
  
     set @rownum = @rownum + 1;
   -- END IF; 
  end while;


 COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `algaeh_proc_item_location` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE  PROCEDURE `algaeh_proc_item_location`(xmlData TEXT)
BEGIN
 DECLARE exit handler for sqlexception
   BEGIN
   -- RESIGNAL SET MESSAGE_TEXT = 'An Error';
		RESIGNAL SET MYSQL_ERRNO = 5;
    -- ERROR
  ROLLBACK;
	   -- select 'Error in Item Location' as 'Error';
END;
DECLARE exit handler for sqlwarning
 BEGIN
  ROLLBACK;
  END;
 START TRANSACTION;
  set @nrows =0;
  set @rownum = 1;
  set @counter=0;
  set @nrows = extractvalue(xmlData, 'count(//hims_m_item_location)');
  set @uom =0;
  set @convertionFactor=0;
  set @qtyHand=0;
  set @avgcost=0;
  set @operation='';  
 while @rownum <= @nrows do
set @uom =0;
set @average_cost=ExtractValue(xmlData,'//child::*[$@rownum]/average_cost');  


 select count(*) into @counter from hims_m_item_location where item_id = 
ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id')
and batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno')
and  record_status='A';
 
-- Expiry date and Batch no exists
-- select @counter as counter;
 IF (@counter>0) THEN

-- Check HIMS_D_ITEM_MASTER -- Start
	select stocking_uom_id into @uom from hims_d_item_master where hims_d_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');


	if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
	then
		select conversion_factor into @convertionFactor from hims_m_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
		uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') ;
		set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	else
	   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
	end if;
-- END Check HIMS_D_ITEM_MASTER -- END

--   Update Records
	IF ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type') ='AD'
		then
        IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
			UPDATE hims_m_item_location set qtyhand =qtyhand+@qtyHand, sale_price =sale_price+ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
		then			
            -- select @qtyHand as qtyHand;
            
			UPDATE hims_m_item_location set qtyhand =qtyhand-@qtyHand, sale_price =sale_price-ExtractValue(xmlData,'//child::*[$@rownum]/sale_price')
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno= ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		-- End Expiry date and Batch no exists
			 
		END IF;
    ELSE
		IF ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='+'
		then
			UPDATE hims_m_item_location set qtyhand =qtyhand+@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno=ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		end if;
		if ExtractValue(xmlData,'//child::*[$@rownum]/operation') ='-'
		then			
            -- select @qtyHand as qtyHand;
            
			UPDATE hims_m_item_location set qtyhand =qtyhand-@qtyHand
			WHERE item_id = 
			ExtractValue(xmlData,'//child::*[$@rownum]/item_id') and 
			pharmacy_location_id = ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id') and
			batchno= ExtractValue(xmlData,'//child::*[$@rownum]/batchno') and record_status='A';
		-- End Expiry date and Batch no exists
			 
		END IF;	
	END IF;	
    
    ELSE
		-- select @counter as counter;
		select stocking_uom_id into @uom from hims_d_item_master where hims_d_item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id');


		if(@uom <> ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'))
		then
			select conversion_factor into @convertionFactor from hims_m_item_uom where item_master_id=ExtractValue(xmlData,'//child::*[$@rownum]/item_id') AND
			uom_id=ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom') ;
			set @qtyHand =@convertionFactor*ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
            set @avgcost = ROUND(ExtractValue(xmlData,'//child::*[$@rownum]/avgcost')/@convertionFactor, 3);
		else
		   set @qtyHand =ExtractValue(xmlData,'//child::*[$@rownum]/qtyhand');
           set @avgcost =ExtractValue(xmlData,'//child::*[$@rownum]/avgcost');
		end if;
        set @average_cost = @avgcost;        
   
		set @expirydt= null;
		if(ExtractValue(xmlData,'//child::*[$@rownum]/expirydt')<>'~')
		then
			set @expirydt = ExtractValue(xmlData,'//child::*[$@rownum]/expirydt');
		end if;
        
        -- select @expirydt as expirydt;
		-- insert record
       
       
        
		insert into hims_m_item_location(`item_id`,`pharmacy_location_id`,`batchno`,`expirydt`,
		`barcode`,`qtyhand`,`qtypo`,`cost_uom`,`avgcost`,`last_purchase_cost`,
		`grn_id`,`grnno`,`sale_price`,`sales_uom`,`mrp_price`,`vendor_batchno`,`hospital_id`,`created_by`,`updated_by`)
        values(ExtractValue(xmlData,'//child::*[$@rownum]/item_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/pharmacy_location_id'),
        ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
		 @expirydt,
        ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
		@qtyHand,ExtractValue(xmlData,'//child::*[$@rownum]/qtypo'),
		ExtractValue(xmlData,'//child::*[$@rownum]/cost_uom'),@avgcost,
		ExtractValue(xmlData,'//child::*[$@rownum]/last_purchase_cost'),
        ExtractValue(xmlData,'//child::*[$@rownum]/grn_id'),
		ExtractValue(xmlData,'//child::*[$@rownum]/grnno'),ExtractValue(xmlData,'//child::*[$@rownum]/sale_price'),
		ExtractValue(xmlData,'//child::*[$@rownum]/sales_uom'),ExtractValue(xmlData,'//child::*[$@rownum]/mrp_price'),
         ExtractValue(xmlData,'//child::*[$@rownum]/vendor_batchno'),ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'), 
		ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
		-- end insert records
        -- select 'Done';
END IF;
  -- select @counter as counter;
  
 set @toLocationId= null;
 
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id')!='~')
 then
   set @toLocationId = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_id');
 end if;
 set @to_location_type= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type')!='~')
 then
   set @to_location_type = ExtractValue(xmlData,'//child::*[$@rownum]/to_location_type');
 end if;
  set @expiry_date= null;
 if(ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date')<>'~')
 then
   set @expiry_date = ExtractValue(xmlData,'//child::*[$@rownum]/expiry_date');
 end if;
 
 
  insert into hims_f_pharmacy_trans_history(transaction_type, transaction_id, transaction_date, from_location_id, 
 from_location_type, `year`, period, to_location_id, to_location_type, description, item_category_id, item_group_id, 
 item_code_id, barcode, required_batchno, batchno, expiry_date, transaction_qty, transaction_uom, transaction_cost, 
 transaction_total, discount_percentage, discount_amount, net_total, landing_cost, average_cost, operation, hospital_id,
 created_by, updated_by)
 values(ExtractValue(xmlData,'//child::*[$@rownum]/transaction_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_date'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/from_location_type'),
     ExtractValue(xmlData,'//child::*[$@rownum]/year'),
     ExtractValue(xmlData,'//child::*[$@rownum]/period'),
     @toLocationId,
     @to_location_type,
     ExtractValue(xmlData,'//child::*[$@rownum]/description'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_category_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_group_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/item_code_id'),
     ExtractValue(xmlData,'//child::*[$@rownum]/barcode'),
     ExtractValue(xmlData,'//child::*[$@rownum]/required_batchno'),
     ExtractValue(xmlData,'//child::*[$@rownum]/batchno'),
     @expiry_date,
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_qty'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_uom'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_cost'),
     ExtractValue(xmlData,'//child::*[$@rownum]/transaction_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_percentage'),
     ExtractValue(xmlData,'//child::*[$@rownum]/discount_amount'),
     ExtractValue(xmlData,'//child::*[$@rownum]/net_total'),
     ExtractValue(xmlData,'//child::*[$@rownum]/landing_cost'),
     @average_cost,
     ExtractValue(xmlData,'//child::*[$@rownum]/operation'),
     ExtractValue(xmlData,'//child::*[$@rownum]/hospital_id'),     
     ExtractValue(xmlData,'//child::*[$@rownum]/created_by'),
     ExtractValue(xmlData,'//child::*[$@rownum]/updated_by'));
     
 
  
     set @rownum = @rownum + 1;
  end while;


 COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `algaeh_update_service_code` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `algaeh_update_service_code`()
BEGIN

DECLARE i int default 0;
DECLARE val1 INT DEFAULT NULL;
DECLARE done TINYINT DEFAULT FALSE;
DECLARE cursor_service_table CURSOR FOR SELECT hims_d_services_id FROM hims_d_services where service_type_id= 2;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

open cursor_service_table;

my_loop: LOOP

FETCH cursor_service_table into val1;
set i = i + 1;
  if done then 
	LEAVE  my_loop;
  else
    call UPDATEROW(val1, i);
  end if;
End loop;

close cursor_service_table;

end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `pharmacy_item_expiry_notify` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `pharmacy_item_expiry_notify`()
BEGIN
SET @expair :=(
select  case notification_type when 'M' then TIMESTAMPADD(month,notification_before,curdate() ) when 'D' then 
TIMESTAMPADD(day,notification_before,curdate() )  when 'Y' then  TIMESTAMPADD(year,notification_before,curdate() )
end as expiry_date from hims_d_pharmacy_options);
#select @expair;
insert into hims_d_pharmacy_notification_expiry 
(`loaction_id`, `item_id`, `expiry_date`, `batchno`,`barcode`, `hospital_id`)
SELECT pharmacy_location_id, item_id,  expirydt, batchno, barcode,hospital_id from hims_m_item_location 
where qtyhand > 0 and notification_insert='N' and date(expirydt) <= date(@expair);
UPDATE `hims_m_item_location` SET notification_insert = 'Y' 
where qtyhand > 0 and notification_insert='N' and date(expirydt) <= date(@expair);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ROWPERROW` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ROWPERROW`()
BEGIN

DECLARE i int default 0;
DECLARE val1 INT DEFAULT NULL;
DECLARE done TINYINT DEFAULT FALSE;
DECLARE cursor_service_table CURSOR FOR SELECT hims_d_services_id FROM hims_d_services where service_type_id= 5;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

open cursor_service_table;

my_loop: LOOP

FETCH cursor_service_table into val1;
set i = i + 1;
  if done then 
	LEAVE  my_loop;
  else
    call UPDATEROW(val1, i);
  end if;
End loop;

close cursor_service_table;

end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UPDATEROW` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATEROW`(arg1 INT, arg2 int)
BEGIN

update hims_d_services SET service_code = concat("LAB00", arg2)  where hims_d_services_id = arg1;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_service_codes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_service_codes`(arg1 INT, arg2 int)
BEGIN

update hims_d_services SET service_code = concat("PROC00", arg2)  where hims_d_services_id = arg1;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-07 12:02:15
