import { useLocation, Link } from 'react-router-dom';
import { useGenerateLobbyPageLogic } from './GenerateLobbyPage.logic';
import ThemeToggle from '@components/common/ThemeToggle';
import GenerateLobby from '@components/GenerateLobby/GenerateLobby';
import { ROUTES } from '@utils/constants';
import './GenerateLobbyPage.scss';

const GenerateLobbyPage: React.FC = () => {
  const location = useLocation();
  const {
    user,
    sidebarOpen,
    toggleSidebar,
    showGenerateLobbyModal,
    setShowGenerateLobbyModal,
    tournamentStatus,
    setTournamentStatus,
    tournaments,
    tournamentsLoading,
    tournamentsError,
    refreshTournaments,
  } = useGenerateLobbyPageLogic();

  return (
    <div className={`generate-lobby-page-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className={`generate-lobby-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">BooyahX Admin</h2>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to={ROUTES.DASHBOARD} 
            className={`nav-item ${location.pathname === ROUTES.DASHBOARD ? 'active' : ''}`}
            onClick={(e) => {
              if (location.pathname === ROUTES.DASHBOARD) {
                e.preventDefault();
              }
            }}
          >
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span className="nav-text">Dashboard</span>}
          </Link>
          <Link 
            to={ROUTES.GENERATE_LOBBY} 
            className={`nav-item ${location.pathname === ROUTES.GENERATE_LOBBY ? 'active' : ''}`}
            onClick={(e) => {
              if (location.pathname === ROUTES.GENERATE_LOBBY) {
                e.preventDefault();
              }
            }}
          >
            <span className="nav-icon">🎮</span>
            {sidebarOpen && <span className="nav-text">Generate Lobby</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && user && (
            <div className="user-info">
              <div className="user-email">{user.email}</div>
              {user.name && <div className="user-name">{user.name}</div>}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="generate-lobby-main">
        <header className="generate-lobby-page-header">
          <div className="header-left">
            <h1>Generate Lobby</h1>
          </div>
          <div className="header-actions">
            <ThemeToggle />
          </div>
        </header>

      <div className="generate-lobby-page-content">
        <div className="generate-lobby-page-card">
          <h2 className="card-title">Generate Next Day Lobby</h2>
          <p className="card-description">
            Create and configure lobbies for the next day. Select date, time slots, game mode, sub modes, and region.
          </p>
          <button
            className="generate-lobby-button"
            onClick={() => setShowGenerateLobbyModal(true)}
            aria-label="Open Generate Lobby Modal"
          >
            <span className="button-icon">🎮</span>
            <span>Generate Lobby</span>
          </button>
        </div>

        {/* Tournaments List */}
        <div className="tournaments-list-card">
          <div className="tournaments-header">
            <h2 className="card-title">
              {tournamentStatus === 'upcoming' ? "Today's Tournaments" : 
               tournamentStatus === 'live' ? "Live Tournaments" : 
               "Completed Tournaments"}
            </h2>
            <div className="tournament-status-tabs">
              <button
                className={`status-tab ${tournamentStatus === 'upcoming' ? 'active' : ''}`}
                onClick={() => setTournamentStatus('upcoming')}
                disabled={tournamentsLoading}
              >
                Upcoming
              </button>
              <button
                className={`status-tab ${tournamentStatus === 'live' ? 'active' : ''}`}
                onClick={() => setTournamentStatus('live')}
                disabled={tournamentsLoading}
              >
                Live
              </button>
              <button
                className={`status-tab ${tournamentStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setTournamentStatus('completed')}
                disabled={tournamentsLoading}
              >
                Completed
              </button>
            </div>
          </div>
          {tournamentsLoading ? (
            <div className="tournaments-loading">
              <p>Loading tournaments...</p>
            </div>
          ) : tournamentsError ? (
            <div className="tournaments-error">
              <p>{tournamentsError}</p>
            </div>
          ) : tournaments.length > 0 ? (
            <div className="tournaments-list">
              {tournaments.map((tournament) => (
                <div key={tournament._id || tournament.id} className="tournament-card">
                  <div className="tournament-header">
                    <div className="tournament-game-mode">
                      <span className="tournament-game">{tournament.game}</span>
                      <span className="tournament-mode">{tournament.mode} - {tournament.subMode}</span>
                    </div>
                    <span className={`tournament-status tournament-status-${tournament.status}`}>
                      {tournament.status}
                    </span>
                  </div>
                  <div className="tournament-details">
                    <div className="tournament-detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {tournament.date ? new Date(tournament.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="tournament-detail-item">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">{tournament.startTime || 'N/A'}</span>
                    </div>
                    <div className="tournament-detail-item">
                      <span className="detail-label">Entry Fee:</span>
                      <span className="detail-value">₹{tournament.entryFee}</span>
                    </div>
                    <div className="tournament-detail-item">
                      <span className="detail-label">Prize Pool:</span>
                      <span className="detail-value prize-pool">₹{tournament.prizePool}</span>
                    </div>
                    <div className="tournament-detail-item">
                      <span className="detail-label">Players:</span>
                      <span className="detail-value">
                        {tournament.joinedCount !== undefined 
                          ? tournament.joinedCount 
                          : tournament.participants.length}/{tournament.maxPlayers}
                        {tournament.availableSlots !== undefined && (
                          <span className="available-slots"> ({tournament.availableSlots} available)</span>
                        )}
                      </span>
                    </div>
                    {tournament.region && (
                      <div className="tournament-detail-item">
                        <span className="detail-label">Region:</span>
                        <span className="detail-value">{tournament.region}</span>
                      </div>
                    )}
                  </div>
                  {tournament.room && tournament.room.roomId && (
                    <div className="tournament-room">
                      <div className="room-info">
                        <span className="room-label">Room ID:</span>
                        <span className="room-value">{tournament.room.roomId}</span>
                      </div>
                      {tournament.room.password && (
                        <div className="room-info">
                          <span className="room-label">Password:</span>
                          <span className="room-value">{tournament.room.password}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="tournaments-empty">
              <p>
                {tournamentStatus === 'upcoming' ? "No upcoming tournaments found for today." :
                 tournamentStatus === 'live' ? "No live tournaments found." :
                 "No completed tournaments found."}
              </p>
            </div>
          )}
        </div>
      </div>
      </main>

      {/* Generate Lobby Modal */}
      <GenerateLobby
        isOpen={showGenerateLobbyModal}
        onClose={() => setShowGenerateLobbyModal(false)}
        onSuccess={refreshTournaments}
      />
    </div>
  );
};

export default GenerateLobbyPage;

