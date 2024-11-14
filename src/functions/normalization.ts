export const normalizeArray = (data) => {
    const lastSynced = data.find((item) => item.last_synced);
    const dataArray = data.filter((item) => !item.last_synced);
    return { data: dataArray, lastSynced:lastSynced.last_synced };
  };
  
  // Normalization function for objects with a 'data' property
 export const normalizeFarmerData = (data) => {
    const lastSynced = data.data.find((item) => item.last_synced);
    const dataArray = data.data.filter((item) => !item.last_synced);
    return { data: dataArray, lastSynced:lastSynced.last_synced };
  };
  
  // Normalization function for simple objects without a 'data' property
 export const normalizeDashboardData = (data) => {
    const lastSynced = data.last_synced;
    const { last_synced, ...dataObject } = data;
    return { data: dataObject, lastSynced };
  };
  