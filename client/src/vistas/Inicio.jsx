import ProductList from "../componentes/ProductList";
import "./Inicio.css";

const CANTIDAD_DESTACADOS = 4;

function Inicio({ onNavegar, productos, ...estadoCatalogo }) {
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
            <button className="boton boton--principal boton--grande" onClick={() => onNavegar("productos")}>
              Ver productos
            </button>
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
          <button className="boton boton--link" onClick={() => onNavegar("productos")}>
            Ver todo →
          </button>
        </div>
        <ProductList productos={productos.slice(0, CANTIDAD_DESTACADOS)} {...estadoCatalogo} />
      </section>
    </>
  );
}

export default Inicio;
