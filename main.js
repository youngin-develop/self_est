// --- State Management ---
const State = {
    scores: JSON.parse(localStorage.getItem('elevate-scores')) || {
        exercise: 0,
        diet: 0,
        skin: 0,
        fashion: 0,
        hair: 0,
        dating: 0,
        career: 0
    },
    updateScore(pillar, score) {
        this.scores[pillar] = score;
        localStorage.setItem('elevate-scores', JSON.stringify(this.scores));
        window.dispatchEvent(new CustomEvent('state-change', { detail: { pillar, score } }));
    },
    getAverage() {
        const values = Object.values(this.scores);
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    }
};

// --- Mock AI Data Service ---
const AIService = {
    async getInsights(pillar, score) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const insights = {
            exercise: [
                "기초 체력이 부족합니다. 주 3회 걷기부터 시작하세요.",
                "적절한 운동량을 유지 중입니다. 고강도 인터벌 트레이닝(HIIT)을 추천합니다.",
                "최상위 수준의 체력입니다. 프로 선수 수준의 영양 전략이 필요합니다."
            ],
            diet: [
                "정제 탄수화물을 줄이고 단백질 섭취량을 늘리세요.",
                "식단이 안정적입니다. 오메가-3와 유산균 등 보조제를 고려해 보세요.",
                "완벽한 영양 밸런스입니다. 현재 루틴을 유지하며 수분 섭취를 늘리세요."
            ],
            skin: [
                "유수분 밸런스가 깨져 있습니다. 약산성 클렌저로 교체해 보세요.",
                "전반적으로 양호합니다. 주 1회 각질 제거와 수분 팩을 추천합니다.",
                "피부 장벽이 매우 탄탄합니다. 안티에이징 기능성 제품을 추가해 보세요."
            ],
            fashion: [
                "기본 아이템(흰 티, 슬랙스)부터 갖추는 것이 중요합니다.",
                "본인만의 스타일이 잡혀 있습니다. 액세서리를 활용한 디테일을 높여보세요.",
                "트렌드 세터 수준입니다. 본인만의 독창적인 레이어링 기법을 개발하세요."
            ],
            hair: [
                "두피 상태가 불안정합니다. 두피 스케일링 샴푸를 추천합니다.",
                "모발 상태가 건강합니다. 현재의 샴푸 주기를 유지하세요.",
                "전문적인 관리가 돋보입니다. 단백질 트리트먼트로 광택을 더하세요."
            ],
            dating: [
                "경청의 기술을 익히는 것이 우선입니다. 타인의 감정에 공감하는 연습을 하세요.",
                "매우 매력적인 소통 능력을 가졌습니다. 진정성 있는 관계 맺기에 집중하세요.",
                "정서적 지능이 탁월합니다. 관계에서의 리더십을 발휘할 때입니다."
            ],
            career: [
                "직무 관련 자격증이나 교육을 통해 전문성을 보강해야 합니다.",
                "성과 지표가 좋습니다. 네트워킹을 통해 시야를 넓히는 것을 추천합니다.",
                "업계 리더 수준입니다. 지식 공유나 멘토링을 통해 영향력을 확대하세요."
            ]
        };

        const level = score < 30 ? 0 : score < 70 ? 1 : 2;
        return insights[pillar][level];
    }
};

// --- Web Components ---

