import ContactForm from "../componentes/ContactForm";
import "./Contacto.css";

function Contacto() {
  return (
    <div className="contenedor seccion">
      <header className="contacto__encabezado">
        <p className="eyebrow">Consultas</p>
        <h1 className="titulo-seccion">Hablemos de tu próximo proyecto</h1>
        <p>
          Acompañamos proyectos residenciales, comerciales y de arquitectura con muebles a medida,
          restauración y asesoramiento artesanal.
        </p>
      </header>

      <div className="contacto__grid">
        <section className="panel">
          <h2>Escribinos</h2>
          <ContactForm />
        </section>

        <aside className="panel contacto__info">
          <h2>Casa Taller</h2>
          <dl>
            <dt>Dirección</dt>
            <dd>Av. San Juan 2847, San Cristóbal, CABA</dd>
            <dt>Horarios</dt>
            <dd>Lun a Vie 10–19 h · Sáb 10–14 h</dd>
            <dt>Email</dt>
            <dd>info@hermanosjota.com.ar</dd>
            <dt>Ventas</dt>
            <dd>ventas@hermanosjota.com.ar</dd>
            <dt>WhatsApp</dt>
            <dd>+54 11 4567-8900</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export default Contacto;
