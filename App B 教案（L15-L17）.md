# App B 个人教案：StreakUp 习惯打卡追踪器（L15 + L16 + L17）

> **仅供个人授课备课使用，不对外发布。** 配合 `pre_slides/lecture15.md`、`lecture16.md`、`lecture17.md`（投影用 slides）和 `sample_code/lecture15/habit-tracker`、`sample_code/lecture16/habit-tracker`、`sample_code/lecture17/habit-tracker` + `sample_code/lecture17/habit-tracker-api`（最终代码）一起使用。设计背景见 `前端贯穿式项目设计方案.md`。
>
> 用法同 App A 教案：slides 负责"讲概念"，这份教案负责"怎么讲、什么时候切到代码、代码要怎么一步步敲出来、哪里容易讲跑题或学生容易卡住"。时间是相对分配（以 100% 总时长为基准换算成分钟示例，按实际课时等比缩放即可）。

---

## 零、三讲总览

| | L15 | L16 | L17 |
|---|---|---|---|
| 主题 | React Router + Performance Optimization | State Management | Fullstack Integration + TS + Testing + AI Workflow |
| App B 阶段 | v0.1：多页面 + 路由 + 性能 | v0.2：状态管理 | v0.3：接后端 + TypeScript + 测试 |
| 代码起点 | 空白 Vite 项目 | `sample_code/lecture15/habit-tracker` | `sample_code/lecture16/habit-tracker` |
| 代码终点 | `sample_code/lecture15/habit-tracker` | `sample_code/lecture16/habit-tracker` | `sample_code/lecture17/habit-tracker`（前端）+ `sample_code/lecture17/habit-tracker-api`（后端，全新独立项目） |
| 核心教学动作 | **现场从零搭建**（build-up） | **现场重构**（引入 Redux，关闭上一讲留的缺口） | **现场重构 + 联调**（TS 化、接真后端、补测试） |
| 这三讲之后 | — | — | App B 到此完结，也是整个 React 阶段的终点 |

**贯穿三讲的教学策略（和 App A 一脉相承，但多一层）**：
- L15 结束时，**故意留一个真实的架构缺口**——`/stats` 页面读不到 `/habits` 页面的数据（打卡后切过去看不到更新），这不是 bug，是特意设计的"钩子"。
- L16 一开场就把这个缺口重新摆出来，让学生亲眼看到"这个问题必须解决"，再引出 Redux 作为解法。**不要在 L15 就用 Context 或者其他技巧把这个缺口填上**，否则 L16 引入 Redux 的说服力会大打折扣。
- L17 再进一步：把 L16 里"假装很真实"的 mock 数据和 mock 登录，换成真正的后端和真正的 JWT。这一步的教学重点是**行为的变化**（同步变异步、mock 变真实）而不只是语法变化，务必讲清楚"这不是重构，是能力升级"。

---

## 一、课前准备清单

### 三讲通用

- [ ] **提前跑通一遍最终代码**：`sample_code/lecture15/habit-tracker`、`lecture16/habit-tracker` 各自 `npm install && npm run dev` 跑一遍，确认没有依赖版本漂移问题。
- [ ] **准备"检查点"提交**：和 App A 一样，如果打算现场敲代码，提前拆成 git commit，方便中途出错时回退到某个检查点，不用当场排查半天冷场。
- [ ] **决定演示方式**：现场手敲 vs 提前写好+现场注释还原，两种都可以，按临场感觉选。
- [ ] **浏览器扩展**：提前装好 **Redux DevTools** 浏览器插件（L16 要用），提前确认能正常连接到本地跑的 app。
- [ ] **数据是相对"今天"生成的**：`src/utils/date.js` 里 `daysAgoKey`/`todayKey` 都是基于 `new Date()` 计算，所以 mock 数据（`src/data/habits.js`）无论哪天上课都会显示"看起来是最新的"打卡记录，不需要每次上课前手动改日期。

### L17 专属（这一讲涉及真实后端，风险点更多）

- [ ] **提前准备好一个可用的 MongoDB 实例**（本地 `mongod` 或 Atlas 免费集群），并提前跑一次 `sample_code/lecture17/habit-tracker-api`：`npm install` → 配置 `.env`（参考 `.env.example`）→ `npm start`，确认能正常连接、监听在 `4001` 端口。
- [ ] **提前跑一遍完整流程**：注册账号 → 登录 → 创建习惯 → 打卡 → 查看统计，确认前后端联调没问题（这个流程之前没有做过真实数据库的端到端测试，务必课前亲自走一遍，不要临场才发现后端连不上）。
- [ ] **准备一个课前就注册好的备用账号**：万一现场注册环节网络卡顿，可以直接用备用账号登录跳过注册步骤，保证节奏不断。
- [ ] **确认 CORS 配置**：`habit-tracker-api/.env` 里 `CORS_ORIGIN` 要和前端 Vite 的实际端口一致（默认 `5173`），如果本机 `5173` 被占用 Vite 会自动换端口，记得同步改 `.env` 或者提前清一下端口占用。
- [ ] **两个终端窗口/两个终端 tab 提前开好**：一个跑后端 `npm start`，一个跑前端 `npm run dev`，避免现场手忙脚乱切目录。
- [ ] **提前跑一遍测试**：`cd sample_code/lecture17/habit-tracker && npm test`，确认 3 个测试全部通过，现场演示测试环节不会因为环境问题失败。

