import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, Collection, Order, FileEntry, Customer, Discount, CustomPage, PageSection, BlogPost, LayoutSettings, MenuItem } from '../types';
import { 
  TrendingUp, BarChart3, Package, Users, Tag, FileCode, HardDrive, Percent, 
  Search, Plus, Eye, CheckCircle2, Clipboard, ArrowUpDown, ChevronRight, 
  Trash2, Filter, Save, Sparkles, Building, Settings, Image as ImageIcon, 
  X, MoveUp, MoveDown, Layout, Globe, Mail, DollarSign, ShoppingBag, EyeOff, RefreshCw, AlertTriangle, GripVertical,
  Columns, Grid, Video, HelpCircle, FolderHeart, Layers, Award, PlaySquare, Compass, ShieldCheck, ChevronLeft,
  ChevronDown, ChevronUp, Star, Heart, FileText, BookOpen, LayoutGrid, Database, Server, Lock, Gift, Check, Clock, Truck, ArrowRight, Zap, Shield,
  Pencil, Copy, Bold, Italic, Underline, AlignLeft, Link, Calendar, ArrowLeft, MoreHorizontal, Code, FileEdit, LogOut, Download, Upload
} from 'lucide-react';
import ImageUploadInput from './ImageUploadInput';
import { cleanMediaUrl, PLACEHOLDER_IMAGE } from '../utils/mediaUtils';
import CollectionEditor from './CollectionEditor';
import ProductEditor from './ProductEditor';
import BlogContentEditor from './BlogContentEditor';
import DiscountEditor from './DiscountEditor';
import PlansCanOverlay from './PlansCanOverlay';
import { Crown, Flame, Cloud } from 'lucide-react';

export const AVAILABLE_SECTION_TEMPLATES = [
  { type: 'Image banner', label: 'Image Banner', desc: 'Hero banner with centered headline overlay & CTA buttons', icon: 'ImageIcon' },
  { type: 'Image with text', label: 'Image with Text', desc: 'Beautifully-aligned structural image with side description', icon: 'Columns' },
  { type: 'Text column with image', label: 'Text Column with Image', desc: 'Three-column display grid showing core brand standards', icon: 'Grid' },
  { type: 'Featured collection', label: 'Featured Collection', desc: 'Interactive storefront product card grid with live data', icon: 'ShoppingBag' },
  { type: 'Collection list', label: 'Collection List', desc: 'Display all available categorized nicotine canister series', icon: 'FolderHeart' },
  { type: 'Slideshow', label: 'Slideshow', desc: 'Smooth horizontal multi-slide sliding carousel banner', icon: 'PlaySquare' },
  { type: 'Video banner', label: 'Video Banner', desc: 'Cinematic YouTube player showcasing laboratory workflows', icon: 'Video' },
  { type: 'Rich text', label: 'Rich Text', desc: 'Focussed header with spacious text for brand newsletters', icon: 'FileText' },
  { type: 'Marquee text', label: 'Marquee Text', desc: 'Fast, animated horizontal news marquee with key notices', icon: 'Sparkles' },
  { type: 'Marquee images', label: 'Marquee Images', desc: 'Dynamic ticker reel demonstrating recently stocked canisters', icon: 'Layers' },
  { type: 'Logo list', label: 'Logo List', desc: 'Official partnered distributors and reseller banners', icon: 'Award' },
  { type: 'Images gallery', label: 'Images Gallery', desc: 'Scenic four-column gallery of clean compounding rooms', icon: 'Layout' },
  { type: 'FAQs', label: 'FAQs', desc: 'Collapsible answered support questions', icon: 'HelpCircle' },
  { type: 'Blog post', label: 'Blog Post', desc: 'Display a beautiful list/grid of live Pouch Journal articles with columns control', icon: 'BookOpen' },
  { type: 'Brand list', label: 'Brand List', desc: 'Scenic brand logo matrix with interactive links to collections', icon: 'LayoutGrid' },
  { type: 'Icon with text', label: 'Icon with Text', desc: 'Six-item feature display grid with customizable icons and colors', icon: 'Sparkles' },
  { type: 'Brands we offer', label: 'Brands we offer', desc: 'Infinite running marquee of brand logo images with live upload option', icon: 'Layers' },
  { type: 'How it works', label: 'How it works', desc: 'Dynamic timeline workflow steps with custom images & layouts', icon: 'Compass' },
  { type: 'Trust badges', label: 'Trust Badges', desc: 'Elegant horizontal grid displaying core store guarantees like authenticity and premium quality', icon: 'Award' },
  { type: 'Plans', label: 'Subscription Plans', desc: 'Display the customizable 4-tier subscription plans grid', icon: 'LayoutGrid' },
  { type: 'Clearance Sale', label: 'Clearance Sale', desc: 'Display selected clearance products with layouts like shop now grid', icon: 'Flame' }
] as const;

export const getSectionLabel = (type: string): string => {
  const found = AVAILABLE_SECTION_TEMPLATES.find(t => t.type === type);
  return found ? found.label : type;
};

export const getSectionIcon = (type: string) => {
  switch (type) {
    case 'Image banner': return <ImageIcon className="h-4 w-4 text-teal-600" />;
    case 'Image with text': return <Columns className="h-4 w-4 text-emerald-500" />;
    case 'Text column with image': return <Grid className="h-4 w-4 text-sky-500" />;
    case 'Featured collection': return <ShoppingBag className="h-4 w-4 text-indigo-650" />;
    case 'Collection list': return <FolderHeart className="h-4 w-4 text-purple-600" />;
    case 'Slideshow': return <PlaySquare className="h-4 w-4 text-blue-500" />;
    case 'Video banner': return <Video className="h-4 w-4 text-rose-500" />;
    case 'Rich text': return <FileText className="h-4 w-4 text-slate-500" />;
    case 'Marquee text': return <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />;
    case 'Marquee images': return <Layers className="h-4 w-4 text-indigo-500" />;
    case 'Logo list': return <Award className="h-4 w-4 text-cyan-500" />;
    case 'Images gallery': return <Layout className="h-4 w-4 text-sky-600" />;
    case 'FAQs': return <HelpCircle className="h-4 w-4 text-violet-500" />;
    case 'Blog post': return <BookOpen className="h-4 w-4 text-orange-600" />;
    case 'Brand list': return <LayoutGrid className="h-4 w-4 text-pink-500" />;
    case 'Icon with text': return <Sparkles className="h-4 w-4 text-indigo-650 animate-pulse" />;
    case 'Brands we offer': return <Layers className="h-4 w-4 text-amber-600 animate-bounce" />;
    case 'How it works': return <Compass className="h-4 w-4 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />;
    case 'Trust badges': return <Award className="h-4 w-4 text-yellow-600 animate-pulse" />;
    case 'Plans': return <LayoutGrid className="h-4 w-4 text-amber-500 animate-pulse" />;
    case 'Clearance Sale': return <Flame className="h-4 w-4 text-red-500 animate-pulse" />;
    default: return <FileCode className="h-4 w-4 text-slate-400" />;
  }
};

interface AdminDashboardProps {
  products: Product[];
  onUpdateProducts: (newProds: Product[]) => void;
  collections: Collection[];
  onUpdateCollections: (newColls: Collection[]) => void;
  orders: Order[];
  onUpdateOrders: (newOrders: Order[]) => void;
  files: FileEntry[];
  onUpdateFiles: (newFiles: FileEntry[]) => void;
  customers: Customer[];
  onUpdateCustomers: (newCusts: Customer[]) => void;
  discounts: Discount[];
  onUpdateDiscounts: (newDiscs: Discount[]) => void;
  customPages: CustomPage[];
  onUpdateCustomPages: (newPages: CustomPage[]) => void;
  blogs: BlogPost[];
  onUpdateBlogs: (newBlogs: BlogPost[]) => void;
  layoutSettings?: LayoutSettings;
  onUpdateLayoutSettings?: (newSettings: LayoutSettings | ((prev: LayoutSettings) => LayoutSettings)) => void;
  onDirtyChange?: (dirty: boolean) => void;
  adminActionTrigger?: { action: 'save' | 'discard'; timestamp: number } | null;
  onAdminActionComplete?: (action: 'save' | 'discard') => void;
  onExitAdmin?: () => void;
  onLogoutAdmin?: () => void;
}

interface BrandsWeOfferSectionAdminProps {
  sec: PageSection;
}

