-- Script de inicialização do banco de dados FogTech
-- Este script é executado automaticamente quando o container MySQL é iniciado

USE fogtech_db;

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20),
    estado_civil VARCHAR(50) NOT NULL,
    escolaridade VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_cpf (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de serviços de TI
CREATE TABLE IF NOT EXISTS servico_ti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    prazo_dias INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela de solicitações de serviço
CREATE TABLE IF NOT EXISTS solicitacao_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    servico_ti_id INT NOT NULL,
    numero_solicitacao VARCHAR(50) NOT NULL,
    status ENUM('Pendente', 'Em Andamento', 'Concluído', 'Cancelado', 'EM ELABORAÇÃO') DEFAULT 'Pendente',
    data_pedido DATE NOT NULL,
    data_prevista DATE NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_ti_id) REFERENCES servico_ti(id) ON DELETE RESTRICT,
    INDEX idx_cliente (cliente_id),
    INDEX idx_numero (numero_solicitacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir serviços padrão
INSERT INTO servico_ti (codigo, nome, descricao, preco, prazo_dias) VALUES
('DEV', 'Desenvolvimento Web', 'Desenvolvimento de aplicações web modernas e responsivas', 5000.00, 30),
('SEC', 'Segurança & Pentest', 'Auditoria de segurança e testes de penetração', 3000.00, 15),
('CLOUD', 'Migração para Cloud', 'Migração completa para AWS, Azure ou Google Cloud', 8000.00, 45),
('SUP', 'Suporte Técnico', 'Suporte técnico especializado 24/7', 1500.00, 7)
ON DUPLICATE KEY UPDATE nome=nome;

-- Confirmação
SELECT 'Database initialized successfully!' as message;
