-- Drop database if exists
DROP DATABASE IF EXISTS devcollab;

-- Criar o banco de dados
CREATE DATABASE devcollab;
USE devcollab;

-- Tabela para armazenar informações básicas dos usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nome_usuario VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(60) NOT NULL,
    telefone VARCHAR(30),
    senha VARCHAR(255) NOT NULL,
    tipo_user VARCHAR(100) NOT NULL
);

-- Tabela para armazenar informações sobre projetos
CREATE TABLE projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(45) NOT NULL,
    usuario_criador INT,
    descricao VARCHAR(500) NOT NULL,
    valor BIGINT(20) NOT NULL,
    equipe_resp INT,
    FOREIGN KEY (usuario_criador) REFERENCES usuarios(id),
    FOREIGN KEY (equipe_resp) REFERENCES equipe(id)
);

-- Tabela para armazenar informações sobre equipes
CREATE TABLE equipe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    usuario_criador_eq INT NOT NULL,
    FOREIGN KEY (usuario_criador_eq) REFERENCES usuarios(id)
);

-- Tabela de associação muitos para muitos entre usuários e equipes
CREATE TABLE equipe_membros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_equipe INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_equipe) REFERENCES equipe(id),
    UNIQUE KEY unique_member (id_usuario, id_equipe)
);