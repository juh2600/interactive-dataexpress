
for(let i = 0; i < 3; i++) {
	let dropdown = document.getElementById(`securityQuestion${i+1}`);
	dropdown.selectedIndex = dropdown.dataset.answer;

}
