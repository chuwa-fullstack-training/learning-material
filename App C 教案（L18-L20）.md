# App C 个人教案：ReelTalk 影视评论平台（L18 + L19 + L20）

> **仅供个人授课备课使用，不对外发布。** 配合 `pre_slides/lecture18.md`、`lecture19.md`、`lecture20.md`（投影用 slides）和 `sample_code/lecture18/`、`lecture19/`、`lecture20/` 下的 `reeltalk`（前端）、`reeltalk-api`（后端）、`reeltalk-ssr`（L19 起的独立 SSR 服务）一起使用。设计背景见 `前端贯穿式项目设计方案.md`。
>
> 用法同 App A/B 教案：slides 负责"讲概念"，这份教案负责"怎么讲、什么时候切到代码、哪里现场改、哪里容易讲跑题或学生容易卡住"。时间是相对分配（以 100% 总时长为基准换算成分钟示例，按实际课时等比缩放即可）。

---

## 零、三讲总览

| | L18 | L19 | L20 |
|---|---|---|---|
| 主题 | GraphQL | 渲染策略、RSC 概念与样式工程化 | SSE 与 WebSocket |
| App C 阶段 | v0.1：GraphQL 数据层 | v0.2：SSR + 样式重构 | v0.3：实时特性 |
| 代码起点 | 全新 `reeltalk` + `reeltalk-api` | 续 `lecture18`，新增独立 `reeltalk-ssr` | 续 `lecture19` |
| 代码终点 | `lecture18/reeltalk` + `reeltalk-api` | `lecture19/`（前端加样式、后端不变、新增 SSR 服务） | `lecture20/`（App C 收官，也是整个前端阶段终点） |
| 核心教学动作 | **走读数据层 + N+1"先慢后快"现场改** | **走读手写 SSR + 现场重构样式（加主题）** | **现场演示两种实时传输 + 手写还原 subscription** |
| 这三讲之后 | — | — | App C 完结，整个 React/前端阶段结束 |

**贯穿三讲的统一暗线（务必在 L18 开头就点明，并在每讲收尾回扣）**：这三讲不像 App A/B 那样靠"留一个缺口"串联，而是靠一条主题——**"把上层抽象拆开，看它底下到底替你做了什么"**：
- **L18**：DataLoader 揭开"一次批量查询 vs N 次单查"，`cache.modify` 揭开"精确更新 vs 无脑 refetch"。
- **L19**：手写 SSR 里那一步"把数据序列化进 HTML、客户端再解析"（`__INITIAL_DATA__`），正是 RSC 想帮你省掉的成本——学生先亲手做一遍，才懂 RSC 的价值。
- **L20**：把 L18 用 GraphQL Subscription 实现的"影评实时推送"用裸 WebSocket 重写一遍，暴露 graphql-ws 替你做的连接管理 / 订阅范围过滤 / 序列化 / 打 `__typename`。

> 换句话说：App A/B 教的是"怎么用"，App C 更进一步教"用的东西底下是什么"。这是给已经进入 Ownership 阶段、能大胆用 AI 的学生准备的——他们更需要的是"看穿抽象"的能力，而不是又一个 CRUD。

**和 A/B 的另一个结构差异**：App C 的后端在**三讲全程都要开着**（A 是纯前端，B 只有 L17 才接后端）。每讲都是"两个终端起步"（后端 + 前端），务必形成肌肉记忆。

---

## 一、课前准备清单

### 三讲通用

- [ ] **两个终端提前开好**：一个跑 `reeltalk-api`（`npm start`，端口 4002），一个跑 `reeltalk`（`npm run dev`，端口 5173）。App C 全程前后端联动，不像 App A 那样纯前端。
- [ ] **提前 `npm install` 三个/四个项目**：`reeltalk-api`、`reeltalk`（L19 起还有 `reeltalk-ssr`）。首次装依赖有点慢，别在课堂上现装。
- [ ] **网络依赖检查**：海报图用 Picsum（`https://picsum.photos/seed/reeltalk-m1/300/450`），slides 里 L18 保留的旧 GraphQL 示意图用的是 imgur 外链，L19/L20 的 Mermaid 图经 kroki.io 渲染。上课环境如果墙了这些，slides 里的图会裂、demo 里的海报会不显示（但不影响功能逻辑）。提前在教室网络验证一次。
- [ ] **数据是相对"今天"生成的**：`reeltalk-api/src/data/reviews.js` 的 `createdAt` 用 `daysAgoIso(n)` 基于当天算，所以影评时间戳无论哪天上课都"看起来是最近的"，不用手动改。
- [ ] **决定演示方式**：App C 的后端**不建议现场从零手敲**（Apollo Server + graphql-ws + resolver 一大坨，敲不完）。推荐"走读已写好的代码 + 在关键处做小段现场改"（比如 N+1 那一处替换、`__typename` 那一处故意删掉再补）。前端的小组件可以现场敲，但整体也偏走读。这点和 A/B 的"从零 build-up"不同，开课前想清楚自己走读的节奏。
- [ ] **AI 使用标签**：L18-L20 都是 🟢（Ownership 阶段，鼓励用 AI）。这三讲是原三阶段模型（L1-L17）之后的延伸，slides 开头都标了 🟢，开场可以顺一句"这几讲的代码你都可以让 AI 写，重点是能讲清楚它底下在干嘛"。

