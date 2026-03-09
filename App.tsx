/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Recycle, 
  Leaf, 
  Search, 
  Info, 
  Calculator, 
  MessageSquare, 
  X, 
  Send, 
  ChevronDown, 
  ArrowRight,
  FileText,
  GlassWater,
  Container,
  Droplets,
  Zap,
  TreeDeciduous,
  Camera,
  Upload,
  Sparkles,
  Trophy,
  Target,
  Globe,
  Instagram,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Ban,
  Pizza,
  Wind,
  Coffee,
  Layout,
  Minimize2,
  CheckCircle,
  XCircle,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  MATERIALS, 
  Material, 
  BAHRAIN_RECYCLING_INFO, 
  WHY_RECYCLE, 
  WASTE_GALLERY, 
  ARTICLES, 
  Article, 
  BAHRAIN_NEWS, 
  NewsItem,
  COMPANY_LOCATIONS,
  CONTAINER_LOCATIONS,
  CompanyLocation,
  RECYCLING_SYMBOLS,
  SORTING_BEST_PRACTICES,
  NON_RECYCLABLES
} from './constants';
import { askRecyclingAI, identifyWasteFromImage } from './services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'guide' | 'calculator' | 'gallery' | 'why' | 'locations' | 'about' | 'articles' | 'edu_guide'>('guide');
  const [locationSubTab, setLocationSubTab] = useState<'companies' | 'containers'>('companies');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'مرحباً! أنا خبير التدوير الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن أي مادة وكيفية تدويرها.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calculator State
  const [calcValues, setCalcValues] = useState({ plastic: 0, paper: 0, glass: 0, metal: 0 });
  const [impact, setImpact] = useState({ energy: 0, trees: 0, water: 0 });

  useEffect(() => {
    const energy = (calcValues.plastic * 5.7) + (calcValues.paper * 4) + (calcValues.glass * 0.5) + (calcValues.metal * 14);
    const trees = (calcValues.paper * 0.017);
    const water = (calcValues.paper * 26) + (calcValues.plastic * 2);
    setImpact({ energy, trees, water });
  }, [calcValues]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const response = await askRecyclingAI(userMsg);
    setChatMessages(prev => [...prev, { role: 'ai', text: response || 'عذراً، لم أستطع فهم ذلك.' }]);
    setIsTyping(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsChatOpen(true);
      setChatMessages(prev => [...prev, { role: 'user', text: 'لقد قمت برفع صورة لتحليلها...' }]);
      setIsAnalyzing(true);
      
      const response = await identifyWasteFromImage(base64);
      setChatMessages(prev => [...prev, { role: 'ai', text: response || 'عذراً، لم أتمكن من تحليل هذه الصورة.' }]);
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Recycle': return <Recycle className="w-6 h-6" />;
      case 'FileText': return <FileText className="w-6 h-6" />;
      case 'GlassWater': return <GlassWater className="w-6 h-6" />;
      case 'Container': return <Container className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] glass px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Recycle className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-emerald-900">RE-LIFE Aljabirya</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="text-xs font-black text-emerald-600/40 uppercase tracking-widest ml-4 border-l border-stone-200 pl-4">استكشف</div>
          <button 
            onClick={() => setActiveTab('guide')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'guide' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            دليل المواد
          </button>
          <button 
            onClick={() => setActiveTab('edu_guide')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'edu_guide' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            الدليل التعليمي
          </button>
          <button 
            onClick={() => setActiveTab('calculator')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'calculator' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            حاسبة الأثر
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'gallery' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            معرض النفايات
          </button>
          <button 
            onClick={() => setActiveTab('articles')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'articles' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            مقالات ونصائح
          </button>
          <button 
            onClick={() => setActiveTab('why')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'why' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            لماذا التدوير؟
          </button>
          <button 
            onClick={() => setActiveTab('locations')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'locations' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            مواقعنا
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={cn("text-sm font-bold transition-colors", activeTab === 'about' ? "text-emerald-600" : "text-stone-500 hover:text-stone-900")}
          >
            عن المنصة
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('guide')} className="btn-primary py-2 px-6 text-sm hidden sm:flex">
            ابدأ التدوير
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-stone-100 shadow-2xl p-6 lg:hidden flex flex-col gap-4"
            >
              {[
                { id: 'guide', label: 'دليل المواد' },
                { id: 'edu_guide', label: 'الدليل التعليمي' },
                { id: 'calculator', label: 'حاسبة الأثر' },
                { id: 'gallery', label: 'معرض النفايات' },
                { id: 'articles', label: 'مقالات ونصائح' },
                { id: 'why', label: 'لماذا التدوير؟' },
                { id: 'locations', label: 'مواقعنا' },
                { id: 'about', label: 'عن المنصة' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "text-right py-3 px-4 rounded-xl font-bold transition-all",
                    activeTab === item.id ? "bg-emerald-50 text-emerald-600" : "text-stone-600 hover:bg-stone-50"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#022C22]">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-right"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-8 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4" />
                  الجيل القادم من التدوير
                </div>
                <h1 className="text-5xl md:text-8xl font-bold mb-8 leading-[1.1] text-white font-serif italic">
                  أعد تعريف <br />
                  <span className="gradient-text not-italic font-sans">مستقبل بيئتك</span>
                </h1>
                <p className="text-xl text-emerald-100/60 mb-12 max-w-xl leading-relaxed text-balance">
                  نحن ندمج الذكاء الاصطناعي مع الوعي البيئي لنخلق عالماً خالياً من الهدر. ابدأ رحلتك اليوم نحو الاستدامة الحقيقية.
                </p>
                <div className="flex flex-wrap gap-4 justify-start">
                  <button onClick={() => setActiveTab('guide')} className="btn-primary group">
                    ابدأ الاستكشاف
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary group"
                  >
                    <Camera className="w-5 h-5 text-emerald-600" />
                    تعرف على النفايات بالصورة
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative z-10 animate-float">
                  <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800" 
                    alt="Recycling Concept" 
                    className="rounded-[3rem] shadow-2xl border border-white/10 relative z-10 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Floating Stats */}
                <div className="absolute -right-8 top-1/4 glass p-6 rounded-3xl shadow-xl z-20 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 font-bold uppercase tracking-tighter">الأثر التراكمي</p>
                      <p className="text-2xl font-bold text-emerald-900">+1.2M</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="bg-white border-y border-stone-100 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Globe className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900">آخر أخبار ومبادرات البحرين</h2>
              </div>
              <button 
                onClick={() => setActiveTab('articles')}
                className="text-emerald-600 font-bold text-sm hover:underline flex items-center gap-1"
              >
                عرض الكل
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BAHRAIN_NEWS.slice(0, 3).map((news) => (
                <motion.div
                  key={news.id}
                  whileHover={{ y: -5 }}
                  className="card-bento bg-stone-50 border-stone-100 p-6 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{news.source}</span>
                    <span className="text-[10px] text-stone-400">{news.date}</span>
                  </div>
                  <h3 className="text-md font-bold text-stone-900 mb-3 leading-tight">{news.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed flex-grow">{news.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <AnimatePresence mode="wait">
            {activeTab === 'guide' && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl font-bold mb-4">دليل إعادة التدوير</h2>
                  <p className="text-stone-500">تعرف على كيفية التعامل مع المواد المختلفة لضمان إعادة تدويرها بكفاءة عالية.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MATERIALS.map((material) => (
                    <motion.div 
                      key={material.id}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="card-bento group cursor-pointer"
                    >
                      <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 group-hover:rotate-12 group-hover:shadow-lg", material.color)}>
                        {getIcon(material.icon)}
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-stone-900">{material.name}</h3>
                      <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                        {material.description}
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">البروتوكول الصحيح:</h4>
                        </div>
                        <ul className="space-y-3">
                          {material.howTo.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                              <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-10 pt-8 border-t border-stone-100">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-2">
                          <Globe className="w-4 h-4" />
                          الأثر البيئي
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed italic">
                          {material.impact}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'edu_guide' && (
              <motion.div
                key="edu_guide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-20"
              >
                {/* Section 1: Recycling Symbols */}
                <section>
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">رموز إعادة التدوير العالمية</h2>
                    <p className="text-stone-500">تعرف على معاني الأرقام الموجودة أسفل العبوات البلاستيكية لتحديد قابليتها للتدوير.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {RECYCLING_SYMBOLS.map((symbol) => (
                      <motion.div 
                        key={symbol.code}
                        whileHover={{ y: -5 }}
                        className="card-bento bg-white border-stone-100 p-8 flex flex-col items-center text-center"
                      >
                        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                          <Recycle className={cn("w-full h-full", symbol.recyclable ? "text-emerald-600" : "text-stone-300")} />
                          <span className="absolute text-xl font-bold text-stone-900">{symbol.code}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{symbol.name}</h3>
                        <p className="text-xs text-emerald-600 font-bold mb-4 uppercase tracking-widest">{symbol.desc}</p>
                        <p className="text-sm text-stone-500 leading-relaxed mb-4">{symbol.examples}</p>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          symbol.recyclable ? "bg-emerald-50 text-emerald-700" : "bg-stone-50 text-stone-400"
                        )}>
                          {symbol.recyclable ? "قابل للتدوير" : "غير قابل للتدوير حالياً"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Section 2: Best Practices */}
                <section className="bg-stone-50 -mx-6 px-6 py-20 rounded-[3rem]">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                      <h2 className="text-3xl font-bold mb-4">أفضل ممارسات فرز المواد</h2>
                      <p className="text-stone-500">اتبع هذه الخطوات البسيطة لضمان جودة المواد المعاد تدويرها وتسهيل عملية المعالجة.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {SORTING_BEST_PRACTICES.map((practice, i) => (
                        <div key={i} className="flex gap-6 items-start bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
                          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                            {practice.icon === 'Droplets' && <Droplets className="w-8 h-8" />}
                            {practice.icon === 'Minimize' && <Minimize2 className="w-8 h-8" />}
                            {practice.icon === 'XCircle' && <XCircle className="w-8 h-8" />}
                            {practice.icon === 'Ban' && <Ban className="w-8 h-8" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-3">{practice.title}</h3>
                            <p className="text-stone-500 leading-relaxed">{practice.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 3: Non-Recyclables */}
                <section>
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">مواد لا يمكن إعادة تدويرها</h2>
                    <p className="text-stone-500">تجنب وضع هذه المواد في حاويات التدوير لأنها قد تلوث الشحنة بالكامل وتؤدي لرفضها.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {NON_RECYCLABLES.map((item, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="card-bento bg-white border-stone-100 p-8 flex flex-col items-center text-center border-t-4 border-t-red-100"
                      >
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-400 mb-6">
                          {item.icon === 'Pizza' && <Pizza className="w-8 h-8" />}
                          {item.icon === 'Wind' && <Wind className="w-8 h-8" />}
                          {item.icon === 'Coffee' && <Coffee className="w-8 h-8" />}
                          {item.icon === 'Layout' && <Layout className="w-8 h-8" />}
                        </div>
                        <h3 className="text-lg font-bold mb-3">{item.name}</h3>
                        <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <div className="bg-emerald-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"></div>
                  <h3 className="text-3xl font-bold mb-6 relative z-10">هل لديك شك حول مادة معينة؟</h3>
                  <p className="text-emerald-100/80 mb-10 max-w-2xl mx-auto relative z-10">
                    استخدم خبير التدوير الذكي (AI) للتعرف على أي مادة بمجرد تصويرها أو السؤال عنها.
                  </p>
                  <button onClick={() => setIsChatOpen(true)} className="btn-primary bg-emerald-500 text-emerald-950 hover:bg-emerald-400 border-none relative z-10">
                    اسأل الخبير الآن
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'calculator' && (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl mx-auto"
              >
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">حاسبة الأثر البيئي</h2>
                  <p className="text-stone-500">أدخل كميات المواد التي تعيد تدويرها أسبوعياً (بالكيلوجرام) لترى أثرك الإيجابي.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {MATERIALS.map((m) => (
                        <div key={m.id} className="card-bento">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", m.color)}>
                                {getIcon(m.icon)}
                              </div>
                              <span className="font-bold text-lg">{m.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">كجم / أسبوع</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="50" 
                            value={calcValues[m.id as keyof typeof calcValues]}
                            onChange={(e) => setCalcValues(prev => ({ ...prev, [m.id]: parseInt(e.target.value) }))}
                            className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                          <div className="flex justify-between mt-4 text-sm font-bold text-emerald-700">
                            <span className="opacity-30">0</span>
                            <span className="text-2xl font-serif italic">{calcValues[m.id as keyof typeof calcValues]}</span>
                            <span className="opacity-30">50</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#022C22] text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                      
                      <h3 className="text-2xl font-bold mb-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <Calculator className="w-5 h-5 text-emerald-400" />
                        </div>
                        بصمتك البيئية
                      </h3>
                      
                      <div className="space-y-10">
                        <div className="flex items-center gap-6 group">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">توفير الطاقة</p>
                            <p className="text-3xl font-bold font-serif italic">{impact.energy.toFixed(1)} <span className="text-xs font-sans not-italic font-normal opacity-40 uppercase tracking-widest">kWh</span></p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 group">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TreeDeciduous className="w-7 h-7 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">إنقاذ الأشجار</p>
                            <p className="text-3xl font-bold font-serif italic">{impact.trees.toFixed(2)} <span className="text-xs font-sans not-italic font-normal opacity-40 uppercase tracking-widest">Trees</span></p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Droplets className="w-7 h-7 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">توفير المياه</p>
                            <p className="text-3xl font-bold font-serif italic">{impact.water.toFixed(0)} <span className="text-xs font-sans not-italic font-normal opacity-40 uppercase tracking-widest">Liters</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="flex items-center gap-3 mb-4">
                          <Trophy className="w-5 h-5 text-amber-400" />
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">المرتبة الحالية</span>
                        </div>
                        <p className="text-lg font-bold mb-1">حامي الطبيعة الناشئ</p>
                        <div className="w-full h-1 bg-emerald-500/10 rounded-full overflow-hidden mt-4">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => alert('سيتم توفير تقارير مفصلة قريباً في النسخة القادمة!')}
                        className="btn-primary w-full mt-10 bg-emerald-500 text-emerald-950 hover:bg-emerald-400 border-none"
                      >
                        تحميل التقرير الكامل
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-4">معرض النفايات (Waste Gallery)</h2>
                  <p className="text-stone-500">استكشف أنواع النفايات المختلفة وتعرف على قابليتها لإعادة التدوير من خلال الصور والوصف.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {WASTE_GALLERY.map((item) => (
                    <motion.div 
                      key={item.id}
                      whileHover={{ y: -10 }}
                      className="card-bento overflow-hidden p-0 flex flex-col h-full"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="eco-badge bg-white/90 backdrop-blur-sm">
                            {item.recyclable ? 'قابل للتدوير' : 'غير قابل للتدوير'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-3 text-stone-900">{item.name}</h3>
                        <p className="text-sm text-stone-500 leading-relaxed mb-6 flex-grow">
                          {item.description}
                        </p>
                        <button 
                          onClick={() => setActiveTab('guide')}
                          className="text-emerald-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
                        >
                          تعرف على المزيد
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'why' && (
              <motion.div
                key="why"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-16"
              >
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold mb-6 font-serif italic">لماذا يجب علينا إعادة التدوير؟</h2>
                  <p className="text-lg text-stone-600 leading-relaxed">
                    إعادة التدوير ليست مجرد خيار، بل هي مسؤولية تجاه كوكبنا وتجاه الأجيال القادمة في مملكة البحرين.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {WHY_RECYCLE.map((item, i) => (
                    <div key={i} className="card-bento flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        {item.icon === 'TreeDeciduous' && <TreeDeciduous className="w-8 h-8" />}
                        {item.icon === 'Zap' && <Zap className="w-8 h-8" />}
                        {item.icon === 'Droplets' && <Droplets className="w-8 h-8" />}
                        {item.icon === 'Trophy' && <Trophy className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-stone-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10"></div>
                  <h3 className="text-3xl font-bold mb-6 relative z-10">كن جزءاً من التغيير في البحرين</h3>
                  <p className="text-emerald-100/80 mb-10 max-w-2xl mx-auto relative z-10">
                    كل علبة بلاستيكية تعيد تدويرها تساهم في الحفاظ على جمال شواطئنا ونقاء بيئتنا.
                  </p>
                  <button onClick={() => setActiveTab('guide')} className="btn-primary bg-emerald-500 text-emerald-950 hover:bg-emerald-400 border-none relative z-10">
                    ابدأ الآن
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'locations' && (
              <motion.div
                key="locations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-4">مواقع استلام النفايات في البحرين (2026)</h2>
                  <p className="text-stone-500">اختر نوع الموقع الذي تبحث عنه وساهم في الحفاظ على نظافة المملكة.</p>
                </div>

                {/* Sub-tabs */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setLocationSubTab('companies')}
                    className={cn(
                      "px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2",
                      locationSubTab === 'companies' 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                        : "bg-white text-stone-500 border border-stone-200 hover:border-emerald-200"
                    )}
                  >
                    <Container className="w-5 h-5" />
                    مواقع الشركات
                  </button>
                  <button
                    onClick={() => setLocationSubTab('containers')}
                    className={cn(
                      "px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2",
                      locationSubTab === 'containers' 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                        : "bg-white text-stone-500 border border-stone-200 hover:border-emerald-200"
                    )}
                  >
                    <MapPin className="w-5 h-5" />
                    مواقع الحاويات
                  </button>
                </div>

                {locationSubTab === 'companies' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {COMPANY_LOCATIONS.map((company, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="card-bento bg-white border-stone-100 p-8 flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                            <Container className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-stone-900 mb-4">{company.name}</h3>
                        </div>
                        <a 
                          href={company.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline mt-4"
                        >
                          أذهب لرؤية هذا الموقع
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {CONTAINER_LOCATIONS.map((container, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="card-bento bg-white border-stone-100 p-8 flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-stone-900 mb-4">{container.name}</h3>
                        </div>
                        <a 
                          href={container.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline mt-4"
                        >
                          أذهب لرؤية هذا الموقع
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="card-bento bg-stone-50 border-dashed border-2 border-stone-200 text-center py-12">
                  <p className="text-stone-400 mb-4 italic">هل تعرف موقعاً آخر لم يتم ذكره؟</p>
                  <button onClick={() => setIsChatOpen(true)} className="text-emerald-600 font-bold hover:underline">
                    أخبرنا به لنضيفه إلى القائمة
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'articles' && (
              <motion.div
                key="articles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold mb-4">مقالات تعليمية ونصائح</h2>
                  <p className="text-stone-500">اكتشف كيف يمكنك المساهمة في حماية البيئة من خلال المعرفة والممارسات الصحيحة.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {ARTICLES.map((article) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -5 }}
                      className="card-bento overflow-hidden flex flex-col"
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            {article.category}
                          </span>
                          <span className="text-xs text-stone-400">{article.date}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-emerald-900">{article.title}</h3>
                        <p className="text-stone-600 text-sm mb-6 leading-relaxed flex-grow">
                          {article.summary}
                        </p>
                        <div className="pt-6 border-t border-stone-100">
                          <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                            {article.content}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* News Subsection */}
                <div className="pt-12 border-t border-stone-200">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900">أخبار ومبادرات إعادة التدوير في البحرين</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {BAHRAIN_NEWS.map((news) => (
                      <motion.div
                        key={news.id}
                        whileHover={{ x: -10 }}
                        className="card-bento bg-white border-stone-100 p-6 flex flex-col md:flex-row gap-6 items-start"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{news.source}</span>
                            <span className="text-xs text-stone-400">{news.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-stone-900 mb-2">{news.title}</h3>
                          <p className="text-stone-600 text-sm leading-relaxed">{news.summary}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-16">
                  <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8">
                    <Leaf className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-bold mb-6">RE-LIFE Aljabirya</h2>
                  <p className="text-xl text-stone-600 font-medium italic">نحو بحرين أكثر استدامة</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                  <div className="space-y-6 text-lg text-stone-600 leading-relaxed text-right">
                    <p>
                      تأسست منصة <strong>RE-LIFE Aljabirya</strong> لتكون المحرك الأساسي للوعي البيئي في مملكة البحرين. نحن نهدف إلى تحويل مفهوم النفايات من عبء بيئي إلى مورد اقتصادي مستدام.
                    </p>
                    <p>
                      {BAHRAIN_RECYCLING_INFO.vision}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {BAHRAIN_RECYCLING_INFO.stats.map((stat, i) => (
                      <div key={i} className="card-bento bg-emerald-50 border-emerald-100">
                        <p className="text-3xl font-bold text-emerald-700 mb-1">{stat.value}</p>
                        <p className="text-sm font-bold text-emerald-900 mb-1">{stat.label}</p>
                        <p className="text-xs text-emerald-600/70">{stat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200 px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                <Recycle className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-emerald-900">RE-LIFE Aljabirya</span>
            </div>
            <p className="text-stone-500 max-w-sm leading-relaxed mb-8">
              نعمل معاً من أجل بحرين أكثر اخضراراً. انضم إلى مجتمعنا وكن جزءاً من الحل لا جزءاً من التلوث.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/relife_aljabirya" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-400 hover:text-pink-600 hover:shadow-lg transition-all border border-stone-200"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://wa.me/97333902013" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:shadow-lg transition-all border border-stone-200"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a 
                href="tel:+97333902013" 
                className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-400 hover:text-blue-600 hover:shadow-lg transition-all border border-stone-200"
              >
                <Phone className="w-6 h-6" />
              </a>
              <a 
                href="mailto:relife.aljabirya@gmail.com" 
                className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-stone-400 hover:text-amber-600 hover:shadow-lg transition-all border border-stone-200"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-stone-900">استكشف</h4>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li><button onClick={() => setActiveTab('guide')} className="hover:text-emerald-600 transition-colors">دليل المواد</button></li>
              <li><button onClick={() => setActiveTab('calculator')} className="hover:text-emerald-600 transition-colors">حاسبة الأثر</button></li>
              <li><button onClick={() => setActiveTab('gallery')} className="hover:text-emerald-600 transition-colors">صور النفايات</button></li>
              <li><button onClick={() => setActiveTab('articles')} className="hover:text-emerald-600 transition-colors">مقالات ونصائح</button></li>
              <li><button onClick={() => setActiveTab('why')} className="hover:text-emerald-600 transition-colors">لماذا التدوير؟</button></li>
              <li><button onClick={() => setActiveTab('locations')} className="hover:text-emerald-600 transition-colors">مواقعنا</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-stone-900">تواصل مباشر</h4>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600" />
                +973 33902013
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600" />
                relife.aljabirya@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                مملكة البحرين
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-stone-200 text-center text-stone-400 text-xs">
          © {new Date().getFullYear()} RE-LIFE Aljabirya. جميع الحقوق محفوظة.
        </div>
      </footer>

      {/* Floating AI Chat */}
      <div className="fixed bottom-6 left-6 z-[60]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden"
            >
              <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">الخبير الذكي</p>
                    <p className="text-[10px] opacity-80">متصل الآن لمساعدتك</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-stone-50">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === 'user' ? "justify-start" : "justify-end")}>
                    <div className={cn(
                      "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-emerald-600 text-white rounded-tr-none" 
                        : "bg-white text-stone-800 border border-stone-100 shadow-sm rounded-tl-none"
                    )}>
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex justify-end">
                    <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">جاري تحليل الصورة...</span>
                    </div>
                  </div>
                )}
                {isTyping && (
                  <div className="flex justify-end">
                    <div className="bg-white p-3 rounded-2xl border border-stone-100 shadow-sm flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-stone-100">
                <div className="flex gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-stone-100 text-stone-500 rounded-xl flex items-center justify-center hover:bg-stone-200 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اسأل عن أي مادة..."
                    className="flex-grow bg-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isTyping || isAnalyzing}
                    className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors relative"
        >
          {isChatOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
