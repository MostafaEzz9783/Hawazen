import {useState,useRef,useEffect,useMemo} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {Globe,Building2} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import Hero from '@/components/Hero';
import FloatingBackground from '@/components/FloatingBackground';
import OccupancySlider from '@/components/OccupancySlider';
import KPISection from '@/components/KPISection';
import OccupancyRing from '@/components/OccupancyRing';
import RoomPricingTable from '@/components/RoomPricingTable';
import RevenueDistributionDonut from '@/components/RevenueDistributionDonut';
import OwnerEconomicsCard from '@/components/OwnerEconomicsCard';
import RevenueWaterfall from '@/components/RevenueWaterfall';
import OccupancySensitivity from '@/components/OccupancySensitivity';
import InvestmentHighlights from '@/components/InvestmentHighlights';
import ExecutiveClosing from '@/components/ExecutiveClosing';
import Toolbar from '@/components/Toolbar';
import {buildOccupancyRow} from '@/data/arqaModelCalculations';
import study from '@/data/hawazen.json';

export default function Dashboard({t,language,onToggleLanguage}){
 const tx=(a,b)=>language==='ar'?a:b;
 const [occupancy,setOccupancy]=useState(70),[full,setFull]=useState(false);
 const ref=useRef(null),exportRef=useRef(null),reduced=useReducedMotion();
 const m=study.models.str;
 const scenarioData=useMemo(()=>({revenueAt100:m.revenues.base,occupancy:Object.fromEntries(m.occupancy.map(rate=>[rate,buildOccupancyRow({revenueAt100:m.revenues.base,occupancyRate:rate,unitCount:m.units,feePipeline:m.fees})]))}),[m]);
 const row=scenarioData.occupancy[occupancy];
 const pricing=useMemo(()=>[{unit:'studio',type:'studio',base:m.monthlyRate}],[]);
 useEffect(()=>{document.title=language==='ar'?'مادينيوم | هوازن — دراسة STR':'Madinum | Hawazen — STR Study';},[language]);
 useEffect(()=>{const fn=()=>setFull(document.fullscreenElement===ref.current);document.addEventListener('fullscreenchange',fn);return()=>document.removeEventListener('fullscreenchange',fn);},[]);
 const reveal=reduced?{}:{initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.18},transition:{duration:.5,ease:[.16,1,.3,1]}};
 return <div className="str-dashboard min-h-screen relative" ref={ref}>
 <FloatingBackground/>
 <div className="relative max-w-7xl mx-auto pt-4 px-4 sm:px-0">
 <nav className="study-nav"><img src="/madinum-logo.jpeg?v=2" alt={t.nav.brandAlt} className="company-logo"/><div className="study-nav-actions"><button onClick={onToggleLanguage}><Globe size={16}/>{t.nav.languageToggle}</button><span className="project-pill">{tx('هوازن','Hawazen')}</span><Building2 size={16}/></div></nav>
 <Hero t={t} title={tx('هوازن','Hawazen')} subtitle={tx(`${m.units} وحدة · الإيجار قصير المدى (STR)`,`${m.units} units · Short-term rental (STR)`)}/>
 </div>
 <main className="relative max-w-7xl mx-auto px-5 sm:px-6 pb-14">
 <div className="flex flex-wrap items-center gap-3 mb-6 mt-3"><Toolbar t={t} exportTargetRef={exportRef} exportFileName="Hawazen-STR-Study" isFullscreen={full} onToggleFullscreen={async()=>{if(document.fullscreenElement)await document.exitFullscreen();else await ref.current.requestFullscreen();}}/></div>
 <div ref={exportRef}>
 <SectionHeader eyebrow={tx('نظرة عامة على السوق','Market overview')} title={tx('نموذج الإيجار قصير المدى','Short-term rental model')}/>
 <motion.div {...reveal}><GlassCard className="p-6 sm:p-8 mb-6"><div className="study-controls"><div><p className="control-label">{tx('نموذج التشغيل','Operating model')}</p><span className="selected-model">{tx('إيجار قصير المدى','Short-term rental')}<small>STR</small></span></div><div><p className="control-label">{tx('سيناريو التسعير','Pricing scenario')}</p><span className="selected-model">{t.scenarios.base}</span></div><OccupancySlider options={m.occupancy} value={occupancy} onChange={setOccupancy} t={t}/></div></GlassCard></motion.div>
 <motion.div {...reveal}><KPISection t={t} row={row} sparklineSeries={Object.values(scenarioData.occupancy)} occupancy={occupancy} revenueAt100={m.revenues.base} unitCount={m.units} operatingModel="str"/></motion.div>
 <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10" {...reveal}><OccupancyRing t={t} occupancy={occupancy}/><div className="lg:col-span-2"><RoomPricingTable t={t} roomPricing={pricing} scenario="base"/></div></motion.div>
 <SectionHeader eyebrow={t.sections.mathwaPerformance} title={t.sections.mathwaPerformance}/>
 <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6" {...reveal}><RevenueDistributionDonut t={t} row={row}/><OwnerEconomicsCard t={t} row={row}/></motion.div>
 <motion.div className="mb-6" {...reveal}><RevenueWaterfall t={t} row={row} revenueAt100={m.revenues.base}/></motion.div>
 <motion.div className="mb-10" {...reveal}><OccupancySensitivity t={t} occupancyOptions={m.occupancy} scenarioData={scenarioData} selectedOccupancy={occupancy}/></motion.div>
 <SectionHeader eyebrow={t.sections.investmentHighlights} title={t.sections.investmentHighlights}/><motion.div {...reveal}><InvestmentHighlights t={t} row={row}/></motion.div>
 <div className="mt-10 mb-10"><ExecutiveClosing t={t}/></div>
 <footer><span>{tx('مادينيوم · هوازن · دراسة STR','Madinum · Hawazen · STR Study')}</span></footer>
 </div></main></div>;
}

