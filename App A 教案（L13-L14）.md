# App A 个人教案：PodWave 音频播放器（L13 + L14）

> **仅供个人授课备课使用，不对外发布。** 配合 `pre_slides/lecture13.md`、`pre_slides/lecture14.md`（投影用 slides）和 `sample_code/lecture13/audio-player`、`sample_code/lecture14/audio-player`（最终代码）一起使用。设计背景见 `前端贯穿式项目设计方案.md`。
>
> 本教案的用法：slides 负责"讲概念"，这份教案负责"怎么讲、什么时候切到代码、代码要怎么一步步敲出来、哪里容易讲跑题或学生容易卡住"。时间是相对分配（以 100% 总时长为基准换算成分钟示例，按实际课时等比缩放即可）。

---

## 零、两讲总览

| | L13 | L14 |
|---|---|---|
| 主题 | Side Effects, Refs & Data Fetching | Custom Hooks & Component Composition |
| App A 阶段 | v0.1：从零搭建播放器 | v0.2：重构播放器 |
| 代码起点 | 空白 Vite 项目 | `sample_code/lecture13/audio-player`（上一讲结束时的代码） |
| 代码终点 | `sample_code/lecture13/audio-player`（最终版） | `sample_code/lecture14/audio-player`（最终版，App A 到此退役） |
| 核心教学动作 | **现场从零搭建**（build-up） | **现场重构**（refactor，对比 before/after） |
| 这两讲之后 | — | L15 开始全新的 App B，App A 不再出现 |

**贯穿两讲的教学策略**：L13 的"搭建"和 L14 的"重构"要形成强烈对比——L13 结束时，Player 组件是一个又长又杂的"大杂烩"组件（这是刻意的，不用提前优化）；L14 一开场就重新打开这个"大杂烩"组件，让学生真实地感受到"这代码有点乱"，再引出自定义 Hook 和组合模式作为"整理"的手段。**不要在 L13 就把代码写得很干净**，否则 L14 的重构会失去说服力。

---

## 一、课前准备清单（两讲通用）

- [ ] **网络依赖检查**：App A 的音频（SoundHelix）和封面图（Picsum）都是外链资源。上课前务必在教室网络环境下实际打开一次 `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3` 和 `https://picsum.photos/seed/podwave-1/300/300`，确认没有被防火墙/代理拦截。
  - **应急预案**：如果当天网络不稳定，提前把 4-5 个 mp3 文件下载到本地 `public/audio/` 作为 fallback，`tracks.js` 里的 `audioUrl` 改成本地相对路径 `/audio/track1.mp3`。不需要在课堂上现场解释这个 fallback，只是保证演示不翻车。
- [ ] **`<audio>` 自动播放策略**：现代浏览器要求"用户手势"（点击）之后才能调用 `.play()`。确保演示脚本里第一次播放一定是点击 Play 按钮触发的，不要在 `useEffect` 里自动 `.play()`，否则会在浏览器里报错、控制台一堆红字，容易慌。
- [ ] **提前跑通一遍最终代码**：开课前用 `sample_code/lecture13/audio-player`（L13）和 `sample_code/lecture14/audio-player`（L14）各自 `npm install && npm run dev` 跑一遍，确认没有因为依赖版本漂移导致的问题。
- [ ] **准备"检查点"提交**：如果打算现场敲代码（推荐），提前把过程拆成 git commit（见下方每步的"检查点"标记），这样一旦中途敲错、思路乱了，可以直接 `git checkout` 到某个检查点继续讲，而不用当场调半天 bug 尴尬冷场。
- [ ] **决定演示方式**：两种都可行，按自己临场感觉选：
  - **现场手敲**（更有感染力，但耗时更长、风险更高）
  - **提前写好 + 现场逐段注释掉/取消注释来"还原"过程**（更稳，推荐给不熟悉现场编码节奏的场次）

---

## 二、Lecture 13：Side Effects, Refs & Data Fetching（v0.1 从零搭建）

