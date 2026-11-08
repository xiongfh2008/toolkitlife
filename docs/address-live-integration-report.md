# ToolkitLife — Address 真实地址服务部署与联调报告

日期：2026-11-06 · 联调环境：本机隔离 Docker（非生产）· 生产 `ADDRESS_REAL_ENABLED` 全程保持 `false`

---

## 1. 部署环境检查结果

| 检查项 | 结果 |
|---|---|
| **可用于 Address 的 VPS** | ❌ **未确认**：本会话无任何 SSH 配置（`~/.ssh/config` 不存在）、未提供服务器地址或凭据。**生产部署阻塞项 #1** |
| 本机资源（Windows，联调用） | CPU 16 核 / 内存 31.3GB（空闲 8.6GB）/ D 盘空闲 150.7GB —— 满足官方最低要求（4GB 内存） |
| Docker | Client 29.8.0 + Compose v5.5.1；daemon 需手动启动 Docker Desktop（已启动） |
| 端口占用 | 8787 / 5432 部署前空闲 |
| 反向代理 / HTTPS | 本机无；生产入口未配置（见 §4 阻塞项） |
| Vercel → Address 网络方式 | 生产未打通：Vercel 无法访问本机。生产需 VPS + HTTPS 公网反代（或 VPC 方案），域名/DNS/证书**未确认，不得假设** |
| 持久化与备份 | 数据目录独立（`data/`），`pg_dump` + 整目录打包两种备份方式已验证可行 |

**结论**：生产部署所需的服务器资源、权限、域名信息**全部缺失**；按任务约束，已完成"可执行方案 + 本地隔离部署验证 + 真实联调"，阻塞项在 §11 明确记录。

## 2. Address 实际部署情况（本地隔离环境）

- 部署目录：`D:\AIProject\address-local`（ToolkitLife 仓库之外，非 git 仓库，凭据不入任何版本库）
- 架构：**官方 docker-compose.yml**（上游 main，与本仓库内上游克隆逐字节一致，仅行尾符差异），六服务全部按官方定义运行：
  - `bootstrap`（生成内部密钥后正常退出）→ `postgres` → `migrate`（正常退出）→ `api` / `sync` / `credential-broker`
- 独立项目名/网络/卷，未触碰任何其他容器或服务

## 3. 使用的镜像版本（固定）

| 镜像 | 版本 | 说明 |
|---|---|---|
| `daimon23/address` | **2.4.1**（2026-11-04 发布，553MB，Docker Hub 上与 latest 同层） | 通过 `.env` 的 `ADDRESS_IMAGE` 固定，不用 latest |
| `postgres` | 16-bookworm | 官方 compose 固定 minor；生产建议追加固 digest 锁 |

## 4. 容器及数据库健康状态

- `GET /api/v1/ready` → `{"status":"ready"}`；`/api/v1/health` → ok
- 联调结束时：api / credential-broker / postgres 全部 **healthy**；migrate 已正常退出
- **sync 服务联调后已停止**（`docker compose stop sync`，避免本机持续下载数十 GB 上游数据）；恢复命令：`docker compose start sync`

## 5. 网络与安全检查

| 项 | 结果 |
|---|---|
| API 绑定 | `127.0.0.1:8787`（netstat 实证，不对局域网/公网开放） |
| PostgreSQL | **无宿主端口映射**（`docker compose port postgres 5432` → 未发布），仅内部网络 |
| 管理后台 | 仅经本地回环可访问；管理员为**独立强密码**（bootstrap 注入，非默认 `admin`） |
| Token | `toolkitlife-adapter`：限速 **60/min**（实测 65 连发 → 57×200 + 8×429，精确生效）、有效期 1 年、scopes 规范化为 `["*"]`（上游设计：read+generate 即该 API 全部权限集，无更细粒度） |
| 鉴权 | 无 token / 错 token → 401 实证 |
| 凭据卫生 | 登录 cookie/CSRF 等临时文件已删除；`.token.txt`、`.env` 仅存在于仓库外的部署目录 |
| 共享限流存储评估 | 单 VPS 部署时实例唯一，**无需 Redis**；上游 token 级限速已足够。若未来多实例负载均衡再引入 |
| 监控 | `/api/v1/data-health`（监控就绪状态）+ `/health` 可接 Uptime 监控；生产建议配 HTTPS 反代访问日志 |

## 6. 各国家数据可用性

**27 国全部未就绪**（`/countries` 实测：`available=false, addressCount=0, generationMode=sync-required`；`/data-health` status=degraded，addressRecords=0）：

