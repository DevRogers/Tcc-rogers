create database bancoTcc;

use bancoTcc;

insert into usuarios (id, email, senha) values (default, "mosr0505@gmail.com", md5("rani123"));
select * from usuarios;
drop table usuarios;
truncate usuarios;
drop table pessoas;

create table pessoas(
id int primary key auto_increment,
nome varchar(100),
telefone varchar(25),
cidade varchar(30),
estado varchar(30),
idUsuario int unsigned,
foreign key(idUsuario) references usuarios(id)
);
select * from pessoas;
SELECT * FROM pessoas WHERE idUsuario=2;

drop user fabioRoger;
create user 'fabioRoger'@'%' identified with mysql_native_password by 'Abcd&123';
grant all on bancoTcc.* to 'fabioRoger'@'%';

drop table veiculos;
create table veiculos(
	id int auto_increment primary key,
    placa varchar(8),
    renavam varchar(30),
    modelo varchar(30),
    cidade varchar(30),
    estado varchar(30),
    idPessoa int,
    foreign key(idPessoa) references pessoas(id),
	idUsuario int unsigned,
    foreign key(idUsuario) references usuarios(id)
);
select * from veiculos;
truncate veiculos;
truncate pessoas;
drop table historico;
select * from historico;
create table historico(
id int auto_increment primary key,
nome varchar(100),
valor double,
descricao varchar(100),
data date,
veiculo varchar(30),
placa varchar(10),
tipo varchar(30),
entrada double,
saida double,
idUsuario int unsigned,
foreign key(idUsuario) references usuarios(id)
);
SELECT count(id) FROM historico WHERE idUsuario=2;
truncate historico;
