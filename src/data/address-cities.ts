/**
 * Real major-city anchors for the address-generator tool.
 *
 * faker alone produces internally inconsistent addresses (random city + random
 * state + random postcode + random global coordinates). These anchors provide
 * REAL cities with their real state/province, plausible real postcodes and
 * the city-centre coordinates, so every generated address is coherent.
 * Street names are still generated (fictional) via faker per-locale.
 *
 * Format per row: "city|region|zip1,zip2,...|lat,lng"
 */
export interface CityAnchor {
  city: string;
  region: string;
  zips: string[];
  lat: number;
  lng: number;
}

const RAW: Record<string, string[]> = {
  en_US: [
    "New York|New York|10001,10014,10018|40.7128,-74.0060",
    "Los Angeles|California|90001,90012,90015|34.0522,-118.2437",
    "Chicago|Illinois|60601,60602,60616|41.8781,-87.6298",
    "Houston|Texas|77002,77019|29.7604,-95.3698",
    "Phoenix|Arizona|85001,85004|33.4484,-112.0740",
    "Philadelphia|Pennsylvania|19101,19103,19107|39.9526,-75.1652",
    "San Diego|California|92101,92102|32.7157,-117.1611",
    "Dallas|Texas|75201,75202|32.7767,-96.7970",
    "Seattle|Washington|98101,98104|47.6062,-122.3321",
    "Denver|Colorado|80202,80203|39.7392,-104.9903",
    "Boston|Massachusetts|02108,02110|42.3601,-71.0589",
    "Miami|Florida|33130,33131|25.7617,-80.1918",
  ],
  zh_CN: [
    "北京|北京市|100005,100010,100032|39.9042,116.4074",
    "上海|上海市|200002,200003,200081|31.2304,121.4737",
    "广州|广东省|510030,510055,510600|23.1291,113.2644",
    "深圳|广东省|518001,518010,518031|22.5431,114.0579",
    "杭州|浙江省|310002,310006,310009|30.2741,120.1551",
    "成都|四川省|610012,610015,610016|30.5728,104.0668",
    "武汉|湖北省|430014,430022,430060|30.5928,114.3055",
    "南京|江苏省|210002,210005,210008|32.0603,118.7969",
    "重庆|重庆市|400010,400011,400015|29.5630,106.5516",
    "西安|陕西省|710002,710004,710008|34.3416,108.9398",
    "天津|天津市|300041,300042,300051|39.3434,117.3616",
  ],
  en_GB: [
    "London|Greater London|EC1A 1BB,WC2H 7BX,W1A 0AX|51.5074,-0.1278",
    "Manchester|Greater Manchester|M1 1AE,M1 4BT|M53.4808,-2.2426",
    "Birmingham|West Midlands|B1 1BB,B2 4QA|52.4862,-1.8904",
    "Leeds|West Yorkshire|LS1 1BA,LS1 5AB|53.8008,-1.5491",
    "Liverpool|Merseyside|L1 8HY,L2 2DP|53.4084,-2.9916",
    "Edinburgh|Scotland|EH1 1BB,EH2 2AD|55.9533,-3.1883",
    "Glasgow|Scotland|G1 1XQ,G2 4NT|55.8642,-4.2518",
    "Bristol|Bristol|BS1 4DJ,BS1 6EG|51.4545,-2.5879",
    "Newcastle upon Tyne|Tyne and Wear|NE1 1AA,NE1 7RU|54.9783,-1.6178",
    "Cardiff|Wales|CF10 1AA,CF10 3EQ|51.4816,-3.1791",
    "Belfast|Northern Ireland|BT1 1AA,BT1 5GS|54.5973,-5.9301",
  ],
  ja: [
    "千代田区|東京都|100-0001,101-0021|35.6838,139.7534",
    "新宿区|東京都|160-0022,160-0023|35.6938,139.7036",
    "渋谷区|東京都|150-0001,150-0002|35.6595,139.7005",
    "大阪市|大阪府|530-0001,530-0005|34.6937,135.5023",
    "名古屋市|愛知県|450-0001,460-0008|35.1815,136.9066",
    "福岡市|福岡県|812-0011,812-0013|33.5904,130.4017",
    "札幌市|北海道|060-0001,060-0002|43.0618,141.3545",
    "京都市|京都府|600-8001,605-0862|35.0116,135.7681",
    "横浜市|神奈川県|220-0011,231-0023|35.4437,139.6380",
    "神戸市|兵庫県|650-0001,650-0022|34.6901,135.1955",
  ],
  ko: [
    "중구|서울특별시|04524,04540|37.5638,126.9844",
    "종로구|서울특별시|03150,03172|37.5728,126.9791",
    "강남구|서울특별시|06236,06234|37.5172,127.0473",
    "중구|부산광역시|48750,48755|35.1067,129.0324",
    "연수구|인천광역시|21998,22002|37.4103,126.6417",
    "중구|대구광역시|41911,41930|35.8683,128.6055",
    "동구|광주광역시|61470,61485|35.1467,126.9205",
    "서구|대전광역시|34811,35375|36.3374,127.3824",
  ],
  de: [
    "Berlin|Berlin|10115,10117,10405|52.5200,13.4050",
    "Hamburg|Hamburg|20095,20099,20354|53.5511,9.9937",
    "München|Bayern|80331,80333,80539|48.1351,11.5820",
    "Köln|Nordrhein-Westfalen|50667,50668,50670|50.9375,6.9603",
    "Frankfurt am Main|Hessen|60311,60313,60329|50.1109,8.6821",
    "Stuttgart|Baden-Württemberg|70173,70174,70176|48.7758,9.1829",
    "Dresden|Sachsen|01067,01069,01097|51.0504,13.7373",
    "Leipzig|Sachsen|04109,04103,04105|51.3397,12.3731",
    "Hannover|Niedersachsen|30159,30161,30167|52.3759,9.7320",
    "Düsseldorf|Nordrhein-Westfalen|40213,40210,40211|51.2277,6.7735",
  ],
  fr: [
    "Paris|Île-de-France|75001,75002,75004|48.8566,2.3522",
    "Marseille|Provence-Alpes-Côte d'Azur|13001,13002,13006|43.2965,5.3698",
    "Lyon|Auvergne-Rhône-Alpes|69001,69002,69003|45.7640,4.8357",
    "Toulouse|Occitanie|31000,31400|43.6047,1.4442",
    "Nice|Provence-Alpes-Côte d'Azur|06000,06100,06300|43.7102,7.2620",
    "Nantes|Pays de la Loire|44000,44100,44200|47.2184,-1.5536",
    "Strasbourg|Grand Est|67000,67100,67200|48.5734,7.7521",
    "Bordeaux|Nouvelle-Aquitaine|33000,33100,33200|44.8378,-0.5792",
    "Lille|Hauts-de-France|59000,59260,59800|50.6292,3.0573",
  ],
  es: [
    "Madrid|Comunidad de Madrid|28001,28004,28013|40.4168,-3.7038",
    "Barcelona|Cataluña|08001,08002,08003|41.3874,2.1686",
    "Valencia|Comunitat Valenciana|46001,46002,46003|39.4699,-0.3763",
    "Sevilla|Andalucía|41001,41004,41010|37.3891,-5.9845",
    "Zaragoza|Aragón|50001,50002,50003|41.6488,-0.8891",
    "Málaga|Andalucía|29001,29002,29007|36.7213,-4.4213",
    "Bilbao|País Vasco|48001,48003,48005|43.2630,-2.9350",
    "Palma|Illes Balears|07001,07002,07003|39.5696,2.6502",
  ],
  it: [
    "Roma|Lazio|00184,00185,00187|41.9028,12.4964",
    "Milano|Lombardia|20121,20122,20123|45.4642,9.1900",
    "Napoli|Campania|80132,80133,80134|40.8518,14.2681",
    "Torino|Piemonte|10121,10122,10123|45.0703,7.6869",
    "Firenze|Toscana|50122,50123,50124|43.7696,11.2558",
    "Bologna|Emilia-Romagna|40121,40122,40123|44.4949,11.3426",
    "Venezia|Veneto|30124,30125|45.4408,12.3155",
    "Genova|Liguria|16121,16122,16123|44.4056,8.9463",
  ],
  ru: [
    "Москва|Москва|101000,105064,119017|55.7558,37.6173",
    "Санкт-Петербург|Санкт-Петербург|190000,191186,197101|59.9311,30.3609",
    "Новосибирск|Новосибирская область|630099,630132|55.0084,82.9357",
    "Екатеринбург|Свердловская область|620014,620026|56.8389,60.6057",
    "Казань|Республика Татарстан|420111,420066|55.7963,49.1088",
    "Нижний Новгород|Нижегородская область|603005,603002|56.2965,43.9361",
    "Самара|Самарская область|443099,443010|53.1959,50.1002",
    "Краснодар|Краснодарский край|350000,350002|45.0355,38.9753",
  ],
  pt_BR: [
    "São Paulo|São Paulo|01001-000,01002-000|-23.5505,-46.6333",
    "Rio de Janeiro|Rio de Janeiro|20040-020,20090-000|-22.9068,-43.1729",
    "Belo Horizonte|Minas Gerais|30110-000,30112-000|-19.9167,-43.9345",
    "Brasília|Distrito Federal|70040-000,70070-000|-15.7939,-47.8828",
    "Curitiba|Paraná|80010-000,80020-000|-25.4284,-49.2733",
    "Porto Alegre|Rio Grande do Sul|90010-000,90020-000|-30.0346,-51.2177",
    "Recife|Pernambuco|50010-000,50020-000|-8.0476,-34.8770",
    "Salvador|Bahia|40020-000,40060-000|-12.9777,-38.5016",
  ],
  nl: [
    "Amsterdam|Noord-Holland|1012 AA,1017 AB,1071 AA|52.3676,4.9041",
    "Rotterdam|Zuid-Holland|3011 AA,3041 AA|51.9244,4.4777",
    "Den Haag|Zuid-Holland|2511 AA,2585 AB|52.0705,4.3007",
    "Utrecht|Utrecht|3511 AA,3512 AA|52.0907,5.1214",
    "Eindhoven|Noord-Brabant|5611 AA,5612 AA|51.4416,5.4697",
    "Groningen|Groningen|9711 AA,9712 AA|53.2194,6.5665",
  ],
  en_AU: [
    "Sydney|New South Wales|2000,2007,2010|-33.8688,151.2093",
    "Melbourne|Victoria|3000,3004,3006|-37.8136,144.9631",
    "Brisbane|Queensland|4000,4001|-27.4698,153.0251",
    "Perth|Western Australia|6000,6004|-31.9505,115.8605",
    "Adelaide|South Australia|5000,5006|-34.9285,138.6007",
    "Canberra|Australian Capital Territory|2600,2601|-35.2809,149.1300",
    "Hobart|Tasmania|7000,7004|-42.8821,147.3272",
    "Darwin|Northern Territory|0800,0810|-12.4634,130.8456",
  ],
  en_CA: [
    "Toronto|Ontario|M5V 2T6,M5H 2N2|43.6532,-79.3832",
    "Vancouver|British Columbia|V6B 1A1,V6C 1B2|49.2827,-123.1207",
    "Montréal|Québec|H2Y 1C6,H2Z 1A1|45.5017,-73.5673",
    "Calgary|Alberta|T2P 1J9,T2P 3H7|51.0447,-114.0719",
    "Ottawa|Ontario|K1P 1K1,K1P 5A1|45.4215,-75.6972",
    "Edmonton|Alberta|T5J 1B6,T5J 2M7|53.5461,-113.4938",
    "Halifax|Nova Scotia|B3H 1A1,B3J 2K9|44.6488,-63.5752",
    "Winnipeg|Manitoba|R3C 1A1,R3B 0T4|49.8951,-97.1382",
  ],
  en_IN: [
    "Mumbai|Maharashtra|400001,400020|19.0760,72.8777",
    "New Delhi|Delhi|110001,110011|28.6139,77.2090",
    "Bengaluru|Karnataka|560001,560002|12.9716,77.5946",
    "Chennai|Tamil Nadu|600001,600002|13.0827,80.2707",
    "Kolkata|West Bengal|700001,700016|22.5726,88.3639",
    "Hyderabad|Telangana|500001,500004|17.3850,78.4867",
    "Pune|Maharashtra|411001,411002|18.5204,73.8567",
    "Ahmedabad|Gujarat|380001,380009|23.0225,72.5714",
    "Jaipur|Rajasthan|302001,302003|26.9124,75.7873",
  ],
  es_MX: [
    "Ciudad de México|Ciudad de México|06000,06600,06700|19.4326,-99.1332",
    "Guadalajara|Jalisco|44100,44130|20.6597,-103.3496",
    "Monterrey|Nuevo León|64000,64020|25.6866,-100.3161",
    "Puebla|Puebla|72000,72500|19.0414,-98.2063",
    "Tijuana|Baja California|22000,22010|32.5149,-117.0382",
    "Mérida|Yucatán|97000,97040|20.9674,-89.5926",
    "Cancún|Quintana Roo|77500,77520|21.1619,-86.8515",
    "Querétaro|Querétaro|76000,76050|20.5888,-100.3899",
  ],
  tr: [
    "Fatih|İstanbul|34122,34130|41.0082,28.9784",
    "Çankaya|Ankara|06680,06690|39.9334,32.8597",
    "Konak|İzmir|35210,35220|38.4237,27.1428",
    "Muratpaşa|Antalya|07010,07020|36.8969,30.7133",
    "Osmangazi|Bursa|16010,16040|40.1826,29.0665",
    "Seyhan|Adana|01010,01020|37.0000,35.3213",
    "Selçuklu|Konya|42060,42070|37.8746,32.4932",
    "Şahinbey|Gaziantep|27010,27090|37.0662,37.3833",
  ],
  ar: [
    "Dubai|Dubai|00000|25.2048,55.2708",
    "Abu Dhabi|Abu Dhabi|00000|24.4539,54.3773",
    "Sharjah|Sharjah|00000|25.3463,55.4209",
  ],
  vi: [
    "Hoàn Kiếm|Hà Nội|100000,111100|21.0278,105.8342",
    "Quận 1|TP. Hồ Chí Minh|700000,710009|10.8231,106.6297",
    "Hải Châu|Đà Nẵng|550000,551100|16.0544,108.2022",
    "Hồng Bàng|Hải Phòng|180000,180210|20.8449,106.6881",
    "Ninh Kiều|Cần Thơ|900000,901110|10.0452,105.7469",
  ],
  th: [
    "Phra Nakhon|Bangkok|10200,10100|13.7563,100.5018",
    "Mueang Chiang Mai|Chiang Mai|50000,50100|18.7883,98.9853",
    "Phuket|Phuket|83000,83120|7.8804,98.3923",
    "Bang Lamung|Chon Buri|20150,20152|12.9236,100.8825",
    "Mueang Khon Kaen|Khon Kaen|40000,40002|16.4419,102.8360",
    "Hat Yai|Songkhla|90110,90100|7.0086,100.4747",
  ],
  id_ID: [
    "Jakarta Pusat|Jakarta|10110,10170|-6.2088,106.8456",
    "Surabaya|Jawa Timur|60119,60161|-7.2575,112.7521",
    "Bandung|Jawa Barat|40111,40115|-6.9175,107.6191",
    "Medan|Sumatera Utara|20111,20112|3.5952,98.6722",
    "Semarang|Jawa Tengah|50134,50132|-6.9667,110.4167",
    "Makassar|Sulawesi Selatan|90111,90145|-5.1477,119.4327",
    "Denpasar|Bali|80111,80115|-8.6500,115.2167",
  ],
  pl: [
    "Warszawa|Mazowieckie|00-001,00-950,00-040|52.2297,21.0122",
    "Kraków|Małopolskie|30-001,30-060|50.0647,19.9450",
    "Łódź|Łódzkie|90-001,90-050|51.7592,19.4559",
    "Wrocław|Dolnośląskie|50-001,50-038,50-950|51.1079,17.0385",
    "Poznań|Wielkopolskie|60-001,60-950|52.4064,16.9252",
    "Gdańsk|Pomorskie|80-001,80-830|54.3520,18.6466",
    "Lublin|Lubelskie|20-001,20-950|51.2465,22.5684",
    "Szczecin|Zachodniopomorskie|70-001,70-950|53.4285,14.5528",
  ],
  sv: [
    "Stockholm|Stockholms län|111 20,114 46|59.3293,18.0686",
    "Göteborg|Västra Götalands län|411 06,411 19|57.7089,11.9746",
    "Malmö|Skåne län|211 15,211 22|55.6050,13.0038",
    "Uppsala|Uppsala län|753 12,752 36|59.8586,17.6389",
    "Lund|Skåne län|221 00,222 22|55.7047,13.1910",
    "Umeå|Västerbottens län|903 24,903 25|63.8258,20.2630",
  ],
};

export const CITY_ANCHORS: Record<string, CityAnchor[]> = Object.fromEntries(
  Object.entries(RAW).map(([locale, rows]) => [
    locale,
    rows.map((row) => {
      const [city, region, zips, coords] = row.split("|");
      const [lat, lng] = coords.split(",").map(Number);
      return { city, region, zips: zips.split(","), lat, lng };
    }),
  ])
);