---

## 二、Lecture 15：React Router + Performance Optimization（v0.1 从零搭建）

### 2.1 时间分配建议

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 5% | 开场 + App B 介绍（"Ownership Phase"开始） | 讲台 |
| 10% | SPA 路由原理 + Router v6 基础（Routes/Link/useNavigate/useParams） | slides |
| 8% | 嵌套路由 + Outlet 概念 | slides |
| 5% | useSearchParams 概念 | slides |
| 8% | Protected Routes 概念（呼应 L11 JWT） | slides |
| 6% | 代码分割（React.lazy + Suspense）概念 | slides |
| 8% | React.memo / useMemo / useCallback + 何时优化 | slides |
| **45%** | **现场搭建 StreakUp v0.1** | **代码（核心环节）** |
| 5% | Summary + 埋下 L16 的伏笔 | 讲台 |

> 这一讲知识点比 L13 密集不少（路由 + 性能两大块），前面概念铺垫部分要克制，能留到代码环节现场讲的就不要在 slides 上多停留。

### 2.2 开场话术要点

- 先明确"这是新的 app，不是接着 PodWave 讲"："从今天开始，我们进入 Ownership 阶段，也会开一个全新的项目——一个多页面的习惯打卡应用，代号 StreakUp。为什么换项目？因为接下来要学的路由，本质上是解决『多个页面』的问题，PodWave 从头到尾都只有一个页面，硬套路由会很别扭。"
- 交代终点感："今天下课时，你会有一个能登录、能看习惯列表、点进去看详情、还有个统计页的多页面应用。而且——请注意——它会有一个明显的小毛病，这个毛病我们先不修，留到下周解决，这是故意的。"（提前给悬念定调，避免学生以为是老师疏忽）

### 2.3 概念铺垫环节讲法要点

- **SPA 路由原理**：一句话讲清楚"没有路由的 SPA 是什么样子"（只有一个 URL，前进后退按钮失灵，不能分享具体页面链接），再讲路由怎么解决这些问题。
- **Router v6 基础（Routes/Link/useNavigate/useParams）**：过一遍语法，不用现场敲这部分，留到搭建环节结合真实路由讲更有效率。
- **嵌套路由 + Outlet**：这是本讲相对抽象的一个概念，建议先画图（App → Layout → 子路由渲染在 Outlet 位置），讲完立刻预告："待会儿我们的 `/habits` 页面就是这样一个 Layout，`/habits` 本身和 `/habits/:id` 都是它的子路由。"
- **useSearchParams**：强调"和 useState 的本质区别——这个状态活在 URL 里，可以刷新、可以分享、前进后退按钮能用"，为待会儿的分类筛选功能做铺垫。
- **Protected Routes**：明确说清楚"今天我们做的是**假的**认证——任何非空用户名都能登录成功，这节课的重点是路由怎么和认证结合、登录后怎么跳回原来想访问的页面，不是认证本身怎么做。真正的认证要等 L17 接后端才有。"（提前打好预防针，避免学生纠结"这也太不安全了吧"）
- **代码分割**：强调"这是`按需加载`思想在路由上的应用——用户没访问的页面，代码根本不用下载"。
- **React.memo / useMemo / useCallback + 何时优化**：过一下三者的分工表格，重点讲"不要过早优化"这条原则，说一句"待会儿我会先带你们看一个错误示范，再看正确做法，这样比直接看正确答案印象更深"。（提前预告等下要"先犯错再改对"，呼应 App A 里 Error Boundary 的教学套路，学生会有心理预期）

### 2.4 现场搭建脚本（核心环节，逐步骤）

> 每一步后面标注对应最终代码里的文件。建议每完成一步就提交一次作为检查点。

**Step 0 — 项目骨架**
- `npm create vite@latest habit-tracker -- --template react`，安装 `react-router-dom`。
- 讲解一句："脚手架部分你们已经很熟了，快速过。"

**Step 1 — Mock 数据先行**
- 新建 `src/utils/date.js`（`todayKey`/`daysAgoKey`）和 `src/data/habits.js`（6 个习惯，覆盖不同打卡状态：长连续、断掉的连续、今天刚开始、连续但今天没打卡、稀疏打卡、中等连续）。
- 讲解："这些日期都是相对『今天』算出来的，不是写死的字符串，所以不管哪天上这节课，数据看起来都是新的——这是个小技巧，写 demo 数据时可以借鉴。"
- 新建 `src/utils/streak.js`（`computeStreak`）：数一数连续打卡天数，允许"今天还没打卡但昨天打了"仍然算数（不会因为学生今天还没点开 app 就把连续记录清零）。这个边界条件值得单独讲一句，因为学生自己实现时很容易漏掉。

**Step 2 — 路由骨架先跑起来**
- 建最简单的几个页面组件（先只有 `<h1>`），把 `BrowserRouter`/`Routes`/`Route` 搭起来：`/login`、`/habits`、`/stats`。
- **提问互动点**："现在这三个路由，哪个应该在真实场景里需要登录才能看？" —— 引导到下面的 Protected Routes。

