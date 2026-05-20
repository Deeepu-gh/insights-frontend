import { motion } from 'framer-motion'
import { Activity, RefreshCw } from 'lucide-react'
import KPICards from '../components/KPICard'
import AlertPanel from '../components/AlertPanel'
import ChartsSection from '../components/ChartsSection'
import { WorstStatesTable, CarrierTable } from '../components/CarrierTable'
import { useKPI, useAnomalies } from '../hooks/index'
import { pageTransition, staggerContainer } from '../animations/variants'

export default function Dashboard() {
  const { data: kpiData, loading: kpiLoading, refetch: refetchKPI } = useKPI()
  const { data: anomalies, loading: anomalyLoading, refetch: refetchAnomalies } = useAnomalies()

  const handleRefresh = () => {
    refetchKPI()
    refetchAnomalies()
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-neon-blue" />
            <span className="text-[10px] font-mono text-neon-blue/70 tracking-[0.2em] uppercase">Live Dashboard</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            Network{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Intelligence
            </span>
          </h1>
          <p className="text-xs text-white/30 font-body mt-1">
            Real-time telecom analytics · Updated every 30s
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neon-cyan/70 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(0,255,204,0.06)', border: '1px solid rgba(0,255,204,0.12)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            LIVE
          </motion.div>

          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            onClick={handleRefresh}
            className="p-2.5 rounded-xl text-white/40 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(15,23,42,0.04)', border: '1px solid rgba(15,23,42,0.08)' }}
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>
      </div>

      {/* Main grid: alerts on left, content on right */}
      <div className="flex gap-5">
        {/* Left: Alert panel */}
        <div className="hidden lg:flex flex-col w-72 flex-shrink-0" style={{ height: 'calc(100vh - 160px)', position: 'sticky', top: 88 }}>
          <AlertPanel anomalies={anomalies} loading={anomalyLoading} />
        </div>

        {/* Right: main content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* KPI Cards */}
          <section>
            <KPICards kpiData={kpiData} loading={kpiLoading} />
          </section>

          {/* Mobile alerts */}
          <div className="lg:hidden">
            <AlertPanel anomalies={anomalies} loading={anomalyLoading} />
          </div>

          {/* Charts */}
          <section>
            <ChartsSection />
          </section>

          {/* Tables */}
          <motion.section
            className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
          >
            <WorstStatesTable />
            <CarrierTable />
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}
