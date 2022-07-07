import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [paginate, setPaginate] = useState(8);

  useEffect(() => {
    const headers = new Headers();
    const api_key = process.env.REACT_APP_API_KEY;
    headers.append('Authorization', `Bearer ${api_key}`);
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'GET',
      headers,
    };

    fetch('https://countryapi.io/api/all', options)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.message) {
            setError(result.message);
            return;
          }
          setItems(Object.values(result));
        },
        (error) => setError(error)
      )
      .finally(() => setLoaded(true));
  }, []);

  const search_parameters = Object.keys(Object.assign({}, ...items));

  const filter_items = [...new Set(items.map((item) => item.region))];

  const search = (items) =>
    items.filter(
      (item) =>
        item.region.includes(filter) &&
        search_parameters.some((parameter) =>
          item[parameter].toString().toLowerCase().includes(query)
        )
    );

  const load_more = (e) => setPaginate((prev) => prev + 8);

  if (error) return <h1 className="heading">{error}</h1>;
  else if (!loaded) return <h1 className="heading">Loading...</h1>;

  return (
    <div className="wrapper">
      <div className="search-wrapper">
        <label htmlFor="search-form">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Search for..."
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="sr-only">Search countries here</span>
        </label>
        <div className="select">
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="custom-select"
            aria-label="Filter Countries By Region"
          >
            <option value="">Filter By Region</option>
            {filter_items.map((item) => (
              <option value={item}>Filter By {item}</option>
            ))}
          </select>
          <span className="focus"></span>
        </div>
      </div>

      <ul className="card-grid">
        {search(items)
          .slice(0, paginate)
          .map((item) => (
            <li key={item.alpha3Code}>
              <article className="card">
                <div className="card-image">
                  <img src={item.flag.large} alt={item.name} />
                </div>
                <div className="card-content">
                  <h2 className="card-name">{item.name}</h2>
                  <ol className="card-list">
                    <li>
                      population: <span>{item.population}</span>
                    </li>
                    <li>
                      Region: <span>{item.region}</span>
                    </li>
                    <li>
                      Capital: <span>{item.capital}</span>
                    </li>
                  </ol>
                </div>
              </article>
            </li>
          ))}
      </ul>
      <button onClick={load_more}>Load more...</button>
    </div>
  );
};

export default App;
