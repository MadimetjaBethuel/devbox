"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string | null;
  updated_at: string | null;
  private: boolean;
  license: {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string | null;
    node_id: string;
    html_url?: string;
  } | null;
  // Add other fields that might be in the GitHub API response
  [key: string]: string | number | boolean | null | object | undefined;
}

export function RepoComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "updated" | "stars">("updated");
  
  const { data: repos, isLoading, error } = api.post.repos.useQuery();
  console.log(repos);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading repositories: {error.message}</p>
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No repositories found.</p>
      </div>
    );
  }

  // Filter and sort repositories
  const filteredRepos = repos
    .filter((repo: Repository) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
      (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
    .sort((a: Repository, b: Repository) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "updated":
        default:
          const aDate = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bDate = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return bDate - aDate;
      }
    });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      React: "#61dafb",
      HTML: "#e34c26",
      CSS: "#1572B6",
      Go: "#00ADD8",
      Rust: "#dea584",
      PHP: "#4F5D95",
      Swift: "#fa7343",
      Kotlin: "#A97BFF",
      Dart: "#00B4AB",
    };
    return colors[language ?? ""] ?? "#8b949e";
  };

  return (
    <div className="w-full">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "updated" | "stars")}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        >
          <option value="updated">Last updated</option>
          <option value="name">Name</option>
          <option value="stars">Stars</option>
        </select>
      </div>

      {/* Repository Count */}
      <div className="mb-6">
        <p className="text-gray-400">
          {filteredRepos.length} {filteredRepos.length === 1 ? "repository" : "repositories"}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Repository Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map((repo: Repository) => (
          <div
            key={repo.id}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 hover:border-gray-600 transition-all duration-200 group"
          >
            {/* Repository Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {repo.name}
                  </a>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {repo.private && (
                    <span className="px-2 py-1 text-xs bg-yellow-600 text-yellow-100 rounded">
                      Private
                    </span>
                  )}
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      ></div>
                      <span className="text-sm text-gray-400">{repo.language}</span>
                    </div>
                  )}
                  {repo.license && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded">
                      {repo.license.spdx_id ?? repo.license.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {repo.description ?? "No description available"}
            </p>

            {/* Repository Stats */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{repo.forks_count}</span>
                </div>
              </div>
              <span className="text-xs">Updated {formatDate(repo.updated_at)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
              >
                View Code
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(repo.html_url + ".git").catch((err) => {
                    console.error("Failed to copy clone URL: ", err);
                  });
                }}
                className="px-3 py-2 border border-gray-600 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
                title="Copy clone URL"
              >
                Clone
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-400">No repositories match your search.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