| 任务指定国家 | 状态 |
|---|---|
| 美国 US / 中国 CN / 英国 GB / 日本 JP / 德国 DE / 中国香港 HK | **全部标记为未就绪**（池空，自动同步已启动过约 10 分钟，目录数据已开始进入 staging） |

完整同步预期：官方文档 27 国全量约 15GB、耗时数小时至数天；CN 额外需要配置高德 Key（credential broker）才有数据来源。

## 7. 真实接口测试结果（对 2.4.1 真实服务，非 mock）

| 端点 | 结果 | 响应时间 |
|---|---|---|
| `/api/v1/ready` | ✅ 200 ready | <10ms |
| `/api/v1/availability`（有 token） | ✅ 200，`{"data":[]}`（空池正确形状） | ~15ms |
| `/api/v1/locations/search?country=US&field=region` | ✅ 200，字段齐全（regions/cities/districts/postcodes/matches/total/availableTotal/revision/source=postgres），目录未加载故为空 | 12ms |
| `/api/v1/generate`（US/CN/GB/JP/DE/HK 六国） | ✅ 全部 **404 `NO_POOL_COVERAGE`** —— 未就绪如实报告，**绝无 Faker 冒充** | 36–78ms |
| `/api/v1/generate/batch`（count=5） | ✅ 404 NO_POOL_COVERAGE | 154ms |
| `country=ZZ` | ✅ 400 `INVALID_COUNTRY` | — |
| batch `count=51` | ✅ 400 拒绝 | — |
| `residential=true` | ✅ 参数接受（空池 404） | — |
| 限流 | ✅ 60/min 精确生效（57×200 + 8×429） | — |

**[DATA] 断言未执行**：地址格式、经纬度、精度（street/premise）、数据来源展示等"有数据"断言需等池就绪后重跑 `node scripts/test-address-live.mjs`（脚本已内置 [DATA] 分支，数据到位即自动启用）。

## 8. ToolkitLife 适配层联调结果

隔离预览环境：本地 `next start`（构建 = 已发布的生产构建 e6ee8e6）+ `ADDRESS_REAL_ENABLED=true` + `ADDRESS_API_BASE_URL=http://127.0.0.1:8787` + Token → **`scripts/test-address-live.mjs` 13/13 全通过**：

- upstream 契约 5 项：ready / availability 形状 / 401 / 镜像一致性 ✓
- 适配层 5 项：availability 镜像、generate 空池→`NO_COVERAGE` 404、batch→`NO_COVERAGE`、`INVALID_COUNTRY`→400、locations 空列表形状、翻译未知 id 回退 null ✓
- ToolkitLife API 路由 3 项：availability 如实上报、**响应不含 token 与 synthetic 字段**、count>20 → 400 ✓
- 附加实证：真实服务 429 → 适配层正确映射 `RATE_LIMITED`（限流窗口内触发过一次，恰好验证）

**UI 行为确认（浏览器实测）**：池全空时（`countries:[]`）前端**自动隐藏真实模式切换**——"未就绪不暴露"，与验收设计一致；数据就绪后切换自动出现。

**生产隔离保证**：联调期间多次实测 `https://toolkitlife.com/api/address-generator/availability` → `{"enabled":false}`；生产环境变量未做任何改动。

## 9. 数据许可证核查情况

**明确声明：Address 源代码为 MIT ≠ 全部地址数据可自由商用。** 逐国来源与许可状态（来源：上游 `docs/data-sources.md` §2，许可类型需部署方按所列官方链接逐项人工复核后方可开放）：

| 国家 | 主源 | 许可/核查状态 |
|---|---|---|
| US | Overture + Geofabrik 州级分片 | Overture 主为 CDLA-Permissive 2.0（部分集 ODbL）；Geofabrik/OSM 为 **ODbL**（署名+相同方式共享）——相对明确，仍需按 `strategies/US-address-strategy.md` 复核 |
| GB | Geofabrik OSM + Postcodes.io | OSM **ODbL**；Postcodes.io 许可需核实（IRD 数据条款） |
| DE | Overture + Geofabrik 16 州分片 + OpenPLZ | 同 US（ODbL 混合）；OpenPLZ 许可需核实 |
| CN | AreaCity 行政区 + 高德住宅小区 | **重点人工核查项**：AreaCity 数据使用条款需核实；高德为商业服务条款且需 Key（credential broker 配置） |
| JP | 数字厅 ABR / Geolonia + PLATEAU + 日本郵便 | 多为政府开放数据/CC 系（具体版本需核实） |
| HK | 屋宇署/房委会 + Geofabrik | 香港政府开放数据许可 + ODbL，需核实引用格式 |

