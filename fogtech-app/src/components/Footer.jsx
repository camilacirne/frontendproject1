function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Contato</h3>
            <ul className="contatos">
              <li>📞 (81) 0000-0000</li>
              <li>📱 (81) 19521-9324</li>
              <li>✉️ <a href="mailto:contato@fogtech.com.br" style={{ color: '#38bdf8' }}>contato@fogtech.com.br</a></li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Endereço</h3>
            <p>Rua da Inovação, 1337<br />Boa Viagem, Recife/PE<br />CEP: 51021-000</p>
          </div>
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Formas de Pagamento</h3>
            <div className="pagamentos">
              <span className="pay">VISA</span>
              <span className="pay mc">MC</span>
              <span className="pay pix">PIX</span>
              <span className="pay">BITCOIN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;