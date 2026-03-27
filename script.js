async function drawPokemon() {
    try {
        // 1. JSON 데이터 가져오기
        const response = await fetch('pokemon.json');
        if (!response.ok) throw new Error('데이터를 불러올 수 없습니다.');
        const pokemonList = await response.json();

        // 2. 전체 리스트 중 랜덤하게 한 마리 선택
        const randomIdx = Math.floor(Math.random() * pokemonList.length);
        const pokemon = pokemonList[randomIdx];

        // 3. 해당 포켓몬의 폼(form) 중 랜덤하게 하나 선택 (a, b 등)
        const formIdx = Math.floor(Math.random() * pokemon.forms.length);
        const selectedForm = pokemon.forms[formIdx];

        // 4. 화면 업데이트
        const imgTag = document.getElementById('poke-img');
        const infoTag = document.getElementById('poke-info');
        const formTag = document.getElementById('form-info');

        imgTag.src = selectedForm.img;
        imgTag.style.display = 'block'; // 이미지 보이기
        infoTag.innerText = `${pokemon.id}(${selectedForm.suffix}) - ${pokemon.name}`;
        
        // 폼 이름이 '일반'이 아닐 때만 폼 명칭 표시 (예: 붉은 달)
        formTag.innerText = selectedForm.formName !== "일반" ? `[${selectedForm.formName}]` : "";

    } catch (error) {
        console.error(error);
        alert("데이터 로딩 중 오류가 발생했습니다.");
    }
}