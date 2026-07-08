import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface ChatSession {
  id: string;
  date: string;
  messages: { role: 'user' | 'assistant', content: string }[];
}

export interface InteractionState {
  currentForm: {
    hcp_name: string;
    interaction_type: string;
    date: string;
    time: string;
    attendees: string;
    topics: string;
    materials: string;
    samples: string;
    sentiment: string;
    outcomes: string;
    follow_up: string;
  };
  chatHistory: { role: 'user' | 'assistant', content: string }[];
  pastSessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
}

const initialState: InteractionState = {
  currentForm: {
    hcp_name: '',
    interaction_type: 'Meeting',
    date: '',
    time: '',
    attendees: '',
    topics: '',
    materials: '',
    samples: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up: '',
  },
  chatHistory: [
    { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you log an interaction today?' }
  ],
  pastSessions: [],
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'interaction/sendMessage',
  async (message: string, { dispatch }) => {
    dispatch(addChatMessage({ role: 'user', content: message }));
    try {
      const response = await axios.post(`${API_URL}/chat`, { message });
      dispatch(addChatMessage({ role: 'assistant', content: response.data.response }));
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.detail || 'Error communicating with AI';
    }
  }
);

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<Partial<InteractionState['currentForm']>>) => {
      state.currentForm = { ...state.currentForm, ...action.payload };
    },
    addChatMessage: (state, action: PayloadAction<{ role: 'user' | 'assistant', content: string }>) => {
      state.chatHistory.push(action.payload);
    },
    resetForm: (state) => {
      state.currentForm = initialState.currentForm;
    },
    startNewInteraction: (state) => {
      // Save current session if there are user messages
      if (state.chatHistory.length > 1) {
        state.pastSessions.push({
          id: Date.now().toString(),
          date: new Date().toLocaleString(),
          messages: [...state.chatHistory]
        });
      }
      // Reset chat and form
      state.chatHistory = [...initialState.chatHistory];
      state.currentForm = { ...initialState.currentForm };
    },
    loadPastSession: (state, action: PayloadAction<string>) => {
      const session = state.pastSessions.find(s => s.id === action.payload);
      if (session) {
        // If we are currently in an active session, save it before loading the old one
        if (state.chatHistory.length > 1 && !state.pastSessions.some(s => s.messages === state.chatHistory)) {
          state.pastSessions.push({
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            messages: [...state.chatHistory]
          });
        }
        state.chatHistory = [...session.messages];
        // Note: loading a past session does not repopulate the form, just the chat
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { updateForm, addChatMessage, resetForm, startNewInteraction, loadPastSession } = interactionSlice.actions;
export default interactionSlice.reducer;
