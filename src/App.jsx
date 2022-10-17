import { useState, useEffect } from 'react'
import Filtros from './components/Filtros'
import Header from './components/Header'
import ListadoGastos from './components/ListadoGastos'
import Modal from './components/Modal'
import { generarId } from './helpers'
import IconoNuevoGasto from './img/nuevo-gasto.svg'

const App = () => {

    //En este use state para que no se pierda el presupueto lo almacenamos en local storage
    //y le damos el valor de lo almacendao en local storage caso contrario le asigno 0
    const [presupuesto, setPresupuesto] = useState(
        Number(localStorage.getItem('presupuesto')) ?? 0)

    const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)

    const [modal, setModal] = useState(false)
    const [animarModal, setAnimarModal] = useState(false)

    const [gastos, setGastos] = useState(
        localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : [])

    const [gastoEditar, setGastoEditar] = useState({})

    const [filtro, setFiltro] = useState('')
    const [gastosFiltrados, setGastosFiltrados] = useState([])

    useEffect(() => {
      if(Object.keys(gastoEditar).length > 0){
        setModal(true)

        setTimeout(() => {
            setAnimarModal(true)
        }, 500);
      }
    
    }, [gastoEditar])

    //Guardar presupuesto en LOCAL STORAGE
    useEffect(() => {
        localStorage.setItem('presupuesto', presupuesto) ?? 0
    }, [presupuesto])
    
    useEffect(() => {
      const presupuestoLS = Number(localStorage.getItem('presupuesto')) ?? 0

      if(presupuestoLS > 0) {
        setIsValidPresupuesto(true)
      }
    }, [])

    //GUARDAR GASTOS EN LOCAL STORAGE
    useEffect(() => {
        localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
    }, [gastos])

    //Escucha los cambios de filtro
    useEffect(() => {
        if(filtro) {
            const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)
            setGastosFiltrados(gastosFiltrados)
        }
    }, [filtro])
    

    //Lllama el modal par definir nuevo gasto
    const handleNuevoGasto = () => {
        setModal(true)
        setGastoEditar({})

        setTimeout(() => {
            setAnimarModal(true)
        }, 500);
    }

    const guardarGasto = gasto => {

        if(gasto.id) {
            //Acutaliza o edita gasto existente
            const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
            setGastos(gastosActualizados)
            setGastoEditar({})
        }else{
            //Genero nuevo gasto
            gasto.id = generarId()
            gasto.fecha = Date.now()
            setGastos([...gastos, gasto])
        }

        //cierro modal
        setAnimarModal(false)

        setTimeout(() => {
            setModal(false)
        }, 500);
    }

    const eliminarGasto = id => {
        const gastosActualizados = gastos.filter(gasto => gasto.id !== id)
        setGastos(gastosActualizados)
    }

    return (
        <div className={modal ? 'fijar' : ''}>
            <Header 
                gastos={gastos}
                setGastos={setGastos}
                presupuesto={presupuesto}
                setPresupuesto={setPresupuesto}
                isValidPresupuesto={isValidPresupuesto}
                setIsValidPresupuesto={setIsValidPresupuesto}
            />

            {isValidPresupuesto && (
                <>

                    <main>

                        <Filtros 
                            filtro={filtro}
                            setFiltro={setFiltro}
                        />

                        <ListadoGastos 
                            gastos={gastos}
                            setGastoEditar={setGastoEditar}
                            eliminarGasto={eliminarGasto}
                            filtro={filtro}
                            gastosFiltrados={gastosFiltrados}
                        />
                    </main>
                
                    {/* Muestra boton de + si el presupuesto es valido */}
                    <div className='nuevo-gasto'>
                        <img src={IconoNuevoGasto}
                            alt='icono nuevo gasto'
                            onClick={handleNuevoGasto}
                        />
                    </div>

                </>
            )}
            
            {modal && <Modal 
                        setModal={setModal}  
                        animarModal={animarModal}
                        setAnimarModal={setAnimarModal}
                        guardarGasto={guardarGasto}
                        gastoEditar={gastoEditar}
                        setGastoEditar={setGastoEditar}
                        />}
        </div>
    )
}

export default App