**Step 3 — HabitsLayout + 嵌套路由**
- 新建 `src/pages/HabitsLayout.jsx`，先只渲染一个占位 `<Navbar/>` + `<Outlet/>`。
- 在 `App.jsx` 里把 `/habits` 改成嵌套结构：`<Route path="/habits" element={<HabitsLayout/>}><Route index element={<HabitsListPage/>}/><Route path=":id" element={<HabitDetailPage/>}/></Route>`。
- 回到 Outlet 那张图："现在这就是刚才画的那张图，HabitsLayout 是 Layout，HabitsListPage 和 HabitDetailPage 是子路由。"

**Step 4 — 数据获取：把 L13 学的东西接回来**
- 在 `HabitsLayout.jsx` 里用 `useEffect` + `AbortController` 调用 `src/api/fetchHabits.js`（`setTimeout` 模拟网络延迟），loading/error 状态展示。
- **有意的回顾**："这个模式是不是很眼熟？对，就是 L13 数据获取模式，一模一样。React 的知识点是复用的，不是学一次就扔了。"
- 用 `<Outlet context={{ habits, onCheckIn: handleCheckIn }} />` 把数据和回调传给子路由。

**Step 5 — 列表 + 详情页**
- `HabitsListPage.jsx`：`useOutletContext()` 拿到 `habits`，`.map` 渲染 `HabitListItem`（先不用 memo，也先不用 useSearchParams）。
- `HabitDetailPage.jsx`：`useParams()` 拿 `id`，`useOutletContext()` 拿 `habits`，`.find` 出对应习惯，展示打卡历史。
- **提问互动点**："`HabitDetailPage` 怎么拿到和 `HabitsListPage` 一样的 `habits` 数据的？"——检验学生是否理解 Outlet context 在嵌套路由间共享数据的机制。

**Step 6 — useSearchParams 分类筛选**
- 加分类筛选按钮（All / health / mindfulness / productivity），点击调用 `setSearchParams({ category: cat })`，读取用 `searchParams.get('category')`。
- 现场演示："点几个分类切换一下，然后看浏览器地址栏——URL 变了。现在刷新页面，筛选状态还在。这就是 useSearchParams 相对 useState 的优势，试试如果用 useState 存筛选条件，刷新一下会怎样？"（可以现场对比着写一个 useState 版本，刷新页面丢失状态，形成对照）

**Step 7 — Mock 登录 + Protected Route**
- `src/auth/session.js`（`login`/`logout`/`getToken`，本质是往 `localStorage` 塞一个假 token）。
- `src/auth/ProtectedRoute.jsx`：没 token 就 `<Navigate to="/login" state={{ from: location }} replace />`。
- `LoginPage.jsx`：任意非空用户名直接"登录成功"，登录后 `navigate(location.state?.from?.pathname ?? '/habits', { replace: true })`。
- **现场演示登录后跳回原页面**：先登出，直接在地址栏输入 `/habits/h4` 回车（模拟用户收藏了这个链接），观察被重定向到 `/login`；登录后，观察自动跳回 `/habits/h4` 而不是默认的 `/habits`。这是本节课很出彩的一个演示点，务必现场做一次，光讲不演示效果差很多。

**Step 8 — 代码分割：StatsPage 独立成 chunk**
- `StatsPage.jsx` 先写一个最简单的版本（读取 `useOutletContext` 或者先直接展示"施工中"占位），用 `const StatsPage = lazy(() => import('./pages/StatsPage'))` + `<Suspense>` 包裹路由。
- **验证环节**：`npm run build`，打开 `dist/assets/`，指给学生看有一个单独的 `StatsPage-xxxx.js` 文件："这就是按需加载——只有用户点进 Stats 页面，浏览器才会下载这个文件。"

**Step 9 — StatsPage 数据获取：埋下 L16 的伏笔**
- `StatsPage` 是路由树上 `/habits` 的**兄弟**，不是它的子路由，够不到 `HabitsLayout` 传下来的 `Outlet context`。所以这里**独立发起一次 fetch**（自己的 `useEffect` + `fetchHabits`），维护自己的一份 `habits` state。
- 讲清楚为什么："这不是我偷懒，是路由结构决定的——`/stats` 和 `/habits` 是平级关系，没有共同的父路由来传数据。"

**Step 10 — React.memo：先写错，再改对（本讲高光时刻）**
- 先写一个"看起来没问题"但有 bug 的 `handleCheckIn`：
  ```jsx
  setHabits(prev => prev.map(h => ({
    ...h,
    checkIns: h.id === habitId ? [...h.checkIns, todayKey()] : h.checkIns
  })));
  ```
