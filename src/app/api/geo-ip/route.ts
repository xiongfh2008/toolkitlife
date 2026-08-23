import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TIMEOUT_MS = 8000;

interface GeoInfo {
  ip: string;
  continent?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  org?: string;
  timezone?: { id?: string };
  connection?: { asn?: number };
  type?: string;
}

// freeipapi 响应（主引擎，国内可达）
interface FreeIpApiData {
  ipAddress?: string;
  ipVersion?: number;
  latitude?: number;
  longitude?: number;
  countryName?: string;
  countryCode?: string;
  regionName?: string;
  cityName?: string;
  continent?: string;
  timeZones?: string[];
  asn?: string | number;
  asnOrganization?: string;
}

// ipwho.is 响应（兜底引擎）
interface IpWhoIsData {
  success?: boolean;
  ip?: string;
  continent?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  org?: string;
  type?: string;
  timezone?: { id?: string };
  connection?: { asn?: number };
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

function fromFreeIpApi(d: FreeIpApiData): GeoInfo | null {
  if (!d || !d.ipAddress) return null;
  const asn =
    typeof d.asn === "string" ? (parseInt(d.asn, 10) || undefined) : d.asn;
  return {
    ip: d.ipAddress,
    continent: d.continent,
    country: d.countryName,
    country_code: d.countryCode,
    region: d.regionName,
    city: d.cityName,
    latitude: typeof d.latitude === "number" ? d.latitude : undefined,
    longitude: typeof d.longitude === "number" ? d.longitude : undefined,
    isp: d.asnOrganization,
    org: d.asnOrganization,
    timezone:
      d.timeZones && d.timeZones.length ? { id: d.timeZones[0] } : undefined,
    connection: asn ? { asn } : undefined,
    type: d.ipVersion ? `IPv${d.ipVersion}` : undefined,
  };
}

function fromIpWhoIs(d: IpWhoIsData): GeoInfo | null {
  if (!d || d.success === false || !d.ip) return null;
  return {
    ip: d.ip,
    continent: d.continent,
    country: d.country,
    country_code: d.country_code,
    region: d.region,
    city: d.city,
    latitude: typeof d.latitude === "number" ? d.latitude : undefined,
    longitude: typeof d.longitude === "number" ? d.longitude : undefined,
    isp: d.isp,
    org: d.org,
    timezone: d.timezone?.id ? { id: d.timezone.id } : undefined,
    connection: d.connection?.asn ? { asn: d.connection.asn } : undefined,
    type: d.type,
  };
}

export async function GET(req: NextRequest) {
  const ip = (req.nextUrl.searchParams.get("ip") || "").trim();

  // 主引擎：freeipapi.com —— 国内网络可达、字段完整、无 CORS 限制
  try {
    const url = ip
      ? `https://freeipapi.com/api/json/${encodeURIComponent(ip)}`
      : "https://freeipapi.com/api/json";
    const data = (await fetchJson(url)) as FreeIpApiData;
    const geo = fromFreeIpApi(data);
    if (geo) return NextResponse.json(geo);
  } catch {
    // 网络失败 → 尝试兜底引擎
  }

  // 兜底引擎：ipwho.is —— 海外部署环境可达，字段结构与页面展示更贴近
  try {
    const url = ip
      ? `https://ipwho.is/${encodeURIComponent(ip)}`
      : "https://ipwho.is/";
    const data = (await fetchJson(url)) as IpWhoIsData;
    const geo = fromIpWhoIs(data);
    if (geo) return NextResponse.json(geo);
  } catch {
    // 两个引擎都失败 → 返回统一错误
  }

  return NextResponse.json({ error: "geo_lookup_failed" }, { status: 502 });
}
