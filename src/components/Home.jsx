import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Temp from "../Temp";
import Meme from "../Meme";
import Footer from "./Footer";
import "../style.css";
import "../index.css";
import memesMeta from "../meme_meta"; // Metadata file with description/keywords

const Home = () => {
  const [temp, setTemp] = useState([]);
  const [meme, setMeme] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Fetch memes and merge metadata
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => {
        const memesWithMeta = data.data.memes.map((m) => {
          const meta = memesMeta[m.name] || {};
          return {
            ...m,
            description: meta.description || "",
            keywords: meta.keywords || [],
          };
        });
        setTemp(memesWithMeta);
      })
      .catch((err) => console.error("Failed to fetch memes:", err));
  }, []);

  // Better search: split words and match against name/description/keywords
  const searchMemes = (memes, query) => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return memes;

    const tokens = q.split(/\s+/).filter(Boolean);

    return memes
      .map((m) => {
        const haystack = [
          m.name || "",
          m.description || "",
          ...(m.keywords || []),
        ]
          .join(" ")
          .toLowerCase();

        const score = tokens.reduce((acc, token) => {
          if (haystack.includes(token)) return acc + 1;
          return acc;
        }, 0);

        return { meme: m, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.meme);
  };

  const filteredMemes = useMemo(() => searchMemes(temp, searchQuery), [temp, searchQuery]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMemes = filteredMemes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () =>
    currentPage < Math.ceil(filteredMemes.length / itemsPerPage) &&
    setCurrentPage(currentPage + 1);

  useEffect(() => {
    setCurrentPage(1); // reset to first page on search
  }, [searchQuery]);

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredMemes.length / itemsPerPage);
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="App min-h-screen flex flex-col">
      <Navbar setMeme={setMeme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="flex-grow">
        {meme === null ? (
          <>
            <Temp temp={currentMemes} setMeme={setMeme} />
            <div className="pagination flex items-center justify-center mb-20 gap-1 px-4">
              <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
                Previous
              </button>

              {renderPagination().map((page, idx) =>
                page === "..." ? (
                  <span key={`page-${idx}`} className="text-gray-400 px-3 py-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${idx}`}
                    onClick={() => paginate(page)}
                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(filteredMemes.length / itemsPerPage)}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <Meme meme={meme} setMeme={setMeme} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