- 把 `HabitListItem` 包上 `React.memo`，加一行 `console.log('Rendering HabitListItem:', habit.name)`。
- 打开 Console，点击某一个习惯的"Check in"按钮——**观察到所有习惯都打印了渲染日志，不止被点击的那个**。停顿一下，问学生："明明用了 memo，为什么全都重渲染了？"
- 揭晓原因："因为 `.map(h => ({...h, ...}))` 对**每一个**习惯都创建了一个新对象，哪怕内容完全没变。memo 做的是浅比较，只要 `habit` 这个 prop 的引用变了，它就认为『变了』，不管内容是否真的不同。"
- 改成正确版本（ternary 分支返回原始 `h`，不创建新对象）：
  ```jsx
  setHabits(prev => prev.map(h =>
    h.id === habitId
      ? { ...h, checkIns: [...h.checkIns, todayKey()] }
      : h  // 未变化的习惯，原样返回，保持引用不变
  ));
  ```
- 再点一次"Check in"，观察 Console **只有被点击的那一项**打印了渲染日志。"这才是 memo 应该发挥作用的样子。记住这个对比，这是全场最容易被面试官追问的细节之一。"

**Step 11 — useMemo：证明计算真的被跳过了**
- `StatsPage` 里加 `useMemo` 包裹的连续天数聚合计算（`console.log('Recomputing stats...')`），依赖数组是 `[habits]`。
- 加一个和 `habits` 无关的 UI 状态（"Show raw data"按钮，`expanded` 布尔值）。
- 点击这个按钮，观察 Console **没有**再打印"Recomputing stats..."——组件重渲染了，但 memoized 的计算被跳过了。

**Step 12 — 收尾：揭晓缺口**
- 完整走一遍流程：登录 → 打卡某个习惯（比如"No Sugar"）→ 切到 Stats 页面。
- **让学生自己发现问题**："大家看一下 Stats 页面的数字，和刚才在列表页打卡的操作对上了吗？"——引导他们发现数字没有更新。
- 明确收尾："这不是我写错了，是故意留的。这两个页面现在各用各的数据，没有共享的『唯一数据源』。下周我们用 Redux 来解决这个问题。"

### 2.5 常见学生问题预案

- **"为什么 `/stats` 不干脆也塞进 `/habits` 底下当子路由，不就能共享数据了吗？"** → 可以这么做，但那样 `/stats` 的 URL 就要变成 `/habits/stats`，而且从产品设计角度，"统计"和"我的习惯"是平级的功能，不该有从属关系。更好的解法是让数据本身独立于路由结构存在——这正是下周 Redux 要做的事。
- **"useSearchParams 和普通的 useState 到底该怎么选？"** → 判断标准：这个状态**要不要**被分享/收藏/前进后退按钮记住？筛选条件、分页、排序方式这种"描述当前视图"的状态适合放 URL；表单输入中间态、弹窗开关这种不适合放 URL。
- **"Protected Route 现在检查的 token 是真的吗？黑客随便在 localStorage 里塞一个字符串是不是就能登录？"** → 完全正确，这是刻意简化的教学版本，目的是先把"路由怎么和认证状态联动"这件事讲清楚。真正有意义的 token 校验要等 L17 接上真后端、后端验证 JWT 签名才有安全性可言。

---

## 三、Lecture 16：State Management（v0.2 现场重构）

### 3.1 时间分配建议

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 5% | 开场：重新摆出上周的缺口 | 讲台 + 现场复现 bug |
| 5% | Props Drilling 问题 + 方案总览 | slides |
| 10% | Redux 原生原理（用已有的 `redux-native.js` 计数器 demo，不是本节课的 app） | slides + 代码（独立文件） |
| 6% | Redux Toolkit：createSlice（`redux-rtk.js` 计数器 demo） | 代码（独立文件） |
| 3% | Redux DevTools | 讲台演示 |
| 6% | Context API 概念 + Context vs Redux 对比表 | slides |
| 4% | useReducer 概念 | slides |
| 5% | When to Use What + 现代替代方案速览 | slides |
| **50%** | **现场重构：接入 Redux，关闭缺口 + Context 对比** | **代码（核心环节）** |
| 6% | Summary + 承上启下 | 讲台 |

> 这一讲的"现场编码"分两条线：先在**app 之外**用一个最小的计数器例子讲透 Redux 原理和 RTK 简化（复用仓库里已有的 `sample_code/lecture16/redux-native.js`、`redux-rtk.js`，不用重新写），再回到 app 里做真正的重构。不要在计数器例子上花太多现场编码时间，那两个文件是给你直接跑的，不是留白讲义。

### 3.2 开场话术要点

- 直接打开上周跑起来的 app，登录，打卡，切到 Stats——**现场复现上周的"缺口"**，不要只是嘴上说"大家还记得上周的问题吗"。眼见为实的效果好得多。
- "这周我们要修的就是这个问题。但在动手之前，先搞懂 Redux 到底在解决什么——不是学一个新语法，是学一种思维方式。"

### 3.3 概念铺垫讲法要点

