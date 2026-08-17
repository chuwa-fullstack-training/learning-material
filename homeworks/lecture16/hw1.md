# Todo List with State Management

> 🟡 Data flow must be understood — draw the Action → Dispatch → Reducer → Store diagram before coding.

Refactor your Todo List to use Redux for state management.

## Requirements

### Step 1: Redux Toolkit

- [ ] Use Function Components with hooks (`useSelector`, `useDispatch`)
- [ ] Create a `todosSlice` using `createSlice` from Redux Toolkit
- [ ] Implement actions: addTodo, toggleTodo, removeTodo, clearCompleted
- [ ] Use `configureStore` to set up the store

### Step 2: Async Actions (connect to backend)

- [ ] Use `createAsyncThunk` to fetch initial todos from your L10 backend API (or `jsonplaceholder`)
- [ ] Handle loading, error, and success states in `extraReducers`
- [ ] Implement async addTodo and deleteTodo that sync with the backend

### Step 3: Context API Alternative (short exercise)

- [ ] Create a separate branch or folder
- [ ] Implement the same Todo List using `useReducer` + Context API (no Redux)
- [ ] Write a brief comparison (in `comparison.md`): which approach felt simpler? When would you choose Redux over Context?

### Bonus

- [ ] Install Redux DevTools extension and take a screenshot showing your action history
