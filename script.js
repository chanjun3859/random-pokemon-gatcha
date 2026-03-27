let isRolling = false; // 중복 클릭 방지 변수

async function drawPokemon() {
    if (isRolling) return; // 이미 뽑는 중이면 무시
    
    try {
        const response = await fetch('pokemon.json');
        const pokemonList = await response.json();
        
        const imgTag = document.getElementById('poke-img');
        const infoTag = document.getElementById('poke-info');
        const formTag = document.getElementById('form-info');

        isRolling = true;
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
                finishDraw(pokemonList, imgTag, infoTag, formTag);
            }
        }, 80); // 0.08초마다 교체

    } catch (error) {
        console.error(error);
        alert("데이터를 불러오지 못했습니다.");
    }
}

// 최종 포켓몬 확정 함수
function finishDraw(list, imgTag, infoTag, formTag) {
    const finalPoke = list[Math.floor(Math.random() * list.length)];
    const finalForm = finalPoke.forms[Math.floor(Math.random() * finalPoke.forms.length)];

    imgTag.src = finalForm.img;
    imgTag.style.opacity = '1'; // 다시 선명하게
    infoTag.innerText = `${finalPoke.id}(${finalForm.suffix}) - ${finalPoke.name}`;
    formTag.innerText = finalForm.formName !== "일반" ? `[${finalForm.formName}]` : "";
    
    // 화면에 흔들리는 효과(진동) 추가 (CSS 필요)
    imgTag.classList.add('bounce');
    setTimeout(() => imgTag.classList.remove('bounce'), 500);
    
    isRolling = false; // 다시 클릭 가능하게 변경
}
