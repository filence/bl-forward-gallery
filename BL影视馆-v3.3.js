WidgetMetadata = {
  id: "bl.poster.gallery",
  title: "BL 影视馆 · 海报墙",
  author: "原创整合与优化：参考夏恩 BL 模块，非原作者发布",
  description: "BL 专题海报目录，不提供视频源；详情与播放资源由客户端及 Emby 关联。",
  site: "https://www.themoviedb.org/keyword/289844-boys-love-bl",
  version: "3.3.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 3600,
  modules: [
    {
      id: "blShows", title: "BL 剧集", functionName: "loadBLShows", cacheDuration: 3600,
      params: standardParams("tv")
    },
    {
      id: "blMovies", title: "BL 电影", functionName: "loadBLMovies", cacheDuration: 3600,
      params: standardParams("movie")
    },
    {
      id: "blAnime", title: "BL 动画", functionName: "loadBLAnime", cacheDuration: 3600,
      params: [
        { name: "media", title: "形式", type: "enumeration", value: "tv", enumOptions: [
          { title: "番剧", value: "tv" }, { title: "剧场版", value: "movie" }
        ] },
        ...standardParams("anime")
      ]
    },
    {
      id: "blOtherRegions", title: "其他地区 BL 剧集", functionName: "loadBLOtherRegions", cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "popular", enumOptions: [
          { title: "最热门", value: "popular" }, { title: "最新", value: "latest" }, { title: "高分", value: "top" }
        ] },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      id: "blClassics", title: "经典 BL 剧集与电影", functionName: "loadBLClassics", cacheDuration: 3600,
      params: [
        { name: "sort_by", title: "排序", type: "enumeration", value: "popular", enumOptions: [
          { title: "最热门", value: "popular" }, { title: "高分", value: "top" }, { title: "最新", value: "latest" }
        ] },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      id: "blRecent", title: "最近观看（仅本首页，预留）", functionName: "loadBLRecent", cacheDuration: 0,
      description: "不使用全局历史。客户端尚无已验证的本首页播放事件接口，因此默认返回空列表。",
      params: []
    },
    {
      id: "blExplore", title: "BL 补漏候选（关键词搜索）", functionName: "loadBLExplore", cacheDuration: 3600,
      params: [
        { name: "media", title: "类型", type: "enumeration", value: "tv", enumOptions: [
          { title: "剧集", value: "tv" }, { title: "电影", value: "movie" }
        ] },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      id: "blUpcoming", title: "即将开播 / 上映", functionName: "loadBLUpcoming", cacheDuration: 3600,
      params: [
        { name: "media", title: "类型", type: "enumeration", value: "tv", enumOptions: [
          { title: "BL 剧集", value: "tv" }, { title: "BL 电影", value: "movie" }
        ] },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    }
  ],
  search: {
    title: "搜索影视名称及别名",
    functionName: "searchBL",
    params: [
      { name: "keyword", title: "片名或关键词", type: "input", value: "" },
      { name: "page", title: "页码", type: "page" },
      { name: "language", title: "语言", type: "language", value: "zh-CN" }
    ]
  }
};

// 重要：沿用原作者的三大模块 ID 与 TMDB 数字 id + mediaType 格式。
// 首页 .fwd 可继续引用 blShows / blMovies / blAnime。
// 这是 TMDB 海报目录，不含 stream 模块、不访问 Emby 账号或任何非官方视频源。
// 默认仅查 TMDB；不再在海报加载热路径调用豆瓣网页接口。

function standardParams(kind) {
  var regions = [
    { title: "全部", value: "" },
    { title: "泰国", value: "TH" }, { title: "日本", value: "JP" },
    { title: "韩国", value: "KR" }, { title: "台湾", value: "TW" },
    { title: "中国大陆", value: "CN" }, { title: "香港", value: "HK" },
    { title: "美国", value: "US" }, { title: "英国", value: "GB" },
    { title: "法国", value: "FR" },
    { title: "其他亚洲（精选国家）", value: "CN|HK|SG|MY|VN|PH|ID" },
    { title: "欧美（精选国家）", value: "US|GB|FR|CA|AU|DE|ES|IT|SE|NO|DK|NL|BE|IE" }
  ];
  var years = [
    { title: "全部", value: "" },
    { title: "今年（自动）", value: "this_year" },
    { title: "去年（自动）", value: "last_year" },
    { title: "2026", value: "2026" }, { title: "2025", value: "2025" },
    { title: "2024", value: "2024" }, { title: "2023", value: "2023" },
    { title: "2022", value: "2022" }, { title: "2021", value: "2021" },
    { title: "2020", value: "2020" }, { title: "2019", value: "2019" },
    { title: "2018", value: "2018" }, { title: "2010 年代", value: "2010s" },
    { title: "2000 年代", value: "2000s" }, { title: "更早", value: "older" }
  ];
  return [
    { name: "sort_by", title: "排序", type: "enumeration", value: "latest", enumOptions: [
      { title: "最新上映", value: "latest" },
      { title: "最热门", value: "popular" },
      { title: "高分", value: "top" }
    ] },
    { name: "region", title: "地区", type: "enumeration", value: "", enumOptions: regions },
    { name: "year", title: "年份", type: "enumeration", value: "", enumOptions: years },
    { name: "scope", title: "BL 覆盖范围", type: "enumeration", value: "broad", enumOptions: [
      { title: "广覆盖（默认）", value: "broad" },
      { title: "仅核心 BL 标签", value: "strict" }
    ] },
    { name: "mixed", title: "同时包含 GL 标签的作品", type: "enumeration", value: "include", enumOptions: [
      { title: "保留（避免漏收）", value: "include" },
      { title: "排除", value: "exclude" }
    ] },
    { name: "page", title: "页码", type: "page" },
    { name: "language", title: "显示语言", type: "language", value: "zh-CN" }
  ];
}

var BL_KEYWORDS = "289844|384569|365317|312166|320085|324501|328692|328728|308109|353318";
var GL_KEYWORDS = "9833,264386,214564,280003,383699,315385,319872,315382,286187,333351,348072,356236,359453,290382,307399,207469,345774,357101,365272,308586,319341,362385,375797,355464,315383,289476,373657,335952";
var HAN = /[\u3400-\u9fff]/;
var ANIMATION_GENRE = "16";

function formatDay(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function yearRange(value) {
  var now = new Date().getFullYear();
  if (value === "this_year") return [now, now];
  if (value === "last_year") return [now - 1, now - 1];
  if (value === "classic") return [1900, 2019];
  if (value === "2010s") return [2010, 2019];
  if (value === "2000s") return [2000, 2009];
  if (value === "older") return [1900, 1999];
  if (!/^\d{4}$/.test(String(value || ""))) return null;
  var yr = Number(value);
  return yr >= 1900 && yr <= 2100 ? [yr, yr] : null;
}
function buildQuery(params, mediaType, anime, upcoming) {
  var p = params || {};
  var dateKey = mediaType === "movie" ? "primary_release_date" : "first_air_date";
  var page = Math.max(1, Math.min(500, Math.floor(Number(p.page) || 1)));
  var q = {
    page: String(page),
    language: p.language || "zh-CN",
    with_keywords: p.scope === "strict" ? "289844" : BL_KEYWORDS,
    include_adult: "false"
  };
  if (p.mixed === "exclude") q.without_keywords = GL_KEYWORDS;
  if (p.region) q.with_origin_country = String(p.region);
  if (anime) q.with_genres = ANIMATION_GENRE;
  else q.without_genres = ANIMATION_GENRE;

  if (upcoming) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    q.sort_by = dateKey + ".asc";
    q[dateKey + ".gte"] = formatDay(tomorrow);
  } else {
    var sort = p.sort_by || "latest";
    q.sort_by = sort === "popular" ? "popularity.desc" : sort === "top" ? "vote_average.desc" : dateKey + ".desc";
    if (sort === "top") q["vote_count.gte"] = "10";
    // 统一排除未来上映项目，避免“热播”混入待播剧；待播单独放 blUpcoming。
    q[dateKey + ".lte"] = formatDay(new Date());
  }
  var yr = yearRange(p.year);
  if (yr) {
    var first = yr[0] + "-01-01";
    var last = yr[1] + "-12-31";
    var minKey = dateKey + ".gte";
    var maxKey = dateKey + ".lte";
    if (!q[minKey] || q[minKey] < first) q[minKey] = first;
    if (!q[maxKey] || q[maxKey] > last) q[maxKey] = last;
  }
  return q;
}
function paramsToQuery(obj) {
  return Object.keys(obj).filter(function(k){return obj[k] !== "" && obj[k] != null;})
    .map(function(k){return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);}).join("&");
}
async function tmdbDiscover(type, query) {
  var path = "discover/" + type;
  var res = await Widget.tmdb.get(path, {params: query});
  // 原 BL 2.6.0 中存在 Forward 客户端缓存造成翻页错位的兼容逻辑。
  if (res && res.page != null && Number(res.page) !== Number(query.page)) {
    res = await Widget.tmdb.get(path + "?" + paramsToQuery(query), {params:{}});
  }
  if (!res || !Array.isArray(res.results)) throw new Error("TMDB 返回的数据格式不正确");
  if (res.page != null && Number(res.page) !== Number(query.page)) throw new Error("TMDB 分页结果与请求不一致");
  return res;
}
function rawTitle(r, mediaType) {
  return (mediaType === "movie" ? r.title || r.original_title : r.name || r.original_name) || "未命名作品";
}
function toItem(r, mediaType) {
  return {
    id: r.id,                  // 与用户原有 BL 2.6.0 一致，兼容其详情匹配方式
    type: "tmdb",
    mediaType: mediaType,
    title: rawTitle(r, mediaType),
    posterPath: r.poster_path,
    backdropPath: r.backdrop_path || undefined,
    releaseDate: mediaType === "movie" ? r.release_date : r.first_air_date,
    rating: Number(r.vote_average || 0),
    description: r.overview || ""
  };
}
async function fillTraditionalTitles(items, raws, query, mediaType) {
  if (!String(query.language).startsWith("zh")) return;
  if (!items.some(function(it){return !HAN.test(it.title) || !it.description;})) return;
  var alt;
  try {
    alt = await Widget.tmdb.get("discover/" + mediaType, {params: {...query, language: "zh-TW"}});
  } catch (e) { return; }
  if (!alt || !Array.isArray(alt.results)) return;
  var match = {};
  for (var r of alt.results) match[String(r.id)] = r;
  for (var it of items) {
    var other = match[String(it.id)];
    if (!other) continue;
    var title = rawTitle(other, mediaType);
    if (!HAN.test(it.title) && HAN.test(title)) it.title = title;
    if (!it.description && other.overview) it.description = other.overview;
  }
}
async function loadCatalog(params, mediaType, anime, upcoming) {
  var q = buildQuery(params, mediaType, anime, upcoming);
  try {
    var res = await tmdbDiscover(mediaType, q);
    var valid = res.results.filter(function(r) {
      // 不能把横图充当竖版海报；只有真实海报的作品进入海报墙。
      if (!r || !r.id || r.adult || !r.poster_path) return false;
      if (mediaType === "tv" && params.region && !String(params.region).includes("|") &&
          Array.isArray(r.origin_country) && r.origin_country.length &&
          !r.origin_country.includes(params.region)) return false;
      return anime ? Array.isArray(r.genre_ids) && r.genre_ids.includes(16)
        : !Array.isArray(r.genre_ids) || !r.genre_ids.includes(16);
    });
    var unique = []; var seen = new Set();
    for (var r of valid) {
      if (!seen.has(r.id)) {seen.add(r.id);unique.push(r);}
    }
    var items = unique.map(function(r){return toItem(r, mediaType);});
    if (!params.skipChineseFallback) await fillTraditionalTitles(items, unique, q, mediaType);
    return items;
  } catch (e) {
    console.error("[BL 海报墙] " + mediaType + " 第 " + q.page + " 页加载失败", e.message || e);
    throw e;
  }
}
async function loadBLShows(params = {}) {return loadCatalog(params, "tv", false, false);}
async function loadBLMovies(params = {}) {return loadCatalog(params, "movie", false, false);}
async function loadBLAnime(params = {}) {return loadCatalog(params, params.media === "movie" ? "movie" : "tv", true, false);}
async function loadBLUpcoming(params = {}) {return loadCatalog(params, params.media === "movie" ? "movie" : "tv", false, true);}

// 全局搜索属于用户主动搜索：不强制 BL 标签，以免查不到未标注 BL 的作品。
// 搜索结果与主首页的“经过 BL 关键词筛选”不是相同的发现机制。
async function searchBL(params = {}) {
  var keyword = String(params.keyword || "").trim();
  if (!keyword) return [];
  var common = {query: keyword, language: params.language || "zh-CN", page: String(Math.max(1, Math.min(500, Number(params.page) || 1))), include_adult:"false"};
  var responses = await Promise.all([
    Widget.tmdb.get("search/tv", {params:common}).catch(function(){return null;}),
    Widget.tmdb.get("search/movie", {params:common}).catch(function(){return null;})
  ]);
  var tv = responses[0] && Array.isArray(responses[0].results) ? responses[0].results : [];
  var movies = responses[1] && Array.isArray(responses[1].results) ? responses[1].results : [];
  var items = [];
  var seen = new Set();
  var max = Math.max(tv.length, movies.length);
  for (var i = 0; i < max; i++) {
    for (var pair of [[tv[i], "tv"], [movies[i], "movie"]]) {
      var r = pair[0], kind = pair[1];
      if (!r || !r.id || !r.poster_path || r.adult) continue;
      var key = kind + ":" + r.id;
      if (!seen.has(key)) {seen.add(key);items.push(toItem(r,kind));}
    }
  }
  return items;
}

// 可选补漏模块：专门显示 TMDB 标签体系未必覆盖的候选作品。
// 不加入热门/高分榜单，以免按不同关键词轮换造成排序失真。
var BL_SEARCH_TERMS = ["耽美", "双男主", "泰腐", "boys' love", "ボーイズラブ", "yaoi", "少年愛", "腐剧"];
var BL_EVIDENCE = /耽美|双男主|泰腐|boys?'?\s*love|ボーイズ[・ー]?ラブ|yaoi|少年愛|腐剧/i;
async function loadBLExplore(params = {}) {
  var media = params.media === "movie" ? "movie" : "tv";
  var page = Math.max(1, Math.floor(Number(params.page) || 1));
  var term = BL_SEARCH_TERMS[(page - 1) % BL_SEARCH_TERMS.length];
  var searchPage = Math.floor((page - 1) / BL_SEARCH_TERMS.length) + 1;
  var res = await Widget.tmdb.get("search/" + media, {params: {
    query: term, page: String(searchPage), language: params.language || "zh-CN", include_adult: "false"
  }});
  var seen = new Set();
  return ((res && res.results) || []).filter(function(r) {
    var text = [r.title,r.name,r.original_title,r.original_name,r.overview].filter(Boolean).join(" ");
    var key = String(r.id);
    if (!r.poster_path || r.adult || !BL_EVIDENCE.test(text) || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(function(r){return toItem(r, media);});
}

// 本首页专属最近观看：安全占位。
// 注意：Forward/Rex 原生 history 属于全局观看记录，不能直接复用。
// 目前未找到可验证的“从本首页发起播放”事件及来源 ID 接口。
// 因此禁止把全局 history 伪装成专属记录；在客户端支持播放来源回调前返回 []。
async function loadBLRecent(params = {}) { return []; }

// ===== 兼容单栏目“查看更多”的聚合查询 =====
// 其他地区：TMDB 文档中 with_origin_country 未承诺支持以 | 连接的多个国家。
// 因此每个请求使用一个 ISO 国家代码；把全部国家分为轮换的小批次。
// 第 1-6 页覆盖不同国家，后续页继续相同国家的下一页。
// 此处是“地区发现”而非严格全球热门排行，避免假称为统一全球排序。
var BL_OTHER_COUNTRIES = [
  "CN", "GB", "US", "PH", "HK", "SG", "MY", "VN", "ID", "CA", "AU",
  "FR", "DE", "ES", "IT", "SE", "NO", "DK", "NL", "BE", "IE"
];
var BL_OTHER_BATCH_SIZE = 4;
function blMergeAlternating(groups) {
  var out = [], seen = new Set();
  var maximum = Math.max(0, ...groups.map(function(x) { return x.length; }));
  for (var i = 0; i < maximum; i++) {
    for (var group of groups) {
      var it = group[i];
      if (!it) continue;
      var identity = it.mediaType + ':' + String(it.id);
      if (!seen.has(identity)) {seen.add(identity); out.push(it);}
    }
  }
  return out;
}
async function loadBLOtherRegions(params = {}) {
  var page = Math.max(1, Math.floor(Number(params.page) || 1));
  var cycles = Math.ceil(BL_OTHER_COUNTRIES.length / BL_OTHER_BATCH_SIZE);
  var batch = (page - 1) % cycles;
  var remotePage = Math.floor((page - 1) / cycles) + 1;
  var countries = BL_OTHER_COUNTRIES.slice(batch * BL_OTHER_BATCH_SIZE, (batch + 1) * BL_OTHER_BATCH_SIZE);
  var results = await Promise.allSettled(countries.map(function(country) {
    return loadCatalog({...params, page: remotePage, region: country,
      year: '', sort_by: params.sort_by || 'popular', skipChineseFallback: true}, 'tv', false, false);
  }));
  if (!results.some(function(r) {return r.status === 'fulfilled';})) {
    throw results[0].reason || new Error('其他地区检索失败');
  }
  return blMergeAlternating(results.map(function(r) {return r.status === 'fulfilled' ? r.value : [];}));
}
// 经典作品：以 2019 年为截止，同时保留真人剧集和真人电影。
// 将同一媒体类型内的 TMDB 排序结果交错展示，点击更多时正常分页。
async function loadBLClassics(params = {}) {
  var opts = {...params, sort_by: params.sort_by || 'popular', year: 'classic', region: ''};
  var results = await Promise.allSettled([
    loadCatalog(opts, 'tv', false, false),
    loadCatalog(opts, 'movie', false, false)
  ]);
  if (!results.some(function(r) {return r.status === 'fulfilled';})) {
    throw results[0].reason || new Error('经典作品检索失败');
  }
  var merged = blMergeAlternating(results.map(function(r) {return r.status === 'fulfilled' ? r.value : [];}));
  if (params.sort_by === 'top') merged.sort(function(a,b) {return b.rating - a.rating;});
  if (params.sort_by === 'latest') merged.sort(function(a,b) {return String(b.releaseDate||'').localeCompare(String(a.releaseDate||''));});
  return merged;
}
