CREATE TABLE `library_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (` id `),
  UNIQUE KEY ` email ` (` email `)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = latin1
