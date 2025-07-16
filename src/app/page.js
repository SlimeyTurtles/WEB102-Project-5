"use client"

import React, { useState, useEffect } from 'react';
import { Beer, MapPin, Phone, ExternalLink, Search, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breweriesWithPhone, setBreweriesWithPhone] = useState(0);
  const [breweriesWithEmail, setBreweriesWithEmail] = useState(0);
  const [search, setSearch] = useState("");

  const fetchData = async (searchTerm = "") => {
    try {
      setLoading(true);
      const baseUrl = searchTerm
        ? `https://api.openbrewerydb.org/v1/breweries/search?query=${encodeURIComponent(searchTerm)}&per_page=10`
        : `https://api.openbrewerydb.org/v1/breweries?per_page=10`;
      const response = await fetch(baseUrl);
      if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
      const jsonData = await response.json();
      setData(jsonData);
      setBreweriesWithPhone(jsonData.filter(b => b.phone).length);
      setBreweriesWithEmail(jsonData.filter(b => b.website_url).length);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4">
      <header className="w-full max-w-4xl mx-auto text-center py-8">
        <h1 className="text-4xl font-bold text-blue-700">Brewery Finder</h1>
        <p className="text-gray-600 text-lg mt-2">
          Find breweries by name, city, or keyword.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-6 mb-4">
        <Card className="w-40 h-32 flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="flex flex-col justify-center items-center text-center p-4 gap-1">
            <span className="text-sm font-medium text-gray-500">Total</span>
            <div className="flex flex-row items-center justify-center gap-1">
              <Beer className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">{data.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-40 h-32 flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="flex flex-col justify-center items-center text-center p-4 gap-1">
            <span className="text-sm font-medium text-gray-500">Callable</span>
            <div className="flex flex-row items-center justify-center gap-1">
              <Phone className="h-6 w-6 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">{breweriesWithPhone}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="w-40 h-32 flex flex-col justify-center items-center shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="flex flex-col justify-center items-center text-center p-4 gap-1">
            <span className="text-sm font-medium text-gray-500">Emailable</span>
            <div className="flex flex-row items-center justify-center gap-1">
              <Mail className="h-6 w-6 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">{breweriesWithEmail}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search breweries..."
          className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1 transition-colors"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>

      <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto pb-10">
        {data.map(brewery => (
          <motion.div
            key={brewery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            <Card className="w-full max-w-md bg-white hover:shadow-lg transition-shadow duration-300 p-4">
              <CardContent className="flex flex-col gap-2">
                <p className="text-lg font-semibold text-blue-800">{brewery.name}</p>

                {brewery.street && (
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <MapPin className="w-4 h-4" />
                    {brewery.street}
                  </div>
                )}

                {brewery.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Phone className="w-4 h-4" />
                    {brewery.phone}
                  </div>
                )}

                {brewery.website_url && (
                  <div className="flex items-center gap-1 text-sm">
                    <ExternalLink className="w-4 h-4 text-gray-700" />
                    <a
                      href={brewery.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {brewery.website_url}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;