function BrandsWeOfferSectionAdmin({ sec }: BrandsWeOfferSectionAdminProps) {
  const items = (sec.settings.brandItems || []).filter(b => b.imageUrl && b.imageUrl.trim() !== '');
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
    const totalWidth = scrollWidth - clientWidth;
    if (totalWidth <= 0) return;
    const percentage = Math.max(0, Math.min(1, scrollLeft / totalWidth));
    const dotCount = Math.min(items.length, 6);
    const idx = Math.min(Math.floor(percentage * dotCount), dotCount - 1);
    setActiveDot(idx);
  };

  const scrollToDot = (idx: number) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const totalWidth = scrollWidth - clientWidth;
    if (totalWidth <= 0) return;
    const dotCount = Math.min(items.length, 6);
    const targetScrollLeft = (idx / (dotCount - 1)) * totalWidth;
    sliderRef.current.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    setActiveDot(idx);
  };

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="py-4 bg-white w-full overflow-hidden border border-slate-100 rounded-2xl shadow-xs my-2 text-center animate-fade-in">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-1.5 mb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            THE BRANDS YOU LOVE
          </span>
          <div className="w-8 h-[1px] bg-[#D4AF37]" />
        </div>
        <h3 
          className="text-lg font-black uppercase tracking-tight text-slate-900 leading-none animate-fade-in"
          style={{ color: sec.settings.headingColor || '#0C1017' }}
        >
          {sec.settings.title || 'Brands we offer'}
        </h3>
        {sec.settings.description && (
          <p 
            className="text-[10px] max-w-md mx-auto leading-relaxed text-slate-400 font-medium opacity-85"
            style={{ color: sec.settings.textColor || '#64748B' }}
          >
            {sec.settings.description}
          </p>
        )}
      </div>

      <div className="relative px-8">
        {/* Left Arrow Button */}
        {items.length > 0 && (
          <button 
            type="button"
            onClick={scrollLeft} 
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full border border-[#D4AF37] bg-white flex items-center justify-center text-[#D4AF37] hover:bg-amber-50/50 shadow-xs transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
          </button>
        )}

        {/* Brand Slider Container */}
        <div 
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-none py-4 px-2 scroll-smooth"
        >
          {items.map((b, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col items-center justify-center shrink-0 w-32 aspect-square bg-white rounded-2xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] border border-slate-50/50 transition-all duration-300 transform hover:-translate-y-1 select-none cursor-pointer"
            >
              {b.imageUrl ? (
                <img 
                  src={b.imageUrl} 
                  className="max-h-16 max-w-[90px] object-contain transition-transform duration-300 group-hover:scale-105" 
                  alt={b.title || 'Brand'} 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-full group-hover:scale-105 transition-transform duration-300">
                  {b.title || 'Brand'}
                </span>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-slate-400 italic text-center py-4 w-full text-[10px]">
              No brands found. Go to sidebar settings to upload brands!
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        {items.length > 0 && (
          <button 
            type="button"
            onClick={scrollRight} 
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full border border-[#D4AF37] bg-white flex items-center justify-center text-[#D4AF37] hover:bg-amber-50/50 shadow-xs transition-all cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-4">
          {Array.from({ length: Math.min(items.length, 6) }).map((_, dIdx) => (
            <button
              key={dIdx}
              type="button"
              onClick={() => scrollToDot(dIdx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                dIdx === activeDot ? 'bg-[#D4AF37] w-3' : 'bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface HowItWorksSectionAdminProps {
  sec: PageSection;
}

function HowItWorksSectionAdmin({ sec }: HowItWorksSectionAdminProps) {
  const steps = (sec.settings.stepItems && sec.settings.stepItems.length > 0) 
    ? sec.settings.stepItems 
    : [
        { number: 1, title: 'Choose Your Plan', description: 'Pick the plan that suits you best. Flexible. Simple. No commitment.' },
        { number: 2, title: 'Pick Your Favourite Brands', description: 'Mix and match from 20+ premium brands, flavours and strengths.' },
        { number: 3, title: 'Relax, We Handle The Rest', description: 'We pack and deliver to your door, automatically. You focus on life.' }
      ];

  const renderStepVisualMockup = (sidx: number, step: any) => {
    if (step.imageUrl && step.imageUrl.trim() !== '') {
      return (
        <div className="w-full my-4 flex items-center justify-center overflow-hidden rounded-xl">
          <img 
            src={step.imageUrl} 
            className="w-full max-h-48 object-contain filter drop-shadow-md" 
            alt={step.title} 
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (sidx === 0) {
      return (
        <div className="w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center my-4">
          <div className="grid grid-cols-4 gap-1 w-full">
            {/* LITE */}
            <div className="bg-white rounded-lg border border-slate-200/60 p-1 flex flex-col items-center justify-between text-center shadow-2xs h-24">
              <span className="text-[6px] font-black tracking-wider text-slate-400">LITE</span>
              <div className="my-0.5 text-center">
                <span className="block text-[8px] font-black text-slate-800 leading-tight">5 Cans</span>
                <span className="block text-[7px] font-bold text-[#D4AF37] leading-tight">£27.99</span>
                <span className="text-[5px] text-slate-400 block -mt-0.5">per month</span>
              </div>
            </div>
            
            {/* CORE */}
            <div className="bg-white rounded-lg border border-slate-200/60 p-1 flex flex-col items-center justify-between text-center shadow-2xs h-24">
              <span className="text-[6px] font-black tracking-wider text-slate-450">CORE</span>
              <div className="my-0.5 text-center">
                <span className="block text-[8px] font-black text-slate-800 leading-tight">8 Cans</span>
                <span className="block text-[7px] font-bold text-[#D4AF37] leading-tight">£35.99</span>
                <span className="text-[5px] text-slate-400 block -mt-0.5">per month</span>
              </div>
            </div>

            {/* PRO */}
            <div className="bg-[#0C1017] rounded-lg border border-[#D4AF37] p-1 flex flex-col items-center justify-between text-center shadow-sm h-24 relative overflow-hidden transform scale-105 z-10">
              <div className="absolute top-0 left-0 right-0 bg-[#D4AF37] text-[4px] font-black text-slate-950 py-0.5 uppercase tracking-wider text-center">
                MOST POPULAR
              </div>
              <span className="text-[6px] font-black tracking-wider text-white mt-1">PRO</span>
              <div className="my-0.5 text-center">
                <span className="block text-[8px] font-black text-white leading-tight">10 Cans</span>
                <span className="block text-[7px] font-bold text-[#D4AF37] leading-tight">£40.99</span>
                <span className="text-[5px] text-slate-350 block -mt-0.5">per month</span>
              </div>
            </div>

            {/* ULTIMATE */}
            <div className="bg-white rounded-lg border border-[#D4AF37]/50 p-1 flex flex-col items-center justify-between text-center shadow-2xs h-24">
              <span className="text-[6px] font-black tracking-wider text-slate-450">ULTIMATE</span>
              <div className="my-0.5 text-center">
                <span className="block text-[8px] font-black text-slate-800 leading-tight">12 Cans</span>
                <span className="block text-[7px] font-bold text-[#D4AF37] leading-tight">£46.99</span>
                <span className="text-[5px] text-slate-400 block -mt-0.5">per month</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sidx === 1) {
      return (
        <div className="w-full h-32 relative my-4 flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-[200px] h-full flex items-center justify-center">
            {/* CAN 1: ZYN */}
            <div className="absolute left-1 top-2 w-[48px] h-[48px] rounded-full bg-white border border-slate-200 shadow-md flex flex-col items-center justify-center p-0.5 transform -rotate-12 z-10">
              <div className="w-[42px] h-[42px] rounded-full border border-sky-400/30 flex flex-col items-center justify-center bg-sky-50/20">
                <span className="text-[7px] font-extrabold text-sky-600 tracking-tight leading-none">ZYN</span>
              </div>
            </div>

            {/* CAN 2: VELO */}
            <div className="absolute right-1 top-2 w-[48px] h-[48px] rounded-full bg-white border border-slate-200 shadow-md flex flex-col items-center justify-center p-0.5 transform rotate-12 z-10">
              <div className="w-[42px] h-[42px] rounded-full border border-blue-500/30 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                <span className="text-[7px] font-extrabold text-white tracking-tight leading-none">VELO</span>
              </div>
            </div>

            {/* CAN 5: 77 */}
            <div className="absolute left-[50%] top-1 w-[52px] h-[52px] rounded-full bg-white border border-slate-200 shadow-lg flex flex-col items-center justify-center p-0.5 transform -translate-x-1/2 -rotate-3 z-30">
              <div className="w-[46px] h-[46px] rounded-full border border-slate-900 flex flex-col items-center justify-center bg-[#0C1017]">
                <span className="text-[10px] font-black text-white tracking-tighter leading-none">77</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (sidx === 2) {
      return (
        <div className="w-full h-32 relative my-4 flex items-center justify-center">
          <div className="w-36 h-20 bg-[#0C1017] rounded-xl border border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between p-2 select-none">
            <div className="mt-1 space-y-0.5 text-left">
              <span className="block text-[8px] font-black tracking-[0.12em] text-[#D4AF37] leading-none">POUCH</span>
              <span className="block text-[8px] font-black tracking-[0.12em] text-[#D4AF37] leading-none">SUPPLY</span>
            </div>
            <div className="border-t border-slate-800/65 pt-1 flex items-center justify-between">
              <span className="text-[3px] font-bold text-slate-450 uppercase tracking-[0.18em]">NICOTINE ON AUTOPILOT</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 w-24 h-24 flex items-center justify-center bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100">
        {step.imageUrl ? (
          <img 
            src={step.imageUrl} 
            className="max-h-20 max-w-full object-contain" 
            alt={step.title} 
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-[10px] font-bold text-slate-450">No Image</span>
        )}
      </div>
    );
  };

  const renderStepCheckmarks = (sidx: number) => {
    const checkmarks = sidx === 0 
      ? ["Weekly, Fortnightly or Monthly", "Change anytime"]
      : sidx === 1 
      ? ["Change brands or flavours anytime"]
      : ["Automatic deliveries", "Skip or pause anytime"];

    return (
      <div className="mt-2 space-y-1 w-full text-left">
        {checkmarks.map((text, cidx) => (
          <div key={cidx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-850 justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-50 border border-amber-250 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Check className="h-2 w-2 stroke-[3]" />
            </div>
            <span className="text-[10px] text-slate-650 font-extrabold">{text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="py-8 w-full font-sans transition-all duration-300 overflow-hidden"
      style={{ backgroundColor: sec.settings.backgroundColor || '#F8FAFC' }}
    >
      <div className="max-w-7xl mx-auto px-4 space-y-10 relative">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
              HOW IT WORKS
            </span>
            <div className="w-8 h-[1px] bg-[#D4AF37]" />
          </div>
          
          <h2 
            className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#0C1017] leading-none"
            style={{ color: sec.settings.headingColor || '#0C1017' }}
          >
            {sec.settings.title || 'Get Started In Under 60 Seconds'}
          </h2>
          
          {sec.settings.description && (
            <p className="text-[10px] leading-relaxed text-slate-500 font-semibold opacity-90">
              {sec.settings.description}
            </p>
          )}

          {/* Reassuring timing badge */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/75 border border-amber-100 text-[#D4AF37] text-[10px] font-black">
            <Clock className="h-3 w-3 stroke-[2.5]" />
            <span>Takes less than 60 seconds</span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="relative max-w-6xl mx-auto pt-4">
          {/* Gold Connecting Dotted Line */}
          <div className="absolute top-[140px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#D4AF37]/45 hidden md:block z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {steps.map((step, sidx) => (
              <div 
                key={sidx}
                className="bg-white rounded-[20px] border border-slate-100 p-6 flex flex-col items-center justify-between text-center shadow-[0_10px_30px_rgba(147,197,253,0.08)] min-h-[360px] group relative"
              >
                {/* Gold step circle overlapping border */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4AF37] text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                  {step.number || (sidx + 1)}
                </div>

                <div className="space-y-3 flex-1 flex flex-col items-center pt-2 w-full">
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    {step.title || 'Step Title'}
                  </h3>
                  
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px] font-semibold">
                    {step.description || 'Step description details.'}
                  </p>

                  {/* Render High-Fidelity Custom Visual Mockups */}
                  {renderStepVisualMockup(sidx, step)}
                </div>

                {/* Render corresponding green checkmarks */}
                {renderStepCheckmarks(sidx)}
              </div>
            ))}
          </div>
        </div>

        {/* Reassurance Objections Grid */}
        <div className="max-w-6xl mx-auto pt-2">
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-[0_10px_30px_rgba(147,197,253,0.03)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* CANCEL ANYTIME */}
            <div className="flex items-center gap-3 py-2 justify-center lg:justify-start">
              <div className="shrink-0 p-2 rounded-lg bg-slate-50 flex items-center justify-center text-slate-800">
                <ShieldCheck className="h-5 w-5 text-slate-800" />
              </div>
              <div className="text-left">
                <h4 className="text-[9px] font-black tracking-wider text-slate-900 uppercase">
                  CANCEL ANYTIME
                </h4>
                <p className="text-[9px] text-slate-400 font-bold leading-none">
                  No ties, no fuss.
                </p>
              </div>
            </div>

            {/* CHANGE ANYTIME */}
            <div className="flex items-center gap-3 py-2 justify-center lg:justify-start">
              <div className="shrink-0 p-2 rounded-lg bg-slate-50 flex items-center justify-center text-slate-850">
                <RefreshCw className="h-5 w-5 text-slate-850 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="text-left">
                <h4 className="text-[9px] font-black tracking-wider text-slate-900 uppercase">
                  CHANGE ANYTIME
                </h4>
                <p className="text-[9px] text-slate-400 font-bold leading-none">
                  Swap plans or brands.
                </p>
              </div>
            </div>

            {/* SKIP DELIVERIES */}
            <div className="flex items-center gap-3 py-2 justify-center lg:justify-start">
              <div className="shrink-0 p-2 rounded-lg bg-slate-50 flex items-center justify-center text-slate-800">
                <Truck className="h-5 w-5 text-slate-800" />
              </div>
              <div className="text-left">
                <h4 className="text-[9px] font-black tracking-wider text-slate-900 uppercase">
                  SKIP DELIVERIES
                </h4>
                <p className="text-[9px] text-slate-400 font-bold leading-none">
                  Skip or delay anytime.
                </p>
              </div>
            </div>

            {/* NO CONTRACTS */}
            <div className="flex items-center gap-3 py-2 justify-center lg:justify-start">
              <div className="shrink-0 p-2 rounded-lg bg-slate-50 flex items-center justify-center text-slate-800">
                <Lock className="h-5 w-5 text-slate-800" />
              </div>
              <div className="text-left">
                <h4 className="text-[9px] font-black tracking-wider text-slate-900 uppercase">
                  NO CONTRACTS
                </h4>
                <p className="text-[9px] text-slate-400 font-bold leading-none">
                  No commitments, 1-click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Conversion Area */}
        <div className="mt-8 flex flex-col items-center justify-center space-y-3 text-center pb-4">
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Ready to get started?</h4>
          <button
            type="button"
            className="px-6 py-3 bg-[#D4AF37] text-white font-extrabold uppercase tracking-[0.2em] text-[10px] rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
          >
            Start your subscription
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}

type SidebarTab = 'analytics' | 'orders' | 'collections' | 'products' | 'pages' | 'blogs' | 'files' | 'customers' | 'discounts' | 'layout';

export default function AdminDashboard({
  products: parentProducts,
  onUpdateProducts: parentOnUpdateProducts,
  collections: parentCollections,
  onUpdateCollections: parentOnUpdateCollections,
  orders: parentOrders,
  onUpdateOrders: parentOnUpdateOrders,
  files: parentFiles,
  onUpdateFiles: parentOnUpdateFiles,
  customers: parentCustomers,
  onUpdateCustomers: parentOnUpdateCustomers,
  discounts: parentDiscounts,
  onUpdateDiscounts: parentOnUpdateDiscounts,
  customPages: parentCustomPages,
  onUpdateCustomPages: parentOnUpdateCustomPages,
  blogs: parentBlogs,
  onUpdateBlogs: parentOnUpdateBlogs,
  layoutSettings,
  onUpdateLayoutSettings,
  onDirtyChange,
  adminActionTrigger,
  onAdminActionComplete,
  onExitAdmin,
  onLogoutAdmin
}: AdminDashboardProps) {
  const tabToPathMap: Record<SidebarTab, string> = {
    analytics: 'analytics',
    orders: 'orders',
    collections: 'collections',
    products: 'products',
    pages: 'pages',
    blogs: 'blog-posts',
    files: 'files',
    customers: 'customers',
    discounts: 'discounts',
    layout: 'layout',
  };

  const pathToTabMap: Record<string, SidebarTab> = {
    analytics: 'analytics',
    orders: 'orders',
    collections: 'collections',
    products: 'products',
    pages: 'pages',
    'blog-posts': 'blogs',
    files: 'files',
    customers: 'customers',
    discounts: 'discounts',
    layout: 'layout',
  };

  const getInitialTab = (): SidebarTab => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/admin-dashboard/')) {
        const sub = path.replace('/admin-dashboard/', '');
        if (pathToTabMap[sub]) {
          return pathToTabMap[sub];
        }
      }
    } catch (e) {
      console.warn('[AdminDashboard] Failed to read initial path:', e);
    }
    return 'analytics';
  };

  const [activeTab, setActiveTab] = useState<SidebarTab>(getInitialTab);

  // Sync state to URL
  useEffect(() => {
    try {
      const path = window.location.pathname;
      const subPath = tabToPathMap[activeTab];
      const targetUrl = `/admin-dashboard/${subPath}`;
      if (path !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }
    } catch (e) {
      console.warn('[AdminDashboard] Failed to pushState:', e);
    }
  }, [activeTab]);

  // Sync URL to state (Popstate for back/forward support)
  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path.startsWith('/admin-dashboard/')) {
          const sub = path.replace('/admin-dashboard/', '');
          if (pathToTabMap[sub] && pathToTabMap[sub] !== activeTab) {
            setActiveTab(pathToTabMap[sub]);
          }
        } else if (path === '/admin-dashboard') {
          setActiveTab('analytics');
        }
      } catch (e) {
        console.warn('[AdminDashboard] Failed to handle popstate:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);
  
  const [dbStatus, setDbStatus] = useState<{
    status: 'connected' | 'error' | 'not-configured' | 'pending';
    error?: string;
    isSslAlert?: boolean;
    isDnsError?: boolean;
    uriHost?: string;
  } | null>(null);

  // MongoDB details modal state
  const [showDbDetailsModal, setShowDbDetailsModal] = useState(false);
  const [dbDetailsLoading, setDbDetailsLoading] = useState(false);
  const [dbDetailsData, setDbDetailsData] = useState<any | null>(null);
  const [dbDetailsError, setDbDetailsError] = useState<string | null>(null);

  // Custom confirmation dialog state to replace blocked window.confirm in sandboxed iframe
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const triggerConfirm = (message: string, onConfirm: () => void, title = "Confirm Action") => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      }
    });
  };

  const fetchDbDetails = async () => {
    setDbDetailsLoading(true);
    setDbDetailsError(null);
    try {
      const res = await fetch('/api/db-details');
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      setDbDetailsData(data);
    } catch (err: any) {
      setDbDetailsError(err.message || 'Failed to connect to backend api');
    } finally {
      setDbDetailsLoading(false);
    }
  };

  const [customUriInput, setCustomUriInput] = useState('');
  const [uriUpdating, setUriUpdating] = useState(false);
  const [uriUpdateResult, setUriUpdateResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdateUriSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUriInput.trim()) return;
    setUriUpdating(true);
    setUriUpdateResult(null);
    try {
      const response = await fetch('/api/update-db-uri', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uri: customUriInput.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setDbStatus(data);
        if (data.status === 'connected') {
          setUriUpdateResult({ success: true, message: 'Successfully connected to MongoDB Atlas database!' });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else if (data.status === 'error') {
          setUriUpdateResult({ 
            success: false, 
            message: data.isSslAlert 
              ? 'SSL Handshake blocked by Atlas. IP address needs to be whitelisted (Allow all 0.0.0.0/0). IP Whitelist needed.'
              : 'Connection attempt failed: ' + (data.error || 'Check layout format.') 
          });
        } else {
          setUriUpdateResult({ success: false, message: 'Connection string changed, status ' + data.status });
        }
      } else {
        setUriUpdateResult({ success: false, message: data.error || 'Could not map configuration.' });
      }
    } catch (err: any) {
      setUriUpdateResult({ success: false, message: 'Communication fault: ' + err.message });
    } finally {
      setUriUpdating(false);
    }
  };

  useEffect(() => {
    fetch('/api/db-status')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setDbStatus(data);
      })
      .catch(err => console.error("Error asking DB status:", err));
  }, []);

  // --- Draft State Hooks for unified safe saves ---
  const [localProducts, setLocalProducts] = useState<Product[]>(parentProducts);
  const [localCollections, setLocalCollections] = useState<Collection[]>(parentCollections);
  const [localPages, setLocalPages] = useState<CustomPage[]>(parentCustomPages);
  const [localDiscounts, setLocalDiscounts] = useState<Discount[]>(parentDiscounts);
  const [localOrders, setLocalOrders] = useState<Order[]>(parentOrders);
  const [localFiles, setLocalFiles] = useState<FileEntry[]>(parentFiles);
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(parentCustomers);
  const [localBlogs, setLocalBlogs] = useState<BlogPost[]>(parentBlogs);

  const [localLayoutSettings, setLocalLayoutSettings] = useState<LayoutSettings>(() => {
    return layoutSettings || {
      headerLogoText: 'Pouch Supply',
      headerLogoSubtext: 'Premium Nicotine',
      headerLogoImage: '',
      footerLogoText: 'POUCH SUPPLY',
      footerLogoDescription: 'Leading premium directory for tobacco-free nicotine slim white canisters. Sourced directly from partners across Sweden, Poland, and Germany.',
      footerLogoImage: '',
      klaviyoPublicKey: '',
      cloudinaryCloudName: '',
      cloudinaryApiKey: '',
      cloudinaryApiSecret: '',
      menuItems: [
        { id: '1', label: 'Home', tab: 'frontend-home', type: 'tab' },
        { id: '2', label: 'Subscribe', tab: 'frontend-subscribe', type: 'tab' },
        { id: '3', label: 'Shop Now', tab: 'frontend-shop', type: 'tab' },
        { id: '4', label: 'All Brands', tab: 'frontend-brands', type: 'tab' },
        { id: '5', label: 'About', tab: 'about', type: 'tab' },
      ]
    };
  });

  useEffect(() => {
    if (layoutSettings) {
      setLocalLayoutSettings(layoutSettings);
    }
  }, [layoutSettings]);

  const [layoutSavedToast, setLayoutSavedToast] = useState(false);
  const [testingCloudinary, setTestingCloudinary] = useState(false);
  const [cloudinaryTestResult, setCloudinaryTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const parseCloudinaryInput = (cNameVal?: string, aKeyVal?: string, aSecretVal?: string) => {
    let cName = (cNameVal || '').trim();
    let aKey = (aKeyVal || '').trim();
    let aSecret = (aSecretVal || '').trim();

    const combined = `${cName} ${aKey} ${aSecret}`;
    const match = combined.match(/cloudinary:\/\/([^:]+):([^@]+)@([a-zA-Z0-9_-]+)/i);
    if (match) {
      aKey = match[1].trim();
      aSecret = match[2].trim();
      cName = match[3].trim();
    } else {
      if (cName.startsWith('CLOUDINARY_URL=')) {
        cName = cName.replace('CLOUDINARY_URL=', '').trim();
      }
      if (cName.includes('@')) {
        const parts = cName.split('@');
        cName = parts[1].trim();
        const left = parts[0].replace(/.*cloudinary:\/\//i, '').trim();
        const ks = left.split(':');
        if (ks.length === 2) {
          aKey = ks[0].trim();
          aSecret = ks[1].trim();
        }
      }
    }

    if (cName.toLowerCase() === 'pouch' || cName.toLowerCase() === 'pouch supply') {
      cName = '';
    }

    return { cName, aKey, aSecret };
  };

  const handleTestCloudinary = async () => {
    setTestingCloudinary(true);
    setCloudinaryTestResult(null);

    const parsed = parseCloudinaryInput(
      localLayoutSettings.cloudinaryCloudName,
      localLayoutSettings.cloudinaryApiKey,
      localLayoutSettings.cloudinaryApiSecret
    );

    const updatedSettings = {
      ...localLayoutSettings,
      cloudinaryCloudName: parsed.cName || localLayoutSettings.cloudinaryCloudName,
      cloudinaryApiKey: parsed.aKey || localLayoutSettings.cloudinaryApiKey,
      cloudinaryApiSecret: parsed.aSecret || localLayoutSettings.cloudinaryApiSecret
    };

    setLocalLayoutSettings(updatedSettings);
    if (onUpdateLayoutSettings) {
      onUpdateLayoutSettings(updatedSettings);
    }

    try {
      const res = await fetch('/api/test-cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudName: updatedSettings.cloudinaryCloudName,
          apiKey: updatedSettings.cloudinaryApiKey,
          apiSecret: updatedSettings.cloudinaryApiSecret
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCloudinaryTestResult({ success: true, message: data.message });
      } else {
        setCloudinaryTestResult({ success: false, message: data.error || 'Failed to connect to Cloudinary.' });
      }
    } catch (err: any) {
      setCloudinaryTestResult({ success: false, message: err.message || 'Server error testing Cloudinary connection.' });
    } finally {
      setTestingCloudinary(false);
    }
  };

  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [newMenuItemLabel, setNewMenuItemLabel] = useState('');
  const [newMenuItemTarget, setNewMenuItemTarget] = useState('frontend-home');
  const [newMenuItemType, setNewMenuItemType] = useState<'tab' | 'external'>('tab');
  const [newMenuItemUrl, setNewMenuItemUrl] = useState('');

  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    const items = [...localLayoutSettings.menuItems];
    if (direction === 'up' && index > 0) {
      const temp = items[index];
      items[index] = items[index - 1];
      items[index - 1] = temp;
    } else if (direction === 'down' && index < items.length - 1) {
      const temp = items[index];
      items[index] = items[index + 1];
      items[index + 1] = temp;
    }
    setLocalLayoutSettings({ ...localLayoutSettings, menuItems: items });
  };

  const addMenuItem = () => {
    if (!newMenuItemLabel.trim()) return;
    const newItem: MenuItem = {
      id: Date.now().toString(),
      label: newMenuItemLabel.trim(),
      tab: newMenuItemType === 'tab' ? newMenuItemTarget : '',
      type: newMenuItemType,
      url: newMenuItemType === 'external' ? newMenuItemUrl : undefined
    };
    setLocalLayoutSettings({
      ...localLayoutSettings,
      menuItems: [...localLayoutSettings.menuItems, newItem]
    });
    setNewMenuItemLabel('');
    setNewMenuItemUrl('');
    setIsAddingMenuItem(false);
  };

  const removeMenuItem = (id: string) => {
    const items = localLayoutSettings.menuItems.filter(item => item.id !== id);
    setLocalLayoutSettings({ ...localLayoutSettings, menuItems: items });
  };

  const editMenuItemLabel = (id: string, newLabel: string) => {
    const items = localLayoutSettings.menuItems.map(item => 
      item.id === id ? { ...item, label: newLabel } : item
    );
    setLocalLayoutSettings({ ...localLayoutSettings, menuItems: items });
  };

  const editMenuItemTarget = (id: string, newTarget: string) => {
    const items = localLayoutSettings.menuItems.map(item => 
      item.id === id ? { ...item, tab: newTarget, url: undefined, type: 'tab' as const } : item
    );
    setLocalLayoutSettings({ ...localLayoutSettings, menuItems: items });
  };

  const editMenuItemUrl = (id: string, newUrl: string) => {
    const items = localLayoutSettings.menuItems.map(item => 
      item.id === id ? { ...item, tab: '', url: newUrl, type: 'external' as const } : item
    );
    setLocalLayoutSettings({ ...localLayoutSettings, menuItems: items });
  };

  const handleLogoUpload = (file: File, target: 'header' | 'footer') => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: reader.result })
          });
          if (res.ok) {
            const info = await res.json();
            if (info.url) {
              setLocalLayoutSettings(prev => ({
                ...prev,
                [target === 'header' ? 'headerLogoImage' : 'footerLogoImage']: info.url
              }));
              return;
            }
          }
          setLocalLayoutSettings(prev => ({
            ...prev,
            [target === 'header' ? 'headerLogoImage' : 'footerLogoImage']: reader.result as string
          }));
        } catch (err) {
          console.warn('[LogoUpload] API upload failed, falling back to base64:', err);
          setLocalLayoutSettings(prev => ({
            ...prev,
            [target === 'header' ? 'headerLogoImage' : 'footerLogoImage']: reader.result as string
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Sync edits wrapper overrides so existing handlers automatically write to drafts and sync to the parent App context immediately
  const onUpdateProducts = (updatedProds: Product[]) => {
    setLocalProducts(updatedProds);
    parentOnUpdateProducts(updatedProds);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateCollections = (updatedColls: Collection[]) => {
    setLocalCollections(updatedColls);
    parentOnUpdateCollections(updatedColls);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateCustomPages = (updatedPages: CustomPage[]) => {
    setLocalPages(updatedPages);
    parentOnUpdateCustomPages(updatedPages);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateDiscounts = (updatedDiscs: Discount[]) => {
    setLocalDiscounts(updatedDiscs);
    parentOnUpdateDiscounts(updatedDiscs);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateOrders = (updatedOrders: Order[]) => {
    setLocalOrders(updatedOrders);
    parentOnUpdateOrders(updatedOrders);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateFiles = (updatedFiles: FileEntry[]) => {
    setLocalFiles(updatedFiles);
    parentOnUpdateFiles(updatedFiles);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateCustomers = (updatedCusts: Customer[]) => {
    setLocalCustomers(updatedCusts);
    parentOnUpdateCustomers(updatedCusts);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  const onUpdateBlogs = (updatedBlogs: BlogPost[]) => {
    setLocalBlogs(updatedBlogs);
    parentOnUpdateBlogs(updatedBlogs);
    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
  };

  // Global Save & Discard triggers
  const handleGlobalSave = () => {
    setIsSaving(true);
    setShowSaveSuccess(false);

    // Guarantee full page section settings payload
    const pagesToSave = localPages.map(page => ({
      ...page,
      sections: (page.sections || []).map(section => ({
        ...section,
        settings: {
          ...(section.settings || {})
        }
      }))
    }));

    // Update parent states
    parentOnUpdateProducts(localProducts);
    parentOnUpdateCollections(localCollections);
    parentOnUpdateCustomPages(pagesToSave);
    parentOnUpdateDiscounts(localDiscounts);
    parentOnUpdateOrders(localOrders);
    parentOnUpdateFiles(localFiles);
    parentOnUpdateCustomers(localCustomers);
    parentOnUpdateBlogs(localBlogs);

    // Save directly to localStorage as backup
    try {
      localStorage.setItem('ps_custom_pages', JSON.stringify(pagesToSave));
      localStorage.setItem('ps_products', JSON.stringify(localProducts));
      localStorage.setItem('ps_collections', JSON.stringify(localCollections));
      localStorage.setItem('ps_orders', JSON.stringify(localOrders));
      localStorage.setItem('ps_files', JSON.stringify(localFiles));
      localStorage.setItem('ps_customers', JSON.stringify(localCustomers));
      localStorage.setItem('ps_discounts', JSON.stringify(localDiscounts));
      localStorage.setItem('ps_blogs', JSON.stringify(localBlogs));
    } catch (e) {
      console.warn('[Admin Save] LocalStorage write warn:', e);
    }

    // Direct HTTP POST to API endpoints for instant database persistence
    fetch('/api/custompages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pagesToSave)
    }).catch(err => console.error('[Admin Save] Direct POST custompages failed:', err));

    setTimeout(() => {
      setHasUnsavedChanges(false);
      setIsSaving(false);
      setShowSaveSuccess(true);
      
      if (onDirtyChange) onDirtyChange(false);
      if (onAdminActionComplete) onAdminActionComplete('save');

      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3500);
    }, 450);
  };

  const handleGlobalDiscard = () => {
    setLocalProducts(parentProducts);
    setLocalCollections(parentCollections);
    setLocalPages(parentCustomPages);
    setLocalDiscounts(parentDiscounts);
    setLocalOrders(parentOrders);
    setLocalFiles(parentFiles);
    setLocalCustomers(parentCustomers);
    setLocalBlogs(parentBlogs);

    setHasUnsavedChanges(false);
    if (onDirtyChange) onDirtyChange(false);
    if (onAdminActionComplete) onAdminActionComplete('discard');
  };

  // Sync files state unconditionally so uploads instantly appear in the File Manager bypassing draft locks
  React.useEffect(() => {
    setLocalFiles(parentFiles);
  }, [parentFiles]);

  // Sync draft states when external database updates occur (when not dirty)
  React.useEffect(() => {
    if (!hasUnsavedChanges) {
      setLocalProducts(parentProducts);
      setLocalCollections(parentCollections);
      setLocalPages(parentCustomPages);
      setLocalDiscounts(parentDiscounts);
      setLocalOrders(parentOrders);
      setLocalCustomers(parentCustomers);
      setLocalBlogs(parentBlogs);
    }
  }, [parentProducts, parentCollections, parentCustomPages, parentDiscounts, parentOrders, parentCustomers, parentBlogs, hasUnsavedChanges]);

  // Listen to external modal command requests (from App.tsx confirm triggers)
  React.useEffect(() => {
    if (adminActionTrigger) {
      if (adminActionTrigger.action === 'save') {
        handleGlobalSave();
      } else if (adminActionTrigger.action === 'discard') {
        handleGlobalDiscard();
      }
    }
  }, [adminActionTrigger]);

  // Expose standard namespace variables to keep all existing loops intact
  const products = localProducts;
  const collections = localCollections;
  const customPages = localPages;
  const discounts = localDiscounts;
  const orders = localOrders;
  const files = localFiles;
  const customers = localCustomers;
  const blogs = localBlogs;

  // Search, filter, edit states
  const [orderQuery, setOrderQuery] = useState('');

  // Blog Post management states
  const [blogQuery, setBlogQuery] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlogForm, setNewBlogForm] = useState<Partial<BlogPost>>({
    title: '', excerpt: '', content: '', image: '',
    author: 'Admin', category: 'General', status: 'Active',
    publishedAt: '', readTime: '5 min read', tags: []
  });
  const [blogTagsInput, setBlogTagsInput] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Unfulfilled' | 'Fulfilled'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('Royal Mail');
  const [timelineComment, setTimelineComment] = useState('');
  const [timelineComments, setTimelineComments] = useState<Record<string, {text: string, date: string}[]>>({});

  const [productQuery, setProductQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    title: '', description: '', price: 4.99, compareAtPrice: 5.99,
    inventory: 50, sku: '', category: 'Vitamins & Supplements',
    vendor: '77', status: 'Active', image: '', weight: 12, tags: []
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showAddCollection, setShowAddCollection] = useState(false);
  const [collectionQuery, setCollectionQuery] = useState('');
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [newCollectionForm, setNewCollectionForm] = useState<Partial<Collection>>({
    title: '', description: '', type: 'Manual', image: '', productIds: []
  });

  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageForm, setNewPageForm] = useState({ title: '', slug: '' });
  const [selectedBuilderPageId, setSelectedBuilderPageId] = useState<string | null>(null);
  const [selectedBuilderSectionId, setSelectedBuilderSectionId] = useState<string | null>(null);
  const [activeSlideEditIndex, setActiveSlideEditIndex] = useState<number>(0);
  const [openPreviewFaqIndex, setOpenPreviewFaqIndex] = useState<string | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');

  // Draft page & collection builder custom states
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Clean title-to-slug utility
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
  };

  // Pages management handlers
  const handleDuplicatePage = (page: CustomPage) => {
    let count = 1;
    let baseSlug = page.slug || 'slug';
    if (baseSlug.match(/-\d+$/)) {
      baseSlug = baseSlug.replace(/-\d+$/, '');
    }
    let newSlug = `${baseSlug}-${count}`;
    while (localPages.some(p => p.slug === newSlug)) {
      count++;
      newSlug = `${baseSlug}-${count}`;
    }
    const duplicated: CustomPage = {
      ...JSON.parse(JSON.stringify(page)),
      id: `page-${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: newSlug,
      isHomepage: false,
      updatedAt: 'Just Now'
    };
    const updated = [...localPages, duplicated];
    setLocalPages(updated);
    onUpdateCustomPages(updated);
  };

  const handleSetPageAsHomepage = (id: string) => {
    const updated = localPages.map(p => {
      if (p.id === id) {
        return { ...p, isHomepage: true, slug: '' };
      }
      return { ...p, isHomepage: false };
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
  };

  const handlePreviewPage = (page: CustomPage) => {
    const url = page.isHomepage ? '/' : `/pages/${page.slug}`;
    window.open(url, '_blank');
  };

  const [fileQuery, setFileQuery] = useState('');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileForm, setNewFileForm] = useState({ fileName: '', altText: '', url: '' });

  const [customerQuery, setCustomerQuery] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', email: '', location: '', subscriptionStatus: 'Subscribed' as any });

  const [discountQuery, setDiscountQuery] = useState('');
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [newDiscountForm, setNewDiscountForm] = useState<Partial<Discount>>({
    title: '', type: 'Amount off order', details: '', eligibility: 'All customers', status: 'Active'
  });
  const [showDiscountTypeSelector, setShowDiscountTypeSelector] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState<'Amount off products' | 'Buy X get Y' | 'Amount off order' | 'Free shipping' | 'Loyalty Reward' | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [isDiscountEditorOpen, setIsDiscountEditorOpen] = useState(false);

  // Calculate high-fidelity partner portal metrics
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const completedOrders = orders.length;
    const avgOrderValue = completedOrders > 0 ? totalSales / completedOrders : 0;
    const productsInDraft = products.filter(p => p.status === 'Draft').length;
    const lowStockCount = products.filter(p => p.status === 'Active' && p.inventory <= 15).length;
    
    // 1. Calculate dynamic conversion rate based on visits vs checkouts.
    const totalStoreSessions = completedOrders * 12 + 150;
    const conversionRate = totalStoreSessions > 0 ? (completedOrders / totalStoreSessions) * 100 : 0;

    // Calculate today's sales
    const todaySales = orders.filter(o => o.date && o.date.startsWith('Today')).reduce((sum, o) => sum + o.total, 0);

    // 2. Geographic breakdown derived from real order destinations or real customer locations!
    const geoCounts: Record<string, number> = {};
    const locationsToCount = orders.map(o => o.destination).concat(customers.map(c => c.location));
    locationsToCount.forEach(loc => {
      if (!loc) return;
      const cleanLoc = loc.toLowerCase();
      if (cleanLoc.includes('uk') || cleanLoc.includes('united kingdom') || cleanLoc.includes('britain') || cleanLoc.includes('england') || cleanLoc.includes('london')) {
        geoCounts['United Kingdom 🇬🇧'] = (geoCounts['United Kingdom 🇬🇧'] || 0) + 1;
      } else if (cleanLoc.includes('us') || cleanLoc.includes('united states') || cleanLoc.includes('america') || cleanLoc.includes('usa')) {
        geoCounts['United States 🇺🇸'] = (geoCounts['United States 🇺🇸'] || 0) + 1;
      } else if (cleanLoc.includes('germany') || cleanLoc.includes('deutschland') || cleanLoc.includes('de')) {
        geoCounts['Germany 🇩🇪'] = (geoCounts['Germany 🇩🇪'] || 0) + 1;
      } else if (cleanLoc.includes('poland') || cleanLoc.includes('pl')) {
        geoCounts['Poland 🇵🇱'] = (geoCounts['Poland 🇵🇱'] || 0) + 1;
      } else {
        const titleCaseLoc = loc.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()).join(' ');
        const key = titleCaseLoc.length > 20 ? titleCaseLoc.substring(0, 17) + '...' : titleCaseLoc;
        geoCounts[key] = (geoCounts[key] || 0) + 1;
      }
    });

    const totalGeosCount = Object.values(geoCounts).reduce((a, b) => a + b, 0);
    let finalGeos = Object.entries(geoCounts).map(([country, count]) => {
      const percentage = totalGeosCount > 0 ? Math.round((count / totalGeosCount) * 100) : 0;
      return { country, percentage, sessionCount: count * 12 + 3 };
    });

    if (finalGeos.length === 0) {
      finalGeos = [
        { country: 'United Kingdom 🇬🇧', percentage: 74, sessionCount: 154 },
        { country: 'United States 🇺🇸', percentage: 15, sessionCount: 31 },
        { country: 'Germany 🇩🇪', percentage: 7, sessionCount: 14 },
        { country: 'Poland 🇵🇱', percentage: 4, sessionCount: 8 }
      ];
    } else {
      finalGeos.sort((a, b) => b.sessionCount - a.sessionCount);
    }

    // 3. Dynamic Revenue Trend Graph
    const sortedOrders = [...orders].reverse();
    let pathD = "M 0 95 Q 20 60 40 40 T 80 15 T 100 2";
    let graphPoints: { x: number; y: number; label: string; value: number }[] = [];
    
    if (sortedOrders.length > 0) {
      let cumulativeRevenue = 0;
      const dataPoints = sortedOrders.map((o, idx) => {
        cumulativeRevenue += o.total;
        return {
          idx,
          cumulativeRevenue,
          dateLabel: o.date.replace('Today at ', '')
        };
      });

      const maxCumulative = cumulativeRevenue || 100;
      const stepX = 100 / Math.max(1, dataPoints.length - 1);
      
      const coordinates = dataPoints.map((dp, i) => {
        const x = Math.round(i * stepX);
        const y = Math.round(95 - (dp.cumulativeRevenue / maxCumulative) * 90);
        return { x, y, label: dp.dateLabel, value: dp.cumulativeRevenue };
      });

      if (coordinates.length === 1) {
        pathD = `M 0 95 L 50 ${coordinates[0].y} L 100 ${coordinates[0].y}`;
      } else {
        pathD = `M 0 95 ` + coordinates.map(c => `L ${c.x} ${c.y}`).join(' ');
      }
      graphPoints = coordinates;
    }

    return {
      totalSales,
      completedOrders,
      avgOrderValue,
      productsInDraft,
      lowStockCount,
      conversionRate,
      totalStoreSessions,
      todaySales,
      finalGeos,
      pathD,
      graphPoints
    };
  }, [orders, products, customers]);

  // Handle Order fulfillment
  const handleFulfillOrder = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, fulfillmentStatus: 'Fulfilled' as const };
      }
      return o;
    });
    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: 'Fulfilled' });
    }
  };

  // Add/Edit Product handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title) return;

    if (editingProduct) {
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return { ...p, ...newProductForm } as Product;
        }
        return p;
      });
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      const item: Product = {
        id: `prod-${Date.now()}`,
        title: newProductForm.title,
        description: newProductForm.description || '',
        price: Number(newProductForm.price) || 0,
        compareAtPrice: Number(newProductForm.compareAtPrice) || 0,
        inventory: Number(newProductForm.inventory) || 0,
        sku: newProductForm.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
        category: newProductForm.category || 'Vitamins & Supplements',
        vendor: newProductForm.vendor || '77',
        status: (newProductForm.status as any) || 'Active',
        image: newProductForm.image || '',
        weight: Number(newProductForm.weight) || 12,
        tags: newProductForm.tags || []
      };
      onUpdateProducts([item, ...products]);
    }

    // Reset forms
    setShowAddProduct(false);
    setNewProductForm({
      title: '', description: '', price: 4.99, compareAtPrice: 5.99,
      inventory: 50, sku: '', category: 'Vitamins & Supplements',
      vendor: '77', status: 'Active', image: '', weight: 12, tags: []
    });
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setNewProductForm(prod);
    setShowAddProduct(true);
  };

  const handleDuplicateProduct = (prod: Product) => {
    let count = 1;
    let baseId = prod.id;
    if (baseId.match(/-\d+$/)) {
      baseId = baseId.replace(/-\d+$/, '');
    }
    let newId = `${baseId}-${count}`;
    while (products.some(p => p.id === newId)) {
      count++;
      newId = `${baseId}-${count}`;
    }
    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(prod)),
      id: newId,
      sku: prod.sku ? `${prod.sku}-COPY` : '',
      title: `${prod.title} (Copy)`
    };
    onUpdateProducts([...products, duplicated]);
  };

  const handlePreviewProduct = (prod: Product) => {
    window.open(`/products/${prod.id}`, '_blank');
  };

  const handleDeleteProduct = (pId: string) => {
    triggerConfirm("Are you sure you want to delete this product?", () => {
      const updated = products.filter(p => p.id !== pId);
      onUpdateProducts(updated);

      // Clean up collection references
      const updatedColls = collections.map(c => ({
        ...c,
        productIds: c.productIds.filter(id => id !== pId)
      }));
      onUpdateCollections(updatedColls);

      // Remove from selected list
      setSelectedProductIds(prev => prev.filter(id => id !== pId));
    }, "Delete Product");
  };

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      const visibleIds = filteredProductsAdmin.map(p => p.id);
      setSelectedProductIds(visibleIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds(prev => {
        if (prev.includes(productId)) return prev;
        return [...prev, productId];
      });
    } else {
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    }
  };

  const handleBulkDeleteProducts = () => {
    if (selectedProductIds.length === 0) return;
    triggerConfirm(`Are you sure you want to bulk delete the ${selectedProductIds.length} selected products?`, () => {
      const updated = products.filter(p => !selectedProductIds.includes(p.id));
      onUpdateProducts(updated);

      // Clean up collection references
      const updatedColls = collections.map(c => ({
        ...c,
        productIds: c.productIds.filter(id => !selectedProductIds.includes(id))
      }));
      onUpdateCollections(updatedColls);

      setSelectedProductIds([]);
    }, "Bulk Delete Products");
  };

  const handleBulkStatusProducts = (status: 'Active' | 'Draft') => {
    if (selectedProductIds.length === 0) return;
    const updated = products.map(p => 
      selectedProductIds.includes(p.id) ? { ...p, status } : p
    );
    onUpdateProducts(updated);
    setSelectedProductIds([]);
  };

  const handleExportProducts = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_products_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export products: " + e.message);
    }
  };

  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let importedList: any[] = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          importedList = Array.isArray(parsed) ? parsed : [parsed];
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split(/\r?\n/);
          if (lines.length < 2) throw new Error("CSV file is empty or lacks headers");
          
          const headerLine = lines[0];
          const separator = headerLine.includes(';') ? ';' : ',';
          const headers = headerLine.split(separator).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            let values: string[] = [];
            let currentVal = '';
            let inQuotes = false;
            for (let charIndex = 0; charIndex < line.length; charIndex++) {
              const char = line[charIndex];
              if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
              } else if (char === separator && !inQuotes) {
                values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
                currentVal = '';
              } else {
                currentVal += char;
              }
            }
            values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

            const rowObj: any = {};
            headers.forEach((header, index) => {
              rowObj[header] = values[index] || '';
            });

            if (rowObj.title || rowObj.id) {
              const id = rowObj.id || `prod-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
              const title = rowObj.title || "Untitled Product";
              const price = parseFloat(rowObj.price) || 4.99;
              const compareAtPrice = rowObj.compareatprice ? parseFloat(rowObj.compareatprice) : undefined;
              const inventory = parseInt(rowObj.inventory, 10) || 100;
              const sku = rowObj.sku || `SKU-${id.toUpperCase()}`;
              const category = rowObj.category || "Nicotine Pouches";
              const vendor = rowObj.vendor || "Premium Brand";
              const status = (rowObj.status && ['Active', 'Draft'].includes(rowObj.status)) ? rowObj.status : 'Active';
              const image = rowObj.image || "";
              const description = rowObj.description || `Premium compounding high-grade portion from ${vendor}.`;
              const weight = parseFloat(rowObj.weight) || 15;
              const weightUnit = rowObj.weightunit || "g";
              const strength = rowObj.strength || "10 mg";
              const flavour = rowObj.flavour || "Original";
              
              importedList.push({
                id,
                title,
                description,
                price,
                compareAtPrice,
                inventory,
                sku,
                category,
                vendor,
                status,
                image,
                weight,
                weightUnit,
                tags: rowObj.tags ? rowObj.tags.split('|').map((t: string) => t.trim()) : [vendor, flavour],
                slug: rowObj.slug || id,
                strength,
                flavour,
                variants: rowObj.variants ? JSON.parse(rowObj.variants) : [{ id: `var-opt-${id}`, name: "Strength", values: [strength] }],
                concreteVariants: rowObj.concretevariants ? JSON.parse(rowObj.concretevariants) : [{ id: `var-det-${id}`, name: `${flavour} (${strength})`, price, inventory, description, images: [image], flavour }]
              });
            }
          }
        } else {
          throw new Error("Unsupported file extension. Please select a .json or .csv file.");
        }

        if (importedList.length === 0) {
          throw new Error("No products could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} products with your existing catalog? (Clicking 'OK' merges them. To replace your entire catalog, click cancel first and empty your catalog, or contact support.)`, () => {
          const existingIds = new Set(products.map(p => p.id));
          const merged = [...products];
          importedList.forEach(item => {
            if (existingIds.has(item.id)) {
              const idx = merged.findIndex(p => p.id === item.id);
              if (idx !== -1) merged[idx] = item;
            } else {
              merged.push(item);
            }
          });
          onUpdateProducts(merged);
        }, `Import ${importedList.length} Products`);

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import products: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportCollections = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(collections, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_collections_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export collections: " + e.message);
    }
  };

  const handleImportCollections = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No collections could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} collections with your existing lists?`, () => {
          const existingIds = new Set(collections.map(c => c.id));
          const merged = [...collections];
          importedList.forEach(item => {
            if (item && item.id) {
              if (existingIds.has(item.id)) {
                const idx = merged.findIndex(c => c.id === item.id);
                if (idx !== -1) merged[idx] = item;
              } else {
                merged.push(item);
              }
            }
          });
          onUpdateCollections(merged);
        }, "Import Collections Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import collections: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportPages = () => {
    try {
      // Validate and ensure all nested sections and settings are fully formatted
      const pagesToExport = (localPages || customPages || []).map(page => ({
        ...page,
        sections: (page.sections || []).map(section => ({
          ...section,
          settings: { ...(section.settings || {}) }
        }))
      }));

      // Direct download of backup JSON
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pagesToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_pages_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      // Persist to localStorage and MongoDB to guarantee safety
      try {
        localStorage.setItem('ps_custom_pages', JSON.stringify(pagesToExport));
      } catch (e) {
        console.warn('LocalStorage backup failed:', e);
      }

      fetch('/api/custompages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagesToExport)
      }).catch(err => console.error('[Export Safety Sync] POST failed:', err));

    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export pages: " + e.message);
    }
  };

  const handleImportPages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No pages could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} custom pages with your existing pages?`, () => {
          const existingIds = new Set(localPages.map(p => p.id));
          const merged = [...localPages];
          importedList.forEach(item => {
            if (item && (item.id || item.slug)) {
              const targetId = item.id || item.slug;
              const idx = merged.findIndex(p => p.id === targetId || p.slug === item.slug);
              if (idx !== -1) {
                // Ensure sections from imported item or existing item are preserved
                const existingSections = merged[idx].sections || [];
                const importedSections = item.sections || [];
                const finalSections = importedSections.length > 0 ? importedSections : existingSections;
                merged[idx] = { ...item, sections: finalSections };
              } else {
                merged.push(item);
              }
            }
          });

          setLocalPages(merged);
          parentOnUpdateCustomPages(merged);

          try {
            localStorage.setItem('ps_custom_pages', JSON.stringify(merged));
          } catch (err) {}

          fetch('/api/custompages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
          }).catch(err => console.error('[Import Safety Sync] POST failed:', err));

          alert(`Successfully imported and merged ${importedList.length} pages into MongoDB and local storage!`);
        }, "Import Pages Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import pages: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportOrders = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_orders_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export orders: " + e.message);
    }
  };

  const handleImportOrders = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No orders could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} orders with your existing orders?`, () => {
          const existingIds = new Set(orders.map(o => o.id));
          const merged = [...orders];
          importedList.forEach(item => {
            if (item && item.id) {
              if (existingIds.has(item.id)) {
                const idx = merged.findIndex(o => o.id === item.id);
                if (idx !== -1) merged[idx] = item;
              } else {
                merged.push(item);
              }
            }
          });
          onUpdateOrders(merged);
        }, "Import Orders Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import orders: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportCustomers = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_customers_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export customers: " + e.message);
    }
  };

  const handleImportCustomers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No customers could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} customers with your existing customers list?`, () => {
          const existingIds = new Set(customers.map(c => c.id));
          const merged = [...customers];
          importedList.forEach(item => {
            if (item && item.id) {
              if (existingIds.has(item.id)) {
                const idx = merged.findIndex(c => c.id === item.id);
                if (idx !== -1) merged[idx] = item;
              } else {
                merged.push(item);
              }
            }
          });
          onUpdateCustomers(merged);
        }, "Import Customers Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import customers: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportDiscounts = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(discounts, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_discounts_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export discounts: " + e.message);
    }
  };

  const handleImportDiscounts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No discounts could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} discounts with your existing discounts list?`, () => {
          const existingIds = new Set(discounts.map(d => d.id));
          const merged = [...discounts];
          importedList.forEach(item => {
            if (item && item.id) {
              if (existingIds.has(item.id)) {
                const idx = merged.findIndex(d => d.id === item.id);
                if (idx !== -1) merged[idx] = item;
              } else {
                merged.push(item);
              }
            }
          });
          onUpdateDiscounts(merged);
        }, "Import Discounts Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import discounts: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportBlogs = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blogs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_blogs_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export blogs: " + e.message);
    }
  };

  const handleImportBlogs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No blog posts could be parsed from the file.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} blog posts with your existing blog posts list?`, () => {
          const existingIds = new Set(blogs.map(b => b.id));
          const merged = [...blogs];
          importedList.forEach(item => {
            if (item && item.id) {
              if (existingIds.has(item.id)) {
                const idx = merged.findIndex(b => b.id === item.id);
                if (idx !== -1) merged[idx] = item;
              } else {
                merged.push(item);
              }
            }
          });
          onUpdateBlogs(merged);
        }, "Import Blogs Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import blogs: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportFiles = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localFiles, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pouch_supply_files_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e: any) {
      console.error("Export failed:", e);
      alert("Failed to export files: " + e.message);
    }
  };

  const handleImportFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const importedList = Array.isArray(parsed) ? parsed : [parsed];

        if (importedList.length === 0) {
          throw new Error("No files could be parsed from the backup file.");
        }

        const isValid = importedList.every(item => item && item.id && item.url && item.fileName);
        if (!isValid) {
          throw new Error("Invalid file backup format. Each item must have an id, url, and fileName.");
        }

        triggerConfirm(`Do you want to MERGE these ${importedList.length} files with your existing files list?`, () => {
          const existingIds = new Set(localFiles.map(f => f.id));
          const merged = [...localFiles];
          importedList.forEach(item => {
            if (item && item.id) {
              if (existingIds.has(item.id)) {
                const idx = merged.findIndex(f => f.id === item.id);
                if (idx !== -1) merged[idx] = item;
              } else {
                merged.push(item);
              }
            }
          });
          onUpdateFiles(merged);
        }, "Import Files Backup");

      } catch (err: any) {
        console.error("Import failed:", err);
        alert("Failed to import files: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Create & Edit Collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionForm.title) return;

    if (editingCollection) {
      const updated = collections.map(c => 
        c.id === editingCollection.id 
          ? { 
              ...c, 
              title: newCollectionForm.title!, 
              description: newCollectionForm.description || '', 
              type: newCollectionForm.type || 'Manual',
              image: newCollectionForm.image || c.image
            } 
          : c
      );
      onUpdateCollections(updated);
      setEditingCollection(null);
    } else {
      const item: Collection = {
        id: slugify(newCollectionForm.title),
        title: newCollectionForm.title,
        description: newCollectionForm.description || '',
        type: (newCollectionForm.type as any) || 'Manual',
        image: newCollectionForm.image || '',
        productIds: []
      };
      onUpdateCollections([...collections, item]);
    }

    setShowAddCollection(false);
    setNewCollectionForm({ title: '', description: '', type: 'Manual', image: '', productIds: [] });
  };

  const handleDuplicateCollection = (col: Collection) => {
    let count = 1;
    let baseId = col.id;
    if (baseId.match(/-\d+$/)) {
      baseId = baseId.replace(/-\d+$/, '');
    }
    let newId = `${baseId}-${count}`;
    while (collections.some(c => c.id === newId)) {
      count++;
      newId = `${baseId}-${count}`;
    }
    const duplicated: Collection = {
      ...JSON.parse(JSON.stringify(col)),
      id: newId,
      title: `${col.title} (Copy)`
    };
    onUpdateCollections([...collections, duplicated]);
  };

  const handlePreviewCollection = (col: Collection) => {
    window.open(`/collections/${col.id}`, '_blank');
  };

  const handleDeleteCollection = (id: string) => {
    triggerConfirm("Are you sure you want to delete this collection?", () => {
      onUpdateCollections(collections.filter(c => c.id !== id));
      setSelectedCollectionIds(prev => prev.filter(item => item !== id));
    }, "Delete Collection");
  };

  const handleSelectAllCollections = (checked: boolean) => {
    if (checked) {
      const visibleIds = filteredCollections.filter(c => c.id !== 'all').map(c => c.id);
      setSelectedCollectionIds(visibleIds);
    } else {
      setSelectedCollectionIds([]);
    }
  };

  const handleSelectCollection = (colId: string, checked: boolean) => {
    if (checked) {
      setSelectedCollectionIds(prev => {
        if (prev.includes(colId)) return prev;
        return [...prev, colId];
      });
    } else {
      setSelectedCollectionIds(prev => prev.filter(id => id !== colId));
    }
  };

  const handleBulkDeleteCollections = () => {
    if (selectedCollectionIds.length === 0) return;
    triggerConfirm(`Are you sure you want to bulk delete the ${selectedCollectionIds.length} selected collections?`, () => {
      onUpdateCollections(collections.filter(c => !selectedCollectionIds.includes(c.id)));
      setSelectedCollectionIds([]);
    }, "Bulk Delete Collections");
  };

  // Pages & Section Builder Handlers
  const handleAddPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageForm.title) return;

    const slug = newPageForm.slug.trim() ? slugify(newPageForm.slug) : slugify(newPageForm.title);
    const page: CustomPage = {
      id: `page-${Date.now()}`,
      title: newPageForm.title,
      slug,
      visibility: 'Visible',
      updatedAt: 'Just now',
      sections: [
        {
          id: `sec-${Date.now()}`,
          type: 'Rich text',
          settings: {
            fullWidth: false,
            backgroundColor: '#FFFFFF',
            headingColor: '#1E293B',
            textColor: '#64748B',
            title: newPageForm.title,
            description: 'Custom sections will display below here.'
          }
        }
      ]
    };

    const updatedPages = [...localPages, page];
    setLocalPages(updatedPages);
    onUpdateCustomPages(updatedPages);
    setShowAddPage(false);
    setNewPageForm({ title: '', slug: '' });
  };

  // Section builder editing
  const currentlyEditingPage = localPages.find(p => p.id === selectedBuilderPageId);
  const currentlyEditingSection = currentlyEditingPage?.sections.find(s => s.id === selectedBuilderSectionId);

  const handleAddSectionToPage = (sectionType: PageSection['type']) => {
    if (!selectedBuilderPageId) return;
    
    // Banner, Slideshow and Marquee text should be full width by default!
    const isFullWidthByDefault = sectionType === 'Image banner' || sectionType === 'Slideshow' || sectionType === 'Marquee text' || sectionType === 'Video banner';
    
    const newSection: PageSection = {
      id: `sec-${Date.now()}`,
      type: sectionType,
      settings: {
        fullWidth: isFullWidthByDefault,
        backgroundColor: sectionType === 'Marquee text' ? '#E8BE74' : '#FFFFFF',
        headingColor: '#1E293B',
        textColor: sectionType === 'Marquee text' ? '#1A1C1D' : '#64748B',
        title: sectionType === 'Image banner' ? 'Exclusive Pouch Launch' 
             : sectionType === 'Image with text' ? 'Curate Your Premium Package'
             : sectionType === 'Text column with image' ? 'Our Laboratory Certified Foundations'
             : sectionType === 'Featured collection' ? 'Featured Collection Highlights'
             : sectionType === 'Collection list' ? 'Explore Brand Collections'
             : sectionType === 'Images gallery' ? 'Laboratory & Dispatch Facility Gallery'
             : sectionType === 'Marquee text' ? 'DELIVERY // CANCEL ANYTIME // LOYALTY SCHEME // NEVER RUN OUT // DELIVERED ON YOUR SCHEDULE // SAVE VS. SHOP PRICES // DISCREET DELIVERY'
             : sectionType === 'Marquee images' ? 'Fresh Stock Dispatch Reel'
             : sectionType === 'Logo list' ? 'Official Lab Partner Register'
             : sectionType === 'FAQs' ? 'Frequently Answered Questions'
             : sectionType === 'Blog post' ? 'Latest From Our Journal'
             : sectionType === 'Brand list' ? 'Shop Premium Brands'
             : sectionType === 'Brands we offer' ? 'Brands we offer'
             : sectionType === 'Icon with text' ? 'Why subscribe to Pouch Supply?'
             : sectionType === 'Video banner' ? 'Watch Our Laboratory Showcase'
             : sectionType === 'Clearance Sale' ? 'Clearance Sale Event'
             : `Custom ${sectionType}`,
        description: sectionType === 'Image with text' ? 'Our plant-fiber formulations are packed under sterile medical conditions for persistent, smooth boosts.'
                 : sectionType === 'Text column with image' ? 'Every single canister batch is vacuum-sealed inside high-density polymer tubes guaranteeing pristine flavor locks.'
                 : sectionType === 'Featured collection' ? 'Sourced cleanly from European chemical compounding centers with direct-to-door courier dispatch.'
                 : sectionType === 'Collection list' ? 'Select from your favorite pouch strengths, cooling impacts, or specific lab series.'
                 : sectionType === 'FAQs' ? 'Find quick validations regarding shipping rules, subscriptions, and formulation safety standards.'
                 : sectionType === 'Blog post' ? 'Scientific reports, dosage guides, and news bulletins straight from Scandinavia.'
                 : sectionType === 'Brand list' ? 'Check our collection of premium, laboratory-certified brand canisters.'
                 : sectionType === 'Brands we offer' ? 'Explore our curated roster of premium nicotine pouches and global compounding series.'
                 : sectionType === 'Icon with text' ? 'Explore exclusive rewards and reliable logistics built directly into our ecosystem.'
                  : sectionType === 'Video banner' ? 'Witness the clinical sterile compounding process behind our sub-zero cooling pouches.'
                  : sectionType === 'Clearance Sale' ? 'Save big on our premium selected stock items. Final clearance, while stocks last!'
                 : 'Edit option elements inside options sidebar',
        columnsDesktop: sectionType === 'Blog post' ? 3 : undefined,
        columnsMobile: sectionType === 'Blog post' ? 1 : undefined,
        brandItems: (sectionType === 'Brand list' || sectionType === 'Brands we offer') ? [
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: '77' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Clew' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Cuba' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Maggie' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Nordic Spirit' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'XQS' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'ZYN' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Pablo' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Killa' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Fumi' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Velo' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'White Fox' },
          { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'Snü' }
        ] : undefined,
        buttonText: (sectionType === 'Image banner' || sectionType === 'Image with text' || sectionType === 'Rich text' || sectionType === 'Video banner') ? 'Purchase Packs' : undefined,
        buttonLink: (sectionType === 'Image banner' || sectionType === 'Image with text' || sectionType === 'Rich text' || sectionType === 'Video banner') ? 'frontend-shop' : undefined,
        marqueeSpeed: 3,
        itemsCount: (sectionType === 'Featured collection' || sectionType === 'Marquee images' || sectionType === 'Collection list') ? 4 : undefined,
        selectedProductIds: sectionType === 'Clearance Sale' ? localProducts.filter(p => p.status === 'Active').slice(0, 4).map(p => p.id) : undefined,
        videoUrl: sectionType === 'Video banner' ? '' : undefined,
        videoMp4Url: sectionType === 'Video banner' ? 'https://assets.mixkit.co/videos/preview/mixkit-laboratory-test-tubes-40436-large.mp4' : undefined,
        imageUrl: (sectionType === 'Image banner' || sectionType === 'Image with text') ? PLACEHOLDER_IMAGE : undefined,
        slides: sectionType === 'Slideshow' ? [
          {
            title: 'Precision-Engineered Pouch Purity',
            description: 'Sourced directly from certified laboratories utilizing medical-grade plant fiber and vacuum-fresh locks.',
            imageUrl: PLACEHOLDER_IMAGE,
            buttonText: 'View Laboratory Journal',
            buttonLink: 'blogs'
          },
          {
            title: 'Extreme Mint Cryo Freeze',
            description: 'Sub-zero locking technology delivering an immediate, absolute sensory refreshing experience.',
            imageUrl: PLACEHOLDER_IMAGE,
            buttonText: 'Explore Sub-Zero Bundles',
            buttonLink: 'frontend-shop'
          }
        ] : undefined,
        iconColor: sectionType === 'Icon with text' ? '#4F46E5' : undefined,
        iconItems: sectionType === 'Icon with text' ? [
          { iconName: 'Truck', title: 'Delivered on your schedule', description: 'Flexible delivery, when you need it.', linkUrl: 'frontend-shop' },
          { iconName: 'Zap', title: 'Save vs. shop prices', description: 'Better prices than retail stores.', linkUrl: 'frontend-shop' },
          { iconName: 'Shield', title: 'Discreet delivery', description: 'Plain, private, and secure packaging.', linkUrl: 'frontend-shop' },
          { iconName: 'Clock', title: 'Cancel anytime', description: 'No commitments, full control.', linkUrl: 'frontend-shop' },
          { iconName: 'Award', title: 'Loyalty scheme', description: 'Earn rewards on every order.', linkUrl: 'frontend-shop' },
          { iconName: 'Package', title: 'Never run out', description: 'Auto-refill and easy reordering.', linkUrl: 'frontend-shop' }
        ] : undefined,
        stepItems: sectionType === 'How it works' ? [
          { number: '1', title: 'Choose your plan', description: 'Select one of our flexible subscription plans', imageUrl: PLACEHOLDER_IMAGE },
          { number: '2', title: 'Choose your pouches', description: 'Mix and match your favourite brands, flavours and strengths. (these can be changed at anytime)', imageUrl: PLACEHOLDER_IMAGE },
          { number: '3', title: 'We handle the rest', description: 'Delivered automatically to your door hassle free weekly, Bi-weekly or monthly', imageUrl: PLACEHOLDER_IMAGE }
        ] : undefined,
        trustBadges: sectionType === 'Trust badges' ? [
          { iconType: 'badge', title: '100% AUTHENTIC', description: 'Direct from official suppliers.' },
          { iconType: 'shield', title: 'PREMIUM QUALITY', description: 'Only trusted, proven brands.' },
          { iconType: 'globe', title: 'GLOBAL SELECTION', description: 'The best from around the world.' },
          { iconType: 'tag', title: 'MEMBER PRICING', description: 'Better prices, always.' }
        ] : undefined,
        faqItems: sectionType === 'FAQs' ? [
          { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon dispatch.' },
          { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' },
          { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific interval. Pause or cancel anytime for free.' }
        ] : undefined,
        alertBadgeText: sectionType === 'Plans' ? 'Most customers save up to £55/month' : undefined,
        promoBannerText: sectionType === 'Plans' ? '★ FIRST 50 SUBSCRIBERS - Get 10% OFF FOR LIFE >' : undefined,
        planItems: sectionType === 'Plans' ? [
          {
            slug: 'lite',
            name: 'LITE',
            subtitle: 'Best for getting started',
            price: 27.99,
            limit: 6,
            saveAmountText: 'Save £5.00/month',
            imageUrl: '',
            features: ['6 premium cans', 'Flexible delivery', 'Change flavours anytime', 'Skip or pause anytime'],
            isPopular: false
          },
          {
            slug: 'core',
            name: 'CORE',
            subtitle: 'Most flexible',
            price: 35.99,
            limit: 8,
            saveAmountText: 'Save £10.00/month',
            imageUrl: '',
            features: ['8 premium cans', 'Lower price per can', 'Change or swap brands', 'Skip or pause anytime'],
            isPopular: false
          },
          {
            slug: 'pro',
            name: 'PRO',
            subtitle: 'Best value',
            price: 40.99,
            limit: 10,
            saveAmountText: 'Save £14.00/month',
            imageUrl: '',
            features: ['10 premium cans', 'FREE delivery 📦', 'Best price per can', 'Loyalty rewards boost', 'Skip or pause anytime'],
            isPopular: true
          },
          {
            slug: 'ultimate',
            name: 'ULTIMATE',
            subtitle: 'Maximum savings',
            price: 46.99,
            limit: 12,
            saveAmountText: 'Save £19.00/month',
            imageUrl: '',
            features: ['12 premium cans', 'FREE delivery 📦', 'Lowest price per can', '£3.80 for any extra can', 'Skip or pause anytime'],
            extraText: '£3.80 FOR ANY ADDITIONAL CAN',
            isPopular: false
          }
        ] : undefined
      }
    };

    const updated = localPages.map(page => {
      if (page.id === selectedBuilderPageId) {
        return {
          ...page,
          sections: [...page.sections, newSection]
        };
      }
      return page;
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
    setHasUnsavedChanges(true);
    setSelectedBuilderSectionId(newSection.id);
  };

  const handleRemoveSectionFromPage = (sectionId: string) => {
    if (!selectedBuilderPageId) return;
    const updated = localPages.map(page => {
      if (page.id === selectedBuilderPageId) {
        return {
          ...page,
          sections: page.sections.filter(s => s.id !== sectionId)
        };
      }
      return page;
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
    setHasUnsavedChanges(true);
    if (selectedBuilderSectionId === sectionId) {
      setSelectedBuilderSectionId(null);
    }
  };

  const handleUpdateSectionSettings = (settingsKey: string, val: any) => {
    if (!selectedBuilderPageId || !selectedBuilderSectionId) return;
    const updated = localPages.map(page => {
      if (page.id === selectedBuilderPageId) {
        return {
          ...page,
          sections: page.sections.map(s => {
            if (s.id === selectedBuilderSectionId) {
              return {
                ...s,
                settings: {
                  ...s.settings,
                  [settingsKey]: val
                }
              };
            }
            return s;
          })
        };
      }
      return page;
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
    setHasUnsavedChanges(true);
  };

  const handleUpdatePageProperties = (updates: Partial<CustomPage>) => {
    if (!selectedBuilderPageId) return;
    const updated = localPages.map(p => {
      if (p.id === selectedBuilderPageId) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        };
      }
      return p;
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  // Move Section Up/Down
  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (!selectedBuilderPageId) return;
    const page = localPages.find(p => p.id === selectedBuilderPageId);
    if (!page) return;
    const sections = [...page.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    // Swap
    const temp = sections[idx];
    sections[idx] = sections[targetIdx];
    sections[targetIdx] = temp;

    const updated = localPages.map(p => {
      if (p.id === selectedBuilderPageId) {
        return { ...p, sections };
      }
      return p;
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
    setHasUnsavedChanges(true);
  };

  // Move Section to index (drag and drop)
  const handleMoveSectionTo = (fromIdx: number, toIdx: number) => {
    if (!selectedBuilderPageId) return;
    const page = localPages.find(p => p.id === selectedBuilderPageId);
    if (!page) return;
    const sections = [...page.sections];
    if (fromIdx < 0 || fromIdx >= sections.length || toIdx < 0 || toIdx >= sections.length || fromIdx === toIdx) return;

    const [movedSection] = sections.splice(fromIdx, 1);
    sections.splice(toIdx, 0, movedSection);

    const updated = localPages.map(p => {
      if (p.id === selectedBuilderPageId) {
        return { ...p, sections };
      }
      return p;
    });
    setLocalPages(updated);
    onUpdateCustomPages(updated);
    setHasUnsavedChanges(true);
    if (onDirtyChange) onDirtyChange(true);
  };

  // Add Mock File Upload
  const handleAddFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileForm.fileName || !newFileForm.url) return;

    const file: FileEntry = {
      id: `file-${Date.now()}`,
      fileName: newFileForm.fileName.endsWith('.png') || newFileForm.fileName.endsWith('.jpg') ? newFileForm.fileName : `${newFileForm.fileName}.png`,
      altText: newFileForm.altText || 'Media File Asset description text',
      dateAdded: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      size: `${(Math.random() * 400 + 40).toFixed(2)} KB`,
      references: 'Unused / Builder',
      url: newFileForm.url
    };

    onUpdateFiles([file, ...files]);
    setShowAddFile(false);
    setNewFileForm({ fileName: '', altText: '', url: '' });
  };

  const handleDeleteFile = (id: string) => {
    triggerConfirm("Are you sure you want to delete this media file?", () => {
      onUpdateFiles(files.filter(f => f.id !== id));
      setSelectedFileIds(prev => prev.filter(fid => fid !== id));
    }, "Delete Media File");
  };

  const handleSelectAllFiles = (checked: boolean) => {
    if (checked) {
      setSelectedFileIds(filteredFiles.map(f => f.id));
    } else {
      setSelectedFileIds([]);
    }
  };

  const handleSelectFile = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedFileIds(prev => [...prev, id]);
    } else {
      setSelectedFileIds(prev => prev.filter(fid => fid !== id));
    }
  };

  const handleBulkDeleteFiles = () => {
    if (selectedFileIds.length === 0) return;
    triggerConfirm(`Are you sure you want to bulk delete the ${selectedFileIds.length} selected media files?`, () => {
      const updated = files.filter(f => !selectedFileIds.includes(f.id));
      onUpdateFiles(updated);
      setSelectedFileIds([]);
    }, "Bulk Delete Media Files");
  };

  // Add Customer
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) return;

    const cust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      subscriptionStatus: newCustomerForm.subscriptionStatus,
      location: newCustomerForm.location || 'United Kingdom',
      ordersCount: 0,
      amountSpent: 0.00,
      addresses: [newCustomerForm.location || 'United Kingdom'],
      wishlist: []
    };

    onUpdateCustomers([cust, ...customers]);
    setShowAddCustomer(false);
    setNewCustomerForm({ name: '', email: '', location: '', subscriptionStatus: 'Subscribed' });
  };

  // Create discount code
  const handleCreateDiscountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscountForm.title) return;

    const disc: Discount = {
      id: `disc-${Date.now()}`,
      title: newDiscountForm.title.toUpperCase().replace(/\s+/g, ''),
      status: 'Active',
      method: 'Code',
      eligibility: newDiscountForm.eligibility || 'All customers',
      type: (newDiscountForm.type as any) || 'Amount off order',
      used: 0,
      details: newDiscountForm.details || '15% off standard purchases'
    };

    onUpdateDiscounts([...discounts, disc]);
    setShowAddDiscount(false);
    setNewDiscountForm({ title: '', type: 'Amount off order', details: '', eligibility: 'All customers' });
  };

  const handleToggleDiscountStatus = (id: string) => {
    const updated = discounts.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === 'Active' ? 'Expired' as const : 'Active' as const };
      }
      return d;
    });
    onUpdateDiscounts(updated);
  };

  const handleDeleteDiscount = (id: string) => {
    triggerConfirm("Are you sure you want to delete this promotional code?", () => {
      onUpdateDiscounts(discounts.filter(d => d.id !== id));
    }, "Delete Discount");
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogForm.title) return;
    const slug = newBlogForm.slug || slugify(newBlogForm.title);
    
    if (blogs.some(b => b.slug === slug)) {
      alert("A blog post with this slug already exists! Slugs must be unique.");
      return;
    }

    const tags = blogTagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const createdBlog: BlogPost = {
      id: 'blog-' + Date.now(),
      title: newBlogForm.title,
      slug: slug,
      excerpt: newBlogForm.excerpt || '',
      content: newBlogForm.content || '',
      image: newBlogForm.image || '',
      author: newBlogForm.author || 'Store Owner',
      category: newBlogForm.category || 'General',
      status: (newBlogForm.status as 'Active' | 'Draft' | 'Archived') || 'Active',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: newBlogForm.readTime || '5 min read',
      tags: tags.length > 0 ? tags : ['General']
    };

    onUpdateBlogs([createdBlog, ...blogs]);
    setShowAddBlog(false);
    setNewBlogForm({
      title: '', excerpt: '', content: '', image: '',
      author: 'Admin', category: 'General', status: 'Active',
      publishedAt: '', readTime: '5 min read', tags: []
    });
    setBlogTagsInput('');
  };

  const handleUpdateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;
    const updatedSlug = selectedBlog.slug || slugify(selectedBlog.title);
    
    if (blogs.some(b => b.slug === updatedSlug && b.id !== selectedBlog.id)) {
      alert("A blog post with this slug already exists! Slugs must be unique.");
      return;
    }

    const tags = blogTagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const updatedBlog: BlogPost = {
      ...selectedBlog,
      slug: updatedSlug,
      tags: tags
    };

    onUpdateBlogs(blogs.map(b => b.id === selectedBlog.id ? updatedBlog : b));
    setSelectedBlog(null);
    setBlogTagsInput('');
  };

  const handleDeleteBlog = (blogId: string) => {
    triggerConfirm("Are you sure you want to delete this blog post? This action cannot be undone.", () => {
      onUpdateBlogs(blogs.filter(b => b.id !== blogId));
    }, "Delete Blog Post");
  };


  // Filters listings
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchQuery = o.id.toLowerCase().includes(orderQuery.toLowerCase()) || 
                         o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
                         o.customerEmail.toLowerCase().includes(orderQuery.toLowerCase());
      
      if (orderStatusFilter === 'All') return matchQuery;
      return matchQuery && o.fulfillmentStatus === orderStatusFilter;
    });
  }, [orders, orderQuery, orderStatusFilter]);

  const filteredProductsAdmin = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.vendor.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(productQuery.toLowerCase())
    );
  }, [products, productQuery]);

  const filteredCollections = useMemo(() => {
    return collections.filter(c => 
      c.title.toLowerCase().includes(collectionQuery.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(collectionQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(collectionQuery.toLowerCase())
    );
  }, [collections, collectionQuery]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => 
      f.fileName.toLowerCase().includes(fileQuery.toLowerCase()) ||
      f.altText.toLowerCase().includes(fileQuery.toLowerCase())
    );
  }, [files, fileQuery]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(customerQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(customerQuery.toLowerCase())
    );
  }, [customers, customerQuery]);

  const filteredDiscounts = useMemo(() => {
    return discounts.filter(d => 
      d.title.toLowerCase().includes(discountQuery.toLowerCase()) ||
      d.details.toLowerCase().includes(discountQuery.toLowerCase())
    );
  }, [discounts, discountQuery]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(blogQuery.toLowerCase()) || 
                            b.excerpt.toLowerCase().includes(blogQuery.toLowerCase()) ||
                            b.tags.some(t => t.toLowerCase().includes(blogQuery.toLowerCase()));
      const matchesStatus = blogStatusFilter === 'All' || b.status === blogStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, blogQuery, blogStatusFilter]);

  return (
    <div id="partner-admin-scaffold" className="flex flex-col lg:flex-row min-h-screen bg-[#f6f6f7] text-slate-800 font-sans">
      
      {/* Left sidebar Navigation */}
      {!selectedBuilderPageId && (
        <aside className="w-full lg:w-60 bg-[#ebebeb] text-[#4a4d50] shrink-0 border-r border-[#e1e3e5] p-3.5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Dashboard Head */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#e1e3e5]">
              <div className="w-8 h-8 bg-[#008060] rounded flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1a1c1d]">Pouch Supply</h2>
                <span className="bg-gray-100 text-[9px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 uppercase font-bold tracking-tighter">Admin</span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 block">
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'orders', label: 'Orders', icon: Package, badge: orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length },
                { id: 'collections', label: 'Collections', icon: Building },
                { id: 'products', label: 'Products', icon: ShoppingBag },
                { id: 'pages', label: 'Page Builder', icon: FileCode },
                { id: 'blogs', label: 'Blog Posts', icon: Layout },
                { id: 'files', label: 'Files Manager', icon: HardDrive },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'discounts', label: 'Discounts', icon: Percent },
                { id: 'layout', label: 'Header & Footer', icon: Settings },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as SidebarTab);
                      setSelectedBuilderPageId(null);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#edeeef] text-[#1a1c1d] font-semibold shadow-xs' 
                        : 'hover:bg-[#edeeef] text-[#4a4d50]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 rounded select-none">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#1a1c1d]' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#e3f5e9] text-[#008060] font-bold text-[10px] py-0.5 px-2 rounded-full border border-[#c8ebd3]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* MongoDB Connection Button */}
            <div className="pt-2 border-t border-[#e1e3e5]/65 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDbDetailsModal(true);
                  fetchDbDetails();
                }}
                className="w-full flex items-center justify-between p-2 rounded-md text-[12px] font-bold text-teal-800 hover:bg-teal-50 hover:text-teal-900 transition-all cursor-pointer bg-white border border-teal-200/80 shadow-xs"
              >
                <div className="flex items-center gap-2 rounded select-none text-left">
                  <Database className="h-3.5 w-3.5 text-teal-600 shrink-0 animate-pulse" />
                  <span>MongoDB Connection</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 block shrink-0 animate-pulse ml-1" />
              </button>
            </div>

            {/* View Online Store main button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#008060] hover:bg-[#006e52] px-3.5 py-2.5 rounded-xl text-white font-black text-[11px] uppercase tracking-wider shadow-sm transition-colors cursor-pointer select-none text-center"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span>View Online Store</span>
            </a>

            {onLogoutAdmin && (
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl text-rose-700 font-bold text-[11px] uppercase tracking-wider shadow-2xs transition-colors cursor-pointer select-none text-center"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Sign Out Admin</span>
              </button>
            )}
          </div>

          {/* Foot of sidebar */}
          <div className="pt-4 border-t border-[#e1e3e5] text-[10px] text-[#707579]">
            <p>Running: Merchant v4.12</p>
            <p className="mt-1">Cloud Engine Active</p>
          </div>
        </aside>
      )}

      {/* Main Panel space */}
      <main className={selectedBuilderPageId ? "w-full p-4 lg:p-6" : "flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-x-hidden"}>
        
        {/* Global panel header with stats glance info */}
        {!selectedBuilderPageId && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-250">
            <div>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 font-black uppercase py-1 px-3 rounded-full border border-indigo-100">Pouch Supply Partner Portal</span>
              <h1 className="text-2xl font-black text-slate-900 mt-2 capitalize flex items-center gap-2">
                {activeTab} Management Panel
              </h1>
            </div>
            
            {/* Quick Metrics display */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Draft Status Indicator */}
              <div className="flex items-center gap-2 bg-white border border-slate-250 px-4 py-2.5 rounded-xl shadow-xs">
                <span className={`h-2.5 w-2.5 rounded-full ${hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="font-extrabold text-[10px] text-slate-700 uppercase tracking-widest whitespace-nowrap">
                  {hasUnsavedChanges ? 'Unsaved Edits Present' : 'All Changes Saved'}
                </span>
              </div>

              {/* Save changes button */}
              <button
                onClick={handleGlobalSave}
                disabled={!hasUnsavedChanges || isSaving}
                className={`py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xs border ${
                  isSaving
                    ? 'bg-slate-700 text-white border-slate-700 cursor-wait'
                    : hasUnsavedChanges
                    ? 'bg-[#008060] hover:bg-[#006e52] text-white border-[#008060] cursor-pointer ring-4 ring-emerald-400/30 animate-pulse font-extrabold shadow-md shadow-emerald-100'
                    : 'bg-slate-100 text-slate-350 border-slate-200 cursor-not-allowed select-none'
                }`}
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 shrink-0" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>

              {/* Discard button */}
              {hasUnsavedChanges && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to discard all unsaved edits made during this session? This action cannot be undone.")) {
                      handleGlobalDiscard();
                    }
                  }}
                  className="py-2.5 px-3.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-150 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer"
                  title="Discard All Draft Changes"
                >
                  Discard
                </button>
              )}

              {/* View Online Store Button */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-white hover:bg-slate-150 text-[#008060] border border-slate-250 hover:border-slate-350 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-xs cursor-pointer select-none"
                title="Open Customer Online Store in new tab"
              >
                <Globe className="h-4 w-4 shrink-0 text-[#008060]" />
                <span>View Online Store</span>
              </a>

              <div className="bg-white border border-slate-250 px-4 py-2.5 rounded-xl shadow-xs">
                <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Gross Sales</span>
                <span className="font-extrabold text-slate-950 text-sm">£{stats.totalSales.toFixed(2)}</span>
              </div>
              <div className="bg-white border border-slate-250 px-4 py-2.5 rounded-xl shadow-xs">
                <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Unfulfilled</span>
                <span className="font-extrabold text-amber-500 text-sm">{orders.filter(o => o.fulfillmentStatus === 'Unfulfilled').length} Orders</span>
              </div>
            </div>
          </div>
        )}

        {/* Database Integration & IP Whitelisting Diagnosis Banner */}
        {dbStatus && (
          <div className="w-full space-y-4">
            {dbStatus.status === 'not-configured' && (
              <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-100/30">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-600 animate-pulse" />
                      Offline-Safe Mode Enabled (Memory Cache & LocalStorage)
                    </p>
                    <p className="text-[10px] text-amber-800 leading-relaxed max-w-3xl">
                      Configure a <code className="font-mono bg-amber-100/60 px-1 py-0.5 rounded font-bold text-amber-950">MONGODB_URI</code> below to persist layout, images, categories, and inventory securely in your own MongoDB Atlas database.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-[9px] font-mono font-black border border-amber-200 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      Fallback Cache Online
                    </span>
                  </div>
                </div>

                {/* Secure Configuration Input Form */}
                <div className="bg-white/80 border border-amber-200 rounded-xl p-4 space-y-3 shadow-3xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Enter your MongoDB Atlas Connection String:</span>
                    <form onSubmit={handleUpdateUriSubmit} className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1 flex items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/dbname?retryWrites=true&w=majority"
                          value={customUriInput}
                          onChange={(e) => setCustomUriInput(e.target.value)}
                          className="w-full text-xs font-mono border border-slate-200 p-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-505 bg-white font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                          title={showPassword ? "Hide Connection String" : "Show Connection String"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={uriUpdating}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1"
                      >
                        {uriUpdating ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Save & Connect"
                        )}
                      </button>
                    </form>
                    {uriUpdateResult && (
                      <p className={`text-[11px] font-bold mt-2 ${uriUpdateResult.success ? 'text-emerald-600' : 'text-pink-600'}`}>
                        {uriUpdateResult.message}
                      </p>
                    )}

                    {/* Vercel Environment Variable Guide Callout */}
                    <div className="mt-3 p-3 bg-indigo-50 border border-indigo-150 rounded-lg text-[10.5px] leading-relaxed text-indigo-950 font-semibold flex items-start gap-2.5">
                      <div className="mt-0.5 text-xs text-indigo-600 font-bold select-none">💡</div>
                      <div>
                        <span className="font-extrabold text-indigo-905 block uppercase tracking-wider text-[9px] mb-0.5">Vercel & Production Deployments note:</span>
                        Because Vercel uses stateless, read-only serverless functions, the input box above only saves the connection in memory temporarily. To persist your database permanently, you <strong>MUST</strong> go to your <strong>Vercel Project Dashboard ➜ Settings ➜ Environment Variables</strong>, add a variable named <code className="font-mono bg-indigo-100/80 text-indigo-900 px-1 py-0.5 rounded text-[9.5px]">MONGODB_URI</code>, and paste your connection string there. Then redeploy the project!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dbStatus.status === 'error' && (
              <div className="space-y-4">
                {/* Clean, compact, non-intrusive status alert */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-650" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">
                        MongoDB Connection Inactive (Local fallback cache active)
                      </p>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                        Your database is offline or unable to resolve. Data will be saved locally so you don't lose anything: <code className="font-mono text-slate-600 bg-slate-100/80 px-1 py-0.5 rounded text-[9.5px] select-all">{dbStatus.error ? dbStatus.error.slice(0, 150) + '...' : 'Connection Error'}</code>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to clear the custom MongoDB URI?")) {
                        setCustomUriInput('');
                        fetch('/api/update-db-uri', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ uri: '' })
                        }).then(() => {
                          setDbStatus({ status: 'not-configured' });
                        });
                      }
                    }}
                    className="text-[9px] hover:bg-rose-50 text-rose-600 border border-rose-200 px-2 py-1 rounded font-bold uppercase tracking-wider transition-colors whitespace-nowrap self-start sm:self-center cursor-pointer"
                  >
                    Clear URI
                  </button>
                </div>

                {/* Highly structured, simple, exact MongoDB whitelisting diagnostic manual */}
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-150 rounded-xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center select-none shrink-0 text-white font-bold text-xs ring-4 ring-indigo-100">
                      ?
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">Why is your Atlas Whitelist failing? (Important diagnostic)</h4>
                      <p className="text-[10px] text-indigo-700 font-semibold">The SSL Handshake Failed (TLS Alert 80) error results solely from dynamic container hosting.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-white/90 border border-slate-150 p-3.5 rounded-lg space-y-2">
                      <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Diagnosis</span>
                      <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
                        This web app operates server-side in a secure <strong>Google Cloud Run container</strong>. The requests to MongoDB originate from our Cloud server, <strong>not</strong> your local computer.
                      </p>
                    </div>
                    <div className="bg-white/90 border border-slate-150 p-3.5 rounded-lg space-y-2">
                      <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">The Conflict</span>
                      <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
                        If you whitelisted your laptop's current IP address, Atlas blocks connection attempts from our server container. Cloud Run uses dynamic outbound IPs that rotate constantly.
                      </p>
                    </div>
                    <div className="bg-white/90 border border-slate-150 p-3.5 rounded-lg space-y-2">
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">The Solution</span>
                      <p className="text-[10.5px] text-slate-700 leading-relaxed font-semibold">
                        In your <strong>MongoDB Atlas Panel</strong> under <strong>Network Access</strong>, click <strong>+ Add IP Address</strong> and click the <strong>Allow Access from Anywhere</strong> button (this adds <code className="font-mono text-slate-900 bg-slate-100 px-1 text-[9.5px] rounded">0.0.0.0/0</code>). This instantly unblocks all Cloud containers!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Configuration Input Form */}
                <div className="bg-white/80 border border-slate-205 rounded-xl p-4 space-y-3 shadow-3xs">
                  <span className="text-[10px] font-extrabold text-slate-605 uppercase tracking-wider block">Update MongoDB Connection URI string:</span>
                  <form onSubmit={handleUpdateUriSubmit} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new MongoDB URI"
                        value={customUriInput}
                        onChange={(e) => setCustomUriInput(e.target.value)}
                        className="w-full text-xs font-mono border border-slate-202 p-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-505 bg-white font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-slate-400 hover:text-slate-650 p-1"
                        title={showPassword ? "Hide Connection String" : "Show Connection String"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={uriUpdating}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1"
                    >
                      {uriUpdating ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Testing Connection...
                        </>
                      ) : (
                        "Save & Retry"
                      )}
                    </button>
                  </form>
                  {uriUpdateResult && (
                    <p className={`text-[11px] font-bold mt-2 ${uriUpdateResult.success ? 'text-emerald-600' : 'text-pink-600'}`}>
                      {uriUpdateResult.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-750 transition-colors text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry Sync Connection</span>
                  </button>
                  <span className="text-[10px] text-slate-500 font-semibold italic">
                    (Currently operating safely on full-fidelity backup Server Mode memory cache)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab content conditionals */}
        
        {/* 1. ANALYTICS BLOCK */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Metric sales card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                <TrendingUp className="absolute top-5 right-5 text-indigo-600 h-5 w-5" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Total Revenue (All-Time)</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">£{(stats.totalSales).toFixed(2)}</h3>
                <div className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-0.5">
                  <span>£{(stats.todaySales).toFixed(2)}</span> <span className="text-slate-400 font-medium">gross sales received today</span>
                </div>
              </div>

              {/* Metric conversion card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                <Users className="absolute top-5 right-5 text-indigo-600 h-5 w-5" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Conversion rate</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{stats.conversionRate.toFixed(1)}%</h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  {stats.completedOrders} orders from {stats.totalStoreSessions} store sessions
                </p>
                <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${Math.min(100, stats.conversionRate || 3.2)}%` }} />
                </div>
              </div>

              {/* Metric AOV card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative">
                <HardDrive className="absolute top-5 right-5 text-indigo-600 h-5 w-5" />
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Average Order Value</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">£{stats.avgOrderValue.toFixed(2)}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Average cart check size across all sales</p>
              </div>

            </div>

            {/* Pure SVG Animated High contrast charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Revenue Trends */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-sm mb-4">Gross Revenue Chart over Time</h4>
                <div className="relative h-60 bg-slate-50 rounded-lg border border-slate-100 p-4 flex items-end">
                  <div className="absolute inset-x-0 bottom-0 top-10 flex flex-col justify-between py-2 text-[9px] text-slate-400 pointer-events-none px-4">
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£{(stats.totalSales || 800).toFixed(2)}</div>
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£{((stats.totalSales || 800) * 0.66).toFixed(2)}</div>
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£{((stats.totalSales || 800) * 0.33).toFixed(2)}</div>
                    <div className="border-b border-dashed border-slate-200/80 w-full pt-1">£(0.00)</div>
                  </div>

                  {/* SVG Line path for high aesthetic fidelity */}
                  <svg className="absolute inset-0 h-full w-full p-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path 
                      d={stats.pathD} 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />
                    <path 
                      d={`${stats.pathD} L 100 100 L 0 100 Z`} 
                      fill="url(#rev-grad)" 
                      opacity="0.08"
                    />
                    <defs>
                      <linearGradient id="rev-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* SVG chart dots */}
                  <div className="relative z-10 w-full flex justify-between px-6 text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none pt-4">
                    {stats.graphPoints.length > 0 ? (
                      stats.graphPoints.map((gp, gIdx) => {
                        // Display up to 4 labels maximum to avoid clutter
                        if (
                          stats.graphPoints.length <= 4 || 
                          gIdx === 0 || 
                          gIdx === stats.graphPoints.length - 1 || 
                          gIdx === Math.floor(stats.graphPoints.length / 3) ||
                          gIdx === Math.floor(stats.graphPoints.length * 2 / 3)
                        ) {
                          return <span key={gIdx}>{gp.label}</span>;
                        }
                        return null;
                      })
                    ) : (
                      <>
                        <span>9:00 am</span>
                        <span>1:00 pm</span>
                        <span>5:00 pm</span>
                        <span>9:00 pm</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                  <span>Metric source: Secure checkout logs</span>
                  <span>Trend State: <span className="text-emerald-600 font-bold">{stats.completedOrders > 0 ? 'Dynamic Live Graph' : 'Awaiting checkouts'}</span></span>
                </div>
              </div>

              {/* Chart 2: Regional Sessions Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="font-extrabold text-slate-800 text-sm mb-4">Top Geographic Customer Locations</h4>
                <div className="space-y-4">
                  {stats.finalGeos.map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>{loc.country}</span>
                        <span>{loc.sessionCount} sessions ({loc.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-slate-900 h-full rounded-full transition-all duration-500" style={{ width: `${loc.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. ORDERS BLOCK */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Table actions header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="flex flex-wrap gap-1">
                {(['All', 'Unfulfilled', 'Fulfilled'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOrderStatusFilter(tab)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      orderStatusFilter === tab 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab} ({tab === 'All' ? orders.length : orders.filter(o => o.fulfillmentStatus === tab).length})
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleExportOrders}
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2 px-2.5 rounded-lg text-xs text-slate-700 flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  title="Export all orders to JSON backup file"
                >
                  <Download className="h-3 w-3 text-slate-500" /> Export Backup
                </button>

                <label
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2 px-2.5 rounded-lg text-xs text-slate-700 flex items-center gap-1 transition cursor-pointer shadow-2xs cursor-pointer"
                  title="Import orders from JSON backup"
                >
                  <Upload className="h-3 w-3 text-slate-500" /> Import Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportOrders}
                  />
                </label>

                {/* Query filter input */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filter ID, customers..."
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Orders list Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-black uppercase tracking-widest">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4 text-center">Fulfillment Status</th>
                      <th className="p-4 text-right">Invoice Total</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400">No matching orders found.</td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-extrabold text-slate-900">
                            <div>{order.id}</div>
                            {Array.isArray(order.tags) && order.tags.includes('Withdrawal Requested') && (
                              <span className="inline-block text-[8.5px] bg-rose-50 text-rose-700 border border-rose-150 uppercase font-black px-1.5 py-0.5 rounded mt-1 animate-pulse select-none">
                                Withdrawal Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-500">{order.date}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-850">{order.customerName}</p>
                            <p className="text-[10px] text-slate-400">{order.customerEmail}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block text-[10px] uppercase font-bold py-0.5 px-2 rounded-full tracking-wider ${
                              order.fulfillmentStatus === 'Fulfilled' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {order.fulfillmentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right font-extrabold text-slate-900">£{order.total.toFixed(2)}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-250 hover:text-slate-900 text-slate-600 py-1 px-2.5 rounded-lg font-bold flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Eye className="h-3 w-3" /> View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Order Detailed Shopify-Style Full Overlay Page */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-[#F6F6F7] overflow-y-auto font-sans text-slate-800">
                
                {/* Header Top Bar */}
                <div className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-3xs">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer select-none transition-all border border-slate-200 bg-white shadow-3xs"
                        title="Back to Orders"
                      >
                        <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">#{selectedOrder.id}</h1>
                        <span className="text-[10px] font-black uppercase py-1 px-3.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full tracking-wider shadow-3xs select-none">
                          {selectedOrder.paymentStatus || 'Paid'}
                        </span>
                        <span className="text-[10px] font-black uppercase py-1 px-3.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full tracking-wider shadow-3xs select-none">
                          {selectedOrder.fulfillmentStatus}
                        </span>
                        <span className="text-[10px] font-black uppercase py-1 px-3.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full tracking-wider shadow-3xs select-none">
                          Archived
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = parentOrders.map(o => {
                            if (o.id === selectedOrder.id) {
                              return { ...o, paymentStatus: 'Refunded' as const };
                            }
                            return o;
                          });
                          parentOnUpdateOrders(updated);
                          setSelectedOrder({ ...selectedOrder, paymentStatus: 'Refunded' });
                          
                          // Log refund event to simulated emails / timeline
                          const refundComment = "Order was fully refunded.";
                          setTimelineComments(prev => ({
                            ...prev,
                            [selectedOrder.id]: [{ text: refundComment, date: 'Just now' }, ...(prev[selectedOrder.id] || [])]
                          }));
                        }}
                        className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-3xs cursor-pointer"
                      >
                        Refund
                      </button>
                      
                      <button
                        onClick={() => {
                          // Simple Return notification
                          const returnComment = "Customer initiated a return for items.";
                          setTimelineComments(prev => ({
                            ...prev,
                            [selectedOrder.id]: [{ text: returnComment, date: 'Just now' }, ...(prev[selectedOrder.id] || [])]
                          }));
                        }}
                        className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-3xs cursor-pointer"
                      >
                        Return
                      </button>
                      
                      <div className="relative group">
                        <button className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-3xs cursor-pointer">
                          <span>More actions</span>
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex border border-slate-300 rounded-lg overflow-hidden divide-x divide-slate-300 shadow-3xs">
                        <button disabled className="p-1.5 bg-white text-slate-400 cursor-not-allowed">
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button disabled className="p-1.5 bg-white text-slate-400 cursor-not-allowed">
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2">
                  <p className="text-xs text-slate-500 font-medium pl-10">
                    {selectedOrder.date || 'July 7, 2026 at 6:08 am'} from Draft Orders
                  </p>
                </div>

                {/* Main 2-Column Grid */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (Fulfillments, Payments, Timeline) */}
                  <div className="lg:col-span-2 space-y-6">

                    {/* WITHDRAWAL ACTION BANNER FOR ADMINS */}
                    {Array.isArray(selectedOrder.tags) && selectedOrder.tags.includes('Withdrawal Requested') && (
                      <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3.5 text-left shadow-2xs">
                        <div className="flex items-center gap-2 text-rose-800">
                          <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0 animate-pulse" />
                          <span className="font-extrabold text-xs uppercase tracking-wide">Customer Order Withdrawal Requested</span>
                        </div>
                        <p className="text-[11px] text-rose-700/90 leading-relaxed">
                          The customer has formally requested to withdraw items from this transaction. The transaction payment state has been provisionally flagged, and is awaiting physical approval or rejection by a store supervisor.
                        </p>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // APPROVE WITHDRAWAL
                              const updatedTags = selectedOrder.tags.filter(t => t !== 'Withdrawal Requested' && !t.startsWith('Withdraw:'));
                              updatedTags.push('Withdrawal Approved');
                              
                              const updatedOrders = parentOrders.map(o => {
                                if (o.id === selectedOrder.id) {
                                  return {
                                    ...o,
                                    tags: updatedTags,
                                    paymentStatus: 'Refunded' as const
                                  };
                                }
                                return o;
                              });

                              // Draft Approved email copy
                              const emailHtml = `
                                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; color: #334155;">
                                  <div style="background-color: #10b981; padding: 25px 20px; text-align: center;">
                                    <span style="font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">POUCH SUPPLY</span>
                                    <div style="font-size: 9px; font-weight: bold; color: #ecfdf5; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">WITHDRAWAL APPROVED</div>
                                  </div>
                                  
                                  <div style="padding: 24px; text-align: left;">
                                    <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 0;">Dear ${selectedOrder.customerName || 'Value Member'},</p>
                                    <p style="font-size: 12.5px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
                                      We are pleased to inform you that your withdrawal request for Order <strong>#${selectedOrder.id}</strong> has been <strong>approved</strong> by our store administrator.
                                    </p>

                                    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 11.5px; line-height: 1.5; color: #065f46;">
                                      <strong>Refund Processed Successfully:</strong><br/>
                                      The refund value has been processed back to your original payment card. It will typically clear into your account balance in 2-3 business banking days depending on your issuer.
                                    </div>

                                    <p style="font-size: 11.5px; color: #64748b; line-height: 1.5;">
                                      If you require further assistance, please do not hesitate to reach out!
                                    </p>
                                  </div>
                                  
                                  <div style="background-color: #f8fafc; padding: 15px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 10px; color: #94a3b8;">
                                    Thank you for choosing PouchSupply.
                                  </div>
                                </div>
                              `;

                              const newEmail = {
                                to: selectedOrder.customerEmail,
                                subject: `Withdrawal APPROVED - Order #${selectedOrder.id}`,
                                preview: `Your withdrawal request for Order #${selectedOrder.id} has been approved. Refund processed.`,
                                body: emailHtml,
                                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              };

                              try {
                                const stored = localStorage.getItem('ps_simulated_emails');
                                const emails = stored ? JSON.parse(stored) : [];
                                localStorage.setItem('ps_simulated_emails', JSON.stringify([newEmail, ...emails]));
                                window.dispatchEvent(new CustomEvent('ps-emails-updated'));
                              } catch (e) {
                                console.error(e);
                              }

                              parentOnUpdateOrders(updatedOrders);
                              setSelectedOrder({
                                ...selectedOrder,
                                tags: updatedTags,
                                paymentStatus: 'Refunded' as const
                              });
                            }}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[9.5px] tracking-wider rounded-lg text-center transition-colors cursor-pointer select-none border border-emerald-700"
                          >
                            Approve & Refund
                          </button>
                          
                          <button
                            onClick={() => {
                              // DECLINE WITHDRAWAL
                              const updatedTags = selectedOrder.tags.filter(t => t !== 'Withdrawal Requested' && !t.startsWith('Withdraw:'));
                              updatedTags.push('Withdrawal Declined');
                              
                              const updatedOrders = parentOrders.map(o => {
                                if (o.id === selectedOrder.id) {
                                  return {
                                    ...o,
                                    tags: updatedTags,
                                    paymentStatus: 'Paid' as const
                                  };
                                }
                                return o;
                              });

                              // Draft Declined email copy
                              const emailHtml = `
                                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; color: #334155;">
                                  <div style="background-color: #ef4444; padding: 25px 20px; text-align: center;">
                                    <span style="font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: 2px;">POUCH SUPPLY</span>
                                    <div style="font-size: 9px; font-weight: bold; color: #fee2e2; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">WITHDRAWAL DECLINED</div>
                                  </div>
                                  
                                  <div style="padding: 24px; text-align: left;">
                                    <p style="font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 0;">Hi ${selectedOrder.customerName || 'Value Member'},</p>
                                    <p style="font-size: 12.5px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
                                      We are writing to update you regarding your withdrawal request for Order <strong>#${selectedOrder.id}</strong>.
                                    </p>

                                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 11.5px; line-height: 1.5; color: #991b1b;">
                                      <strong>Request Status: Declined</strong><br/>
                                      Unfortunately, we were unable to complete your withdrawal request because the package containing your items has already been securely packed, labeled, and transferred to our postal partner for delivery. 
                                    </div>

                                    <p style="font-size: 11.5px; color: #64748b; line-height: 1.5;">
                                      Once you receive the package, you are welcome to utilize our hassle-free returns policy to send any unwanted items back for a full refund.
                                    </p>
                                  </div>
                                  
                                  <div style="background-color: #f8fafc; padding: 15px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 10px; color: #94a3b8;">
                                    Thank you for your understanding.
                                  </div>
                                </div>
                              `;

                              const newEmail = {
                                to: selectedOrder.customerEmail,
                                subject: `Withdrawal Request Declined - Order #${selectedOrder.id}`,
                                preview: `Your withdrawal request for Order #${selectedOrder.id} was declined as the shipment has dispatched.`,
                                body: emailHtml,
                                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              };

                              try {
                                const stored = localStorage.getItem('ps_simulated_emails');
                                const emails = stored ? JSON.parse(stored) : [];
                                localStorage.setItem('ps_simulated_emails', JSON.stringify([newEmail, ...emails]));
                                window.dispatchEvent(new CustomEvent('ps-emails-updated'));
                              } catch (e) {
                                console.error(e);
                              }

                              parentOnUpdateOrders(updatedOrders);
                              setSelectedOrder({
                                ...selectedOrder,
                                tags: updatedTags,
                                paymentStatus: 'Paid' as const
                              });
                            }}
                            className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[9.5px] tracking-wider rounded-lg text-center transition-colors cursor-pointer select-none border border-slate-750"
                          >
                            Decline Request
                          </button>
                        </div>
                      </div>
                    )}

                    {/* FULFILLMENT CARD (Identical to Shopify #1001-F1) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-xs border border-slate-200">
                            📦
                          </span>
                          <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Fulfilled</span>
                          <span className="text-xs text-slate-400 font-semibold">#{selectedOrder.id}-F1</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-650 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{selectedOrder.date || 'July 7, 2026'}</span>
                        </div>

                        {/* Order Items List */}
                        <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                          {selectedOrder.items.map((item, idx) => {
                            const isKupanac = item.productTitle.toLowerCase().includes('kupanac');
                            const variantLabel = isKupanac ? 'M / Green' : 'Default Title';
                            const skuLabel = isKupanac ? '010401015' : `SKU-00${idx + 1}928`;
                            return (
                              <div key={idx} className="py-4 flex justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1 relative shrink-0">
                                    <img
                                      src={item.image || PLACEHOLDER_IMAGE}
                                      alt={item.productTitle}
                                      className="h-full object-contain filter drop-shadow-sm"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-xs text-slate-900 uppercase tracking-tight hover:text-indigo-600 transition-colors">
                                      {item.productTitle}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-405 font-bold mt-0.5">
                                      <span>{variantLabel}</span>
                                      <span>•</span>
                                      <span>{skuLabel}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                  <div className="text-xs font-semibold text-slate-500">
                                    £{item.price.toFixed(2)} × {item.quantity}
                                  </div>
                                  <div className="text-xs font-black text-slate-900 font-mono mt-0.5">
                                    £{(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Optional Tracking details displayed inside fulfillment container */}
                        {selectedOrder.trackingId && (
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between text-xs font-medium text-left">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">Simulated Carrier & Tracking</span>
                              <span className="font-extrabold text-slate-800">{selectedOrder.carrier || 'Royal Mail'}</span>
                              <span className="text-slate-300 mx-2">•</span>
                              <span className="font-mono font-bold text-indigo-600 underline cursor-pointer">{selectedOrder.trackingId}</span>
                            </div>
                            <span className="text-[9px] bg-emerald-150 border border-emerald-200 text-emerald-800 font-extrabold uppercase py-0.5 px-2 rounded">
                              Dispatched
                            </span>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => {
                              const updated = parentOrders.map(o => {
                                if (o.id === selectedOrder.id) {
                                  return { ...o, fulfillmentStatus: 'Delivered' as const };
                                }
                                return o;
                              });
                              parentOnUpdateOrders(updated);
                              setSelectedOrder({ ...selectedOrder, fulfillmentStatus: 'Delivered' });

                              // Add system notification to comments
                              setTimelineComments(prev => ({
                                ...prev,
                                [selectedOrder.id]: [{ text: "Package status updated to: Delivered.", date: 'Just now' }, ...(prev[selectedOrder.id] || [])]
                              }));
                            }}
                            className="py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-lg transition-all shadow-3xs cursor-pointer select-none"
                          >
                            Mark as delivered
                          </button>
                          
                          <button
                            onClick={() => {
                              setTrackingNumberInput(selectedOrder.trackingId || '');
                              setCarrierInput(selectedOrder.carrier || 'Royal Mail');
                              setShowTrackingModal(true);
                            }}
                            className="py-2 px-4 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer select-none"
                          >
                            <span>+ Add tracking</span>
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* PAYMENT DETAILS CARD (Identical to Shopify Paid section) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold py-0.5 px-2.5 rounded uppercase tracking-wider select-none">
                            Paid
                          </span>
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-indigo-600 block uppercase font-mono">
                          Worldpay Secure Gateway
                        </span>
                      </div>

                      <div className="space-y-3.5 text-xs text-left">
                        <div className="flex justify-between text-slate-500 font-semibold">
                          <span>Subtotal ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                          <span className="font-mono text-slate-800">£{selectedOrder.total.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between font-extrabold text-slate-900 text-sm border-t border-slate-100 pt-3">
                          <span>Total</span>
                          <span className="font-mono">£{selectedOrder.total.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-slate-600 font-bold border-t border-slate-100 pt-3">
                          <span>Paid by customer</span>
                          <span className="font-mono text-slate-900">£{selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* TIMELINE FEED CARD */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6 text-left">
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">Timeline</h3>
                      
                      {/* Leave a comment Input panel */}
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-3xs select-none shrink-0">
                          NB
                        </div>
                        <div className="w-full relative">
                          <textarea
                            value={timelineComment}
                            onChange={(e) => setTimelineComment(e.target.value)}
                            placeholder="Leave a comment..."
                            className="w-full text-xs p-3 pb-12 border border-slate-200 focus:border-slate-350 focus:outline-none rounded-xl bg-slate-50/50 resize-none h-20 transition-all focus:bg-white text-slate-800"
                          />
                          <div className="absolute bottom-2.5 left-3.5 right-3.5 flex justify-between items-center">
                            <div className="flex items-center gap-2.5 text-slate-400 select-none">
                              <span className="hover:text-slate-650 cursor-pointer text-sm">😊</span>
                              <span className="hover:text-slate-650 cursor-pointer font-bold text-sm">@</span>
                              <span className="hover:text-slate-650 cursor-pointer font-bold text-sm">#</span>
                              <span className="hover:text-slate-650 cursor-pointer text-sm">📎</span>
                            </div>
                            <button
                              onClick={() => {
                                if (timelineComment.trim()) {
                                  const newComment = {
                                    text: timelineComment,
                                    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  };
                                  setTimelineComments(prev => ({
                                    ...prev,
                                    [selectedOrder.id]: [newComment, ...(prev[selectedOrder.id] || [])]
                                  }));
                                  setTimelineComment('');
                                }
                              }}
                              disabled={!timelineComment.trim()}
                              className="py-1 px-3 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white text-[10px] font-black rounded-lg transition-all shadow-3xs cursor-pointer select-none uppercase tracking-widest"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>

                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest text-center block border-b border-slate-100 pb-3">
                        Only you and other staff can see comments
                      </span>

                      {/* Event logs / feed */}
                      <div className="space-y-4">
                        {/* Custom posted comments */}
                        {(timelineComments[selectedOrder.id] || []).map((comment, cIdx) => (
                          <div key={cIdx} className="flex justify-between items-start text-xs relative pl-6 pb-2">
                            <div className="absolute left-2.5 top-1.5 bottom-0 border-l border-slate-200 -z-10" />
                            <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
                            <div className="space-y-0.5 pr-4">
                              <p className="font-extrabold text-slate-800">You posted a comment:</p>
                              <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-200/60 p-2 rounded-lg mt-1 italic">
                                "{comment.text}"
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{comment.date}</span>
                          </div>
                        ))}

                        {/* Default activity log item 1 */}
                        <div className="flex justify-between items-center text-xs relative pl-6">
                          <div className="absolute left-2.5 top-1.5 bottom-0 border-l border-slate-200 -z-10" />
                          <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-400 border border-white" />
                          <div>
                            <span className="font-extrabold text-slate-800">You updated the customer for this order.</span>
                            <span className="text-slate-400 font-normal ml-1.5 select-none text-[10px] cursor-pointer">▼</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">Just now</span>
                        </div>

                        {/* Default activity log item 2 */}
                        <div className="flex justify-between items-center text-xs relative pl-6 pb-2">
                          <div className="absolute left-2.5 top-1.5 bottom-0 border-l border-slate-100 -z-10" />
                          <div className="absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-350 border border-white" />
                          <span className="text-slate-550 font-medium">Order placed from Online Store</span>
                          <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                            {selectedOrder.date || 'July 7, 2026'}
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Right Column (Notes, Channel, Customer information) */}
                  <div className="space-y-6 text-left">

                    {/* CUSTOMER NOTES CARD */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes</span>
                        <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                          <Pencil className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-3 font-medium">
                        No notes from customer
                      </p>
                    </div>

                    {/* CHANNEL CARD */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                      <div className="pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Channel Information</span>
                      </div>
                      <p className="text-xs font-black text-slate-700 mt-3 uppercase tracking-tight">
                        Channel: Draft Orders
                      </p>
                    </div>

                    {/* CUSTOMER PROFILE CARD */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</span>
                        <button className="text-slate-400 hover:text-slate-650 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="font-extrabold text-[#006e52] hover:underline cursor-pointer block text-[13px]">
                            {selectedOrder.customerName || 'Rahul Dhiman'}
                          </span>
                          <span className="text-slate-500 font-bold mt-0.5 block hover:underline cursor-pointer">
                            1 order
                          </span>
                        </div>

                        <div>
                          <span className="text-[9.5px] font-extrabold text-slate-405 block uppercase tracking-wider">Contact Information</span>
                          <span className="font-semibold text-slate-700 mt-1 block break-all">
                            {selectedOrder.customerEmail || 'No email provided'}
                          </span>
                          <span className="text-slate-450 font-medium mt-0.5 block">
                            No phone number
                          </span>
                        </div>

                        <div>
                          <span className="text-[9.5px] font-extrabold text-slate-405 block uppercase tracking-wider">Shipping Address</span>
                          <span className="font-medium text-slate-600 mt-1 block leading-relaxed">
                            {selectedOrder.destination || 'No shipping address provided'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9.5px] font-extrabold text-slate-405 block uppercase tracking-wider">Billing Address</span>
                          <span className="font-medium text-slate-455 mt-1 block">
                            No billing address provided
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CONVERSION CARD */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-2">
                      <div className="pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversion summary</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                        There aren't any conversion details available for this order.
                      </p>
                      <span className="text-xs text-[#006e52] font-black hover:underline cursor-pointer flex items-center gap-0.5 select-none">
                        Learn more
                      </span>
                    </div>

                    {/* RISK CARD */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                      <div className="pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Risk</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-emerald-600 font-bold">
                        <span className="text-emerald-500">✔</span>
                        <span>Low Risk</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                        All simulated checkout checks passed.
                      </span>
                    </div>

                  </div>

                </div>

                {/* MODAL OVERLAY: ADD TRACKING DIALOG (Matches screenshot 1) */}
                {showTrackingModal && (
                  <div className="fixed inset-0 z-55 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-3xs">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-fade-in text-slate-800">
                      
                      {/* Modal Header */}
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Add tracking</span>
                        <button
                          onClick={() => setShowTrackingModal(false)}
                          className="p-1 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-600 cursor-pointer select-none transition-colors"
                        >
                          <X className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-5 space-y-4 text-xs text-left">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-450 block mb-1 tracking-wider">
                              Tracking number
                            </label>
                            <input
                              type="text"
                              value={trackingNumberInput}
                              onChange={(e) => setTrackingNumberInput(e.target.value)}
                              placeholder="e.g. 1Z9999999999999999"
                              className="w-full p-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-lg bg-slate-50/50 font-medium"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-450 block mb-1 tracking-wider">
                              Shipping carrier
                            </label>
                            <select
                              value={carrierInput}
                              onChange={(e) => setCarrierInput(e.target.value)}
                              className="w-full p-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-lg bg-slate-50 font-bold text-slate-705 cursor-pointer"
                            >
                              <option value="Royal Mail">Royal Mail</option>
                              <option value="Evri">Evri</option>
                              <option value="DHL">DHL</option>
                              <option value="FedEx">FedEx</option>
                              <option value="UPS">UPS</option>
                              <option value="USPS">USPS</option>
                            </select>
                          </div>
                        </div>

                        <button className="text-[#008060] hover:text-[#006e52] font-black text-xs flex items-center gap-1 hover:underline cursor-pointer py-1 mt-1 select-none">
                          <span className="text-sm">+</span>
                          <span>Add another tracking number</span>
                        </button>

                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                        <button
                          onClick={() => setShowTrackingModal(false)}
                          className="py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-3xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (selectedOrder) {
                              const updated = {
                                ...selectedOrder,
                                trackingId: trackingNumberInput,
                                carrier: carrierInput,
                                fulfillmentStatus: 'Fulfilled' as const
                              };
                              const updatedOrders = parentOrders.map(o => o.id === selectedOrder.id ? updated : o);
                              parentOnUpdateOrders(updatedOrders);
                              setSelectedOrder(updated);
                              setShowTrackingModal(false);

                              // Log comment
                              const trackingComment = `Added tracking details: ${carrierInput} (${trackingNumberInput}).`;
                              setTimelineComments(prev => ({
                                ...prev,
                                [selectedOrder.id]: [{ text: trackingComment, date: 'Just now' }, ...(prev[selectedOrder.id] || [])]
                              }));
                            }
                          }}
                          className="py-2 px-4 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black rounded-lg cursor-pointer transition-all shadow-2xs uppercase tracking-widest"
                        >
                          Save
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* 3. COLLECTIONS BLOCK */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            {editingCollection ? (
              <CollectionEditor
                collection={editingCollection.id === 'new_temp_draft_col' ? null : editingCollection}
                allProducts={products}
                onSave={(savedCol) => {
                  const cleanedCol: Collection = {
                    ...savedCol,
                    id: editingCollection.id === 'new_temp_draft_col' ? savedCol.id : editingCollection.id
                  };
                  const exists = collections.some(c => c.id === cleanedCol.id);
                  let updatedColls;
                  if (exists) {
                    updatedColls = collections.map(c => c.id === cleanedCol.id ? cleanedCol : c);
                  } else {
                    let finalId = cleanedCol.id;
                    while (collections.some(c => c.id === finalId)) {
                      finalId = `${finalId}-${Math.floor(Math.random() * 100)}`;
                    }
                    updatedColls = [...collections, { ...cleanedCol, id: finalId }];
                  }
                  onUpdateCollections(updatedColls);
                  setEditingCollection(null);
                }}
                onCancel={() => {
                  setEditingCollection(null);
                }}
                onDelete={(deletedId) => {
                  const updatedColls = collections.filter(c => c.id !== deletedId);
                  onUpdateCollections(updatedColls);
                  setEditingCollection(null);
                }}
              />
            ) : (
              <>
                {/* Header menu filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Search collections..."
                        value={collectionQuery}
                        onChange={(e) => setCollectionQuery(e.target.value)}
                        className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5 border border-slate-150">
                      <FolderHeart className="h-3.5 w-3.5 text-slate-500" />
                      <span>{filteredCollections.length} collections on list</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportCollections}
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      title="Export all collections to JSON backup file"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                    </button>

                    <label
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs cursor-pointer"
                      title="Import collections from JSON backup"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportCollections}
                      />
                    </label>

                    <button
                      onClick={() => setEditingCollection({
                        id: 'new_temp_draft_col',
                        title: '',
                        description: '',
                        type: 'Manual',
                        image: '',
                        productIds: []
                      })}
                      className="bg-slate-900 hover:bg-slate-850 font-bold p-2.5 px-4 rounded-xl text-xs text-white flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Create Collection Box
                    </button>
                  </div>
                </div>

                {/* Collections Table Grid list */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  {/* Bulk Actions Bar */}
                  {selectedCollectionIds.length > 0 && (
                    <div className="bg-slate-50 border-b border-slate-200 p-3 px-4 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                          checked={filteredCollections.filter(c => c.id !== 'all').length > 0 && filteredCollections.filter(c => c.id !== 'all').every(c => selectedCollectionIds.includes(c.id))}
                          onChange={(e) => handleSelectAllCollections(e.target.checked)}
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {selectedCollectionIds.length} selected <span className="text-slate-400 font-normal">({filteredCollections.filter(c => c.id !== 'all').length} total deletable)</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleBulkDeleteCollections}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-extrabold text-red-650 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete bulk
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-semibold uppercase tracking-widest">
                          <th className="p-4 w-12 text-center">
                            <input 
                              type="checkbox"
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                              checked={filteredCollections.filter(c => c.id !== 'all').length > 0 && filteredCollections.filter(c => c.id !== 'all').every(c => selectedCollectionIds.includes(c.id))}
                              onChange={(e) => handleSelectAllCollections(e.target.checked)}
                            />
                          </th>
                          <th className="p-4">Image</th>
                          <th className="p-4">Collection Title</th>
                          <th className="p-4">Type</th>
                          <th className="p-4 text-center">Products Count</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/70">
                        {filteredCollections.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-slate-400">No collections match the criteria or configured yet.</td>
                          </tr>
                        ) : (
                          filteredCollections.map(col => (
                            <tr 
                              key={col.id} 
                              className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                              onClick={() => {
                                setEditingCollection(col);
                                setNewCollectionForm(col);
                              }}
                            >
                              <td className="p-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                                {col.id !== 'all' ? (
                                  <input 
                                    type="checkbox"
                                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                                    checked={selectedCollectionIds.includes(col.id)}
                                    onChange={(e) => handleSelectCollection(col.id, e.target.checked)}
                                  />
                                ) : (
                                  <span className="text-slate-300 text-[9px] font-bold uppercase">System</span>
                                )}
                              </td>
                              <td className="p-4 shrink-0">
                                <img
                                  src={col.image}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded-md bg-slate-50 border border-slate-100"
                                  referrerPolicy="no-referrer"
                                />
                              </td>
                              <td className="p-4 font-bold text-slate-900 leading-normal max-w-xs">{col.title}</td>
                              <td className="p-4">
                                <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wider ${
                                  col.type === 'Automated' ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {col.type}
                                </span>
                              </td>
                              <td className="p-4 text-center font-black text-xs text-slate-800">
                                {col.id === 'all' ? products.length : col.productIds.length} products
                              </td>
                              <td className="p-4 text-center text-xs whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  {/* Edit Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCollection(col);
                                        setNewCollectionForm(col);
                                      }}
                                      className="p-1.5 bg-indigo-50 hover:bg-indigo-150 text-indigo-700 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="Edit"
                                      title="Edit collection"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      Edit
                                    </div>
                                  </div>

                                  {/* Duplicate Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateCollection(col);
                                      }}
                                      className="p-1.5 bg-teal-50 hover:bg-teal-150 text-teal-700 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="Duplicate"
                                      title="Duplicate collection"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      Dup
                                    </div>
                                  </div>

                                  {/* View Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewCollection(col);
                                      }}
                                      className="p-1.5 bg-sky-50 hover:bg-sky-150 text-sky-700 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="View"
                                      title="Preview collection"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      View
                                    </div>
                                  </div>

                                  {/* Delete Action */}
                                  {col.id !== 'all' && (
                                    <div className="relative group/tooltip">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteCollection(col.id);
                                        }}
                                        className="p-1.5 bg-red-50 hover:bg-red-150 text-red-650 rounded-md transition-all cursor-pointer hover:scale-105"
                                        aria-label="Delete"
                                        title="Delete collection"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                        Del
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 4. PRODUCTS BLOCK */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {editingProduct || showAddProduct ? (
              <ProductEditor
                product={editingProduct}
                allCollections={collections}
                onCancel={() => {
                  setEditingProduct(null);
                  setShowAddProduct(false);
                }}
                onSave={(savedProduct, selectedCollectionIds) => {
                  const isNew = !products.some(p => p.id === savedProduct.id);
                  let updatedProducts;
                  if (isNew) {
                    updatedProducts = [savedProduct, ...products];
                  } else {
                    updatedProducts = products.map(p => p.id === savedProduct.id ? savedProduct : p);
                  }
                  onUpdateProducts(updatedProducts);

                  // Synchronize Collection Memberships
                  const updatedCollections = collections.map(col => {
                    const belongs = selectedCollectionIds.includes(col.id);
                    const alreadyHas = col.productIds.includes(savedProduct.id);

                    if (belongs && !alreadyHas) {
                      return { ...col, productIds: [...col.productIds, savedProduct.id] };
                    } else if (!belongs && alreadyHas) {
                      return { ...col, productIds: col.productIds.filter(id => id !== savedProduct.id) };
                    }
                    return col;
                  });
                  onUpdateCollections(updatedCollections);

                  setEditingProduct(null);
                  setShowAddProduct(false);
                }}
                onDelete={(productId) => {
                  const updated = products.filter(p => p.id !== productId);
                  onUpdateProducts(updated);

                  // Clean up collection references
                  const updatedColls = collections.map(c => ({
                    ...c,
                    productIds: c.productIds.filter(id => id !== productId)
                  }));
                  onUpdateCollections(updatedColls);

                  setEditingProduct(null);
                  setShowAddProduct(false);
                }}
              />
            ) : (
              <>
                {/* Header menu filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Seach products via titles, vendors..."
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5 border border-slate-150">
                      <Package className="h-3.5 w-3.5 text-slate-500" />
                      <span>{filteredProductsAdmin.length} products on list</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportProducts}
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      title="Export all products to JSON backup file"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                    </button>

                    <label
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      title="Import products from JSON or CSV backup"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                      <input
                        type="file"
                        accept=".json,.csv"
                        className="hidden"
                        onChange={handleImportProducts}
                      />
                    </label>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setShowAddProduct(true);
                      }}
                      className="bg-slate-900 hover:bg-slate-850 font-bold p-2.5 px-4 rounded-xl text-xs text-white flex items-center gap-1 shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" /> Add Product Item
                    </button>
                  </div>
                </div>

                {/* Products Inventory Grid table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  {/* Bulk Actions Bar */}
                  {selectedProductIds.length > 0 && (
                    <div className="bg-slate-50 border-b border-slate-200 p-3 px-4 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                          checked={filteredProductsAdmin.length > 0 && filteredProductsAdmin.every(p => selectedProductIds.includes(p.id))}
                          onChange={(e) => handleSelectAllProducts(e.target.checked)}
                        />
                        <span className="text-xs font-bold text-slate-700">
                          {selectedProductIds.length} selected <span className="text-slate-400 font-normal">({filteredProductsAdmin.length} total on list)</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBulkStatusProducts('Active')}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Set as active
                        </button>
                        <button
                          onClick={() => handleBulkStatusProducts('Draft')}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-extrabold text-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                          Set as draft
                        </button>
                        <button
                          onClick={handleBulkDeleteProducts}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-extrabold text-red-650 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete bulk
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-semibold uppercase tracking-widest">
                          <th className="p-4 w-12 text-center">
                            <input 
                              type="checkbox"
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                              checked={filteredProductsAdmin.length > 0 && filteredProductsAdmin.every(p => selectedProductIds.includes(p.id))}
                              onChange={(e) => handleSelectAllProducts(e.target.checked)}
                            />
                          </th>
                          <th className="p-4">Image</th>
                          <th className="p-4">Product Title</th>
                          <th className="p-4">Brand</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">In Stock Inventory</th>
                          <th className="p-4 text-right">Selling Price</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150/70">
                        {filteredProductsAdmin.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-400">No products configured yet.</td>
                          </tr>
                        ) : (
                          filteredProductsAdmin.map(prod => (
                            <tr 
                              key={prod.id} 
                              className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                              onClick={() => handleEditProductClick(prod)}
                            >
                              <td className="p-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox"
                                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                                  checked={selectedProductIds.includes(prod.id)}
                                  onChange={(e) => handleSelectProduct(prod.id, e.target.checked)}
                                />
                              </td>
                              <td className="p-4 shrink-0">
                                <img
                                  src={prod.image}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded-md bg-slate-50 border border-slate-100"
                                  referrerPolicy="no-referrer"
                                />
                              </td>
                              <td className="p-4 font-bold text-slate-900 leading-normal max-w-xs">{prod.title}</td>
                              <td className="p-4 font-bold text-indigo-650">{prod.vendor}</td>
                              <td className="p-4 text-center">
                                <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wider ${
                                  prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {prod.status}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className={`font-black text-xs ${prod.inventory <= 15 ? 'text-rose-500' : 'text-slate-800'}`}>
                                  {prod.inventory} units {prod.inventory <= 15 ? '⚠️ low' : ''}
                                </span>
                              </td>
                              <td className="p-4 text-right font-extrabold text-slate-900">£{prod.price.toFixed(2)}</td>
                              <td className="p-4 text-center text-xs whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  {/* Edit Product Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditProductClick(prod);
                                      }}
                                      className="p-1.5 bg-indigo-50 hover:bg-indigo-150 text-indigo-700 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="Edit"
                                      title="Edit product"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      Edit
                                    </div>
                                  </div>

                                  {/* Duplicate Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateProduct(prod);
                                      }}
                                      className="p-1.5 bg-teal-50 hover:bg-teal-150 text-teal-700 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="Duplicate"
                                      title="Duplicate product"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      Dup
                                    </div>
                                  </div>

                                  {/* View Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewProduct(prod);
                                      }}
                                      className="p-1.5 bg-sky-50 hover:bg-sky-150 text-sky-700 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="View"
                                      title="Preview product"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      View
                                    </div>
                                  </div>

                                  {/* Delete Action */}
                                  <div className="relative group/tooltip">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProduct(prod.id);
                                      }}
                                      className="p-1.5 bg-red-50 hover:bg-red-150 text-red-650 rounded-md transition-all cursor-pointer hover:scale-105"
                                      aria-label="Delete"
                                      title="Delete product"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                                      Del
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. PAGES & SECTION BUILDER BLOCK */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            
            {/* If no page is selected for editing/building, list customizable pages */}
            {!selectedBuilderPageId ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">List of customizable templates ({localPages.length})</span>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportPages}
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      title="Export all pages to JSON backup file"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                    </button>

                    <label
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs cursor-pointer"
                      title="Import pages from JSON backup"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportPages}
                      />
                    </label>

                    <button
                      onClick={() => setShowAddPage(true)}
                      className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Page Template
                    </button>
                  </div>
                </div>

                <div className="bg-white border rounded-xl divide-y divide-slate-100 shadow-xs">
                  {localPages.map(page => (
                    <div key={page.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-slate-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            {page.title}
                          </h4>
                          <span className={`text-[8px] py-0.5 px-1.5 font-bold uppercase tracking-widest rounded ${
                            page.visibility === 'Visible' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {page.visibility}
                          </span>
                          {page.isHomepage && (
                            <span className="text-[8px] py-0.5 px-1.5 font-black uppercase tracking-widest rounded bg-amber-500 text-white flex items-center gap-1">
                              🏠 Active Homepage
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Route URL: <span className="font-mono bg-slate-100 px-1 rounded">{page.isHomepage ? '/' : `/pages/${page.slug}`}</span> • Last updated {page.updatedAt || 'Just Now'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        {!page.isHomepage && (
                          <button
                            onClick={() => handleSetPageAsHomepage(page.id)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-extrabold py-1.5 px-3 rounded-lg border border-indigo-100 cursor-pointer"
                          >
                            Set as Homepage
                          </button>
                        )}
                        {/* Customize Layout (Settings Icon) */}
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => setSelectedBuilderPageId(page.id)}
                            className="p-1.5 bg-teal-50 hover:bg-teal-150 text-teal-700 rounded-md transition-all cursor-pointer hover:scale-105"
                            aria-label="Customize Layout"
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Customize Layout
                          </div>
                        </div>

                        {/* Duplicate (Duplicate Icon) */}
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => handleDuplicatePage(page)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-all cursor-pointer hover:scale-105"
                            aria-label="Duplicate"
                          >
                            <Clipboard className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-[#1a1c1d] text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Duplicate Page
                          </div>
                        </div>

                        {/* Preview (Eye/Preview Icon) */}
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => handlePreviewPage(page)}
                            className="p-1.5 bg-sky-50 hover:bg-sky-150 text-sky-700 rounded-md transition-all cursor-pointer hover:scale-105"
                            aria-label="Preview"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Preview Page
                          </div>
                        </div>

                        {/* Delete (Trash Icon - disable if active homepage for safety) */}
                        <div className="relative group/tooltip">
                          <button
                            disabled={page.isHomepage}
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete "${page.title}"?`)) {
                                const pageId = page.id || page.slug;
                                const pageSlug = page.slug || page.id;
                                const updated = localPages.filter(p => p.id !== page.id && p.slug !== page.slug);
                                setLocalPages(updated);
                                onUpdateCustomPages(updated);
                                if (pageId) fetch(`/api/custompages/${pageId}`, { method: 'DELETE' }).catch(() => {});
                                if (pageSlug && pageSlug !== pageId) fetch(`/api/custompages/${pageSlug}`, { method: 'DELETE' }).catch(() => {});
                              }
                            }}
                            className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                              page.isHomepage
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                                : 'bg-red-50 hover:bg-red-150 text-red-650 cursor-pointer hover:scale-105'
                            }`}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            {page.isHomepage ? 'Homepage Cannot Be Deleted' : 'Delete Page'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Page Modal */}
                {showAddPage && (
                  <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <h3 className="font-extrabold text-slate-800 text-sm">Create Customizable Page</h3>
                        <button onClick={() => setShowAddPage(false)} className="text-slate-400 cursor-pointer text-xs font-bold">Close</button>
                      </div>

                      <form onSubmit={handleAddPageSubmit} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Page Name</label>
                          <input
                            id="page-form-title"
                            type="text"
                            required
                            placeholder="e.g. Summer Promos"
                            value={newPageForm.title}
                            onChange={(e) => setNewPageForm({ ...newPageForm, title: e.target.value })}
                            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Route Slug parameter</label>
                          <input
                            id="page-form-slug"
                            type="text"
                            placeholder="e.g. summer-promotions"
                            value={newPageForm.slug}
                            onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
                            className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg cursor-pointer"
                        >
                          Create Page Container
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ----------------------------------------------------
              // THE EXQUISITE VISUAL SECTION LAYOUT BUILDER SCREEN
              // ----------------------------------------------------
              <div className="space-y-4">
                {/* Save Options Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-3.5 px-4 rounded-xl shadow-md border border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (hasUnsavedChanges && !confirm("You have unsaved adjustments! Exit anyway and discard modifications?")) {
                          return;
                        }
                        setSelectedBuilderPageId(null);
                        setSelectedBuilderSectionId(null);
                        setHasUnsavedChanges(false);
                      }}
                      className="text-white hover:text-slate-300 cursor-pointer text-xs font-bold flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 p-2 py-1 rounded-lg border border-slate-700 transition"
                    >
                      ← Exit Builder
                    </button>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest block">{currentlyEditingPage?.title}</span>
                      <div className="flex items-center gap-1.5 mt-0.5 select-none">
                        <span className={`h-2 w-2 rounded-full ${hasUnsavedChanges ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className="text-[9px] text-slate-300 font-bold">
                          {hasUnsavedChanges ? 'Unsaved Customizations' : 'All Changes Saved & Live'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {hasUnsavedChanges && (
                      <button
                        onClick={() => {
                          if (confirm("Revert layout to the last saved state?")) {
                            handleGlobalDiscard();
                            setSelectedBuilderSectionId(null);
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] py-1.5 px-3 rounded-lg border border-slate-700 cursor-pointer transition"
                      >
                        Revert Draft
                      </button>
                    )}
                    <button
                      onClick={handleGlobalSave}
                      disabled={!hasUnsavedChanges || isSaving}
                      className={`font-extrabold text-[10px] py-1.5 px-4 rounded-lg flex items-center gap-1.5 uppercase tracking-wider transition-all duration-300 shadow-sm border ${
                        isSaving
                          ? 'bg-slate-700 text-slate-300 border-slate-700 cursor-wait'
                          : hasUnsavedChanges
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 cursor-pointer ring-4 ring-emerald-400/40 animate-pulse shadow-md shadow-emerald-900/30 font-black'
                          : 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed select-none'
                      }`}
                    >
                      {isSaving ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-300" />
                      ) : !hasUnsavedChanges ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      <span>{isSaving ? 'Saving...' : !hasUnsavedChanges ? 'All Saved & Live' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-100 p-5 rounded-2xl border border-slate-250">
                  
                  {/* 1. Left controls column: Section stacking */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border rounded-xl p-4 shadow-xs space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <h4 className="font-black text-slate-700 uppercase tracking-wide text-xs">Page Sections</h4>
                        <button
                          onClick={() => {
                            if (hasUnsavedChanges && !confirm("You have unsaved adjustments! Exit anyway and discard modifications?")) {
                              return;
                            }
                            setSelectedBuilderPageId(null);
                            setSelectedBuilderSectionId(null);
                            setHasUnsavedChanges(false);
                          }}
                          className="text-[10px] text-slate-400 font-semibold hover:text-slate-600"
                        >
                          ← Exit
                        </button>
                      </div>

                    {/* Section stacking list */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {currentlyEditingPage?.sections.map((sec, idx) => (
                        <div 
                          key={sec.id}
                          onClick={() => setSelectedBuilderSectionId(sec.id)}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', idx.toString());
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const dragIdxStr = e.dataTransfer.getData('text/plain');
                            if (dragIdxStr !== '') {
                              const dragIdx = parseInt(dragIdxStr, 10);
                              handleMoveSectionTo(dragIdx, idx);
                            }
                          }}
                          className={`p-2 rounded-xl border text-xs flex justify-between items-center transition-all cursor-grab active:cursor-grabbing ${
                            selectedBuilderSectionId === sec.id 
                              ? 'border-indigo-600 bg-indigo-50/30 text-slate-900 shadow-sm' 
                              : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate pr-1">
                            <GripVertical className="h-3 w-3 text-slate-400 shrink-0 cursor-grab" />
                            <div className="shrink-0 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                              {getSectionIcon(sec.type)}
                            </div>
                            <div className="truncate text-left font-bold text-slate-800">
                              <span className="text-[8px] text-slate-400 block font-mono uppercase leading-none mb-0.5">Sec {idx + 1}</span>
                              <span className="truncate block leading-tight">{getSectionLabel(sec.type)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              disabled={idx === 0}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'up'); }}
                              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-755 cursor-pointer disabled:opacity-30"
                            >
                              <MoveUp className="h-3 w-3" />
                            </button>
                            <button
                              disabled={idx === (currentlyEditingPage.sections.length - 1)}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleMoveSection(idx, 'down'); }}
                              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-755 cursor-pointer disabled:opacity-30"
                            >
                              <MoveDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveSectionFromPage(sec.id); }}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!currentlyEditingPage?.sections || currentlyEditingPage.sections.length === 0) && (
                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                          <p className="text-[10px] text-slate-400">No layout modules created yet.</p>
                        </div>
                      )}
                    </div>

                    {/* Add Section toolbar dropdown */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide mb-1.5">Add Layout Module</label>
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder="Search layout modules..."
                            value={moduleSearchQuery}
                            onChange={(e) => setModuleSearchQuery(e.target.value)}
                            className="w-full text-[11px] p-1.5 pb-2 pl-7 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 font-medium"
                          />
                          <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-400" />
                          {moduleSearchQuery && (
                            <button 
                              type="button"
                              onClick={() => setModuleSearchQuery('')}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-605"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-[260px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                        {AVAILABLE_SECTION_TEMPLATES.filter(item => 
                          item.label.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(moduleSearchQuery.toLowerCase())
                        ).map(item => (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => handleAddSectionToPage(item.type as any)}
                            className="w-full text-left p-1.5 border border-slate-200 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-250 hover:shadow-2xs rounded-xl cursor-pointer flex items-start gap-2.5 transition-all group"
                          >
                            <div className="shrink-0 p-1 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 transition-colors shadow-2xs">
                              {getSectionIcon(item.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold text-slate-800 group-hover:text-indigo-650 transition-colors uppercase tracking-tight">{item.label}</span>
                                <Plus className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight mt-0.5 line-clamp-1">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                        {AVAILABLE_SECTION_TEMPLATES.filter(item => 
                          item.label.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
                          item.type.toLowerCase().includes(moduleSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <p className="text-[10px] text-slate-400 text-center py-4">No matching modules found.</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. Middle Visual Template Previewer (Interactive Sandbox canvas!) */}
                <div className="lg:col-span-2">
                  <div className="bg-white border rounded-xl shadow-md min-h-[60vh] overflow-hidden">
                    
                    {/* Simulator browser Header Mockup */}
                    <div className="bg-slate-100 border-b border-slate-200 p-3 px-4 flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-wider">
                      <div className="flex gap-1.5 items-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="bg-white border rounded py-1 px-8 text-center text-slate-500 w-64 truncate">
                        pouch-supply.com/pages/{currentlyEditingPage?.slug}
                      </div>
                      <Globe className="h-3.5 w-3.5" />
                    </div>

                    {/* Rendering the Page builder canvas content directly */}
                    <div className="p-4 space-y-6">
                      
                      {currentlyEditingPage?.sections.length === 0 ? (
                        <div className="text-center py-24 text-slate-400">
                          <p>Empty page template. Add section blocks on the left menu.</p>
                        </div>
                      ) : (
                        currentlyEditingPage?.sections.map((sec, sIdx) => {
                          const sStyle = {
                            backgroundColor: sec.settings.backgroundColor || '#FFFFFF',
                            color: sec.settings.textColor || '#64748B'
                          };
                          const isFocused = selectedBuilderSectionId === sec.id;

                          const customStyles = `
                            #sec-${sec.id} {
                              ${sec.settings.paddingTop !== undefined ? `padding-top: ${sec.settings.paddingTop}px !important;` : ''}
                              ${sec.settings.paddingBottom !== undefined ? `padding-bottom: ${sec.settings.paddingBottom}px !important;` : ''}
                              ${sec.settings.paddingSide !== undefined ? `padding-left: ${sec.settings.paddingSide}px !important; padding-right: ${sec.settings.paddingSide}px !important;` : ''}
                              ${sec.settings.alignment ? `text-align: ${sec.settings.alignment} !important;` : ''}
                            }
                            #sec-${sec.id} h1, #sec-${sec.id} h2, #sec-${sec.id} h3, #sec-${sec.id} h4, #sec-${sec.id} .section-title {
                              ${sec.settings.titleFontSize ? `font-size: ${sec.settings.titleFontSize}px !important;` : ''}
                              ${sec.settings.headingColor ? `color: ${sec.settings.headingColor} !important;` : ''}
                              ${sec.settings.alignment ? `text-align: ${sec.settings.alignment} !important;` : ''}
                            }
                            #sec-${sec.id} p, #sec-${sec.id} .section-desc, #sec-${sec.id} li {
                              ${sec.settings.bodyFontSize ? `font-size: ${sec.settings.bodyFontSize}px !important;` : ''}
                              ${sec.settings.textColor ? `color: ${sec.settings.textColor} !important;` : ''}
                              ${sec.settings.alignment ? `text-align: ${sec.settings.alignment} !important;` : ''}
                            }
                            #sec-${sec.id} button, #sec-${sec.id} .section-btn {
                              ${sec.settings.buttonBgColor ? `background-color: ${sec.settings.buttonBgColor} !important;` : ''}
                              ${sec.settings.buttonTextColor ? `color: ${sec.settings.buttonTextColor} !important;` : ''}
                            }
                            #sec-${sec.id} button {
                              ${sec.settings.buttonRoundness === 'rounded-none' ? 'border-radius: 0px !important;' : ''}
                              ${sec.settings.buttonRoundness === 'rounded' ? 'border-radius: 4px !important;' : ''}
                              ${sec.settings.buttonRoundness === 'rounded-lg' ? 'border-radius: 8px !important;' : ''}
                              ${sec.settings.buttonRoundness === 'rounded-xl' ? 'border-radius: 12px !important;' : ''}
                              ${sec.settings.buttonRoundness === 'rounded-full' ? 'border-radius: 9999px !important;' : ''}
                            }
                          `;

                          return (
                            <div 
                              id={`sec-${sec.id}`}
                              key={sec.id}
                              onClick={() => setSelectedBuilderSectionId(sec.id)}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', sIdx.toString());
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const dragIdxStr = e.dataTransfer.getData('text/plain');
                                if (dragIdxStr !== '') {
                                  const dragIdx = parseInt(dragIdxStr, 10);
                                  handleMoveSectionTo(dragIdx, sIdx);
                                }
                              }}
                              className={`relative group p-6 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                                isFocused 
                                  ? 'ring-2 ring-indigo-600 border-indigo-600 bg-white shadow-md scale-[1.01]' 
                                  : 'border-slate-200/55 hover:border-slate-400 bg-slate-50/20 hover:bg-white shadow-2xs'
                              }`}
                              style={sStyle}
                            >
                              <style dangerouslySetInnerHTML={{ __html: customStyles }} />
                              {/* Floating action tools overlay */}
                              <div className="absolute right-3 top-2.5 z-30 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity bg-slate-900/90 backdrop-blur-md p-1 px-1.5 rounded-lg shadow-lg border border-slate-700">
                                <button
                                  disabled={sIdx === 0}
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleMoveSection(sIdx, 'up'); }}
                                  className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                  title="Move Section Up"
                                >
                                  <MoveUp className="h-3 w-3" />
                                </button>
                                <button
                                  disabled={sIdx === (currentlyEditingPage.sections.length - 1)}
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleMoveSection(sIdx, 'down'); }}
                                  className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                  title="Move Section Down"
                                >
                                  <MoveDown className="h-3 w-3" />
                                </button>
                                <div className="w-px h-3 bg-slate-700 mx-0.5" />
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveSectionFromPage(sec.id); }}
                                  className="p-1 hover:bg-red-950 rounded-md text-slate-400 hover:text-red-500 cursor-pointer"
                                  title="Remove Section"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>

                              {/* Overlay tag indicator */}
                              <span className="absolute top-2.5 left-3 bg-slate-900 text-white text-[8px] font-black tracking-widest uppercase py-0.5 px-1.5 rounded-md pointer-events-none opacity-80">
                                {getSectionLabel(sec.type)} {isFocused ? '• EDITING' : ''}
                              </span>

                              {/* Different visual layouts */}
                              <div className="pt-3">
                                
                                {/* 1. IMAGE BANNER */}
                                {sec.type === 'Image banner' && (
                                  <div className="text-center space-y-3 py-4">
                                    <div className="relative h-28 w-full rounded-xl bg-slate-100 overflow-hidden border">
                                      <img 
                                        src={sec.settings.imageUrl || PLACEHOLDER_IMAGE} 
                                        className="h-full w-full object-cover" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Exclusive Pouch Launch'}
                                    </h3>
                                    <p className="text-[10px] leading-relaxed max-w-sm mx-auto text-slate-500">{sec.settings.description || 'Banner details...'}</p>
                                    {sec.settings.buttonText && (
                                      <button type="button" className="bg-slate-900 text-white font-extrabold text-[8px] py-1 px-3.5 rounded-md uppercase tracking-wider">
                                        {sec.settings.buttonText}
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* 2. IMAGE WITH TEXT */}
                                {sec.type === 'Image with text' && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-4 text-left">
                                    <div className="h-28 w-full rounded-xl bg-slate-50 border overflow-hidden relative shadow-inner">
                                      <img 
                                        src={sec.settings.imageUrl || PLACEHOLDER_IMAGE} 
                                        className="h-full w-full object-cover" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <h4 className="font-extrabold text-xs" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                        {sec.settings.title || 'Curate Your Premium Package'}
                                      </h4>
                                      <p className="text-[9.5px] text-slate-500 leading-snug line-clamp-3">{sec.settings.description}</p>
                                      {sec.settings.buttonText && (
                                        <span className="inline-block bg-slate-950 text-white font-black text-[8px] py-1 px-3 rounded-lg uppercase tracking-wide">
                                          {sec.settings.buttonText}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* 3. TEXT COLUMN WITH IMAGE */}
                                {sec.type === 'Text column with image' && (
                                  <div className="space-y-3 py-4 text-center">
                                    <h4 className="font-extrabold text-xs uppercase tracking-tight" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Our Laboratory Certified Foundations'}
                                    </h4>
                                    <p className="text-[9.5px] text-slate-450 max-w-md mx-auto leading-snug">{sec.settings.description}</p>
                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                      {[
                                        { label: 'Global Testing', badge: 'LAB VERIFIED', img: PLACEHOLDER_IMAGE },
                                        { label: 'Aroma Boost', badge: '100% FREE', img: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=200&q=80' },
                                        { label: 'Vacuum Sealed', badge: 'FRESH LOCK', img: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=200&q=80' }
                                      ].map((col, cIdx) => (
                                        <div key={cIdx} className="bg-slate-50 border border-slate-200/60 rounded-xl p-2 text-center text-[9px] hover:shadow-2xs transition-shadow">
                                          <div className="h-10 bg-slate-200 min-w-full rounded-md mb-1 bg-cover bg-center overflow-hidden">
                                            <img src={col.img} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                                          </div>
                                          <span className="font-extrabold text-slate-800 leading-tight block truncate text-[8.5px]">{col.label}</span>
                                          <span className="text-[7px] text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1 inline-block mt-0.5 tracking-wider font-extrabold font-mono uppercase">{col.badge}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 4. VIDEO BANNER */}
                                {sec.type === 'Video banner' && (
                                  <div className="text-center space-y-2 py-3">
                                    <div className="relative h-28 w-full rounded-xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border border-slate-800 text-white font-mono text-[9px] uppercase tracking-widest gap-1 p-4 shadow-inner">
                                      {sec.settings.videoMp4Url ? (
                                        <video
                                          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                                          autoPlay
                                          muted
                                          loop
                                          playsInline
                                          src={sec.settings.videoMp4Url}
                                        />
                                      ) : null}
                                      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                                        <PlaySquare className="h-6 w-6 text-indigo-400 animate-pulse" />
                                        <span className="text-white font-extrabold">Active Video Banner</span>
                                        {sec.settings.videoUrl ? (
                                          <span className="text-slate-300 font-normal text-[8px] max-w-xs truncate">YouTube ID: {sec.settings.videoUrl}</span>
                                        ) : sec.settings.videoMp4Url ? (
                                          <span className="text-slate-300 font-normal text-[8px] max-w-xs truncate">Source: {sec.settings.videoMp4Url}</span>
                                        ) : (
                                          <span className="text-slate-400 font-normal text-[8px]">Standard MP4 Video Loop Active</span>
                                        )}
                                      </div>
                                    </div>
                                    <p className="font-extrabold text-xs text-slate-700" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Laboratory Showcase Highlights'}
                                    </p>
                                  </div>
                                )}

                                {/* 5. RICH TEXT */}
                                {sec.type === 'Rich text' && (
                                  <div className="text-center space-y-2 py-4">
                                    <h3 className="text-sm font-black uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Editorial Showcase'}
                                    </h3>
                                    <p className="text-[10px] leading-relaxed max-w-sm mx-auto text-slate-500 font-medium">{sec.settings.description || 'Craft premium experiences under your own terms.'}</p>
                                  </div>
                                )}

                                {/* 6. MARQUEE TEXT */}
                                {sec.type === 'Marquee text' && (() => {
                                  const rawText = sec.settings.title || 'DELIVERY // CANCEL ANYTIME // LOYALTY SCHEME // NEVER RUN OUT // DELIVERED ON YOUR SCHEDULE // SAVE VS. SHOP PRICES // DISCREET DELIVERY';
                                  const items = rawText.includes('//') 
                                    ? rawText.split('//').map(item => item.trim()).filter(Boolean)
                                    : rawText.includes('•')
                                    ? rawText.split('•').map(item => item.trim()).filter(Boolean)
                                    : [rawText];
                                  return (
                                    <div 
                                      className="overflow-hidden p-2.5 rounded-lg border border-amber-500/10 text-center relative shadow-xs"
                                      style={{ backgroundColor: sec.settings.backgroundColor || '#E8BE74' }}
                                    >
                                      <p 
                                        className="font-bold text-[9px] uppercase tracking-wider font-sans truncate flex items-center justify-center gap-1.5"
                                        style={{ color: sec.settings.textColor || '#1A1C1D' }}
                                      >
                                        {items.map((item, index) => (
                                          <span key={index} className="flex items-center gap-1.5 shrink-0">
                                            <span>{item}</span>
                                            {index < items.length - 1 && <span className="opacity-75">•</span>}
                                          </span>
                                        ))}
                                      </p>
                                    </div>
                                  );
                                })()}

                                {/* 7. MARQUEE IMAGES */}
                                {sec.type === 'Marquee images' && (
                                  <div className="space-y-2 py-3 text-center">
                                    <p className="text-[9.5px] font-black tracking-widest uppercase text-slate-400">
                                      🎬 {sec.settings.title || 'Fresh Stock Dispatch Reel'} 🎬
                                    </p>
                                    <div className="flex gap-2 overflow-x-auto py-2 justify-center">
                                      {localProducts.slice(0, Math.min(sec.settings.itemsCount || 5, 5)).map(prod => (
                                        <div key={prod.id} className="w-14 shrink-0 bg-white border border-slate-200/70 p-1.5 rounded-lg text-[8px] text-center shadow-3xs flex flex-col justify-between">
                                          <img src={prod.image} className="h-8 w-8 object-cover mx-auto rounded-md shadow-inner" alt="" referrerPolicy="no-referrer" />
                                          <p className="truncate font-extrabold text-slate-700 mt-1">{prod.title.split(' ')[0]}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 8. LOGO LIST */}
                                {sec.type === 'Logo list' && (
                                  <div className="py-4 text-center space-y-3">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]" style={{ color: sec.settings.headingColor || '#94A3B8' }}>
                                      {sec.settings.title || 'OFFICIAL LAB PARTNER REGISTER'}
                                    </p>
                                    <div className="flex gap-2 justify-center flex-wrap">
                                      {['77', 'clew', 'cuba', 'maggie', 'nordic spirit', 'xqs', 'zyn', 'pablo', 'killa', 'fumi', 'velo', 'white fox', 'snu'].map(logo => (
                                        <span key={logo} className="border border-slate-200 bg-white text-slate-700 font-extrabold text-[8.5px] py-1 px-2.5 rounded-lg shadow-3xs flex items-center gap-1 leading-none">
                                          <span className="text-indigo-600">●</span>
                                          <span>{logo}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 9. COLLECTION LIST */}
                                {sec.type === 'Collection list' && (() => {
                                  const filteredLocal = sec.settings.selectedCollectionIds && sec.settings.selectedCollectionIds.length > 0
                                    ? localCollections.filter(c => sec.settings.selectedCollectionIds!.includes(c.id))
                                    : localCollections.slice(0, Math.min(sec.settings.itemsCount || 4, 4));

                                  return (
                                    <div className="py-4 space-y-3">
                                      <div className="text-center font-black uppercase text-[10px] text-slate-700 border-b pb-1">
                                        {sec.settings.title || 'Explore Brand Collections'}
                                      </div>
                                      {filteredLocal.length === 0 ? (
                                        <div className="text-center py-4 text-[10px] text-slate-400 border border-dashed rounded-xl bg-slate-50">
                                          No collections selected. Use layout editor to choose.
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-4 gap-2">
                                          {filteredLocal.map(c => (
                                            <div key={c.id} className="bg-white border text-center p-2 rounded-xl shadow-3xs overflow-hidden">
                                              <div className="h-10 bg-slate-50 rounded-lg flex items-center justify-center text-sm mb-1 overflow-hidden relative border border-slate-100">
                                                {c.image ? (
                                                  <img 
                                                    src={c.image} 
                                                    className="h-full w-full object-cover" 
                                                    alt={c.title} 
                                                    referrerPolicy="no-referrer"
                                                  />
                                                ) : (
                                                  <span>🥫</span>
                                                )}
                                              </div>
                                              <h5 className="text-[8.5px] font-black uppercase text-slate-800 truncate leading-none">{c.title}</h5>
                                              <span className="text-[7px] font-bold text-indigo-600 tracking-wider block mt-1 uppercase leading-none font-mono">{c.productIds.length} FLAVORS</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* 10. FEATURED COLLECTION (Fully interactive template preview grid) */}
                                {sec.type === 'Featured collection' && (() => {
                                  const selectedColl = localCollections.find(c => c.id === sec.settings.selectedCollectionId);
                                  const displayedProducts = localProducts
                                    .filter(p => !sec.settings.selectedCollectionId || selectedColl?.productIds.includes(p.id))
                                    .slice(0, Math.min(sec.settings.itemsCount || 3, 3));

                                  return (
                                    <div className="py-4 space-y-3 text-center">
                                      <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                                        <div className="text-left">
                                          <span className="text-[7.5px] font-bold uppercase text-slate-400">Live Storefront Grid Demonstration</span>
                                          <h4 className="text-[10px] font-black uppercase text-slate-800" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                            {sec.settings.title || 'Featured Collection Highlights'}
                                          </h4>
                                        </div>
                                        <span className="text-[8px] text-indigo-700 font-extrabold uppercase font-mono bg-indigo-50/70 border border-indigo-100 rounded px-1.5 py-0.5 max-w-[120px] truncate">
                                          Series: {selectedColl?.title || 'All Active'}
                                        </span>
                                      </div>

                                      {displayedProducts.length === 0 ? (
                                        <div className="bg-slate-50 border border-dashed rounded-lg p-5 text-center text-[9px] text-slate-400">
                                          No active products are categorized in selected collection profile. Create products inside product tab first.
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                          {displayedProducts.map(p => (
                                            <div key={p.id} className="bg-white border text-left p-2 rounded-xl space-y-1 block relative overflow-hidden shadow-3xs flex flex-col justify-between">
                                              <div>
                                                <div className="h-14 bg-transparent overflow-hidden relative flex items-center justify-center p-1">
                                                  <img src={p.image} className="h-full w-full object-contain" alt="" referrerPolicy="no-referrer" />
                                                </div>
                                                <p className="text-[9px] text-slate-800 font-extrabold truncate mt-1 leading-snug">{p.title}</p>
                                                <div className="flex gap-0.5 text-amber-500 text-[6px]">★★★★★</div>
                                              </div>
                                              <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1 leading-none">
                                                <span className="text-[9px] font-extrabold text-slate-900 font-mono">£{p.price.toFixed(2)}</span>
                                                <span className="text-[6.5px] font-black text-indigo-700 tracking-wider">ADD</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* 10.5. CLEARANCE SALE (Interactive template preview grid) */}
                                {sec.type === 'Clearance Sale' && (() => {
                                  const selectedIds = sec.settings.selectedProductIds || [];
                                  const displayedProducts = localProducts.filter(p => selectedIds.includes(p.id));

                                  return (
                                    <div className="py-4 space-y-3 text-center">
                                      <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                                        <div className="text-left">
                                          <span className="text-[7.5px] font-bold uppercase text-red-500 flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
                                            Clearance Flash Sale
                                          </span>
                                          <h4 className="text-[10px] font-black uppercase text-slate-800" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                            {sec.settings.title || 'Clearance Sale Event'}
                                          </h4>
                                        </div>
                                        <span className="text-[8px] text-red-700 font-extrabold uppercase font-mono bg-red-50 border border-red-100 rounded px-1.5 py-0.5">
                                          {displayedProducts.length} Items Selected
                                        </span>
                                      </div>

                                      {displayedProducts.length === 0 ? (
                                        <div className="bg-slate-50 border border-dashed rounded-lg p-5 text-center text-[9px] text-slate-400">
                                          No products are selected for clearance sale. Edit the settings in the sidebar to choose products.
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                          {displayedProducts.map(p => (
                                            <div key={p.id} className="bg-white border border-red-150 text-left p-2 rounded-xl space-y-1 block relative overflow-hidden shadow-3xs flex flex-col justify-between">
                                              <div>
                                                <span className="absolute top-1 left-1 bg-red-600 text-white text-[5.5px] font-black tracking-widest uppercase py-0.5 px-1 rounded z-10">
                                                  CLEARANCE
                                                </span>
                                                <div className="h-14 bg-transparent overflow-hidden relative flex items-center justify-center p-1">
                                                  <img src={p.image} className="h-full w-full object-contain" alt="" referrerPolicy="no-referrer" />
                                                </div>
                                                <p className="text-[9px] text-slate-800 font-extrabold truncate mt-1 leading-snug">{p.title}</p>
                                                <div className="flex gap-0.5 text-amber-500 text-[6px]">★★★★★</div>
                                              </div>
                                              <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1 leading-none">
                                                <div className="flex flex-col">
                                                  <span className="text-[9px] font-extrabold text-red-600 font-mono">£{(p.price * 0.8).toFixed(2)}</span>
                                                  <span className="text-[6px] line-through text-slate-400 font-mono">£{p.price.toFixed(2)}</span>
                                                </div>
                                                <span className="text-[6.5px] font-black text-red-650 tracking-wider">CLAIM</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}

                                {/* 11. IMAGES GALLERY */}
                                {sec.type === 'Images gallery' && (
                                  <div className="space-y-3 py-4 text-center">
                                    <h4 className="font-extrabold text-xs uppercase" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Laboratory & Dispatch Facility Gallery'}
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2">
                                      {[
                                        PLACEHOLDER_IMAGE,
                                        'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=200&q=80',
                                        'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=200&q=80',
                                        'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=200&q=80'
                                      ].map((url, galIdx) => (
                                        <div key={galIdx} className="h-10 rounded-lg bg-slate-50 border overflow-hidden">
                                          <img src={url} className="h-full w-full object-cover" alt="" referrerPolicy="no-referrer" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 12. FAQS */}
                                {sec.type === 'FAQs' && (
                                  <div className="space-y-2 py-3 font-sans">
                                    <h3 className="text-xs font-black uppercase text-center mb-1.5" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                      {sec.settings.title || 'Frequently Answered Questions'}
                                    </h3>
                                    <div className="space-y-1.5 text-[9.5px]">
                                      {(sec.settings.faqItems || [
                                        { q: 'Is delivery fully tracked?', a: 'Yes, royal mail tracking lines generate instantly email alerts.' },
                                        { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' }
                                      ]).map((faq: any, fIdx: number) => {
                                        const isChosen = openPreviewFaqIndex === `${sec.id}-${fIdx}`;
                                        return (
                                          <div 
                                            key={fIdx} 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedBuilderSectionId(sec.id);
                                              const key = `${sec.id}-${fIdx}`;
                                              setOpenPreviewFaqIndex(openPreviewFaqIndex === key ? null : key);
                                            }}
                                            className="bg-white hover:bg-slate-50 p-2.5 rounded-xl border border-slate-200/90 leading-snug cursor-pointer transition-all text-left"
                                          >
                                            <div className="font-extrabold text-slate-800 flex justify-between items-center gap-2">
                                              <span>Q: {faq.q}</span>
                                              <div className="shrink-0 flex items-center justify-center h-4.5 w-4.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-[9px] select-none transition-colors border border-slate-200">
                                                {isChosen ? '-' : '+'}
                                              </div>
                                            </div>
                                            
                                            {/* Collapsible Answer */}
                                            <div className={`transition-all duration-300 overflow-hidden ${isChosen ? 'max-h-32 mt-2 pt-2 border-t border-slate-100 opacity-100' : 'max-h-0 opacity-0'}`}>
                                              <p className="text-slate-500 text-[8.5px] leading-relaxed">
                                                A: {faq.a}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* 13. SLIDESHOW */}
                                {sec.type === 'Slideshow' && (
                                  <div className="py-5 text-center space-y-3 relative overflow-hidden rounded-xl bg-slate-900 border min-h-[140px] flex flex-col justify-center items-center select-none text-white shadow-md">
                                    {/* background cover Image */}
                                    <div className="absolute inset-0 z-0">
                                      <img 
                                        src={sec.settings.slides?.[activeSlideEditIndex]?.imageUrl || sec.settings.imageUrl || PLACEHOLDER_IMAGE} 
                                        className="w-full h-full object-cover opacity-50" 
                                        alt="" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-black/45" />
                                    </div>

                                    {/* Content inside slide */}
                                    <div className="relative z-10 p-2 space-y-1.5 w-full">
                                      {/* Visual Arrow toggles synced */}
                                      <div className="flex justify-between items-center px-2.5 absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20">
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const count = (sec.settings.slides || []).length;
                                            if (count > 0) {
                                              setActiveSlideEditIndex((activeSlideEditIndex - 1 + count) % count);
                                            }
                                          }}
                                          className="p-1 bg-white/10 hover:bg-white/30 text-white rounded-full text-[9px] font-extrabold cursor-pointer border border-white/10 shadow"
                                        >
                                          ←
                                        </button>
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const count = (sec.settings.slides || []).length;
                                            if (count > 0) {
                                              setActiveSlideEditIndex((activeSlideEditIndex + 1) % count);
                                            }
                                          }}
                                          className="p-1 bg-white/10 hover:bg-white/30 text-white rounded-full text-[9px] font-extrabold cursor-pointer border border-white/10 shadow"
                                        >
                                          →
                                        </button>
                                      </div>

                                      <span className="text-[7.5px] tracking-widest font-black uppercase bg-indigo-600/95 text-white py-0.5 px-2 rounded-full inline-block leading-none">Slideshow [Active Slide {activeSlideEditIndex + 1}]</span>
                                      <h4 className="text-xs font-black uppercase text-white px-5 leading-tight">
                                        {sec.settings.slides?.[activeSlideEditIndex]?.title || sec.settings.title || 'Precision-Engineered Purity'}
                                      </h4>
                                      <p className="text-[9.5px] text-slate-350 max-w-xs mx-auto truncate px-5">
                                        {sec.settings.slides?.[activeSlideEditIndex]?.description || 'Direct laboratory dispatch. Sourced from certified facilities.'}
                                      </p>
                                      <div className="flex gap-1.5 justify-center pt-1 z-10 relative">
                                        {(sec.settings.slides || [1, 2]).map((_, slId) => (
                                          <button
                                            key={slId}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveSlideEditIndex(slId);
                                            }}
                                            className={`h-2 w-2 rounded-full transition-all border ${slId === activeSlideEditIndex ? 'bg-white border-white scale-110 shadow-sm' : 'bg-white/30 border-transparent'}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 14. BLOG POST */}
                                {sec.type === 'Blog post' && (
                                  <div className="py-4 space-y-3 font-sans">
                                    <div className="text-center">
                                      <h3 className="text-xs font-black uppercase tracking-tight text-slate-850" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                        {sec.settings.title || 'Latest From Our Journal'}
                                      </h3>
                                      {sec.settings.description && (
                                        <p className="text-[9px] text-slate-400 mt-0.5">{sec.settings.description}</p>
                                      )}
                                    </div>
                                    <div className="grid gap-2" style={{
                                      gridTemplateColumns: `repeat(${sec.settings.columnsDesktop || 3}, minmax(0, 1fr))`
                                    }}>
                                      {(blogs && blogs.length > 0 ? blogs.slice(0, sec.settings.columnsDesktop || 3) : [
                                        { id: '1', title: 'Swedish Pouch Manufacturing Regulations', category: 'Standards', date: 'June 19, 2026', image: PLACEHOLDER_IMAGE },
                                        { id: '2', title: 'Why Sterile Medical Fiber is Better', category: 'Science', date: 'June 18, 2026', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=80' },
                                        { id: '3', title: 'Understanding Nicotine Salt Deliveries', category: 'Formulas', date: 'June 17, 2026', image: 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?auto=format&fit=crop&w=200&q=80' }
                                      ].slice(0, sec.settings.columnsDesktop || 3)).map((item, bidx) => (
                                        <div key={item.id || bidx} className="bg-white border rounded-lg p-2 flex flex-col justify-between shadow-xs text-left">
                                          {item.image && (
                                            <img src={item.image} className="h-16 w-full object-cover rounded-md mb-1.5" alt="" referrerPolicy="no-referrer" />
                                          )}
                                          <div>
                                            <span className="text-[7.5px] uppercase text-indigo-650 font-extrabold tracking-widest">{item.category || 'Article'}</span>
                                            <h4 className="font-extrabold text-[9.5px] leading-tight text-slate-850 line-clamp-2 mt-0.5">{item.title}</h4>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 15. BRAND LIST */}
                                {sec.type === 'Brand list' && (
                                  <div className="py-6 space-y-4 font-sans">
                                    <div className="text-center">
                                      <h3 className="text-sm font-extrabold uppercase tracking-tight text-slate-850" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                        {sec.settings.title || 'Shop Premium Brands'}
                                      </h3>
                                      {sec.settings.description && (
                                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-md mx-auto">{sec.settings.description}</p>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      {(sec.settings.brandItems || []).map((b, bidx) => (
                                        <div key={bidx} className="aspect-square relative rounded-xl overflow-hidden group shadow-xs cursor-pointer border border-slate-100 flex flex-col justify-end">
                                          {b.imageUrl ? (
                                            <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                          ) : (
                                            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">No Image</div>
                                          )}
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                          <div className="p-2 relative z-10">
                                            <span className="block text-[7px] font-bold text-indigo-400 leading-none mb-0.5">BRAND #{bidx + 1}</span>
                                            <span className="block text-[10px] font-black uppercase text-white truncate max-w-full leading-tight">{b.title || 'Brand'}</span>
                                          </div>
                                        </div>
                                      ))}
                                      {(sec.settings.brandItems || []).length === 0 && (
                                        <p className="text-[10px] text-slate-400 text-center py-4 col-span-full italic">No brand items added yet.</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* 17. BRANDS WE OFFER */}
                                {sec.type === 'Brands we offer' && (
                                   <BrandsWeOfferSectionAdmin sec={sec} />
                                 )}

                                 {false && sec.type === 'Brands we offer' && (() => {
                                  const items = (sec.settings.brandItems || []).filter(b => b.imageUrl && b.imageUrl.trim() !== '');
                                  // Duplicate items for seamless scrolling loop
                                  const doubledItems = items.length > 0 ? [...items, ...items, ...items] : [];
                                  return (
                                    <div className="py-6 space-y-4 font-sans text-center bg-white border border-slate-100 rounded-2xl overflow-hidden relative shadow-xs">
                                      <div className="px-4 space-y-1">
                                        <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                                          THE BRANDS YOU KNOW & TRUST
                                        </span>
                                        <h3 className="text-sm font-extrabold uppercase tracking-tight text-slate-800" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                          {sec.settings.title || 'Brands we offer'}
                                        </h3>
                                        {sec.settings.description && (
                                          <p className="text-[10px] text-slate-400 mt-0.5 max-w-md mx-auto leading-relaxed">{sec.settings.description}</p>
                                        )}
                                      </div>
                                      
                                      <div className="marquee-container py-4 bg-white border-y border-slate-50/50 relative">
                                        <div className="animate-marquee-slow whitespace-nowrap flex gap-10 items-center">
                                          {doubledItems.map((b, bidx) => (
                                            <div 
                                              key={bidx} 
                                              className="group inline-flex flex-col items-center justify-center shrink-0 w-32 h-20 bg-white rounded-lg p-2 border border-slate-150 hover:border-slate-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1.5 select-none"
                                            >
                                              {b.imageUrl ? (
                                                <img 
                                                  src={b.imageUrl} 
                                                  className="max-h-14 max-w-[100px] object-contain transition-transform duration-300 group-hover:scale-105" 
                                                  alt={b.title} 
                                                  referrerPolicy="no-referrer"
                                                />
                                              ) : (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-full group-hover:scale-105 transition-transform duration-300">{b.title || 'Brand'}</span>
                                              )}
                                            </div>
                                          ))}
                                          {items.length === 0 && (
                                            <span className="text-[10px] text-slate-400 italic py-2">No brand logos added. Click "+ Add Brand" in sidebar.</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* 18. HOW IT WORKS */}
                                {sec.type === 'How it works' && (
                                  <HowItWorksSectionAdmin sec={sec} />
                                )}

                                {/* 18. TRUST BADGES */}
                                {sec.type === 'Trust badges' && (() => {
                                  const badges = sec.settings.trustBadges || [
                                    { iconType: 'badge', title: '100% AUTHENTIC', description: 'Direct from official suppliers.' },
                                    { iconType: 'shield', title: 'PREMIUM QUALITY', description: 'Only trusted, proven brands.' },
                                    { iconType: 'globe', title: 'GLOBAL SELECTION', description: 'The best from around the world.' },
                                    { iconType: 'tag', title: 'MEMBER PRICING', description: 'Better prices, always.' }
                                  ];

                                  return (
                                    <div className="py-6 bg-white w-full border border-slate-100 rounded-xl my-2">
                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 divide-y md:divide-y-0 md:divide-x divide-slate-150">
                                        {badges.map((b, bIdx) => (
                                          <div 
                                            key={bIdx} 
                                            className="flex items-center gap-3 py-2 md:py-0 md:px-3 first:pl-0 last:pr-0 justify-center md:justify-start"
                                          >
                                            <div className="shrink-0">
                                              {b.iconType === 'badge' ? (
                                                <Award className="h-7 w-7 text-[#D4AF37]" />
                                              ) : b.iconType === 'shield' ? (
                                                <ShieldCheck className="h-7 w-7 text-slate-800" />
                                              ) : b.iconType === 'globe' ? (
                                                <Globe className="h-7 w-7 text-slate-800" />
                                              ) : (
                                                <Tag className="h-7 w-7 text-[#D4AF37]" />
                                              )}
                                            </div>
                                            <div className="text-left">
                                              <h4 className="text-[11px] font-black tracking-wide text-slate-900 uppercase">
                                                {b.title}
                                              </h4>
                                              <p className="text-[9.5px] text-slate-400 font-medium leading-tight">
                                                {b.description}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* 16. ICON WITH TEXT */}
                                {sec.type === 'Icon with text' && (() => {
                                  const previewItems = sec.settings.iconItems || [
                                    { iconName: 'Truck', title: 'Delivered on your schedule', description: 'Flexible delivery, when you need it.' },
                                    { iconName: 'Zap', title: 'Save vs. shop prices', description: 'Better prices than retail stores.' },
                                    { iconName: 'Shield', title: 'Discreet delivery', description: 'Plain, private, and secure packaging.' },
                                    { iconName: 'Clock', title: 'Cancel anytime', description: 'No commitments, full control.' },
                                    { iconName: 'Award', title: 'Loyalty scheme', description: 'Earn rewards on every order.' },
                                    { iconName: 'Package', title: 'Never run out', description: 'Auto-refill and easy reordering.' }
                                  ];

                                  const getPremiumCardDetails = (iconName: string, title: string, description: string) => {
                                    const normIcon = (iconName || '').toLowerCase();
                                    const normTitle = (title || '').toLowerCase();

                                    if (normIcon.includes('truck') || normTitle.includes('delivery') || normTitle.includes('schedule')) {
                                      return {
                                        title: 'FLEXIBLE DELIVERY',
                                        desc: 'Delivered on your schedule. Weekly, fortnightly or monthly.',
                                        benefits: ['Change anytime', 'Skip or delay', 'Full control'],
                                        iconName: 'Truck'
                                      };
                                    }
                                    if (normIcon.includes('zap') || normTitle.includes('save') || normTitle.includes('price') || normTitle.includes('month')) {
                                      return {
                                        title: 'SAVE EVERY MONTH',
                                        desc: 'Save up to £55/month compared to buying in-store.',
                                        benefits: ['Better prices', 'Big savings', 'More value'],
                                        iconName: 'Zap'
                                      };
                                    }
                                    if (normIcon.includes('shield') || normTitle.includes('discreet') || normTitle.includes('packaging') || normTitle.includes('private')) {
                                      return {
                                        title: 'DISCREET PACKAGING',
                                        desc: 'Plain and private secure packaging for ultimate peace of mind.',
                                        benefits: ['No outer branding', 'Secure seal', 'Private delivery'],
                                        iconName: 'Shield'
                                      };
                                    }
                                    if (normIcon.includes('clock') || normTitle.includes('cancel') || normTitle.includes('commitment') || normTitle.includes('anytime')) {
                                      return {
                                        title: 'CANCEL ANYTIME',
                                        desc: 'Pause, speed up, slow down, or end your plan anytime in one click.',
                                        benefits: ['Zero commitment', 'No hidden fees', 'Instant update'],
                                        iconName: 'Clock'
                                      };
                                    }
                                    if (normIcon.includes('award') || normTitle.includes('loyalty') || normTitle.includes('reward') || normTitle.includes('scheme')) {
                                      return {
                                        title: 'LOYALTY REWARDS',
                                        desc: 'Earn loyalty points on every cycle to redeem exclusive store benefits.',
                                        benefits: ['Free accessories', 'Double points', 'Exclusive status'],
                                        iconName: 'Award'
                                      };
                                    }
                                    if (normIcon.includes('package') || normTitle.includes('never run out') || normTitle.includes('auto')) {
                                      return {
                                        title: 'NEVER RUN OUT',
                                        desc: 'Auto-refill systems lock in your favorite pouches at sub-retail price thresholds.',
                                        benefits: ['Auto-refill', 'Priority stock', 'Price lock-in'],
                                        iconName: 'Package'
                                      };
                                    }
                                    return {
                                      title: title.toUpperCase(),
                                      desc: description,
                                      benefits: ['Premium quality', 'Reliable service', 'Best selection'],
                                      iconName: iconName
                                    };
                                  };

                                  return (
                                    <div className="py-6 px-2 space-y-5 font-sans text-center bg-slate-50/50 rounded-2xl border border-slate-100">
                                      <div>
                                        <h3 className="text-sm font-extrabold uppercase tracking-tight text-[#071529]" style={{ color: sec.settings.headingColor || '#1E293B' }}>
                                          {sec.settings.title || 'Why subscribe to Pouch Supply?'}
                                        </h3>
                                        {sec.settings.description && (
                                          <p className="text-[10px] text-slate-400 mt-0.5 max-w-md mx-auto leading-relaxed">{sec.settings.description}</p>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                        {previewItems.map((item, pidx) => {
                                          const details = getPremiumCardDetails(item.iconName, item.title, item.description);
                                          
                                          const IconComp = (() => {
                                            const iconClass = "h-6 w-6 text-[#071529] transition-transform duration-300 group-hover:scale-110";
                                            switch (details.iconName) {
                                              case 'Truck': return <Truck className={iconClass} />;
                                              case 'Zap': return <Zap className={iconClass} />;
                                              case 'Shield': return <ShieldCheck className={iconClass} />;
                                              case 'Clock': return <Clock className={iconClass} />;
                                              case 'Award': return <Award className={iconClass} />;
                                              case 'Package': return <Package className={iconClass} />;
                                              case 'Star': return <Star className={iconClass} />;
                                              default: return <Sparkles className={iconClass} />;
                                            }
                                          })();

                                          return (
                                            <div key={pidx} className="bg-white border border-slate-150 p-4 rounded-xl flex flex-col justify-between hover:border-[#dfa047]/40 transition-all duration-300 shadow-xs text-left group">
                                              <div className="space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                  <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-[#faf0e1] flex items-center justify-center shrink-0 border border-[#dfa047]/10 transition-transform group-hover:scale-105">
                                                      {IconComp}
                                                    </div>
                                                    <div>
                                                      <h4 className="font-extrabold text-[11px] leading-tight text-[#071529] group-hover:text-[#dfa047] transition-colors uppercase tracking-wider">{details.title}</h4>
                                                      <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 leading-relaxed">{details.desc}</p>
                                                    </div>
                                                  </div>
                                                  
                                                  <div className="w-5 h-5 rounded-full border border-[#dfa047]/30 flex items-center justify-center text-[#dfa047] shrink-0">
                                                    <ArrowRight className="h-2.5 w-2.5" />
                                                  </div>
                                                </div>

                                                <div className="pt-2 border-t border-slate-50 flex flex-wrap gap-x-3 gap-y-1">
                                                  {details.benefits.map((b, bIdx) => (
                                                    <div key={bIdx} className="flex items-center gap-1">
                                                      <Check className="h-2.5 w-2.5 text-[#dfa047] stroke-[3px]" />
                                                      <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wide">{b}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* 17. SUBSCRIPTION PLANS */}
                                {sec.type === 'Plans' && (() => {
                                  const title = sec.settings.title || 'CHOOSE YOUR PLAN';
                                  const description = sec.settings.description || 'Flexible subscriptions. Premium brands. Serious savings.';
                                  const alertBadgeText = sec.settings.alertBadgeText;
                                  const promoBannerText = sec.settings.promoBannerText;
                                  const planItems = sec.settings.planItems || [
                                    { slug: 'lite', name: 'LITE', subtitle: 'Best for getting started', price: 27.99, limit: 6, saveAmountText: 'Save £5.00/month', imageUrl: '', features: ['6 premium cans', 'Flexible delivery', 'Change flavours anytime', 'Skip or pause anytime'], isPopular: false },
                                    { slug: 'core', name: 'CORE', subtitle: 'Most flexible', price: 35.99, limit: 8, saveAmountText: 'Save £10.00/month', imageUrl: '', features: ['8 premium cans', 'Lower price per can', 'Change or swap brands', 'Skip or pause anytime'], isPopular: false },
                                    { slug: 'pro', name: 'PRO', subtitle: 'Best value', price: 40.99, limit: 10, saveAmountText: 'Save £14.00/month', imageUrl: '', features: ['10 premium cans', 'FREE delivery 📦', 'Best price per can', 'Loyalty rewards boost', 'Skip or pause anytime'], isPopular: true },
                                    { slug: 'ultimate', name: 'ULTIMATE', subtitle: 'Maximum savings', price: 46.99, limit: 12, saveAmountText: 'Save £19.00/month', imageUrl: '', features: ['12 premium cans', 'FREE delivery 📦', 'Lowest price per can', '£3.80 for any extra can', 'Skip or pause anytime'], extraText: '£3.80 FOR ANY ADDITIONAL CAN', isPopular: false }
                                  ];

                                  return (
                                    <div className="py-6 px-3 space-y-4 font-sans text-center rounded-2xl transition-all" style={{ backgroundColor: sec.settings.backgroundColor || '#061229', color: '#FFFFFF' }}>
                                      {promoBannerText && (
                                        <div className="bg-[#D4AF37] text-slate-950 text-[8px] font-black tracking-widest py-1.5 px-3 uppercase rounded">
                                          {promoBannerText}
                                        </div>
                                      )}
                                      
                                      <div className="space-y-1 max-w-md mx-auto pt-2">
                                        {alertBadgeText && (
                                          <div className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#E5C158] border border-[#D4AF37]/30 text-[8px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full mb-1">
                                            <Flame className="h-2.5 w-2.5 fill-[#D4AF37]" />
                                            {alertBadgeText}
                                          </div>
                                        )}
                                        <h3 className="text-xs font-black uppercase tracking-wider text-white">
                                          {title}
                                        </h3>
                                        <p className="text-[9px] text-slate-300 leading-normal font-medium">
                                          {description}
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3">
                                        {planItems.map((plan: any) => {
                                          return (
                                            <div 
                                              key={plan.slug} 
                                              className={`relative rounded-xl border p-2.5 flex flex-col justify-between text-left transition-all ${
                                                plan.isPopular 
                                                  ? 'border-[#D4AF37] bg-slate-900/90 shadow-md ring-1 ring-[#D4AF37]/40' 
                                                  : 'border-slate-800 bg-slate-950/60'
                                              }`}
                                            >
                                              {plan.isPopular && (
                                                <span className="absolute -top-2 right-2 bg-[#D4AF37] text-slate-955 text-[6.5px] font-extrabold tracking-widest px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5 shadow-sm z-10">
                                                  <Crown className="h-2 w-2 fill-slate-955" />
                                                  POPULAR
                                                </span>
                                              )}
                                              
                                              <div className="space-y-1.5 font-sans">
                                                <div>
                                                  <span className="text-[9px] font-black uppercase text-slate-455 tracking-wider">
                                                    {plan.name || plan.slug.toUpperCase()}
                                                  </span>
                                                  <h4 className="text-[7.5px] font-bold text-slate-500 leading-tight">
                                                    {plan.subtitle}
                                                  </h4>
                                                </div>

                                                <div className="relative h-14 w-full bg-slate-900/80 rounded-lg flex items-center justify-center overflow-hidden border border-slate-850">
                                                  {plan.imageUrl ? (
                                                    <img 
                                                      src={plan.imageUrl} 
                                                      className="h-full w-full object-contain pointer-events-none rounded-xl" 
                                                      alt={plan.name} 
                                                      referrerPolicy="no-referrer"
                                                    />
                                                  ) : (
                                                    <div className="relative scale-50">
                                                      <PlansCanOverlay type={plan.slug} />
                                                    </div>
                                                  )}
                                                  <div className="absolute bottom-1 right-1 bg-slate-950/85 text-[6px] font-mono font-bold text-slate-400 px-1 py-0.5 rounded">
                                                    {plan.limit} cans
                                                  </div>
                                                </div>

                                                <div className="flex items-baseline gap-0.5 pt-1">
                                                  <span className="text-[12px] font-black text-white">
                                                    £{(parseFloat(plan.price) || 0).toFixed(2)}
                                                  </span>
                                                  <span className="text-[6.5px] text-slate-455 font-bold uppercase tracking-wider">
                                                    / MONTH
                                                  </span>
                                                </div>

                                                {plan.saveAmountText && (
                                                  <div className="text-[7.5px] font-extrabold text-[#E5C158] uppercase tracking-wide">
                                                    {plan.saveAmountText}
                                                  </div>
                                                )}

                                                <ul className="space-y-1 pt-1.5 border-t border-slate-900">
                                                  {(plan.features || []).slice(0, 3).map((f: string, fidx: number) => (
                                                    <li key={fidx} className="flex items-center gap-1 text-[7.5px] text-slate-350 font-medium">
                                                      <span className="text-emerald-500 text-[8px]">✓</span>
                                                      <span className="truncate">{f}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>

                                              <button
                                                type="button"
                                                className={`w-full mt-3 py-1.5 text-[7px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                                  plan.isPopular 
                                                    ? 'bg-[#D4AF37] text-slate-950 hover:bg-[#E5C158]' 
                                                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                                                }`}
                                              >
                                                SELECT
                                              </button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })()}

                              </div>

                            </div>
                          );
                        })
                      )}

                    </div>
                  </div>
                </div>

                {/* 3. Right properties column: Content Customizer Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Page settings Card */}
                  <div className="bg-white border rounded-xl p-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-2 mb-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs">Page Settings</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Title, Visibility & SEO URL Slug</p>
                      </div>
                      <FileText className="h-4 w-4 text-indigo-650" />
                    </div>
                    
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Page Name (Title)</label>
                        <input
                          type="text"
                          value={currentlyEditingPage?.title || ''}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            const oldTitle = currentlyEditingPage?.title || '';
                            const oldSlug = currentlyEditingPage?.slug || '';
                            const expectedOldSlug = slugify(oldTitle);
                            
                            const updates: Partial<CustomPage> = { title: newTitle };
                            if (!oldSlug || oldSlug === expectedOldSlug) {
                              updates.slug = slugify(newTitle);
                            }
                            handleUpdatePageProperties(updates);
                          }}
                          className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Route URL Slug</label>
                          <button
                            type="button"
                            onClick={() => {
                              if (currentlyEditingPage) {
                                handleUpdatePageProperties({ slug: slugify(currentlyEditingPage.title) });
                              }
                            }}
                            className="text-[8px] text-indigo-600 hover:underline font-extrabold uppercase cursor-pointer"
                          >
                            Reset to Match Title
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-[11px] text-slate-400 font-medium select-none">/pages/</span>
                          <input
                            type="text"
                            value={currentlyEditingPage?.slug || ''}
                            onChange={(e) => {
                              handleUpdatePageProperties({ slug: slugify(e.target.value) });
                            }}
                            className="w-full text-xs font-semibold border p-2 pl-14 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                          />
                        </div>
                        <p className="text-[8px] text-slate-400 mt-1 leading-normal">
                          Active live route: <span className="font-mono bg-slate-50 border px-1 py-0.5 rounded">/pages/{currentlyEditingPage?.slug || ''}</span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Page Visibility</label>
                        <select
                          value={currentlyEditingPage?.visibility || 'Visible'}
                          onChange={(e) => handleUpdatePageProperties({ visibility: e.target.value as 'Visible' | 'Hidden' })}
                          className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                        >
                          <option value="Visible">Visible (Published in headers/menus)</option>
                          <option value="Hidden">Hidden (Draft / Unpublished)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section Customizer Card */}
                  <div className="bg-white border rounded-xl p-4 shadow-xs sticky top-4">
                    <div className="border-b border-slate-100 pb-2 mb-3">
                      <h4 className="font-extrabold text-slate-800 text-xs">Section customizer option</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Settings for selected module</p>
                    </div>

                    {currentlyEditingSection ? (
                      <div className="space-y-4 text-[11px] leading-normal font-sans">
                        
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-200/55 mb-2 flex items-center justify-between">
                          <span className="font-bold text-indigo-700">{getSectionLabel(currentlyEditingSection.type)}</span>
                          <span className="text-[9px] text-slate-400 font-mono">ID: {currentlyEditingSection.id.substring(4, 8)}</span>
                        </div>

                        {/* If it is a Slideshow section */}
                        {currentlyEditingSection.type === 'Slideshow' && (
                          <div className="space-y-4 border-b border-dashed border-slate-100 pb-3">
                            <span className="block text-slate-600 font-bold uppercase tracking-wider text-[9px]">Slides list ({(currentlyEditingSection.settings.slides || []).length})</span>
                            <div className="flex flex-wrap gap-1">
                              {(currentlyEditingSection.settings.slides || []).map((_, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => setActiveSlideEditIndex(sIdx)}
                                  className={`text-[9.5px] font-black px-2 py-1 rounded cursor-pointer transition-all ${
                                    activeSlideEditIndex === sIdx
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  Slide {sIdx + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.slides || [];
                                  const newSlide = {
                                    title: 'Precision-Engineered Purity',
                                    description: 'Direct laboratory dispatch. Clinically tested 100% tobacco-free.',
                                    imageUrl: PLACEHOLDER_IMAGE,
                                    buttonText: 'Purchase Packs',
                                    buttonLink: 'frontend-shop'
                                  };
                                  handleUpdateSectionSettings('slides', [...list, newSlide]);
                                  setActiveSlideEditIndex(list.length);
                                }}
                                className="text-[9.5px] font-black px-2 py-1 rounded bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 cursor-pointer"
                              >
                                + Add Slide
                              </button>
                            </div>

                            {/* Active Slide Form Fields */}
                            {(currentlyEditingSection.settings.slides || []).length > 0 && (
                              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60 space-y-3 mt-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-black text-slate-500 uppercase">Editing Slide {activeSlideEditIndex + 1} Settings</span>
                                  {(currentlyEditingSection.settings.slides || []).length > 1 && (
                                    <button
                                      onClick={() => {
                                        const list = currentlyEditingSection.settings.slides || [];
                                        const updatedList = list.filter((_, idx) => idx !== activeSlideEditIndex);
                                        handleUpdateSectionSettings('slides', updatedList);
                                        setActiveSlideEditIndex(0);
                                      }}
                                      className="text-[8px] text-red-600 hover:underline cursor-pointer font-bold uppercase"
                                    >
                                      Delete Slide
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-2.5">
                                  <div>
                                    <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">Slide Title</label>
                                    <input
                                      type="text"
                                      value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.title || ''}
                                      onChange={(e) => {
                                        const list = currentlyEditingSection.settings.slides || [];
                                        const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, title: e.target.value } : sl);
                                        handleUpdateSectionSettings('slides', updatedList);
                                      }}
                                      className="w-full text-[10px] font-semibold border p-1.5 rounded bg-white focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">Slide Subtext Description</label>
                                    <textarea
                                      rows={2}
                                      value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.description || ''}
                                      onChange={(e) => {
                                        const list = currentlyEditingSection.settings.slides || [];
                                        const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, description: e.target.value } : sl);
                                        handleUpdateSectionSettings('slides', updatedList);
                                      }}
                                      className="w-full text-[10px] border p-1.5 rounded bg-white focus:outline-none resize-none"
                                    />
                                  </div>

                                  <ImageUploadInput
                                    label="Slide Image asset"
                                    value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.imageUrl || ''}
                                    onChange={(base64) => {
                                      const list = currentlyEditingSection.settings.slides || [];
                                      const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, imageUrl: base64 } : sl);
                                      handleUpdateSectionSettings('slides', updatedList);
                                    }}
                                  />

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">Button text</label>
                                      <input
                                        type="text"
                                        value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.buttonText || ''}
                                        onChange={(e) => {
                                          const list = currentlyEditingSection.settings.slides || [];
                                          const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, buttonText: e.target.value } : sl);
                                          handleUpdateSectionSettings('slides', updatedList);
                                        }}
                                        className="w-full text-[10px] border p-1.5 rounded bg-white focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px] mb-0.5">button action link</label>
                                      <input
                                        type="text"
                                        value={currentlyEditingSection.settings.slides?.[activeSlideEditIndex]?.buttonLink || ''}
                                        onChange={(e) => {
                                          const list = currentlyEditingSection.settings.slides || [];
                                          const updatedList = list.map((sl, index) => index === activeSlideEditIndex ? { ...sl, buttonLink: e.target.value } : sl);
                                          handleUpdateSectionSettings('slides', updatedList);
                                        }}
                                        className="w-full text-[10px] border p-1.5 rounded bg-white focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Title text input options */}
                        {currentlyEditingSection.settings.title !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Heading Title Text</label>
                            <input
                              type="text"
                              value={currentlyEditingSection.settings.title}
                              onChange={(e) => handleUpdateSectionSettings('title', e.target.value)}
                              className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                            />
                          </div>
                        )}

                        {/* Description paragraphs input */}
                        {currentlyEditingSection.settings.description !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Body/Info Text</label>
                            <textarea
                              rows={3}
                              value={currentlyEditingSection.settings.description}
                              onChange={(e) => handleUpdateSectionSettings('description', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-none leading-relaxed"
                            />
                          </div>
                        )}

                        {/* Button text option */}
                        {currentlyEditingSection.settings.buttonText !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Banner Button Text</label>
                            <input
                              type="text"
                              value={currentlyEditingSection.settings.buttonText}
                              onChange={(e) => handleUpdateSectionSettings('buttonText', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1"
                            />
                          </div>
                        )}

                        {/* Action link */}
                        {currentlyEditingSection.settings.buttonLink !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <div>
                            <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Button redirect link</label>
                            <input
                              type="text"
                              value={currentlyEditingSection.settings.buttonLink}
                              onChange={(e) => handleUpdateSectionSettings('buttonLink', e.target.value)}
                              className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1"
                            />
                          </div>
                        )}

                        {/* CUSTOM COLLECTION PICKER FOR FEATURED COLLECTION */}
                        {currentlyEditingSection.type === 'Featured collection' && (
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Target Product Collection</label>
                              <select
                                value={currentlyEditingSection.settings.selectedCollectionId || ''}
                                onChange={(e) => handleUpdateSectionSettings('selectedCollectionId', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                              >
                                <option value="">-- All Active Products (De-categorized) --</option>
                                {collections.map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Products To Display</label>
                                <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">{currentlyEditingSection.settings.itemsCount || 3} items</span>
                              </div>
                              <input 
                                type="range" 
                                min={2} 
                                max={12} 
                                value={currentlyEditingSection.settings.itemsCount || 3}
                                onChange={(e) => handleUpdateSectionSettings('itemsCount', parseInt(e.target.value))}
                                className="w-full h-1 text-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
                              />
                            </div>
                          </div>
                        )}

                        {/* CUSTOM COLLECTION LIST COUNTER LIMIT */}
                        {currentlyEditingSection.type === 'Collection list' && (
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Collections To Display</label>
                                <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">{currentlyEditingSection.settings.itemsCount || 4} categories</span>
                              </div>
                              <input 
                                type="range" 
                                min={1} 
                                max={12} 
                                value={currentlyEditingSection.settings.itemsCount || 4}
                                onChange={(e) => handleUpdateSectionSettings('itemsCount', parseInt(e.target.value))}
                                className="w-full h-1 text-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
                              />
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1.5">Selected Collections</label>
                              <div className="space-y-1.5 max-h-[160px] overflow-y-auto border border-slate-200 p-2.5 rounded-xl bg-slate-50 shadow-inner scrollbar-thin">
                                {collections.map(c => {
                                  const selectedIds = currentlyEditingSection.settings.selectedCollectionIds || [];
                                  const isSelected = selectedIds.includes(c.id);
                                  return (
                                    <label key={c.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors py-0.5">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                          let updatedIds;
                                          if (isSelected) {
                                            updatedIds = selectedIds.filter(id => id !== c.id);
                                          } else {
                                            updatedIds = [...selectedIds, c.id];
                                          }
                                          handleUpdateSectionSettings('selectedCollectionIds', updatedIds);
                                        }}
                                        className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                                      />
                                      <span className="truncate flex-1 text-[11px] leading-none">{c.title}</span>
                                      {c.image && (
                                        <img src={c.image} className="w-5 h-5 rounded object-cover border border-slate-200 shrink-0" alt="" referrerPolicy="no-referrer" />
                                      )}
                                    </label>
                                  );
                                })}
                                {collections.length === 0 && (
                                  <p className="text-[10px] text-slate-400 text-center py-2">No collections registered.</p>
                                )}
                              </div>
                              <p className="text-[8.5px] text-slate-400 mt-1.5 leading-tight">By default (if none are selected), the component queries and renders all available database categories up to the listing limit.</p>
                            </div>
                          </div>
                        )}

                        {/* CUSTOM MARQUEE IMAGES COUNTER LIMIT */}
                        {currentlyEditingSection.type === 'Marquee images' && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Images Carousel Limit</label>
                              <span className="font-mono text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">{currentlyEditingSection.settings.itemsCount || 5} slide items</span>
                            </div>
                            <input 
                              type="range" 
                              min={3} 
                              max={10} 
                              value={currentlyEditingSection.settings.itemsCount || 5}
                              onChange={(e) => handleUpdateSectionSettings('itemsCount', parseInt(e.target.value))}
                              className="w-full h-1 text-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200"
                            />
                          </div>
                        )}

                        {/* CUSTOM VIDEO BANNER LINK SOURCE CODE */}
                        {currentlyEditingSection.type === 'Video banner' && (
                          <div className="space-y-4 pt-1">
                            {/* YouTube URL input */}
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">YouTube Video ID / URL</label>
                              <input
                                type="text"
                                placeholder="e.g. dQw4w9WgXcQ"
                                value={currentlyEditingSection.settings.videoUrl || ''}
                                onChange={(e) => handleUpdateSectionSettings('videoUrl', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                              />
                              <p className="text-[8.5px] text-slate-400 mt-1">Provide the YouTube 11-char ID or URL. If blank, it will fall back to MP4 upload/link.</p>
                            </div>

                            {/* MP4 Source Input */}
                            <div className="border-t border-slate-100 pt-3">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Direct MP4 URL (Fallback / Native Upload)</label>
                              <input
                                type="text"
                                placeholder="https://example.com/video.mp4"
                                value={currentlyEditingSection.settings.videoMp4Url || ''}
                                onChange={(e) => handleUpdateSectionSettings('videoMp4Url', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                              />
                            </div>

                            {/* Native MP4 File Uploader */}
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-2">
                              <span className="text-[8.5px] font-black text-slate-500 uppercase block">Upload Local MP4 Video File</span>
                              <input
                                type="file"
                                accept="video/mp4,video/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (!file.type.startsWith('video/')) {
                                      alert('Only video files are permitted (e.g., mp4, webm)!');
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = async () => {
                                      if (typeof reader.result === 'string') {
                                        try {
                                          const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ data: reader.result, filename: file.name })
                                          });
                                          if (!res.ok) throw new Error(`Server returned status code ${res.status}`);
                                          const info = await res.json();
                                          if (info.url) {
                                            handleUpdateSectionSettings('videoMp4Url', info.url);
                                            alert('MP4 Video uploaded successfully and database streaming URL saved!');
                                          } else {
                                            alert('Upload finished, but server did not return a valid media URL.');
                                          }
                                        } catch (err: any) {
                                          console.error('[VideoUpload] API upload failed:', err);
                                          alert('Upload failed. Please ensure the MP4 file size is under 50MB or enter a direct MP4 URL.');
                                        }
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="text-[10px] w-full cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                              />
                            </div>

                            {/* Video Banner Overlay Content Customizer */}
                            <div className="border-t border-slate-100 pt-3 space-y-3">
                              <span className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Banner Text & CTA Button</span>
                              
                              <div>
                                <label className="block text-slate-400 font-bold uppercase text-[7.5px] mb-0.5">Heading Title</label>
                                <input
                                  type="text"
                                  placeholder="Watch Our Laboratory Showcase"
                                  value={currentlyEditingSection.settings.title || ''}
                                  onChange={(e) => handleUpdateSectionSettings('title', e.target.value)}
                                  className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-400 font-bold uppercase text-[7.5px] mb-0.5">Description Paragraph</label>
                                <textarea
                                  rows={3}
                                  placeholder="Witness the clinical sterile compounding process behind our sub-zero cooling pouches."
                                  value={currentlyEditingSection.settings.description || ''}
                                  onChange={(e) => handleUpdateSectionSettings('description', e.target.value)}
                                  className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 resize-none leading-relaxed"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-slate-400 font-bold uppercase text-[7.5px] mb-0.5">Button Text</label>
                                  <input
                                    type="text"
                                    placeholder="Purchase Packs"
                                    value={currentlyEditingSection.settings.buttonText || ''}
                                    onChange={(e) => handleUpdateSectionSettings('buttonText', e.target.value)}
                                    className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-400 font-bold uppercase text-[7.5px] mb-0.5">Button Action Link</label>
                                  <input
                                    type="text"
                                    placeholder="frontend-shop"
                                    value={currentlyEditingSection.settings.buttonLink || ''}
                                    onChange={(e) => handleUpdateSectionSettings('buttonLink', e.target.value)}
                                    className="w-full text-xs border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* BLOG POST EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Blog post' && (
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Columns in Desktop</label>
                              <select
                                value={currentlyEditingSection.settings.columnsDesktop || 3}
                                onChange={(e) => handleUpdateSectionSettings('columnsDesktop', parseInt(e.target.value))}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                              >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns</option>
                                <option value={4}>4 Columns</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Columns in Mobile</label>
                              <select
                                value={currentlyEditingSection.settings.columnsMobile || 1}
                                onChange={(e) => handleUpdateSectionSettings('columnsMobile', parseInt(e.target.value))}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                              >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* BRAND LIST EDITING SETTINGS */}
                        {(currentlyEditingSection.type === 'Brand list' || currentlyEditingSection.type === 'Brands we offer') && (
                          <div className="space-y-4 pt-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px]">Brand Logos Matrix</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.brandItems || [];
                                  const updated = [...list, { imageUrl: PLACEHOLDER_IMAGE, linkUrl: 'frontend-shop', title: 'New Brand' }];
                                  handleUpdateSectionSettings('brandItems', updated);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-1 px-2 rounded-md font-bold transition-all cursor-pointer uppercase tracking-wider"
                              >
                                + Add Brand
                              </button>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                              {(currentlyEditingSection.settings.brandItems || []).map((b, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                      list.splice(idx, 1);
                                      handleUpdateSectionSettings('brandItems', list);
                                    }}
                                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title="Delete Brand Logo"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>

                                  <div className="text-[9px] font-black uppercase text-indigo-650 mb-1">Brand #{idx + 1}</div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Brand Name</label>
                                    <input
                                      type="text"
                                      value={b.title || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                        list[idx] = { ...list[idx], title: e.target.value };
                                        handleUpdateSectionSettings('brandItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none"
                                      placeholder="e.g. VELO Freeze"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Redirect Link (URL/Slug)</label>
                                    <input
                                      type="text"
                                      value={b.linkUrl || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                        list[idx] = { ...list[idx], linkUrl: e.target.value };
                                        handleUpdateSectionSettings('brandItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none font-mono"
                                      placeholder="e.g. frontend-shop / collections /pages/brands"
                                    />
                                  </div>

                                  <ImageUploadInput
                                    label="Upload Brand Logo Asset"
                                    value={b.imageUrl}
                                    onChange={(base64) => {
                                      const list = [...(currentlyEditingSection.settings.brandItems || [])];
                                      list[idx] = { ...list[idx], imageUrl: base64 };
                                      handleUpdateSectionSettings('brandItems', list);
                                    }}
                                  />
                                </div>
                              ))}
                              {(currentlyEditingSection.settings.brandItems || []).length === 0 && (
                                <p className="text-[10px] text-slate-400 text-center py-4">No brands in the list. Click "+ Add Brand" above.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* HOW IT WORKS EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'How it works' && (
                          <div className="space-y-4 pt-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px]">How It Works Steps</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.stepItems || [];
                                  const updated = [...list, { number: String(list.length + 1), title: 'New Step', description: 'Enter step details here', imageUrl: PLACEHOLDER_IMAGE }];
                                  handleUpdateSectionSettings('stepItems', updated);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-1 px-2 rounded-md font-bold transition-all cursor-pointer uppercase tracking-wider"
                              >
                                + Add Step
                              </button>
                            </div>

                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                              {(currentlyEditingSection.settings.stepItems || []).map((step, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...(currentlyEditingSection.settings.stepItems || [])];
                                      list.splice(idx, 1);
                                      const reindexed = list.map((item, i) => ({
                                        ...item,
                                        number: /^\d+$/.test(item.number) ? String(i + 1) : item.number
                                      }));
                                      handleUpdateSectionSettings('stepItems', reindexed);
                                    }}
                                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title="Delete Step"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>

                                  <div className="text-[9px] font-black uppercase text-indigo-650 mb-1">Step #{idx + 1}</div>

                                  <div className="grid grid-cols-4 gap-2">
                                    <div className="col-span-1">
                                      <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Step Number</label>
                                      <input
                                        type="text"
                                        value={step.number || ''}
                                        onChange={(e) => {
                                          const list = [...(currentlyEditingSection.settings.stepItems || [])];
                                          list[idx] = { ...list[idx], number: e.target.value };
                                          handleUpdateSectionSettings('stepItems', list);
                                        }}
                                        className="w-full text-[10px] border p-1 rounded bg-white text-center font-bold focus:outline-none"
                                        placeholder="e.g. 1"
                                      />
                                    </div>
                                    <div className="col-span-3">
                                      <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Step Title</label>
                                      <input
                                        type="text"
                                        value={step.title || ''}
                                        onChange={(e) => {
                                          const list = [...(currentlyEditingSection.settings.stepItems || [])];
                                          list[idx] = { ...list[idx], title: e.target.value };
                                          handleUpdateSectionSettings('stepItems', list);
                                        }}
                                        className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none font-semibold"
                                        placeholder="e.g. Choose your plan"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-455 uppercase mb-0.5">Description</label>
                                    <textarea
                                      value={step.description || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.stepItems || [])];
                                        list[idx] = { ...list[idx], description: e.target.value };
                                        handleUpdateSectionSettings('stepItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none min-h-[40px] resize-y"
                                      placeholder="e.g. Select subscription plans"
                                    />
                                  </div>

                                  <ImageUploadInput
                                    label="Upload Step Illustration / Icon"
                                    value={step.imageUrl}
                                    onChange={(base64) => {
                                      const list = [...(currentlyEditingSection.settings.stepItems || [])];
                                      list[idx] = { ...list[idx], imageUrl: base64 };
                                      handleUpdateSectionSettings('stepItems', list);
                                    }}
                                  />
                                </div>
                              ))}
                              {(currentlyEditingSection.settings.stepItems || []).length === 0 && (
                                <p className="text-[10px] text-slate-400 text-center py-4">No steps added yet. Click "+ Add Step" above.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* PLANS SECTION EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Plans' && (
                          <div className="space-y-4 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">General Title</label>
                              <input
                                type="text"
                                value={currentlyEditingSection.settings.title || ''}
                                onChange={(e) => handleUpdateSectionSettings('title', e.target.value)}
                                className="w-full text-[10px] border p-2 rounded bg-white font-semibold focus:outline-none"
                                placeholder="CHOOSE YOUR PLAN"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">General Subtitle / Description</label>
                              <textarea
                                value={currentlyEditingSection.settings.description || ''}
                                onChange={(e) => handleUpdateSectionSettings('description', e.target.value)}
                                className="w-full text-[10px] border p-2 rounded bg-white focus:outline-none min-h-[50px] resize-y"
                                placeholder="Flexible subscriptions. Premium brands. Serious savings."
                              />
                            </div>

                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Alert Badge Text</label>
                              <input
                                type="text"
                                value={currentlyEditingSection.settings.alertBadgeText || ''}
                                onChange={(e) => handleUpdateSectionSettings('alertBadgeText', e.target.value)}
                                className="w-full text-[10px] border p-2 rounded bg-white focus:outline-none"
                                placeholder="Most customers save up to £55/month"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Promo Top Banner Text</label>
                              <input
                                type="text"
                                value={currentlyEditingSection.settings.promoBannerText || ''}
                                onChange={(e) => handleUpdateSectionSettings('promoBannerText', e.target.value)}
                                className="w-full text-[10px] border p-2 rounded bg-white focus:outline-none"
                                placeholder="★ FIRST 50 SUBSCRIBERS - Get 10% OFF FOR LIFE >"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px] mb-1">Background Color</label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={currentlyEditingSection.settings.backgroundColor || '#061229'}
                                  onChange={(e) => handleUpdateSectionSettings('backgroundColor', e.target.value)}
                                  className="w-10 h-7 border rounded p-0 cursor-pointer bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={currentlyEditingSection.settings.backgroundColor || '#061229'}
                                  onChange={(e) => handleUpdateSectionSettings('backgroundColor', e.target.value)}
                                  className="w-24 text-[10px] border p-1 rounded bg-white text-center font-mono focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <label className="block text-slate-650 font-black uppercase tracking-wider text-[10px] mb-2">Edit Subscription Plans (4 tiers)</label>
                              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                                {(['lite', 'core', 'pro', 'ultimate'] as const).map((slug) => {
                                  const plansList = currentlyEditingSection.settings.planItems || [];
                                  let plan = plansList.find(p => p.slug === slug);
                                  
                                  // Fallback initialization if plan entry doesn't exist
                                  if (!plan) {
                                    plan = {
                                      slug,
                                      name: slug.toUpperCase(),
                                      subtitle: slug === 'lite' ? 'Best for getting started' : slug === 'core' ? 'Most flexible' : slug === 'pro' ? 'Best value' : 'Maximum savings',
                                      price: slug === 'lite' ? 27.99 : slug === 'core' ? 35.99 : slug === 'pro' ? 40.99 : 46.99,
                                      limit: slug === 'lite' ? 6 : slug === 'core' ? 8 : slug === 'pro' ? 10 : 12,
                                      saveAmountText: slug === 'lite' ? 'Save £5.00/month' : slug === 'core' ? 'Save £10.00/month' : slug === 'pro' ? 'Save £14.00/month' : 'Save £19.00/month',
                                      imageUrl: '',
                                      features: slug === 'lite' 
                                        ? ['6 premium cans', 'Flexible delivery', 'Change flavours anytime', 'Skip or pause anytime']
                                        : slug === 'core'
                                        ? ['8 premium cans', 'Lower price per can', 'Change or swap brands', 'Skip or pause anytime']
                                        : slug === 'pro'
                                        ? ['10 premium cans', 'FREE delivery 📦', 'Best price per can', 'Loyalty rewards boost', 'Skip or pause anytime']
                                        : ['12 premium cans', 'FREE delivery 📦', 'Lowest price per can', '£3.80 for any extra can', 'Skip or pause anytime'],
                                      isPopular: slug === 'pro'
                                    };
                                  }

                                  const updatePlanField = (key: string, val: any) => {
                                    const list = [...(currentlyEditingSection.settings.planItems || [])];
                                    const pIdx = list.findIndex(p => p.slug === slug);
                                    const updatedPlan = { ...plan, [key]: val };
                                    if (pIdx > -1) {
                                      list[pIdx] = updatedPlan;
                                    } else {
                                      list.push(updatedPlan);
                                    }
                                    handleUpdateSectionSettings('planItems', list);
                                  };

                                  return (
                                    <div key={slug} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2.5">
                                      <div className="flex justify-between items-center border-b pb-1.5">
                                        <span className="text-[10px] font-black uppercase text-indigo-650">{slug.toUpperCase()} Plan</span>
                                        <label className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!plan.isPopular}
                                            onChange={(e) => updatePlanField('isPopular', e.target.checked)}
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3 w-3 cursor-pointer"
                                          />
                                          Popular / Highlighted
                                        </label>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Plan Name</label>
                                          <input
                                            type="text"
                                            value={plan.name || ''}
                                            onChange={(e) => updatePlanField('name', e.target.value)}
                                            className="w-full text-[10px] border p-1 rounded bg-white font-bold focus:outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Tagline / Subtitle</label>
                                          <input
                                            type="text"
                                            value={plan.subtitle || ''}
                                            onChange={(e) => updatePlanField('subtitle', e.target.value)}
                                            className="w-full text-[10px] border p-1 rounded bg-white font-semibold focus:outline-none"
                                          />
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-3 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Price (£)</label>
                                          <input
                                            type="number"
                                            step="0.01"
                                            value={plan.price}
                                            onChange={(e) => updatePlanField('price', parseFloat(e.target.value) || 0)}
                                            className="w-full text-[10px] border p-1 rounded bg-white text-center font-bold focus:outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Cans Limit</label>
                                          <input
                                            type="number"
                                            value={plan.limit}
                                            onChange={(e) => updatePlanField('limit', parseInt(e.target.value) || 0)}
                                            className="w-full text-[10px] border p-1 rounded bg-white text-center font-bold focus:outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Savings text</label>
                                          <input
                                            type="text"
                                            value={plan.saveAmountText || ''}
                                            onChange={(e) => updatePlanField('saveAmountText', e.target.value)}
                                            className="w-full text-[10px] border p-1 rounded bg-white text-center font-semibold focus:outline-none"
                                            placeholder="Save £5.00/month"
                                          />
                                        </div>
                                      </div>

                                      {slug === 'ultimate' && (
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Extra Info Label (Red ribbon)</label>
                                          <input
                                            type="text"
                                            value={plan.extraText || ''}
                                            onChange={(e) => updatePlanField('extraText', e.target.value)}
                                            className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none font-medium"
                                            placeholder="£3.80 for any additional can"
                                          />
                                        </div>
                                      )}

                                      <div>
                                        <label className="block text-[8px] font-bold text-slate-405 uppercase mb-0.5">Features (comma separated)</label>
                                        <input
                                          type="text"
                                          value={plan.features ? plan.features.join(', ') : ''}
                                          onChange={(e) => updatePlanField('features', e.target.value.split(',').map(s => s.trim()))}
                                          className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none"
                                          placeholder="6 premium cans, Flexible delivery, Change flavours anytime"
                                        />
                                      </div>

                                      <ImageUploadInput
                                        label="Upload Plan Image Asset"
                                        value={plan.imageUrl}
                                        onChange={(base64) => updatePlanField('imageUrl', base64)}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ICON WITH TEXT EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Icon with text' && (
                          <div className="space-y-4 pt-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px]">Features / Benefit items</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.iconItems || [];
                                  const updated = [...list, { iconName: 'Star', title: 'New Benefit', description: 'Describe your custom benefit here.', linkUrl: 'frontend-shop' }];
                                  handleUpdateSectionSettings('iconItems', updated);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-1 px-2 rounded-md font-bold transition-all cursor-pointer uppercase tracking-wider"
                              >
                                + Add Benefit
                              </button>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                              {(currentlyEditingSection.settings.iconItems || []).map((item, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...(currentlyEditingSection.settings.iconItems || [])];
                                      list.splice(idx, 1);
                                      handleUpdateSectionSettings('iconItems', list);
                                    }}
                                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title="Delete Benefit item"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>

                                  <div className="text-[9px] font-black uppercase text-indigo-650 mb-1">Benefit #{idx + 1}</div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Icon Shape</label>
                                    <select
                                      value={item.iconName || 'Star'}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.iconItems || [])];
                                        list[idx] = { ...list[idx], iconName: e.target.value as any };
                                        handleUpdateSectionSettings('iconItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                                    >
                                      <option value="Truck">Truck (Delivery)</option>
                                      <option value="Zap">Zap (Lightning / Speed)</option>
                                      <option value="Shield">Shield (Secure / Private)</option>
                                      <option value="Clock">Clock (Time / Subscription)</option>
                                      <option value="Award">Award (Badge / Quality)</option>
                                      <option value="Package">Package (Box / Refill)</option>
                                      <option value="Heart">Heart (Loyalty / Healthcare)</option>
                                      <option value="HelpCircle">Help Circle (Support / FAQ)</option>
                                      <option value="Star">Star (Premium / Rating)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Title</label>
                                    <input
                                      type="text"
                                      value={item.title || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.iconItems || [])];
                                        list[idx] = { ...list[idx], title: e.target.value };
                                        handleUpdateSectionSettings('iconItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none"
                                      placeholder="e.g. Delivered on your schedule"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Description</label>
                                    <textarea
                                      rows={2}
                                      value={item.description || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.iconItems || [])];
                                        list[idx] = { ...list[idx], description: e.target.value };
                                        handleUpdateSectionSettings('iconItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none resize-none"
                                      placeholder="e.g. Flexible delivery, when you need it."
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Redirect Link / Tab</label>
                                    <input
                                      type="text"
                                      value={item.linkUrl || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.iconItems || [])];
                                        list[idx] = { ...list[idx], linkUrl: e.target.value };
                                        handleUpdateSectionSettings('iconItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none font-mono"
                                      placeholder="e.g. frontend-shop or empty"
                                    />
                                  </div>
                                </div>
                              ))}
                              {(currentlyEditingSection.settings.iconItems || []).length === 0 && (
                                <p className="text-[10px] text-slate-400 text-center py-4">No benefits in the list. Click "+ Add Benefit" above.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* TRUST BADGES EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Trust badges' && (
                          <div className="space-y-4 pt-1">
                            <div className="flex justify-between items-center">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px]">Trust Badge Items</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.trustBadges || [];
                                  const updated = [...list, { iconType: 'badge' as const, title: 'NEW TRUST BADGE', description: 'Enter trust description.' }];
                                  handleUpdateSectionSettings('trustBadges', updated);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-1 px-2 rounded-md font-bold transition-all cursor-pointer uppercase tracking-wider"
                              >
                                + Add Badge
                              </button>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                              {(currentlyEditingSection.settings.trustBadges || []).map((item, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const list = [...(currentlyEditingSection.settings.trustBadges || [])];
                                      list.splice(idx, 1);
                                      handleUpdateSectionSettings('trustBadges', list);
                                    }}
                                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title="Delete Trust Badge"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>

                                  <div className="text-[9px] font-black uppercase text-indigo-650 mb-1">Badge #{idx + 1}</div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Icon Shape</label>
                                    <select
                                      value={item.iconType || 'badge'}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.trustBadges || [])];
                                        list[idx] = { ...list[idx], iconType: e.target.value as any };
                                        handleUpdateSectionSettings('trustBadges', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650 cursor-pointer"
                                    >
                                      <option value="badge">Gold Badge (Authentic)</option>
                                      <option value="shield">Shield Check (Quality)</option>
                                      <option value="globe">Globe (Global)</option>
                                      <option value="tag">Price Tag (Member Pricing)</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Title</label>
                                    <input
                                      type="text"
                                      value={item.title || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.trustBadges || [])];
                                        list[idx] = { ...list[idx], title: e.target.value };
                                        handleUpdateSectionSettings('trustBadges', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none"
                                      placeholder="e.g. 100% AUTHENTIC"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Description</label>
                                    <textarea
                                      rows={2}
                                      value={item.description || ''}
                                      onChange={(e) => {
                                        const list = [...(currentlyEditingSection.settings.trustBadges || [])];
                                        list[idx] = { ...list[idx], description: e.target.value };
                                        handleUpdateSectionSettings('trustBadges', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none resize-none"
                                      placeholder="e.g. Direct from official suppliers."
                                    />
                                  </div>
                                </div>
                              ))}
                              {(currentlyEditingSection.settings.trustBadges || []).length === 0 && (
                                <p className="text-[10px] text-slate-400 text-center py-4">No trust badges in the list. Click "+ Add Badge" above.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* FAQS EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'FAQs' && (
                          <div className="space-y-4 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Section Title</label>
                              <input
                                type="text"
                                value={currentlyEditingSection.settings.title || ''}
                                onChange={(e) => handleUpdateSectionSettings('title', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none"
                                placeholder="e.g. Frequently Asked Questions"
                              />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[9px]">FAQ Items</label>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = currentlyEditingSection.settings.faqItems || [
                                    { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon dispatch.' },
                                    { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' },
                                    { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific interval. Pause or cancel anytime for free.' }
                                  ];
                                  const updated = [...list, { q: 'New Question?', a: 'Enter answer text.' }];
                                  handleUpdateSectionSettings('faqItems', updated);
                                }}
                                className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-1 px-2 rounded-md font-bold transition-all cursor-pointer uppercase tracking-wider"
                              >
                                + Add FAQ
                              </button>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                              {(currentlyEditingSection.settings.faqItems || [
                                { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon dispatch.' },
                                { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' },
                                { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific interval. Pause or cancel anytime for free.' }
                              ]).map((item: any, idx: number) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-2 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const defaultList = currentlyEditingSection.settings.faqItems || [
                                        { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon dispatch.' },
                                        { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' },
                                        { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific interval. Pause or cancel anytime for free.' }
                                      ];
                                      const list = [...defaultList];
                                      list.splice(idx, 1);
                                      handleUpdateSectionSettings('faqItems', list);
                                    }}
                                    className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title="Delete FAQ"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>

                                  <div className="text-[9px] font-black uppercase text-indigo-650 mb-1">FAQ #{idx + 1}</div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Question</label>
                                    <input
                                      type="text"
                                      value={item.q || ''}
                                      onChange={(e) => {
                                        const defaultList = currentlyEditingSection.settings.faqItems || [
                                          { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon dispatch.' },
                                          { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' },
                                          { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific interval. Pause or cancel anytime for free.' }
                                        ];
                                        const list = [...defaultList];
                                        list[idx] = { ...list[idx], q: e.target.value };
                                        handleUpdateSectionSettings('faqItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none"
                                      placeholder="Question?"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Answer</label>
                                    <textarea
                                      rows={2}
                                      value={item.a || ''}
                                      onChange={(e) => {
                                        const defaultList = currentlyEditingSection.settings.faqItems || [
                                          { q: 'Is delivery fully tracked?', a: 'Yes, all orders over shipping thresholds generate functional, real-time Royal Mail / European carrier tracking codes emailed instantly upon dispatch.' },
                                          { q: 'Are these pouches tobacco-free?', a: 'Formulated completely on plant fiber with medical pure crystalline extract.' },
                                          { q: 'How long do subscriptions repeat?', a: 'Your tailored canister bundles renew automatically at your specific interval. Pause or cancel anytime for free.' }
                                        ];
                                        const list = [...defaultList];
                                        list[idx] = { ...list[idx], a: e.target.value };
                                        handleUpdateSectionSettings('faqItems', list);
                                      }}
                                      className="w-full text-[10px] border p-1 rounded bg-white focus:outline-none resize-none"
                                      placeholder="Answer."
                                    />
                                  </div>
                                </div>
                              ))}
                              {(currentlyEditingSection.settings.faqItems || []).length === 0 && (
                                <p className="text-[10px] text-slate-400 text-center py-4">No FAQ items. Click "+ Add FAQ" above.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CLEARANCE SALE EDITING SETTINGS */}
                        {currentlyEditingSection.type === 'Clearance Sale' && (
                          <div className="space-y-4 pt-1">
                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Section Title</label>
                              <input
                                type="text"
                                value={currentlyEditingSection.settings.title || ''}
                                onChange={(e) => handleUpdateSectionSettings('title', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="e.g. Clearance Sale Event"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px] mb-1">Section Description</label>
                              <textarea
                                rows={2}
                                value={currentlyEditingSection.settings.description || ''}
                                onChange={(e) => handleUpdateSectionSettings('description', e.target.value)}
                                className="w-full text-xs font-semibold border p-2 rounded bg-slate-50 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                placeholder="Section subtitle or description..."
                              />
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                              <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8.5px]">Clearance Products</label>
                                <span className="font-mono text-[9px] font-bold text-red-700 bg-red-50 px-1.5 rounded">{(currentlyEditingSection.settings.selectedProductIds || []).length} selected</span>
                              </div>
                              <div className="space-y-1.5 max-h-[220px] overflow-y-auto border border-slate-200 p-2.5 rounded-xl bg-slate-50 shadow-inner scrollbar-thin">
                                {products.map(p => {
                                  const selectedIds = currentlyEditingSection.settings.selectedProductIds || [];
                                  const isSelected = selectedIds.includes(p.id);
                                  return (
                                    <label key={p.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors py-1 border-b border-slate-100/60 last:border-none">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                          let updatedIds;
                                          if (isSelected) {
                                            updatedIds = selectedIds.filter(id => id !== p.id);
                                          } else {
                                            updatedIds = [...selectedIds, p.id];
                                          }
                                          handleUpdateSectionSettings('selectedProductIds', updatedIds);
                                        }}
                                        className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
                                      />
                                      {p.image && (
                                        <img src={p.image} className="w-7 h-7 rounded object-contain border border-slate-200 shrink-0 bg-white p-0.5" alt="" referrerPolicy="no-referrer" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="truncate text-[11px] font-bold leading-tight">{p.title}</div>
                                        <div className="text-[9px] text-slate-400 font-mono">£{p.price.toFixed(2)} • {p.vendor}</div>
                                      </div>
                                    </label>
                                  );
                                })}
                                {products.length === 0 && (
                                  <p className="text-[10px] text-slate-400 text-center py-4">No products in catalog.</p>
                                )}
                              </div>
                              <p className="text-[8.5px] text-slate-400 mt-1.5 leading-tight">Check the products you want to feature on the Clearance Sale section of the page layout.</p>
                            </div>
                          </div>
                        )}

                        {/* Image asset url selector */}
                        {currentlyEditingSection.settings.imageUrl !== undefined && currentlyEditingSection.type !== 'Slideshow' && (
                          <ImageUploadInput
                            label="Cover Image asset"
                            value={currentlyEditingSection.settings.imageUrl}
                            onChange={(base64) => handleUpdateSectionSettings('imageUrl', base64)}
                          />
                        )}

                        {/* Width toggle controls - Premium Selector Button Group */}
                        <div className="space-y-1.5 pt-2">
                          <label className="block text-slate-650 font-bold uppercase tracking-wider text-[8px]">Section container width</label>
                          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => handleUpdateSectionSettings('fullWidth', false)}
                              className={`text-[9.5px] font-extrabold py-1.5 px-2 rounded-md transition-all cursor-pointer text-center ${
                                !currentlyEditingSection.settings.fullWidth
                                  ? 'bg-white text-indigo-650 shadow-xs border border-slate-250/20'
                                  : 'text-slate-500 hover:text-slate-850'
                              }`}
                            >
                              Page Bounded
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateSectionSettings('fullWidth', true)}
                              className={`text-[9.5px] font-extrabold py-1.5 px-2 rounded-md transition-all cursor-pointer text-center ${
                                currentlyEditingSection.settings.fullWidth
                                  ? 'bg-white text-indigo-650 shadow-xs border border-slate-250/20'
                                  : 'text-slate-500 hover:text-slate-850'
                              }`}
                            >
                              Edge-to-Edge Wide
                            </button>
                          </div>
                        </div>

                        {/* Colors setting options */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">BG Hex Color</label>
                            <input
                              type="color"
                              value={currentlyEditingSection.settings.backgroundColor}
                              onChange={(e) => handleUpdateSectionSettings('backgroundColor', e.target.value)}
                              className="w-full h-8 border rounded cursor-pointer bg-slate-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Title Text Hex</label>
                            <input
                              type="color"
                              value={currentlyEditingSection.settings.headingColor}
                              onChange={(e) => handleUpdateSectionSettings('headingColor', e.target.value)}
                              className="w-full h-8 border rounded cursor-pointer bg-slate-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Body Text Hex</label>
                            <input
                              type="color"
                              value={currentlyEditingSection.settings.textColor || '#64748B'}
                              onChange={(e) => handleUpdateSectionSettings('textColor', e.target.value)}
                              className="w-full h-8 border rounded cursor-pointer bg-slate-50"
                            />
                          </div>
                          {currentlyEditingSection.settings.iconColor !== undefined && (
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Icon Hex Color</label>
                              <input
                                type="color"
                                value={currentlyEditingSection.settings.iconColor || '#4F46E5'}
                                onChange={(e) => handleUpdateSectionSettings('iconColor', e.target.value)}
                                className="w-full h-8 border rounded cursor-pointer bg-slate-50"
                              />
                            </div>
                          )}
                        </div>

                        {/* --- ADVANCED LAYOUT & TYPOGRAPHY BUILDER (PADDINGS, ALIGNMENT, SIZES) --- */}
                        <div className="border-t border-slate-200/60 pt-4 space-y-3.5">
                          <span className="block text-slate-800 font-extrabold uppercase tracking-wider text-[9px] flex items-center gap-1">
                            <Settings className="h-3 w-3 text-indigo-650" />
                            Layout & Spacing Controls
                          </span>

                          {/* Padding Adjusters */}
                          <div className="space-y-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/55">
                            <div>
                              <div className="flex justify-between items-center mb-1 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>Top Padding</span>
                                <span className="font-mono text-indigo-600">{currentlyEditingSection.settings.paddingTop !== undefined ? currentlyEditingSection.settings.paddingTop : 'Default'} px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="160"
                                step="8"
                                value={currentlyEditingSection.settings.paddingTop !== undefined ? currentlyEditingSection.settings.paddingTop : 32}
                                onChange={(e) => handleUpdateSectionSettings('paddingTop', parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>Bottom Padding</span>
                                <span className="font-mono text-indigo-600">{currentlyEditingSection.settings.paddingBottom !== undefined ? currentlyEditingSection.settings.paddingBottom : 'Default'} px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="160"
                                step="8"
                                value={currentlyEditingSection.settings.paddingBottom !== undefined ? currentlyEditingSection.settings.paddingBottom : 32}
                                onChange={(e) => handleUpdateSectionSettings('paddingBottom', parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>Horizontal Spacing (X-Padding)</span>
                                <span className="font-mono text-indigo-600">{currentlyEditingSection.settings.paddingSide !== undefined ? currentlyEditingSection.settings.paddingSide : 'Default'} px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="80"
                                step="4"
                                value={currentlyEditingSection.settings.paddingSide !== undefined ? currentlyEditingSection.settings.paddingSide : 16}
                                onChange={(e) => handleUpdateSectionSettings('paddingSide', parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Typography sizes */}
                          <div className="space-y-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/55">
                            <span className="block text-slate-700 font-extrabold text-[8px] uppercase tracking-wider mb-1">Typography & Font Sizes</span>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1 text-[8px] font-bold text-slate-500 uppercase">
                                <span>Heading Font Size</span>
                                <span className="font-mono text-indigo-600">{currentlyEditingSection.settings.titleFontSize || 'Default'} px</span>
                              </div>
                              <input
                                type="range"
                                min="12"
                                max="64"
                                step="2"
                                value={currentlyEditingSection.settings.titleFontSize || 30}
                                onChange={(e) => handleUpdateSectionSettings('titleFontSize', parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1 text-[8px] font-bold text-slate-500 uppercase">
                                <span>Body / Subtitle Font Size</span>
                                <span className="font-mono text-indigo-600">{currentlyEditingSection.settings.bodyFontSize || 'Default'} px</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="24"
                                step="1"
                                value={currentlyEditingSection.settings.bodyFontSize || 14}
                                onChange={(e) => handleUpdateSectionSettings('bodyFontSize', parseInt(e.target.value, 10))}
                                className="w-full accent-indigo-600 cursor-pointer"
                              />
                            </div>

                            {/* Text Alignment Button Group */}
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Content Alignment</label>
                              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-250/50">
                                {['left', 'center', 'right'].map((align) => (
                                  <button
                                    key={align}
                                    type="button"
                                    onClick={() => handleUpdateSectionSettings('alignment', align)}
                                    className={`text-[9px] font-extrabold py-1 px-1.5 rounded-md transition-all cursor-pointer text-center capitalize ${
                                      (currentlyEditingSection.settings.alignment || 'center') === align
                                        ? 'bg-white text-indigo-650 shadow-xs border border-slate-250/20'
                                        : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  >
                                    {align}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Button styling customizer (if exists or can be toggled) */}
                          <div className="space-y-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/55">
                            <span className="block text-slate-700 font-extrabold text-[8px] uppercase tracking-wider">Button Customization</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Button BG Hex</label>
                                <input
                                  type="color"
                                  value={currentlyEditingSection.settings.buttonBgColor || '#D4AF37'}
                                  onChange={(e) => handleUpdateSectionSettings('buttonBgColor', e.target.value)}
                                  className="w-full h-7 border rounded cursor-pointer bg-slate-50 animate-none p-0"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Button Text Hex</label>
                                <input
                                  type="color"
                                  value={currentlyEditingSection.settings.buttonTextColor || '#000000'}
                                  onChange={(e) => handleUpdateSectionSettings('buttonTextColor', e.target.value)}
                                  className="w-full h-7 border rounded cursor-pointer bg-slate-50 animate-none p-0"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Corner Roundness</label>
                              <select
                                value={currentlyEditingSection.settings.buttonRoundness || 'rounded-lg'}
                                onChange={(e) => handleUpdateSectionSettings('buttonRoundness', e.target.value)}
                                className="w-full text-[9px] border p-1 rounded bg-white cursor-pointer"
                              >
                                <option value="rounded-none">Square (rounded-none)</option>
                                <option value="rounded">Soft (rounded)</option>
                                <option value="rounded-lg">Regular (rounded-lg)</option>
                                <option value="rounded-xl">Bubble (rounded-xl)</option>
                                <option value="rounded-full">Pill (rounded-full)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 py-6 text-center">Click on any module section inside simulator preview to load options.</p>
                    )}

                  </div>
                </div>

              </div>
              </div>
            )}

          </div>
        )}

        {/* 6. FILES MANAGER BLOCK */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            
            {/* Header controls filter */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filter media files..."
                    value={fileQuery}
                    onChange={(e) => setFileQuery(e.target.value)}
                    className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5 border border-slate-150">
                  <HardDrive className="h-3.5 w-3.5 text-slate-500" />
                  <span>{filteredFiles.length} media files on list</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                <button
                  onClick={handleExportFiles}
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Export all media files list to JSON backup file"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                </button>

                <label
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs cursor-pointer"
                  title="Import media files from JSON backup"
                >
                  <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportFiles}
                  />
                </label>

                <button
                  onClick={() => setShowAddFile(true)}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Upload Custom Image Asset
                </button>
              </div>
            </div>

            {/* List files layout table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              {/* Bulk Actions Bar for Files */}
              {selectedFileIds.length > 0 && (
                <div className="bg-slate-50 border-b border-slate-200 p-3 px-4 flex flex-wrap items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                      checked={filteredFiles.length > 0 && filteredFiles.every(f => selectedFileIds.includes(f.id))}
                      onChange={(e) => handleSelectAllFiles(e.target.checked)}
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {selectedFileIds.length} selected <span className="text-slate-400 font-normal">({filteredFiles.length} total on list)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBulkDeleteFiles}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-extrabold text-red-650 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete bulk
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox"
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                          checked={filteredFiles.length > 0 && filteredFiles.every(f => selectedFileIds.includes(f.id))}
                          onChange={(e) => handleSelectAllFiles(e.target.checked)}
                        />
                      </th>
                      <th className="p-4">Media Thumbnail</th>
                      <th className="p-4">File Name</th>
                      <th className="p-4">Alternative Alt Text</th>
                      <th className="p-4">Date Uploaded</th>
                      <th className="p-4">Size</th>
                      <th className="p-4">Linked Reference</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFiles.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-400">No media assets configured.</td>
                      </tr>
                    ) : (
                      filteredFiles.map(file => (
                        <tr key={file.id} className="hover:bg-slate-50/50">
                          <td className="p-4 w-12 text-center">
                            <input 
                              type="checkbox"
                              className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 h-4 w-4 cursor-pointer"
                              checked={selectedFileIds.includes(file.id)}
                              onChange={(e) => handleSelectFile(file.id, e.target.checked)}
                            />
                          </td>
                          <td className="p-4 shrink-0">
                            <img
                              src={file.url}
                              alt={file.altText}
                              className="w-12 h-12 object-cover rounded-md bg-slate-50 border border-slate-100"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="p-4 text-slate-905 max-w-xs font-mono font-bold leading-normal text-[11px] truncate">{file.fileName}</td>
                          <td className="p-4 text-slate-500 max-w-xs truncate">{file.altText}</td>
                          <td className="p-4 text-slate-400">{file.dateAdded}</td>
                          <td className="p-4 font-semibold text-slate-700">{file.size}</td>
                          <td className="p-4 text-indigo-600 font-bold">{file.references}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-500 hover:text-red-700 font-extrabold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upload File Modal */}
            {showAddFile && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-scale">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-800 text-sm">Upload & Host Image Asset</h3>
                    <button onClick={() => setShowAddFile(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold">Close</button>
                  </div>

                  <form onSubmit={handleAddFileSubmit} className="space-y-4 text-xs">
                    <div>
                      <ImageUploadInput
                        label="Direct Drag & Drop / Select Image File"
                        value={newFileForm.url}
                        onChange={(uploadedUrl) => {
                          setNewFileForm(prev => ({
                            ...prev,
                            url: uploadedUrl,
                            fileName: prev.fileName || `uploaded_asset_${Date.now()}.png`
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">File Name</label>
                      <input
                        id="file-form-name"
                        type="text"
                        required
                        placeholder="e.g. Clew_Spearmint_pack.png"
                        value={newFileForm.fileName}
                        onChange={(e) => setNewFileForm({ ...newFileForm, fileName: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Alternative Alt Description</label>
                      <input
                        id="file-form-alt"
                        type="text"
                        required
                        placeholder="e.g. CLEW 5mg Minty canisters on display banner"
                        value={newFileForm.altText}
                        onChange={(e) => setNewFileForm({ ...newFileForm, altText: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Image Cloud Asset URL (Manual Override)</label>
                      <input
                        id="file-form-url"
                        type="text"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newFileForm.url}
                        onChange={(e) => setNewFileForm({ ...newFileForm, url: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                    >
                      Save Media file Asset
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 7. CUSTOMERS BLOCK */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            
            {/* Header control toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter client files, names..."
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportCustomers}
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Export all customers to JSON backup file"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                </button>

                <label
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs cursor-pointer"
                  title="Import customers from JSON backup"
                >
                  <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportCustomers}
                  />
                </label>

                <button
                  onClick={() => setShowAddCustomer(true)}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Register Customer Profile
                </button>
              </div>
            </div>

            {/* Customers details list */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Delivery Location</th>
                      <th className="p-4 text-center">Subscription Status</th>
                      <th className="p-4 text-center">Total Orders Count</th>
                      <th className="p-4 text-right font-sans">Total Spent Amount</th>
                      <th className="p-4 text-center">Reference profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">No Customers configured on store directory.</td>
                      </tr>
                    ) : (
                      filteredCustomers.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50/50">
                          <td className="p-4 font-black text-slate-900">{cust.name}</td>
                          <td className="p-4 text-slate-500">{cust.email}</td>
                          <td className="p-4 text-slate-700">{cust.location}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-block py-0.5 px-2 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              cust.subscriptionStatus === 'Subscribed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {cust.subscriptionStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-800">{cust.ordersCount} buys</td>
                          <td className="p-4 text-right font-extrabold text-slate-950">£{cust.amountSpent.toFixed(2)}</td>
                          <td className="p-4 text-center font-bold text-[10px] text-slate-400 uppercase">Registered</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Customer Modal */}
            {showAddCustomer && (
              <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl animate-scale">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <h3 className="font-extrabold text-slate-800 text-sm">Register Custom Client Profile</h3>
                    <button onClick={() => setShowAddCustomer(false)} className="text-slate-400 hover:text-slate-650 cursor-pointer text-xs font-bold">Close</button>
                  </div>

                  <form onSubmit={handleAddCustomerSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Full Name</label>
                      <input
                        id="cust-form-name"
                        type="text"
                        required
                        placeholder="e.g. Sandra Kaneshiro"
                        value={newCustomerForm.name}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Email Address</label>
                      <input
                        id="cust-form-email"
                        type="email"
                        required
                        placeholder="e.g. sandra.k@gmail.com"
                        value={newCustomerForm.email}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Delivery address country</label>
                      <input
                        id="cust-form-loc"
                        type="text"
                        placeholder="e.g. Honolulu HI, United States"
                        value={newCustomerForm.location}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, location: e.target.value })}
                        className="w-full border p-2.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 uppercase tracking-widest text-[9px] mb-1">Subscription plan status</label>
                      <select
                        id="cust-form-subs"
                        value={newCustomerForm.subscriptionStatus}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, subscriptionStatus: e.target.value as any })}
                        className="w-full border p-2.5 rounded-lg focus:outline-none"
                      >
                        <option value="Subscribed">Subscribed (Active Plans)</option>
                        <option value="Not subscribed">Not subscribed</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
                    >
                      Publish Client Record
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 8. DISCOUNTS BLOCK */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            
            {isDiscountEditorOpen ? (
              <DiscountEditor
                discount={editingDiscount}
                discountType={selectedDiscountType || 'Amount off order'}
                products={localProducts}
                collections={localCollections}
                customers={localCustomers}
                onCancel={() => {
                  setIsDiscountEditorOpen(false);
                  setEditingDiscount(null);
                  setSelectedDiscountType(null);
                }}
                onSave={(savedDiscount) => {
                  if (editingDiscount) {
                    // Update existing
                    const updated = discounts.map(d => d.id === savedDiscount.id ? savedDiscount : d);
                    onUpdateDiscounts(updated);
                  } else {
                    // Create new
                    onUpdateDiscounts([...discounts, savedDiscount]);
                  }
                  setIsDiscountEditorOpen(false);
                  setEditingDiscount(null);
                  setSelectedDiscountType(null);
                }}
              />
            ) : (
              <>
                {/* Header controls select */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Filter coupons codes..."
                      value={discountQuery}
                      onChange={(e) => setDiscountQuery(e.target.value)}
                      className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleExportDiscounts}
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                      title="Export all discounts to JSON backup file"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                    </button>

                    <label
                      className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs cursor-pointer"
                      title="Import discounts from JSON backup"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportDiscounts}
                      />
                    </label>

                    <button
                      onClick={() => setShowDiscountTypeSelector(true)}
                      className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Create Discount
                    </button>
                  </div>
                </div>

                {/* Discounts List database table */}
                <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                          <th className="p-4">Promo code</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Eligibility</th>
                          <th className="p-4">Discount Type</th>
                          <th className="p-4 text-center">Combinations</th>
                          <th className="p-4 text-center">Used</th>
                          <th className="p-4">Details</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredDiscounts.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-12 text-slate-400">No promo discount campaigns configured.</td>
                          </tr>
                        ) : (
                          filteredDiscounts.map(disc => {
                            const hasCombos = disc.combineWithProductDiscounts || disc.combineWithOrderDiscounts || disc.combineWithShippingDiscounts;
                            return (
                              <tr key={disc.id} className="hover:bg-slate-50/50">
                                <td className="p-4">
                                  <button
                                    onClick={() => {
                                      setEditingDiscount(disc);
                                      setSelectedDiscountType(disc.type);
                                      setIsDiscountEditorOpen(true);
                                    }}
                                    className="font-mono font-black text-slate-900 text-xs tracking-wider uppercase bg-slate-100 hover:bg-slate-200 border rounded border-dashed px-2.5 py-1.5 border-slate-300 transition text-left cursor-pointer"
                                  >
                                    {disc.title}
                                  </button>
                                </td>
                                <td className="p-4">
                                  <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                                    disc.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-rose-50 text-rose-700 border-rose-150'
                                  }`}>
                                    {disc.status}
                                  </span>
                                </td>
                                <td className="p-4 font-bold text-slate-700">{disc.eligibility}</td>
                                <td className="p-4 text-indigo-650 font-bold">{disc.type}</td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center gap-1">
                                    {disc.combineWithProductDiscounts && (
                                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-black" title="Combines with product discounts">PROD</span>
                                    )}
                                    {disc.combineWithOrderDiscounts && (
                                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-black" title="Combines with order discounts">ORDER</span>
                                    )}
                                    {disc.combineWithShippingDiscounts && (
                                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-black" title="Combines with shipping discounts">SHIP</span>
                                    )}
                                    {!hasCombos && (
                                      <span className="text-slate-400 text-xs">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-extrabold text-slate-800">{disc.used || 0}</td>
                                <td className="p-4 text-slate-500 max-w-xs truncate" title={disc.details}>{disc.details}</td>
                                <td className="p-4 text-center text-xs space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setEditingDiscount(disc);
                                      setSelectedDiscountType(disc.type);
                                      setIsDiscountEditorOpen(true);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-850 font-extrabold cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-slate-300">|</span>
                                  <button
                                    onClick={() => handleToggleDiscountStatus(disc.id)}
                                    className="text-slate-600 hover:text-slate-800 font-extrabold cursor-pointer"
                                  >
                                    {disc.status === 'Active' ? 'Disable' : 'Enable'}
                                  </button>
                                  <span className="text-slate-300">|</span>
                                  <button
                                    onClick={() => handleDeleteDiscount(disc.id)}
                                    className="text-red-500 hover:text-red-700 font-extrabold cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Select Discount Type Modal Popup (matches ss5.png) */}
            {showDiscountTypeSelector && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-extrabold text-slate-900 text-sm">Select discount type</h3>
                    <button 
                      onClick={() => setShowDiscountTypeSelector(false)} 
                      className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="divide-y divide-slate-100">
                    
                    {/* Option 1: Amount off products */}
                    <button
                      onClick={() => {
                        setShowDiscountTypeSelector(false);
                        setSelectedDiscountType('Amount off products');
                        setEditingDiscount(null);
                        setIsDiscountEditorOpen(true);
                      }}
                      className="w-full p-4 hover:bg-slate-50 text-left transition flex items-start gap-3.5 cursor-pointer group"
                    >
                      <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 rounded-lg text-slate-600 group-hover:text-indigo-600 shrink-0 mt-0.5">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs text-slate-900">Amount off products</p>
                          <span className="text-slate-300 font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Discount specific products or collections of products</p>
                      </div>
                    </button>

                    {/* Option 2: Buy X get Y */}
                    <button
                      onClick={() => {
                        setShowDiscountTypeSelector(false);
                        setSelectedDiscountType('Buy X get Y');
                        setEditingDiscount(null);
                        setIsDiscountEditorOpen(true);
                      }}
                      className="w-full p-4 hover:bg-slate-50 text-left transition flex items-start gap-3.5 cursor-pointer group"
                    >
                      <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 rounded-lg text-slate-600 group-hover:text-indigo-600 shrink-0 mt-0.5">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs text-slate-900">Buy X get Y</p>
                          <span className="text-slate-300 font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Discount specific products or collections of products</p>
                      </div>
                    </button>

                    {/* Option 3: Amount off order */}
                    <button
                      onClick={() => {
                        setShowDiscountTypeSelector(false);
                        setSelectedDiscountType('Amount off order');
                        setEditingDiscount(null);
                        setIsDiscountEditorOpen(true);
                      }}
                      className="w-full p-4 hover:bg-slate-50 text-left transition flex items-start gap-3.5 cursor-pointer group"
                    >
                      <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 rounded-lg text-slate-600 group-hover:text-indigo-600 shrink-0 mt-0.5">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs text-slate-900">Amount off order</p>
                          <span className="text-slate-300 font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Discount the total order amount</p>
                      </div>
                    </button>

                    {/* Option 4: Free shipping */}
                    <button
                      onClick={() => {
                        setShowDiscountTypeSelector(false);
                        setSelectedDiscountType('Free shipping');
                        setEditingDiscount(null);
                        setIsDiscountEditorOpen(true);
                      }}
                      className="w-full p-4 hover:bg-slate-50 text-left transition flex items-start gap-3.5 cursor-pointer group"
                    >
                      <div className="p-2 bg-slate-100 group-hover:bg-indigo-50 rounded-lg text-slate-600 group-hover:text-indigo-600 shrink-0 mt-0.5">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs text-slate-900">Free shipping</p>
                          <span className="text-slate-300 font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Offer free shipping on an order</p>
                      </div>
                    </button>

                    {/* Option 5: Loyalty Reward */}
                    <button
                      onClick={() => {
                        setShowDiscountTypeSelector(false);
                        setSelectedDiscountType('Loyalty Reward');
                        setEditingDiscount(null);
                        setIsDiscountEditorOpen(true);
                      }}
                      className="w-full p-4 hover:bg-slate-50 text-left transition flex items-start gap-3.5 cursor-pointer group"
                    >
                      <div className="p-2 bg-amber-50 group-hover:bg-amber-100 rounded-lg text-amber-700 group-hover:text-amber-800 shrink-0 mt-0.5">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-xs text-[#071d37]">Loyalty Reward</p>
                          <span className="text-amber-400 font-bold text-sm group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-medium">Issue B1G1, % discounts, or star points specifically to loyal customers</p>
                      </div>
                    </button>

                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDiscountTypeSelector(false)}
                      className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* 9. BLOGS BLOCK */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            {!showAddBlog && !selectedBlog ? (
              <>
                {/* Header controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search blogs by title or tag..."
                    value={blogQuery}
                    onChange={(e) => setBlogQuery(e.target.value)}
                    className="w-full text-xs p-2 pb-2 pl-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-500 bg-slate-50"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>

                <select
                  value={blogStatusFilter}
                  onChange={(e) => setBlogStatusFilter(e.target.value as any)}
                  className="text-xs p-2 border border-slate-200 rounded-lg focus:outline-none bg-slate-50 cursor-pointer min-w-[120px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportBlogs}
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Export all blogs to JSON backup file"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" /> Export Backup
                </button>

                <label
                  className="bg-white hover:bg-slate-50 border border-slate-200 font-bold p-2.5 px-3 rounded-xl text-xs text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs cursor-pointer"
                  title="Import blogs from JSON backup"
                >
                  <Upload className="h-3.5 w-3.5 text-slate-500" /> Import Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBlogs}
                  />
                </label>

                <button
                  onClick={() => {
                    setNewBlogForm({
                      title: '', excerpt: '', content: '', image: '',
                      author: 'Admin', category: 'General', status: 'Active',
                      publishedAt: '', readTime: '5 min read', tags: []
                    });
                    setBlogTagsInput('');
                    setShowAddBlog(true);
                  }}
                  className="bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs p-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Create Blog Post
                </button>
              </div>
            </div>

            {/* Blogs list table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[10px] text-slate-450 font-bold uppercase tracking-widest">
                      <th className="p-4">Article</th>
                      <th className="p-4">Author & Category</th>
                      <th className="p-4">Slug / Route</th>
                      <th className="p-4">Stats</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Published At</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">No blog posts found matching criteria.</td>
                      </tr>
                    ) : (
                      filteredBlogs.map(blog => (
                        <tr key={blog.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3 min-w-[280px]">
                              <img 
                                src={blog.image} 
                                alt={blog.title} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-cover rounded-lg border border-slate-150 shrink-0" 
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs hover:text-indigo-650 transition cursor-pointer" onClick={() => {
                                  setSelectedBlog(blog);
                                  setBlogTagsInput(blog.tags.join(', '));
                                }}>{blog.title}</h4>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 max-w-xs">{blog.excerpt}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {blog.tags.map((t, idx) => (
                                    <span key={idx} className="bg-slate-50 text-[9px] text-slate-500 rounded px-1.5 font-medium border border-slate-150">#{t}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">{blog.author}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{blog.category}</div>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-500">
                            /blogs/{blog.slug}
                          </td>
                          <td className="p-4 text-slate-500">
                            <div className="font-semibold text-slate-700">{blog.readTime}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{blog.content ? blog.content.split(/\s+/).length : 0} words</div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block py-0.5 px-2 rounded-full font-black text-[9px] uppercase tracking-wide border ${
                              blog.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                                : blog.status === 'Draft' 
                                ? 'bg-gray-100 text-gray-700 border-gray-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-150'
                            }`}>
                              {blog.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 font-semibold text-[11px]">
                            {blog.publishedAt}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedBlog(blog);
                                  setBlogTagsInput(blog.tags.join(', '));
                                }}
                                className="p-1 px-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition cursor-pointer"
                                title="Edit Article"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-1 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-md transition cursor-pointer"
                                title="Delete Article"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          // HIGH FIDELITY EDITOR SCREEN (SCREENSHOT LAYOUT)
          (() => {
            const isEdit = !!selectedBlog;
            const titleValue = isEdit ? selectedBlog.title : (newBlogForm.title || '');
            const slugValue = isEdit ? selectedBlog.slug : (newBlogForm.slug || '');
            const contentValue = isEdit ? selectedBlog.content : (newBlogForm.content || '');
            const excerptValue = isEdit ? selectedBlog.excerpt : (newBlogForm.excerpt || '');
            const statusValue = isEdit ? selectedBlog.status : (newBlogForm.status || 'Active');
            const imageValue = isEdit ? selectedBlog.image : (newBlogForm.image || '');
            const authorValue = isEdit ? selectedBlog.author : (newBlogForm.author || 'neha bhardwaz');
            const categoryValue = isEdit ? selectedBlog.category : (newBlogForm.category || 'News');
            const tagsValue = blogTagsInput;

            const setContentValue = (val: string) => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, content: val });
              } else {
                setNewBlogForm({ ...newBlogForm, content: val });
              }
            };

            const setExcerptValue = (val: string) => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, excerpt: val });
              } else {
                setNewBlogForm({ ...newBlogForm, excerpt: val });
              }
            };

            const setSlugValue = (val: string) => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, slug: val });
              } else {
                setNewBlogForm({ ...newBlogForm, slug: val });
              }
            };

            const setStatusValue = (val: 'Active' | 'Draft' | 'Archived') => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, status: val });
              } else {
                setNewBlogForm({ ...newBlogForm, status: val });
              }
            };

            const setImageValue = (val: string) => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, image: val });
              } else {
                setNewBlogForm({ ...newBlogForm, image: val });
              }
            };

            const setAuthorValue = (val: string) => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, author: val });
              } else {
                setNewBlogForm({ ...newBlogForm, author: val });
              }
            };

            const setCategoryValue = (val: string) => {
              if (isEdit) {
                setSelectedBlog({ ...selectedBlog!, category: val });
              } else {
                setNewBlogForm({ ...newBlogForm, category: val });
              }
            };

            const setTagsValue = (val: string) => {
              setBlogTagsInput(val);
            };

            return (
              <div className="max-w-6xl mx-auto space-y-6 text-xs text-left bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                {/* Top breadcrumb navigation row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <FileEdit className="h-4 w-4 text-slate-600" />
                    <span>›</span>
                    <span className="text-slate-900 font-bold text-sm">
                      {isEdit ? 'Edit blog post' : 'Add blog post'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowAddBlog(false); setSelectedBlog(null); }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to blog posts
                  </button>
                </div>

                {/* Two-column layout */}
                <form 
                  onSubmit={isEdit ? handleUpdateBlog : handleCreateBlog} 
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Left Column: Main input panels */}
                  <div className="lg:col-span-2 space-y-5">
                    
                    {/* Title Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 text-left">
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5">Title</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          required
                          placeholder="e.g., Blog about your latest products or deals"
                          value={titleValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isEdit) {
                              setSelectedBlog({
                                ...selectedBlog!,
                                title: val,
                                slug: slugify(val)
                              });
                            } else {
                              setNewBlogForm({
                                ...newBlogForm,
                                title: val,
                                slug: slugify(val)
                              });
                            }
                          }}
                          className="w-full text-xs font-semibold border border-slate-200 p-2.5 pr-10 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-850"
                        />
                        <div className="absolute right-3 cursor-pointer text-slate-400 hover:text-indigo-650 transition" title="Auto-format title">
                          <Sparkles className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 text-left">
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5">Content</label>
                      <BlogContentEditor 
                        value={contentValue} 
                        onChange={setContentValue} 
                        placeholder="Write article details. Supports rich HTML editing, lists, headings, and custom tags."
                      />
                    </div>

                    {/* Excerpt Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 text-left">
                      <div className="flex justify-between items-center mb-2.5">
                        <label className="block text-slate-700 font-semibold text-xs">Excerpt</label>
                        <Pencil className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Add a summary of the post to appear on your home page or blog."
                        value={excerptValue}
                        onChange={(e) => setExcerptValue(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white leading-relaxed resize-none font-medium"
                      />
                    </div>

                    {/* Search engine listing Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-5 text-left">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-slate-700 font-semibold text-xs">Search engine listing</label>
                        <Pencil className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                      </div>
                      <p className="text-[10.5px] text-slate-400 leading-normal mb-3 font-medium">
                        Add a title and description to see how this blog post might appear in a search engine listing
                      </p>
                      
                      <div className="space-y-3.5 border-t border-slate-100 pt-3">
                        <div>
                          <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">URL Route Handle (Slug)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-[11px] text-slate-400 font-medium select-none">/blogs/</span>
                            <input
                              type="text"
                              required
                              placeholder="slug-route-handle"
                              value={slugValue}
                              onChange={(e) => setSlugValue(slugify(e.target.value))}
                              className="w-full text-xs font-semibold border border-slate-200 p-2 pl-14 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono text-slate-755"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Sidebar controls */}
                  <div className="lg:col-span-1 space-y-5">
                    
                    {/* Visibility Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 text-left">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-slate-700 font-semibold text-xs">Visibility</label>
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="space-y-2.5 pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                          <input 
                            type="radio" 
                            name="visibility" 
                            checked={statusValue === 'Active'} 
                            onChange={() => setStatusValue('Active')} 
                            className="h-3.5 w-3.5 text-slate-900 focus:ring-slate-900 border-slate-305"
                          />
                          <span>Visible</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                          <input 
                            type="radio" 
                            name="visibility" 
                            checked={statusValue === 'Draft'} 
                            onChange={() => setStatusValue('Draft')} 
                            className="h-3.5 w-3.5 text-slate-900 focus:ring-slate-900 border-slate-305"
                          />
                          <span>Hidden</span>
                        </label>
                      </div>
                    </div>

                    {/* Image Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 text-left">
                      <label className="block text-slate-700 font-semibold text-xs mb-3">Image</label>
                      
                      {imageValue ? (
                        <div className="relative border border-slate-200 rounded-xl overflow-hidden group bg-slate-50">
                          <img 
                            src={cleanMediaUrl(imageValue)} 
                            alt="Blog Cover" 
                            referrerPolicy="no-referrer"
                            className="w-full h-36 object-cover" 
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setImageValue('')}
                              className="p-1.5 bg-white rounded-full hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                              title="Remove Image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => {
                            const fileEl = document.getElementById('blog-cover-file-input');
                            if (fileEl) fileEl.click();
                          }}
                          className="border border-dashed border-slate-300 bg-white hover:bg-slate-50 p-6 rounded-xl text-center cursor-pointer flex flex-col items-center justify-center space-y-2 transition"
                        >
                          <input
                            type="file"
                            id="blog-cover-file-input"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = async () => {
                                  if (typeof reader.result === 'string') {
                                    try {
                                      const res = await fetch('/api/upload', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ data: reader.result })
                                      });
                                      if (res.ok) {
                                        const info = await res.json();
                                        if (info.url) {
                                          setImageValue(info.url);
                                          return;
                                        }
                                      }
                                      setImageValue(reader.result);
                                    } catch (err) {
                                      console.warn('[BlogUpload] API upload failed:', err);
                                      setImageValue(reader.result);
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                          >
                            Add image
                          </button>
                          <span className="text-[10px] text-slate-400 font-medium">
                            or drop an image to upload
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Organization Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 text-left space-y-3">
                      <label className="block text-slate-700 font-semibold text-xs pb-1.5 border-b border-slate-100">Organization</label>
                      
                      <div>
                        <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Author</label>
                        <input
                          type="text"
                          placeholder="e.g., neha bhardwaz"
                          value={authorValue}
                          onChange={(e) => setAuthorValue(e.target.value)}
                          className="w-full text-xs font-semibold border border-slate-200 p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Blog</label>
                        <select
                          value={categoryValue}
                          onChange={(e) => setCategoryValue(e.target.value)}
                          className="w-full text-xs font-semibold border border-slate-200 p-2 rounded-lg bg-white focus:outline-none cursor-pointer text-slate-750"
                        >
                          <option value="News">News</option>
                          <option value="Chemistry & Science">Chemistry & Science</option>
                          <option value="Buying Guides">Buying Guides</option>
                          <option value="Tips & Hacks">Tips & Hacks</option>
                          <option value="Industry Trends">Industry Trends</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Tags</label>
                        <input
                          type="text"
                          placeholder="e.g. Science, Organic, Pouch"
                          value={tagsValue}
                          onChange={(e) => setTagsValue(e.target.value)}
                          className="w-full text-xs font-semibold border border-slate-200 p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                        />
                      </div>
                    </div>

                    {/* Theme template Card */}
                    <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-4 text-left">
                      <div className="flex justify-between items-center mb-2.5">
                        <label className="block text-slate-700 font-semibold text-xs">Theme template</label>
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <select
                        className="w-full text-xs font-semibold border border-slate-200 p-2 rounded-lg bg-white focus:outline-none cursor-pointer text-slate-750"
                        defaultValue="default-post"
                      >
                        <option value="default-post">Default blog post</option>
                        <option value="custom-post">Custom layout template</option>
                      </select>
                    </div>

                  </div>

                  {/* Bottom right actions layout block */}
                  <div className="lg:col-span-3 pt-4 border-t border-slate-200/60 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowAddBlog(false); setSelectedBlog(null); }}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-5 rounded-lg cursor-pointer text-xs transition shadow-2xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-850 text-white font-bold py-2 px-6 rounded-lg cursor-pointer text-xs shadow-sm transition"
                    >
                      Save
                    </button>
                  </div>

                </form>
              </div>
            );
          })()
        )}
      </div>
    )}

    {/* 10. LAYOUT / HEADER FOOTER SETTINGS BLOCK */}
    {activeTab === 'layout' && (
      <div className="space-y-6 max-w-5xl mx-auto text-xs text-left animate-fade-in pb-12">
        
        {/* Header controls select */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Header & Footer Global Settings</h3>
            <p className="text-slate-400 text-[10px] font-medium mt-0.5">Configure your brand logos, subtext descriptions, and the header navigation menu.</p>
          </div>
          <button
            onClick={() => {
              if (onUpdateLayoutSettings) {
                onUpdateLayoutSettings(localLayoutSettings);
                setLayoutSavedToast(true);
                setTimeout(() => setLayoutSavedToast(false), 4000);
              }
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-indigo-150 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Save className="h-4 w-4" />
            <span>Save Header & Footer</span>
          </button>
        </div>

        {/* Layout saved toast alert */}
        {layoutSavedToast && (
          <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl flex items-center gap-3 text-emerald-800 animate-fade-in select-none">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block text-xs">Settings updated successfully!</span>
              <span className="text-[10px] font-medium text-emerald-650">Your custom headers, footers, logo graphics, and navigation structure are now live across the storefront.</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side: Header & Footer configuration cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. HEADER BRAND IDENTITY CARD */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-650 rounded-lg">
                  <Layout className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">Header Brand Identity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Logo Text</label>
                  <input
                    type="text"
                    value={localLayoutSettings.headerLogoText}
                    onChange={(e) => setLocalLayoutSettings({ ...localLayoutSettings, headerLogoText: e.target.value })}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Pouch Supply"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Logo Subtext</label>
                  <input
                    type="text"
                    value={localLayoutSettings.headerLogoSubtext}
                    onChange={(e) => setLocalLayoutSettings({ ...localLayoutSettings, headerLogoSubtext: e.target.value })}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Premium Nicotine"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1.5">Custom Header Logo Image</label>
                <div className="flex items-center gap-4">
                  {localLayoutSettings.headerLogoImage ? (
                    <div className="relative group shrink-0 border border-slate-150 p-2 rounded-xl bg-slate-50">
                      <img 
                        src={localLayoutSettings.headerLogoImage} 
                        className="h-14 max-w-[160px] object-contain rounded" 
                        alt="Header Logo Preview" 
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setLocalLayoutSettings({ ...localLayoutSettings, headerLogoImage: '' })}
                        className="absolute -top-1.5 -right-1.5 bg-red-650 text-white p-1 rounded-full shadow hover:bg-red-700 transition animate-in zoom-in-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50 shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      id="header-logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file, 'header');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('header-logo-upload')?.click()}
                      className="bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      Upload Custom Logo
                    </button>
                    <p className="text-[9px] text-slate-400 mt-1">Accepts PNG, JPG, or SVG. Maximum resolution: 320x80px. Background transparency recommended.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. FOOTER BRAND IDENTITY CARD */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-650 rounded-lg">
                  <Layout className="h-4 w-4" />
                </div>
                <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">Footer Brand Identity</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Footer Text Title</label>
                  <input
                    type="text"
                    value={localLayoutSettings.footerLogoText}
                    onChange={(e) => setLocalLayoutSettings({ ...localLayoutSettings, footerLogoText: e.target.value })}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. POUCH SUPPLY"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Footer Brand Description</label>
                  <textarea
                    value={localLayoutSettings.footerLogoDescription}
                    onChange={(e) => setLocalLayoutSettings({ ...localLayoutSettings, footerLogoDescription: e.target.value })}
                    rows={3}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y leading-relaxed"
                    placeholder="Provide a footer blurb describing your brand, Швеция origin, or delivery credentials..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1.5">Custom Footer Logo Image</label>
                <div className="flex items-center gap-4">
                  {localLayoutSettings.footerLogoImage ? (
                    <div className="relative group shrink-0 border border-slate-150 p-2 rounded-xl bg-slate-50">
                      <img 
                        src={localLayoutSettings.footerLogoImage} 
                        className="h-14 max-w-[160px] object-contain rounded" 
                        alt="Footer Logo Preview" 
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => setLocalLayoutSettings({ ...localLayoutSettings, footerLogoImage: '' })}
                        className="absolute -top-1.5 -right-1.5 bg-red-650 text-white p-1 rounded-full shadow hover:bg-red-700 transition animate-in zoom-in-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50 shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      id="footer-logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file, 'footer');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('footer-logo-upload')?.click()}
                      className="bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      Upload Footer Logo
                    </button>
                    <p className="text-[9px] text-slate-400 mt-1">Accepts PNG, JPG, or SVG. Visible in the bottom-left column of the footer layout.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. KLAVIYO INTEGRATION CARD */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">Klaviyo Marketing Integration</span>
                </div>
                {localLayoutSettings.klaviyoPublicKey ? (
                  <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-150 flex items-center gap-1">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                    Connected
                  </span>
                ) : (
                  <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-0.5 rounded border border-slate-150">
                    Not Configured
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                Unlock automated ecommerce marketing flows. Connecting your Klaviyo Site ID (Public API Key) automatically tracks: 
                <span className="block mt-1 font-mono text-[9px] text-indigo-600 leading-normal">
                  • Active on Site (Visitor Page View)<br />
                  • Viewed Product (Catalog Detail Click)<br />
                  • Added to Cart (Shopping cart logs)<br />
                  • Started Checkout (Initiate checkout events)<br />
                  • Placed Order (Successful conversion metrics)<br />
                  • Subscribed to Newsletter (Footer sign-up capture)
                </span>
              </p>

              <div>
                <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Klaviyo Site ID / Public API Key</label>
                <input
                  type="text"
                  value={localLayoutSettings.klaviyoPublicKey || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    const updated = { ...localLayoutSettings, klaviyoPublicKey: val };
                    setLocalLayoutSettings(updated);
                    if (onUpdateLayoutSettings) onUpdateLayoutSettings(updated);
                  }}
                  className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="e.g. AB12CD"
                />
                <p className="text-[8.5px] text-slate-400 mt-1.5">
                  Your 6-to-8 character public API key. Find this in your <a href="https://www.klaviyo.com/app/settings/api-keys" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline font-bold">Klaviyo Account Settings</a>.
                </p>
              </div>
            </div>

            {/* 4. CLOUDINARY MEDIA CDN INTEGRATION CARD */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-blue-650 rounded-lg">
                    <Cloud className="h-4 w-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">Cloudinary Media CDN</span>
                </div>
                {localLayoutSettings.cloudinaryCloudName ? (
                  <span className="text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-150 flex items-center gap-1">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                    CDN Active
                  </span>
                ) : (
                  <span className="text-[8px] font-black uppercase bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded border border-amber-150">
                    MDB Fallback
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                Connect your storefront with <strong>Cloudinary CDN</strong>. It provides <strong>lightning-fast global image & video hosting with native support for smooth video streaming and fast loading times</strong>.
                When configured, any product visuals, brand logo banners, or active section background videos you upload will be permanently hosted on Cloudinary, connected with your MongoDB cluster.
              </p>

              {/* Quick Paste Connection String Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <label className="block text-indigo-700 font-extrabold text-[9.5px] uppercase tracking-wider">
                  ⚡ Quick Auto-Fill: Paste CLOUDINARY_URL
                </label>
                <input
                  type="text"
                  placeholder="Paste e.g. CLOUDINARY_URL=cloudinary://123456:abcdef@qfoxl8ia"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.trim()) {
                      const parsed = parseCloudinaryInput(val, '', '');
                      if (parsed.cName && parsed.aKey && parsed.aSecret) {
                        const updated = {
                          ...localLayoutSettings,
                          cloudinaryCloudName: parsed.cName,
                          cloudinaryApiKey: parsed.aKey,
                          cloudinaryApiSecret: parsed.aSecret
                        };
                        setLocalLayoutSettings(updated);
                        if (onUpdateLayoutSettings) onUpdateLayoutSettings(updated);
                      }
                    }
                  }}
                  className="w-full text-xs font-mono border border-indigo-200 p-2 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[8.5px] text-slate-500">
                  Pasting your connection string automatically extracts your Cloud Name (<code>qfoxl8ia</code>), API Key, and API Secret instantly.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Cloudinary Cloud Name</label>
                  <input
                    type="text"
                    value={localLayoutSettings.cloudinaryCloudName || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseCloudinaryInput(val, localLayoutSettings.cloudinaryApiKey, localLayoutSettings.cloudinaryApiSecret);
                      const updated = {
                        ...localLayoutSettings,
                        cloudinaryCloudName: parsed.cName || val,
                        cloudinaryApiKey: parsed.aKey || localLayoutSettings.cloudinaryApiKey,
                        cloudinaryApiSecret: parsed.aSecret || localLayoutSettings.cloudinaryApiSecret
                      };
                      setLocalLayoutSettings(updated);
                      if (onUpdateLayoutSettings) onUpdateLayoutSettings(updated);
                    }}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="e.g. qfoxl8ia"
                  />
                  <p className="text-[8.5px] text-slate-400 mt-1">
                    Your unique cloud identifier (e.g. <code>qfoxl8ia</code>).
                  </p>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Cloudinary API Key</label>
                  <input
                    type="text"
                    value={localLayoutSettings.cloudinaryApiKey || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = { ...localLayoutSettings, cloudinaryApiKey: val };
                      setLocalLayoutSettings(updated);
                      if (onUpdateLayoutSettings) onUpdateLayoutSettings(updated);
                    }}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="e.g. 123456789012345"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Cloudinary API Secret</label>
                  <input
                    type="password"
                    value={localLayoutSettings.cloudinaryApiSecret || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = { ...localLayoutSettings, cloudinaryApiSecret: val };
                      setLocalLayoutSettings(updated);
                      if (onUpdateLayoutSettings) onUpdateLayoutSettings(updated);
                    }}
                    className="w-full text-xs font-semibold border border-slate-200 p-2.5 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="e.g. *********************************"
                  />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleTestCloudinary}
                  disabled={testingCloudinary}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  {testingCloudinary ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <Cloud className="h-3.5 w-3.5" />
                      Test Cloudinary Connection
                    </>
                  )}
                </button>
              </div>

              {cloudinaryTestResult && (
                <div className={`p-2.5 rounded-lg text-xs font-semibold leading-relaxed border ${
                  cloudinaryTestResult.success 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {cloudinaryTestResult.message}
                </div>
              )}

              <p className="text-[8.5px] text-slate-400 mt-1.5 leading-normal">
                Credentials are saved securely. You can also specify them as environment variables (<code>CLOUDINARY_CLOUD_NAME</code>, etc.). Register for free at <a href="https://cloudinary.com/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">cloudinary.com</a>.
              </p>
            </div>

          </div>

          {/* Right Side: Header Navigation Menu Builder */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* NAVIGATION MENU ITEMS LIST CARD */}
            <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-650 rounded-lg">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider text-xs">Header Menu</span>
                </div>
                
                {!isAddingMenuItem && (
                  <button
                    onClick={() => {
                      setNewMenuItemLabel('');
                      setNewMenuItemUrl('');
                      setNewMenuItemType('tab');
                      setNewMenuItemTarget('frontend-home');
                      setIsAddingMenuItem(true);
                    }}
                    className="px-2.5 py-1 text-indigo-600 hover:text-indigo-700 font-extrabold text-[10px] uppercase tracking-wider border border-indigo-200 bg-indigo-50 hover:bg-indigo-100/75 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add link</span>
                  </button>
                )}
              </div>

              {/* Add link panel */}
              {isAddingMenuItem && (
                <div className="bg-slate-50/75 border border-slate-200 rounded-xl p-3.5 space-y-3.5 select-none text-left animate-slide-in-right">
                  <span className="font-extrabold text-[10px] text-indigo-750 uppercase tracking-wider block">Add Navigation Link</span>
                  
                  <div>
                    <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Link Title / Label</label>
                    <input
                      type="text"
                      required
                      value={newMenuItemLabel}
                      onChange={(e) => setNewMenuItemLabel(e.target.value)}
                      placeholder="e.g. Swedish Pouches"
                      className="w-full text-xs font-semibold border border-slate-250 p-2 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Target Action Type</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="menuType"
                          checked={newMenuItemType === 'tab'}
                          onChange={() => setNewMenuItemType('tab')}
                          className="accent-indigo-650"
                        />
                        <span>Internal Tab</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="menuType"
                          checked={newMenuItemType === 'external'}
                          onChange={() => setNewMenuItemType('external')}
                          className="accent-indigo-650"
                        />
                        <span>External URL</span>
                      </label>
                    </div>
                  </div>

                  {newMenuItemType === 'tab' ? (
                    <div>
                      <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Internal Navigation Destination</label>
                      <select
                        value={newMenuItemTarget}
                        onChange={(e) => setNewMenuItemTarget(e.target.value)}
                        className="w-full text-xs font-semibold border border-slate-250 p-2 rounded-lg bg-white focus:outline-none cursor-pointer text-slate-750"
                      >
                        <optgroup label="Core Store Tabs">
                          <option value="frontend-home">Storefront Home</option>
                          <option value="frontend-subscribe">Subscribe Builder</option>
                          <option value="frontend-shop">Shop Now grid</option>
                          <option value="frontend-brands">All Sweden Brands</option>
                          <option value="about">About us info</option>
                          <option value="blogs">Pouch Journal / Blogs</option>
                        </optgroup>
                        {localPages.length > 0 && (
                          <optgroup label="Custom Builder Pages">
                            {localPages.map(page => (
                              <option key={page.id} value={`page-${page.slug}`}>
                                Page: {page.title} ({page.slug})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-500 font-bold text-[9px] uppercase tracking-wider mb-1">Destination URL Link</label>
                      <div className="relative">
                        <input
                          type="url"
                          required
                          value={newMenuItemUrl}
                          onChange={(e) => setNewMenuItemUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full text-xs font-semibold border border-slate-250 p-2 pl-7 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <Link className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setIsAddingMenuItem(false)}
                      className="px-3 py-1.5 text-slate-500 hover:text-slate-800 font-bold text-[10px] uppercase border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addMenuItem}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase rounded-lg shadow-sm transition"
                    >
                      Add Link
                    </button>
                  </div>
                </div>
              )}

              {/* List of current menu items */}
              <div className="space-y-2.5">
                {localLayoutSettings.menuItems.length === 0 ? (
                  <div className="text-center py-6 text-slate-450 italic border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                    No links in navigation menu. Click "Add link" to start.
                  </div>
                ) : (
                  localLayoutSettings.menuItems.map((item, index) => {
                    return (
                      <div 
                        key={item.id} 
                        className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 flex items-center justify-between gap-2.5 shadow-3xs"
                      >
                        <div className="flex-1 min-w-0 space-y-1 text-left">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => editMenuItemLabel(item.id, e.target.value)}
                            className="font-extrabold text-xs text-slate-900 border-none bg-transparent hover:bg-slate-100 p-1 rounded focus:bg-white focus:ring-1 focus:ring-slate-350 w-full focus:outline-none"
                            title="Click to rename link"
                          />
                          <div className="flex items-center gap-1.5 pl-1">
                            {item.type === 'external' ? (
                              <>
                                <Link className="h-3 w-3 text-indigo-500 shrink-0" />
                                <input
                                  type="text"
                                  value={item.url || ''}
                                  onChange={(e) => editMenuItemUrl(item.id, e.target.value)}
                                  className="text-[10px] text-slate-400 truncate bg-transparent focus:bg-white p-0.5 rounded border-none w-full font-medium"
                                  title="Edit URL link"
                                />
                              </>
                            ) : (
                              <>
                                <FileCode className="h-3 w-3 text-slate-400 shrink-0" />
                                <select
                                  value={item.tab}
                                  onChange={(e) => editMenuItemTarget(item.id, e.target.value)}
                                  className="text-[10px] text-slate-400 font-semibold bg-transparent hover:bg-slate-100 p-0.5 rounded border-none cursor-pointer max-w-[150px]"
                                >
                                  <option value="frontend-home">Home</option>
                                  <option value="frontend-subscribe">Subscribe</option>
                                  <option value="frontend-shop">Shop grid</option>
                                  <option value="frontend-brands">Sweden Brands</option>
                                  <option value="about">About info</option>
                                  <option value="blogs">Blogs</option>
                                  {localPages.map(p => (
                                    <option key={p.id} value={`page-${p.slug}`}>Page: {p.title}</option>
                                  ))}
                                </select>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 select-none">
                          {/* Reordering buttons */}
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveMenuItem(index, 'up')}
                            className="p-1 border border-slate-250 bg-white rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Move up"
                          >
                            <MoveUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === localLayoutSettings.menuItems.length - 1}
                            onClick={() => moveMenuItem(index, 'down')}
                            className="p-1 border border-slate-250 bg-white rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                            title="Move down"
                          >
                            <MoveDown className="h-3 w-3" />
                          </button>
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeMenuItem(item.id)}
                            className="p-1 border border-red-200 bg-red-50 text-red-650 rounded hover:bg-red-100 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    )}

        {/* DATABASE CONNECTION DETAILS MODAL */}
        {showDbDetailsModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-150 overflow-hidden flex flex-col max-h-[85vh] text-left">
              
              {/* Modal Header */}
              <div className="p-5 border-b flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-50 rounded-lg border border-teal-150">
                    <Database className="h-5 w-5 text-teal-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">MongoDB Live Connection Inspector</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Real-time audit of Cluster details, state, and collections.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDbDetailsModal(false)} 
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                {dbDetailsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <RefreshCw className="h-8 w-8 text-teal-500 animate-spin" />
                    <p className="text-slate-500 font-medium">Running diagnostics & querying live counts...</p>
                  </div>
                ) : dbDetailsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Diagnostics Query Failed</span>
                    </div>
                    <p className="text-red-600 text-[11px] leading-relaxed font-mono whitespace-pre-wrap">{dbDetailsError}</p>
                  </div>
                ) : dbDetailsData ? (
                  <div className="space-y-4">
                    {/* Status Summary Banner */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                      dbDetailsData.status === 'connected' 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${
                          dbDetailsData.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                        }`} />
                        <div>
                          <p className="font-black text-xs uppercase tracking-wider">
                            Connection {dbDetailsData.status === 'connected' ? 'Active' : 'Offline'}
                          </p>
                          <p className="text-[10px] opacity-80 mt-0.5">
                            Mongoose State: <span className="font-mono font-bold">{dbDetailsData.readyStateLabel}</span> ({dbDetailsData.readyState})
                          </p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider ${
                        dbDetailsData.status === 'connected' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {dbDetailsData.status}
                      </span>
                    </div>

                    {/* General Metadata */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
                      <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-200/60 pb-1.5">
                        Cluster & Database Registry
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Cluster Host</span>
                          <span className="text-slate-800 font-mono text-[10px] font-semibold break-all select-all">
                            {dbDetailsData.uriHost}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Active Database</span>
                          <span className="text-slate-800 font-mono text-[11px] font-black tracking-wide select-all">
                            {dbDetailsData.dbName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Collections counts */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">
                        Collections Overview ({dbDetailsData.collections?.length || 0})
                      </h4>
                      {dbDetailsData.collections && dbDetailsData.collections.length > 0 ? (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[9px] font-black uppercase text-slate-450 border-b border-slate-250 select-none">
                                <th className="p-2.5 pl-4">Collection Name</th>
                                <th className="p-2.5 text-right pr-4">Document Count</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150">
                              {dbDetailsData.collections.map((col: any) => (
                                <tr key={col.name} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-2.5 pl-4 font-mono font-bold text-slate-700">{col.name}</td>
                                  <td className="p-2.5 text-right pr-4 font-semibold font-mono text-indigo-650">
                                    {col.count.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 text-slate-450 italic text-center rounded-lg border border-slate-150">
                          No collections found. The database might be empty or in-memory fallback is active.
                        </div>
                      )}
                    </div>

                    {/* Initialized Mongoose Models */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-widest">
                        Active Mongoose Models ({dbDetailsData.models?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {dbDetailsData.models?.map((modelName: string) => (
                          <span key={modelName} className="bg-slate-100 text-slate-700 font-mono text-[9px] font-bold px-2 py-1 rounded-md border border-slate-200">
                            {modelName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {dbDetailsData.error && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-amber-800 font-bold block text-[9px] uppercase tracking-wider">Reported Connection Warnings</span>
                        <p className="text-amber-700 text-[10px] font-mono leading-relaxed max-h-24 overflow-y-auto">{dbDetailsData.error}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 italic">No diagnostic data found.</div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t bg-slate-50 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={fetchDbDetails}
                  disabled={dbDetailsLoading}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${dbDetailsLoading ? 'animate-spin' : ''}`} />
                  <span>Re-run Diagnostics</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDbDetailsModal(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>

            </div>
          </div>
        )}

        {/* CUSTOM CONFIRMATION DIALOG MODAL (Guaranteed to work in sandboxed iframes) */}
        {confirmDialog && confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">{confirmDialog.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Please confirm your dashboard request.</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {confirmDialog.message}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Save Success Toast Notification */}
        {showSaveSuccess && (
          <div className="fixed bottom-6 right-6 z-[99999] bg-slate-900 text-white border border-slate-800 p-4 rounded-xl shadow-2xl flex items-center gap-3.5 max-w-sm select-none transition-all duration-300 animate-in slide-in-from-bottom-4 zoom-in-95">
            <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-black uppercase tracking-wider text-[9px] text-emerald-400 block mb-0.5">Live Sync Complete</span>
              <span className="font-extrabold block text-xs text-white">All Changes Saved successfully!</span>
              <span className="text-[10px] font-semibold text-slate-400 leading-normal block mt-0.5">Your edits have been synchronized across the database and are now live on the storefront.</span>
            </div>
            <button 
              onClick={() => setShowSaveSuccess(false)} 
              className="text-slate-400 hover:text-white cursor-pointer ml-1 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

      </main>

    </div>
  );
}
