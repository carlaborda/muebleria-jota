import "./Footer.css";

function Footer({ onNavegar }) {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="contenedor footer__grid">
        <div className="footer__marca">
          <p className="footer__nombre">Hermanos Jota</p>
          <p>Casa Taller · madera, diseño y atención personalizada desde 1996.</p>
        </div>

        <div>
          <h3>Visitanos</h3>
          <address>
            Av. San Juan 2847
            <br />
            C1232AAB — San Cristóbal, CABA
          </address>
          <p>
            Lun a Vie: 10:00 – 19:00
            <br />
            Sábados: 10:00 – 14:00
          </p>
        </div>

        <div>
          <h3>Contacto</h3>
          <ul className="footer__lista">
            <li>info@hermanosjota.com.ar</li>
            <li>ventas@hermanosjota.com.ar</li>
            <li>WhatsApp +54 11 4567-8900</li>
            <li>Instagram @hermanosjota_ba</li>
          </ul>
        </div>

        <div>
          <h3>Navegación</h3>
          <ul className="footer__lista">
            <li><button onClick={() => onNavegar("inicio")}>Inicio</button></li>
            <li><button onClick={() => onNavegar("productos")}>Productos</button></li>
            <li><button onClick={() => onNavegar("contacto")}>Contacto</button></li>
          </ul>
        </div>
      </div>

      <p className="contenedor footer__copy">
        © {anio} Hermanos Jota. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