- **Props Drilling**：这次不用抽象的 `App → Layout → Sidebar → UserMenu → Avatar` 图，直接用上周的真实缺口作为例子："我们的问题甚至比 Props Drilling 更麻烦——Props Drilling 好歹组件之间还有父子关系，可以一层层传；我们的 `/habits` 和 `/stats` 连父子关系都没有，props 根本传不过去。"
- **Redux 原生原理**：切到 `sample_code/lecture16/redux-native.js`，跑一下这个计数器例子，一步步过 Action → Dispatch → Reducer → Store 的数据流。**不需要现场敲**，这个文件已经能跑，重点是讲清楚流程和三大原则（单一数据源、状态只读、纯函数更新）。
- **RTK 简化**：切到 `redux-rtk.js`，对比"原生要写这么多样板代码，RTK 用 `createSlice` 几行搞定，还能『假装直接改』"。
- **Redux DevTools**：装好插件的话现场打开一下，跑几次计数器的 increment，展示时间旅行调试——这个演示很直观，学生印象会很深。
- **Context API + 对比表**：过一下语法和 Redux 概念的对应关系（Provider/useContext ≈ Provider/useSelector），为待会儿"两者共存"的设计做铺垫。
- **useReducer / When to Use What / 现代替代方案**：按 slides 节奏过，不用停留太久，这些是"知识地图"性质的内容，之后有机会实际选型时再深入。

### 3.4 现场重构脚本一：引入 Redux，关闭缺口

> 教学核心：和 App A 的 L14 一样，**逐步搬运，而不是重写**。这次的重构目标更明确——把两处各自为政的数据搬到同一个地方去。

**Step 1** — `npm install @reduxjs/toolkit react-redux`。

**Step 2** — 新建 `src/store/habitsSlice.js`：先只写 `fetchHabits`（`createAsyncThunk`，内部调用已有的 `src/api/fetchHabits.js`）+ `extraReducers` 的 `pending`/`fulfilled`/`rejected` 三段——这部分逻辑几乎是把 `HabitsLayout.jsx` 里原来的 `useEffect` 逐段翻译过去，不是凭空发明。

**Step 3** — 新建 `src/store/store.js`（`configureStore`），`App.jsx` 里用 `<Provider store={store}>` 包裹。

**Step 4** — 新建 `src/store/useEnsureHabitsLoaded.js`：一个自定义 Hook，`if (status !== 'idle') return; dispatch(fetchHabits())`。
- **重点讲清楚一个容易踩的坑**：这个 effect 的依赖数组故意写成 `[]`，而不是 `[status, dispatch]`。现场可以演示一下如果加上 `status` 依赖会发生什么——fetch 一发起，`status` 变成 `'loading'`，effect 重新运行，cleanup 把刚发起的请求 `abort()` 掉，请求还没来得及成功就被自己取消了。"这是个真实的坑，写异步 effect 时经常会不小心把『触发条件』塞进依赖数组，反而搬起石头砸自己的脚。"

**Step 5** — 简化 `HabitsLayout.jsx`：删掉本地的 `useState`/`useEffect`/`AbortController`，改成调用 `useEnsureHabitsLoaded()` + `useSelector` 读 `status`/`error`。**对比行数**，和 App A 的"组件变薄了"是同一个教学套路。

**Step 6** — `HabitsListPage.jsx`、`HabitDetailPage.jsx`：把 `useOutletContext()` 换成 `useSelector(state => state.habits.items)`。

**Step 7** — `checkIn` reducer（Immer 的"假装直接改"）：
```js
checkIn(state, action) {
  const habit = state.items.find(h => h.id === action.payload);
  if (habit && !habit.checkIns.includes(todayKey())) {
    habit.checkIns.push(todayKey());
  }
}
```
- **回到上周的"先写错再改对"**："还记得上周我们为了让 memo 生效，专门写了个三元表达式，确保没变化的习惯保持原来的引用吗？现在用 Immer，直接 `find` 出来改，Immer 会自动帮你处理引用——只有被改的那个习惯会变成新对象，其他的原样不动。这不是巧合，这正是 RTK 底层的 Immer 帮你做的事。"

**Step 8** — `HabitListItem.jsx`：改成 `useDispatch()` + `dispatch(checkIn(habit.id))`，删掉 `onCheckIn` prop。
- **讲清楚为什么 memo 依然有效**："`useDispatch()` 每次调用返回的都是同一个函数引用，天生稳定。这意味着我们甚至不需要像上周那样，在父组件里手动写 `useCallback` 来保持回调稳定——用了 Redux 之后，这个心智负担直接消失了。"

**Step 9 — 全场最重要的验证时刻**：`StatsPage.jsx` 也改成 `useEnsureHabitsLoaded()` + `useSelector`。登录 → 在 `/habits` 打卡 → 切到 `/stats`。**这次数字更新了**。对比上周的截图/记忆，这是本讲最大的"啊哈时刻"，可以停顿几秒让效果沉淀一下。

### 3.5 现场重构脚本二：Context，一个不该用 Redux 的例子

**Step 1** — 新建 `src/context/ViewPreferencesContext.jsx`：`useReducer` 管理 `{ compact: false }`，`TOGGLE_COMPACT` action，导出 `ViewPreferencesProvider` 和 `useViewPreferences` hook。

**Step 2** — `Navbar.jsx` 加一个"Compact view: On/Off"按钮，调用 `dispatch({ type: 'TOGGLE_COMPACT' })`。

**Step 3** — `HabitsListPage.jsx` 读取 `compact` 状态，给列表加一个 CSS 类名切换紧凑样式。

