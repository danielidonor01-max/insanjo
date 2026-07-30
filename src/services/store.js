import api from "./webApi";


export const getStoreDetails = async (publicId) => {
  try {
    const response = await api.get(`/pages/public/business/${publicId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch store dets",
    };
  }
};

export const getProdDetails = async (id) => {
  try {
    const response = await api.get(`/pages/public/product/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch store dets",
    };
  }
};

export const searchItems = async (
  query,
  latitude,
  longitude,
) => {
  try {
    const response = await api.get(
      `/pages/public/items/search?query=${query}&latitude=${latitude}&longitude=${longitude}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch prod",
    };
  }
};

export const markFavorite = async (
  itemPublicId,
  type,
) => {
  try {
    const response = await api.post(`/customers/favorites`, {
      itemPublicId,
      type,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to mark favorite",
    };
  }
};

export const getFavoritedProducts = async () => {
  try {
    const response = await api.get(`/customers/favorites/products`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch favorited products",
    };
  }
};

export const getFavoritedStores = async () => {
  try {
    const response = await api.get(`/customers/favorites/stores`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch favorited stores",
    };
  }
};

export const deleteFavorite = async (
  itemId,
  type,
) => {
  try {
    const response = await api.delete(`/customers/favorites/${type}/${itemId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      data:
        error.response?.data?.message ||
        error.message ||
        "Failed to delete favorite",
    };
  }
};
