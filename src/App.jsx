import { useState } from "react";

// ── Color palette: NBA-inspired dark theme ──
const C = {
    bg: "#0a0e1a",
    card: "#111827",
    cardHover: "#1a2235",
    border: "#1e293b",
    accent: "#c9082a",    // NBA red
    accentLight: "#e8354f",
    gold: "#fbbf24",
    blue: "#1d4ed8",
    blueLight: "#3b82f6",
    green: "#22c55e",
    orange: "#f97316",
    purple: "#a855f7",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    textDim: "#64748b",
};

// ── Raw data (pre-computed from 134 survey responses) ──
const DATA = {
    demographics: {
        gender: [
            { label: "Male", value: 97, pct: 72 },
            { label: "Female", value: 36, pct: 27 },
            { label: "Prefer not to say", value: 1, pct: 1 },
        ],
        age: [
            { label: "19–34", value: 49, pct: 37 },
            { label: "35–54", value: 72, pct: 54 },
            { label: "55+", value: 13, pct: 10 },
        ],
    },
    tiers: [
        { label: "Standard", value: 93, pct: 69, color: C.blueLight },
        { label: "Premium", value: 24, pct: 18, color: C.gold },
        { label: "One-team", value: 12, pct: 9, color: C.green },
        { label: "Student", value: 3, pct: 2, color: C.purple },
        { label: "Audio-only", value: 2, pct: 1, color: C.orange },
    ],
    resubscribe: {
        overall: [
            { label: "Yes", value: 49, pct: 37, color: C.green },
            { label: "Still thinking", value: 51, pct: 38, color: C.gold },
            { label: "No", value: 31, pct: 23, color: C.accent },
            { label: "Switching tier", value: 3, pct: 2, color: C.purple },
        ],
        byTier: {
            Standard: { yes: 32, thinking: 42, no: 24, switching: 2, n: 93 },
            Premium: { yes: 62, thinking: 21, no: 12, switching: 4, n: 24 },
            "One-team": { yes: 33, thinking: 42, no: 25, switching: 0, n: 12 },
        },
    },
    usage: {
        overall: [
            { label: "0", value: 4, pct: 3 },
            { label: "1–2", value: 44, pct: 33 },
            { label: "3–4", value: 49, pct: 37 },
            { label: "5+", value: 37, pct: 28 },
        ],
        byTier: {
            Standard: [
                { label: "0", pct: 2 },
                { label: "1–2", pct: 35 },
                { label: "3–4", pct: 35 },
                { label: "5+", pct: 27 },
            ],
            Premium: [
                { label: "0", pct: 0 },
                { label: "1–2", pct: 25 },
                { label: "3–4", pct: 42 },
                { label: "5+", pct: 33 },
            ],
        },
    },
    features: [
        { label: "Live games", pct: 96, count: 128 },
        { label: "Replays", pct: 37, count: 50 },
        { label: "Stats", pct: 34, count: 45 },
    ],
    platforms: [
        { label: "Social media (IG, TikTok, X)", pct: 72, count: 97 },
        { label: "Sports news (ESPN, Yahoo)", pct: 65, count: 87 },
        { label: "Streaming (ESPN+, Prime, NBC)", pct: 58, count: 78 },
        { label: "Video (YouTube, Twitch)", pct: 56, count: 75 },
        { label: "NBA / Team apps", pct: 34, count: 46 },
    ],
    access: [
        { label: "Both", value: 58, pct: 43 },
        { label: "App only", value: 40, pct: 30 },
        { label: "Website", value: 24, pct: 18 },
        { label: "Amazon", value: 12, pct: 9 },
    ],
    years: [
        { label: "< 1 yr", value: 2, pct: 1 },
        { label: "1 yr", value: 44, pct: 33 },
        { label: "2 yrs", value: 37, pct: 28 },
        { label: "3 yrs", value: 25, pct: 19 },
        { label: "4 yrs", value: 5, pct: 4 },
        { label: "5+ yrs", value: 21, pct: 16 },
    ],
    commentThemes: [
        { theme: "Blackout removal", count: 8, pct: 14 },
        { theme: "Lower pricing", count: 8, pct: 14 },
        { theme: "Better UI / less buggy", count: 5, pct: 9 },
        { theme: "More games / access", count: 5, pct: 9 },
        { theme: "Multi-view / multi-game", count: 3, pct: 5 },
        { theme: "Better streaming quality", count: 2, pct: 3 },
        { theme: "Classic / historical content", count: 2, pct: 3 },
        { theme: "Satisfied / no changes", count: 14, pct: 24 },
    ],
};

// ── Reusable components ──

const Bar = ({ pct, color = C.blueLight, height = 20, animate = true }) => (
    <div style={{
        width: "100%", background: C.border, borderRadius: 4, height,
        overflow: "hidden", position: "relative",
    }}>
        <div style={{
            width: `${pct}%`, height: "100%", background: color,
            borderRadius: 4, transition: animate ? "width 0.8s ease" : "none",
            minWidth: pct > 0 ? 4 : 0,
        }} />
    </div>
);

const StatCard = ({ label, value, sub, accent = false }) => (
    <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: "20px 16px", textAlign: "center",
        borderTop: accent ? `3px solid ${C.accent}` : `1px solid ${C.border}`,
    }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: accent ? C.accentLight : C.text, fontFamily: "'Barlow Condensed', sans-serif" }}>
            {value}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
            {label}
        </div>
        {sub && <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>{sub}</div>}
    </div>
);

const SectionTitle = ({ children, number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 40 }}>
        {number && (
            <span style={{
                background: C.accent, color: "#fff", fontWeight: 700, fontSize: 13,
                width: 28, height: 28, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontFamily: "'Barlow Condensed', sans-serif",
            }}>{number}</span>
        )}
        <h2 style={{
            margin: 0, fontSize: 20, fontWeight: 700, color: C.text,
            fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase",
            letterSpacing: 1.5,
        }}>{children}</h2>
        <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
);