### L18 专属

- [ ] **确认 GraphQL 定位**：slides 保留了原 `graphql.md` 的全部概念内容（query/mutation/subscription/schema/resolver）+ 新增的分页/N+1/缓存。如果学生此前完全没接触过 GraphQL，概念部分要讲实；如果已经在别处见过，概念部分快速过，把时间留给新增的三块。**开课前先判断学生底子**，决定概念部分的详略。
- [ ] **打开后端终端并留在视野里**：N+1 演示的关键证据是后端控制台的日志（`[DataLoader] batched ...` vs 一堆单查）。确保投影时后端终端可见。
- [ ] **装好 Apollo DevTools（可选）**：想展示 Apollo 缓存内容时有用，但不是必需。

### L19 专属

- [ ] **`reeltalk-ssr` 要单独 `npm install` 并跑一遍**：`npm start` 会先用 esbuild 打包客户端 hydration 脚本再起 Express（端口 4003）。提前确认 `curl http://localhost:4003/movies/m1` 拿到的 HTML 里**已经包含**电影信息和评论（这是"真 SSR"的核心证据，现场要 curl 给学生看）。
- [ ] **准备好演示 hydration 的方式**：可以打开浏览器 DevTools，在 Network 里禁用 JS 或看 `view-source:`，对比"源码 HTML 已填满" vs "普通 CSR 的源码只有一个空 div"。这个对比是 SSR 教学的高光。
- [ ] **主题切换 demo 预演**：`reeltalk`（L19 版）导航栏有暗/亮主题切换按钮，切换时开着 DevTools 的 Elements 面板，让学生看到**只有 `<html data-theme>` 这一个属性在变**，没有组件重渲染——这是"CSS 变量主题化"的关键卖点。

### L20 专属（实时特性，风险点最多）

- [ ] **提前跑一遍 SSE**：`curl -N http://localhost:4002/movies/m2/summary`，确认逐词往外蹦 `data: ...`。现场也可以直接 curl 给学生看"原始 SSE 流长什么样"。
- [ ] **提前演练"两个标签页"的 WebSocket demo**：开两个标签页看同一部电影，在 B 页发影评，A 页（没提交任何东西）应该通过裸 WS 收到推送、影评数和平均分同步更新。这是 L20 的高光，务必提前跑顺。
- [ ] **知道那个 `__typename` 坑**：裸 WS 传来的是纯 JSON、没有 `__typename`，直接喂给 `cache.writeFragment` 会抛错。最终代码里 `useReviewSocket.js` 已经手动补了 `{ __typename: 'Review', ...review }`。**这个坑本身是绝佳教学素材**——可以现场故意把它删掉，让报错发生，再补回来（详见 L20 脚本）。
- [ ] **确认端口没占用**：4002（api，含裸 WS `/ws/reviews` 和 SSE）、5173（前端）。

---

## 二、Lecture 18：GraphQL（v0.1 数据层）

### 2.1 时间分配建议

> 前提：概念部分详略取决于学生底子（见课前清单）。下表按"学生此前见过一点 GraphQL、概念可以偏快"来分配；如果是零基础，把概念那几块整体上调、压缩后面。

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 5% | 开场 + App C 介绍 + 点明"看穿抽象"这条暗线 | 讲台 |
| 15% | GraphQL 是什么 / vs REST / query·mutation·subscription / schema·resolver | slides（概念，快过） |
| 10% | 游标分页（Relay connection 结构） | slides + 走读 `reeltalk-api` |
| **18%** | **N+1 问题 → DataLoader（先慢后快现场改）** | **代码（高光）** |
| 12% | Apollo Client：useQuery + fetchMore 分页 | slides + 走读前端 |
| **15%** | **精确缓存更新：cache.modify vs refetchQueries** | **代码（含那个字段顺序的坑）** |
| 15% | mutation + subscription 实时影评（跑通完整 app） | 走读 + 现场演示 |
| 10% | Summary + 回扣暗线 + 预告 L19 | 讲台 |

