"use client"

import React, { useState, useEffect } from 'react';
import { Beer, MapPin, Phone, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch("https://api.openbrewerydb.org/v1/breweries");

        if (!response.ok) {
          throw new Error(`HTTP ERROR: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="w-screen flex flex-col overflow-hidden items-center gap-4">
      { data && data.map(brewery => (
        <Card key={brewery.id} className="w-1/2">
          <CardHeader>{brewery.name}</CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2 text-sm">
            { brewery.street && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4"/>
                {brewery.street}
              </div>
            )}
            { brewery.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4"/>
                {brewery.phone}
              </div>
            )}
            { brewery.website_url && (
              <div className="flex items-center gap-1">
                <ExternalLink className="w-4 h-4"/>
                {brewery.website_url}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default App;