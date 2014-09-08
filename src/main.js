function appGen() {
	//setup variables
	var zip = new JSZip();
	appName = document.getElementById("app-name").value;
	appLink = document.getElementById("app-link").value;
	applicationHtml = ""
	applicationCss = ""
	applicationJs = ""
	backgroundJs = ""

	//build files

	//background.js
	backgroundJs = "chrome.app.runtime.onLaunched.addListener(function() {var options = {'id': '" + appName + "','bounds': {'width': 1024,'height': 768}};chrome.app.window.create('application.html', (options));});";

	//manifest.json
	manifestJson = "{\"update_url\": \"https://clients2.google.com/service/update2/crx\",\"name\": \"" + appName + "\",\"version\": \"1.0\",\"manifest_version\": 2,\"icons\": {\"128\": \"icon_128.png\",\"16\": \"icon_16.png\"},\"app\": {\"background\": {\"scripts\": [ \"background.js\" ],\"persistent\": false}},\"permissions\": [\"webview\"]";
	if (document.getElementById('kioskMode').checked) {
		manifestJson = manifestJson + ",\"kiosk_enabled\":true}";
	}
	else{
		manifestJson = manifestJson + "}";
	}

	//application.html, application.js
	if (document.getElementById('tab').checked) {
		applicationHtml = "<!DOCTYPE html><html><head><script src=\"application.js\"></script></head><body></body></html>"
		applicationJs = "window.open(\'" + appLink + "\');window.close();"
	}
	else{
		if (document.getElementById('closeButton').checked || document.getElementById('historyButtons').checked || document.getElementById('refreshButton').checked || document.getElementById('homeButton').checked) {
			applicationHtml = "<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"application.css\"><script src=\"application.js\"></scr" + "ipt><body><div id=\"controls\">"	
			applicationCss = "body {  margin: 0;  padding: 0;  font-family: Lucida Grande, Arial, sans-serif;}#controls {  padding: 3px;  border-bottom: solid 1px #ccc;}#controls button,#controls input {  font-size: 14px;  line-height: 24px;  border-radius: 2px;  padding: 0 6px;}button,input[type=\"submit\"],button[disabled]:hover {  border: solid 1px transparent;  background: transparent;}button:hover,input[type=\"submit\"]:hover {  border-color: #ccc;  background: -webkit-linear-gradient(top, #f2f2f2 0%, #cccccc 99%);}/* These glyphs are on the small side, make them look more natural whencompared to the back/forward buttons */#controls #home,#controls #terminate {  font-size: 24px;}#controls #reload {  font-size: 20px;}#location {  border: solid 1px #ccc;  padding: 2px;  width: 100%;  -webkit-box-sizing: border-box;}#controls {  display: -webkit-flex;  -webit-flex-direction: column;}#controls #location-form {  -webkit-flex: 1;  display: -webkit-flex;  -webit-flex-direction: column;}#controls #center-column {  -webkit-flex: 1;}#sad-webview,webview {  position: absolute;  bottom: 0;  left: 0;}/* The reload button turns into a spinning trobber */.loading #reload {  -webkit-animation: spinner-animation .5s infinite linear;  -webkit-transform-origin: 50% 55.5%;}@-webkit-keyframes spinner-animation {  0% { -webkit-transform: rotate(0deg); }  100% {-webkit-transform: rotate(360deg); }} #sad-webview,.exited webview {  visibility: hidden;  visibility: hidden;}.exited #sad-webview {  visibility: visible;  background: #343f51;  text-align: center;  color: #fff;}#sad-webview h2 {  font-size: 14px;}#sad-webview p {  font-size: 11px;}#sad-webview-icon {  font-size: 96px;  margin-bottom: 10px;}/* Variant of the crashed page when the process is intentionally killed (in thatcase we use a different background color and label). */.exited #sad-webview #killed-label {  display: none;}.killed #sad-webview {  background: #393058;}.killed #sad-webview #killed-label {  display: block;}.killed #sad-webview #crashed-label {  display: none;}"
			applicationJs = "window.onresize = doLayout;var isLoading = false;onload = function() {  var webview = document.querySelector('webview');  doLayout();  "
			
			if (document.getElementById('historyButtons').checked) {
				applicationHtml = applicationHtml + "<button id=\"back\" title=\"Go Back\">&#9664;</button><button id=\"forward\" title=\"Go Forward\">&#9654;</button>";
				applicationJs = applicationJs + "document.querySelector('#back').onclick = function() {    webview.back();  };  document.querySelector('#forward').onclick = function() {    webview.forward();  };    "
			};
			if (document.getElementById('homeButton').checked) {
				applicationHtml = applicationHtml + "<button id=\"home\" title=\"Go Home\">&#8962;</button>"
				applicationJs = applicationJs + "document.querySelector('#home').onclick = function() {    navigateTo(\'" + appLink + "\');  };    "
			};
			if (document.getElementById('refreshButton').checked) {
				applicationHtml = applicationHtml + "<button id=\"reload\" title=\"Reload\">&#10227;</button>"
				applicationJs = applicationJs + "document.querySelector('#reload').onclick = function() {    if (isLoading) {      webview.stop();    } else {      webview.reload();    }  };  document.querySelector('#reload').addEventListener(    'webkitAnimationIteration',    function() {      if (!isLoading) {        document.body.classList.remove('loading');      }    });  "
			};
			if (document.getElementById('closeButton').checked) {
				applicationHtml = applicationHtml + "<button id=\"reset\">Close</button>"
				applicationJs = applicationJs + "document.querySelector('#reset').onclick = function() {    window.close();  };  "
			}
			//if (document.getElementById('addressBar').checked) {
			//	applicationHtml = applicationHtml + "<form id=\"location-form\"><div id=\"center-column\"></div></form>"
			//	applicationJs = applicationJs + "document.querySelector('#terminate').onclick = function() {    webview.terminate();  };  document.querySelector('#location-form').onsubmit = function(e) {    e.preventDefault();    navigateTo(document.querySelector('#location').value);  };  "
			//};
			else {
				applicationJs = applicationJs + "document.querySelector('#terminate').onclick = function() {    webview.terminate();  };  "
			};
			applicationHtml = applicationHtml + "</div><webview src=\"" + appLink + "\" style=\"width:100%; height:100%\"></webview><div id=\"sad-webview\"><div id=\"sad-webview-icon\">&#9762;</div><h2 id=\"crashed-label\">Aw, Snap!</h2><h2 id=\"killed-label\">He's Dead, Jim!</h2><p>Something went wrong while displaying this webpage.      To continue, reload or go to another page.</p></div></body></html>"
			applicationJs = applicationJs + "webview.addEventListener('exit', handleExit);  webview.addEventListener('loadstart', handleLoadStart);  webview.addEventListener('loadstop', handleLoadStop);  webview.addEventListener('loadabort', handleLoadAbort);  webview.addEventListener('loadredirect', handleLoadRedirect);  webview.addEventListener('loadcommit', handleLoadCommit);};function navigateTo(url) {  resetExitedState();  document.querySelector('webview').src = url;}function doLayout() {  var webview = document.querySelector('webview');  var controls = document.querySelector('#controls');  var controlsHeight = controls.offsetHeight;  var windowWidth = document.documentElement.clientWidth;  var windowHeight = document.documentElement.clientHeight;  var webviewWidth = windowWidth;  var webviewHeight = windowHeight - controlsHeight;  webview.style.width = webviewWidth + 'px';  webview.style.height = webviewHeight + 'px';  var sadWebview = document.querySelector('#sad-webview');  sadWebview.style.width = webviewWidth + 'px';  sadWebview.style.height = webviewHeight * 2/3 + 'px';  sadWebview.style.paddingTop = webviewHeight/3 + 'px';}function handleExit(event) {  console.log(event.type);  document.body.classList.add('exited');  if (event.type == 'abnormal') {    document.body.classList.add('crashed');  } else if (event.type == 'killed') {    document.body.classList.add('killed');  }}function resetExitedState() {  document.body.classList.remove('exited');  document.body.classList.remove('crashed');  document.body.classList.remove('killed');}function handleLoadCommit(event) {  resetExitedState();  if (!event.isTopLevel) {    return;  }  document.querySelector('#location').value = event.url;  var webview = document.querySelector('webview');  document.querySelector('#back').disabled = !webview.canGoBack();  document.querySelector('#forward').disabled = !webview.canGoForward();}function handleLoadStart(event) {  document.body.classList.add('loading');  isLoading = true;  resetExitedState();  if (!event.isTopLevel) {    return;  }  document.querySelector('#location').value = event.url;}function handleLoadStop(event) {isLoading = false;}function handleLoadAbort(event) {  console.log('oadAbort');  console.log('  url: ' + event.url);  console.log('  isTopLevel: ' + event.isTopLevel);  console.log('  type: ' + event.type);}function handleLoadRedirect(event) {  resetExitedState();  if (!event.isTopLevel) {    return;  }  document.querySelector('#location').value = event.newUrl;}"
		} 
		else{
			applicationHtml = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>" + appName + "</title><script src=\"application.js\"></scr" + "ipt><link rel=\"stylesheet\" type=\"text/css\" href=\"application.css\"></head><body><webview id=\"map\" src=\"" + appLink + "\"></webview></body></html>"
			applicationCss = "webview {height: 100%;width: 100%;}"
		}
	}
	
	if(document.getElementById("imgId16").src != ""){
		icon16 = document.getElementById("imgId16").src;
		icon16 = icon16.substring(22);
	}
	else{
		var e = document.getElementById("16sel");
		icon16 = e.options[e.selectedIndex].value;
	}
	if(document.getElementById("imgId128").src != ""){
		icon128 = document.getElementById("imgId128").src;
		icon128 = icon128.substring(22);
	}
	else{
		var e = document.getElementById("128sel");
		icon128 = e.options[e.selectedIndex].value;
	}

	//generate zip
	zip.file("manifest.json", manifestJson);
	zip.file("application.html", applicationHtml);
	zip.file("application.css", applicationCss);
	zip.file("application.js", applicationJs);
	zip.file("background.js", backgroundJs);
	zip.file("icon_16.png", icon16, {base64: true});
	zip.file("icon_128.png", icon128, {base64: true});

	//download zip
	var content = zip.generate({type:"blob"});
	window.saveAs(content, appName+".zip");
}