> 这一讲信息密度全 App C 最高。**最大的风险是概念部分讲太久、把 N+1 和缓存两个高光挤没了。** 概念能快就快，把现场时间留给两个"揭开抽象"的环节。

### 2.2 开场话术要点

- 介绍 App C 和它与前两个 app 的关系："前面 PodWave、StreakUp 我们从零搭、学怎么用 React。接下来这个影评平台 ReelTalk，我们换个视角——不只是用，而是每一讲都把一层上层抽象拆开，看它底下替你做了什么。今天从数据层开始。"
- 明确"这是 Ownership 阶段的延伸"："这几讲的代码你完全可以让 AI 帮你写，我也不打算在这儿从零敲一个 GraphQL 服务器给你们看——那没意义。重点是：AI 给你生成的这些东西，底下到底在干嘛，你能不能讲清楚。"
- 给终点感："今天下课，你会有一个能分页浏览电影、发影评、影评还能实时刷新的应用。而且你会知道为什么它不会在电影列表页把数据库查爆——这就是今天第一个要拆开的抽象。"

### 2.3 概念铺垫讲法要点（概念部分快过，只列提醒）

- **GraphQL vs REST**：slides 里有对比表和 over/under-fetching 的例子，过一遍即可。一句话点题："一个端点、要什么给什么。"
- **query/mutation/subscription**：三种操作对应"读 / 写 / 实时订阅"。这里标注一句"subscription 底层是 WebSocket，今天先用它，L20 会把它拆开重写"——**提前给 L20 埋钩子**。
- **schema / resolver / context**：走读 `reeltalk-api/src/schema/typeDefs.js` 和 `resolvers/index.js`，指出 schema 是契约、resolver 是每个字段怎么取数、context 是每个请求共享的东西（马上要用来放 DataLoader）。
- **不要在概念上恋战**：如果发现讲超时了，subscription 的概念可以只点到、把演示留到 2.6 跑 app 时再看。

### 2.4 现场环节一：游标分页

- 走读 `reeltalk-api/src/resolvers/index.js` 的 `Query.movies`：`after` 是"你已经有的最后一部电影的游标"，`first` 是"再要几部"。返回 `edges`/`node`/`pageInfo` 的 Relay 结构。
- **对比着讲为什么不用 `offset/limit`**："如果用页码/偏移量，中间插入或删除一部电影，后面所有人的分页都会错位一格。游标是钉在具体某条记录上的，不受影响。"
- 前端侧留到 2.5（useQuery + fetchMore）一起演示"加载更多"。

### 2.5 现场环节二：N+1 → DataLoader（本讲高光，先慢后快）

> 教学核心：和 App A 的 Error Boundary、App B 的 memo 一样，**先制造问题、亲眼看到它，再修**。

**Step 1 — 先看现状（已经是修好的版本）**：`reeltalk-api/src/resolvers/index.js` 里 `Movie.reviewStats` 现在用的是 `context.reviewStatsLoader.load(movie.id)`。先别解释 DataLoader，先跑前端，浏览电影列表，让学生看后端控制台——每翻一页只打一行 `[DataLoader] batched reviewStats for N movies in ONE call`。

**Step 2 — 故意退回低效版本**：打开 `resolvers/reviewStatsLoader.js`，里面保留了一个 `reviewStatsNaive()`（专门为这个演示留的，平时不接）。把 `Movie.reviewStats` 现场改成调用 `reviewStatsNaive(movie.id)`，重启后端，再翻一次列表页。
- **现在后端控制台会刷出一堆** `[naive] queried reviews for movie mX (query #N)`——一页 6 部电影就是 6 次单独查询，加上查列表本身的 1 次，就是经典的 **1 + N**。
- 停顿，问学生："列表本身只查了一次，为什么又冒出来 6 次查询？"引导到"每个 movie 的 `reviewStats` 字段各自触发了一次 resolver"。

**Step 3 — 讲清楚为什么它藏得深**："注意，如果你只查**一部**电影的详情页，你永远看不到这个问题——只有一次查询。它只在查**列表**时炸出来。这就是为什么 N+1 在开发时容易漏、上线后要命。"

