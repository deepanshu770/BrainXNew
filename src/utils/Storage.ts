import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();
export const KEYS = {
    NEW_USER:'new_user',
    TOTAL_SESSIONS: 'total_sessions',
    CURRENT_STREAK: 'current_streak',
    LAST_SESSION_DATE: 'last_session_date',
    DAILY_SESSIONS: 'daily_sessions',
    LAST_DAILY_SESSION_DATE: 'last_daily_session_date',
};
