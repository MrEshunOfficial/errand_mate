// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { categorySlice } from '@/store/slices/categorySlice';
import { serviceSlice } from '@/store/slices/serviceSlice';
import { uiSlice } from '@/store/slices/uiSlice';


export const store = configureStore({
  reducer: {
    categories: categorySlice.reducer,
    services: serviceSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;