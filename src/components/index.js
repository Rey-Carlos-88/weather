import React, { useEffect, useRef, useState } from 'react';
import { apiGetWeather } from '../services/action';
import Button from '@mui/material/Button';

import {
  Search,
  Heart,
  Trash2,
  Thermometer,
  Droplets,
  Wind,       
  Cloud,
} from "lucide-react";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const WeatherDashboard = () => {

  const execudedRed = useRef(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [favorites, setFavorites] = useState([
    { id: "1", name: "Madrid" },
    { id: "2", name: "Barcelona" },
    { id: "3", name: "Valencia" },
  ])
  const [selectedCity, setSelectedCity] = useState(null)


  const onGetAllWeather = async () => {
    try { 
      const idCuntry = '524901';
      const response = await apiGetWeather(idCuntry);
      console.log('data en pantalla --> ',response.data)

    } catch (error) {
      console.log('error de servicio --> ',error);
    }
  };

  // Simulación de sugerencias
  const handleChange = (e) => {
    const valueArg = ''
    setQuery(valueArg)

    if (valueArg.length > 1) {
      // Simular sugerencias basadas en la entrada
      const mockSuggestions = [`${valueArg} City`, `${valueArg}ville`, `${valueArg} Capital`]
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleRemove = (id) => {
    setFavorites(favorites.filter((city) => city.id !== id))
    // Aquí iría la lógica para actualizar localStorage
  }

  const handleSelect = (id) => {
    setSelectedCity(id)
    // Aquí iría la lógica para cargar los datos del clima
  }

  const dataChart = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  useEffect(()=> {
    if (execudedRed.current) return
    execudedRed.current = true;

    //onGetAllWeather();
  },[])

  console.log('grafica data --> ',dataChart)


  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">
        Weather Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">

          <div className="relative">
            <form onSubmit className="flex">
              <div className="relative flex-grow pr-4">
                <input
                  type="text"
                  placeholder="Buscar ciudad..."
                  value={query}
                  onChange={handleChange}
                  className="pl-10 border rounded-lg border-gray-500 focus:border-gray-500 focus:ring-gray-900 w-full h-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue" size={15} />
              </div>
              <Button 
                className="ml-2 text-white bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-400 hover:to-blue-500"
              >
                Buscar
              </Button>
            </form>
          </div>


          <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm mt-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  Madrid
                </h2>
                <p className="text-[#64748B]">
                  Miércoles, 15 Mayo
                </p>
              </div>
              <div className="flex items-center">
                <div className="bg-[#FACC15] text-[#0F172A] p-2 rounded-full">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                    <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M22 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M19.7782 4.22183L18.364 5.63604" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5.63608 18.364L4.22187 19.7782" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M19.7782 19.7782L18.364 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5.63608 5.63604L4.22187 4.22183" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-6" style={{ display: 'none'}}>
              <div className="flex items-end">
                <span className="text-5xl font-bold text-[#0F172A]">24°</span>
                <span className="text-xl text-[#64748B] ml-2 mb-1">Soleado</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4" style={{ display: 'none'}}>
              <div className="flex items-center">
                <Thermometer className="text-[#F97316] mr-2" size={20} />
                <div>
                  <p className="text-[#64748B] text-sm">Sensación</p>
                  <p className="text-[#0F172A] font-medium">26°</p>
                </div>
              </div>
              <div className="flex items-center">
                <Droplets className="text-[#0891B2] mr-2" size={20} />
                <div>
                  <p className="text-[#64748B] text-sm">Humedad</p>
                  <p className="text-[#0F172A] font-medium">45%</p>
                </div>
              </div>
              <div className="flex items-center">
                <Wind className="text-[#64748B] mr-2" size={20} />
                <div>
                  <p className="text-[#64748B] text-sm">Viento</p>
                  <p className="text-[#0F172A] font-medium">12 km/h</p>
                </div>
              </div>
              <div className="flex items-center">
                <Cloud className="text-[#94A3B8] mr-2" size={20} />
                <div>
                  <p className="text-[#64748B] text-sm">Nubes</p>
                  <p className="text-[#0F172A] font-medium">10%</p>
                </div>
              </div>
            </div>


            <div className="mt-6" style={{ display: 'none'}}>
              <div className="flex items-end">
                <span className="text-5xl font-bold text-slate-900">24°</span>
                <span className="text-xl text-slate-500 ml-2 mb-1">Soleado</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4" style={{ display: 'none'}}>
              <div className="flex items-center">
                <Thermometer className="text-orange-500 mr-2" size={20} />
                <div>
                  <p className="text-slate-500 text-sm">Sensación</p>
                  <p className="text-slate-900 font-medium">26°</p>
                </div>
              </div>
              <div className="flex items-center">
                <Droplets className="text-cyan-600 mr-2" size={20} />
                <div>
                  <p className="text-slate-500 text-sm">Humedad</p>
                  <p className="text-slate-900 font-medium">45%</p>
                </div>
              </div>
              <div className="flex items-center">
                <Wind className="text-slate-500 mr-2" size={20} />
                <div>
                  <p className="text-slate-500 text-sm">Viento</p>
                  <p className="text-slate-900 font-medium">12 km/h</p>
                </div>
              </div>
              <div className="flex items-center">
                <Cloud className="text-slate-400 mr-2" size={20} />
                <div>
                  <p className="text-slate-500 text-sm">Nubes</p>
                  <p className="text-slate-900 font-medium">10%</p>
                </div>
              </div>
            </div>


            <div className="mt-6 space-y-6">
              {/* Temperature Display */}
              <div className="flex items-end">
                <span className="text-5xl font-bold text-slate-900">24°</span>
                <span className="text-xl text-slate-500 ml-2 mb-1">Soleado</span>
              </div>

              {/* Weather Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Feels Like */}
                <div className="flex items-center">
                  <Thermometer className="text-orange-500 mr-2 w-5 h-5" />
                  <div>
                    <p className="text-slate-500 text-sm">Sensación</p>
                    <p className="text-slate-900 font-medium">26°</p>
                  </div>
                </div>
                
                {/* Humidity */}
                <div className="flex items-center">
                  <Droplets className="text-cyan-600 mr-2 w-5 h-5" />
                  <div>
                    <p className="text-slate-500 text-sm">Humedad</p>
                    <p className="text-slate-900 font-medium">45%</p>
                  </div>
                </div>
                
                {/* Wind */}
                <div className="flex items-center">
                  <Wind className="text-slate-500 mr-2 w-5 h-5" />
                  <div>
                    <p className="text-slate-500 text-sm">Viento</p>
                    <p className="text-slate-900 font-medium">12 km/h</p>
                  </div>
                </div>
                
                {/* Clouds */}
                <div className="flex items-center">
                  <Cloud className="text-slate-400 mr-2 w-5 h-5" />
                  <div>
                    <p className="text-slate-500 text-sm">Nubes</p>
                    <p className="text-slate-900 font-medium">10%</p>
                  </div>
                </div>
              </div>
            </div>



          </div>


          <div className="w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6">
            <h3 className="text-gray-900 font-medium mb-4 text-lg">
              Temperaturas de los últimos 5 días
            </h3>
            
            {/* Contenedor con altura mínima garantizada */}
            <div className="w-full" style={{ height: '400px', minHeight: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataChart}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pv" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uv" 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>



        <div>
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
            <h3 className="text-[#0F172A] font-medium mb-3 flex items-center">
              <Heart className="text-[#EF4444] mr-2" size={18} />
              Ciudades Favoritas
            </h3>

            {favorites.length === 0 ? (
              <p className="text-[#64748B] text-sm">
                No tienes ciudades favoritas
              </p>
            ) : (
              <ul className="space-y-2">
                {favorites.map((city) => (
                  <li
                    key={city.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      selectedCity === city.id ? "bg-[#DBEAFE]" : "hover:bg-[#F0F9FF]"
                    }`}
                  >
                    <button className="text-[#0F172A] text-left flex-grow" 
                      onClick={() => handleSelect(city.id)}
                    >
                      {city.name}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(city.id)}
                      className="h-8 w-8 text-[#64748B] hover:text-[#EF4444] hover:bg-transparent"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <Button 
              className="w-full mt-3 bg-[#0891B2] hover:bg-[#0E7490] text-gray-100"
            >
              <Heart className="mr-2" size={16} />
              Añadir ciudad actual
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
