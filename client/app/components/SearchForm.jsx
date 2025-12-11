"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GET_NATIONALITY } from "../graphql/queries";
import { useLazyQuery } from "@apollo/client/react";
import {
  Search,
  Clock,
  X,
  Loader2,
  Sparkles,
  Calendar,
  Briefcase,
  Globe,
} from "lucide-react";

export default function SearchForm() {
  const [name, setName] = useState("");
  const [loadNationality, { data, loading, error }] =
    useLazyQuery(GET_NATIONALITY);

  //
  console.log("🔍 Query state:", { data, loading, error });
  console.log("📦 Person data:", data?.getNationality);

  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularCelebrities = [
    "Rema",
    "Wizkid",
    "Tems",
    "Burna Boy",
    "Davido",
    "Ayra Starr",
    "Beyoncé",
    "Drake",
    "Taylor Swift",
    "Ed Sheeran",
    "Rihanna",
    "The Weeknd",
    "Cristiano Ronaldo",
    "Lionel Messi",
    "Shakira",
    "Eminem",
  ];

  //  object
  const countryNames = {
    NG: "Nigerian",
    ZA: "South African",
    EG: "Egyptian",
    KE: "Kenyan",
    GH: "Ghanaian",
    US: "American",
    CA: "Canadian",
    BR: "Brazilian",
    MX: "Mexican",
    AR: "Argentinian",
    CO: "Colombian",
    BB: "Barbadian",
    JM: "Jamaican",
    PR: "Puerto Rican",
    GB: "British",
    FR: "French",
    DE: "German",
    IT: "Italian",
    ES: "Spanish",
    PT: "Portuguese",
    NO: "Norwegian",
    SE: "Swedish",
    DK: "Danish",
    FI: "Finnish",
    IE: "Irish",
    NL: "Dutch",
    BE: "Belgian",
    CH: "Swiss",
    AT: "Austrian",
    PL: "Polish",
    RU: "Russian",
    IN: "Indian",
    CN: "Chinese",
    JP: "Japanese",
    KR: "South Korean",
    PK: "Pakistani",
    PH: "Filipino",
    TH: "Thai",
    VN: "Vietnamese",
    ID: "Indonesian",
    AU: "Australian",
    NZ: "New Zealander",
  };

  // Load history
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  // Save to history
  useEffect(() => {
    if (data?.getNationality) {
      const newEntry = data.getNationality;
      const updated = [
        newEntry,
        ...searchHistory.filter(
          (h) => h.name.toLowerCase() !== newEntry.name.toLowerCase()
        ),
      ].slice(0, 8);
      setSearchHistory(updated);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
    }
  }, [data]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setShowSuggestions(false);
    loadNationality({ variables: { name } });
  };

  const selectPerson = (personName) => {
    setName(personName);
    setShowSuggestions(false);
    loadNationality({ variables: { name: personName } });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const person = data?.getNationality;

  return (
    <div className="min-h-screen bg-radial-[at_95%_3555%] from-sky-200 via-[#000] to-indigo-900 to-90% p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 mt-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Who Are They?
          </h1>
          <p className="text-xl text-purple-200">
            Discover celebrities from around the world
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <form onSubmit={submit}>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-300" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => name && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a celebrity..."
                className="w-full pl-16 pr-6 py-5 text-xl bg-white/20 border border-white/30 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300"
              />

              <AnimatePresence>
                {showSuggestions && name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200 overflow-hidden z-50"
                  >
                    {popularCelebrities
                      .filter((c) =>
                        c.toLowerCase().includes(name.toLowerCase())
                      )
                      .slice(0, 6)
                      .map((suggestion, i) => (
                        <motion.button
                          key={suggestion}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => selectPerson(suggestion)}
                          className="w-full px-6 py-4 text-left hover:bg-purple-100 transition-colors flex items-center gap-4"
                        >
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <span className="text-gray-800 font-medium">
                            {suggestion}
                          </span>
                        </motion.button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !name.trim()}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Searching the stars...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Discover Celebrity
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {person && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mt-12"
            >
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 p-1">
                  <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      {/* Photo */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="relative"
                      >
                        <div className="w-48 h-48 rounded-3xl overflow-hidden ring-8 ring-purple-500/50 shadow-2xl">
                          {person.photo ? (
                            <img
                              src={person.photo}
                              alt={person.fullName || person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl font-bold text-white">
                              {person.name[0]}
                            </div>
                          )}
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl -z-10 blur-xl"
                        />
                      </motion.div>

                      {/* Info */}
                      <div className="flex-1 text-left space-y-6">
                        <div>
                          <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl font-bold text-white mb-2"
                          >
                            {person.fullName || person.name}
                          </motion.h2>
                          <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-3"
                          >
                            <Globe className="w-8 h-8 text-purple-400" />
                            <span className="text-3xl font-bold text-purple-300">
                              {countryNames[person.nationality] ||
                                person.nationality}
                            </span>
                          </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {person.age && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                              className="flex items-center gap-3 text-purple-200"
                            >
                              <Calendar className="w-6 h-6" />
                              <span className="text-xl">
                                {person.age} years old
                              </span>
                            </motion.div>
                          )}
                          {person.occupation?.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.8 }}
                              className="flex items-center gap-3 text-purple-200"
                            >
                              <Briefcase className="w-6 h-6" />
                              <span className="text-xl">
                                {person.occupation.join(" • ")}
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {person.bio && (
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="text-lg text-purple-100 leading-relaxed max-w-2xl"
                          >
                            {person.bio}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Clock className="w-7 h-7" />
                Recent Searches
              </h3>
              <button
                onClick={clearHistory}
                className="text-purple-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {searchHistory.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectPerson(item.name)}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-purple-500/50">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold text-white">
                        {item.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-white font-semibold truncate">
                    {item.name}
                  </p>
                  <p className="text-purple-300 text-sm">
                    {countryNames[item.nationality] || item.nationality}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
