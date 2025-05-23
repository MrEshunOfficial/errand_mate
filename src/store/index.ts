import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/category-slice";
import servicesReducer from "./slices/service-slice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    services: servicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
