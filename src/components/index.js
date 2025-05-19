import React, { useEffect, useRef, useState } from 'react';

import Loader from './loader/loader';
import { apiGetWeather } from '../services/action';
import { 
  saveCity,
  listCity,
  deleteCity
} from '../services/localStorage'

import DataCities from '../data/cities.json'

import Button from '@mui/material/Button';

import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';

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

  const [isLoader, setIsLoader] = useState(true);


  const [allCities, setAllCities] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [favorites, setFavorites] = useState([]);

  const [selectedCity, setSelectedCity] = useState();

  const [tempsDay, setTempsDay] = useState([]);

  const [dataAddCity, setDAtaAddCity] = useState([]);

  const [
    isDisabledCoreMessages, 
    setIsDisabledCoreMessages
  ] = useState(true);

  const onSearchityData = async () => {
    console.log('dato a buscar -->',query)
      const dataCity = await DataCities;
      console.log('allData filter --> ',dataCity)
      const resultado = dataCity.filter(item =>
        item.estado.toLowerCase() === query.toLowerCase() ||
        item.capital.toLowerCase() === query.toLowerCase()
      );
      setDAtaAddCity(resultado[0]);


      console.log('data para buscar -->',resultado)
      let idCuntryArg = resultado[0].id
      console.log('id para servicio --> ',idCuntryArg)
      const response = await apiGetWeather(idCuntryArg);
      console.log('data en pantalla --> ',response.data)

      if (response.data.cod === 200 || 
        response.data.cod === '200'
      ) {

        const dailyData = {};
        response.data.list.forEach(item => {
          const [date, time] = item.dt_txt.split(' ');

          if (!dailyData[date]) {
            dailyData[date] = {
              name: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }),
              temps: [],
              windSpeeds: [],
              humidities: []
            };
          }

          dailyData[date].temps.push(item.main.temp);
          dailyData[date].windSpeeds.push(item.wind.speed);
          dailyData[date].humidities.push(item.main.humidity);
        });

        // Transformar al formato del gráfico
        const chartData = Object.entries(dailyData)
          .slice(0, 5)
          .map(([date, data]) => {
            const minTemp = Math.min(...data.temps);
            const maxTemp = Math.max(...data.temps);
            const avgWind = data.windSpeeds.reduce((a, b) => a + b, 0) / data.windSpeeds.length;
            const avgHumidity = data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length;

            return {
              name: data.name,
              uv: Math.round(minTemp * 100), // Temperatura mínima (escala 100)
              pv: Math.round(maxTemp * 100), // Temperatura máxima (escala 100)
              amt: Math.round(avgWind * 100) // Velocidad de viento promedio (opcional)
            };
          });
        console.log('data para grafica --> ',chartData)
        setTempsDay(chartData)


        /** seccion en donde se impremen grado pero no se ve en las graficas */
        //const dataDeailCitySearch = await detailWeatherCity(response.data);
        //console.log('detail detail data --> ',dataDeailCitySearch);

        // const dailyData = {};
    
        // dataDeailCitySearch.pronostico.forEach(item => {
        //   // Extraer la fecha (sin la hora)
        //   const date = item.fecha.split(' ')[0];
          
        //   // Convertir temperaturas a números
        //   const tempMax = parseFloat(item.temperatura.maxima);
        //   const tempMin = parseFloat(item.temperatura.minima);
          
        //   // Si el día no existe en el objeto, inicializarlo
        //   if (!dailyData[date]) {
        //       dailyData[date] = {
        //           date: date,
        //           tempMax: tempMax,
        //           tempMin: tempMin,
        //           count: 1
        //       };
        //   } else {
        //       // Actualizar máximas y mínimas
        //       if (tempMax > dailyData[date].tempMax) {
        //           dailyData[date].tempMax = tempMax;
        //       }
        //       if (tempMin < dailyData[date].tempMin) {
        //           dailyData[date].tempMin = tempMin;
        //       }
        //       dailyData[date].count++;
        //   }
        // });
    
        // // Convertir a array y limitar a 5 días
        // const chartData = Object.values(dailyData)
        //     .sort((a, b) => a.date.localeCompare(b.date))
        //     .slice(0, 5)
        //     .map((day, index) => ({
        //         name: `Día ${index + 1} (${day.date})`,
        //         tempMax: day.tempMax,
        //         tempMin: day.tempMin,
        //         date: day.date
        //     }));

        // console.log('data para grafica --> ',chartData)
        //setTempsDay(chartData)
        


        setIsDisabledCoreMessages(false)
        setTimeout(() => {
          setIsLoader(false)
        },1000);
      }
  }

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  }

  const detailWeatherCity = (data) => {
    try {
      const weatherData = [];
      data.list.forEach(item => {
          const weatherInfo = {
              fecha: item.dt_txt,
              temperatura: {
                  actual: kelvinToCelsius(item.main.temp),
                  sensacion: kelvinToCelsius(item.main.feels_like),
                  minima: kelvinToCelsius(item.main.temp_min),
                  maxima: kelvinToCelsius(item.main.temp_max)
              },
              humedad: item.main.humidity,
              viento: {
                  velocidad: item.wind.speed,
                  direccion: item.wind.deg,
                  rafaga: item.wind.gust || 0 // Algunos items pueden no tener gust
              },
              nubes: item.clouds.all,
              clima: {
                  descripcion: item.weather[0].description,
                  icono: item.weather[0].icon
              },
              lluvia: item.rain ? item.rain['3h'] || 0 : 0 // mm en las últimas 3 horas
          };
          
          weatherData.push(weatherInfo);
      });
      
      return {
          ciudad: data.city.name,
          pais: data.city.country,
          coordenadas: {
              latitud: data.city.coord.lat,
              longitud: data.city.coord.lon
          },
          pronostico: weatherData
      };
    } catch (error) {
      console.log('error a extraer dataDetail -->',error);
      throw error;
    }
  }

  const onAddCity = async (idCityArg, nameArg) => {
    try {
      const response = await saveCity(idCityArg, nameArg)
      console.log('se agrego ciudad --> ',response)
      if (response) {
        onGetLsitFavoriteCity();
     }
     setTimeout(() => {
          setIsLoader(false);
        },2000)

    } catch (error) {
      console.log('error al agregar ciudad pantalla',error)
    };
  }

  const onGetLsitFavoriteCity = async () => {
    try {
      const listCityArg = listCity('city');
      console.log('lista de ciudades en pantalla --> ',listCityArg)
      if(listCityArg.length > 0) {
        setFavorites(listCityArg);
      } else {
        setFavorites([])
      }

    } catch (error) {
      console.log('error a gargar lista pantalla')
      throw error
    }
  }

  const onDeleyeCity = (idCityArg) => {
    try {
      const response = deleteCity(idCityArg)
      console.log('se borro ciudad de favoritos pantallas --> ',response);
      if (response) {
        onGetLsitFavoriteCity();
      }
      setTimeout(() => {
          setIsLoader(false);
        },2000)

    } catch (error) {
      console.log('error al  borrar ciuad Pantalla')
      throw error;
    }
  }

  const onGetCitiesSuggestion = async () => {
    try {
      const response = await DataCities
      console.log('lee data de funcion --> ',response)
      setAllCities(response)
    } catch (error) {
      console.log('error a cargar sugerencias ')
    }
  };

  const onGetAllWeather = async () => {
    try { 
      const idCuntry = '3530597';
      const response = await apiGetWeather(idCuntry);
      console.log('data en pantalla --> ',response.data)

      // Crear un mapa por fecha (solo fecha sin hora)
      const dailyData = {};
      response.data.list.forEach(item => {
        const [date, time] = item.dt_txt.split(' ');

        if (!dailyData[date]) {
          dailyData[date] = {
            name: new Date(date).toLocaleDateString('es-ES', { weekday: 'short' }),
            temps: [],
            windSpeeds: [],
            humidities: []
          };
        }

        dailyData[date].temps.push(item.main.temp);
        dailyData[date].windSpeeds.push(item.wind.speed);
        dailyData[date].humidities.push(item.main.humidity);
      });

      // Transformar al formato del gráfico
      const chartData = Object.entries(dailyData)
        .slice(0, 5)
        .map(([date, data]) => {
          const minTemp = Math.min(...data.temps);
          const maxTemp = Math.max(...data.temps);
          const avgWind = data.windSpeeds.reduce((a, b) => a + b, 0) / data.windSpeeds.length;
          const avgHumidity = data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length;

          return {
            name: data.name,
            uv: Math.round(minTemp * 100), // Temperatura mínima (escala 100)
            pv: Math.round(maxTemp * 100), // Temperatura máxima (escala 100)
            amt: Math.round(avgWind * 100) // Velocidad de viento promedio (opcional)
          };
        });
      console.log('data para grafica --> ',chartData)
      setTempsDay(chartData)

      setTimeout(() => {
        setIsLoader(false);
      },3000)

    } catch (error) {
      console.log('error de servicio --> ',error);
    }
  };

  // Simulación de sugerencias
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const regex = new RegExp(value, 'i');
      const filtered = allCities.filter(
        item => regex.test(item.capital) || regex.test(item.estado)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSugerencia = (item) => {
    setQuery(item.capital);
    setSuggestions([]);
  };

  const handleSelect = (dataArg) => {
    console.log('data de ciudad -->',dataArg)
    setSelectedCity(dataArg);
    onSearchityData(dataArg);
  }

  console.log('data seleccioanda --> ',selectedCity)
  console.log('data sugerida --> ',suggestions)
  console.log('query --> ',query)

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

  const onMessageInformation = () => {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 text-center rounded-lg bg-blue-50 border border-blue-100 w-full h-96 mx-auto my-8"
      >
        <h3 className="text-3xl font-semibold text-gray-800 mb-2">
          Ingrese un parámetro de búsqueda
        </h3>
        <p className="text-gray-600 text-xl mb-4">
          Para ver la información del clima, por favor ingrese el nombre de una ciudad en el campo de búsqueda.
        </p>
      </div>
    )
  }

  const onMessageNoFavoriteCities = () => {
    return (
      <Card className="w-full max-w-md mx-auto mb-4">
        <CardContent className="pt-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="font-medium text-lg mb-2">
              No hay ciudades favoritas
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              No tienes ciudades en tu lista de favoritos. Añade tu ciudad actual o busca otras ciudades para agregarlas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  useEffect(()=> {
    if (execudedRed.current) return
    execudedRed.current = true;
    onGetCitiesSuggestion();
    onGetLsitFavoriteCity();

    setTimeout(() => {
      setIsLoader(false);
    },3000)
  },[]);

  return (
    <>
      {isLoader ? ( <Loader /> ) : ( 
        <div className="container py-10">
              <h1 className="text-2xl font-bold mb-4">
                Weather Dashboard
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="relative w-full mx-auto">
                    <form onSubmit className="flex items-center">
                      <div className="relative flex-grow pr-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar ciudad..."
                            value={query}
                            onChange={handleChange}
                            className="pl-10 border rounded-lg border-gray-500 focus:border-gray-500 focus:ring-gray-900 w-full h-10"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            
                          />
                        </div>
            
                        {isFocused && suggestions.length > 0 && (
                          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                            {suggestions.map((item, index) => (
                              <li 
                                key={`${item.estado}-${index}`} 
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                                onMouseDown={(e) => e.preventDefault()} // Evita que el input pierda el foco
                                onClick={() => handleSelectSugerencia(item)}
                              >
                                <span className="font-medium text-gray-800">
                                  {item.capital}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  {item.estado}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue" size={15} />
                      
                      </div>
                      <Button 
                        className="ml-2 text-white bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-400 hover:to-blue-500"
                        disabled={!query.trim()}
                        onClick={() => {
                          setIsLoader(true);
                          onSearchityData()
                        }}
                      >
                        Buscar
                      </Button>
                    </form>
                  </div>

                  {isDisabledCoreMessages ?  onMessageInformation() : (
                    <>
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                              Madrid
                            </h1>
                            <p className="text-gray-500">
                              Miércoles, 15 Mayo
                            </p>
                          </div>
                          <div className="flex items-center">
                            <h2 className="text-5xl font-bold text-gray-900">
                              24°
                            </h2>
                            <p className="text-xl text-gray-500">
                              Soleado
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-6">
                          {/* Temperature Display */}
                          {/* Weather Stats Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Feels Like */}
                            <div className="flex items-center space-x-2">
                              <Thermometer className="text-yellow-500 w-8 h-8" />
                              <div>
                                <p className="text-gray-500 text-lg">
                                  Sensación
                                </p>
                                <p className="text-gray-900 font-medium">
                                  26°
                                </p>
                              </div>
                            </div>
                            
                            {/* Wind */}
                            <div className="flex items-center space-x-2">
                              <Wind className="text-gray-700 w-8 h-8" />
                              <div>
                                <p className="text-gray-500 text-lg">
                                  Viento
                                </p>
                                <p className="text-gray-900 font-medium">
                                  12 km/h
                                </p>
                              </div>
                            </div>
                            
                            {/* Humidity */}
                            <div className="flex items-center space-x-2">
                              <Droplets className="text-blue-600 w-8 h-8" />
                              <div>
                                <p className="text-gray-500 text-lg">
                                  Humedad
                                </p>
                                <p className="text-gray-900 font-medium">
                                  45%
                                </p>
                              </div>
                            </div>
                            
                            {/* Clouds */}
                            <div className="flex items-center space-x-2">
                              <Cloud className="text-gray-400 w-8 h-8" />
                              <div>
                                <p className="text-gray-500 text-lg">
                                  Nubes
                                </p>
                                <p className="text-gray-900 font-medium">
                                  10%
                                </p>
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
                              data={tempsDay}
                              // data={dataChart}
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


                        <div style={{ width: '100%', height: 400, display: 'none' }}>
                          <ResponsiveContainer>
                            <LineChart
                              data={tempsDay}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="tempMax" name="Máxima" stroke="#ff7300" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="tempMin" name="Mínima" stroke="#387908" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>


                        <div style={{ width: '100%', height: 400, display: 'none' }}>
                          <ResponsiveContainer>
                            <LineChart
                              data={tempsDay}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="tempMax" name="Máxima" stroke="#ff7300" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="tempWin" name="Mínima" stroke="#387908" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                      </div>
                    </>
                  )}

                </div>



                <div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <h3 className="text-gray-900 font-medium mb-3 flex items-center">
                      <Heart className="text-red-500 mr-2" size={18} />
                      Ciudades Favoritas
                    </h3>

                    {favorites.length === 0 ? (
                      onMessageNoFavoriteCities()
                    ) : (
                      <ul className="space-y-2">
                        {favorites.map((city) => (
                          <li
                            key={city.id}
                            className={`flex items-center justify-between p-2 rounded-md ${
                              selectedCity === city.id ? "bg-blue-50" : "hover:bg-sky-50"
                            }`}
                          >
                            <button 
                              className="text-gray-900 text-left flex-grow hover:text-blue-600"
                              onClick={() => handleSelect(city)}
                            >
                              {city.name}
                            </button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setIsLoader(true);
                                onDeleyeCity(city.id)
                              }}
                              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-transparent"
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">
                                Eliminar
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button 
                      className="w-full mt-3 bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-400 hover:to-blue-500 text-white"
                      disabled={Array.isArray(dataAddCity) && dataAddCity.length === 0 
                        ? true 
                        : false
                      }
                      onClick={() => {
                        setIsLoader(true);
                        const dataSend = dataAddCity
                        console.log('data para crear lista --> ',dataSend)
                        onAddCity(dataSend.id, dataSend.capital);
                      }}
                    >
                      <Heart className="mr-2" size={16} />
                      Añadir ciudad actual
                    </Button>
                  </div>
                </div>
              </div>
        </div>
      )}
    </>
  )
}

export default WeatherDashboard
