import React, { useState, useEffect } from 'react';

const App = () => {
  const [capitalInicial, setCapitalInicial] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [tabelaJuros, setTabelaJuros] = useState([]);
  const [diaDoMes, setDiaDoMes] = useState('');
  // Mostra o dia atual
  useEffect(() => {
    const diaAtual = new Date().getDate();
    setDiaDoMes(diaAtual);
  }, []);

  // Recuperar a tabela completa do localStorage ao carregar a página
  useEffect(() => {
    const tabelaSalva = localStorage.getItem('tabelaJuros');
    if (tabelaSalva) {
      setTabelaJuros(JSON.parse(tabelaSalva));
    }
    const banca = JSON.parse(localStorage.getItem("capitalInicial"))
    const taxa = JSON.parse(localStorage.getItem("taxaJuros"))

    setCapitalInicial(banca)
    setTaxaJuros(taxa)

  }, []);
  // formata os números par brl
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  // faz toda a lógicca do juros 
  const calcularJuros = (e) => {
    e.preventDefault();
    // validação se os inputs estão maiores que 0
    if (!capitalInicial || parseFloat(capitalInicial) <= 0 || !taxaJuros || parseFloat(taxaJuros) <= 0) {
      alert('Os valores iniciais devem ser maiores que zero.');
      return;
    }

    const jurosCompostos = [];
    let capital = parseFloat(capitalInicial);
    const taxa = parseFloat(taxaJuros) / 100;

    for (let i = 1; i <= 30; i++) {
      capital *= 1 + taxa;
      jurosCompostos.push({
        mes: i,
        valor: capital.toFixed(2),
      });
    }

    // Atualizar o estado com a nova tabela
    setTabelaJuros(jurosCompostos);

    // Salvando a tabela completa no localStorage
    localStorage.setItem('tabelaJuros', JSON.stringify(jurosCompostos));
    localStorage.setItem('capitalInicial', JSON.stringify(capitalInicial))
    localStorage.setItem('taxaJuros', JSON.stringify(taxaJuros))
  };

  return (
    <div className='conteudo'>
      <h1>Calculadora de Juros Compostos</h1>

      {<div className='valores'>
        <h3>Sua banca inicial: {formatarMoeda(capitalInicial)} </h3>
        <h3>Sua taxa ao dia: {taxaJuros}%</h3>
      </div>}

      <form className='form'>
        <p className='diaDoMes'>Hoje é dia: {diaDoMes}</p>

        <div className='cont-input'>
          <label htmlFor="capitalInicial">Banca</label>
          <input
            type="text"
            required
            autoComplete='off'
            placeholder='Sua banca:'
            id="capitalInicial"
            value={capitalInicial}
            onChange={(e) => setCapitalInicial(e.target.value)}
          />
        </div>

        <div className='cont-input'>
          <label htmlFor="taxaJuros">Taxa de juros</label>
          <input
            type="text"
            required
            autoComplete='off'
            placeholder='Taxa de Juros (% ao mês)'
            id="taxaJuros"
            value={taxaJuros}
            onChange={(e) => setTaxaJuros(e.target.value)}
          />
        </div>

        <button onClick={calcularJuros}>
          Calcular Juros
        </button>
      </form>

      <table className='tabela'>
        <tbody>
          <tr className='cabecalho'>
            <th>Mês</th>
            <th>Valor Acumulado</th>
          </tr>
          {tabelaJuros.map((item) => (
            <tr key={item.mes}>
              <td>Dia {item.mes}</td>
              <td>Valor {formatarMoeda(item.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
