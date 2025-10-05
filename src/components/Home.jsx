import React, { useState, useEffect, useMemo } from "react";

import Navbar from "./Navbar";
import Temp from "../Temp";
import Meme from "../Meme";
import Footer from "./Footer";
import "../style.css";
import "../index.css";
import memesMeta from "../meme_meta"; // new metadata file

const Home = () => {
  const [temp, setTemp] = useState([]);
  const [meme, setMeme] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Number of memes to display per page

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        // Merge metadata (description / keywords) into each meme object
        const memesWithMeta = data.data.memes.map((m) => {
          const metaByName = memesMeta[m.name] || {};
          // some maintainers may prefer mapping by id, extend meme_meta if needed
          return {
            ...m,
            description: metaByName.description || "",
            keywords: metaByName.keywords || []
          };
        });
        setTemp(memesWithMeta);
      })
      .catch((err) => {
        console.error("Failed to fetch memes:", err);
      });
  }, []);

  // Smart tokenized search (no external lib)
  const searchMemes = (memes, query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return memes;

    const tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return memes;

    const scored = memes.map((m) => {
      const haystack = (
        (m.name || "") +
        " " +
        (m.description || "") +
        " " +
        ((m.keywords || []).join(" ") || "")
      ).toLowerCase();

      let matchCount = 0;
      tokens.forEach((token) => {
        if (haystack.includes(token)) {
          matchCount += 1;
        } else {
          // small partial matching fallback for tokens longer than 3
          if (token.length > 3) {
            // check prefix/suffix partials
            const partials = [
              token.slice(0, Math.max(3, token.length - 1)),
              token.slice(0, Math.max(3, Math.floor(token.length * 0.6)))
            ];
            if (partials.some(p => haystack.includes(p))) matchCount += 1;
          }
        }
      });

      // small boost if the whole query appears in the name
      const nameBoost = (m.name || "").toLowerCase().includes(q) ? 1 : 0;
      const score = matchCount + nameBoost;

      return { meme: m, score };
    });

    // keep only those with score > 0, sort by score descending
    const filtered = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.meme);

    // Fallback: if no matches, return memes that include query in name (classic behavior)
    if (filtered.length === 0) {
      return memes.filter((m) => (m.name || "").toLowerCase().includes(q));
    }
    return filtered;
  };

  const filteredMemes = useMemo(() => {
    if (!searchQuery.trim()) return temp;
    return searchMemes(temp, searchQuery);
  }, [temp, searchQuery]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemes = filteredMemes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredMemes.length / itemsPerPage)) setCurrentPage(currentPage + 1);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredMemes.length / itemsPerPage);
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  // Reset page to 1 when query changes so user sees top results
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="App min-h-screen flex flex-col">
      <Navbar
        setMeme={setMeme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-grow">
        {meme === null ? (
          <>
            <Temp temp={currentMemes} setMeme={setMeme} />
            <div className="pagination flex items-center justify-center mb-20 gap-1 px-4">
              <button
                className="bg-gray-800 text-gray-300 px-4 py-2 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {renderPagination().map((page, index) => (
                <React.Fragment key={`page-${index}-${page}`}>
                  {page === '...' ? (
                    <span className="text-gray-400 px-3 py-2 text-sm">...</span>
                  ) : (
                    <button
                      className={`px-4 py-2 min-w-[44px] border rounded-lg cursor-pointer transition-all duration-300 font-bold text-sm ${
                        currentPage === page
                          ? 'active bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-blue-400 shadow-lg shadow-blue-500/60 transform scale-110'
                          : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500 hover:scale-105'
                      }`}
                      onClick={() => paginate(page)}
                      style={currentPage === page ? {
                        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.6), 0 0 0 2px rgba(59, 130, 246, 0.4)',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)'
                      } : {}}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              <button
                className="bg-gray-800 text-gray-300 px-4 py-2 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={nextPage}
                disabled={currentPage === Math.ceil(filteredMemes.length / itemsPerPage)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <Meme meme={meme} setMeme={setMeme} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
