import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { RepoComponent } from "~/app/_components/repos";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  // console.log(hello.greeting);
  const repos = api.post.repos.useQuery();
  

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
 
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#080708] to-[#040408] text-white">
        <div className="flex justify-center gap-12 px-4 py-16 ">
          <h1 className=" items-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Dev<span className="text-[hsl(280,100%,70%)]">box</span>
          </h1>
        </div>

          <div className="flex justify-between items-center mx-32">
            <div className="">
            <h1 className="">My name is : </h1>
            <p className="">John Doe</p>
            </div>
            <div className="items-center justify-between pl-2">
             <p className="items-center">Profile</p>
              
            </div>
        </div>

        <div className="flex justify-center
        ">
          <RepoComponent respos_list={repos.data} />

        </div>

        
      </main>
    </HydrateClient>
  );
}
