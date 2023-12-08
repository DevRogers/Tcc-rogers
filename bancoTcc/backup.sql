-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: bancotcc
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `historico`
--

DROP TABLE IF EXISTS `historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `valor` double DEFAULT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `veiculo` varchar(30) DEFAULT NULL,
  `placa` varchar(10) DEFAULT NULL,
  `tipo` varchar(30) DEFAULT NULL,
  `entrada` double DEFAULT NULL,
  `saida` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico`
--

LOCK TABLES `historico` WRITE;
/*!40000 ALTER TABLE `historico` DISABLE KEYS */;
INSERT INTO `historico` VALUES (22,'Ana',1000,'a','2023-11-15','Honda Civic','DEF5678','Entrada',1000,0),(23,'	Carlos',500,'a','2023-11-15','Volkswagen Golf','GHI9012','Entrada',500,0),(24,'Mariana',2000,'a','2023-11-15','Ford Mustang','JKL3456','Saída',0,2000),(25,'Lucas',4000,'a','2023-12-15','Chevrolet Cruze','MNO7890','Entrada',4000,0),(26,'Isabel',1500,'a','2023-12-15','Mazda CX-5','PQR2345','Saída',0,1500),(27,'Pedro',400,'a','2024-01-15','Subaru Outback','STU6789','Entrada',400,350),(28,'Laura',1000,'a','2024-01-15','Nissan Altima','VWX9012','Saída',0,1000),(29,'João',1500,'a','2024-02-15','Hyundai Elantra','YZA5678','Entrada',1500,400),(30,'	Julia',2000,'a','2024-03-15','Kia Sorento','BCD1234','Entrada',2000,400),(31,'Fernando',5000,'a','2024-05-15','Audi A4','EFG5678','Entrada',5000,0);
/*!40000 ALTER TABLE `historico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoas`
--

DROP TABLE IF EXISTS `pessoas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `telefone` varchar(25) DEFAULT NULL,
  `cidade` varchar(30) DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoas`
--

LOCK TABLES `pessoas` WRITE;
/*!40000 ALTER TABLE `pessoas` DISABLE KEYS */;
INSERT INTO `pessoas` VALUES (2,'Ana','1111-2222','São Paulo','SP'),(3,'Carlos','33334444','Rio de Janeiro','RN'),(4,'Mariana','5555-6666','Belo Horizonte','MG'),(5,'Lucas','7777-8888','Curitiba','PR'),(6,'Isabel','9999-1111','Salvador','BA'),(7,'Pedro','2222-3333','Recife','PE'),(8,'Laura','4444-5555','Fortaleza','CE'),(9,'João','6666-7777','Brasília','DF'),(10,'Julia','8888-9999','Manaus','AM'),(11,'Fernando','2222-3333','Belém','PA'),(12,'Beatriz','4444-5555','Natal','RN'),(13,'Rafael','6666-7777','Goiania','GO'),(14,'Giovanna','8888-9999','São Luís','MA'),(15,'Diego','2222-3333','Cuiabá','MT'),(16,'Camila','4444-5555','João Pessoa','PB'),(17,'Eduardo','6666-7777','Florianópolis','SC'),(18,'Larissa','8888-9999','Vitória','ES'),(19,'Paulo','2222-3333','Aracaju','SE'),(20,'Luiza','4444-5555','Teresina','PI');
/*!40000 ALTER TABLE `pessoas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veiculos`
--

DROP TABLE IF EXISTS `veiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(8) DEFAULT NULL,
  `renavam` varchar(30) DEFAULT NULL,
  `modelo` varchar(30) DEFAULT NULL,
  `cidade` varchar(30) DEFAULT NULL,
  `estado` varchar(30) DEFAULT NULL,
  `idPessoa` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idPessoa` (`idPessoa`),
  CONSTRAINT `veiculos_ibfk_1` FOREIGN KEY (`idPessoa`) REFERENCES `pessoas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos`
--

LOCK TABLES `veiculos` WRITE;
/*!40000 ALTER TABLE `veiculos` DISABLE KEYS */;
INSERT INTO `veiculos` VALUES (2,'DEF5678','9876543210','Honda Civic','Rio de Janeiro','RJ',2),(3,'GHI9012','2468135790','Volkswagen Golf','Belo Horizonte','MG',3),(4,'JKL3456','1357924680','Ford Mustang','Curitiba','PR',4),(5,'MNO7890','5678901234','Chevrolet Cruze','Salvador','BA',5),(6,'PQR2345','4321567890','Mazda CX-5','Recife','PE',6),(7,'STU6789','8901234567','Subaru Outback','Fortaleza','CE',7),(8,'VWX9012','6789054321','Nissan Altima','Brasília','DF',8),(9,'YZA5678','1098765432','Hyundai Elantra','Manaus','AM',9),(10,'BCD1234','7654321098','Kia Sorento','Belém','PA',10),(11,'EFG5678','6543210987','Audi A4','Natal','RN',11),(12,'HIJ9012','2345678901','BMW X5','Goiania','GO',12),(13,'KLM3456','9012345678','Mercedes-Benz C-Class','São Luís','MA',13),(14,'NOP7890','5432109876','Volvo XC60','Cuiabá','MT',14),(15,'QRS2345','9876543210','Lexus RX','João Pessoa','PB',15),(16,'TUV6789','0123456789','Jeep Grand Cherokee','Florianópolis','SC',16),(17,'WXY9012','5432109876','Toyota RAV4','Vitória','ES',17),(18,'ZAB5678','9876543210','Acura MDX','Aracaju','SE',18),(19,'CDE1234','2109876543','Chevrolet Equinox','Teresina','PI',19),(20,'FGH5678','8765432109','Ford Explorer','Witmarsum','SC',20);
/*!40000 ALTER TABLE `veiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-25 23:17:45
