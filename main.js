var relWidth = 80/document.querySelector('.canvas').clientWidth;
var relHeight = 80/document.querySelector('.canvas').clientHeight;

window.onresize = function() {
	relWidth = 80/document.querySelector('.canvas').clientWidth;
  relHeight = 80/document.querySelector('.canvas').clientHeight;
}

function moveElem(e) {
	window.onbeforeunload = function() {
		return 'Close window?';
	};
	
	var currentX = e.clientX - 55;
  var currentY = e.clientY - 105;

	document.querySelector('.draggable').style.left = currentX + 'px';
  document.querySelector('.draggable').style.top = currentY + 'px';

  x[currentIndex] = currentX;
  y[currentIndex] = currentY;

  document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.left = relWidth * currentX + 'px';
  document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.top = relHeight * currentY + 'px';
}

var x = [20];
var y = [20];

var currentIndex = 0;

function openFrame(index) {
  currentIndex = index;

  document.querySelector('.draggable').style.left = x[currentIndex] + 'px';
  document.querySelector('.draggable').style.top = y[currentIndex] + 'px';
	
  if (!document.querySelector('.play').classList.contains('playing')) {
    document.querySelector('.draggable').style.transition = '.2s';
    window.setTimeout(function() {
      document.querySelector('.draggable').style.transition = '';
    }, 200);
  }

  document.querySelectorAll('.frame').forEach(el => {
    el.classList.remove('open');
  })
  document.querySelectorAll('.frame')[currentIndex].classList.add('open');
}

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function playFrame() {
	if (settings.replay) {
    document.querySelector('.draggable').style.transition = settings.delay+'s linear';
    if (currentIndex == x.length-1) {
      currentIndex = -1;
    }
    if (document.querySelector('.play').classList.contains('playing')) {
      window.setTimeout(function() {
        openFrame(currentIndex+1);
        playFrame();
      }, settings.delay*1000)
    }
    else {
      window.setTimeout(function() {
        document.querySelector('.draggable').style.transition = '';
        openFrame(startFrame);
      }, settings.delay*1000)
    }
  }
  else {
  	document.querySelector('.draggable').style.transition = settings.delay+'s linear';
    if (currentIndex < x.length-1) {
      if (document.querySelector('.play').classList.contains('playing')) {
        window.setTimeout(function() {
          openFrame(currentIndex+1);
          playFrame();
        }, settings.delay*1000)
      }
      else {
        window.setTimeout(function() {
          document.querySelector('.draggable').style.transition = '';
          openFrame(startFrame);
        }, settings.delay*1000)
      }
    }
    else {
      window.setTimeout(function() {
        document.querySelector('.draggable').style.transition = '';
     		 document.querySelector('.play').classList.remove('playing');
      }, settings.delay*1000)
    }
  }
}

function exportAnimation() {
	var out = `.`+settings.name.replaceAll(' ', '-')+` {
  animation: `+settings.name.replaceAll(' ', '-')+` `+settings.delay * x.length+`s linear forwards;
  position: absolute;
}
  
@keyframes `+settings.name.replaceAll(' ', '-')+` {`;
  for (var i = 0; i < x.length; i++) {
  var percent = x.length > 1 ? 100 / (x.length-1) * i + `%` : `to`;
  out += `
  `+percent+` {
    top: `+y[i]+`px;
    left: `+x[i]+`px;
  }`;
  }
  return (out + `
}`);
}

function deleteAnimation() {
  document.querySelector('.sidebar').innerHTML = '<div class="frame open" onclick="openFrame(0)"><div class="frame-wrapper"><div class="frame-el"></div></div>';
  settings.name = 'Untitled Animation';
  document.querySelector('.logo span').innerHTML = settings.name;
  x = [20];
  y = [20];
  openFrame(0);
}

function importAnimation() {
	deleteAnimation();
  
  var code = document.querySelector('.main .code').innerText;
  document.querySelector('.main .code').innerText = '';
  
  var notabs = code.replaceAll(/  /g,'');
  var lineArray = notabs.match(/[^\r\n]+/g);
    
  settings.name = lineArray[0].replace('@keyframes ', '').replace(' {', '').replaceAll('-', ' ');
  document.querySelector('.logo span').innerHTML = settings.name;

	for (var i = 0; i < lineArray.length; i++) {
		lineArray[i] = lineArray[i].replace(/\s/g, '');
  }

  var topPos = [];
  var leftPos = [];
  for (var i = 0; i < lineArray.length; i++) {
    var property = lineArray[i].substr(0, lineArray[i].indexOf(';'));
    if (property != '') {
      if (property.startsWith('top:')) {
        topPos.push(Number(property.replace('top:', '').replace('px', '')));
      }
      if (property.startsWith('left:')) {
        leftPos.push(Number(property.replace('left:', '').replace('px', '')));
      }
    }
  }
  
  x = leftPos;
  y = topPos;
  
  document.querySelector('.sidebar').innerHTML = '';
  
  for (var i = 0;i < x.length; i++) {
  	document.querySelector('.sidebar').innerHTML += '<div class="frame"><div class="frame-wrapper"><div class="frame-el"></div></div></div>';
    document.querySelectorAll('.frame')[i].children[0].children[0].style.left = relWidth * x[i] + 'px';
    document.querySelectorAll('.frame')[i].children[0].children[0].style.top = relHeight * y[i] + 'px';
  }
  
  document.querySelectorAll('.frame').forEach(function(el, i) {
    el.addEventListener('click', e => {
      openFrane(i);
    })
  })
  
  openFrame(0);
  
  document.querySelector('.main').classList.add('hidden');
  document.querySelector('.upload-wrapper').classList.add('hidden');
  document.querySelector('.title-wrapper').classList.remove('hidden');
}

