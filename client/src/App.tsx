import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { difficultyLabel } from './lib/diffs';
import Home from './components/Home';
import GameScreen from './components/GameScreen';
import ShareLoader from './components/ShareLoader';
import GeneratingModal from './components/GeneratingModal';
import { GameProvider, useGame } from './contexts/GameContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

function MainRoute() {
  const { screen, game, generating, newGame, setScreen } = useGame();
  const { toggleTheme } = useSettings();

  const resume = game && !game.won
    ? { label: difficultyLabel(game.difficulty), seconds: game.seconds, onResume: () => setScreen('game') }
    : null;

  return (
    <>
      {screen === 'home' && <Home onNew={newGame} resume={resume} onToggleTheme={toggleTheme} />}
      {screen === 'game' && game && <GameScreen />}
      {generating && <GeneratingModal />}
    </>
  );
}

function AppContent() {
  return (
    <div className="w-full min-h-full bg-bg flex flex-col max-w-[var(--maxw)] mx-auto relative overflow-x-hidden overflow-y-auto">
      <Routes>
        <Route path="/share/:id" element={<ShareLoader />} />
        <Route path="/" element={<MainRoute />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