### 2.1 时间分配建议（总时长按 100% 计，自行套课时）

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 8% | 开场 + Topics 预告 + App A 介绍 | 讲台 |
| 8% | `useEffect` 是什么、依赖数组基础 | slides + 小片段 |
| 6% | 清理函数（cleanup） | slides |
| 8% | 常见陷阱（漏依赖、对象依赖、死循环） | slides + 现场"写崩一次" |
| 12% | `useRef` 两种用法 + Refs vs State | slides（先不碰 App A） |
| 8% | 受控组件 | slides |
| 10% | 数据获取模式 + AbortController | slides |
| **35%** | **现场搭建 PodWave v0.1** | **代码（核心环节）** |
| 5% | Class↔Hooks 心智模型 + Summary + 收尾 | slides |

> 现场搭建环节占比最大，是整讲的重心。前面的 slides 部分尽量控制在预告性质，把"深入细节"留到写代码时结合真实场景讲，避免同一个知识点讲两遍（一遍抽象一遍具体）浪费时间。

### 2.2 开场话术要点

- 不要一上来就讲 `useEffect` 的语法。先说："从今天开始，接下来两节课我们会一起搭一个真实的小项目——一个音频播放器，代号 PodWave。这两节课学的所有新概念，都会直接用在这个项目里，而不是散的小例子。"
- 明确交代终点感："今天下课时，你会有一个能选歌、能播放、能拖进度条调音量的播放器。听起来是不是比看 10 个孤立的代码片段更有成就感？"
- 快速过一遍 Topics（幻灯片已有），强调"`useEffect` 和数据获取是今天的重头戏，`useRef` 会在播放器里有一个特别典型的用法"。

### 2.3 概念铺垫环节讲法要点（对应 slides 已有内容，不重复贴代码，只列教学要点）

- **`useEffect` 是什么**：强调"副作用 = 逃出 React 渲染循环去跟外部世界打交道"，举例时可以先卖个关子："等下我们会打交道的外部世界，就是浏览器原生的 `<audio>` 标签"。
- **依赖数组三种模式**：这里用 slides 自带的小例子（`document.title`、`console.log`）过一遍机制即可，不需要现场敲。讲完立刻承接一句："这三种模式，待会儿播放器里全都会用到——加载新歌曲时用 `[track.id]`、监听播放事件用一次性订阅、音量变化用 `[volume]`。"（提前埋伏笔，降低后面代码的理解成本）
- **Cleanup 函数**：举 `setInterval`/`clearInterval` 的例子后，明确说："播放器里我们会用 `addEventListener`/`removeEventListener` 而不是定时器，但道理完全一样——订阅了什么，就要在清理函数里取消订阅什么。"
- **常见陷阱（重点，容易反复出现在面试/debug 里）**：
  - 漏依赖：现场演示一次，故意在一个临时的 demo 组件里写 `useEffect(() => { document.title = count }, [])`，然后点击按钮，展示 title 不更新——"这就是 ESLint 会警告你的 missing dependency"。
  - 对象/数组依赖导致死循环：这个概念比较抽象，建议直接现场打开浏览器 DevTools 的 Console，写一个最小复现（新建一个临时 scratch 文件或用浏览器 console 都行），让学生亲眼看到无限循环时 Console 疯狂刷屏、页面卡死的样子，比讲道理有效十倍。记得演示完要刷新页面。
- **`useRef` 两种用法**：先讲抽象概念（DOM 访问、不触发渲染的可变值），**先不要提播放器**，把"黄金案例"留到写代码时再揭晓，制造一点悬念。
- **受控组件**：`LoginForm` 例子过一遍即可，说明"待会儿播放器的进度条和音量滑块，本质上也是受控组件，只是 `value` 和 `onChange` 绑定的不是普通状态，而是要同步回 DOM"。
- **数据获取模式 + AbortController**：这是最后一块拼图，过完这块直接说"好，材料都齐了，我们现在开始搭"。

### 2.4 现场搭建脚本（核心环节，逐步骤）

> 每一步后面标注对应最终代码里的文件，方便你现场核对/复制。建议每完成一步就 `git add -A && git commit -m "step N"`，作为检查点。

**Step 0 — 项目骨架**
- `npm create vite@latest audio-player -- --template react`，清空默认的 `App.jsx` 只留一个 `<h1>PodWave</h1>`，跑起来，确认能看到页面。
- 讲解一句："这一步大家在 L12 已经很熟了，不多停留。"

