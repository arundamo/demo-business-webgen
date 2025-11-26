import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import SearchForm from '@/components/SearchForm';
import BusinessList from '@/components/BusinessList';
import WebsitePreview from '@/components/WebsitePreview';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingFor, setGeneratingFor] = useState(null);
  const [error, setError] = useState(null);
  const [searchMessage, setSearchMessage] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setBusinesses([]);
    setSearchMessage(null);
    setDataSource(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setBusinesses(data.businesses || []);
      setSearchMessage(data.message);
      setDataSource(data.source);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWebsite = async (business) => {
    setGeneratingFor(business.id);
    setError(null);

    try {
      const response = await fetch('/api/gen-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business: {
            name: business.name,
            address: business.address,
            phone: business.phone,
            type: business.types?.[0] || 'Local Business',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Website generation failed');
      }

      setGeneratedWebsite({
        html: data.html,
        businessName: business.name,
        source: data.source,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleClosePreview = () => {
    setGeneratedWebsite(null);
  };

  return (
    <>
      <Head>
        <title>Business Website Generator</title>
        <meta name="description" content="Search for local businesses and generate demo websites for those without one" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>🏢 Business Website Generator</h1>
            <p className={styles.subtitle}>
              Search for local businesses and generate demo websites for those without one
            </p>
          </header>

          <SearchForm onSearch={handleSearch} loading={loading} />

          {loading && (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Searching for businesses...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {searchMessage && !loading && (
            <div className={styles.infoMessage}>
              ℹ️ {searchMessage}
            </div>
          )}

          {!loading && businesses.length > 0 && (
            <BusinessList
              businesses={businesses}
              onGenerateWebsite={handleGenerateWebsite}
              generatingFor={generatingFor}
              source={dataSource}
            />
          )}

          {!loading && !error && businesses.length === 0 && dataSource && (
            <div className={styles.message}>
              No businesses found. Try a different search query.
            </div>
          )}

          {generatedWebsite && (
            <WebsitePreview
              html={generatedWebsite.html}
              businessName={generatedWebsite.businessName}
              source={generatedWebsite.source}
              onClose={handleClosePreview}
            />
          )}
        </main>
      </div>
    </>
  );
}
