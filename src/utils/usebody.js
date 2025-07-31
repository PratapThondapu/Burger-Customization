import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { listBurgers } from "../actions/burgerActions";
import { useNavigate } from "react-router-dom";
import {getingredients} from "../actions/ingredientsAction"
const useBody = () => {
    const [allResults, setAllResults] = useState([]);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const navigate=useNavigate()
    // Accessing state outside of the async function
    const burgerList = useSelector(state => state.burgerList);
    const { loading, error, burgers } = burgerList;
  
    useEffect(() => {
        dispatch(listBurgers(navigate));
    }, [dispatch]);
    
    useEffect(() => {
        dispatch(getingredients())
    }, [dispatch]);
    useEffect(() => {
        if (!loading && !error && burgers) {
            setAllResults(burgers);
            setResults(burgers);
        }
    }, [loading, error, burgers]);

    return { allResults, setAllResults, results, setResults, loading, error };
}

export default useBody;