**Step 1 — Mock 数据先行**
- 新建 `src/data/tracks.js`，直接贴入 4 首歌的数组（对应最终版 `tracks.js` 的前 4 条，先不加第 5 条"损坏数据"——那是留给 L14 的伏笔）。
- 讲解音频/封面来源："音频用 SoundHelix 的公开测试文件，封面用 Picsum 占位图服务，都是外链，不用担心版权和打包体积。"

**Step 2 — 静态列表渲染（复习，不停留）**
- 写一个最简单的 `TrackList`，先不带点击交互，只是 `tracks.map` 渲染出封面+标题。这是 L12 列表渲染的复习，一带而过，目的是先有个"骨架"看得见。

**Step 3 — 引入数据获取模式（这是今天真正的新内容开始）**
- 把 `tracks.js` 的静态数组包一层"模拟网络请求"：新建 `src/api/fetchTracks.js`，用 `setTimeout` 包一个 Promise（对应最终版 `fetchTracks.js`，先不加 `signal`/`AbortController` 部分）。
- 在 `App.jsx` 里用 `useState`（`tracks`/`loading`/`error`）+ `useEffect` 调用它，展示 loading 文案。
- **现场提问互动点**："如果这里的依赖数组不写会怎样？"——可以现场故意去掉 `[]`，打开 Console 观察请求被反复触发，验证"忘记加依赖数组导致无限请求"，呼应刚才讲的陷阱，趁热打铁。记得演示完改回来。

**Step 4 — 加上 AbortController**
- 现在给 `fetchTracks` 加 `signal` 参数（对应最终版实现），`App.jsx` 的 `useEffect` 里创建 `AbortController`，`return () => controller.abort()`。
- 讲解点："这个例子里数据其实秒回，你不太容易『看到』取消生效。但想象一下真实场景——用户快速切换页面，如果不取消，组件卸载后 `setState` 还是会被调用，React 会警告你内存泄漏。这个模式请当作肌肉记忆背下来。"

**Step 5 — Player 组件登场，`useRef` 黄金案例**
- 新建 `src/components/Player.jsx`。先写最简单的一版：`<audio ref={audioRef} src={track.audioUrl} />` + 一个 Play/Pause 按钮，`audioRef.current.play()`/`.pause()`。
- **这是全讲的高光时刻，放慢速度讲**："注意，我们没有用 `useState` 来控制播放——因为『播放』这个动作，本质上是在调用 `<audio>` 这个原生 DOM 元素身上的方法，不是在改变要渲染的内容。这就是 `useRef` 存在的意义：有些操作，`useState` 根本做不到，因为它们不是『改变数据』，而是『直接命令一个 DOM 元素做事』。"
- 对照 Refs vs State 表格，回到这一刻再讲一遍会比之前抽象讲更有共鸣："现在回头看这张表，是不是更好理解了？"

**Step 6 — 进度条与时间显示**
- 加 `currentTime`/`duration` 的 `useState`，用 `useEffect` 订阅 `<audio>` 的 `timeupdate`/`loadedmetadata`/`ended` 原生事件，别忘了 cleanup 里 `removeEventListener`。
- 呼应 cleanup 小节："这里如果不清理监听器，每次切歌重新订阅，旧的监听器会越攒越多——这就是内存泄漏在真实项目里的样子，不是危言耸听。"

**Step 7 — 受控进度条 + 音量滑块**
- 加 `<input type="range">` 做进度条，`onChange` 里同时 `setCurrentTime` 和 `audioRef.current.currentTime = ...`。
- 加音量滑块，`useState` + `useEffect` 把 `volume` 状态写回 `audio.volume`。
- 讲解点：回到"受控组件"概念——"这两个滑块的 `value` 完全由 React state 决定，用户拖动只是触发 `onChange` 去更新 state，UI 是 state 的镜像，这跟登录表单的输入框是同一个原理。"

