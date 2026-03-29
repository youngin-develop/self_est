// Category Data Configuration
const CATEGORIES = [
    { id: 'health', name: '헬스', icon: '💪', questions: ['주 3회 이상 운동하시나요?', '올바른 자세를 알고 있나요?', '근력 향상을 체감하시나요?'] },
    { id: 'diet', name: '식단', icon: '🥗', questions: ['영양 균형을 고려하시나요?', '가공식품 섭취를 조절하시나요?', '규칙적인 식사를 하시나요?'] },
    { id: 'hair', name: '헤어', icon: '💇', questions: ['자신에게 맞는 샴푸를 쓰시나요?', '모발 손상을 관리하시나요?', '어울리는 스타일을 아시나요?'] },
    { id: 'skin', name: '피부', icon: '✨', questions: ['자신의 피부 타입을 아시나요?', '자외선 차단제를 바르시나요?', '수분 공급을 충분히 하시나요?'] },
    { id: 'self-mgmt', name: '자기관리', icon: '📅', questions: ['일일 계획을 세우시나요?', '충분한 수면을 취하시나요?', '시간 관리에 만족하시나요?'] },
    { id: 'fashion', name: '패션', icon: '👔', questions: ['체형에 맞는 핏을 아시나요?', '퍼스널 컬러를 아시나요?', '기본 아이템을 갖추고 있나요?'] },
    { id: 'interior', name: '집, 인테리어', icon: '🏠', questions: ['정리정돈 상태에 만족하시나요?', '공간 배치가 효율적인가요?', '나만의 무드가 담겨있나요?'] },
    { id: 'family', name: '건강, 가족', icon: '👪', questions: ['가족과 소통이 원활한가요?', '가족의 건강 상태를 아시나요?', '함께하는 시간이 충분한가요?'] },
    { id: 'dating', name: '연애관', icon: '❤️', questions: ['자신의 가치관이 뚜렷한가요?', '상대방의 입장을 배려하시나요?', '건강한 소통이 가능한가요?'] },
    { id: 'culture', name: '카페, 전시회', icon: '🖼️', questions: ['새로운 전시를 찾아보시나요?', '공간의 미학을 즐기시나요?', '문화 생활에 투자하시나요?'] }
];

// Application State
const state = {
    scores: {}, // { categoryId: 0-100 }
    deficiencies: [],
    get globalScore() {
        const scores = Object.values(this.scores);
        if (scores.length === 0) return 0;
        return Math.round(scores.reduce((a, b) => a + b, 0) / CATEGORIES.length);
    }
};

// Custom Element: Category Card
class VibeCategoryCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('category-card-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
        this.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('open-assessment', { 
                detail: { categoryId: this.getAttribute('category-id') } 
            }));
        });
    }

    render() {
        const id = this.getAttribute('category-id');
        const category = CATEGORIES.find(c => c.id === id);
        if (!category) return;

        const score = state.scores[id] || 0;
        const isDeficient = score > 0 && score < 60;

        const h3 = this.shadowRoot.querySelector('h3');
        const icon = this.shadowRoot.querySelector('.icon');
        const status = this.shadowRoot.querySelector('.status');
        const progressFill = this.shadowRoot.querySelector('.progress-fill');

        if (h3) h3.textContent = category.name;
        if (icon) icon.textContent = category.icon;
        if (status) status.textContent = score > 0 ? `${score}% 성장` : '진단 대기 중';
        if (progressFill) progressFill.style.width = `${score}%`;

        // Deficiency Badge
        let badge = this.shadowRoot.querySelector('.deficiency-alert');
        if (isDeficient) {
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'deficiency-alert';
                badge.textContent = '결핍됨';
                this.shadowRoot.querySelector('.content').appendChild(badge);
            }
        } else if (badge) {
            badge.remove();
        }
    }
}
customElements.define('vibe-category-card', VibeCategoryCard);

