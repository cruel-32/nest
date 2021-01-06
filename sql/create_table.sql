CREATE TABLE `pudu_robot` (
  `id` int(11) NOT NULL,
  `mac` varchar(255) DEFAULT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `pid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `use_scene` int(11) DEFAULT NULL,
  `product_code` varchar(255) DEFAULT NULL,
  `use_type` int(11) DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `use_end_time` varchar(255) DEFAULT NULL,
  `softver` varchar(255) DEFAULT NULL,
  `hardver` varchar(255) DEFAULT NULL,
  `frozen_time` varchar(255) DEFAULT NULL,
  `run_status_time` varchar(255) DEFAULT NULL,
  `shop_name` varchar(255) DEFAULT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pudu_delivery` (
	`id` INT(11) NOT NULL,
	`create_time` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`unix_time` BIGINT(20) NULL,
	`mac` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`task_id` BIGINT(20) NULL,
	`treaty` INT(11) NULL,
	`log_type` INT(11) NULL,
	`task_type` INT(11) NULL,
	`report_number` INT(11) NULL,
	`softver` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`hardver` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`product_code` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`table_count` INT(11) NULL,
	`tray_count` INT(11) NULL,
	`mileage` DOUBLE NULL,
	`average` DOUBLE NULL,
	`duration` INT(11) NULL,
	`duration_back` INT(11) NULL,
	`duration_delivery` INT(11) NULL,
	`duration_pause` INT(11) NULL,
	`duration_wait` INT(11) NULL,
	`interrupt` INT(11) NULL,
	`battery_end` INT(11) NULL,
	`task_finish` INT(11) NULL,
	`status` INT(11) NULL,
	`log` TEXT NULL COLLATE 'utf8mb4_general_ci',
	`robot_id` INT(11) NULL,
	`shop_id` INT(11) NULL,
	`shop_name` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `unix_time_index` (`unix_time`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;



CREATE TABLE `pudu_delivery_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deliveryId` int(11) DEFAULT NULL,
  `average` double DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `duration_pause` int(11) DEFAULT NULL,
  `duration_wait` int(11) DEFAULT NULL,
  `goal_id` varchar(255) DEFAULT NULL,
  `mileage` double DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `task_type` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pudu_delivery_log` (
  `id` int(11) NOT NULL,
  `average` double DEFAULT NULL,
  `battery` int(11) DEFAULT NULL,
  `mileage` double DEFAULT NULL,
  `task_id` bigint(20) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `total_time` int(11) DEFAULT NULL,
  `hardver` varchar(255) DEFAULT NULL,
  `mac` varchar(255) DEFAULT NULL,
  `report_number` int(11) DEFAULT NULL,
  `robot` int(11) DEFAULT NULL,
  `softver` varchar(255) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `pudu_shop` (
	`id` INT(11) NOT NULL,
	`create_time` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`cuisine` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`grade` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`name` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`operation_status` INT(11) NULL,
	`robot_count` INT(11) NULL,
	`robot_use_type` TEXT NULL COLLATE 'utf8mb4_general_ci',
	`shop_type` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`sn` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`sys_sn` VARCHAR(255) NULL COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `keenon_delivery` (
  `backMileage` int(11) DEFAULT NULL,
  `backPauseTime` varchar(255) DEFAULT NULL,
  `backTime` varchar(255) DEFAULT NULL,
  `backTimeStr` varchar(255) DEFAULT NULL,
  `backed` int(11) DEFAULT NULL,
  `clickPopupTime` varchar(255) DEFAULT NULL,
  `clickPopupType` int(11) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `deliverPauseTime` int(11) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `endTime` varchar(255) DEFAULT NULL,
  `endTimeStr` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `isDel` int(11) DEFAULT NULL,
  `isMultipleLocation` int(11) DEFAULT NULL,
  `managerId` int(11) DEFAULT NULL,
  `managerName` varchar(255) DEFAULT NULL,
  `mileageDelivery` int(11) DEFAULT NULL,
  `modifyPopupTime` varchar(255) DEFAULT NULL,
  `pauseNum` varchar(255) DEFAULT NULL,
  `robotCode` varchar(255) DEFAULT NULL,
  `robotSn` varchar(255) DEFAULT NULL,
  `startTime` varchar(255) DEFAULT NULL,
  `startTimeStr` varchar(255) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keenon_delivery_detail` (
  `arrivalTime` varchar(255) DEFAULT NULL,
  `arrivalTimeStr` varchar(255) DEFAULT NULL,
  `bfdId` int(11) NOT NULL,
  `chooseDestinationTime` varchar(255) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `destinationCode` varchar(255) DEFAULT NULL,
  `destinationName` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `isDel` int(11) DEFAULT NULL,
  `lastArrivalTime` varchar(255) DEFAULT NULL,
  `layerNo` varchar(255) DEFAULT NULL,
  `mileage` double DEFAULT NULL,
  `takeFoodMethod` int(11) DEFAULT NULL,
  `takeFoodTime` varchar(255) DEFAULT NULL,
  `takeFoodTimeStr` varchar(255) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bfdId` (`bfdId`),
  CONSTRAINT `keenon_delivery_detail_ibfk_1` FOREIGN KEY (`bfdId`) REFERENCES `keenon_delivery` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keenon_cruise` (
  `arriveTime` varchar(255) DEFAULT NULL,
  `autoPauseNum` varchar(255) DEFAULT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `managerId` int(11) DEFAULT NULL,
  `managerName` varchar(255) DEFAULT NULL,
  `manualPauseNum` int(11) DEFAULT NULL,
  `pauseNum` int(11) DEFAULT NULL,
  `pauseTime` int(11) DEFAULT NULL,
  `robotCode` varchar(255) DEFAULT NULL,
  `robotSn` varchar(255) DEFAULT NULL,
  `startTime` varchar(255) DEFAULT NULL,
  `startTimeStr` varchar(255) DEFAULT NULL,
  `totalOdo` varchar(255) DEFAULT NULL,
  `totalTime` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keenon_snack` (
  `arriveTime` varchar(255) DEFAULT NULL,
  `autoPauseNum` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `managerId` int(11) DEFAULT NULL,
  `managerName` varchar(255) DEFAULT NULL,
  `manualPauseNum` int(11) DEFAULT NULL,
  `pauseNum` int(11) DEFAULT NULL,
  `pauseTime` int(11) DEFAULT NULL,
  `robotCode` varchar(255) DEFAULT NULL,
  `robotSn` varchar(255) DEFAULT NULL,
  `startTime` varchar(255) DEFAULT NULL,
  `startTimeStr` varchar(255) DEFAULT NULL,
  `totalOdo` varchar(255) DEFAULT NULL,
  `totalTime` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keenon_robot` (
  `robotSn` varchar(255) NOT NULL,
  `versionColumns` text DEFAULT NULL,
  `robotCode` varchar(255) DEFAULT NULL,
  `robotName` varchar(255) DEFAULT NULL,
  `registerTime` varchar(255) DEFAULT NULL,
  `swVersion` varchar(255) DEFAULT NULL,
  `managerId` int(11) DEFAULT NULL,
  `hwVersion` varchar(255) DEFAULT NULL,
  `activateStatus` varchar(255) DEFAULT NULL,
  `activateTime` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `cityDetail` varchar(255) DEFAULT NULL,
  `cityCode` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `mftCode` varchar(255) DEFAULT NULL,
  `mftTime` varchar(255) DEFAULT NULL,
  `robotModelId` int(11) DEFAULT NULL,
  `merchantName` varchar(255) DEFAULT NULL,
  `usingType` int(11) DEFAULT NULL,
  `usingTypeDesc` varchar(255) DEFAULT NULL,
  `managerName` varchar(255) DEFAULT NULL,
  `robotCityNum` int(11) DEFAULT NULL,
  `calcOnline` varchar(255) DEFAULT NULL,
  `onlineType` int(11) DEFAULT NULL,
  `runningTime` bigint(20) DEFAULT NULL,
  `odometer` int(11) DEFAULT NULL,
  `healthLevel` int(11) DEFAULT NULL,
  `batteryLevel` int(11) DEFAULT NULL,
  `collisions` varchar(255) DEFAULT NULL,
  `sonar` varchar(255) DEFAULT NULL,
  `psd` varchar(255) DEFAULT NULL,
  `lastOnlineTime` varchar(255) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `newRobotSn` varchar(255) DEFAULT NULL,
  `industryName` varchar(255) DEFAULT NULL,
  `industryId` varchar(255) DEFAULT NULL,
  `startUsingTime` varchar(255) DEFAULT NULL,
  `endUsingTime` varchar(255) DEFAULT NULL,
  `principal` varchar(255) DEFAULT NULL,
  `principalName` varchar(255) DEFAULT NULL,
  `isWorking` varchar(255) DEFAULT NULL,
  `usingCountToday` varchar(255) DEFAULT NULL,
  `attentive` varchar(255) DEFAULT NULL,
  `modelTag` varchar(255) DEFAULT NULL,
  `colorKey` varchar(255) DEFAULT NULL,
  `colorValue` varchar(255) DEFAULT NULL,
  `usingCountYesterday` int(11) DEFAULT NULL,
  `parentName` varchar(255) DEFAULT NULL,
  `totalCount` int(11) DEFAULT NULL,
  `expectActiveDateCount` int(11) DEFAULT NULL,
  `avgCount` varchar(255) DEFAULT NULL,
  `activeCountWithSomeTime` int(11) DEFAULT NULL,
  `headOfSales` varchar(255) DEFAULT NULL,
  `afterSales` varchar(255) DEFAULT NULL,
  `contractType` varchar(255) DEFAULT NULL,
  `paymentPeriod` varchar(255) DEFAULT NULL,
  `sourceOfSales` varchar(255) DEFAULT NULL,
  `sourceOfSalesDesc` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`robotSn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `keenon_robot_model` (
  `id` int(11) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `keyWord` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `mfgPattern` varchar(255) DEFAULT NULL,
  `pictureUrl` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `updateTime` varchar(255) DEFAULT NULL,
  `isDel` int(11) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `parentName` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `checked` tinyint(1) DEFAULT NULL,
  `expand` varchar(255) DEFAULT NULL,
  `children` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tasks` (
	`date` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`progress` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`returnEmail` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`runningTime` INT(11) NOT NULL,
	`message` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`date`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	`email` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(80) NOT NULL COLLATE 'utf8mb4_general_ci',
	`role` VARCHAR(20) NOT NULL DEFAULT GUEST COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME(6) NOT NULL DEFAULT current_timestamp(6),
	`updatedAt` DATETIME(6) NOT NULL DEFAULT current_timestamp(6),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=7
;

CREATE TABLE `statistics` (
	`id` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`puduMileages` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`puduCounts` TEXT NOT NULL COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NOT NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