**Step 4** — `App.jsx` 同时包两层：`<Provider store={store}><ViewPreferencesProvider>...</ViewPreferencesProvider></Provider>`。
- **点出这一步的教学意义**："注意我们现在同时用了两套状态管理方案，而且是故意的。习惯数据——异步、需要跨越好几个路由共享、有增删改——用 Redux；『紧凑模式』这种纯 UI 偏好——同步、就一个开关、没几个组件关心——用 Context 就够了。不是『学了新工具就要用在所有地方』，是『每个工具解决它最擅长的那类问题』。"

### 3.6 收尾话术

- 回顾今天的两条线："关闭了上周的数据缺口（Redux），也顺手学了 Redux **不该**用在什么地方（Context 对比）。"
- 承上启下："StreakUp 现在能记录打卡了，但有个问题——刷新一下页面，或者换台电脑登录，这些打卡记录是不是就没了？因为现在还是纯前端内存里的假数据。下周我们接一个真正的后端，数据真正存起来，而且会把整个项目升级成 TypeScript，再补上测试。"

### 3.7 常见学生问题预案

- **"`state.items.find(...)` 返回的到底是什么，为什么改它就能生效？"** → 在 RTK 的 reducer 里，`state` 其实是 Immer 提供的一个"草稿代理对象"（draft proxy），你对它做的任何"修改"都会被 Immer 记录下来，最后统一生成一份新的不可变状态，而不是真的原地修改。这也是为什么普通 Redux reducer 绝对不能直接改 state，而在 RTK 的 `createSlice` 里却被允许（因为背后是 Immer 在处理，不是真的破坏了不可变性）。
- **"是不是以后写 React 项目都应该无脑上 Redux？"** → 明确不是，回到 When to Use What 那张表——本地状态用 `useState`，跨几个相邻组件用状态提升，主题/语言这类全局但简单的用 Context，真正复杂、异步、跨很多地方共享的才上 Redux。StreakUp 里的"紧凑模式"就是一个反例。
- **"如果 `/habits` 和 `/stats` 同时挂载（比如一个在 iframe 里），会不会同时各发一次请求？"** → 好问题，但在标准的路由切换场景下不会同时挂载（同一时间只有一个路由匹配），`useEnsureHabitsLoaded` 的"只在 idle 时才发起"逻辑本质上是为了处理"先后访问"而不是"同时访问"的情况；如果真的需要处理并发请求去重，RTK Query 会是更合适的工具（可以顺带提一下 slides 里"现代替代方案"提到的 TanStack Query / RTK Query）。

---

## 四、Lecture 17：Fullstack Integration + TypeScript + Testing + AI Workflow（v0.3 收官）

### 4.1 时间分配建议

> 这一讲内容密度全课程最高（四个 Part），而且是 Ownership 阶段——slides 明确鼓励"用 AI 加速开发，你的重心是审查和整合"。教学方式也要相应调整：**不是所有代码都需要现场手敲**，后端 CRUD 这类样板代码，更适合直接讲解已经写好的结构，把宝贵的现场时间留给"新行为"的部分（真实网络往返、TypeScript 类型设计、测试）。

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 5% | 开场：这是 App B 的终点 | 讲台 |
| 10% | 走读后端结构（不现场敲，讲解已有代码） | 代码讲解 |
| 5% | CORS + API Service Layer 概念 | slides |
| 8% | TypeScript + React 概念（props/hooks/API 类型） | slides |
| 8% | 前端测试概念（RTL 三种模式） | slides |
| 5% | AI 协作工作流概念（测试先行模式） | slides |
| **50%** | **现场演示：接后端 + TS 化 + 测试先行** | **代码（核心环节）** |
| 5% | AI Usage Log 提醒 + 整个 React 阶段收尾 | 讲台 |
| 4% | Summary | 讲台 |

### 4.2 开场话术要点

- "这是 StreakUp 的最后一站，也是整个 React 阶段的最后一站。今天结束后，你会有一个真正意义上的全栈应用——有自己的数据库，有类型安全，有测试保护。"
- 明确这节课的"游戏规则"变化："从今天开始，我不会所有代码都现场手敲——后端的 CRUD 样板代码我会直接带你们读现成的，把时间花在真正需要理解的地方：接口契约怎么设计、TypeScript 怎么用、测试怎么写。这也是 Ownership 阶段本身想教你们的事：AI/现成代码能帮你生成样板，但你要清楚知道每一行在干什么。"

### 4.3 走读后端结构（不现场敲，讲解已有代码）

- 打开 `sample_code/lecture17/habit-tracker-api`，按 L11 的 MVC 结构过一遍：`models/`（`User`/`Habit`/`CheckIn`）、`controllers/`、`routers/`、`middlewares/auth.js`（和 L11 一样的 JWT 校验逻辑）。
- **强调两个和 L11 不同的地方**：
  1. `controllers/auth.js` 多了一个 `register`（L11 没演示过注册，只假设用户已存在），而且这里用了 `bcrypt` 哈希密码，不是 L11 里的明文比较——"L11 用明文是为了先把认证流程讲清楚，简化了安全性；这里是新写的代码，就没理由继续偷这个懒，直接用正确做法。"
  2. `models/CheckIn.js` 上有一个数据库层面的唯一复合索引 `{ habit: 1, date: 1 }`——"这保证了哪怕两个请求同时打过来，数据库也不可能存下两条同一天的打卡记录，这是比『应用层判断一下再插入』更可靠的保护，值得记住这个模式。"
