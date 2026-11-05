# Address 真实地址服务部署方案（供 ToolkitLife 集成使用）

> 状态：**方案文档，未部署**。本文不触发任何服务器操作；生产部署需人工执行。
> 上游项目：<https://github.com/daimon3332/address>（MIT），官方部署文档
> `docs/DEPLOYMENT.zh-CN.md` 为唯一权威来源，本文是它在 ToolkitLife 场景下的落地摘要。

## 1. 定位

ToolkitLife 的地址生成器（`/[locale]/tools/address-generator`）默认只有浏览器本地
Faker 模拟模式。可选的"真实地址数据"模式需要单独部署上游 **Address** 服务
（Astro + Hono + PostgreSQL 16 + Docker Compose），ToolkitLife 只通过其官方
HTTP API（`/api/v1/*`）取数，**不**复制其数据库查询逻辑，**不**将其 Astro
应用嵌入 Next.js，**不**把地址数据库放进 ToolkitLife 前端。

服务未部署 / `ADDRESS_REAL_ENABLED=false` 时，站点行为与现状完全一致
（仅模拟模式，`/api/address-generator/*` 返回 503 `REAL_MODE_DISABLED`）。

## 2. 资源需求（来自上游官方文档）

| 项目 | 要求 |
|---|---|
| 系统 | Linux，AMD64 / ARM64 |
| 运行时 | Docker Engine 24+、Docker Compose v2 |
| 内存 | ≥ 4 GB；首次导入美/法等大型国家建议 ≥ 8 GB |
| 磁盘 | 27 国完整同步后数据库约 15 GB，另需同步暂存与备份空间 |
| 网络 | 服务器需能访问 Docker Hub 与各数据源；**对 ToolkitLife 的服务端而言走内网即可** |

上游数据源（Overture、Geofabrik/OSM、AreaCity、高德、BDNB、Catastro 等）的
许可与署名要求各不相同，逐类核查义务在部署方——见上游 `docs/data-sources.md`
第 2 节表格与各国家策略文档 `docs/strategies/*.md`。OSM/Geofabrik 衍生数据
通常受 ODbL 约束（署名 + 相同方式共享）；对外展示时页面已显示数据源名称
（来自 API `evidence` 字段），部署方需确认自建部署满足对应署名条款后再启用
真实模式。

## 3. 部署步骤（人工执行，全部在上游项目目录）

```bash
mkdir address && cd address
curl -fsSLo docker-compose.yml https://raw.githubusercontent.com/daimon3332/address/main/docker-compose.yml
docker compose up -d
```

固定镜像版本（不跟随 latest 自动更新）：

```dotenv
# address/.env
ADDRESS_IMAGE=daimon23/address:<已验证的版本标签>
```

启动后检查与初始化：

```bash
docker compose ps                                  # 全部服务 running / healthy
curl -fsS http://127.0.0.1:8787/api/v1/ready       # {"status":"ready"}
```

浏览器打开 `http://127.0.0.1:8787/admin/`，用初始密码 `admin` 登录并**立即修改
管理密码**（仅首次生效）。随后在后台"接口令牌"中创建一个只含"读取 + 生成"
权限、带限速和到期时间的 Bearer 令牌——这是 ToolkitLife 使用的唯一凭据。

## 4. 安全基线（与任务要求的对应关系）

| 要求 | 做法 |
|---|---|
| 不公开 PostgreSQL 端口 | compose 默认 `postgres` 服务仅在 `internal` 内网，无宿主端口映射 |
| 不公开管理后台 | `api` 默认监听 `127.0.0.1:8787`；ToolkitLife 与其同机部署时**无需任何对外端口** |
| HTTPS / 私有网络通信 | 同机 → `http://127.0.0.1:8787`；跨机 → 内网/VPC 或带 HTTPS 的反代（Caddy/Nginx 示例见上游部署文档） |
| 首次登录改默认密码 | 第 3 步强制；`ADMIN_INITIAL_PASSWORD` 仅首次启动生效 |
| 保护密钥与备份 | `data/secrets/`（自动生成的内部密钥）必须纳入加密备份；`data/postgres/` 按需 `pg_dump` 或整目录备份 |
| 固定镜像版本 | `ADDRESS_IMAGE` 锁定 tag |
| 不自动部署 | 本文仅为方案；任何 `docker compose` 命令均需人工执行 |

