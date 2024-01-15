async function embedChatbot() {
  const chatBtnId = 'fastgpt-chatbot-button';
  const chatWindowId = 'fastgpt-chatbot-window';
  const script = document.getElementById('fastgpt-iframe');
  const botSrc = script?.getAttribute('data-src');
  const primaryColor = script?.getAttribute('data-color') || '#4e83fd';
  const defaultOpen = script?.getAttribute('data-default-open') === 'true';
  
  if (!botSrc) {
    console.error(`Can't find appid`);
    return;
  }
  if (document.getElementById(chatBtnId)) {
    return;
  }

  // const MessageIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1690532785664" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4132" xmlns:xlink="http://www.w3.org/1999/xlink" ><path d="M512 32C247.04 32 32 224 32 464A410.24 410.24 0 0 0 172.48 768L160 965.12a25.28 25.28 0 0 0 39.04 22.4l168-112A528.64 528.64 0 0 0 512 896c264.96 0 480-192 480-432S776.96 32 512 32z m244.8 416l-361.6 301.76a12.48 12.48 0 0 1-19.84-12.48l59.2-233.92h-160a12.48 12.48 0 0 1-7.36-23.36l361.6-301.76a12.48 12.48 0 0 1 19.84 12.48l-59.2 233.92h160a12.48 12.48 0 0 1 8 22.08z" fill=${primaryColor} p-id="4133"></path></svg>`;

  const MessageIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1705158556621" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21841"  xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 170.688a322.368 322.368 0 0 1 322.368 322.368c0 236.48-195.328 436.16-631.68 436.16 94.4-187.136-13.056-198.336-13.056-436.16A322.368 322.368 0 0 1 512 170.688z m151.68 350.784H360.32a151.68 151.68 0 1 0 303.36 0zM512 94.784c196.736 0 360.192 149.504 392.448 346.048a113.728 113.728 0 0 1-32.128 222.848V460.992c-23.68-186.24-176-329.92-360.32-329.92S175.36 274.752 151.68 461.056v202.624a113.792 113.792 0 0 1-32.064-222.912C151.808 244.288 315.2 94.72 512 94.72zM379.264 360.32a37.952 37.952 0 1 0 0 75.84 37.952 37.952 0 0 0 0-75.84z m265.472 0a37.952 37.952 0 1 0 0 75.84 37.952 37.952 0 0 0 0-75.84z" p-id="21842" fill=${primaryColor}></path></svg>`;


  const CloseIcon = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1690535441526" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6367" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM305.956571 370.395429L447.488 512 305.956571 653.604571a45.568 45.568 0 1 0 64.438858 64.438858L512 576.512l141.604571 141.531429a45.568 45.568 0 0 0 64.438858-64.438858L576.512 512l141.531429-141.604571a45.568 45.568 0 1 0-64.438858-64.438858L512 447.488 370.395429 305.956571a45.568 45.568 0 0 0-64.438858 64.438858z" fill=${primaryColor} p-id="6368"></path></svg>`;

  const ChatBtn = document.createElement('div');
  ChatBtn.id = chatBtnId;
  // ChatBtn.style.cssText =
  //   'position: fixed; bottom: 1rem; right: 1rem; width: 40px; height: 40px; cursor: pointer; z-index: 2147483647; transition: 0;';
  const defaultChatBtnStyle = 'position: fixed; bottom: 108px; right: 46px; width: 50px; height: 50px; cursor: pointer; z-index: 2147483647; transition: 0;';
  ChatBtn.style.cssText =defaultChatBtnStyle;

  const ChatBtnDiv = document.createElement('div');
  ChatBtnDiv.innerHTML = MessageIcon;

  const parentIframe = document.createElement("div");
  parentIframe.style.cssText = 'position: absolute; width: 100vw; height: 100vh; top: 0; left: 0; display:flex;align-items:center;justify-content:center';
  parentIframe.style.visibility = defaultOpen ? 'unset' : 'hidden';
  parentIframe.id = chatWindowId;

  const iframe = document.createElement('iframe');
  iframe.allow = 'fullscreen;microphone';
  iframe.title = 'FastGPT Chat Window';
  // iframe.id = chatWindowId;
  iframe.src = botSrc;
  iframe.style.cssText =
    'border: none; position: fixed; flex-direction: column; justify-content: space-between; box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; width: 56rem; height: 40rem; max-width: 90vw; max-height: 85vh; border-radius: 0.75rem; display: flex; z-index: 2147483647; overflow: hidden; left: unset; background-color: #F3F4F6;';
  // iframe.style.visibility = defaultOpen ? 'unset' : 'hidden';
  console.debug('iframe> iframe:%o', iframe);

  // document.body.appendChild(iframe);
  parentIframe.appendChild(iframe);
  document.body.appendChild(parentIframe);

  let chatBtnDragged = false;
  let chatBtnDown = false;
  let chatBtnMouseX;
  let chatBtnMouseY;

  ChatBtn.addEventListener('click', function () {
    if (chatBtnDragged) {
      chatBtnDragged = false;
      return;
    }
    const chatWindow = document.getElementById(chatWindowId);
    if (!chatWindow) return;
    const visibilityVal = chatWindow.style.visibility;
    console.debug('iframe> visibilityVal:%o', visibilityVal);
    if (visibilityVal === 'hidden') {
      chatWindow.style.visibility = 'unset';
      console.debug('iframe> 0 parentIframe:%o', parentIframe);
      ChatBtnDiv.innerHTML = CloseIcon;
    } else {
      chatWindow.style.visibility = 'hidden';
      console.debug('iframe> 1 parentIframe:%o', parentIframe);
      ChatBtnDiv.innerHTML = MessageIcon;
    }
  });

  ChatBtn.addEventListener('mousedown', (e) => {
    if (!chatBtnMouseX && !chatBtnMouseY) {
      chatBtnMouseX = e.clientX;
      chatBtnMouseY = e.clientY;
    }

    chatBtnDown = true;
  });
  ChatBtn.addEventListener('mousemove', (e) => {
    if (!chatBtnDown) return;
    chatBtnDragged = true;
    const transformX = e.clientX - chatBtnMouseX;
    const transformY = e.clientY - chatBtnMouseY;

    ChatBtn.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;

    e.stopPropagation();
  });
  ChatBtn.addEventListener('mouseup', (e) => {
    chatBtnDown = false;
  });
  ChatBtn.addEventListener('mouseleave', (e) => {
    chatBtnDown = false;
  });

  ChatBtn.appendChild(ChatBtnDiv);
  document.body.appendChild(ChatBtn);
}
document.body.onload = embedChatbot;
