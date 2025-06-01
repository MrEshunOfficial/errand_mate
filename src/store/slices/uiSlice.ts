// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  type: 'confirm' | 'form' | 'info';
  title: string;
  content?: string;
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UiState {
  loading: {
    global: boolean;
    categories: boolean;
    services: boolean;
  };
  toasts: Toast[];
  modals: Modal[];
  sidebar: {
    isOpen: boolean;
    collapsed: boolean;
  };
  theme: 'light' | 'dark';
  layout: 'grid' | 'list';
  searchQuery: string;
  activeTab: string;
}

const initialState: UiState = {
  loading: {
    global: false,
    categories: false,
    services: false,
  },
  toasts: [],
  modals: [],
  sidebar: {
    isOpen: true,
    collapsed: false,
  },
  theme: 'light',
  layout: 'grid',
  searchQuery: '',
  activeTab: 'categories',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.categories = action.payload;
    },
    setServicesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.services = action.payload;
    },
    
    // Toast management
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        duration: action.payload.duration || 5000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Modal management
    openModal: (state, action: PayloadAction<Omit<Modal, 'id' | 'isOpen'>>) => {
      const modal: Modal = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        isOpen: true,
      };
      state.modals.push(modal);
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modalIndex = state.modals.findIndex(modal => modal.id === action.payload);
      if (modalIndex !== -1) {
        state.modals[modalIndex].isOpen = false;
      }
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload);
    },
    clearModals: (state) => {
      state.modals = [];
    },
    
    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebar.collapsed = action.payload;
    },
    
    // Theme management
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    
    // Layout management
    toggleLayout: (state) => {
      state.layout = state.layout === 'grid' ? 'list' : 'grid';
    },
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload;
    },
    
    // Search management
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    
    // Tab management
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    
    // Utility actions
    resetUI: (state) => {
      return {
        ...initialState,
        theme: state.theme, // Preserve theme on reset
      };
    },
    
    // Bulk loading state management
    setLoadingStates: (state, action: PayloadAction<Partial<UiState['loading']>>) => {
      state.loading = {
        ...state.loading,
        ...action.payload,
      };
    },
    
    // Sidebar state management
    setSidebarState: (state, action: PayloadAction<Partial<UiState['sidebar']>>) => {
      state.sidebar = {
        ...state.sidebar,
        ...action.payload,
      };
    },
  },
});

// Export actions
export const {
  // Loading actions
  setGlobalLoading,
  setCategoriesLoading,
  setServicesLoading,
  setLoadingStates,
  
  // Toast actions
  addToast,
  removeToast,
  clearToasts,
  
  // Modal actions
  openModal,
  closeModal,
  removeModal,
  clearModals,
  
  // Sidebar actions
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setSidebarState,
  
  // Theme actions
  toggleTheme,
  setTheme,
  
  // Layout actions
  toggleLayout,
  setLayout,
  
  // Search actions
  setSearchQuery,
  clearSearchQuery,
  
  // Tab actions
  setActiveTab,
  
  // Utility actions
  resetUI,
} = uiSlice.actions;

// Selectors
export const selectLoading = (state: { ui: UiState }) => state.ui.loading;
export const selectGlobalLoading = (state: { ui: UiState }) => state.ui.loading.global;
export const selectCategoriesLoading = (state: { ui: UiState }) => state.ui.loading.categories;
export const selectServicesLoading = (state: { ui: UiState }) => state.ui.loading.services;

export const selectToasts = (state: { ui: UiState }) => state.ui.toasts;
export const selectModals = (state: { ui: UiState }) => state.ui.modals;
export const selectOpenModals = (state: { ui: UiState }) => 
  state.ui.modals.filter(modal => modal.isOpen);

export const selectSidebar = (state: { ui: UiState }) => state.ui.sidebar;
export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebar.isOpen;
export const selectSidebarCollapsed = (state: { ui: UiState }) => state.ui.sidebar.collapsed;

export const selectTheme = (state: { ui: UiState }) => state.ui.theme;
export const selectLayout = (state: { ui: UiState }) => state.ui.layout;
export const selectSearchQuery = (state: { ui: UiState }) => state.ui.searchQuery;
export const selectActiveTab = (state: { ui: UiState }) => state.ui.activeTab;

// Utility selectors
export const selectIsLoading = (state: { ui: UiState }) => 
  Object.values(state.ui.loading).some(loading => loading);

export const selectHasToasts = (state: { ui: UiState }) => state.ui.toasts.length > 0;
export const selectHasModals = (state: { ui: UiState }) => state.ui.modals.length > 0;

// Export reducer
export default uiSlice.reducer;

// Helper functions for creating toasts with common patterns
export const createSuccessToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'success',
  title,
  message,
  duration: 3000,
});

export const createErrorToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'error',
  title,
  message,
  duration: 5000,
});

export const createWarningToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'warning',
  title,
  message,
  duration: 4000,
});

export const createInfoToast = (title: string, message?: string): Omit<Toast, 'id'> => ({
  type: 'info',
  title,
  message,
  duration: 3000,
});

// Helper functions for creating modals with common patterns
export const createConfirmModal = (
  title: string,
  content: string,
  onConfirm: () => void,
  onCancel?: () => void
): Omit<Modal, 'id' | 'isOpen'> => ({
  type: 'confirm',
  title,
  content,
  onConfirm,
  onCancel,
});

export const createInfoModal = (
  title: string,
  content: string
): Omit<Modal, 'id' | 'isOpen'> => ({
  type: 'info',
  title,
  content,
});

export const createFormModal = (
  title: string,
  onConfirm?: () => void,
  onCancel?: () => void
): Omit<Modal, 'id' | 'isOpen'> => ({
  type: 'form',
  title,
  onConfirm,
  onCancel,
});