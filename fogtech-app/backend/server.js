require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());


let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'fogtech_db'
    });

    console.log('✓ Conectado ao MySQL!');

    await db.execute(`
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
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS servico_ti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(10) UNIQUE NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        prazo_dias INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_codigo (codigo)
      )
    `);

    await db.execute(`
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
      )
    `);

    console.log('✓ Tabelas verificadas/criadas');

    await db.execute(`
      ALTER TABLE solicitacao_servico 
      MODIFY COLUMN status ENUM('Pendente', 'Em Andamento', 'Concluído', 'Cancelado', 'EM ELABORAÇÃO') DEFAULT 'Pendente'
    `).catch(() => {});

    const [servicos] = await db.execute('SELECT COUNT(*) as count FROM servico_ti');
    if (servicos[0].count === 0) {
      await db.execute(`
        INSERT INTO servico_ti (codigo, nome, descricao, preco, prazo_dias) VALUES
        ('DEV', 'Desenvolvimento Web', 'Desenvolvimento de aplicações web modernas e responsivas', 5000.00, 30),
        ('SEC', 'Segurança & Pentest', 'Auditoria de segurança e testes de penetração', 3000.00, 15),
        ('CLOUD', 'Migração para Cloud', 'Migração completa para AWS, Azure ou Google Cloud', 8000.00, 45),
        ('SUP', 'Suporte Técnico', 'Suporte técnico especializado 24/7', 1500.00, 7)
      `);
      console.log('✓ Serviços padrão inseridos');
    }

  } catch (error) {
    console.error('❌ Erro ao conectar/inicializar banco:', error);
    process.exit(1);
  }
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [users] = await db.execute(
      'SELECT * FROM cliente WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
    }

    const user = users[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
    }

    res.json({
      status: 'sucesso',
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ mensagem: 'Erro ao realizar login' });
  }
});

app.post('/api/auth/trocar-senha', async (req, res) => {
  try {
    const { email, senha_atual, nova_senha } = req.body;

    const [users] = await db.execute(
      'SELECT * FROM cliente WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    const user = users[0];
    const senhaValida = await bcrypt.compare(senha_atual, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha atual incorreta' });
    }

    const hashNovaSenha = await bcrypt.hash(nova_senha, 10);

    await db.execute(
      'UPDATE cliente SET senha = ? WHERE email = ?',
      [hashNovaSenha, email]
    );

    res.json({ status: 'sucesso', mensagem: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.status(500).json({ mensagem: 'Erro ao trocar senha' });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nome, email, senha, cpf, data_nascimento, telefone, estado_civil, escolaridade } = req.body;

    const [existingEmail] = await db.execute(
      'SELECT id FROM cliente WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    const [existingCPF] = await db.execute(
      'SELECT id FROM cliente WHERE cpf = ?',
      [cpf]
    );

    if (existingCPF.length > 0) {
      return res.status(400).json({ mensagem: 'CPF já cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const [result] = await db.execute(
      `INSERT INTO cliente (nome, email, senha, cpf, data_nascimento, telefone, estado_civil, escolaridade) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, hashSenha, cpf, data_nascimento, telefone || null, estado_civil, escolaridade]
    );

    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Cliente cadastrado com sucesso',
      cliente_id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente' });
  }
});

app.post('/api/servicos', async (req, res) => {
  try {
    const { codigo, nome, descricao, preco, prazo_dias } = req.body;

    const [existing] = await db.execute(
      'SELECT id FROM servico_ti WHERE codigo = ?',
      [codigo]
    );

    if (existing.length > 0) {
      return res.status(400).json({ mensagem: 'Código de serviço já existe' });
    }

    const [result] = await db.execute(
      `INSERT INTO servico_ti (codigo, nome, descricao, preco, prazo_dias) 
       VALUES (?, ?, ?, ?, ?)`,
      [codigo, nome, descricao || null, preco, prazo_dias]
    );

    res.status(201).json({
      status: 'sucesso',
      mensagem: 'Serviço cadastrado com sucesso',
      servico_id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error);
    res.status(500).json({ mensagem: 'Erro ao cadastrar serviço' });
  }
});

app.get('/api/servicos', async (req, res) => {
  try {
    const [servicos] = await db.execute(
      'SELECT * FROM servico_ti ORDER BY nome'
    );

    res.json({ servicos });
  } catch (error) {
    console.error('Erro ao listar serviços:', error);
    res.status(500).json({ mensagem: 'Erro ao listar serviços' });
  }
});

app.get('/api/solicitacoes/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const [cliente] = await db.execute(
      'SELECT id FROM cliente WHERE email = ?',
      [email]
    );

    if (cliente.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const [solicitacoes] = await db.execute(
      `SELECT 
        s.id,
        s.numero_solicitacao,
        s.status,
        s.data_pedido,
        s.data_prevista,
        s.preco,
        s.observacoes,
        srv.codigo as servico_codigo,
        srv.nome as servico_nome
       FROM solicitacao_servico s
       JOIN servico_ti srv ON s.servico_ti_id = srv.id
       WHERE s.cliente_id = ?
       ORDER BY s.data_pedido DESC`,
      [cliente[0].id]
    );

    res.json({ solicitacoes });
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({ mensagem: 'Erro ao listar solicitações' });
  }
});

app.post('/api/solicitacoes/atualizar', async (req, res) => {
  try {
    const { email, solicitacoes } = req.body;

    const [cliente] = await db.execute(
      'SELECT id FROM cliente WHERE email = ?',
      [email]
    );

    if (cliente.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const clienteId = cliente[0].id;

    await db.beginTransaction();

    try {
      await db.execute(
        'DELETE FROM solicitacao_servico WHERE cliente_id = ?',
        [clienteId]
      );

      for (const sol of solicitacoes) {
        await db.execute(
          `INSERT INTO solicitacao_servico 
           (cliente_id, servico_ti_id, numero_solicitacao, status, data_pedido, data_prevista, preco, observacoes) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            clienteId,
            sol.servico_ti_id,
            sol.numero_solicitacao,
            sol.status || 'Pendente',
            sol.data_pedido,
            sol.data_prevista,
            sol.preco,
            sol.observacoes || null
          ]
        );
      }

      await db.commit();
      res.json({ status: 'sucesso', mensagem: 'Solicitações atualizadas com sucesso' });
    } catch (error) {
      await db.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Erro ao atualizar solicitações:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar solicitações' });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
  });
});