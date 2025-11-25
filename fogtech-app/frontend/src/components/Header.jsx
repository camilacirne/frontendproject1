function Header({ user, onNavigate, onLogout }) {
  return (
    <header className="header">
      <div className="container">
        <table className="header-table">
          <tbody>
            <tr>
              <td className="logo-td">
                <figure className="logo-fig">
                  <a onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
                    <img src="/assets/logo.png" alt="Logo FogTech" className="logo" />
                  </a>
                </figure>
              </td>
              <td>
                <p className="slogan">Conectando ideias, entregando tecnologia.</p>
              </td>
              <td className="links-td">
                <nav className="topnav">
                  {!user ? (
                    <>
                      <button onClick={() => onNavigate('login')} className="btn btn-sm">
                        Login
                      </button>
                      <button onClick={() => onNavigate('cadastro')} className="btn btn-sm btn-alt">
                        Cadastrar
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => onNavigate('carrinho')} className="btn btn-sm btn-ok">
                        Solicitar Serviços
                      </button>
                      <button onClick={() => onNavigate('cadastro-servico')} className="btn btn-sm btn-alt">
                        Novo Serviço
                      </button>
                      <button onClick={onLogout} className="btn btn-sm">
                        Sair
                      </button>
                    </>
                  )}
                </nav>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </header>
  );
}

export default Header;