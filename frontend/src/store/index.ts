import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from './interactionSlice';

// Load chat history from localStorage if it exists
const persistedChat = localStorage.getItem('crm_chat_history');
const persistedPast = localStorage.getItem('crm_past_sessions');
const preloadedChatHistory = persistedChat ? JSON.parse(persistedChat) : undefined;
const preloadedPastSessions = persistedPast ? JSON.parse(persistedPast) : undefined;

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
  },
  preloadedState: (preloadedChatHistory || preloadedPastSessions) ? {
    interaction: {
      ...interactionReducer(undefined, { type: '@@INIT' } as any),
      ...(preloadedChatHistory && { chatHistory: preloadedChatHistory }),
      ...(preloadedPastSessions && { pastSessions: preloadedPastSessions })
    }
  } : undefined
});

// Save chat history to localStorage whenever it changes
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('crm_chat_history', JSON.stringify(state.interaction.chatHistory));
  localStorage.setItem('crm_past_sessions', JSON.stringify(state.interaction.pastSessions));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
