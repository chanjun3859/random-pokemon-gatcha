let isRolling = false; // 중복 클릭 방지 변수

async function drawPokemon() {
    if (isRolling) return; // 이미 뽑는 중이면 무시
    
    const btn = document.querySelector('button'); // 버튼 가져오기
    
    try {
        const response = await fetch('pokemon.json');
        const pokemonList = await response.json();
        
        const imgTag = document.getElementById('poke-img');
        const infoTag = document.getElementById('poke-info');
        const formTag = document.getElementById('form-info');

        isRolling = true;
        btn.disabled = true; // 애니메이션 시작 시 버튼 비활성화
        imgTag.style.display = 'block';
        imgTag.style.opacity = '0.5'; // 돌아가는 동안 살짝 투명하게
        
        let counter = 0;
        const totalSpins = 20; // 총 몇 번 이미지가 바뀔지
        
        // --- 애니메이션 시작 ---
        const spinInterval = setInterval(() => {
            // 셔플 중에는 아무 포켓몬이나 랜덤하게 보여줌
            const tempPoke = pokemonList[Math.floor(Math.random() * pokemonList.length)];
            const tempForm = tempPoke.forms[Math.floor(Math.random() * tempPoke.forms.length)];
            
            imgTag.src = tempForm.img;
            infoTag.innerText = "과연... 🤔";
            formTag.innerText = "";
            
            counter++;
            
            // 지정된 횟수만큼 돌았다면 멈춤
            if (counter >= totalSpins) {
                clearInterval(spinInterval);
                finishDraw(pokemonList, imgTag, infoTag, formTag, btn);
            }
        }, 80); // 0.08초마다 교체

    } catch (error) {
        console.error(error);
        alert("데이터를 불러오지 못했습니다.");
        isRolling = false;
        btn.disabled = false;
    }
}

function finishDraw(list, imgTag, infoTag, formTag, btn) {
    const finalPoke = list[Math.floor(Math.random() * list.length)];
    const formIdx = Math.floor(Math.random() * finalPoke.forms.length); 
    const finalForm = finalPoke.forms[formIdx];

    // --- 수정 포인트: autoSuffix 계산 및 표시 로직 삭제 ---
    imgTag.src = finalForm.img;
    imgTag.style.opacity = '1';
    
    // 번호와 이름만 표시하도록 변경
    infoTag.innerText = `No.${finalPoke.id} - ${finalPoke.name}`;
    
    // 폼 이름이 '일반'이 아닐 때만 괄호로 아래에 표시 (예: [붉은 달])
    formTag.innerText = finalForm.formName !== "일반" ? `[${finalForm.formName}]` : "";
    
    imgTag.classList.add('bounce');
    setTimeout(() => imgTag.classList.remove('bounce'), 500);
    
    isRolling = false;
    btn.disabled = false; // 뽑기 완료 후 버튼 다시 활성화
}