- **API 契约设计的重点**：`GET /api/habits` 返回的形状 `{ id, name, category, checkIns }`，和 L15/L16 的 mock 数据长得一模一样。"这不是巧合，是故意设计的——正因为形状没变，待会儿你会看到，前端的 Redux slice 和几乎所有组件都**不需要改**，只有『怎么拿到数据』这一层变了。这就是好的接口契约该有的样子：使用方感知不到底层实现换了。"

### 4.4 概念铺垫讲法要点

- **CORS + API Service Layer**：过一下语法，指出 `habit-tracker-api/index.js` 里 `cors()` 配置和 `habit-tracker/src/api/client.ts` 的 `fetchWithAuth` 就是 slides 里这两个概念的落地版本。
- **TypeScript + React**：过 props/hooks/API 响应类型的写法，预告"待会儿我们会现场把 `HabitListItem` 从 `.jsx` 改成 `.tsx`，边改边讲"。
- **前端测试三种模式**：过一遍 render test / interaction test / async test 的写法。
- **AI 协作工作流（测试先行）**：讲清楚流程"你写测试 → AI 实现 → 你审查 → 迭代"，预告"待会儿我们会实际走一遍这个流程，不是纸上谈兵"。

### 4.5 现场演示脚本一：接入真实后端

**Step 1** — 两个终端分别跑后端（`npm start`，确认监听 `4001`）和前端（`npm run dev`）。

**Step 2** — 走读 `src/api/client.ts`（`fetchWithAuth` 泛型封装，和 slides 的 `API Service Layer` example 对照讲）和 `src/api/habits.ts`（`fetchHabits`/`checkInHabit`/`loginRequest`/`registerRequest`）。

**Step 3** — `LoginPage.tsx`：改成调用真实的 `/auth/register`、`/auth/login`，把返回的**真实 JWT** 存进 `localStorage`（`auth/session.ts`）。
- **现场演示两个对比效果**：
  1. 注册一个新账号，登录成功，跳转到 `/habits`——这时候习惯列表是空的（因为是全新用户，数据库里没有任何 habit）。这是个很好的教学时刻："上周的 mock 数据到哪去了？没了，因为现在是真正按用户隔离的数据，不再是写死的全局数组。"
  2. 故意输错密码，登录失败，展示错误提示："mock 登录时代，任何用户名都能登录成功，现在有真正的『失败路径』了——这也是接真后端之后代码复杂度必然上升的地方。"

**Step 4** — `habitsSlice.ts`：把 `checkIn` 从 L16 的**同步** reducer 改成 `createAsyncThunk`：
```ts
export const checkIn = createAsyncThunk('habits/checkIn', async (habitId: string) => {
  const { checkIns } = await checkInHabitApi(habitId);
  return { habitId, checkIns };
});
```
- **这是本讲最重要的一个"讲透"点，务必放慢速度**："上周点一下『Check in』，UI 瞬间更新，因为一切都在内存里。现在点一下，要先发一个 HTTP 请求到后端，等后端写数据库，等响应回来，reducer 才会真正更新 state。UI 上可能感觉不出明显延迟，但这不是『重构』，这是**真实世界的行为变化**——网络会抖动，请求可能失败，这些是 L15/L16 完全不用考虑的问题。"
- 现场可以打开浏览器 DevTools 的 Network 面板，点一次"Check in"，让学生看到真实发出的 POST 请求和它的响应。

### 4.6 现场演示脚本二：TypeScript 化

**Step 1** — 展示 `src/types.ts`（`Habit`/`Category`），"先把数据形状定义清楚，这是 TS 项目的地基。"

**Step 2** — 挑 `HabitListItem.jsx` → `.tsx` 现场改一遍（如果时间紧张，可以直接对照已有的 `.tsx` 版本逐段解释，不必真的从头敲）：
- 加 `interface HabitListItemProps { habit: Habit }`。
- 讲一下这里**没有引入**新概念，只是把已经存在的隐式约定写成显式类型。"你会发现大部分组件的 TS 化工作就是这样——不是重新设计，是把脑子里本来就有的假设写下来，让编译器帮你检查。"

**Step 3** — 展示 `src/store/store.ts` 的 `useAppDispatch`/`useAppSelector`（`TypedUseSelectorHook<RootState>`）："这两个是全项目通用的技巧——包一层类型化的 hook，后面所有组件用 `useAppSelector` 时，`state.habits` 的类型是自动推导出来的，不用每次手写。"

**Step 4** — 跑一次 `npx tsc --noEmit`，展示"编译通过 = 类型体系自洽"，如果时间允许，可以故意引入一个类型错误（比如把 `habit.category` 拼错成 `habit.categry`）现场看报错信息，再改回来。

### 4.7 现场演示脚本三：测试先行

> 教学核心：真正按 slides 说的顺序走一遍——**先写测试，再让实现通过测试**，而不是先写实现再补测试。

