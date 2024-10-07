
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  // Ajout du state "last"
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());      
    } catch (err) {
      setError(err);
    }
  }, []);

// Ajout de la fonction getLastData pour récupèrer la DERNIERE data
  const getLastData = useCallback(async () => {
    try {
      const datas = await api.loadData();
      setLast(datas.events[datas.events.length - 1]);
    } catch (err) {
      setError(err);
    }
  },[]);

  useEffect(() => {
    if (data) return;
    getData();
    // Faire appel à la fonction getLastData
    getLastData();
  }, );
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        // Exporter last pour pouvoir l'utiliser sur la page d'accueil
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;