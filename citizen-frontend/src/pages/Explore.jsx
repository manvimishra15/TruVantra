import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import WorkerCard from '../components/WorkerCard';
import { workers, categories } from '../data/mockData';
import './Explore.css';

export default function Explore() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || '');
  const [maxDistance, setMaxDistance] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q) setQuery(q);
    if (cat) {
      const matched = categories.find((c) => c.id === cat);
      if (matched) setSelectedCat(matched.label);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    return workers.filter((w) => {
      const nameMatch = w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.service.toLowerCase().includes(query.toLowerCase());
      const catMatch = !selectedCat || w.category.toLowerCase() === selectedCat.toLowerCase() ||
        w.service.toLowerCase().includes(selectedCat.toLowerCase());
      const distMatch = w.distance <= maxDistance;
      const ratingMatch = w.rating >= minRating;
      const priceMatch = w.price <= maxPrice;
      const availMatch = !availableOnly || w.available;
      return nameMatch && catMatch && distMatch && ratingMatch && priceMatch && availMatch;
    });
  }, [query, selectedCat, maxDistance, minRating, maxPrice, availableOnly]);

  return (
    <div className="page explore-page">
      <div className="explore-inner container">
        {/* Header */}
        <div className="explore-header">
          <h1 className="section-title">Explore workers</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Independent professionals near your demo location.
          </p>
        </div>

        <div className="explore-layout">
          {/* Filter Sidebar */}
          <aside className="filter-sidebar">
            {/* Text Search */}
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Name or service"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                id="explore-search"
                aria-label="Search by name or service"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <select
                className="form-select"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                id="explore-category"
                aria-label="Filter by category"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Distance */}
            <div className="filter-slider-group">
              <div className="filter-slider-label">
                <span>Within {maxDistance} km</span>
              </div>
              <input
                type="range"
                className="range-slider"
                min={1}
                max={20}
                value={maxDistance}
                style={{ '--val': `${((maxDistance - 1) / 19) * 100}%` }}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                aria-label="Maximum distance"
              />
            </div>

            {/* Rating */}
            <div className="filter-slider-group">
              <div className="filter-slider-label">
                <span>Rating {minRating > 0 ? `${minRating}+` : '0+'}</span>
              </div>
              <input
                type="range"
                className="range-slider"
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                style={{ '--val': `${(minRating / 5) * 100}%` }}
                onChange={(e) => setMinRating(Number(e.target.value))}
                aria-label="Minimum rating"
              />
            </div>

            {/* Price */}
            <div className="filter-slider-group">
              <div className="filter-slider-label">
                <span>Up to ₹{maxPrice}</span>
              </div>
              <input
                type="range"
                className="range-slider"
                min={100}
                max={2000}
                step={50}
                value={maxPrice}
                style={{ '--val': `${((maxPrice - 100) / 1900) * 100}%` }}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price"
              />
            </div>

            {/* Available Now */}
            <label className="custom-checkbox" htmlFor="available-only">
              <input
                type="checkbox"
                id="available-only"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available now
            </label>

            {/* Reset */}
            <button
              className="filter-reset-btn"
              onClick={() => {
                setQuery('');
                setSelectedCat('');
                setMaxDistance(10);
                setMinRating(0);
                setMaxPrice(1000);
                setAvailableOnly(false);
              }}
            >
              Reset filters
            </button>
          </aside>

          {/* Worker Grid */}
          <div className="explore-grid">
            {filtered.length === 0 ? (
              <div className="explore-empty">
                <span style={{ fontSize: 40 }}>🔍</span>
                <h3>No workers found</h3>
                <p>Try adjusting your filters or search query.</p>
              </div>
            ) : (
              filtered.map((w) => (
                <WorkerCard key={w.id} worker={w} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
