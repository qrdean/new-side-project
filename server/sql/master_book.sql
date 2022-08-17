CREATE TABLE ` master_book ` (
  ` id ` int(10) unsigned NOT NULL AUTO_INCREMENT,
  ` created_at ` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ` lccn ` varchar(255) DEFAULT NULL,
  ` isbn ` varchar(255) DEFAULT NULL,
  ` title ` varchar(255) DEFAULT NULL,
  ` author ` varchar(255) DEFAULT NULL,
  ` publishDate ` datetime DEFAULT NULL,
  PRIMARY KEY (` id `)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = latin1
