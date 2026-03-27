let isRolling = false;

async function drawPokemon() {
    if (isRolling) return;
    
    const btn = document.querySelector('button');
    const imgTag = document.getElementById('poke-img');
    const infoTag = document.getElementById('poke-info');
    const formTag = document.getElementById('form-info');

    try {
        const response = await fetch('pokemon.json');
        if (!response.ok) throw new Error('데이터 로드 실패');
        const pokemonList = await response.json();

        isRolling = true;
        btn.disabled = true;
        
        imgTag.style.display = 'block';
        imgTag.style.opacity = '0.4'; // 셔플 중에는 더 흐릿하게 설정
        
        let counter = 0;
        const totalSpins = 25; // 셔플 횟수를 약간 늘려 박진감 추가
        
        const spinInterval = setInterval(() => {
            const tempPoke = pokemonList[Math.floor(Math.random() * pokemonList.length)];
            const tempForm = tempPoke.forms[Math.floor(Math.random() * tempPoke.forms.length)];
            
            imgTag.src = tempForm.img;
            infoTag.innerText = "분석 중... 🤔";
            formTag.innerText = "";
            
            counter++;
            
            if (counter >= totalSpins) {
                clearInterval(spinInterval);
                // 셔플이 완전히 멈춘 뒤 최종 결과 도출
                finishDraw(pokemonList, imgTag, infoTag, formTag, btn);
            }
        }, 70); // 속도를 살짝 높임 (0.07초)

    } catch (error) {
        console.error(error);
        alert("데이터를 불러오는 중 문제가 발생했습니다.");
        isRolling = false;
        btn.disabled = false;
    }
}

function finishDraw(list, imgTag, infoTag, formTag, btn) {
    const finalPoke = list[Math.floor(Math.random() * list.length)];
    const formIdx = Math.floor(Math.random() * finalPoke.forms.length);
    const finalForm = finalPoke.forms[formIdx];

    // 1. 최종 결과값 할당
    imgTag.src = finalForm.img;
    
    // 2. 불투명도를 즉시 1로 변경 (CSS transition 덕분에 부드럽게 보임)
    imgTag.style.opacity = '1';
    
    // 3. 텍스트 업데이트
    infoTag.innerText = `No.${finalPoke.id} - ${finalPoke.name}`;
    formTag.innerText = finalForm.formName !== "일반" ? `[${finalForm.formName}]` : "";
    
    // 4. 연출 애니메이션 (bounce)
    imgTag.classList.remove('bounce'); // 이전 애니메이션 제거
    void imgTag.offsetWidth; // 리플로우 강제 발생 (애니메이션 재시작용)
    imgTag.classList.add('bounce');
    
    // 5. 상태 초기화
    setTimeout(() => {
        isRolling = false;
        btn.disabled = false;
    }, 500);
}
