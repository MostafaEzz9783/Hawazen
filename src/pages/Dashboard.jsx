import {useState,useRef,useEffect,useMemo} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {Globe,Download,Building2} from 'lucide-react';
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
 const [occupancy,setOccupancy]=useState(70),[sheet,setSheet]=useState(study.sheets[0].name),[query,setQuery]=useState(''),[full,setFull]=useState(false);
 const ref=useRef(null),exportRef=useRef(null),reduced=useReducedMotion();
 const m=study.models.str;
 const scenarioData=useMemo(()=>({revenueAt100:m.revenues.base,occupancy:Object.fromEntries(m.occupancy.map(rate=>[rate,buildOccupancyRow({revenueAt100:m.revenues.base,occupancyRate:rate,unitCount:m.units,feePipeline:m.fees})]))}),[m]);
 const row=scenarioData.occupancy[occupancy];
 const pricing=useMemo(()=>[{unit:'1bd',type:'oneBedroom',base:Number(study.sheets.find(s=>s.name==='STR-Regular Financial Study').cells.find(c=>c.address==='H7').value)}],[]);
 useEffect(()=>{document.title=language==='ar'?'مادينيوم | هوازن — دراسة STR':'Madinum | Hawazen — STR Study';},[language]);
 useEffect(()=>{const fn=()=>setFull(document.fullscreenElement===ref.current);document.addEventListener('fullscreenchange',fn);return()=>document.removeEventListener('fullscreenchange',fn);},[]);
 const reveal=reduced?{}:{initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.18},transition:{duration:.5,ease:[.16,1,.3,1]}};
 const cells=study.sheets.find(s=>s.name===sheet).cells.filter(c=>(c.address+' '+c.value+' '+c.formula).toLowerCase().includes(query.toLowerCase()));
 const download=()=>{const csv=[['Model','Scenario','Occupancy','Units','Gross SAR','Net SAR'],['STR','Base',occupancy,m.units,row.revenue,row.netRevenue]].map(r=>r.join(',')).join('\n');const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Hawazen-STR.csv';a.click();URL.revokeObjectURL(url);};
 return <div className="str-dashboard min-h-screen relative" ref={ref}>
 <FloatingBackground/>
 <div className="relative max-w-7xl mx-auto pt-4 px-4 sm:px-0">
 <nav className="study-nav"><img src="/madinum-logo.jpeg?v=2" alt={t.nav.brandAlt} className="company-logo"/><div className="study-nav-actions"><button onClick={onToggleLanguage}><Globe size={16}/>{t.nav.languageToggle}</button><span className="project-pill">{tx('هوازن','Hawazen')}</span><Building2 size={16}/></div></nav>
 <Hero t={t} title={tx('هوازن','Hawazen')} subtitle={tx('17 وحدة · الإيجار قصير المدى (STR)','17 units · Short-term rental (STR)')}/>
 </div>
 <main className="relative max-w-7xl mx-auto px-5 sm:px-6 pb-14">
 <div className="flex flex-wrap items-center gap-3 mb-6 mt-3"><Toolbar t={t} exportTargetRef={exportRef} exportFileName="Hawazen-STR-Study" isFullscreen={full} onToggleFullscreen={async()=>{if(document.fullscreenElement)await document.exitFullscreen();else await ref.current.requestFullscreen();}}/><button className="csv-button" onClick={download}><Download size={15}/>CSV</button></div>
 <div ref={exportRef}>
 <SectionHeader eyebrow={tx('نظرة عامة على السوق','Market overview')} title={tx('نموذج الإيجار قصير المدى','Short-term rental model')}/>
 <motion.div {...reveal}><GlassCard className="p-6 sm:p-8 mb-6"><div className="study-controls"><div><p className="control-label">{tx('نموذج التشغيل','Operating model')}</p><span className="selected-model">{tx('إيجار قصير المدى','Short-term rental')}<small>STR</small></span></div><div><p className="control-label">{tx('سيناريو التسعير','Pricing scenario')}</p><span className="selected-model">{t.scenarios.base}</span></div><OccupancySlider options={m.occupancy} value={occupancy} onChange={setOccupancy} t={t}/></div></GlassCard></motion.div>
 <motion.div {...reveal}><KPISection t={t} row={row} sparklineSeries={Object.values(scenarioData.occupancy)} occupancy={occupancy} revenueAt100={m.revenues.base} unitCount={m.units} operatingModel="str"/></motion.div>
 <p className="source-note">{tx('المصدر: شيتات STR الظاهرة فقط. السعر اليومي 210 SAR، والشهر 30 يومًا كما في صيغ الدراسة؛ ADR وRevPAR محسوبان على 360 يومًا في السنة.','Source: visible STR sheets only. Daily rate is SAR 210 and a month is 30 days in the study formulas; ADR and RevPAR use 360 days per year.')}</p>
 <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10" {...reveal}><OccupancyRing t={t} occupancy={occupancy}/><div className="lg:col-span-2"><RoomPricingTable t={t} roomPricing={pricing} scenario="base"/><p className="source-note mt-2">{tx('الملخص يسمي الوحدات Studio بينما جدول الأسعار يسميها 1Bd.','The summary labels units Studio; the pricing sheet labels them 1Bd.')}</p></div></motion.div>
 <SectionHeader eyebrow={t.sections.mathwaPerformance} title={t.sections.mathwaPerformance}/><p className="source-note -mt-3 mb-6">{t.sections.mathwaPerformanceSubtitle}</p>
 <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6" {...reveal}><RevenueDistributionDonut t={t} row={row}/><OwnerEconomicsCard t={t} row={row}/></motion.div>
 <p className="source-note">{tx('عمولة الحجز 15% من الإيراد، وأتعاب مادينيوم 21% من الإيراد بعد عمولة الحجز. نسب مخطط التوزيع تمثل حصة كل مبلغ من الإجمالي.','Booking fee is 15% of revenue. Madinum fee is 21% of revenue after booking fees. Distribution percentages represent each amount as a share of gross revenue.')}</p>
 <motion.div className="mb-6" {...reveal}><RevenueWaterfall t={t} row={row} revenueAt100={m.revenues.base}/></motion.div>
 <motion.div className="mb-10" {...reveal}><OccupancySensitivity t={t} occupancyOptions={m.occupancy} scenarioData={scenarioData} selectedOccupancy={occupancy}/></motion.div>
 <SectionHeader eyebrow={t.sections.investmentHighlights} title={t.sections.investmentHighlights}/><motion.div {...reveal}><InvestmentHighlights t={t} row={row}/></motion.div>
 <div className="mt-10 mb-10"><ExecutiveClosing t={t}/></div>
 <details className="source-details"><summary>{tx('بيانات الدراسة ومراجعة المصدر','Study data and source review')}</summary><GlassCard className="p-5 mt-4"><p className="source-note">{tx('القيم المحفوظة وصيغ Excel من شيتات STR الظاهرة فقط.','Saved values and Excel formulas from visible STR sheets only.')}</p><div className="haw-controls"><label>{tx('الشيت','Sheet')}<select value={sheet} onChange={e=>setSheet(e.target.value)}>{study.sheets.map(s=><option key={s.name}>{s.name}</option>)}</select></label><label>{tx('البحث في الخلايا','Search cells')}<input value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className="table-scroll source-table"><table><thead><tr><th>{tx('الخلية','Cell')}</th><th>{tx('القيمة','Value')}</th><th>{tx('الصيغة','Formula')}</th></tr></thead><tbody>{cells.map(c=><tr key={c.address} className={c.error?'error-row':''}><td>{c.address}</td><td>{String(c.value??tx('غير متاح','Unavailable'))}</td><td dir="ltr">{c.formula||'—'}</td></tr>)}</tbody></table>{!cells.length&&<p>{tx('لا توجد نتائج','No results')}</p>}</div></GlassCard></details>
 <footer><span>{tx('مادينيوم · هوازن · دراسة STR','Madinum · Hawazen · STR Study')}</span><span>Financial Study- Hawazen .xlsx</span></footer>
 </div></main></div>;
}