**Step 8 — 切歌联动**
- 把 `currentTrackId` 提升到 `App.jsx`，`TrackList` 点击时通过回调更新它，`Player` 拿到新 `track` prop。
- 在 `Player.jsx` 里加一个 `useEffect(() => { audio.load(); setCurrentTime(0); setIsPlaying(false); }, [track.id])`。
- **提问互动点**："这里依赖数组为什么是 `[track.id]` 而不是 `[track]`？"——引导学生想到"对象引用每次渲染都不同"的陷阱，检验前面讲的知识点是否真的吸收了。

**Step 9 — 收尾展示**
- 完整跑一遍：加载 → 选歌 → 播放 → 拖进度条 → 调音量 → 切歌。
- 现场对照最终代码 `sample_code/lecture13/audio-player`，如果现场敲的版本和最终版有出入，简单说明差异即可，不必强求逐行一致。

### 2.5 常见学生问题预案

- **"为什么不用 `useState` 保存 `<audio>` 元素本身？"** → 因为 `useState` 触发重渲染，而我们不需要"元素本身"参与渲染决策，只需要一个稳定的引用去调用它的方法；用 `useState` 存 DOM 节点是常见的反模式，可以顺带提一句。
- **"`audio.currentTime = ...` 和 `setCurrentTime(...)` 为什么要同时写？"** → 前者是命令真实的 `<audio>` 元素跳转播放位置（副作用），后者是让 React 知道『现在显示的进度』该更新成什么（渲染数据），两者服务的对象不同，缺一个都不对。
- **"如果不用 `key={track.id}` 直接用 `track`，重渲染时依赖数组会一直变化吗？"** → 是的，这是很好的引子，可以留到 L14 或者直接现场用 `console.log` 证明两次渲染的 `track` 对象引用不同（哪怕内容一样）。

---

## 三、Lecture 14：Custom Hooks & Component Composition（v0.2 现场重构）

### 3.1 时间分配建议

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 5% | 开场 + 回顾 L13 代码"这里有点乱" | 讲台 + 打开上节课代码 |
| 8% | Why Custom Hooks + `useFetch` 通用例子 | slides |
| **25%** | **现场重构：抽取 `useAudioPlayer`** | **代码** |
| 5% | Custom Hook 使用规则 | slides |
| 10% | 组合模式：`children` | slides |
| **25%** | **现场重构：拆分 `PlayerShell`/`AlbumArt`/`TrackInfo`/`PlayerControls`** | **代码** |
| 8% | 具名插槽（仅概念，不现场实现）+ 组合 vs 继承 | slides |
| **10%** | **Error Boundary 现场演示（先崩溃、再兜底）** | **代码** |
| 4% | Mini Mock 提醒 + Summary + 承上启下（App A 退役，预告 App B） | 讲台 |

### 3.2 开场话术要点

- 打开上节课写完的 `Player.jsx`，**不要提前美化它**，直接投影出来说："这是我们上周写完的播放器组件，功能都对，但请诚实地看一眼——这一个文件里，有 DOM 引用、有四个 state、有三个 `useEffect`、还有事件处理函数和 JSX。如果你是团队里另一个同事，接手这个文件是什么感觉？"
- 让学生先说说"乱在哪"，引导出两个方向：① 状态和副作用逻辑能不能搬走？② JSX 里揉在一起的『封面+文字+控制条』能不能拆开？——这两个方向正好对应今天的两个新知识点（自定义 Hook / 组合模式）。

### 3.3 概念铺垫讲法要点

- **Why Custom Hooks**：用 slides 的通用例子（两个组件重复 `useState`+`useEffect` 拉数据）讲完后，明确点出："我们的播放器不是这种情况——`useAudioPlayer` 现在只有一个组件在用，不存在『重复代码』。但自定义 Hook 还有第二个价值：**把逻辑从组件里搬出去，让组件只负责渲染**。这个价值和『复用』一样重要，甚至更常见。"（这一点在教案设计阶段已经确认，务必讲清楚，避免学生死板地认为"自定义 Hook = 必须被多处调用"）
- **Custom Hook 命名规则**：过一下即可，提醒 `use` 前缀是给 ESLint/React 识别 Hook 规则用的，不是纯粹的命名习惯。

### 3.4 现场重构脚本一：抽取 `useAudioPlayer`