**Step 4 — 改回 DataLoader，讲原理**：改回 `context.reviewStatsLoader.load(...)`。讲三点：
1. DataLoader 把同一个事件循环 tick 内所有的 `.load(id)` 调用**攒起来批量执行一次**。
2. 必须**每个请求新建一个**（看 `context.js` 里 `createReviewStatsLoader()` 在 `createContext` 里调用）——跨请求共用会把上一个用户的缓存泄漏给下一个。
3. DataLoader 不是 GraphQL 专属的，它就是个通用的"批量 + 缓存"工具，只是刚好完美解决这个问题。

### 2.6 现场环节三：Apollo Client + 精确缓存更新（含真实的坑）

**先讲 useQuery + fetchMore 分页**：走读 `reeltalk/src/components/MovieList.jsx` 和 `apolloClient.js` 里 `movies` 字段的 `merge` 策略——`after` 存在时把新一页 append 到旧的 edges 后面，而不是覆盖。现场点"加载更多"给学生看列表增长。

**再讲缓存精确更新（本环节高光）**：
- 走读 `reeltalk/src/cache/appendReview.js`。对比点题："发完影评后怎么让列表更新？最省事的是 `refetchQueries`——把整个查询重新拉一遍。`graphql-demo` 里就是这么干的。但那要多一次网络往返，只为拿回你其实本地就能算出来的东西。"
- 展示这里改用 `cache.modify` + `cache.writeFragment`：只把这一条新影评插进缓存、并就地把 `reviewStats` 重算，不发网络请求。
- **务必讲那个真实的坑（这是这段最值钱的部分）**：最初我想在 `reviews` 和 `reviewStats` 两个 field modifier 之间用一个闭包变量传"有没有插入过"，结果失败了——因为 `cache.modify` 里字段的执行顺序**跟着缓存里字段的既有顺序（也就是 GraphQL 查询里字段的声明顺序）**走，不是你在 `fields: {}` 对象里写的顺序。所以跨字段的闭包 flag 不可靠。最终改成"调用 `cache.modify` 之前先用 `cache.readFragment` 显式判重"。
  - **给学生的takeaway**："`cache.modify` 的字段回调顺序不由你在代码里的书写顺序决定。任何跨字段的状态传递都别依赖执行顺序——需要提前判断的事情，在 `cache.modify` 之前用 `readFragment` 做完。"这是文档里不显眼、实战里会踩的点。

### 2.7 现场环节四：跑通 mutation + subscription（完整 app）

- 走读 `createReview` mutation（`resolvers/index.js`）：创建影评后 `pubsub.publish` 到按 `movieId` 区分的频道。
- 走读前端 `MovieDetail.jsx` 的 `useSubscription`——收到新影评后调 `appendReviewToCache`。
- **现场演示**：开两个标签页看同一部电影，在一个页发影评，另一个页实时出现。
- **给 L20 埋钩子**："注意这个'实时'现在是 GraphQL Subscription 帮我们做的，底层是 WebSocket。它到底替我们做了多少事？这个问题我们留到 L20，到时候把它拆开、用裸 WebSocket 重写一遍就知道了。"

### 2.8 常见学生问题预案

- **"DataLoader 的缓存会不会串数据？"** → 会，如果你跨请求共用一个实例。所以必须每个请求新建（`createContext` 里创建）。它的缓存是"单个请求生命周期内"的去重，不是跨请求的持久缓存。
- **"cache.modify 和直接 writeQuery 有什么区别？"** → `writeQuery` 要你提供整个查询的完整数据；`cache.modify` 让你只改某个规范化对象的某几个字段，更外科手术式，适合"追加一条"这种局部更新。
- **"分页的游标为什么就是电影 id？"** → 这里图简单直接用 id 当游标。真实系统里游标常是一个编码过的不透明字符串（可能含排序键 + id），但对客户端来说"游标是个只管往回传的黑盒"这个契约是一样的。

---

## 三、Lecture 19：渲染策略、RSC 概念与样式工程化（v0.2）

