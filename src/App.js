import React, { useState, useEffect } from 'react';
import Detail from './components/Detail';
import Search from './components/Search';
import './App.css';
import axios from "axios";  

function App() {
    const [state, setState] = useState({
        s: "sherlock",
        results: [],
        selected: {},
    });

    const APIKEY = "96b8b0b5196138cd5da4632537ccebd3";
    const apiurl = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}`;

    // Fetch default movie data when the component mounts
    useEffect(() => {
        const fetchDefaultMovie = async () => {
            try {
                const response = await axios.get(apiurl + "&query=" + state.s);
                const results = response.data.results;
                setState((prevState) => ({
                    ...prevState,
                    results: results,
                }));
            } catch (error) {
                console.error("Error fetching default movie:", error);
            }
        };

        fetchDefaultMovie();
    }, []); // Empty dependency array to run once on mount

    const searchInput = (e) => {
        let s = e.target.value;
        setState((prevState) => {
            return { ...prevState, s: s };
        });
    };

    const search = (e) => {
        if (e.key === "Enter") {
            axios.get(apiurl + "&query=" + state.s).then(({ data }) => {
                let results = data.results;

                console.log(results);

                setState((prevState) => {
                    return {
                        ...prevState,
                        results: results,
                    };
                });
            }).catch(error => {
                console.error("Error fetching movies:", error);
            });
        }
    };

    const openDetail = (id) => {
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}`).then(({ data }) => {
            let result = data;

            setState((prevState) => {
                return { ...prevState, selected: result };
            });
        });
    };

    const closeDetail = () => {
        setState((prevState) => {
            return { ...prevState, selected: {} };
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Movie Mania</h1>
            </header>
            <main>
                <Search searchInput={searchInput} search={search} />

                <div className="container">
                    {state.results.length > 0 ? (
                        state.results.map((e) => (
                            <div className="item" onClick={() => openDetail(e.id)} key={e.id}>
                                <img style={{ width: "200px" }} src={`https://image.tmdb.org/t/p/w500${e.poster_path}`} alt={e.title} />
                                <h3 style={{ color: "white" }}>{e.title}</h3>
                            </div>
                        ))
                    ) : (
                        <h3 style={{ color: "white" }}>No results found. Try searching for a movie!</h3>
                    )}
                </div>

                {typeof state.selected.title !== "undefined" ? (
                    <div>
                        <Detail selected={state.selected} closeDetail={closeDetail} />
                    </div>
                ) : false}
            </main>
        </div>
    );
}

export default App;