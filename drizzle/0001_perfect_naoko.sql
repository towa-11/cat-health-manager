CREATE TABLE `cats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`age` int,
	`breed` varchar(100),
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `excretionRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`catId` int NOT NULL,
	`recordTime` timestamp NOT NULL,
	`type` enum('urine','feces') NOT NULL,
	`status` varchar(100),
	`hasAbnormality` int DEFAULT 0,
	`abnormalityDetails` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `excretionRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`catId` int NOT NULL,
	`recordDate` timestamp NOT NULL,
	`energyLevel` int,
	`appetite` int,
	`hasVomiting` int DEFAULT 0,
	`hasDiarrhea` int DEFAULT 0,
	`otherSymptoms` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mealRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`catId` int NOT NULL,
	`recordTime` timestamp NOT NULL,
	`amount` varchar(100),
	`foodType` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mealRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weightRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`catId` int NOT NULL,
	`weight` decimal(5,2) NOT NULL,
	`recordDate` timestamp NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weightRecords_id` PRIMARY KEY(`id`)
);
