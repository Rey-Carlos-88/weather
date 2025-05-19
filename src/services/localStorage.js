export const listCity = () => {
    try {
        console.log('entro a leer la lista')
        const cities = localStorage.getItem('city');
        return cities ? JSON.parse(cities) : [];

    } catch (error) {
        console.log('error al obtener la lista de ciudades');
        throw error;
    }
};


export const saveCity = (idCity, nameArg) => {
    try {
        const cities = listCity();

        if(!cities.some(city => city.id === idCity)) {
            cities.push({id: idCity, name: nameArg })
            localStorage.setItem('city', JSON.stringify(cities))
            console.log('se agreo la cuidad LocalStorage--> ',nameArg)
            return true
        }
    console.log('la ciuad ya existe en la lista de ciudades Favoritas localStorage')
    return false

    } catch (error) {
        console.log('error a guardar la ciudad localStorage')
        throw error;
    }
};

export const deleteCity = (idCity) => {
    try {
      const cities = listCity().filter(city => city.id !== idCity);
        localStorage.setItem('city', JSON.stringify(cities));
        return true;

    } catch (error) {
        console.log('error al borrar ciudad de lista favoritos')
        throw error;
    }
}


