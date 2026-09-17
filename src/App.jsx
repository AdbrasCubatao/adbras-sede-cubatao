import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* SEÇÃO HERO / DESTAQUE COM PASTOR */}
      <section style={{
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        padding: '40px 20px',
        textAlign: 'center',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Foto do Pastor */}
          <div style={{ marginBottom: '20px' }}>
            <img 
              src="https://via.placeholder.com/150" 
              alt="Foto do Pastor" 
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
            AD Brás Cubatão
          </h1>
          <p style={{ fontSize: '1rem', color: '#93c5fd', marginBottom: '16px' }}>
            "Servindo ao Senhor com alegria e união."
          </p>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.5', opacity: 0.9 }}>
            Seja muito bem-vindo à nossa igreja! Acompanhe nossos horários, faça seus pedidos de oração e fique por dentro de todos os eventos.
          </p>
        </div>
      </section>

      {/* GRADE DE BOTÕES DE AÇÕES RÁPIDAS */}
      <main style={{ maxWidth: '600px', margin: '30px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '16px', textAlign: 'center' }}>
          Acesso Rápido
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px'
        }}>
          
          <Link to="/agenda" style={buttonStyle}>
            <span style={iconStyle}>📅</span>
            <span>Agenda</span>
          </Link>

          <Link to="/avisos" style={buttonStyle}>
            <span style={iconStyle}>📢</span>
            <span>Avisos</span>
          </Link>

          <Link to="/pedidos-oracao" style={buttonStyle}>
            <span style={iconStyle}>🙏</span>
            <span>Pedidos de Oração</span>
          </Link>

          <Link to="/dizimos" style={buttonStyle}>
            <span style={iconStyle}>❤️</span>
            <span>Dízimos e Ofertas</span>
          </Link>

          <Link to="/departamentos" style={buttonStyle}>
            <span style={iconStyle}>👥</span>
            <span>Departamentos</span>
          </Link>

          <Link to="/biblia" style={buttonStyle}>
            <span style={iconStyle}>📖</span>
            <span>Bíblia</span>
          </Link>

        </div>
      </section>

    </div>
  )
}

// Estilos Reutilizáveis dos Botões
const buttonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 10px',
  backgroundColor: '#ffffff',
  color: '#1e3a8a',
  borderRadius: '12px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  border: '1px solid #e2e8f0',
  transition: 'transform 0.2s ease, boxShadow 0.2s ease'
}

const iconStyle = {
  fontSize: '1.8rem',
  marginBottom: '8px'
            }