// Core Logic & UI Handling
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('category-grid');
    const modalContainer = document.getElementById('modal-container');
    const globalScoreEl = document.getElementById('global-score');
    const defBadgeEl = document.getElementById('deficiency-badge');
    const sidebar = document.getElementById('ai-consultant-sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const aiSearchInput = document.getElementById('ai-search-input');
    const aiSearchBtn = document.getElementById('ai-search-btn');
    const aiChatContainer = document.getElementById('ai-chat-container');

    // Initialize Grid
    CATEGORIES.forEach(cat => {
        const card = document.createElement('vibe-category-card');
        card.setAttribute('category-id', cat.id);
        grid.appendChild(card);
    });

    // Assessment Logic
    document.addEventListener('open-assessment', (e) => {
        const catId = e.detail.categoryId;
        const category = CATEGORIES.find(c => c.id === catId);
        
        modalContainer.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" id="close-modal">&times;</button>
                <h2>${category.icon} ${category.name} 진단</h2>
                <div class="questions">
                    ${category.questions.map((q, i) => `
                        <div class="question-item" style="margin-bottom: 24px;">
                            <p style="margin-bottom: 12px; font-weight: 500;">${i+1}. ${q}</p>
                            <input type="range" min="0" max="100" value="50" class="score-slider" data-idx="${i}" style="width: 100%;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                                <span>전혀 아님</span>
                                <span>매우 그렇음</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button id="submit-assessment" class="submit-btn" style="width: 100%; padding: 16px; border-radius: 16px; border: none; background: var(--accent-color); font-weight: 700; cursor: pointer;">진단 완료</button>
            </div>
        `;
        modalContainer.hidden = false;

        document.getElementById('close-modal').onclick = () => modalContainer.hidden = true;
        document.getElementById('submit-assessment').onclick = () => {
            const sliders = modalContainer.querySelectorAll('.score-slider');
            let total = 0;
            sliders.forEach(s => total += parseInt(s.value));
            const finalScore = Math.round(total / sliders.length);
            
            state.scores[catId] = finalScore;
            updateGlobalState();
            modalContainer.hidden = true;
            
            // Re-render the specific card
            const card = document.querySelector(`vibe-category-card[category-id="${catId}"]`);
            card.render();

            // Notify AI Consultant
            addMessage('system', `${category.name} 진단 결과, 성장 지수는 ${finalScore}% 입니다. ${finalScore < 60 ? '부족한 부분을 채우기 위한 팁을 준비했습니다.' : '훌륭합니다! 계속해서 유지해보세요.'}`);
            if (finalScore < 60) {
                setTimeout(() => addMessage('system', `[결핍 발견] ${category.name} 분야의 전문적인 정보를 검색해보시겠어요?`), 800);
            }
        };
    });

    function updateGlobalState() {
        globalScoreEl.textContent = `${state.globalScore}%`;
        
        const defs = Object.entries(state.scores).filter(([id, score]) => score < 60);
        state.deficiencies = defs.map(([id]) => CATEGORIES.find(c => c.id === id).name);
        
        if (state.deficiencies.length > 0) {
            defBadgeEl.hidden = false;
            defBadgeEl.textContent = `${state.deficiencies.length}개 분야 결핍`;
        } else {
            defBadgeEl.hidden = true;
        }
    }

    // AI Consultant Sidebar Logic
    openSidebarBtn.onclick = () => sidebar.classList.add('open');
    closeSidebarBtn.onclick = () => sidebar.classList.remove('open');

    aiSearchBtn.onclick = handleSearch;
    aiSearchInput.onkeypress = (e) => { if (e.key === 'Enter') handleSearch(); };

    function handleSearch() {
        const query = aiSearchInput.value.trim();
        if (!query) return;

        addMessage('user', query);
        aiSearchInput.value = '';

        // Mock AI Response Logic
        setTimeout(() => {
            let response = "흥미로운 질문이네요! 해당 분야에 대해 더 깊이 연구해볼 가치가 있습니다.";
            
            if (query.includes('헬스') || query.includes('운동')) {
                response = "효율적인 근성장을 위해서는 점진적 과부하와 충분한 단백질 섭취(체중 1kg당 1.6g 이상)가 필수입니다. 스트레칭을 잊지 마세요!";
            } else if (query.includes('식단') || query.includes('다이어트')) {
                response = "극단적인 절식보다는 탄단지 비율을 4:4:2로 맞춘 클린 식단을 지향해보세요. 식이섬유가 풍부한 채소를 먼저 먹는 것이 혈당 관리에 좋습니다.";
            } else if (query.includes('피부')) {
                response = "가장 중요한 것은 약산성 클렌저와 사계절 내내 바르는 자외선 차단제입니다. 장벽이 무너졌을 때는 세라마이드 성분의 제품을 추천드려요.";
            } else if (query.includes('패션') || query.includes('코디')) {
                response = "자신의 퍼스널 컬러와 체형을 먼저 파악하는 것이 중요합니다. 화려한 옷보다는 소재가 좋은 기본 템(슬랙스, 화이트 셔츠)부터 갖춰보세요.";
            } else if (state.deficiencies.length > 0 && query.includes('결핍')) {
                response = `현재 ${state.deficiencies.join(', ')} 분야에서 개선이 필요해 보입니다. 먼저 가장 낮은 점수인 분야부터 하나씩 집중해보는 건 어떨까요?`;
            }

            addMessage('system', response);
        }, 600);
    }

    function addMessage(type, text) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;
        aiChatContainer.appendChild(msg);
        aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
        
        if (!sidebar.classList.contains('open')) {
            openSidebarBtn.style.transform = 'scale(1.1)';
            setTimeout(() => openSidebarBtn.style.transform = 'scale(1)', 300);
        }
    }
});
