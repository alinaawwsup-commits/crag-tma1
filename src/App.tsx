import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { useStore } from './store/useStore'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Log } from './pages/Log'
import { Progress } from './pages/Progress'
import { Community } from './pages/Community'
import { Profile } from './pages/Profile'

const PAGES = {
  dashboard: Dashboard,
  log: Log,
  progress: Progress,
  community: Community,
  profile: Profile,
}

export default function App() {
  const { activeTab, initFromTelegram } = useStore()

  useEffect(() => {
    initFromTelegram()
  }, [initFromTelegram])

  const Page = PAGES[activeTab]

  return (
    <HashRouter>
      <Layout>
        <Page />
      </Layout>
    </HashRouter>
  )
}