### 3.1 时间分配建议

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 5% | 开场 + "至今都是 CSR"的回顾 | 讲台 |
| 10% | CSR/SSR/SSG/RSC 谱系图（Mermaid） | slides |
| **20%** | **手写 SSR 走读 + 现场跑 + curl 看填满的 HTML** | **代码（高光一）** |
| 8% | hydration + hydration mismatch 陷阱 | slides + 演示 |
| 12% | RSC 概念（use client 边界、为什么省掉数据搬运） | slides（仅概念/片段） |
| 8% | CSS-in-JS 与 RSC 的架构张力 | slides |
| **20%** | **样式工程化现场重构：CSS Modules + 设计令牌 + 主题** | **代码（高光二）** |
| 7% | 样式方案对比表 + 何时用哪个 | slides |
| 10% | Summary + 回扣暗线 + 预告 L20 | 讲台 |

> 这一讲有两个并行的高光（手写 SSR、样式重构），中间夹着 RSC 概念。**RSC 是概念课、不写可运行代码**，别让学生以为要去搭 Next.js——反复强调"这部分只理解、不动手"。

### 3.2 开场话术要点

- 回顾"至今我们写的全是 CSR"："PodWave、StreakUp、上周的 ReelTalk 前端——全都是浏览器下载一个空 div + 一堆 JS，然后 JS 在浏览器里渲染出全部内容。这对登录后的内部页面没问题。但如果是一个需要被搜索引擎收录、需要首屏快、需要分享出去有预览的**公开内容页**呢？"
- 引出今天的两条线："今天我们做两件事：一，把电影详情页改成**服务端渲染**，亲手做一遍、看清楚 SSR 到底是什么；二，给整个 app 做一套**能一键切换暗/亮主题**的样式系统。中间还会聊一个正在改变整个生态的东西——React Server Components，但那个我们只理解概念，不动手。"

### 3.3 现场环节一：手写 SSR（高光一）

> 教学核心：**让学生亲眼看到"服务端返回的 HTML 里已经填满了内容"**，这是 SSR 区别于 CSR 的最直观证据。

- 先讲为什么详情页适合 SSR、列表页保持 CSR（呼应 L15"不要无差别优化"）："不是所有页面都要 SSR。详情页是会被分享、被搜索的，值得；列表页是登录后浏览的，不值得。所以我们只 SSR 详情页——同一个 app 里两种策略并存。"
- 走读 `reeltalk-ssr`（独立项目）四个文件，按数据流顺序：
  1. `fetchMovie.js`——服务端用普通 `fetch()` 向 GraphQL 端点发一次查询（不引入 Apollo SSR 那套重机制）。
  2. `server.js`——`renderToPipeableStream` 把组件渲染成 HTML 流 pipe 给响应；同时把查到的数据序列化内嵌成 `window.__INITIAL_DATA__`。
  3. `client.js`——用 `hydrateRoot`（不是 `createRoot`）读这份内嵌数据直接水合，**不重新发请求**。
  4. `MovieDetailView.js`——服务端和客户端**共用同一个组件**（注意这里用 `createElement` 不是 JSX，因为这个项目没有构建步骤，直接 `node` 跑）。
- **现场证据（务必做）**：`curl http://localhost:4003/movies/m1`，指着输出说："看，还没有任何 JS 跑，返回的 HTML 里电影标题、简介、每一条影评就已经在了。对比我们的 CSR 前端——`view-source` 只有一个空的 `<div id="root">`。"
- **点出这条暗线的关键句**："注意这一步——服务端查到了数据，然后要把它序列化塞进 HTML，客户端再解析出来用。这一趟'搬运'就是 SSR 的税。记住这个成本，等下讲 RSC 时你会看到它正是 RSC 想帮你省掉的东西。"

### 3.4 hydration 与 mismatch 陷阱

- 讲 `hydrateRoot` vs `createRoot`：前者接管服务端已经渲染好的 DOM、只挂事件；后者从空容器重新渲染。
- **讲 mismatch 陷阱**：服务端和客户端必须用**相同的 props 渲染出相同的输出**。举 slides 里的反例——渲染里带 `new Date().toLocaleTimeString()` 或 `Math.random()`，服务端渲染一次、客户端水合时又算一次，两次不一样，React 就会警告并**丢弃服务端 DOM 重新渲染**，SSR 白做了。常见诱因：`Date.now()`、`Math.random()`、`typeof window !== 'undefined'` 分支、时区/locale 差异。

### 3.5 RSC 概念（仅讲，不动手）

