let isRolling = false;

async function drawPokemon() {
    if (isRolling) return;
    
    const btn = document.querySelector('button');
    const imgTag = document.getElementById('poke-img');
    const infoTag = document.getElementById('poke-info');
    const formTag = document.getElementById('form-info');

    try {
        const response = await fetch('pokemon.json');
        const pokemonList = await response.json();

        isRolling = true;
        btn.disabled = true;
        
        imgTag.style.display = 'block';
        imgTag.style.opacity = '0.4'; 
        
        let counter = 0;
        const totalSpins = 25; 
        
        // 셔플용 변수를 미리 선언해서 밖에서도 쓸 수 있게 합니다.
        let lastPoke, lastForm;

        const spinInterval = setInterval(() => {
            // 매 순간 랜덤하게 뽑아서 저장
            lastPoke = pokemonList[Math.floor(Math.random() * pokemonList.length)];
            lastForm = lastPoke.forms[Math.floor(Math.random() * lastPoke.forms.length)];
            
            imgTag.src = lastForm.img;
            infoTag.innerText = "누가 나올까...?";
            formTag.innerText = "";
            
            counter++;
            
            if (counter >= totalSpins) {
                clearInterval(spinInterval);
                // 셔플 마지막에 뽑혔던 'lastPoke'와 'lastForm'을 그대로 결과 함수로 보냄!
                finishDraw(lastPoke, lastForm, imgTag, infoTag, formTag, btn);
            }
        }, 70);

    } catch (error) {
        console.error(error);
        isRolling = false;
        btn.disabled = false;
    }
}

// 이제 list 전체를 받지 않고, 당첨된 데이터만 받습니다.
function finishDraw(finalPoke, finalForm, imgTag, infoTag, formTag, btn) {
    // 셔플 마지막 이미지를 그대로 유지 (src를 다시 바꿀 필요가 없음)
    imgTag.style.opacity = '1';
    
    // 정보 업데이트
    infoTag.innerText = `No.${finalPoke.id} - ${finalPoke.name}`;
    formTag.innerText = finalForm.formName !== "일반" ? `[${finalForm.formName}]` : "";
    
    // 연출 애니메이션
    imgTag.classList.remove('bounce');
    void imgTag.offsetWidth; 
    imgTag.classList.add('bounce');
    
    setTimeout(() => {
        isRolling = false;
        btn.disabled = false;
    }, 500);
}
