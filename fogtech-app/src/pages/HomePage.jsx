function HomePage() {
  return (
    <main className="container">
      <section className="hero card animate-fade-up">
        <h1><em>Bem-vindo(a) à FogTech</em></h1>
        <p>
          Nascemos para simplificar a jornada digital de pequenas e médias empresas. 
          Nossa equipe reúne experiência em <strong>segurança</strong>, <strong>desenvolvimento</strong> e{' '}
          <strong>infraestrutura</strong> para acelerar a sua transformação.
        </p>
      </section>

      <section className="historia card long-content animate-fade-up">
        <h2>Nossa História</h2>
        <p>
          Fundada em 2022 por três cientistas da computação apaixonados por resolver problemas reais, 
          a FogTech cresceu com foco em excelência técnica e atendimento próximo. De Recife para o mundo, 
          entregamos soluções em nuvem, automação e DevOps.
        </p>
        <div className="overflow-box">
          <p>
            Em nossos primeiros anos, ajudamos clientes a migrarem para arquiteturas modernas, 
            reduzindo custos operacionais em até 40% e aumentando a confiabilidade dos sistemas. 
            Com certificações em principais provedores de nuvem (AWS, Azure, Google Cloud) e 
            metodologias ágeis, elevamos os padrões de entrega, mantendo sempre a cultura de 
            aprendizado contínuo e inovação.
          </p>
          <p>
            Hoje atuamos em diversos setores, com projetos que vão desde automações até plataformas 
            web de alto desempenho, sempre priorizando segurança, escalabilidade e experiência do usuário. 
            Nossa missão é democratizar o acesso à tecnologia de ponta.
          </p>
        </div>
      </section>

      <section class="video card animate-fade-up">
            <h2>Vídeo Institucional</h2>
            <div class="video-wrapper">
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=J4G6f8EiKX8" title="Vídeo institucional FogTech" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
        </section>

        <section class="galeria card animate-fade-up">
            <h2>Nossas Instalações e Equipe</h2>
            <div class="grid-galeria">
                <img src="assets/office1.jpg" alt="Escritório 1" />
                <img src="assets/team1.jpg" alt="Escritório 2" />
                <img src="assets/team2.jpg" alt="Equipe 1" />
                <img src="assets/team1.jpg" alt="Equipe 2" />
            </div>
        </section>

      <section className="servicos card animate-fade-up">
        <h2>Principais Serviços</h2>
        <div className="servicos-grid">
          <div className="srv">
            <h3>Desenvolvimento Web</h3>
            <p>
              Aplicações modernas, responsivas e escaláveis. Utilizamos tecnologias de ponta 
              como React, Node.js e arquiteturas cloud-native.
            </p>
          </div>
          <div className="srv">
            <h3>Segurança & Pentest</h3>
            <p>
              Auditorias de segurança completas, testes de penetração e implementação de 
              protocolos de proteção para seus sistemas.
            </p>
          </div>
          <div className="srv">
            <h3>Migração para Cloud</h3>
            <p>
              Transição segura para AWS, Azure ou Google Cloud com otimização de custos e 
              performance garantida.
            </p>
          </div>
          <div className="srv">
            <h3>Suporte Técnico</h3>
            <p>
              Suporte 24/7 para infraestrutura, monitoramento proativo e resolução rápida 
              de incidentes críticos.
            </p>
          </div>
        </div>
      </section>

      <section className="fundadores card animate-fade-up">
        <h2>Nossos Fundadores</h2>
        <table className="tabela-fundadores">
          <thead>
            <tr>
              <th>Cargo</th>
              <th>Nome</th>
              <th>Experiência</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CEO</td>
              <td>João Silva</td>
              <td>Ciência da Computação pela Cesar School. Especialista em cloud computing e DevOps.</td>
            </tr>
            <tr>
              <td>CTO</td>
              <td>Maria Santos</td>
              <td>Ciência da Computação pela Cesar School. Especialista em arquitetura de software e segurança.</td>
            </tr>
            <tr>
              <td>COO</td>
              <td>Pedro Costa</td>
              <td>Ciência da Computação pela Cesar School. Especialista em gestão de operações e processos.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default HomePage;