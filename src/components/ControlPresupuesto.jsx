import {useEffect, useState} from 'react'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css'

const ControlPresupuesto = ({presupuesto, setPresupuesto, gastos, setGastos, setIsValidPresupuesto}) => {

    const [porcentaje, setPorcentaje] = useState(0)
    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)

    useEffect(() => {
      const totalGastado = gastos.reduce((total, gasto) => gasto.cantidad + total, 0)

      const totalDisponible = presupuesto - totalGastado

      //Calcular el porcentaje gastado para mostrar en grafico
      const nuevoPorcentaje = (((presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2)
      
      setDisponible(totalDisponible)
      setGastado(totalGastado)
      setTimeout(() => {
          setPorcentaje(nuevoPorcentaje)
      }, 1000);
    }, [gastos])
    

    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
        })
    }

	const handleResetApp = () => {
		const resultado = confirm('¿Deseas reinicair presupuesto y gastos?')

		if(resultado){
			setPresupuesto(0)
			setGastos([])
			setIsValidPresupuesto(false)
		}
	}

  return (
    <div className='contenedor-presupuesto contenedor sombra dos-columnas'>
        <div>
            <CircularProgressbar 
                styles={buildStyles({
                    pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                    trailColor: '#F5F5F5',
                    textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                })}
                value={porcentaje}
                text={`${porcentaje}% Gastado`}
            />
        </div>

        <div className='contenido-presupuesto'>
            <button 
				className='reset-app'
				type='button'
				onClick={handleResetApp}
			>
				Resetear App
			</button>   
            <p>
                <span>Presupuesto: </span> {formatearCantidad(presupuesto)}
            </p>
            <p className={`${disponible < 0 ? 'negativo' : ''}`}>
                <span>Disponible: </span> {formatearCantidad(disponible)}
            </p>
            <p className={`${gastado > presupuesto ? 'negativo' : ''}`}>
                <span>Gastado: </span> {formatearCantidad(gastado)}
            </p>
        </div>
    </div>
  )
}

export default ControlPresupuesto