上游文档明确：OpenAddresses 归档沿用各实际上游许可；libpostal 仅用于解析不构成数据授权。**ODbL 数据库衍生的"对外提供生成地址"服务是否触发 share-alike 义务需法务确认** —— 开放前必须项。

## 10. 服务器资源与成本

**实测（空池运行态，本机 Docker）**：

| 容器 | 内存 | CPU |
|---|---|---|
| api | 488 MB | 0.1% |
| postgres | 361 MB | 0.8% |
| sync | 259 MB（运行中） | 15.6%（下载/解析期） |
| credential-broker | 27 MB | ~0% |
| **合计** | **≈1.1 GB** | 峰值单核 16% |

- 数据：`data/` 已 2.7 GB（postgres 923MB + staging 1.8GB）；27 国全量预计 **~15 GB** + 暂存/备份空间 → 建议 40GB 磁盘
- API 响应时间：36–154ms（空池）；日请求能力：未压测，受 `API_MAX_INFLIGHT_GENERATIONS=4` + token 60/min 限制，估算单实例日数十万次无压力（**待压测**）
- **预估月运维费用**：4–8GB VPS（Hetzner/DO 级别）$6–20 + 备份存储 $1–2 + 带宽（首次同步下载量大，之后增量）≈ **$10–25/月**；CN 高德 Key 视用量另计

## 11. 尚未解决的问题（阻塞项）

1. **生产 VPS 未确认**（无访问凭据）—— 最关键阻塞；VPS 到位后按 `docs/address-deployment.md` §6 核对清单执行，镜像锁 2.4.1
2. **数据池为空**：需在目标服务器 `docker compose start sync` 并等待数小时至数天；CN 需先配高德 Key
3. **HTTPS 公网入口未确认**：域名、DNS、证书均未确认（不得假设已有域名）；生产必须 HTTPS 反代 + `TRUST_PROXY=true` + `COOKIE_SECURE=true`
4. **[DATA] 断言未执行**：真实地址内容/精度/来源展示需池就绪后重跑 `scripts/test-address-live.mjs`
5. **许可法务确认**：ODbL share-alike 对生成结果服务的影响；CN（AreaCity/高德）与 JP/HK 政府数据条款逐项人工复核
6. 限流共享存储与压测数据（日处理能力）待生产规模确定后补充

## 12. 是否具备开放真实地址功能的条件

### 结论：**暂不可开放**

理由：(1) 无生产服务器与 HTTPS 入口；(2) 27 国地址池全部为空（六国全部未就绪），开放后所有请求只会得到"无数据"，无功能价值；(3) 许可法务核查未完成。

**已达成的部分**（复用基础全部就绪）：
- 本地隔离部署验证了官方 Docker Compose 架构 + 固定镜像 2.4.1 的完整流程（bootstrap→migrate→api/sync/broker 全 healthy）
- Token 创建（最小权限+限速+有效期）与鉴权体系实测通过
- 六国真实 API 契约联调通过（含错误路径、限流、响应时间基线）
- **ToolkitLife 适配层对真实服务 13/13 联调通过**，生产真实模式全程保持关闭并多次实测确认

**达到"可以开放"的执行路径**（按序）：
1. 提供 VPS（≥4GB 内存/40GB 盘）→ 按 `docs/address-deployment.md` §3/§6 部署（镜像锁 2.4.1）→ 修改管理密码 → 创建生产 Token（60/min 或按流量定）
2. `docker compose start sync`，配置 CN 高德 Key，等待六国池就绪（`/countries` 全部 available=true）
3. 配置域名 + DNS + HTTPS 反代（Caddy 自动证书最简），`TRUST_PROXY=true`、`COOKIE_SECURE=true`，PostgreSQL/管理后台保持不公开
4. 逐项完成数据许可人工核查（尤其 CN/ODbL share-alike）
5. 重跑 `ADDRESS_REAL_ENABLED=true … node scripts/test-address-live.mjs`（[DATA] 断言全过）
6. Vercel 配置三个环境变量 → `docs/address-deployment.md` §6 清单打勾 → 最后一步才把生产 `ADDRESS_REAL_ENABLED` 改为 `true`

本报告完成前及此后：生产 `ADDRESS_REAL_ENABLED` 保持 `false`，未做任何修改。