**Step 1** — 打开 `src/components/HabitListItem.spec.tsx`，先只看第一个测试（渲染测试），跑一下 `npm test`，确认通过，讲解 `screen.getByText`/`toBeInTheDocument` 这类查询方式——"RTL 强调『像用户一样测试』，用户看到的是文本和角色，不是 class 名或者内部实现。"

**Step 2** — 看第二个测试（交互测试），**先讲一个我自己踩过的坑**："我最初写这个测试时，点击『Check in』之后，直接断言这个组件自己重新渲染出了新数据——结果测试失败了。原因是这个组件在测试里是被**单独渲染**的，它只认自己收到的 `habit` prop，点击按钮只会把 action 派发到 store，不会魔法般地让组件自己拿到新 props。真正应该断言的是 **store 里的状态变了**，而不是这个组件自己的 DOM 变了。"
- 这是个很真实、很有价值的"过来人经验"，比任何抽象讲解都有说服力，建议原样讲给学生听。
- 展示修正后的写法：`store.getState().habits.items[0].checkIns` 断言。

**Step 3** — 看 `HabitsLayout.spec.tsx`（异步测试），过一下 `findByText` 和 `getByText` 的区别："`getBy` 要求元素**现在就**存在，`findBy` 会等一等，适合『数据还没回来』的场景——我们这里先断言 Loading 文案存在（`getByText`），再用 `findByText` 等 mock 的 fetch resolve 之后习惯名字出现。"

**Step 4（可选，如果时间充足）** — 真正走一遍"测试先行 + AI 实现"：现场删掉（或注释掉）`checkIn` thunk 的实现，只保留测试文件，让 AI 工具（Copilot / Claude 等）根据测试重新生成实现，然后带学生一起 review 生成的代码是否合理。"这不是走过场，这是你们以后工作中会真的用到的工作流。"

### 4.8 收尾话术

- 运行一次 `npm test` 和 `npm run build`，两者都通过，作为 App B 的最终验收仪式感。
- 回顾整个 App B 的旅程："三周前我们从一个连数据都存不住的路由 demo 开始，中间修了一个『数据不同步』的真实问题，今天变成了一个有真实用户、真实数据库、类型安全、测试保护的完整应用。这条路径——从能跑，到能维护，到能信任——就是你们以后做真实项目会走的路径。"
- 提醒 AI Usage Log 的作业要求，呼应 Ownership 阶段的整体教学理念。
- 展示 slides 的"Course Wrap-Up: The Three Phases"表格，回顾整个课程的三阶段演进（感知期 → 对比期 → 主导期）。

### 4.9 常见学生问题预案

- **"checkIn 从同步变成异步，是不是意味着 L16 的写法是错的？"** → 不是错的，是**适用场景不同**——L16 阶段还没有后端，数据本来就全在内存里，同步 reducer 是完全正确的选择。等到真的需要持久化到服务器，异步 thunk 才是必要的。工程决策要看当时的真实约束，不存在脱离场景的"更好的写法"。
- **"前端定义的 `Habit` 类型要手动和后端的返回值保持一致，感觉很容易出错、维护成本很高？"** → 完全正确，这是真实痛点。更大的项目通常会用 OpenAPI/Swagger 或者 GraphQL 的代码生成工具，从后端的接口定义自动生成前端类型（可以提一下仓库里 `sample_code/graphql-demo` 就是这种自动化生成类型的例子），今天这种手写 interface 的方式适合教学阶段和小项目，规模变大之后要考虑自动化。
- **"为什么后端的密码用 bcrypt 哈希，但 L11 的例子是明文比较，这不是前后矛盾吗？"** → 不矛盾，L11 的重点是先把"JWT 认证流程"本身讲清楚，为了减少认知负担暂时简化了密码存储这一环；这里的注册功能是全新写的代码，没有历史包袱，就直接用正确做法。学习路径上允许分阶段引入复杂度，但要明确告诉学生"这一步是简化的，实际项目不要照抄"。

---

## 五、三讲结束后的自查清单

- [ ] 学生是否能说清楚"为什么 `/stats` 在 L15 阶段拿不到 `/habits` 的最新数据"，以及 Redux 具体是怎么解决这个问题的？
- [ ] 学生是否能现场解释一遍"如果 `.map` 无脑给每个元素都创建新对象，`React.memo` 为什么会失效"？
- [ ] 学生是否能说出 Immer 让 `checkIn` reducer"看起来像修改却是不可变更新"的原理，并联系到它为什么天然保持了未变化项目的引用稳定？
- [ ] 学生是否能说清楚 Redux 和 Context 在 StreakUp 里分别管理什么、为什么这么分工？
- [ ] 学生是否理解 `checkIn` 从同步 reducer 变成异步 thunk 不是"语法升级"而是"真实网络行为"带来的必然变化？
- [ ] 学生是否能解释"为什么测试 `HabitListItem` 的交互行为时，应该断言 store 状态而不是组件自身的 DOM"？
- [ ] 是否明确告知学生：作业（GitHub User List + Router / Todo List + Redux / Todo List 全栈整合系列）和课堂 StreakUp 是不同的应用，方法要自己迁移，不能直接抄课堂代码。
