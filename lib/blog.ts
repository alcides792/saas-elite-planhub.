import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  image: string;
  content: string;
};

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const posts = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        slug: file.replace('.md', ''),
        ...data,
        content,
      } as BlogPost;
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    ...data,
    content,
  } as BlogPost;
}
