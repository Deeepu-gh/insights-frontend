import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Shield, Bell, Globe, Cpu, Database, Sliders, Sun, Moon, LogOut } from 'lucide-react'
import { pageTransition, staggerItem } from '../animations/variants'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

function Toggle({ checked, onChange }) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'rgba(15,23,42,0.1)' }}
      animate={{ boxShadow: checked ? '0 0 12px rgba(37,99,235,0.25)' : 'none' }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
      />
    </motion.button>
  )
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/75 font-body">{label}</p>
        {description && <p className="text-[10px] text-white/30 font-body mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(248,250,252,0.95)', border: '1px solid rgba(15,23,42,0.07)' }}
    >
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <Icon size={14} className="text-neon-blue" style={{ color: 'var(--neon-blue)' }} />
        </div>
        <h3 className="text-sm font-display font-semibold text-white/80">{title}</h3>
      </div>
      <div className="px-5">{children}</div>
    </motion.div>
  )
}

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme()
  const { logout, user } = useAuth()

  const [settings, setSettings] = useState({
    autoRefresh: true,
    anomalyAlerts: true,
    pushNotifications: false,
    aiEnabled: true,
    cacheResponses: true,
    showPredictions: true,
    logQueries: true,
    apiTimeout: '15',
    refreshInterval: '30',
    region: 'all',
  })

  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }))
  const [saved, setSaved] = useState(false)
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Platform Settings</h1>
          <p className="text-xs text-white/30 font-body mt-1">Configuration, preferences, and account management</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body transition-all"
          style={{
            background: saved
              ? 'linear-gradient(135deg, rgba(0,255,204,0.2), rgba(0,212,255,0.2))'
              : 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white',
            boxShadow: saved ? '0 0 15px rgba(13,148,136,0.25)' : '0 0 20px rgba(0,212,255,0.3)',
          }}
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <motion.div
        className="space-y-4"
        initial="initial" animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* ── Appearance ── */}
        <Section icon={isDark ? Moon : Sun} title="Appearance & Display">
          <SettingRow
            label="Interface Theme"
            description="Switch between dark and light mode across the entire platform"
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-white/40">{isDark ? 'Dark' : 'Light'}</span>
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all"
                style={{
                  background: isDark ? 'rgba(255,220,100,0.1)' : 'rgba(0,212,255,0.1)',
                  border: isDark ? '1px solid rgba(255,220,100,0.2)' : '1px solid rgba(0,212,255,0.2)',
                  color: isDark ? '#ffdc64' : '#2563eb',
                }}
              >
                {isDark ? <Sun size={12} /> : <Moon size={12} />}
                {isDark ? 'Switch to Light' : 'Switch to Dark'}
              </motion.button>
            </div>
          </SettingRow>
        </Section>

        {/* ── Data & Refresh ── */}
        <Section icon={Database} title="Data & Refresh">
          <SettingRow label="Auto-Refresh" description="Automatically poll dashboard for new data">
            <Toggle checked={settings.autoRefresh} onChange={v => update('autoRefresh', v)} />
          </SettingRow>
          <SettingRow label="Refresh Interval" description="Frequency of live data polling">
            <select
              value={settings.refreshInterval}
              onChange={e => update('refreshInterval', e.target.value)}
              className="bg-white/[0.06] text-white/70 text-xs font-mono px-3 py-2 rounded-lg border border-white/[0.1] outline-none"
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </SettingRow>
          <SettingRow label="Cache Responses" description="Store AI responses locally to reduce latency">
            <Toggle checked={settings.cacheResponses} onChange={v => update('cacheResponses', v)} />
          </SettingRow>
          <SettingRow label="API Timeout" description="Maximum wait time for backend responses">
            <select
              value={settings.apiTimeout}
              onChange={e => update('apiTimeout', e.target.value)}
              className="bg-white/[0.06] text-white/70 text-xs font-mono px-3 py-2 rounded-lg border border-white/[0.1] outline-none"
            >
              <option value="10">10 seconds</option>
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
            </select>
          </SettingRow>
        </Section>

        {/* ── Notifications ── */}
        <Section icon={Bell} title="Alerts & Notifications">
          <SettingRow label="Anomaly Alerts" description="Display real-time anomaly alerts in the panel">
            <Toggle checked={settings.anomalyAlerts} onChange={v => update('anomalyAlerts', v)} />
          </SettingRow>
          <SettingRow label="Push Notifications" description="Browser push notifications for critical network events">
            <Toggle checked={settings.pushNotifications} onChange={v => update('pushNotifications', v)} />
          </SettingRow>
        </Section>

        {/* ── AI Engine ── */}
        <Section icon={Cpu} title="AI Engine">
          <SettingRow label="AI Assistant" description="Enable the AI chatbot and natural language query engine">
            <Toggle checked={settings.aiEnabled} onChange={v => update('aiEnabled', v)} />
          </SettingRow>
          <SettingRow label="Predictive Analytics" description="Surface ML-powered network forecasts on the dashboard">
            <Toggle checked={settings.showPredictions} onChange={v => update('showPredictions', v)} />
          </SettingRow>
          <SettingRow label="Query Logging" description="Record NLQ queries to conversation history">
            <Toggle checked={settings.logQueries} onChange={v => update('logQueries', v)} />
          </SettingRow>
        </Section>

        {/* ── Region ── */}
        <Section icon={Globe} title="Region & Coverage">
          <SettingRow label="Default Region Filter" description="Pre-filter all dashboard views by geography">
            <select
              value={settings.region}
              onChange={e => update('region', e.target.value)}
              className="bg-white/[0.06] text-white/70 text-xs font-mono px-3 py-2 rounded-lg border border-white/[0.1] outline-none"
            >
              <option value="all">All India</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="central">Central</option>
            </select>
          </SettingRow>
        </Section>

        {/* ── API Config ── */}
        <Section icon={Sliders} title="API Configuration">
          <SettingRow label="Backend Endpoint" description="Spring Boot API base URL">
            <input
              defaultValue="http://localhost:8080"
              className="bg-white/[0.06] text-white/60 text-xs font-mono px-3 py-2 rounded-lg border border-white/[0.1] outline-none focus:border-neon-blue/50 w-52 transition-colors"
            />
          </SettingRow>
          <SettingRow label="API Version" description="">
            <span className="text-xs font-mono text-neon-blue px-2 py-1 rounded-lg"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--neon-blue)' }}>
              v2.4.1
            </span>
          </SettingRow>
        </Section>

        {/* ── Security ── */}
        <Section icon={Shield} title="Security & Session">
          <SettingRow label="Authenticated User" description="Current active operator account">
            <span className="text-xs font-mono text-white/50">{user?.username || 'admin'}</span>
          </SettingRow>
          <SettingRow label="Session Token" description="Your current authenticated session identifier">
            <span className="text-[10px] font-mono text-white/30 tracking-widest">••••••••••••4f2a</span>
          </SettingRow>
          <SettingRow label="Last Sign-In" description="">
            <span className="text-[10px] font-mono text-white/30">Today, 09:41 IST</span>
          </SettingRow>
          <SettingRow label="Sign Out" description="Terminate this session and return to the login screen">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={logout}
              className="flex items-center gap-2 text-xs font-body px-4 py-2 rounded-xl transition-colors"
              style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.25)', color: '#ef4444' }}
            >
              <LogOut size={12} />
              Sign Out
            </motion.button>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={staggerItem} className="rounded-2xl p-5"
        style={{ background: 'rgba(255,51,102,0.05)', border: '1px solid rgba(255,51,102,0.15)' }}>
        <h3 className="text-sm font-display font-semibold mb-4" style={{ color: '#ef4444' }}>Danger Zone</h3>
        <div className="flex flex-wrap gap-3">
          <button className="text-xs font-body px-4 py-2 rounded-xl transition-colors hover:bg-neon-red/10"
            style={{ border: '1px solid rgba(255,51,102,0.3)', color: '#ef4444' }}>
            Clear All History
          </button>
          <button className="text-xs font-body px-4 py-2 rounded-xl transition-colors hover:bg-white/[0.04]"
            style={{ border: '1px solid rgba(15,23,42,0.08)', color: 'rgba(15,23,42,0.5)' }}>
            Reset to Defaults
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