function loadFileFromInput(input,typeData) {
    var reader,
        fileLoadedEvent,
        files = input.files;
		
    if (files && files[0]) {
        reader = new FileReader();
		
        reader.onload = function (e) {
            fileLoadedEvent = new CustomEvent('fileLoaded',{
                detail:{
                    data:reader.result,
                    file:files[0]  
                },
                bubbles:true,
                cancelable:true
            });
            input.dispatchEvent(fileLoadedEvent);
        }
        switch(typeData) {
            case 'arraybuffer':
                reader.readAsArrayBuffer(files[0]);
                break;
            case 'dataurl':
                reader.readAsDataURL(files[0]);
                break;
            case 'binarystring':
                reader.readAsBinaryString(files[0]);
                break;
            case 'text':
                reader.readAsText(files[0]);
                break;
        }
    }
}

function fileHandler16 (e) {
    var data = e.detail.data,
        fileInfo = e.detail.file;
        
    var UserImage16 = new Image();
    UserImage16.src = data;
    UserImage16.onload = function(){
		if (data.substring(11, 14) == "png") {
			if (UserImage16.width != 16 && UserImage16.height != 16) {
				alert("Error: Small icon must be exactly 16x16");
			}
			else{
				document.getElementById('imgId16').src = data;
			}
		}
		else {
			alert("Error: Icon files must be PNG");
		}
	}
}