> 教学核心：**逐段搬运代码，而不是重写**。让学生看到"重构"是把已经工作的代码原样移动到新位置，配合最小的接口调整，而不是凭空重新发明。

**Step 1** — 新建 `src/hooks/useAudioPlayer.js`，函数签名 `export default function useAudioPlayer(track) { ... }`。

**Step 2** — 把 `Player.jsx` 里的 `audioRef` 声明、四个 `useState`、三个 `useEffect`、`togglePlay`、`handleSeek`（重命名成 `seek`，参数从 event 改成直接传数值——顺带讲一句"这样这个 Hook 就不用知道调用者用的是 `<input type="range">` 还是别的什么 UI"）**整段剪切粘贴**到新文件里。

**Step 3** — 在文件末尾 `return { audioRef, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume }`。

**Step 4** — 回到 `Player.jsx`，删掉刚才搬走的所有内容，改成一行：
```jsx
const { audioRef, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume } = useAudioPlayer(track);
```

**Step 5** — 对比 before/after 行数，让学生直观感受"组件变薄了"。**提问互动点**："这个 Hook 里的代码，和上周比，一行逻辑都没变，对吧？我们只是把它挪了个地方——这就是重构的精髓：行为不变，结构变好。"

**Step 6** — 跑起来，验证功能和上周完全一致（这一步很重要，要让学生看到"重构没有引入新 bug"）。

### 3.5 现场重构脚本二：组合拆分

**Step 1** — 先讲 `children` 组合概念（slides 的 `Card` 例子），再回到 `Player.jsx`。

**Step 2** — 新建 `PlayerShell.jsx`：
```jsx
export default function PlayerShell({ children }) {
  return <div className="player">{children}</div>;
}
```
讲解点："这个组件完全不知道自己在装一个播放器——它可以装任何东西。这才是`children`组合的价值：容器和内容解耦。"

**Step 3** — 依次拆出 `AlbumArt.jsx`（封面图）、`TrackInfo.jsx`（标题+艺人，**先不加 tags**，这个留到 Error Boundary 环节再加）、`PlayerControls.jsx`（播放按钮+进度条+音量条，作为纯展示组件，所有数据通过 props 传入，不直接调用 `useAudioPlayer`）。
- 讲解 `PlayerControls` 时强调："它不知道 `useAudioPlayer` 的存在，只认识 `onTogglePlay`、`onSeek` 这些回调 props——这样它以后可以脱离音频播放器，复用在任何『带播放控制』的场景里（比如视频播放器）。"

**Step 4** — `Player.jsx` 变成纯粹的"装配车间"：
```jsx
return (
  <PlayerShell>
    <audio ref={audioRef} src={track.audioUrl} preload="metadata" />
    <AlbumArt track={track} />
    <TrackInfo track={track} />
    <PlayerControls {...} />
  </PlayerShell>
);
```

**Step 5** — 讲具名插槽（Named Slots）概念时，明确交代："我们这里没有用具名插槽——`PlayerShell` 只有一个内容区，用 `children` 就够了。具名插槽是给『有多个可定制区域』的组件用的，比如 L12 作业里的 Layout（Header/Nav/Main/Aside/Footer）就是典型场景，可以现场对照回顾。"（不要现场强行给播放器加具名插槽，会显得刻意，前面设计阶段已经明确过这一点）

**Step 6** — 组合 vs 继承：直接引用 slides 的 Meta 例子过一下即可，不需要在播放器里额外演示（播放器里没有继承的反例可以对比）。

### 3.6 Error Boundary 现场演示脚本（建议作为全讲第二个高光时刻）

> 教学核心：**先让它崩溃，再讲怎么兜底**。不要一上来就展示"包了 ErrorBoundary 之后没崩溃"，那样学生感受不到 Error Boundary 解决的问题有多真实。

**Step 1 — 埋雷**：在 `TrackList` 数据里加第 5 条数据，故意不写 `tags` 字段（对应最终版 `tracks.js` 里的 "Corrupted Entry (demo)"）。

**Step 2 — 让 `TrackInfo` 使用这个字段**：
```jsx
<p className="player__tags">
  {track.tags.map((tag) => <span key={tag}>{tag}</span>)}
</p>
```
**不加任何防御性判断**。