- **反复强调"这部分不写可运行代码"**：拿刚写完的手写 SSR 作对比素材，讲清楚 RSC 是什么。
- 用 slides 的代码片段讲三点：
  1. Server Component 可以直接 `async` + `await fetchMovie(id)` 后 return JSX——**没有 useEffect、没有 loading 状态、没有 `__INITIAL_DATA__` 搬运**。对比刚才手写 SSR 多出来的"序列化 + 客户端解析"那步，RSC 直接省了。
  2. `'use client'` 划的是**子树边界**：`MovieDetailPage` 保持服务端专属，里面的 `ReviewForm`（要用 `useState`、要交互）用 `'use client'` 变成客户端组件。
  3. 为什么 Server Component 不能用 `useState`/`onClick`——它根本不往浏览器发这段 JS，没有客户端运行时去挂状态和事件。
- **诚实交代边界**："RSC 需要框架实现这套协议（Next.js App Router 等），不是 React 本身开箱即用。我们今天手写的这个 SSR，就是在演示你的框架帮你自动化掉的那套机制。"

### 3.6 现场环节二：样式工程化重构（高光二）

- 走读 `reeltalk/src/styles/tokens.css`：所有颜色/间距/圆角都是 CSS 自定义属性（`--color-*` 等），不是散落各处的硬编码值。
- 走读某个组件的 `*.module.css`（比如 `MovieList.module.css`）：讲 CSS Modules——每个文件的类名构建期自动加唯一前缀，`.card` 永远不会和别处的 `.card` 撞车。对比 L18 版本的组件（`className="movie-card"` 全局类名 → `className={styles.card}` 局部作用域）。
- **主题切换现场演示（务必做）**：走读 `context/ThemeContext.jsx`——切主题只做一件事：`document.documentElement.dataset.theme = ...`。然后 `tokens.css` 里 `:root[data-theme='light']` 用同名变量覆盖。现场点切换按钮，**开着 DevTools 的 Elements 面板**，让学生看到：只有 `<html>` 上那一个 `data-theme` 属性在变，浏览器瞬间重绘，**零 React 重渲染**。
  - 关键句："没有任何组件读一个'主题'值来决定渲染什么颜色。React 只是翻了个 DOM 属性，剩下的是浏览器根据 CSS 变量自己重绘的。"
- 顺带回扣 App B：这里的 `useReducer` + Context 结构和 StreakUp 的 `ViewPreferencesContext` 一模一样——都是"简单的、同步的 UI 偏好"，不是数据，所以不用 Redux。

### 3.7 CSS-in-JS 与 RSC 的张力（承接 RSC）

- 讲 slides 里的对照：经典**运行时** CSS-in-JS（styled-components 那类）靠浏览器里的 JS 注入 `<style>`、还常依赖跨服务端/客户端边界的 `ThemeProvider` Context。而 Server Component 没有客户端 JS 运行时来跑这个注入、也不能参与跨边界的 Context。
- **注意措辞的置信度**："这是生态里一个真实存在、被广泛讨论的张力，不是一句'CSS-in-JS 被禁了'——库也在演进出编译期方案。但这确实是近几年 Tailwind、CSS Modules、零运行时方案随着 RSC 流行而更受青睐的部分原因。" 别讲成绝对论断。

### 3.8 常见学生问题预案

- **"为什么详情页不干脆也用 Next.js 一步到位？"** → 可以，但那样你就看不到 SSR 底下的机制了。今天手写的目的就是"先看清机制，再用框架"。真实项目里有真实 SSR 需求时，确实该上框架。
- **"`reeltalk-ssr` 里的 `MovieDetailView` 和 CSR 前端的组件是重复的吧？"** → 是，故意的。为一个组件搭 monorepo/共享包的成本比这点重复更高，也会把注意力从 SSR 机制本身带偏。生产项目会用框架解决这个。
- **"CSS Modules 里怎么条件组合两个类名？"** → 它们就是普通字符串，模板字符串拼一下就行（`` `${styles.card} ${styles.active}` ``），不需要额外库。

---

## 四、Lecture 20：SSE 与 WebSocket（v0.3，App C 收官）

### 4.1 时间分配建议

| 时间占比 | 环节 | 形式 |
|---|---|---|
| 6% | 开场："AI 回复为什么逐字蹦出？" | 讲台 |
| 10% | 轮询→长轮询→SSE→WebSocket 谱系 + 对比表 | slides（Mermaid） |
| **20%** | **SSE：后端 text/event-stream + 前端 EventSource 逐词渲染** | **代码（高光一）** |
| 8% | EventSource 只能 GET 的限制 + fetch/ReadableStream 替代 | slides + 说明 |
| **22%** | **裸 WebSocket 重写"实时影评"（含 `__typename` 坑）** | **代码（高光二）** |
| 12% | "GraphQL Subscription 到底帮你抽象了什么"总结 | slides + 回扣 L18 |
| 7% | 传输选型决策表 | slides |
| 15% | Summary + App C 收官 + 整个前端阶段收尾 | 讲台 |

