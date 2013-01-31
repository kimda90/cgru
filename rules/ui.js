u_elements = ['asset','assets','content','info','open','log','navig','rules','playlist','status','cycle','comments','files',
	'content_status','thumbnail','sidepanel','sidepanel_playlist'];
u_el = {};

function u_Init()
{
	for( var i = 0; i < u_elements.length; i++)
		u_el[u_elements[i]] = document.getElementById( u_elements[i]);

	if( u_el.sidepanel )
	{
		if( localStorage.sidepanel_opened_width == null ) localStorage.sidepanel_opened_width = 200;
		if( localStorage.sidepanel_closed_width == null ) localStorage.sidepanel_closed_width = 20;
		if( localStorage.sidepanel_opened == 'true' ) u_SidePanelOpen();
		else u_SidePanelClose();
	}

	if( localStorage.header_opened == 'true' ) u_OpenCloseHeader();
	if( localStorage.footer_opened == 'true' ) u_OpenCloseFooter();
}
function u_OpenCloseHeader(){u_OpenCloseHeaderFooter(document.getElementById('headeropenbtn'),'header',-200,0);}
function u_OpenCloseFooter(){u_OpenCloseHeaderFooter(document.getElementById('footeropenbtn'),'footer',38,238);}

function u_Process()
{
	if( g_elCurFolder.m_dir.rufiles && ( g_elCurFolder.m_dir.rufiles.indexOf( RULES.thumbnail.filename ) != -1 ))
	{
		u_el.thumbnail.setAttribute('src', RULES.root+g_elCurFolder.m_path+'/'+RULES.rufolder+'/'+RULES.thumbnail.filename);
		u_el.thumbnail.style.display = 'inline';
	}
	else
	{
		u_el.thumbnail.setAttribute('src', null );
		u_el.thumbnail.style.display = 'none';
	}

	if( RULES.status && RULES.status.annotation )
		u_el.status.innerHTML = RULES.status.annotation;
	else
		u_el.status.innerHTML = '';
	
	u_StatusSetColor( RULES.status );

	u_el.rules.innerHTML = 'ASSET='+JSON.stringify( ASSET)+'<br><br>ASSETS='+JSON.stringify( ASSETS)+'<br><br>RULES='+JSON.stringify( RULES);
//	u_el.rules.innerHTML = 'ASSET='+JSON.stringify( ASSET)+'<br><br>RULES='+JSON.stringify( RULES);

	if( ASSET.path == g_elCurFolder.m_path )
		u_el.files.parentNode.style.display = 'none';
	else
		u_el.files.parentNode.style.display = 'block';

	cm_Process();
}
function u_StatusSetElLabel( i_el, i_status)
{
	if( i_status && i_status.annotation)
	{
		i_el.innerHTML = i_status.annotation.split(' ')[0];
	}
	else
		i_el.textContent = '';
}
function u_StatusSetColor( i_status, i_elB, i_elC)
{
	if( i_elB == null ) i_elB = u_el.content_status.parentNode;
	if( i_elC == null ) i_elC = i_elB;

	if( i_status &&  i_status.color)
	{
		var c = i_status.color;
		i_elB.style.background = 'rgb('+c[0]+','+c[1]+','+c[2]+')';
		if( c[0]+c[1]+c[2] > 200 )
			i_elC.style.color = '#000';
		else
			i_elC.style.color = '#FFF';
//window.console.log(c[0]+c[1]+c[2])
	}
	else
	{
		i_elB.style.background = '';
		i_elC.style.color = '#000';
	}
}

function u_FilesOnClick( i_el)
{
	if( u_el.files.m_opened ) return;
	u_el.files.m_opened = true;

	document.getElementById('files_btn').classList.remove('button');

	var files = g_elCurFolder.m_dir.files;
	for( var i = 0; i < files.length; i++)
	{
		var el = document.createElement('div');
		u_el.files.appendChild( el);

		var elLink = document.createElement('a');
		el.appendChild( elLink);
		elLink.textContent = files[i];
		elLink.href = RULES.root + g_elCurFolder.m_path + '/' + files[i];
		elLink.target = '_blank';
	}
}

function u_Finish()
{
	document.getElementById('files_btn').classList.add('button');
	u_el.files.m_opened = false;

	u_StatusCancelOnClick();
	u_el.status.textContent = '';
	u_el.files.textContent = '';
	u_StatusSetColor();

	cm_Finish();
}

function u_OpenCloseHeaderFooter( i_elBtn, i_id, i_closed, i_opened)
{
	if( i_elBtn.classList.contains('opened'))
	{
		i_elBtn.classList.remove('opened');
		if( i_id == 'header')
		{
			localStorage.header_opened = 'false';
			i_elBtn.innerHTML = '&darr;';
			document.getElementById( i_id).style.top = i_closed+'px';
		}
		else
		{
			localStorage.footer_opened = 'false';
			i_elBtn.innerHTML = '&uarr;';
			document.getElementById('footer').style.height = i_closed+'px';
			document.getElementById('log').style.display= 'none';
		}
	}
	else
	{
		i_elBtn.classList.add('opened');
		if( i_id == 'header')
		{
			localStorage.header_opened = 'true';
			i_elBtn.innerHTML = '&uarr;';
			document.getElementById( i_id).style.top = i_opened+'px';
		}
		else
		{
			localStorage.footer_opened = 'true';
			i_elBtn.innerHTML = '&darr;';
			document.getElementById('footer').style.height = i_opened+'px';
			document.getElementById('log').style.display= 'block';
		}
	}
}

