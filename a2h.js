function a2hAskNicelly(phrase,notnow,letsgo){
	if (typeof phrase==="undefined") phrase = 'Install our app now!';
	if (typeof notnow==="undefined") notnow = 'Not now';
	if (typeof letsgo==="undefined") letsgo = "Let's go";

	document.body.innerHTML += `
	<div id="a2h-nice-ask-install">
		<table>
			<tbody>
				<tr>
					<td>${phrase}</td>
					<td>
						<a class="btn-red" onclick="a2hNotNow();">${notnow}</a>
					</td>
					<td>
						<a class="btn-blu" onclick="a2hInstall();">${letsgo}</a>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	`;
}

function a2hNotNow(){
	removeClassA2h();
	Lockr.set('a2hNotNow',true, {expires: 60*12}); //12 hours
	if (typeof ga !=="undefined") ga('send', 'event', 'A2H', 'a2hNotNow');
}

function removeClassA2h(){
	el = document.getElementById("a2h-nice-ask-install");
	className = 'a2h-show';
	if (el.classList){
	  el.classList.remove(className);
	}else{
	  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
}

function addClassA2h(){
	el = document.getElementById("a2h-nice-ask-install");
	className = 'a2h-show';
	if (el.classList){
	  el.classList.add(className);
	}else{
	  el.className += ' ' + className;
	}
}

var a2hDeferred;
window.addEventListener('beforeinstallprompt', function(e) { //show our nice window instead of the ugly default one
    e.preventDefault();
    a2hDeferred = e;
    showA2h();
});

function showA2h() {
    if (Lockr.get('a2hNotNow', false)) {
        return;
    }
    addClassA2h();
}
function a2hInstall() {
	if (typeof a2hDeferred==="undefined"){
		console.error("A2H-nice-ask Error: the event listener beforeinstallprompt was not called. Are you sure your website has a valid manifest?");
		console.error("A2H-nice-ask Error: check https://developers.google.com/web/fundamentals/app-install-banners/?hl=en for help");
		return;
	}
    a2hDeferred.prompt();
    a2hDeferred.userChoice.then(function(returnData) {
        if (typeof ga !=="undefined") ga('send', 'event', 'A2H', returnData.outcome);
        if (returnData.outcome === 'accepted') {
            console.log('User installed the app');
            removeClassA2h();
        } else {
            console.log('User have not installed the app');
        }
        a2hDeferred = null;
    });
}