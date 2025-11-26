import { useState } from 'react';
import styles from '@/styles/Home.module.css';

/**
 * SearchForm Component
 * Handles business search input and submission
 */
export default function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., plumber in Waterloo, Ontario"
          className={styles.searchInput}
          disabled={loading}
        />
        <button 
          type="submit" 
          className={styles.searchButton}
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <p className={styles.searchHint}>
        Search for businesses by type and location
      </p>
    </form>
  );
}
