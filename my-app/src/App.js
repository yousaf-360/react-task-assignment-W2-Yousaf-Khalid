import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Card from './Card.js';
import SearchBar from "./SearchBar.js";
import Pagination from './Pagination.js';

export default function App() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentUrl, setCurrentUrl] = useState('https://swapi.dev/api/people');
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);

  const fetchData = async (url) => {
    try {
      const fetchedData = await fetch(url);
      const jsonData = await fetchedData.json();
      const jsonDataCharacters = jsonData.results;
      const finalDataJson = await Promise.all(
        jsonDataCharacters.map(async (character) => {
          const randomImageNumber = Math.floor(Math.random() * 100) + 1;
          return {
            ...character,
            image: `https://picsum.photos/200/300?random=${randomImageNumber}`
          };
        })
      );

      setData(finalDataJson);
      setNextUrl(jsonData.next);
      setPrevUrl(jsonData.previous);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data.filter((character) =>
    character.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNextPage = () => {
    if (nextUrl) {
      setCurrentUrl(nextUrl);
    }
  };

  const handlePrevPage = () => {
    if (prevUrl) {
      setCurrentUrl(prevUrl);
    }
  };

  return (
    <div className="App">
      <SearchBar searchText={searchText} onSearchChange={handleSearchChange} />
      <h1>Star Wars Characters</h1>
      <ul className="container-main">
        {filteredData.map((character) => (
          <li key={character.name} className='card'>
            <Card data={character} />
          </li>
        ))}
      </ul>
      <Pagination onNext={handleNextPage} 
        onPrev={handlePrevPage} 
        nextUrl={nextUrl} 
        prevUrl={prevUrl} />
      </div>
   
  );
}