const Insight = ({ children }) => (
    <div style={{
        background: "rgba(201,8,42,0.08)", border: `1px solid rgba(201,8,42,0.2)`,
        borderRadius: 8, padding: "12px 16px", marginTop: 12,
        fontSize: 13, color: C.textMuted, lineHeight: 1.6,
        borderLeft: `3px solid ${C.accent}`,
    }}>
        <span style={{ color: C.accentLight, fontWeight: 600, marginRight: 6 }}>💡 MRD Insight:</span>
        {children}
    </div>
);

// Horizontal grouped bar for re-sub by tier
const ResubByTierChart = () => {
    const tiers = ["Standard", "Premium", "One-team"];
    const categories = [
        { key: "yes", label: "Yes", color: C.green },
        { key: "thinking", label: "Thinking", color: C.gold },
        { key: "no", label: "No", color: C.accent },
    ];
    return (
        <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, justifyContent: "center" }}>
                {categories.map(c => (
                    <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.textMuted }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color }} />
                        {c.label}
                    </div>
                ))}
            </div>
            {tiers.map(tier => {
                const d = DATA.resubscribe.byTier[tier];
                return (
                    <div key={tier} style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>
                            {tier} <span style={{ fontWeight: 400, color: C.textDim }}>(n={d.n})</span>
                        </div>
                        <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                            {categories.map(c => (
                                <div key={c.key} style={{
                                    width: `${d[c.key]}%`, background: c.color, transition: "width 0.8s ease",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, fontWeight: 700, color: "#fff",
                                    minWidth: d[c.key] > 5 ? 30 : 0,
                                }}>
                                    {d[c.key] > 5 ? `${d[c.key]}%` : ""}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ── Tab system ──
const TABS = [
    { id: "overview", label: "Overview" },
    { id: "segments", label: "Segments & Retention" },
    { id: "behavior", label: "Usage & Features" },
    { id: "qualitative", label: "Qualitative Themes" },
    { id: "interviews", label: "Interview Deep-Dives" },
    { id: "mrd", label: "MRD Takeaways" },
];

// ── Interview data ──
const INTERVIEWEES = [
    {
        name: "Nick Sun",
        tier: "Premium",
        emoji: "🦖",
        team: "Raptors",
        location: "NYC (out-of-market)",
        tenure: "3 years",
        usage: "4–5 games/week via Prime + LP",
        resubscribe: "Probably",
        platform: "TV (90%), Laptop when traveling",
        otherApps: "Twitter, Reddit, NBA website, ESPN",
        color: C.accent,
    },
    {
        name: "Arvind",
        tier: "Standard (former)",
        emoji: "🏆",
        team: "Warriors",
        location: "NYC (formerly Bay Area)",
        tenure: "~1 year (2018–19, lapsed)",
        usage: "Highlights only now, no active sub",
        resubscribe: "Only if household member watches",
        platform: "TV with roommates",
        otherApps: "Reddit (r/NBA), Instagram, YouTube",
        color: C.blueLight,
    },
    {
        name: "Juan Saldana",
        tier: "Premium",
        emoji: "🔥",
        team: "Miami Heat",
        location: "Out-of-market",
        tenure: "Active subscriber",
        usage: "5×/week, full games",
        resubscribe: "Depends on how good the Heat are",
        platform: "TV 90%, Laptop 10%",
        otherApps: "YouTube, The Athletic (podcasts)",
        color: C.gold,
    },
];

const INTERVIEW_THEMES = [
    {
        id: "blackouts",
        theme: "Blackouts & Access Fragmentation",
        icon: "🚫",
        color: C.accent,
        hypothesis: "H1 — Single destination",
        surveyLink: "14% of open-ended survey comments mention blackouts as top complaint",
        quotes: [
            {
                person: "Nick Sun",
                text: "Blackout can be very annoying. Raptors vs New York — Prime broadcast, Peacock or TV. Playing the Knicks or Nets, random game not nationally televised, it's not watchable.",
                context: "Describes needing multiple services to watch a single team's games",
            },
            {
                person: "Nick Sun",
                text: "The Knicks have their own app and the Nets have their own app. $20 to buy a single game. Awful experience. $25 a month for Gotham Sports just for Knicks but $42 for Knicks and Nets.",
                context: "Real dollar cost of blackout workarounds — paying $42/mo on top of LP subscription",
            },
            {
                person: "Arvind",
                text: "Blackouts were the most annoying thing. I was in Mountain View, in the Bay Area, so I could watch the Warriors. But the blackout rules were so random.",
                context: "Even in-market fans find blackout logic confusing and arbitrary",
            },
            {
                person: "Juan",
                text: "It depends on how good the Heat are next year.",
                context: "Re-subscription tied entirely to team performance, not product value — blackouts for out-of-market fans compound this",
            },
        ],
        insight: "Blackouts don't just frustrate users — they force subscribers to pay for additional services (Gotham Sports, FanDuel Sports Ohio from survey, Prime) to watch the team they're already paying to follow. This fragments the experience and directly undermines the value proposition of League Pass.",
    },
    {
        id: "illegal",
        theme: "Illegal Streaming as a Real Competitor",
        icon: "☠️",
        color: C.purple,
        hypothesis: "H3 — Value perception",
        surveyLink: "NOT captured in survey data — interviews surfaced this exclusively",
        quotes: [
            {
                person: "Nick Sun",
                text: "It's pretty easy to illegally stream an NBA game.",
                context: "Stated matter-of-factly — not as a threat, just reality",
            },
            {
                person: "Nick Sun",
                text: "You can buy League Pass India, use a VPN and get all the games. Used this years ago.",
                context: "VPN workaround to bypass blackouts at a fraction of the price",
            },
            {
                person: "Arvind",
                text: "Merge the league passes with WNBA. It's available on the illegal streaming sites, it's so easy.",
                context: "Illegal streams offer more access (no blackouts, WNBA included) than the paid product",
            },
            {
                person: "Nick Sun",
                text: "When you do illegal streams that have live comments, the comments get pretty crazy/racist.",
                context: "Even illegal streams have social features (live chat) that LP lacks — but content moderation is terrible",
            },
        ],
        insight: "Illegal streams are a serious competitive threat that the survey completely missed. They offer zero blackouts, social features (live comments), and no cost. League Pass needs to offer something illegal streams can't — quality, reliability, exclusive content, and community that's actually moderated.",
    },
    {
        id: "ui",
        theme: "UI/UX & Streaming Quality Pain",
        icon: "🖥️",
        color: C.blueLight,
        hypothesis: "H2 — Beyond passive consumption",
        surveyLink: "9% of survey comments mention UI/UX issues — interviews reveal specific pain points",
        quotes: [
            {
                person: "Nick Sun",
                text: "The UI for Prime is pretty bad, it doesn't let you skip. Very buggy. A lot of other streaming apps have a Go To Live. It exits the screen. It's really hard to switch to Live mode.",
                context: "Time-shifted viewing (starting 30 min late) is a key use case but UI actively breaks it",
            },
            {
                person: "Nick Sun",
                text: "ESPN has better UI for the stats especially on your phone. Hard to find, doesn't load well.",
                context: "Direct comparison — ESPN wins on mobile stats experience",
            },
            {
                person: "Nick Sun",
                text: "Every website is so bloated. Click 5 things to go to the game you want. Glitchy. The most important stat is the points a player scored and it gets moved lower or to the right.",
                context: "Information architecture failure — core data isn't prioritized",
            },
            {
                person: "Arvind",
                text: "There's a gap between experiencing Netflix versus League Pass. Literally look at Twitch — instant reload, going back and forth, interactiveness, comments. Monetization opportunity.",
                context: "Benchmarking against best-in-class streaming (Netflix for quality, Twitch for interactivity)",
            },
        ],
        insight: "Users benchmark League Pass against Netflix (quality/reliability) and Twitch (interactivity/speed). The current experience falls short on both dimensions. Time-shifted viewing is a key use case that the UI actively sabotages.",
    },
    {
        id: "social",
        theme: "Social & Community Features Gap",
        icon: "💬",
        color: C.green,
        hypothesis: "H2 — Beyond passive consumption",
        surveyLink: "Survey shows 72% use social media for NBA content — interviews explain why",
        quotes: [
            {
                person: "Arvind",
                text: "They could bring in the Reddit experience. Comment sections are always fun. Makes for good content and people can engage. Reddit has moderators; the comments are 'intellectual' not just garbage.",
                context: "Explicitly requests Reddit-style moderated community inside the app",
            },
            {
                person: "Arvind",
                text: "r/NBA is good to keep fans engaged beyond the season.",
                context: "Community keeps fans engaged year-round — something LP doesn't do",
            },
            {
                person: "Arvind",
                text: "The younger gen are obsessed with these streamers and content creators — get NBA players to come on their stream, do cool videos. Jesser on YouTube.",
                context: "Creator content as engagement driver for younger fans",
            },
            {
                person: "Nick Sun",
                text: "When you do illegal streams that have live comments, the comments get pretty crazy/racist.",
                context: "Users want social features but need moderation — an opportunity for LP to do it right",
            },
        ],
        insight: "Fans already have rich community engagement around basketball — it just happens on Reddit, Twitter, and YouTube instead of League Pass. Arvind explicitly asks for this. The opportunity is to bring moderated social engagement into the LP experience to increase daily stickiness and off-season retention.",
    },
    {
        id: "discovery",
        theme: "Feature Discovery Is Near-Zero",
        icon: "🔍",
        color: C.orange,
        hypothesis: "H2 — Beyond passive consumption",
        surveyLink: "Survey: only 34% use Stats, 37% use Replays despite availability",
        quotes: [
            {
                person: "Nick Sun",
                text: "[Do you know about the daily quiz or other features?] No. Don't play Fantasy.",
                context: "3-year Premium subscriber unaware of engagement features",
            },
            {
                person: "Nick Sun",
                text: "Stats and watching are the core values. They should give me some kind of schedule. There would be some nice integrated way.",
                context: "Wants deeper stats integration but doesn't know LP offers stats features",
            },
            {
                person: "Nick Sun",
                text: "Like NO ADs and stadium feed — that's why I pay for Premium. It plugs into the Jumbotron for breaks instead of ads.",
                context: "Discovered Premium value accidentally — stadium feed is beloved but not marketed",
            },
            {
                person: "Arvind",
                text: "When I used to play fantasy I would check stats on the app. Some of my friends still play fantasy but less so now. ESPN fantasy app and NBA app. Fantasy not on NBA app.",
                context: "Fantasy drove app engagement but LP doesn't integrate it — ESPN does",
            },
        ],
        insight: "A 3-year Premium subscriber doesn't know about the daily quiz. A former subscriber used ESPN for fantasy stats because LP doesn't integrate it. Features exist but aren't surfaced. The stadium feed (Jumbotron during breaks) is a Premium differentiator that nobody markets. This is a discovery and onboarding failure, not a feature gap.",
    },
    {
        id: "resub",
        theme: "Re-subscription Tied to External Factors",
        icon: "📉",
        color: C.gold,
        hypothesis: "H3 — Value perception",
        surveyLink: "Survey: 61% are undecided or leaving — interviews reveal the 'why'",
        quotes: [
            {
                person: "Juan",
                text: "It depends on how good the Heat are next year.",
                context: "Re-sub decision driven entirely by team performance, not product satisfaction",
            },
            {
                person: "Arvind",
                text: "If someone else in the household watched basketball I would get league pass.",
                context: "Subscription needs a social/household justification — solo value isn't enough",
            },
            {
                person: "Nick Sun",
                text: "We wouldn't get a league pass if we were Knicks fans.",
                context: "Local market fans don't need LP — it only works for out-of-market fans, limiting the addressable market",
            },
            {
                person: "Nick Sun",
                text: "Overall it's a good product when you want it to work. 3 years. Best last year on YouTube TV.",
                context: "Even a loyal subscriber frames value conditionally — 'when you want it to work'",
            },
        ],
        insight: "Re-subscription decisions are driven by team performance and household dynamics, not product loyalty. This means LP can't control its churn drivers unless it builds value that transcends any single team's season — year-round engagement, community, and content that keeps fans connected even when their team is losing.",
    },
];

export default function NBADashboard() {
    const [tab, setTab] = useState("overview");

    return (
        <div style={{
            background: C.bg, color: C.text, minHeight: "100vh",
            fontFamily: "'DM Sans', sans-serif", padding: 0,
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #0a0e1a 0%, #1a0a0f 50%, #0a0e1a 100%)",
                borderBottom: `1px solid ${C.border}`, padding: "28px 32px 20px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <span style={{ fontSize: 28 }}>🏀</span>
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: 2,
                            fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase",
                            background: "linear-gradient(90deg, #fff, #e8354f)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>
                            NBA League Pass — Survey Analysis
                        </h1>
                        <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>
                            Market Requirements Document · 134 Respondents · Feb 2026 · Group 3
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, marginTop: 20, overflowX: "auto" }}>
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{
                            background: tab === t.id ? C.accent : "transparent",
                            color: tab === t.id ? "#fff" : C.textMuted,
                            border: `1px solid ${tab === t.id ? C.accent : C.border}`,
                            borderRadius: 6, padding: "8px 16px", fontSize: 12, fontWeight: 600,
                            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "0 32px 40px", maxWidth: 960, margin: "0 auto" }}>

                {/* ═══ OVERVIEW TAB ═══ */}
                {tab === "overview" && (
                    <div>
                        <SectionTitle number="1">Sample Overview</SectionTitle>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                            <StatCard label="Respondents" value="134" accent />
                            <StatCard label="Standard Tier" value="69%" sub="93 of 134" />
                            <StatCard label="At-Risk" value="61%" sub="No or Thinking" accent />
                            <StatCard label="Avg Tenure" value="2.3 yr" sub="Median: 2 yrs" />
                        </div>

                        <SectionTitle number="2">Demographics</SectionTitle>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                                <h3 style={{ fontSize: 13, color: C.textMuted, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1 }}>Gender</h3>
                                {DATA.demographics.gender.map(d => (
                                    <div key={d.label} style={{ marginBottom: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                                            <span>{d.label}</span>
                                            <span style={{ color: C.textDim }}>{d.value} ({d.pct}%)</span>
                                        </div>
                                        <Bar pct={d.pct} color={d.label === "Male" ? C.blueLight : d.label === "Female" ? C.accentLight : C.textDim} />
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                                <h3 style={{ fontSize: 13, color: C.textMuted, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 1 }}>Age Distribution</h3>
                                {DATA.demographics.age.map(d => (
                                    <div key={d.label} style={{ marginBottom: 12 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                                            <span>{d.label}</span>
                                            <span style={{ color: C.textDim }}>{d.value} ({d.pct}%)</span>
                                        </div>
                                        <Bar pct={d.pct} color={d.label === "19–34" ? C.green : d.label === "35–54" ? C.blueLight : C.gold} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <SectionTitle number="3">Tier Distribution</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                            {DATA.tiers.map(d => (
                                <div key={d.label} style={{ marginBottom: 14 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600 }}>{d.label}</span>
                                        <span style={{ color: C.textDim }}>{d.value} ({d.pct}%)</span>
                                    </div>
                                    <Bar pct={d.pct} color={d.color} />
                                </div>
                            ))}
                            <Insight>
                                Standard tier dominates at 69% of subscribers, confirming the PM's guidance that this is the largest bucket and the right focus segment. Only 18% are Premium — a significant upsell opportunity if the right value proposition is offered.
                            </Insight>
                        </div>

                        <SectionTitle number="4">Subscriber Tenure</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140, marginBottom: 8 }}>
                                {DATA.years.map(d => (
                                    <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <span style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{d.pct}%</span>
                                        <div style={{
                                            width: "100%", maxWidth: 60, height: `${(d.pct / 35) * 120}px`,
                                            background: `linear-gradient(180deg, ${C.blueLight}, ${C.blue})`,
                                            borderRadius: "4px 4px 0 0", transition: "height 0.5s ease",
                                        }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {DATA.years.map(d => (
                                    <div key={d.label} style={{ flex: 1, textAlign: "center", fontSize: 10, color: C.textDim }}>{d.label}</div>
                                ))}
                            </div>
                            <Insight>
                                61% of subscribers have been on League Pass for 1–2 years, suggesting a relatively young subscriber base. Retention past year 2 appears to be a challenge — only 39% have been subscribed for 3+ years.
                            </Insight>
                        </div>
                    </div>
                )}

                {/* ═══ SEGMENTS & RETENTION TAB ═══ */}
                {tab === "segments" && (
                    <div>
                        <SectionTitle number="1">Re-subscription Intent (Overall)</SectionTitle>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                            {DATA.resubscribe.overall.map(d => (
                                <div key={d.label} style={{
                                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                                    padding: 20, textAlign: "center", borderTop: `3px solid ${d.color}`,
                                }}>
                                    <div style={{ fontSize: 36, fontWeight: 700, color: d.color, fontFamily: "'Barlow Condensed', sans-serif" }}>
                                        {d.pct}%
                                    </div>
                                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{d.label}</div>
                                    <div style={{ fontSize: 11, color: C.textDim }}>{d.value} subscribers</div>
                                </div>
                            ))}
                        </div>
                        <Insight>
                            Only 37% of subscribers said "Yes" to re-subscribing. 61% are either undecided or planning to leave — this is a critical retention risk and the core problem your MRD should address.
                        </Insight>

                        <SectionTitle number="2">Re-subscription by Tier</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            <ResubByTierChart />
                            <Insight>
                                Premium subscribers are nearly 2× more likely to re-subscribe (62%) vs Standard (32%). This validates Hypothesis 3: Standard subscribers don't see enough value to stay or upgrade. The "still thinking" cohort (42% of Standard) is the swing group — converting even half would significantly improve retention.
                            </Insight>
                        </div>

                        <SectionTitle number="3">Churn Risk Matrix</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{
                                    background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                                    borderRadius: 8, padding: 16,
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>✅ Low Risk — Premium "Yes"</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: C.green, fontFamily: "'Barlow Condensed', sans-serif" }}>15 subscribers</div>
                                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Loyal, high-value. 62% retention rate. These are your superfans.</div>
                                </div>
                                <div style={{
                                    background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
                                    borderRadius: 8, padding: 16,
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 8 }}>⚠️ Medium Risk — Standard "Thinking"</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: C.gold, fontFamily: "'Barlow Condensed', sans-serif" }}>39 subscribers</div>
                                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Largest swing group. Represent the biggest retention opportunity. Need a reason to stay.</div>
                                </div>
                                <div style={{
                                    background: "rgba(201,8,42,0.08)", border: "1px solid rgba(201,8,42,0.2)",
                                    borderRadius: 8, padding: 16,
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.accentLight, marginBottom: 8 }}>🚨 High Risk — Standard "No"</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: C.accentLight, fontFamily: "'Barlow Condensed', sans-serif" }}>22 subscribers</div>
                                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Already decided to leave. Price and blackouts are top complaints. Hard to win back.</div>
                                </div>
                                <div style={{
                                    background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
                                    borderRadius: 8, padding: 16,
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.purple, marginBottom: 8 }}>🔄 Upsell Opportunity</div>
                                    <div style={{ fontSize: 24, fontWeight: 700, color: C.purple, fontFamily: "'Barlow Condensed', sans-serif" }}>30 Standard "Yes"</div>
                                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Committed Standard subscribers. Prime candidates for Premium upgrade with the right incentive.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ USAGE & FEATURES TAB ═══ */}
                {tab === "behavior" && (
                    <div>
                        <SectionTitle number="1">Weekly Usage Frequency</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 160, marginBottom: 8 }}>
                                {DATA.usage.overall.map((d, i) => (
                                    <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{d.pct}%</span>
                                        <span style={{ fontSize: 11, color: C.textDim, marginBottom: 4 }}>{d.value}</span>
                                        <div style={{
                                            width: "80%", height: `${(d.pct / 40) * 120}px`,
                                            background: `linear-gradient(180deg, ${C.accentLight}, ${C.accent})`,
                                            borderRadius: "6px 6px 0 0",
                                        }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                {DATA.usage.overall.map(d => (
                                    <div key={d.label} style={{ flex: 1, textAlign: "center", fontSize: 12, color: C.textMuted }}>{d.label}×/wk</div>
                                ))}
                            </div>
                            <Insight>
                                65% of subscribers use League Pass 3+ times per week — this is an engaged audience. But 36% use it only 0–2 times, suggesting the app isn't sticky enough for daily engagement. This validates Hypothesis 1: League Pass feels like a "game-night-only" utility.
                            </Insight>
                        </div>

                        <SectionTitle number="2">Features Used</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            {DATA.features.map(d => (
                                <div key={d.label} style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                                        <span style={{ fontWeight: 600 }}>{d.label}</span>
                                        <span style={{ color: C.textDim }}>{d.count} ({d.pct}%)</span>
                                    </div>
                                    <Bar pct={d.pct} color={d.pct > 80 ? C.accent : d.pct > 35 ? C.blueLight : C.gold} height={24} />
                                </div>
                            ))}
                            <Insight>
                                Live games completely dominate (96%), while Replays (37%) and Stats (34%) are underutilized. The gap between live game usage and everything else is massive — it confirms that subscribers see League Pass as a live streaming tool only, not a comprehensive NBA platform. This is the core of Hypothesis 2: users want more than passive consumption but don't discover or value the other features.
                            </Insight>
                        </div>

                        <SectionTitle number="3">Platform Fragmentation</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            {DATA.platforms.map(d => (
                                <div key={d.label} style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                                        <span style={{ fontWeight: 600 }}>{d.label}</span>
                                        <span style={{ color: C.textDim }}>{d.count} ({d.pct}%)</span>
                                    </div>
                                    <Bar pct={d.pct} color={C.orange} height={24} />
                                </div>
                            ))}
                            <Insight>
                                72% of League Pass subscribers also use social media for NBA content, and 65% use sports news apps. This validates Hypothesis 1: fans are juggling multiple platforms because League Pass doesn't serve as a single destination. The average subscriber uses 2.9 other platform categories beyond League Pass.
                            </Insight>
                        </div>

                        <SectionTitle number="4">Access Method</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                                {DATA.access.map(d => (
                                    <div key={d.label} style={{ textAlign: "center" }}>
                                        <div style={{
                                            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 8px",
                                            background: `conic-gradient(${C.blueLight} 0% ${d.pct}%, ${C.border} ${d.pct}% 100%)`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <div style={{
                                                width: 60, height: 60, borderRadius: "50%", background: C.card,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 16, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif",
                                            }}>{d.pct}%</div>
                                        </div>
                                        <div style={{ fontSize: 12, color: C.textMuted }}>{d.label}</div>
                                    </div>
                                ))}
                            </div>
                            <Insight>
                                43% use both app and website, suggesting cross-device behavior. 9% access through Amazon — relatively low given the new partnership, supporting the PM's note that Amazon is underperforming expectations.
                            </Insight>
                        </div>
                    </div>
                )}

                {/* ═══ QUALITATIVE TAB ═══ */}
                {tab === "qualitative" && (
                    <div>
                        <SectionTitle number="1">Open-Ended Response Themes</SectionTitle>
                        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
                            58 of 134 respondents (43%) left substantive comments. We categorized them into themes:
                        </p>

                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            {DATA.commentThemes.map((d, i) => (
                                <div key={d.theme} style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                                        <span style={{ fontWeight: 600 }}>{d.theme}</span>
                                        <span style={{ color: C.textDim }}>{d.count} mentions ({d.pct}%)</span>
                                    </div>
                                    <Bar pct={d.pct * 3} color={i < 2 ? C.accent : i < 4 ? C.gold : i < 7 ? C.blueLight : C.green} height={20} />
                                </div>
                            ))}
                        </div>

                        <SectionTitle number="2">Representative Quotes by Theme</SectionTitle>

                        {[
                            {
                                theme: "🚫 Blackouts",
                                color: C.accent,
                                quotes: [
                                    { tier: "Premium", quote: "I wish there was no blackout when I use league pass" },
                                    { tier: "Standard", quote: "The removal of local team blackouts. It shouldn't be easier to watch other teams outside my area than the actual local team I support." },
                                    { tier: "Standard", quote: "Fewer blackouts, more and more games blacked out due to being on other platforms" },
                                    { tier: "One-team", quote: "I kept having Cavs games blacked out and could not understand why. I ended up even paying for FanDuel Sports Ohio to see more games" },
                                ],
                            },
                            {
                                theme: "💰 Pricing",
                                color: C.gold,
                                quotes: [
                                    { tier: "Standard", quote: "I just would like to see the price dropped" },
                                    { tier: "Standard", quote: "For new and long-term members, a discount code to renew League Pass. Also, a discount on team merch." },
                                    { tier: "Standard", quote: "I will probably cancel to save some money" },
                                ],
                            },
                            {
                                theme: "🖥️ UI / UX & Quality",
                                color: C.blueLight,
                                quotes: [
                                    { tier: "Standard", quote: "Better and faster user interface which is less buggy" },
                                    { tier: "Standard", quote: "A better UI/UX" },
                                    { tier: "Premium", quote: "Improved hide scores settings across all devices to ensure games are not spoiled" },
                                    { tier: "Standard", quote: "The picture needs to be clearer" },
                                ],
                            },
                            {
                                theme: "📺 More Content / Games",
                                color: C.green,
                                quotes: [
                                    { tier: "Standard", quote: "All games available" },
                                    { tier: "Standard", quote: "Classic games" },
                                    { tier: "One-team", quote: "Access to all games, even if they are on Prime" },
                                    { tier: "Standard", quote: "Get rid of blackouts. Include pre-game shows." },
                                ],
                            },
                        ].map(section => (
                            <div key={section.theme} style={{
                                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                                padding: 20, marginBottom: 16, borderLeft: `3px solid ${section.color}`,
                            }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: section.color, margin: "0 0 12px" }}>
                                    {section.theme}
                                </h3>
                                {section.quotes.map((q, i) => (
                                    <div key={i} style={{
                                        fontSize: 13, color: C.textMuted, marginBottom: 10, paddingLeft: 12,
                                        borderLeft: `2px solid ${C.border}`, lineHeight: 1.5,
                                    }}>
                                        "{q.quote}"
                                        <span style={{ fontSize: 11, color: C.textDim, marginLeft: 8 }}>— {q.tier} subscriber</span>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <Insight>
                            The two most common pain points — blackouts (14%) and pricing (14%) — represent structural issues tied to NBA broadcast deals. UI/UX complaints (9%) and requests for more game access (9%) represent product-level opportunities that League Pass can directly address. The One-team subscriber who paid for a separate service (FanDuel Sports Ohio) just to watch blacked-out home games is a powerful example of broken user experience.
                        </Insight>
                    </div>
                )}

                {/* ═══ INTERVIEW DEEP-DIVES TAB ═══ */}
                {tab === "interviews" && (
                    <div>
                        <SectionTitle number="1">Interviewee Profiles</SectionTitle>
                        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
                            3 in-depth interviews conducted with League Pass subscribers / former subscribers. These provide the causal "why" behind the survey's quantitative findings.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                            {INTERVIEWEES.map(p => (
                                <div key={p.name} style={{
                                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                                    padding: 20, borderTop: `3px solid ${p.color}`,
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                        <span style={{ fontSize: 28 }}>{p.emoji}</span>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{p.name}</div>
                                            <div style={{ fontSize: 11, color: C.textDim }}>{p.team} fan · {p.location}</div>
                                        </div>
                                    </div>
                                    {[
                                        ["Tier", p.tier],
                                        ["Tenure", p.tenure],
                                        ["Usage", p.usage],
                                        ["Re-sub?", p.resubscribe],
                                        ["Platform", p.platform],
                                        ["Other apps", p.otherApps],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ display: "flex", fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>
                                            <span style={{ color: C.textDim, minWidth: 75, flexShrink: 0 }}>{label}</span>
                                            <span style={{ color: C.textMuted }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <SectionTitle number="2">Thematic Analysis — Mapped to Hypotheses</SectionTitle>
                        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
                            Each theme below synthesizes interview quotes, maps them to your team's hypotheses, and connects to the quantitative survey findings.
                        </p>

                        {INTERVIEW_THEMES.map((t, idx) => (
                            <div key={t.id} style={{
                                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                                marginBottom: 20, overflow: "hidden",
                            }}>
                                {/* Theme header */}
                                <div style={{
                                    padding: "16px 20px", borderBottom: `1px solid ${C.border}`,
                                    background: `linear-gradient(135deg, ${t.color}11, transparent)`,
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 22 }}>{t.icon}</span>
                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5 }}>
                                                {t.theme}
                                            </div>
                                            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                                                Maps to: {t.hypothesis}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
                                        background: `${t.color}22`, color: t.color, whiteSpace: "nowrap",
                                    }}>
                                        Theme {idx + 1} of {INTERVIEW_THEMES.length}
                                    </span>
                                </div>

                                {/* Survey connection banner */}
                                <div style={{
                                    padding: "10px 20px", background: "rgba(59,130,246,0.06)",
                                    borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.blueLight,
                                    display: "flex", alignItems: "center", gap: 8,
                                }}>
                                    <span>📊</span>
                                    <span>Survey connection: {t.surveyLink}</span>
                                </div>

                                {/* Quotes */}
                                <div style={{ padding: "16px 20px" }}>
                                    {t.quotes.map((q, qi) => (
                                        <div key={qi} style={{
                                            marginBottom: qi < t.quotes.length - 1 ? 16 : 0,
                                            padding: "12px 16px",
                                            background: qi % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                                            borderRadius: 8,
                                            borderLeft: `3px solid ${t.color}44`,
                                        }}>
                                            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, fontStyle: "italic", marginBottom: 6 }}>
                                                "{q.text}"
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 11, fontWeight: 600, color: t.color }}>— {q.person}</span>
                                                <span style={{ fontSize: 11, color: C.textDim, maxWidth: "60%", textAlign: "right" }}>{q.context}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Insight */}
                                <div style={{
                                    padding: "14px 20px", borderTop: `1px solid ${C.border}`,
                                    background: `${t.color}08`, fontSize: 13, color: C.textMuted, lineHeight: 1.6,
                                }}>
                                    <span style={{ color: t.color, fontWeight: 700, marginRight: 6 }}>→ Insight:</span>
                                    {t.insight}
                                </div>
                            </div>
                        ))}

                        <SectionTitle number="3">Interview vs. Survey — What Interviews Uniquely Revealed</SectionTitle>
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, fontSize: 13 }}>
                                {/* Header */}
                                <div style={{ padding: "10px 12px", background: C.accent, borderRadius: "8px 0 0 0", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                                    Survey Captured
                                </div>
                                <div style={{ padding: "10px 12px", background: C.blue, borderRadius: "0 8px 0 0", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                                    Interviews Uniquely Added
                                </div>
                                {[
                                    ["Blackouts are the #1 complaint (14%)", "Specific $ cost: $20/game, $42/mo for Gotham Sports on top of LP"],
                                    ["72% use social media for NBA content", "Users want Reddit-style moderated community INSIDE the app"],
                                    ["Only 34% use Stats features", "ESPN's mobile stats UI is explicitly better; Fantasy isn't integrated"],
                                    ["9% mention UI/UX issues", "Time-shifted viewing is broken; Prime's skip/rewind is buggy; benchmarked vs Netflix & Twitch"],
                                    ["61% uncertain about re-subscribing", "Re-sub tied to team performance & household dynamics, not product quality"],
                                    ["—", "Illegal streaming is a serious, easy competitor with social features LP lacks"],
                                    ["—", "3-year Premium user didn't know about daily quiz; stadium feed is the hidden gem of Premium"],
                                    ["—", "VPN workarounds (buying LP India) used to bypass blackouts at a fraction of cost"],
                                ].map(([survey, interview], i) => (
                                    <>
                                        <div key={`s${i}`} style={{
                                            padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
                                            color: survey === "—" ? C.textDim : C.textMuted,
                                            background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                                        }}>
                                            {survey}
                                        </div>
                                        <div key={`i${i}`} style={{
                                            padding: "10px 12px", borderBottom: `1px solid ${C.border}`,
                                            color: C.text, fontWeight: survey === "—" ? 600 : 400,
                                            background: i % 2 === 0 ? "rgba(59,130,246,0.04)" : "rgba(59,130,246,0.02)",
                                        }}>
                                            {interview}
                                        </div>
                                    </>
                                ))}
                            </div>
                            <Insight>
                                The interviews filled three critical gaps the survey missed entirely: (1) illegal streaming as a competitive threat with social features, (2) the real dollar cost subscribers pay to work around blackouts, and (3) feature discovery failure even among loyal Premium subscribers. These qualitative insights provide the "why" and the narrative needed for a compelling MRD.
                            </Insight>
                        </div>
                    </div>
                )}

                {/* ═══ MRD TAKEAWAYS TAB ═══ */}
                {tab === "mrd" && (
                    <div>
                        <SectionTitle number="1">Hypothesis Validation Summary</SectionTitle>

                        {[
                            {
                                hyp: "H1: League Pass feels like a 'game-night-only' utility — fans juggle multiple apps",
                                status: "✅ Validated",
                                statusColor: C.green,
                                evidence: [
                                    "96% use League Pass primarily for live games; Replays (37%) and Stats (34%) are underused",
                                    "72% also use social media, 65% use sports news apps, 56% use YouTube/Twitch for NBA content",
                                    "Average subscriber uses ~2.9 other platform categories — League Pass is not a single destination",
                                    "🎙️ Nick: Uses Twitter, Reddit, ESPN, NBA website alongside LP — 'ESPN has better UI for stats'",
                                    "🎙️ Arvind: Gets NBA content from Reddit, Instagram highlight accounts, and YouTube — doesn't need LP for it",
                                ],
                            },
                            {
                                hyp: "H2: Subscribers want more than passive video but don't discover other features",
                                status: "✅ Validated",
                                statusColor: C.green,
                                evidence: [
                                    "Only 34% use Stats features despite being available to all tiers",
                                    "Qualitative feedback asks for multi-view, classic games, pre-game shows — features beyond basic streaming",
                                    "36% use League Pass only 0–2 times per week, suggesting low stickiness outside game nights",
                                    "🎙️ Nick (3yr Premium): Didn't know about daily quiz. Loves stadium feed but discovered it by accident",
                                    "🎙️ Arvind: Wants Reddit-style comments and Twitch-like interactivity — 'monetization opportunity'",
                                ],
                            },
                            {
                                hyp: "H3: Standard subscribers don't upgrade because Premium benefits don't match their pain points",
                                status: "✅ Validated",
                                statusColor: C.green,
                                evidence: [
                                    "Only 32% of Standard subscribers plan to re-subscribe vs 62% for Premium",
                                    "Top complaints (blackouts, pricing) aren't solved by Premium upgrade",
                                    "Premium benefits (no ads, 4K) don't address the 'more games' and 'better UX' needs Standard users express",
                                    "🎙️ Juan: Re-sub depends on Heat's performance — product value alone isn't enough to retain",
                                    "🎙️ Nick & Arvind: Illegal streams offer no blackouts + social features for free — LP's paid experience must exceed this",
                                ],
                            },
                        ].map((h, i) => (
                            <div key={i} style={{
                                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                                padding: 24, marginBottom: 16,
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, flex: 1, lineHeight: 1.5 }}>{h.hyp}</div>
                                    <span style={{
                                        background: `${h.statusColor}22`, color: h.statusColor, fontSize: 12,
                                        fontWeight: 700, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 12,
                                    }}>{h.status}</span>
                                </div>
                                <div style={{ fontSize: 13, color: C.textMuted }}>
                                    {h.evidence.map((e, j) => (
                                        <div key={j} style={{ marginBottom: 6, paddingLeft: 16, position: "relative" }}>
                                            <span style={{ position: "absolute", left: 0, color: C.textDim }}>•</span>
                                            {e}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <SectionTitle number="2">Key Findings for MRD</SectionTitle>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {[
                                {
                                    title: "🎯 Target Segment",
                                    body: "Standard subscribers (69% of base, n=93). Highest churn risk at 66% undecided or leaving. Largest revenue impact opportunity.",
                                    color: C.accent,
                                },
                                {
                                    title: "📊 Retention Crisis",
                                    body: "Only 37% of all subscribers definitively plan to re-subscribe. The 39 Standard 'Still thinking' subscribers are the swing group — converting them is the #1 priority.",
                                    color: C.gold,
                                },
                                {
                                    title: "🔀 Platform Fragmentation",
                                    body: "Subscribers use ~3 other platform categories for NBA content. League Pass isn't winning the 'daily NBA destination' battle against social media and ESPN.",
                                    color: C.blueLight,
                                },
                                {
                                    title: "🚫 Blackout Pain",
                                    body: "Blackouts are the #1 qualitative complaint. One subscriber literally pays for a second service to watch blacked-out home games. This drives churn directly.",
                                    color: C.orange,
                                },
                                {
                                    title: "💡 Feature Discovery Gap",
                                    body: "63–66% of subscribers don't use Replays or Stats. The product has features beyond live streaming, but users don't know about or value them.",
                                    color: C.green,
                                },
                                {
                                    title: "💰 Value Perception",
                                    body: "Pricing is the #2 complaint despite a price freeze this year. Premium has 2× better retention — the answer may not be lower prices but better perceived value.",
                                    color: C.purple,
                                },
                            ].map((card, i) => (
                                <div key={i} style={{
                                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                                    padding: 20, borderTop: `3px solid ${card.color}`,
                                }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{card.title}</div>
                                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{card.body}</div>
                                </div>
                            ))}
                        </div>

                        <SectionTitle number="3">Recommended MRD Product Direction</SectionTitle>
                        <div style={{
                            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                            padding: 24,
                        }}>
                            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: "0 0 16px" }}>
                                Based on the survey data, the MRD should articulate three priority unmet needs as Jobs-to-be-Done:
                            </p>
                            {[
                                {
                                    jtbd: "When I'm following the NBA throughout the day, I want a single app that gives me scores, news, highlights, and live games — so I don't have to switch between Twitter, ESPN, YouTube, and League Pass.",
                                    priority: "HIGH",
                                    supporting: "Survey: 72% use social media, 65% use ESPN/Yahoo, 56% use YouTube alongside LP. Interviews: Nick uses 4+ apps daily; Arvind gets NBA content from Reddit & Instagram, not LP",
                                },
                                {
                                    jtbd: "When I'm paying for League Pass, I want to watch my team's games without blackouts — so I don't feel like I'm paying for a product that doesn't deliver on its core promise.",
                                    priority: "HIGH",
                                    supporting: "Survey: #1 complaint. Interviews: Nick pays $42/mo extra for Gotham Sports; survey respondent pays for FanDuel Sports Ohio; VPN/illegal stream workarounds common",
                                },
                                {
                                    jtbd: "When I'm deciding whether to re-subscribe, I want to feel like League Pass offers more value than just live games — so the subscription feels worth it year-round, not just during the season.",
                                    priority: "MEDIUM",
                                    supporting: "Survey: 96% use only live games; 61% uncertain about re-subscribing. Interviews: Juan's re-sub depends on team performance; Arvind says r/NBA keeps fans engaged in offseason better than LP",
                                },
                            ].map((j, i) => (
                                <div key={i} style={{
                                    marginBottom: 20, padding: 16, borderRadius: 8,
                                    background: i === 0 ? "rgba(201,8,42,0.06)" : i === 1 ? "rgba(251,191,36,0.06)" : "rgba(59,130,246,0.06)",
                                    border: `1px solid ${i === 0 ? "rgba(201,8,42,0.15)" : i === 1 ? "rgba(251,191,36,0.15)" : "rgba(59,130,246,0.15)"}`,
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>
                                            JTBD #{i + 1}
                                        </span>
                                        <span style={{
                                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                                            background: j.priority === "HIGH" ? "rgba(201,8,42,0.2)" : "rgba(59,130,246,0.2)",
                                            color: j.priority === "HIGH" ? C.accentLight : C.blueLight,
                                        }}>
                                            {j.priority} PRIORITY
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.5, marginBottom: 8 }}>
                                        "{j.jtbd}"
                                    </div>
                                    <div style={{ fontSize: 12, color: C.textDim }}>
                                        📊 Supporting data: {j.supporting}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
