export const storage = {
  getHistory: () => {
    try {
      const data = localStorage.getItem('taxi_history');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  
  saveHistory: (history) => {
    try {
      localStorage.setItem('taxi_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  },
  
  clearHistory: () => {
    try {
      localStorage.removeItem('taxi_history');
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }
};