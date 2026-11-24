import React, { useEffect } from 'react';
import { routeKey, useRoute } from './lib/router';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import BlogPreview from './components/BlogPreview';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';
import AIChat from './components/AIChat';
import Background from './components/Background';
import { CONTAINER } from './components/ui';

/** Trang chủ: màn hình mở đầu trên nền phong cảnh, nội dung nằm trên một lớp nền trượt lên. */
const Home: React.FC = () => (
  <>
    <Navbar overlay />
    <Hero />
    <main className="relative rounded-t-[2.5rem] border-t border-line bg-paper shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.25)]">
      <About />
      <Projects />
      <Experience />
      <BlogPreview />
      <Contact />
      <div className={`${CONTAINER} border-t border-line py-10`}>
        <Footer />
      </div>
    </main>
  </>
);

function App() {
  const route = useRoute();
  const key = routeKey(route);

  // Khi đổi trang: lên đầu trang, hoặc cuộn tới mục nếu link có neo (vd. /#contact, /blog/bai#muc-luc)
  useEffect(() => {
    const hash = window.location.hash;
    const id = hash.length > 1 ? decodeURIComponent(hash.slice(1)) : '';
    if (id && document.getElementById(id)) {
      const go = () => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      go();
      // Lần tải đầu: font và CSS có thể làm bố cục dịch chuyển, nên cuộn lại khi trang tải xong
      if (document.readyState !== 'complete') {
        window.addEventListener('load', go, { once: true });
        return () => window.removeEventListener('load', go);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="relative isolate min-h-screen font-sans text-ink">
      <Background />
      {route.name === 'home' ? (
        <Home />
      ) : (
        // Trang blog: nền trơn để đọc cho thoải mái
        <div className="min-h-screen bg-paper pt-16">
          <Navbar />
          {route.name === 'blog' ? <BlogList /> : <BlogPost slug={route.slug} />}
          <div className="mx-auto max-w-3xl border-t border-line px-6 py-10 sm:px-10">
            <Footer />
          </div>
        </div>
      )}
      <AIChat />
    </div>
  );
}

export default App;