function fileHandler128 (e) {
    var data = e.detail.data,
        fileInfo = e.detail.file;

    var UserImage128 = new Image();
    UserImage128.src = data;
    UserImage128.onload = function(){
		if (data.substring(11, 14) == "png") {
			if (UserImage128.width != 128 && UserImage128.height != 128) {
				alert("Error: Large icon must be exactly 128x128");
			}
			else{
				document.getElementById('imgId128').src = data;
			}
		}
		else {
			alert("Error: Icon files must be PNG");
		}
	}
}

function page_init() {
	//post load setup
	//setup 16x16 image uploader
	var input16 = document.getElementById('inputId16')
	input16.onchange = function (e) {
	    loadFileFromInput(e.target,'dataurl');
	};
	//setup 128x128 image uploader
	var input128 = document.getElementById('inputId128')
	input128.onchange = function (e) {
	    loadFileFromInput(e.target,'dataurl');
	};
	
	//create upload event listeners
	input16.addEventListener('fileLoaded',fileHandler16)
	input128.addEventListener('fileLoaded',fileHandler128)
	//setup image picker
	$("select").imagepicker()
	//setup uniform
	$("input").uniform();
	$("input").not("#run").uniform();
	//set initial values
	document.getElementById("app-name").value = "My Super Awesome App";
	document.getElementById("app-link").value = "http://MySuperAwesomeWebsite.com";
	//initialize run button
	var runButton = document.getElementById("run");
	runButton.onclick = appGen;

	//initialize check boxes
	document.getElementById('closeButton').checked = false
	document.getElementById('historyButtons').checked =false
	document.getElementById('refreshButton').checked = false
	document.getElementById('homeButton').checked = false


	//google analytics stuff
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	
	  ga('create', 'UA-49432939-1', 'appmaker.im');
	  ga('send', 'pageview');

}