**Step 3 — 现场点开第 5 首歌，让它真的崩溃**：白屏或者 React 报错边界提示。**停顿几秒，让学生看看这个画面**："这在生产环境里发生会怎样？用户会看到一片空白，然后关掉你的网站。"

**Step 4 — 引入 Error Boundary**：新建 `PlayerErrorBoundary.jsx`（贴 slides 里的通用模板，改一下 fallback 文案），包裹 `<Player>`。

**Step 5 — 再点一次第 5 首歌**：这次显示 fallback UI 而不是白屏。对比刚才的画面，效果立竿见影。

**Step 6 — 讲边界条件（容易被问到，务必主动讲清楚，不要等学生问）**：
- **"如果我把这首歌的 `audioUrl` 改成一个错误的链接（比如 404），Error Boundary 会捕获吗？"** —— 现场可以真的改一个坏链接试一次，展示**并不会**触发 fallback，只会在 Network 面板看到请求失败、Console 有警告，但页面照常渲染（只是播放不出声音）。讲清楚原因："Error Boundary 只捕获『渲染期间』抛出的 JS 异常——组件的 `constructor`、`render`、生命周期方法里的报错。资源加载失败（图片 404、音频 404、`fetch` 失败）不是渲染错误，而是异步事件，Error Boundary 天生管不到，需要用 `<audio>` 自己的 `onError` 事件或者数据获取时的 `try/catch` 单独处理。"
- **"为什么 `PlayerErrorBoundary` 上要写 `key={currentTrack.id}`？"** —— 如果不写这个 key，切换到别的正常歌曲后，Error Boundary 的 `hasError` 状态不会自动重置（React 不会重新挂载它），会一直卡在 fallback 画面。加 `key` 是让 React 在 track 变化时把整个 boundary 连同它的 state 一起换掉。可以现场去掉 `key` 试一次给学生看错误的效果，再加回来对比。

### 3.7 收尾话术

- 回顾今天做的两件事："逻辑搬家（自定义 Hook）+ 结构拆分（组合模式）+ 兜底安全网（Error Boundary）——这三件事合在一起，就是『把一个能跑的组件，变成一个专业的、能维护的组件』的完整过程。"
- **App A 正式退役的仪式感**："PodWave 到今天就完成使命了。下周开始，我们会搭一个全新的项目——一个多页面的习惯打卡应用，用来学路由、性能优化和状态管理。今天学的 Hook 和组合思维，会在新项目里反复用到，只是换了一个场景。"
- 提醒 Mini Mock #3（如 slides 所述）。

### 3.8 常见学生问题预案

- **"自定义 Hook 里可以调用另一个自定义 Hook 吗？"** → 可以，`useAudioPlayer` 内部调用的都是内置 Hook，但完全可以在里面再调用别的自定义 Hook，只要遵守 Hook 调用规则（顶层调用、不在条件/循环里）。
- **"`PlayerControls` 完全不调用 `useAudioPlayer`，那它还算不算『用到』这个 Hook？"** → 不算，这正是重点：把"状态从哪来"和"怎么展示"分开，`PlayerControls` 只关心展示，谁负责状态是 `Player.jsx` 的事，这是关注点分离的体现。
- **"是不是所有组件都应该拆成这么小？"** → 不是，见好就收——`AlbumArt` 拆出来主要是为了讲清楚组合模式，实际项目里像这种一行的展示逻辑，团队里可能会视情况决定是否值得单独拆文件。

---

## 四、两讲结束后的自查清单

- [ ] 学生是否能口头解释"为什么播放器要用 `useRef` 而不是 `useState` 控制播放"？
- [ ] 学生是否能指出 `useAudioPlayer` 里哪些代码是从 `Player.jsx` 原样搬过去的？
- [ ] 学生是否能说出 Error Boundary 和"资源加载失败"的区别（这是最容易被误解的点，值得在 Mini Mock 里出一道题验证）？
- [ ] 是否明确告知学生：作业（GitHub User List / Todo List 系列）和课堂 PodWave 是不同的应用，方法要自己迁移，不能直接抄课堂代码。