若必须将管理后台暴露给运维人员，仅通过 VPN/内网访问，并设置 `.env`：

```dotenv
TRUST_PROXY=true
COOKIE_SECURE=true
ALLOWED_ORIGINS=https://address.example.com
```

## 5. ToolkitLife 侧接入（本地已实现，等待服务）

在 ToolkitLife 运行环境中配置（`.env.local` / 平台环境变量；模板见
`.env.example`）：

```dotenv
ADDRESS_REAL_ENABLED=false        # 灰度开关：部署+验证完成后才改 true
ADDRESS_API_BASE_URL=http://127.0.0.1:8787
ADDRESS_API_TOKEN=<后台"接口令牌"创建的 Bearer 令牌>
```

硬性约束（已在代码中强制）：

- Token 只存在于服务端环境变量；不存在任何 `NEXT_PUBLIC_*` 透传。
- 浏览器只能访问 ToolkitLife 自己的 `/api/address-generator/{availability,locations,}` 路由。
- 服务端仅调用固定 allowlist 的上游路径（`/api/v1/availability`、
  `/locations/search`、`/generate`、`/generate/batch`、`/address-translation`），
  base URL 被归一化为裸 origin，无法被构造成开放代理。
- 批量上限 20（上游上限 50，取更严值）；每 IP 生成 20 次/5 分钟、
  地区目录 60 次/分钟、可用性 30 次/分钟（内存滑动窗口）。
- 上游 429 的 `Retry-After` 会透传给客户端；401/403 统一映射为
  `UPSTREAM_AUTH`（不泄漏任何上游细节）。
- 上游返回中的合成人物/银行卡/扩展资料（`profile`/`card`/`extensions`）
  在适配层被剥离，永不出现在 API 响应或页面上。
- 可用性缓存 60s、地区目录缓存 5min（内存）；生成结果不缓存、不落盘、
  不写日志（日志中不出现完整住宅地址）。

## 6. 上线核对清单（人工逐项打勾后才允许 `ADDRESS_REAL_ENABLED=true`）

- [ ] Docker Compose 全服务 healthy；`/api/v1/ready` 返回 ready
- [ ] 管理密码已修改；前端访问密码（可选）已设置
- [ ] API 令牌仅含读取+生成权限、已配置限速与到期
- [ ] PostgreSQL 端口未对宿主/外网暴露（`docker compose ps` / `ss -tlnp` 核查）
- [ ] 管理后台未对公网暴露
- [ ] `data/secrets/` 已加密备份；备份策略已记录
- [ ] 镜像版本已锁定（非 latest）
- [ ] 目标国家已有数据：`curl -H "Authorization: Bearer …" http://127.0.0.1:8787/api/v1/availability` 非空
- [ ] 用该令牌完成一次真实联调：`node scripts/test-address-integration.mjs --live`
- [ ] 数据源许可核查完成（至少覆盖启用国家的所有主源）
- [ ] 成本评估：磁盘（~15GB+）、内存（4-8GB）、同步期间外网流量

## 7. 已知边界（页面文案与 API 行为均已体现）

- `NO_POOL_COVERAGE`：所选范围无合格地址 → 页面提示扩大范围，不回退到附近地区。
- 中国地址楼栋/单元/房间为唯一合成字段（上游标记 `synthetic`）；街道级地址
  （`matchLevel=street`）没有门牌号，页面会如实标注"街道级"。
- 真实来源 ≠ 可投递/可居住/已验证身份——页面 FAQ 与提示中已明确。
- 模拟模式国家列表（24 个 Faker locale）与真实模式国家列表（来自
  `/availability`，仅含有数据的 27 国子集）相互独立；Faker 支持而 Address
  无数据的国家在模拟模式中仍可用。
