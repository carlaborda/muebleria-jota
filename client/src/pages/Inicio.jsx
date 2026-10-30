// Ruta: /
import { Link } from "react-router-dom";
import ProductList from "../componentes/ProductList";
import "./Inicio.css";

const CANTIDAD_DESTACADOS = 4;

function Inicio({ productos, cargando, error, onAgregar }) {
  // Prevenimos errores si 'productos' llega undefined en el primer renderizado
  const productosDestacados = productos ? productos.slice(0, CANTIDAD_DESTACADOS) : [];

  return (
    <>
      <section className="hero">
        <div className="contenedor hero__grid">
          <div className="hero__texto">
            <p className="eyebrow">Casa Taller desde 1996</p>
            <h1>El redescubrimiento de un arte olvidado</h1>
            <p>
              Cada pieza cuenta la historia de manos expertas y materiales nobles,
              hecha para envejecer con gracia.
            </p>
            <Link to="/productos" className="boton boton--principal boton--grande" >
              Ver productos
            </Link>
          </div>
          <div className="hero__imagen">
            <img
              src="/img/Aparador-Uspallata.png"
              alt="Aparador Uspallata de roble con puertas de rejilla y tapa de mármol"
            />
          </div>
        </div>
      </section>

      <section className="contenedor nosotros">
        <h2 className="titulo-seccion">30 años de tradición</h2>
        <div className="nosotros__texto">
          <p>
            Hermanos Jota nace en la intersección entre herencia e innovación, donde la calidez del
            optimismo de los años 60 se encuentra con la conciencia de la sustentabilidad de hoy.
          </p>
          <p>
            Trabajamos con madera certificada FSC de bosques responsables argentinos, priorizando
            maderas nativas y acabados naturales.
          </p>
        </div>
      </section>

      <section className="contenedor seccion">
        <div className="seccion__encabezado">
          <h2 className="titulo-seccion">Productos destacados</h2>
          <Link to="/productos" className="boton boton--link" >
            Ver todo →
          </Link>
        </div>
        <ProductList 
          productos={productosDestacados} 
          cargando={cargando} 
          error={error} 
          onAgregar={onAgregar} 
        />
      </section>
    </>
  );
}

export default Inicio;