function copy(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

function select(node) {
    node.focus();
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

document.querySelector('.add').addEventListener('click', e => {
  currentIndex += 1;

  x.splice(currentIndex, 0, x[currentIndex - 1]);
  y.splice(currentIndex, 0, y[currentIndex - 1]);

  var frame = create('<div class="frame open" style="opacity:0" onclick="openFrame('+currentIndex+')"><div class="frame-wrapper"><div class="frame-el"></div></div></div>');
  insertAfter(document.querySelector('.sidebar').children[currentIndex - 1], frame);
  window.setTimeout(function() {
  	document.querySelectorAll('.frame')[currentIndex].style.opacity = 1;
    document.querySelectorAll('.frame')[currentIndex].scrollIntoView({behavior: "smooth"});
    
    document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.left = relWidth * x[currentIndex - 1] + 'px';
      document.querySelectorAll('.frame')[currentIndex].children[0].children[0].style.top = relHeight * y[currentIndex - 1] + 'px';
      
    openFrame(currentIndex);
  }, 0);
})

document.querySelector('.remove').addEventListener('click', e => {
  if (currentIndex != 0) {
    x.splice(currentIndex, 1);
    y.splice(currentIndex, 1);

    openFrame(currentIndex - 1);
    document.querySelectorAll('.frame')[currentIndex + 1].remove();
    document.querySelectorAll('.frame')[currentIndex].scrollIntoView({behavior: "smooth"});
  }
})

var startFrame = 0;
document.querySelector('.play').addEventListener('click', e => {
  document.querySelector('.play').classList.toggle('playing');
  if (document.querySelector('.play').classList.contains('playing')) {
  	if (currentIndex == x.length-1) {
    	currentIndex = -1;
    }
  	startFrame = currentIndex;
    playFrame();
  }
})

document.querySelector('.save').addEventListener('click', e => {
	window.onbeforeunload = null;
	
	document.querySelector('.prompt').innerHTML = '<div class="title"> <p>Export</p> <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="close" onclick="document.querySelector(\'.prompt-wrapper\').classList.toggle(\'open\')"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"></path></svg> </div> <a>Place this code somewhere in your website for a fully fledged animation.</a> <br> <span>HTML (or any element with class <span class="code name" style="padding: 2px">---</span>)</span> <div class="code" onclick="copy(this.innerText);this.classList.toggle(\'copy\')"><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="copy"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path></svg>&lt;div class="<span class="name">---</span>"&gt;&lt;/div&gt;</div> <span>CSS</span> <div class="code export" onclick="copy(this.innerText);this.classList.toggle(\'copy\')"><svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="copy"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path></svg></div> </div>'

	document.querySelector('.prompt-wrapper').classList.add('open');
  document.querySelectorAll('.name').forEach(name => {
  	name.innerHTML = settings.name.replaceAll(' ', '-');
  });
  document.querySelector('.export').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" class="copy"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path></svg>' + exportAnimation();
})

document.querySelector('.new').addEventListener('click', e => {
	document.querySelector('.prompt').innerHTML = '<div class="content-wrapper"> <div class="title"> <p>Are you sure?</p> </div> <a>This will delete the current animation.</a><div class="buttons"><div class="button second" onclick="document.querySelector(\'.prompt-wrapper\').classList.toggle(\'open\')">No</div><div class="button" onclick="deleteAnimation();document.querySelector(\'.prompt-wrapper\').classList.toggle(\'open\')">Yes</div></div></div>';
  
  document.querySelector('.prompt-wrapper').classList.add('open');
})

var settings = {
	name: 'Untitled Animation',
	delay: 0.25,
	replay: false
};

var down = false;
document.querySelector('.canvas').onmousedown = function(e) { down = true };
document.querySelector('.canvas').onmouseup = function(e) { down = false };
document.querySelector('.canvas').onmousemove = function(e) { if (down) { moveElem(e) } };
