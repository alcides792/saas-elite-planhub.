import React from 'react';
import Link from 'next/link';
import { Zap, Calendar, User, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/utils/supabase/server";

export const metadata = {
  title: "Blog | Kovr Subscription Manager",
  description: "Read the latest news, tips, and financial advice from the Kovr team.",
};

export default async function BlogPage() {
  const posts = getBlogPosts();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1a1a1a] dark:text-white transition-colors duration-500">
      <NavBarDemo user={user} />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-20 text-center">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
            Kovr <span className="text-[#faed27] bg-[#1a1a1a] px-4">Insights</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto opacity-80">
            Master your subscriptions, save money, and stay informed with our latest articles.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="group bg-white dark:bg-zinc-900 border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_#faed27] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_#1a1a1a] dark:hover:shadow-[12px_12px_0px_#faed27]"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-64 overflow-hidden border-b-4 border-[#1a1a1a]">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-[#1fe2c3] border-2 border-[#1a1a1a] px-3 py-1 font-black text-sm text-[#1a1a1a] uppercase">
                    New Article
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm font-bold opacity-60 mb-4 uppercase">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                  </div>
                  
                  <h2 className="text-2xl font-black mb-4 uppercase leading-none group-hover:text-[#1fe2c3] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-lg font-bold opacity-80 mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 font-black text-xl uppercase border-b-4 border-[#faed27] group-hover:border-[#1fe2c3] transition-all">
                    Read Post <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
