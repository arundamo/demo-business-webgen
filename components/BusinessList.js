import styles from '@/styles/Home.module.css';

/**
 * BusinessList Component
 * Displays list of businesses with their details
 */
export default function BusinessList({ businesses, onGenerateWebsite, generatingFor, source }) {
  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <div className={styles.businessList}>
      <div className={styles.resultsHeader}>
        <h2>Search Results</h2>
        {source && (
          <span className={styles.sourceTag}>
            Data source: {source}
          </span>
        )}
      </div>
      
      <div className={styles.businessGrid}>
        {businesses.map((business) => (
          <div key={business.id} className={styles.businessCard}>
            <div className={styles.businessHeader}>
              <h3>{business.name}</h3>
              {business.rating && (
                <span className={styles.rating}>
                  ⭐ {business.rating}
                </span>
              )}
            </div>
            
            <div className={styles.businessDetails}>
              <p className={styles.address}>
                <span className={styles.icon}>📍</span>
                {business.address}
              </p>
              
              {business.phone && (
                <p className={styles.phone}>
                  <span className={styles.icon}>📞</span>
                  {business.phone}
                </p>
              )}
              
              <p className={styles.website}>
                <span className={styles.icon}>🌐</span>
                {business.website ? (
                  <a 
                    href={business.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {business.website}
                  </a>
                ) : (
                  <span className={styles.noWebsite}>No website</span>
                )}
              </p>
            </div>
            
            {!business.website && (
              <button
                onClick={() => onGenerateWebsite(business)}
                disabled={generatingFor === business.id}
                className={styles.generateButton}
              >
                {generatingFor === business.id 
                  ? 'Generating...' 
                  : '✨ Generate Demo Website'
                }
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
