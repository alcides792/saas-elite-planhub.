import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Zap, Calendar, User, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { NavBarDemo } from "@/components/ui/tubelight-navbar-demo";
import Footer from "@/components/landing/Footer";
import { createClient } from "@/lib/utils/supabase/server";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Kovr Blog`,
    description: post.excerpt,
    openGraph: {
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1a1a1a] dark:text-white transition-colors duration-500">
      <NavBarDemo user={user} />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 font-black uppercase text-sm mb-12 hover:text-[#1fe2c3] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm font-bold opacity-60 mb-6 uppercase">
            <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
            {post.title}
          </h1>

          <div className="w-full aspect-video border-4 border-[#1a1a1a] shadow-[12px_12px_0px_#faed27] overflow-hidden mb-16">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div className="prose prose-xl dark:prose-invert max-w-none 
          prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
          prose-p:font-bold prose-p:text-[#1a1a1a] dark:prose-p:text-zinc-300
          prose-strong:font-black prose-strong:text-[#1a1a1a] dark:prose-strong:text-white
          prose-li:font-bold
          prose-img:border-4 prose-img:border-[#1a1a1a]">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <section className="mt-24 border-8 border-[#1a1a1a] p-12 bg-[#faed27] dark:bg-[#faed27] text-[#1a1a1a]">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">Take control of your money</h2>
          <p className="text-xl font-bold mb-8 opacity-90">
            Stop losing money on services you don't use. Join thousands of users who save average €300/year with Kovr.
          </p>
          <Link 
            href="/login?mode=signup"
            className="inline-block bg-[#1a1a1a] text-white px-10 py-5 font-black text-xl uppercase border-4 border-[#1a1a1a] hover:bg-zinc-800 transition-all"
          >
            Start Your Free Trial
          </Link>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