function u_SidePanelHideOnClick() { u_SidePanelClose()}
function u_SidePanelClose()
{
	u_el['sidepanel'].classList.remove('opened');
	localStorage.sidepanel_opened = false;
	u_el.content.style.right = '0';
	u_el.sidepanel.style.width = localStorage.sidepanel_closed_width + 'px';
}
function u_SidePanelOpen()
{
	u_el['sidepanel'].classList.add('opened');
	localStorage.sidepanel_opened = true;
	u_el.content.style.right = localStorage.sidepanel_opened_width + 'px';
	u_el.sidepanel.style.width = localStorage.sidepanel_opened_width + 'px';
}

function u_RulesOnClick()
{
	if( u_el.rules.m_opened )
	{
		u_el.rules.m_opened = false;
		u_el.rules.style.display = 'none';
	}
	else
	{
		u_el.rules.m_opened = true;
		u_el.rules.style.display = 'block';
	}
}

function u_StatusEditOnClick()
{
	if( u_el.status.m_editing )
		return;

	u_el.status.m_status = {};
	u_el.status.m_status.annotation = '';
	u_el.status.m_status.color = null;
	if( RULES.status )
	{
		if( RULES.status.annotation ) u_el.status.m_status.annotation = RULES.status.annotation;
		if( RULES.status.color ) u_el.status.m_status.color = RULES.status.color;
	}
	RULES.status = {};
	RULES.status.annotation = u_el.status.m_status.annotation;
	RULES.status.color = u_el.status.m_status.color;

	u_el.content_status.classList.add('opened');
	u_el.status.innerHTML = u_el.status.m_status.annotation;
	u_el.status.classList.add('editing');
	u_el.status.m_editing = true;

	elColor = document.getElementById('status_color');
	elColor.style.display = 'block';
	u_DrawColorBars( elColor, u_StatusColorOnClick);

	u_el.status.contentEditable = 'true';
	u_el.status.focus();
}

function u_DrawColorBars( i_el, i_onclick, i_height)
{
	if( i_height == null )
		i_height = '20px';
	else
		i_height = Math.round( i_height/3 )+'px';
	i_el.classList.add('colorbars');
	var ccol = 35;
	var crow = 3;
	var cstep = 5;
	var cnum = crow * ccol;
	for( var cr = 0; cr < crow; cr++)
	{
		elRaw = document.createElement('div');
		i_el.appendChild( elRaw);
		for( var cc = 0; cc < ccol; cc++)
		{
			el = document.createElement('div');
			elRaw.appendChild( el);
			el.style.width = 100/ccol + '%';
			el.style.height = i_height;
			el.onclick = i_onclick;

			var r = 0, g = 0, b = 0;
			r = ( ( cc % cstep ) + 1 ) / ( cstep + 1 );

			if     (cc < cstep  ) { r = cc/(cstep-1); g = r; b = r; }
			else if(cc < cstep*2) { r = r; }
			else if(cc < cstep*3) { g = r; r = 0; }
			else if(cc < cstep*4) { b = r; r = 0; }
			else if(cc < cstep*5) { g = r; }
			else if(cc < cstep*6) { b = r; }
			else if(cc < cstep*7) { g = r; b = r; r = 0; }

			if( cr > 0 )
			{
				var avg = (r+g+b)/2.5;
				var sat = 2, add = .1;
				if( cr > 1 ) { sat = 1.2; add = .2};
				r += add+(avg-r)/sat;
				g += add+(avg-g)/sat;
				b += add+(avg-b)/sat;
			}

			r = Math.round( 255*r);
			g = Math.round( 255*g);
			b = Math.round( 255*b);
			if( r > 255 ) r = 255;
			if( g > 255 ) g = 255;
			if( b > 255 ) b = 255;

			if( cr && (cc < cstep))
				el.m_color = null;
			else
			{
				el.style.background = 'rgb('+r+','+g+','+b+')';
				el.m_color = [r,g,b];
			}
//window.console.log('rgb('+r+','+g+','+b+')');
		}
	}
}

function u_StatusColorOnClick( i_evt)
{
	var el = i_evt.currentTarget;
	u_el.status.m_status.color = el.m_color;
	u_StatusSetColor( u_el.status.m_status);
}

function u_StatusCancelOnClick()
{
	if( RULES.status )
		u_el.status.innerHTML = RULES.status.annotation;
	u_StatusSetColor( RULES.status);
	u_el.status.classList.remove('editing');
	u_el.content_status.classList.remove('opened');
	u_el.status.m_editing = false;
	u_el.status.contentEditable = 'false';
	document.getElementById('status_color').innerHTML = '';
	document.getElementById('status_color').style.display  = 'none';
}

function u_StatusSaveOnClick()
{
	var text = u_el.status.innerHTML;
	var color = u_el.status.m_status.color;

	RULES.status = {};
	RULES.status.annotation = text;
	RULES.status.color = color;

	u_StatusCancelOnClick();

	g_FolderSetStatus( RULES.status);

	var obj = {};
	obj.object = {"status":RULES.status};
	obj.add = true;
	obj.file = RULES.root + g_elCurFolder.m_path + '/' + RULES.rufolder + '/status.json';
	n_Request({"editobj":obj});
}

