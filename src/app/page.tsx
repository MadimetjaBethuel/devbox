import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { RepoComponent } from "~/app/_components/repos";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // Prefetch the repos data on the server
  void api.post.repos.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#080708] to-[#040408] text-white">
        {/* Header */}
        <div className="flex justify-center gap-12 px-4 py-16">
          <h1 className="items-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Dev<span className="text-[hsl(280,100%,70%)]">box</span>
          </h1>
        </div>

        {/* Profile Section */}
        <div className="flex justify-between items-center mx-32 mb-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">JD</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-gray-400">Full Stack Developer</p>
              <p className="text-sm text-gray-500">
                Building amazing things with code
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Edit Profile
            </button>
            <button className="px-6 py-2 border border-gray-600 hover:bg-gray-800 rounded-lg transition-colors">
              Settings
            </button>
          </div>
        </div>

        {/* Repository Section */}
        <div className="flex justify-center px-4">
          <div className="w-full max-w-6xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">My Repositories</h2>
              <p className="text-gray-400">
                A collection of my projects and contributions
              </p>
            </div>
            <RepoComponent />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
