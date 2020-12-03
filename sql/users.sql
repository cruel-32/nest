CREATE TABLE `users` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COLLATE 'utf8mb4_unicode_520_ci',
  `email` varchar(100) NOT NULL COLLATE 'utf8mb4_unicode_520_ci',
  `password` varchar(80) NOT NULL COLLATE 'utf8mb4_unicode_520_ci',
  `role` varchar(20) COLLATE 'utf8mb4_unicode_520_ci',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;