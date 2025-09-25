import api from "./Api";

export const ProductService = {
  // List products with optional filters, pagination, sorting
  getProducts: async (params?: {
    page?: number;
    price_from?: number;
    price_to?: number;
    sort?: string;
  }) => {
    const queryParams: {
      page?: number;
      filter?: {
        price_from?: number;
        price_to?: number;
      };
      sort?: string;
    } = {};

    if (params?.page) queryParams.page = params.page;
    if (params?.price_from || params?.price_to) {
      queryParams.filter = {};
      if (params.price_from) queryParams.filter.price_from = params.price_from;
      if (params.price_to) queryParams.filter.price_to = params.price_to;
    }
    if (params?.sort) queryParams.sort = params.sort;

    const response = await api.get("/products", { params: queryParams });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: number) => {
    const response = await api.get("/products", { params: { id } });
    return response.data;
  },
};