### 4.2 开场话术要点

- 用那个动机问题开场："为什么 ChatGPT、Claude 的回复是一个字一个字蹦出来，而不是转几秒圈然后整段出现？"引导到"服务端每生成一个 token 就立刻推给你，用一个一直开着的 HTTP 响应"——这就是 SSE，也是它随 AI 聊天界面普及而变得到处都是的原因。
- 串起三讲的暗线收尾："今天是 App C 最后一讲，也把我们的暗线收上——L18 用的 GraphQL Subscription，底层就是 WebSocket。今天我们把 SSE 和 WebSocket 都拆开看，再把 L18 那个'实时影评'用裸 WebSocket 亲手重写一遍，你就彻底明白 Subscription 替你做了多少事。"

### 4.3 现场环节一：SSE（高光一）

- 先 `curl -N http://localhost:4002/movies/m2/summary` 给学生看**原始 SSE 流**：一行行 `data: <词>` 往外蹦，最后一个 `event: done`。"这就是 SSE 在网线上真实的样子，没有魔法。"
- 走读后端 `reeltalk-api/src/summarySSE.js`：
  - 三个关键响应头（`text/event-stream` 是让浏览器当流处理的关键）。
  - 报文格式 `data: <payload>\n\n`——**空行是分隔符，漏了客户端就收不到**。
  - 响应**保持打开**，反复 `res.write()` 而不是一次 `res.json()`。
  - `req.on('close')` 清理定时器——客户端中途关页面时别再往死 socket 写。
  - **强调无真实 LLM**："这个'AI 摘要'就是用电影自己的字段拼出来的模板，一个付费 key 都不需要。今天学的是**传输**，不是文本生成。"
- 走读前端 `hooks/useAiSummary.js` + `components/AiSummary.jsx`：`EventSource` 逐词累积。**现场点"✨ Generate AI summary"按钮**，看打字机效果。
- 讲 `done` 事件的必要性："EventSource 默认会一直开着、断了还自动重连。所以服务端发完必须发个具名 `done` 事件，客户端收到主动 `close()`。"

### 4.4 EventSource 的 GET 限制

- 讲清楚：`EventSource` **只能发 GET**，不能带自定义头或 body。我们这里没问题（电影 id 在 URL 里）。
- 但如果你要 POST 一段 prompt 给 LLM 呢？就得用 `fetch()` + `ReadableStream` reader——网线上还是同样的 `text/event-stream`，但你能控制请求方法和 body。`useAiSummary.js` 注释里指了这条路。

### 4.5 现场环节二：裸 WebSocket 重写实时影评（高光二，含真实的坑）

> 教学核心：**同一个功能，L18 用 Subscription 做过一遍，现在用裸 WS 再做一遍，把 graphql-ws 替你做的事一件件暴露出来。**

- 先回顾："L18 的'新影评实时出现'是 `useSubscription` + graphql-ws 做的。今天我们把它换成裸 WebSocket，看看要自己补多少东西。"
- 走读后端 `reeltalk-api/src/reviewsSocket.js`，逐条点出**手动做的事**：
  1. 连接时从 URL query 里取 `movieId` 存到 socket 上——因为裸 socket 没有"订阅参数"的概念（Subscription 的 `subscribe(_, { movieId })` 帮你处理了这个）。
  2. `broadcastReview` 里手动遍历连接、手动按 `movieId` 过滤、手动 `JSON.stringify`、手动检查 `readyState`。
- 走读 `index.js` 的 upgrade 路由：两个 WS server（graphql-ws 在 `/graphql`、裸 WS 在 `/ws/reviews`）用 `noServer` 模式，一个 `httpServer.on('upgrade')` 按路径分发。"两个 `{server, path}` 的 WS server 挂同一个 HTTP server 会抢 upgrade 事件，所以得自己路由——**这个路由本身也是 graphql-ws 平时帮你藏起来的一环**。"
- 走读前端 `hooks/useReviewSocket.js`：手动开连接（movieId 拼进 URL）、`JSON.parse`、`useEffect` 清理关连接。
- **现场制造并修复 `__typename` 坑（这段最值钱）**：
  1. 先把 `useReviewSocket.js` 里那句 `{ __typename: 'Review', ...review }` 改回 `review`（去掉手动补的 `__typename`）。
  2. 两个标签页 demo：B 页发影评，**A 页控制台抛 Invariant Violation**（`cache.writeFragment` 说缺字段/认不出类型）。
  3. 讲原因："裸 socket 传来的是**纯 JSON**，没有 `__typename`。而当年这条影评走 GraphQL Subscription 时，Apollo 自动给它打了 `__typename: 'Review'`——缓存靠这个标签做规范化。这就是又一件 graphql-ws 悄悄替你做的事。"
  4. 补回 `{ __typename: 'Review', ...review }`，再演示一遍，A 页正常实时更新。
