import axiosInstance from './axiosInstance';

/**
 * Get all achievements for the current user
 */
export const getAchievements = async () => {
    try {
        const response = await axiosInstance.get('/api/achievements/');
        return response.data;
    } catch (error) {
        console.error('Error fetching achievements:', error);
        throw error;
    }
};

/**
 * Unlock an achievement for the current user
 * @param {string} category - Achievement category (memorice, puzzle, sudoku, camino)
 * @param {number} level - Difficulty level (1=easy, 2=normal, 3=hard)
 */
export const unlockAchievement = async (category, level) => {
    try {
        const response = await axiosInstance.post('/api/achievements/unlock/', {
            category,
            level
        });
        return response.data;
    } catch (error) {
        console.error('Error unlocking achievement:', error);
        throw error;
    }
};