// 1. Pillar Card Component
class PillarCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const type = this.getAttribute('type');
        const label = this.getAttribute('label');
        const icon = this.getAttribute('icon');
        const currentScore = State.scores[type] || 0;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 1.5rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                }
                .card:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-5px);
                    border-color: oklch(70% 0.18 180 / 0.5);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
                h3 { margin: 0; font-size: 1.5rem; color: #fff; }
                .score-bar {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    margin-top: 1rem;
                    border-radius: 2px;
                }
                .score-fill {
                    height: 100%;
                    background: oklch(70% 0.18 180);
                    border-radius: 2px;
                    transition: width 0.5s ease;
                }
                .assessment-mode {
                    display: none;
                    margin-top: 1rem;
                }
                .active .assessment-mode { display: block; }
                input[type="range"] {
                    width: 100%;
                    margin: 1rem 0;
                    accent-color: oklch(70% 0.18 180);
                }
                button {
                    background: oklch(70% 0.18 180);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    color: #000;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                }
            </style>
            <div class="card" id="card">
                <span class="icon">${icon}</span>
                <h3>${label}</h3>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${currentScore}%"></div>
                </div>
                <div class="assessment-mode" id="assessment">
                    <p>당신의 객관적 점수: <span id="score-display">${currentScore}</span></p>
                    <input type="range" min="0" max="100" value="${currentScore}" id="score-slider">
                    <button id="save-btn">진단 완료</button>
                </div>
            </div>
        `;

        const card = this.shadowRoot.getElementById('card');
        const assessment = this.shadowRoot.getElementById('assessment');
        const slider = this.shadowRoot.getElementById('score-slider');
        const display = this.shadowRoot.getElementById('score-display');
        const saveBtn = this.shadowRoot.getElementById('save-btn');
        const fill = this.shadowRoot.querySelector('.score-fill');

        card.addEventListener('click', (e) => {
            if (e.target.closest('#assessment')) return;
            card.classList.toggle('active');
        });

        slider.addEventListener('input', () => {
            display.textContent = slider.value;
            fill.style.width = slider.value + '%';
        });

        saveBtn.addEventListener('click', () => {
            State.updateScore(type, parseInt(slider.value));
            card.classList.remove('active');
            
            // Show AI Insight Panel
            const insightPanel = document.querySelector('ai-insight-panel');
            insightPanel.show(type, slider.value);
        });
    }
}
customElements.define('pillar-card', PillarCard);

// 2. Growth Dashboard Component
class GrowthDashboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        window.addEventListener('state-change', () => this.render());
    }

    render() {
        const avg = State.getAverage();
        this.shadowRoot.innerHTML = `
            <style>
                .dashboard-content { text-align: center; }
                .avg-score { font-size: 5rem; font-weight: 900; color: oklch(70% 0.18 180); }
                .label { font-size: 1.2rem; color: rgba(255, 255, 255, 0.6); }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .mini-pillar {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                }
                .mini-score { font-weight: bold; display: block; font-size: 1.2rem; }
            </style>
            <div class="dashboard-content">
                <div class="avg-score">${avg}</div>
                <div class="label">종합 성장 지수</div>
                <div class="grid">
                    ${Object.entries(State.scores).map(([k, v]) => `
                        <div class="mini-pillar">
                            <span class="mini-score">${v}</span>
                            <span style="font-size: 0.8rem; opacity: 0.6">${k.toUpperCase()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}
customElements.define('growth-dashboard', GrowthDashboard);

// 3. AI Insight Panel Component
class AIInsightPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                .overlay.visible { opacity: 1; pointer-events: auto; }
                .panel {
                    background: oklch(25% 0.05 260);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 3rem;
                    border-radius: 32px;
                    max-width: 600px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                .loading { display: none; }
                .loading.active { display: block; }
                .content { display: none; }
                .content.active { display: block; }
                .ai-tag {
                    display: inline-block;
                    padding: 0.4rem 1rem;
                    background: oklch(70% 0.18 180 / 0.2);
                    color: oklch(70% 0.18 180);
                    border-radius: 100px;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                }
                h2 { margin-bottom: 1rem; font-family: 'Montserrat'; }
                p { font-size: 1.2rem; color: var(--text-secondary); line-height: 1.8; }
            </style>
            <div class="overlay" id="overlay">
                <div class="panel">
                    <button class="close-btn" id="close">&times;</button>
                    <div class="loading" id="loader">
                        <div class="ai-tag">AI ANALYSIS</div>
                        <h2>당신의 데이터를 분석 중입니다...</h2>
                    </div>
                    <div class="content" id="content">
                        <div class="ai-tag">AI INSIGHT</div>
                        <h2 id="title">카테고리 분석 결과</h2>
                        <p id="insight-text"></p>
                        <button id="ok-btn" style="margin-top: 2rem; background: oklch(70% 0.18 180); border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: bold; cursor: pointer;">확인 완료</button>
                    </div>
                </div>
            </div>
        `;

        this.overlay = this.shadowRoot.getElementById('overlay');
        this.loader = this.shadowRoot.getElementById('loader');
        this.content = this.shadowRoot.getElementById('content');
        this.text = this.shadowRoot.getElementById('insight-text');
        this.title = this.shadowRoot.getElementById('title');

        this.shadowRoot.getElementById('close').onclick = () => this.hide();
        this.shadowRoot.getElementById('ok-btn').onclick = () => this.hide();
    }

    async show(pillar, score) {
        this.overlay.classList.add('visible');
        this.loader.classList.add('active');
        this.content.classList.remove('active');
        this.title.textContent = `${pillar.toUpperCase()} 분석 결과`;

        const insight = await AIService.getInsights(pillar, score);
        
        this.loader.classList.remove('active');
        this.content.classList.add('active');
        this.text.textContent = insight;
    }

    hide() {
        this.overlay.classList.remove('visible');
    }
}
customElements.define('ai-insight-panel', AIInsightPanel);