- **完整高光演示**：两个标签页看同一部电影，B 页发影评，A 页（从没提交过任何东西）通过裸 WS 收到推送、影评数和平均分同步更新。

### 4.6 "Subscription 到底帮你抽象了什么"（回扣 L18）

- 用 slides 那页总结，把刚才手写暴露出来的都收拢：连接与 upgrade 路由、订阅范围（`movieId` 参数 vs 拼 URL）、序列化 + 打 `__typename`、结果自动进 Apollo 规范化缓存。
- **措辞要中立**："这不是说裸 WebSocket 更差。而是——抽象有成本也有收益，现在你两边都亲眼看过了，以后能有依据地选，而不是盲选。"

### 4.7 收尾：选型决策表 + App C 收官 + 前端阶段收尾

- 过决策表：单向低频（通知、feed、**AI token 流**）→ SSE；双向或高频（聊天、协作、多人游戏）→ WebSocket；已经在用 GraphQL 只想推数据更新 → 用 Subscription，别再单搭一层裸 WS；偶尔低频 → 轮询就够，别过度工程。
- **App C 收官**：回顾三讲拆开的三个抽象（DataLoader / SSR 的数据搬运即 RSC 要省的 / graphql-ws）。"ReelTalk 从一个 GraphQL 数据层，长成了带服务端渲染、带主题、带两种实时传输的完整应用。"
- **整个前端阶段收尾**：App A（怎么用 React）→ App B（怎么组织一个真实的多页面全栈应用）→ App C（看穿你在用的那些上层抽象）。祝 Final Project 顺利。

### 4.8 常见学生问题预案

- **"SSE 和 WebSocket 到底怎么选，一句话？"** → 只要数据是**单向**（服务端推给客户端），优先 SSE，它更简单、还自带重连。只有当你**也需要客户端频繁推给服务端**时才上 WebSocket。
- **"那我以后还用 GraphQL Subscription 吗，既然裸 WS 也能做？"** → 如果你本来就在用 GraphQL，用 Subscription——它替你做的那些（连接管理、类型、缓存集成）你不会想自己重写。裸 WS 是给"没有 GraphQL、需要自定义实时协议"的场景，或者像今天这样为了理解底层。
- **"为什么 mutation 已经把影评加进缓存了，WS 又推一次，不会重复吗？"** → 会推给包括提交者在内的所有人，所以 `appendReviewToCache` 里按 review id 去重——这段逻辑从 L18 就有，没变，只是"推给别人"的传输从 Subscription 换成了裸 WS。

---

## 五、三讲结束后的自查清单

- [ ] 学生能不能解释 N+1 问题为什么"只在查列表时才炸出来、查单条看不到"，以及 DataLoader 靠什么消除它（同一 tick 批量）？
- [ ] 学生能不能说出 `cache.modify` 相比 `refetchQueries` 的取舍，以及那个"字段回调顺序不由书写顺序决定"的坑？
- [ ] 学生能不能用 `curl` 证明"SSR 返回的 HTML 已填满"、并说清楚这和 CSR 的空 div 有何不同？
- [ ] 学生能不能讲清楚手写 SSR 里 `__INITIAL_DATA__` 那步"数据搬运"是什么，以及 RSC 如何省掉它？
- [ ] 学生能不能解释"CSS 变量主题切换为什么不触发 React 重渲染"？
- [ ] 学生能不能说出 SSE 和 WebSocket 各自的方向性，以及什么时候该用哪个？
- [ ] 学生能不能列出 graphql-ws（GraphQL Subscription）替你做了哪些事——连接、订阅范围、序列化、`__typename`、缓存集成？
- [ ] （贯穿）学生能不能用一句话概括 App C 三讲的共同主题——"把上层抽象拆开，看它底下替你做了什么"？
