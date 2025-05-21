document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // 검색 함수
    async function searchWikipedia(searchTerm) {
        const endpoint = `https://ko.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${encodeURIComponent(searchTerm)}`;

        showLoading(true);

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('네트워크 응답에 문제가 있습니다.');
            
            const data = await response.json();
            displayResults(data.query.search);
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = `<p class="result-item">검색 중 오류가 발생했습니다: ${error.message}</p>`;
        } finally {
            showLoading(false);
        }
    }

    // 결과 표시 함수
    function displayResults(results) {
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p class="result-item">검색 결과가 없습니다.</p>';
            return;
        }

        const resultsHtml = results.map(result => `
            <div class="result-item">
                <h2>
                    <a href="https://ko.wikipedia.org/wiki/${encodeURIComponent(result.title)}" 
                       target="_blank" 
                       rel="noopener noreferrer">
                        ${result.title}
                    </a>
                </h2>
                <p>${result.snippet.replace(/(<([^>]+)>)/gi, '')}</p>
            </div>
        `).join('');

        resultsDiv.innerHTML = resultsHtml;
    }

    // 로딩 표시 함수
    function showLoading(show) {
        loadingDiv.classList.toggle('hidden', !show);
    }

    // 이벤트 리스너
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchWikipedia(searchTerm);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchWikipedia(searchTerm);
            }
        }
    });

    // 초기 포커스
    searchInput.focus();
}); 
