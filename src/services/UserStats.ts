import { storage, KEYS } from '../utils/Storage';

class UserStatsService {
  
  getStats() {
    this.checkDailyReset();
    
    return {
      totalSessions: storage.getNumber(KEYS.TOTAL_SESSIONS) || 0,
      streak: storage.getNumber(KEYS.CURRENT_STREAK) || 0,
      dailySessions: storage.getNumber(KEYS.DAILY_SESSIONS) || 0,
    };
  }

  recordSession() {
    const today = new Date().toDateString();
    const lastSessionDate = storage.getString(KEYS.LAST_SESSION_DATE);
    
    // 1. Update Total Sessions
    const currentTotal = storage.getNumber(KEYS.TOTAL_SESSIONS) || 0;
    storage.set(KEYS.TOTAL_SESSIONS, currentTotal + 1);

    // 2. Update Daily Sessions
    this.checkDailyReset(); // Ensure we are on the correct day count
    const currentDaily = storage.getNumber(KEYS.DAILY_SESSIONS) || 0;
    storage.set(KEYS.DAILY_SESSIONS, currentDaily + 1);
    storage.set(KEYS.LAST_DAILY_SESSION_DATE, today);

    // 3. Update Streak
    if (lastSessionDate !== today) {
      const currentStreak = storage.getNumber(KEYS.CURRENT_STREAK) || 0;
      
      if (this.isYesterday(lastSessionDate)) {
        // Continue streak
        storage.set(KEYS.CURRENT_STREAK, currentStreak + 1);
      } else {
        // Reset streak (or start new if 0)
        // If it's the first ever session, streak becomes 1.
        // If we missed a day, streak resets to 1.
        storage.set(KEYS.CURRENT_STREAK, 1);
      }
      
      storage.set(KEYS.LAST_SESSION_DATE, today);
    }
  }

  private checkDailyReset() {
    const today = new Date().toDateString();
    const lastDailyDate = storage.getString(KEYS.LAST_DAILY_SESSION_DATE);

    if (lastDailyDate !== today) {
      storage.set(KEYS.DAILY_SESSIONS, 0);
      storage.set(KEYS.LAST_DAILY_SESSION_DATE, today);
    }
  }

  private isYesterday(dateString: string | undefined): boolean {
    if (!dateString) return false;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return dateString === yesterday.toDateString();
  }
}

export const UserStats = new UserStatsService();
