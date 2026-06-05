import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deserializeGame, previewText, type ShareGameState } from '../lib/shareFormat';
import type { Game } from '../types';
import { useGame } from '../contexts/GameContext';
import GameNotFoundModal from './GameNotFoundModal';
import LoadShareModal from './LoadShareModal';

export default function ShareLoader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { game, loadGameFromShare } = useGame();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [shareData, setShareData] = useState<ShareGameState | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchShare = async () => {
      try {
        const response = await fetch(`/api/shares/${id}`);
        if (response.status === 404) { setNotFound(true); setLoading(false); return; }
        if (!response.ok) throw new Error('Failed to fetch share');
        const data = await response.json();
        setShareData(data.gameState);
        setLoading(false);
      } catch {
        setNotFound(true);
        setLoading(false);
      }
    };
    fetchShare();
  }, [id]);

  const handleConfirm = () => {
    if (!shareData) return;
    const gameFields = deserializeGame(shareData);
    const solution = Array(81).fill(0);
    shareData.givens.split('').forEach((char, index) => {
      if (char !== '.') solution[index] = parseInt(char, 10);
    });
    const valuesArray = shareData.values.split('');
    for (let index = 0; index < 81; index++) {
      if (valuesArray[index] !== '.') solution[index] = parseInt(valuesArray[index], 10);
    }
    const fullGame: Game = { ...gameFields, solution, won: false };
    loadGameFromShare(fullGame, 'game');
    navigate('/', { replace: true });
  };

  if (notFound) return <GameNotFoundModal onGoHome={() => navigate('/', { replace: true })} />;

  if (loading) return (
    <div className="min-h-full flex items-center justify-center text-[13px] tracking-[4px] text-ink">
      LOADING<span className="text-accent animate-[blink_1s_step-end_infinite]">…</span>
    </div>
  );

  if (!shareData) return null;

  return (
    <LoadShareModal
      previewText={previewText(shareData)}
      hasActiveGame={!!(game && !game.won)}
      onConfirm={handleConfirm}
      onCancel={() => navigate('/', { replace: true })}
    />
  );
}
